const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");

router.user("/users", userRoutes);
router.use("/items", clothingItemRoutes);

module.exports = router;
