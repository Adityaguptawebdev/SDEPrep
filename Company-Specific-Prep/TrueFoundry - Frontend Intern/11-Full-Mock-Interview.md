# 11 — Full Mock Interview (TrueFoundry Frontend Intern, Round 2)

[← Project and HR](10-Project-and-HR-Questions.md) · [Roadmap](00-Interview-Roadmap.md)

**How to use:** set a timer, attempt **Part 1** (questions only) out loud or on paper/CodeSandbox, then open **Part 2** (model answers). The round mirrors the reported pattern: 60 minutes of **JS + DSA-style JS + React machine coding** ([01](01-Actual-Interview-Experiences.md#what-the-pattern-tells-us)), plus the architecture, product and project rounds you may face.

📌 = question reported at TrueFoundry · 🔁 = a twist of a reported question · 🔮 = predicted.

---

# Part 1 — Questions (don't scroll down yet)

## Round A — JavaScript fundamentals (12 min)

**A1.** 📌 What is the difference between `==` and `===`? What do `null == undefined` and `NaN === NaN` return?

**A2.** 📌 What is throttling? How is it different from debouncing? Give one use case for each.

**A3.** 🔮 Predict the output:

```js
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve()
  .then(() => console.log("p1"))
  .then(() => console.log("p2"));
(async () => {
  console.log("async start");
  await undefined;
  console.log("after await");
})();
console.log("end");
```

**A4.** 🔮 Predict the output and fix it so it prints `0 1 2`:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**A5.** 🔮 What is a closure? Where did you use one in the debounce function?

**A6.** 🔮 `const a = { x: { y: 1 } }; const b = { ...a }; b.x.y = 2;` — what is `a.x.y`? Why?

**A7.** 🔮 `Promise.all` vs `Promise.allSettled` — which one would you use to load 4 independent dashboard widgets, and why?

**A8.** 🔮 What is event delegation? Why is `e.target.closest()` useful there?

## Round B — JavaScript coding (20 min)

**B1.** 📌🔁 Implement `deepClone(obj)`. Then: the object may contain **circular references** and `Date` values. (Interviewer hint if stuck: "WeakSet".)

**B2.** 🔁 Implement `deepEqual(a, b)` that returns `true` if two values are structurally equal (nested objects/arrays). Bonus: handle circular references.

**B3.** 📌🔁 Given `words` and an alphabet string `order`, return `true` if `words` are sorted according to `order`. (Variant of the reported "sort according to a given string".)

**B4.** 📌🔁 Print all subsets of `[1, 2, 2]` **without duplicate subsets**. First explain the recursive approach out loud.

## Round C — React machine coding (35 min)

**C1.** 📌 Build an **N × N Tic-Tac-Toe**:
- N from a dropdown (3–6), two players, turns, winner and draw detection, reset, can't click occupied cells, highlight the winning line.
- Extension (if time): **K in a row to win** (e.g. 4 in a row on a 6×6 board).

**C2.** 📌 (alternative) Build a **Hotstar-style carousel**: thumbnails, prev/next, click a thumbnail, autoplay every 3000 ms, **sliding** animation, and a manual change must restart the 3 s timer. Pause on hover.

## Round D — Frontend architecture (10 min)

**D1.** The AI Gateway logs API can return 10,000+ rows for a time range. How do you show them, and how do you keep the search box fast?

**D2.** A dashboard widget's API sometimes takes 10 seconds and sometimes fails with 429 or 503. Describe the UI and the retry logic.

**D3.** How would you structure a React + TypeScript codebase for a dashboard with Gateway, Logs, Deployments and Settings sections?

## Round E — TrueFoundry product understanding (8 min)

**E1.** In simple words, what is an AI Gateway, and why would a company use one instead of calling OpenAI directly?

**E2.** What is MCP? What would an "MCP servers" page in the TrueFoundry console need to show?

**E3.** Design the "Cost by model" view. What data do you need, which charts and tables, and which edge cases?

**E4.** How would you show a live AI agent run step by step? Polling, SSE or WebSocket?

## Round F — Project discussion (10 min)

**F1.** Tell me about yourself.

**F2.** Walk me through the most complex dashboard you built. What were the API calls, the state, and the hardest part?

**F3.** You wrote "Lighthouse 50 → 75". How did you measure it, what exactly did you change, and what would you do next?

**F4.** Tell me about a bug that only appeared in production.

**F5.** Why TrueFoundry? Do you have questions for us?

---
---

# Part 2 — Model answers

## Round A answers

**A1.** `===` compares type and value without conversion; `==` converts types first. `null == undefined` → `true`; `NaN === NaN` → `false` (use `Number.isNaN` or `Object.is`). Full answer: [02 → == vs ===](02-JavaScript-Fundamentals.md#bonus--vs-).

**A2.** Debounce runs **once after events stop** (search input). Throttle runs **at most once per interval while events continue** (scroll, resize, rapid button clicks). Know both implementations by heart: [02 §15](02-JavaScript-Fundamentals.md#15-debouncing-vs-throttling).

**A3.** Output:

```
start
async start
end
p1
after await
p2
timeout
```

Why: sync first (`start`, `async start` — code before `await` is sync, `end`). Microtasks in queue order: `p1`, then `after await` (queued when `await undefined` ran, before `p2` was queued by `p1`'s `.then`), then `p2`. The macrotask `timeout` comes last.

**A4.** Prints `3 3 3` — `var` is one function-scoped variable, already 3 when the callbacks run. Fixes: use `let` (new binding per iteration), or `setTimeout((j) => console.log(j), 0, i)`, or an IIFE.

**A5.** A closure is a function plus the variables of the scope where it was created. In `debounce`, the returned function closes over `timerId`, so each call can clear the previous timer, and nobody outside can touch it. [02 §3](02-JavaScript-Fundamentals.md#3-closures).

**A6.** `2`. Spread is shallow: `b.x` and `a.x` point to the same inner object. [03 Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone).

**A7.** `Promise.allSettled` — the widgets are independent; one failing API shouldn't blank the other three. Each widget shows its own error and retry. Use `Promise.all` only when all results are required together. [02 §10](02-JavaScript-Fundamentals.md#10-promiseall-vs-promiseallsettled).

**A8.** One listener on a parent handles events from many children via bubbling; `e.target` is the deepest element clicked (maybe an icon inside the row), so `e.target.closest("[data-id]")` walks up to the row you actually care about. [02 §17](02-JavaScript-Fundamentals.md#17-event-delegation).

## Round B answers

**B1.** Full solution with dry run: [03 Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone). What to **say** when given the WeakSet hint: "WeakSet tells me I've visited an object, but to rebuild the cycle I need its copy, so I'll use a WeakMap from original to copy, and register the copy before recursing."

**B2.** `deepEqual` — compare types, then keys recursively; a WeakMap of already-compared pairs handles cycles.

```js
function deepEqual(a, b, seen = new WeakMap()) {
  if (Object.is(a, b)) return true;                          // same ref, same primitive, NaN
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false; // [] vs {}
  if (a instanceof Date) return a.getTime() === b.getTime();

  // cycle guard: if we're already comparing a with b higher up, assume equal here
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k], seen));
}

console.log(deepEqual({ x: [1, { y: 2 }] }, { x: [1, { y: 2 }] })); // true
console.log(deepEqual({ x: [1, 2] }, { x: [1, 3] }));               // false
console.log(deepEqual([], {}));                                     // false
console.log(deepEqual(NaN, NaN));                                   // true
const c1 = { v: 1 }; c1.self = c1;
const c2 = { v: 1 }; c2.self = c2;
console.log(deepEqual(c1, c2));                                     // true
```

Complexity: O(n) over all values; space O(n) for the map and the recursion stack.

**B3.** Verify alien dictionary ([LeetCode 953](https://leetcode.com/problems/verifying-an-alien-dictionary/)) — compare only **neighbours**, O(total characters).

```js
function isSortedByOrder(words, order) {
  const rank = new Map([...order].map((ch, i) => [ch, i]));
  for (let w = 0; w < words.length - 1; w++) {
    const a = words[w], b = words[w + 1];
    let decided = false;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) {
        if (rank.get(a[i]) > rank.get(b[i])) return false;
        decided = true;
        break;
      }
    }
    if (!decided && a.length > b.length) return false; // "apple" before "app" is wrong
  }
  return true;
}
console.log(isSortedByOrder(["hello", "leetcode"], "hlabcdefgijkmnopqrstuvwxyz")); // true
console.log(isSortedByOrder(["word", "world", "row"], "worldabcefghijkmnpqstuvxyz")); // false
console.log(isSortedByOrder(["apple", "app"], "abcdefghijklmnopqrstuvwxyz"));     // false
```

Link to the sorting version: [03 Q2](03-JavaScript-Coding-Questions.md#q2-sort-an-array-according-to-a-given-alphabet-string).

**B4.** Sort first so duplicates are adjacent; in the for-loop recursion, skip a number equal to the previous one **at the same depth**.

```js
function subsetsWithDup(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  function dfs(start, path) {
    result.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue; // 🔑 skip duplicate branch
      path.push(sorted[i]);
      dfs(i + 1, path);
      path.pop();
    }
  }
  dfs(0, []);
  return result;
}
console.log(JSON.stringify(subsetsWithDup([1, 2, 2])));
// [[],[1],[1,2],[1,2,2],[2],[2,2]]
```

**How to explain the recursion orally (the reported follow-up):** "Every element is a yes/no decision, so it's a binary tree of depth n with 2ⁿ leaves; each leaf is a subset. In code I keep a `path`, choose an element, recurse, then pop it to undo the choice — that's backtracking. Time O(n·2ⁿ)." Full notes: [03 Q3](03-JavaScript-Coding-Questions.md#q3-generate-all-subsets-of-an-array).

## Round C answers

**C1.** Full code, CSS, dry run and complexity: [05 P2](05-Machine-Coding-Problems.md#p2-n-x-n-tic-tac-toe).

**Time plan (30 min):** 3 min clarify + state plan → 7 min board grid from a 1-D array → 5 min turns + block occupied cells → 7 min `getWinningLine` → 3 min draw + reset (**do not skip** — the Medium candidate lost these) → 5 min dropdown + winning highlight + talk complexity.

**K-in-a-row extension:**

```js
// Is there a run of k identical marks through `index`? O(k)
function winsWithK(board, n, index, k) {
  const player = board[index];
  const r0 = Math.floor(index / n), c0 = index % n;
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]; // row, column, diagonal, anti-diagonal
  for (const [dr, dc] of directions) {
    let count = 1;
    for (const sign of [1, -1]) {                        // walk both ways
      let r = r0 + dr * sign, c = c0 + dc * sign;
      while (r >= 0 && r < n && c >= 0 && c < n && board[r * n + c] === player) {
        count++;
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (count >= k) return true;
  }
  return false;
}
const b = Array(36).fill(null);
[7, 14, 21, 28].forEach((i) => (b[i] = "X")); // diagonal (1,1)…(4,4) on 6×6
console.log(winsWithK(b, 6, 21, 4)); // true
console.log(winsWithK(b, 6, 21, 5)); // false
```

**C2.** Full code: [05 P4](05-Machine-Coding-Problems.md#p4-hotstar-style-autoplay-carousel). The three things that score: (1) `transition: transform` on the track **from the start**; (2) `setTimeout` in an effect that depends on `currentIndex`, so manual changes restart the timer, with cleanup; (3) functional `setState` so there's no stale index.

## Round D answers

**D1.** Server-side filters + cursor pagination → virtualized table → debounced search (300–400 ms) + AbortController for stale requests → row detail in a drawer, loading bodies lazily → filters in the URL → "N new logs" banner instead of shifting rows. See [09 S3](09-TrueFoundry-Product-Questions.md#s3-display-thousands-of-api-logs) and [08 §2–3](08-Frontend-Performance-and-Architecture.md#2-rendering-10000-records-efficiently).

**D2.** Skeleton → after ~3 s a "taking longer" hint with Cancel → timeout with Retry. 429: respect `Retry-After`, show the countdown. 503: exponential backoff with jitter, max 3 tries, then manual Retry. Keep the last good data visible; per-widget error boundary; never auto-retry non-idempotent actions. See [08 §9](08-Frontend-Performance-and-Architecture.md#9-handling-network-errors-and-retries) and [09 S4](09-TrueFoundry-Product-Questions.md#s4-an-api-request-takes-10-seconds).

**D3.** `components/ui` (generic, typed, accessible) · `features/<gateway|logs|deployments|settings>/{components,hooks,api.ts,types.ts}` · `lib/apiClient.ts` (auth, errors, 401) · server state in React Query keyed by filters · UI state in Zustand · routes compose features · shared formatters for tokens, currency and dates. See [08 §14](08-Frontend-Performance-and-Architecture.md#14-reusable-component-architecture).

## Round E answers

**E1.** One OpenAI-compatible endpoint in front of many providers, giving central keys and access control, rate limits and budgets, routing and fallback, guardrails, and logs with token and cost tracking — without every team re-implementing them. [09 A1](09-TrueFoundry-Product-Questions.md#a1-what-is-an-ai-gateway).

**E2.** MCP is a standard way for agents to use tools; an MCP server exposes tools. The page needs: a server list with health status, each server's tools, auth/connection status (OAuth connect), which teams or agents may use which tools, rate limits, and tool-call logs. [09 A4](09-TrueFoundry-Product-Questions.md#a4-what-is-mcp-and-what-are-mcp-servers).

**E3.** Data: per day × model — requests, input/output tokens, cost. Views: KPI total and change vs the previous period; a stacked bar over time (top 5 + Others); a sortable table with cost share; drill-down to logs. Edge cases: no data, self-hosted models at $0, tiny values, timezone, currency formatting. [09 S2](09-TrueFoundry-Product-Questions.md#s2-show-model-wise-api-usage-and-cost).

**E4.** A step timeline (LLM / tool steps with state, duration, tokens). SSE for one-way updates (WebSocket if the user can send commands); upsert steps by id; on reconnect fetch the full state; close on unmount. [09 S5](09-TrueFoundry-Product-Questions.md#s5-real-time-agent-execution-status).

## Round F answers

**F1.** [10 → Tell me about yourself](10-Project-and-HR-Questions.md#q-tell-me-about-yourself).
**F2.** [10 → Strongest project (Collections Agent)](10-Project-and-HR-Questions.md#q-explain-your-strongest-frontend-project).
**F3.** [10 → Story 1](10-Project-and-HR-Questions.md#story-1--performance-audit-ragaai-denver-allergy-site) — mention honestly that "before" was local and "after" was production, and that TBT got worse → next step: profile long tasks.
**F4.** [10 → Story 2 (Payload default limit of 10)](10-Project-and-HR-Questions.md#story-2--a-silent-data-bug-firstbriq).
**F5.** [10 → Why TrueFoundry](10-Project-and-HR-Questions.md#q-why-truefoundry) + [questions to ask](10-Project-and-HR-Questions.md#questions-to-ask-them).

---

## Self-scoring sheet

| Area | 0 — missed | 1 — partly | 2 — solid |
|---|---|---|---|
| A. Fundamentals (8 Qs) | | | |
| B1 deep clone + cycle | | | |
| B4 subsets — explained recursion out loud | | | |
| C. Machine coding finished **incl. draw/reset/animation** | | | |
| Talked while coding (plan, trade-offs, complexity) | | | |
| D/E. Architecture + product | | | |
| F. Project answers with real numbers + honesty | | | |

**Target before the interview:** C done in ≤ 30 minutes twice in a row, and no 0s anywhere.
