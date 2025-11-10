// ✅ Imports
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

// ✅ Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MySQL connection
const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Kaddu@123', // change if needed
  database: 'cricketdb'
});

// ✅ Folder containing JSON
const folder = path.join(__dirname, '../../database/cricsheet/matches');
if (!fs.existsSync(folder)) {
  console.error(`❌ Folder not found: ${folder}`);
  process.exit(1);
}

const files = fs.readdirSync(folder).filter(f => f.endsWith('.json'));
if (!files.length) {
  console.error('❌ No JSON files found.');
  process.exit(1);
}

console.log(`📂 Found ${files.length} Cricsheet JSON files...`);

let matchCount = 0;
const playerSet = new Set();
const playerMatchLinks = [];

// ✅ Utility: get or insert player ID
async function getPlayerId(name) {
  if (!name) return null;
  const [rows] = await pool.query('SELECT id FROM players WHERE name=?', [name]);
  if (rows.length) return rows[0].id;

  const [insert] = await pool.query('INSERT IGNORE INTO players (name) VALUES (?)', [name]);
  return insert.insertId || (await getPlayerId(name)); // re-fetch after insert
}

// ✅ Start processing
for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
    const info = data.info || {};
    const teams = info.teams || ['Unknown', 'Unknown'];
    const date = info.dates?.[0] || null;
    const venue = info.venue || info.city || 'Unknown';
    const matchType = info.match_type || 'Unknown';
    const seasonYear = date ? new Date(date).getFullYear() : null;

    // ✅ Insert match
    const [matchInsert] = await pool.query(
      `INSERT INTO matches (match_date, team1, team2, venue, match_type, season_year)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [date, teams[0], teams[1], venue, matchType, seasonYear]
    );
    const matchId = matchInsert.insertId;

    // ✅ Insert players into players table + player_match_map
    if (info.players) {
      for (const [team, players] of Object.entries(info.players)) {
        for (const player of players) {
          playerSet.add(player);
          const playerId = await getPlayerId(player);
          if (playerId) {
            playerMatchLinks.push({ playerId, matchId, teamName: team });
          }
        }
      }
    }

    // ✅ Process innings + deliveries
    let inningNum = 1;
    for (const innings of data.innings || []) {
      const team = innings.team || `Team${inningNum}`;
      const overs = innings.overs || [];

      for (const over of overs) {
        for (const [i, delivery] of (over.deliveries || []).entries()) {
          const overBall = `${over.over}.${i + 1}`;
          const batter = delivery.batter || delivery.batsman;
          const bowler = delivery.bowler;
          const runs = delivery.runs || {};
          const isWicket = !!delivery.wicket;
          const wicketPlayerOut = delivery.wicket?.player_out || null;
          const dismissalKind = delivery.wicket?.kind || null;

          // ✅ Track players
          if (batter) playerSet.add(batter);
          if (bowler) playerSet.add(bowler);
          if (wicketPlayerOut) playerSet.add(wicketPlayerOut);

          // ✅ Insert delivery
          await pool.query(
            `INSERT INTO deliveries 
            (match_id, inning, over_ball, batsman, bowler, runs_batsman, runs_extras, runs_total,
             is_wicket, wicket_player_out, dismissal_kind, team)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              matchId,
              inningNum,
              overBall,
              batter,
              bowler,
              runs.batter || 0,
              runs.extras || 0,
              runs.total || 0,
              isWicket,
              wicketPlayerOut,
              dismissalKind,
              team
            ]
          );
        }
      }
      inningNum++;
    }

    matchCount++;
    console.log(`✅ Imported match ${matchCount}: ${teams.join(' vs ')} (${date})`);
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
  }
}

// ✅ Insert unique players (fallback)
console.log(`\n👤 Found ${playerSet.size} unique players — inserting...`);
for (const player of playerSet) {
  await pool.query('INSERT IGNORE INTO players (name) VALUES (?)', [player]);
}

// ✅ Insert player ↔ match ↔ team links
console.log(`🔗 Linking players to matches...`);
for (const link of playerMatchLinks) {
  await pool.query(
    'INSERT INTO player_match_map (player_id, match_id, team_name) VALUES (?, ?, ?)',
    [link.playerId, link.matchId, link.teamName]
  );
}

await pool.end();
console.log(`🎉 Imported ${matchCount} matches, ${playerSet.size} players, and ${playerMatchLinks.length} player-match links into cricketdb!`);
