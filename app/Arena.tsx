'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { ChampionCard } from './components/ChampionCard';
import { EmptyArena } from './components/EmptyArena';
import { HeadToHead } from './components/HeadToHead';
import { Leaderboard } from './components/Leaderboard';
import { Podium } from './components/Podium';
import { WeighIn } from './components/WeighIn';
import {
  MAX_AUDIENCE_CHARS,
  MAX_HEADLINES,
  MAX_HEADLINE_CHARS,
  MIN_HEADLINES,
  MODES,
  parseHeadlines,
  type ArenaResult,
  type Mode,
} from './lib/arena';
import { SAMPLES, type Sample } from './samples';

type Status = { kind: 'idle' } | { kind: 'loading'; headlines: string[] } | { kind: 'done'; result: ArenaResult } | { kind: 'error'; message: string };

export function Arena({ about, footer }: { about: React.ReactNode; footer: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('email');
  const [raw, setRaw] = useState('');
  const [audience, setAudience] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [run, setRun] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const headlines = useMemo(() => parseHeadlines(raw), [raw]);
  const tooLong = headlines.filter((h) => h.length > MAX_HEADLINE_CHARS).length;
  const problem =
    headlines.length < MIN_HEADLINES
      ? `Add ${MIN_HEADLINES - headlines.length} more ${MIN_HEADLINES - headlines.length === 1 ? 'headline' : 'headlines'}, one per line.`
      : headlines.length > MAX_HEADLINES
        ? `${headlines.length} entered. The arena holds ${MAX_HEADLINES}.`
        : tooLong
          ? `${tooLong} ${tooLong === 1 ? 'headline is' : 'headlines are'} over ${MAX_HEADLINE_CHARS} characters.`
          : null;
  const loading = status.kind === 'loading';

  async function fight(input: { mode: Mode; audience: string; headlines: string[] }) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus({ kind: 'loading', headlines: input.headlines });
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

    try {
      const res = await fetch('/api/arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Something went wrong (${res.status}).`);
      setRun((r) => r + 1);
      setStatus({ kind: 'done', result: data as ArenaResult });
    } catch (err) {
      if (controller.signal.aborted) return;
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }

  function loadSample(s: Sample) {
    setMode(s.mode);
    setAudience(s.audience);
    setRaw(s.headlines.join('\n'));
    fight({ mode: s.mode, audience: s.audience, headlines: s.headlines });
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem || loading) return;
    fight({ mode, audience: audience.trim(), headlines });
  };

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(43,127,155,0.35),transparent_70%)]" />
        <div className="absolute inset-x-0 top-[8vh] flex select-none flex-col items-center text-[#09191e]">
          <span className="wordmark text-[16vw] tracking-[0.12em] outline-text opacity-70">Headline</span>
          <span className="wordmark -mt-[1vw] text-[34vw]">Arena</span>
          <span className="-mt-[2vw] rounded-lg bg-[#0a1c21] px-[4vw] wordmark text-[12vw] text-[#0f2a31]">Open</span>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050c0e_85%)]" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3 rounded-lg">
          <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden>
            <rect x="8" y="34" width="14" height="20" rx="2" fill="#2b7f9b" />
            <rect x="25" y="22" width="14" height="32" rx="2" fill="#5cc2e3" />
            <rect x="42" y="40" width="14" height="14" rx="2" fill="#1f5d71" />
            <path d="M32 6l3.1 6.3 6.9 1-5 4.9 1.2 6.8L32 21.8l-6.2 3.2 1.2-6.8-5-4.9 6.9-1z" fill="#eef6f7" />
          </svg>
          <span className="leading-none">
            <span className="block font-display text-[10px] font-bold uppercase tracking-[0.35em] text-ink-dim">Headline</span>
            <span className="block wordmark text-2xl">Arena</span>
          </span>
        </Link>
        <p className="text-right font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">
          Judged by <span className="text-teal">Jev</span>
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <section className="pt-6 sm:pt-12">
          <h1 className="wordmark text-[3.6rem] sm:text-8xl lg:text-[8.5rem]">
            <span className="mb-4 block font-display text-sm leading-normal font-bold tracking-[0.25em] text-teal">
              Headline tester and analyzer
            </span>
            Who wins
            <br />
            the click?
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Compare 2 to 8 headlines, blog titles or email subject lines side by side. Each is scored on five stats, docked for
            clickbait, and ranked by power rating.
          </p>
        </section>

        <form onSubmit={submit} className="mt-10 rounded-[28px] border border-line bg-panel/80 p-4 backdrop-blur sm:p-7">
          <fieldset>
            <legend className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">Division</legend>
            <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 py-1">
              {(Object.keys(MODES) as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition ${
                    mode === m
                      ? 'bg-teal text-void shadow-[0_0_24px_-4px_rgba(92,194,227,0.7)]'
                      : 'border border-line-strong bg-deep text-ink-soft hover:border-teal hover:text-ink'
                  }`}
                >
                  {MODES[m].label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="headlines" className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">
                Contenders, one per line
              </label>
              <span
                className={`font-display text-sm font-bold tabular-nums ${
                  headlines.length > MAX_HEADLINES ? 'text-bait' : headlines.length >= MIN_HEADLINES ? 'text-teal' : 'text-ink-dim'
                }`}
              >
                {headlines.length}/{MAX_HEADLINES}
              </span>
            </div>
            <textarea
              id="headlines"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={6}
              placeholder={'How we cut our deploy time from 40 minutes to 6\nThoughts on CI\nThe secret deploy trick nobody talks about'}
              className="mt-2 w-full resize-y rounded-2xl border border-line-strong bg-deep px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-dim/70 outline-none transition focus-visible:border-teal"
              aria-describedby="headline-hint"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="audience" className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">
              Audience <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              maxLength={MAX_AUDIENCE_CHARS}
              placeholder="Engineering managers at early stage startups"
              className="mt-2 w-full rounded-2xl border border-line-strong bg-deep px-4 py-3 text-base text-ink placeholder:text-ink-dim/70 outline-none transition focus-visible:border-teal"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={Boolean(problem) || loading}
                className="rounded-full bg-teal px-7 py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-void transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? 'Judging...' : 'Ring the bell'}
              </button>
              <p id="headline-hint" className="text-sm text-ink-dim">
                {problem ?? `${headlines.length} contenders ready.`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">Try a sample</span>
              {SAMPLES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  disabled={loading}
                  onClick={() => loadSample(s)}
                  className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-semibold text-ink-soft transition hover:border-teal hover:text-ink disabled:opacity-40"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div ref={resultsRef} className="scroll-mt-6 pt-14">
          {status.kind === 'idle' && <EmptyArena />}
          {status.kind === 'loading' && <WeighIn headlines={status.headlines} />}
          {status.kind === 'error' && (
            <div role="alert" className="rounded-[28px] border border-bait/40 bg-bait-wash/60 p-6 animate-fade-up">
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-bait">No contest</p>
              <p className="mt-2 text-lg">{status.message}</p>
              <button
                type="button"
                onClick={() => setStatus({ kind: 'idle' })}
                className="mt-4 rounded-full border border-bait/50 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-bait transition hover:bg-bait hover:text-void"
              >
                Back to the ring
              </button>
            </div>
          )}
          {status.kind === 'done' && <Results key={run} result={status.result} />}
        </div>

        {about}
      </main>

      {footer}
    </div>
  );
}

function Results({ result }: { result: ArenaResult }) {
  const { contenders, mode, audience, inputTokens, cost } = result;
  return (
    <div className="space-y-16">
      <div>
        <p className="mb-5 text-sm text-ink-dim">
          {MODES[mode].label} division, {contenders.length} contenders{audience ? `, audience is ${audience.charAt(0).toLowerCase()}${audience.slice(1)}` : ''}.
        </p>
        <ChampionCard field={contenders} mode={mode} />
      </div>
      <div className="mx-auto max-w-3xl">
        <Podium field={contenders} />
      </div>
      <Leaderboard field={contenders} mode={mode} />
      <HeadToHead field={contenders} />
      <p className="text-xs text-ink-dim">
        {inputTokens.toLocaleString()} input tokens, about ${cost.toFixed(5)}.
      </p>
    </div>
  );
}
