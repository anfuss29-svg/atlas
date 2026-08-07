import GlassCard from "./GlassCard";

interface Props {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-black">
            {value}
          </h2>
        </div>

        <div className="rounded-2xl bg-blue-500/15 p-4">
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}