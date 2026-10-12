import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Enter a valid email address, like you@email.com"),
  password: z
    .string()
    .min(1, "Enter your password"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Enter your name")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Enter a valid email address, like you@email.com"),
  password: z
    .string()
    .min(1, "Create a password")
    .min(8, "Use at least 8 characters")
    .regex(/\d/, "Add at least one number"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export const passwordScore = (v: string = "") =>
  [v.length >= 8, /\d/.test(v), /[A-Z]/.test(v) && /[^A-Za-z0-9]|[a-z]/.test(v), v.length >= 12].filter(Boolean).length;
