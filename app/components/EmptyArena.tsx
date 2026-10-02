const RULES = [
  { n: '60', label: 'Five judged stats', body: 'Curiosity, clarity, specificity, emotional pull and credibility, each scored on a five step scale.' },
  { n: '25', label: 'Would they click', body: 'The chance a reader in your audience clicks or opens it in that format.' },
  { n: '15', label: 'Delivers a want', body: 'Whether it promises something your audience actually wants.' },
  { n: '-30', label: 'Clickbait penalty', body: 'Up to 30 points off once the clickbait chance passes 50%.' },
];

export function EmptyArena() {
  return (
    <section aria-labelledby="rules-title" className="animate-fade-up">
      <p id="rules-title" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-teal">
        How the belt is won
      </p>
      <p className="mt-1 max-w-2xl text-ink-soft">
        Every headline gets a power rating out of 100. The ring is empty for now. Paste your own contenders or load a sample bout.
      </p>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RULES.map((r) => (
          <li key={r.label} className="rounded-2xl border border-dashed border-line-strong bg-panel/40 p-5">
            <span className={`wordmark text-6xl ${r.n.startsWith('-') ? 'text-bait' : 'text-teal'}`}>{r.n}</span>
            <p className="mt-3 font-display text-lg font-bold uppercase">{r.label}</p>
            <p className="mt-1 text-sm text-ink-soft">{r.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 space-y-2.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-4 rounded-2xl border border-dashed border-line px-4 py-4 opacity-60">
            <span className="wordmark w-8 text-3xl text-line-strong">{n}</span>
            <span className="h-3 flex-1 rounded-full bg-line" style={{ maxWidth: `${70 - n * 12}%` }} />
            <span className="wordmark text-3xl text-line-strong">--</span>
          </div>
        ))}
      </div>
    </section>
  );
}
