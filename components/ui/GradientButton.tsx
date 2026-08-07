"use client";

import { ButtonHTMLAttributes } from "react";

export default function GradientButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 px-6 py-3 font-semibold transition duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,.35)] ${className}`}
    >
      {children}
    </button>
  );
}