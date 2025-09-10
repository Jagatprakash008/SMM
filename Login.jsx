// for guvi - Login.jsx
import React, {useState} from 'react';
import axios from 'axios';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  async function handleLogin(e){
    e.preventDefault();
    const res = await axios.post('/api/login',{email,password});
    localStorage.setItem('token',res.data.token);
    alert("Logged in!");
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
        <button>Login</button>
      </form>
    </div>
  );
}
