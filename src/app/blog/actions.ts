"use server"

import { db } from "@/db";
import { posts } from "@/db/schema";
import { postFormSchema, PostFormValues } from "@/lib/validators/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export type actionResult = {
  fieldErrors?: Partial<Record<keyof PostFormValues, string[]>>;
} | undefined;

export async function createPost(values: PostFormValues): Promise<actionResult> {
  const parsed = postFormSchema.safeParse(values)
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors}
  }
  try { 
    await db.insert(posts).values(parsed.data);
  }
  catch (err) {
    throw err
  }
  revalidatePath("/blog");
  redirect(`/blog/${parsed.data.slug}`);
}