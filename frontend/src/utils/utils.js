// Объект настроек для работы с API

export const apiSettings = {
  serverURL: "https://api.freddymutant.nomoredomainsicu.ru",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const SERVER_ERRORS = {
  400: "Одно из полей не заполнено или не прошло валидацию.",
  401: "Введен неверный email или пароль.",
  409: "Пользователь с введенным email уже зарегистрирован.",
};
