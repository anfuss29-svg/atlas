"use client";

import { useState } from "react";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="mb-10 rounded-3xl bg-[#131a2d] p-8">

      <h2 className="mb-6 text-3xl font-bold">
        Create Note
      </h2>

      <div className="space-y-4">

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#1c2438] p-4 outline-none"
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl bg-[#1c2438] p-4 outline-none"
        />

        <input
          placeholder="Semester"
          type="number"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full rounded-xl bg-[#1c2438] p-4 outline-none"
        />

        <textarea
          placeholder="Write your notes..."
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl bg-[#1c2438] p-4 outline-none"
        />

        <button
          className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-500"
        >
          Save Note
        </button>

      </div>

    </div>
  );
}