import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

dotenv.config();

const router = express.Router();

router.get('/all', requireAuth, async (req, res) => {
  console.log('/workspace/all CALLED');
  try {
    const userId = req.user.sub; // Get user ID from the authenticated token
    const result = await pool.query(
      `SELECT * FROM workspaces WHERE owner_id = $1`
    , [userId]);

    if (result.rows.length > 0) {
      const userWorkspaces = result.rows;
      res.send(userWorkspaces);
    } else {
      console.log('Unfortunately, I dont have a spare workspace for you..');
      res.send([]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send('Fetching workspaces failed lol');
  }
})

router.post('/new', requireAuth, async (req, res) => {
  try {
    console.log('/new CALLED.');

    const title = req.body.title;
    const owner = req.user.sub;

    const result = await pool.query(
      `INSERT INTO workspaces (title, owner_id) VALUES ($1, $2) RETURNING *`,
      [title, owner]
    );

    if (result.rows.length > 0) {
      const newWorkspace = result.rows[0];
      res.status(201).json(newWorkspace);
    } else {
      res.status(400).json({ success: false, message: "Insert failed" });
    }

  } catch(err) {
    console.error(err);
    res.status(500).send('Creating new workspace failed lol');
  }
})

router.get('/:id', async (req, res) => {

})

router.put('/:id', requireAuth, async (req, res) => {
  console.log('/id CALLED');
  try {
    const title = req.body.title;
    const id = req.body.id;
    const owner = req.user.sub;

    const result = await pool.query(
      `UPDATE workspaces SET title = $1 WHERE id = $2 AND owner_id = $3 RETURNING *`,
      [title, id, owner]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Workspace not found.' })
    }

    console.log('Edited workspace: ', JSON.stringify(result.rows[0]));
    res.json(result.rows[0]);
  }catch(err) {
    console.error(err);
    res.status(500).send('Editing workspace title failed lol');
  }
})

export default router;