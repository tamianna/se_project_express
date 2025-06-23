const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { handleLikesClothingItemResponse } = require("../utils/helpers");

const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find({}).populate("owner likes");
    return res.send(clothingItems);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const createClothingItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const clothingItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    return res.status(201).send(clothingItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid clothing item data" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const deleteClothingItem = async (req, res) => ClothingItem.findByIdAndDelete(req.params.clothingItemId)
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() => res.send({ message: "Clothing item deleted" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }
      return res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
        message:
          err.statusCode === NOT_FOUND
            ? err.message
            : "An error has occured on the server",
      });
    });

const likeClothingItem = (req, res) => handleLikesClothingItemResponse(
    ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ),
    res
  );

const dislikeClothingItem = (req, res) => handleLikesClothingItemResponse(
    ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ),
    res
  );

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
