import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function App(){
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem('token');
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };
  return (
    <>
      <nav>
        <strong>Cricket Analytics</strong>
        <Link to="/">Dashboard</Link>
        <Link to="/players">Players</Link>
        <span style={{flex:1}} />
        {isAuthed ? <button className="button" onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
