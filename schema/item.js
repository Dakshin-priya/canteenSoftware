const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String }
});

module.exports = mongoose.model('Item', ItemSchema);
