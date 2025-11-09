import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/form-trend/:playerId', auth(['analyst','coach','manager','admin']), async (req, res) => {
  const playerId = Number(req.params.playerId);
  const n = Number(req.query.n || 5);
  const [rows] = await pool.query('CALL sp_player_form_trend(?, ?)', [playerId, n]);
  res.json(rows[0] || []);
});

export default router;
