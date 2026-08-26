import {z} from "zod";

export const postFormSchema= z.object({
  title: z.string().min(1, {message: "Title is required"}).max(200, {message: "Title must be less than 200 characters"}),
  slug: z.string().min(1, {message: "Slug is required"}).max(200, {message: "Slug must be less than 200 characters"}),
  content: z.string().min(1, {message: "Content is required"}).max(255, {message: "Content must be less than 255 characters"}),
});

export type PostFormValues = z.infer<typeof postFormSchema>;