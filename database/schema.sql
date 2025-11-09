DROP DATABASE IF EXISTS cricketdb;
CREATE DATABASE cricketdb;
USE cricketdb;

-- USERS & ROLES
CREATE TABLE roles (
  id TINYINT PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role_id TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- CORE ENTITIES
CREATE TABLE seasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(16) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  batting_style VARCHAR(32),
  bowling_style VARCHAR(32),
  dob DATE,
  country VARCHAR(64)
);

CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  season_id INT NOT NULL,
  match_date DATE NOT NULL,
  venue VARCHAR(120),
  opposition VARCHAR(120),
  format ENUM('T20','ODI','TEST') NOT NULL,
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

-- FACT TABLES
CREATE TABLE batting_stats (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  runs INT NOT NULL DEFAULT 0,
  balls INT NOT NULL DEFAULT 0,
  fours INT NOT NULL DEFAULT 0,
  sixes INT NOT NULL DEFAULT 0,
  dismissal VARCHAR(32),
  batting_position TINYINT,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE bowling_stats (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  overs DECIMAL(4,1) NOT NULL DEFAULT 0.0,
  maidens TINYINT NOT NULL DEFAULT 0,
  runs_conceded INT NOT NULL DEFAULT 0,
  wickets TINYINT NOT NULL DEFAULT 0,
  economy DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN overs > 0 THEN runs_conceded / (FLOOR(overs) + (overs - FLOOR(overs)) * 10/6) ELSE NULL END
  ) STORED,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- INDEXES
CREATE INDEX idx_players_name ON players(full_name);
CREATE INDEX idx_matches_season_date ON matches(season_id, match_date);
CREATE INDEX idx_batting_player ON batting_stats(player_id, match_id);
CREATE INDEX idx_bowling_player ON bowling_stats(player_id, match_id);
