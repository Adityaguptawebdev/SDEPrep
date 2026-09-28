# Frontend Machine Coding

## Purpose

This folder is one React + Vite project with **20 frontend machine-coding problems** for React interview preparation.

Every problem is a small component written the way you can realistically write it in a 45–60 minute interview:

- only `useState`, `useEffect`, `useRef`, props and plain event handlers
- array methods (`map`, `filter`, `find`, `reduce`, `slice`, `sort`) for all list logic
- plain CSS, no UI library, no Redux / React Query / router

This is for **learning and practice**, not production.

## How to run

```bash
cd Frontend-Machine-Coding
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The dashboard lists all 20 problems; click one to open it, and use **← Back to Problems** to return.

## How every component is written

Every component follows the same flow: **STATE → EVENT → LOGIC → UI**.

```
        user types / clicks
               │
               ▼
   ┌───────────────────────┐
   │   EVENT HANDLER       │   addTodo(), deleteTodo() ...
   │   calls setState(new) │
   └───────────┬───────────┘
               ▼
   ┌───────────────────────┐
   │   STATE (useState)    │   todos, input ...
   └───────────┬───────────┘
               │  React re-renders the component
               ▼
   ┌───────────────────────┐
   │   LOGIC (derived)     │   completedCount = todos.filter(...).length
   └───────────┬───────────┘
               ▼
   ┌───────────────────────┐
   │   UI (JSX)            │   todos.map(todo => <li>...</li>)
   └───────────────────────┘
```

And every `.jsx` file has the same order, so you always know where to look:

1. `// Concepts:` comment at the top
2. **State** — every `useState`
3. **Event handlers** — one small function per user action
4. **Main logic** — values calculated from state (not stored in state), effects, and helpers like `validate()`
5. **JSX** — the UI
6. **CSS** — a separate file; class names start with the component name (`todo-…`, `calc-…`) because Vite CSS is global

> Handlers sometimes call a function written further down, like `calculate()` or `validate()`. That is fine: a handler only runs later (on a click), after the whole component function has already run.

## How to practice

1. Read the component once, top to bottom.
2. Close the file. Write down: *What state do I need? What events are there?*
3. Rebuild it from scratch in a blank file with a 30–45 minute timer.
4. Compare with the solution and answer the interview questions out loud.

## Project structure

```
Frontend-Machine-Coding/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx             ← mounts <App /> into #root
    ├── App.jsx              ← dashboard + "Back to Problems" (no router)
    ├── App.css              ← global styles (body, buttons, inputs, .primary-button, dashboard)
    └── components/
        ├── 01-Todo-App/            TodoApp.jsx + TodoApp.css
        ├── 02-Calculator/          Calculator.jsx + Calculator.css
        ├── ...
        ├── 09-Image-Carousel/      ImageCarousel.jsx + .css + images/ (4 local SVGs)
        ├── ...
        └── 20-Shopping-Cart/       ShoppingCart.jsx + ShoppingCart.css
```

**How the dashboard works (no React Router):** `App.jsx` keeps `const [selectedComponent, setSelectedComponent] = useState(null)`, which stores the **id** of the open problem (`null` = dashboard). `problems.find(...)` gets that problem and renders its component. We store the id, not the component itself, because `setState(SomeFunction)` would *call* the function as an updater.

## Problems

