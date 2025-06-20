const User = require('../models/user');

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.send(users);
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: 'Invalid user ID' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.create({ name, avatar });
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ message: 'Invalid user data' });
  }
};

module.exports = { getUsers, getUser, createUser };