import express from 'express';
import dotenv from 'dotenv';
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

router.get('/current', requireAuth, async (req, res) => {
  console.log('/workspaces/current');
  try {
    const userId = req.user.sub;

    const result = await pool.query(
      `
      SELECT w.*
      FROM workspaces w
      INNER JOIN users u
        ON u.current_workspace = w.id
      WHERE u.id = $1
      `,
      [userId]
    );
    const workspace = result.rows[0];

    res.status(200).send(workspace);

  }catch(err) {
    console.error(err);
    res.status(500).send('Fetching default workspace failed lol');
  }
});

router.post('/current', requireAuth, async (req, res) => {
  console.log('/workspaces/current');
  try {
    const userId = req.user.sub;
    const workspace_id = req.body.workspace_id;

    const result = await pool.query(
    `  
    UPDATE users
    SET current_workspace = $1
    WHERE id = $2
    `, [workspace_id, userId]);

    if (result.rowCount > 0) {
      res.status(200).json({ success: true, message: 'current workspace successfully set'});
    } else {
      res.status(400).json({ success: false, message: 'current workspace NOT set'});
    }

  }catch(err) {
    console.error(err);
    res.status(500).send('Setting default workspace failed lol');
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  console.log('delete workspace/id');

  const workspaceIdToDelete = req.params.id;
  const userId = req.user.sub;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get all user workspaces
    const { rows: workspaces } = await client.query(
      `SELECT id FROM workspaces WHERE owner_id = $1`,
      [userId]
    );

    if (workspaces.length <= 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "Cannot delete user's only workspace" });
    }

    // Check current workspace
    const { rows: userRows } = await client.query(
      `SELECT current_workspace FROM users WHERE id = $1`,
      [userId]
    );

    const currentWorkspaceId = userRows[0].current_workspace;

    let newCurrentWorkspaceId = currentWorkspaceId;

    // If deleting the current workspace, pick another one
    if (currentWorkspaceId === workspaceIdToDelete) {
      const alternative = workspaces.find(w => w.id !== workspaceIdToDelete);

      if (!alternative) {
        await client.query('ROLLBACK');
        return res.status(500).json({ message: 'No alternative workspace found' });
      }

      newCurrentWorkspaceId = alternative.id;

      await client.query(
        `UPDATE users SET current_workspace = $1 WHERE id = $2`,
        [newCurrentWorkspaceId, userId]
      );
    }

    // Delete workspace
    const deleteResult = await client.query(
      `DELETE FROM workspaces WHERE id = $1 AND owner_id = $2`,
      [workspaceIdToDelete, userId]
    );

    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Workspace not found' });
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Workspace deleted',
      currentWorkspace: newCurrentWorkspaceId, // url to redirect to
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Unable to delete workspace');

  } finally {
    client.release();
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  console.log('/workspace/id');
  try {
    const userId = req.user.sub;
    const workspace_id = req.params.id;

    const result = await pool.query(
      `SELECT * FROM workspaces WHERE owner_id = $1 AND id = $2`
    , [userId, workspace_id]);

    if (result.rows.length > 0) {
      const workspace = result.rows[0];
      res.status(200).send(workspace);
    } else {
      console.log('No workspace found');
      res.send([]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send('Getting workspace data failed lol');
  }
});

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
  } catch(err) {
    console.error(err);
    res.status(500).send('Editing workspace title failed lol');
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  console.log('patch   /workspaces/id');
  try {
    const allowedFields = ['title', 'theme', 'members', 'darkMode'];

    const updates = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      if (!allowedFields.includes(key)) continue;

      updates.push(`"${key}" = $${index}`);
      values.push(value);

      index ++;
    };

    // prevents empty requests which will crash the server
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const owner = req.user.sub;
    const workspace_id = req.params.id;

    values.push(workspace_id, owner);

    const query = `
      UPDATE workspaces
      SET ${updates.join(', ')}
      WHERE id = $${index} AND owner_id = $${index +1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch(err) {
    console.error(err);
    res.status(500).send('Updating board failed lol');
  }
});

export default router;