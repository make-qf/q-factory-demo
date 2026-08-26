import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { posts } from "@/db/schema";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
export default async function BlogPage() {
    const allPosts= await db.select().from(posts)
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-medium">Blog</h1>
        <Button render={<Link href="/blog/new" />} nativeButton={false} >
          New post
        </Button>
      </div>
      {allPosts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {allPosts.map((post) => (
                <TableRow key={post.id}>
                    <TableCell className="font-medium">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>

                    </TableCell>
                    <TableCell>{post.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                        <Button render={<Link href={`/blog/${post.slug}/edit`} />} nativeButton={false} >
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
      )}
    </div>
  );
}