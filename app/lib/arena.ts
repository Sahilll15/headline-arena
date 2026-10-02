export const MODES = {
  blog: {
    label: 'Blog titles',
    short: 'Blog',
    badge: 'BL',
    format: 'a blog post title shown in search results and social feeds',
    softLimit: 70,
  },
  email: {
    label: 'Email subjects',
    short: 'Email',
    badge: 'EM',
    format: 'an email subject line shown in a crowded inbox',
    softLimit: 50,
  },
  tweet: {
    label: 'Tweet hooks',
    short: 'Tweet',
    badge: 'TW',
    format: 'the opening line of a tweet or thread shown in a scrolling timeline',
    softLimit: 120,
  },
  youtube: {
    label: 'YouTube titles',
    short: 'YouTube',
    badge: 'YT',
    format: 'a YouTube video title shown under a thumbnail in recommendations',
    softLimit: 60,
  },
} as const;

export type Mode = keyof typeof MODES;

export const STATS = ['curiosity', 'clarity', 'specificity', 'emotion', 'credibility'] as const;
export type Stat = (typeof STATS)[number];

export const STAT_LABEL: Record<Stat, string> = {
  curiosity: 'Curiosity',
  clarity: 'Clarity',
  specificity: 'Specificity',
  emotion: 'Emotional pull',
  credibility: 'Credibility',
};

export const STAT_ABBR: Record<Stat, string> = {
  curiosity: 'CUR',
  clarity: 'CLR',
  specificity: 'SPC',
  emotion: 'EMO',
  credibility: 'CRD',
};

export const LEVELS = 5;
export const MIN_HEADLINES = 2;
export const MAX_HEADLINES = 8;
export const MAX_HEADLINE_CHARS = 300;
export const MAX_AUDIENCE_CHARS = 200;

const WEIGHTS: Record<Stat, number> = {
  curiosity: 0.22,
  clarity: 0.2,
  specificity: 0.18,
  emotion: 0.18,
  credibility: 0.22,
};

export const CLICKBAIT_FREE = 0.5;
export const CLICKBAIT_MAX_PENALTY = 30;

export type RawScores = {
  stats: Record<Stat, number>;
  clickbait: number;
  wouldClick: number;
  promise: number;
};

