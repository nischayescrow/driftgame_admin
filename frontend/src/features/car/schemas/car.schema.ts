import * as z from "zod";

// Add Mode schema
export const AddCarSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Car name is required!")
    .min(3, "Car name must have minimum 3 characters")
    .max(20, "Car name must have maximum 30 characters"),
  top_speed: z.coerce.number().min(1, "Top Speed no. must be greater than 0!"),
  engine: z.coerce.number().min(1, "Engine must be greater than 0!"),
  breaking: z.coerce.number().min(1, "Breaking must be greater than 0!"),
  fuel: z.coerce.number().min(1, "Fuel must be greater than 0!"),
  locked: z.coerce.number().min(1, "Locked must be greater than 0!"),
  unlocked_at_level: z.coerce
    .number()
    .min(1, "Unlocked at level must be greater than 0!"),
  price_in_key: z.coerce
    .number()
    .min(1, "Price in key must be greater than 0!"),
  price_in_coin: z.coerce
    .number()
    .min(1, "Price in coin must be greater than 0!"),
  offer_percentage: z.coerce
    .number()
    .min(1, "Offer percentage must be greater than 0!"),
});

export type AddCarSchemaType = z.infer<typeof AddCarSchema>;

// Edit user schema
export const EditCarSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Car name is required!")
    .min(3, "Car name must have minimum 3 characters")
    .max(20, "Car name must have maximum 30 characters")
    .optional(),
  top_speed: z.coerce
    .number()
    .min(1, "Top Speed no. must be greater than 0!")
    .optional(),
  engine: z.coerce.number().min(1, "Engine must be greater than 0!").optional(),
  breaking: z.coerce
    .number()
    .min(1, "Breaking must be greater than 0!")
    .optional(),
  fuel: z.coerce.number().min(1, "Fuel must be greater than 0!").optional(),
  locked: z.coerce.number().min(1, "Locked must be greater than 0!").optional(),
  unlocked_at_level: z.coerce
    .number()
    .min(1, "Unlocked at level must be greater than 0!")
    .optional(),
  price_in_key: z.coerce
    .number()
    .min(1, "Price in key must be greater than 0!")
    .optional(),
  price_in_coin: z.coerce
    .number()
    .min(1, "Price in coin must be greater than 0!")
    .optional(),
  offer_percentage: z.coerce
    .number()
    .min(1, "Offer percentage must be greater than 0!")
    .optional(),
});

export type EditCarSchemaType = z.infer<typeof EditCarSchema>;
