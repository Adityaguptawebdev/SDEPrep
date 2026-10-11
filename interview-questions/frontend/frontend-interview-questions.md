# Frontend Interview Questions — Simple Answers

Short, easy-English answers for frontend interviews (JavaScript, React, Next.js, CSS, browser, testing, tools).

- **Short answer** = what you say first in the interview. The rest is there if they ask "explain more" or "show me code".
- **💡 Hinglish** = a quick desi explanation for the tricky definitions.
- Code examples are small on purpose. Comments like `// 6` show the output.

Questions 1–30 are the common list. Questions 31–62 are **extra important ones** that come up again and again (hoisting, event loop, debounce, throttle, `this`, polyfills, CORS…).

## Contents

**Part 1 — Common questions**

1. [Explain the difference between var, let, and const in JavaScript.](#1-explain-the-difference-between-var-let-and-const-in-javascript)
2. [What are closures in JavaScript and how do you use them?](#2-what-are-closures-in-javascript-and-how-do-you-use-them)
3. [How do you handle asynchronous code using async/await and Promises?](#3-how-do-you-handle-asynchronous-code-using-asyncawait-and-promises)
4. [Explain the virtual DOM in React and how it improves performance.](#4-explain-the-virtual-dom-in-react-and-how-it-improves-performance)
5. [How do you manage state in React using useState and useReducer?](#5-how-do-you-manage-state-in-react-using-usestate-and-usereducer)
6. [Explain the difference between props and state in React.](#6-explain-the-difference-between-props-and-state-in-react)
7. [How do you implement context API for global state management?](#7-how-do-you-implement-context-api-for-global-state-management)
8. [How do you optimize React applications for performance?](#8-how-do-you-optimize-react-applications-for-performance)
9. [Explain the difference between class components and functional components.](#9-explain-the-difference-between-class-components-and-functional-components)
10. [How do you handle forms and validation in React?](#10-how-do-you-handle-forms-and-validation-in-react)
11. [What are React hooks and how do you create custom hooks?](#11-what-are-react-hooks-and-how-do-you-create-custom-hooks)
12. [How do you implement routing in React using react-router-dom?](#12-how-do-you-implement-routing-in-react-using-react-router-dom)
13. [Explain the concept of server-side rendering (SSR) in Next.js.](#13-explain-the-concept-of-server-side-rendering-ssr-in-nextjs)
14. [How do you fetch data in Next.js using getStaticProps and getServerSideProps?](#14-how-do-you-fetch-data-in-nextjs-using-getstaticprops-and-getserversideprops)
15. [Explain the difference between REST APIs and GraphQL.](#15-explain-the-difference-between-rest-apis-and-graphql)
16. [How do you implement API calls and error handling in React?](#16-how-do-you-implement-api-calls-and-error-handling-in-react)
17. [How do you handle authentication and authorization in frontend apps?](#17-how-do-you-handle-authentication-and-authorization-in-frontend-apps)
18. [Explain CSS Grid vs Flexbox and when to use each.](#18-explain-css-grid-vs-flexbox-and-when-to-use-each)
19. [How do you implement responsive design in modern web apps?](#19-how-do-you-implement-responsive-design-in-modern-web-apps)
20. [How do you optimize web performance and reduce load times?](#20-how-do-you-optimize-web-performance-and-reduce-load-times)
21. [Explain Progressive Web Apps (PWAs) and their benefits.](#21-explain-progressive-web-apps-pwas-and-their-benefits)
22. [How do you implement lazy loading and code splitting in React?](#22-how-do-you-implement-lazy-loading-and-code-splitting-in-react)
23. [What are web accessibility standards (WCAG) and how do you implement them?](#23-what-are-web-accessibility-standards-wcag-and-how-do-you-implement-them)
24. [How do you write unit tests in React using Jest and React Testing Library?](#24-how-do-you-write-unit-tests-in-react-using-jest-and-react-testing-library)
25. [Explain end-to-end testing using Cypress or Selenium.](#25-explain-end-to-end-testing-using-cypress-or-selenium)
26. [How do you handle version control and collaboration using Git?](#26-how-do-you-handle-version-control-and-collaboration-using-git)
27. [Explain the difference between npm and yarn.](#27-explain-the-difference-between-npm-and-yarn)
28. [How do you debug JavaScript and React applications effectively?](#28-how-do-you-debug-javascript-and-react-applications-effectively)
29. [Explain the concept of component-driven architecture.](#29-explain-the-concept-of-component-driven-architecture)
30. [Build a complete frontend application that consumes APIs, manages state, and is fully responsive.](#30-build-a-complete-frontend-application-that-consumes-apis-manages-state-and-is-fully-responsive)

**Part 2 — Extra important questions**

31. [What is hoisting and the Temporal Dead Zone (TDZ)?](#31-what-is-hoisting-and-the-temporal-dead-zone-tdz)
32. [Explain the event loop (call stack, microtasks, macrotasks).](#32-explain-the-event-loop-call-stack-microtasks-macrotasks)
33. [What is debouncing? Write a debounce function.](#33-what-is-debouncing-write-a-debounce-function)
34. [What is throttling? How is it different from debouncing?](#34-what-is-throttling-how-is-it-different-from-debouncing)
35. [Explain event bubbling, capturing and event delegation.](#35-explain-event-bubbling-capturing-and-event-delegation)
36. [How does the `this` keyword work? How are arrow functions different?](#36-how-does-the-this-keyword-work-how-are-arrow-functions-different)
37. [What is the difference between call, apply and bind?](#37-what-is-the-difference-between-call-apply-and-bind)
38. [What is the difference between == and ===?](#38-what-is-the-difference-between--and-)
39. [What is the difference between null and undefined? What are truthy and falsy values?](#39-what-is-the-difference-between-null-and-undefined-what-are-truthy-and-falsy-values)
40. [What is the difference between the spread and rest operators?](#40-what-is-the-difference-between-the-spread-and-rest-operators)
41. [What is the difference between a shallow copy and a deep copy?](#41-what-is-the-difference-between-a-shallow-copy-and-a-deep-copy)
42. [Explain Promise.all, Promise.allSettled, Promise.race and Promise.any.](#42-explain-promiseall-promiseallsettled-promiserace-and-promiseany)
43. [What is a prototype and prototypal inheritance?](#43-what-is-a-prototype-and-prototypal-inheritance)
44. [What is currying?](#44-what-is-currying)
45. [What is a polyfill? Write polyfills for map, filter and reduce.](#45-what-is-a-polyfill-write-polyfills-for-map-filter-and-reduce)
46. [What is the difference between localStorage, sessionStorage and cookies?](#46-what-is-the-difference-between-localstorage-sessionstorage-and-cookies)
47. [What is CORS and how do you fix a CORS error?](#47-what-is-cors-and-how-do-you-fix-a-cors-error)
48. [How does useEffect work? Explain the dependency array and cleanup.](#48-how-does-useeffect-work-explain-the-dependency-array-and-cleanup)
49. [What is useRef and when do you use it?](#49-what-is-useref-and-when-do-you-use-it)
50. [What is the difference between useMemo, useCallback and React.memo?](#50-what-is-the-difference-between-usememo-usecallback-and-reactmemo)
51. [Why are keys important in lists? Why not use the index?](#51-why-are-keys-important-in-lists-why-not-use-the-index)
52. [What are controlled and uncontrolled components?](#52-what-are-controlled-and-uncontrolled-components)
53. [What are prop drilling and lifting state up?](#53-what-are-prop-drilling-and-lifting-state-up)
54. [What is a Higher-Order Component (HOC)?](#54-what-is-a-higher-order-component-hoc)
55. [What are Error Boundaries?](#55-what-are-error-boundaries)
56. [Explain the CSS box model.](#56-explain-the-css-box-model)
57. [Explain CSS position: static, relative, absolute, fixed and sticky.](#57-explain-css-position-static-relative-absolute-fixed-and-sticky)
58. [What is CSS specificity?](#58-what-is-css-specificity)
59. [What is the difference between display: none, visibility: hidden and opacity: 0?](#59-what-is-the-difference-between-display-none-visibility-hidden-and-opacity-0)
60. [What is semantic HTML and why does it matter?](#60-what-is-semantic-html-and-why-does-it-matter)
61. [What happens when you type a URL in the browser and press Enter?](#61-what-happens-when-you-type-a-url-in-the-browser-and-press-enter)
62. [What are XSS and CSRF, and how do you prevent them?](#62-what-are-xss-and-csrf-and-how-do-you-prevent-them)

---

# Part 1 — Common questions

## 1. Explain the difference between var, let, and const in JavaScript.

**Short answer:** `var` is **function-scoped** and can be re-declared. `let` and `const` are **block-scoped** (they live only inside `{ }`). `let` can be re-assigned, `const` cannot. Use `const` by default, `let` when the value must change, and avoid `var`.

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block `{ }` | block `{ }` |
| Re-declare in same scope | ✅ | ❌ | ❌ |
| Re-assign | ✅ | ✅ | ❌ |
| Hoisting | hoisted as `undefined` | hoisted, but in TDZ (see [Q31](#31-what-is-hoisting-and-the-temporal-dead-zone-tdz)) | same as `let` |
| Must give a value at declaration | no | no | yes |

```js
if (true) {
  var a = 1;
  let b = 2;
}
console.log(a); // 1  (var ignores the block)
// console.log(b); // ❌ ReferenceError: b is not defined

const user = { name: "Asha" };
user.name = "Ravi"; // ✅ allowed: the object itself can change
console.log(user.name); // Ravi
// user = {};       // ❌ TypeError: Assignment to constant variable.
```

> 💡 **Hinglish:** `const` ka matlab "value kabhi nahi badlegi" nahi hai. Matlab hai "yeh variable kisi aur cheez ko point nahi karega". Object/array ke andar ki values badal sakti hain.

**Classic output question:**

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0 1 2
```

`var` has **one shared** `i` (it is 3 when the timers run). `let` creates a **new** `j` for every loop round.

---

## 2. What are closures in JavaScript and how do you use them?

**Short answer:** A closure is a function that **remembers the variables of the place where it was created**, even after that outer function has finished running.

> 💡 **Hinglish:** Function apne "ghar" (jahan bana tha) ke variables saath le kar chalta hai, aur bahar jaake bhi unhe use kar sakta hai.

```js
function createCounter() {
  let count = 0; // private: nobody outside can touch it directly
  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2  ← it remembers `count`
```

**Where closures are used:**

- **Private data**, like `count` above
- **Function factories**, which make pre-configured functions:
  ```js
  function multiplyBy(x) {
    return (y) => x * y;
  }
  const double = multiplyBy(2);
  console.log(double(5)); // 10
  ```
- **Debounce / throttle**, which remember the timer (see [Q33](#33-what-is-debouncing-write-a-debounce-function))
- **Callbacks and event handlers** that need outside values

⚠️ **Stale closure in React:** a callback (e.g. inside `setInterval`) remembers the state value from the render where it was created. Fix it with a functional update, `setCount((prev) => prev + 1)`.

---

## 3. How do you handle asynchronous code using async/await and Promises?

**Short answer:** A **Promise** is an object for a value that comes later. It starts **pending**, then becomes **fulfilled** (success) or **rejected** (error). `async/await` is a cleaner way to write Promise code: `await` waits for the Promise, and `try/catch` handles errors.

> 💡 **Hinglish:** Promise = "result baad me dunga" ka vaada. `await` = "ruko, result aane do, phir aage chalo". Sirf woh async function rukta hai, poora page nahi.

```js
function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "Asha" });
      else reject(new Error("Invalid id"));
    }, 500);
  });
}

// Way 1: .then / .catch
getUser(1)
  .then((user) => console.log(user.name)) // Asha
  .catch((err) => console.log(err.message));

// Way 2: async / await
async function showUser() {
  try {
    const user = await getUser(-1);
    console.log(user.name);
  } catch (err) {
    console.log(err.message); // Invalid id
  } finally {
    console.log("done"); // always runs
  }
}
showUser();
```

**Tips:**

- `await` works inside `async` functions (and at the top level of ES modules).
- An `async` function **always returns a Promise**.
- Requests that don't depend on each other should run **in parallel**:
  ```js
  // ❌ slow: one after another
  const a = await getUser(1);
  const b = await getUser(2);

  // ✅ fast: both at the same time
  const [x, y] = await Promise.all([getUser(1), getUser(2)]);
  ```
- More Promise helpers are in [Q42](#42-explain-promiseall-promiseallsettled-promiserace-and-promiseany).

---

## 4. Explain the virtual DOM in React and how it improves performance.

**Short answer:** The Virtual DOM is a lightweight **JavaScript copy of the UI**. When state changes, React creates a new virtual tree, **compares** it with the previous one (diffing), and then updates **only the changed parts** of the real DOM. Real DOM updates are slow, so touching fewer nodes keeps the app fast. This whole process is called **reconciliation**.

> 💡 **Hinglish:** Real DOM ko baar-baar chhedna mehenga hai. React pehle "kaagaz pe" (virtual DOM) naya design banata hai, purane se milata hai, aur sirf jo badla hai wahi real DOM me badalta hai.

```
 state changes
      │
      ▼
 new Virtual DOM  ──compare (diff)──►  old Virtual DOM
      │
      ▼
 update ONLY the changed nodes in the real DOM
```

**Example:** a list has 100 items and one item's text changes. React updates just that one `<li>`, not all 100.

**Good to know:**

- `key` helps React match list items correctly during diffing (see [Q51](#51-why-are-keys-important-in-lists-why-not-use-the-index)).
- React **batches** several state updates into one re-render.
- The Virtual DOM is not magic. Its real benefit is that you describe the UI declaratively, and React applies the minimum changes for you.

---

## 5. How do you manage state in React using useState and useReducer?

**Short answer:** Use `useState` for **simple, independent values** (a number, a string, a boolean). Use `useReducer` when the state is an **object with many related fields**, or there are **many kinds of updates**. All the update logic then lives in one `reducer` function, and components only `dispatch` actions.

**useState:**

```jsx
const [count, setCount] = useState(0);

setCount(count + 1);
setCount((prev) => prev + 1); // use this when the new value depends on the old one
```

**useReducer:**

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```

> 💡 **Hinglish:** `useReducer` me ek "manager" function (reducer) hota hai. Aap sirf batate ho kya hua (`dispatch({ type: "increment" })`), aur manager decide karta hai naya state kya hoga.

| Use `useState` when… | Use `useReducer` when… |
|---|---|
| 1–3 simple values | state is a big object (form, cart) |
| updates are simple | many actions: add, remove, update, reset… |
| | you want all update logic in one place (easy to test) |

**Rule for both:** never change state directly (`state.count++` ❌). Always return a **new** object or array.

---

## 6. Explain the difference between props and state in React.

**Short answer:** **Props** are inputs passed **from parent to child**, and they are read-only for the child. **State** is data a component **owns** and changes with its setter. When either one changes, the component re-renders.

| | Props | State |
|---|---|---|
| Who owns it | the parent | the component itself |
| Can the component change it? | ❌ read-only | ✅ with `setState` |
| Used for | configuring a child | data that changes over time |

```jsx
function Greeting({ name }) {
  // `name` is a prop
  return <h2>Hello, {name}</h2>;
}

function App() {
  const [name, setName] = useState("Asha"); // state lives in App

  return (
    <>
      <Greeting name={name} />
      <button onClick={() => setName("Ravi")}>Change name</button>
    </>
  );
}
```

**Child wants to change parent data?** The parent passes a **function as a prop** (e.g. `onChange={setName}`), and the child calls it.

---

## 7. How do you implement context API for global state management?

**Short answer:** Context shares data (theme, logged-in user, language, cart) with many components **without passing props through every level** (prop drilling). It takes 3 steps: `createContext` → wrap the tree in a **Provider** with a `value` → read it with `useContext` anywhere below.

> 💡 **Hinglish:** Context = ghar ka WiFi. Har room tak alag wire (props) nahi kheenchni padti. Jo bhi andar hai, seedha connect kar lo.

```jsx
import { createContext, useContext, useState } from "react";

// 1. Create
const ThemeContext = createContext(null);

// 2. Provide
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consume (at any depth)
function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}
```

**Good to know:**

- In React 19 you can also write `<ThemeContext value={...}>` instead of `<ThemeContext.Provider value={...}>`.
- **Every component that uses the context re-renders when `value` changes.** Split big contexts (e.g. `AuthContext`, `ThemeContext`) so unrelated parts don't re-render.
- For complex shared state, combine **Context + useReducer**, or use a library (Redux Toolkit, Zustand).

---

## 8. How do you optimize React applications for performance?

**Short answer:** **Measure first** (React DevTools Profiler, Lighthouse), then fix what is slow. Common fixes: avoid unnecessary re-renders (`React.memo`, `useMemo`, `useCallback`), keep state close to where it is used, use stable `key`s, split code with `React.lazy`, virtualize long lists, debounce expensive inputs, and optimize images.

| Problem | Fix |
|---|---|
| Child re-renders though its props didn't change | `React.memo(Child)` + stable props via `useCallback` / `useMemo` |
| Heavy calculation on every render | `useMemo(() => calculate(data), [data])` |
| Huge JS bundle, slow first load | `React.lazy` + `Suspense` (code splitting, [Q22](#22-how-do-you-implement-lazy-loading-and-code-splitting-in-react)) |
| 10,000 rows in a list | virtualization (`react-window`) or pagination |
| API call on every keystroke | debounce ([Q33](#33-what-is-debouncing-write-a-debounce-function)) |
| State high up re-renders the whole app | move state down, split context |
| Big images | compress, WebP/AVIF, correct size, `loading="lazy"` |

```jsx
const Child = React.memo(function Child({ onSelect }) {
  console.log("Child rendered");
  return <button onClick={onSelect}>Select</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // Same function on every render, so React.memo can skip Child
  const handleSelect = useCallback(() => console.log("selected"), []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onSelect={handleSelect} /> {/* does NOT re-render when count changes */}
    </>
  );
}
```

**Note:** don't wrap everything in `memo`/`useMemo`, because memoization has its own cost. The **React Compiler** can add this memoization automatically. Details are in [Q50](#50-what-is-the-difference-between-usememo-usecallback-and-reactmemo).

---

## 9. Explain the difference between class components and functional components.

**Short answer:** **Class components** use `class … extends React.Component`, `this.state`, `this.setState` and lifecycle methods. **Functional components** are plain functions that use **hooks** (`useState`, `useEffect`). Today we write functional components: less code, no `this`, and logic is easy to reuse with custom hooks. Classes are still needed for **Error Boundaries** ([Q55](#55-what-are-error-boundaries)).

```jsx
// Class component
class ClassCounter extends React.Component {
  state = { count: 0 };

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}

// Functional component (same behavior)
function FunctionCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

| Class lifecycle | Hook version |
|---|---|
| `componentDidMount` | `useEffect(() => { … }, [])` |
| `componentDidUpdate` | `useEffect(() => { … }, [dep])` |
| `componentWillUnmount` | the cleanup function returned from `useEffect` |
| `shouldComponentUpdate` / `PureComponent` | `React.memo` |
| `this.state` + `this.setState` | `useState` / `useReducer` |

---

## 10. How do you handle forms and validation in React?

**Short answer:** Use **controlled inputs** (`value` from state + `onChange`) and keep all fields in one state object. Validate in a function that returns an **errors object**, show each error under its field, and submit only when there are no errors. Big forms usually use **React Hook Form** with a schema library like **Zod** or **Yup**.

> 💡 **Hinglish:** Controlled input = input ki value React ke haath me (state me) hoti hai. Uncontrolled = value DOM ke paas rehti hai, zarurat pe `ref` se padh lo ([Q52](#52-what-are-controlled-and-uncontrolled-components)).

```jsx
function SignupForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    // [e.target.name] = "email" or "password": one handler for all inputs
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 8) errs.password = "Minimum 8 characters";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the page reload
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) console.log("Submitting", form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {errors.email && <p>{errors.email}</p>}

      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      {errors.password && <p>{errors.password}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
```

**Tips:** validate on submit (and on blur for nicer UX), disable the button while submitting, and **always validate on the server too**, because browser checks can be bypassed. A full example is [FormValidation.jsx](../../Frontend-Machine-Coding/src/components/11-Form-Validation/FormValidation.jsx).

---

## 11. What are React hooks and how do you create custom hooks?

**Short answer:** Hooks are functions starting with `use` that let function components use React features: `useState` (state), `useEffect` (side effects), `useRef`, `useContext`, `useReducer`, `useMemo`, `useCallback`… A **custom hook** is your own function named `useSomething` that uses other hooks, so the **same logic can be reused** in many components.

**Rules of hooks:**

1. Call hooks only at the **top level**: not inside `if`, loops or nested functions.
2. Call hooks only from **React components or other hooks**.

> 💡 **Hinglish:** React hooks ko unke **order** se pehchanta hai (pehla hook, doosra hook…). Har render me order same hona chahiye, isliye hook kabhi `if` ke andar nahi.

**Custom hook example:** `useLocalStorage` works like `useState`, but the value survives a page refresh.

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Theme: {theme}
    </button>
  );
}
```

More custom hooks: `useDebounce` in [Q33](#33-what-is-debouncing-write-a-debounce-function) and `useFetch` in [Q30](#30-build-a-complete-frontend-application-that-consumes-apis-manages-state-and-is-fully-responsive).

---

## 12. How do you implement routing in React using react-router-dom?

**Short answer:** React Router shows different components for different URLs **without reloading the page**. You wrap the app in `BrowserRouter`, define `<Routes>` with `<Route path element>`, navigate with `<Link>` (not `<a>`), read URL params with `useParams`, and navigate from code with `useNavigate`.

**Versions:** v6/v7 apps import from `react-router-dom`. From v7 the same things also come from `react-router`, and **v8 (2026) removed `react-router-dom`**, so you import from `react-router` instead. The component names are the same.

```jsx
import { BrowserRouter, Routes, Route, Link, Navigate, useParams, useNavigate } from "react-router-dom";
// React Router v8: import the same names from "react-router"

function UserPage() {
  const { id } = useParams(); // URL /users/42 → id = "42"
  const navigate = useNavigate();

  return (
    <>
      <h2>User {id}</h2>
      <button onClick={() => navigate("/")}>Go home</button>
    </>
  );
}

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/users/42">User 42</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h2>Home</h2>} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/login" element={<h2>Login</h2>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={false}>
              <h2>Dashboard</h2>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h2>404: Page not found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Good to know:**

- **Why `<Link>` and not `<a>`?** `<a href>` reloads the whole page. `<Link>` only changes the URL (History API) and re-renders.
- **Nested routes:** the parent route renders `<Outlet />` where its child route should appear.
- **Query strings** (`?search=phone`): `useSearchParams()`.

---

## 13. Explain the concept of server-side rendering (SSR) in Next.js.

**Short answer:** In SSR, the **server builds the full HTML of the page for each request** and sends it to the browser. The user sees content quickly, and search engines can read it (good **SEO**). Then React **hydrates** the page, attaching click handlers so it becomes interactive.

> 💡 **Hinglish:** CSR me browser ko khaali HTML + JS milta hai, aur page browser me banta hai. SSR me server "ready-made" HTML bhejta hai. Phir **hydration** se buttons aur clicks "zinda" ho jaate hain.

| Type | HTML is made… | Good for |
|---|---|---|
| **CSR** (client-side) | in the browser | dashboards behind a login |
| **SSR** (server-side) | on the server, **every request** | personalised / always-fresh pages |
| **SSG** (static) | at **build time** | blogs, docs, landing pages |
| **ISR** (incremental static) | at build time, then rebuilt in the background every N seconds | product pages, news |

**In Next.js:**

- **App Router** (`app/` folder, the newer way): components are **Server Components** by default and are rendered on the server. You choose what gets cached.
- **Pages Router** (`pages/` folder, the older way): you choose per page, with `getServerSideProps` (SSR) or `getStaticProps` (SSG/ISR). See [Q14](#14-how-do-you-fetch-data-in-nextjs-using-getstaticprops-and-getserversideprops).

**Downsides of SSR:** server cost on every request, slower first byte than a static page, and "hydration mismatch" errors if the server and browser render different HTML.

---

## 14. How do you fetch data in Next.js using getStaticProps and getServerSideProps?

**Short answer:** Both are **Pages Router** (`pages/` folder) functions. They run **only on the server** and pass data to the page as props.

- `getStaticProps` runs at **build time** and produces static HTML (SSG). Add `revalidate: 60` to rebuild the page in the background at most every 60 seconds (ISR).
- `getServerSideProps` runs on **every request** and produces fresh HTML (SSR). It can read the request (cookies, query).

```jsx
// pages/products.js: SSG + ISR
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();
  return { props: { products }, revalidate: 60 };
}

export default function Products({ products }) {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

```jsx
// pages/profile.js: SSR
export async function getServerSideProps({ req }) {
  const res = await fetch("https://api.example.com/me", {
    headers: { cookie: req.headers.cookie || "" },
  });

  if (res.status === 401) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const user = await res.json();
  return { props: { user } };
}

export default function Profile({ user }) {
  return <h1>Hello {user.name}</h1>;
}
```

**Good to know:**

- For dynamic pages (`pages/products/[id].js`), `getStaticProps` also needs `getStaticPaths`, which lists the paths to build.
- You can return `{ notFound: true }` (404 page) or `{ redirect: … }`.
- Don't put secrets in `props`, because props are visible in the page's HTML.

**App Router (newer `app/` folder):** these functions don't exist there. Make the component `async` and fetch directly. In current Next.js, `fetch` is **not cached by default**; add the `"use cache"` directive to cache it.

```jsx
// app/products/page.js
export default async function Page() {
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

---

## 15. Explain the difference between REST APIs and GraphQL.

**Short answer:** **REST** has many endpoints (one per resource: `/users/1`, `/users/1/posts`), and the **server decides** the shape of the response. **GraphQL** has **one endpoint**, and the **client sends a query** asking for exactly the fields it needs.

> 💡 **Hinglish:** REST = fixed thali (jo plate me aaya wahi milega). GraphQL = buffet (sirf woh lo jo chahiye).

| | REST | GraphQL |
|---|---|---|
| Endpoints | many | one (usually `/graphql`) |
| Response shape | fixed by the server | chosen by the client |
| Over-fetching (extra fields) | common | no |
| Under-fetching (needs many calls) | common | no, one query can get related data |
| HTTP methods | GET, POST, PUT, PATCH, DELETE | mostly POST (queries + mutations) |
| Caching | easy with HTTP caching | needs a client cache (Apollo, urql) |
| Errors | HTTP status codes | often `200` with an `errors` array |

```js
// REST: 2 requests, full objects
fetch("/api/users/1");
fetch("/api/users/1/posts");
```

```graphql
# GraphQL: 1 request, only the fields we need
query {
  user(id: 1) {
    name
    posts {
      title
    }
  }
}
```

**When to use which:** REST for simple CRUD and public APIs (easy to cache). GraphQL when many screens (web, mobile) need **different shapes of related data** and you want to avoid many round-trips.

---

## 16. How do you implement API calls and error handling in React?

**Short answer:** Fetch inside `useEffect` (or an event handler) and keep three pieces of state: **`data`, `loading`, `error`**. Show a UI for each. `fetch` does **not** throw on 404/500, so check `res.ok` yourself. Cancel the request on unmount with `AbortController`. In real projects, **TanStack Query (React Query)** or **SWR** handle caching, retries and loading states for you.

```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch doesn't throw on 404/500
        setUsers(await res.json());
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") return; // we cancelled it ourselves: ignore
        setError(err.message);
        setLoading(false);
      }
    }

    loadUsers();
    return () => controller.abort(); // cleanup: cancel if the component unmounts
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**Error handling checklist:**

- Network error (offline), HTTP error (`!res.ok`), bad JSON: handle all three.
- Show a friendly message + a **Retry** button, not a blank screen.
- Keep API code in one place (e.g. `api.js`) with a small wrapper:
  ```js
  export async function api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }
  ```
- Render errors (a crash inside JSX) are caught by an **Error Boundary** ([Q55](#55-what-are-error-boundaries)). Async errors are not, so use `try/catch` for those.

---

## 17. How do you handle authentication and authorization in frontend apps?

**Short answer:** **Authentication** = *who are you?* (login). **Authorization** = *what are you allowed to do?* (roles / permissions). The flow: the user logs in → the server checks the password and returns a **session cookie** or a **token (JWT)** → every request sends it → the frontend shows or hides pages based on the user's role. **The real check always happens on the server.** The frontend only hides UI.

> 💡 **Hinglish:** Authentication = gate pe ID card check ("kaun ho?"). Authorization = andar kis room me jaane ki permission hai.

```
Login form ── POST /login ──► Server checks the password
           ◄── Set-Cookie (HttpOnly)  or  JWT token ──
Every API call → sends the cookie / "Authorization: Bearer <token>"
Server checks the token AND the role on EVERY request
```

**Where to keep the token:**

| Place | Safe from XSS? | Notes |
|---|---|---|
| **HttpOnly cookie** | ✅ JavaScript can't read it | recommended. Add `SameSite` / CSRF protection ([Q62](#62-what-are-xss-and-csrf-and-how-do-you-prevent-them)) |
| localStorage | ❌ any injected script can steal it | simple, but risky |
| memory (state) | ✅ | lost on refresh, so pair it with a refresh-token cookie |

**Frontend pieces:**

- An `AuthContext` with `user`, `login()`, `logout()`
- **Protected routes**: redirect to `/login` if there is no user
- **Role-based UI**: `{user.role === "admin" && <AdminPanel />}`
- Send the token with requests; on **401** → log out or refresh the token
- "Login with Google" uses **OAuth 2.0 / OpenID Connect** through a provider

```jsx
function RequireRole({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <p>403: You don't have access</p>;
  return children;
}

// Sending credentials
fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } }); // token
fetch("/api/orders", { credentials: "include" }); // cookie (cross-origin)
```

---

## 18. Explain CSS Grid vs Flexbox and when to use each.

**Short answer:** **Flexbox is one-dimensional.** It arranges items in a row *or* a column (navbars, centering, button groups). **Grid is two-dimensional**: rows *and* columns together (page layouts, card galleries, dashboards). They work well together: Grid for the page, Flexbox inside components.

> 💡 **Hinglish:** Flex = ek line me cheezein sajao (row ya column). Grid = poora chessboard, jahan rows aur columns dono aapke control me.

```css
/* Flexbox: navbar (logo left, links right, vertically centered) */
.navbar {
  display: flex;
  justify-content: space-between; /* main axis (row) */
  align-items: center;            /* cross axis (column) */
  gap: 16px;
}

/* Flexbox: center anything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid: responsive cards (as many 200px+ columns as fit) */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* Grid: page layout */
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}
.page header { grid-area: header; }
.page aside  { grid-area: sidebar; }
.page main   { grid-area: main; }
.page footer { grid-area: footer; }
```

| Use Flexbox for… | Use Grid for… |
|---|---|
| items in **one line** | **rows + columns** |
| content decides the size | the layout decides the size |
| navbar, toolbar, centering, chips | page layout, galleries, forms in columns |

---

## 19. How do you implement responsive design in modern web apps?

**Short answer:** Make the layout adapt to every screen size. Start **mobile-first**, use flexible units (`%`, `rem`, `fr`, `vw`), use Flexbox/Grid that can wrap, add **media queries** for bigger screens, use responsive images, and include the **viewport meta tag**. Test in DevTools device mode and on a real phone.

> 💡 **Hinglish:** Mobile-first = pehle chhoti screen ka design banao, phir `min-width` media queries se badi screens ke liye cheezein add karo.

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

```css
/* Mobile first: these base styles are for phones */
.container { padding: 16px; }
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* Tablet and bigger */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and bigger */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Fluid font: between 1.5rem and 2.5rem, growing with the screen */
h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }

/* Images never overflow their container */
img { max-width: 100%; height: auto; }
```

```html
<!-- Responsive image: the browser picks the best size -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Product photo"
/>
```

**Also:** **container queries** (`@container`) style a component based on **its own width**, not the screen width. Make tap targets big enough (about 44×44 px), and never cause horizontal scrolling.

---

## 20. How do you optimize web performance and reduce load times?

**Short answer:** **Send less, send it faster, and do less work in the browser.** Compress and lazy-load images, split and minify JavaScript, use a CDN and caching, avoid render-blocking resources, and measure with **Lighthouse** and **Core Web Vitals**.

**Core Web Vitals (Google's main metrics):**

| Metric | Measures | Good |
|---|---|---|
| **LCP**: Largest Contentful Paint | how fast the main content appears | ≤ 2.5 s |
| **INP**: Interaction to Next Paint | how fast the page responds to clicks/typing | ≤ 200 ms |
| **CLS**: Cumulative Layout Shift | how much the layout jumps around | ≤ 0.1 |

(INP replaced the older FID metric in March 2024.)

**Checklist:**

- **Network:** gzip/brotli compression, CDN, cache headers, fewer and smaller requests, `preload` / `preconnect` for critical files
- **JavaScript:** code splitting, tree shaking, remove unused libraries, `defer` scripts, minify
- **Images:** WebP/AVIF, the right size (`srcset`), `loading="lazy"` below the fold, set `width`/`height` (prevents CLS)
- **CSS & fonts:** inline critical CSS, `font-display: swap`, fewer font files
- **Runtime:** avoid long tasks (> 50 ms), debounce/throttle events, virtualize long lists
- **React:** `memo`, `lazy`, avoid unnecessary re-renders ([Q8](#8-how-do-you-optimize-react-applications-for-performance))

```html
<script src="analytics.js" defer></script>               <!-- doesn't block HTML parsing -->
<link rel="preload" href="/hero.webp" as="image" />      <!-- fetch the hero image early -->
<img src="/hero.webp" width="1200" height="600" alt="Hero banner" /> <!-- size known → no jump -->
<img src="/footer.webp" loading="lazy" alt="Team photo" /> <!-- loads only near the screen -->
```

---

## 21. Explain Progressive Web Apps (PWAs) and their benefits.

**Short answer:** A PWA is a **website that behaves like an installed app**. It can be added to the home screen, works **offline** or on slow networks, loads fast, and can send push notifications. It needs three things: **HTTPS**, a **web app manifest** (name, icons, colors) and a **service worker** (a background script that caches files and handles requests).

> 💡 **Hinglish:** Service worker = browser aur network ke beech ka "middleman". Request aaye to woh decide karta hai: cache se de ya network se laaye. Isi se app offline chalta hai.

**Benefits:** installable without an app store, works offline, fast repeat visits (cache), push notifications, one codebase for all devices, small size, and updates automatically.

**manifest.json** (JSON files can't have comments):

```json
{
  "name": "My Shop",
  "short_name": "Shop",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```html
<link rel="manifest" href="/manifest.json" />
```

```js
// main.js: register the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

```js
// sw.js: cache files on install, serve from cache first
const CACHE = "v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(["/", "/index.html", "/styles.css"]))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

**Tools:** Workbox, `vite-plugin-pwa`. **Limits:** iOS supports fewer PWA features than Android (e.g. push notifications only after "Add to Home Screen").

---

## 22. How do you implement lazy loading and code splitting in React?

**Short answer:** **Code splitting** breaks the JavaScript bundle into smaller chunks, so the browser downloads only what the current page needs. In React, `React.lazy(() => import("./Page"))` loads a component **the first time it renders**, and `<Suspense fallback>` shows a loader meanwhile. Split by **routes** and **heavy components** (charts, editors, modals).

> 💡 **Hinglish:** Poori app ek saath download karne ke bajaye, jo page khola sirf uska code laao. Baaki code zarurat padne pe aayega.

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/Dashboard")); // separate file (chunk)
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

```js
// Plain JavaScript: load a module only when it is needed
button.addEventListener("click", async () => {
  const { exportToPdf } = await import("./pdf-utils.js");
  exportToPdf();
});
```

**Good to know:**

- `React.lazy` needs a module with a **default export**.
- **Lazy-load images** with `<img loading="lazy">`, or use `IntersectionObserver` for custom cases.
- Vite / webpack create the separate chunks automatically for every `import()`.

---

## 23. What are web accessibility standards (WCAG) and how do you implement them?

**Short answer:** **WCAG** (Web Content Accessibility Guidelines) is the standard for making websites usable by everyone, including people who use screen readers, use only a keyboard, or have low vision. It has 4 principles, **POUR** (Perceivable, Operable, Understandable, Robust), and 3 levels: A, **AA** (the usual target and often a legal requirement) and AAA. The current version is **WCAG 2.2**.

> 💡 **Hinglish:** Accessibility = website aisi banao ki jo dekh nahi sakta, mouse use nahi kar sakta, ya jise kam dikhta hai, woh bhi aaram se use kar sake.

**Practical checklist:**

- **Semantic HTML:** `<button>` for actions, `<a>` for links, headings `h1–h6` in order, `<nav>`, `<main>` ([Q60](#60-what-is-semantic-html-and-why-does-it-matter))
- **`alt` text** on images (`alt=""` for decorative images)
- Every input has a **`<label>`**
- **Keyboard:** everything works with Tab / Enter / Space / Esc, and the focus outline is visible
- **Contrast** at least **4.5:1** for normal text (3:1 for large text)
- Don't use **color alone** to show meaning (add an icon or text)
- **ARIA** only when HTML isn't enough: `aria-label`, `aria-expanded`, `role="dialog"`, `aria-live` for updates
- Respect `prefers-reduced-motion`

```html
<!-- ❌ Bad -->
<div onclick="save()">Save</div>
<img src="logo.png" />

<!-- ✅ Good -->
<button onclick="save()">Save</button>
<img src="logo.png" alt="Acme logo" />

<label for="email">Email</label>
<input id="email" type="email" aria-describedby="email-error" />
<p id="email-error">Please enter a valid email.</p>

<button aria-label="Close dialog">×</button>
```

**Tools:** Lighthouse, axe DevTools, `eslint-plugin-jsx-a11y`, a screen reader (NVDA on Windows, VoiceOver on Mac), and testing with only the keyboard.

---

## 24. How do you write unit tests in React using Jest and React Testing Library?

**Short answer:** **Jest** is the test runner (runs tests, gives `expect`, mocks). **React Testing Library (RTL)** renders components and finds elements **the way a user would**: by role, label or text. Then you interact and check the result. Test **behavior** (what the user sees), not internal details.

| Piece | What it does |
|---|---|
| `render(<Comp />)` | renders the component into a fake DOM (jsdom) |
| `screen.getByRole("button", { name: /add/i })` | finds an element (throws if missing) |
| `screen.queryByText(...)` | returns `null` if missing (use it to check something is **not** there) |
| `await screen.findByText(...)` | **waits** for an element (async UI) |
| `userEvent.click / type` | acts like a real user |
| `expect(el).toBeInTheDocument()` | matcher from `@testing-library/jest-dom` |
| `jest.fn()` | a mock (fake) function |

```jsx
// Counter.jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

```jsx
// Counter.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Counter from "./Counter";

test("starts at 0 and increments on click", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText("Count: 0")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /increment/i }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

**Testing an API call** (the `Users` component from [Q16](#16-how-do-you-implement-api-calls-and-error-handling-in-react)) by mocking `fetch`:

```jsx
test("shows users from the API", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 1, name: "Asha" }],
  });

  render(<Users />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText("Asha")).toBeInTheDocument(); // findBy waits
});
```

**Note:** Vite projects often use **Vitest**, which has almost the same API (`vi.fn()` instead of `jest.fn()`).

---

## 25. Explain end-to-end testing using Cypress or Selenium.

**Short answer:** End-to-end (E2E) tests run the **whole app in a real browser** and act like a real user: open a page, type, click and check what appears. The frontend, backend and database are tested together. **Cypress** and **Playwright** are the modern JavaScript tools (easy setup, automatic waiting). **Selenium** is older and supports many languages and browsers through WebDriver.

```
        /\          E2E: few, slow, full user journeys
       /  \
      /----\        Integration: some
     /      \
    /--------\      Unit: many, fast
```

```js
// cypress/e2e/login.cy.js
describe("Login", () => {
  it("logs in and shows the dashboard", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("asha@example.com");
    cy.get("input[name=password]").type("secret123");
    cy.contains("button", "Log in").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Asha").should("be.visible");
  });
});
```

```js
// Playwright version of a simple test
import { test, expect } from "@playwright/test";

test("search shows results", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByPlaceholder("Search").fill("mango");
  await expect(page.getByText("Mango")).toBeVisible();
});
```

| | Cypress | Playwright | Selenium |
|---|---|---|---|
| Languages | JavaScript / TypeScript | JS/TS, Python, Java, C# | Java, Python, JS, C#, … |
| Waiting for elements | automatic | automatic | often manual waits |
| Setup | very easy | easy | more setup (drivers) |
| Best for | frontend teams | fast, cross-browser, parallel tests | large / multi-language teams |

**Tips:** test only **critical flows** (login, checkout, signup), use stable selectors (`data-testid` or roles), control test data (seed or mock), and run the tests in **CI** on every pull request.

---

## 26. How do you handle version control and collaboration using Git?

**Short answer:** Git tracks every change to the code. In a team: create a **branch** for each feature or bug, make **small commits** with clear messages, push the branch, open a **Pull Request (PR)**, get it reviewed, and merge it into `main`. Pull often to stay up to date and fix conflicts early.

```bash
git clone <repo-url>
git checkout -b feature/login        # new branch
git status                           # what changed?
git add .                            # stage changes
git commit -m "Add login form validation"
git pull origin main                 # get the latest main into your branch
git push -u origin feature/login     # push, then open a PR on GitHub
```

```
main     ──●───────────────●──── (merge the PR)
            \             /
feature      ●──●──●─────●
```

**Merge vs rebase:**

- **Merge** keeps the full history and adds a merge commit.
- **Rebase** replays your commits on top of the latest `main` for a straight-line history. Don't rebase branches that others are using.

> 💡 **Hinglish:** Rebase = apne commits ko utha ke latest `main` ke upar dobara laga dena, taaki history ek seedhi line me dikhe.

**Merge conflict:** Git marks the file with `<<<<<<<`, `=======`, `>>>>>>>`. Keep the right code, delete the markers, then `git add` and `git commit` (or `git rebase --continue`).

**Other useful commands:** `git stash` (save work for later), `git log --oneline`, `git diff`, `git revert <commit>` (a safe undo that creates a new commit), `.gitignore`.

**Good team habits:** small PRs with a clear description, code reviews, CI checks before merge, protected `main` branch, and commit messages like `feat: …` / `fix: …`.

---

## 27. Explain the difference between npm and yarn.

**Short answer:** Both are **package managers** for JavaScript. They install packages from the npm registry and run scripts. **npm** comes with Node.js. **Yarn** was made by Facebook in 2016 to be faster and more reliable (lock file, parallel installs). npm has since caught up, so today the difference is small. **pnpm** is another popular choice that is fast and saves disk space.

| Task | npm | yarn |
|---|---|---|
| Install everything | `npm install` | `yarn` |
| Add a package | `npm install axios` | `yarn add axios` |
| Add a dev dependency | `npm install -D jest` | `yarn add -D jest` |
| Remove a package | `npm uninstall axios` | `yarn remove axios` |
| Run a script | `npm run dev` | `yarn dev` |
| Lock file | `package-lock.json` | `yarn.lock` |
| Clean install in CI | `npm ci` | `yarn install --frozen-lockfile` (v1) / `yarn install --immutable` (v2+) |
| Run a tool without installing | `npx create-vite` | `yarn dlx create-vite` (v2+) |

**Good to know:**

- The **lock file** makes every machine install the exact same versions, so commit it.
- Don't mix two package managers in one project (two lock files = confusion).
- Yarn v2+ ("Berry") can work without `node_modules` (Plug'n'Play).

---

## 28. How do you debug JavaScript and React applications effectively?

**Short answer:** First **reproduce** the bug and read the error message and stack trace. Then narrow it down with DevTools: `console.log`, **breakpoints** / `debugger` for logic, the **Network** tab for API problems, the **Elements** tab for CSS, and **React DevTools** for props, state and re-renders.

**Toolbox:**

- `console.log`, `console.table(array)`, `console.error`, `console.trace()`, `console.time()` / `console.timeEnd()`
- `debugger;` pauses the code when DevTools is open
- **Sources tab:** breakpoints, conditional breakpoints, step over/into, watch values, call stack
- **Network tab:** status codes, request body, response, CORS errors, slow requests (throttling)
- **Elements tab:** computed styles, box model, which CSS rule wins
- **React DevTools:** component props/state/hooks; the **Profiler** shows why something re-rendered
- **Source maps** show your original code instead of the bundled code
- **Production:** Error Boundaries + monitoring tools like Sentry

```js
function getTotal(cart) {
  debugger; // pauses here while DevTools is open
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

console.table([
  { name: "Pen", price: 10 },
  { name: "Book", price: 50 },
]);

console.time("sort");
[5, 3, 1].sort();
console.timeEnd("sort"); // sort: 0.01ms (time taken)
```

**Common React bugs:** stale state in a closure, missing `useEffect` dependencies, an infinite loop from `setState` inside an effect, mutating state, missing `key`, and "Cannot read properties of undefined" because the data hasn't loaded yet (use `user?.name`).

**Steps:** reproduce → isolate (comment code out, cut the problem in half) → inspect → fix → add a test so the bug doesn't come back.

---

## 29. Explain the concept of component-driven architecture.

**Short answer:** Build the UI from **small, reusable, independent components** (Button, Input, Card), combine them into bigger components (SearchBar, ProductCard), and those into pages. Each component has **one job**, gets data through **props**, and can be built and tested on its own, often in **Storybook**.

> 💡 **Hinglish:** Lego blocks jaisa: chhote pieces banao, unse bade pieces, aur unse poora page.

```
Atoms      →  Button, Input, Label
Molecules  →  SearchBar (Input + Button)
Organisms  →  Header (Logo + Nav + SearchBar)
Templates  →  page layout (where things go)
Pages      →  HomePage with real data
```

```jsx
function Button({ variant = "primary", children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="search-bar">
      <input value={value} onChange={(e) => onChange(e.target.value)} />
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
}
```

**Benefits:** reuse, a consistent look (design system), easier testing, team members can work in parallel, and changes stay in one place.

**Good practices:** keep components small, split "smart" components (fetch data, hold state) from "presentational" ones (only show props), and use one folder per component (`Button.jsx`, `Button.css`, `Button.test.jsx`).

---

## 30. Build a complete frontend application that consumes APIs, manages state, and is fully responsive.

**Short answer (how to explain your approach):** Pick a simple idea, for example a **Users Directory** that shows users from an API, with search and a "Save to favorites" button.

1. **Set up** with Vite + React.
2. **Plan** components and folders.
3. Put all fetch calls in an **API layer**.
4. **Fetch** with loading / error / empty states.
5. **State:** local `useState`, and Context (or `useReducer`) for shared state like favorites.
6. Add **routing** (list page, detail page).
7. Make it **responsive** (mobile-first Grid/Flexbox).
8. Add **tests**, then **deploy** (Vercel / Netlify).

```
src/
├── api/          users.js              ← all fetch calls in one place
├── components/   UserCard.jsx, Loader.jsx
├── context/      FavoritesContext.jsx  ← shared state
├── hooks/        useFetch.js, useDebounce.js
├── pages/        HomePage.jsx, UserPage.jsx
├── App.jsx       ← routes
└── main.jsx
```

**The core pieces:**

```jsx
// api/users.js
export async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

```jsx
// hooks/useFetch.js: reusable loading / error / data logic
export function useFetch(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // don't update state after unmount
    fetcher()
      .then((result) => { if (!ignore) setData(result); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [fetcher]); // pass a function defined OUTSIDE the component (like getUsers)

  return { data, loading, error };
}
```

```jsx
// context/FavoritesContext.jsx: shared state
export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
```

```jsx
// components/UserCard.jsx
function UserCard({ user }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.includes(user.id);

  return (
    <article className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => toggleFavorite(user.id)}>{isFavorite ? "★ Saved" : "☆ Save"}</button>
    </article>
  );
}
```

```jsx
// pages/HomePage.jsx
export default function HomePage() {
  const { data: users, loading, error } = useFetch(getUsers);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // hooks BEFORE any early return

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const visibleUsers = users.filter((u) =>
    u.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <main className="container">
      <input placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
      {visibleUsers.length === 0 && <p>No users found.</p>}
      <div className="user-grid">
        {visibleUsers.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </main>
  );
}
```

```css
/* Responsive: 1 column on phones, more columns as the screen grows */
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
```

**What interviewers look for:** loading / error / empty states, no repeated code (API layer, custom hooks), correct `key`s, accessible HTML, a responsive layout, a clean folder structure, the API URL in an env variable (`import.meta.env.VITE_API_URL`), a few tests, and a live deployed link.

**Practice:** the [Frontend-Machine-Coding](../../Frontend-Machine-Coding/README.md) project in this repo has 20 small components (todo, pagination, infinite scroll, cart, …) built the same way.

---

# Part 2 — Extra important questions

## 31. What is hoisting and the Temporal Dead Zone (TDZ)?

**Short answer:** **Hoisting** means JavaScript processes all **declarations first**, before running the code, as if they were moved to the top of their scope.

- `var` is hoisted and set to `undefined`.
- `let` / `const` are hoisted but **not initialised**. Using them before their line throws a ReferenceError. That gap is the **Temporal Dead Zone**.
- **Function declarations** are hoisted completely, so you can call them before they are written.
- **Function expressions / arrow functions** follow the rules of the `var`/`let`/`const` they are stored in.

> 💡 **Hinglish:** JS code chalane se pehle saare declarations "register" kar leta hai. `var` ko `undefined` mil jaata hai. `let/const` ko tab tak "lock" (TDZ) me rakhta hai jab tak unki line nahi aati.

```js
console.log(a); // undefined  (var is hoisted with undefined)
var a = 5;

sayHi(); // Hi  (function declarations are fully hoisted)
function sayHi() {
  console.log("Hi");
}

// console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;

// sayBye(); // ❌ TypeError: sayBye is not a function (sayBye is still undefined)
var sayBye = function () {
  console.log("Bye");
};
```

```
{                 ← block starts: b exists but is in the TDZ
  …               ← using b here → ReferenceError
  let b = 10;     ← TDZ ends here
  …               ← b can be used
}
```

---

## 32. Explain the event loop (call stack, microtasks, macrotasks).

**Short answer:** JavaScript runs **one thing at a time** (single thread) on the **call stack**. Slow work (timers, network) is handed to the browser. When it finishes, its callback waits in a **queue**. The **event loop** keeps checking: when the call stack is empty, it runs **all microtasks** first (Promise `.then`, code after `await`, `queueMicrotask`), then **one macrotask** (`setTimeout`, `setInterval`, events), then checks the microtasks again, and so on.

> 💡 **Hinglish:** Call stack = bank ka ek cashier (ek time pe ek customer). Microtask queue = VIP line, macrotask queue = normal line. Cashier free hote hi pehle **poori** VIP line clear hoti hai, phir normal line ka **ek** banda.

```
 ┌────────────┐        ┌───────────────────────────┐
 │ Call Stack │        │ Browser APIs (timer, fetch)│
 └─────┬──────┘        └─────────────┬─────────────┘
       │ empty?                       │ done → callback goes to a queue
       ▼                              ▼
 ┌──────────────────────┐   ┌──────────────────────────┐
 │ Microtask queue      │   │ Macrotask queue          │
 │ Promise.then, await  │   │ setTimeout, click events │
 └──────────────────────┘   └──────────────────────────┘
   runs ALL of them first      then ONE, then microtasks again
```

**Classic output question:**

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1 4 3 2
```

**Why:** `1` and `4` are normal (synchronous) code. `3` is a **microtask**, so it runs as soon as the stack is empty. `2` is a **macrotask**, so it runs after all microtasks, even with a 0 ms delay.

**A harder one:**

```js
async function run() {
  console.log("A");
  await null;
  console.log("B"); // code after await runs later, as a microtask
}

console.log("start");
setTimeout(() => console.log("timeout"), 0);
run();
Promise.resolve().then(() => console.log("then"));
console.log("end");
// Output: start A end B then timeout
```

---

## 33. What is debouncing? Write a debounce function.

**Short answer:** Debouncing **waits until the user stops** doing something for X ms, then runs the function **once**. Every new event cancels the previous timer. Use it for **search-as-you-type**, auto-save, and "resize finished".

> 💡 **Hinglish:** Lift ka darwaza: jab tak log aate rahenge, door band hone ka timer reset hota rahega. Aakhri banda aane ke X second baad hi door band hoga.

```js
function debounce(fn, delay) {
  let timerId; // remembered through a closure
  return function (...args) {
    clearTimeout(timerId); // cancel the previous call
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((text) => console.log("API call for:", text), 300);
search("r");
search("re");
search("rea");
search("react"); // only this one runs, 300 ms after the last call
// Output: API call for: react
```

**React version: a `useDebounce` hook**

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // value changed again → cancel the old timer
  }, [value, delay]);

  return debounced;
}

// const debouncedQuery = useDebounce(query, 300);
// useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
```

---

## 34. What is throttling? How is it different from debouncing?

**Short answer:** Throttling runs a function **at most once every X ms**, no matter how many times the event fires. Use it for **scroll, mousemove, resize while dragging**, infinite-scroll checks, and stopping button spam.

> 💡 **Hinglish:** Traffic signal jaisa: kitni bhi gaadiyan aayein, signal har 60 second me sirf ek baar green hota hai.

```js
function throttle(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      // enough time has passed since the last run
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

const log = throttle((i) => console.log("run", i), 100);
for (let i = 1; i <= 5; i++) log(i); // run 1  (calls 2–5 come within 100 ms → ignored)
setTimeout(() => log(6), 150); //       run 6  (100 ms have passed)

// Real use: window.addEventListener("scroll", throttle(checkPosition, 200));
```

```
events:    x x x x x x x x x x . . . .
debounce:                      . . ✔        once, after the events stop
throttle:  ✔ . . . ✔ . . . ✔ .             regularly, every X ms
```

| | Debounce | Throttle |
|---|---|---|
| Runs | **once**, after events stop | **regularly**, at most once per X ms |
| Good for | search box, auto-save, resize end | scroll, mousemove, drag, button spam |
| Typing "react" quickly | 1 call | a few calls |

---

## 35. Explain event bubbling, capturing and event delegation.

**Short answer:** When you click an element, the event travels in 3 phases: **capturing** (from `window` down to the target), the **target** itself, then **bubbling** (from the target back up to `window`). Listeners run in the **bubbling** phase by default. **Event delegation** uses bubbling: put **one listener on the parent** instead of one on every child, and check `event.target`.

> 💡 **Hinglish:** Bubbling = paani ka bulbula, neeche (button) se upar (parent, body) tak jaata hai. Delegation = har bachche ko alag phone dene ke bajaye class teacher (parent) ko ek phone de do.

```
 window
   └─ document
        └─ <ul id="list">       ▲ bubbling (default)   │ capturing
             └─ <li> (target)   │                       ▼
```

```html
<ul id="list">
  <li data-id="1">Apple</li>
  <li data-id="2">Mango</li>
</ul>
```

```js
// Delegation: ONE listener handles every <li>, even ones added later
document.getElementById("list").addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  console.log("Clicked item", li.dataset.id);
});

// Listen in the capturing phase instead
// parent.addEventListener("click", handler, { capture: true });

// Stop the event from going further up
// child.addEventListener("click", (e) => e.stopPropagation());
```

**Common follow-ups:**

- `event.target` = the element actually clicked. `event.currentTarget` = the element the listener is attached to.
- `preventDefault()` stops the browser's **default action** (link navigation, form submit). `stopPropagation()` stops the event from **travelling** to other elements.
- React also uses delegation internally: it listens at the root, not on every element.

---

## 36. How does the `this` keyword work? How are arrow functions different?

**Short answer:** `this` depends on **how a function is called**, not where it is written:

- `obj.method()` → `this` is `obj`
- a plain call `fn()` → `undefined` in strict mode (`window` in old non-strict scripts)
- `new Fn()` → the new object
- `call` / `apply` / `bind` → whatever you pass ([Q37](#37-what-is-the-difference-between-call-apply-and-bind))
- **arrow functions have no `this` of their own.** They use `this` from the surrounding code.

> 💡 **Hinglish:** Normal function me `this` = "kisne bulaya". Arrow function me `this` = "jahan likha gaya, wahan ka `this`". Arrow ka apna `this` hota hi nahi.

```js
const user = {
  firstName: "Asha",
  greet() {
    return "Hi " + this.firstName;
  },
};
console.log(user.greet()); // Hi Asha  (called on user → this = user)

const greet = user.greet;
// greet(); // ❌ `this` is lost: "Hi undefined", or a TypeError in strict code (ES modules, classes)

const boundGreet = user.greet.bind(user);
console.log(boundGreet()); // Hi Asha

// Why arrow functions are great inside callbacks
const counter = {
  startNormal() {
    setTimeout(function () {
      console.log("normal:", this === counter); // normal: false (this is lost)
    }, 0);
  },
  startArrow() {
    setTimeout(() => {
      console.log("arrow:", this === counter); // arrow: true (this from startArrow)
    }, 0);
  },
};
counter.startNormal();
counter.startArrow();
```

**Arrow vs normal function:** arrows have no own `this`, no `arguments` object, can't be used with `new`, and are shorter. Don't use an arrow function as an **object method** that needs `this`.

---

## 37. What is the difference between call, apply and bind?

**Short answer:** All three set `this` for a function. `call` **runs it now** with arguments one by one. `apply` **runs it now** with arguments as an **array**. `bind` **does not run it**: it returns a **new function** with `this` fixed (useful for callbacks).

**Trick:** **c**all = **c**ommas, **a**pply = **a**rray, bind = later.

```js
function introduce(city, country) {
  return `${this.name} from ${city}, ${country}`;
}
const person = { name: "Asha" };

console.log(introduce.call(person, "Pune", "India")); // Asha from Pune, India
console.log(introduce.apply(person, ["Pune", "India"])); // Asha from Pune, India

const introduceAsha = introduce.bind(person, "Pune"); // "Pune" is pre-filled
console.log(introduceAsha("India")); // Asha from Pune, India
```

**Polyfill for `bind`** (a common interview task):

```js
Function.prototype.myBind = function (context, ...presetArgs) {
  const originalFn = this;
  return function (...laterArgs) {
    return originalFn.apply(context, [...presetArgs, ...laterArgs]);
  };
};

function introduce(city, country) {
  return `${this.name} from ${city}, ${country}`;
}
console.log(introduce.myBind({ name: "Ravi" }, "Delhi")("India")); // Ravi from Delhi, India
```

---

## 38. What is the difference between == and ===?

**Short answer:** `===` (strict equality) compares **value and type**, with no conversion. `==` (loose equality) **converts types first**, which gives surprising results. Always use `===`. The one common exception is `x == null`, which checks for both `null` and `undefined`.

```js
console.log(5 === "5"); // false (number vs string)
console.log(5 == "5"); // true  ("5" is converted to 5)
console.log(0 == false); // true
console.log("" == 0); // true
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log(NaN === NaN); // false → use Number.isNaN(x)

// Objects are compared by reference, not by content
console.log({} === {}); // false (two different objects)
const a = {};
const b = a;
console.log(a === b); // true (same object)
```

---

## 39. What is the difference between null and undefined? What are truthy and falsy values?

**Short answer:** `undefined` means **no value was given** (a declared but empty variable, a missing property, a function with no `return`). `null` means **"empty on purpose"**, set by you. `typeof null` is `"object"` (an old bug in JavaScript).

```js
let a;
console.log(a); // undefined
const user = { name: "Asha", address: null };
console.log(user.age); // undefined (no such property)
console.log(user.address); // null (we said "no address")
console.log(typeof null); // object
console.log(typeof undefined); // undefined
```

**Falsy values (only these 8):** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. **Everything else is truthy**, including `"0"`, `"false"`, `[]` and `{}`.

```js
if ([]) console.log("an empty array is truthy"); // prints

const name = "" || "Guest"; // "Guest" → || replaces ANY falsy value
const count = 0 ?? 10; //      0       → ?? replaces only null / undefined
console.log(name, count); // Guest 0

const person = { name: "Asha", address: null };
console.log(person.address?.city); // undefined (optional chaining: no crash)
// console.log(person.address.city); // ❌ TypeError: Cannot read properties of null
```

---

## 40. What is the difference between the spread and rest operators?

**Short answer:** Both use `...`. **Spread** *expands* an array/object into separate items (copy, merge, pass arguments). **Rest** *collects* many items into one array/object (function parameters, destructuring).

> 💡 **Hinglish:** Spread = dabba khol ke cheezein bahar faila do. Rest = bachi hui cheezein ek dabbe me daal do.

```js
// Spread
const nums = [1, 2];
const more = [...nums, 3];
console.log(more); // [1, 2, 3]

const user = { name: "Asha", age: 25 };
const updated = { ...user, age: 26 };
console.log(updated); // { name: "Asha", age: 26 }

console.log(Math.max(...nums)); // 2

// Rest
function sum(...numbers) {
  // numbers = [1, 2, 3]
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3)); // 6

const [first, ...others] = [10, 20, 30];
console.log(first, others); // 10 [20, 30]

const { name, ...restInfo } = user;
console.log(restInfo); // { age: 25 }
```

---

## 41. What is the difference between a shallow copy and a deep copy?

**Short answer:** A **shallow copy** copies only the first level, so nested objects are still **shared** with the original. A **deep copy** copies everything, so changes never affect the original.

- Spread `{ ...obj }` / `Object.assign` → **shallow**
- `structuredClone(obj)` → **deep** (built into browsers and Node.js)
- `JSON.parse(JSON.stringify(obj))` → deep, but it loses functions and `undefined`, and turns `Date` objects into strings

```js
const original = { name: "Asha", address: { city: "Pune" } };

const shallow = { ...original };
shallow.address.city = "Delhi";
console.log(original.address.city); // Delhi  ← changed! (nested object is shared)

const deep = structuredClone(original);
deep.address.city = "Mumbai";
console.log(original.address.city); // Delhi  ← unchanged
```

```
shallow:   original ─┐
                     ├──► { city }    one shared nested object
           shallow ──┘

deep:      original ───► { city }
           deep ───────► { city }     separate copies
```

**React link:** when you update nested state, copy every level you change:
`setUser({ ...user, address: { ...user.address, city: "Delhi" } })`

---

## 42. Explain Promise.all, Promise.allSettled, Promise.race and Promise.any.

**Short answer:** All four take an array of promises and run them **in parallel**. They differ in **when they finish** and **what counts as failure**.

| Method | Resolves when… | Rejects when… | Use it for |
|---|---|---|---|
| `Promise.all` | **all** succeed → array of results (same order) | **any one** fails | requests that all must succeed |
| `Promise.allSettled` | **all finish** (success or failure) | never | showing what worked and what failed |
| `Promise.race` | the **first one finishes** (success or failure) | the first one to finish failed | timeouts |
| `Promise.any` | the **first success** | **all** fail (`AggregateError`) | the fastest of several servers |

```js
const ok = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (msg, ms) => new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms));

async function demo() {
  console.log(await Promise.all([ok("A", 100), ok("B", 50)])); // ["A", "B"] (order kept)

  try {
    await Promise.all([ok("A", 100), fail("B failed", 50)]);
  } catch (err) {
    console.log(err.message); // B failed
  }

  const results = await Promise.allSettled([ok("A", 10), fail("B failed", 20)]);
  console.log(results.map((r) => r.status)); // ["fulfilled", "rejected"]

  console.log(await Promise.race([ok("slow", 100), ok("fast", 10)])); // fast
  console.log(await Promise.any([fail("x", 10), ok("first success", 50)])); // first success
}
demo();
```

**Timeout pattern with `race`:**

```js
const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));
// const res = await Promise.race([fetch(url), timeout(5000)]);
```

---

## 43. What is a prototype and prototypal inheritance?

**Short answer:** Every JavaScript object has a hidden link to another object called its **prototype**. If a property isn't found on the object, JavaScript looks in its prototype, then in that object's prototype, and so on until `null`. This is the **prototype chain**, and it is how objects share methods. `class` is just nicer syntax built on prototypes.

> 💡 **Hinglish:** Object ke paas cheez nahi mili, to woh apne "papa" (prototype) se maangta hai, phir "dada" se, jab tak chain khatam (`null`) na ho jaaye.

```js
const animal = {
  eat() {
    return `${this.name} is eating`;
  },
};
const dog = Object.create(animal); // dog's prototype = animal
dog.name = "Tommy";
console.log(dog.eat()); // Tommy is eating  (found on the prototype)
console.log(Object.getPrototypeOf(dog) === animal); // true

// Same idea with class syntax
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    return `${this.name} is eating`;
  }
}
class Dog extends Animal {
  bark() {
    return "Woof!";
  }
}
const bruno = new Dog("Bruno");
console.log(bruno.eat(), bruno.bark()); // Bruno is eating Woof!
```

```
bruno ──► Dog.prototype (bark) ──► Animal.prototype (eat) ──► Object.prototype (toString…) ──► null
```

**`prototype` vs `__proto__`:** `prototype` is a property of functions/classes, and it becomes the prototype of objects created with `new`. `__proto__` (better: `Object.getPrototypeOf(obj)`) is the actual link on every object.

---

## 44. What is currying?

**Short answer:** Currying turns a function that takes many arguments, `f(a, b, c)`, into a chain of functions that each take one argument, `f(a)(b)(c)`. It helps you create **reusable, pre-configured functions**, and it works because of **closures**.

> 💡 **Hinglish:** Saare arguments ek saath dene ke bajaye ek-ek karke do. Har step ek naya function wapas deta hai.

```js
const add = (a) => (b) => (c) => a + b + c;
console.log(add(1)(2)(3)); // 6

// Practical: configure once, reuse many times
const logWith = (level) => (message) => console.log(`[${level}] ${message}`);
const logError = logWith("ERROR");
logError("Payment failed"); // [ERROR] Payment failed

// Classic interview question: sum(1)(2)(3)(4)() → 10
function sum(a) {
  return function (b) {
    if (b === undefined) return a; // empty call () → return the total
    return sum(a + b);
  };
}
console.log(sum(1)(2)(3)(4)()); // 10
```

---

## 45. What is a polyfill? Write polyfills for map, filter and reduce.

**Short answer:** A polyfill is code that **adds a missing feature** to older browsers (e.g. `Array.prototype.includes` for a browser that doesn't have it). In interviews, "write a polyfill for map/filter/reduce" checks whether you understand how these methods work inside.

```js
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this)); // (element, index, array)
  }
  return result;
};

Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;
  if (accumulator === undefined) {
    // no initial value → start with the first element
    accumulator = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};

console.log([1, 2, 3].myMap((n) => n * 2)); // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter((n) => n % 2 === 0)); // [2, 4]
console.log([1, 2, 3].myReduce((sum, n) => sum + n, 0)); // 6
console.log([1, 2, 3].myReduce((sum, n) => sum + n)); // 6
```

**Quick difference:** `map` returns a **new array** of the same length. `filter` returns a new array with only the items that pass. `reduce` returns **one value**. `forEach` returns `undefined`, so use it only for side effects.

---

## 46. What is the difference between localStorage, sessionStorage and cookies?

| | localStorage | sessionStorage | Cookies |
|---|---|---|---|
| Lasts | until it is cleared | until the **tab** is closed | until the expiry date (or the browser session) |
| Size | ~5–10 MB | ~5 MB | ~4 KB each |
| Sent to the server automatically | ❌ | ❌ | ✅ with **every request** |
| Shared between tabs | ✅ (same site) | ❌ (one tab only) | ✅ |
| Readable by JavaScript | ✅ | ✅ | ✅, unless `HttpOnly` |
| Good for | theme, preferences, draft cart | progress in a multi-step form | login sessions (`HttpOnly; Secure; SameSite`) |

```js
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme")); // dark

// Storage keeps only strings → use JSON for objects
localStorage.setItem("user", JSON.stringify({ id: 1 }));
const savedUser = JSON.parse(localStorage.getItem("user"));
console.log(savedUser.id); // 1

localStorage.removeItem("theme");
sessionStorage.setItem("step", "2");

document.cookie = "lang=en; max-age=86400; path=/"; // HttpOnly cookies can only be set by the server
```

⚠️ Never store passwords or sensitive tokens in localStorage, because any XSS script can read it ([Q62](#62-what-are-xss-and-csrf-and-how-do-you-prevent-them)).

---

## 47. What is CORS and how do you fix a CORS error?

**Short answer:** CORS (Cross-Origin Resource Sharing) is a **browser security rule**. A page from one **origin** (protocol + domain + port) can't read responses from another origin unless that server allows it with headers like `Access-Control-Allow-Origin`. **It is fixed on the server**, not in React code.

> 💡 **Hinglish:** Browser ka security guard. `localhost:5173` ka page `api.com` se data maange, to guard dekhta hai ki API ne "haan, allow hai" bola ya nahi (response headers me). Haan bola tabhi data page ko milta hai.

```
Frontend http://localhost:5173  ── request ──►  API http://localhost:8080
Browser looks at the response headers:
   Access-Control-Allow-Origin: http://localhost:5173   ✅ page gets the data
   (header missing)                                     ❌ "blocked by CORS policy"
```

- **Same origin?** `https://a.com` and `https://a.com:8080` are **different** (different port). `http` and `https` are different too.
- **Preflight:** for "non-simple" requests (PUT/DELETE, JSON body, an `Authorization` header) the browser first sends an **OPTIONS** request to ask for permission.
- **Postman / curl don't hit CORS**, because only browsers enforce it.

**Fixes:**

1. **On the server:** send the right headers (Express `cors()` middleware, Spring `@CrossOrigin`, …).
2. **In development only:** use the dev server's proxy, so the browser sees the same origin:

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: { "/api": "http://localhost:8080" }, // fetch("/api/users") → forwarded to :8080
  },
});
```

---

## 48. How does useEffect work? Explain the dependency array and cleanup.

**Short answer:** `useEffect` runs code **after render** for **side effects** (fetching, timers, subscriptions, DOM work). The **dependency array** decides when it runs again. The function you **return** is the **cleanup**: it runs before the effect runs again and when the component unmounts.

| Dependency array | When the effect runs |
|---|---|
| none: `useEffect(fn)` | after **every** render |
| `[]` | **once**, after the first render (mount) |
| `[a, b]` | after mount, and whenever `a` or `b` changes |

```jsx
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id); // cleanup: stop the timer when Clock unmounts
  }, []);

  return <p>{time.toLocaleTimeString()}</p>;
}
```

> 💡 **Hinglish:** `useEffect` = render ke baad ka "side kaam". Cleanup = jaate-jaate safai: timer band karo, listener hatao.

**Common mistakes:**

- **Missing dependencies** → the effect uses old values. Add everything it uses (the ESLint rule `react-hooks/exhaustive-deps` helps).
- **`setState` inside an effect that depends on the same state** → infinite loop.
- **Objects/functions created during render as dependencies** → they are new every render, so the effect runs every time.
- In **StrictMode (development)**, React runs effects **twice** (mount → cleanup → mount) to catch a missing cleanup.
- **You may not need an effect:** values calculated from props/state should be calculated during render.

---

## 49. What is useRef and when do you use it?

**Short answer:** `useRef` gives you a box `{ current: value }` that **keeps its value between renders** but **does not cause a re-render** when it changes. Two main uses: (1) **access a DOM element** (focus, scroll, measure), (2) **store a mutable value** like a timer id.

```jsx
function SearchBox() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus the input</button>
    </>
  );
}

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null); // keeps the interval id between renders

  function start() {
    if (timerRef.current) return; // already running
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  return (
    <>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

| `useState` | `useRef` |
|---|---|
| change → **re-render** | change → **no re-render** |
| for values shown in the UI | for DOM nodes, timer ids, "previous value", flags |

Don't read or write `ref.current` during render; do it in handlers or effects. In **React 19**, function components can receive `ref` as a normal prop (no `forwardRef` needed).

---

## 50. What is the difference between useMemo, useCallback and React.memo?

**Short answer:** All three avoid repeated work by **remembering** something between renders.

| | Remembers | Use when |
|---|---|---|
| `useMemo(fn, deps)` | the **result** of a calculation | an expensive calculation, or keeping an object/array the same between renders |
| `useCallback(fn, deps)` | the **function itself** | passing a callback to a `React.memo` child, or using a function as an effect dependency |
| `React.memo(Component)` | the **rendered output** of a component | skipping a child's re-render when its props are the same |

```jsx
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.price - b.price), // recalculated only when items change
  [items]
);

const handleDelete = useCallback(
  (id) => setItems((prev) => prev.filter((item) => item.id !== id)),
  [] // the same function on every render
);

const Row = React.memo(function Row({ item, onDelete }) {
  return <li onClick={() => onDelete(item.id)}>{item.name}</li>;
});
```

> 💡 **Hinglish:** Memoization = "jawab yaad rakh lo". Input same hai to dobara calculate mat karo, purana jawab de do.

`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. Use them only where there is a real (measured) problem. The **React Compiler** can add this memoization automatically.

---

## 51. Why are keys important in lists? Why not use the index?

**Short answer:** `key` gives each list item a **stable identity**, so React can match items between renders and update only what changed. Use a **unique, stable id** from your data. Avoid the array **index** if the list can be reordered, filtered, or have items added or removed in the start/middle: React may reuse the wrong element and keep the wrong input text or state.

```jsx
// ✅ Good
{todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}

// ⚠️ Risky when the list changes
{todos.map((todo, index) => <TodoItem key={index} todo={todo} />)}
```

- The index is fine only for **static lists** that never change.
- Keys must be unique **among siblings** only, and they are not passed as a prop.
- **Trick:** changing a key **resets** a component. `<ProfileForm key={userId} />` gives a fresh form for every user.

---

## 52. What are controlled and uncontrolled components?

**Short answer:** In a **controlled** input, React state holds the value (`value` + `onChange`). That makes validation, formatting and conditional UI easy. In an **uncontrolled** input, the **DOM** holds the value and you read it when needed with a `ref` (or `FormData`). That means less code and fewer re-renders. File inputs are always uncontrolled.

```jsx
function ControlledName() {
  const [name, setName] = useState("");
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

function UncontrolledName() {
  const nameRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(nameRef.current.value); // read it only when needed
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="Asha" />
      <button type="submit">Save</button>
    </form>
  );
}
```

⚠️ Start controlled inputs with `""`, not `undefined`. Otherwise React warns that an uncontrolled input became controlled.

---

## 53. What are prop drilling and lifting state up?

**Short answer:** **Lifting state up**: when two components need the same data, move the state to their **closest common parent** and pass it down as props. **Prop drilling**: passing props through many middle components that don't use them, just to reach a deep child. Fix drilling with **Context**, **component composition** (passing `children` / elements), or a state library (Redux, Zustand).

```
App (user) → Layout (user) → Sidebar (user) → Avatar (uses user)
              doesn't need it   doesn't need it        ← prop drilling
```

```jsx
// Lifting state up: both children share the parent's state
function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <Results query={query} />
    </>
  );
}

// Composition: Layout doesn't need to know about `user` at all
// <Layout sidebar={<Avatar user={user} />} />
```

---

## 54. What is a Higher-Order Component (HOC)?

**Short answer:** A HOC is a **function that takes a component and returns a new component** with extra behavior (like `withAuth`, `withLoading`). It is an older pattern for reusing logic. Today **custom hooks** are usually preferred, but HOCs still appear in older code and libraries.

> 💡 **Hinglish:** HOC = component ko ek "cover" pehna dena jo extra feature de de, jaise phone pe cover.

```jsx
function withLoading(Component) {
  return function WithLoading({ isLoading, ...props }) {
    if (isLoading) return <p>Loading…</p>;
    return <Component {...props} />;
  };
}

function UserList({ users }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

const UserListWithLoading = withLoading(UserList);
// <UserListWithLoading isLoading={loading} users={users} />
```

---

## 55. What are Error Boundaries?

**Short answer:** An Error Boundary is a component that **catches errors thrown while rendering its children** and shows a fallback UI instead of a blank white screen. It must be a **class component** (`getDerivedStateFromError` / `componentDidCatch`), or you can use the `react-error-boundary` library. It does **not** catch errors in event handlers or async code (`setTimeout`, `fetch`); use `try/catch` there.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true }; // show the fallback on the next render
  }

  componentDidCatch(error, info) {
    console.error("Logged:", error, info.componentStack); // send to Sentry etc.
  }

  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>;
    return this.props.children;
  }
}

// <ErrorBoundary>
//   <Dashboard />
// </ErrorBoundary>
```

---

## 56. Explain the CSS box model.

**Short answer:** Every element is a box made of **content → padding → border → margin** (inside to outside). With the default `box-sizing: content-box`, `width` sets only the content, so padding and border make the box **bigger**. With `box-sizing: border-box`, `width` **includes** padding and border, which is easier to work with. Most projects set it for every element.

```
┌──────────── margin ────────────┐
│ ┌────────── border ──────────┐ │
│ │ ┌──────── padding ───────┐ │ │
│ │ │        content         │ │ │
│ │ └────────────────────────┘ │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

```css
.box { width: 200px; padding: 20px; border: 5px solid; }
/* content-box: visible width = 200 + 20×2 + 5×2 = 250px */
/* border-box:  visible width = 200px (the content shrinks to 150px) */

* { box-sizing: border-box; }
```

**Margin collapse:** the vertical margins of two blocks next to each other merge into one (the larger one wins).

---

## 57. Explain CSS position: static, relative, absolute, fixed and sticky.

| Value | Positioned relative to | Keeps its space in the layout? | Typical use |
|---|---|---|---|
| `static` (default) | normal flow | ✅ | normal content |
| `relative` | its own normal spot | ✅ | small nudges; a parent for `absolute` children |
| `absolute` | the nearest **positioned** ancestor (not `static`) | ❌ | badges, dropdowns, tooltips |
| `fixed` | the **viewport** (screen) | ❌ | chat button, modal overlay |
| `sticky` | normal until a scroll point, then sticks | ✅ | sticky header, table headers |

```css
.card { position: relative; }
.card .badge { position: absolute; top: 8px; right: 8px; } /* top-right corner of the card */

.navbar { position: sticky; top: 0; }                       /* sticks when you scroll */
.chat-button { position: fixed; bottom: 16px; right: 16px; } /* always on screen */
```

`z-index` works on positioned elements (and flex/grid items).

---

## 58. What is CSS specificity?

**Short answer:** When several CSS rules target the same element, the browser uses the one with **higher specificity**. If they are equal, the **later** rule wins. From low to high: element (`p`) < class / attribute / pseudo-class (`.btn`, `[type]`, `:hover`) < id (`#main`) < inline `style=""`. `!important` beats all of them (avoid it).

Count it as **(ids, classes, elements)**:

| Selector | Score |
|---|---|
| `p` | (0, 0, 1) |
| `.btn` | (0, 1, 0) |
| `nav .btn:hover` | (0, 2, 1) |
| `#header .btn` | (1, 1, 0) |

```css
#title { color: red; }   /* (1,0,0) → wins */
.title { color: blue; }  /* (0,1,0) */
h1     { color: green; } /* (0,0,1) */
```

**Tip:** style with simple class selectors and avoid ids and `!important`, so styles stay easy to override.

---

## 59. What is the difference between display: none, visibility: hidden and opacity: 0?

| | Takes space? | Clickable? | Read by screen readers? |
|---|---|---|---|
| `display: none` | ❌ removed from the layout | ❌ | ❌ |
| `visibility: hidden` | ✅ space stays empty | ❌ | ❌ |
| `opacity: 0` | ✅ | ✅ still clickable! | ✅ |

Use `display: none` to fully hide, `visibility: hidden` to keep the layout the same, and `opacity` for **fade** animations.

---

## 60. What is semantic HTML and why does it matter?

**Short answer:** Semantic HTML uses tags that describe **meaning**, not just looks: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<button>`, `<form>`, `<label>`, headings `h1–h6`. It helps **screen readers**, **SEO** (search engines understand the page), **keyboard support** (buttons and links work for free), and makes the code easier to read.

```html
<!-- ❌ "div soup" -->
<div class="header"><div class="nav">…</div></div>
<div class="btn" onclick="buy()">Buy</div>

<!-- ✅ Semantic -->
<header>
  <nav>…</nav>
</header>
<main>
  <article>
    <h1>Blog title</h1>
    <p>…</p>
  </article>
</main>
<footer>© 2026</footer>
<button onclick="buy()">Buy</button>
```

**`<article>` vs `<section>`:** an article can stand on its own (a blog post, a product card); a section is a themed part of a page, usually with a heading.

---

## 61. What happens when you type a URL in the browser and press Enter?

**Short answer (the steps):**

1. **Parse the URL**: is it a web address or a search?
2. **DNS lookup**: find the server's **IP address** (browser cache → OS → DNS servers).
3. **TCP connection**, plus a **TLS handshake** for HTTPS.
4. **HTTP request**: e.g. `GET /` with headers and cookies.
5. **Response**: a status code + HTML (possibly from a CDN cache).
6. **Parsing**: HTML → **DOM**, CSS → **CSSOM**. Scripts without `defer`/`async` block parsing.
7. **Render tree → layout → paint → composite**: pixels appear on the screen.
8. JavaScript runs, more requests load (images, API calls), and the page becomes interactive.

```
URL → DNS (IP?) → TCP + TLS → HTTP request → response (HTML)
    → DOM + CSSOM → render tree → layout → paint → 🖥
```

> 💡 **Hinglish:** Pehle address (URL) se phone number (IP) dhoondho (DNS), phir call connect karo (TCP/TLS), phir saamaan maango (request), saamaan aaye (response), aur browser usse screen pe sajaaye (render).

---

## 62. What are XSS and CSRF, and how do you prevent them?

**Short answer:**

- **XSS (Cross-Site Scripting):** an attacker gets **their JavaScript to run on your page** (e.g. through a comment containing a script), and it can steal data or tokens. **Prevent it:** never insert raw user HTML (`innerHTML`, `dangerouslySetInnerHTML`) without sanitizing it (DOMPurify). React escapes text by default. Use a **Content-Security-Policy** header, and keep tokens in **HttpOnly** cookies.
- **CSRF (Cross-Site Request Forgery):** another website tricks your logged-in browser into sending a request to your app, because cookies are sent automatically. **Prevent it:** `SameSite=Lax` or `Strict` cookies, CSRF tokens, checking the `Origin` header, and never changing data with a GET request.

> 💡 **Hinglish:** XSS = chor aapke ghar (website) ke andar apna script ghusa deta hai. CSRF = chor kisi doosri website se aapke naam pe (aapki logged-in cookie ke saath) request bhijwa deta hai.

```jsx
const comment = '<img src="x" onerror="stealCookies()">'; // text typed by an attacker

function Comments() {
  return (
    <>
      <p>{comment}</p> {/* ✅ safe: React shows it as plain text */}
      <p dangerouslySetInnerHTML={{ __html: comment }} /> {/* ❌ becomes a real <img>, attacker's code runs */}
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} /> {/* ✅ cleaned first */}
    </>
  );
}
```

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```
