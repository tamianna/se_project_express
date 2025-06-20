const express = require("express");
const router = express.Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:clothingItemId", deleteClothingItem);

module.exports = router;
