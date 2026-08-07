"use client";

import ActionCard from "./ActionCard";

import {
  Library,
  FolderKanban,
  Sigma,
  BookOpen,
} from "lucide-react";

export default function QuickActions() {
  return (
    <section className="mt-10">

      <h2 className="mb-8 text-3xl font-bold text-white">
        Quick Actions
      </h2>

      <div className="grid grid-cols-4 gap-8">

        <ActionCard
          icon={<Library size={34} />}
          title="Knowledge Hub"
          subtitle="Notes • PYQs • Books"
        />

        <ActionCard
          icon={<FolderKanban size={34} />}
          title="Projects"
          subtitle="Manage your work"
        />

        <ActionCard
          icon={<Sigma size={34} />}
          title="Calculator"
          subtitle="Engineering utilities"
        />

        <ActionCard
          icon={<BookOpen size={34} />}
          title="Semester Notes"
          subtitle="Browse all PDFs"
        />

      </div>

    </section>
  );
}