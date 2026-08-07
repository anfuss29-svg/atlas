"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="glass flex items-center rounded-2xl px-5 py-4">
      <Search size={20} />

      <input
        placeholder="Search notes, books, formulas..."
        className="ml-4 w-full bg-transparent outline-none"
      />
    </div>
  );
}