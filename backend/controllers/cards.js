const Card = require("../models/card");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий _id карточки.");
      }
      if (String(card.owner) === req.user._id) {
        return Card.deleteOne(card).then(() => {
          res.status(200).send({ message: "Карточка удалена" });
        });
      }
      throw new ForbiddenError("Вы не являетесь создателем данной карточки");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Некорректный id"));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      next(new NotFoundError("Передан несуществующий _id карточки."));
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для постановки лайка."
          )
        );
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      next(new NotFoundError("Передан несуществующий _id карточки."));
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError("Переданы некорректные данные для снятия лайка.")
        );
        return;
      }
      next(err);
    });
};
