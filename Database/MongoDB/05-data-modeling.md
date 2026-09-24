# MongoDB 05 — Data Modeling (Schema Design)

> **Level**: Intermediate · **Read time**: ~25 min · Sample data: [sample-data.js](sample-data.js)

> **Definition**: **Data modeling** in MongoDB means deciding **what a document looks like** and **how documents relate**: put related data **inside** one document (**embedding**), or keep it in separate documents and store an id to find it (**referencing**).

**In one line**: *Design for the questions your app asks most often — data that is read together should be stored together.*

**Easy analogy — the almirah at home**: Ghar ki **almirah**: jo cheezein **roz** use hoti hain (uniform, chabi, wallet) wo **saamne** rakhte ho — ek hi move mein mil jati hain (**embedding**). Jo **kabhi-kabhi** chahiye (purane photo albums, rajai) wo **store-room** mein, aur bas ek chit rakhte ho "rajai → store-room, box 3" (**referencing**). Sab kuch saamne rakhoge toh almirah bhar jayegi; sab store-room mein rakhoge toh din bhar aana-jaana lagega.

```
 EMBEDDED (one read)                          REFERENCED (two reads / $lookup)
 order                                        order                      products
 ┌────────────────────────────┐               ┌──────────────────┐       ┌────────────────┐
 │ _id: 101                   │               │ _id: 101         │       │ _id: "P1"      │
 │ items: [                   │               │ items: [         │──────►│ name: "Pen"    │
 │   { sku:"P1", qty:10,      │               │   { sku:"P1",    │       │ price: 10      │
 │     price:10 },  ...       │               │     qty:10 } ]   │       └────────────────┘
 │ ]                          │               └──────────────────┘
 └────────────────────────────┘
```

---

## 1. Embed or reference? — the decision table

| | **Embed** (nested inside) | **Reference** (store the id) |
|---|---|---|
| Read together? | **yes**, almost always | not always |
| Reads | **1 query**, fast | 2 queries or `$lookup` |
| Updates | one document → **atomic** | several documents (need a transaction for atomicity) |
| Data size | small and bounded | large or **grows without limit** |
| Duplicated data | some | none |
| Relationship | **one-to-one**, **one-to-few** | **one-to-many**, many-to-many |
| Example | user → address, order → items | user → orders, post → millions of likes |

**Rules of thumb**

