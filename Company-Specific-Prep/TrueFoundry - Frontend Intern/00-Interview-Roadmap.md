# TrueFoundry — Frontend Engineering Intern · Round 2 Prep

**Role:** Frontend Engineering Intern · **Round:** Second technical round · **Stack:** JavaScript, TypeScript, React, Next.js, Tailwind, HTML/CSS, REST · **Products:** AI Gateway, AI Deploy (AI/ML infra dashboards)

> **Legend used in every file:** 📌 **Reported** (a candidate said it was asked, with source and date) · 🔮 **Predicted** (likely, not reported) · 🔁 twist of a reported question · Priority 🔴 Critical / 🟠 High / 🟡 Medium.

## Folder map

| File | What's inside | Priority |
|---|---|---|
| [01 — Actual Interview Experiences](01-Actual-Interview-Experiences.md) | Every reported question with source, date and round; what the pattern means | 🔴 read first |
| [02 — JavaScript Fundamentals](02-JavaScript-Fundamentals.md) | 23 topics + `==` vs `===` (📌), Hinglish + interview answer + run-verified code | 🔴 |
| [03 — JavaScript Coding Questions](03-JavaScript-Coding-Questions.md) | 📌 Deep clone (circular refs, WeakMap, structuredClone), 📌 custom-alphabet sort, 📌 subsets (3 ways) | 🔴 |
| [04 — React Interview Questions](04-React-Interview-Questions.md) | 27 React topics with code, linked to where you use them | 🟠 |
| [05 — Machine Coding Problems](05-Machine-Coding-Problems.md) | 📌 N×N Tic-Tac-Toe, 📌 image carousel, 📌 Hotstar carousel + 12 more, complete code | 🔴 |
| [06 — TypeScript](06-TypeScript-Questions.md) | 12 topics, generic `Select<T>` / `Table<T>` | 🟠 |
| [07 — Next.js](07-NextJS-Questions.md) | CSR/SSR/SSG/ISR, server vs client components, hydration, routing, caching | 🟡 |
| [08 — Performance and Architecture](08-Frontend-Performance-and-Architecture.md) | slow app, 10k rows, virtualization, AbortController, retries, auth, a11y | 🟠 |
| [09 — TrueFoundry Product](09-TrueFoundry-Product-Questions.md) | AI Gateway, routing, MCP, guardrails, cost, AI Deploy, K8s + 8 dashboard scenarios | 🟠 |
| [10 — Project and HR](10-Project-and-HR-Questions.md) | Your real RagaAI / FirstBriq / project facts, stories, "why TrueFoundry" | 🔴 |
| [11 — Full Mock Interview](11-Full-Mock-Interview.md) | 6 rounds, questions first, answers separately, self-scoring | 🔴 do last |

## What TrueFoundry actually asks (summary)

