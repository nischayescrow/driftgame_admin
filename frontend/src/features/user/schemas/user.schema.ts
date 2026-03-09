import * as z from "zod";

// Edit user schema
export const EditUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required!")
    .min(3, "First name must have minimum 3 characters")
    .max(20, "First name must have maximum 20 characters"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "First name must have characters only",
  // ),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required!")
    .min(3, "Last name must have minimum 3 characters")
    .max(20, "Last name must have maximum 20 characters"),
  // .refine(
  //   (value) => /^[a-zA-Z]+$/.test(value),
  //   "Last name must have characters only",
  // ),
  email: z.string().min(1, "Email is required.").email("Invalid email format"),
  password: z
    .string("Password is required.")
    .trim()
    .min(1, "Password required!")
    .min(8, "Password must have minimum strength of 8 characters")
    .refine((value) => /\d/.test(value), "Password must have 1 digit")
    .refine(
      (value) => /[a-z]/.test(value),
      "Password must have 1 small alphabet",
    )
    .refine(
      (value) => /[A-Z]/.test(value),
      "Password must have 1 capital alphabet",
    )
    .refine(
      (value) => /[~`!@#$%\^&*\(\)_\-+=\{\}\[\]\|\:;\"\'<,>\.?\/]/.test(value),
      "Password must have 1 special character",
    )
    .optional(),
  email_verified: z.boolean(),
  status: z.number().refine((val) => [0, 1, 2, 3].includes(val)),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
