import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import playerRoutes from './routes/players.routes.js';
import statsRoutes from './routes/stats.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { pool } from './db.js'; // ✅ Using mysql2/promise

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ status: 'db_error', error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 5001;

// ✅ Async startup using promises
const startServer = async () => {
  try {
    const [rows] = await pool.query('SELECT DATABASE() AS db;');
    console.log('✅ Connected to Database:', rows[0].db);
    app.listen(port, () => console.log(`🚀 API running on :${port}`));
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err.message);
    process.exit(1);
  }
};

startServer();
