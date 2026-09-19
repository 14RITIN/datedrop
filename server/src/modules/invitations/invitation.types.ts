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