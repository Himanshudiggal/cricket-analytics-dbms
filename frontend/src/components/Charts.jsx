import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Charts({ data = [], title = 'Form (Runs)' }){
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{ width:'100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match_date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="rolling_avg_runs" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
