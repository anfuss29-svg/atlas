"use client";

import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Sigma,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#070B14] pl-80 pr-10 pt-24 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#121c3d] via-[#11162b] to-[#0c1020] p-10">

        <div className="absolute right-[-150px] top-[-150px] h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="relative">

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-400">
            Atlas • Engineering Workspace
          </p>

          <h1 className="text-6xl font-black">
            Welcome back,
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}
              Student
            </span>
          </h1>

          <p className="mt-5 text-xl text-slate-400">
            BTech Electrical & Electronics Engineering • Semester 1
          </p>

          <div className="mt-10 flex gap-5">

            <Link
              href="/knowledge"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold transition hover:scale-105"
            >
              ⚡ Open Engineering Hub
            </Link>

            <Link
              href="/knowledge"
              className="rounded-xl border border-slate-700 bg-[#111827] px-8 py-4 font-semibold hover:bg-slate-800"
            >
              📚 Knowledge Hub
            </Link>

          </div>

        </div>

      </section>

      {/* QUICK ACTIONS */}

      <h2 className="mt-12 mb-6 text-3xl font-bold">
        Quick Actions
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Link
          href="/knowledge"
          className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-blue-500"
        >
          <BookOpen size={42} className="text-blue-400" />

          <h3 className="mt-6 text-3xl font-bold">
            Knowledge Hub
          </h3>

          <p className="mt-3 text-slate-400">
            Notes • PYQs • Books
          </p>
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

          <FolderKanban
            size={42}
            className="text-indigo-400"
          />

          <h3 className="mt-6 text-3xl font-bold">
            Projects
          </h3>

          <p className="mt-3 text-slate-400">
            Manage your work
          </p>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

          <Sigma
            size={42}
            className="text-cyan-400"
          />

          <h3 className="mt-6 text-3xl font-bold">
            Calculator
          </h3>

          <p className="mt-3 text-slate-400">
            Engineering utilities
          </p>

        </div>

        <Link
          href="/knowledge/notes"
          className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-indigo-500"
        >

          <FileText
            size={42}
            className="text-indigo-400"
          />

          <h3 className="mt-6 text-3xl font-bold">
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