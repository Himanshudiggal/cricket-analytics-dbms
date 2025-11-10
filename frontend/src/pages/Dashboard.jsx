import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import client from "../api/client";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [top, setTop] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryRes, topRes, trendRes] = await Promise.all([
          client.get("/dashboard/summary"),
          client.get("/dashboard/top-performers"),
          client.get("/dashboard/match-trend"),
        ]);
        setSummary(summaryRes.data);
        setTop(topRes.data);
        setTrend(trendRes.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading Dashboard...</p>;
  if (!summary || !top)
    return <p className="p-6 text-red-500">Failed to load dashboard data.</p>;

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🏏 Cricket Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-5 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 font-semibold">Total Players</h3>
          <p className="text-3xl font-bold text-blue-700">
            {summary.total_players}
          </p>
        </div>

        <div className="bg-green-100 p-5 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 font-semibold">Total Matches</h3>
          <p className="text-3xl font-bold text-green-700">
            {summary.total_matches}
          </p>
        </div>

        <div className="bg-yellow-100 p-5 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 font-semibold">Recent Seasons</h3>
          <p className="text-xl font-medium text-yellow-800">
            {summary.recent_seasons.join(", ")}
          </p>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            🏆 Top 5 Run Scorers
          </h3>
          <ul>
            {top.top_batters.map((p, i) => (
              <li
                key={i}
                className="flex justify-between py-2 border-b border-gray-100"
              >
                <span>{p.player_name}</span>
                <span className="font-semibold text-blue-600">{p.runs}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            🎯 Top 5 Wicket Takers
          </h3>
          <ul>
            {top.top_bowlers.map((p, i) => (
              <li
                key={i}
                className="flex justify-between py-2 border-b border-gray-100"
              >
                <span>{p.player_name}</span>
                <span className="font-semibold text-green-600">
                  {p.wickets}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Match Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          📈 Matches Played by Year
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season_year" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="matches"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
