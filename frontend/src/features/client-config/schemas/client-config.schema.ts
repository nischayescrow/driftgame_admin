import * as z from "zod";

// Add Mode schema
export const AddConfigSchema = z.object({
  clientBuildVersion: z.coerce
    .number()
    .min(1, "Build version no. must be greater than 0!"),
  updateRequired: z.boolean(),
  currentStatus: z.boolean(),
  upcomingStatus: z.boolean(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required!")
    .min(3, "Message must have minimum 3 characters"),
});

export type AddConfigSchemaType = z.infer<typeof AddConfigSchema>;

// Edit user schema
export const EditConfigSchema = z.object({
  clientBuildVersion: z.coerce
    .number()
    .min(1, "Build version no. must be greater than 0!")
    .optional(),
  updateRequired: z.boolean().optional(),
  currentStatus: z.boolean().optional(),
  upcomingStatus: z.boolean().optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required!")
    .min(3, "Message must have minimum 3 characters")
    .optional(),
});

export type EditConfigSchemaType = z.infer<typeof EditConfigSchema>;
