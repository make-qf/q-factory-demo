import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { posts } from "@/db/schema";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function BlogPage() {
    const allPosts = await db.select().from(posts);

    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Blog Page</h1>
            <p className="text-lg text-gray-600">
                Welcome to the blog page!
            </p>
            <Button
                render={<Link href="/blog/new">Create a new post</Link>}
                nativeButton={false} variant="outline" size="sm" className="mt-4"
            />
            {allPosts.length === 0 ? (
                <p className="text-gray-600">No posts available.</p>
            ) : (
                <Table className="w-half mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>{post.updatedAt?.toLocaleTimeString()}</TableCell>
                                <TableCell className="text-left space-x-2">
                                    <Button
                                        render={<Link href={`/blog/${post.slug}`}>View</Link>}
                                    />
                                    <Button
                                        render={<Link href={`/blog/${post.slug}/edit`}>Edit</Link>}
                                    />
                                    <Button
                                        render={<Link href={`/blog/${post.slug}/delete`}>Delete</Link>}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
        <div>pöö pöö
        </div></>
    );
}
