import { apiSettings } from "./utils";

class Api {
  constructor(options) {
    this._headers = options.headers;
    this._serverURL = options.serverURL;
    this._handlePromiseReturn = (res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    };
  }

  getUserMe() {
    return fetch(`${this._serverURL}/users/me`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
    }).then((res) => this._handlePromiseReturn(res));
  }

  setUserData(userName, userAbout) {
    return fetch(`${this._serverURL}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
      body: JSON.stringify({
        name: userName,
        about: userAbout,
      }),
    }).then((res) => this._handlePromiseReturn(res));
  }

  setUserAvatar(avatar) {
    return fetch(`${this._serverURL}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => this._handlePromiseReturn(res));
  }

  getCards() {
    return fetch(`${this._serverURL}/cards`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
    }).then((res) => this._handlePromiseReturn(res));
  }

  addNewCard(cardName, cardLink) {
    return fetch(`${this._serverURL}/cards`, {
      method: "POST",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
      body: JSON.stringify({
        name: cardName,
        link: cardLink,
      }),
    }).then((res) => this._handlePromiseReturn(res));
  }

  changeLikeCardStatus(cardID, cardLiked) {
    return fetch(`${this._serverURL}/cards/${cardID}/likes`, {
      method: cardLiked ? "DELETE" : "PUT",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
    }).then((res) => this._handlePromiseReturn(res));
  }

  removeCard(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}`, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
        ...this._headers,
      },
    });
  }

  getAllData() {
    return Promise.all([this.getUserMe(), this.getCards()]);
  }
}

export const api = new Api(apiSettings);
