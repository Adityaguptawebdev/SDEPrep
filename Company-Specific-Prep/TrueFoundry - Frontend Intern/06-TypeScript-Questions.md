# 06 — TypeScript Questions

[← Machine Coding](05-Machine-Coding-Problems.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: Next.js →](07-NextJS-Questions.md)

All 🔮 **Predicted**. TypeScript is in TrueFoundry's stack and on your resume (RagaAI, FirstBriq, AlgoTaskFlow). Expect "type this" follow-ups during machine coding, more than standalone TS trivia. All blocks were syntax-checked with esbuild (esbuild doesn't type-check, so the error comments come from TypeScript's documented rules). The examples use domain types (models, usage, logs) so you can reuse them in the [product round](09-TrueFoundry-Product-Questions.md).

## Contents

| # | Topic | Priority |
|---|---|---|
| 1 | [type vs interface](#1-type-vs-interface) | High |
| 2 | [any vs unknown](#2-any-vs-unknown) | High |
| 3 | [Union types](#3-union-types) | High |
| 4 | [Intersection types](#4-intersection-types) | Medium |
| 5 | [Generics](#5-generics) | Critical |
| 6 | [Optional properties](#6-optional-properties) | Medium |
| 7 | [Type narrowing](#7-type-narrowing) | High |
| 8 | [Utility types](#8-utility-types) | High |
| 9 | [Typing React props](#9-typing-react-props) | Critical |
| 10 | [Typing useState](#10-typing-usestate) | High |
| 11 | [Typing API responses](#11-typing-api-responses) | Critical |
| 12 | [TypeScript with reusable components](#12-typescript-with-reusable-components) | High |

**Why TypeScript (opening question):** "TypeScript adds static types to JavaScript. It catches mistakes like wrong prop names or a missing null check while I type, instead of in production. It makes refactoring safe, gives autocomplete, and documents API contracts. The cost is a build step and some learning; the types disappear at runtime, so I still validate untrusted API data." 🗣️ *TS = code ka **spell-checker** — galti likhte waqt hi laal line.*

---

## 1. type vs interface

```ts
interface Model { id: string; provider: string }
interface Model { contextWindow: number }        // ✅ declaration merging (interfaces only)
interface ChatModel extends Model { supportsTools: boolean }

type Status = "healthy" | "degraded" | "down";    // ✅ unions: type only
type ModelWithStatus = Model & { status: Status }; // intersection
type Pair = [string, number];                     // tuples, mapped types: type
```

| | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Extend | `extends` | `&` |
| Unions, tuples, primitives, mapped/conditional types | ❌ | ✅ |
| Declaration merging | ✅ | ❌ (duplicate error) |

✅ **Answer:** "Both describe object shapes and are mostly interchangeable. Interfaces can be extended and re-opened (declaration merging), which suits public object contracts. Type aliases can express anything — unions, tuples, mapped and conditional types. My rule: follow the codebase convention; otherwise `interface` for object shapes like props, and `type` for unions and computed types."

---

## 2. any vs unknown

```ts
let a: any = JSON.parse('{"x":1}');
a.foo.bar();                 // compiles — crashes at runtime ❌

let u: unknown = JSON.parse('{"x":1}');
// u.x;                      // ❌ error: 'u' is of type 'unknown'
if (typeof u === "object" && u !== null && "x" in u) {
  console.log((u as { x: number }).x); // ✅ after narrowing
}
```

🗣️ **Hinglish:** `any` = **"checking band"** — TS ne aankhein band kar li. `unknown` = **"pehle ID dikhao"** — use karne se pehle check karna padega.

✅ **Answer:** "`any` switches off type checking — you can do anything with it, and errors reach runtime. `unknown` is the type-safe version: anything can be assigned to it, but you must narrow it before using it. For API responses, `JSON.parse` output and `catch` errors I use `unknown` and then validate or narrow."

---

## 3. Union types

```ts
type RequestStatus = "idle" | "loading" | "success" | "error";
function badge(status: RequestStatus): string {
  switch (status) {
    case "idle": return "⚪";
    case "loading": return "⏳";
    case "success": return "✅";
    case "error": return "❌";
  }
}
```

✅ **Answer:** "A union `A | B` means the value is one of several types. String-literal unions replace enums for things like status, provider names or HTTP methods, and the compiler checks every case. Before using members that only exist on one side, I narrow the union."

---

## 4. Intersection types

```ts
type Timestamps = { createdAt: string; updatedAt: string };
type Owned = { ownerId: string };
type Deployment = { id: string; name: string } & Timestamps & Owned;

const d: Deployment = { id: "d1", name: "llama-70b", createdAt: "", updatedAt: "", ownerId: "u1" };
```

✅ **Answer:** "An intersection `A & B` combines types: the value must have all properties of both. I use it to compose shared pieces like timestamps or to add props to an existing type. If the same key has incompatible types, it becomes `never`."

🗣️ Union = **ya to chai ya coffee**. Intersection = **chai AUR samosa dono**.

---

## 5. Generics

**Priority:** Critical (reusable components, API helpers).

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([1, 2, 3]);        // number | undefined
const s = first(["gpt", "claude"]); // string | undefined

// Constraint: T must have an id
function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((x) => x.id === id);
}

// Generic API response wrapper
interface Paginated<T> { items: T[]; total: number; nextCursor: string | null }
type LogPage = Paginated<{ id: string; model: string; latencyMs: number }>;
```

🗣️ **Hinglish:** Generic = **type ka placeholder**, jaise function ka parameter hota hai waise type ka parameter. "Jo type doge, wahi type wapas milega."

✅ **Answer:** "Generics let me write one function, type or component that works with many types while keeping the link between input and output. `first<T>(items: T[]): T` returns exactly the item type you passed. With `extends` I add constraints, like 'T must have an `id`'. I use them for API wrappers like `Paginated<T>`, hooks like `useFetch<T>`, and reusable components like a typed `Table<T>` or `Select<T>`."

---

## 6. Optional properties

```ts
interface ModelConfig {
  id: string;
  temperature?: number;          // number | undefined
  readonly provider: string;     // can't be reassigned
}
function temp(c: ModelConfig) {
  return c.temperature ?? 0.7;   // handle the missing case
}
```

✅ **Answer:** "`?` marks a property as optional, so its type includes `undefined` and I must handle that with `??`, `?.` or a check. `readonly` prevents reassignment. With `exactOptionalPropertyTypes` on, 'missing' and 'explicitly undefined' are treated differently."

---

## 7. Type narrowing

```ts
type ApiResult =
  | { ok: true; data: { tokens: number } }
  | { ok: false; error: string };          // discriminated union

function show(r: ApiResult) {
  if (r.ok) return r.data.tokens;           // narrowed to success
  return r.error;                           // narrowed to failure
}

function len(x: string | string[] | null) {
  if (x === null) return 0;                 // equality
  if (typeof x === "string") return x.length; // typeof
  return x.length;                          // string[]
}

function isError(e: unknown): e is Error {  // custom type guard
  return e instanceof Error;
}

// Exhaustiveness check
type Provider = "openai" | "anthropic";
function label(p: Provider) {
  switch (p) {
    case "openai": return "OpenAI";
    case "anthropic": return "Anthropic";
    default: { const never: never = p; return never; } // adding a provider breaks the build here
  }
}
```

✅ **Answer:** "Narrowing is how TypeScript works out a more specific type inside a branch — using `typeof`, `instanceof`, `in`, equality checks, truthiness, custom type guards (`x is T`), and discriminated unions with a shared literal field like `status` or `ok`. I also use a `never` check in the `default` case so adding a new union member causes a compile error wherever it isn't handled."

---

## 8. Utility types

```ts
interface User { id: string; name: string; email: string; role: "admin" | "member" }

type UserUpdate = Partial<User>;                  // all optional (PATCH body)
type NewUser = Omit<User, "id">;                  // create form
type UserPreview = Pick<User, "id" | "name">;     // list item
type Frozen = Readonly<User>;
type CostByModel = Record<string, number>;        // { [model]: cost }
type FullUser = Required<UserUpdate>;
type Role = User["role"];                         // indexed access → "admin" | "member"
type NonNull = NonNullable<string | null>;        // string

async function getUsage() { return { tokens: 1, cost: 2 }; }
type Usage = Awaited<ReturnType<typeof getUsage>>; // { tokens: number; cost: number }
type FnParams = Parameters<(a: string, b: number) => void>; // [a: string, b: number]
```

✅ **Answer:** "Utility types build new types from existing ones so I don't duplicate them: `Partial` for update payloads, `Pick` and `Omit` for subsets like a form without the id, `Record` for dictionaries like cost per model, `Readonly`, `Required`, and `ReturnType`/`Awaited`/`Parameters` to derive types from functions."

---

## 9. Typing React props

```tsx
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = "primary", loading = false, icon, children, ...rest }: ButtonProps) {
  return (
    <button {...rest} disabled={loading || rest.disabled} className={variant === "primary" ? "btn-primary" : "btn-ghost"}>
      {loading ? "…" : icon}
      {children}
    </button>
  );
}

interface CellProps {
  value: "X" | "O" | null;
  isWinning: boolean;
  onClick: () => void;
}
```

✅ **Answer:** "I define an interface for props and destructure with defaults. `children` is `ReactNode`. Event handlers are typed like `(e: React.ChangeEvent<HTMLInputElement>) => void`. For wrappers around native elements I extend `ButtonHTMLAttributes` or use `ComponentProps<'button'>`, so `onClick`, `type` and `aria-*` work automatically. I avoid `React.FC` in new code mostly as a style choice — it no longer adds implicit children."

---

## 10. Typing useState

```tsx
const [count, setCount] = useState(0);                       // inferred number
const [model, setModel] = useState<string | null>(null);     // must annotate: null alone → null type
const [rows, setRows] = useState<LogRow[]>([]);               // [] alone → never[]
const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

interface LogRow { id: string; model: string; latencyMs: number }
const inputRef = useRef<HTMLInputElement>(null);
```

✅ **Answer:** "When the initial value says everything, I let TypeScript infer it. I add a generic when the initial value is narrower than the real type — `null` that will become an object, an empty array, or a string-literal union for status. Refs to DOM elements are `useRef<HTMLInputElement>(null)`."

---

## 11. Typing API responses

```ts
interface UsageRow { model: string; provider: string; tokens: number; costUsd: number }
interface ApiError { message: string; code?: string }

async function apiGet<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Partial<ApiError>;
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T; // ⚠️ a promise to the compiler, not a runtime check
}

// const rows = await apiGet<UsageRow[]>("/api/usage?range=7d");
```

**Runtime validation with Zod (types and checks from one schema):**

```ts
import { z } from "zod";
const UsageRowSchema = z.object({
  model: z.string(),
  provider: z.string(),
  tokens: z.number().int().nonnegative(),
  costUsd: z.number(),
});
type UsageRowZ = z.infer<typeof UsageRowSchema>;

async function getUsage(): Promise<UsageRowZ[]> {
  const json: unknown = await (await fetch("/api/usage")).json();
  return z.array(UsageRowSchema).parse(json); // throws if the backend shape changed
}
```

✅ **Answer:** "I type responses with interfaces that mirror the backend contract and a generic fetch helper like `apiGet<T>`. But types vanish at runtime — `as T` is only a promise to the compiler. For data I don't control I validate with a schema library like Zod and infer the TypeScript type from the schema, so the runtime check and the type can't drift apart. Ideally types are generated from the OpenAPI spec."

**Your real link:** FirstBriq's Briq Ops README describes validating every LLM JSON output with Zod before using it ([10](10-Project-and-HR-Questions.md#firstbriq)).

---

## 12. TypeScript with reusable components

**Generic, type-safe `Select<T>` — the option type flows into `onChange`:**

```tsx
interface SelectProps<T> {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
}

export function Select<T>({ items, value, onChange, getLabel, getKey }: SelectProps<T>) {
  return (
    <select
      value={value ? getKey(value) : ""}
      onChange={(e) => {
        const found = items.find((i) => getKey(i) === e.target.value);
        if (found) onChange(found);
      }}
    >
      <option value="" disabled>Choose…</option>
      {items.map((i) => (
        <option key={getKey(i)} value={getKey(i)}>{getLabel(i)}</option>
      ))}
    </select>
  );
}

// usage — `m` is inferred as Model, no casts
interface Model { id: string; name: string; costPer1k: number }
// <Select items={models} value={selected} onChange={(m) => setSelected(m)} getLabel={(m) => m.name} getKey={(m) => m.id} />
```

**Generic `Table<T>` with typed columns:**

```tsx
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
}
export function Table<T extends { id: string }>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) {
  return (
    <table>
      <thead><tr>{columns.map((c) => <th key={String(c.key)}>{c.header}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>{columns.map((c) => <td key={String(c.key)}>{c.render ? c.render(r) : String(r[c.key])}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
// columns: [{ key: "model", header: "Model" }, { key: "costUsd", header: "Cost", render: (r) => `$${r.costUsd}` }]
// a typo like key: "cost" is a compile error ✅
```

✅ **Answer:** "For reusable components I use generics so the component knows the shape of the data the caller passes. A `Table<T>` takes `columns` whose `key` is `keyof T`, so a typo in a column key is a compile error, and `render` receives a fully typed row. A `Select<T>` returns the real item type in `onChange`. That's how the reusable component library stays safe as the backend data changes."

---

### Quick-fire

| Question | Answer |
|---|---|
| `never`? | a type with no values — exhaustive checks, functions that always throw |
| `as const`? | makes literals readonly and narrow: `["gpt","claude"] as const` → `readonly ["gpt","claude"]` |
| `keyof` / `typeof`? | `keyof T` = union of keys; `typeof value` = type of a variable |
| `enum` vs union? | prefer string unions — no runtime code, simpler |
| `satisfies`? | checks a value against a type **without** widening it: `const cfg = {...} satisfies Config` |
| `interface` for function? | `type Handler = (e: Event) => void` is clearer |
