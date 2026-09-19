import { db } from '../../database/db.js';

import type {
  CreateInvitationRecord,
  Invitation,
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