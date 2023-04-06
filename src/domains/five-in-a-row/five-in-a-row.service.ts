import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CheckWordDto } from './dto/check-word.dto';
import { FiveInARowStatus } from '@prisma/client';
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
    // rewrite?
    if (lastGame?.status === FiveInARowStatus.IN_PROGRESS) {
      const matches = lastGame.attempts.map((word) =>
        this.match(word, lastGame.word),
      );
      return { matches, attempts: lastGame.attempts };
    }

    const word = this.paraphraserApi.getRandomWord();
    await this.prisma.fiveInARow.create({
      data: {
        profile: { connect: { userId } },
        word,
      },
    });
    return { matches: [], attempts: [] };
  }

  async checkWord(userId: number, { word }: CheckWordDto) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: { profile: { userId } },
      orderBy: { createdAt: 'desc' },
    });
    if (!lastGame) throw new Error(answers.error.fiveInARow.notFound);
    const { response } = await this.paraphraserApi.checkWord(word);
    console.log(response);
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
        };
      }
    }
    const matches = this.match(word, lastGame.word);
    await this.prisma.fiveInARow.update({
      where: { id: lastGame.id },
      data: { attempts: { push: word } },
    });
    return {
      valid: true,
      matches,
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
    await this.prisma.fiveInARow.update({
      where: { id: lastGame.id },
      data: { status },
    });
    return { status, word: lastGame.word };
  }

  async statistics(userId: number) {
    const games = await this.prisma.fiveInARow.findMany({
      where: {
        profile: { userId },
        status: { not: FiveInARowStatus.IN_PROGRESS },
      },
      orderBy: { createdAt: 'desc' },
    });
    const winGames = games.filter(
      (game) => game.status === FiveInARowStatus.WIN,
    );
    const played = games.length;
    const wins = winGames.length;
    const averageAttempts =
      winGames.reduce((acc, game) => acc + game.attempts.length, 0) /
      winGames.length;
    let maximumWins = 0;
    let curWins = 0;
    for (const game of games) {
      if (game.status === FiveInARowStatus.WIN) {
        maximumWins++;
        if (curWins > maximumWins) maximumWins = curWins;
      } else {
        curWins = 0;
      }
    }
    let currentWins = 0;
    for (const game of games) {
      if (game.status === FiveInARowStatus.WIN) currentWins++;
      else break;
    }
    const gamesByAttempts: { [key: number]: number } = {};
    for (const game of winGames) {
      const attempts = game.attempts.length;
      if (gamesByAttempts[attempts]) gamesByAttempts[attempts]++;
      else gamesByAttempts[attempts] = 1;
    }
    return {
      played,
      wins,
      averageAttempts,
      maximumWins,
      currentWins,
      gamesByAttempts,
    };
  }

  async test() {
    return await this.paraphraserApi.test();
  }
}
