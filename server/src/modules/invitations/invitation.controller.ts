import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { createInvitationSchema, submitInvitationResponseSchema } from './invitation.schema.js';
import { createInvitationService, getCreatorInvitationService, getPublicInvitationService, submitInvitationResponseService } from './invitation.service.js';

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

export function submitInvitationResponseController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const input =
      submitInvitationResponseSchema.parse(
        req.body,
      );

    const result =
      submitInvitationResponseService(
        req.params.token as string,
        input,
      );

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function getCreatorInvitationController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const result =
      getCreatorInvitationService(
        req.params.creatorToken as string,
      );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}