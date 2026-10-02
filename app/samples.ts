import type { Mode } from './lib/arena';

export type Sample = { name: string; mode: Mode; audience: string; headlines: string[] };

export const SAMPLES: Sample[] = [
  {
    name: 'Newsletter subjects',
    mode: 'email',
    audience: 'Freelance designers who already get too many newsletters',
    headlines: [
      'Your invoice template is costing you clients',
      'March newsletter',
      "You won't BELIEVE what this designer charged",
      '3 lines to add to every invoice so clients pay in 7 days',
      'Quick question about your rates',
    ],
  },
  {
    name: 'Cooking channel',
    mode: 'youtube',
    audience: 'Home cooks who want weeknight dinners in under 30 minutes',
    headlines: [
      "I Cooked Every Viral Pasta So You Don't Have To",
      '5 Pasta Recipes',
      'This ONE Ingredient Will Change Your Life FOREVER',
      'The 15 Minute Garlic Pasta I Make Every Tuesday',
      'Why Your Pasta Is Always Bland (and the 2 Fixes)',
      'Pasta Night Vlog',
    ],
  },
  {
    name: 'Engineering blog',
    mode: 'blog',
    audience: 'Engineering managers at early stage startups',
    headlines: [
      'How We Cut Our Deploy Time From 40 Minutes to 6',
      'Thoughts on CI',
      "The Secret Deploy Trick Big Tech Doesn't Want You to Know",
      'A Practical Guide to Faster CI Pipelines for Small Teams',
      'We Deleted Our Staging Environment. Here Is What Happened.',
    ],
  },
];