| Reported question | Seen in | Study |
|---|---|---|
| Deep clone (+ circular references, hint: WeakSet) | Reddit Intern Oct 2025 · Medium Oct 2025 · Glassdoor Intern | [03 Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone) |
| N×N Tic-Tac-Toe (dropdown N, win, draw, reset) | Reddit · Medium · Glassdoor ("in 25 minutes") | [05 P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) |
| Image carousel with thumbnails | Reddit Intern Oct 2025 | [05 P3](05-Machine-Coding-Problems.md#p3-image-carousel-with-thumbnails) |
| Hotstar carousel, autoplay 3000 ms, sliding animation | Medium Oct 2025 (Round 2) | [05 P4](05-Machine-Coding-Problems.md#p4-hotstar-style-autoplay-carousel) |
| Sort an array according to a given string | Reddit Intern Oct 2025 | [03 Q2](03-JavaScript-Coding-Questions.md#q2-sort-an-array-according-to-a-given-alphabet-string) |
| All subsets (+ "explain recursion") | Medium Oct 2025 (Round 2) | [03 Q3](03-JavaScript-Coding-Questions.md#q3-generate-all-subsets-of-an-array) |
| Throttling, `==` vs `===` | Glassdoor Intern | [02 §15](02-JavaScript-Fundamentals.md#15-debouncing-vs-throttling), [02 Bonus](02-JavaScript-Fundamentals.md#bonus--vs-) |
| Debouncing, event loop, memory game in React (older) | LinkedIn post (~2023) | [02 §5](02-JavaScript-Fundamentals.md#5-event-loop) |

**Round shape (from the reports):** ~60 min · one JS/DSA-style function (15–25 min) + one React machine-coding task (30–40 min) on CodeSandbox-style editors, JS theory in between. **Both reported misses were time-outs** (draw/reset in tic-tac-toe, the carousel animation).

## Study plan

### If you have 3 days

| Day | Morning | Evening |
|---|---|---|
| 1 | [01](01-Actual-Interview-Experiences.md) → [03](03-JavaScript-Coding-Questions.md) (write all 3 from memory) | [05 P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) twice with a 30-min timer |
| 2 | [02](02-JavaScript-Fundamentals.md) (event loop, closures, debounce/throttle, `this`) | [05 P3 + P4](05-Machine-Coding-Problems.md#p3-image-carousel-with-thumbnails) with a timer, animation first |
| 3 | [10](10-Project-and-HR-Questions.md) (say the answers out loud) + [09](09-TrueFoundry-Product-Questions.md) Part A | [11 Mock](11-Full-Mock-Interview.md) end to end, then fix the weak spots |

### If you have 1 day

1. [03 Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone) deep clone with WeakMap (write it twice).
2. [05 P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) Tic-Tac-Toe with a timer.
3. [05 P4](05-Machine-Coding-Problems.md#p4-hotstar-style-autoplay-carousel) carousel with a timer.
4. [03 Q3](03-JavaScript-Coding-Questions.md#q3-generate-all-subsets-of-an-array) subsets — recursion explained out loud.
5. [02](02-JavaScript-Fundamentals.md) §5, §7, §15 and the Bonus.
6. [10](10-Project-and-HR-Questions.md) — tell me about yourself + one story.

### 1 hour before

- Re-read the [master list](01-Actual-Interview-Experiences.md#master-list-of-reported-questions) and the [machine-coding checklist](05-Machine-Coding-Problems.md#universal-machine-coding-checklist).
- Have a blank React CodeSandbox ready; know how to add plain CSS quickly.
- Open the [TrueFoundry AI Gateway docs](https://docs.truefoundry.com/docs/ai-gateway) for 10 minutes.

## Interview-day rules

```
 ✔ Clarify for 1–2 min, then say your plan (state + components) out loud
 ✔ Cheap required features FIRST: reset, draw, `transition` on the track
 ✔ Minimum state; derive the rest (currentPlayer, winner, isDraw)
 ✔ Never mutate state; functional setState in timers
 ✔ Every effect with a timer/listener has a cleanup
 ✔ Say the complexity and one improvement you'd make with more time
 ✘ Don't go silent; if stuck, say what you're trying — hints are normal (the WeakSet hint)
```

## How this was built and verified

- **Research (Nov 2026):** the Medium report was read in full. Glassdoor (403 to tools) and LinkedIn are summarized from search-engine snippets. The Reddit post couldn't be opened, so its questions come from your brief. See [01 → Source summary](01-Actual-Interview-Experiences.md#source-summary).
- **Your projects:** only from your resume, the RagaAI contribution report, your portfolio data and your own FirstBriq commits. Unknown details are marked **[fill in]**.
- **Code:** every JS block was run in Node and every printed comment matches the real output. Every JS/JSX/TS block was parsed with esbuild. Tic-Tac-Toe win detection was checked against brute force over ~400k random moves; pagination was checked exhaustively for 1–40 pages. The React components were not run in a browser.
