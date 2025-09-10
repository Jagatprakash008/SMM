// for guvi - User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {type:String, unique:true},
  passwordHash: String,
  balance: {type: Number, default: 0},
  role: {type: String, enum:['user','admin'], default:'user'},
  createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', UserSchema);
