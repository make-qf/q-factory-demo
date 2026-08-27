"use server"; // Merkitsee tiedoston sisältämät funktiot Next.js Server Actioneiksi (ajetaan vain palvelimella)

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { postFormSchema, postIdSchema, type PostFormValues } from "@/lib/validations/post";

// Tyyppimäärittely palvelintoimintojen palauttamille validointivirheille
export type ActionResult = {
  fieldErrors?: Partial<Record<keyof PostFormValues, string[]>>;
} | undefined;

/**
 * Luo uuden blogikirjoituksen tietokantaan.
 * 
 * @param values - Lomakkeelta saadut syötteet
 * @returns Validoinnin tai tietokannan virheet, jos tallennus epäonnistuu
 */
export async function createPost(values: PostFormValues): Promise<ActionResult> {
  // Validoidaan lomakesyötteet Zod-skeemalla
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    // Jos validointi epäonnistuu, palautetaan kenttäkohtaiset virheviestit
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    // Tallennetaan uusi postaus tietokantaan
    await db.insert(posts).values(parsed.data);
  } catch (err) {
    // Käsillään MySQL/MariaDB:n uniikkiusvirhe (esim. jo käytössä oleva slug)
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return { fieldErrors: { slug: ["This slug is already taken."] } };
    }
    throw err; // Heitetään muut tuntemattomat virheet eteenpäin
  }

  // Tyhjennetään blogilistauksen välimuisti ja ohjataan käyttäjä uuteen postaukseen
  revalidatePath("/blog");
  redirect(`/blog/${parsed.data.slug}`);
}

/**
 * Päivittää olemassa olevan blogikirjoituksen tiedot.
 * 
 * @param id - Päivitettävän postauksen ID
 * @param values - Lomakkeelta saadut uudet syötteet
 * @returns Validoinnin tai tietokannan virheet, jos päivitys epäonnistuu
 */
export async function updatePost(
  id: number,
  values: PostFormValues
): Promise<ActionResult> {
  // Validoidaan sekä postauksen ID että lomaketiedot
  const parsedId = postIdSchema.safeParse(id);
  const parsed = postFormSchema.safeParse(values);
  
  if (!parsedId.success || !parsed.success) {
    return { fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  }

  try {
    // Päivitetään postauksen tiedot tietokantaan ID:n perusteella
    const [result] = await db
      .update(posts)
      .set(parsed.data)
      .where(eq(posts.id, parsedId.data));
    
    // Jos yhtään riviä ei muokattu, postausta ei ollut olemassa
    if (result.affectedRows === 0) {
      return { fieldErrors: { title: ["This post no longer exists."] } };
    }
  } catch (err) {
    // Käsillään duplikaattivirhe (esim. slug on jo toisen postauksen käytössä)
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return { fieldErrors: { slug: ["This slug is already taken."] } };
    }
    throw err;
  }

  const slug = parsed.data.slug;
  // Tyhjennetään välimuisti sekä blogilistaukselta että muokatulta postaukselta
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  // Ohjataan käyttäjä päivitettyyn postaukseen
  redirect(`/blog/${slug}`);
}

/**
 * Poistaa blogikirjoituksen tietokannasta.
 * 
 * @param id - Poistettavan postauksen ID
 */
export async function deletePost(id: number): Promise<void> {
  // Validoidaan ID
  const parsedId = postIdSchema.safeParse(id);
  if (!parsedId.success) {
    return;
  }

  // Poistetaan postaus tietokannasta
  await db.delete(posts).where(eq(posts.id, parsedId.data));

  // Päivitetään blogilistauksen välimuisti ja ohjataan käyttäjä takaisin listaukseen
  revalidatePath("/blog");
  redirect("/blog");
}