const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (
        err.code === 11000 ||
        (err.name === "MongoServerError" && err.message.includes("E11000"))
      ) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
  }

  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      const status = err.statusCode || UNAUTHORIZED;
      res.status(status).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
