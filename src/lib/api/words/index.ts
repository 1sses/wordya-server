import words from '../../words/5.json';

// http://russkiyslovar.ru/iz-5-bukv

export class WordsAPI {
  public checkWord(word: string) {
    const match = words.find((w) => w.word === word);
    return !!match;
  }

  public getRandomWord({ difficulty }: { difficulty: number }) {
    const searchingWords = words.filter((w) => w.difficulty === difficulty);
    const randomKey = Math.floor(Math.random() * searchingWords.length);
    return searchingWords[randomKey];
  }
}
