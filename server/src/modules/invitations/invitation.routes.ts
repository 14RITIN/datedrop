import { Router } from 'express';

import {
  createInvitationController,
  getCreatorInvitationController,
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

router.get(
  '/manage/:creatorToken',
  getCreatorInvitationController,
);

export default router;