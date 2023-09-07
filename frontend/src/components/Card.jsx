import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React from 'react';
const Card = (props) => {

    const currentUser = React.useContext(CurrentUserContext);

    const { name, link, likes, owner } = props.card;


    const isLiked = likes.some(i => i === currentUser._id);
    function handleClick() {
        props.onCardClick(props.card);
    }
    function handleDeleteClick() {
        props.onDeleteCard(props.card);
    }
    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    return (
        <article className="card">
            {owner === currentUser._id
                && <button className="card__remove button-hover" type="button" aria-label="Удалить место"
                    onClick={handleDeleteClick} />
            }
            <img src={`${link}`} alt={name} className="card__image" onClick={handleClick} />

            <div className="card__info">
                <h2 className="card__title">{name}</h2>
                <div className="card__like-container">
                    <button
                        type="button"
                        className={`card__like button-hover ${isLiked && "card__like_active button-hover"}`}
                        aria-label="лайк"
                        onClick={handleLikeClick}
                    />
                    <p className="card__like-counter">{likes.length}</p>
                </div>
            </div>
        </article>
    )
};

export default Card
