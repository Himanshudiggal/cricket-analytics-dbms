import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// ✅ Import main app & pages
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Players from './pages/Players.jsx';
import TopScorers from './pages/TopScorers.jsx';
import PlayerCareer from './pages/PlayerCareer.jsx';
import Login from './pages/Login.jsx';

// ✅ Import global styles (Tailwind or CSS)
import './styles.css';  // make sure this includes @tailwind base; @tailwind components; @tailwind utilities;

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
      { path: 'login', element: <Login /> }
    ],
  },
]);

// ✅ Render root
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
