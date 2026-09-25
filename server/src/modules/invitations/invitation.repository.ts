import { db } from '../../database/db.js';

import type {
  CreateInvitationRecord,
  Invitation,
  InvitationResponseTarget,
  PublicInvitation,
  SaveInvitationResponseInput,
} from './invitation.types.js';

export function createInvitation(
  input: CreateInvitationRecord,
): Invitation {
  const statement = db.prepare(`
    INSERT INTO invitations (
      public_token,
      creator_token,
      creator_name,
      recipient_name,
      personal_message
    )
    VALUES (
      @publicToken,
      @creatorToken,
      @creatorName,
      @recipientName,
      @personalMessage
    )
  `);

  const result = statement.run({
    publicToken: input.publicToken,
    creatorToken: input.creatorToken,
    creatorName: input.creatorName,
    recipientName: input.recipientName,
    personalMessage: input.personalMessage ?? null,
  });

  const invitation = db
    .prepare(
      `
      SELECT
        id,
        public_token AS publicToken,
        creator_token AS creatorToken,
        creator_name AS creatorName,
        recipient_name AS recipientName,
        personal_message AS personalMessage,
        status,
        created_at AS createdAt
      FROM invitations
      WHERE id = ?
      `,
    )
    .get(result.lastInsertRowid) as Invitation;

  return invitation;
}

export function findInvitationByPublicToken(
  token: string,
): PublicInvitation | undefined {
  return db
    .prepare(
      `
      SELECT
        creator_name AS creatorName,
        recipient_name AS recipientName,
        personal_message AS personalMessage,
        status,
        created_at AS createdAt
      FROM invitations
      WHERE public_token = ?
      `,
    )
    .get(token) as PublicInvitation | undefined;
}

export function findInvitationForResponse(
  publicToken: string,
): InvitationResponseTarget | undefined {
  return db
    .prepare(
      `
      SELECT
        id,
        status
      FROM invitations
      WHERE public_token = ?
      `,
    )
    .get(
      publicToken,
    ) as
    | InvitationResponseTarget
    | undefined;
}

export function findExistingCuisineIds(
  cuisineIds: number[],
): number[] {
  if (cuisineIds.length === 0) {
    return [];
  }

  const placeholders =
    cuisineIds
      .map(() => '?')
      .join(', ');

  const rows = db
    .prepare(
      `
      SELECT id
      FROM cuisines
      WHERE id IN (${placeholders})
      `,
    )
    .all(
      ...cuisineIds,
    ) as { id: number }[];

  return rows.map(
    row => row.id,
  );
}

export function saveInvitationResponse(
  input: SaveInvitationResponseInput,
): void {
  const transaction =
    db.transaction(() => {
      const result = db
        .prepare(
          `
          INSERT INTO date_responses (
            invitation_id,
            interested,
            date_type,
            selected_date,
            selected_time
          )
          VALUES (?, ?, ?, ?, ?)
          `,
        )
        .run(
          input.invitationId,

          input.interested
            ? 1
            : 0,

          input.dateType ?? null,

          input.selectedDate ??
            null,

          input.selectedTime ??
            null,
        );

      const responseId =
        Number(
          result.lastInsertRowid,
        );

      if (
        input.cuisineIds.length >
        0
      ) {
        const insertCuisine =
          db.prepare(
            `
            INSERT INTO response_cuisines (
              response_id,
              cuisine_id
            )
            VALUES (?, ?)
            `,
          );

        for (
          const cuisineId
          of input.cuisineIds
        ) {
          insertCuisine.run(
            responseId,
            cuisineId,
          );
        }
      }

      db.prepare(
        `
        UPDATE invitations
        SET
          status = ?,
          responded_at =
            CURRENT_TIMESTAMP
        WHERE id = ?
        `,
      ).run(
        input.status,
        input.invitationId,
      );
    });

  transaction();
}
