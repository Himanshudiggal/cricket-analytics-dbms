-- analytics_views.sql
-- Adds analytics views, procedures, and indexes.

SET @OLD_SQL_MODE = @@sql_mode;
SET sql_mode = '';

-- Drop old objects safely
DROP VIEW IF EXISTS view_player_innings;
DROP VIEW IF EXISTS view_player_career_stats;
DROP VIEW IF EXISTS view_player_yearly_stats;
DROP VIEW IF EXISTS view_top_scorers;
DROP VIEW IF EXISTS view_top_wicket_takers;
DROP VIEW IF EXISTS view_player_match_summary;
DROP PROCEDURE IF EXISTS sp_player_form_trend;

-- ============================================================
-- 1) view_player_innings
-- ============================================================
CREATE VIEW view_player_innings AS
SELECT
  d.match_id,
  m.match_date,
  d.batsman AS player_name,
  SUM(d.runs_batsman) AS runs,
  COUNT(*) AS balls,
  SUM(CASE WHEN d.wicket_player_out IS NOT NULL AND d.wicket_player_out = d.batsman THEN 1 ELSE 0 END) AS outs
FROM deliveries d
LEFT JOIN matches m ON d.match_id = m.id
WHERE d.batsman IS NOT NULL AND d.batsman <> ''
GROUP BY d.match_id, d.batsman;

-- ============================================================
-- 2) view_player_career_stats
-- ============================================================
CREATE VIEW view_player_career_stats AS
SELECT
  p.id AS player_id,
  p.name AS player_name,
  COALESCE(SUM(vpi.runs),0) AS total_runs,
  COALESCE(SUM(vpi.balls),0) AS balls_faced,
  COALESCE(SUM(vpi.outs),0) AS outs,
  ROUND(
    COALESCE(SUM(vpi.runs),0) / NULLIF(COALESCE(SUM(vpi.outs),0), 0),
    2
  ) AS batting_average,
  ROUND(
    CASE WHEN COALESCE(SUM(vpi.balls),0) = 0 THEN 0 ELSE (COALESCE(SUM(vpi.runs),0) / COALESCE(SUM(vpi.balls),0)) * 100 END,
    2
  ) AS strike_rate,
  COALESCE(MAX(vpi.runs),0) AS highest_score,
  COUNT(DISTINCT vpi.match_id) AS matches_played
FROM players p
LEFT JOIN view_player_innings vpi ON vpi.player_name = p.name
GROUP BY p.id, p.name;

-- ============================================================
-- 3) view_player_yearly_stats
-- ============================================================
CREATE VIEW view_player_yearly_stats AS
SELECT
  p.id AS player_id,
  p.name AS player_name,
  COALESCE(m.season_year, YEAR(m.match_date)) AS year,
  SUM(d.runs_batsman) AS runs,
  COUNT(DISTINCT d.match_id) AS matches,
  COUNT(*) AS balls,
  SUM(CASE WHEN d.wicket_player_out IS NOT NULL AND d.wicket_player_out = d.batsman THEN 1 ELSE 0 END) AS outs,
  ROUND(
    SUM(d.runs_batsman) / NULLIF(SUM(CASE WHEN d.wicket_player_out IS NOT NULL AND d.wicket_player_out = d.batsman THEN 1 ELSE 0 END),0),
    2
  ) AS batting_average,
  ROUND(
    CASE WHEN COUNT(*) = 0 THEN 0 ELSE (SUM(d.runs_batsman) / COUNT(*)) * 100 END,
    2
  ) AS strike_rate
FROM deliveries d
JOIN matches m ON d.match_id = m.id
JOIN players p ON p.name = d.batsman
GROUP BY p.id, p.name, COALESCE(m.season_year, YEAR(m.match_date));

-- ============================================================
-- 4) view_top_scorers
-- ============================================================
CREATE VIEW view_top_scorers AS
SELECT
  player_id,
  player_name,
  total_runs,
  matches_played,
  batting_average,
  strike_rate
FROM view_player_career_stats
ORDER BY total_runs DESC;

-- ============================================================
-- 5) view_top_wicket_takers
-- ============================================================
CREATE VIEW view_top_wicket_takers AS
SELECT
  COALESCE(d.bowler,'Unknown') AS bowler_name,
  COUNT(CASE WHEN d.is_wicket = 1 THEN 1 END) AS wickets,
  COUNT(DISTINCT d.match_id) AS matches,
  SUM(d.runs_total) AS runs_conceded,
  ROUND(
    CASE WHEN COUNT(CASE WHEN d.is_wicket = 1 THEN 1 END) = 0 THEN NULL
    ELSE SUM(d.runs_total) / COUNT(CASE WHEN d.is_wicket = 1 THEN 1 END) END, 2
  ) AS bowling_average
FROM deliveries d
WHERE d.bowler IS NOT NULL AND d.bowler <> ''
GROUP BY d.bowler
ORDER BY wickets DESC;

-- ============================================================
-- 6) view_player_match_summary
-- ============================================================
CREATE VIEW view_player_match_summary AS
SELECT
  p.id AS player_id,
  p.name AS player_name,
  d.match_id,
  m.match_date,
  SUM(d.runs_batsman) AS runs,
  COUNT(*) AS balls,
  SUM(CASE WHEN d.wicket_player_out IS NOT NULL AND d.wicket_player_out = d.batsman THEN 1 ELSE 0 END) AS outs
FROM deliveries d
JOIN players p ON p.name = d.batsman
LEFT JOIN matches m ON m.id = d.match_id
GROUP BY p.id, p.name, d.match_id, m.match_date;

-- ============================================================
-- 7) Stored Procedure: sp_player_form_trend
-- ============================================================
DELIMITER $$
CREATE PROCEDURE sp_player_form_trend(IN p_player_id INT, IN p_last_n INT)
BEGIN
  SELECT
    m.match_date,
    vm.runs,
    vm.balls,
    vm.outs
  FROM view_player_innings vm
  JOIN players p ON p.name = vm.player_name
  JOIN matches m ON m.id = vm.match_id
  WHERE p.id = p_player_id
  ORDER BY m.match_date DESC
  LIMIT p_last_n;
END $$
DELIMITER ;

-- ============================================================
-- 8) Indexes (compatible with all MySQL versions)
-- ============================================================
-- These will throw a warning if index doesn't exist, not an error.
DROP INDEX idx_deliveries_batsman ON deliveries;
CREATE INDEX idx_deliveries_batsman ON deliveries(batsman);

DROP INDEX idx_deliveries_bowler ON deliveries;
CREATE INDEX idx_deliveries_bowler ON deliveries(bowler);

DROP INDEX idx_deliveries_match ON deliveries;
CREATE INDEX idx_deliveries_match ON deliveries(match_id);

DROP INDEX idx_matches_date ON matches;
CREATE INDEX idx_matches_date ON matches(match_date);

DROP INDEX idx_players_name ON players;
CREATE INDEX idx_players_name ON players(name);

SET sql_mode = @OLD_SQL_MODE;
