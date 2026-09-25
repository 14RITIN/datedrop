import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { getDateOptionsService } from './date-options.service.js';

export function getDateOptionsController(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const options = getDateOptionsService();

    res.status(200).json({
      data: options,
    });
  } catch (error) {
    next(error);
  }
}