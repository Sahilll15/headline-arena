'use client';

import { useEffect, useState } from 'react';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts from `from` to `to`. Remount with a new key to replay. */
export function CountUp({ to, from = 0, duration = 1200, delay = 0 }: { to: number; from?: number; duration?: number; delay?: number }) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const start = performance.now() + (reduced ? 0 : delay);
    const tick = (now: number) => {
      const t = reduced ? 1 : Math.min(Math.max((now - start) / duration, 0), 1);
      setValue(Math.round(from + (to - from) * ease(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, from, duration, delay]);

  return <span className="tabular-nums">{value}</span>;
}
