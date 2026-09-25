export type InvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'COMPLETED'
  | 'EXPIRED';

export interface CreateInvitationRecord {
  publicToken: string;
  creatorToken: string;
  creatorName: string;
  recipientName: string;
  personalMessage?: string;
}

export interface Invitation {
  id: number;
  publicToken: string;
  creatorToken: string;
  creatorName: string;
  recipientName: string;
  personalMessage: string | null;
  status: InvitationStatus;
  createdAt: string;
}

export interface PublicInvitation {
  creatorName: string;
  recipientName: string;
  personalMessage: string | null;
  status: InvitationStatus;
  createdAt: string;
}
export interface InvitationResponseTarget {
  id: number;
  status: InvitationStatus;
}

export interface SaveInvitationResponseInput {
  invitationId: number;

  interested: boolean;

  dateType?: string;

  selectedDate?: string;

  selectedTime?: string;

  cuisineIds: number[];

  status:
    | 'DECLINED'
    | 'COMPLETED';
}