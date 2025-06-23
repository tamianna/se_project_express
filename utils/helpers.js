const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const handleLikesClothingItemResponse = (promise, res) => {
  return promise
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invaild clothing item ID" });
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
