import { PostForm } from "@/components/blog/post-form";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
 
export default async function DeleteBlogPostPage({params}: PageProps<"/blog/[slug]/delete">) {
    const {slug} = await params;

    const [post] = await db.delete(posts).where(eq(posts.slug, slug)).limit(1);

    return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="font-heading text-2xl font-medium">Deleted post</h1>
    </div>
  );
}