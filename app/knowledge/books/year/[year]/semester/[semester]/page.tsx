import Link from "next/link";
import { getSubjects } from "@/lib/subjects";

export const dynamic = "force-dynamic";

export default async function BooksSemesterPage({
  params,
}: {
  params: Promise<{
    year: string;
    semester: string;
  }>;
}) {
  const { year, semester } = await params;

  const yearNumber = Number(year);
  const semesterNumber = Number(semester);

  const subjects = await getSubjects(yearNumber, semesterNumber);

  return (
    <div>
      <h1 className="mb-3 text-5xl font-black text-white">
        Year {yearNumber} • Semester {semesterNumber}
      </h1>

      <p className="mb-10 text-slate-400">
        Select a subject to browse reference books.
      </p>

      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No subjects available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/knowledge/books/year/${yearNumber}/semester/${semesterNumber}/subject/${encodeURIComponent(
                subject.name
              )}`}
              className="rounded-3xl border border-slate-800 bg-[#111827] p-7 transition hover:-translate-y-1 hover:border-orange-500"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
                📚
              </div>

              <h2 className="mt-5 text-2xl font-bold text-white">
                {subject.name}
              </h2>

              <p className="mt-3 text-slate-400">
                Browse reference books
              </p>

              <p className="mt-5 text-sm font-semibold text-orange-400">
                Open →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}