import Link from "next/link";
import {
  BookOpen,
  Sigma,
  FileText,
  Sprout,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111827] via-[#101827] to-[#0b1120] p-7 sm:p-10 lg:p-12">

        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative">

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-400">
            Atlas • Engineering Workspace
          </p>

          <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
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
              href="/tools"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-center font-semibold text-white transition hover:scale-105 sm:px-8 sm:py-4"
            >
              ⚡ Open Engineering Hub
            </Link>

            <Link
              href="/knowledge"
              className="rounded-xl border border-slate-700 bg-[#111827] px-6 py-3 text-center font-semibold text-white transition hover:bg-slate-800 sm:px-8 sm:py-4"
            >
              📚 Knowledge Hub
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <h2 className="mb-6 mt-10 text-2xl font-bold text-white sm:mt-12 sm:text-3xl">
        Quick Actions
      </h2>


      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* ===================================================
            KNOWLEDGE HUB
        =================================================== */}

        <Link
          href="/knowledge"
          className="group rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-blue-500 sm:p-8"
        >

          <BookOpen
            size={42}
            className="text-blue-400 transition group-hover:scale-110"
          />

          <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Knowledge Hub
          </h3>

          <p className="mt-3 text-slate-400">
            Notes • PYQs • Books
          </p>

          <p className="mt-6 text-sm font-semibold text-blue-400">
            Explore →
          </p>

        </Link>


        {/* ===================================================
            FOCUS STUDY
        =================================================== */}

        <Link
          href="/focus"
          className="group rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-emerald-500 sm:p-8"
        >

          <Sprout
            size={42}
            className="text-emerald-400 transition group-hover:scale-110"
          />

          <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Focus Study
          </h3>

          <p className="mt-3 text-slate-400">
            Study timer • Goals • Analytics
          </p>

          <p className="mt-6 text-sm font-semibold text-emerald-400">
            Start focusing →
          </p>

        </Link>


        {/* ===================================================
            CALCULATOR
        =================================================== */}

        <Link
          href="/calculator"
          className="group rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-cyan-500 sm:p-8"
        >

          <Sigma
            size={42}
            className="text-cyan-400 transition group-hover:scale-110"
          />

          <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Calculator
          </h3>

          <p className="mt-3 text-slate-400">
            Engineering utilities
          </p>

          <p className="mt-6 text-sm font-semibold text-cyan-400">
            Open calculator →
          </p>

        </Link>


        {/* ===================================================
            SEMESTER NOTES
        =================================================== */}

        <Link
          href="/knowledge/notes"
          className="group rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-indigo-500 sm:p-8"
        >

          <FileText
            size={42}
            className="text-indigo-400 transition group-hover:scale-110"
          />

          <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Semester Notes
          </h3>

          <p className="mt-3 text-slate-400">
            Browse PDFs
          </p>

          <p className="mt-6 text-sm font-semibold text-indigo-400">
            View notes →
          </p>

        </Link>

      </div>


      {/* =====================================================
          FOCUS SHORTCUT
      ===================================================== */}

      <section className="mt-8 rounded-3xl border border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 p-6 sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <Sprout
                  size={22}
                  className="text-emerald-400"
                />
              </div>

              <div>

                <h2 className="font-bold text-white">
                  Ready to focus?
                </h2>

                <p className="text-sm text-slate-500">
                  Grow your study streak one session at a time.
                </p>

              </div>

            </div>

          </div>

          <Link
            href="/focus"
            className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-500"
          >
            Start Focus Session
          </Link>

        </div>

      </section>

    </main>
  );
}