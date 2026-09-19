import cors from 'cors';
import express from 'express';

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    application: 'DateDrop',
  });
});

app.listen(PORT, () => {
  console.log(`DateDrop API running on http://localhost:${PORT}`);
});