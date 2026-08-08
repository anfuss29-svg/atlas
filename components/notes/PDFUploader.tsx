"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPDF } from "@/lib/storage";

export default function PDFUploader({
  year,
  semester,
  subject,
  module,
  type = "notes",
}: {
  year: number;
  semester: number;
  subject: string;
  module?: number;
  type?: "notes" | "pyq";
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!file) {
      alert("Please choose a PDF.");
      return;
    }

    if (type === "notes" && module === undefined) {
      alert("Module is required for Notes.");
      return;
    }

    setLoading(true);

    try {
      const table = type === "pyq" ? "pyq" : "notes";

      let path: string;

      if (type === "pyq") {
        path = `pyq/Year-${year}/Semester-${semester}/${subject}/${Date.now()}-${file.name}`;
      } else {
        path = `notes/Year-${year}/Semester-${semester}/${subject}/Module-${module}/${Date.now()}-${file.name}`;
      }

      const fileUrl = await uploadPDF(file, path);

      let insertData;

      if (type === "pyq") {
        insertData = {
          title: title.trim(),
          year,
          semester,
          subject,
          file_url: fileUrl,
        };
      } else {
        insertData = {
          title: title.trim(),
          year,
          semester,
          subject,
          module,
          file_url: fileUrl,
        };
      }

      const { error } = await supabase
        .from(table)
        .insert(insertData);

      if (error) {
        throw error;
      }

      alert("PDF uploaded successfully!");

      location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">
        Upload {type === "pyq" ? "PYQ" : "Notes"} PDF
      </h2>

      <div className="mb-5 rounded-xl bg-[#1B2235] p-4 text-sm text-slate-300">
        <p>
          <strong>Year:</strong> {year}
        </p>

        <p>
          <strong>Semester:</strong> {semester}
        </p>

        <p>
          <strong>Subject:</strong> {subject}
        </p>

        {type === "notes" && (
          <p>
            <strong>Module:</strong> {module}
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder={
          type === "pyq"
            ? "Title (e.g. KTU S1 2025 PYQ)"
            : "Title (e.g. Class Notes)"
        }
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded-xl bg-[#1B2235] p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-5 w-full rounded-xl bg-[#1B2235] p-4 text-slate-300"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-3 font-bold transition hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}