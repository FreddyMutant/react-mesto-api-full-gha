import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import Login from "./Login";
import Register from "./Register";
import * as Auth from "../utils/auth.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [infoTooltipType, setInfoTooltipType] = useState("error");
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [editProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [newPlacePopupOpen, setNewPlacePopupOpen] = React.useState(false);
  const [updateAvatarPopupOpen, setUpdateAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [deletePlacePopupOpen, setDeletePlacePopupOpen] =
    React.useState(false);
  const [deleteCard, setDeleteCard] = React.useState({ _id: "" });
  const [isLoading, setIsLoading] = React.useState(false);

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setNewPlacePopupOpen(false);
    setUpdateAvatarPopupOpen(false);
    setSelectedCard({ name: "", link: "" });
    setDeletePlacePopupOpen(false);
    setDeleteCard({ _id: "" });
    setInfoTooltipOpen(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(evt) {
    evt.preventDefault();
    setIsLoading(true);
    api.removeCard(deleteCard._id)
      .then(() => {
        setCards((state) => state.filter((currentCard) => currentCard._id !== deleteCard._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(inputValues) {
    setIsLoading(true);
    api.setUserData(inputValues.name, inputValues.about)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.setUserAvatar(avatar.avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  function handleAddPlaceSubmit(inputValues) {
    setIsLoading(true);
    api.addNewCard(inputValues.name, inputValues.link)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function registration(registerData) {
    Auth.register(registerData)
      .then(() => {
        setInfoTooltipType("reg_success");
        setInfoTooltipOpen(true);
        navigate('/sign-in');
      })
      .catch((err) => {
        handleInfoTooltipPopupOpen();
        setInfoTooltipType("error");
        console.log(err)
      })
      .finally(() => {
        handleInfoTooltipPopupOpen();
      });
  }

  function authorization(loginData) {
    Auth.authorize(loginData)
      .then((res) => {
        setLoggedIn(true);
        localStorage.setItem("jwt", res.token);
        setEmail(loginData.email);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        handleInfoTooltipPopupOpen();
        setInfoTooltipType("error");
        console.log(err);
      })
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleNewPlaceClick() {
    setNewPlacePopupOpen(true);
  }

  function handleUpdateAvatarClick() {
    setUpdateAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeletePlaceClick(card) {
    setDeletePlacePopupOpen(true);
    setDeleteCard(card);
  }

  function handleInfoTooltipPopupOpen() {
    setInfoTooltipOpen(true);
  }

  useEffect(() => {
    loggedIn ? navigate("/") : navigate("/sign-in")
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck();
    if (loggedIn) getContent();
  }, [loggedIn]);
  
  const tokenCheck = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      Auth.tokenCheck(token)
        .then((res) => {
          if (res) {
            setEmail(res.email);
            setLoggedIn(true);
          }
        })
        .catch(console.error);
    }
  }

  const getContent = () => {
    setIsLoadingAllData(true);
    api.getAllData()
      .then((data) => {
        const [userData, cardsData] = data;
        setCards(cardsData.reverse());
        setCurrentUser(userData);
      })
      .catch(error => console.log(error))
      .finally(() => {
        setIsLoadingAllData(false);
      })
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setEmail("");
    setCurrentUser({});
    setCards([]);
    navigate('/sign-up');
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page_wrapper">

        <Header
          loggedIn={loggedIn}
          email={email}
          signOut={signOut} />
        <Routes >
          <Route
            path="/"
            element={
              <ProtectedRoute
                isLoggedIn={loggedIn}
                checkToken={tokenCheck}
                element={Main}
                onEditProfile={handleEditProfileClick}
                onNewPlace={handleNewPlaceClick}
                onUpdateAvatar={handleUpdateAvatarClick}
                onCardClick={handleCardClick}
                onDeleteCard={handleDeletePlaceClick}
                cards={cards}
                onCardLike={handleCardLike}
                isLoadingAllData={isLoadingAllData}
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                registration={registration}
              />
            }
          />
          <Route path="/sign-in"
            element={
              <Login authorization={authorization}
              />
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        <Footer />

        <EditProfilePopup
          popupOpen={editProfilePopupOpen}
          isLoadingAllData={isLoadingAllData}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
          loadingText="Сохранение..."
        />

        <AddPlacePopup
          popupOpen={newPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
          loadingText="Добавление..."
        >
        </AddPlacePopup>

        <EditAvatarPopup
          popupOpen={updateAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
          loadingText="Сохранение..."
        >
        </EditAvatarPopup>

        <PopupWithForm
          popupType="delete-place"
          popupTitle="Вы уверены?"
          submitButtonText="Да"
          popupOpen={deletePlacePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          isLoading={isLoading}
          loadingText="Удаление..."
        />

        <ImagePopup
          popupOpen={updateAvatarPopupOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          popupOpen={infoTooltipOpen}
          onClose={closeAllPopups}
          type={infoTooltipType}
        />

      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;
