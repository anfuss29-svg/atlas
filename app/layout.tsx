import type { Metadata } from "next";

import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "ATLAS | Engineering Workspace",
  description: "Your engineering copilot and workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full bg-[#070b14] text-slate-200 overflow-x-hidden font-sans antialiased">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}