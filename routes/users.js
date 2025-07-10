const express = require("express");

const router = express.Router();
const {
  getCurrentUser,
  updateUser,
  login,
  createUser,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
