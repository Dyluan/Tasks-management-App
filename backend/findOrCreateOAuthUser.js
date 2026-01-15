import pool from './db.js';

export async function findOrCreateOAuthUser({
  provider,
  providerUserId,
  email,
  name,
  avatar
}) {
  
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('------------------------');
    console.log('findOrCreateOAuth user called. Here are the params:');
    console.log(`${provider} + ${providerUserId} + ${email} + ${name} + ${avatar}`);
    console.log('------------------------');

    // Does this OAuth identity already exist?
    const identityRes = await client.query(
      `
      SELECT users.*
      FROM auth_identities
      JOIN users ON users.id = auth_identities.user_id
      WHERE auth_identities.provider = $1
      AND auth_identities.provider_user_id = $2
      `,
      [provider, providerUserId]
    );

    if (identityRes.rows.length > 0) {
      await client.query('COMMIT');
      return identityRes.rows[0]; // user already exists
    }

    // Maybe same email already exists (password signup first)
    let userRes = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    let user;
    let isNewUser = false;

    if (userRes.rows.length > 0) {
      user = userRes.rows[0];
    } else {
      // Create user
      const newUser = await client.query(
        `
        INSERT INTO users (name, email, image, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [name, email, avatar, 'OAUTH']   // no real password
      );

      user = newUser.rows[0];
      isNewUser = true;
    }

    // Create auth identity
    await client.query(
      `
      INSERT INTO auth_identities
        (user_id, provider, provider_user_id)
      VALUES ($1, $2, $3)
      `,
      [user.id, provider, providerUserId]
    );

    // Create default workspace for new users
    if (isNewUser) {
      await client.query(
        `
        INSERT INTO workspaces (title, owner_id)
        VALUES ($1, $2)
        `,
        ['My Workspace', user.id]
      );
    }

    await client.query('COMMIT');
    return user;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}