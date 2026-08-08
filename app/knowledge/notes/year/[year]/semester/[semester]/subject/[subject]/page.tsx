import Link from "next/link";
import { getNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function SubjectNotesPage({
  params,
}: {
  params: Promise<{
    year: string;
    semester: string;
    subject: string;
  }>;
}) {
  const { year, semester, subject } = await params;

  const yearNumber = Number(year);
  const semesterNumber = Number(semester);
  const decodedSubject = decodeURIComponent(subject);

  const notes = await getNotes(
    yearNumber,
    semesterNumber,
    decodedSubject
  );

  const modules = [1, 2, 3, 4];

  return (
    <main className="space-y-8">
      <div>
        <Link
          href={`/knowledge/notes/year/${year}/semester/${semester}`}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Subjects
        </Link>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-blue-400">
          Year {yearNumber} · Semester {semesterNumber}
        </p>

        <h1 className="mt-2 text-5xl font-black text-white">
          {decodedSubject}
        </h1>

        <p className="mt-3 text-slate-400">
          Semester notes organized by module.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((moduleNumber) => {
          const moduleNotes = notes.filter(
            (note) => note.module === moduleNumber
          );

          return (
            <section
              key={moduleNumber}
              className="rounded-3xl border border-slate-800 bg-[#111827] p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Module
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Module {moduleNumber}
                  </h2>
                </div>

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {moduleNotes.length} PDF
                  {moduleNotes.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {moduleNotes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-500">
                    No PDFs uploaded yet.
                  </div>
                ) : (
                  moduleNotes.map((note) => (
                    <a
                      key={note.id}
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0B101E] p-4 transition hover:border-blue-500/50 hover:bg-slate-900"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-xl">📄</span>

                        <span className="truncate font-medium text-slate-200">
                          {note.title}
                        </span>
                      </div>

                      <span className="ml-4 text-sm text-blue-400">
                        Open →
                      </span>
                    </a>
                  ))
                )}

                <Link
                  href={`/knowledge/notes/year/${year}/semester/${semester}/subject/${encodeURIComponent(decodedSubject)}/module/${moduleNumber}`}
                  className="flex w-full items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm font-semibold text-blue-400 transition hover:border-blue-500/60 hover:bg-blue-500/10"
                >
                  + Upload PDF
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}