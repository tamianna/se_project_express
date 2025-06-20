const ClothingItem = require('../models/clothingItem');

const getClothingItems = async (req, res) => {
  const clothingItems = await ClothingItem.find({}).populate('owner likes');
  res.send(clothingItems);
};

const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl, owner } = req.body;
    const clothingItem = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).send(clothingItem);
  } catch (err) {
    res.status(400).send({ message: 'Invalid clothing item data' });
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findByIdAndDelete(req.params.clothingItemId);
    if (!clothingItem) return res.status(404).send({ message: 'Clothing item not found' });
    res.send({ message: 'Clothing item deleted' });
  } catch (err) {
    res.status(400).send({ message: 'Invalid clothing item ID' });
  }
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };