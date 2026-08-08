import Link from "next/link";
import {
  BookOpen,
  FileText,
  BookMarked,
  Sigma,
  ArrowRight,
} from "lucide-react";

const cards = [
  {
    title: "Semester Notes",
    description: "Organized semester-wise PDF notes.",
    href: "/knowledge/notes",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Previous Year Questions",
    description: "Subject-wise KTU PYQs.",
    href: "/knowledge/pyq",
    icon: FileText,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Books",
    description: "Reference books and textbooks.",
    href: "/knowledge/books",
    icon: BookMarked,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Formula Sheets",
    description: "Quick revision sheets.",
    href: "/knowledge/formulas",
    icon: Sigma,
    color: "from-emerald-500 to-teal-500",
  },
];

export default function KnowledgePage() {
  return (
    <main className="mx-auto w-full max-w-[1600px]">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#121c3d] via-[#11162b] to-[#0c1020] p-6 sm:p-8 lg:p-10">
        <div className="absolute right-[-150px] top-[-150px] h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
            Atlas
          </p>

          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
            Knowledge Hub
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            All your engineering resources in one place.
          </p>
        </div>
      </section>

      {/* RESOURCE CARDS */}
      <section className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-blue-500 sm:p-7"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
              >
                <Icon size={30} className="text-white" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                {item.title}
              </h2>

              <p className="mt-3 text-slate-400">
                {item.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-blue-400">
                Open
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}