import { supabase } from "./supabase";
import { Note } from "@/types/note";

/* =========================================================
   GET NOTES
   ========================================================= */

export async function getNotes(
  year?: number,
  semester?: number,
  subject?: string,
  module?: number
): Promise<Note[]> {
  let query = supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (year !== undefined) {
    query = query.eq("year", year);
  }

  if (semester !== undefined) {
    query = query.eq("semester", semester);
  }

  if (subject !== undefined) {
    query = query.eq("subject", subject);
  }

  if (module !== undefined) {
    query = query.eq("module", module);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data as Note[];
}


/* =========================================================
   SEARCH NOTES
   ========================================================= */

export async function searchNotes(
  searchTerm: string
): Promise<Note[]> {
  const term = searchTerm.trim();

  if (!term) {
    return [];
  }

  /*
    IMPORTANT:

    title and subject are TEXT columns,
    so ilike is safe on them.

    year, semester and module are INTEGER columns,
    so we DO NOT use ilike on them.
  */

  const numericTerm = Number(term);
  const isNumber = !Number.isNaN(numericTerm);

  let query = supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (isNumber) {
    /*
      If the user searches something like:

      1
      2
      2026

      search both text fields AND numeric fields.
    */

    query = query.or(
      `title.ilike.%${term}%,subject.ilike.%${term}%,year.eq.${numericTerm},semester.eq.${numericTerm},module.eq.${numericTerm}`
    );
  } else {
    /*
      Normal text search.

      Example:
      circuits
      mathematics
      physics
      notes
    */

    query = query.or(
      `title.ilike.%${term}%,subject.ilike.%${term}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Search notes error:", error);
    return [];
  }

  return data as Note[];
}