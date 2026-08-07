"use client";

import { Zap, Library } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#182349] via-[#131C36] to-[#161225] p-14">

      <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <p className="mb-5 text-sm uppercase tracking-[7px] text-blue-400">
        Atlas • Engineering Workspace
      </p>

      <h1 className="max-w-3xl text-6xl font-black leading-tight text-white">
        Welcome back,
        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          {" "}
          Student
        </span>
      </h1>

      <p className="mt-5 max-w-3xl text-2xl text-gray-400">
        BTech Electrical & Electronics Engineering • Semester 1
      </p>

      <div className="mt-10 flex gap-5">

        <button className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 text-lg font-semibold transition hover:scale-105">
          <Zap size={20} />
          Open Engineering Hub
        </button>

        <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg transition hover:bg-white/10">
          <Library size={20} />
          Knowledge Hub
        </button>

      </div>

    </section>
  );
}