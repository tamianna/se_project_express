const express = require("express");
const router = express.Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:clothingItemId", deleteClothingItem);

router.put("/:clothingItemId/likes", likeClothingItem);
router.delete("/:clothingItemId/likes", dislikeClothingItem);

module.exports = router;
