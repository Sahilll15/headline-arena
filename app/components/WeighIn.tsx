'use client';

import { useEffect, useState } from 'react';
import { STATS, STAT_LABEL } from '../lib/arena';

export function WeighIn({ headlines }: { headlines: string[] }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <section aria-live="polite" aria-busy="true" className="animate-fade-up">
      <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-teal">Weigh-in</p>
      <p className="mt-1 wordmark text-5xl sm:text-6xl">The judges are scoring</p>
      <ul className="mt-6 space-y-2.5">
        {headlines.map((h, i) => (
          <li
            key={h}
            className="relative overflow-hidden rounded-2xl border border-line bg-panel/70 px-4 py-4 animate-slide-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-teal/10 to-transparent animate-scan"
              style={{ animationDelay: `${i * 160}ms` }}
            />
            <div className="relative flex items-center gap-4">
              <span className="wordmark w-8 text-3xl text-ink-dim">?</span>
              <p className="min-w-0 flex-1 truncate font-semibold">{h}</p>
              <span className="hidden font-display text-xs font-bold uppercase tracking-widest text-teal sm:block">
                {STAT_LABEL[STATS[(step + i) % STATS.length]]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
