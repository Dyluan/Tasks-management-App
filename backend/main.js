import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin:'http://localhost:3000',
  credentials: true
}));


app.get('/auth/github/login', (req, res) => {
  const redirectUrl = 'https://github.com/login/oauth/authorize' + 
    `?client_id=${process.env.GITHUB_CLIENT_ID}` + 
    `&scope=read:user user:email`;

  res.redirect(redirectUrl);
})

app.get('/auth/github/callback', async (req, res) => {
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

    const githubUser = userRes.data;

    // create JWT
    const token = jwt.sign(
      {
        sub: githubUser.id,
        username: githubUser.login,
        avatar: githubUser.avatar_url
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

app.get('/me', requireAuth, (req,res) => {
  res.json(req.user);
})

app.get('/test', async (req, res) => {
  try {
    const result = pool.query('SELECT NOW()');
    res.json((await result).rows[0]);
  } catch(err) {
    console.error(err);
    res.status(500).send('DB connection failed');
  }
});

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});