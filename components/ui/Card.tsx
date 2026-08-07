interface CardProps {
  title: string;
  value: string;
  description: string;
}

export default function Card({
  title,
  value,
  description,
}: CardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-blue-500 hover:bg-white/10">
      <p className="text-gray-400">{title}</p>

      <h2 className="mt-3 text-5xl font-black">
        {value}
      </h2>

      <p className="mt-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}