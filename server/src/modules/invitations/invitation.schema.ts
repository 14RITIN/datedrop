import { z } from 'zod';

export const createInvitationSchema = z.object({
  creatorName: z
    .string()
    .trim()
    .min(2, 'Creator name must contain at least 2 characters')
    .max(50, 'Creator name cannot exceed 50 characters'),

  recipientName: z
    .string()
    .trim()
    .min(2, 'Recipient name must contain at least 2 characters')
    .max(50, 'Recipient name cannot exceed 50 characters'),

  message: z
    .string()
    .trim()
    .max(300, 'Message cannot exceed 300 characters')
    .optional(),
});

export type CreateInvitationInput = z.infer<
  typeof createInvitationSchema
>;