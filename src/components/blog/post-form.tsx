"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPost, updatePost } from "@/app/blog/actions";
import { postFormSchema, type PostFormValues } from "@/lib/validations/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type PostFormProps =
  | { mode: "create" }
  | { mode: "edit"; post: { id: number; title: string; slug: string; content: string } };

export function PostForm(props: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues:
      props.mode === "edit"
        ? { title: props.post.title, slug: props.post.slug, content: props.post.content }
        : { title: "", slug: "", content: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createPost(values)
          : await updatePost(props.post.id, values);

      if (result?.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.length) {
            form.setError(field as keyof PostFormValues, { message: messages[0] });
          }
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.title}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            autoComplete="off"
            aria-invalid={!!form.formState.errors.title}
            {...form.register("title")}
          />
          <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
        </Field>

        <Field data-invalid={!!form.formState.errors.slug}>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            autoComplete="off"
            aria-invalid={!!form.formState.errors.slug}
            {...form.register("slug")}
          />
          <FieldDescription>Used in the post URL, e.g. /blog/my-post</FieldDescription>
          <FieldError errors={form.formState.errors.slug ? [form.formState.errors.slug] : undefined} />
        </Field>

        <Field data-invalid={!!form.formState.errors.content}>
          <FieldLabel htmlFor="content">Content</FieldLabel>
          <Textarea
            id="content"
            rows={10}
            aria-invalid={!!form.formState.errors.content}
            {...form.register("content")}
          />
          <FieldError errors={form.formState.errors.content ? [form.formState.errors.content] : undefined} />
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : props.mode === "create" ? "Create post" : "Save changes"}
        </Button>
      </FieldGroup>
    </form>
  );
}
