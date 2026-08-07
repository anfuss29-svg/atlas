import Link from "next/link";
import { getSubjects } from "@/lib/subjects";

export const dynamic = "force-dynamic";

export default async function SemesterPage({
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

  const subjects = await getSubjects(
    yearNumber,
    semesterNumber
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#121c3d] via-[#11162b] to-[#0c1020] p-8">

        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />

        <div className="relative">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            Semester Notes
          </p>

          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
            Year {year}
            <span className="text-blue-400">
              {" "}• Semester {semester}
            </span>
          </h1>

          <p className="mt-4 text-slate-400">
            Choose a subject to browse notes and study resources.
          </p>

        </div>

      </section>


      {/* SUBJECT COUNT */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Subjects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {subjects.length} subjects available
          </p>

        </div>

      </div>


      {/* SUBJECT GRID */}

      {subjects.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-slate-700 bg-[#0B101E] p-14 text-center">

          <div className="text-5xl">
            📚
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            No subjects yet
          </h2>

          <p className="mt-2 text-slate-500">
            Subjects added for this semester will appear here.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {subjects.map((subject, index) => (

            <Link
              key={subject.id}
              href={`/knowledge/notes/year/${year}/semester/${semester}/subject/${encodeURIComponent(subject.name)}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-[0_15px_50px_rgba(37,99,235,0.12)]"
            >

              {/* Glow */}

              <div className="absolute right-[-70px] top-[-70px] h-40 w-40 rounded-full bg-blue-600/0 blur-[60px] transition group-hover:bg-blue-600/10" />


              {/* NUMBER */}

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400">

                  {String(index + 1).padStart(2, "0")}

                </div>

                <span className="text-xl text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-blue-400">
                  →
                </span>

              </div>


              {/* SUBJECT */}

              <h2 className="relative mt-8 text-2xl font-bold text-white">
                {subject.name}
              </h2>

              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                Browse modules, PDFs and study materials.
              </p>


              {/* FOOTER */}

              <div className="relative mt-7 border-t border-slate-800 pt-4">

                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Open Subject
                </span>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}