import { Router } from 'express';

import { createInvitationController } from './invitation.controller.js';

const router = Router();

router.post('/', createInvitationController);

export default router;