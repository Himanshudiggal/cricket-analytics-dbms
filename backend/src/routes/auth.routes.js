import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { loginSchema } from '../utils/validators.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const [rows] = await pool.query(
      'SELECT u.id, u.password_hash, u.full_name, r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE email=? LIMIT 1',
      [value.email]
    );
    console.log("Query result:", rows);

    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(value.password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.full_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: user.role, name: user.full_name });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
