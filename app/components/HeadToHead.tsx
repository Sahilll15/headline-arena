'use client';

import { useState } from 'react';
import { STAT_LABEL, fightSummary, headToHead, ordinal, type Contender } from '../lib/arena';
import { CountUp } from './CountUp';

function Corner({
  side,
  field,
  value,
  other,
  onChange,
}: {
  side: 'A' | 'B';
  field: Contender[];
  value: number;
  other: number;
  onChange: (id: number) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">Contender {side}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full truncate rounded-xl border border-line-strong bg-deep px-3 py-2.5 text-sm font-semibold text-ink outline-none transition hover:border-teal focus-visible:border-teal"
      >
        {field.map((c) => (
          <option key={c.id} value={c.id} disabled={c.id === other}>
            {ordinal(c.rank)}: {c.text}
          </option>
        ))}
      </select>
    </label>
  );
}

function Bout({ a, b }: { a: Contender; b: Contender }) {
  const h = headToHead(a, b);
  const extras = [
    { label: 'Would click', a: Math.round(a.wouldClick * 100), b: Math.round(b.wouldClick * 100), lowerWins: false },
    { label: 'Delivers a want', a: Math.round(a.promise * 100), b: Math.round(b.promise * 100), lowerWins: false },
    { label: 'Clickbait', a: Math.round(a.clickbait * 100), b: Math.round(b.clickbait * 100), lowerWins: true },
  ];
  const rows = [
    ...h.rounds.map((r) => ({ label: STAT_LABEL[r.stat], a: r.a, b: r.b, winner: r.winner, suffix: '' })),
    ...extras.map((x) => {
      const diff = x.lowerWins ? x.b - x.a : x.a - x.b;
      return { label: x.label, a: x.a, b: x.b, winner: Math.abs(diff) < 3 ? 'draw' : diff > 0 ? 'a' : 'b', suffix: '%' };
    }),
  ];

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] border border-line-strong bg-gradient-to-b from-panel-2 to-deep">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line px-4 py-6 sm:px-8">
        {[a, b].map((c, i) => {
          const won = h.winner === (i === 0 ? 'a' : 'b');
          return (
            <div key={c.id} className={`min-w-0 ${i === 0 ? 'order-1 text-left' : 'order-3 text-right'}`}>
              <p className={`wordmark text-6xl sm:text-8xl ${won ? 'text-teal' : 'text-ink-dim'}`}>
                <CountUp to={c.power} duration={1000} />
              </p>
              <p className="mt-2 line-clamp-3 text-sm font-semibold leading-snug sm:text-base">{c.text}</p>
              {won && (
                <span className="mt-2 inline-block rounded-full bg-teal px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-widest text-void">
                  Winner
                </span>
              )}
            </div>
          );
        })}
        <span className="order-2 wordmark text-3xl text-ink-dim sm:text-5xl" aria-hidden>
          VS
        </span>
      </div>

      <div className="px-4 py-5 text-center sm:px-8">
        <p className="font-display text-2xl font-extrabold uppercase text-ink sm:text-3xl">{h.method}</p>
        <p className="mt-1 text-sm text-ink-soft">{fightSummary(a, b)}</p>
      </div>

      <ul className="space-y-3 px-4 pb-7 sm:px-8">
        {rows.map((r, i) => (
          <li key={r.label} className="grid grid-cols-[2.5rem_1fr_auto_1fr_2.5rem] items-center gap-2 sm:gap-3">
            <span className={`text-right font-display text-lg font-extrabold tabular-nums ${r.winner === 'a' ? 'text-teal' : 'text-ink-dim'}`}>
              {r.a}
              {r.suffix}
            </span>
            <div className="flex h-2.5 justify-end overflow-hidden rounded-full bg-line" aria-hidden>
              <div
                className={`h-full origin-right rounded-full animate-grow ${r.winner === 'a' ? 'bg-teal' : 'bg-ink-dim/60'}`}
                style={{ width: `${Math.max(r.a, 3)}%`, animationDelay: `${300 + i * 80}ms` }}
              />
            </div>
            <span className="w-24 text-center font-display text-[11px] font-bold uppercase tracking-wider text-ink-soft sm:w-32 sm:text-xs">
              {r.label}
            </span>
            <div className="h-2.5 overflow-hidden rounded-full bg-line" aria-hidden>
              <div
                className={`h-full origin-left rounded-full animate-grow ${r.winner === 'b' ? 'bg-teal' : 'bg-ink-dim/60'}`}
                style={{ width: `${Math.max(r.b, 3)}%`, animationDelay: `${300 + i * 80}ms` }}
              />
            </div>
            <span className={`font-display text-lg font-extrabold tabular-nums ${r.winner === 'b' ? 'text-teal' : 'text-ink-dim'}`}>
              {r.b}
              {r.suffix}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-3 text-center text-xs text-ink-dim sm:px-8">
        Rounds within 3 points are scored even. Lower clickbait wins its round.
      </p>
    </div>
  );
}

export function HeadToHead({ field }: { field: Contender[] }) {
  const [aId, setA] = useState(field[0].id);
  const [bId, setB] = useState(field[1].id);
  const a = field.find((c) => c.id === aId) ?? field[0];
  const b = field.find((c) => c.id === bId) ?? field[1];

  return (
    <section aria-labelledby="h2h-title">
      <h2 id="h2h-title" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-teal">
        Head to head
      </h2>
      <p className="mt-1 text-sm text-ink-soft">Pick any two contenders and see who takes each round.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <Corner side="A" field={field} value={a.id} other={b.id} onChange={setA} />
        <button
          type="button"
          onClick={() => {
            setA(b.id);
            setB(a.id);
          }}
          className="justify-self-center rounded-full border border-line-strong px-4 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-ink-soft transition hover:border-teal hover:text-teal"
        >
          Swap
        </button>
        <Corner side="B" field={field} value={b.id} other={a.id} onChange={setB} />
      </div>
      <Bout key={`${a.id}-${b.id}`} a={a} b={b} />
    </section>
  );
}
