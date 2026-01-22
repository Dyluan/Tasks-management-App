import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.js';
import workspaceRouter from './routes/workspace.js';
import boardsRouter from './routes/boards.js';
import cardsRouter from './routes/cards.js';
import { requireAuth } from './middleware/requireAuth.js';

dotenv.config();

const PORT = Number(process.env.PORT);

const app = express();

app.use(express.json());
app.use(cors({
  origin:'http://localhost:3000',
  credentials: true
}));

app.use('/auth', authRouter);
app.use('/workspace', workspaceRouter);
app.use('/boards', boardsRouter);
app.use('/cards', cardsRouter);

app.get('/me', requireAuth, (req,res) => {
  console.log('/me called.');
  res.json(req.user);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});