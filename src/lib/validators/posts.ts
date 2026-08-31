import {z} from "zod";

export const postFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export type PostFormValues = z.infer<typeof postformSchema>;
