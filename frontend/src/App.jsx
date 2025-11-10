import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/players', label: '👤 Players' },
    { path: '/top-scorers', label: '⭐ Top Scorers' },
    { path: '/compare', label: '⚔️ Compare Players' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Navigation Bar */}
      <nav className="flex items-center justify-between bg-gray-900 text-white px-8 py-4 shadow-md">
        <div className="flex items-center gap-8">
          <strong className="text-xl font-bold tracking-wide text-yellow-400">
            🏏 Cricket Analytics
          </strong>

          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-200 font-medium ${
                  location.pathname === link.path
                    ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1'
                    : 'hover:text-yellow-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ✅ Auth Buttons */}
        <div>
          {isAuthed ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* ✅ Page Content */}
      <main className="flex-1 container mx-auto p-8">
        <Outlet />
      </main>

      {/* ✅ Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-3 text-sm">
        © {new Date().getFullYear()} Cricket Analytics | Built with ⚡ React + Express + MySQL
      </footer>
    </div>
  );
}
