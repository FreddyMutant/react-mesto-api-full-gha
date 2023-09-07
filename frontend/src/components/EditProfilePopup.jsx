import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

const EditProfilePopup = (props) => {

    const currentUser = React.useContext(CurrentUserContext);
    const { name, about } = currentUser;
    const [userData, setUserData] = React.useState({ name: '', about: '' });
    const [formInputsValid, setFormInputsValid] = React.useState({ name: true, about: true });
    const [formValidationMessages, setFormValidationMessages] = React.useState({ name: "", about: "" });
    const [formValid, setFormValid] = React.useState(true);

    const handleInputValid = (evt) => {
        evt.preventDefault();
        const { name } = evt.target;

        if (!evt.target.validity.valid) {

            setFormInputsValid({
                ...formInputsValid,
                [name]: false
            });

            setFormValidationMessages({
                ...formValidationMessages,
                [name]: evt.target.validationMessage
            });

        } else {
            setFormInputsValid({
                ...formInputsValid,
                [name]: true
            });

            setFormValidationMessages({
                ...formValidationMessages,
                [name]: ""
            });
        }
    }

    React.useEffect(() => {
        setUserData({ "name": name, "about": about });
    }, [name, about, props.popupOpen]);

    React.useEffect(() => {
        const formInputsValidValues = Object.values(formInputsValid);
        const isFormValid = formInputsValidValues.includes(false) ? false : true;
        setFormValid(isFormValid);
    }, [formInputsValid, props.popupOpen]);

    function handleUserDataChange(evt) {
        const { name, value } = evt.target;
        setUserData({
            ...userData,
            [name]: value
        })
        handleInputValid(evt);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onUpdateUser(userData);
        setFormValidationMessages({ name: "", about: "" });
        setFormValid(true);
    }

    function handleOnClose() {
        props.onClose();
        setUserData({ "name": currentUser.name, "about": currentUser.about });
        setFormInputsValid({ name: true, about: true });
        setFormValidationMessages({ name: "", about: "" });
        setFormValid(true);
    }

    return (
        <PopupWithForm
            popupOpen={props.popupOpen}
            popupType="edit_profile"
            popupTitle="Редактировать профиль"s
            popupFormName="profileForm"
            submitButtonText="Сохранить"
            onClose={handleOnClose}
            onSubmit={handleSubmit}
            isLoading={props.isLoading}
            loadingText={props.loadingText}
            onOverlayClose={props.onOverlayClose}
            isValid={formValid}
        >
            <label className="popup__input-group" htmlFor="name">
                <input
                    className="popup__input popup__input_type_name"
                    type="text"
                    placeholder="Ваше имя"
                    name="name"
                    id="name"
                    required
                    minLength={2}
                    maxLength={40}
                    value={userData.name ? userData.name : ""}
                    onChange={handleUserDataChange}
                />
                <span
                    className={["popup__error", formValidationMessages.name !== "" ? "popup__error_visible" : ""].join(" ")}
                    id="popup__error_type_name">
                    {formValidationMessages.name}</span>
            </label>
            <label className="popup__input-group" htmlFor="about">
                <input
                    className="popup__input popup__input_type_about"
                    type="text"
                    placeholder="Вид деятельности"
                    name="about"
                    id="about"
                    required
                    minLength={2}
                    maxLength={200}
                    value={userData.about ? userData.about : ""}
                    onChange={handleUserDataChange}
                />
                <span
                    className={["popup__error", formValidationMessages.about !== "" ? "popup__error_visible" : ""].join(" ")}
                    id="popup__error_type_about">
                    {formValidationMessages.about}</span>
            </label>
        </PopupWithForm>
    );
};

export default EditProfilePopup;
