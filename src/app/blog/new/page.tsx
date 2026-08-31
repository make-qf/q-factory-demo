import { PostForm } from "@/components/blog/post-form";
 
export default function NewBlogPostPage() {
    return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="font-heading text-2xl font-medium">New post</h1>
      <PostForm mode="create" />
      {/* <PostFormTest /> */}
    </div>
  );
}
