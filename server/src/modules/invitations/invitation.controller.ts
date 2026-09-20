import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { createInvitationSchema } from './invitation.schema.js';
import { createInvitationService, getPublicInvitationService } from './invitation.service.js';

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

export function getPublicInvitationController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const token = req.params.token;

    const invitation =
      getPublicInvitationService(token as string);

    res.status(200).json({
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}