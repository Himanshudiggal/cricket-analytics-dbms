import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth(['analyst','coach','manager','admin']), async (req, res) => {
  const q = req.query.q || '';
  const [rows] = await pool.query(
    'SELECT id, full_name, batting_style, bowling_style, country FROM players WHERE full_name LIKE ? ORDER BY full_name LIMIT 100',
    [`%${q}%`]
  );
  res.json(rows);
});

router.get('/:id/season-summary', auth(['analyst','coach','manager','admin']), async (req, res) => {
  const id = Number(req.params.id);
  const [bat] = await pool.query('SELECT * FROM v_player_season_batting WHERE player_id=? ORDER BY season', [id]);
  const [bowl] = await pool.query('SELECT * FROM v_player_season_bowling WHERE player_id=? ORDER BY season', [id]);
  res.json({ batting: bat, bowling: bowl });
});

export default router;
