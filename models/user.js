const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { UNAUTHORIZED } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const err = new Error("Incorrect email or password");
        err.statusCode = UNAUTHORIZED;
        throw err;
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const err = new Error("Incorrect email or password");
          err.statusCode = UNAUTHORIZED;
          throw err;
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
