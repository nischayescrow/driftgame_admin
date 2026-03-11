import * as z from "zod";

// Add Mode schema
export const AddLevelSchema = z.object({
  level: z.coerce.number().min(1, "Level no. must be greater than 0!"),
  xpToLevel: z.coerce
    .number()
    .min(1, "XP to level no. must be greater than 0!"),
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required!")
    .min(3, "Display name must have minimum 3 characters")
    .max(20, "Display name must have maximum 20 characters"),
});

export type AddLevelSchemaType = z.infer<typeof AddLevelSchema>;

// Edit user schema
export const EditLevelSchema = z.object({
  level: z.coerce
    .number()
    .min(1, "Level no. must be greater than 0!")
    .optional(),
  xpToLevel: z.coerce
    .number()
    .min(1, "XP to level no. must be greater than 0!")
    .optional(),
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required!")
    .min(3, "Display name must have minimum 3 characters")
    .max(20, "Display name must have maximum 20 characters")
    .optional(),
  status: z.coerce
    .number()
    .refine((val) => [0, 1, 2].includes(val))
    .optional(),
});

export type EditLevelSchemaType = z.infer<typeof EditLevelSchema>;
