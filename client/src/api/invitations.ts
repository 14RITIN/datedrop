import type {
  CreateInvitationRequest,
  CreateInvitationResponse,
} from '../types/invitation';

export async function createInvitation(
  input: CreateInvitationRequest,
): Promise<CreateInvitationResponse> {
  const response = await fetch('/api/invitations', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(input),
  });

  const body = await response.json();

  if (!response.ok) {
    const message =
      body?.error?.details?.[0]?.message ??
      body?.error?.message ??
      'Unable to create your DateDrop';

    throw new Error(message);
  }

  return body;
}