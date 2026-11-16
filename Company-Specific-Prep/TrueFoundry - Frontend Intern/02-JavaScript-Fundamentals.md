# 02 — JavaScript Fundamentals (Q&A)

[← Interview Experiences](01-Actual-Interview-Experiences.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: JS Coding →](03-JavaScript-Coding-Questions.md)

**Format for each topic:** Question → Priority → 🗣️ Hinglish → ✅ Interview answer → Code → Output → Follow-ups → ⚠️ Mistakes.
📌 = reported at TrueFoundry ([sources](01-Actual-Interview-Experiences.md)) · 🔮 = predicted. Node-runnable snippets were run in Node 22.

## Contents

| # | Topic | Priority | Tag |
|---|---|---|---|
| 1 | [var vs let vs const](#1-var-vs-let-vs-const) | High | 🔮 |
| 2 | [Hoisting](#2-hoisting) | High | 🔮 |
| 3 | [Closures](#3-closures) | Critical | 🔮 |
| 4 | [Lexical scope](#4-lexical-scope) | Medium | 🔮 |
| 5 | [Event loop](#5-event-loop) | Critical | 📌 LinkedIn (old) |
| 6 | [Call stack](#6-call-stack) | Medium | 🔮 |
| 7 | [Microtasks vs macrotasks](#7-microtasks-vs-macrotasks) | Critical | 🔮 |
| 8 | [Promises](#8-promises) | High | 🔮 |
| 9 | [async/await](#9-asyncawait) | High | 🔮 |
| 10 | [Promise.all vs Promise.allSettled](#10-promiseall-vs-promiseallsettled) | High | 🔮 |
| 11 | [map, filter, reduce](#11-map-filter-reduce) | High | 🔮 |
| 12 | [Shallow copy vs deep copy](#12-shallow-copy-vs-deep-copy) | Critical | 📌 |
| 13 | [Spread and rest](#13-spread-and-rest) | Medium | 🔮 |
| 14 | [Object references](#14-object-references) | High | 🔮 |
| 15 | [Debouncing vs throttling](#15-debouncing-vs-throttling) | Critical | 📌 Glassdoor, LinkedIn |
| 16 | [Event bubbling and capturing](#16-event-bubbling-and-capturing) | High | 🔮 |
| 17 | [Event delegation](#17-event-delegation) | High | 🔮 |
| 18 | [this keyword](#18-this-keyword) | High | 🔮 |
| 19 | [Destructuring](#19-destructuring) | Medium | 🔮 |
| 20 | [Optional chaining](#20-optional-chaining) | Medium | 🔮 |
| 21 | [Nullish coalescing](#21-nullish-coalescing) | Medium | 🔮 |
| 22 | [setTimeout and setInterval](#22-settimeout-and-setinterval) | High | 🔮 (carousel!) |
| 23 | [Memory leaks](#23-memory-leaks) | Medium | 🔮 |
| ★ | [Bonus: == vs ===](#bonus--vs-) | High | 📌 Glassdoor |

---

## 1. var vs let vs const

**Question:** "What is the difference between `var`, `let` and `const`?" · **Priority:** High

🗣️ **Hinglish:** `var` purane zamane ka **common hall** hai — poore function mein dikhta hai, aur loop ke bahar bhi leak ho jaata hai. `let` aur `const` **cabin** hain — sirf apne `{ }` block ke andar. `const` matlab **variable ko dobara assign nahi kar sakte**, but object ke andar ka saaman badal sakte ho.

✅ **Answer:** "`var` is function-scoped, can be redeclared, and is hoisted with value `undefined`. `let` and `const` are block-scoped, cannot be redeclared in the same scope, and are in the temporal dead zone until their line runs. `const` must be initialised and cannot be reassigned, but if it holds an object, the object itself can still be mutated."

| | var | let | const |
|---|---|---|---|
| Scope | function | block | block |
| Redeclare | ✅ | ❌ | ❌ |
| Reassign | ✅ | ✅ | ❌ |
| Before declaration | `undefined` | ReferenceError (TDZ) | ReferenceError (TDZ) |
| Global var adds to `window` | ✅ | ❌ | ❌ |

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log("var", i));
for (let j = 0; j < 3; j++) setTimeout(() => console.log("let", j));

const config = { model: "gpt" };
config.model = "claude";    // allowed: mutating
// config = {};             // TypeError: Assignment to constant variable.
console.log(config.model);  // claude
```

**Output:** `claude`, then `var 3` ×3, then `let 0`, `let 1`, `let 2`.
Why: one shared `var i` (already 3 when timers run); `let` creates a new binding per iteration.

**Follow-ups:** What is TDZ? · How to fix the `var` loop without `let`? (IIFE or `setTimeout(fn, 0, i)`) · Is `const` object frozen? (No — use `Object.freeze`, shallow.)
⚠️ **Mistakes:** saying `const` makes objects immutable; saying `let` is not hoisted (it is hoisted, but in TDZ).

---

## 2. Hoisting

**Question:** "What is hoisting? What gets hoisted?" · **Priority:** High

🗣️ **Hinglish:** Code chalne se pehle JS ek **attendance** leta hai — saare declarations ko memory mein register kar deta hai. `var` ko seat mil jaati hai but value `undefined`. Function declaration poora ka poora ready. `let/const` ka naam register hai par **"abhi mat chhoona"** (TDZ).

✅ **Answer:** "Before running a scope, JavaScript creates memory for its declarations. Function declarations are hoisted completely, so you can call them before they appear. `var` is hoisted and initialised to `undefined`. `let`, `const` and `class` are hoisted but not initialised — accessing them before the declaration throws a ReferenceError (temporal dead zone). Function expressions and arrow functions follow the rule of the variable they are assigned to."

```js
console.log(a);          // undefined
var a = 5;

console.log(greet());    // hello
function greet() { return "hello"; }

try { console.log(b); } catch (e) { console.log(e.name); } // ReferenceError
let b = 10;

try { sayHi(); } catch (e) { console.log(e.name); }        // TypeError
var sayHi = () => "hi";  // var sayHi is undefined at call time → "not a function"
```

**Follow-ups:** Difference between function declaration and expression? · Are classes hoisted? (Yes, TDZ.)
⚠️ **Mistakes:** "Hoisting physically moves code to the top" — it doesn't; it's memory creation in the creation phase.

---

## 3. Closures

**Question:** "What is a closure? Give a real use." · **Priority:** Critical (debounce, throttle, hooks all use it)

🗣️ **Hinglish:** Closure = function ka **tiffin box**. Function jahan bana tha, wahan ke variables woh apne saath pack karke le jaata hai. Baad mein kahin bhi chalao, tiffin mein wahi variables milenge — aur woh bahar se koi chura nahi sakta (private).

✅ **Answer:** "A closure is a function together with the variables from the scope where it was created. Even after the outer function has returned, the inner function can still read and update those variables. We use closures for data privacy, function factories, memoization, and in debounce and throttle, where the timer id lives in the closure. React hooks also rely on closures — and a stale closure is a common bug when a `useEffect` captures an old state value."

```js
function createCounter() {
  let count = 0;                      // private
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.get());   // 2
console.log(counter.count);   // undefined

function once(fn) {
  let done = false, result;
  return (...args) => (done ? result : ((done = true), (result = fn(...args))));
}
const init = once(() => "initialized");
console.log(init(), init());  // initialized initialized
```

**Follow-ups:** Stale closure in React (`setInterval` reading old state → use functional update or `useRef`) · Closure in a `var` loop · Memory cost of closures.
⚠️ **Mistakes:** saying closures copy values (they keep a **live reference** to the variable).

---

## 4. Lexical scope

**Question:** "What is lexical scope? What is the scope chain?" · **Priority:** Medium

🗣️ **Hinglish:** Scope decide hota hai **code kahan likha hai** usse, kahan call hua usse nahi. Jaise ghar mein cheez dhoondho: pehle apna kamra, phir ghar, phir mohalla (global). Yeh hi **scope chain** hai.

✅ **Answer:** "Lexical scope means a function's access to variables is decided by where it is written in the code, not where it is called. If a variable isn't found in the current scope, JavaScript looks in the outer scope, then the next, up to global — that's the scope chain. Closures exist because of lexical scope."

```js
const level = "global";
function outer() {
  const level = "outer";
  function inner() { return level; }  // looks up where inner is WRITTEN
  return inner;
}
function caller() {
  const level = "caller";
  return outer()();
}
console.log(caller()); // outer
```

**Follow-ups:** Lexical vs dynamic scope · How does `this` differ (dynamic, except arrows).

---

## 5. Event loop

**Question:** "Explain the event loop." · **Priority:** Critical · 📌 Reported in an older TrueFoundry intern report (LinkedIn)

🗣️ **Hinglish:** JS ek hi **chef** hai (single thread). Lambi cooking (timer, fetch) woh **helpers** (Web APIs) ko de deta hai. Helper kaam khatam karke order **counter ki queue** mein rakh deta hai. Chef jab haath khaali karta hai (call stack empty), pehle **VIP queue** (microtasks — promises) poori khaali karta hai, phir normal queue (macrotask — setTimeout) se **ek** order uthata hai.

```
 ┌───────────┐   async work   ┌───────────────┐
 │ CALL STACK│ ─────────────► │ Web APIs      │ timers, fetch, DOM events
 └─────▲─────┘                └──────┬────────┘
       │                             │ done → callback queued
       │      ┌──────────────────────▼───────┐
       │      │ Microtask queue (VIP)        │ promise .then, await, queueMicrotask
       │      ├──────────────────────────────┤
       └──────│ Macrotask queue              │ setTimeout, setInterval, events, I/O
  event loop: └──────────────────────────────┘
  stack empty? → run ALL microtasks → (render) → ONE macrotask → repeat
```

✅ **Answer:** "JavaScript runs on one thread with one call stack. Async work like timers and network requests is handled by the browser's Web APIs. When that work finishes, its callback is queued. The event loop keeps checking: when the call stack is empty, it first runs **all** microtasks — promise callbacks and code after `await` — then the browser may render, and then it takes **one** macrotask like a `setTimeout` callback. Then it repeats. That's why a promise callback runs before a `setTimeout(…, 0)`."

```js
console.log("1 sync");
setTimeout(() => console.log("5 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
queueMicrotask(() => console.log("4 microtask 2"));
console.log("2 sync");
```

**Output:** `1 sync` → `2 sync` → `3 microtask` → `4 microtask 2` → `5 timeout`

**Follow-ups:** Can a microtask loop block rendering? (Yes — infinite microtasks starve the page.) · Where does `requestAnimationFrame` run? (Before paint, after microtasks.) · Is `setTimeout(fn, 0)` really 0 ms? (Minimum delay; ≥ 4 ms when nested.)

---

## 6. Call stack

**Question:** "What is the call stack? What is stack overflow?" · **Priority:** Medium

🗣️ **Hinglish:** **Plates ka stack** — har function call ek plate upar rakhta hai, return hote hi upar wali plate hatti hai (LIFO). Bina base case recursion = plates chhat tak → **stack overflow**.

✅ **Answer:** "The call stack tracks which function is currently running. Calling a function pushes a frame; returning pops it. JavaScript can only run what's on top. Infinite or very deep recursion fills it and throws `RangeError: Maximum call stack size exceeded`. A long synchronous function on the stack blocks the UI, because the event loop can't run anything else."

```js
function a() { b(); console.log("a done"); }
function b() { console.log("in b"); }
a();
// Output: in b → a done      (stack: global → a → b, pop b, pop a)
```

**Follow-ups:** Why does deep clone of a 100k-deep object crash? ([03 Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone)) · How to avoid blocking? (chunk work, Web Worker.)

---

## 7. Microtasks vs macrotasks

**Question:** "Predict the output." (classic) · **Priority:** Critical

✅ **Answer:** "Microtasks are promise reactions, `await` continuations, `queueMicrotask` and `MutationObserver`. Macrotasks are `setTimeout`, `setInterval`, UI events, message events and I/O. After each macrotask, the engine drains the whole microtask queue — including microtasks added while draining — before the next macrotask."

```js
console.log("A");
setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);
Promise.resolve().then(() => {
  console.log("D");
  setTimeout(() => console.log("E"), 0);
});
(async () => {
  console.log("F");
  await null;
  console.log("G");
})();
console.log("H");
```

**Output:** `A F H D G B C E`
**Dry run:** sync → A, F (async fn runs sync until `await`), H. Microtasks: D (queues timer E), G. Macrotask B → its microtask C runs before next macrotask → E.

⚠️ **Mistakes:** forgetting that code **before** the first `await` is synchronous.

---

## 8. Promises

**Question:** "What is a Promise? What are its states?" · **Priority:** High

🗣️ **Hinglish:** Promise = **restaurant ka token**. Abhi khana nahi mila (pending), baad mein ya to khana milega (fulfilled) ya "sorry khatam ho gaya" (rejected). Ek baar decide ho gaya to **badalta nahi** (settled).

✅ **Answer:** "A Promise represents a value that will be available later. It has three states: pending, fulfilled and rejected; once settled it never changes. `.then` handles success, `.catch` handles errors, `.finally` runs either way. `.then` returns a new promise, so we can chain without callback hell, and an error anywhere in the chain jumps to the nearest `.catch`."

```js
const fetchModel = (ok) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (ok ? resolve({ id: "gpt-4o" }) : reject(new Error("503"))), 10)
  );

fetchModel(true)
  .then((m) => m.id.toUpperCase())
  .then((id) => console.log("got", id))
  .catch((e) => console.log("error", e.message))
  .finally(() => console.log("done 1"));

fetchModel(false)
  .then((m) => console.log("never"))
  .catch((e) => console.log("error", e.message));
```

**Output:** `got GPT-4O` → `done 1` → `error 503`

**Follow-ups:** `Promise.race` / `Promise.any` · How to promisify a callback · Unhandled rejections · Write `Promise.all` polyfill (below).

---

## 9. async/await

**Question:** "How does async/await work? How do you handle errors?" · **Priority:** High

🗣️ **Hinglish:** `async/await` promise ka hi **sundar packing** hai. `await` bolta hai "yahan ruk ke result le aao" — but sirf us function ko rokta hai, poore browser ko nahi.

✅ **Answer:** "`async` functions always return a promise. `await` pauses only that function until the promise settles, then continues as a microtask. Errors are handled with `try/catch`. A common mistake is awaiting independent requests one by one — run them in parallel with `Promise.all` instead."

```js
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

async function sequential() {
  const t = Date.now();
  await wait(100); await wait(100);
  return Date.now() - t >= 200;
}
async function parallel() {
  const t = Date.now();
  await Promise.all([wait(100), wait(100)]);
  return Date.now() - t < 190;
}
async function main() {
  console.log("sequential ~200ms:", await sequential());
  console.log("parallel ~100ms:", await parallel());
  try {
    await Promise.reject(new Error("rate limited"));
  } catch (e) {
    console.log("caught:", e.message);
  }
}
main();
```

**Output:** `sequential ~200ms: true` → `parallel ~100ms: true` → `caught: rate limited`

**Follow-ups:** `await` inside `forEach` doesn't wait (use `for...of` or `Promise.all(arr.map(...))`) · top-level await (ES modules).

---

## 10. Promise.all vs Promise.allSettled

**Question:** "Difference between `Promise.all`, `allSettled`, `race`, `any`?" · **Priority:** High (dashboards load many widgets)

✅ **Answer:** "`Promise.all` resolves with all values when **every** promise succeeds, but rejects immediately when **any** one fails. `Promise.allSettled` always waits for all and returns `{status, value | reason}` for each — good for a dashboard where one failed widget shouldn't blank the page. `race` settles with the first one to settle; `any` resolves with the first success and rejects only if all fail."

```js
const ok = (v) => Promise.resolve(v);
const fail = (m) => Promise.reject(new Error(m));

Promise.all([ok("usage"), fail("cost API down"), ok("logs")])
  .then(console.log)
  .catch((e) => console.log("all →", e.message));

Promise.allSettled([ok("usage"), fail("cost API down")]).then((r) =>
  console.log("allSettled →", r.map((x) => x.status).join(","))
);
```

**Output (in this order):** `allSettled → fulfilled,rejected` then `all → cost API down` — the order depends on how many microtask hops each chain needs (the rejection passes through `.then` before reaching `.catch`). Never rely on that order in real code.

**Polyfill (common follow-up):**

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;                     // keep ORDER by index
        if (++done === promises.length) resolve(results);
      }, reject);                           // first failure rejects
    });
  });
}
promiseAll([1, Promise.resolve(2), new Promise((r) => setTimeout(() => r(3), 10))])
  .then((v) => console.log(v)); // [ 1, 2, 3 ]
```

| | All succeed | One fails | Use |
|---|---|---|---|
| `all` | array of values | rejects fast | must-have data together |
| `allSettled` | statuses | still resolves | independent widgets |
| `race` | first settled | first settled | timeout pattern |
| `any` | first success | first success / AggregateError | fastest mirror |

---

## 11. map, filter, reduce

**Question:** "Explain map, filter, reduce — then use them on API data." · **Priority:** High

🗣️ **Hinglish:** `map` = har item ko **badlo** (same length). `filter` = **chhaanto** (kam ya same length). `reduce` = sabko mila ke **ek cheez** banao (total, object, group).

```js
const logs = [
  { model: "gpt-4o", tokens: 1200, cost: 0.012, status: 200 },
  { model: "claude", tokens: 800, cost: 0.006, status: 200 },
  { model: "gpt-4o", tokens: 500, cost: 0.005, status: 429 },
];
const models = logs.map((l) => l.model);
const failed = logs.filter((l) => l.status >= 400);
const costByModel = logs.reduce((acc, l) => {
  acc[l.model] = +((acc[l.model] || 0) + l.cost).toFixed(3);
  return acc;
}, {});
console.log(models);         // [ 'gpt-4o', 'claude', 'gpt-4o' ]
console.log(failed.length);  // 1
console.log(costByModel);    // { 'gpt-4o': 0.017, claude: 0.006 }
```

✅ **Answer:** "`map` returns a new array with each element transformed, `filter` returns a new array with elements that pass a test, and `reduce` folds the array into one value using an accumulator. None of them mutate the original array, which is why they fit React state well. For performance on huge arrays, chaining creates intermediate arrays, so a single `reduce` or loop can be better."

**Follow-ups:** write a `map` polyfill · `forEach` vs `map` (forEach returns undefined) · why always pass an initial value to `reduce` (empty array throws).

```js
Array.prototype.myMap = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) if (i in this) out[i] = cb.call(thisArg, this[i], i, this);
  return out;
};
console.log([1, 2, 3].myMap((x) => x * 2)); // [ 2, 4, 6 ]
```

---

## 12. Shallow copy vs deep copy

📌 Reported (deep clone). Full answer, code, WeakMap and `structuredClone` comparison → **[03 → Q1](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone)**.

**30-second version:** "A shallow copy copies only the first level; nested objects are still shared. Spread, `Object.assign`, `slice` are shallow. A deep copy copies every level — use `structuredClone` or a recursive function with a WeakMap for cycles. `JSON.parse(JSON.stringify())` loses dates, `undefined`, functions, Maps and breaks on cycles."

---

## 13. Spread and rest

**Question:** "Difference between spread and rest?" · **Priority:** Medium

🗣️ **Hinglish:** Same `...`, ulta kaam. **Spread** = dabba **kholna** (items bahar). **Rest** = bache hue items ko ek dabbe mein **bharna**.

```js
const base = { temperature: 0.7, model: "gpt" };
const req = { ...base, model: "claude" };            // spread object (later wins)
console.log(req);                                     // { temperature: 0.7, model: 'claude' }

const sum = (...nums) => nums.reduce((a, b) => a + b, 0); // rest params
console.log(sum(1, 2, 3));                            // 6

const { model, ...rest } = req;                       // rest in destructuring
console.log(model, rest);                             // claude { temperature: 0.7 }
console.log(Math.max(...[4, 9, 2]));                  // 9
```

✅ **Answer:** "Spread expands an iterable or object into individual items — for copying, merging and passing array items as arguments. Rest collects the remaining items into an array or object — in function parameters and destructuring. Rest must be last. Both copies are shallow."

---

## 14. Object references

**Question:** "Why does changing one object change another? Why does React not re-render when I push into state?" · **Priority:** High

🗣️ **Hinglish:** Variable mein object nahi, object ka **ghar ka address** hota hai. `b = a` kiya to address ki photocopy hui, ghar ek hi hai. React `Object.is` se compare karta hai — address same hai to "kuch nahi badla" samajhta hai.

```js
const a = { count: 1 };
const b = a;
b.count = 2;
console.log(a.count);              // 2
console.log({ x: 1 } === { x: 1 }); // false (different addresses)

function update(obj) { obj.count = 99; obj = { count: 0 }; }
update(a);
console.log(a.count);              // 99 (mutation visible, reassignment not)

const items = [1, 2];
const sameRef = items; sameRef.push(3);
console.log(Object.is(items, sameRef)); // true  → React: "no change", may skip render
const newRef = [...items, 4];
console.log(Object.is(items, newRef));  // false → React re-renders
```

✅ **Answer:** "Primitives are copied by value; objects, arrays and functions are stored as references. Assigning or passing an object copies the reference, so mutations are visible through every variable. JavaScript passes arguments by value, but for objects that value is the reference. React compares state with `Object.is`, so mutating and setting the same object can skip a re-render — always create a new object or array."

---

## 15. Debouncing vs throttling

**Question:** "What is throttling? How is it different from debouncing? Implement both." · **Priority:** Critical · 📌 Reported — Glassdoor (Frontend Intern: throttling), LinkedIn (debouncing + throttling)

🗣️ **Hinglish:**
- **Debounce = lift ka darwaza.** Jab tak log aate rahenge, darwaza band hone ka timer **reset** hota rahega. Aakhri banda aane ke X ms baad hi lift chalegi. → Search box: user typing **ruke** tab API call.
- **Throttle = metro ka gate.** Kitna bhi dhakka maaro, gate har X ms mein **ek hi** banda nikalne deta hai. → Scroll/resize: har 200 ms max ek baar.

```
 events:    x x x x x       x x x x x x x x x x
 debounce:            ●(after pause)            ●
 throttle:  ●     ●     ●   ●     ●     ●     ●     (fixed rate)
```

✅ **Answer:** "Both limit how often a function runs. Debounce waits until the events **stop** for a given delay, then runs once — good for search inputs and auto-save. Throttle runs at most once per interval **while events keep coming** — good for scroll, resize, mouse move and rate-limiting button clicks. Both use a closure to keep the timer or the last-run time."

```js
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);                               // 🔑 reset on every call
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {                        // 🔑 allow once per interval
      last = now;
      fn.apply(this, args);
    }
  };
}

// test: 10 calls, 20 ms apart
const d = debounce((v) => console.log("debounced:", v), 50);
const t = throttle((v) => console.log("throttled:", v), 100);
let i = 0;
const id = setInterval(() => {
  d(i); t(i);
  if (++i === 10) clearInterval(id);
}, 20);
```

**Output (approx.):** `throttled: 0`, `throttled: 5`, then `debounced: 9` (and a throttled value around 9 depending on timing) — debounce fires **once**, throttle fires **every ~100 ms**.

**Follow-ups:** leading vs trailing debounce · throttle with trailing call (so the last event isn't lost) · cancel method · debounce in React → `useRef` / `useMemo` so the debounced function isn't recreated each render ([05 → P8](05-Machine-Coding-Problems.md#p8-debounced-search)).
⚠️ **Mistakes:** creating `debounce(fn)` inside the component body on every render (new timer each time → no debouncing); losing `this`/args.

---

## 16. Event bubbling and capturing

**Question:** "Explain event propagation." · **Priority:** High

🗣️ **Hinglish:** Click hone par event pehle **upar se neeche** aata hai (capturing: window → target), phir **neeche se upar** jaata hai (bubbling: target → window). Jaise **office ki complaint** — upar se notice aata hai, phir neeche se reply upar tak jaata hai. Default listeners bubbling phase mein chalte hain.

```
 capture ↓   window → document → div#parent → button   (target)
 bubble  ↑   button → div#parent → document → window
```

```html
<div id="parent"><button id="child">Click</button></div>
<script>
  parent.addEventListener("click", () => console.log("parent capture"), true);
  parent.addEventListener("click", () => console.log("parent bubble"));
  child.addEventListener("click", (e) => {
    console.log("child");
    // e.stopPropagation();   // uncomment → "parent bubble" won't print
  });
</script>
<!-- Output on click: parent capture → child → parent bubble -->
```

✅ **Answer:** "An event travels in three phases: capture from window down to the target, the target phase, then bubble back up. `addEventListener` uses bubbling by default; pass `true` or `{capture: true}` for capture. `stopPropagation` stops further travel; `preventDefault` only stops the browser's default action like a form submit. `focus`, `blur`, `mouseenter` don't bubble."

**Follow-ups:** `stopPropagation` vs `stopImmediatePropagation` · `e.target` vs `e.currentTarget` · React attaches listeners at the root (React 17+).

---

## 17. Event delegation

**Question:** "What is event delegation and why use it?" · **Priority:** High (tables, logs list)

🗣️ **Hinglish:** Har student ko alag phone dene ki jagah **class monitor** ko ek phone do — woh dekh lega kis bachche ki baat hai. Ek parent listener, `e.target` se pata karo kaun click hua.

```html
<ul id="models">
  <li data-id="gpt">GPT</li>
  <li data-id="claude">Claude</li>
</ul>
<script>
  document.getElementById("models").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");   // works even if <li> has inner spans
    if (!li) return;
    console.log("selected", li.dataset.id);
  });
  // a new <li> added later works automatically
</script>
```

✅ **Answer:** "Instead of attaching a listener to every child, I attach one to the parent and use `event.target` — usually with `closest()` — to find which child was clicked. It relies on bubbling. Benefits: fewer listeners and less memory, and items added later work automatically. It doesn't work for events that don't bubble, like `focus` (use `focusin`)."

---

## 18. this keyword

**Question:** "What is `this` in different cases?" · **Priority:** High

🗣️ **Hinglish:** `this` = **"bulaane wala kaun hai"** — function kaise call hua, us pe depend. Arrow function ka apna `this` nahi hota — woh **bahar wale ka** `this` udhaar leta hai.

| Call style | `this` |
|---|---|
| `obj.method()` | `obj` |
| plain `fn()` | `undefined` (strict / modules) or `window` (sloppy) |
| `new Fn()` | new object |
| `fn.call(x)` / `apply` / `bind(x)` | `x` |
| arrow function | `this` of the outer scope (fixed) |
| DOM listener (normal fn) | the element (`currentTarget`) |

```js
"use strict";
const gateway = {
  name: "TF",
  normal() { return this?.name; },
  arrow: () => typeof this,          // module/outer this, not gateway
  delayed() { setTimeout(() => console.log("arrow in method:", this.name), 0); },
};
console.log(gateway.normal());       // TF
const loose = gateway.normal;
console.log(loose());                // undefined (lost this)
console.log(gateway.normal.call({ name: "Other" })); // Other
const bound = gateway.normal.bind(gateway);
console.log(bound());                // TF
gateway.delayed();
```

**Output (last line, async):** `arrow in method: TF`

✅ **Answer:** "`this` is decided by how a function is called: the object before the dot, the new instance with `new`, an explicit value with `call/apply/bind`, or `undefined` in strict mode for a plain call. Arrow functions don't have their own `this`; they use the surrounding one, which is why they're handy in callbacks and why they shouldn't be used as object methods."

**Follow-ups:** polyfill `bind` · `call` vs `apply` vs `bind` · why class methods lose `this` when passed as callbacks.

---

## 19. Destructuring

```js
const res = { data: { model: "gpt-4o", usage: { tokens: 1200 } }, status: 200 };
const { data: { model, usage: { tokens } }, status: code = 500, region = "us" } = res;
console.log(model, tokens, code, region);   // gpt-4o 1200 200 us

const [first, , third = "none", ...others] = ["a", "b"];
console.log(first, third, others);          // a none []

let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);                          // 2 1
```

🗣️ **Hinglish:** Object/array ke dabbe se cheezein **naam se nikaal ke** seedha variable mein rakhna. Default value tab lagti hai jab value `undefined` ho (not `null`).

✅ **Answer:** "Destructuring unpacks values from arrays by position and from objects by key into variables. It supports renaming, default values (used only for `undefined`), nesting and rest. In React we use it for props and for `useState`'s `[value, setValue]`."

⚠️ **Mistake:** destructuring a nested key when the parent is `undefined` → TypeError. Use defaults: `const { usage: { tokens } = {} } = data`.

---

## 20. Optional chaining

```js
const response = { data: { models: [{ name: "gpt" }] } };
console.log(response.data?.models?.[0]?.name);   // gpt
console.log(response.error?.message);            // undefined (no crash)
console.log(response.onDone?.());                // undefined (fn may not exist)
```

🗣️ **Hinglish:** `?.` = **"hai to aage jao, nahi to chupchaap undefined"**. API ka adha-adhoora data aaye to crash nahi hoga.

✅ **Answer:** "`?.` stops and returns `undefined` if the value on its left is `null` or `undefined`, instead of throwing. It works for properties, bracket access and function calls. Don't overuse it — if a value must exist, hiding the bug with `?.` makes debugging harder."

---

## 21. Nullish coalescing

```js
const settings = { retries: 0, label: "", timeout: null };
console.log(settings.retries || 3);   // 3   ← wrong! 0 is valid
console.log(settings.retries ?? 3);   // 0   ✅
console.log(settings.label ?? "N/A"); // (empty string)
console.log(settings.timeout ?? 30);  // 30
```

🗣️ **Hinglish:** `||` har **falsy** (0, "", false) ko "khaali" maan leta hai. `??` sirf `null`/`undefined` ko khaali maanta hai. Token count `0` ya cost `0` dikhana ho to `??` use karo.

✅ **Answer:** "`??` returns the right side only when the left is `null` or `undefined`, while `||` falls back on any falsy value including `0`, `''` and `false`. For numbers like retries, cost or token count, `??` is the correct default. `??=` assigns only if the value is nullish."

---

## 22. setTimeout and setInterval

**Question:** "Difference between setTimeout and setInterval? How do you clean them up in React?" · **Priority:** High (carousel autoplay — [P3](05-Machine-Coding-Problems.md#p3-image-carousel-with-thumbnails), [P4](05-Machine-Coding-Problems.md#p4-hotstar-style-autoplay-carousel))

🗣️ **Hinglish:** `setTimeout` = **ek baar ka alarm**. `setInterval` = **roz ka alarm**. Component hat gaya aur alarm band nahi kiya → bajta rahega (memory leak + "state update on unmounted" bugs).

```js
const id = setInterval(() => console.log("tick"), 100);
setTimeout(() => { clearInterval(id); console.log("stopped"); }, 350);

// recursive setTimeout: next run is scheduled only after current finishes
let n = 0;
function poll() {
  console.log("poll", ++n);
  if (n < 3) setTimeout(poll, 100);
}
poll();
```

**Output (approx.):** `poll 1`, `tick`, `poll 2`, `tick`, `poll 3`, `tick`, `stopped`

✅ **Answer:** "`setTimeout` runs a callback once after at least the delay; `setInterval` repeats every delay. Both return an id we clear with `clearTimeout`/`clearInterval`. The delay is a minimum, not a guarantee — the callback waits for the call stack and microtasks. For polling an API I prefer recursive `setTimeout`, so a slow request doesn't overlap the next one. In React I start timers in `useEffect` and clear them in the cleanup function."

```jsx
useEffect(() => {
  if (!isPlaying) return;
  const id = setInterval(() => setIndex((i) => (i + 1) % total), 3000); // functional update avoids stale closure
  return () => clearInterval(id);                                       // cleanup
}, [isPlaying, total]);
```

**Follow-ups:** Why does the timer drift? · Background tabs throttle timers to ~1 s · How to pause on hover / tab hidden (`visibilitychange`).

---

## 23. Memory leaks

**Question:** "What causes memory leaks in a frontend app? How do you find them?" · **Priority:** Medium

🗣️ **Hinglish:** Memory leak = **ghar se nikle par nal khula chhod diya**. Component chala gaya but uska timer, listener, subscription abhi bhi chal raha hai aur purani memory pakad ke baitha hai.

| Cause | Fix |
|---|---|
| Timers not cleared | `clearInterval` in `useEffect` cleanup |
| `window`/`document` listeners not removed | `removeEventListener` in cleanup |
| WebSocket / EventSource left open | `.close()` in cleanup |
| Fetch resolving after unmount | `AbortController.abort()` in cleanup |
| Growing global arrays / caches | cap size (LRU), use `WeakMap` for object keys |
| Detached DOM nodes kept in variables | null the reference |
| Closures holding big data | don't capture big objects unnecessarily |

```jsx
useEffect(() => {
  const controller = new AbortController();
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener("resize", onResize);
  fetch("/api/usage", { signal: controller.signal }).then((r) => r.json()).then(setUsage).catch(() => {});
  return () => {
    window.removeEventListener("resize", onResize);
    controller.abort();
  };
}, []);
```

✅ **Answer:** "A memory leak is memory that is no longer needed but can't be garbage-collected because something still references it. In React apps the usual causes are timers, event listeners, sockets and subscriptions that aren't cleaned up when a component unmounts. I fix them with the `useEffect` cleanup function and `AbortController`. To find them I use Chrome DevTools → Memory → heap snapshots, compare before and after navigating, and look for detached DOM nodes."

---

## Bonus: == vs ===

**Question:** "Difference between `==` and `===`?" · **Priority:** High · 📌 Reported — Glassdoor (Frontend Developer Intern)

🗣️ **Hinglish:** `===` **strict guard** hai — type aur value dono same chahiye. `==` **dheela guard** — pehle type badal ke (coercion) phir compare karta hai, isliye ajeeb results aate hain.

```js
console.log(5 == "5");            // true  (string → number)
console.log(5 === "5");           // false
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(0 == "");             // true
console.log(0 == false);          // true
console.log(NaN == NaN);          // false
console.log(Object.is(NaN, NaN)); // true
console.log([] == false);         // true  ([] → "" → 0)
console.log({} === {});           // false (different references)
```

✅ **Answer:** "`===` checks value and type without conversion. `==` converts the operands to a common type first, which gives confusing results like `0 == ''` being true. I always use `===`; the one common exception is `value == null`, which checks for both `null` and `undefined` in one go. `NaN` is not equal to anything, even itself — use `Number.isNaN` or `Object.is`. For objects, both compare references, not contents."

**Follow-ups:** What does `Object.is` do differently? (`NaN` equals `NaN`; `+0` ≠ `-0`) · How do you compare two objects deeply? (recursive compare, similar to [deep clone](03-JavaScript-Coding-Questions.md#q1-implement-deep-clone)).
