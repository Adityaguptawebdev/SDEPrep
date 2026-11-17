# 04 — React.js Interview Questions

[← JS Coding](03-JavaScript-Coding-Questions.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: Machine Coding →](05-Machine-Coding-Problems.md)

All 🔮 **Predicted**. TrueFoundry's reported rounds are React **machine coding** ([01](01-Actual-Interview-Experiences.md)). These theory questions come up **while** you code ("why did you use a functional update here?"). Each answer links to the machine-coding problem where you will actually use it.

**Format:** Question · Priority · 🗣️ Hinglish · ✅ Interview answer · Code · Follow-ups · ⚠️ Mistakes.

## Contents

| # | Topic | Priority |
|---|---|---|
| 1 | [Virtual DOM](#1-virtual-dom) | High |
| 2 | [Reconciliation](#2-reconciliation) | High |
| 3 | [Component lifecycle](#3-component-lifecycle) | High |
| 4 | [Functional components](#4-functional-components) | Medium |
| 5 | [Props vs state](#5-props-vs-state) | High |
| 6 | [useState](#6-usestate) | Critical |
| 7 | [useEffect](#7-useeffect) | Critical |
| 8 | [useRef](#8-useref) | High |
| 9 | [useMemo](#9-usememo) | High |
| 10 | [useCallback](#10-usecallback) | High |
| 11 | [React.memo](#11-reactmemo) | High |
| 12 | [Controlled vs uncontrolled](#12-controlled-vs-uncontrolled-components) | High |
| 13 | [Keys](#13-keys) | Critical |
| 14 | [Conditional rendering](#14-conditional-rendering) | Medium |
| 15 | [Lifting state up](#15-lifting-state-up) | High |
| 16 | [Context API](#16-context-api) | High |
| 17 | [Zustand](#17-zustand) | High (you used it) |
| 18 | [Redux basics](#18-redux-basics) | Medium |
| 19 | [Why components re-render](#19-why-components-re-render) | Critical |
| 20 | [Preventing unnecessary re-renders](#20-preventing-unnecessary-re-renders) | High |
| 21 | [Custom hooks](#21-custom-hooks) | High |
| 22 | [Error boundaries](#22-error-boundaries) | Medium |
| 23 | [Lazy loading](#23-lazy-loading) | High |
| 24 | [Suspense](#24-suspense) | Medium |
| 25 | [API integration](#25-api-integration) | Critical |
| 26 | [Form handling](#26-form-handling) | High |
| 27 | [Component composition](#27-component-composition) | Medium |

---

## 1. Virtual DOM

🗣️ **Hinglish:** Real DOM ko baar-baar badalna mehenga hai — jaise har chhoti change ke liye **poora ghar repaint** karna. React pehle ek **blueprint (Virtual DOM)** par change karta hai, purane blueprint se compare karta hai, phir sirf **jo deewar badli wahi** paint karta hai.

✅ **Answer:** "The virtual DOM is a lightweight JavaScript object tree that describes the UI. When state changes, React renders a new tree, compares it with the previous one (diffing), and applies only the minimum changes to the real DOM in one batch. The main benefit isn't that it's 'faster than the DOM' — it's that we write declarative UI ('what it should look like') and React works out the efficient updates."

**Follow-ups:** Is the virtual DOM always faster? (No — it's an overhead that makes declarative code fast **enough**.) · What is Fiber? (React's reconciler that can split rendering into units, pause and prioritise work.)

---

## 2. Reconciliation

✅ **Answer:** "Reconciliation is how React decides what changed between two renders. A full tree diff would be O(n³), so React uses two heuristics to make it O(n): if the element **type** changes (`div` → `span`, or `ComponentA` → `ComponentB`), it destroys the old subtree and builds a new one, losing state; and for lists, it uses **keys** to match children between renders. Same type → it keeps the DOM node or component instance and just updates props."

```jsx
// Type changes → state of <Counter> is RESET when isAdmin toggles
{isAdmin ? <div><Counter /></div> : <section><Counter /></section>}

// Changing the key forces a fresh component (useful for "reset form on user change")
<ProfileForm key={userId} userId={userId} />
```

🗣️ **Hinglish:** React do cheezein dekhta hai — **type same hai?** aur **key same hai?** Dono same → purana component reuse, sirf props update. Type ya key badli → purana hatao, naya banao (state gayi).

**Follow-ups:** How do you reset a component's state? (Change its `key`.) · Render phase vs commit phase.

---

## 3. Component lifecycle

🗣️ **Hinglish:** Component ki zindagi: **paida hona (mount) → badalna (update) → jaana (unmount)**. Function components mein yeh sab `useEffect` se handle hota hai.

| Phase | Class | Hooks |
|---|---|---|
| Mount | `componentDidMount` | `useEffect(fn, [])` |
| Update | `componentDidUpdate` | `useEffect(fn, [deps])` |
| Unmount | `componentWillUnmount` | cleanup returned from `useEffect` |
| Error | `componentDidCatch` | no hook — needs a class [error boundary](#22-error-boundaries) |

```jsx
useEffect(() => {
  console.log("mounted / deps changed");
  return () => console.log("cleanup: before next run or on unmount");
}, [modelId]);
```

✅ **Answer:** "A component mounts, updates whenever its props, state or used context change, and unmounts. In function components, `useEffect` with an empty array runs after mount, with dependencies it runs after renders where they changed, and the returned cleanup runs before the next effect run and on unmount. In development, StrictMode mounts, unmounts and remounts once to help catch missing cleanups."

---

## 4. Functional components

✅ **Answer:** "A functional component is a plain function that takes props and returns JSX. With hooks it can have state, effects, refs and context, so it replaces class components. They're shorter, easier to test, have no `this` confusion, and logic can be shared via custom hooks instead of HOCs or render props. Classes are still needed only for error boundaries."

---

## 5. Props vs state

🗣️ **Hinglish:** **Props = parent ka diya hua order** (bachcha badal nahi sakta). **State = component ki apni diary** (khud update karta hai, aur update hone par re-render).

| | Props | State |
|---|---|---|
| Owner | parent | the component |
| Can the child change it? | ❌ read-only | ✅ via its setter |
| Change causes re-render | ✅ (parent re-rendered) | ✅ |
| Example | `size` passed to `<Board>` | `board` inside `TicTacToe` |

✅ **Answer:** "Props are inputs passed from the parent and are read-only inside the child. State is data owned by the component that changes over time, updated with its setter, which triggers a re-render. Data flows down through props and events flow up through callback props. If two components need the same data, the state lives in their common parent."

**Mistake:** copying props into state (`useState(props.value)`) — it won't update when the prop changes. Derive it instead.

---

## 6. useState

**Priority:** Critical (used in every machine-coding answer).

```jsx
const [count, setCount] = useState(0);
const [board, setBoard] = useState(() => Array(9).fill(null)); // lazy init: runs once

function addThree() {
  setCount(count + 1); setCount(count + 1); setCount(count + 1); // → +1 only (same stale count)
}
function addThreeCorrect() {
  setCount((c) => c + 1); setCount((c) => c + 1); setCount((c) => c + 1); // → +3
}

// Objects/arrays: create a NEW value
setUser((u) => ({ ...u, name: "Aditya" }));
setTodos((t) => t.filter((x) => x.id !== id));
```

🗣️ **Hinglish:** `setState` turant variable nahi badalta — **agle render** ke liye request daalta hai (batching). Pichhli value par depend ho to **functional update** `setX(prev => …)` use karo.

✅ **Answer:** "`useState` returns the current value and a setter. Calling the setter schedules a re-render; the variable doesn't change in the current render. React batches updates, so if the next value depends on the previous one, I use the functional form. State must be treated as immutable — create new objects or arrays — because React compares with `Object.is`. For expensive initial values I pass a function so it runs only once."

**Follow-ups:** `useState` vs `useReducer` (complex related updates → reducer) · automatic batching in React 18.
⚠️ **Mistakes:** `state.push(x); setState(state)`; reading state right after setting it.

---

## 7. useEffect

**Priority:** Critical (carousel timers, fetching, listeners).

🗣️ **Hinglish:** `useEffect` = **render ke baad ka side kaam** (API call, timer, listener). Dependency array batata hai **kab dobara chalana hai**, aur cleanup batata hai **jaate waqt kya band karna hai**.

```jsx
useEffect(() => { /* every render */ });
useEffect(() => { /* once after mount */ }, []);
useEffect(() => { /* when modelId changes */ }, [modelId]);

useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/models/${modelId}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setModel)
    .catch((e) => { if (e.name !== "AbortError") setError(e); });
  return () => controller.abort(); // cleanup
}, [modelId]);
```

✅ **Answer:** "`useEffect` runs side effects after React commits to the screen — fetching data, subscriptions, timers, DOM listeners. The dependency array controls when it re-runs, and every value from the component used inside should be listed. The cleanup function runs before the effect runs again and on unmount, which is where I clear timers, remove listeners and abort fetches. I avoid effects for things that can be calculated during render."

**Follow-ups:** `useEffect` vs `useLayoutEffect` (layout runs before paint — for measuring) · why the effect runs twice in dev (StrictMode) · infinite loops (setting state that is also a dependency; object deps recreated every render).
⚠️ **Mistakes:** missing dependencies → stale values; `async` function directly as the effect (it returns a promise, not a cleanup) — define an async function inside and call it.

---

## 8. useRef

```jsx
const inputRef = useRef(null);             // 1. DOM access
<input ref={inputRef} />; inputRef.current.focus();

const loadingRef = useRef(false);          // 2. mutable value, no re-render
const prevValue = useRef();                // 3. remember the previous value
useEffect(() => { prevValue.current = value; });
```

🗣️ **Hinglish:** `useRef` ek **jeb (pocket)** hai — usme kuch bhi rakh lo, badlo, **re-render nahi hoga**, aur value renders ke beech bachi rehti hai.

✅ **Answer:** "`useRef` returns an object whose `.current` persists across renders, and changing it doesn't cause a re-render. I use it for DOM nodes (focus, scroll, measuring), for timer ids, and for values that must be read synchronously — like a loading guard in infinite scroll, where state updates are too slow to block a second call."

Used in: [P3 thumbnails scrollIntoView](05-Machine-Coding-Problems.md#p3-image-carousel-with-thumbnails), [P9 loading guard](05-Machine-Coding-Problems.md#p9-infinite-scrolling).

---

## 9. useMemo

```jsx
const visibleRows = useMemo(
  () => rows.filter((r) => r.model.includes(query)).sort(byCost),
  [rows, query] // recompute only when these change
);
```

✅ **Answer:** "`useMemo` caches the **result** of a calculation between renders and recomputes only when its dependencies change. I use it for expensive derived data — like filtering and sorting thousands of rows — or to keep an object/array reference stable when it is passed to a memoized child or used as an effect dependency. I don't wrap cheap calculations, because memoization itself has a cost."

🗣️ **Hinglish:** Mehenga hisaab ek baar karo, **answer yaad rakho**; inputs badle tabhi dobara karo.

---

## 10. useCallback

```jsx
const handleSelect = useCallback((id) => setSelected(id), []); // same function every render
<ModelList onSelect={handleSelect} />   // ModelList is React.memo → won't re-render
```

✅ **Answer:** "`useCallback` caches a **function** reference between renders. `useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. It's useful only when the function's identity matters — passing it to a `React.memo` child, or using it in a dependency array of `useEffect`. On its own it doesn't make anything faster."

**Follow-up:** "Does React Compiler change this?" → React Compiler (stable in 2025) memoizes automatically, so manual `useMemo/useCallback` matters less in projects that use it — but you must still understand **why** they exist.

---

## 11. React.memo

```jsx
const Cell = React.memo(function Cell({ value, onClick }) {
  return <button onClick={onClick}>{value}</button>;
});
```

✅ **Answer:** "`React.memo` wraps a component so it skips re-rendering when its props are shallowly equal to the last render's props. It only helps if the parent passes stable props — so inline objects, arrays and arrow functions break it unless I use `useMemo`/`useCallback`. I use it for list items or heavy components that re-render often with the same props."

🗣️ **Hinglish:** `React.memo` = **gatekeeper**: "props wahi hain? to dobara render mat karo." But har render par naya function/object bhejoge to gatekeeper har baar maan lega ki kuch badla hai.

---

## 12. Controlled vs uncontrolled components

```jsx
// Controlled: React state is the source of truth
const [email, setEmail] = useState("");
const controlled = <input value={email} onChange={(e) => setEmail(e.target.value)} />;

// Uncontrolled: the DOM keeps the value; read it when needed
const fileRef = useRef(null);
const uncontrolled = (
  <>
    <input type="file" ref={fileRef} /> {/* file inputs are always uncontrolled */}
    <input defaultValue="gpt-4o" name="model" />
  </>
);
```

✅ **Answer:** "In a controlled input, the value comes from React state and every change goes through `onChange`, so I can validate, format and disable buttons instantly. In an uncontrolled input, the DOM holds the value and I read it with a ref or `FormData` on submit — less code and fewer re-renders, good for simple forms and required for file inputs. Libraries like React Hook Form use uncontrolled inputs for performance."

⚠️ **Mistake:** switching `value` from `undefined` to a string → React warns "changing an uncontrolled input to be controlled". Initialise with `""`.

---

## 13. Keys

**Priority:** Critical.

🗣️ **Hinglish:** Key = har list item ka **Aadhaar number**. React isse pehchanta hai kaunsa item kaunsa hai. Index ko key banaoge aur list re-order/delete hogi to React **galat item ki state galat jagah** chipka dega.

```jsx
{todos.map((t) => <TodoItem key={t.id} todo={t} />)}   // ✅ stable unique id
{todos.map((t, i) => <TodoItem key={i} todo={t} />)}   // ⚠️ breaks on insert/delete/sort
```

✅ **Answer:** "Keys tell React which list item is which between renders, so it can reuse, move or remove the right DOM nodes and keep each item's state. A key must be stable and unique among siblings — usually an id from the data. Using the array index is fine only for static lists that never reorder; otherwise, inputs and component state get attached to the wrong item. Keys aren't passed as props."

**Follow-up:** Why is index OK in [Tic-Tac-Toe cells](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe)? (Cells never reorder; the position *is* the identity.)

---

## 14. Conditional rendering

```jsx
{isLoading ? <Spinner /> : <Table rows={rows} />}
{error && <ErrorBanner message={error} />}
{rows.length > 0 && <Table rows={rows} />}   // ✅
{rows.length && <Table rows={rows} />}       // ❌ renders "0" when empty

if (status === "error") return <ErrorState onRetry={refetch} />;  // early return
```

✅ **Answer:** "I use the ternary for either/or, `&&` for show/hide, and early returns for loading, error and empty states. With `&&` the left side must be a boolean — `0 && <X/>` renders `0`. For many states I use an object map or a `status` variable (`idle | loading | success | error`) instead of several booleans that can contradict each other."

---

## 15. Lifting state up

🗣️ **Hinglish:** Do bhai ek hi TV remote chahte hain → remote **papa (common parent)** ke paas rakho, dono ko props se do.

```jsx
function Dashboard() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o"); // lifted
  return (
    <>
      <ModelPicker value={selectedModel} onChange={setSelectedModel} />
      <UsageChart model={selectedModel} />
    </>
  );
}
```

✅ **Answer:** "When two siblings need the same changing data, I move the state to their closest common parent and pass it down as props, with a callback to update it. That keeps a single source of truth. If lifting goes many levels up and causes prop drilling, I consider Context or a store like Zustand."

---

## 16. Context API

```jsx
const ThemeContext = createContext({ theme: "light", toggle: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
const useTheme = () => useContext(ThemeContext);
```

✅ **Answer:** "Context passes data through the tree without prop drilling — good for things that change rarely and are needed widely: theme, current user, locale, feature flags. Its downside: every component that reads the context re-renders when the value changes, and there's no selector. So I memoize the value, split contexts by concern, and use Zustand or Redux for frequently changing global state."

🗣️ **Hinglish:** Context = **building ka loudspeaker** — announcement sabko sunai deta hai. Isliye rarely-changing cheezon ke liye theek hai; har second badalne wala data loudspeaker pe mat daalo.

---

## 17. Zustand

**Priority:** High — your [AlgoTaskFlow project](10-Project-and-HR-Questions.md#algotaskflow) uses Zustand for light/dark theming; the resume also mentions "optimized state management".

```jsx
import { create } from "zustand";

export const useGatewayStore = create((set) => ({
  selectedModels: [],
  theme: "light",
  toggleModel: (id) =>
    set((s) => ({
      selectedModels: s.selectedModels.includes(id)
        ? s.selectedModels.filter((m) => m !== id)
        : [...s.selectedModels, id],
    })),
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));

// Selector: this component re-renders ONLY when theme changes
const theme = useGatewayStore((s) => s.theme);
```

✅ **Answer:** "Zustand is a small global store built on hooks. I create a store with state and actions, and components subscribe with a selector, so they re-render only when the slice they selected changes — unlike Context. There's no provider, no reducers or action types, and it works outside React too. I use it for client UI state like theme, filters and the current selection, and keep server data in a fetching layer such as React Query."

**Follow-ups:** Zustand vs Context vs Redux (below) · `persist` middleware for localStorage · selecting several values (`useShallow`) to avoid re-renders.

| | Context | Zustand | Redux Toolkit |
|---|---|---|---|
| Boilerplate | low | very low | medium |
| Re-render control | whole consumer | selector-based | selector-based |
| DevTools / middleware | ❌ | ✅ (devtools, persist) | ✅ best |
| Best for | theme, auth, locale | most app UI state | large teams, complex flows |

---

## 18. Redux basics

```
 UI ──dispatch(action)──► reducer(state, action) ──► new state ──► store ──► subscribed UI re-renders
```

✅ **Answer:** "Redux keeps app state in one store. Components dispatch actions — plain objects describing what happened — and pure reducer functions return the next state. Components read with `useSelector`. Redux Toolkit is the standard way now: `createSlice` generates actions and reducers and lets you write 'mutating' code safely using Immer; RTK Query handles API caching. It's predictable and has great DevTools, but it's more setup than Zustand."

---

## 19. Why components re-render

**Priority:** Critical.

A component re-renders when:
1. Its **state** changes (setter called with a new value).
2. Its **parent re-renders** (even if props didn't change!) — unless it's memoized.
3. A **context** it reads changes.
4. A store it subscribes to (Zustand/Redux selector) returns a new value.

```
 App (state changes)
  ├─ Header        ← re-renders (child of App)
  └─ Dashboard     ← re-renders
       └─ Chart    ← re-renders even though its props are identical
```

✅ **Answer:** "A component re-renders when its state changes, when its parent re-renders, or when a context or store value it uses changes. Props changing is not the trigger by itself — it's the parent re-rendering. A re-render isn't a DOM update; React diffs and may change nothing. It only becomes a problem when renders are expensive or very frequent, which I check with the React DevTools Profiler before optimising."

---

## 20. Preventing unnecessary re-renders

| Technique | When |
|---|---|
| Keep state **close** to where it's used (move it down) | a typing input's state shouldn't live in `App` |
| Pass components as `children` (composition) | children created by the parent don't re-render with the wrapper's state |
| `React.memo` + stable props (`useCallback`, `useMemo`) | heavy list items |
| Split Context; memoize its value | wide context consumers |
| Zustand/Redux **selectors** | global state |
| Virtualize long lists | 1000+ rows ([08](08-Frontend-Performance-and-Architecture.md#3-virtualization)) |
| Debounce input-driven work; `useDeferredValue` / `useTransition` | search filtering big lists |

✅ **Answer:** "First I measure with the Profiler. Then the cheapest fixes: move state down so fewer components depend on it, or lift the expensive part out and pass it as children. Then memoize: `React.memo` on the heavy child with stable callbacks and memoized objects. For global state I use selectors. For long lists I virtualize. And for typing lag I use `useDeferredValue` so the input stays responsive."

---

## 21. Custom hooks

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => { if (error.name !== "AbortError") setState({ data: null, error, loading: false }); });
    return () => controller.abort();
  }, [url]);
  return state;
}
// const { data, error, loading } = useFetch(`/api/usage?model=${model}`);
```

✅ **Answer:** "A custom hook is a function starting with `use` that calls other hooks, so I can reuse **stateful logic** — not UI — across components. Each component that calls it gets its own state. Examples I'd write: `useDebounce`, `useFetch`, `useClickOutside`, `useLocalStorage`, `useInterval`. They make components shorter and the logic testable."

See [shared hooks in 05](05-Machine-Coding-Problems.md#shared-hooks). Rules of hooks: call them at the top level, only from components or other hooks — never in conditions or loops.

---

## 22. Error boundaries

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { reportError(error, info.componentStack); } // e.g. Sentry
  render() {
    return this.state.hasError ? this.props.fallback ?? <p>Something went wrong.</p> : this.props.children;
  }
}
// <ErrorBoundary fallback={<WidgetError />}><CostChart /></ErrorBoundary>
```

✅ **Answer:** "An error boundary is a class component that catches errors thrown while rendering its children and shows a fallback instead of unmounting the whole app. It does **not** catch errors in event handlers, async code or effects' promises — those need try/catch and error state. I wrap independent widgets separately, so one broken chart doesn't blank the dashboard, and report the error to a monitoring tool in `componentDidCatch`."

**Real example from your work:** at FirstBriq you changed the `ErrorBoundary` to load Sentry **on demand** inside `componentDidCatch`, which removed Sentry from the entry bundle ([10 → FirstBriq](10-Project-and-HR-Questions.md#firstbriq)).

---

## 23. Lazy loading

```jsx
import { lazy, Suspense } from "react";
const LogsPage = lazy(() => import("./pages/LogsPage")); // separate chunk

<Suspense fallback={<PageSkeleton />}>
  <LogsPage />
</Suspense>
```

✅ **Answer:** "Lazy loading means downloading code or assets only when they're needed. `React.lazy` with a dynamic `import()` splits a component into its own chunk, and `Suspense` shows a fallback while it loads. I usually split by route and for heavy, rarely-used parts — charts, editors, modals. For images I use `loading="lazy"` or an IntersectionObserver."

---

## 24. Suspense

✅ **Answer:** "Suspense lets a component 'wait' for something — a lazy chunk or data from a Suspense-enabled source — while React shows the nearest fallback. It makes loading states declarative and lets me place boundaries at the right level, for example one skeleton per dashboard widget. In Next.js App Router, `loading.tsx` is a Suspense boundary for a route, and streaming SSR sends each boundary's HTML as it becomes ready."

---

## 25. API integration

**Priority:** Critical (TrueFoundry dashboards are API-driven).

```jsx
// api.js — one place for base URL, auth header, errors
const BASE = import.meta.env.VITE_API_URL;
export async function api(path, { signal, ...opts } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, ...opts.headers },
  });
  if (res.status === 401) { onUnauthorized(); throw new Error("Session expired"); }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || `HTTP ${res.status}`);
  return res.status === 204 ? null : res.json();
}
```

✅ **Answer:** "I keep API calls in one client module that sets the base URL, auth header and JSON handling, and turns non-2xx responses into errors. Components call it through a hook, and every call has **loading, error, empty and success** states in the UI. I abort requests on unmount or when inputs change, handle 401 globally by logging out or refreshing the token, and for server data in bigger apps I use TanStack Query for caching, retries and refetching."

**Your real example:** AlgoTaskFlow has **global 401 session handling**; at RagaAI you built loading / success / error states for the fax list and the summary cards ([10](10-Project-and-HR-Questions.md)).

---

## 26. Form handling

```jsx
function CreateKeyForm({ onCreate }) {
  const [values, setValues] = useState({ name: "", limit: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Name is required";
    if (v.limit && (!Number.isInteger(+v.limit) || +v.limit <= 0)) e.limit = "Enter a positive whole number";
    return e;
  };
  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try { await onCreate(values); setValues({ name: "", limit: "" }); }
    catch (err) { setErrors({ form: err.message }); }
    finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <input name="name" value={values.name} onChange={onChange} aria-invalid={!!errors.name} aria-describedby="name-err" />
      {errors.name && <p id="name-err" role="alert">{errors.name}</p>}
      <input name="limit" value={values.limit} onChange={onChange} inputMode="numeric" />
      {errors.limit && <p role="alert">{errors.limit}</p>}
      {errors.form && <p role="alert">{errors.form}</p>}
      <button disabled={submitting}>{submitting ? "Creating…" : "Create key"}</button>
    </form>
  );
}
```

✅ **Answer:** "For forms I keep values in one state object with a generic `onChange` using the input's `name`. I validate on submit (and on blur for better UX), show errors next to fields with `aria-invalid`, disable the submit button while submitting to avoid double posts, and show server errors too. For big forms I use React Hook Form with a Zod schema, which also gives types in TypeScript."

**Your real example:** the RagaAI Support Ticket dialog — title (max 255), description (max 5000), priority toggle and an image upload with type and 10 MB limits ([10](10-Project-and-HR-Questions.md#ragaai)).

---

## 27. Component composition

```jsx
function Card({ title, actions, children }) {
  return (
    <section className="rounded-xl border p-4">
      <header className="flex justify-between"><h3>{title}</h3>{actions}</header>
      {children}
    </section>
  );
}
<Card title="Cost by model" actions={<button>Export</button>}>
  <CostChart />
</Card>
```

🗣️ **Hinglish:** Ek bada "sab kuch" component banane ki jagah **LEGO blocks** banao — `Card` ko pata nahi andar chart hai ya table; jo `children` mein do, woh dikha dega.

✅ **Answer:** "Composition means building UIs by combining small components and passing content through `children` or named slot props, instead of adding more and more boolean props or using inheritance. It makes components reusable — the same `Card`, `Modal` or `Table` works across pages — and it can even avoid re-renders, because children created by the parent aren't re-rendered when the wrapper's own state changes. Compound components (`<Tabs><Tabs.List/>…`) are a more advanced form."
