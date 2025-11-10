import React, { useState, useEffect } from 'react';
import client from '../api/client.js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function PlayerComparison() {
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 Live search for Player 1
  useEffect(() => {
    const fetchPlayers = async () => {
      if (search1.length < 2) {
        setSuggestions1([]);
        return;
      }
      try {
        const { data } = await client.get(`/players?q=${encodeURIComponent(search1)}`);
        setSuggestions1(data);
      } catch (err) {
        console.error(err);
      }
    };
    const timeout = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(timeout);
  }, [search1]);

  // 🔍 Live search for Player 2
  useEffect(() => {
    const fetchPlayers = async () => {
      if (search2.length < 2) {
        setSuggestions2([]);
        return;
      }
      try {
        const { data } = await client.get(`/players?q=${encodeURIComponent(search2)}`);
        setSuggestions2(data);
      } catch (err) {
        console.error(err);
      }
    };
    const timeout = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(timeout);
  }, [search2]);

  // ⚔️ Compare two selected players
  const comparePlayers = async () => {
    if (!selected1 || !selected2) {
      alert('Please select two players to compare!');
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.get(
        `/players/compare?player1=${selected1.id}&player2=${selected2.id}`
      );
      setData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load comparison data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">⚔️ Player Comparison</h2>

      {/* Player Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Player 1 Search */}
        <div className="bg-white rounded-lg shadow p-5 relative">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Player 1</h3>
          {!selected1 ? (
            <>
              <input
                type="text"
                placeholder="Search for player..."
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
                className="border w-full rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {suggestions1.length > 0 && (
                <ul className="absolute bg-white border rounded w-full max-h-48 overflow-y-auto shadow-lg z-10">
                  {suggestions1.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setSelected1(p);
                        setSearch1('');
                        setSuggestions1([]);
                      }}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {p.name}
                      {p.country && (
                        <span className="text-gray-500 text-sm ml-2">({p.country})</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-800">{selected1.name}</p>
              <button
                onClick={() => setSelected1(null)}
                className="text-red-500 text-sm hover:underline"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Player 2 Search */}
        <div className="bg-white rounded-lg shadow p-5 relative">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Player 2</h3>
          {!selected2 ? (
            <>
              <input
                type="text"
                placeholder="Search for player..."
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                className="border w-full rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {suggestions2.length > 0 && (
                <ul className="absolute bg-white border rounded w-full max-h-48 overflow-y-auto shadow-lg z-10">
                  {suggestions2.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setSelected2(p);
                        setSearch2('');
                        setSuggestions2([]);
                      }}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {p.name}
                      {p.country && (
                        <span className="text-gray-500 text-sm ml-2">({p.country})</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-800">{selected2.name}</p>
              <button
                onClick={() => setSelected2(null)}
                className="text-red-500 text-sm hover:underline"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={comparePlayers}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
        >
          Compare Players
        </button>
      </div>

      {/* Charts */}
      {loading && <p className="text-center text-gray-500">Loading comparison...</p>}
      {data && (
        <div className="space-y-10">
          {/* Batting Comparison */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              🏏 Batting Comparison (Runs by Season)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  data={data.player1.batting}
                  type="monotone"
                  dataKey="total_runs"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name={selected1?.name || 'Player 1'}
                />
                <Line
                  data={data.player2.batting}
                  type="monotone"
                  dataKey="total_runs"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name={selected2?.name || 'Player 2'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bowling Comparison */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              🎯 Bowling Comparison (Wickets by Season)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  data={data.player1.bowling}
                  type="monotone"
                  dataKey="wickets"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name={selected1?.name || 'Player 1'}
                />
                <Line
                  data={data.player2.bowling}
                  type="monotone"
                  dataKey="wickets"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name={selected2?.name || 'Player 2'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
