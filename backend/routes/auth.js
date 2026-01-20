import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { findOrCreateOAuthUser } from '../findOrCreateOAuthUser.js';
import pool from '../db.js';
import bcrypt from 'bcrypt';

dotenv.config();

const PORT = Number(process.env.PORT);
const BASE_URL = `http://localhost:${PORT}`;

const router = express.Router();

const SALT_ROUNDS = 12;

router.get('/github/login', (req, res) => {
  const redirectUrl = 'https://github.com/login/oauth/authorize' + 
    `?client_id=${process.env.GITHUB_CLIENT_ID}` + 
    `&scope=read:user user:email`;

  res.redirect(redirectUrl);
})

router.get('/github/callback', async (req, res) => {
  try {
    const code = req.query.code;

    // exchange code for tokens
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const accessToken = tokenRes.data.access_token;

    // get github user
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // have to call this endpoint to access user's email
    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const emails= emailRes.data;
    const primaryMail = emails.find(e => e.primary && e.verified)?.email;

    const githubUser = userRes.data;

    const user = await findOrCreateOAuthUser({
      provider: 'github',
      providerUserId: githubUser.id,
      // email: githubUser.email,
      // FAKE email in case github doesnt send user's one
      email: primaryMail || `${githubUser.id}@github.local`,
      name: githubUser.login,
      avatar: githubUser.avatar_url
    });

    // create JWT
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // redirect to front
    res.redirect(`http://localhost:3000/home?token=${token}`);

  } catch(err) {
    console.log(err);
    res.status(500).send('Github login failed lol');
  }
});

router.get('/facebook/login', (req, res) => {
  const redirectUrl = `https://www.facebook.com/v24.0/dialog/oauth?` + 
    `client_id=${process.env.FB_CLIENT_ID}` + 
    `&redirect_uri=${BASE_URL}/auth/facebook/callback&scope=email,public_profile`;
  
  res.redirect(redirectUrl);
});

router.get('/facebook/callback', async(req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.get(
      `https://graph.facebook.com/v24.0/oauth/access_token`,
      {
        params: {
          client_id: `${process.env.FB_CLIENT_ID}`,
          client_secret: `${process.env.FB_CLIENT_SECRET}`,
          redirect_uri: `${BASE_URL}/auth/facebook/callback`,
          code,
        },
      }
    );
    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get(
      `https://graph.facebook.com/me`, {
        params: {
          fields: `id,name,email,picture`,
          access_token: accessToken,
        },
      }
    );
    const fbUser = userRes.data;

    const user = await findOrCreateOAuthUser({
      provider: 'facebook',
      providerUserId: fbUser.id,
      email: fbUser.email,
      name: fbUser.name,
      avatar: fbUser.picture.data.url
    });

    console.log('We got our user connected: ');
    console.log(JSON.stringify(user));

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // redirect to front
    res.redirect(`http://localhost:3000/home?token=${token}`);
  } catch(err) {
    console.log(err);
    res.status(500).send('Facebook login failed lol');
  }
})

router.get('/google/login', (req, res) => {
  const redirectUrl = 
  `https://accounts.google.com/o/oauth2/v2/auth` + 
  `?client_id=${process.env.GOOGLE_CLIENT_ID}` + 
  `&response_type=code&scope=openid email profile` + 
  `&redirect_uri=${BASE_URL}/auth/google/callback`;

  res.redirect(redirectUrl);
});

router.get('/google/callback', async (req, res) => {
  try {
    const code = req.query.code;

    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${BASE_URL}/auth/google/callback`
      }
    );
    const idToken = tokenRes.data.id_token;

    const ticket = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken);
    const googleUser = await ticket.json();

    const user = await findOrCreateOAuthUser({
      provider: 'google',
      providerUserId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture
    });

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`http://localhost:3000/home?token=${token}`);

  } catch(err) {
    console.log(err);
    res.status(500).send('Google login failed lol');
  }
})

// /register receives, in req.body, an object:
// username: username
// email: email
// password: password
router.post('/register', async (req, res) => {

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    const email = req.body.email;
    const result = await client.query(
      `SELECT * FROM users WHERE email = $1`
    , [email]);

    if (result.rows.length > 0) {
      console.log('Oops, un tel user existe déjà');
      // I should maybe use another status code
      await client.query('ROLLBACK');
      res.status(409).send('Email address already in use!');
      return;
    }

    const username = req.body.username;
    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const newUser = await client.query(
      `INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3)
      RETURNING *`,
      [username, email, passwordHash]
    );

    const user = newUser.rows[0];

    // Create default workspace for new user
    const defaultWorkspaceId = await client.query(
      `INSERT INTO workspaces (title, owner_id) VALUES($1, $2)
      RETURNING id`,
      ['My Workspace', user.id]
    );

    // Sets the current_workspace to newly created default workspace
    const insertDefaultWorkspace = await client.query(
      `UPDATE users
      SET current_workspace = $1
      WHERE id = $2`,
      [defaultWorkspaceId.rows[0].id, user.id]
    );

    const token = jwt.sign(
      {
        userId: user.id,
        sub: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json(
      {
        token: token,
      }
    );

    await client.query('COMMIT');
  } catch(err) {
    await client.query('ROLLBACK');
    console.log(err);
    res.status(500).send('Registration failed lol');
  } finally {
    client.release();
  }
  
})

router.post('/login', async(req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      `SELECT id, email, name, image, password_hash FROM users WHERE email = $1`,
      [email]);
    
    const user = result.rows[0];
    if (!user) return res.status(401).send("Invalid username");

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).send("Invalid password");

    const token = jwt.sign(
      {
        userId: user.id,
        sub: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json(
      {
        token: token
      }
    );

  } catch(err) {
    console.log(err);
    res.status(401).send('Invalid username or password');
  }
})

export default router;