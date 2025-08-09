const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const handleLikesClothingItemResponse = (dbQueryPromise, res, next) => {
  dbQueryPromise
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((updatedItem) => res.send(updatedItem))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      next(err);
    });
};

module.exports = { handleLikesClothingItemResponse };
