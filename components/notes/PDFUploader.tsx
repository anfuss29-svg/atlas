"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPDF } from "@/lib/storage";

export default function PDFUploader({
  year,
  semester,
  subject,
}: {
  year: number;
  semester: number;
  subject: string;
}) {
  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please choose a PDF.");
      return;
    }

    setLoading(true);

    try {
      const path =
        `Year-${year}/Semester-${semester}/${subject}/${Date.now()}-${file.name}`;

      const fileUrl = await uploadPDF(file, path);

      const { error } = await supabase
        .from("notes")
        .insert({
          title,
          year,
          semester,
          subject,
          module,
          file_url: fileUrl,
        });

      if (error) throw error;

      alert("PDF Uploaded Successfully!");

      location.reload();
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

      <h2 className="mb-6 text-3xl font-bold">
        Upload PDF
      </h2>

      <div className="mb-6 rounded-2xl bg-[#1B2235] p-5">

        <p>
          <strong>Year:</strong> {year}
        </p>

        <p>
          <strong>Semester:</strong> {semester}
        </p>

        <p>
          <strong>Subject:</strong> {subject}
        </p>

      </div>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded-xl bg-[#1B2235] p-4"
      />

      <input
        placeholder="Module"
        value={module}
        onChange={(e) => setModule(e.target.value)}
        className="mb-4 w-full rounded-xl bg-[#1B2235] p-4"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] ?? null)
        }
        className="mb-6 w-full rounded-xl bg-[#1B2235] p-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

    </div>
  );
}