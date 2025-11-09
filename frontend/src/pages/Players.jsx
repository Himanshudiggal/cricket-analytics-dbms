import React, { useEffect, useState } from 'react';
import PlayerTable from '../components/PlayerTable.jsx';
import client from '../api/client.js';

export default function Players(){
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const t = setTimeout(async () => {
      const { data } = await client.get('/players', { params: { q } });
      setRows(data);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <input className="input" placeholder="Search players..." value={q} onChange={e=>setQ(e.target.value)} />
      <PlayerTable rows={rows} onSelect={(p)=>alert(p.full_name)} />
    </div>
  );
}
