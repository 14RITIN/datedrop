import { randomBytes } from 'node:crypto';

import type { CreateInvitationInput } from './invitation.schema.js';
import { createInvitation } from './invitation.repository.js';

function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

export function createInvitationService(
  input: CreateInvitationInput,
) {
  const publicToken = generateToken();
  const creatorToken = generateToken();

  const invitation = createInvitation({
    publicToken,
    creatorToken,
    creatorName: input.creatorName,
    recipientName: input.recipientName,
    personalMessage: input.message,
  });

  return {
    id: invitation.id,
    status: invitation.status,

    inviteUrl: `/invite/${publicToken}`,

    manageUrl: `/manage/${creatorToken}`,
  };
}