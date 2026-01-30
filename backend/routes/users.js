import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

dotenv.config();

const router = express.Router();

router.get('/search', requireAuth, async (req, res) => {
  console.log('get     /users/search');
  try {
    const search = req.query.query;

    const result = await pool.query(
      `SELECT email, name, image FROM users WHERE email LIKE $1
      `, [`${search}%`]
    );

    if (result.rows.length > 0) {
      const userList = result.rows;
      res.status(200).json(userList);
    } else {
      res.json([]);
    }

  } catch(err) {
    console.error(err);
    res.status(500).send('Getting user failed lol');
  }
});

export default router;