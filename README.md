# Mental Wellness

A calm, accessible web app that helps exam aspirants (NEET, JEE, CUET, CAT, GATE, UPSC) look after their mental wellbeing. Users journal their day, receive gentle AI-generated insights into their emotional patterns, and chat with **Aarav**, a supportive companion.

Built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Zod**, with **Google Gemini** powering the analysis and chat.

---

## Features

| Feature               | What it does                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Daily check-in**    | Capture exam type, study hours, mood (1–5), stress (1–5), and a free-text journal entry.                                            |
| **AI analysis**       | Gemini returns a structured summary, dominant emotion, risk level, stress triggers, patterns, coping strategies, and a next action. |
| **Companion chat**    | Streaming, supportive replies from "Aarav". High-risk messages surface the iCall helpline.                                          |
| **Pattern chart**     | Local mood/stress history (last 7 entries) with progress bars and a table.                                                          |
| **Coping strategies** | Always-available, evidence-aligned self-help steps.                                                                                 |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts, skip-link, aurora backdrop
│   ├── page.tsx            # Composes the dashboard, owns shared state
│   ├── globals.css         # Design tokens, glass surfaces, motion (reduced-motion aware)
│   └── api/
│       ├── analyze/route.ts  # Validates input → Gemini JSON analysis
│       └── chat/route.ts     # Validates input → streamed text reply
├── components/             # Presentational + interactive UI
│   └── ui/                 # Reusable primitives (Card, Badge, ProgressBar, LoadingDots)
└── lib/
    ├── schema.ts           # Zod schemas — the single source of input validation
    ├── sanitize.ts         # Strips HTML + prompt-injection attempts
    ├── ratelimit.ts        # In-memory fixed-window limiter
    ├── gemini.ts           # Gemini client, SSE→text streaming, typed errors
    ├── prompt.ts           # Prompt builders
    └── storage.ts          # localStorage journal persistence
```

**Data flow:** UI → API route → `zod` validation → `sanitize` → `gemini` → typed response. The client never sees the API key; all model calls happen server-side.

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your key
npm run dev                        # http://localhost:3000
```

### Environment

| Variable         | Required | Notes                                                                                                                               |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | ✅       | Get one at https://aistudio.google.com/apikey. A free-tier key with `limit: 0` will return HTTP 429 — the UI surfaces this clearly. |

### Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
npm run test    # Jest + React Testing Library
```

---

## How it maps to the evaluation focus areas

- **Code Quality** — small, single-responsibility modules; `lib/` is framework-agnostic and unit-tested; Zod is the one source of validation truth; JSDoc on non-obvious helpers.
- **Security** — server-only API key; strict CSP + `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; input sanitisation (HTML + prompt-injection); per-IP rate limiting; bounded input lengths; upstream errors mapped to safe status codes.
- **Efficiency** — streaming chat replies (parsed server-side, appended in place — no per-chunk re-renders); `React.memo` on pure components + `useMemo` for derived data; self-hosted, preloaded fonts via `next/font` (no render-blocking external request); bounded local history (30 entries).
- **Testing** — Jest unit + component tests covering schema validation, sanitisation, rate limiting, prompt building, SSE parsing, storage, and key components.
- **Accessibility** — semantic landmarks, skip link, `radiogroup` mood picker with arrow-key support, labelled inputs, `role="log"` live chat, `aria-busy` on async buttons, WCAG-AA contrast, and `prefers-reduced-motion` support.

---

## Safety note

This app offers supportive, non-clinical guidance and is **not a substitute for professional help**. High-risk entries surface the **iCall** helpline (`9152987821`).
