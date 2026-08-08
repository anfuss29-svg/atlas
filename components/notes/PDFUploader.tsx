"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPDF } from "@/lib/storage";

export default function PDFUploader({
  year,
  semester,
  subject,
  module,
}: {
  year: number;
  semester: number;
  subject: string;
  module: number;
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

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setLoading(true);

    try {
      const safeSubject = subject.replace(/[^a-zA-Z0-9-_ ]/g, "");

      const path =
        `Year-${year}/Semester-${semester}/${safeSubject}/Module-${module}/${Date.now()}-${file.name}`;

      const fileUrl = await uploadPDF(file, path);

      const { error } = await supabase
        .from("notes")
        .insert({
          title: title.trim(),
          year,
          semester,
          subject,
          module,
          file_url: fileUrl,
        });

      if (error) {
        throw error;
      }

      alert("PDF uploaded successfully!");

      setTitle("");
      setFile(null);

      window.location.reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
      <h3 className="mb-5 text-2xl font-bold text-white">
        Upload PDF
      </h3>

      <div className="mb-5 rounded-xl bg-[#1B2235] p-4 text-sm text-slate-400">
        <p>
          <strong className="text-slate-200">Year:</strong> {year}
        </p>

        <p>
          <strong className="text-slate-200">Semester:</strong> {semester}
        </p>

        <p>
          <strong className="text-slate-200">Subject:</strong> {subject}
        </p>

        <p>
          <strong className="text-slate-200">Module:</strong> {module}
        </p>
      </div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        PDF Title
      </label>

      <input
        type="text"
        placeholder="Enter PDF title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-5 w-full rounded-xl border border-slate-700 bg-[#0B101E] p-4 text-white outline-none transition focus:border-blue-500"
      />

      <label className="mb-2 block text-sm font-medium text-slate-300">
        PDF File
      </label>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-6 w-full rounded-xl border border-slate-700 bg-[#0B101E] p-3 text-sm text-slate-400"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}