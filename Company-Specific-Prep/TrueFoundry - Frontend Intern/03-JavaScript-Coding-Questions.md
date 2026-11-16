# 03 — JavaScript Coding Questions (all 📌 Reported)

[← JS Fundamentals](02-JavaScript-Fundamentals.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: React Q&A →](04-React-Interview-Questions.md)

All three questions here were **actually reported** ([sources](01-Actual-Interview-Experiences.md#master-list-of-reported-questions)). Every code block was run in Node 22 and the outputs in the comments are real.

## Contents

- [Q1. Implement deep clone](#q1-implement-deep-clone)
  - [Concepts: shallow vs deep copy](#concepts-shallow-vs-deep-copy)
  - [Basic implementation](#basic-implementation)
  - [Advanced implementation with circular references](#advanced-implementation-with-circular-references)
  - [structuredClone and JSON method](#structuredclone-and-json-method)
  - [Dry run, edge cases, complexity, follow-ups](#q1-dry-run)
- [Q2. Sort an array according to a given alphabet string](#q2-sort-an-array-according-to-a-given-alphabet-string)
- [Q3. Generate all subsets of an array](#q3-generate-all-subsets-of-an-array)

---

## Q1. Implement deep clone

**Question:** "Write a function `deepClone(obj)` that returns a fully independent copy of an object. Then: what if the object has circular references?"
**Priority:** 🔴 Critical · 📌 Reported — Reddit (Intern, Oct 2025), Medium (Senior, Oct 2025, with circular twist + WeakSet hint), Glassdoor (Intern).

### Concepts: shallow vs deep copy

**Simple Hinglish Explanation:**
Socho tumhare paas ek **almirah** hai jisme drawers hain, aur drawers ke andar dabbe hain.
- **Shallow copy** = naya almirah le aaye, but drawers ke andar **wahi purane dabbe** rakh diye. Naye almirah ke dabbe mein kuch badlo → purane almirah mein bhi badal gaya, kyunki dabba ek hi hai.
- **Deep copy** = naya almirah, naye drawers, **naye dabbe** — har level ka naya saaman. Ab koi connection nahi.

```
 original ──► { name:"A", address ─────────┐ }
                                           ▼
 shallow  ──► { name:"A", address ──► { city:"Pune" }   ← SAME inner object
 
 deep     ──► { name:"A", address ──► { city:"Pune" }   ← NEW inner object
```

**Interview-Ready Answer:**
"A shallow copy creates a new top-level object, but nested objects are still shared by reference. A deep copy recursively copies every level, so the copy and the original share nothing. Object spread and `Object.assign` are shallow: they copy only the first level of properties, and if a property holds an object, they copy the **reference** to it, not the object itself."

```js
const user = { name: "Aditya", address: { city: "Pune" } };
const shallow = { ...user };
shallow.name = "Rahul";            // top level: independent
shallow.address.city = "Delhi";    // nested: SHARED
console.log(user.name);            // Aditya
console.log(user.address.city);    // Delhi   ← original changed!
```

**Why spread fails:** spread does `copy[key] = original[key]` for each own key. For `address`, the value is a reference (memory address), so both objects point to the same inner object.

### Basic implementation

Say this approach first (2 minutes), then improve:

1. If value is a primitive or `null` → return it (primitives are copied by value).
2. If it is an array → make `[]`, else make `{}`.
3. For every own key → `copy[key] = deepClone(value[key])` (recursion handles nesting).

```js
function deepCloneBasic(value) {
  // 1. Base case: primitives and null are returned as they are
  if (value === null || typeof value !== "object") return value;

  // 2. Arrays need [] so that .length, .map etc. still work
  const copy = Array.isArray(value) ? [] : {};

  // 3. Recurse into every own key
  for (const key of Object.keys(value)) {
    copy[key] = deepCloneBasic(value[key]);
  }
  return copy;
}

const a = { x: 1, nested: { y: [1, 2, { z: 3 }] } };
const b = deepCloneBasic(a);
b.nested.y[2].z = 99;
console.log(a.nested.y[2].z);        // 3
console.log(Array.isArray(b.nested.y)); // true
```

**Problem with the basic version:**

```js
const obj = { a: 1 };
obj.self = obj;          // circular reference
// deepCloneBasic(obj)  → RangeError: Maximum call stack size exceeded
```

It also turns a `Date` into `{}` and a `Map` into `{}`.

### Advanced implementation with circular references

**Simple Hinglish Explanation:**
Circular reference matlab object khud ko point karta hai — jaise do **aaine (mirror)** aamne-saamne: image ke andar image ke andar image… recursion kabhi khatam nahi hota.
Fix: ek **register (diary)** rakho — "yeh original object maine pehle copy kar liya hai, aur uski copy yeh hai". Dobara mile to nayi copy mat banao, diary se purani copy de do.
Yeh diary = **`WeakMap`** (original → copy).

**Interview-Ready Answer:**
"I keep a `WeakMap` from each original object to its copy. Before cloning an object, I check the map: if it is already there, I return the stored copy instead of recursing again. That stops infinite recursion and it also keeps the same shape — if the original points to itself, the clone points to **itself**, not back to the original. I register the copy in the map **before** recursing into children, because a child might point back to the parent."

**Why WeakMap, and not Set / Map / WeakSet?**

| Option | Detects cycle? | Gives back the copy? | Lets GC free memory? |
|---|---|---|---|
| `Set` (the Medium candidate's first try) | ✅ | ❌ — you know you've seen it, but you don't have its copy | ❌ holds strong refs |
| `WeakSet` (the hint he got) | ✅ | ❌ — same issue; you can stop or throw, but you can't rebuild the cycle | ✅ |
| `Map` | ✅ | ✅ | ❌ |
| **`WeakMap`** | ✅ | ✅ | ✅ keys are held weakly |

> 💡 If the interviewer gives the **WeakSet** hint, say: "WeakSet tells me I've already visited this object. To rebuild the same cycle in the clone, I need the copy too, so I'll use a WeakMap from original to copy." That shows you understood the hint, not just used it.

```js
function deepClone(value, seen = new WeakMap()) {
  // 1. Primitives, null and functions are returned as they are
  if (value === null || typeof value !== "object") return value;

  // 2. 🔑 Already cloned? Return that copy (handles circular references)
  if (seen.has(value)) return seen.get(value);

  // 3. Special built-in objects
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (value instanceof Map) {
    const mapCopy = new Map();
    seen.set(value, mapCopy);
    value.forEach((v, k) => mapCopy.set(deepClone(k, seen), deepClone(v, seen)));
    return mapCopy;
  }

  if (value instanceof Set) {
    const setCopy = new Set();
    seen.set(value, setCopy);
    value.forEach((v) => setCopy.add(deepClone(v, seen)));
    return setCopy;
  }

  // 4. Arrays and plain/class objects (keep the prototype)
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));

  // 5. 🔑 Register BEFORE recursing, so a child that points back finds it
  seen.set(value, copy);

  // 6. Copy string keys and symbol keys
  const keys = [...Object.keys(value), ...Object.getOwnPropertySymbols(value)];
  for (const key of keys) {
    copy[key] = deepClone(value[key], seen);
  }
  return copy;
}

// --- Tests ---
const original = {
  name: "TrueFoundry",
  tags: ["ai", "gateway"],
  meta: { created: new Date("2025-10-01"), re: /llm/gi },
  models: new Map([["gpt", { cost: 1 }]]),
  ids: new Set([1, 2]),
  [Symbol("id")]: 7,
};
original.self = original;                 // circular
original.tags.push(original.meta);        // shared reference inside

const copy = deepClone(original);
console.log(copy !== original);                     // true
console.log(copy.self === copy);                    // true  (cycle rebuilt in the copy)
console.log(copy.tags[2] === copy.meta);            // true  (shared ref kept as shared)
console.log(copy.meta.created instanceof Date);     // true
console.log(copy.meta.created !== original.meta.created); // true
console.log(copy.models.get("gpt") !== original.models.get("gpt")); // true
console.log(copy.ids.has(2));                       // true
console.log(Object.getOwnPropertySymbols(copy).length); // 1
```

<a id="q1-dry-run"></a>
### Dry run

Input: `const obj = { a: 1, b: { c: 2 } }; obj.b.parent = obj;`

```
call deepClone(obj)            seen = {}
 ├─ obj is object, not in seen
 ├─ copy0 = {}                  seen = { obj → copy0 }
 ├─ key "a": deepClone(1) → 1  (primitive)          copy0 = { a:1 }
 └─ key "b": deepClone(obj.b)
     ├─ not in seen → copy1 = {}   seen = { obj→copy0, obj.b→copy1 }
     ├─ key "c": deepClone(2) → 2                    copy1 = { c:2 }
     └─ key "parent": deepClone(obj)
          └─ 🔑 obj IS in seen → return copy0 (no recursion)
        copy1 = { c:2, parent: copy0 }
   copy0 = { a:1, b: copy1 }
result: copy0.b.parent === copy0  ✅ (points to the copy, not the original)
```

### structuredClone and JSON method

**`structuredClone(value)`** — built into browsers and Node 17+. It uses the *structured clone algorithm* (the same one used by `postMessage`). It handles nested objects, arrays, `Date`, `Map`, `Set`, `RegExp`, typed arrays, `Blob`/`File` and **circular references**.

```js
const s = { d: new Date(0), m: new Map([[1, 2]]) };
s.self = s;
const sc = structuredClone(s);
console.log(sc.self === sc, sc.d instanceof Date, sc.m.get(1)); // true true 2

const j = JSON.parse(JSON.stringify({ d: new Date(0), u: undefined, f() {}, n: NaN }));
console.log(j); // { d: '1970-01-01T00:00:00.000Z', n: null }
```

| | `JSON.parse(JSON.stringify(x))` | `structuredClone(x)` | Custom `deepClone` |
|---|---|---|---|
| Nested objects / arrays | ✅ | ✅ | ✅ |
| `Date` | ❌ becomes a **string** | ✅ | ✅ |
| `Map`, `Set` | ❌ become `{}` | ✅ | ✅ (we coded it) |
| `undefined`, functions, symbols | ❌ **dropped** | ❌ functions **throw** `DataCloneError` | ✅ kept (functions shared) |
| `NaN`, `Infinity` | ❌ become `null` | ✅ | ✅ |
| Circular refs | ❌ **throws** TypeError | ✅ | ✅ (WeakMap) |
| Class prototype | ❌ lost | ❌ lost (plain object back) | ✅ kept |
| DOM nodes | ❌ | ❌ throws | ❌ (don't) |
| Getters/setters | runs the getter, stores value | runs getter, stores value | runs getter, stores value |

**Limitations of `structuredClone`:** cannot clone functions, DOM nodes or `Error` subclasses' custom fields reliably; **drops the prototype** (class instances come back as plain objects); drops property descriptors, getters/setters and symbol keys.

### Edge cases

| Input | Expected |
|---|---|
| `null`, `undefined`, number, string | returned as is |
| `[]`, `{}` | new empty array / object |
| array with holes / objects inside | each object copied |
| circular / shared references | cycle and sharing preserved in the copy |
| `Date`, `RegExp`, `Map`, `Set` | real copies, not `{}` |
| functions | returned as the same function (cannot truly clone a closure) |
| very deep object (100k levels) | recursion → stack overflow; mention an **iterative stack** version as a follow-up |

### Time and space complexity

- **Time:** O(n) — n = total number of values (keys + elements) in the structure; each object is visited once thanks to the map.
- **Space:** O(n) for the copy + O(n) for the WeakMap + O(d) call stack, where d = depth.

### Follow-up questions

1. *Why `WeakMap` and not `Map`?* — WeakMap keys don't stop garbage collection; after cloning, the map can be freed. (Since it's local to one call, a `Map` also works — say this honestly.)
2. *Why register the copy before recursing?* — a child may point back to the parent; it must find the copy already in the map.
3. *How do you clone functions?* — you generally don't; closures capture scope. Share the reference.
4. *How to avoid stack overflow on a very deep object?* — use an explicit stack/queue (iterative DFS/BFS).
5. *Shallow copy methods?* — `{...obj}`, `Object.assign({}, obj)`, `arr.slice()`, `[...arr]`, `Array.from(arr)`.
6. *When does React need deep copy?* — almost never; you copy **only the path you change** (`{...state, user: {...state.user, name}}`). See [02 → Object references](02-JavaScript-Fundamentals.md#14-object-references).

### Common mistakes

- `typeof null === "object"` → forgetting the `null` check crashes on `Object.keys(null)`.
- Using `{}` for arrays → result has no `length`/`map`.
- Saving to the map **after** the loop → infinite recursion still happens.
- Using `for...in` without `hasOwnProperty` → copies inherited keys.
- Saying "JSON.stringify is a deep clone" without its limits.

---

## Q2. Sort an array according to a given alphabet string

**Question:** "You are given an array of words and a string `order` that defines a new alphabet. Sort the array according to that alphabet."
**Priority:** 🟠 High · 📌 Reported — Reddit (Intern, Oct 2025).

> The exact wording was not visible to me. Two versions exist; **ask which one**: (A) sort a list of **words** by a custom alphabet (most likely — "sort an array"), or (B) sort the **characters** of a string by a given order ([LeetCode 791](https://leetcode.com/problems/custom-sort-string/)). Both are below.

**Simple Hinglish Explanation:**
Normal dictionary mein `a < b < c`. Yahan interviewer apni **nayi ABCD** deta hai, jaise `order = "cba"` matlab `c` sabse pehle. Jaise **school assembly ki line** — teacher bolti hai "pehle Red house, phir Blue, phir Green". Har letter ka **rank** nikaal lo (Map mein), phir dictionary jaise compare karo: pehla alag letter dekho, jiska rank chhota woh pehle. Agar ek word doosre ka prefix hai (`"ca"` vs `"cab"`), chhota word pehle.

**Interview-Ready Answer:**
"I first build a map from each character to its position in `order`, so lookup is O(1). Then I sort with a custom comparator that works like dictionary comparison: walk both words together, and at the first different character return the difference of their ranks. If one word is a prefix of the other, the shorter one comes first. I copy the array before sorting because `sort` mutates in place."

```js
function sortByCustomOrder(words, order) {
  // 1. rank of every character in the new alphabet: O(k)
  const rank = new Map();
  for (let i = 0; i < order.length; i++) rank.set(order[i], i);

  // characters not in `order` go after all known ones, in normal order
  const getRank = (ch) => (rank.has(ch) ? rank.get(ch) : order.length + ch.charCodeAt(0));

  // 2. dictionary-style comparator
  const compare = (a, b) => {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) return getRank(a[i]) - getRank(b[i]); // 🔑 first difference decides
    }
    return a.length - b.length; // prefix → shorter first
  };

  return [...words].sort(compare); // copy, don't mutate input
}

console.log(sortByCustomOrder(["abc", "bca", "cab", "ca"], "cba"));
// [ 'ca', 'cab', 'bca', 'abc' ]
console.log(sortByCustomOrder(["apple", "app", "banana"], "bac"));
// [ 'banana', 'app', 'apple' ]
```

**Dry run** — `words = ["abc","bca","cab","ca"]`, `order = "cba"` → ranks `c:0, b:1, a:2`

```
compare("abc","bca") → 'a'(2) vs 'b'(1) → 2-1 = +1  → "bca" first
compare("cab","ca")  → c=c, a=a, prefix → 3-2 = +1 → "ca" first
compare("ca","bca")  → 'c'(0) vs 'b'(1) → -1        → "ca" first
final: ca(starts c) , cab(c) , bca(b) , abc(a)
```

**Version B — sort characters of a string by order (LC 791), counting approach O(n + k):**

```js
function customSortString(order, s) {
  const count = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  let result = "";
  for (const ch of order) {             // order chars first, in order
    if (count[ch]) { result += ch.repeat(count[ch]); delete count[ch]; }
  }
  for (const ch in count) result += ch.repeat(count[ch]); // leftovers
  return result;
}
console.log(customSortString("cba", "abcdab")); // cbbaad
```

**Complexity (Version A):** building the map O(k); sorting O(n log n) comparisons × O(L) per comparison → **O(k + n·L·log n)** time, where L = average word length. Space **O(k + n)** (map + copied array).

**Follow-ups:**
- *Check if words are already sorted in this alphabet* → [LeetCode 953 Verifying an Alien Dictionary](https://leetcode.com/problems/verifying-an-alien-dictionary/): compare only neighbours, O(total chars).
- *Case-insensitive?* → lower-case both characters before ranking.
- *Is `Array.prototype.sort` stable?* → yes, since ES2019.
- *Why not use `localeCompare`?* → it uses the real locale alphabet, not a custom one.

**Common mistakes:** `indexOf` inside the comparator (O(k) per lookup — use a Map); forgetting the prefix rule; mutating the input; returning a boolean from the comparator (must return a number).

---

## Q3. Generate all subsets of an array

**Question:** "Given an array of integers, print all possible subsets." Example `[1,2,3]` → 8 subsets.
**Priority:** 🟠 High · 📌 Reported — Medium (Oct 2025, Round 2). The candidate used loops; **the interviewer then asked for recursion orally.** Know all three.

**Simple Hinglish Explanation:**
**Thali** ka example: 3 dishes hain — dal, rice, roti. Har dish ke liye sirf do choice: **lo ya mat lo**. 2 × 2 × 2 = **8 thalis** (empty thali bhi ek subset hai). Isliye n items ke `2ⁿ` subsets.

```
                        []                         ← decide 1
               /take 1          \skip 1
            [1]                   []               ← decide 2
          /     \              /      \
       [1,2]    [1]          [2]       []          ← decide 3
       /  \     /  \        /  \      /  \
 [1,2,3][1,2][1,3][1]  [2,3]  [2]  [3]   []        ← leaves = 8 subsets
```

**Interview-Ready Answer:**
"Each element has two choices, include it or not, so there are 2ⁿ subsets. Recursively, I walk index by index: at each index I take the element and recurse, then undo it and recurse without it. When the index reaches n, the current path is one subset. Iteratively, I start with `[[]]` and for every number I add it to a copy of every existing subset. A third way uses bitmasks from 0 to 2ⁿ − 1, where bit i says whether element i is included. All are O(n · 2ⁿ) because there are 2ⁿ subsets and copying each takes up to n."

### 1. Brute force — bitmask

```js
function subsetsBitmask(nums) {
  const n = nums.length, result = [];
  for (let mask = 0; mask < (1 << n); mask++) {      // 0 .. 2^n - 1
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(nums[i]);       // bit i ON → include nums[i]
    }
    result.push(subset);
  }
  return result;
}
console.log(JSON.stringify(subsetsBitmask([1, 2, 3])));
// [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

Mask table for `[1,2,3]`: `000→[]`, `001→[1]`, `010→[2]`, `011→[1,2]`, `100→[3]`, `101→[1,3]`, `110→[2,3]`, `111→[1,2,3]`.

### 2. Recursive / backtracking (take or skip) — the one asked orally

```js
function subsetsRecursive(nums) {
  const result = [], path = [];
  function backtrack(index) {
    if (index === nums.length) {         // decided for every element
      result.push([...path]);            // 🔑 push a COPY
      return;
    }
    path.push(nums[index]);              // choice 1: take
    backtrack(index + 1);
    path.pop();                          // undo (backtrack)
    backtrack(index + 1);                // choice 2: skip
  }
  backtrack(0);
  return result;
}
console.log(JSON.stringify(subsetsRecursive([1, 2, 3])));
// [[1,2,3],[1,2],[1,3],[1],[2,3],[2],[3],[]]
```

**Alternative recursion (for-loop style, gives "sorted by start" order):**

```js
function subsetsBacktrack(nums) {
  const result = [];
  function dfs(start, path) {
    result.push([...path]);               // every node is a subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      dfs(i + 1, path);
      path.pop();
    }
  }
  dfs(0, []);
  return result;
}
console.log(JSON.stringify(subsetsBacktrack([1, 2, 3])));
// [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

### 3. Iterative (cascading) — what the Medium candidate likely did

```js
function subsetsIterative(nums) {
  let result = [[]];
  for (const num of nums) {
    result = [...result, ...result.map((s) => [...s, num])]; // old + (old with num)
  }
  return result;
}
console.log(JSON.stringify(subsetsIterative([1, 2, 3])));
// [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

**Dry run (iterative):**

```
start            [[]]
num = 1 → add 1 to each: [1]          → [[], [1]]
num = 2 → add 2 to each: [2],[1,2]    → [[], [1], [2], [1,2]]
num = 3 → add 3 to each: [3],[1,3],[2,3],[1,2,3]
        → [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]   (8)
```

**Dry run (take/skip recursion), first steps:**

```
bt(0) path=[]   take 1 → path=[1]
 bt(1)          take 2 → path=[1,2]
  bt(2)         take 3 → path=[1,2,3] → bt(3): push [1,2,3]
                pop → [1,2]          → bt(3): push [1,2]
 pop 2 → [1]    bt(2): take 3 → push [1,3]; pop → push [1]
pop 1 → []  ... same for skip-1 branch → [2,3],[2],[3],[]
```

**Complexity (all three):** Time **O(n · 2ⁿ)**, output space **O(n · 2ⁿ)**. Extra space: recursion O(n) stack; bitmask O(1) besides output.

**Follow-ups:**
1. *Array has duplicates, return unique subsets* ([LC 90](https://leetcode.com/problems/subsets-ii/)) → sort first, and in the for-loop version skip `if (i > start && nums[i] === nums[i-1]) continue;`.
2. *Only subsets of size k* (combinations, [LC 77](https://leetcode.com/problems/combinations/)) → stop when `path.length === k`.
3. *Subsets with sum = target* → prune when sum exceeds target (if all positive).
4. *Why push `[...path]` and not `path`?* → `path` is one array that keeps changing; all entries would end up as the same (empty) array.
5. *Max n for bitmask?* → `1 << 31` overflows to negative in JS; for n ≥ 31 use recursion or `2 ** n`.
6. *Generate lazily?* → a generator function `function*` that `yield`s each subset (no big array in memory).

**Common mistakes:** pushing `path` by reference; forgetting the empty subset; forgetting `path.pop()`; claiming O(2ⁿ) time (copying is O(n) each).
