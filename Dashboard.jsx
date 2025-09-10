// for guvi - Dashboard.jsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Dashboard(){
  const [offers,setOffers] = useState([]);

  useEffect(()=>{
    async function fetchOffers(){
      const res = await axios.get('/api/offers');
      setOffers(res.data);
    }
    fetchOffers();
  },[]);

  return (
    <div>
      <h2>Available Offers</h2>
      <ul>
        {offers.map(o=>(
          <li key={o._id}>{o.title} - ₹{o.price}</li>
        ))}
      </ul>
    </div>
  );
}
