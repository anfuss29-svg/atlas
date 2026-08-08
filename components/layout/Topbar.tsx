"use client";

import { Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-800 bg-[#070b14]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="min-w-0 pl-14 lg:pl-0">
        <p className="text-sm font-semibold text-white sm:text-base">
          Dashboard
        </p>

        <p className="hidden text-xs text-slate-500 sm:block">
          Good morning, Student · 10:44 AM
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search tools, notes..."
            className="w-56 rounded-full border border-slate-800/80 bg-[#0B101E] py-2.5 pl-9 pr-12 text-sm text-slate-300 placeholder-slate-600 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 lg:w-72"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded bg-slate-800/50 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
            ⌘K
          </span>
        </div>

        {/* Mobile search icon */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white md:hidden">
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button className="relative text-lg text-amber-500 transition-colors hover:text-amber-400">
          🔔

          <span className="absolute right-0 top-0 h-2 w-2 rounded-full border border-[#070b14] bg-rose-500" />
        </button>

        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white shadow-md hover:opacity-90">
          S
        </div>
      </div>
    </header>
  );
}