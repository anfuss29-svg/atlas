import { supabase } from "./supabase";

export async function uploadPDF(file: File, path: string) {
  const { error } = await supabase.storage
    .from("notes")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(path);

  return data.publicUrl;
}