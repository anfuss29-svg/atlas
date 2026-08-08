import Link from "next/link";

export default function PYQPage() {
  const years = [1, 2, 3, 4];

  return (
    <div>
      <h1 className="mb-3 text-5xl font-black text-white">
        Previous Year Questions
      </h1>

      <p className="mb-10 text-slate-400">
        Browse KTU previous year questions year-wise.
      </p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {years.map((year) => (
          <Link
            key={year}
            href={`/knowledge/pyq/year/${year}`}
            className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-blue-500"
          >
            <h2 className="text-3xl font-bold text-white">
              Year {year}
            </h2>

            <p className="mt-3 text-slate-400">
              Browse semesters
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}