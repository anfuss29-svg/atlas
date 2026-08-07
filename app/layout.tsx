import type { Metadata } from "next";

import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import {
  SidebarProvider,
} from "@/components/layout/SidebarContext";

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

      <body className="bg-[#070b14] text-slate-200">

        <SidebarProvider>

          <div className="flex h-screen">

            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">

              <Topbar />

              <main className="flex-1 overflow-y-auto bg-[#070b14] p-8">

                {children}

              </main>

            </div>

          </div>

        </SidebarProvider>

      </body>

    </html>
  );
}