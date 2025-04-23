const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['wallet', 'razorpay'], required: true },
  paymentStatus: { type: String, enum: ['success', 'failed'], required: true },
  createdAt: { type: Date, default: Date.now },
  billNumber: { type: String, required: true, unique: true },
  time: { type: Date, default: Date.now },
  qrCode: { type: String }
});

module.exports = mongoose.model('Bill', BillSchema);
