import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3 shadow-md">
        <strong className="text-lg font-semibold">🏏 Cricket Analytics</strong>
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/players" className="hover:underline">Players</Link>
        <Link to="/top-scorers" className="hover:underline">Top Scorers</Link>
        <span className="flex-1" />
        {isAuthed ? (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Page Content */}
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </>
  );
}
