"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: "⬡" },
    { name: "Engineering Hub", href: "/tools", icon: "⚡" },
    { name: "Knowledge Hub", href: "/knowledge", icon: "📚" },
    { name: "Projects", href: "/projects", icon: "◈" },
    { name: "Calculator", href: "/calculator", icon: "∑" },
    { name: "Profile", href: "/profile", icon: "◉" },
    { name: "Settings", href: "/settings", icon: "⚙" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-[#0B101E] text-slate-300 shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-slate-800 bg-[#070b14]
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="border-b border-slate-800 px-6 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
                A
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-wide text-white">
                  ATLAS
                </h1>

                <p className="text-xs text-slate-500">
                  Engineering Workspace
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="text-slate-400 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                    active
                      ? "border border-blue-500/20 bg-blue-600/10 text-blue-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>

                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* AI */}
          <div className="mt-8">
            <div className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">✦</span>

                <span className="text-sm text-slate-400">
                  AI Assistant
                </span>
              </div>

              <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">
                SOON
              </span>
            </div>
          </div>
        </nav>

        {/* Profile */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-800/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 font-bold text-white">
              S
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Student
              </p>

              <p className="text-xs text-slate-500">
                EEE • Semester 1
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}