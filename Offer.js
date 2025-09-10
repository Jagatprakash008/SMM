// for guvi - Offer.js
const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: String,
  serviceKey: String,
  description: String,
  price: Number,
  quantity: Number,
  visible: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
  meta: mongoose.Mixed
});

module.exports = mongoose.model('Offer', OfferSchema);
