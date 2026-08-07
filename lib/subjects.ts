import { supabase } from "./supabase";
import { Subject } from "@/types/subject";

export async function getSubjects(
  year: number,
  semester: number
): Promise<Subject[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("year", year)
    .eq("semester", semester)
    .order("name");

  if (error) {
    console.log("SUBJECT ERROR:");
    console.log(error);
    console.log(JSON.stringify(error, null, 2));
    return [];
  }

  return data as Subject[];
}