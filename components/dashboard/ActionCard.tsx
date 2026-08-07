"use client";

import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export default function ActionCard({
  icon,
  title,
  subtitle,
}: Props) {
  return (
    <div className="group cursor-pointer rounded-3xl border border-white/10 bg-[#121723] p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-[#171E2C]">

      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 text-gray-400">
        {subtitle}
      </p>

    </div>
  );
}