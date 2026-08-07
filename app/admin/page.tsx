import Link from "next/link";

const cards = [
  {
    title: "Manage Subjects",
    href: "/admin/subjects",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Manage Books",
    href: "/admin/books",
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "Manage PYQs",
    href: "/admin/pyqs",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Manage Formula Sheets",
    href: "/admin/formulas",
    color: "from-green-500 to-emerald-500",
  },
];

export default function AdminPage() {
  return (
    <div>

      <h1 className="mb-10 text-5xl font-black">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (

          <Link
            key={card.title}
            href={card.href}
            className="rounded-3xl border border-slate-800 bg-[#111827] p-8 transition hover:-translate-y-1 hover:border-blue-500"
          >

            <div className={`mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br ${card.color}`} />

            <h2 className="text-2xl font-bold">
              {card.title}
            </h2>

          </Link>

        ))}

      </div>

    </div>
  );
}