import { FiveInARow, FiveInARowStatus } from '@prisma/client';

export const fiveInARowAchievements = [
  // LEVEL
  {
    name: 'five-in-a-row/complete/level-1',
    resolve(games: FiveInARow[]) {
      const level1WinGames = games.filter(
        (game) => game.difficulty === 1 && game.status === FiveInARowStatus.WIN,
      );
      return level1WinGames.length >= 25;
    },
  },
  {
    name: 'five-in-a-row/complete/level-2',
    resolve(games: FiveInARow[]) {
      const level2WinGames = games.filter(
        (game) => game.difficulty === 2 && game.status === FiveInARowStatus.WIN,
      );
      return level2WinGames.length >= 25;
    },
  },
  {
    name: 'five-in-a-row/complete/level-3',
    resolve(games: FiveInARow[]) {
      const level3WinGames = games.filter(
        (game) => game.difficulty === 3 && game.status === FiveInARowStatus.WIN,
      );
      return level3WinGames.length >= 25;
    },
  },
  {
    name: 'five-in-a-row/complete/level-4',
    resolve(games: FiveInARow[]) {
      const level4WinGames = games.filter(
        (game) => game.difficulty === 4 && game.status === FiveInARowStatus.WIN,
      );
      return level4WinGames.length >= 25;
    },
  },
  {
    name: 'five-in-a-row/complete/level-5',
    resolve(games: FiveInARow[]) {
      const level5WinGames = games.filter(
        (game) => game.difficulty === 5 && game.status === FiveInARowStatus.WIN,
      );
      return level5WinGames.length >= 25;
    },
  },
  // WIN STREAK
  {
    name: 'five-in-a-row/win-streak/5',
    resolve(games: FiveInARow[]) {
      let maximumWins = 0;
      let curWins = 0;
      for (const game of games) {
        if (game.status === FiveInARowStatus.WIN) {
          curWins++;
          if (curWins > maximumWins) maximumWins = curWins;
        } else {
          curWins = 0;
        }
      }
      return maximumWins >= 5;
    },
  },
  {
    name: 'five-in-a-row/win-streak/10',
    resolve(games: FiveInARow[]) {
      let maximumWins = 0;
      let curWins = 0;
      for (const game of games) {
        if (game.status === FiveInARowStatus.WIN) {
          curWins++;
          if (curWins > maximumWins) maximumWins = curWins;
        } else {
          curWins = 0;
        }
      }
      return maximumWins >= 10;
    },
  },
  {
    name: 'five-in-a-row/win-streak/20',
    resolve(games: FiveInARow[]) {
      let maximumWins = 0;
      let curWins = 0;
      for (const game of games) {
        if (game.status === FiveInARowStatus.WIN) {
          curWins++;
          if (curWins > maximumWins) maximumWins = curWins;
        } else {
          curWins = 0;
        }
      }
      return maximumWins >= 20;
    },
  },
  {
    name: 'five-in-a-row/win-streak/50',
    resolve(games: FiveInARow[]) {
      let maximumWins = 0;
      let curWins = 0;
      for (const game of games) {
        if (game.status === FiveInARowStatus.WIN) {
          curWins++;
          if (curWins > maximumWins) maximumWins = curWins;
        } else {
          curWins = 0;
        }
      }
      return maximumWins >= 50;
    },
  },
];
