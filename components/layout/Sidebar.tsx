"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "⬡",
    },
    {
      name: "Engineering Hub",
      href: "/tools",
      icon: "⚡",
    },
    {
      name: "Knowledge Hub",
      href: "/knowledge",
      icon: "📚",
    },
    {
      name: "Projects",
      href: "/projects",
      icon: "◈",
    },
    {
      name: "Calculator",
      href: "/calculator",
      icon: "∑",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "◉",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "⚙",
    },
  ];

  const sidebarWidth = collapsed ? "w-20" : "w-72";

  return (
    <>
      {/* ========================================================= */}
      {/* MOBILE MENU BUTTON */}
      {/* ========================================================= */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-[#0B101E] text-slate-300 shadow-lg transition hover:bg-slate-800 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* ========================================================= */}
      {/* MOBILE BACKDROP */}
      {/* ========================================================= */}

      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* ========================================================= */}
      {/* SIDEBAR */}
      {/* ========================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-slate-800
          bg-[#070b14]
          shadow-2xl
          transition-all duration-300 ease-out

          ${sidebarWidth}

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:static
          lg:translate-x-0
          lg:shadow-none
        `}
      >

        {/* ======================================================= */}
        {/* LOGO */}
        {/* ======================================================= */}

        <div className="border-b border-slate-800 px-4 py-6">
          <div
            className={`flex items-center ${
              collapsed
                ? "justify-center"
                : "justify-between"
            }`}
          >

            {/* LOGO */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-4"
              title={collapsed ? "ATLAS" : undefined}
            >

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
                A
              </div>

              {!collapsed && (
                <div>
                  <h1 className="text-2xl font-black tracking-wide text-white">
                    ATLAS
                  </h1>

                  <p className="text-xs text-slate-500">
                    Engineering Workspace
                  </p>
                </div>
              )}

            </Link>

            {/* MOBILE CLOSE */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X size={21} />
            </button>

          </div>
        </div>

        {/* ======================================================= */}
        {/* COLLAPSE / EXPAND BUTTON */}
        {/* ======================================================= */}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="
            absolute
            -right-3
            top-20
            z-[70]
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-slate-700
            bg-[#0B101E]
            text-slate-400
            shadow-md
            transition
            hover:border-blue-500
            hover:text-white
          "
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )}
        </button>

        {/* ======================================================= */}
        {/* NAVIGATION */}
        {/* ======================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

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
                  title={
                    collapsed
                      ? item.name
                      : undefined
                  }
                  className={`
                    flex
                    items-center
                    rounded-xl
                    py-3.5
                    transition-all

                    ${
                      collapsed
                        ? "justify-center px-2"
                        : "gap-4 px-4"
                    }

                    ${
                      active
                        ? "border border-blue-500/20 bg-blue-600/10 text-blue-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }
                  `}
                >

                  {/* ICON */}
                  <span className="w-6 shrink-0 text-center text-lg">
                    {item.icon}
                  </span>

                  {/* NAME */}
                  {!collapsed && (
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  )}

                </Link>
              );
            })}

          </div>

          {/* ===================================================== */}
          {/* AI ASSISTANT */}
          {/* ===================================================== */}

          <div className="mt-8">

            <div
              className={`
                flex
                items-center
                rounded-xl
                bg-slate-900/40
                py-3

                ${
                  collapsed
                    ? "justify-center px-2"
                    : "justify-between px-4"
                }
              `}
              title={
                collapsed
                  ? "AI Assistant — Coming Soon"
                  : undefined
              }
            >

              <div className="flex items-center gap-3">

                <span className="text-lg">
                  ✦
                </span>

                {!collapsed && (
                  <span className="text-sm text-slate-400">
                    AI Assistant
                  </span>
                )}

              </div>

              {!collapsed && (
                <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">
                  SOON
                </span>
              )}

            </div>

          </div>

        </nav>

        {/* ======================================================= */}
        {/* PROFILE + CREATOR CREDIT */}
        {/* ======================================================= */}

        <div className="border-t border-slate-800 p-3">

          {/* PROFILE */}

          <div
            className={`
              flex
              items-center
              rounded-xl
              py-3
              transition
              hover:bg-slate-800/40

              ${
                collapsed
                  ? "justify-center px-2"
                  : "gap-3 px-3"
              }
            `}
            title={
              collapsed
                ? "Anfus • EEE • Semester 1"
                : undefined
            }
          >

            {/* AVATAR */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 font-bold text-white">
              A
            </div>

            {/* PROFILE DETAILS */}

            {!collapsed && (
              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-white">
                  Anfus
                </p>

                <p className="truncate text-xs text-slate-500">
                  EEE • Semester 1
                </p>

              </div>
            )}

          </div>

          {/* ===================================================== */}
          {/* CREATOR CREDIT */}
          {/* ===================================================== */}

          <div
            className={`
              mt-3
              border-t
              border-slate-800/60
              pt-3
              text-center
            `}
          >

            {collapsed ? (

              <span
                title="Atlas • Crafted by Anfus • © 2026"
                className="text-[10px] font-semibold tracking-[0.18em] text-slate-600"
              >
                AS
              </span>

            ) : (

              <p className="text-[10px] tracking-wide text-slate-600">
                Atlas · crafted by{" "}
                <span className="font-semibold text-slate-500">
                  Anfus
                </span>{" "}
                · © 2026
              </p>

            )}

          </div>

        </div>

      </aside>
    </>
  );
}