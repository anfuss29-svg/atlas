import { ReactNode } from "react";

export default function PageContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-8 py-10">
      {children}
    </main>
  );
}