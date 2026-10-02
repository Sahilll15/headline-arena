'use client';

import { useState } from 'react';
import {
  MODES,
  STATS,
  STAT_LABEL,
  championLine,
  ordinal,
  pct,
  scoutingReport,
  tier,
  type Contender,
  type Mode,
} from '../lib/arena';
import { CountUp } from './CountUp';
import { StatBar } from './StatBar';

function headlineSize(text: string) {
  if (text.length <= 36) return 'text-[2.6rem] sm:text-5xl';
  if (text.length <= 64) return 'text-[2.1rem] sm:text-[2.6rem]';
  return 'text-[1.7rem] sm:text-[2.1rem]';
}

export function ChampionCard({ field, mode }: { field: Contender[]; mode: Mode }) {
  const [index, setIndex] = useState(0);
  const c = field[index];
  const isChamp = c.rank === 1;
  const go = (next: number) => setIndex((next + field.length) % field.length);

  return (
    <section aria-labelledby="hero-title" className="grid gap-6 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-10">
      <div className="animate-fade-up">
        <h2 id="hero-title" className="sr-only">
          {isChamp ? 'Champion' : `${ordinal(c.rank)} place`}
        </h2>
        <article
          key={c.id}
          className="relative isolate flex aspect-[4/5] flex-col overflow-hidden rounded-[28px] border border-line-strong bg-gradient-to-b from-[#173740] via-[#0d2026] to-[#061012] shadow-[0_30px_80px_-30px_rgba(92,194,227,0.35)] animate-slam"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_15%,rgba(92,194,227,0.28),transparent_70%)]" />
          <div
            aria-hidden
            className="wordmark pointer-events-none absolute inset-x-0 top-[2%] -z-10 select-none bg-gradient-to-b from-teal/70 via-teal-deep/30 to-transparent bg-clip-text text-center text-[15rem] text-transparent sm:text-[19rem]"
          >
            <CountUp key={`r${c.id}`} from={field.length} to={c.rank} duration={900} />
          </div>

          <div className="flex items-start justify-between p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-void/60 font-display text-sm font-extrabold uppercase tracking-wider text-teal" title={MODES[mode].label}>
              {MODES[mode].badge}
            </span>
            <span
              className={`rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-widest ${
                isChamp ? 'bg-gold text-void' : 'border border-line-strong bg-void/60 text-ink-soft'
              }`}
            >
              {isChamp ? 'Champion' : tier(c.power)}
            </span>
          </div>

          <div className="mt-auto bg-gradient-to-t from-[#050c0e] via-[#050c0e]/85 to-transparent px-5 pb-6 pt-16 text-center">
            <p className={`wordmark leading-[0.88] text-balance break-words ${headlineSize(c.text)}`}>{c.text}</p>
            <p className="mt-4 font-display text-base font-semibold tracking-wide text-ink-soft">
              {ordinal(c.rank)} <span aria-hidden className="mx-1 text-teal">&bull;</span>
              <span className="text-ink">
                <CountUp key={`p${c.id}`} to={c.power} duration={1300} delay={250} />
              </span>{' '}
              Power
            </p>
          </div>
        </article>

        {field.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink-soft transition hover:border-teal hover:text-teal"
              aria-label="Previous contender"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M9 2 4 7l5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
            <div className="flex items-center gap-2">
              {field.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${ordinal(f.rank)} place`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-teal' : 'w-2 bg-line-strong hover:bg-ink-dim'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink-soft transition hover:border-teal hover:text-teal"
              aria-label="Next contender"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="m5 2 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
          </div>
        )}
      </div>

      <div key={c.id} className="flex flex-col gap-6 rounded-[28px] border border-line bg-panel/70 p-5 backdrop-blur sm:p-7 animate-slide-in">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-teal">
            {isChamp ? 'Tale of the tape' : `${ordinal(c.rank)} place report`}
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">
            {isChamp ? championLine(field) : tier(c.power)}
          </p>
          <p className="mt-3 text-ink-soft">{scoutingReport(c)}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8">
          {STATS.map((s, i) => (
            <StatBar key={s} label={STAT_LABEL[s]} value={c.ratings[s]} delay={200 + i * 90} />
          ))}
        </div>

        <dl className="grid grid-cols-3 gap-2 border-t border-line pt-5 sm:gap-4">
          {[
            { label: 'Would click', value: pct(c.wouldClick), bad: false },
            { label: 'Delivers a want', value: pct(c.promise), bad: false },
            { label: 'Clickbait', value: pct(c.clickbait), bad: c.penalty > 0 },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl px-3 py-3 ${s.bad ? 'bg-bait-wash' : 'bg-deep'}`}>
              <dt className="font-display text-[11px] font-bold uppercase tracking-wider text-ink-dim sm:text-xs">{s.label}</dt>
              <dd className={`mt-1 font-display text-2xl font-extrabold tabular-nums sm:text-3xl ${s.bad ? 'text-bait' : ''}`}>{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="text-sm text-ink-dim">
          Base {c.base} {c.penalty > 0 ? `minus ${c.penalty} clickbait penalty ` : ''}= {c.power} power.
        </p>
      </div>
    </section>
  );
}
