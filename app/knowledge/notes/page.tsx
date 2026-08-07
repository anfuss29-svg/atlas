import Link from "next/link";

export default function NotesPage() {
  const years = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
  ];

  return (
    <div>

      <h1 className="mb-8 text-5xl font-black text-white">
        Semester Notes
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {years.map((year, index) => (

          <Link
            key={year}
            href={`/knowledge/notes/year/${index + 1}`}
            className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:border-blue-500 hover:-translate-y-1"
          >

            <h2 className="text-3xl font-bold">
              {year}
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