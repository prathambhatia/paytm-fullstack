require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

const mainRouter = require('./routes/index');
app.use('/api/v1/', mainRouter);

// 404 catch‑all (for anything else)
app.use((req, res) => {
  console.log('❌ 404 hit:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Not found' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
