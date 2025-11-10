import React, { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Link } from 'react-router-dom';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(`/players?q=${query}`);
      setPlayers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchPlayers, 400);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Players</h2>

      <input
        type="text"
        placeholder="Search players..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-4 w-full md:w-1/3"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Country</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  <Link
                    to={`/player/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b">
                  {p.country || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
