const express = require("express");

const router = express.Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

router.get("/", getClothingItems);

router.use(auth);

router.post("/", createClothingItem);
router.delete("/:clothingItemId", deleteClothingItem);
router.put("/:clothingItemId/likes", likeClothingItem);
router.delete("/:clothingItemId/likes", dislikeClothingItem);

module.exports = router;
