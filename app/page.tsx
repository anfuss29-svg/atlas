import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Sigma,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-[1600px]">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#121c3d] via-[#11162b] to-[#0c1020] p-5 sm:p-7 lg:p-10">
        <div className="absolute right-[-150px] top-[-150px] h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="relative">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-400">
            Atlas • Engineering Workspace
          </p>

          <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
            Welcome back,
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}
              Student
            </span>
          </h1>

          <p className="mt-5 text-base text-slate-400 sm:text-lg lg:text-xl">
            BTech Electrical & Electronics Engineering • Semester 1
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-5">
            <Link
              href="/knowledge"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-center font-semibold transition hover:scale-105 sm:px-8 sm:py-4"
            >
              ⚡ Open Engineering Hub
            </Link>

            {/* FIXED: Knowledge Hub goes to /knowledge */}
            <Link
              href="/knowledge"
              className="rounded-xl border border-slate-700 bg-[#111827] px-6 py-3 text-center font-semibold hover:bg-slate-800 sm:px-8 sm:py-4"
            >
              📚 Knowledge Hub
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <h2 className="mb-6 mt-10 text-2xl font-bold sm:mt-12 sm:text-3xl">
        Quick Actions
      </h2>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* KNOWLEDGE HUB */}
        <Link
          href="/knowledge"
          className="rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-blue-500 sm:p-8"
        >
          <BookOpen size={42} className="text-blue-400" />

          <h3 className="mt-6 text-2xl font-bold sm:text-3xl">
            Knowledge Hub
          </h3>

          <p className="mt-3 text-slate-400">
            Notes • PYQs • Books
          </p>
        </Link>

        {/* PROJECTS */}
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
          <FolderKanban
            size={42}
            className="text-indigo-400"
          />

          <h3 className="mt-6 text-2xl font-bold sm:text-3xl">
            Projects
          </h3>

          <p className="mt-3 text-slate-400">
            Manage your work
          </p>
        </div>

        {/* CALCULATOR */}
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
          <Sigma
            size={42}
            className="text-cyan-400"
          />

          <h3 className="mt-6 text-2xl font-bold sm:text-3xl">
            Calculator
          </h3>

          <p className="mt-3 text-slate-400">
            Engineering utilities
          </p>
        </div>

        {/* SEMESTER NOTES */}
        <Link
          href="/knowledge/notes"
          className="rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-indigo-500 sm:p-8"
        >
          <FileText
            size={42}
            className="text-indigo-400"
          />

          <h3 className="mt-6 text-2xl font-bold sm:text-3xl">
            Semester Notes
          </h3>

          <p className="mt-3 text-slate-400">
            Browse PDFs
          </p>
        </Link>
      </div>
    </main>
  );
}