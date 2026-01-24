import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

dotenv.config();

const router = express.Router();

router.post('/new', requireAuth, async (req, res) => {
  console.log('post     /cards/new');
  try {

    const owner = req.user.sub;
    const column_id = req.body.column_id;
    const title = req.body.title;
    const position = req.body.position;

    const result = await pool.query(`
      INSERT INTO cards (title, column_id, owner_id, position)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, column_id, owner, position]);

    if (result.rows.length > 0) {
      const newCard = result.rows[0];
      res.status(201).json(newCard);
    } else {
      res.status(400).json({ success: false, message: 'Card creation failed' });
    }

  } catch(err) {
    console.err(err);
    res.status(500).send('Error creating a new card lol');
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  console.log('delete     /cards');
  try {

    const card_id = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM cards WHERE id = $1
      `, [card_id]);

    if (result.rowCount === 0) {
      res.status(404).send({ error: 'Card not found' });
    }

    res.status(204);

  } catch(err) {
    console.log(err);
    res.status(400).send('Unable to delete card lol');
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  console.log('patch     /cards/id');
  try {
    const allowedFields = ['title', 'description', 'position', 'column_id'];

    const updates = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      // prevents user from making malicious requests
      if (!allowedFields.includes(key)) continue;

      updates.push(`${key} = $${index}`);
      values.push(value);

      index ++;
    };

    // prevents empty requests which will crash the server
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const card_id = req.params.id;
    values.push(card_id);

    const query = `
      UPDATE cards
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch(err) {
    console.error(err);
    res.status(500).send('Updating cards failed lol');
  }
});

router.delete('/comment/:id', requireAuth, async (req, res) => {
  console.log('delete     /cards/comment/id');
  try {

    const comment_id = req.params.id;

    const result = await pool.query(
      `DELETE FROM comments WHERE id = $1`,
      [comment_id]
    );

    if (result.rowCount === 0) {
      res.status(404).send({ error: 'Comment not found' });
    }

    res.status(204);

  } catch(err) {
    console.log(err);
    res.status(400).send('Unable to delete comment lol');
  }
});

router.patch('/comment/:id', requireAuth, async (req, res) => {
  console.log('patch     /comment/id');
  try {
    const allowedFields = ['title'];

    const updates = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      // prevents user from making malicious requests
      if (!allowedFields.includes(key)) continue;

      updates.push(`${key} = $${index}`);
      values.push(value);

      index ++;
    };

    // prevents empty requests which will crash the server
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const comment_id = req.params.id;

    values.push(comment_id);

    const query = `
      UPDATE comments
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch(err) {
    console.error(err);
    res.status(500).send('Updating comment failed lol');
  }
})

router.post('/:id/comment', requireAuth, async (req, res) => {
  console.log('cards/id/comment');
  try {
    const owner = req.user.sub;

    const card_id = req.params.id;
    const title = req.body.title;

    const result = await pool.query(
      `INSERT INTO comments (title, card_id, owner_id)
      VALUES ($1, $2, $3) RETURNING *
      `, [title, card_id, owner]
    );

    if (result.rows.length > 0) {
      const newComment = result.rows[0];
      res.status(201).json(newComment);
    } else {
      res.status(400).json({ success: false, message: 'Comment creation failed' });
    }

  } catch(err) {
    console.err(err);
    res.status(500).send('Error creating a new comment lol');
  }
});

// TODO: Does not work when label_ids is empty
router.post('/:id/labels', requireAuth, async (req, res) => {
  console.log('post     /id/labels');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const card_id = req.params.id;
    const label_ids = req.body.label_ids;

    await client.query(
      `DELETE FROM card_labels
      WHERE card_id = $1`,
      [card_id]
    );

    // If all labels are empty, then we don't need to add anything.
    if (label_ids.length === 0) {
      await client.query('COMMIT');
      return;
    }

    const result = await client.query(
      `INSERT INTO card_labels (card_id, label_id) 
      SELECT $1, UNNEST($2::uuid[]) 
      RETURNING *`,
      [card_id, label_ids]
    );

    await client.query('COMMIT');

    if (result.rows.length > 0) {
      const newCardLabels = result.rows;
      res.status(200).json(newCardLabels);
    } else {
      res.status(400).json({ success: false, message: "Insertion failed" });
    }

  } catch(err) {
    console.error(err);
    await client.query('ROLLBACK');
    res.status(500).send('Getting card labels failed lol');
  } finally {
    client.release();
  }
});

router.get('/:id/labels', requireAuth, async (req, res) => {
  console.log('get     /id/labels');
  try {
    const card_id = req.params.id;
    
    const result = await pool.query(
      `SELECT l.id, l.text, l.color 
      FROM labels l
      JOIN card_labels cl ON cl.label_id = l.id 
      WHERE card_id = $1`
      , [card_id]
    );

    if (result.rows.length > 0) {
      const cardLabels = result.rows;
      res.status(200).send(cardLabels);
    } else {
      res.json([]);
    }

  } catch(err) {
    console.error(err);
    res.status(500).send('Getting card label failed lol');
  }
});

export default router;