import Link from "next/link";

export default async function PYQYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  const yearNumber = Number(year);

  return (
    <div>
      <h1 className="mb-3 text-5xl font-black text-white">
        Year {yearNumber}
      </h1>

      <p className="mb-10 text-slate-400">
        Select a semester.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((semester) => (
          <Link
            key={semester}
            href={`/knowledge/pyq/year/${yearNumber}/semester/${semester}`}
            className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-blue-500"
          >
            <h2 className="text-3xl font-bold">
              Semester {semester}
            </h2>

            <p className="mt-3 text-slate-400">
              Browse subjects
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}