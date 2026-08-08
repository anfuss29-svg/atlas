import { getPYQs } from "@/lib/pyq";
import PDFUploader from "@/components/notes/PDFUploader";

export const dynamic = "force-dynamic";

export default async function PYQSubjectPage({
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

  const pyqs = await getPYQs(
    yearNumber,
    semesterNumber,
    subjectName
  );

  return (
    <div>
      {/* Subject Header */}

      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#121a35] to-[#0c1122] p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
          Previous Year Questions
        </p>

        <h1 className="mt-4 text-5xl font-black text-white">
          {subjectName}
        </h1>

        <p className="mt-3 text-slate-400">
          Year {yearNumber} • Semester {semesterNumber}
        </p>
      </section>

      {/* PYQ List */}

      <section className="mt-10 rounded-3xl border border-slate-800 bg-[#0d1323] p-8">
        <h2 className="text-3xl font-bold text-white">
          Previous Year Questions
        </h2>

        <p className="mt-2 text-slate-400">
          Question papers available for this subject.
        </p>

        <div className="mt-8 space-y-4">
          {pyqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
              <p className="text-lg font-semibold text-slate-300">
                No PYQs uploaded yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Uploaded question papers will appear here.
              </p>
            </div>
          ) : (
            pyqs.map((pyq) => (
              <a
                key={pyq.id}
                href={pyq.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-5 transition hover:border-blue-500 hover:bg-[#172036]"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    {pyq.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    PDF • Click to open
                  </p>
                </div>

                <span className="rounded-xl bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-400">
                  Open PDF →
                </span>
              </a>
            ))
          )}
        </div>
      </section>

      {/* Upload */}

      <section className="mt-10 rounded-3xl border border-slate-800 bg-[#0d1323] p-8">
        <PDFUploader
          year={yearNumber}
          semester={semesterNumber}
          subject={subjectName}
          type="pyq"
        />
      </section>
    </div>
  );
}