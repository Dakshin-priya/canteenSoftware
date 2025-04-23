const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }]
});

module.exports = mongoose.model('User', UserSchema);
