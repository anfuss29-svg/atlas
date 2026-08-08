"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { searchNotes } from "@/lib/notes";
import { searchPYQs } from "@/lib/pyq";
import { searchBooks } from "@/lib/books";
import { searchFormulas } from "@/lib/formulas";

type SearchResult = {
  id: number;
  title: string;
  type: "Notes" | "PYQ" | "Book" | "Formula";
  file_url: string;
  subject?: string;
};

export default function Topbar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!showSearch) return;

    const timer = setTimeout(async () => {
      const term = search.trim();

      if (!term) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const [notes, pyqs, books, formulas] = await Promise.all([
          searchNotes(term),
          searchPYQs(term),
          searchBooks(term),
          searchFormulas(term),
        ]);

        const combined: SearchResult[] = [
          ...notes.map((item) => ({
            id: item.id,
            title: item.title,
            type: "Notes" as const,
            file_url: item.file_url,
            subject: item.subject,
          })),

          ...pyqs.map((item) => ({
            id: item.id,
            title: item.title,
            type: "PYQ" as const,
            file_url: item.file_url,
            subject: item.subject,
          })),

          ...books.map((item) => ({
            id: item.id,
            title: item.title,
            type: "Book" as const,
            file_url: item.file_url,
            subject: item.subject,
          })),

          ...formulas.map((item) => ({
            id: item.id,
            title: item.title,
            type: "Formula" as const,
            file_url: item.file_url,
            subject: item.subject,
          })),
        ];

        setResults(combined.slice(0, 20));
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, showSearch]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setShowSearch(true);
      }

      if (event.key === "Escape") {
        setShowSearch(false);
        setSearch("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closeSearch() {
    setShowSearch(false);
    setSearch("");
    setResults([]);
  }

  return (
    <>
      {/* TOPBAR */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#070b14]/90 px-4 backdrop-blur-xl sm:px-6">
        {/* LEFT */}
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Dashboard
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            Good morning, Student
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* SEARCH BUTTON / BAR */}
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="hidden w-56 items-center gap-3 rounded-full border border-slate-800/80 bg-[#0B101E] px-4 py-2.5 text-left text-sm text-slate-500 transition hover:border-blue-500 hover:text-slate-300 lg:flex lg:w-72"
          >
            <Search size={16} />

            <span className="flex-1">
              Search Atlas...
            </span>

            <span className="rounded bg-slate-800/50 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
              ⌘K
            </span>
          </button>

          {/* MOBILE SEARCH */}
          <button
            type="button"
            aria-label="Search Atlas"
            onClick={() => setShowSearch(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Search size={19} />
          </button>

          {/* NOTIFICATIONS */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-lg text-amber-500 transition-colors hover:text-amber-400"
          >
            🔔

            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border border-[#070b14] bg-rose-500" />
          </button>

          {/* AVATAR */}
          <div className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white shadow-md transition hover:opacity-90">
            S
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[10vh] backdrop-blur-sm">
          
          {/* BACKDROP CLICK */}
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="absolute inset-0 cursor-default"
          />

          {/* SEARCH WINDOW */}
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700/80 bg-[#0B101E] shadow-2xl">

            {/* SEARCH INPUT */}
            <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
              <Search
                size={21}
                className="shrink-0 text-blue-400"
              />

              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes, PYQs, books, formulas..."
                className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-600 sm:text-lg"
              />

              <button
                type="button"
                onClick={closeSearch}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* RESULTS */}
            <div className="max-h-[65vh] overflow-y-auto">

              {!search.trim() && (
                <div className="px-6 py-12 text-center">
                  <Search
                    size={42}
                    className="mx-auto text-slate-700"
                  />

                  <p className="mt-4 text-sm text-slate-500">
                    Search across your entire Atlas library.
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    Notes • PYQs • Books • Formula Sheets
                  </p>
                </div>
              )}

              {loading && (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  Searching Atlas...
                </div>
              )}

              {!loading &&
                search.trim() &&
                results.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-400">
                      No results found.
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      Try another keyword.
                    </p>
                  </div>
                )}

              {!loading && results.length > 0 && (
                <div className="p-3">
                  {results.map((result) => (
                    <a
                      key={`${result.type}-${result.id}`}
                      href={result.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeSearch}
                      className="flex items-center gap-4 rounded-2xl p-4 transition hover:bg-slate-800/70"
                    >
                      {/* ICON */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Search size={19} />
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">
                          {result.title}
                        </p>

                        {result.subject && (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {result.subject}
                          </p>
                        )}
                      </div>

                      {/* TYPE */}
                      <span className="shrink-0 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-400">
                        {result.type}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}