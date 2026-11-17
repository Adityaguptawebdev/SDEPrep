# 10 — Project and HR Questions

[← Product](09-TrueFoundry-Product-Questions.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: Mock Interview →](11-Full-Mock-Interview.md)

🔮 Predicted. A project deep-dive was reported in an older TrueFoundry intern process ([LinkedIn snippet](01-Actual-Interview-Experiences.md#extra-sources-found)), and the senior process has a founder "fitment" round.

> **Where every fact here comes from:** your latest resume (`Downloads/Aditya_Resume.pdf`, 4 Nov 2026), the RagaAI *Developer Contribution Report* (`Portfolio/public/reports/…`, May 2026), your portfolio's `experience.js`, and your own commits in the FirstBriq `Frontend` and `Backend` repos. **Nothing is invented.** Where a detail isn't in those files, you'll see **[fill in]** — answer it from memory, or don't claim it.

## Contents

- [Your fact sheet](#your-fact-sheet)
  - [RagaAI](#ragaai) · [FirstBriq](#firstbriq) · [AlgoTaskFlow](#algotaskflow) · [Food Saver](#food-saver)
  - [Numbers to be careful with](#numbers-to-be-careful-with)
- [Q. Tell me about yourself](#q-tell-me-about-yourself)
- [Q. Explain your strongest frontend project](#q-explain-your-strongest-frontend-project)
- [Q. Explain a challenging frontend problem](#q-explain-a-challenging-frontend-problem)
- [Q. How do you structure a React application?](#q-how-do-you-structure-a-react-application)
- [Q. How do you collaborate with backend developers?](#q-how-do-you-collaborate-with-backend-developers)
- [Project deep-dive questions](#project-deep-dive-questions)
- [Q. Why TrueFoundry?](#q-why-truefoundry)
- [Q. Why frontend engineering?](#q-why-frontend-engineering)
- [Q. Why should we hire you?](#q-why-should-we-hire-you)
- [Questions to ask them](#questions-to-ask-them)

---

## Your fact sheet

### RagaAI

**Role:** SDE Intern (Frontend), Bengaluru, hybrid · **Resume dates:** Feb 2026 – Sep 2026 (the report says you joined in mid-February 2026).
**Company:** product company for AI testing, evaluation and observability (Catalyst, Prism, Canvas). The work was on its healthcare products.

| Module | What you built (from the contribution report) |
|---|---|
| **Clinical Ops — Fax Classification** (Super Admin dashboard) | Overview summary cards (Total / Classified and Sent / Failed to Classify / Failed to Send); fax records table from live APIs (fax name, patient, preview, received date, classified group, sent-to); **loading / success / error states**; CTA to the CMS portal; **Show PII toggle**; search by name, **date-range filter**, download; preview tooltip; responsive, accessible layout per the design system |
| **Clinical Ops — Collections Agent** (AI-assisted billing and collections for a clinic) | Overview from live APIs (Total AR, Stripe Collected 30D, balance not synced); category tabs (Hold, Shot Flag, TSI, BDWO, Payment Plan) with live counts and amounts; ECW Sync and Stripe Live status with a **Sync Now** button; **Patient Detail dialog with 4 tabs, each with its own API call**; **4 action buttons, each a dedicated API call** (SMS reminder, Shot Flag + email to MA team with PDF, Escalate to TSI, Bad-Debt Write-Off); email preview UI, delivery verified end to end; **paginated** patient list with configurable rows per page and footer totals; Show PII, search, filters, column sort, export |
| **ClinicalOps CMS — Public Reviews** | Dashboard from the Google Reviews API (total, average rating), Sentiment Over Time chart, ratings/reviews by site, review cards; **AI Reply** button that generates a reply into the input; Submit Reply; **Review Alert Configuration** dialog (on/off, 1★–5★ threshold slider, up to 5 recipient emails); filters with reset |
| **ClinicalOps CMS — Support Tickets** | **Kanban board** (To Do / In Progress / Resolved) with live counts; ticket cards (priority badge, assignee, attachment preview); **Create Ticket dialog** (title 0/255, description 0/5000, priority toggle, image upload SVG/PNG/JPG/GIF up to 10 MB, drag-and-drop); ticket appears in the right column after creation; detail view with **Change Status**; email notification with a deep link; grid and list views |
| **CMS website module** | Responsive modules in React + TypeScript + Tailwind; reusable forms, modals, tables, layouts; "create with AI or manually" flows; validations, loading and error handling |
| **Denver Allergy website** | Pollen Count and Allergy Info page from the **AccuWeather API** (updates every 4 h); 5-day forecast table; reusable embeddable **Live Pollen Report widget**; **Lighthouse audit** (see the numbers below); accessibility fixes (alt text, ARIA, contrast, keyboard navigation, heading order) |
| **Raga-admin UI** (extra task) | Login page, paginated customers dashboard with live search and status badges, slide-over user-profile drawer with an access toggle |
| **Bug fixing** | API-integration, rendering, loading-state and responsive bugs across Clinical Ops, CMS and Denver Allergy, including other developers' modules; **conditional radio-branching bug** (components from the first branch carried into new branches when branch names were duplicated); **hyperlink bug** (`https://` pre-filled, so pasted full URLs became invalid); regression testing after fixes |

**Resume bullets:** 5+ production frontend features (incl. the multi-tenant ClinicalOps platform and the Collections Analytics Dashboard) · 20+ reusable responsive components (React, Tailwind, Framer Motion) connected to Node.js, MongoDB and REST APIs · worked with Backend, QA and Product, resolved 40+ bugs, "reducing page load time by 35% through lazy loading and optimized state management".

### FirstBriq

**Role:** Product Software Engineer Intern, remote · **Resume:** Oct 2026 – present (the portfolio says "Freelance, Sep 2026 – present").
**Product (repo README):** a platform that connects homeowners with interior designers — the "Designer Studio", vendor and project onboarding, journey articles. Frontend: React 19, Vite, Tailwind 4, Framer Motion, SWR. Backend: Payload CMS 3 (on Next.js) with MongoDB and S3.

**Your own commits (git log, Oct–Nov 2026):**

| Ticket / commit | What you did |
|---|---|
| perf(home): stop fetching vendors and projects that nothing renders | removed wasted requests |
| perf(api): select only the fields the list renders | smaller payloads (`select[...]`); the comment notes the old journey-articles response was ~860 KB and ~10 s server time |
| fix(journey): fetch all journey articles, not Payload's default 10 | Payload's default page size of 10 silently dropped articles 11–12 → cards showed "Image unavailable"; fixed with an explicit `limit=100` |
| perf(home): guide image as WebP with `srcset`, then one 62 KB WebP | image optimisation |
| perf(worker): cache hashed build assets for a year | `/assets/name-<hash>.ext` → `public, max-age=31536000, immutable`; HTML stays uncached |
| perf(bundle): load Sentry on demand in ErrorBoundary | entry chunk 100,568 B → 86,408 B gzip; 42 → 0 Sentry modules |
| FBQ-147 | **debounced designer search**, keeping old results visible while loading, with Vitest fake-timer tests |
| FBQ-127 | vendor onboarding: dropdown, required fields, **drafts**, live project edits, mandatory gallery (frontend and backend) |
| FBQ-133 | profile popover stays clickable; confirm before logout |
| FBQ-140 | Google sign-in limited to homeowners; role tabs in Users |
| FBQ-14 | **rate-limited** the lead and contact forms and closed limiter bypasses |
| FBQ-148 | email vendors and the team about new leads; optional sales-email field |
| FBQ-222 | edit lock (shows who holds it), one version per edit session, Waiting-for-approval dashboard card, Publish as the only approval step, choose Google reviews in onboarding |
| fix | footer responsive on mobile |

**Resume bullets:** 3+ full-stack features (React, TypeScript, Node.js, MongoDB, REST) owning UI, backend and deployment · Node/MongoDB services with **AWS S3 + CDN**, "cutting media load time by 30%" · reviewed 30+ PRs, Git workflows and CI/CD, weekly releases.
**Portfolio also says:** building FirstBriq's operations platform — WhatsApp-to-ERP workflow automation, AI-assisted lead management and PM approval dashboards (the `Desktop/FirstBriq` "Briq Ops" README: *"the LLM proposes, the code decides"* — LLM output validated with Zod, rules decide, risky changes go to a PM for approval). ⚠️ That folder has no git history, so only describe the parts **you personally built**.

### AlgoTaskFlow

React 19, TypeScript, Node.js, MongoDB, Tailwind · live · task manager with **JWT auth, 2-tier RBAC**, team collaboration for 10+ users · admin dashboard with full CRUD for projects, member assignment, 4-level priority/status tracking · **Recharts** analytics view with 4+ charts · **light/dark theming via Zustand** · **global 401 session handling**.

### Food Saver

MERN web app + React Native app matching food donors with NGOs within 5 km (**MongoDB 2dsphere** queries) · 15+ REST APIs secured with JWT, Google OAuth 2.0, 3-role RBAC, handoff verification · push notifications to NGOs about nearby donations in under 5 s, plus pickup status · **Gemini API** auto-generates listings, "cutting donor posting time by 60%" · Framer Motion UI.

### Numbers to be careful with

Interviewers **will** ask "how did you measure that?". Know these answers:

| Claim | What your files support | How to say it safely |
|---|---|---|
| Lighthouse Performance 50 → 75; FCP 14.2 s → 2.3 s; LCP 33.0 s → 2.3 s; CLS 0.136 → 0.002 | Contribution report table. **Note:** "before" was measured on **localhost**, "after" on **production**, and Total Blocking Time went **up** (110 → 440 ms), Accessibility 87 → 85 | "Performance went from 50 to 75 in Lighthouse and LCP dropped a lot. The before/after weren't the same environment, so I treat it as directional. TBT actually got worse, which I'd look at next — probably third-party scripts or a big JS task." Being honest here is a **strength**. |
| "Reducing page load time by 35%" (resume, RagaAI) | Not in the report | **[fill in]** which page and how you measured, or present it as "load-time improvements via lazy loading". |
| "Cutting media load time by 30%" (resume, FirstBriq) | Not in the commits you made in the Frontend/Backend repos | **[fill in]** how measured (e.g. Network tab before/after the S3 + CDN move). |
| Entry bundle 100.6 KB → 86.4 KB gzip | Commit message (exact bytes) | Safe to say exactly. |
| 40+ bugs, 30+ PRs reviewed, 20+ components | Resume | Have 2–3 concrete examples ready (above). |

> ⚠️ **Privacy:** the report is marked "Confidential — Internal Document" and the products handle patient data. Talk about **what you built and how**, not patient names, client internals or dollar figures from client data.

---

## Q. Tell me about yourself

**Priority:** Critical · ~90 seconds · structure: **present → past → why here**

🗣️ **Hinglish tip:** Yeh resume padhna nahi hai. **Ek kahani** sunao — "main kaun hoon, kya build kiya, aur TrueFoundry kyun". End mein woh topic chhodo jis par tum baat karna chahte ho (dashboards / performance).

✅ **Model answer:**
"Hi, I'm Aditya. I finished my B.Tech in Computer Science at Lovely Professional University this year, after a diploma in Electrical Engineering, and I've been working as a frontend-focused engineer in product startups.

Right now I'm a product software engineer intern at FirstBriq, where I own features end to end in React, TypeScript, Node and MongoDB. A lot of my recent work there has been performance — removing unused API calls, trimming payloads, caching hashed assets for a year and getting Sentry out of the entry bundle — plus features like debounced designer search and vendor onboarding with drafts and an edit lock.

Before that I spent about seven months at RagaAI building production dashboards for a healthcare operations platform in React, TypeScript and Tailwind — a fax classification dashboard, an AI-assisted billing collections module with tabbed patient details and action buttons wired to APIs, a reviews dashboard with AI-generated replies, and a Kanban support-ticket system. I built 20+ reusable components there and did a Lighthouse-driven performance and accessibility pass on a client site.

What I enjoy most is turning complex, API-heavy data into dashboards that are fast and clear. That's exactly what TrueFoundry's AI Gateway and deployment consoles are, which is why I'm excited about this role."

**Follow-ups:** "Why move from RagaAI?" → **[fill in honestly]**, keep it positive (the internship ended / you wanted to own full-stack product work). "Electrical to CS?" → you liked building things that people use; you moved into CS through the B.Tech and full-stack training.

---

## Q. Explain your strongest frontend project

**Pick:** RagaAI **Collections Agent** (complex, API-heavy dashboard = closest to TrueFoundry). Use the **STAR + architecture** format.

✅ **Model answer:**
"**Situation:** RagaAI's Clinical Ops platform needed a collections module for a clinic's billing team: see outstanding balances, decide what to do with each patient account, and act — without switching between tools.

**What I built:** the overview with live summary cards — total accounts receivable, Stripe collections in the last 30 days and balances not yet synced — and category tabs like Hold, Shot Flag, Payment Plan, each with live counts and amounts. There's a sync status for the EHR and Stripe with a 'Sync Now' trigger. Clicking a patient opens a dialog with four tabs — reminders, claims and statements, encounter history and payment history — and **each tab is populated by its own API call** **[fill in: fetched when the tab opens, or all at once?]**. The dialog has four actions, each a separate API call: send an SMS reminder, create a shot flag and email the medical-assistant team with a PDF, escalate to the collections agency, or write the balance off as bad debt. The list is paginated with configurable page size, search, filters, column sort, export, and a Show-PII toggle so sensitive data is hidden by default.

**How:** React and TypeScript with Tailwind, reusable table, tab, dialog and card components, and every API call has loading, success and error states.

**Result:** **[fill in: adoption/feedback]**. I verified the email flow end to end — the shot-flag email with the PDF attachment actually arrived.

**What I'd improve:** a destructive action like bad-debt write-off should have a confirmation step and an undo window, and I'd add optimistic updates with rollback for faster-feeling actions."

**Likely follow-ups and answers:**

| Question | Answer direction |
|---|---|
| Why a separate API per tab? | each tab's data comes from a different source; loading a tab only when it opens means less data up front and a faster dialog; cache results so switching back doesn't refetch (say honestly whether yours did this) |
| How did you handle loading/error per action? | per-button pending state (disabled + spinner), toast on success/failure, refresh the affected counts |
| How was state managed? | **[fill in: what the codebase used]** — component state for the dialog/tabs, server data from the API layer |
| How did you make the PII toggle safe? | default off; masking in the UI is a convenience — the real protection is the API/permissions **[fill in whether the API masked it]** |
| Pagination: client or server? | **[fill in]** — say what it was and when you'd move to server/cursor pagination |

---

## Q. Explain a challenging frontend problem

Have **two** ready. Use **Problem → Investigation → Fix → Result → Lesson**.

### Story 1 — Performance audit (RagaAI, Denver Allergy site)

"**Problem:** the client's website scored 50 in Lighthouse performance, and the Largest Contentful Paint was terrible — 33 seconds in my local audit. **Investigation:** Lighthouse and the Network tab showed huge unoptimised images, everything loaded up front, and fonts blocking rendering. **Fix:** I compressed and converted the images to modern formats, lazy-loaded below-the-fold images and components with React `lazy()` and IntersectionObserver, split the code with dynamic imports, set `font-display: swap`, removed unused CSS and deferred non-critical scripts. **Result:** performance went to 75 on production, and FCP and LCP both came down to about 2.3 seconds. Layout shift went to almost zero. **Honest note:** the before was measured locally and the after on production, and Total Blocking Time went up, so my next step would be profiling the main thread for long tasks. **Lesson:** measure first; images and loading order usually matter more than micro-optimising React."

### Story 2 — A silent data bug (FirstBriq)

"**Problem:** on the FirstBriq homepage, two journey cards showed 'Image unavailable', but only in production. **Investigation:** the images existed. The cover-image lookup fetched the articles list without a limit, and Payload CMS returns 10 documents by default. Production had 12 published articles, so the response said `hasNextPage: true` and the last two were silently missing from the lookup, and the fallback showed a placeholder. **Fix:** I requested an explicit limit consistent with our other full-list fetches and selected only the image fields, so all 12 came back in one small page. **Lesson:** check pagination defaults on every list API; 'works with 10 items' bugs only appear with real data."

### Story 3 — Bundle size (FirstBriq) — short version

"Sentry was already supposed to load lazily, but our ErrorBoundary imported `@sentry/react` statically. Because the boundary wraps the whole app, 42 Sentry modules ended up in the entry chunk anyway. I moved the import inside `componentDidCatch`, guarded by the DSN env variable, so it loads only when an error actually happens. The entry chunk went from about 100.6 KB to 86.4 KB gzipped, with no behaviour change."

**Bug-fix examples for "debugging production issues":** conditional radio branching carrying components into new branches when names were duplicated; the hyperlink field pre-filled with `https://`, which broke pasted full URLs — reproduce, fix, regression-test the connected flows.

---

## Q. How do you structure a React application?

✅ **Answer:** "I organise by feature, with a shared layer underneath. `components/ui` holds generic, typed, accessible building blocks — Button, Modal, Table, Tabs — with no API calls. Each feature folder — for example `collections` or `support-tickets` — owns its components, hooks, API functions and types. A single API client handles the base URL, auth header, errors and the global 401 case. Server data lives in a fetching layer, and global UI state like theme or filters goes in a small Zustand store. Routes compose features. Components get data through props and send events up through callbacks, which keeps them reusable — that's how I ended up with 20+ shared components at RagaAI." (Diagram: [08 → Reusable component architecture](08-Frontend-Performance-and-Architecture.md#14-reusable-component-architecture).)

---

## Q. How do you collaborate with backend developers?

✅ **Answer:** "I agree on the API contract **before** building: endpoints, request and response shapes, error format, pagination and status codes — ideally written down or as an OpenAPI spec, and I test it in Postman. While the API isn't ready I build against mock data with the same shape, so we work in parallel. I type the responses in TypeScript and handle loading, empty and error states from day one. When something's off, I share a precise reproduction — request, response, request id and expected behaviour — instead of 'it's not working'. At RagaAI I worked like this with backend, QA and product to ship the collections and CMS modules and resolve a lot of bugs. At FirstBriq I work on both sides — for example, the onboarding drafts feature touched the frontend form and the backend API — so I understand both views."

---

## Project deep-dive questions

| Question | Your real material | Key points |
|---|---|---|
| "How did you use Zustand?" | AlgoTaskFlow: light/dark theming via Zustand | a store with `theme` + `toggleTheme`; components use a selector so only they re-render; persist to localStorage **[fill in if you used `persist`]**; Zustand vs Context ([04 §17](04-React-Interview-Questions.md#17-zustand)) |
| "How did you build reusable components?" | RagaAI: 20+ components — forms, modals, tables, dashboard layouts | props-driven, composition with `children`, variants, typed props, design-system consistency, accessibility |
| "How did you integrate REST APIs?" | Fax list + summary cards; 4 action APIs; ticket creation | API layer, loading/success/error, refresh after mutation, error messages, 401 handling (AlgoTaskFlow) |
| "Dashboard development?" | Fax overview, Collections, Public Reviews (sentiment chart), Support Tickets Kanban, AlgoTaskFlow Recharts view | KPI cards → charts → tables → drill-down; filters; pagination; empty states |
| "Frontend performance?" | Denver Allergy Lighthouse; FirstBriq payload/bundle/caching commits | measure → fix → verify; see the stories above |
| "How do you debug a production issue?" | radio-branch bug, hyperlink bug, Payload limit bug | reproduce → isolate (Network tab, logs, React DevTools) → fix root cause → regression test → explain in the PR |
| "Working with QA and product?" | RagaAI bug resolution in sprints | clear repro steps, acceptance criteria, demo before merge |
| "Code review?" | FirstBriq: 30+ PRs reviewed (resume) | readability, edge cases, tests, naming, small PRs; **[fill in one real review comment you gave]** |
| "Your FirstBriq product engineering?" | owning features end to end: onboarding drafts + edit lock + versions, rate limiting, lead emails, perf | scoping with founders (portfolio) → build both sides → deploy → iterate |
| "How did you test?" | FBQ-147 Vitest + Testing Library with fake timers | test behaviour: "URL updates only once typing pauses" |

---

## Q. Why TrueFoundry?

✅ **Answer:** "Three reasons. First, the product: an AI gateway and a deployment platform are exactly the kind of data-heavy developer dashboards I've been building — logs, metrics, cost, status — just at a much bigger scale and for a technical audience, which raises the bar for UX and performance. Second, I've seen the problem from the other side: at RagaAI the company itself worked on AI evaluation and observability, and in my own work I've integrated several AI APIs — Gemini in Food Saver, AI-generated replies at RagaAI. When you use multiple model providers, managing keys, cost and failures quickly gets messy, and a gateway solves that properly. Third, it's a fast-moving startup where an intern ships real features, and the reported interview process — machine coding over trivia — tells me the team values people who can build."

**[fill in]** one specific thing you liked after trying their docs or product (e.g. the unified OpenAI-compatible API or the MCP gateway).

---

## Q. Why frontend engineering?

✅ **Answer:** "Frontend is where engineering meets the user directly. I like that the result of my work is immediately visible and usable, and that good frontend work is a mix of logic, performance, design sense and empathy for the user. I've also done backend work at FirstBriq, and that made me appreciate frontend more — turning an API response into something a billing team or an admin can understand and act on in seconds is the part I enjoy most. And modern frontend is deep: rendering, state, performance, accessibility, and now streaming AI interfaces."

---

## Q. Why should we hire you?

✅ **Answer:** "Because I've already done this job in production. I've shipped dashboard features in React and TypeScript that real teams use — with tabs, filters, pagination, PII masking, and actions wired to APIs — and I care about the details that make them usable: loading and error states, accessibility, responsiveness. I measure performance instead of guessing, and I can show real results, like the Lighthouse work and the bundle and caching fixes. I can work across the stack when a feature needs it, I communicate well with backend, QA and product, and I learn fast — I came from electrical engineering and went from a full-stack training program in 2023 to shipping production features in 2026."

---

## Questions to ask them

1. "What does the frontend stack look like for the gateway console — Next.js App Router, which state and data-fetching libraries?"
2. "What would a frontend intern own in the first month?"
3. "How do you handle very large log volumes in the UI today — virtualization, server-side search?"
4. "How do frontend engineers work with the platform and ML teams — who designs the UX for new features like MCP?"
5. "What separates interns who get a full-time offer here?"
