import { supabase } from "./supabase";
import { PYQ } from "@/types/pyq";

export async function getPYQs(
  year: number,
  semester: number,
  subject: string
): Promise<PYQ[]> {
  const { data, error } = await supabase
    .from("pyq")
    .select("*")
    .eq("year", year)
    .eq("semester", semester)
    .eq("subject", subject)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data as PYQ[];
}

export async function searchPYQs(search: string): Promise<PYQ[]> {
  const term = search.trim();

  if (!term) {
    return [];
  }

  const { data, error } = await supabase
    .from("pyq")
    .select("*")
    .or(
      `title.ilike.%${term}%,subject.ilike.%${term}%`
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return [];
  }

  return data as PYQ[];
}