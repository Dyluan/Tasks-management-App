import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

dotenv.config();

const router = express.Router();

router.get('/all', requireAuth, async (req, res) => {
  console.log('/boards/all');
  try {
    const userId = req.user.sub;
    const workspace_id = req.query.workspace_id;

    const result = await pool.query(
      `SELECT * FROM boards WHERE owner_id = $1 AND workspace_id = $2`
    , [userId, workspace_id]);

    if (result.rows.length > 0) {
      const boards = result.rows;
      res.send(boards);
    } else {
      console.log('No board found for said workspace');
      res.send([]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send('Fetching workspaces failed lol');
  }
})

router.post('/new', requireAuth, async(req, res) => {
  try {
    console.log('/board/new');

    const owner = req.user.sub;

    const workspace_id = req.body.workspace_id;
    const name = req.body.name;
    const colors = req.body.colors;

    const result = await pool.query(
      `INSERT INTO boards (name, workspace_id, owner_id, colors)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, workspace_id, owner, colors]
    );

    if (result.rows.length > 0) {
      const newBoard = result.rows[0];
      res.status(201).json(newBoard);
    } else {
      res.status(400).json({ success: false, message: 'board creation failed' });
    }

  } catch(err) {
    console.err(err);
    res.status(500).send('Error creating a new board lol');
  }
})

router.get('/:id', requireAuth, async(req, res) => {
  console.log('/boards/id');
  try {
    const userId = req.user.sub;
    const board_id = req.query.id;

    console.log('user: boardID');
    console.log(userId, board_id);

    // TODO: fetch columns, cards
    const result = await pool.query(
      `SELECT * FROM boards WHERE owner_id = $1 AND id = $2`
    , [userId, workspace_id]);

    if (result.rows.length > 0) {
      const boards = result.rows;
      res.send(boards);
    } else {
      console.log('No board found');
      res.send([]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send('Fetching workspaces failed lol');
  }
})

export default router;