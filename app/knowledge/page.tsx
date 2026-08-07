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
    <main className="space-y-10">

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#131b32] to-[#0b1020] p-10">

        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
          Atlas
        </p>

        <h1 className="mt-3 text-5xl font-black">
          Knowledge Hub
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          All your engineering resources in one place.
        </p>

      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-white/10 bg-[#111827] p-7 transition hover:-translate-y-1 hover:border-blue-500"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
              >
                <Icon size={30} className="text-white" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
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