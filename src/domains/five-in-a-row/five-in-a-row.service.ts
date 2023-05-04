import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CheckWordDto } from './dto/check-word.dto';
import { FiveInARowStatus } from '@prisma/client';
import { answers } from '../../lib/answers';
import { WordsAPI } from '../../lib/api/words';
import { StartDto } from './dto/start.dto';
import { EndDto } from './dto/end.dto';
import { fiveInARowAchievements } from '../achievements/lists/five-in-a-row.achievements';

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

  private async resolveAchievements(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        fiveInARows: {
          where: {
            profile: { userId },
            status: { not: FiveInARowStatus.IN_PROGRESS },
          },
          orderBy: { createdAt: 'desc' },
        },
        achievements: true,
      },
    });
    const newAchievements = [];
    for (const achievement of fiveInARowAchievements) {
      const findResult = profile.achievements.find(
        (item) => item.name === achievement.name,
      );
      if (findResult) continue;
      const resolveResult = achievement.resolve(profile.fiveInARows);
      if (!resolveResult) continue;
      newAchievements.push({ name: achievement.name });
    }
    return newAchievements;
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
    const newAchievements = await this.resolveAchievements(userId);
    if (newAchievements) {
      const data = newAchievements.map((data) => ({
        ...data,
        profile: { connect: { userId } },
      }));
      await Promise.all(
        data.map((data) => {
          return this.prisma.achievement.create({ data });
        }),
      );
    }
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
    const statistics = [];
    // group by difficulty
    for (const difficulty of [1, 2, 3, 4, 5]) {
      const difficultyGames = games.filter(
        (game) => game.difficulty === difficulty,
      );
      const winGames = difficultyGames.filter(
        (game) => game.status === FiveInARowStatus.WIN,
      );
      const played = difficultyGames.length;
      const wins = winGames.length;
      const averageAttempts =
        winGames.reduce((acc, game) => acc + game.attempts.length, 0) /
        winGames.length;
      let maximumWins = 0;
      let curWins = 0;
      for (const game of difficultyGames) {
        if (game.status === FiveInARowStatus.WIN) {
          curWins++;
          if (curWins > maximumWins) maximumWins = curWins;
        } else {
          curWins = 0;
        }
      }
      let currentWins = 0;
      for (const game of difficultyGames) {
        if (game.status === FiveInARowStatus.WIN) currentWins++;
        else break;
      }
      const gamesByAttempts: { [key: number]: number } = {};
      for (const game of winGames) {
        const attempts = game.attempts.length;
        if (gamesByAttempts[attempts]) gamesByAttempts[attempts]++;
        else gamesByAttempts[attempts] = 1;
      }
      statistics.push({
        difficulty,
        played,
        wins,
        averageAttempts,
        maximumWins,
        currentWins,
        gamesByAttempts,
      });
    }
    return { statistics };
  }
}
