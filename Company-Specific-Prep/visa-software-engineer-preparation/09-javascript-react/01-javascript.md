# JS 1/2 — JavaScript (reported topics first)

**Easy analogy — event loop = restaurant waiter**: Waiter ek hi hai (single thread). Order le ke kitchen (browser/Node APIs) ko de deta hai aur agle table pe chala jaata hai. Khaana ready hone pe **VIP tray** (microtasks: Promises) pehle serve hota hai, **normal tray** (macrotasks: setTimeout) baad mein.

## 1. `var` vs `let` vs `const` — scope, hoisting, errors (asked in [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/))

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block `{}` | block `{}` |
| Hoisted? | yes, initialised to `undefined` | yes, but in the **TDZ** until declared | same as `let` |
| Re-declare / re-assign | yes / yes | no / yes | no / **no** |
| Error when misused | — | `ReferenceError` (use before declaration) | `TypeError` (assign again) |

```js
function scopes() {
  if (true) { var a = 1; let b = 2; const c = 3; }
  console.log(typeof a, typeof b, typeof c);   // var leaks out of the block
}
scopes();
console.log(hoisted);                           // var is hoisted as undefined
var hoisted = 'x';
try { console.log(tdz); let tdz = 1; } catch (e) { console.log(e.name); }
const k = 1;
try { k = 2; } catch (e) { console.log(e.name); }
const obj = { n: 1 };
obj.n = 2;                                      // const binding, object is still mutable
console.log(obj.n);
```

```text
number undefined undefined
undefined
ReferenceError
TypeError
2
```

**Say**: "Default to `const`, use `let` when re-assigning, avoid `var` — block scope prevents bugs like loop variables leaking."

## 2. Output questions — event loop and closures in loops ([LC-6563900](https://leetcode.com/discuss/post/6563900/visa-frontend-interview-senior-by-anonym-slm8/): "simple output based question on JS")

```js
console.log('1 sync');
setTimeout(() => console.log('4 timeout (macrotask)'), 0);
Promise.resolve().then(() => console.log('3 promise (microtask)'));
console.log('2 sync');
```

```text
1 sync
2 sync
3 promise (microtask)
4 timeout (macrotask)
```

```js
const out = [];
for (var i = 0; i < 3; i++) setTimeout(() => out.push('var ' + i), 0);   // one shared i
for (let j = 0; j < 3; j++) setTimeout(() => out.push('let ' + j), 0);   // a new j per iteration
setTimeout(() => console.log(out.join(', ')), 0);
```

```text
var 3, var 3, var 3, let 0, let 1, let 2
```

**Rule**: all synchronous code first → then **all** microtasks (Promise callbacks, `queueMicrotask`) → then one macrotask (timer, I/O) → microtasks again → … A closure captures the **variable**, not its value at that moment — `let` gives each loop iteration its own variable.

## 3. Callback → Promise → async/await (from scratch)

```js
function getUserCb(id, cb) {                                   // 1. callback style (error-first)
  setTimeout(() => (id > 0 ? cb(null, { id, name: 'Asha' }) : cb(new Error('bad id'))), 10);
}
function getUserPromise(id) {                                  // 2. wrap it in a Promise
  return new Promise((resolve, reject) =>
    getUserCb(id, (err, user) => (err ? reject(err) : resolve(user))));
}
getUserCb(1, (err, u) => {
  console.log('callback:', u.name);
  getUserPromise(1).then((u2) => {
    console.log('promise:', u2.name);
    (async () => {                                             // 3. async/await = Promise with nicer syntax
      try {
        const u3 = await getUserPromise(1);
        console.log('async/await:', u3.name);
        await getUserPromise(-1);
      } catch (e) {
        console.log('caught:', e.message);
      }
    })();
  });
});
```

```text
callback: Asha
promise: Asha
async/await: Asha
caught: bad id
```

A **simplified** Promise "from scratch" (enough to explain the idea — not spec-complete):

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'; this.value = undefined; this.handlers = [];
    const settle = (state, value) => {
      if (this.state !== 'pending') return;                    // settle only once
      this.state = state; this.value = value;
      this.handlers.forEach((h) => queueMicrotask(() => h()));
    };
    try { executor((v) => settle('fulfilled', v), (e) => settle('rejected', e)); }
    catch (e) { settle('rejected', e); }
  }
  then(onOk, onErr) {
    return new MyPromise((resolve, reject) => {
      const run = () => {
        try {
          if (this.state === 'fulfilled') resolve(onOk ? onOk(this.value) : this.value);
          else if (onErr) resolve(onErr(this.value)); else reject(this.value);
        } catch (e) { reject(e); }
      };
      if (this.state === 'pending') this.handlers.push(run); else queueMicrotask(run);
    });
  }
}
new MyPromise((res) => setTimeout(() => res(2), 5))
  .then((x) => x * 10)
  .then((x) => console.log('MyPromise:', x));
```

```text
MyPromise: 20
```

## 4. Fetch data from an API — headers, auth token, timeout, errors ([LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/), [LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/), [JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/))

```js
async function apiGet(url, { token, timeoutMs = 3000, fetchImpl = fetch } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);      // fetch has no default timeout
  try {
    const res = await fetchImpl(url, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },   // token goes in a header
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);               // fetch does NOT reject on 4xx/5xx
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// demo with a fake fetch (no network needed)
const fakeFetch = async (url, opts) => ({
  ok: url.endsWith('/1'),
  status: url.endsWith('/1') ? 200 : 404,
  json: async () => ({ id: 1, auth: opts.headers.Authorization }),
});
(async () => {
  console.log(await apiGet('https://api.example.com/payments/1', { token: 'abc', fetchImpl: fakeFetch }));
  try { await apiGet('https://api.example.com/payments/2', { token: 'abc', fetchImpl: fakeFetch }); }
  catch (e) { console.log('error:', e.message); }
})();
```

```text
{ id: 1, auth: 'Bearer abc' }
error: HTTP 404
```

**What to add when asked**: `POST` with `body: JSON.stringify(data)` + `Content-Type: application/json` · a central API client (or axios **interceptors**) that adds the token and refreshes it on 401 · show loading/error states in the UI · retry only idempotent calls · where the token lives ([Spring 4/5 §3](../05-spring-boot/04-security-authn-authz-jwt.md#where-to-store-the-token-browser)).

## 5. Not reported by name — quick notes

```js
function debounce(fn, ms) {                        // run only after the user stops typing for `ms`
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}
const search = debounce((q) => console.log('search for', q), 50);
search('v'); search('vi'); search('visa');         // only the last call fires

const a = { card: { last4: '1111' } };
const shallow = { ...a };                          // copies the top level only
const deep = structuredClone(a);                   // full copy
a.card.last4 = '9999';
console.log(shallow.card.last4, deep.card.last4);
```

```text
9999 1111
search for visa
```

- **Closure**: a function remembers variables from where it was created (used above by `debounce`).
- **Throttle**: run at most once per interval (scroll handlers). **Debounce**: run after a pause (search box).
- **`this`**: decided by how a function is called; arrow functions take `this` from the surrounding scope.
- **DOM** ([GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/)): the browser's tree of page elements; React updates it efficiently through reconciliation instead of you calling `document.querySelector` everywhere.

**🗣️ Interview mein aise bolo**: "JS single-threaded hai — sync code, phir microtasks (promises), phir macrotasks (timers). API call mein token header mein, timeout AbortController se, aur `res.ok` check zaroori kyunki fetch 404 pe reject nahi karta."

Next: [React →](02-react.md)
