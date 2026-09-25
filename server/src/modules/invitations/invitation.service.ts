import { randomBytes } from 'node:crypto';

import type {
  CreateInvitationInput,
  SubmitInvitationResponseInput,
} from './invitation.schema.js';

import {
  createInvitation,
  findExistingCuisineIds,
  findInvitationByPublicToken,
  findInvitationForResponse,
  saveInvitationResponse,
} from './invitation.repository.js';
import { AppError } from '../../utils/app-error.js';

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

export function getPublicInvitationService(
  token: string,
) {
  const invitation =
    findInvitationByPublicToken(token);

  if (!invitation) {
    throw new AppError(
      404,
      'INVITATION_NOT_FOUND',
      'This DateDrop could not be found',
    );
  }

  return invitation;
}

function getTodayValue(): string {
  const today = new Date();

  const year =
    today.getFullYear();

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    today.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export function submitInvitationResponseService(
  token: string,
  input: SubmitInvitationResponseInput,
) {
  const invitation =
    findInvitationForResponse(
      token,
    );

  if (!invitation) {
    throw new AppError(
      404,
      'INVITATION_NOT_FOUND',
      'This DateDrop could not be found',
    );
  }

  if (
    invitation.status !==
    'PENDING'
  ) {
    throw new AppError(
      409,
      'RESPONSE_ALREADY_SUBMITTED',
      'This DateDrop has already been answered',
    );
  }

  if (!input.interested) {
    saveInvitationResponse({
      invitationId:
        invitation.id,

      interested: false,

      cuisineIds: [],

      status: 'DECLINED',
    });

    return {
      status: 'DECLINED',
    };
  }

  if (
    input.date <
    getTodayValue()
  ) {
    throw new AppError(
      400,
      'INVALID_DATE',
      'The selected date cannot be in the past',
    );
  }

  const uniqueCuisineIds = [
    ...new Set(
      input.cuisineIds,
    ),
  ];

  if (
    uniqueCuisineIds.length >
    0
  ) {
    const existingCuisineIds =
      findExistingCuisineIds(
        uniqueCuisineIds,
      );

    if (
      existingCuisineIds.length !==
      uniqueCuisineIds.length
    ) {
      throw new AppError(
        400,
        'INVALID_CUISINE',
        'One or more selected cuisines are invalid',
      );
    }
  }

  saveInvitationResponse({
    invitationId:
      invitation.id,

    interested: true,

    dateType:
      input.dateType,

    cuisineIds:
      uniqueCuisineIds,

    selectedDate:
      input.date,

    selectedTime:
      input.time,

    status: 'COMPLETED',
  });

  return {
    status: 'COMPLETED',
  };
}