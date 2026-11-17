# 08 — Frontend Performance and Architecture

[← Next.js](07-NextJS-Questions.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: TrueFoundry Product →](09-TrueFoundry-Product-Questions.md)

All 🔮 **Predicted**. These are "how would you…" questions. TrueFoundry's products are **data-heavy dashboards** (request logs, token and cost metrics, deployments), so expect them in the architecture discussion. Each answer follows **Measure → Find the cause → Fix → Verify**, and points to **your own real work** where you have it.

## Contents

| # | Question | Priority |
|---|---|---|
| 1 | [How to optimize a slow React application](#1-how-to-optimize-a-slow-react-application) | Critical |
| 2 | [Rendering 10,000 records efficiently](#2-rendering-10000-records-efficiently) | Critical |
| 3 | [Virtualization](#3-virtualization) | High |
| 4 | [Lazy loading](#4-lazy-loading) | High |
| 5 | [Code splitting](#5-code-splitting) | High |
| 6 | [API caching](#6-api-caching) | High |
| 7 | [Request cancellation with AbortController](#7-request-cancellation-with-abortcontroller) | High |
| 8 | [Debouncing API calls](#8-debouncing-api-calls) | High |
| 9 | [Handling network errors and retries](#9-handling-network-errors-and-retries) | Critical |
| 10 | [Skeleton loaders](#10-skeleton-loaders) | Medium |
| 11 | [Error boundaries in production](#11-error-boundaries-in-production) | Medium |
| 12 | [Authentication on the frontend](#12-authentication-on-the-frontend) | High |
| 13 | [Responsive design](#13-responsive-design) | Medium |
| 14 | [Reusable component architecture](#14-reusable-component-architecture) | High |
| 15 | [Accessibility basics](#15-accessibility-basics) | Medium |

---

## 1. How to optimize a slow React application

**Question:** "Users say our dashboard is slow. What do you do?"

🗣️ **Hinglish:** Doctor pehle **test karata hai**, phir dawai deta hai. Bina measure kiye `useMemo` chhidakna = bina diagnosis ke antibiotic.

✅ **Answer (structure it like this):**
1. **Clarify "slow"** — slow first load? slow typing/clicking? slow data?
2. **Measure:** Lighthouse / Core Web Vitals (LCP, INP, CLS) for load; React DevTools **Profiler** for re-renders; Chrome **Performance** tab for long tasks; **Network** tab for slow or repeated API calls; bundle analyzer for JS size.
3. **Fix by cause:**

| Symptom | Likely cause | Fix |
|---|---|---|
| Slow first load (LCP high) | big JS bundle, huge images, render-blocking fonts | code splitting, lazy routes, compress images (WebP, `srcset`), `font-display: swap`, cache static assets |
| Typing/clicking lags (INP high) | too many re-renders, heavy calculations, long lists | move state down, `React.memo` + stable props, `useMemo`, virtualization, `useDeferredValue`, debounce |
| Data feels slow | waterfalls, no caching, over-fetching | parallel requests, cache (React Query), fetch only needed fields, pagination |
| Layout jumps (CLS) | images without size, late-loading content | `width/height` or `aspect-ratio`, skeletons with fixed size |

4. **Verify:** measure again and compare.

**Your real story (use it!):** On the Denver Allergy site at RagaAI you ran a Lighthouse audit and applied lazy loading (React `lazy()` + IntersectionObserver), image compression and conversion, code splitting, `font-display: swap` and removed unused CSS. Performance went 50 → 75 and LCP 33.0 s → 2.3 s. At FirstBriq you found that the homepage fetched vendors and projects nothing rendered, selected only the needed fields, and moved Sentry out of the entry bundle. Details are in [10](10-Project-and-HR-Questions.md#q-explain-a-challenging-frontend-problem).

---

## 2. Rendering 10,000 records efficiently

**Question:** "The API returns 10,000 log rows. How do you show them?" (very relevant: AI Gateway request logs)

🗣️ **Hinglish:** 10,000 rows DOM mein daaloge to browser ki **saans phool jayegi**. User ek time pe 20 rows hi dekh sakta hai — to sirf utni hi banao.

✅ **Answer:** "First I question whether the browser should get 10,000 rows at all. Usually the right answer is **server-side pagination or cursor-based infinite scroll** with filters on the server, so the browser gets 50–100 at a time. If we truly need all of them on the client — say, for instant client-side filtering — I **virtualize** the list so only the visible rows plus a small buffer exist in the DOM. I also memoize row components, give stable keys, memoize the filtered and sorted array, debounce the search box, and if processing is heavy, move it to a Web Worker."

| Approach | DOM nodes | When |
|---|---|---|
| Render all | 10,000 | never for big lists |
| Pagination | ~50 | tables, when users jump to a page |
| Infinite scroll | grows | feeds, logs (combine with virtualization) |
| Virtualization | ~30 | long scrollable lists/tables |
| Server-side filter/sort | ~50 | data too large for the client |

---

## 3. Virtualization

**Idea:** a tall empty container gives the right scrollbar; only rows in the viewport (+ overscan) are rendered, positioned with `transform`.

```
 scrollTop = 4000, rowHeight = 40 → first visible = 100
 ┌───────────────── container (height 400px, overflow auto) ───┐
 │  spacer height = 10,000 × 40 = 400,000px                    │
 │      rows 95..115 rendered at translateY(95 × 40)           │
 └─────────────────────────────────────────────────────────────┘
```

```jsx
import { useState } from "react";

export default function VirtualList({ items, rowHeight = 40, height = 400, overscan = 5, renderRow }) {
  const [scrollTop, setScrollTop] = useState(0);

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(height / rowHeight) + overscan * 2;
  const end = Math.min(items.length, start + visibleCount);
  const visible = items.slice(start, end);

  return (
    <div style={{ height, overflowY: "auto" }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * rowHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${start * rowHeight}px)` }}>
          {visible.map((item, i) => (
            <div key={item.id} style={{ height: rowHeight }}>
              {renderRow(item, start + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// const logs = Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Request ${i}` }));
// <VirtualList items={logs} renderRow={(l) => <span>{l.text}</span>} />
```

✅ **Answer:** "Virtualization renders only what's visible. With a fixed row height I calculate the first visible index from `scrollTop / rowHeight`, render that slice plus some overscan, and offset it inside a spacer as tall as the full list, so the scrollbar is correct. In production I'd use TanStack Virtual or react-window, which also handle variable heights. Trade-offs: Ctrl+F can't find off-screen rows, and screen readers see only the rendered rows."

---

## 4. Lazy loading

| What | How |
|---|---|
| Routes / heavy components | `React.lazy(() => import("./LogsPage"))` + `<Suspense>` |
| Images | `<img loading="lazy">`, `srcset`/`sizes`, or IntersectionObserver |
| Below-the-fold sections | render when visible (IntersectionObserver) |
| Third-party scripts | load after interaction / idle |
| Data | fetch a tab's data when the tab opens |

✅ **Answer:** "Lazy loading delays loading things until they're needed: route components with `React.lazy`, images with `loading='lazy'`, below-the-fold sections with IntersectionObserver, and third-party scripts after the page is interactive. I don't lazy-load the LCP image or above-the-fold content — that makes the page slower."

---

## 5. Code splitting

```jsx
// Route-level
const Logs = lazy(() => import("./pages/Logs"));
const Settings = lazy(() => import("./pages/Settings"));

// On interaction — load a heavy library only when needed
async function exportCsv(rows) {
  const { unparse } = await import("papaparse"); // separate chunk, downloaded on click
  download(unparse(rows));
}
```

✅ **Answer:** "Code splitting breaks the bundle into chunks so users download only the code for what they're using. Bundlers split at every dynamic `import()`. I split by route first, then heavy components and libraries such as charts, editors and CSV export. I check the result with a bundle analyzer and watch out for a static import elsewhere that pulls the 'lazy' module back into the main chunk."

**Your real example:** at FirstBriq, `lib/sentry.ts` already loaded Sentry dynamically, but `ErrorBoundary` imported `@sentry/react` statically, so 42 Sentry modules stayed in the entry chunk. Moving the import inside `componentDidCatch` cut the entry chunk from about 100.6 KB to 86.4 KB gzip (commit message, FBQ perf work).

---

## 6. API caching

| Layer | Example |
|---|---|
| Browser HTTP cache | `Cache-Control` headers; hashed assets `max-age=31536000, immutable` |
| In-memory client cache | `Map` keyed by URL (see [P17](05-Machine-Coding-Problems.md#p17-autocomplete-typeahead)) |
| Server-state library | TanStack Query / SWR: cache by key, `staleTime`, background refetch, dedupe |
| CDN | static pages, images |

```jsx
import { useQuery } from "@tanstack/react-query";

function useUsage(range) {
  return useQuery({
    queryKey: ["usage", range],                 // cache key
    queryFn: ({ signal }) => fetch(`/api/usage?range=${range}`, { signal }).then((r) => r.json()),
    staleTime: 30_000,                          // fresh for 30 s → no refetch
    refetchInterval: 60_000,                    // live-ish dashboard
    retry: 2,
  });
}
```

✅ **Answer:** "I separate server state from UI state. For server data I use TanStack Query or SWR: responses are cached by a key, duplicate requests are de-duplicated, stale data shows instantly while it refetches in the background, and mutations invalidate the related keys. For static assets I rely on HTTP caching with content-hashed filenames. The hard part is invalidation, so I decide per endpoint how stale is acceptable."

**Your real example:** at FirstBriq, hashed build assets were served with `max-age=0, must-revalidate`, so every repeat visit revalidated every chunk. You changed only `/assets/name-<hash>.ext` files to `public, max-age=31536000, immutable` and kept `index.html` uncached.

---

## 7. Request cancellation with AbortController

```js
const controller = new AbortController();
fetch("/api/logs?model=gpt-4o", { signal: controller.signal })
  .then((r) => r.json())
  .then(render)
  .catch((err) => {
    if (err.name === "AbortError") return; // expected, not a real error
    showError(err);
  });
controller.abort(); // e.g. user changed the filter or left the page

// Timeout helper (modern browsers / Node 18+)
fetch("/api/slow", { signal: AbortSignal.timeout(10_000) });
```

✅ **Answer:** "`AbortController` lets me cancel a fetch. I create one per request, pass its `signal`, and call `abort()` in the `useEffect` cleanup — when the component unmounts or the input changes. That prevents race conditions where an older, slower response overwrites a newer one, and it stops wasting bandwidth. I ignore `AbortError` in the catch. `AbortSignal.timeout()` gives a request timeout."

🗣️ **Hinglish:** Zomato order cancel karne jaisa — user ne filter badal diya, purana order ab kisi kaam ka nahi, **cancel karo** taaki galat khana (purana response) na aa jaye.

---

## 8. Debouncing API calls

✅ **Answer:** "For search and filter inputs I debounce the **value**, not the input, so typing stays instant and the API is called only after the user pauses, typically 300–500 ms. I combine it with AbortController for in-flight requests, a minimum query length, and caching of previous queries. For scroll-driven requests I throttle instead, or better, use IntersectionObserver."

Code: [P8 Debounced search](05-Machine-Coding-Problems.md#p8-debounced-search) · theory: [02 → Debounce vs throttle](02-JavaScript-Fundamentals.md#15-debouncing-vs-throttling).
**Your real example:** FBQ-147 at FirstBriq — debounced the designers search and **kept the old results visible while loading**, with Vitest tests using fake timers.

---

## 9. Handling network errors and retries

```js
async function fetchWithRetry(url, { retries = 3, baseDelay = 500, signal } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal });
      if (res.ok) return res.json();
      // retry only temporary failures
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= retries) throw new Error(`HTTP ${res.status}`);
      const retryAfter = Number(res.headers.get("Retry-After")) * 1000;
      await sleep(retryAfter || backoff(attempt, baseDelay));
    } catch (err) {
      if (err.name === "AbortError" || attempt >= retries || err.message.startsWith("HTTP")) throw err;
      await sleep(backoff(attempt, baseDelay)); // network failure → retry
    }
  }
}
const backoff = (attempt, base) => base * 2 ** attempt + Math.random() * base; // exponential + jitter
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
```

| Error | User sees | Retry? |
|---|---|---|
| Offline / network failure | "You're offline" banner + Retry | ✅ auto, with backoff |
| 400 / 422 validation | field errors | ❌ |
| 401 | redirect to login / refresh token | ❌ (refresh once) |
| 403 | "No access" | ❌ |
| 404 | "Not found" state | ❌ |
| 429 rate limit | "Too many requests, retrying in Xs" | ✅ respect `Retry-After` |
| 5xx | "Something went wrong" + Retry | ✅ limited |
| Timeout | "Taking longer than usual" + Retry | ✅ |

✅ **Answer:** "I classify errors. Network failures, timeouts, 429 and 5xx are temporary, so I retry a few times with exponential backoff and jitter, and respect `Retry-After`. 4xx errors other than 429 aren't retried — they need user action. Only safe or idempotent requests are retried automatically. The UI always shows a clear message, keeps the last good data visible, and offers a manual Retry. Errors are reported to monitoring with context."

> ⚠️ Don't auto-retry a POST that creates something (a deployment, a payment) unless the API supports an **idempotency key**.

---

## 10. Skeleton loaders

```jsx
function CardSkeleton() {
  return (
    <div className="rounded-xl border p-4" aria-busy="true" aria-label="Loading">
      <div className="mb-3 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
    </div>
  );
}
// {isLoading ? <CardSkeleton /> : <CostCard data={data} />}
```

✅ **Answer:** "A skeleton is a grey placeholder shaped like the real content. It feels faster than a spinner, and because it has the same size as the final content it prevents layout shift. I use skeletons for the first load and keep showing old data with a subtle indicator on refetch, so the screen doesn't flash. I avoid showing a skeleton for very fast responses — a short delay of about 200 ms prevents flicker."

---

## 11. Error boundaries in production

✅ **Answer:** "I wrap each independent area — each dashboard widget, each route — in its own error boundary, so one crash shows 'This chart failed to load · Retry' instead of a white screen. The boundary reports to Sentry with the component stack. Async and event-handler errors don't reach boundaries, so those go into error state in the component. In Next.js, `error.tsx` does this per route segment."

Code: [04 → Error boundaries](04-React-Interview-Questions.md#22-error-boundaries).

---

## 12. Authentication on the frontend

```
 login form → POST /auth/login → server sets HttpOnly cookie (or returns tokens)
 every request → cookie sent automatically / Authorization: Bearer <access token>
 401 → try refresh once → still 401 → clear state, redirect to /login?next=/current
```

| Storage | XSS-safe? | CSRF risk? | Note |
|---|---|---|---|
| HttpOnly + Secure + SameSite cookie | ✅ JS can't read it | needs SameSite / CSRF token | preferred |
| `localStorage` | ❌ any injected script can steal it | ❌ | simple, but riskier |
| Memory (variable) + refresh cookie | ✅ | low | lost on reload → refresh |

✅ **Answer:** "The safest default is an HttpOnly, Secure, SameSite cookie set by the server, so JavaScript can't read the token. On the frontend I keep the **user info** in state, protect routes with a guard that redirects to login, attach credentials in one API client, and handle 401 globally — refresh once, otherwise log out and return the user to where they were. Hiding a button is only UX; the backend must still check permissions. For a developer platform there are also API keys: show them once, mask them afterwards, and offer copy and rotate actions."

**Your real examples:** AlgoTaskFlow — JWT auth, 2-tier role-based access and global 401 session handling. Food Saver — JWT, Google OAuth 2.0 and 3-role RBAC.

---

## 13. Responsive design

✅ **Answer:** "I build mobile-first: base styles for small screens, then `sm:`/`md:`/`lg:` breakpoints in Tailwind or `min-width` media queries. Layouts use flexbox and grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4` for KPI cards), and fluid sizes like `clamp()` and `aspect-ratio`. Wide data tables scroll horizontally inside their container (or become cards on mobile), and the sidebar becomes a drawer. I test at 375 px and make sure there's no page-level horizontal scroll and that touch targets are at least 44 px."

---

## 14. Reusable component architecture

```
src/
├─ components/ui/        Button, Input, Select, Modal, Table, Badge, Skeleton   (no business logic)
├─ components/charts/    LineChart, BarChart wrappers
├─ features/
│  ├─ gateway/           components/, hooks/useUsage.ts, api.ts, types.ts
│  ├─ logs/
│  └─ deployments/
├─ hooks/                useDebounce, useClickOutside, useLocalStorage
├─ lib/                  apiClient.ts, formatters.ts (currency, tokens, dates)
├─ store/                Zustand stores (UI state only)
└─ app/ or pages/        routes compose features
```

✅ **Answer:** "I separate **generic UI components** (Button, Modal, Table — no API calls, fully prop-driven, accessible, typed) from **feature modules** that own their API calls, hooks and types. Components get data via props and report events via callbacks; data fetching lives in hooks. I prefer composition (`children`, slots) over many boolean props, use variants for styling, and keep design tokens (colours, spacing) in the Tailwind config. Server state goes into React Query and UI state into small Zustand stores."

**Your real example:** "20+ reusable, responsive UI components with React, Tailwind CSS and Framer Motion" at RagaAI — forms, modals, tables and dashboard layouts for the CMS ([10](10-Project-and-HR-Questions.md#ragaai)).

---

## 15. Accessibility basics

| Rule | Example |
|---|---|
| Semantic HTML first | `<button>` not `<div onClick>`; `<nav>`, `<main>`, `<table>` |
| Keyboard works everywhere | Tab order, Enter/Space on buttons, Esc closes modals, arrows in lists |
| Visible focus | `:focus-visible` outline; never remove it without a replacement |
| Labels | `<label>` for inputs; `aria-label` on icon-only buttons |
| Images | `alt` text; `alt=""` for decorative images |
| Colour | contrast ≥ 4.5:1; don't show status with colour alone (add an icon or text) |
| Dynamic updates | `aria-live="polite"` for status messages; `role="alert"` for errors |
| ARIA patterns | tabs, combobox, dialog follow WAI-ARIA practices |

✅ **Answer:** "I start with semantic HTML, which gives keyboard and screen-reader support for free. Every action must work with the keyboard and have a visible focus style, inputs have labels, icon buttons have `aria-label`s, images have alt text, colour contrast meets WCAG AA, and status isn't shown with colour alone. For custom widgets like comboboxes, tabs and modals I follow the WAI-ARIA patterns and manage focus. I check with Lighthouse or axe and by using the page with only a keyboard."

**Your real example:** the Denver Allergy accessibility work — alt text, ARIA labels and roles, contrast checks, keyboard navigation across pages and modals, and the heading hierarchy (Lighthouse accessibility 85/100).
