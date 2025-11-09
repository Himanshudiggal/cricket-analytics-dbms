DELIMITER $$

CREATE PROCEDURE sp_player_form_trend(IN p_player_id INT, IN p_n INT)
BEGIN
  SELECT b.player_id,
         m.match_date,
         b.runs,
         AVG(b.runs) OVER (ORDER BY m.match_date ROWS BETWEEN p_n-1 PRECEDING AND CURRENT ROW) AS rolling_avg_runs
  FROM batting_stats b
  JOIN matches m ON m.id = b.match_id
  WHERE b.player_id = p_player_id
  ORDER BY m.match_date;
END$$

CREATE PROCEDURE sp_player_season_compare(IN p_player_id INT)
BEGIN
  SELECT * FROM v_player_season_batting WHERE player_id = p_player_id
  UNION ALL
  SELECT player_id, full_name, season, NULL, NULL, NULL, NULL FROM v_player_season_bowling WHERE player_id = p_player_id;
END$$

CREATE PROCEDURE sp_upsert_batting(
  IN p_match_id INT,
  IN p_player_id INT,
  IN p_runs INT,
  IN p_balls INT,
  IN p_fours INT,
  IN p_sixes INT,
  IN p_dismissal VARCHAR(32),
  IN p_position TINYINT
)
BEGIN
  DECLARE existing_id BIGINT;
  SELECT id INTO existing_id FROM batting_stats WHERE match_id=p_match_id AND player_id=p_player_id LIMIT 1;
  IF existing_id IS NULL THEN
    INSERT INTO batting_stats(match_id, player_id, runs, balls, fours, sixes, dismissal, batting_position)
    VALUES(p_match_id, p_player_id, p_runs, p_balls, p_fours, p_sixes, p_dismissal, p_position);
  ELSE
    UPDATE batting_stats
      SET runs=p_runs, balls=p_balls, fours=p_fours, sixes=p_sixes, dismissal=p_dismissal, batting_position=p_position
      WHERE id=existing_id;
  END IF;
END$$

DELIMITER ;
