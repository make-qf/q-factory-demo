"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { postFormSchema, postIdSchema, type PostFormValues } from "@/lib/validations/post";

type ActionResult = {
  fieldErrors?: Partial<Record<keyof PostFormValues, string[]>>;
} | undefined;

function isUniqueViolation(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const code = (err as { code?: string }).code ?? (err.cause as { code?: string } | undefined)?.code;
  return code === "23505";
}

export async function createPost(values: PostFormValues): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let slug: string;
  try {
    const [post] = await db.insert(posts).values(parsed.data).returning();
    slug = post.slug;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { fieldErrors: { slug: ["This slug is already taken."] } };
    }
    throw err;
  }

  revalidatePath("/blog");
  redirect(`/blog/${slug}`);
}

export async function updatePost(
  id: number,
  values: PostFormValues
): Promise<ActionResult> {
  const parsedId = postIdSchema.safeParse(id);
  const parsed = postFormSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) {
    return { fieldErrors: parsed.success ? undefined : parsed.error.flatten().fieldErrors };
  }

  let slug: string;
  try {
    const [post] = await db
      .update(posts)
      .set(parsed.data)
      .where(eq(posts.id, parsedId.data))
      .returning();
    if (!post) {
      return { fieldErrors: { title: ["This post no longer exists."] } };
    }
    slug = post.slug;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { fieldErrors: { slug: ["This slug is already taken."] } };
    }
    throw err;
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect(`/blog/${slug}`);
}

export async function deletePost(id: number): Promise<void> {
  const parsedId = postIdSchema.safeParse(id);
  if (!parsedId.success) {
    return;
  }

  await db.delete(posts).where(eq(posts.id, parsedId.data));

  revalidatePath("/blog");
  redirect("/blog");
}
