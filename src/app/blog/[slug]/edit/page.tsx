import { PostForm } from "@/components/blog/post-form";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
 
export default async function EditBlogPostPage({params}: PageProps<"/blog/[slug]/edit">) {
    const {slug} = await params;

    const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

    return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="font-heading text-2xl font-medium">Edit post</h1>
      <PostForm mode="edit" post={post} />
      {/* <PostFormTest /> */}
    </div>
  );
}