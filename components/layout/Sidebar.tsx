"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  FolderKanban,
  Calculator,
  User,
  Settings,
  Sparkles,
  Shield,
} from "lucide-react";

import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Engineering Hub",
    href: "/tools",
    icon: Wrench,
  },
  {
    name: "Knowledge Hub",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Calculator",
    href: "/calculator",
    icon: Calculator,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Shield,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-slate-800 bg-[#0B1120] transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}

      <div className="border-b border-slate-800 p-5">

        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-4"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
            A
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-2xl font-black text-white">
                ATLAS
              </h1>

              <p className="text-xs text-slate-500">
                Engineering Workspace
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-3 py-5">

        <div className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : ""}
                className={`group flex items-center rounded-xl transition-all duration-200 ${
                  collapsed
                    ? "justify-center p-3"
                    : "gap-4 px-4 py-3"
                } ${
                  active
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={22}
                  className={active ? "text-blue-400" : ""}
                />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}

        </div>

      </nav>

      {/* AI */}

      <div className="px-3">

        <div
          className={`rounded-xl bg-slate-900/60 transition-all ${
            collapsed ? "p-3" : "p-4"
          }`}
        >
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <Sparkles
              size={20}
              className="text-violet-400"
            />

            {!collapsed && (
              <>
                <span className="text-sm text-slate-300">
                  AI Assistant
                </span>

                <span className="ml-auto rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">
                  SOON
                </span>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800 p-4">

        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
            S
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-white">
                Student
              </p>

              <p className="text-xs text-slate-500">
                EEE • Semester 1
              </p>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
}