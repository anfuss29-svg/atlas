import { supabase } from "./supabase";

export interface Formula {
  id: number;
  title: string;
  year: number;
  semester: number;
  subject: string;
  file_url: string;
  created_at: string;
}

export async function searchFormulas(
  search: string
): Promise<Formula[]> {
  const term = search.trim();

  if (!term) {
    return [];
  }

  const { data, error } = await supabase
    .from("formulas")
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

  return data as Formula[];
}