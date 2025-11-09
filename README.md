# Cricket Player Performance Analytics Platform (MVP)

Full-stack cricket analytics portal using **React (Vite)**, **Express.js**, and **MySQL**. 
Includes role-based auth, views, indexes, stored procedures, charts, and filters.

## Quick Start

### 1) MySQL
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p cricketdb < database/views.sql
mysql -u root -p cricketdb < database/procedures.sql
mysql -u root -p cricketdb < database/seed.sql
```
Create admin user (password: `Admin@123`):
```sql
INSERT INTO users(email, password_hash, full_name, role_id)
VALUES ('admin@example.com', '$2a$10$2nH5Zx0H6w2dQk4l2N2D7e0Ff3vQFQy2oQ0Jx8iVnQ2p2W3Vf3m8C', 'Admin User', 9);
```

### 2) Backend
```bash
cd backend
cp .env.example .env   # fill values if needed
npm i
npm run dev
```

### 3) Frontend
```bash
cd frontend
npm i
# create .env: VITE_API_BASE=http://localhost:5000/api  (if backend is different)
npm run dev
```
Open http://localhost:5173

---

## Notes
- JWT RBAC, basic validations.
- Procedures & views aimed to be DBMS-lab friendly.
- Extend with CSV import, caching, pagination, Docker, etc.

---

## Badges
![CI](https://img.shields.io/github/actions/workflow/status/your-username/cricket-analytics/ci.yml?branch=main)
![License](https://img.shields.io/badge/license-MIT-green)

## Repo Setup
```bash
git init
git add .
git commit -m "feat: initial commit – cricket analytics MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/cricket-analytics.git
git push -u origin main
```

## Project Scripts
- Backend: `npm run dev` / `npm start`
- Frontend: `npm run dev` / `npm run build`

## Folder Overview
- `database/` – schema, views, stored procedures, seed
- `backend/` – Express API, RBAC, routes
- `frontend/` – React + Vite UI, charts

## Roadmap
- [ ] CSV import (admin)
- [ ] Pagination + server-side filters
- [ ] Docker Compose
- [ ] More analytical views & procs


## 🎨 Tailwind CSS Added
Now includes full Tailwind setup for presentation-ready styling.
Run `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p` if not done automatically.
