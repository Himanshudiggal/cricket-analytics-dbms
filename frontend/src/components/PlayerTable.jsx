import React from 'react';

export default function PlayerTable({ rows = [], onSelect }){
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Batting</th>
            <th>Bowling</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} onClick={()=>onSelect?.(r)} style={{cursor:'pointer'}}>
              <td>{r.full_name}</td>
              <td>{r.batting_style || '-'}</td>
              <td>{r.bowling_style || '-'}</td>
              <td>{r.country || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
