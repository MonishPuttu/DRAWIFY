import { z } from "zod";

export const SignupValidation = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string()
})

export const signinValidation = z.object({
    username: z.string().min(3).max(30),
    password: z.string()
})

export const roomValidations = z.object({
    slug: z.string().min(1, "slug is required")
})