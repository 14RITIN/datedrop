export interface CreateInvitationRequest {
  creatorName: string;
  recipientName: string;
  message?: string;
}

export interface CreateInvitationData {
  id: number;
  status: string;
  inviteUrl: string;
  manageUrl: string;
}

export interface CreateInvitationResponse {
  data: CreateInvitationData;
}
export interface PublicInvitation {
  creatorName: string;
  recipientName: string;
  personalMessage: string | null;
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'DECLINED'
    | 'COMPLETED'
    | 'EXPIRED';

  createdAt: string;
}

export interface PublicInvitationResponse {
  data: PublicInvitation;
}

export interface Cuisine {
  id: number;
  name: string;
  emoji: string | null;
}

export interface DateOptionsResponse {
  data: {
    cuisines: Cuisine[];
  };
}