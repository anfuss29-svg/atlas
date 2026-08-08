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
  type?: "notes" | "pyq" | "books" | "formulas";
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isBooks = type === "books";
  const isPYQ = type === "pyq";
  const isFormulas = type === "formulas";

  async function handleUpload() {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!file) {
      alert("Please choose a PDF.");
      return;
    }

    setLoading(true);

    try {
      const table = isBooks
        ? "books"
        : isPYQ
        ? "pyq"
        : isFormulas
        ? "formulas"
        : "notes";

      const path =
        isBooks || isFormulas
          ? `${type}/Year-${year}/Semester-${semester}/${subject}/${Date.now()}-${file.name}`
          : `${type}/Year-${year}/Semester-${semester}/${subject}/Module-${module}/${Date.now()}-${file.name}`;

      const fileUrl = await uploadPDF(file, path);

      let insertData;

      if (isBooks || isFormulas) {
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

      const db = supabase as any;

      const { error } = await db
        .from(table)
        .insert(insertData);

      if (error) {
        throw error;
      }

      alert(
        isBooks
          ? "Book uploaded successfully!"
          : isPYQ
          ? "PYQ uploaded successfully!"
          : isFormulas
          ? "Formula sheet uploaded successfully!"
          : "PDF uploaded successfully!"
      );

      location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  }

  const uploadType = isBooks
    ? "Book"
    : isPYQ
    ? "PYQ"
    : isFormulas
    ? "Formula Sheet"
    : "Notes";

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-white">
        Upload {uploadType} PDF
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

        {!isBooks && !isFormulas && (
          <p>
            <strong>Module:</strong> {module}
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder={
          isBooks
            ? "Title (e.g. Electrical Engineering Textbook)"
            : isPYQ
            ? "Title (e.g. KTU S1 2025 PYQ)"
            : isFormulas
            ? "Title (e.g. Important Formulas)"
            : "Title (e.g. Class Notes)"
        }
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded-xl bg-[#1B2235] p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] ?? null)
        }
        className="mb-5 w-full rounded-xl bg-[#1B2235] p-4 text-slate-300"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`rounded-xl px-6 py-3 font-bold transition disabled:opacity-50 ${
          isBooks
            ? "bg-orange-600 hover:bg-orange-500"
            : isFormulas
            ? "bg-emerald-600 hover:bg-emerald-500"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}