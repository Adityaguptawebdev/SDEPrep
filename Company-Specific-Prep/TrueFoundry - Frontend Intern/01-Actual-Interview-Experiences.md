# 01 — Actual Interview Experiences (TrueFoundry Frontend)

> **Rule used in this folder:** 📌 **Reported** = a candidate wrote that this was asked. 🔮 **Predicted** = likely, based on the role, the stack and the pattern below. A predicted question is never shown as reported.

[← Roadmap](00-Interview-Roadmap.md) · [Next: JS Fundamentals →](02-JavaScript-Fundamentals.md)

## Contents

- [Source summary](#source-summary)
- [Source 1 — Reddit, Frontend Intern, October 2025](#source-1--reddit-frontend-intern-october-2025)
- [Source 2 — Medium, Senior Frontend Engineer, October 2025](#source-2--medium-senior-frontend-engineer-october-2025)
- [Source 3 — Glassdoor, Frontend Developer Intern](#source-3--glassdoor-frontend-developer-intern)
- [Extra sources found](#extra-sources-found)
- [Master list of reported questions](#master-list-of-reported-questions)
- [What the pattern tells us](#what-the-pattern-tells-us)

---

## Source summary

| # | Source | Role | Interview date | How I read it | Trust |
|---|---|---|---|---|---|
| 1 | [Reddit r/developersIndia](https://www.reddit.com/r/developersIndia/comments/1nztzt7/truefoundry_frontend_intern_interview_experience/) | **Frontend Intern** | Oct 2025 (post date) | ⚠️ Reddit blocks automated reading. The questions below come from **your brief**, which lists them from this post. Open the link once and confirm. | High (same role) |
| 2 | [Medium — Saumyadip Mandal](https://saumyadip25.medium.com/truefoundry-senior-frontend-engineer-interview-experience-a98ec2543f51) | Senior Frontend Engineer | **Oct 2025** (posted 15 Dec 2025) | ✅ Read in full | High (same questions as intern list) |
| 3 | [Glassdoor — TrueFoundry interviews](https://www.glassdoor.com/Interview/TrueFoundry-Interview-Questions-E6838420.htm) · [Frontend Intern page](https://www.glassdoor.sg/Interview/TrueFoundry-Frontend-Developer-Intern-Interview-Questions-EI_IE6838420.0,11_KO12,37.htm) | Frontend Developer Intern | One review dated **Apr 2026**; one older review, date not visible | ⚠️ Glassdoor returns 403 to tools. Details below come from **search-engine snippets** of these pages. | Medium |
| 4 | [LinkedIn post (Monis Siddiqui)](https://www.linkedin.com/posts/monis-siddiqui-00259a181_truefoundry-is-hiring-for-frontend-developer-activity-7128378714123345920-eKHR) | Frontend Developer Intern (stipend 30–40K) | Older (around Nov 2023) | ⚠️ Search snippet only | Low–Medium (old) |
| 5 | [Big.Jobs — Sr. Frontend Engineer listing](https://app.big.jobs/companies/truefoundry/jobs/sr-frontend-engineer) | Sr. Frontend (job post) | — | Search snippet only | Process info only |

---

## Source 1 — Reddit, Frontend Intern, October 2025

**Link:** <https://www.reddit.com/r/developersIndia/comments/1nztzt7/truefoundry_frontend_intern_interview_experience/>

> ⚠️ I could not open this page (Reddit blocks automated tools). These questions are taken from the list in your brief. Before the interview, open the post and check the round order and any extra detail.

| Question | Type | Covered in |
|---|---|---|
| 📌 Implement **deep clone** | JS coding | [03 → Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone) |
| 📌 **Sort an array alphabetically according to a given string** (custom alphabet order) | JS coding | [03 → Q2](03-JavaScript-Coding-Questions.md#q2-sort-an-array-according-to-a-given-alphabet-string) |
| 📌 **N × N Tic-Tac-Toe** in React | Machine coding | [05 → P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) |
| 📌 **Image carousel with thumbnails** | Machine coding | [05 → P3](05-Machine-Coding-Problems.md#p3-image-carousel-with-thumbnails) |

---

## Source 2 — Medium, Senior Frontend Engineer, October 2025

**Link:** <https://saumyadip25.medium.com/truefoundry-senior-frontend-engineer-interview-experience-a98ec2543f51> · **Interview:** October 2025 · **Posted:** 15 Dec 2025 · **Applied via:** Instahyre (recruiter call in 3–5 days) · **Outcome:** rejected after 2 of 4 planned rounds ("mixed feedback", "bar for this role was pretty high").

**Why it matters for an intern:** the questions are the **same family** as the intern report (deep clone, N×N tic-tac-toe, carousel). So TrueFoundry seems to reuse one question bank across levels. The senior version adds twists you should be ready for.

### Round 1 — JavaScript + Machine Coding (60 min)

| Reported question | Twist / detail reported | Covered in |
|---|---|---|
| 📌 Implement a deep clone function for an object | **Twist:** the object can have **circular references** (`obj.self = obj`). The candidate tried a normal `Set` and got stuck. **Hint given: `WeakSet`.** | [03 → Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone) |
| 📌 N×N Tic Tac Toe | N chosen from a **dropdown** (3×3, 4×4, 5×5…), announce winner, **reset**, **draw**. He had only ~30 min and **could not finish draw + reset**. | [05 → P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) |

### Round 2 — DSA + Machine Coding (60 min)

| Reported question | Twist / detail reported | Covered in |
|---|---|---|
| 📌 Print all possible **subsets** of an integer array (`[1,2,3]` → 8 subsets) | He solved it with **loops**; at the end the interviewer asked for the **recursive approach orally**. | [03 → Q3](03-JavaScript-Coding-Questions.md#q3-generate-all-subsets-of-an-array) |
| 📌 **Hotstar-style carousel** | Main slide + **thumbnail strip** + prev/next + click thumbnail + **auto-advance every 3000 ms** + **smooth sliding animation**. He finished everything **except the animation** (ran out of time). | [05 → P4](05-Machine-Coding-Problems.md#p4-hotstar-style-autoplay-carousel) |

**Lessons the author wrote (and what to do about them):**

| His lesson | What you do |
|---|---|
| Missed draw + reset in tic-tac-toe because of time | Build in this order: board → turns → **block occupied cells → win → draw → reset** → styling last. Draw + reset are 5 lines each — never skip them. |
| Missed carousel animation | Put `transition: transform 0.5s` on the track **from the first minute**. It costs nothing. |
| Used loops for subsets, then asked recursion orally | Know **both** (and bitmask) — practise saying the recursion tree out loud. |
| Needed the WeakSet hint | Know **why** `WeakMap` is even better than `WeakSet` (it also returns the already-made copy). |

---

## Source 3 — Glassdoor, Frontend Developer Intern

**Links:** [Glassdoor interview page](https://www.glassdoor.com/Interview/TrueFoundry-Interview-Questions-E6838420.htm) · [Frontend Developer Intern questions](https://www.glassdoor.sg/Interview/TrueFoundry-Frontend-Developer-Intern-Interview-Questions-EI_IE6838420.0,11_KO12,37.htm)

> ⚠️ Glassdoor blocks automated reading (HTTP 403). The points below are from search-engine snippets of these pages. Log in and read the full reviews once.

| Review | Reported | Covered in |
|---|---|---|
| Frontend Developer Intern (date not visible in snippet) | 📌 Write a **deep copy** of an object | [03 → Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone) |
| same review | 📌 Build a working **Tic-Tac-Toe prototype in 25 minutes** | [05 → P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) |
| same review | 📌 Theory: **throttling** | [02 → Debounce vs throttle](02-JavaScript-Fundamentals.md#15-debouncing-vs-throttling) |
| same review | 📌 Theory: **`==` vs `===`** | [02 → Bonus](02-JavaScript-Fundamentals.md#bonus--vs-) |
| Frontend Intern, **April 2026** | 📌 A **medium-level React question**, live machine coding on a shared online editor / CodeSandbox | [05](05-Machine-Coding-Problems.md) |
| Overall page | ~3.4–3.7 / 5 difficulty, about 50–57 % positive (small sample) | — |

---

## Extra sources found

| Source | What it says | Use |
|---|---|---|
| [LinkedIn post](https://www.linkedin.com/posts/monis-siddiqui-00259a181_truefoundry-is-hiring-for-frontend-developer-activity-7128378714123345920-eKHR) (older, ~2023, snippet only) | Frontend Intern process: project deep-dive + JS concepts (**debouncing, throttling, event loop**), an easy coding question, and **memory-game logic in React on CodeSandbox**. | 📌 (old) Confirms the "JS theory + React game on CodeSandbox" style. |
| [Big.Jobs Sr. Frontend listing](https://app.big.jobs/companies/truefoundry/jobs/sr-frontend-engineer) | Process: fitment talk with founder → machine coding with a Sr. Engineer → DS + JavaScript with technical leadership. | Shows the round types. |
| [prachub.com/companies/truefoundry](https://prachub.com/companies/truefoundry) | Question aggregator | Not used (unverified). |

---

## Master list of reported questions

| Priority | Question | Sources | Where |
|---|---|---|---|
| 🔴 Critical | Deep clone (+ circular references, WeakSet/WeakMap) | Reddit, Medium, Glassdoor | [03 Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone) |
| 🔴 Critical | N×N Tic-Tac-Toe (dropdown size, win, draw, reset) | Reddit, Medium, Glassdoor | [05 P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) |
| 🔴 Critical | Image carousel with thumbnails | Reddit | [05 P3](05-Machine-Coding-Problems.md#p3-image-carousel-with-thumbnails) |
| 🔴 Critical | Hotstar carousel, autoplay 3000 ms, sliding animation | Medium | [05 P4](05-Machine-Coding-Problems.md#p4-hotstar-style-autoplay-carousel) |
| 🟠 High | Sort array by a given alphabet string | Reddit | [03 Q2](03-JavaScript-Coding-Questions.md#q2-sort-an-array-according-to-a-given-alphabet-string) |
| 🟠 High | All subsets (loops **and** recursion) | Medium | [03 Q3](03-JavaScript-Coding-Questions.md#q3-generate-all-subsets-of-an-array) |
| 🟠 High | Throttling, `==` vs `===`, debouncing, event loop | Glassdoor, LinkedIn | [02](02-JavaScript-Fundamentals.md) |
| 🟡 Medium | Memory game in React (older report) | LinkedIn | Same skills as [P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe) (grid + state + match logic) |

## What the pattern tells us

```
 ┌──────────────── TrueFoundry frontend round (60 min) ────────────────┐
 │  ~15–25 min  JS coding     → deep clone / custom sort / subsets     │
 │  ~30–40 min  React MC      → tic-tac-toe N×N  OR  carousel          │
 │  throughout  JS theory     → throttle, ==/===, event loop, closures │
 └──────────────────────────────────────────────────────────────────────┘
```

1. **Same question bank across levels** → the twists asked to the senior candidate (circular refs, recursion for subsets, animation) can be asked to you too.
2. **Time is the real enemy.** Both reported misses were "ran out of time". Practise each machine-coding problem with a **timer (25–30 min)**.
3. **Vanilla React, no libraries.** Expect a CodeSandbox-style editor. Plain CSS is safest; Tailwind only if the sandbox already has it.
4. **Round 2 for intern** (your round) — the Medium pattern says Round 2 = **DSA-style JS question + machine coding**. Subsets + carousel is the most likely shape.
