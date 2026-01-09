require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    const result = pool.query('SELECT NOW()');
    res.json((await result).rows[0]);
  } catch(err) {
    console.error(err);
    res.status(500).send('DB connection failed');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});