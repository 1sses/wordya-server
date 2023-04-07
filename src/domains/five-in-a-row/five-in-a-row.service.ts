import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CheckWordDto } from './dto/check-word.dto';
import { FiveInARowStatus } from '@prisma/client';
import { answers } from '../../lib/answers';
import { WordsAPI } from '../../lib/api/words';
import { StartDto } from './dto/start.dto';
import { StatisticsDto } from './dto/statistics.dto';
import { EndDto } from './dto/end.dto';

@Injectable()
export class FiveInARowService {
  constructor(private prisma: PrismaService) {}

  private wordsApi = new WordsAPI();

  private match(enteredWord, originalWord) {
    const matches: string[] = [];
    for (let i = 0; i < enteredWord.length; i++) {
      const includesLetter = originalWord.includes(enteredWord[i]);
      if (includesLetter && enteredWord[i] === originalWord[i])
        matches.push('full');
      else if (includesLetter) matches.push('letter');
      else matches.push('no');
    }
    return matches;
  }

  async start(userId: number, { difficulty }: StartDto) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: {
        profile: { userId },
        difficulty,
        status: FiveInARowStatus.IN_PROGRESS,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (lastGame) {
      const matches = lastGame.attempts.map((word) =>
        this.match(word, lastGame.word),
      );
      return { matches, attempts: lastGame.attempts };
    }

    const { word } = this.wordsApi.getRandomWord({ difficulty });
    await this.prisma.fiveInARow.create({
      data: {
        profile: { connect: { userId } },
        word,
        difficulty,
      },
    });
    return { matches: [], attempts: [] };
  }

  async checkWord(userId: number, { word, difficulty }: CheckWordDto) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: {
        profile: { userId },
        difficulty,
        status: FiveInARowStatus.IN_PROGRESS,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!lastGame) throw new Error(answers.error.fiveInARow.notFound);
    if (lastGame.attempts.length >= 6)
      throw new Error(answers.error.fiveInARow.unableToCheck);
    const valid = this.wordsApi.checkWord(word);
    if (!valid) {
      return {
        valid,
        matches: [],
      };
    }
    const matches = this.match(word, lastGame.word);
    await this.prisma.fiveInARow.update({
      where: { id: lastGame.id },
      data: { attempts: { push: word } },
    });
    return {
      valid,
      matches,
    };
  }

  async end(userId: number, { difficulty }: EndDto) {
    const lastGame = await this.prisma.fiveInARow.findFirst({
      where: {
        profile: { userId },
        difficulty,
        status: FiveInARowStatus.IN_PROGRESS,
      },
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

  async statistics(userId: number, { difficulty }: StatisticsDto) {
    const games = await this.prisma.fiveInARow.findMany({
      where: {
        profile: { userId },
        difficulty,
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
}
