import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "username name must be at least 2 characters")
    .max(30, "username name must not exceed 30 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
});
