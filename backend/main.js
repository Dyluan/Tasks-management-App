import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import authRouter from './routes/auth.js';

dotenv.config();

const PORT = Number(process.env.PORT);
const BASE_URL = `http://localhost:${PORT}`;

const app = express();

app.use(express.json());
app.use(cors({
  origin:'http://localhost:3000',
  credentials: true
}));

app.use('/auth', authRouter);

app.get('/me', requireAuth, (req,res) => {
  console.log(req.user);
  console.log(JSON.stringify(req.user));
  res.json(req.user);
})

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});