// for guvi - Register.jsx
import React, {useState} from 'react';
import axios from 'axios';

export default function Register(){
  const [form,setForm] = useState({name:'',email:'',password:''});

  async function handleRegister(e){
    e.preventDefault();
    await axios.post('/api/register',form);
    alert("Registered successfully!");
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name"/>
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email"/>
        <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password"/>
        <button>Register</button>
      </form>
    </div>
  );
}
