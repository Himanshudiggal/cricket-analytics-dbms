DELIMITER $$

CREATE PROCEDURE sp_player_form_trend(
    IN p_player_id INT,
    IN p_n INT
)
BEGIN
    /*
      Returns the last p_n matches for the player
      with average runs over those matches
    */
    SELECT
        m.match_date,
        b.runs,
        (
          SELECT AVG(b2.runs)
          FROM batting_stats b2
          JOIN matches m2 ON m2.id = b2.match_id
          WHERE b2.player_id = p_player_id
          AND m2.match_date >= DATE_SUB(m.match_date, INTERVAL p_n DAY)
        ) AS rolling_avg_runs
    FROM batting_stats b
    JOIN matches m ON m.id = b.match_id
    WHERE b.player_id = p_player_id
    ORDER BY m.match_date DESC
    LIMIT p_n;
END $$

DELIMITER ;
