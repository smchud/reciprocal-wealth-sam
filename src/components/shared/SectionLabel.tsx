interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <span
      className={`inline-block text-base md:text-lg font-semibold uppercase tracking-[0.1em] text-forest ${className}`}
    >
      {children}
    </span>
  );
}
