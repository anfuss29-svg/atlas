import PDFUploader from "@/components/notes/PDFUploader";
import { getNotes } from "@/lib/notes";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{
    year: string;
    semester: string;
    subject: string;
  }>;
}) {
  const { year, semester, subject } = await params;

  const notes = await getNotes();

  const filtered = notes.filter(
    (note) =>
      note.semester === Number(semester) &&
      note.subject === decodeURIComponent(subject)
  );

  return (
    <div>

      <h1 className="text-5xl font-black text-white">
        {decodeURIComponent(subject)}
      </h1>

      <p className="mt-3 text-slate-400">
        Year {year} • Semester {semester}
      </p>

      <div className="mt-10">
        <PDFUploader
            year={Number(year)}
            semester={Number(semester)}
            subject={decodeURIComponent(subject)}
        />
      </div>

      <div className="mt-10">

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
            No PDFs uploaded yet.
          </div>
        ) : (
          <div className="grid gap-6">

            {filtered.map((note) => (
              <div
                key={note.id}
                className="rounded-3xl border border-slate-800 bg-[#111827] p-6"
              >
                <h2 className="text-2xl font-bold">
                  {note.title}
                </h2>

                <p className="mt-2 text-slate-400">
                  {note.module}
                </p>

                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
                >
                  Open PDF
                </a>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}