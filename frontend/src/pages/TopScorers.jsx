import React, { useEffect, useState } from 'react';
import { getTopBatters } from '../api/stats';

export default function TopScorers() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    getTopBatters().then(({ data }) => setPlayers(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🏏 Top Scorers (All Time)</h2>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Player</th>
            <th className="px-4 py-2">Runs</th>
            <th className="px-4 py-2">Matches</th>
            <th className="px-4 py-2">Average</th>
            <th className="px-4 py-2">Strike Rate</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={p.player_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{p.player_name}</td>
              <td className="px-4 py-2">{p.total_runs}</td>
              <td className="px-4 py-2">{p.matches_played}</td>
              <td className="px-4 py-2">{p.batting_average}</td>
              <td className="px-4 py-2">{p.strike_rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
