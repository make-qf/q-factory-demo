"use server"

import { PostFormValues } from "@/lib/validators/post";


// Tyyppimäärittely palvelintoimintojen palauttamille validointivirheille
export type ActionResult = {
  fieldErrors?: Partial<Record<keyof PostFormValues, string[]>>;
} | undefined;
