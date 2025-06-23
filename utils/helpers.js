const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const handleLikesClothingItemResponse = (dbQueryPromise, res) => {
  return dbQueryPromise
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => res.send(updatedItem))
    .catch((err) => {
      console.error("Caught in helper:", err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }
      res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
        message:
          err.statusCode === NOT_FOUND
            ? err.message
            : "An error has occurred on the server",
      });
    });
};

module.exports = { handleLikesClothingItemResponse };