| # | Problem | Key idea |
|---|---------|----------|
| 1 | [Todo App](#1-todo-app) | add / edit / toggle / delete with spread, `map`, `filter` |
| 2 | [Calculator](#2-calculator) | 4 pieces of state + `switch`, no `eval` |
| 3 | [Counter](#3-counter) | functional update `prev => prev + 1` |
| 4 | [Modal / Popup](#4-modal--popup) | `isOpen &&`, `stopPropagation`, Escape key effect |
| 5 | [Accordion](#5-accordion) | one `openId`, toggle with `? null : id` |
| 6 | [Search & Filter](#6-search--filter) | derived `filter` + `includes`, case-insensitive |
| 7 | [Pagination](#7-pagination) | `Math.ceil` + `slice(start, end)` |
| 8 | [Infinite Scroll](#8-infinite-scroll) | scroll maths + `useRef` guard |
| 9 | [Image Carousel](#9-image-carousel) | modulo `%` wrap-around |
| 10 | [Drag & Drop](#10-drag--drop) | native drag events, `preventDefault` in `dragover` |
| 11 | [Form Validation](#11-form-validation) | one `handleChange`, `validate()` returns errors |
| 12 | [Multi-Step Form](#12-multi-step-form) | `step` number + per-step validation |
| 13 | [File Upload](#13-file-upload) | File API + `createObjectURL` / revoke |
| 14 | [Auto-Complete](#14-auto-complete) | `startsWith`, `onMouseDown` vs blur |
| 15 | [Dynamic Form Fields](#15-dynamic-form-fields) | array of `{ id, value }`, stable keys |
| 16 | [Star Rating](#16-star-rating) | `hover \|\| rating` preview |
| 17 | [Progress Bar](#17-progress-bar--loading) | clamping + timer effect with cleanup + spinner |
| 18 | [Tabs](#18-tabs) | `activeTab` id + `find` |
| 19 | [Data Table](#19-data-table) | filter → copy → `sort` with a compare function |
| 20 | [Shopping Cart](#20-shopping-cart) | `find` / `map` / `filter` / `reduce` together |

### Where each concept is practised

| Concept | Problems |
|---------|----------|
| `useState` | all |
| Controlled inputs | 1, 6, 11, 12, 14, 15, 19 |
| `map()` to render lists | almost all (1, 2, 5–10, 12, 14–16, 18–20) |
| `filter()` | 1, 6, 10, 14, 15, 19, 20, App |
| `find()` | 18, 20, App |
| `reduce()` | 20 |
| `slice()` | 7, 14 |
| `sort()` with a compare function | 19 |
| Functional update `prev => …` | 3, 8 |
| `useEffect` + cleanup | 4 (event listener), 13 (object URL), 17 (timer) |
| `useRef` | 8 |
| Derived values instead of extra state | 1, 6, 7, 8, 19, 20 |
| Form `onSubmit` + `preventDefault` | 1, 11, 12, 15 |
| Event bubbling / `stopPropagation` | 4 |
| Regex validation | 11, 12 |
| Browser APIs | 8 (scroll), 10 (drag and drop), 13 (File API) |

---

## Basic UI Components

### 1. Todo App

📁 [`src/components/01-Todo-App/TodoApp.jsx`](src/components/01-Todo-App/TodoApp.jsx)

**What it does:** Add, edit, delete and complete/un-complete todos. Shows an empty message and an "X of Y completed" count.

**Concepts:** useState · controlled inputs · map() · filter() · event handling (form `onSubmit`, `onClick`, `onChange`) · conditional rendering (`? :` and `&&`)

**State:**

```js
const [todos, setTodos] = useState([]);           // [{ id, text, completed }]
const [input, setInput] = useState("");           // "add" input
const [editingId, setEditingId] = useState(null); // which todo is being edited
const [editText, setEditText] = useState("");     // "edit" input
```

**Important logic:**

```js
// Add    → new array with one more item
setTodos([...todos, { id: Date.now(), text, completed: false }]);

// Delete → keep everything except this id
setTodos(todos.filter((todo) => todo.id !== id));

// Toggle → copy the matching todo with completed flipped
setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));

// Edit   → same map() pattern, but change `text`
setTodos(todos.map((todo) => todo.id === editingId ? { ...todo, text } : todo));

// Derived value, not state
const completedCount = todos.filter((todo) => todo.completed).length;
```

- Add and Edit are `<form onSubmit>`, so the **Enter key works for free**. `e.preventDefault()` stops the page reload.
- Empty or space-only text is ignored with `.trim()`.
- The row shows **either** the edit form **or** the normal view: `editingId === todo.id ? <form/> : <>...</>`.

**Interview questions:**

- **Why do we use `map()` to render the list?** — `map()` turns each todo object into a `<li>` element and returns a new array of elements, which JSX can render directly.
- **Why is a unique `key` required? Why not use the index?** — React uses `key` to match old and new list items between renders. If you use the index and delete or reorder items, the keys move to different todos, so React can reuse the wrong DOM node or child state (for example an input's focus or text). A stable id avoids that.
- **Why `filter()` for delete instead of `splice()`?** — `filter()` returns a **new** array. `splice()` changes the old array in place, which is mutation.
- **Why should we not mutate state directly (`todos.push(x)` or `todo.completed = true`)?** — React checks whether state changed by comparing references. If you mutate and pass the same array, React may not re-render, and old values stored elsewhere change without you noticing. Always create a new array or object (`[...todos]`, `{ ...todo }`).
- **What is a controlled input?** — An input whose `value` comes from React state and which updates that state in `onChange`. React state is the single source of truth.
- **Why `type="button"` on the Cancel button?** — A `<button>` inside a `<form>` is `type="submit"` by default, so without it, Cancel would also submit (save) the edit.
- **Follow-up: how would you save todos after a page refresh?** — Store them in `localStorage` inside a `useEffect` that runs when `todos` changes, and read them back as the initial value: `useState(() => JSON.parse(localStorage.getItem("todos")) || [])`.
- **Follow-up: when do you need `setTodos((prev) => ...)`?** — When the next state depends on the previous one and several updates can happen before the next render (for example two updates in one handler, or inside `setTimeout`). The functional form always gets the latest value.

---

### 2. Calculator

📁 [`src/components/02-Calculator/Calculator.jsx`](src/components/02-Calculator/Calculator.jsx)

**What it does:** Digit buttons, `+ − × ÷`, `=` and `C`. The top line shows the expression (`12 + 3 =`), the big line shows the number being typed or the answer. Handles decimals, divide by zero (`Error`), continuing from an answer, and chaining (`2 + 3 ×` → `5 ×`).

**Concepts:** useState · event handling · `switch` · string → number (`Number()`) · derived display values · conditional rendering

**State:**

```js
const [previousValue, setPreviousValue] = useState(""); // "12"
const [operator, setOperator] = useState("");           // "+"
const [currentValue, setCurrentValue] = useState("");   // "3"
const [result, setResult] = useState("");               // "15" after "=" ("" = not calculated)
```

**Important logic:**

```js
// One click handler decides what kind of button was pressed
if (value === "=") handleEquals();
else if (OPERATORS.includes(value)) handleOperator(value);
else handleDigit(value);

// The maths
switch (op) {
  case "+": answer = x + y; break;
  case "−": answer = x - y; break;
  case "×": answer = x * y; break;
  case "÷": if (y === 0) return "Error"; answer = x / y; break;
}
return String(parseFloat(answer.toFixed(10))); // 0.1 + 0.2 → "0.3"
```

- Numbers are kept as **strings** while typing and turned into numbers with `Number()` only to calculate.
- Typing rules in `handleDigit`: only one `.`, no leading zeros (`05` → `5`), `.` alone becomes `0.`.
- After `=`: a digit starts a new calculation, an operator continues from the answer.
- Pressing an operator when a second number already exists calculates first, so `2 + 3 × 4 =` is `20` (left to right, like a basic pocket calculator).

**Interview questions:**

- **Why not just use `eval()`?** — `eval` runs any string as JavaScript. That is a security risk (code injection) if the text can come from a user, and it throws on half-typed input like `"5+"`. A `switch` only allows the 4 operations we support.
- **Why keep numbers as strings while typing?** — To keep exactly what the user typed, like `"0."` or `"2.50"`. `Number("0.")` is `0`, so the dot would disappear.
- **How do you stop `1.2.3`?** — `if (digit === "." && value.includes(".")) return;`
- **Why is `0.1 + 0.2` not `0.3`?** — Numbers are stored in binary floating point, where 0.1 cannot be stored exactly. Round for display: `toFixed(10)` then `parseFloat` to drop trailing zeros.
- **How would you support operator precedence (`2 + 3 × 4 = 14`)?** — Keep a list of numbers and operators; do `×`/`÷` in a first pass and `+`/`−` in a second (or use the shunting-yard algorithm).
- **Follow-up: keyboard support?** — A `keydown` listener in `useEffect` (with cleanup) that maps keys like `"7"`, `"+"`, `"Enter"` to `handleButtonClick`.

---

### 3. Counter

📁 [`src/components/03-Counter/Counter.jsx`](src/components/03-Counter/Counter.jsx)

**What it does:** Increment, decrement and reset a number. Negative numbers turn red; Reset is disabled at 0.

**Concepts:** useState · functional state update · event handling

**State:**

```js
const [count, setCount] = useState(0);
```

**Important logic:**

```js
setCount((prev) => prev + 1); // increment
setCount((prev) => prev - 1); // decrement
setCount(0);                  // reset
```

**Interview questions:**

- **`setCount(count + 1)` vs `setCount((prev) => prev + 1)`?** — The first uses `count` from the current render. The second receives the latest value from React. They give different results when several updates happen before a re-render.
- **If you call `setCount(count + 1)` three times in one click, what happens?** — The count goes up by **1**, because all three read the same `count` from this render. With `prev => prev + 1` three times, it goes up by 3.
- **Is a state update synchronous?** — No. React schedules a re-render. The `count` variable in the current render never changes; you see the new value in the next render.
- **Follow-up: stop at 0, or add a step?** — `setCount((prev) => Math.max(prev - 1, 0))`; keep a `step` state from an input and use `prev + step`.

---

### 4. Modal / Popup

📁 [`src/components/04-Modal/Modal.jsx`](src/components/04-Modal/Modal.jsx)

**What it does:** A button opens a modal on top of a dark overlay. It closes with ×, the Close button, a click on the overlay, or the Escape key. Clicking inside the box does not close it.

**Concepts:** useState (boolean) · conditional rendering with `&&` · event bubbling + `stopPropagation()` · `useEffect` with cleanup

**State:**

```js
const [isOpen, setIsOpen] = useState(false);
```

**Important logic:**

```jsx
{isOpen && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>…</div>
  </div>
)}
```

```js
useEffect(() => {
  if (!isOpen) return;                         // only listen while open
  function handleKeyDown(e) { if (e.key === "Escape") setIsOpen(false); }
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown); // cleanup
}, [isOpen]);
```

- The overlay is `position: fixed; inset: 0;`, so it covers the whole screen.

**Interview questions:**

- **Why is `stopPropagation()` needed?** — Clicks bubble up from child to parent. Without it, a click inside the box also reaches the overlay's `onClick` and closes the modal. Another way: in the overlay handler, `if (e.target === e.currentTarget) closeModal();`.
- **Why does the Escape listener need a cleanup?** — Without it, every time the modal opens another listener is added and never removed (a memory leak, and old handlers keep running). The function returned from `useEffect` removes it.
- **Why `[isOpen]` as the dependency?** — The effect re-runs when `isOpen` changes: it adds the listener when the modal opens, and the cleanup removes it when it closes.
- **What is `createPortal` and why do real modals use it?** — It renders the modal into `document.body` instead of inside the parent, so the parent's CSS (`overflow: hidden`, `z-index`, `transform`) cannot clip or hide it.
- **What does an accessible modal need?** — `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title; move focus into the modal, keep Tab inside it, and return focus to the Open button when it closes.

---

### 5. Accordion

📁 [`src/components/05-Accordion/Accordion.jsx`](src/components/05-Accordion/Accordion.jsx)

**What it does:** A list of React questions. Click a question to open its answer, click again to close it. Only one answer is open at a time.

**Concepts:** useState · map() · conditional rendering · toggle logic

**State:**

```js
const [openId, setOpenId] = useState(null); // null = all closed
```

**Important logic:**

```js
setOpenId(openId === id ? null : id);   // same item → close, other item → open that one

const isOpen = openId === item.id;       // inside map()
{isOpen && <p className="accordion-answer">{item.answer}</p>}
```

- The question is a `<button>` with `aria-expanded={isOpen}`.

**Interview questions:**

- **How would you allow several items open at once?** — Store an array of ids: `openIds.includes(id) ? openIds.filter((x) => x !== id) : [...openIds, id]`.
- **Why one `openId` instead of an `isOpen` flag on every item?** — One source of truth. "Only one open" is guaranteed automatically, and the question data stays separate from UI state.
- **Why is the question a `<button>`?** — It gets keyboard focus and Enter/Space for free, and screen readers announce it as clickable. `aria-expanded` tells them whether it is open.
- **How would you animate it?** — Keep the answer in the DOM and animate its height (`max-height` or `grid-template-rows`) with a CSS transition, instead of adding/removing it.

---

## Interactive Features

### 6. Search / Filter

📁 [`src/components/06-Search-Filter/SearchFilter.jsx`](src/components/06-Search-Filter/SearchFilter.jsx)

**What it does:** A list of 21 fruits and a search box. The list filters while you type (case-insensitive, extra spaces ignored), shows "Showing X of 21", a Clear button, and a "No fruits match" message.

**Concepts:** controlled input · filter() · `toLowerCase()` + `includes()` · derived state · empty state

**State:**

```js
const [query, setQuery] = useState("");
```

**Important logic:**

```js
const searchText = query.trim().toLowerCase();
const filteredFruits = fruits.filter((fruit) => fruit.toLowerCase().includes(searchText));
```

- `filteredFruits` is **calculated on every render**, not stored in state.
- An empty search matches everything, because every string includes `""`.

**Interview questions:**

- **Why should `filteredFruits` not be its own `useState`?** — It can always be calculated from `fruits` + `query`. A second copy in state can get out of sync (e.g. the list changes but nobody re-filters). Derive it during render.
- **Why lower-case both sides?** — `includes()` is case-sensitive. Lower-casing both makes `"AP"` match `"Apple"`.
- **What is debouncing, and when would you use it here?** — Waiting until the user stops typing (e.g. 300 ms) before doing expensive work such as an API call: a `setTimeout` in `useEffect`, cleared in the cleanup when `query` changes.
- **How would you highlight the matching part?** — Find the match index, split the string into before / match / after, and wrap the match in `<mark>`.
- **How would this change with API data?** — Fetch in `useEffect` when the (debounced) query changes, keep `loading` and `error` state, and ignore responses from older requests.

---

### 7. Pagination

📁 [`src/components/07-Pagination/Pagination.jsx`](src/components/07-Pagination/Pagination.jsx)

**What it does:** 23 items, 5 per page. Previous / Next buttons and page numbers 1–5, the current page is highlighted, Previous is disabled on page 1 and Next on page 5. Shows "Showing 11–15 of 23 · Page 3 of 5".

**Concepts:** useState · slice() · `Math.ceil()` · `Array.from()` · disabled buttons

**State:**

```js
const [currentPage, setCurrentPage] = useState(1);
```

**Important logic:**

```js
const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);   // ceil(23 / 5) = ceil(4.6) = 5
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;          // page 3 → 10
const endIndex = startIndex + ITEMS_PER_PAGE;                   // 15
const currentItems = items.slice(startIndex, endIndex);         // index 10..14 = Item 11..15
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
```

```
index:   0 … 4 │ 5 … 9 │ 10 … 14 │ 15 … 19 │ 20 21 22
page:      1   │   2   │    3    │    4    │    5      (only 3 items)
```

**Interview questions:**

- **Walk through page 3.** — `startIndex = (3 − 1) × 5 = 10`, `slice(10, 15)` returns indexes 10–14 (the end index is not included), which are Item 11 to Item 15.
- **Why `Math.ceil` and not `Math.floor`?** — 23 / 5 = 4.6. A half-full page is still a page, so round up to 5. `floor` would give 4 and lose the last 3 items.
- **Why is `currentPage` the only state?** — `totalPages`, `startIndex` and `currentItems` are all calculated from it.
- **Client-side vs server-side pagination?** — Client-side: all data is already loaded; slice it in the browser (fine for small lists). Server-side: ask the API for one page (`?page=3&limit=5`) and it also returns the total count (needed for large data).
- **How would you show 100 pages?** — Show the first page, the last page, the current page ± 1, and `…` for the gaps.

---

### 8. Infinite Scroll

📁 [`src/components/08-Infinite-Scroll/InfiniteScroll.jsx`](src/components/08-Infinite-Scroll/InfiniteScroll.jsx)

**What it does:** A scrollable box shows 10 items. Near the bottom it loads 10 more from a fake API (800 ms delay) and shows "Loading more…", until all 50 are loaded ("You have seen all 50 items"). It never starts a second request while one is running.

**Concepts:** useState · useRef · `onScroll` (`scrollTop`, `clientHeight`, `scrollHeight`) · async/await · loading guard · functional update

**State:**

```js
const [items, setItems] = useState(firstItems);
const [isLoading, setIsLoading] = useState(false); // for the "Loading more…" text
const isLoadingRef = useRef(false);                // the guard against duplicate requests
const hasMore = items.length < TOTAL_ITEMS;        // derived, not state
```

**Important logic:**

```js
// Near the bottom?
box.scrollTop + box.clientHeight >= box.scrollHeight - 50

async function loadMore() {
  if (isLoadingRef.current || !hasMore) return;   // guard
  isLoadingRef.current = true;
  setIsLoading(true);
  const newItems = await fetchItems(items.length);
  setItems((prev) => [...prev, ...newItems]);     // append to the LATEST list
  setIsLoading(false);
  isLoadingRef.current = false;
}
```

```
 ┌──────────────┐  ▲
 │ (scrolled    │  │ scrollTop
 │  past)       │  ▼
 ├──────────────┤  ▲
 │ visible box  │  │ clientHeight
 ├──────────────┤  ▼
 │ not seen yet │
 └──────────────┘
 whole thing = scrollHeight
```

**Interview questions:**

- **Why is the guard a `useRef` and not the `isLoading` state?** — `setIsLoading(true)` only takes effect on the next render. If several scroll events arrive before that, they all still see `false` and all start a request (duplicate items). A ref's `.current` changes immediately. We still keep `isLoading` state because changing a ref does not re-render, and the UI needs to show "Loading more…".
- **Why `setItems((prev) => …)`?** — After `await`, time has passed. The functional update appends to the latest list instead of the value captured when `loadMore` started.
- **What is `IntersectionObserver`, and why is it often better?** — Put a small "sentinel" `<div>` after the list; the browser tells you when it becomes visible. No maths on every scroll event, so it is cheaper.
- **Throttle or debounce for a scroll listener?** — Throttle (run at most once every X ms while scrolling). Debounce would only fire after the user stops scrolling, which feels late.
- **Infinite scroll vs pagination?** — Infinite scroll suits feeds, but the footer is hard to reach, it is hard to return to the same position, and the DOM keeps growing (use virtualization). Pagination is better for tables and search results and pages can be bookmarked.

---

### 9. Image Carousel

📁 [`src/components/09-Image-Carousel/ImageCarousel.jsx`](src/components/09-Image-Carousel/ImageCarousel.jsx)

**What it does:** Shows one of 4 local images, with ‹ › buttons, dots and a caption (`Forest · 3 / 4`). Next on the last image goes to the first; Previous on the first goes to the last.

**Concepts:** useState (index) · modulo `%` · map() for dots · active class · importing local images

**State:**

```js
const [currentIndex, setCurrentIndex] = useState(0);
```

**Important logic:**

```js
setCurrentIndex((currentIndex + 1) % images.length);                  // next: 3 → 0
setCurrentIndex((currentIndex - 1 + images.length) % images.length);  // prev: 0 → 3
setCurrentIndex(index);                                               // dot click
const currentImage = images[currentIndex];
```

- `import beach from "./images/beach.svg"` — Vite turns the import into a URL string for `src`.

**Interview questions:**

- **Why add `images.length` before `%` in Previous?** — In JavaScript `(-1) % 4` is `-1`, not `3`. Adding the length first keeps the number positive: `(0 − 1 + 4) % 4 = 3`.
- **Why store the index and not the image object?** — The index also gives the dot position and "2 / 4"; the image is simply `images[currentIndex]`.
- **How would you add auto-play every 3 seconds?** — `useEffect` with `setInterval`, cleared in the cleanup. Use `setCurrentIndex((prev) => (prev + 1) % images.length)` so the interval does not use a stale index.
- **How would you pause on hover?** — An `isPaused` state set by `onMouseEnter` / `onMouseLeave`; the effect returns early when paused.
- **How would you lazy-load images?** — `loading="lazy"` on `<img>`, or only render the current and next images.

---

### 10. Drag & Drop

📁 [`src/components/10-Drag-Drop/DragDrop.jsx`](src/components/10-Drag-Drop/DragDrop.jsx)

**What it does:** A small Kanban board (To Do / In Progress / Done) with a count per column. Drag a card into another column; the dragged card fades while dragging, and an empty column shows "Drop here".

**Concepts:** native HTML drag and drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`, `onDragEnd`) · useState · map() + filter() · `preventDefault()`

**State:**

```js
const [items, setItems] = useState(initialItems); // [{ id, text, column }]
const [draggedId, setDraggedId] = useState(null);
```

**Important logic:**

```js
onDragStart → setDraggedId(id); e.dataTransfer.setData("text/plain", String(id));
onDragOver  → e.preventDefault();                  // "you may drop here"
onDrop      → setItems(items.map((item) =>
                item.id === draggedId ? { ...item, column: column } : item));
onDragEnd   → setDraggedId(null);

// each column
const columnItems = items.filter((item) => item.column === column);
```

**Interview questions:**

- **Why is `e.preventDefault()` needed in `onDragOver`?** — By default an element does not accept drops. Cancelling `dragover` marks it as a drop target; without it, `onDrop` never fires.
- **Why call `setData` in `onDragStart`?** — Firefox will not start a drag without some data. You could also read the id back with `e.dataTransfer.getData("text/plain")` in `onDrop` instead of keeping it in state.
- **Why does each card store its column, instead of 3 arrays?** — Moving is then one `map()` that changes one field. With 3 arrays you must remove from one and insert into another. The columns are derived with `filter()`.
- **How would you reorder cards inside a column?** — Also track which card you dropped on; remove the dragged card and insert it at that index in a copy of the array (or keep an `order` field).
- **Does this work on phones?** — No. Native HTML5 drag events do not fire for touch in most mobile browsers; use pointer/touch events or a library such as dnd-kit.

---

## Form Handling

### 11. Form Validation

📁 [`src/components/11-Form-Validation/FormValidation.jsx`](src/components/11-Form-Validation/FormValidation.jsx)

**What it does:** Name, Email, Password and Phone. On submit, each invalid field shows its own message; typing in a field hides its error. Submits only when everything is valid, then shows a success screen.

**Concepts:** one state object for the form · one `handleChange` using `e.target.name` · `validate()` returning an errors object · regex · conditional rendering

**State:**

```js
const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
const [errors, setErrors] = useState({});        // { email: "Email is required." }
const [isSubmitted, setIsSubmitted] = useState(false);
```

**Important logic:**

```js
// One handler for every input
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
setErrors({ ...errors, [name]: "" });           // hide this field's error while fixing it

// Submit
const newErrors = validate(formData);
setErrors(newErrors);
if (Object.keys(newErrors).length === 0) setIsSubmitted(true);
```

| Field | Rule |
|-------|------|
| Name | required |
| Email | required + `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Password | required + at least 8 characters + contains a number (`/\d/`) |
| Phone | required + exactly 10 digits (`/^\d{10}$/`) |

**Interview questions:**

- **How does `[e.target.name]` let one handler update every field?** — `{ [name]: value }` is a computed property name: the key is the variable's value. The input with `name="email"` updates `formData.email`.
- **Why `noValidate` on the form?** — It turns off the browser's own popups (from `type="email"`), so every message comes from our `validate()` and looks the same.
- **Validate on change, on blur, or on submit?** — On submit is simplest and least noisy. On blur checks a field when the user leaves it. On change is instant but can show errors while the user is still typing. This form validates on submit and clears a field's error while you type.
- **Why validate on the server too?** — Browser code can be bypassed (DevTools, curl). The server is the real check; client validation is only for fast feedback.
- **Explain the email regex.** — `^[^\s@]+` one or more characters that are not a space or `@`, then `@`, then more of them, then `\.`, then more of them, till the end `$`.

---

### 12. Multi-Step Form

📁 [`src/components/12-Multi-Step-Form/MultiStepForm.jsx`](src/components/12-Multi-Step-Form/MultiStepForm.jsx)

**What it does:** Step 1 (Name, Email) → Step 2 (Phone, Address) → Step 3 (Review + Submit). A step indicator shows the current step and ✓ for completed ones. Next validates only the current step; Previous keeps the data; Enter moves to the next step.

**Concepts:** useState (step number + one object for all data) · conditional rendering per step · per-step validation · form submit

**State:**

```js
const [step, setStep] = useState(1);                                              // 1, 2, 3
const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
const [errors, setErrors] = useState({});
const [isSubmitted, setIsSubmitted] = useState(false);
```

**Important logic:**

```js
function handleSubmit(e) {          // the Next/Submit button and Enter both land here
  e.preventDefault();
  if (step < 3) handleNext();       // validateStep() → step + 1 if no errors
  else setIsSubmitted(true);
}

{step === 1 && <>…name, email…</>}
{step === 2 && <>…phone, address…</>}
{step === 3 && <dl>…review…</dl>}
```

**Interview questions:**

- **Why keep all steps' data in one state object in the parent?** — When you leave a step, its inputs unmount. If each step kept its own state, the data would be lost when you go back. Keeping it in the parent keeps it safe.
- **How would you split each step into its own component?** — `<StepOne formData={formData} errors={errors} onChange={handleChange} />`; the parent keeps the state and passes props and callbacks.
- **How would you keep the data after a refresh?** — Save `formData` and `step` to `sessionStorage` in a `useEffect`, and read them back as the initial state.
- **Why is Next a `type="submit"` button and Previous `type="button"`?** — So Enter in any input goes to the next step through `onSubmit`, and Previous never submits.
- **How would you let the user edit from the Review step?** — "Edit" buttons that call `setStep(1)` or `setStep(2)`.

---

### 13. File Upload

📁 [`src/components/13-File-Upload/FileUpload.jsx`](src/components/13-File-Upload/FileUpload.jsx)

**What it does:** "Choose file" (becomes "Change file"), shows the file name, type and size, a preview for images, "No preview" for PDFs, and a Remove button. Rejects other types and files over 2 MB with a message.

**Concepts:** `<input type="file">` · `e.target.files[0]` · File API (`name`, `type`, `size`) · `URL.createObjectURL()` · `useEffect` cleanup

**State:**

```js
const [file, setFile] = useState(null);           // File object
const [previewUrl, setPreviewUrl] = useState(""); // "blob:…" URL, images only
const [error, setError] = useState("");
```

**Important logic:**

```js
const selectedFile = e.target.files[0];
e.target.value = "";                                    // so picking the same file fires onChange again
if (!ALLOWED_TYPES.includes(selectedFile.type)) → setError(...)
if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) → setError(...)
setPreviewUrl(selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : "");

useEffect(() => {
  return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }; // free the old URL
}, [previewUrl]);
```

- The real input is `hidden` inside a `<label>`; clicking the label opens the file picker.

**Interview questions:**

- **`URL.createObjectURL` vs `FileReader.readAsDataURL`?** — `createObjectURL` is instant and gives a short `blob:` URL that points to the file in memory (you must revoke it). `readAsDataURL` is async and builds a long base64 string (about 33% bigger); nothing to revoke.
- **Why call `URL.revokeObjectURL`?** — A blob URL keeps the file in memory until the page closes. The effect cleanup revokes the old URL whenever a new one replaces it and when the component unmounts.
- **Why is the `accept` attribute not enough?** — It only filters the file picker; the user can switch to "All files". Always check `file.type` and `file.size` in code, and again on the server.
- **Why can't a file input be controlled like a text input?** — For security, JavaScript cannot set its value to a file path; you can only read it or clear it (`value = ""`).
- **How would you upload it?** — `const body = new FormData(); body.append("file", file); fetch("/upload", { method: "POST", body });`. For a progress bar, use `XMLHttpRequest` and `xhr.upload.onprogress`.

---

### 14. Auto-Complete

📁 [`src/components/14-Auto-Complete/AutoComplete.jsx`](src/components/14-Auto-Complete/AutoComplete.jsx)

**What it does:** Type a country; up to 5 countries that **start with** the text appear under the input (case-insensitive). Click one to fill the input. The list hides after a pick, on blur, on Escape, and when the input is empty; "No matches" when nothing fits.

**Concepts:** controlled input · filter() + `startsWith()` + slice() · focus / blur / keydown events · `onMouseDown` vs `onClick`

**State:**

```js
const [query, setQuery] = useState("");
const [showSuggestions, setShowSuggestions] = useState(false);
```

**Important logic:**

```js
const searchText = query.trim().toLowerCase();
const suggestions = searchText === ""
  ? []
  : countries.filter((c) => c.toLowerCase().startsWith(searchText)).slice(0, MAX_SUGGESTIONS);

<li onMouseDown={() => selectSuggestion(country)}>   // not onClick — see below
```

**Interview questions:**

- **Why `onMouseDown` and not `onClick` on a suggestion?** — The order is mousedown → **blur** (input) → mouseup → click. `onBlur` hides the list, so by the time `click` would fire, the item is gone. `mousedown` runs before the blur.
- **How would you add Arrow Up / Down + Enter?** — An `activeIndex` state; arrows change it (wrap with `%`), Enter selects `suggestions[activeIndex]`, and the active item gets a highlight class.
- **With an API instead of a local list?** — Debounce the query, fetch in `useEffect`, and ignore stale responses (`AbortController`, or check that the response is for the current query). Cache results by query in an object.
- **Why `autoComplete="off"`?** — Otherwise the browser's own saved-values dropdown covers ours.
- **`startsWith` vs `includes`?** — `startsWith` fits "complete what I'm typing"; `includes` fits general search (problem 6).

---

### 15. Dynamic Form Fields

📁 [`src/components/15-Dynamic-Form/DynamicForm.jsx`](src/components/15-Dynamic-Form/DynamicForm.jsx)

**What it does:** Starts with one "Skill" input. "+ Add field" adds another, Remove deletes one (disabled when only one is left), every input keeps its value, and Submit shows all values as JSON.

**Concepts:** array of objects in state · map() to render · filter() to remove · map() to update one item · stable `id` keys

**State:**

```js
const [fields, setFields] = useState([{ id: 1, value: "" }]);
const [submittedValues, setSubmittedValues] = useState(null);
```

**Important logic:**

```js
setFields([...fields, { id: Date.now(), value: "" }]);                               // add
setFields(fields.filter((field) => field.id !== id));                                // remove
setFields(fields.map((field) => field.id === id ? { ...field, value } : field));    // change
setSubmittedValues(fields.map((field) => field.value));                              // submit
```

**Interview questions:**

- **Why use `field.id` as the key instead of the index?** — If you remove the middle input with index keys, React thinks the *last* row was removed and reuses the first rows by position. Anything React doesn't control (focus, cursor, uncontrolled values, child state) stays on the wrong row. A stable id keeps each row tied to its own data.
- **How do you update one item in an array without mutating it?** — `map()` returns a new array; copy the matching item with spread and the new value; return the others unchanged.
- **Why don't we read values from the DOM on submit?** — The inputs are controlled, so state is the source of truth; submit just reads `fields`.
- **How would you validate each field?** — Keep an errors object keyed by id (or an `error` on each field) and fill it on submit.
- **How would you support different input types?** — Store `type` in each field object and render `<input type={field.type}>` or a `<select>` based on it.

---

## Advanced Components

### 16. Star Rating

📁 [`src/components/16-Star-Rating/StarRating.jsx`](src/components/16-Star-Rating/StarRating.jsx)

**What it does:** Five stars. Hovering previews a rating, clicking saves it ("You rated 4 out of 5 · Very good"), and you can click again to change it.

**Concepts:** useState (saved rating + hover) · map() over `[1, 2, 3, 4, 5]` · conditional class · mouse events

**State:**

```js
const [rating, setRating] = useState(0); // saved (0 = none)
const [hover, setHover] = useState(0);   // star under the mouse (0 = none)
```

**Important logic:**

```js
const activeValue = hover || rating;  // hover wins unless it is 0
className={star <= activeValue ? "rating-star filled" : "rating-star"}
```

- `onMouseLeave` is on the wrapper, not on each star, so moving across the gaps between stars does not flicker.

**Interview questions:**

- **Why two pieces of state?** — `rating` is the saved choice, `hover` is a temporary preview. With one value, the saved rating would be lost when the mouse leaves.
- **What does `hover || rating` do?** — `||` returns the first truthy value. `0` is falsy, so when nothing is hovered it falls back to `rating`.
- **How would you make it reusable?** — Props `max = 5`, `value`, `onChange(newRating)`; the parent owns the value (a controlled component).
- **How would you support half stars?** — Check where the click happened (`e.nativeEvent.offsetX < width / 2`) and draw a half-filled star with CSS (e.g. an overlay at 50% width).
- **How would you make it keyboard accessible?** — The stars are buttons, so Tab + Enter already work; `aria-label` on each star. A radio group with arrow keys is another option.

---

### 17. Progress Bar / Loading

📁 [`src/components/17-Progress-Bar/ProgressBar.jsx`](src/components/17-Progress-Bar/ProgressBar.jsx)

**What it does:** A bar with a percentage and status (Not started / In progress / Loading… / Complete ✅). −10% and +10% buttons (disabled at the limits), **Auto fill** adds 5% every 200 ms with a spinner and can be paused, Reset goes back to 0. The bar turns green at 100%.

**Concepts:** useState · inline `style` for the width · `Math.min` / `Math.max` clamping · `useEffect` + `setTimeout` + cleanup · CSS spinner animation

**State:**

```js
const [progress, setProgress] = useState(0);        // 0–100
const [isRunning, setIsRunning] = useState(false);  // auto fill on/off
```

**Important logic:**

```js
setProgress(Math.min(progress + STEP, 100));   // never above 100
setProgress(Math.max(progress - STEP, 0));     // never below 0

useEffect(() => {
  if (!isRunning) return;
  const timer = setTimeout(() => {
    const next = Math.min(progress + 5, 100);
    setProgress(next);
    if (next === 100) setIsRunning(false);     // stop by itself
  }, 200);
  return () => clearTimeout(timer);            // pause / reset / leave page
}, [isRunning, progress]);

<div className="progress-fill" style={{ width: `${progress}%` }} />
```

- Spinner: a round element with one coloured border side and `animation: progress-spin 0.8s linear infinite` (a keyframe that rotates it to 360deg), shown only while running.

**Interview questions:**

- **Why a `setTimeout` per step instead of `setInterval`?** — Each change of `progress` schedules exactly one next step, and at 100% nothing is scheduled, so it stops by itself. The `setInterval` version: `const id = setInterval(() => setProgress((p) => Math.min(p + 5, 100)), 200); return () => clearInterval(id);` with `[isRunning]` as the dependency. It needs the functional update (the callback would otherwise see a stale `progress`) and a separate way to stop at 100.
- **Why is the cleanup needed?** — Pause, Reset or leaving the page must cancel the waiting timer; otherwise it still fires and changes state after the user stopped it.
- **Why `Math.min` / `Math.max`?** — To clamp the value to 0–100 so the bar cannot overflow or go negative.
- **Inline style vs CSS class?** — Inline style is right for a continuous value like a width in %. Use classes for a fixed set of looks (like the green "complete" bar).
- **How is it made accessible?** — `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. The spinner is `aria-hidden` because the "Loading…" text already says it.

---

### 18. Tabs

📁 [`src/components/18-Tabs/Tabs.jsx`](src/components/18-Tabs/Tabs.jsx)

**What it does:** Profile / Posts / Settings tabs. Clicking a tab shows its content and underlines it in blue.

**Concepts:** useState · map() for the tab buttons · find() for the active content · active class

**State:**

```js
const [activeTab, setActiveTab] = useState("profile");
```

**Important logic:**

```js
const activeContent = tabs.find((tab) => tab.id === activeTab).content;
className={tab.id === activeTab ? "tabs-button active" : "tabs-button"}
```

**Interview questions:**

- **Why store only the active tab's id?** — The content already lives in the `tabs` array; `find()` gets it. Storing the content too would duplicate data.
- **Only the active panel is rendered. What happens to state inside the other tabs?** — They unmount, so their state resets. To keep it, render all panels and hide the inactive ones (`hidden` attribute or CSS), or lift the state up to the parent.
- **How would you sync the tab with the URL?** — Read it from `?tab=posts` or `#posts` on load, and update the URL on click (`history.pushState`), so a tab can be bookmarked or shared.
- **Which ARIA roles do tabs use?** — `role="tablist"` on the container, `role="tab"` + `aria-selected` on each button, `role="tabpanel"` on the content; arrow keys should move between tabs.

---

### 19. Data Table

📁 [`src/components/19-Data-Table/DataTable.jsx`](src/components/19-Data-Table/DataTable.jsx)

**What it does:** 10 employees (Name, Department, Age, Salary). Search by name or department. Click any column header to sort ascending (▲), click again for descending (▼). Shows a "No employees match" row and "3 of 10 rows · sorted by salary (desc)".

**Concepts:** filter() · sort() on a **copy** · compare functions (`a - b`, `localeCompare`) · derived data · `colSpan`

**State:**

```js
const [search, setSearch] = useState("");
const [sortColumn, setSortColumn] = useState(null);      // "name" | "department" | "age" | "salary"
const [sortDirection, setSortDirection] = useState("asc");
```

**Important logic:**

```js
// Header click
if (sortColumn === columnKey) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
else { setSortColumn(columnKey); setSortDirection("asc"); }

// 1) filter   2) copy   3) sort
const filteredRows = employees.filter((row) => row.name.toLowerCase().includes(searchText) || …);
const sortedRows = [...filteredRows];
sortedRows.sort((a, b) => {
  const result = typeof a[sortColumn] === "number"
    ? a[sortColumn] - b[sortColumn]                // numbers
    : a[sortColumn].localeCompare(b[sortColumn]);  // strings
  return sortDirection === "asc" ? result : -result;
});
```

| compare(a, b) returns | meaning |
|---|---|
| negative | `a` comes first |
| positive | `b` comes first |
| `0` | keep their order |

**Interview questions:**

- **Why copy the array before `sort()`?** — `sort()` changes the array in place. Sorting state or the original data directly is mutation: React may not re-render and the original order is lost.
- **How does the compare function decide the order?** — Negative → `a` first, positive → `b` first, `0` → unchanged. For descending, flip the sign.
- **Why is `[10, 9, 100].sort()` wrong?** — Without a compare function, `sort()` compares values as **strings**, character by character: `"100" < "9"`. Numbers need `(a, b) => a - b`.
- **Why `localeCompare` for strings?** — It returns −1 / 0 / 1 directly and handles accents and case more sensibly than `<` / `>`.
- **How would you handle 10,000 rows?** — Paginate or virtualize (render only the visible rows), debounce the search, or sort and filter on the server.

---

### 20. Shopping Cart

📁 [`src/components/20-Shopping-Cart/ShoppingCart.jsx`](src/components/20-Shopping-Cart/ShoppingCart.jsx)

**What it does:** 6 products with "Add to cart". The cart shows each line with − / + / Remove, the line price, the item count in the heading ("Cart (3 items)") and the total. Adding a product that is already in the cart increases its quantity; decreasing to 0 removes the line.

**Concepts:** array of objects in state · find() · map() · filter() · reduce() · derived values

**State:**

```js
const [cart, setCart] = useState([]); // [{ id, name, price, emoji, quantity }]
```

**Important logic:**

```js
// Add
const existingItem = cart.find((item) => item.id === product.id);
if (existingItem) setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
else setCart([...cart, { ...product, quantity: 1 }]);

// Decrease (quantity 0 → removed)
setCart(cart
  .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
  .filter((item) => item.quantity > 0));

// Derived
const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

**Interview questions:**

- **Why is `total` calculated and not stored in state?** — It is always `cart.reduce(...)`. A stored total would have to be updated in every handler and could easily be wrong.
- **Walk through `reduce()`.** — Cart `[{ price: 799, quantity: 2 }, { price: 1499, quantity: 1 }]`: start `sum = 0` → `0 + 1598 = 1598` → `1598 + 1499 = 3097`. The `0` is the starting value.
- **Why `find()` in `addToCart`?** — To decide between "increase the quantity of the existing line" and "add a new line".
- **How would you share the cart across pages?** — Lift the state to a common parent, or use React Context (a `CartProvider` holding `cart` and the handlers); save it in `localStorage` to survive refreshes.
- **How do you avoid floating-point problems with money?** — Store whole numbers (rupees or paise) and only format for display with `toLocaleString("en-IN")`.
