import React from 'react';

export default function Filters({ q, setQ, season, setSeason, format, setFormat }){
  return (
    <div className="grid">
      <div className="card">
        <label>Search Players</label>
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Name..." />
      </div>
      <div className="card">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div>
            <label>Season</label>
            <select className="input" value={season} onChange={e=>setSeason(e.target.value)}>
              <option value="">All</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>
          <div>
            <label>Format</label>
            <select className="input" value={format} onChange={e=>setFormat(e.target.value)}>
              <option value="">All</option>
              <option>T20</option>
              <option>ODI</option>
              <option>TEST</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
