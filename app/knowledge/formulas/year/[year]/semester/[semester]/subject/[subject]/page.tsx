import { supabase } from "@/lib/supabase";
import PDFUploader from "@/components/notes/PDFUploader";

export const dynamic = "force-dynamic";

export default async function FormulaSubjectPage({
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
  const subjectName = decodeURIComponent(subject);

  const { data: formulas, error } = await supabase
    .from("formulas")
    .select("*")
    .eq("year", yearNumber)
    .eq("semester", semesterNumber)
    .eq("subject", subjectName)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#13251f] via-[#101a24] to-[#0b1020] p-10">
        <div className="absolute right-[-100px] top-[-120px] h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-400">
              Σ
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
              Formula Sheets
            </p>
          </div>

          <h1 className="mt-6 text-5xl font-black text-white">
            {subjectName}
          </h1>

          <p className="mt-3 text-slate-400">
            Year {yearNumber} • Semester {semesterNumber}
          </p>
        </div>
      </section>

      {/* Available Formula Sheets */}
      <section className="mt-10">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">
            Available Formula Sheets
          </h2>

          <p className="mt-2 text-slate-400">
            Quick-reference equations and revision material.
          </p>
        </div>

        {!formulas || formulas.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-[#111827] p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl text-emerald-400">
              Σ
            </div>

            <p className="mt-5 text-lg font-semibold text-slate-300">
              No formula sheets uploaded yet.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Upload your first formula sheet below.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {formulas.map((formula) => (
              <a
                key={formula.id}
                href={formula.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-5 transition hover:-translate-y-1 hover:border-emerald-500/60 hover:bg-[#151f2d]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">
                    PDF
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      {formula.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Formula Sheet • PDF
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-emerald-400 transition group-hover:translate-x-1">
                  Open →
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Upload */}
      <section className="mt-10 rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <PDFUploader
          year={yearNumber}
          semester={semesterNumber}
          subject={subjectName}
          type="formulas"
        />
      </section>
    </div>
  );
}