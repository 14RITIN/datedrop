import cors from 'cors';
import express from 'express';

import { initializeDatabase } from './database/schema.js';
import { seedDatabase } from './database/seed.js';
import { errorHandler } from './middleware/error-handler.js';
import invitationRoutes from './modules/invitations/invitation.routes.js';

const app = express();

const PORT = 4000;

initializeDatabase();
seedDatabase();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    application: 'DateDrop',
  });
});

app.use('/api/invitations', invitationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`DateDrop API running on http://localhost:${PORT}`);
});