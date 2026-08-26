import { z } from "zod";

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug must be 200 characters or fewer")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  content: z.string().trim().min(1, "Content is required"),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const postIdSchema = z.coerce.number().int().positive();
