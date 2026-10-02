import { MODES, STATS, STAT_ABBR, STAT_LABEL, pct, type Contender, type Mode } from '../lib/arena';

export function Leaderboard({ field, mode }: { field: Contender[]; mode: Mode }) {
  const limit = MODES[mode].softLimit;
  return (
    <section aria-labelledby="board-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="board-title" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-teal">
          Standings
        </h2>
        <p className="text-xs text-ink-dim">
          {STATS.map((s) => `${STAT_ABBR[s]} ${STAT_LABEL[s].toLowerCase()}`).join(', ')}
        </p>
      </div>
      <ol className="mt-4 space-y-2.5">
        {field.map((c, i) => {
          const long = c.text.length > limit;
          return (
            <li
              key={c.id}
              className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 gap-y-3 rounded-2xl border px-3 py-3.5 animate-slide-in sm:grid-cols-[3.5rem_1fr_minmax(0,20rem)_5rem] sm:px-4 ${
                c.rank === 1 ? 'border-teal/50 bg-teal-wash/60' : 'border-line bg-panel/70'
              }`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className={`wordmark text-4xl sm:text-5xl ${c.rank === 1 ? 'text-teal' : 'text-ink-dim'}`}>{c.rank}</span>

              <div className="min-w-0">
                <p className="font-semibold leading-snug break-words">{c.text}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
                  <span className="rounded-full bg-deep px-2 py-0.5 text-ink-soft">{pct(c.wouldClick)} click</span>
                  {c.penalty > 0 && (
                    <span className="rounded-full bg-bait-wash px-2 py-0.5 text-bait">Bait -{Math.round(c.penalty)}</span>
                  )}
                  {long && (
                    <span className="rounded-full bg-deep px-2 py-0.5 text-ink-dim">
                      {c.text.length}/{limit} chars
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-3 grid grid-cols-5 gap-2 sm:col-span-1">
                {STATS.map((s, j) => (
                  <div key={s} title={`${STAT_LABEL[s]} ${c.ratings[s]}`}>
                    <div className="flex items-baseline justify-between font-display text-[11px] font-bold uppercase">
                      <span className="text-ink-dim">{STAT_ABBR[s]}</span>
                      <span className="tabular-nums">{c.ratings[s]}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
                      <div
                        className="h-full origin-left rounded-full bg-teal animate-grow"
                        style={{ width: `${Math.max(c.ratings[s], 3)}%`, animationDelay: `${i * 90 + j * 60 + 200}ms` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="row-start-1 col-start-3 text-right sm:col-start-4">
                <span className="wordmark block text-4xl sm:text-5xl">{c.power}</span>
                <span className="font-display text-[11px] font-bold uppercase tracking-widest text-ink-dim">Power</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
