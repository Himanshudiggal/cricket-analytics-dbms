import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCareerStats, getYearlyStats } from '../api/stats';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function PlayerCareer() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [yearly, setYearly] = useState([]);

  useEffect(() => {
    getCareerStats(id).then(({ data }) => setCareer(data));
    getYearlyStats(id).then(({ data }) => setYearly(data));
  }, [id]);

  if (!career) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{career.player_name} — Career Summary</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-700">Total Runs</h3>
          <p className="text-3xl font-bold">{career.total_runs}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-700">Average</h3>
          <p className="text-3xl font-bold">{career.batting_average}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Yearly Runs Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="runs" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
