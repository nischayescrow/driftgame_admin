import * as z from "zod";

// Add Mode schema
export const AddModeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Mode name is required!")
    .min(3, "First name must have minimum 3 characters")
    .max(20, "First name must have maximum 20 characters"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "First name must have characters only",
  // ),
  identity: z
    .string()
    .trim()
    .min(1, "Identity is required!")
    .min(3, "Identity must have minimum 3 characters"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  purpose: z
    .string()
    .trim()
    .min(1, "Purpose is required!")
    .min(3, "Purpose must have minimum 3 characters"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  map: z
    .string()
    .trim()
    .min(1, "Map is required!")
    .min(3, "Map must have minimum 3 characters"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  players: z.coerce
    .number()
    .min(1, "Players is required!")
    .max(5, "Maximum 5 Players allowed"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
});

export type AddModeSchemaType = z.infer<typeof AddModeSchema>;

// Edit user schema
export const EditModeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Mode name is required!")
    .min(3, "First name must have minimum 3 characters")
    .max(20, "First name must have maximum 20 characters")
    .optional(),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "First name must have characters only",
  // ),
  identity: z
    .string()
    .trim()
    .min(1, "Identity is required!")
    .min(3, "Identity must have minimum 3 characters")
    .optional(),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  purpose: z
    .string()
    .trim()
    .min(1, "Purpose is required!")
    .min(3, "Purpose must have minimum 3 characters")
    .optional(),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  map: z
    .string()
    .trim()
    .min(1, "Map is required!")
    .min(3, "Map must have minimum 3 characters")
    .optional(),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  players: z.coerce
    .number()
    .min(1, "Players is required!")
    .max(5, "Maximum 5 Players allowed")
    .optional(),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  status: z.coerce
    .number()
    .refine((val) => [0, 1, 2].includes(val))
    .optional(),
});

export type EditModeSchemaType = z.infer<typeof EditModeSchema>;
