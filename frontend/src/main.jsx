import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// ✅ Import main app & pages
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Players from './pages/Players.jsx';
import TopScorers from './pages/TopScorers.jsx';
import PlayerCareer from './pages/PlayerCareer.jsx';
import PlayerComparison from './pages/PlayerComparison.jsx';
import Login from './pages/Login.jsx';

// ✅ Import global styles (Tailwind or CSS)
import './styles.css'; // Ensure Tailwind CSS is configured properly

// ✅ Import the ThemeProvider (for global dark mode)
import { ThemeProvider } from './context/ThemeContext.jsx';

// ✅ Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'players', element: <Players /> },
      { path: 'top-scorers', element: <TopScorers /> },
      { path: 'player/:id', element: <PlayerCareer /> },
      { path: 'compare', element: <PlayerComparison /> },
      { path: 'login', element: <Login /> },
    ],
  },
]);

// ✅ Render root with ThemeProvider wrapping the Router
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