1. **Embed** when data is *read together*, changes together, and is **small and bounded** (a user's 3 addresses).
2. **Reference** when the "many" side is **large / unbounded**, is used **alone** too, or is **shared** by many parents.
3. A document is limited to **16 MB** — never let an embedded array grow forever.

---

## 2. Relationship patterns

**One-to-one** — embed:

```js
{ _id: 1, name: "Asha", address: { city: "Delhi", pin: "110001" } }
```

**One-to-few** — embed an array (bounded, small):

```js
{ _id: 1, name: "Asha", phones: ["98111", "98222"] }
```

**One-to-many** — the "many" side is big → **reference from the child to the parent** (each order keeps `userId`):

```js
// users:   { _id: 1, name: "Asha" }
// orders:  { _id: 101, userId: 1, total: 200 }     ← child points to parent
```

**One-to-squillions** (logs, events, likes) — always reference from the child; never keep them in an array on the parent.

**Many-to-many** — an **array of ids** on one or both sides (no junction table needed):

```js
// books:   { _id: "b1", title: "SQL Basics", authorIds: ["a1", "a2"] }
// authors: { _id: "a1", name: "Rekha" }
```

---

## 3. Worked example — orders (our `shop` data)

```javascript
db.orders.findOne({ _id: 101 })
```

```result
{
  _id: 101,
  userId: 1,
  status: 'delivered',
  date: ISODate('2024-01-05T00:00:00.000Z'),
  items: [
    { sku: 'P1', qty: 10, price: 10 },
    { sku: 'P2', qty: 2, price: 50 }
  ],
  total: 200
}
```

Design choices in this document:

- **`items` is embedded** — an order is always read together with its items, and an order has a small, bounded number of items.
- Each item stores a **copy of `price`** at the time of purchase. This is on purpose: if the product price changes tomorrow, the old order must **not** change. (In SQL you would also copy the price into the order-items row.)
- **`userId` is a reference** — the user lives in its own collection (a user has many orders and is used everywhere else).

**Extended reference pattern** — copy the few fields you always show next to the reference, so you can skip the `$lookup`:

```js
{ _id: 101, user: { _id: 1, name: "Asha" }, total: 200 }     // name copied from users
```

Trade-off: if Asha changes her name, you must update the copies (or accept old names in old orders).

---

## 4. Handy design patterns

| Pattern | Problem | Idea |
|---|---|---|
| **Subset** | a document has a huge array, but the app shows only the latest few | keep the **last 10 reviews** embedded, the rest in another collection |
| **Bucket** | millions of small time-series points | group readings into **one document per hour/day** (`readings: [...]`) |
| **Computed** | expensive `count`/`sum` on every read | store `commentCount` and update it on write |
| **Extended reference** | joins on every read | copy small, rarely-changing fields |
| **Schema versioning** | schema changes over time | add `schemaVersion: 2` and migrate lazily |
| **Polymorphic** | different shapes in one collection (`type: "book" / "movie"`) | one collection, a `type` field |

**Anti-patterns**: unbounded arrays, huge documents, too many collections that are always `$lookup`-ed together, using MongoDB exactly like SQL (normalising everything), storing dates/numbers as strings.

---

## 5. Atomicity gives embedding a superpower

A write to **one document is always atomic** (all or nothing), even if it touches many fields and nested arrays. So if two pieces of data must change together, put them **in the same document**. Reference-based designs need a **multi-document transaction** for the same guarantee (see note 06).

```javascript
// one atomic operation: add an item AND update the total together
db.orders.updateOne(
  { _id: 106 },
  { $push: { items: { sku: "P1", qty: 3, price: 10 } }, $inc: { total: 30 } }
)
db.orders.findOne({ _id: 106 }, { items: 1, total: 1 })
```

```result
{
  _id: 106,
  items: [
    { sku: 'P2', qty: 4, price: 50 },
    { sku: 'P1', qty: 3, price: 10 }
  ],
  total: 230
}
```

---

## 6. Schema validation — flexible does not mean "anything goes"

MongoDB can enforce rules on a collection with **`$jsonSchema`**:

```javascript
db.createCollection("reviews", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["productId", "rating"],
    properties: {
      productId: { bsonType: "string" },
      rating:    { bsonType: "number", minimum: 1, maximum: 5 },
      comment:   { bsonType: "string" }
    }
  } }
})
```

```result
{ ok: 1 }
```

```javascript
db.reviews.insertOne({ productId: "P1", rating: 5, comment: "Great pen" }).acknowledged     // valid → accepted
```

```result
true
```

```javascript
// expect-error
db.reviews.insertOne({ productId: "P1", rating: 9 })      // rating > 5 → "Document failed validation"
```

`validationAction: "warn"` logs instead of rejecting; `validationLevel: "moderate"` skips existing invalid documents. In Node.js, **Mongoose** schemas do a similar job in the application layer.

---

## 7. SQL thinking vs MongoDB thinking

| | SQL | MongoDB |
|---|---|---|
| Start from | the **data** (entities and relations) | the **queries** (access patterns) |
| Default | **normalize**, join when reading | **embed**, reference only when needed |
| Duplicate data | avoid | acceptable when it removes joins |
| Schema change | `ALTER TABLE` (often heavy) | just start writing new fields |
| Many-to-many | junction table | array of ids |

**Checklist before you design**

1. What are the **top 5 queries** (reads and writes)?
2. Which data is **read together**? → embed it.
3. Which arrays can **grow without limit**? → reference them.
4. Which data is **shared** or changes often? → reference it.
5. Which copies of data are acceptable if slightly **stale**? → denormalize.

---

> 🗣️ **Interview mein aise bolo**: *"Jo data saath padha jata hai use embed karta hun; jo unbounded ya shared hai use reference karta hun. Order mein price ki copy rakhta hun taaki history na badle."*

## ⚡ Quick revision

- **Embed** = read together, small, bounded, one-to-one / one-to-few → one query, atomic updates.
- **Reference** = large, unbounded, shared, one-to-many / many-to-many → separate collection + `$lookup`.
- Never let arrays grow without limit (16 MB document limit). Reference from the **child to the parent**.
- Copy the **price at purchase time** into the order — history must not change.
- Patterns: subset, bucket, computed, extended reference, schema versioning.
- Single-document writes are **atomic**; use `$jsonSchema` validation for rules.
- Model for your **queries**, not for the "pure" data shape.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [06-transactions-replication-sharding.md](06-transactions-replication-sharding.md)
