import { Router } from 'express';

import {
  createInvitationController,
  getPublicInvitationController,
} from './invitation.controller.js';

const router = Router();

router.post('/', createInvitationController);

router.get(
  '/:token',
  getPublicInvitationController,
);

export default router;