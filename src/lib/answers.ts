export const answers = {
  success: {
    user: {
      created: 'Вы успешно зарегистрированы!',
      login: 'Вы успешно вошли в аккаунт!',
      logout: 'Вы вышли из аккаунта!',
      getOne: 'Пользователь получен!',
      getAll: 'Пользователи получены!',
    },
  },
  error: {
    user: {
      notFound: 'Пользователь не найден!',
      alreadyExists: 'Пользователь уже существует!',
      badCredentials: 'Неверный логин или пароль!',
      invalidToken: 'Требуется авторизация!',
    },
    fiveInARow: {
      notFound: 'Игра не найдена!',
      unableToCheck: 'Невозможно проверить слово для игры!',
      unableToEnd: 'Невозможно закончить игру!',
    },
    unknown: 'Произошла ошибка!',
  },
};

export type answerType = {
  ok: boolean;
  statusCode: number;
  message: string | Array<string>;
  error?: {
    timestamp: string;
    path: string;
  };
  data?: any;
};
