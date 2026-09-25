import { db } from '../../database/db.js';

import type { Cuisine } from './date-options.types.js';

export function findAllCuisines(): Cuisine[] {
  return db
    .prepare(
      `
      SELECT
        id,
        name,
        emoji
      FROM cuisines
      ORDER BY name ASC
      `,
    )
    .all() as Cuisine[];
}