import { Router } from 'express';

import { getDateOptionsController } from './date-options.controller.js';

const router = Router();

router.get('/', getDateOptionsController);

export default router;