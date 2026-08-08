import { supabase } from "./supabase";
import { Module } from "@/types/module";

export async function getModules(subject: string): Promise<Module[]> {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("subject", subject)
    .order("module");

  if (error) {
    console.error(error);
    return [];
  }

  return data as Module[];
}