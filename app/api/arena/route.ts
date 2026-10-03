import { NextResponse } from 'next/server';
import {
  MAX_AUDIENCE_CHARS,
  MAX_HEADLINES,
  MAX_HEADLINE_CHARS,
  MIN_HEADLINES,
  MODES,
  rankContenders,
  type Mode,
  type RawScores,
} from '../../lib/arena';
import { askJev } from '../../server/jev';
import { check, tooMany } from '../../server/ratelimit';

const PRICE_PER_INPUT_TOKEN = 0.042 / 1_000_000;
const MAX_BODY_CHARS = 8_000;

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

async function scoreHeadline(headline: string, mode: Mode, audience: string) {
  const state = {
    headline,
    format: MODES[mode].format,
    audience: audience || 'a general online audience',
  };

  const { answers, inputTokens } = await askJev(state, {
    curiosity: {
      type: 'score',
      instructions: 'How much does this headline make the audience want to find out more?',
      criteria: [
        'gives no reason to read on',
        'mildly interesting',
        'raises a question the reader would like answered',
        'opens a gap the reader wants closed',
        'the reader has to know the answer',
      ],
    },
    clarity: {
      type: 'score',
      instructions: 'How quickly and easily can the audience understand what this is about?',
      criteria: [
        'confusing, the topic is unclear',
        'takes a second read to understand',
        'understandable with some effort',
        'clear at a glance',
        'instantly clear, nothing to decode',
      ],
    },
    specificity: {
      type: 'score',
      instructions: 'How concrete is the headline: numbers, names, outcomes, timeframes, details?',
      criteria: [
        'completely vague and generic',
        'mostly generic',
        'one concrete detail',
        'several concrete details',
        'precise and vivid, could only be about this one thing',
      ],
    },
    emotion: {
      type: 'score',
      instructions: 'How strongly does the headline make the audience feel something (hope, fear, delight, outrage, recognition)?',
      criteria: [
        'flat, no feeling at all',
        'faint interest',
        'some feeling',
        'a clear emotional hook',
        'a strong gut reaction',
      ],
    },
    credibility: {
      type: 'score',
      instructions: 'How believable and trustworthy does this headline seem to the audience?',
      criteria: [
        'sounds like a scam or obvious exaggeration',
        'feels overhyped',
        'plausible',
        'believable and grounded',
        'sounds authoritative and trustworthy',
      ],
    },
    clickbait: {
      type: 'boolean',
      instructions: 'Is this headline manipulative clickbait?',
      criteria: {
        true: 'relies on hype, shouting, fake shock, or deliberately hiding the point to trick the reader into clicking',
        false: 'states or hints at its real topic honestly, even if it is bold, punchy, or promises a benefit',
      },
    },
    wouldClick: {
      type: 'boolean',
      instructions: 'Would a typical member of this audience click or open this when they see it in the described format?',
    },
    promise: {
      type: 'boolean',
      instructions: 'Does the headline promise something this audience actually wants, such as a benefit, answer, or outcome?',
    },
  });

  const raw: RawScores = {
    stats: {
      curiosity: answers.curiosity.score,
      clarity: answers.clarity.score,
      specificity: answers.specificity.score,
      emotion: answers.emotion.score,
      credibility: answers.credibility.score,
    },
    clickbait: answers.clickbait.probability,
    wouldClick: answers.wouldClick.probability,
    promise: answers.promise.probability,
  };
  return { raw, inputTokens };
}

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > MAX_BODY_CHARS) return fail('That request is too large.', 413);

  let body: { mode?: unknown; audience?: unknown; headlines?: unknown };
  try {
    body = JSON.parse(text || '{}');
  } catch {
    return fail('Send a JSON body with a headlines array.', 400);
  }

  const mode = (typeof body.mode === 'string' && body.mode in MODES ? body.mode : 'blog') as Mode;
  const audience = typeof body.audience === 'string' ? body.audience.trim() : '';
  const headlines = Array.isArray(body.headlines)
    ? [...new Set(body.headlines.filter((h): h is string => typeof h === 'string').map((h) => h.trim()).filter(Boolean))]
    : [];

  if (headlines.length < MIN_HEADLINES) {
    return fail(`Add at least ${MIN_HEADLINES} different headlines so they have someone to fight.`, 400);
  }
  if (headlines.length > MAX_HEADLINES) {
    return fail(`The arena holds ${MAX_HEADLINES} contenders at most. Cut a few and try again.`, 413);
  }
  if (headlines.some((h) => h.length > MAX_HEADLINE_CHARS)) {
    return fail(`Each headline is capped at ${MAX_HEADLINE_CHARS} characters.`, 413);
  }
  if (audience.length > MAX_AUDIENCE_CHARS) {
    return fail(`Keep the audience to one line, ${MAX_AUDIENCE_CHARS} characters at most.`, 413);
  }

  const gate = await check(req, 'analyze');
  if (!gate.ok) return tooMany(gate);

  try {
    const scored = await Promise.all(headlines.map((h) => scoreHeadline(h, mode, audience)));
    const contenders = rankContenders(scored.map((s, i) => ({ text: headlines[i], raw: s.raw })));
    const inputTokens = scored.reduce((sum, s) => sum + s.inputTokens, 0);
    return NextResponse.json({ mode, audience, contenders, inputTokens, cost: inputTokens * PRICE_PER_INPUT_TOKEN });
  } catch (err) {
    console.error('Scoring failed:', err);
    return fail('The judges could not score this bout. Try again in a moment.', 502);
  }
}
