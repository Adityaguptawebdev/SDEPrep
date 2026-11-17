# 05 — Frontend Machine Coding Problems

[← React Q&A](04-React-Interview-Questions.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: TypeScript →](06-TypeScript-Questions.md)

**Setup assumed:** React 18/19 function components in a CodeSandbox-style editor, no UI libraries. P2–P4 use **plain CSS** because sandboxes often don't have Tailwind. P6–P17 use **Tailwind** classes (add `<script src="https://cdn.tailwindcss.com"></script>` to `index.html` in a sandbox, or turn the classes into CSS). The JSX blocks were syntax-checked with esbuild, and the pure logic functions were tested in Node.

**Code layout used everywhere:** `// 1. State` → `// 2. Derived values` → `// 3. Effects` → `// 4. Handlers` → `// 5. JSX`.

## Contents (ordered by priority)

| # | Problem | Priority | Tag | Time box |
|---|---|---|---|---|
| P1 | [Deep Clone](#p1-deep-clone) | 🔴 Critical | 📌 | 15 min |
| P2 | [N x N Tic-Tac-Toe](#p2-n-x-n-tic-tac-toe) | 🔴 Critical | 📌 | 25–30 min |
| P3 | [Image Carousel with Thumbnails](#p3-image-carousel-with-thumbnails) | 🔴 Critical | 📌 | 25 min |
| P4 | [Hotstar-Style Autoplay Carousel](#p4-hotstar-style-autoplay-carousel) | 🔴 Critical | 📌 | 30 min |
| P5 | [Sort by a Given Alphabet String](#p5-sort-by-a-given-alphabet-string) | 🟠 High | 📌 | 10 min |
| P6 | [Searchable and Sortable Data Table](#p6-searchable-and-sortable-data-table) | 🟠 High | 🔮 | 25 min |
| P7 | [Pagination Component](#p7-pagination-component) | 🟠 High | 🔮 | 20 min |
| P8 | [Debounced Search](#p8-debounced-search) | 🟠 High | 🔮 | 20 min |
| P9 | [Infinite Scrolling](#p9-infinite-scrolling) | 🟠 High | 🔮 | 25 min |
| P10 | [Reusable Modal](#p10-reusable-modal) | 🟡 Medium | 🔮 | 20 min |
| P11 | [Tabs Component](#p11-tabs-component) | 🟡 Medium | 🔮 | 15 min |
| P12 | [Searchable Dropdown](#p12-searchable-dropdown) | 🟠 High | 🔮 | 25 min |
| P13 | [Todo Application](#p13-todo-application) | 🟡 Medium | 🔮 | 20 min |
| P14 | [Accordion](#p14-accordion) | 🟡 Medium | 🔮 | 10 min |
| P15 | [Multi-Select Dropdown](#p15-multi-select-dropdown) | 🟡 Medium | 🔮 | 25 min |
| P16 | [Star Rating](#p16-star-rating) | 🟡 Medium | 🔮 | 10 min |
| P17 | [Autocomplete Typeahead](#p17-autocomplete-typeahead) | 🟠 High | 🔮 | 30 min |
| — | [Shared hooks](#shared-hooks) · [Universal checklist](#universal-machine-coding-checklist) | | | |

---

## Universal machine-coding checklist

Say this plan out loud in the first 2 minutes. Interviewers score **communication + working code + edge cases**, not pixel perfection.

```
 1. Clarify (1–2 min)  → inputs? limits? must-have vs nice-to-have? libraries allowed?
 2. Plan state (1 min) → "minimum state, everything else derived"
 3. Skeleton (5 min)   → static JSX with dummy data on screen
 4. Core logic         → make the main flow work end to end
 5. Edge cases         → disable/guard invalid actions, empty/loading/error
 6. Polish             → transitions, keyboard, a11y, responsive
 7. Talk complexity + what you'd improve with more time
```

The Medium candidate lost points by **leaving draw/reset and the animation to the end**. Do the cheap required features (reset, draw, `transition`) **early**.

---

## P1. Deep Clone

📌 Reported 3× (Reddit, Medium, Glassdoor). The full solution is in **[03 → Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone)**: basic version, then the `WeakMap` version, dry run, `structuredClone` table and follow-ups.

**10-minute delivery plan:** primitives → arrays/objects recursion → demonstrate the nested-mutation test → interviewer adds "circular" → add `WeakMap`, registering the copy **before** recursing → add Date/Map/Set if time allows → state complexity O(n).

---

## P2. N x N Tic-Tac-Toe

**Priority:** 🔴 Critical · 📌 Reported — Reddit (Intern, Oct 2025), Medium (Senior, Oct 2025: dropdown N, winner, draw, reset), Glassdoor (Intern: prototype in 25 minutes).

### Problem statement
Build a Tic-Tac-Toe game where the board size N is chosen from a dropdown (3×3, 4×4, 5×5…). Two players X and O take turns. A player wins by filling a full row, column or diagonal. Show a draw when the board is full. Add a reset.

### Functional requirements
- Dropdown for N; changing N starts a new game.
- X always starts; turns alternate.
- Clicking an occupied cell, or any cell after the game is over, does nothing.
- Detect win (row / column / main diagonal / anti-diagonal) and highlight the winning line.
- Detect draw.
- Reset button.
- Reusable components: `Board`, `Cell`, `GameStatus`, `SizeSelector`.

### Expected UI

```
 Board size: [ 3 × 3 ▾ ]            Turn: X
 ┌───┬───┬───┐
 │ X │ O │   │
 ├───┼───┼───┤
 │   │ X │   │
 ├───┼───┼───┤
 │ O │   │ X │   ← winning cells highlighted
 └───┴───┴───┘
 🎉 Player X wins!        [ Reset ]
```

### Component architecture

```
 TicTacToe  (owns all state)
 ├── SizeSelector   props: size, sizes, onChange
 ├── GameStatus     props: winner, isDraw, currentPlayer
 ├── Board          props: board, size, winLine, onCellClick, disabled
 │    └── Cell × N² props: value, isWinning, onClick, disabled, label
 └── <button> Reset
```

### State management

| State | Why it is state |
|---|---|
| `size` | user picks it |
| `board` — 1-D array of length N², values `"X" \| "O" \| null` | the moves |
| `winLine` — indexes of the winning line or `null` | result of the last move |

**Derived (not state):** `moves = board.filter(Boolean).length`, `currentPlayer = moves % 2 === 0 ? "X" : "O"`, `winner = winLine ? board[winLine[0]] : null`, `isDraw = !winner && moves === N²`.

> 🗣️ **Hinglish:** Jo cheez calculate ho sakti hai use state mat banao. `currentPlayer` alag state rakhoge to board ke saath **sync bigad sakta hai** — moves count se nikaal lo.

**1-D index ↔ 2-D:** `row = Math.floor(i / N)`, `col = i % N`, `i = row * N + col`.

### Win detection algorithm

🗣️ **Hinglish:** Har move ke baad poora board check karne ki zarurat nahi. **Naya jeet sirf usi line mein ho sakta hai jisme abhi move hua** — uski row, uska column, aur agar diagonal pe hai to diagonal. Jaise cricket mein sirf **abhi wali ball** ka review hota hai, poora match nahi.

```
 last move at (row=1, col=1) on 3×3:
   row 1:      (1,0) (1,1) (1,2)
   col 1:      (0,1) (1,1) (2,1)
   main diag:  row === col          → (0,0) (1,1) (2,2)
   anti diag:  row + col === N - 1  → (0,2) (1,1) (2,0)
 check only these ≤ 4 lines × N cells = O(N) per move
```

### Complete code — `TicTacToe.jsx`

```jsx
import { useState } from "react";
import "./TicTacToe.css";

const SIZES = [3, 4, 5, 6, 7];

// Returns the winning line (array of indexes) through `index`, or null. O(N)
export function getWinningLine(board, n, index) {
  const player = board[index];
  if (!player) return null;
  const row = Math.floor(index / n);
  const col = index % n;

  const lines = [
    Array.from({ length: n }, (_, c) => row * n + c), // row
    Array.from({ length: n }, (_, r) => r * n + col), // column
  ];
  if (row === col) lines.push(Array.from({ length: n }, (_, i) => i * n + i)); // main diagonal
  if (row + col === n - 1) lines.push(Array.from({ length: n }, (_, i) => i * n + (n - 1 - i))); // anti

  return lines.find((line) => line.every((i) => board[i] === player)) || null;
}

function SizeSelector({ size, sizes, onChange }) {
  return (
    <label className="ttt-size">
      Board size:{" "}
      <select value={size} onChange={(e) => onChange(Number(e.target.value))}>
        {sizes.map((s) => (
          <option key={s} value={s}>
            {s} × {s}
          </option>
        ))}
      </select>
    </label>
  );
}

function GameStatus({ winner, isDraw, currentPlayer }) {
  let text = `Turn: ${currentPlayer}`;
  if (winner) text = `🎉 Player ${winner} wins!`;
  else if (isDraw) text = "🤝 It's a draw!";
  return (
    <p className="ttt-status" role="status" aria-live="polite">
      {text}
    </p>
  );
}

function Cell({ value, isWinning, disabled, onClick, label }) {
  return (
    <button
      className={`ttt-cell ${isWinning ? "ttt-cell--win" : ""} ${value ? `ttt-cell--${value}` : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {value}
    </button>
  );
}

function Board({ board, size, winLine, gameOver, onCellClick }) {
  const winSet = new Set(winLine || []);
  return (
    <div className="ttt-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {board.map((value, i) => (
        <Cell
          key={i}
          value={value}
          isWinning={winSet.has(i)}
          disabled={Boolean(value) || gameOver}
          onClick={() => onCellClick(i)}
          label={`Row ${Math.floor(i / size) + 1}, column ${(i % size) + 1}, ${value || "empty"}`}
        />
      ))}
    </div>
  );
}

export default function TicTacToe() {
  // 1. State
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState(() => Array(3 * 3).fill(null));
  const [winLine, setWinLine] = useState(null);

  // 2. Derived values
  const moves = board.filter(Boolean).length;
  const currentPlayer = moves % 2 === 0 ? "X" : "O";
  const winner = winLine ? board[winLine[0]] : null;
  const isDraw = !winner && moves === size * size;
  const gameOver = Boolean(winner) || isDraw;

  // 4. Handlers
  function handleCellClick(index) {
    if (board[index] || gameOver) return; // 🔑 block occupied cells and finished games
    const next = [...board];               // never mutate state
    next[index] = currentPlayer;
    setBoard(next);
    setWinLine(getWinningLine(next, size, index));
  }

  function startGame(newSize) {
    setSize(newSize);
    setBoard(Array(newSize * newSize).fill(null));
    setWinLine(null);
  }

  // 5. JSX
  return (
    <div className="ttt">
      <h1>Tic-Tac-Toe</h1>
      <div className="ttt-toolbar">
        <SizeSelector size={size} sizes={SIZES} onChange={startGame} />
        <button className="ttt-reset" onClick={() => startGame(size)}>
          Reset
        </button>
      </div>
      <GameStatus winner={winner} isDraw={isDraw} currentPlayer={currentPlayer} />
      <Board board={board} size={size} winLine={winLine} gameOver={gameOver} onCellClick={handleCellClick} />
    </div>
  );
}
```

### `TicTacToe.css`

```css
.ttt { max-width: 480px; margin: 24px auto; padding: 0 16px; font-family: system-ui, sans-serif; text-align: center; }
.ttt-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.ttt-size select { padding: 6px 8px; border-radius: 6px; }
.ttt-reset { padding: 8px 16px; border: 0; border-radius: 6px; background: #4f46e5; color: #fff; cursor: pointer; }
.ttt-status { font-size: 1.1rem; font-weight: 600; min-height: 1.5em; }
.ttt-board { display: grid; gap: 6px; width: 100%; aspect-ratio: 1; }
.ttt-cell {
  border: 2px solid #cbd5e1; border-radius: 8px; background: #fff;
  font-size: clamp(1rem, 6vw, 2.5rem); font-weight: 700; cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.ttt-cell:hover:not(:disabled) { background: #f1f5f9; transform: scale(1.03); }
.ttt-cell:disabled { cursor: not-allowed; }
.ttt-cell--X { color: #4f46e5; }
.ttt-cell--O { color: #e11d48; }
.ttt-cell--win { background: #bbf7d0; border-color: #16a34a; }
.ttt-cell:focus-visible { outline: 3px solid #f59e0b; }
```

### Dry run (3×3)

```
moves in order: X→0, O→3, X→1, O→4, X→2
board after X→2 → [X,X,X, O,O,_, _,_,_]
getWinningLine(board, 3, 2): row=0 col=2
  row 0  → [0,1,2] all X ✅  → winLine=[0,1,2], winner="X"
  (col 2 → [2,5,8] no; anti-diag since 0+2=2 → [2,4,6] no)
next click on 5 → gameOver true → handler returns early
```

### Edge cases

| Case | Handled by |
|---|---|
| Click occupied cell | `if (board[index]) return` + `disabled` |
| Click after win/draw | `gameOver` guard |
| Win on the very last cell | win is checked first, so `isDraw = !winner && …` stays false |
| Change N mid-game | `startGame(newSize)` builds a fresh N² board |
| Large N (10+) | still O(N) per move; CSS `clamp` keeps text readable |
| Double click fast | state update is based on `board` of that render; the disabled button blocks the second click |

### Complexity
- Per move: **O(N)** time (≤ 4 lines × N cells), O(N²) to copy the board → overall **O(N²)** per move because of the copy (fine for small N).
- Space: **O(N²)** for the board.

**O(1) win check (follow-up):** keep counters `rows[N]`, `cols[N]`, `diag`, `anti`. Add +1 for X and −1 for O. If any counter's absolute value reaches N, that player wins.

```js
function createCounterChecker(n) {
  const rows = Array(n).fill(0), cols = Array(n).fill(0);
  let diag = 0, anti = 0;
  return function move(row, col, player) {
    const v = player === "X" ? 1 : -1;
    rows[row] += v; cols[col] += v;
    if (row === col) diag += v;
    if (row + col === n - 1) anti += v;
    return [rows[row], cols[col], diag, anti].some((x) => Math.abs(x) === n) ? player : null;
  };
}
const move = createCounterChecker(3);
move(0, 0, "X"); move(1, 0, "O"); move(1, 1, "X"); move(2, 0, "O");
console.log(move(2, 2, "X")); // X
```

### Interview follow-ups
1. **Win with K in a row on an N×N board** (like Gomoku) → from the last move, count same-player cells in 4 directions `(0,1) (1,0) (1,1) (1,-1)`, both ways; if `count ≥ K` → win. O(K).
2. **Undo / time travel** → store `history: board[]` and a `step`; render `history[step]`.
3. **Play against the computer** → random empty cell, or minimax for 3×3.
4. **Persist the game** → save `{size, board}` to `localStorage`.
5. **Why a 1-D array?** → easy copy, easy to map into a CSS grid; convert with `/` and `%`.
6. **Why is `currentPlayer` derived?** → one source of truth; it can't go out of sync.
7. **Why `useState(() => …)`?** → lazy initial state, built only on the first render.

### Common mistakes
- Mutating `board` (`board[i] = "X"; setBoard(board)`) → no re-render.
- Checking the winner inside `useEffect` → an extra render, and the state can lag behind.
- Hard-coding the 8 winning lines (only works for 3×3).
- Forgetting the anti-diagonal condition `row + col === n - 1`.
- Using index keys is OK **here** (cells never reorder), but say why.

---

## P3. Image Carousel with Thumbnails

**Priority:** 🔴 Critical · 📌 Reported — Reddit (Intern, Oct 2025).

### Problem statement
Show one large image with a thumbnail strip under it. Prev/next buttons, click a thumbnail to jump, highlight the active thumbnail, autoplay that can be paused and resumed, smooth transitions, responsive.

### Expected UI

```
 ┌──────────────────────────────────────────┐
 │ ‹                                       › │
 │              MAIN IMAGE (fade)            │
 │                                   3 / 5   │
 └──────────────────────────────────────────┘
 [▢] [▢] [■] [▢] [▢]     ← active thumbnail has a border
 [ ⏸ Pause ]
```

### Approach
1. State: `currentIndex`, `isPlaying`.
2. Next/prev with **wrap-around** using modulo: `(i + 1) % n` and `(i - 1 + n) % n`.
3. Autoplay: `setInterval` inside `useEffect`, depending on `isPlaying`; the **cleanup clears it**.
4. Use a **functional update** `setIndex(i => …)` inside the interval to avoid a stale closure.
5. Smooth transition: stack all images in one box and fade with `opacity` (CSS `transition`).
6. Pause on hover, keyboard arrows, active thumbnail scrolls into view.

### Component breakdown
`ImageCarousel` (state) → `MainSlide` area (all images stacked) → `ThumbnailStrip` → `Controls`.

### Complete code — `ImageCarousel.jsx`

```jsx
import { useCallback, useEffect, useRef, useState } from "react";
import "./ImageCarousel.css";

const IMAGES = [
  { id: 1, src: "https://picsum.photos/id/1015/1200/675", alt: "River valley" },
  { id: 2, src: "https://picsum.photos/id/1016/1200/675", alt: "Canyon" },
  { id: 3, src: "https://picsum.photos/id/1018/1200/675", alt: "Mountains" },
  { id: 4, src: "https://picsum.photos/id/1019/1200/675", alt: "Sea" },
  { id: 5, src: "https://picsum.photos/id/1021/1200/675", alt: "Foggy hills" },
];

export default function ImageCarousel({ images = IMAGES, interval = 3000 }) {
  // 1. State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const thumbRefs = useRef([]);
  const total = images.length;

  // 4. Handlers (useCallback because they're used in effects)
  const goTo = useCallback((index) => setCurrentIndex((index + total) % total), [total]);
  const next = useCallback(() => setCurrentIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrentIndex((i) => (i - 1 + total) % total), [total]);

  // 3. Effects
  // Autoplay: runs only when playing and not hovered; cleanup stops the old timer
  useEffect(() => {
    if (!isPlaying || isHovered || total < 2) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [isPlaying, isHovered, next, interval, total]);

  // Keep the active thumbnail visible in the strip
  useEffect(() => {
    thumbRefs.current[currentIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentIndex]);

  function handleKeyDown(e) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  if (total === 0) return <p className="carousel-empty">No images</p>;

  // 5. JSX
  return (
    <section className="carousel" aria-roledescription="carousel" aria-label="Image gallery">
      <div
        className="carousel-main"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.src}
            alt={img.alt}
            className={`carousel-slide ${i === currentIndex ? "is-active" : ""}`}
            aria-hidden={i !== currentIndex}
          />
        ))}
        <button className="carousel-arrow left" onClick={prev} aria-label="Previous image">‹</button>
        <button className="carousel-arrow right" onClick={next} aria-label="Next image">›</button>
        <span className="carousel-counter">{currentIndex + 1} / {total}</span>
      </div>

      <div className="carousel-thumbs" role="tablist" aria-label="Choose image">
        {images.map((img, i) => (
          <button
            key={img.id}
            ref={(el) => (thumbRefs.current[i] = el)}
            className={`carousel-thumb ${i === currentIndex ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Show image ${i + 1}: ${img.alt}`}
          >
            <img src={img.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <button className="carousel-play" onClick={() => setIsPlaying((p) => !p)}>
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
    </section>
  );
}
```

### `ImageCarousel.css`

```css
.carousel { max-width: 900px; margin: 24px auto; padding: 0 16px; font-family: system-ui, sans-serif; }
.carousel-main { position: relative; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; background: #111; outline: none; }
.carousel-main:focus-visible { box-shadow: 0 0 0 3px #f59e0b; }
.carousel-slide {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0; transition: opacity 0.6s ease;            /* smooth fade */
}
.carousel-slide.is-active { opacity: 1; }
.carousel-arrow {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 1;
  width: 40px; height: 40px; border: 0; border-radius: 50%;
  background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 1.6rem; cursor: pointer;
}
.carousel-arrow.left { left: 12px; }
.carousel-arrow.right { right: 12px; }
.carousel-counter { position: absolute; right: 12px; bottom: 12px; color: #fff; background: rgba(0,0,0,.5); padding: 2px 8px; border-radius: 12px; font-size: .85rem; }
.carousel-thumbs { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px; scroll-snap-type: x mandatory; }
.carousel-thumb { flex: 0 0 auto; width: 96px; aspect-ratio: 16 / 9; padding: 0; border: 3px solid transparent; border-radius: 8px; overflow: hidden; opacity: .6; cursor: pointer; scroll-snap-align: center; transition: opacity .2s, border-color .2s; }
.carousel-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.carousel-thumb.is-active, .carousel-thumb:hover { opacity: 1; }
.carousel-thumb.is-active { border-color: #4f46e5; }
.carousel-play { margin-top: 10px; padding: 8px 14px; border: 0; border-radius: 6px; background: #4f46e5; color: #fff; cursor: pointer; }
@media (max-width: 480px) { .carousel-thumb { width: 64px; } .carousel-arrow { width: 32px; height: 32px; } }
@media (prefers-reduced-motion: reduce) { .carousel-slide { transition: none; } }
```

### Dry run of navigation (5 images)

```
start            i=0
next()           (0+1)%5 = 1
prev() twice     (1-1+5)%5 = 0 → (0-1+5)%5 = 4   ← wraps to last
goTo(2)          (2+5)%5 = 2
autoplay tick    (2+1)%5 = 3 ... 4 → (4+1)%5 = 0 ← wraps to first
hover            isHovered=true → effect cleanup clears interval → no ticks
leave            effect re-runs → new interval starts
pause button     isPlaying=false → cleanup, effect returns early
```

### useEffect cleanup — why it matters
Every time `isPlaying`/`isHovered` changes, React **runs the cleanup of the previous effect first** (clears the old interval), then runs the effect again. Without the cleanup you get **two intervals** → slides skip 2 at a time, and the timer keeps running after unmount.

### Edge cases
0 images (empty message) · 1 image (no autoplay: `total < 2`) · rapid clicks (modulo keeps the index valid) · images of different sizes (`object-fit: cover`) · slow images (fade shows the background; add a skeleton) · tab hidden (see P4).

### Complexity
Navigation O(1). Rendering O(n) images (all stacked). For 100+ images render only the current ± 1 slides.

### Follow-ups
Why functional `setState` in the interval? · Why `aspect-ratio` (prevents layout shift — CLS) · Lazy-load thumbnails (`loading="lazy"`) · Swipe on mobile (`touchstart`/`touchend` delta X > 50 px).

---

## P4. Hotstar-Style Autoplay Carousel

**Priority:** 🔴 Critical · 📌 Reported — Medium (Senior, Oct 2025, Round 2). Requirements reported: main slide, thumbnail strip, prev/next, click thumbnail, **auto-advance every 3000 ms**, **smooth sliding animation**. The candidate missed only the animation.

### How it differs from P3

| | P3 basic carousel | P4 Hotstar-style |
|---|---|---|
| Transition | fade (opacity) | **slide** — a horizontal track moved with `translateX` |
| Autoplay timer | `setInterval`, doesn't care about manual clicks | **`setTimeout` keyed on `currentIndex`** → every manual change **restarts the 3 s countdown** |
| Progress | none | **progress bar** on the active thumbnail that fills in 3 s |
| Pause | button + hover | hover **and** hidden browser tab (`visibilitychange`) |
| Content | image only | image + title/description overlay (banner style) |

🗣️ **Hinglish:** Hotstar banner jaisa: slides ek **train ke dibbe** ki tarah ek line mein khade hain, aur hum poori train ko `translateX(-index × 100%)` se khiska dete hain. Timer **har slide change par reset** hota hai — user ne khud next dabaya to agla auto-change phir se poore 3 second baad hoga, turant nahi.

```
 viewport  ┌────────┐
 track     │ slide0 │ slide1 │ slide2 │ slide3 │   transform: translateX(-100%) → shows slide1
           └────────┘
```

### Autoplay + manual change logic

```
 currentIndex changes (auto OR manual)
        │
        ▼
 effect cleanup → clearTimeout(old)      ← old countdown cancelled
 effect runs    → setTimeout(next, 3000) ← fresh 3 s countdown
```

Using `setTimeout` with `[currentIndex]` in the dependency array is the simplest way to get "reset on manual change".

### Complete code — `HotstarCarousel.jsx`

```jsx
import { useEffect, useState } from "react";
import "./HotstarCarousel.css";

const SLIDES = [
  { id: 1, title: "The Mountain Trail", tag: "New Episode", img: "https://picsum.photos/id/1036/1280/560" },
  { id: 2, title: "Ocean Stories", tag: "Trending", img: "https://picsum.photos/id/1043/1280/560" },
  { id: 3, title: "City Lights", tag: "Movie", img: "https://picsum.photos/id/1067/1280/560" },
  { id: 4, title: "Desert Run", tag: "Series", img: "https://picsum.photos/id/1080/1280/560" },
];

export default function HotstarCarousel({ slides = SLIDES, delay = 3000 }) {
  // 1. State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const total = slides.length;

  // 4. Handlers
  const goTo = (i) => setCurrentIndex((i + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);
  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);

  // 3. Effects
  // 🔑 One timeout per slide. Any change of currentIndex (auto or manual) clears
  // the old timeout and starts a new 3 s countdown.
  useEffect(() => {
    if (isPaused || isTabHidden || total < 2) return;
    const id = setTimeout(() => setCurrentIndex((i) => (i + 1) % total), delay);
    return () => clearTimeout(id);
  }, [currentIndex, isPaused, isTabHidden, total, delay]);

  // Pause when the browser tab is hidden
  useEffect(() => {
    const onVisibility = () => setIsTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (total === 0) return null;
  const paused = isPaused || isTabHidden;

  // 5. JSX
  return (
    <section
      className="hs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="hs-viewport">
        <div className="hs-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((s, i) => (
            <article key={s.id} className="hs-slide" aria-hidden={i !== currentIndex}>
              <img src={s.img} alt={s.title} />
              <div className="hs-overlay">
                <span className="hs-tag">{s.tag}</span>
                <h2>{s.title}</h2>
              </div>
            </article>
          ))}
        </div>
        <button className="hs-arrow left" onClick={prev} aria-label="Previous slide">‹</button>
        <button className="hs-arrow right" onClick={next} aria-label="Next slide">›</button>
      </div>

      <div className="hs-thumbs">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`hs-thumb ${i === currentIndex ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.title}`}
            aria-current={i === currentIndex}
          >
            <img src={s.img} alt="" loading="lazy" />
            {i === currentIndex && (
              // key restarts the CSS animation whenever the slide changes
              <span
                key={currentIndex}
                className="hs-progress"
                style={{ animationDuration: `${delay}ms`, animationPlayState: paused ? "paused" : "running" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
```

### `HotstarCarousel.css`

```css
.hs { max-width: 1100px; margin: 24px auto; padding: 0 16px; font-family: system-ui, sans-serif; }
.hs-viewport { position: relative; overflow: hidden; border-radius: 12px; aspect-ratio: 16 / 7; background: #0b1020; }
.hs-track { display: flex; height: 100%; transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); will-change: transform; }
.hs-slide { position: relative; flex: 0 0 100%; height: 100%; }
.hs-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hs-overlay { position: absolute; inset: auto 0 0 0; padding: 24px; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,.85)); }
.hs-overlay h2 { margin: 6px 0 0; font-size: clamp(1.1rem, 3vw, 2rem); }
.hs-tag { font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; color: #93c5fd; }
.hs-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border: 0; border-radius: 50%; background: rgba(0,0,0,.5); color: #fff; font-size: 1.6rem; cursor: pointer; }
.hs-arrow.left { left: 12px; } .hs-arrow.right { right: 12px; }
.hs-thumbs { display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; }
.hs-thumb { position: relative; flex: 0 0 auto; width: 140px; aspect-ratio: 16 / 9; padding: 0; border: 2px solid transparent; border-radius: 8px; overflow: hidden; opacity: .55; cursor: pointer; transition: opacity .2s, transform .2s; }
.hs-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hs-thumb.is-active { opacity: 1; border-color: #fff; transform: scale(1.05); }
.hs-progress { position: absolute; left: 0; bottom: 0; height: 4px; width: 100%; background: #3b82f6; transform-origin: left; animation-name: hs-fill; animation-timing-function: linear; }
@keyframes hs-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (max-width: 600px) { .hs-thumb { width: 90px; } .hs-viewport { aspect-ratio: 16 / 9; } }
@media (prefers-reduced-motion: reduce) { .hs-track { transition: none; } }
```

### Dry run

```
t=0     index 0, effect sets timeout T1 (3 s)
t=3.0s  T1 fires → index 1 → cleanup (T1 already done) → new T2 (3 s)
t=4.2s  user clicks thumbnail 3 → index 3 → cleanup clears T2 → new T3 (3 s)
t=7.2s  T3 fires → index (3+1)%4 = 0   ← full 3 s after the manual click
hover   isPaused → cleanup clears timer, progress bar animation paused
```

### Timer cleanup — what to say
"I keep exactly one active timer. The effect depends on `currentIndex`, so every slide change cleans up the previous timeout before creating a new one. The same cleanup runs on unmount, so nothing fires after the component is gone. I use the functional updater so the timer never reads a stale index."

### Edge cases and follow-ups
- **Last → first jumps backwards across all slides.** For a seamless infinite loop: clone the first slide at the end; when you reach the clone, wait for `transitionend`, then switch to index 0 **with transition disabled**.
- **Swipe on mobile:** track `touchstart` X and `touchend` X; if the difference is more than 50 px, call next/prev.
- **The pause continues the countdown, it doesn't restart it?** Store `remaining = delay - (Date.now() - startedAt)` on pause and use it on resume.
- **Lazy-load slides:** only load `currentIndex ± 1` images.
- **A11y:** `aria-live="polite"` region announcing "Slide 2 of 4" when not autoplaying; WCAG says autoplay needs a pause control.

### Common mistakes
- `setInterval` with `[]` deps reading `currentIndex` → stale closure, it is stuck at slide 1.
- Forgetting `clearTimeout`/`clearInterval` → double speed after hover in/out.
- Animating `left`/`margin` instead of `transform` → janky (layout on every frame).
- Leaving the animation for the end (the reported miss) — add `transition` on `.hs-track` first.

---

## P5. Sort by a Given Alphabet String

📌 Reported (Reddit, Intern). The full solution is in **[03 → Q2](03-JavaScript-Coding-Questions.md#q2-sort-an-array-according-to-a-given-alphabet-string)**: rank map + comparator, both versions, dry run, complexity.

---

## Shared hooks

These are used by P8, P12, P15 and P17. Write them once in an interview and say "I'll reuse this".

```jsx
import { useEffect, useState } from "react";

// Returns `value` only after it hasn't changed for `delay` ms
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // typing again cancels the previous timer
  }, [value, delay]);
  return debounced;
}

// Calls `handler` when a pointer-down happens outside `ref`
export function useClickOutside(ref, handler) {
  useEffect(() => {
    function onPointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, handler]);
}
```

---

## P6. Searchable and Sortable Data Table

**Priority:** 🟠 High · 🔮 Predicted (TrueFoundry dashboards are tables of models, deployments and logs).

**Problem:** render rows; a search box filters across columns; clicking a header sorts asc → desc → none; show "no results".
**Approach:** state = `query` + `sort {key, dir}`. Rows shown are **derived** with `useMemo` (filter → sort a copy). Numbers and strings sort differently.

```jsx
import { useMemo, useState } from "react";

const COLUMNS = [
  { key: "model", label: "Model" },
  { key: "provider", label: "Provider" },
  { key: "requests", label: "Requests", numeric: true },
  { key: "cost", label: "Cost ($)", numeric: true },
];
const ROWS = [
  { id: 1, model: "gpt-4o", provider: "OpenAI", requests: 1200, cost: 14.2 },
  { id: 2, model: "claude-sonnet", provider: "Anthropic", requests: 900, cost: 11.5 },
  { id: 3, model: "llama-3-70b", provider: "Self-hosted", requests: 3000, cost: 4.1 },
  { id: 4, model: "gemini-flash", provider: "Google", requests: 400, cost: 0.9 },
];

export default function DataTable({ columns = COLUMNS, rows = ROWS }) {
  // 1. State
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: null, dir: null }); // dir: "asc" | "desc" | null

  // 2. Derived
  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => columns.some((c) => String(r[c.key]).toLowerCase().includes(q)))
      : rows;
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const sign = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) =>
      col.numeric ? (a[sort.key] - b[sort.key]) * sign : String(a[sort.key]).localeCompare(String(b[sort.key])) * sign
    );
  }, [rows, columns, query, sort]);

  // 4. Handlers: asc → desc → none
  function toggleSort(key) {
    setSort((s) => {
      if (s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: null };
    });
  }
  const arrow = (key) => (sort.key !== key ? "↕" : sort.dir === "asc" ? "▲" : "▼");

  // 5. JSX
  return (
    <div className="mx-auto max-w-3xl p-4">
      <input
        className="mb-3 w-full rounded-md border px-3 py-2"
        placeholder="Search models, providers…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search table"
      />
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((c) => (
                <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                  <button className="w-full px-3 py-2 text-left font-semibold" onClick={() => toggleSort(c.key)}>
                    {c.label} <span aria-hidden>{arrow(c.key)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-slate-500">No results for "{query}"</td></tr>
            ) : (
              visibleRows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-3 py-2 ${c.numeric ? "text-right tabular-nums" : ""}`}>{r[c.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Edge cases:** empty data · mixed-case search · `null` values (`String(null)`) · sorting must copy (`[...filtered]`) because `sort` mutates · stable keys (`id`, never index).
**Complexity:** filter O(n·c), sort O(n log n) per change; `useMemo` skips the work on unrelated re-renders.
**Follow-ups:** server-side sort/search for 100k rows (send `?sort=cost&dir=desc&q=`) · debounce the search (P8) · virtualize rows ([08](08-Frontend-Performance-and-Architecture.md#2-rendering-10000-records-efficiently)) · column-specific filters · sticky header (`sticky top-0`).

---

## P7. Pagination Component

**Priority:** 🟠 High · 🔮 Predicted (API logs, tables).

**Problem:** reusable `<Pagination page totalPages onPageChange />` showing `‹ 1 … 4 5 6 … 20 ›`.
**Key logic:** always show first and last, the current page ± `siblings`, and "…" where pages are skipped.

```jsx
// Pure function → easy to test
export function getPageItems(page, totalPages, siblings = 1) {
  const totalShown = siblings * 2 + 5; // first, last, current, 2 dots, siblings
  if (totalPages <= totalShown) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, totalPages - 1);
  const items = [1];
  // "…" only when it hides 2+ pages; a single gap shows the page itself
  if (left > 3) items.push("…");
  else for (let p = 2; p < left; p++) items.push(p);
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 2) items.push("…");
  else for (let p = right + 1; p < totalPages; p++) items.push(p);
  items.push(totalPages);
  return items;
}

export default function Pagination({ page, totalPages, onPageChange, siblings = 1 }) {
  if (totalPages <= 1) return null;
  const items = getPageItems(page, totalPages, siblings);
  const btn = "min-w-9 rounded-md border px-3 py-1.5 text-sm disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button className={btn} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-slate-500">…</span>
        ) : (
          <button
            key={it}
            className={`${btn} ${it === page ? "border-indigo-600 bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
            onClick={() => onPageChange(it)}
            aria-current={it === page ? "page" : undefined}
          >
            {it}
          </button>
        )
      )}
      <button className={btn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
    </nav>
  );
}

// Usage with client-side data
// const [page, setPage] = useState(1);
// const PAGE_SIZE = 10;
// const totalPages = Math.ceil(rows.length / PAGE_SIZE);
// const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
// <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

**Dry run:** `getPageItems(5, 20)` → `[1, "…", 4, 5, 6, "…", 20]` · `getPageItems(2, 20)` → `[1, 2, 3, "…", 20]` · `getPageItems(3, 5)` → `[1, 2, 3, 4, 5]`.
**Edge cases:** totalPages 0/1 (render nothing) · page out of range after a filter (reset to 1 when the filter changes) · disabled prev/next at the ends.
**Follow-ups:** offset vs **cursor** pagination (logs that keep growing → cursor, so rows don't shift) · keep the page in the URL (`?page=5`) · page-size selector.

---

## P8. Debounced Search

**Priority:** 🟠 High · 🔮 Predicted (debouncing was asked as theory — 📌 Glassdoor/LinkedIn). Uses [`useDebounce`](#shared-hooks).

**Requirements:** call the API only after typing stops for 400 ms; show loading, error and empty states; **ignore out-of-date responses**; keep the old results visible while loading.

```jsx
import { useEffect, useState } from "react";
import { useDebounce } from "./hooks";

export default function DebouncedSearch() {
  // 1. State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const debouncedQuery = useDebounce(query.trim(), 400);

  // 3. Effect: runs only when the debounced value changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();      // 🔑 cancel stale requests
    setStatus("loading");
    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setResults(data.products);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort(); // new query → old request aborted
  }, [debouncedQuery]);

  // 5. JSX
  return (
    <div className="mx-auto max-w-md p-4">
      <input
        className="w-full rounded-md border px-3 py-2"
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      <p className="mt-2 h-5 text-sm text-slate-500" aria-live="polite">
        {status === "loading" && "Searching…"}
        {status === "error" && <span className="text-red-600">Something went wrong. Try again.</span>}
        {status === "success" && results.length === 0 && `No results for "${debouncedQuery}"`}
      </p>
      <ul className={`mt-2 divide-y rounded-md border ${status === "loading" ? "opacity-60" : ""}`}>
        {results.map((p) => (
          <li key={p.id} className="px-3 py-2">{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Dry run:** type `i`,`ip`,`iph` within 400 ms → each keystroke resets the debounce timer → only `iph` reaches the effect → one request. Type `ipho` while `iph` is in flight → the cleanup aborts `iph` → only the `ipho` result is shown (**no race condition**).
**Follow-ups:** cache results per query (`Map`) · minimum query length · debounce vs `useDeferredValue` (React 18) · TanStack Query does caching and cancellation for you.
**Mistakes:** debouncing the **onChange handler** in a way that makes the input laggy (debounce the value, not the input) · not aborting → an old slow response overwrites a newer one.

---

## P9. Infinite Scrolling

**Priority:** 🟠 High · 🔮 Predicted (API logs list).

**Approach:** put a **sentinel `<div>`** after the list; an `IntersectionObserver` calls `loadMore` when it becomes visible. Use a **ref guard** — a state guard alone can let duplicate loads through, because state updates are async.

```jsx
import { useCallback, useEffect, useRef, useState } from "react";

// Fake paginated API: 95 log rows, 20 per page
function fetchLogs(page) {
  return new Promise((resolve) =>
    setTimeout(() => {
      const start = (page - 1) * 20;
      const items = Array.from({ length: Math.max(0, Math.min(20, 95 - start)) }, (_, i) => ({
        id: start + i + 1,
        text: `Request #${start + i + 1} · gpt-4o · 200 OK`,
      }));
      resolve({ items, hasMore: start + 20 < 95 });
    }, 600)
  );
}

export default function InfiniteLogList() {
  // 1. State
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false); // 🔑 synchronous guard
  const sentinelRef = useRef(null);

  // 4. Handler
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLogs(page);
      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setPage((p) => p + 1);
    } catch {
      setError("Failed to load. ");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  // 3. Effect: observe the sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "200px" } // start loading a bit before the bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // 5. JSX
  return (
    <div className="mx-auto max-w-lg p-4">
      <ul className="divide-y rounded-md border">
        {items.map((it) => (
          <li key={it.id} className="px-3 py-3 font-mono text-sm">{it.text}</li>
        ))}
      </ul>
      {loading && <p className="py-3 text-center text-slate-500">Loading…</p>}
      {error && (
        <p className="py-3 text-center text-red-600">
          {error}<button className="underline" onClick={loadMore}>Retry</button>
        </p>
      )}
      {!hasMore && <p className="py-3 text-center text-slate-500">You've reached the end · {items.length} rows</p>}
      {hasMore && !error && <div ref={sentinelRef} className="h-1" aria-hidden />}
    </div>
  );
}
```

**Edge cases:** the first page doesn't fill the screen (the observer fires again because the sentinel is still visible) · a fast scroll fires twice (ref guard) · error → stop observing (sentinel hidden) + retry · end of data.
**Follow-ups:** why not a `scroll` listener (fires constantly; needs throttle; IntersectionObserver is off the main thread) · 10k+ rows → combine with virtualization · keep scroll position on back navigation · cursor-based API.

---

## P10. Reusable Modal

**Priority:** 🟡 Medium · 🔮 Predicted.

**Requirements:** `open`/`onClose` props · rendered in a **portal** (escapes `overflow:hidden`/`z-index` of parents) · close on Esc and backdrop click (not on clicks inside) · lock body scroll · move focus into the modal and restore it on close · `role="dialog"`, `aria-modal`, `aria-labelledby`.

```jsx
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, footer }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // scroll lock

    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.(); // restore focus
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl outline-none"
        onMouseDown={(e) => e.stopPropagation()} // clicks inside don't close
      >
        <div className="mb-3 flex items-start justify-between">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-xl leading-none">×</button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// Usage
// const [open, setOpen] = useState(false);
// <button onClick={() => setOpen(true)}>Delete deployment</button>
// <Modal open={open} onClose={() => setOpen(false)} title="Delete deployment?"
//   footer={<><button onClick={() => setOpen(false)}>Cancel</button><button className="bg-red-600 text-white">Delete</button></>}>
//   This cannot be undone.
// </Modal>
```

**Follow-ups:** full focus trap (cycle Tab between the first and last focusable elements) · native `<dialog>` with `showModal()` · animate in/out · `onClose` should be memoized (`useCallback`) or the effect re-runs every render.

---

## P11. Tabs Component

**Priority:** 🟡 Medium · 🔮 Predicted (model detail pages: Overview / Logs / Metrics).

```jsx
import { useId, useRef, useState } from "react";

export default function Tabs({ tabs, defaultIndex = 0 }) {
  const [active, setActive] = useState(defaultIndex);
  const baseId = useId();
  const tabRefs = useRef([]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  function onKeyDown(e) {
    const last = tabs.length - 1;
    let next = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div className="mx-auto max-w-xl p-4">
      <div role="tablist" className="flex gap-1 border-b" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => (tabRefs.current[i] = el)}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${i === active ? "border-indigo-600 font-semibold text-indigo-600" : "border-transparent text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`${baseId}-panel-${i}`} aria-labelledby={`${baseId}-tab-${i}`} hidden={i !== active} className="p-4">
          {t.content}
        </div>
      ))}
    </div>
  );
}

// <Tabs tabs={[{ label: "Overview", content: <p>…</p> }, { label: "Logs", content: <p>…</p> }]} />
```

**Follow-ups:** lazy-render panels (`i === active && content`) vs keep them mounted (`hidden`) to preserve state · sync the tab to the URL · controlled version (`activeIndex` + `onChange` props).

---

## P12. Searchable Dropdown

**Priority:** 🟠 High · 🔮 Predicted (a model picker — see [09 → model selector](09-TrueFoundry-Product-Questions.md#s6-model-selection-dropdown)).

**Requirements:** a button opens a list with a search box · filter options · keyboard ↑ ↓ Enter Esc · click outside closes · shows the selected value.

```jsx
import { useMemo, useRef, useState, useCallback } from "react";
import { useClickOutside } from "./hooks";

export default function SearchableDropdown({ options, value, onChange, placeholder = "Select…" }) {
  // 1. State
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);

  // 2. Derived
  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query]
  );
  const selected = options.find((o) => o.value === value);

  // 4. Handlers
  const close = useCallback(() => { setOpen(false); setQuery(""); }, []);
  useClickOutside(rootRef, close);

  function choose(option) {
    onChange(option.value);
    close();
  }
  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && filtered[highlight]) { e.preventDefault(); choose(filtered[highlight]); }
    if (e.key === "Escape") close();
  }

  // 5. JSX
  return (
    <div ref={rootRef} className="relative w-72">
      <button
        className="flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left"
        onClick={() => { setOpen((o) => !o); setHighlight(0); }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "text-slate-400"}>{selected ? selected.label : placeholder}</span>
        <span aria-hidden>▾</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          <input
            autoFocus
            className="w-full border-b px-3 py-2 outline-none"
            placeholder="Search…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
            onKeyDown={onKeyDown}
            aria-label="Filter options"
          />
          <ul role="listbox" className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No matches</li>}
            {filtered.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(o); }}
                className={`cursor-pointer px-3 py-2 text-sm ${i === highlight ? "bg-indigo-50" : ""} ${o.value === value ? "font-semibold" : ""}`}
              >
                {o.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Edge cases:** no matches · highlight index out of range after filtering (reset to 0) · long lists (`max-h` + scroll; virtualize for 1000+) · selecting with the mouse must not blur first (`onMouseDown` + `preventDefault`).
**Follow-ups:** async options (combine with P8) · grouping (by provider) · scroll the highlighted item into view · `aria-activedescendant`.

---

## P13. Todo Application

**Priority:** 🟡 Medium · 🔮 Predicted (classic warm-up).

```jsx
import { useEffect, useState } from "react";

const FILTERS = { all: () => true, active: (t) => !t.done, done: (t) => t.done };

export default function TodoApp() {
  // 1. State (lazy init from localStorage)
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("todos")) ?? []; } catch { return []; }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 3. Persist
  useEffect(() => {
    try { localStorage.setItem("todos", JSON.stringify(todos)); } catch {}
  }, [todos]);

  // 4. Handlers — always return NEW arrays/objects
  function addTodo(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: t, done: false }]);
    setText("");
  }
  const toggle = (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  function saveEdit(id) {
    const t = editText.trim();
    if (t) setTodos((prev) => prev.map((x) => (x.id === id ? { ...x, text: t } : x)));
    setEditingId(null);
  }

  // 2. Derived
  const visible = todos.filter(FILTERS[filter]);
  const remaining = todos.filter((t) => !t.done).length;

  // 5. JSX
  return (
    <div className="mx-auto max-w-md p-4">
      <form onSubmit={addTodo} className="flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs doing?" aria-label="New todo" />
        <button className="rounded-md bg-indigo-600 px-4 text-white disabled:opacity-50" disabled={!text.trim()}>Add</button>
      </form>
      <div className="my-3 flex gap-2 text-sm">
        {Object.keys(FILTERS).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded px-2 py-1 capitalize ${filter === f ? "bg-slate-200 font-semibold" : ""}`}>{f}</button>
        ))}
        <span className="ml-auto text-slate-500">{remaining} left</span>
      </div>
      <ul className="divide-y rounded-md border">
        {visible.length === 0 && <li className="p-3 text-center text-slate-500">Nothing here</li>}
        {visible.map((t) => (
          <li key={t.id} className="flex items-center gap-2 p-3">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} aria-label={`Mark ${t.text} done`} />
            {editingId === t.id ? (
              <input
                autoFocus
                className="flex-1 rounded border px-2 py-1"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(t.id)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(t.id); if (e.key === "Escape") setEditingId(null); }}
              />
            ) : (
              <span onDoubleClick={() => { setEditingId(t.id); setEditText(t.text); }} className={`flex-1 ${t.done ? "text-slate-400 line-through" : ""}`}>{t.text}</span>
            )}
            <button onClick={() => remove(t.id)} aria-label={`Delete ${t.text}`} className="text-red-600">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Edge cases:** blank input · duplicate text (ids, not text, are the keys) · corrupt localStorage (try/catch) · editing to an empty string (keep the old text).
**Follow-ups:** `useReducer` version (actions: add/toggle/remove/edit) · drag to reorder · syncing to an API with optimistic updates and rollback.

---

## P14. Accordion

**Priority:** 🟡 Medium · 🔮 Predicted.

```jsx
import { useId, useState } from "react";

export default function Accordion({ items, allowMultiple = false }) {
  const [openIds, setOpenIds] = useState(() => new Set());
  const baseId = useId();

  function toggle(id) {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-lg divide-y rounded-md border">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium"
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${item.id}`}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>▾</span>
              </button>
            </h3>
            {/* grid-rows trick animates height without measuring */}
            <div id={`${baseId}-${item.id}`} role="region" className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-4 pb-3 text-slate-600">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// <Accordion allowMultiple items={[{ id: "a", title: "What is an AI Gateway?", content: "…" }]} />
```

**Follow-ups:** why a `Set` (O(1) lookup, multiple open) · why `new Set(...)` instead of `prev.add` (state must be a new object) · `<details>/<summary>` native alternative.

---

## P15. Multi-Select Dropdown

**Priority:** 🟡 Medium · 🔮 Predicted (filter logs by several models/providers).

```jsx
import { useCallback, useMemo, useRef, useState } from "react";
import { useClickOutside } from "./hooks";

export default function MultiSelect({ options, selected, onChange, placeholder = "Select models" }) {
  // 1. State
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  useClickOutside(rootRef, useCallback(() => setOpen(false), []));

  // 2. Derived
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  const allFilteredSelected = filtered.length > 0 && filtered.every((o) => selectedSet.has(o.value));

  // 4. Handlers
  function toggle(value) {
    onChange(selectedSet.has(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }
  function toggleAll() {
    const values = filtered.map((o) => o.value);
    onChange(allFilteredSelected ? selected.filter((v) => !values.includes(v)) : [...new Set([...selected, ...values])]);
  }
  function onInputKeyDown(e) {
    if (e.key === "Backspace" && !query && selected.length) onChange(selected.slice(0, -1)); // remove last chip
    if (e.key === "Escape") setOpen(false);
  }

  // 5. JSX
  return (
    <div ref={rootRef} className="relative w-80">
      <div className="flex min-h-10 flex-wrap items-center gap-1 rounded-md border bg-white px-2 py-1" onClick={() => setOpen(true)}>
        {selected.map((v) => (
          <span key={v} className="flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-sm text-indigo-800">
            {options.find((o) => o.value === v)?.label ?? v}
            <button onClick={(e) => { e.stopPropagation(); toggle(v); }} aria-label={`Remove ${v}`}>×</button>
          </span>
        ))}
        <input
          className="min-w-20 flex-1 py-1 outline-none"
          placeholder={selected.length ? "" : placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={onInputKeyDown}
          aria-label="Search options"
        />
      </div>
      {open && (
        <ul role="listbox" aria-multiselectable="true" className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
          {filtered.length > 0 && (
            <li className="cursor-pointer border-b px-3 py-2 text-sm font-medium" onMouseDown={(e) => { e.preventDefault(); toggleAll(); }}>
              {allFilteredSelected ? "Clear all" : "Select all"}
            </li>
          )}
          {filtered.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No matches</li>}
          {filtered.map((o) => (
            <li key={o.value} role="option" aria-selected={selectedSet.has(o.value)} className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50" onMouseDown={(e) => { e.preventDefault(); toggle(o.value); }}>
              <input type="checkbox" readOnly checked={selectedSet.has(o.value)} tabIndex={-1} />
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Edge cases:** "Select all" applies only to the **filtered** options · Backspace removes the last chip · duplicates prevented by the Set · a controlled component (the parent owns `selected`).
**Follow-ups:** max selections · keyboard navigation (as in P12) · show "+3 more" when chips overflow.

---

## P16. Star Rating

**Priority:** 🟡 Medium · 🔮 Predicted.

```jsx
import { useState } from "react";

export default function StarRating({ max = 5, value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value; // hover preview wins over the saved value

  function onKeyDown(e) {
    if (readOnly) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(max, value + 1));
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(1, value - 1));
  }

  return (
    <div
      role="slider"
      aria-label="Rating"
      aria-valuemin={1}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(0)}
      className="inline-flex gap-1 text-3xl"
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          onMouseEnter={() => !readOnly && setHover(star)}
          onClick={() => !readOnly && onChange(star === value ? 0 : star)} // click the same star again → clear
          className={`select-none ${readOnly ? "" : "cursor-pointer"} ${star <= shown ? "text-amber-400" : "text-slate-300"}`}
          aria-hidden
        >
          ★
        </span>
      ))}
      <span className="sr-only">{value} out of {max}</span>
    </div>
  );
}

// const [rating, setRating] = useState(3);
// <StarRating value={rating} onChange={setRating} />
```

**Follow-ups:** half stars (detect the click X position inside the star: `e.nativeEvent.offsetX < width / 2`) · read-only display of averages like 4.3 (a width-percentage overlay).

---

## P17. Autocomplete Typeahead

**Priority:** 🟠 High · 🔮 Predicted. Combines P8 (debounce + abort) with P12 (keyboard list) and adds a **cache** and **match highlighting**.

```jsx
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./hooks";

const cache = new Map(); // query → results (module-level: survives re-renders)

function Highlight({ text, query }) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-yellow-200">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export default function Autocomplete({ onSelect = () => {} }) {
  // 1. State
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query.trim(), 300);
  const listRef = useRef(null);

  // 3. Fetch with cache + abort
  useEffect(() => {
    if (debounced.length < 2) { setSuggestions([]); return; }
    if (cache.has(debounced)) { setSuggestions(cache.get(debounced)); return; } // 🔑 no network
    const controller = new AbortController();
    setLoading(true);
    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(debounced)}&limit=8&select=title`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((data) => {
        const titles = data.products.map((p) => p.title);
        cache.set(debounced, titles);
        setSuggestions(titles);
        setActive(-1);
      })
      .catch((e) => e.name !== "AbortError" && setSuggestions([]))
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [debounced]);

  // Keep the active item visible
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // 4. Handlers
  function select(value) {
    setQuery(value);
    setOpen(false);
    onSelect(value);
  }
  function onKeyDown(e) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1)); }
    if (e.key === "Enter" && active >= 0) { e.preventDefault(); select(suggestions[active]); }
    if (e.key === "Escape") setOpen(false);
  }

  // 5. JSX
  return (
    <div className="relative mx-auto mt-6 w-80">
      <input
        className="w-full rounded-md border px-3 py-2"
        value={query}
        placeholder="Search products…"
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls="ac-list"
        aria-activedescendant={active >= 0 ? `ac-${active}` : undefined}
        aria-autocomplete="list"
      />
      {loading && <span className="absolute right-3 top-2.5 text-xs text-slate-400">…</span>}
      {open && suggestions.length > 0 && (
        <ul id="ac-list" ref={listRef} role="listbox" className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={s}
              id={`ac-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); select(s); }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-3 py-2 text-sm ${i === active ? "bg-indigo-50" : ""}`}
            >
              <Highlight text={s} query={debounced} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Interview talking points:** debounce (fewer calls) · AbortController (no race) · cache (instant back-typing) · min length 2 · `onMouseDown` + `preventDefault` so blur doesn't close the list before the click · `aria-activedescendant` keeps focus in the input.
**Follow-ups:** cache size limit (LRU: delete the oldest `Map` key) · server ranking vs client · trie for a local list · recent searches.

---

## Practice plan

| Day | Build with a timer | Target |
|---|---|---|
| 1 | P2 Tic-Tac-Toe twice (3×3 then N×N + highlight) | ≤ 25 min |
| 2 | P3 then P4 | P4 ≤ 30 min **with** animation |
| 3 | P1 + P5 + subsets on paper, then P8 | — |
| 4 | P6 + P7 together (table with pagination) | 35 min |
| 5 | P12 / P17 + P9 | — |
| 6 | Full [mock interview](11-Full-Mock-Interview.md) | — |
