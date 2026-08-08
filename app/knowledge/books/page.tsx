import Link from "next/link";

export default function BooksPage() {
  const years = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
  ];

  return (
    <div>
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#241b10] via-[#17151b] to-[#0b1020] p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-orange-400">
          Atlas • Library
        </p>

        <h1 className="mt-3 text-5xl font-black text-white">
          Reference Books
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          Browse engineering textbooks and reference material by year,
          semester, and subject.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {years.map((year, index) => (
          <Link
            key={year}
            href={`/knowledge/books/year/${index + 1}`}
            className="group rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-orange-500"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">
              📚
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              {year}
            </h2>

            <p className="mt-3 text-slate-400">
              Browse semesters
            </p>

            <div className="mt-6 text-sm font-semibold text-orange-400 transition group-hover:translate-x-1">
              Open →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}