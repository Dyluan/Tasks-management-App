import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const PORT = Number(process.env.PORT);
const BASE_URL = `http://localhost:${PORT}`;

const router = express.Router();

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

    const user = {
      id: fbUser.id,
      name: fbUser.name,
      email: fbUser.email,
      avatar: fbUser.picture.data.url
    };

    console.log('We got our user connected: ');
    console.log(JSON.stringify(user));

    const jwtToken = jwt.sign(
      user,
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    // redirect to front
    res.redirect(`http://localhost:3000/home?token=${jwtToken}`);
  } catch(err) {
    console.log(err);
    res.status(500).send('Facebook login failed lol');
  }
})

export default router;