// for guvi - server.js (Express backend)
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const Offer = require('./models/Offer');
const Order = require('./models/Order');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// connect mongo
mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.error("Mongo error:",err));

// --- Auth middleware (JWT) ---
function auth(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).send('No token');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch(e){ return res.status(401).send('Invalid token'); }
}

// --- Admin middleware ---
async function isAdmin(req,res,next){
  const user = await User.findById(req.user.id);
  if(user?.role !== 'admin') return res.status(403).send('Admin only');
  next();
}

/* OFFERS */
// get visible offers (for marketplace)
app.get('/api/offers', async (req,res) => {
  const offers = await Offer.find({visible:true});
  res.json(offers);
});

// admin: create offer
app.post('/api/admin/offers', auth, isAdmin, async (req,res)=>{
  const o = await Offer.create(req.body);
  res.json(o);
});

// admin: update / toggle / delete
app.put('/api/admin/offers/:id', auth, isAdmin, async (req,res)=>{
  const o = await Offer.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(o);
});
app.delete('/api/admin/offers/:id', auth, isAdmin, async (req,res)=>{
  await Offer.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

/* ORDERS */
app.post('/api/orders', auth, async (req,res)=>{
  const offer = await Offer.findById(req.body.offerId);
  if(!offer || !offer.visible) return res.status(400).send('Offer not available');
  const order = await Order.create({
    userId: req.user.id,
    offerId: offer._id,
    target: req.body.target,
    quantity: offer.quantity,
    price: offer.price,
  });
  res.json(order);
});

// admin update order status
app.put('/api/admin/orders/:id', auth, isAdmin, async (req,res)=>{
  const o = await Order.findByIdAndUpdate(
    req.params.id,
    {...req.body, updatedAt: new Date()},
    {new:true}
  );
  res.json(o);
});

/* PAYMENTS */
app.post('/api/payments/upi-notify', auth, async (req,res)=>{
  // user submits txn id / screenshot for manual confirm
  res.json({ok:true, msg:"Payment submitted for verification"});
});

app.listen(4000, ()=>console.log('Backend running on port 4000'));
