🏏 Cricket Analytics Platform

A full-stack cricket statistics and analytics dashboard built using React (Vite), Express.js, and MySQL, featuring real match data imported from Cricsheet.
This project includes player comparison, season analytics, monthly match trends, dark mode, role-based access control, and more.


---

📌 Table of Contents

Overview

Tech Stack

Features

Project Architecture

ER Diagram

SQL Structure

Installation & Setup

Importing Cricsheet Data

API Endpoints

Screenshots

Future Enhancements

Author



---

🌟 Overview

This project is a complete Cricket Analytics System that processes ball-by-ball cricket data and builds an interactive analytics dashboard.
It allows users to:

✔️ View player statistics
✔️ Compare two players
✔️ Track monthly match trends
✔️ View top run-scorers & wicket takers
✔️ View career summaries & season-wise performance
✔️ Enjoy full dark-mode support
✔️ Explore professionally designed UI
✔️ Administer the database using clean APIs


---

🛠 Tech Stack

Frontend

React (Vite)

Recharts (graphs)

Tailwind CSS (custom theme + dark mode)

Framer Motion (animations)


Backend

Node.js

Express.js

MySQL2 (promise wrapper)

JWT Authentication

bcryptjs (password hashing)


Database

MySQL

Views, Stored Procedures, Indexing


Data Source

Cricsheet JSON ball-by-ball datasets
(imported with a custom Node script)



---

🚀 Features

🔑 Authentication

JWT-based login

Role-based access control (analyst, coach, manager, admin)


📊 Dashboard

Total matches, players, recent seasons

Top 5 batters + bowlers

Matches played by month graph


👤 Players Module

Player directory with search

Season-wise batting & bowling stats

Graphical yearly progression


⚔️ Player Comparison

Compare two players on:

Runs per season

Wickets per season


Interactive graphs

Auto-search & selection


📂 Data Import System

Import 1000+ JSON match files from Cricsheet

Automatically insert:

Players

Matches

Deliveries

Player ↔ Match mapping



🌙 Dark Mode

Full sitewide dark mode

Smooth transitions

Tables, charts, UI dynamically theme-aware


📈 Advanced SQL Layer

Views for:

Career stats

Top scorers

Top wicket takers

Player season summaries


Stored Procedure:

Rolling batting form trend (last N innings)




---

🏗 Project Architecture

project/
│── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── db.js
│   │   ├── server.js
│   ├── scripts/
│   │   └── importCricsheet.js
│   ├── package.json
│
│── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   ├── styles.css
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│
│── database/
│   ├── schema.sql
│   ├── views.sql
│   ├── procedures.sql
│   ├── seed.sql
│
└── README.md


---

🧩 ER Diagram

Users (id, email, password_hash, role_id)
Roles (id, name)

Players (id, name, country)

Matches (id, match_date, team1, team2, venue, match_type, season_year)

Deliveries (
  id, match_id, inning, over_ball,
  batsman, bowler,
  runs_batsman, runs_extras, runs_total,
  is_wicket, wicket_player_out, dismissal_kind, team
)

Player_Match_Map (player_id, match_id, team_name)

Relationships:

1:N → Roles → Users

1:N → Players → Deliveries (via batsman/bowler)

1:N → Matches → Deliveries

N:N → Players ↔ Matches (via player_match_map)



---

🗄 SQL Structure

Views

v_player_season_batting

v_player_season_bowling

view_player_career_stats

view_player_yearly_stats

view_top_scorers

view_top_wicket_takers

view_matches_by_month


Stored Procedures

sp_player_form_trend(player_id, n)



---

🔧 Installation & Setup

1️⃣ Clone Repo

git clone https://github.com/<your-username>/<repo>.git
cd project

2️⃣ Install Frontend & Backend Packages

cd backend && npm install
cd ../frontend && npm install

3️⃣ Setup Environment Variables

Create backend/.env:

PORT=5001
JWT_SECRET=supersecret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cricketdb
DB_PORT=3306

4️⃣ Create Database

mysql -u root -p < database/schema.sql
mysql -u root -p cricketdb < database/views.sql
mysql -u root -p cricketdb < database/procedures.sql

Create admin user:

INSERT INTO users (email, password_hash, full_name, role_id)
VALUES (
  'admin@example.com',
  '<hashed_password_here>',
  'Admin User', 
  4
);


---

📥 Import Cricsheet Data

Place Cricsheet JSON files in:

/database/cricsheet/matches/

Run import script:

cd backend
node scripts/importCricsheet.js

This will populate:

players

matches

deliveries

player ↔ match mapping



---

🚀 Run The Project

Backend:

cd backend
npm run dev

Frontend:

cd frontend
npm run dev

Visit: 👉 http://localhost:5173/


---

🧠 API Endpoints

Auth

POST /api/auth/login

Players

GET /api/players
GET /api/players/:id/season-summary
GET /api/players/compare?player1=x&player2=y

Stats

GET /api/stats/batting/alltime
GET /api/stats/bowling/top
GET /api/stats/player/:id/career
GET /api/stats/batting/yearly/:id
GET /api/stats/form-trend/:id
GET /stats/matches-by-month

Dashboard

GET /dashboard/summary
GET /dashboard/top-performers


---

