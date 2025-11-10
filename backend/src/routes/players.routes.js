import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/players
 * Optional query: ?q=smith
 * Returns a list of players filtered by name (or all if no query)
 */
router.get('/', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    // Use 'q' from query string, default to empty string if not provided
    const search = req.query.q || '';

    const [rows] = await pool.query(
      'SELECT id, name, country FROM players WHERE name LIKE ? ORDER BY name LIMIT 100',
      [`%${search}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/players/:id/season-summary
 * Returns batting and bowling summary per season for one player
 */
router.get('/:id/season-summary', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [bat] = await pool.query(
      'SELECT * FROM v_player_season_batting WHERE player_id = ? ORDER BY season',
      [id]
    );
    const [bowl] = await pool.query(
      'SELECT * FROM v_player_season_bowling WHERE player_id = ? ORDER BY season',
      [id]
    );

    res.json({ batting: bat, bowling: bowl });
  } catch (err) {
    console.error('Error fetching player season summary:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
