// for guvi - Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: mongoose.ObjectId,
  offerId: mongoose.ObjectId,
  target: String,
  quantity: Number,
  price: Number,
  status: {type: String, enum: ['pending','processing','completed','failed','cancelled'], default: 'pending'},
  providerResponse: mongoose.Mixed,
  createdAt: {type: Date, default: Date.now},
  updatedAt: Date,
});

module.exports = mongoose.model('Order', OrderSchema);
