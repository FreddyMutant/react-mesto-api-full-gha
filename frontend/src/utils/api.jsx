export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
  // получить карточки
  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((response) => this._checkRequestResult(response));
  }

  // добавление карочки на сервер
  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: `${data.name}`,
        link: `${data.link}`,
      }),
    }).then((response) => this._checkRequestResult(response));
  }
  // Удаление карты
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((response) => this._checkRequestResult(response));
  }

  // поставить лайк
  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`,
      {
        method: "PUT",
        headers: this._headers,
      }
    ).then((response) => this._checkRequestResult(response));
  }
  // Убрать лайк с карты
  unlikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`,
      {
        method: "DELETE",
        headers: this._headers,
      }
    ).then((response) => this._checkRequestResult(response));
  }

  // Получить данные пользователя
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((response) => this._checkRequestResult(response));
  }

  // Редактировать данные пользователя
  editUserInfo(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: `${name}`,
        about: `${about}`,
      }),
    }).then((response) => this._checkRequestResult(response));
  }
  // Редактировать аватар
  editAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`,
      {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
          avatar: `${link}`,
        }),
      }
    ).then((response) => this._checkRequestResult(response));
  }

  _checkRequestResult(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-66",
  headers: {
    authorization: "df9c63fb-264b-40f7-b222-01ba224014cd",
    "Content-Type": "application/json",
  },
});

export { api };
