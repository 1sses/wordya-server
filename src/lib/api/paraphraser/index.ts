import axios from 'axios';

// http://russkiyslovar.ru/iz-5-bukv

export class ParaphraserAPI {
  private readonly token: string;
  constructor() {
    this.token = process.env.PARAPHRASER_TOKEN;
  }

  public async checkWord(word: string) {
    const response = await axios.get('http://www.paraphraser.ru/api', {
      params: {
        c: 'vector',
        query: word,
        top: 3,
        lang: 'ru',
        format: 'json',
        token: this.token,
        forms: 0,
        scores: 0,
      },
    });
    return response.data;
  }

  public getRandomWord() {
    const randomKey = Math.floor(Math.random() * words.length);
    return words[randomKey];
  }

  public async test() {
    for (const word of words) {
      const response = await axios.get('http://www.paraphraser.ru/api', {
        params: {
          c: 'vector',
          query: word,
          top: 3,
          lang: 'ru',
          format: 'json',
          token: this.token,
          forms: 0,
          scores: 0,
        },
      });
      for (const key in response.data.response) {
        if (
          response.data.response[key].original ===
            response.data.response[key].lemma &&
          response.data.response[key].vector.length > 0
        ) {
          console.log('Match for word: ', word);
          break;
        }
        if (!response.data.response[+key + 1]) {
          console.log('No match for word: ', word, response.data.response);
        }
      }
    }
  }
}
