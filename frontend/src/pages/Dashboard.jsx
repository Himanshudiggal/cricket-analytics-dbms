import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import client from "../api/client";
import useDarkMode from "../hooks/useDarkMode"; // ✅ Import dark mode hook

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [top, setTop] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme] = useDarkMode(); // ✅ Access theme (“light” or “dark”)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryRes, topRes] = await Promise.all([
          client.get("/dashboard/summary"),
          client.get("/dashboard/top-performers"),
        ]);
        const monthRes = await client.get("/stats/matches-by-month");

        setSummary(summaryRes.data);
        setTop(topRes.data);

        const sorted = monthRes.data.sort(
          (a, b) => a.year - b.year || a.month_num - b.month_num
        );

        const formatted = sorted.map((m) => ({
          ...m,
          label: `${m.year}-${m.month.slice(0, 3)}`,
        }));

        setTrend(formatted);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );

  if (!summary || !top)
    return (
      <p className="p-6 text-center text-red-500 dark:text-red-400">
        Failed to load dashboard data.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 space-y-10 transition-colors duration-500">
      {/* Header */}
      <motion.h2
        className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏏 Cricket Analytics Dashboard
      </motion.h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Total Players",
            value: summary.total_players,
            color: "from-blue-500 to-indigo-600",
            icon: "👥",
          },
          {
            title: "Total Matches",
            value: summary.total_matches,
            color: "from-green-500 to-emerald-600",
            icon: "🏟️",
          },
          {
            title: "Recent Seasons",
            value: summary.recent_seasons.join(", "),
            color: "from-yellow-400 to-orange-500",
            icon: "📅",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-2xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{card.icon}</span>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
            🏆 Top 5 Run Scorers
          </h3>
          <ul>
            {top.top_batters.map((p, i) => (
              <li
                key={i}
                className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition"
              >
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {p.player_name}
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {p.runs}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
            🎯 Top 5 Wicket Takers
          </h3>
          <ul>
            {top.top_bowlers.map((p, i) => (
              <li
                key={i}
                className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700 rounded transition"
              >
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {p.player_name}
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {p.wickets}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Match Trend Chart */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-5 text-center">
          📈 Matches Played by Month
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trend}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#444" : "#ddd"}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: theme === "dark" ? "#bbb" : "#333" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: theme === "dark" ? "#bbb" : "#333" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(30,30,30,0.9)"
                    : "rgba(255,255,255,0.9)",
                color: theme === "dark" ? "#eee" : "#111",
                borderRadius: "8px",
              }}
              labelStyle={{
                color: theme === "dark" ? "#eee" : "#111",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="matches_played"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Matches Played"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
