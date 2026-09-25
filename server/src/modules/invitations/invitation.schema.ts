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

const dateTypeSchema = z.enum([
  'dinner',
  'lunch',
  'coffee',
  'dessert',
  'movie',
  'picnic',
  'surprise',
]);

const acceptedResponseSchema = z.object({
  interested: z.literal(true),

  dateType: dateTypeSchema,

  cuisineIds: z
    .array(
      z.number().int().positive(),
    )
    .max(3)
    .default([]),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Invalid date',
    ),

  time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      'Invalid time',
    ),
});

const declinedResponseSchema = z.object({
  interested: z.literal(false),
});

export const submitInvitationResponseSchema =
  z
    .union([
      acceptedResponseSchema,
      declinedResponseSchema,
    ])
    .superRefine((value, ctx) => {
      if (!value.interested) {
        return;
      }

      const requiresCuisine = [
        'dinner',
        'lunch',
        'dessert',
      ].includes(value.dateType);

      if (
        requiresCuisine &&
        value.cuisineIds.length === 0
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['cuisineIds'],
          message:
            'Select at least one cuisine',
        });
      }
    });

export type SubmitInvitationResponseInput =
  z.infer<
    typeof submitInvitationResponseSchema
  >;