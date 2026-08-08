import Link from "next/link";
import PDFUploader from "@/components/notes/PDFUploader";

export const dynamic = "force-dynamic";

export default async function ModuleUploadPage({
  params,
}: {
  params: Promise<{
    year: string;
    semester: string;
    subject: string;
    module: string;
  }>;
}) {
  const { year, semester, subject, module } = await params;

  const yearNumber = Number(year);
  const semesterNumber = Number(semester);
  const moduleNumber = Number(module);

  const decodedSubject = decodeURIComponent(subject);

  return (
    <main className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href={`/knowledge/notes/year/${year}/semester/${semester}/subject/${encodeURIComponent(decodedSubject)}`}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to {decodedSubject}
        </Link>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-blue-400">
          Year {yearNumber} · Semester {semesterNumber}
        </p>

        <h1 className="mt-2 text-5xl font-black text-white">
          Module {moduleNumber}
        </h1>

        <p className="mt-3 text-slate-400">
          Upload a PDF and give it the title you want displayed.
        </p>
      </div>

      <PDFUploader
        year={yearNumber}
        semester={semesterNumber}
        subject={decodedSubject}
        module={moduleNumber}
      />
    </main>
  );
}