import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/stats/form-trend/:playerId
 * Calls stored procedure sp_player_form_trend(playerId, n)
 * Role-restricted to analyst/coach/manager/admin
 */
router.get('/form-trend/:playerId', auth(['analyst','coach','manager','admin']), async (req, res) => {
  try {
    const playerId = Number(req.params.playerId);
    const n = Number(req.query.n || 5);
    const [rows] = await pool.query('CALL sp_player_form_trend(?, ?)', [playerId, n]);
    res.json(rows[0] || []);
  } catch (err) {
    console.error('Error fetching form trend:', err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/stats/batting/alltime
 * Returns top batting career stats (runs, average, SR)
 */
router.get('/batting/alltime', auth(['analyst','coach','manager','admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM view_top_scorers LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/stats/bowling/top
 * Returns top wicket takers
 */
router.get('/bowling/top', auth(['analyst','coach','manager','admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM view_top_wicket_takers LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/stats/batting/yearly/:playerId
 * Returns per-year batting stats for a specific player
 */
router.get('/batting/yearly/:playerId', auth(['analyst','coach','manager','admin']), async (req, res) => {
  try {
    const { playerId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM view_player_yearly_stats WHERE player_id = ? ORDER BY year DESC',
      [playerId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/stats/player/:id/career
 * Returns lifetime career stats for one player
 */
router.get('/player/:id/career', auth(['analyst','coach','manager','admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM view_player_career_stats WHERE player_id = ?',
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ message: 'Player not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
