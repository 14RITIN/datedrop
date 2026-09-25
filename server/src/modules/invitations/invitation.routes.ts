import { Router } from 'express';

import {
  createInvitationController,
  getPublicInvitationController,
  submitInvitationResponseController,
} from './invitation.controller.js';

const router = Router();

router.post('/', createInvitationController);

router.get(
  '/:token',
  getPublicInvitationController,
);

router.post(
  '/:token/response',
  submitInvitationResponseController,
);
export default router;