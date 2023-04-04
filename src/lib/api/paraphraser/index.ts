import axios from 'axios';

const words = [
  'атлет',
  'бухта',
  'герой',
  'дрель',
  'жердь',
  'знамя',
  'исход',
  'кукла',
  'место',
  'нюанс',
  'облик',
  'ранец',
  'сцена',
  'упрек',
  'ферзь',
  'хлыст',
  'честь',
  'щипцы',
  'эклер',
  'юрист',
  'ягода',
]; // temp, remove later

export class ParaphraserAPI {
  private token: string;
  constructor() {
    this.token = process.env.PARAPHRASER_TOKEN;
  }

  public async checkWord(word: string) {
    // http://www.paraphraser.ru/api?c=vector&query=%D0%BA%D1%80%D1%8B%D1%88%D0%B8&top=3&lang=ru&format=json&token=TOKEN&forms=0&scores=0
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
}
