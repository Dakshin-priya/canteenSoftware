const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true }, // keep if using string IDs intentionally
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: '' }
});

module.exports = mongoose.model('Item', ItemSchema);
