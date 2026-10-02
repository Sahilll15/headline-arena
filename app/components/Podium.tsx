import { ordinal, type Contender } from '../lib/arena';
import { CountUp } from './CountUp';

const STEP = {
  1: { height: 'h-44 sm:h-56', medal: 'bg-gold text-void', order: 'order-2', delay: 700 },
  2: { height: 'h-32 sm:h-40', medal: 'bg-silver text-void', order: 'order-1', delay: 350 },
  3: { height: 'h-24 sm:h-28', medal: 'bg-bronze text-void', order: 'order-3', delay: 0 },
} as const;

export function Podium({ field }: { field: Contender[] }) {
  const top = field.slice(0, 3);
  return (
    <section aria-labelledby="podium-title">
      <h2 id="podium-title" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-teal">
        Podium
      </h2>
      <ol className={`mt-5 grid ${top.length === 2 ? "grid-cols-2" : "grid-cols-3"} items-end gap-2 sm:gap-4`}>
        {top.map((c) => {
          const step = STEP[c.rank as 1 | 2 | 3];
          return (
            <li key={c.id} className={`flex min-w-0 flex-col ${step.order}`}>
              <p
                className="mb-3 line-clamp-3 min-h-[3.6em] text-center text-xs leading-tight text-ink-soft animate-fade-up sm:text-sm"
                style={{ animationDelay: `${step.delay + 500}ms` }}
                title={c.text}
              >
                {c.text}
              </p>
              <div
                className={`relative flex origin-bottom flex-col items-center justify-start rounded-t-2xl border border-b-0 border-line-strong bg-gradient-to-b from-panel-2 to-deep pt-4 animate-rise ${step.height}`}
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <span className={`grid h-8 w-8 place-items-center rounded-full font-display text-sm font-extrabold ${step.medal}`}>
                  {c.rank}
                </span>
                <span className="mt-2 wordmark text-4xl sm:text-6xl">
                  <CountUp to={c.power} delay={step.delay + 300} />
                </span>
                <span className="font-display text-[11px] font-bold uppercase tracking-widest text-ink-dim">
                  <span className="sr-only">{ordinal(c.rank)} place, </span>Power
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="h-2 rounded-b-xl bg-line-strong" aria-hidden />
    </section>
  );
}