export type Contender = RawScores & {
  id: number;
  text: string;
  /** Each stat on a 0 to 100 scale. */
  ratings: Record<Stat, number>;
  base: number;
  penalty: number;
  power: number;
  rank: number;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function toRating(score: number) {
  return Math.round(clamp(score / (LEVELS - 1), 0, 1) * 100);
}

export function clickbaitPenalty(probability: number) {
  const over = clamp((probability - CLICKBAIT_FREE) / (1 - CLICKBAIT_FREE), 0, 1);
  return Math.round(over * CLICKBAIT_MAX_PENALTY * 10) / 10;
}

export function powerRating(raw: RawScores) {
  const quality = STATS.reduce((sum, s) => sum + WEIGHTS[s] * clamp(raw.stats[s] / (LEVELS - 1), 0, 1), 0);
  const base = 60 * quality + 25 * clamp(raw.wouldClick, 0, 1) + 15 * clamp(raw.promise, 0, 1);
  const penalty = clickbaitPenalty(raw.clickbait);
  return {
    base: Math.round(base * 10) / 10,
    penalty,
    power: Math.round(clamp(base - penalty, 0, 100)),
  };
}

export function rankContenders(entries: { text: string; raw: RawScores }[]): Contender[] {
  const rated = entries.map(({ text, raw }, id) => {
    const ratings = Object.fromEntries(STATS.map((s) => [s, toRating(raw.stats[s])])) as Record<Stat, number>;
    return { id, text, ...raw, ratings, ...powerRating(raw), rank: 0 };
  });
  rated.sort((a, b) => b.power - a.power || b.wouldClick - a.wouldClick || a.id - b.id);
  return rated.map((c, i) => ({ ...c, rank: i + 1 }));
}

export function parseHeadlines(input: string) {
  const seen = new Set<string>();
  return input
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim())
    .filter((line) => {
      const key = line.toLowerCase();
      if (!line || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function ordinal(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}

export function bestStat(c: Contender): Stat {
  return STATS.reduce((best, s) => (c.ratings[s] > c.ratings[best] ? s : best), STATS[0]);
}

export function worstStat(c: Contender): Stat {
  return STATS.reduce((worst, s) => (c.ratings[s] < c.ratings[worst] ? s : worst), STATS[0]);
}

export function tier(power: number) {
  if (power >= 80) return 'Title contender';
  if (power >= 65) return 'Main card';
  if (power >= 50) return 'Undercard';
  if (power >= 35) return 'Journeyman';
  return 'Needs a new camp';
}

export function scoutingReport(c: Contender) {
  const best = bestStat(c);
  const worst = worstStat(c);
  const lines: string[] = [];
  if (c.ratings[best] - c.ratings[worst] < 12) {
    lines.push(`Even across the board, no stat below ${c.ratings[worst]}.`);
  } else {
    lines.push(`Strongest on ${STAT_LABEL[best].toLowerCase()} (${c.ratings[best]}).`);
    lines.push(`Gives ground on ${STAT_LABEL[worst].toLowerCase()} (${c.ratings[worst]}).`);
  }
  if (c.penalty > 0) lines.push(`Docked ${Math.round(c.penalty)} points for clickbait.`);
  else if (c.wouldClick >= 0.7) lines.push(`${pct(c.wouldClick)} click chance.`);
  return lines.join(' ');
}

export function pct(p: number) {
  return `${Math.round(clamp(p, 0, 1) * 100)}%`;
}

export function championLine(field: Contender[]) {
  const [first, second] = field;
  if (!first) return '';
  if (!second) return `Unopposed at ${first.power} power.`;
  const margin = first.power - second.power;
  if (margin === 0) return `Dead heat at ${first.power}. Takes the belt on click chance.`;
  if (margin <= 3) return `Photo finish. Edges ${ordinal(2)} place by ${margin}.`;
  if (margin <= 10) return `Clear win, ${margin} points ahead of the field.`;
  return `Runaway win. ${margin} points clear of ${ordinal(2)} place.`;
}

export type Round = { stat: Stat; a: number; b: number; winner: 'a' | 'b' | 'draw' };

export function headToHead(a: Contender, b: Contender) {
  const rounds: Round[] = STATS.map((stat) => {
    const diff = a.ratings[stat] - b.ratings[stat];
    return { stat, a: a.ratings[stat], b: b.ratings[stat], winner: Math.abs(diff) < 3 ? 'draw' : diff > 0 ? 'a' : 'b' };
  });
  const aRounds = rounds.filter((r) => r.winner === 'a').length;
  const bRounds = rounds.filter((r) => r.winner === 'b').length;
  const margin = Math.abs(a.power - b.power);
  const tiebreak = a.power === b.power;
  const lead = tiebreak ? a.wouldClick - b.wouldClick : a.power - b.power;
  const winner = lead === 0 ? 'draw' : lead > 0 ? 'a' : 'b';
  let method: string;
  if (winner === 'draw') method = 'Draw';
  else if (tiebreak) method = 'Split decision';
  else if (margin >= 15) method = 'Knockout';
  else if (margin >= 6) method = 'Unanimous decision';
  else method = 'Split decision';
  return { rounds, aRounds, bRounds, winner, margin, method, tiebreak } as const;
}

export function fightSummary(a: Contender, b: Contender) {
  const h = headToHead(a, b);
  if (h.winner === 'draw') return `Even at ${a.power}. The judges cannot separate them.`;
  if (h.tiebreak) {
    const [w, l] = h.winner === 'a' ? [a, b] : [b, a];
    return `Level at ${a.power} power. Wins on click chance, ${pct(w.wouldClick)} to ${pct(l.wouldClick)}.`;
  }
  const [w, l] = h.winner === 'a' ? [h.aRounds, h.bRounds] : [h.bRounds, h.aRounds];
  const roundsText = w === 1 ? '1 round' : `${w} rounds`;
  const upset = w < l ? ' Loses more rounds but wins on click chance and clickbait.' : '';
  return `Wins by ${h.margin} ${h.margin === 1 ? 'point' : 'points'}. Takes ${roundsText} of ${STATS.length}.${upset}`;
}

export type ArenaResult = {
  mode: Mode;
  audience: string;
  contenders: Contender[];
  inputTokens: number;
  cost: number;
};
