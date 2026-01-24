import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import axios from 'axios';

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
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('/board/new');

    const owner = req.user.sub;

    const workspace_id = req.body.workspace_id;
    const name = req.body.name;
    const colors = req.body.colors;

    const result = await client.query(
      `INSERT INTO boards (name, workspace_id, owner_id, colors)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, workspace_id, owner, colors]
    );

    if (result.rows.length > 0) {
      const newBoard = result.rows[0];

      // Adding default labels for newly created board
      const board_id = newBoard.id;
      const colorList = [
        '#d6f5e3', 
        '#f0f4b1', 
        '#fde8b8', 
        '#ffd1c1', 
        '#f0d5fa', 
        '#d6e4ff', 
        '#cdeff7', 
        '#e6e6e6'
      ];

      for (const color of colorList) {
        await client.query(
          `INSERT INTO labels (board_id, color)
          VALUES ($1, $2)`,
          [board_id, color]
        );
      };

      await client.query('COMMIT');

      res.status(201).json(newBoard);
    } else {
      res.status(400).json({ success: false, message: 'board creation failed' });
    }

  } catch(err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Error creating a new board lol');
  } finally {
    client.release();
  }
})

router.patch('/column/:id', requireAuth, async (req, res) => {
  console.log('patch     /column/id');
  try {

    const allowedFields = ['name', 'color', 'position'];

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

    const column_id = req.params.id;

    values.push(column_id);

    const query = `
      UPDATE columns
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch(err) {
    console.error(err);
    res.status(500).send('Updating column failed lol');
  }
});

router.delete('/column/:id', requireAuth, async (req, res) => {
  console.log('/column/delete');
  try {

    const column_id = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM columns WHERE id = $1
      `, [column_id]);

    if (result.rowCount === 0) {
      res.status(404).send({ error: 'Column not found' });
    }

    res.status(204);

  } catch(err) {
    console.log(err);
    res.status(400).send('Unable to delete column lol');
  }
});

router.get('/:id/all', requireAuth, async (req, res) => {
  console.log('/id/all');
  try {
    const board_id = req.params.id;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.name,
        b.colors,
        b.created_at,

        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', c.id,
              'name', c.name,
              'color', c.color,
              'position', c.position,
              'cards', COALESCE(cards.cards, '[]'::jsonb)
            )
            ORDER BY c.position
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::jsonb
        ) AS columns

      FROM boards b

      LEFT JOIN columns c
        ON c.board_id = b.id

      LEFT JOIN LATERAL (
        SELECT
          jsonb_agg(
            jsonb_build_object(
              'id', ca.id,
              'title', ca.title,
              'description', ca.description,
              'position', ca.position,
              'comments', COALESCE(comments.comments, '[]'::jsonb)
            )
            ORDER BY ca.position
          ) AS cards
        FROM cards ca

        LEFT JOIN LATERAL (
          SELECT
            jsonb_agg(
              jsonb_build_object(
                'id', co.id,
                'title', co.title,
                'owner_id', co.owner_id,
                'created_at', co.created_at
              )
              ORDER BY co.created_at
            ) AS comments
          FROM comments co
          WHERE co.card_id = ca.id
        ) comments ON TRUE

        WHERE ca.column_id = c.id
      ) cards ON TRUE

      WHERE b.id = $1
      GROUP BY b.id;
    `, 
    [board_id]);

    if (result.rows.length > 0) {
      const data = result.rows[0];
      res.status(200).send(data);
    }

  } catch(err){
    console.error(err);
    res.status(500).send('Getting board data failed lol');
  }
})

