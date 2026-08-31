import { Button } from "@/components/ui/button"
import Link from "next/link";
import { db } from "@/db"
import { posts } from "@/db/schema";
import {
    Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { desc } from "drizzle-orm";
 
export default async function Home() {
 const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(3);
  return (
  <div className="mx-auto max-w-md py-8 sm:py-12 lg:px-8 xl:px-16">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight dark:text-white sm:text-4xl">Blog page</h1>
      <p>Welcome to the blog page</p>
    </div>
    {allPosts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>
      ) : (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allPosts.map((post) => (
                    <TableRow key={post.id}>
                        <TableCell>
                            <Link href={`/blog/${post.slug}`} className="hover:underline">
                            {post.title}
                            </Link>
                        </TableCell>
                        <TableCell>{post.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>{post.updatedAt?.toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>
                  <Link href="/blog">All posts</Link>
                </TableCell>
              </TableRow>
            </TableFooter>
        </Table>
      )}
  </div>
  );
}
 
 