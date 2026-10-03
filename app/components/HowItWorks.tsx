import {
  CLICKBAIT_FREE,
  CLICKBAIT_MAX_PENALTY,
  CLICKBAIT_QUESTION,
  MAX_HEADLINES,
  MIN_HEADLINES,
  MODES,
  STATS,
  STAT_LABEL,
  STAT_QUESTION,
  WEIGHTS,
  tier,
  type Mode,
} from '../lib/arena';

const TIERS = [80, 65, 50, 35, 0].map((min) => ({ min, name: tier(min) }));

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="mt-24 border-t border-line pt-14">
      <h2 id="how-title" className="wordmark text-5xl sm:text-6xl">
        How headlines are compared
      </h2>
      <p className="mt-5 max-w-3xl text-lg text-ink-soft">
        Headline Arena lets you compare {MIN_HEADLINES} to {MAX_HEADLINES} headlines at once instead of scoring one in isolation. Jev
        scores each one for the division and audience you pick, then the field is ranked by power rating out of 100. Every number
        comes from Jev answering typed questions. Every sentence on the results is a template filled with those numbers.
      </p>

      <h3 className="mt-12 font-display text-2xl font-bold uppercase tracking-wide">The five stats</h3>
      <ul className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {STATS.map((s) => {
          const q = STAT_QUESTION[s];
          return (
            <li key={s} className="rounded-2xl border border-line-strong bg-panel/60 p-5">
              <p className="font-display text-lg font-bold uppercase tracking-wide text-teal">{STAT_LABEL[s]}</p>
              <p className="mt-2 text-ink">{q.instructions}</p>
              <p className="mt-2 text-sm text-ink-soft">
                Scored from &quot;{q.criteria[0]}&quot; to &quot;{q.criteria[q.criteria.length - 1]}&quot;. Worth{' '}
                {Math.round(WEIGHTS[s] * 100)}% of the stat score.
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide">The power rating</h3>
          <ul className="mt-4 space-y-3 text-ink-soft">
            <li>
              <span className="font-semibold text-ink">60 points</span> come from the five stats above.
            </li>
            <li>
              <span className="font-semibold text-ink">25 points</span> come from the chance a reader in your audience clicks or opens
              it in that format.
            </li>
            <li>
              <span className="font-semibold text-ink">15 points</span> come from whether it promises something that audience actually
              wants.
            </li>
            <li>
              <span className="font-semibold text-bait">Up to {CLICKBAIT_MAX_PENALTY} points off</span> once the chance it is
              clickbait passes {Math.round(CLICKBAIT_FREE * 100)}%. Clickbait here means it {CLICKBAIT_QUESTION.criteria.true}. The
              check is meant to pass a headline that {CLICKBAIT_QUESTION.criteria.false}.
            </li>
          </ul>
          <p className="mt-5 text-sm text-ink-soft">
            Ratings sort into tiers:{' '}
            {TIERS.map((t) => `${t.name} ${t.min ? `at ${t.min} and up` : 'below that'}`).join(', ')}.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide">Head to head</h3>
          <p className="mt-4 text-ink-soft">
            Pick any two headlines and they go five rounds, one per stat. A round is a draw when the two are less than 3 points apart. The
            decision follows the power rating: a gap of 15 or more is a knockout, 6 or more a unanimous decision, and anything closer a
            split decision. When the ratings tie, the higher click chance wins.
          </p>

          <h3 className="mt-10 font-display text-2xl font-bold uppercase tracking-wide">Divisions</h3>
          <ul className="mt-4 space-y-2.5 text-ink-soft">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <li key={m}>
                <span className="font-semibold text-ink">{MODES[m].label}.</span> Judged as {MODES[m].format}. Lines over{' '}
                {MODES[m].softLimit} characters are marked as long.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
