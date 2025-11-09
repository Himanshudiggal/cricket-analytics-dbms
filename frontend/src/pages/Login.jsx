import React, { useState } from 'react';
import client from '../api/client.js';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await client.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{maxWidth:360, margin:'40px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit} className="card">
        <label>Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <button className="button" type="submit">Sign in</button>
      </form>
    </div>
  );
}
