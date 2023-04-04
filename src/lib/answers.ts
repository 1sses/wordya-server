export const answers = {
  success: {
    user: {
      created: 'Пользователь зарегистрирован!',
      login: 'Вы вошли в аккаунт!',
      logout: 'Вы вышли из аккаунта!',
      getOne: 'Пользователь получен!',
      getAll: 'Пользователи получены!',
      updateWatching: 'Список обновлен!',
    },
    item: {
      created: 'Элемент создан!',
      getAll: 'Все элементы получены!',
      getByType: 'Элементы по категории получены!',
      getOne: 'Элемент получен!',
      updated: 'Элемент обновлен!',
      deleted: 'Элемент удален!',
      loaded: 'Элементы загружены!',
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
