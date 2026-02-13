import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

dotenv.config();

const router = express.Router();

router.get('/search/:user', requireAuth, async (req, res) => {
  console.log('get     /users/search/id');
  try {
    const searchedUser = req.params.user;

    const result = await pool.query(
      `SELECT * FROM users WHERE name = $1`
      , [searchedUser]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json(user);
    } else {
      res.json({});
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Getting user failed lol');
  }
});

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

  } catch (err) {
    console.error(err);
    res.status(500).send('Getting user failed lol');
  }
});

router.post('/recent_boards', requireAuth, async (req, res) => {
  console.log('post     /recent_boards');

  const userId = req.user.sub;
  const boards = req.body.boards;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE users SET recent_boards = $1
      WHERE id = $2 RETURNING recent_boards`, [boards, userId]
    );

    await client.query('COMMIT');

    if (result.rows.length > 0) {
      const newBoards = result.rows[0].recent_boards;
      res.status(201).json(newBoards);
    } else {
      res.status(400).json({ success: false, message: 'Recent boards creation failed' });
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Unable to post recent boards');
  } finally {
    client.release();
  }

})

router.get('/recent_boards', requireAuth, async (req, res) => {
  console.log('get    /recent_boards');
  try {
    const user_id = req.user.sub;

    const result = await pool.query(
      `SELECT recent_boards FROM users WHERE id = $1`
      , [user_id]
    );

    if (result.rows.length > 0) {
      const recent_boards = result.rows[0].recent_boards;
      res.status(200).json(recent_boards);
    } else {
      res.json([]);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Getting recent_boards failed lol');
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  console.log('get     /:id');
  try {
    const user_id = req.params.id;

    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`
      , [user_id]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).send(user);
    } else {
      console.log('No user found');
      res.send([]);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Getting user data failed lol');
  }
});

router.patch('/:id/edit', requireAuth, async (req, res) => {
  console.log('patch     /:id/edit');
  try {
    const allowedFields = ['name', 'image', 'full_name', 'bio', 'phone_number'];

    const updates = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      if (!allowedFields.includes(key)) continue;

      updates.push(`"${key}" = $${index}`);
      values.push(value);

      index++;
    };

    // prevents empty requests which will crash the server
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const user_id = req.params.id;

    values.push(user_id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Updating user failed lol');
  }
});

export default router;