import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { loginSchema } from '../utils/validators.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      console.log("Validation error:", error.message);
      return res.status(400).json({ message: error.message });
    }

    // Query user by email
    const [rows] = await pool.query(
      'SELECT u.id, u.password_hash, u.full_name, r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE email=? LIMIT 1',
      [value.email]
    );

    console.log("Email received:", value.email);
    console.log("Query result:", rows);

    // If no user found
    if (!rows.length) {
      console.log("No user found for email:", value.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare password
    console.log("Password hash from DB:", user.password_hash);
    const valid = await bcrypt.compare(value.password, user.password_hash);
    console.log("Password valid:", valid);

    if (!valid) {
      console.log("Password check failed for:", value.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.full_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log("Login successful for:", value.email);
    res.json({ token, role: user.role, name: user.full_name });

  } catch (e) {
    console.error("Login error:", e.message);
    res.status(500).json({ message: e.message });
  }
});

export default router;
