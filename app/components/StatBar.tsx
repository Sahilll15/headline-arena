export function StatBar({
  label,
  value,
  delay = 0,
  tone = 'teal',
  size = 'md',
}: {
  label: string;
  value: number;
  delay?: number;
  tone?: 'teal' | 'bait' | 'dim';
  size?: 'sm' | 'md';
}) {
  const fill = { teal: 'bg-teal', bait: 'bg-bait', dim: 'bg-ink-dim' }[tone];
  return (
    <div className={size === 'sm' ? 'space-y-1' : 'space-y-1.5'}>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`font-display font-bold uppercase tracking-wide text-ink-soft ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {label}
        </span>
        <span className={`font-display font-extrabold tabular-nums ${size === 'sm' ? 'text-sm' : 'text-lg'}`}>{value}</span>
      </div>
      <div
        className={`overflow-hidden rounded-full bg-line ${size === 'sm' ? 'h-1.5' : 'h-2'}`}
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full origin-left rounded-full animate-grow ${fill}`}
          style={{ width: `${Math.max(value, 2)}%`, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
