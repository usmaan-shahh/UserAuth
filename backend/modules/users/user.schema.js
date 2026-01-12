import z from "zod";



export const publicSignupSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can contain letters, numbers, and underscores only",
        ),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100),
    })
    .strict(),
});

