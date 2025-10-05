import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Registration form validation schema
export const registerSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
  confirmPassword: z.string()
    .min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}); 