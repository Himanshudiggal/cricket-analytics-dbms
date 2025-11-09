INSERT INTO roles(id, name) VALUES (1,'analyst'),(2,'coach'),(3,'manager'),(9,'admin');

INSERT INTO seasons(label, start_date, end_date) VALUES
('2024','2024-01-01','2024-12-31'),
('2025','2025-01-01','2025-12-31');

INSERT INTO players(full_name, batting_style, bowling_style, dob, country) VALUES
('Virat Kumar','Right-hand bat','Right-arm medium','1990-01-01','India'),
('Ravi Singh','Left-hand bat','Left-arm orthodox','1994-08-15','India');

INSERT INTO matches(season_id, match_date, venue, opposition, format) VALUES
(1,'2024-03-01','Mumbai','Australia','ODI'),
(1,'2024-03-05','Delhi','Australia','ODI'),
(2,'2025-02-10','Chennai','England','T20');

INSERT INTO batting_stats(match_id, player_id, runs, balls, fours, sixes, dismissal, batting_position) VALUES
(1,1,85,90,8,1,'c',3),
(2,1,12,25,1,0,'b',3),
(3,1,60,35,6,2,'not out',3),
(1,2,30,40,3,0,'lbw',4),
(2,2,48,55,4,1,'c',4),
(3,2,22,18,2,1,'b',4);

INSERT INTO bowling_stats(match_id, player_id, overs, maidens, runs_conceded, wickets) VALUES
(1,2,8.0,0,45,1),
(2,2,9.0,1,40,2),
(3,2,3.0,0,28,0);
