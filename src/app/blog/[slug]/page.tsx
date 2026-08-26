import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletePostButton } from "@/components/blog/delete-post-button";

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        render={<Link href="/blog" />}
        nativeButton={false}
      >
        &larr; Back to blog
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {post.createdAt.toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          render={<Link href={`/blog/${post.slug}/edit`} />}
          nativeButton={false}
        >
          Edit
        </Button>
        <DeletePostButton id={post.id} />
      </div>
    </div>
  );
}
