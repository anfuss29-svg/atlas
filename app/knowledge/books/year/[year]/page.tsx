import Link from "next/link";

export default async function BooksYearPage({
  params,
}: {
  params: Promise<{
    year: string;
  }>;
}) {
  const { year } = await params;
  const yearNumber = Number(year);

  return (
    <div>
      <h1 className="mb-3 text-5xl font-black text-white">
        Year {yearNumber}
      </h1>

      <p className="mb-10 text-slate-400">
        Select a semester to browse reference books.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((semester) => (
          <Link
            key={semester}
            href={`/knowledge/books/year/${yearNumber}/semester/${semester}`}
            className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-orange-500"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl">
              📚
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Semester {semester}
            </h2>

            <p className="mt-3 text-slate-400">
              Browse reference books
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}