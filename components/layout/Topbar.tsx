"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function Topbar() {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800 bg-[#070b14]/90 px-8 backdrop-blur-xl">

      {/* Left */}

      <div className="flex items-center gap-5">

        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-slate-700 bg-[#111827] p-3 transition hover:border-blue-500 hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>

        <div>

          <h1 className="text-2xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Good morning, Student
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <div className="relative hidden lg:block">

          <input
            type="text"
            placeholder="Search anything..."
            className="w-80 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />

        </div>

        <button className="text-xl transition hover:scale-110">
          🔔
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
          S
        </div>

      </div>

    </header>
  );
}