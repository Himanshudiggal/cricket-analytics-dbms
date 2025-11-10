import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/players
 * Optional query: ?q=smith
 * Returns a list of players filtered by name dynamically
 */
router.get('/', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    const search = req.query.q ? req.query.q.trim() : '';

    let query = 'SELECT id, name, country FROM players';
    const params = [];

    // If the user typed something, apply a LIKE filter
    if (search) {
      query += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }

    // Return more results to cover a broader search base
    query += ' ORDER BY name LIMIT 500';

    const [rows] = await pool.query(query, params);
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

/**
 * GET /api/players/compare?player1=1&player2=2
 * Returns batting and bowling summaries for both players
 */
router.get('/compare', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    const { player1, player2 } = req.query;

    if (!player1 || !player2) {
      return res.status(400).json({ message: 'Both player IDs are required' });
    }

    // Fetch player 1 stats
    const [p1bat] = await pool.query(
      'SELECT * FROM v_player_season_batting WHERE player_id = ? ORDER BY season',
      [player1]
    );
    const [p1bowl] = await pool.query(
      'SELECT * FROM v_player_season_bowling WHERE player_id = ? ORDER BY season',
      [player1]
    );

    // Fetch player 2 stats
    const [p2bat] = await pool.query(
      'SELECT * FROM v_player_season_batting WHERE player_id = ? ORDER BY season',
      [player2]
    );
    const [p2bowl] = await pool.query(
      'SELECT * FROM v_player_season_bowling WHERE player_id = ? ORDER BY season',
      [player2]
    );

    res.json({
      player1: { batting: p1bat, bowling: p1bowl },
      player2: { batting: p2bat, bowling: p2bowl },
    });
  } catch (err) {
    console.error('Error comparing players:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