router.get('/:id', requireAuth, async(req, res) => {
  console.log('/boards/id');
  try {
    const userId = req.user.sub;
    const board_id = req.params.id;

    console.log('user: boardID');
    console.log(userId, board_id);

    // TODO: fetch columns, cards
    const result = await pool.query(
      `SELECT * FROM boards WHERE owner_id = $1 AND id = $2`
    , [userId, board_id]);

    if (result.rows.length > 0) {
      const boards = result.rows[0];
      res.send(boards);
    } else {
      console.log('No board found');
      res.send([]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send('Getting board data failed lol');
  }
})

router.patch('/:id', requireAuth, async(req, res) => {
  console.log('patch  /boards/id');
  try {

    const allowedFields = ['name', 'colors'];

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

    const owner = req.user.sub;
    const board_id = req.params.id;

    values.push(board_id, owner);

    const query = `
      UPDATE boards
      SET ${updates.join(', ')}
      WHERE id = $${index} AND owner_id = $${index + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json(result.rows[0]);
    
  } catch(err) {
    console.error(err);
    res.status(500).send('Updating board failed lol');
  }
})

router.get('/:id/columns', requireAuth, async (req, res) => {
  console.log('/columns');
  try {
    const boardId = req.params.id;

    const result = await pool.query(
      `SELECT * FROM columns WHERE board_id = $1`,
      [boardId]
    );

    if (result.rows.length > 0) {
      const columns = result.rows;
      res.status(200).send(columns);
    } else {
      console.log('Columns not found');
      res.send([]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send('Fetching columns failed lol');
  }
})

// creates a default column each time the Add column button is clicked
router.post('/:id/columns/new', requireAuth, async (req, res) => {
  console.log('/columns/new');
  try {
    const boardId = req.params.id;

    const position = req.body.position;

    const name = 'New Column';
    const color = 'rgb(245, 245, 245)';

    const result = await pool.query(
      `INSERT INTO columns (name, color, board_id, position) VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [name, color, boardId, position]
    );

    if (result.rows.length > 0) {
      const newColumn = result.rows[0];
      res.status(201).json(newColumn);
    } else {
      res.status(400).json({ success: false, message: "Insert failed" });
    }

  } catch(err) {
    console.error(err);
    res.status(500).send('Creating new column failed lol');
  }
});

router.post('/:id/labels', requireAuth, async (req, res) => {
  console.log('post     /id/labels');
  try {
    const board_id = req.params.id;

    const text = req.body.text;
    const color = req.body.color;

    const result = await pool.query(
      `INSERT INTO labels (text, color, board_id)
      VALUES ($1, $2, $3) RETURNING *`,
      [text, color, board_id]
    );

    if (result.rows.length > 0) {
      const newLabel = result.rows[0];
      res.status(200).json(newLabel);
    } else {
      res.status(400).json({ success: false, message: "Insertion failed" });
    }

  } catch(err) {
    console.error(err);
    res.status(500).send('Creating label failed lol');
  }
});

router.get('/:id/labels', requireAuth, async (req, res) => {
  console.log('get     /id/labels');
  try {
    const board_id = req.params.id;

    const result = await pool.query(
      `SELECT * from labels WHERE board_id = $1`
      , [board_id]
    );

    if (result.rows.length > 0) {
      const labels = result.rows;
      res.status(200).send(labels);
    } else {
      console.log('No label found.');
      res.status(404).send([]);
    }

  } catch(err) {
    console.error(err);
    res.status(500).send('Getting labels failed lol');
  }
});

router.delete('/labels/:id', requireAuth, async (req, res) => {
  console.log('delete     /labels/id');
  try {
    const label_id = req.params.id;
    const board_id = req.body.board_id;

    const result = await pool.query(
      `DELETE FROM labels WHERE id = $1 AND board_id = $2`,
      [label_id, board_id]
    );

    if (result.rowCount === 0) {
      res.status(404).send({ error: 'label not found' });
    }

    res.status(204);

  } catch(err) {
    console.error(err);
    res.status(400).send('Unable to delete label lol');
  }
});

router.patch('/labels/:id', requireAuth, async (req, res) => {
  console.log('patch     /labels/id');
  try {

    const allowedFields = ['text', 'color'];

    const updates = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      // prevents user from making malicious requests
      if (!allowedFields.includes(key)) continue;
      
      // skip board_id as it's used in WHERE clause, not SET
      if (key === 'board_id') continue;

      updates.push(`${key} = $${index}`);
      values.push(value);

      index ++;
    };

    // prevents empty requests which would crash the server
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const board_id = req.body.board_id;
    const label_id = req.params.id;

    values.push(label_id, board_id);

    const query = `
      UPDATE labels
      SET ${updates.join(', ')}
      WHERE id = $${index} AND board_id = $${index + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'label not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch(err) {
    console.error(err);
    res.status(500).send('Updating label failed lol');
  }
});

export default router;