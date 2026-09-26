import cors from 'cors';
import express from 'express';
import path from 'node:path';

import { initializeDatabase } from './database/schema.js';
import { seedDatabase } from './database/seed.js';
import { errorHandler } from './middleware/error-handler.js';
import invitationRoutes from './modules/invitations/invitation.routes.js';
import dateOptionsRoutes from './modules/date-options/date-options.routes.js';

const app = express();

const PORT = Number(process.env.PORT ?? 4000);
const HOST = process.env.HOST ?? '0.0.0.0';

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
app.use('/api/date-options', dateOptionsRoutes);

// Docker serves the built SPA and API from the same origin. Development uses Vite.
if (process.env.CLIENT_DIST_PATH) {
  const clientDistPath = path.resolve(process.env.CLIENT_DIST_PATH);
  app.use('/assets', express.static(path.join(clientDistPath, 'assets'), {
    immutable: true,
    maxAge: '1y',
  }));
  app.use(express.static(clientDistPath));
  app.get('/{*page}', (req, res, next) => {
    // Browser navigation belongs to React; missing APIs/assets must stay 404s.
    if (
      req.path === '/api' || req.path.startsWith('/api/') ||
      req.path === '/assets' || req.path.startsWith('/assets/') ||
      path.extname(req.path) || !req.accepts('html')
    ) {
      next();
      return;
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`DateDrop listening on http://${HOST}:${PORT}`);
});
