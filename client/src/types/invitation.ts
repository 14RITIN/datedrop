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