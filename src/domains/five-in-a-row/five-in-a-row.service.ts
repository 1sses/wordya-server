import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CheckWordDto } from './dto/check-word.dto';
import { FiveInARow, FiveInARowStatus } from '@prisma/client';
import { ParaphraserAPI } from '../../lib/api/paraphraser';
import { answers } from '../../lib/answers';

@Injectable()
export class FiveInARowService {
  constructor(private prisma: PrismaService) {}

  private paraphraserApi = new ParaphraserAPI();

  private match(enteredWord, originalWord) {
    const matches: string[] = [];
    for (const letter of enteredWord) {
      const includesLetter = originalWord.includes(letter);
      if (
        includesLetter &&
        enteredWord.indexOf(letter) === originalWord.indexOf(letter)
      )
        matches.push('full');
      else if (includesLetter) matches.push('letter');
      else matches.push('no');
    }
    return matches;
  }

  async start(userId: number) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: { profile: { userId } },
      orderBy: { createdAt: 'desc' },
    });
    if (lastGame?.status === FiveInARowStatus.IN_PROGRESS) {
      const matches = lastGame.attempts.map((word) =>
        this.match(word, lastGame.word),
      );
      return {
        game: lastGame,
        matches,
      };
    }

    const word = this.paraphraserApi.getRandomWord();
    const newGame = await this.prisma.fiveInARow.create({
      data: {
        profile: { connect: { userId } },
        word,
      },
    });
    return {
      game: newGame,
      matches: [],
    };
  }

  async checkWord(userId: number, { word }: CheckWordDto) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: { profile: { userId } },
      orderBy: { createdAt: 'desc' },
    });
    if (!lastGame) throw new Error(answers.error.fiveInARow.notFound);
    const { response } = await this.paraphraserApi.checkWord(word);
    for (const key in response) {
      if (
        response[key].original === response[key].lemma &&
        response[key].vector.length > 0
      )
        break;
      if (!response[+key + 1]) {
        return {
          valid: false,
          matches: [],
          game: lastGame,
        };
      }
    }
    const matches = this.match(word, lastGame.word);
    const updatedGame = await this.prisma.fiveInARow.update({
      where: { id: lastGame.id },
      data: { attempts: { push: word } },
    });
    return {
      valid: true,
      matches,
      game: updatedGame,
    };
  }

  async end(userId: number) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: { profile: { userId } },
      orderBy: { createdAt: 'desc' },
    });
    if (!lastGame) throw new Error(answers.error.fiveInARow.notFound);
    const status = lastGame.attempts.includes(lastGame.word)
      ? FiveInARowStatus.WIN
      : FiveInARowStatus.LOSE;
    return this.prisma.fiveInARow.update({
      where: { id: lastGame.id },
      data: { status },
    });
  }

  async statistics(userId: number) {
    const games = await this.prisma.fiveInARow.findMany({
      where: { profile: { userId } },
      orderBy: { createdAt: 'desc' },
    });
    const played = games.length;
    const wins = games.filter(
      (game) => game.status === FiveInARowStatus.WIN,
    ).length;
    const averageAttempts = games.reduce(
      (acc, game) => acc + game.attempts.length,
      0,
    );
    // количество побед подряд (максимум и сейчас)
    // количество побед по попыткам
    return {
      played,
      wins,
      averageAttempts,
    };
  }
}
