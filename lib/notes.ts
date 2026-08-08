import { supabase } from "./supabase";
import { Note } from "@/types/note";

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

export async function searchNotes(search: string): Promise<Note[]> {
  const term = search.trim();

  if (!term) {
    return [];
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .or(
      `title.ilike.%${term}%,subject.ilike.%${term}%,module.ilike.%${term}%`
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return [];
  }

  return data as Note[];
}