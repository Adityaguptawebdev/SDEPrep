# JS 2/2 — React (reported topics)

> React snippets use ```jsx and are illustrative (not executed here). Sources are in the [section README](README.md).

**Easy analogy — React = cricket scoreboard operator**: Tum sirf **score (state)** badalte ho; board (UI) khud update ho jaata hai. Poora board repaint nahi hota — sirf wahi digits jo badle (reconciliation).

## 1. Hooks, state, components (MEDIUM — [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/))

| Hook | What it does | Typical use |
|---|---|---|
| `useState` | local state; setting it re-renders the component | form fields, toggles |
| `useEffect` | side effects **after** render; cleanup on unmount / before re-run | API calls, subscriptions, timers |
| `useContext` | read a value from a Provider without prop drilling | theme, logged-in user |
| `useRef` | mutable value that doesn't re-render; DOM access | focus an input, keep a timer id |
| `useMemo` / `useCallback` | cache a computed value / a function between renders | expensive filters, stable callbacks for memoised children |
| `useReducer` | state updates via actions | complex state (cart, forms) |
| custom hooks | reuse stateful logic (`useFetch`, `useDebounce`) | shared API logic |

```jsx
import { useEffect, useState } from 'react';

function PaymentList({ merchantId, token }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();              // cancel if merchantId changes / unmount
    setLoading(true);
    fetch(`/api/v1/merchants/${merchantId}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(setPayments)
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();                       // cleanup
  }, [merchantId, token]);                                 // re-run only when these change

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">Could not load payments: {error}</p>;
  return <ul>{payments.map((p) => <li key={p.id}>{p.id}: ₹{p.amount}</li>)}</ul>;
}
```

**How `useState` works (asked)**: React keeps state per component instance **by call order** of hooks — that's why hooks can't be inside `if`/loops. `setX(v)` schedules a re-render; updates are batched; use `setX(prev => prev + 1)` when the new value depends on the old one.
**How `useEffect` works (asked)**: runs after the browser paints; the dependency array controls when it re-runs (`[]` = once on mount); the returned function cleans up. Common bugs: missing dependencies (stale values), fetching without abort (race conditions), infinite loops (setting state that's also a dependency).

## 2. Lifecycle methods ↔ hooks (asked to a 1-YOE selected candidate, [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/))

| Class component | Function component |
|---|---|
| `constructor` | `useState` initial value |
| `componentDidMount` | `useEffect(() => {…}, [])` |
| `componentDidUpdate` | `useEffect(() => {…}, [deps])` |
| `componentWillUnmount` | the cleanup function returned from `useEffect` |
| `shouldComponentUpdate` | `React.memo` |
| `componentDidCatch` / `getDerivedStateFromError` | still class-only → **error boundaries** |

## 3. Error handling in React (same report)

- **Error boundaries** catch errors thrown while **rendering** children and show a fallback UI (class component, or the `react-error-boundary` library).
- They do **not** catch errors in event handlers, async code (`fetch`), or timers → use `try/catch` there and keep an `error` state (as in §1).
- Also: a global handler for API errors (e.g. 401 → redirect to login), user-friendly messages, and logging to a monitoring tool.

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }   // switch to fallback UI
  componentDidCatch(error, info) { /* send to logging/monitoring */ }
  render() { return this.state.hasError ? <p>Something went wrong.</p> : this.props.children; }
}
// usage: <ErrorBoundary><PaymentList merchantId="m1" token={t} /></ErrorBoundary>
```

## 4. State management and Redux ([LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/))

- **Problem Redux solves**: many components far apart in the tree need the same data (user, cart) and updates must be **predictable** — prop drilling and scattered state get messy.
- **How**: one **store**; UI **dispatches actions**; pure **reducers** compute the next state; components **subscribe** to the slices they need (Redux Toolkit is the modern way).
- **When not**: small apps → `useState` + Context is enough; **server data** (API cache) → React Query / RTK Query rather than hand-written Redux.

## 5. Performance ([LC-6563900](https://leetcode.com/discuss/post/6563900/visa-frontend-interview-senior-by-anonym-slm8/), [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/))

1. **Measure first**: React DevTools Profiler, Lighthouse, Web Vitals.
2. Avoid unnecessary re-renders: `React.memo`, `useMemo`/`useCallback` (only where profiling shows a cost), keep state as low in the tree as possible, stable `key`s in lists.
3. Load less: code splitting (`React.lazy` + `Suspense`), lazy-load images, tree-shaking, smaller dependencies.
4. Big lists: virtualisation (render only visible rows).
5. Network: pagination, caching (React Query), debounced search, fewer/combined API calls.

**Say (with your numbers)**: "I reduced X by Y% by …" — [CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE].

## 6. Building a React project from scratch — bundlers, loaders, transpilers ([LC-6563900](https://leetcode.com/discuss/post/6563900/visa-frontend-interview-senior-by-anonym-slm8/))

- Start: Vite (or Next.js if you need SSR/routing out of the box); TypeScript; ESLint + Prettier; folder structure by feature; environment configs; testing (Jest/Vitest + React Testing Library); CI.
- **Bundler** (Webpack/Vite/Rollup): follows imports and produces optimised bundles.
- **Loaders** (Webpack): transform non-JS files during bundling — `babel-loader` (JSX/TS → JS), `css-loader`/`style-loader`, file/asset loaders.
- **Transpiler** (Babel, TypeScript `tsc`, SWC/esbuild): converts newer syntax/JSX/TS into JavaScript browsers understand.

## 7. Frontend security ([GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/))

- **XSS**: React escapes values by default — avoid `dangerouslySetInnerHTML` (sanitise with DOMPurify if unavoidable); add a Content-Security-Policy.
- **Tokens**: prefer httpOnly Secure SameSite cookies or in-memory access tokens; never put secrets/API keys in the bundle.
- **CSRF** protection when using cookies; HTTPS only; validate on the server (never trust client-side checks/prices); dependency audits.

**🗣️ Interview mein aise bolo**: "State badlo, UI khud update hota hai. Side effects `useEffect` mein, cleanup ke saath. Render errors ke liye error boundary, API errors ke liye try/catch + error state. Performance mein pehle profile, phir memo/code-splitting."

Back to [JS/React index](README.md) · Next: [10 — Project deep dive →](../10-project-deep-dive/README.md)
