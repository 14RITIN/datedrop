import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { createInvitationSchema } from './invitation.schema.js';
import { createInvitationService } from './invitation.service.js';

export function createInvitationController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const input = createInvitationSchema.parse(req.body);

    const invitation = createInvitationService(input);

    res.status(201).json({
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}