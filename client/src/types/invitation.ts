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

export type SubmitInvitationResponseRequest =
  | {
      interested: false;
    }
  | {
      interested: true;
      dateType: string;
      cuisineIds: number[];
      date: string;
      time: string;
    };

export interface SubmitInvitationResponseResponse {
  data: {
    status:
      | 'DECLINED'
      | 'COMPLETED';
  };
}

export interface CreatorInvitationResponse {
  data: {
    creatorName: string;
    recipientName: string;

    status:
      | 'PENDING'
      | 'DECLINED'
      | 'COMPLETED'
      | 'EXPIRED';

    createdAt: string;
    respondedAt: string | null;

    response: {
      interested: boolean;

      dateType: string | null;

      date: string | null;

      time: string | null;

      cuisines: Cuisine[];
    } | null;
  };
}