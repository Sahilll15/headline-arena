import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clickbaitPenalty,
  fightSummary,
  headToHead,
  ordinal,
  parseHeadlines,
  powerRating,
  rankContenders,
  toRating,
  type RawScores,
} from '../app/lib/arena.ts';

const raw = (level: number, extra: Partial<RawScores> = {}): RawScores => ({
  stats: { curiosity: level, clarity: level, specificity: level, emotion: level, credibility: level },
  clickbait: 0,
  wouldClick: 0.5,
  promise: 0.5,
  ...extra,
});

test('toRating maps the 0..4 scale to 0..100 and clamps', () => {
  assert.equal(toRating(0), 0);
  assert.equal(toRating(2), 50);
  assert.equal(toRating(4), 100);
  assert.equal(toRating(5.3), 100);
  assert.equal(toRating(-1), 0);
});

test('clickbait below the free threshold costs nothing, certain clickbait costs the max', () => {
  assert.equal(clickbaitPenalty(0.2), 0);
  assert.equal(clickbaitPenalty(0.5), 0);
  assert.equal(clickbaitPenalty(1), 30);
  assert.ok(clickbaitPenalty(0.75) > 0 && clickbaitPenalty(0.75) < 30);
});

test('power rating spans 0 to 100', () => {
  assert.equal(powerRating(raw(4, { wouldClick: 1, promise: 1 })).power, 100);
  assert.equal(powerRating(raw(0, { wouldClick: 0, promise: 0 })).power, 0);
  assert.equal(powerRating(raw(2)).power, 50);
});

test('clickbait penalty can flip the ranking', () => {
  const field = rankContenders([
    { text: 'bait', raw: raw(3.5, { clickbait: 0.95, wouldClick: 0.9 }) },
    { text: 'honest', raw: raw(3, { clickbait: 0.1, wouldClick: 0.7 }) },
  ]);
  assert.deepEqual(field.map((c) => c.text), ['honest', 'bait']);
  assert.deepEqual(field.map((c) => c.rank), [1, 2]);
  assert.ok(field[1].penalty > 20);
});

test('ties break on click chance, then input order', () => {
  const field = rankContenders([
    { text: 'a', raw: raw(2, { wouldClick: 0.5, promise: 0.5 }) },
    { text: 'b', raw: raw(2, { wouldClick: 0.5, promise: 0.5 }) },
  ]);
  assert.deepEqual(field.map((c) => c.text), ['a', 'b']);
});

test('parseHeadlines strips bullets, blanks and duplicates', () => {
  assert.deepEqual(parseHeadlines('1. First one\n\n- Second one\n  first one  \n* Third'), [
    'First one',
    'Second one',
    'Third',
  ]);
});

test('ordinal suffixes', () => {
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal), [
    '1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd',
  ]);
});

test('head to head counts rounds and picks a method from the margin', () => {
  const [a, b] = rankContenders([
    { text: 'strong', raw: raw(4, { wouldClick: 1, promise: 1 }) },
    { text: 'weak', raw: raw(1, { wouldClick: 0.2, promise: 0.2 }) },
  ]);
  const h = headToHead(a, b);
  assert.equal(h.aRounds, 5);
  assert.equal(h.winner, 'a');
  assert.equal(h.method, 'Knockout');
  assert.match(fightSummary(a, b), /^Wins by \d+ points\. Takes 5 rounds of 5\.$/);
});

test('equal power is decided on click chance, like the standings', () => {
  const [a, b] = rankContenders([
    { text: 'x', raw: raw(2, { wouldClick: 0.6, promise: 0.4 }) },
    { text: 'y', raw: raw(2, { wouldClick: 0.4, promise: 0.7 }) },
  ]);
  assert.equal(a.power, b.power);
  const h = headToHead(b, a);
  assert.equal(h.winner, 'b');
  assert.equal(h.method, 'Split decision');
  assert.match(fightSummary(b, a), /Wins on click chance, 60% to 40%/);
});
