import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ✅ Fetch summary stats
router.get('/summary', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    const [[playerCount]] = await pool.query('SELECT COUNT(*) AS total_players FROM players');
    const [[matchCount]] = await pool.query('SELECT COUNT(*) AS total_matches FROM matches');
    const [seasons] = await pool.query('SELECT DISTINCT season_year FROM matches ORDER BY season_year DESC LIMIT 5');

    res.json({
      total_players: playerCount.total_players,
      total_matches: matchCount.total_matches,
      recent_seasons: seasons.map(s => s.season_year)
    });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Fetch top performers
router.get('/top-performers', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    const [batters] = await pool.query(`
      SELECT player_name, SUM(total_runs) AS runs
      FROM v_player_season_batting
      GROUP BY player_id
      ORDER BY runs DESC
      LIMIT 5;
    `);

    const [bowlers] = await pool.query(`
      SELECT player_name, SUM(wickets) AS wickets
      FROM v_player_season_bowling
      GROUP BY player_id
      ORDER BY wickets DESC
      LIMIT 5;
    `);

    res.json({ top_batters: batters, top_bowlers: bowlers });
  } catch (err) {
    console.error('Error fetching top performers:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Trend of matches by year
router.get('/match-trend', auth(['analyst', 'coach', 'manager', 'admin']), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT season_year, COUNT(*) AS matches
      FROM matches
      GROUP BY season_year
      ORDER BY season_year ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching match trend:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
