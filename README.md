# Headline Arena

Put your headlines in the ring and see which one wins the click.

**Live demo:** https://headline-arena-gamma.vercel.app

![Headline Arena demo: five engineering blog titles scored and ranked into a champion card and standings](docs/demo.gif)

## How it works

Paste 2 to 8 candidate headlines (blog titles, email subjects, tweet hooks or YouTube titles) plus an optional one-line audience, and they fight it out on a sports-style leaderboard. Each headline goes to TypeSafe's Jev model in its own call with the format and audience as state. Jev answers five score questions (curiosity, clarity, specificity, emotional pull, credibility) and three yes/no questions (is it clickbait, would this audience click, does it promise something they want). The app turns those numbers into a power rating out of 100: 60 points from the weighted stats, 25 from click chance, 15 from the promise, minus up to 30 once the clickbait chance passes 50%. Jev never writes any text here. Every sentence on the page is a template filled with its numbers.

Calls go through Vercel AI Gateway first and fall back to TypeSafe's own API when the Gateway is missing or fails.

## Screenshots

![Headline Arena home: format tabs, headline list and sample sets](docs/home.webp)

![Headline Arena result: champion card with rank 1 and the tale of the tape stat bars](docs/result.webp)

A longer recording is in [docs/demo.mp4](docs/demo.mp4).

## Architecture

![Headline Arena architecture: the browser posts headlines to one route handler, which counts the request in Upstash Redis and scores each headline with TypeSafe Jev through Vercel AI Gateway, falling back to the direct TypeSafe API](docs/architecture.svg)

1. The browser posts the headlines, format and audience to `POST /api/arena`.
2. The route validates the bout, then takes a rate limit slot in Upstash Redis and answers 429 when the window is used up.
3. It scores every headline in its own Jev call through Vercel AI Gateway (`typesafe-ai/jev`), all in parallel.
4. Jev answers five score and three yes/no questions per headline. If the Gateway fails, the same questions go straight to the TypeSafe API (dashed path).
5. The route ranks the contenders in `app/lib/arena.ts` and the browser draws the champion card, podium and leaderboard.

**Why it is built this way.** The TypeSafe and Gateway keys stay on the server. Jev only returns numbers, and the ranking and fight summaries are computed in code from them. The limit is counted in Redis before any paid call, so it holds across Vercel instances.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript and the Vercel AI SDK, deployed on Vercel. Jev calls go through Vercel AI Gateway and fall back to the TypeSafe API. Unit tests use the Node test runner.

## Run it

```bash
npm install
cp .env.example .env.local   # add AI_GATEWAY_API_KEY and/or TYPESAFE_API_KEY
npm run dev
```

`npm test` runs the unit tests for the scoring and ranking logic. `npm run lint` and `npm run build` should both pass.

## Config

| Variable | Default | What it does |
| --- | --- | --- |
| `AI_GATEWAY_API_KEY` | one of the two | Vercel AI Gateway key, tried first |
| `TYPESAFE_API_KEY` | one of the two | TypeSafe API key, used when the Gateway is missing or fails |
| `RATE_LIMIT_ANALYZE` | `5` | bouts per IP per window |
| `RATE_LIMIT_WINDOW_MS` | `3600000` | window length, one hour |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | none | Upstash Redis that holds the rate limit counts |

Limits per bout: 8 headlines, 300 characters each, 200 characters of audience.

Rate limit counts are global across instances because they live in Upstash Redis, keyed per app and per IP, with IPv6 grouped by /64. The window starts at your first counted request. Without the Redis variables (local dev, tests) counts fall back to memory, and if Redis is set but unreachable the API answers 503 rather than letting requests through.

## Related

Built alongside [ToneRadar](https://toneradar.vercel.app), [FinePrint](https://fineprint-beta.vercel.app), [fallacy finder](https://fallacy-finder-nine.vercel.app) and [PitchPanel](https://pitchpanel.vercel.app), all on TypeSafe Jev. The first one was [JobFit](https://github.com/Sahilll15/jobfit).
