import React, { useEffect, useState } from 'react';
import Filters from '../components/Filters.jsx';
import Charts from '../components/Charts.jsx';
import client from '../api/client.js';

export default function Dashboard(){
  const [q, setQ] = useState('');
  const [season, setSeason] = useState('');
  const [format, setFormat] = useState('');
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const { data } = await client.get('/players', { params: { q } });
      setPlayers(data);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    (async () => {
      if(!selected) return;
      const { data } = await client.get(`/stats/form-trend/${selected.id}`, { params: { n: 5 } });
      setTrend(data);
    })();
  }, [selected]);

  return (
    <>
      <Filters q={q} setQ={setQ} season={season} setSeason={setSeason} format={format} setFormat={setFormat} />
      <div className="grid">
        <div className="card">
          <h3>Players</h3>
          <ul>
            {players.map(p => (
              <li key={p.id} style={{padding:'6px 0', cursor:'pointer'}} onClick={()=>setSelected(p)}>
                {p.full_name} — {p.country}
              </li>
            ))}
          </ul>
        </div>
        <Charts data={trend} title={selected ? `${selected.full_name} — Rolling Avg (Runs)` : 'Select a player'} />
      </div>
    </>
  );
}
