import { z } from "zod";

export const updateUserSchema = z.object({
    body: z.object({
        id: z.string()
            .min(1, "User ID is required")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),

        username: z.string()
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can contain letters, numbers, and underscores only"),

        active: z.boolean({
            required_error: "Active status is required",
            invalid_type_error: "Active must be a boolean"
        }),

        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(100)
            .optional()
    }).strict()
});