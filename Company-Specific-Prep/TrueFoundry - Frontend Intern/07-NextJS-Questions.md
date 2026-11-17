# 07 — Next.js Questions

[← TypeScript](06-TypeScript-Questions.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: Performance and Architecture →](08-Frontend-Performance-and-Architecture.md)

All 🔮 **Predicted**, **Medium** priority for an intern round (no reported Next.js question). Next.js is in TrueFoundry's stack and it appears in your FirstBriq work (the FirstBriq backend is Payload CMS 3, which runs on Next.js). Answers are for the **App Router** (Next.js 15/16), with the Pages Router mentioned where interviewers still ask.

## Contents

1. [React vs Next.js](#1-react-vs-nextjs)
2. [Rendering strategies: CSR, SSR, SSG, ISR](#2-rendering-strategies-csr-ssr-ssg-isr)
3. [Server components vs client components](#3-server-components-vs-client-components)
4. [The use client directive](#4-the-use-client-directive)
5. [Hydration](#5-hydration)
6. [Routing](#6-routing)
7. [Data fetching and caching](#7-data-fetching-and-caching)
8. [Loading and error states](#8-loading-and-error-states)
9. [Next.js performance optimization](#9-nextjs-performance-optimization)
10. [Which rendering for a TrueFoundry-style dashboard?](#10-which-rendering-for-a-truefoundry-style-dashboard)

---

## 1. React vs Next.js

🗣️ **Hinglish:** React = **engine** (UI library). Next.js = **poori car** — engine ke saath routing, server rendering, API routes, image optimization sab fitted.

| | React (Vite SPA) | Next.js |
|---|---|---|
| What | UI library | full-stack React framework |
| Routing | add React Router | file-based (`app/`) |
| Rendering | client only (CSR) | SSR, SSG, ISR, CSR, streaming, server components |
| Backend code | separate server | Route Handlers, Server Actions |
| SEO / first paint | weaker (empty HTML first) | strong (HTML from the server) |
| Built-ins | — | `next/image`, `next/font`, code splitting per route |

✅ **Answer:** "React is a library for building UI components. Next.js is a framework on top of React that adds file-based routing, server-side and static rendering, React Server Components, API endpoints and built-in optimisations for images, fonts and scripts. For a logged-in internal dashboard, a React SPA is fine; for public pages that need SEO and a fast first load, or when I want server-side data fetching close to the backend, Next.js is the better choice."

---

## 2. Rendering strategies: CSR, SSR, SSG, ISR

```
 CSR  browser gets empty HTML → downloads JS → fetches data → renders
 SSR  server fetches data + renders HTML per request → browser shows it → hydrates
 SSG  HTML built ONCE at build time → served from CDN
 ISR  SSG + re-generate in the background after N seconds / on demand
```

| | When HTML is made | Fresh data? | Speed | Good for |
|---|---|---|---|---|
| CSR | in the browser | ✅ | slow first paint | dashboards behind login |
| SSR | each request | ✅ | medium (server work per request) | personalized pages, SEO + fresh data |
| SSG | build time | ❌ until rebuild | fastest | docs, marketing, blog |
| ISR | build + periodic regeneration | ~fresh | fast | product/pricing pages, model catalog |

🗣️ **Hinglish:** SSG = **pehle se bane samose** (turant milenge, par subah ke). SSR = **order pe garam samosa** (fresh, thoda wait). CSR = **ingredients ghar le jao, khud banao**. ISR = pehle se bane, par **har 10 min mein naya batch**.

✅ **Answer:** "With CSR the browser renders everything after downloading JavaScript — simple, but a slower first paint and weaker SEO. SSR renders HTML on the server for each request, so the user sees content immediately with fresh data, at the cost of server work. SSG renders at build time and serves from a CDN — fastest, but static until the next build. ISR is SSG that re-generates a page in the background after a time or on demand. In the App Router, a route is static by default and becomes dynamic when it uses request data like cookies, headers or uncached fetches."

**Pages Router equivalents (still asked):** `getServerSideProps` = SSR, `getStaticProps` = SSG, `getStaticProps` + `revalidate` = ISR.

---

## 3. Server components vs client components

| | Server Component (default in `app/`) | Client Component (`"use client"`) |
|---|---|---|
| Runs | on the server (build or request) | server (for the first HTML) **and** browser |
| JS sent to the browser | ❌ none | ✅ |
| `useState`, `useEffect`, event handlers | ❌ | ✅ |
| Direct DB / secret access | ✅ | ❌ |
| `async` component with `await fetch` | ✅ | ❌ |

```tsx
// app/models/page.tsx — Server Component
import ModelFilter from "./ModelFilter";
export default async function ModelsPage() {
  const models = await fetch("https://api.example.com/models").then((r) => r.json());
  return <ModelFilter models={models} />;   // pass data down to the interactive part
}
```

```tsx
// app/models/ModelFilter.tsx — Client Component ("use client" must be the first statement in the file)
"use client";
import { useState } from "react";
export default function ModelFilter({ models }: { models: { id: string; name: string }[] }) {
  const [q, setQ] = useState("");
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{models.filter((m) => m.name.includes(q)).map((m) => <li key={m.id}>{m.name}</li>)}</ul>
    </>
  );
}
```

✅ **Answer:** "In the App Router, components are Server Components by default. They run only on the server, can be async, can read data directly, and send no JavaScript to the browser — smaller bundles. Client Components are marked with `'use client'` and are needed for state, effects, event handlers and browser APIs. The pattern is: fetch on the server, and push interactivity into small client components at the leaves of the tree, passing them serializable props."

---

## 4. The use client directive

✅ **Answer:** "`'use client'` at the top of a file marks a **boundary**: that file and everything it imports become part of the client bundle. It doesn't mean 'render only on the client' — client components are still pre-rendered to HTML on the server, then hydrated. I put it as low in the tree as possible. A Server Component can be passed **as children** into a Client Component and still stay a Server Component."

⚠️ **Mistakes:** adding `"use client"` to the root layout (everything becomes client) · passing functions or class instances as props from server to client (props must be serializable) · importing server-only code (secrets) into a client file — use the `server-only` package to make that a build error.

---

## 5. Hydration

🗣️ **Hinglish:** Server ne **photo (HTML)** bhej di — dikh rahi hai par click nahi hoti. JS aake us photo mein **jaan daalta hai** (event listeners attach) — yahi hydration hai.

✅ **Answer:** "Hydration is when React in the browser takes the server-rendered HTML, builds the component tree and attaches event handlers, so the static page becomes interactive. React expects the first client render to match the server HTML exactly; if it doesn't, you get a hydration mismatch warning."

**Common mismatch causes and fixes:**

| Cause | Fix |
|---|---|
| `Date.now()`, `Math.random()` in render | compute in `useEffect`, or pass from the server |
| `window`/`localStorage` used in render | read in `useEffect` after mount |
| Locale/timezone formatting differs | format on one side, or pass the formatted string |
| Invalid HTML nesting (`<div>` in `<p>`) | fix the markup |
| Browser extensions changing the DOM | `suppressHydrationWarning` on that element only |

---

## 6. Routing

```
app/
├─ layout.tsx               shared shell (sidebar, nav) — persists across pages
├─ page.tsx                 /
├─ loading.tsx              Suspense fallback for this segment
├─ error.tsx                error boundary for this segment ("use client")
├─ not-found.tsx
├─ (dashboard)/             route group — not part of the URL
│  ├─ gateway/page.tsx      /gateway
│  └─ deployments/
│     ├─ page.tsx           /deployments
│     └─ [id]/page.tsx      /deployments/123   (dynamic segment)
├─ logs/[...slug]/page.tsx  catch-all
└─ api/usage/route.ts       GET/POST handler → /api/usage
```

```tsx
// app/deployments/[id]/page.tsx (Next.js 15+: params is a Promise)
export default async function DeploymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <h1>Deployment {id}</h1>;
}

// client-side navigation
import Link from "next/link";
<Link href="/deployments/123">Open</Link>;           // prefetched in production
// "use client": const router = useRouter(); router.push("/logs?model=gpt-4o");
```

✅ **Answer:** "The App Router uses folders for routes: `page.tsx` makes a route public, `layout.tsx` wraps its children and keeps its state across navigation, `[id]` is a dynamic segment, `(group)` organises without changing the URL, and `route.ts` defines API handlers. `<Link>` does client-side navigation with prefetching, and `useRouter`, `usePathname` and `useSearchParams` are for programmatic navigation in client components."

---

## 7. Data fetching and caching

```tsx
// Server Component — fetch directly
const res = await fetch("https://api.example.com/models", { next: { revalidate: 60 } }); // ISR-like: cache 60 s
const live = await fetch("https://api.example.com/usage", { cache: "no-store" });       // always fresh

// Parallel, not waterfall
const [models, usage] = await Promise.all([getModels(), getUsage()]);

// Server Action — mutation from a form, then refresh cached data
"use server";
import { revalidatePath } from "next/cache";
export async function createKey(formData: FormData) {
  await db.keys.create({ name: String(formData.get("name")) });
  revalidatePath("/settings/keys");
}
```

✅ **Answer:** "In Server Components I fetch with `async/await` directly, and I start independent requests together with `Promise.all` to avoid waterfalls. Since Next.js 15, `fetch` results aren't cached by default; I opt in with `next: { revalidate }` or, in Next.js 16, the `'use cache'` directive, and I invalidate with `revalidatePath`/`revalidateTag` after a mutation. Mutations can use Server Actions or Route Handlers. For live client-side data, like a dashboard that polls, I still use a client library like TanStack Query or SWR."

> Version note: caching defaults changed between Next 13/14 (fetch cached by default) and 15+ (not cached). Say "it depends on the version" and give the current behaviour.

---

## 8. Loading and error states

```tsx
// app/gateway/loading.tsx → shown instantly while page.tsx awaits data (streaming)
export default function Loading() {
  return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
}
```

```tsx
// app/gateway/error.tsx → must be a client component
"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert">
      <p>Couldn't load gateway metrics.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

```tsx
// app/gateway/page.tsx — granular streaming: each widget has its own boundary
import { Suspense } from "react";
export default function GatewayPage() {
  return (
    <>
      <Suspense fallback={<CardSkeleton />}><CostByModel /></Suspense>
      <Suspense fallback={<TableSkeleton />}><RecentLogs /></Suspense>
    </>
  );
}
```

✅ **Answer:** "`loading.tsx` wraps a route segment in Suspense, so the layout shows immediately with a skeleton while data loads, and the HTML streams in when ready. For finer control I put `<Suspense>` around each slow widget so a slow logs query doesn't block the cost cards. `error.tsx` is an error boundary for the segment with a `reset()` retry, and `not-found.tsx` handles `notFound()`."

---

## 9. Next.js performance optimization

| Area | What to do |
|---|---|
| Less client JS | keep components on the server; small `"use client"` leaves; `next/dynamic` for heavy client widgets (charts, editors) |
| Images | `next/image` — resizing, modern formats (WebP/AVIF), lazy by default, `sizes`, `priority` for the LCP image |
| Fonts | `next/font` — self-hosted, no layout shift |
| Scripts | `next/script` with `strategy="lazyOnload"` for analytics |
| Data | parallel fetches, caching/revalidation, streaming with Suspense |
| Navigation | `<Link>` prefetch |
| Measure | Lighthouse, Core Web Vitals (LCP, INP, CLS), `@next/bundle-analyzer` |

✅ **Answer:** "I start by sending less JavaScript: Server Components by default and `next/dynamic` for heavy client parts. Then images with `next/image` and the right `sizes`, fonts with `next/font` to avoid layout shift, third-party scripts loaded lazily, parallel and cached data fetching, and streaming with Suspense so the page isn't blocked by its slowest query. I measure with Lighthouse and the bundle analyzer before and after."

**Your real experience to mention:** the Denver Allergy Lighthouse work (lazy loading, image compression, code splitting, `font-display: swap`) and FirstBriq's bundle and caching commits — see [10](10-Project-and-HR-Questions.md#q-explain-a-challenging-frontend-problem).

---

## 10. Which rendering for a TrueFoundry-style dashboard?

**Question:** "If you built the TrueFoundry AI Gateway console in Next.js, which rendering would you use?"

✅ **Answer:** "It's an authenticated, per-user, constantly changing dashboard, so SEO doesn't matter. I'd render the shell — layout, sidebar, auth check — on the server for a fast first paint, and make data-heavy widgets client components that fetch through TanStack Query, so they can poll, refetch on focus and show their own loading and error states. Public pages like docs, pricing and the model catalog would be static or ISR. Charts and the log viewer would be loaded with `next/dynamic` so they don't bloat the first load."
