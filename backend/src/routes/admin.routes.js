import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';
import { upsertBattingSchema } from '../utils/validators.js';

const router = Router();

router.post('/upsert-batting', auth(['analyst','admin']), async (req, res) => {
  const { error, value } = upsertBattingSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const { match_id, player_id, runs, balls, fours, sixes, dismissal, batting_position } = value;
  try {
    await pool.query('CALL sp_upsert_batting(?,?,?,?,?,?,?,?)', [match_id, player_id, runs, balls, fours, sixes, dismissal, batting_position]);
    res.json({ message: 'Upserted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
