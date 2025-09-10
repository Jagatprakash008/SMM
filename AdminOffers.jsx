// for guvi - AdminOffers.jsx
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import {QrReader} from 'react-qr-reader';

export default function AdminOffers(){
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({title:'', serviceKey:'', price:0, quantity:0, description:''});

  useEffect(()=>{ fetchOffers(); },[]);
  async function fetchOffers(){
    const res = await axios.get('/api/offers');
    setOffers(res.data);
  }
  async function addOffer(e){
    e.preventDefault();
    await axios.post('/api/admin/offers', form, {headers:{Authorization:'Bearer '+localStorage.token}});
    fetchOffers();
  }
  async function toggle(id, current){
    await axios.put('/api/admin/offers/'+id, {visible: !current}, {headers:{Authorization:'Bearer '+localStorage.token}});
    fetchOffers();
  }

  const upiUri = (vpa, name, amount, txn) =>
    `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(txn)}`;

  return (
    <div>
      <h2>Admin Offers</h2>
      <form onSubmit={addOffer}>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" />
        <input value={form.serviceKey} onChange={e=>setForm({...form,serviceKey:e.target.value})} placeholder="serviceKey" />
        <input type="number" value={form.price} onChange={e=>setForm({...form,price:+e.target.value})} placeholder="Price"/>
        <input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:+e.target.value})} placeholder="Qty"/>
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
        <button>Add Offer</button>
      </form>

      <ul>
        {offers.map(o=>(
          <li key={o._id}>
            {o.title} - ₹{o.price} - {o.visible ? 'Visible' : 'Hidden'}
            <button onClick={()=>toggle(o._id,o.visible)}>Toggle</button>
          </li>
        ))}
      </ul>

      <h3>Generate UPI QR</h3>
      <QRCode value={upiUri('your-vpa@bank','YourName',100,'Order #123')} />
      <p>Scan with UPI app for payment</p>

      <h3>Scan QR (mobile)</h3>
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result, error) => {
          if (result) {
            console.log("Scanned:", result?.text);
          }
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
