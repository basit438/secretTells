import { z } from "zod";

export const usernameValidator = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be at most 20 characters long")
  .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers");

  export const signUpSchema = z.object({
    username: usernameValidator,
    email: z.string().email({ message: "Please provide a valid email" }),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });