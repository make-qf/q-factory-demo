"use client";

import { useState, useTransition, ChangeEvent, SubmitEvent } from "react";
import { createPost, type ActionResult } from "@/app/blog/actions";
import { type PostFormValues } from "@/lib/validations/post";

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

export function PostForm() {
  const [isPending, startTransition] = useTransition();

  // 1. Tallennetaan lomakkeen kenttien arvot useState-tilaan
  const [formData, setFormData] = useState<PostFormValues>({
    title: "",
    slug: "",
    content: "",
  });

  // 2. Tallennetaan palvelimelta (tai asiakkaalta) saadut virheet
  const [errors, setErrors] = useState<Partial<Record<keyof PostFormValues, string[]>>>({});

  // Yleiskäyttöinen input-muutosten käsittelijä
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lomakkeen lähetys
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // Estetään sivun normaali uudelleenlaataus
    setErrors({}); // Tyhjennetään vanhat virheet

    startTransition(async () => {
      // Kutsutaan palvelinfunktiota suoraan useState-olion arvoilla
      const result: ActionResult = await createPost(formData);

      if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        {/* Otsikko (Title) */}
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            autoComplete="off"
            aria-invalid={!!errors.title}
          />
          <FieldError errors={errors.title?.map((message) => ({ message }))} />
        </Field>

        {/* Slug */}
        <Field data-invalid={!!errors.slug}>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            autoComplete="off"
            aria-invalid={!!errors.slug}
          />
          <FieldDescription>Used in the post URL, e.g. /blog/my-post</FieldDescription>
          <FieldError errors={errors.slug?.map((message) => ({ message }))} />
        </Field>

        {/* Sisältö (Content) */}
        <Field data-invalid={!!errors.content}>
          <FieldLabel htmlFor="content">Content</FieldLabel>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            aria-invalid={!!errors.content}
          />
          <FieldError errors={errors.content?.map((message) => ({ message }))} />
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Create post"}
        </Button>
      </FieldGroup>
    </form>
  );
}