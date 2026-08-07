interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-10">
      <h1 className="gradient-text text-5xl font-black">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-lg text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}