CREATE OR REPLACE VIEW v_player_season_batting AS
SELECT p.id AS player_id, p.full_name, s.label AS season,
       SUM(b.runs) AS total_runs,
       SUM(b.balls) AS total_balls,
       ROUND(CASE WHEN SUM(b.balls) > 0 THEN SUM(b.runs) / (SUM(b.balls)/100) ELSE NULL END, 2) AS strike_rate,
       ROUND(CASE WHEN COUNT(*) > 0 THEN AVG(b.runs) ELSE NULL END, 2) AS avg_per_innings
FROM batting_stats b
JOIN matches m ON m.id = b.match_id
JOIN players p ON p.id = b.player_id
JOIN seasons s ON s.id = m.season_id
GROUP BY p.id, p.full_name, s.label;

CREATE OR REPLACE VIEW v_player_season_bowling AS
SELECT p.id AS player_id, p.full_name, s.label AS season,
       SUM(bs.wickets) AS wickets,
       SUM(bs.runs_conceded) AS runs_conceded,
       ROUND(AVG(bs.economy),2) AS avg_economy
FROM bowling_stats bs
JOIN matches m ON m.id = bs.match_id
JOIN players p ON p.id = bs.player_id
JOIN seasons s ON s.id = m.season_id
GROUP BY p.id, p.full_name, s.label;
