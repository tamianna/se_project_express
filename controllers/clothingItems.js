const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const { handleLikesClothingItemResponse } = require("../utils/helpers");

const getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find({}).populate("owner likes");
    return res.send(clothingItems);
  } catch (err) {
    next(err);
  }
};

const createClothingItem = async (req, res, next) => {
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
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invaild clothing item data"));
    }
    next(err);
  }
};

const deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.clothingItemId)
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Clothing item deleted" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      next(err);
    });
};

const likeClothingItem = (req, res, next) =>
  handleLikesClothingItemResponse(
    ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ),
    res,
    next
  );

const dislikeClothingItem = (req, res, next) =>
  handleLikesClothingItemResponse(
    ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ),
    res,
    next
  );

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
