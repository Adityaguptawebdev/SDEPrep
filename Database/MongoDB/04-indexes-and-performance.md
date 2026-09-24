# MongoDB 04 — Indexes & Performance

> **Level**: Intermediate · **Read time**: ~25 min · Sample data: [sample-data.js](sample-data.js)

> **Definition**: An **index** in MongoDB is a small, sorted data structure (a **B-tree**) built on one or more fields. Without it MongoDB must read **every document** in the collection (a **collection scan**, `COLLSCAN`). With it MongoDB jumps straight to the matching documents (`IXSCAN`).

**In one line**: Index the fields you **filter** and **sort** on. Every index makes reads faster and writes a little slower.

**Easy analogy — the contacts app on your phone**: Phone ki **contacts app**: contacts naam se sorted hain, isliye "Rahul" dhoondhna turant hota hai. Lekin "Pune mein rehne wale sab log" dhoondhna ho toh saare contacts scroll karne padenge — jab tak tum city ke hisaab se **alag sorted list** na bana lo. Har extra sorted list = ek index: search fast, lekin naya contact **har list** mein add karna padta hai.

```
 No index on city                         Index on city
 find({city:"Pune"})                      find({city:"Pune"})
 ┌─┬─┬─┬─┬─┬─┬─┬─┐                        city index (sorted)        documents
 │1│2│3│4│5│6│7│8│  read ALL docs         Delhi  → 1, 3
 └─┴─┴─┴─┴─┴─┴─┴─┘  (COLLSCAN)            Mumbai → 2, 5
                                          Pune   → 4        ◄── jump here, read 1 doc (IXSCAN)
```

---

## 1. See the plan first — `explain()`

`explain("executionStats")` tells you how a query really ran. The helper below prints the few fields that matter:

| Field | Meaning | Good sign |
|---|---|---|
| `winningPlan.stage` | how documents were found | `IXSCAN` (index) — not `COLLSCAN` |
| `totalKeysExamined` | index entries read | close to `nReturned` |
| `totalDocsExamined` | documents read | close to `nReturned` (0 for a covered query) |
| `nReturned` | documents returned | – |
| `SORT` stage present? | sorting done **in memory** | absent (index gives the order) |

```javascript
db.users.getIndexes()          // every collection starts with only the _id index
```

```result
[ { v: 2, key: { _id: 1 }, name: '_id_' } ]
```

```javascript
const plan = db.users.find({ city: "Delhi" }).explain("executionStats");
({ stage: plan.queryPlanner.winningPlan.stage,
   docsExamined: plan.executionStats.totalDocsExamined,
   returned: plan.executionStats.nReturned })
```

```result
{ stage: 'COLLSCAN', docsExamined: 5, returned: 2 }
```

Read all 5 documents to return 2 → **COLLSCAN**. Now add an index:

```javascript
db.users.createIndex({ city: 1 })          // 1 = ascending, -1 = descending
```

```result
city_1
```

```javascript
const plan = db.users.find({ city: "Delhi" }).explain("executionStats");
({ stage: plan.queryPlanner.winningPlan.inputStage.stage,      // FETCH → IXSCAN
   docsExamined: plan.executionStats.totalDocsExamined,
   returned: plan.executionStats.nReturned })
```

```result
{ stage: 'IXSCAN', docsExamined: 2, returned: 2 }
```

Now it reads only the 2 matching documents.

---

## 2. Index types

| Type | Create with | Use for |
|---|---|---|
| **Single field** | `{ city: 1 }` | filter / sort on one field |
| **Compound** | `{ city: 1, age: -1 }` | filter on several fields, filter + sort |
| **Multikey** | `{ skills: 1 }` (field is an array) | search inside arrays — automatic |
| **Text** | `{ name: "text", tags: "text" }` | word search with `$text` |
| **Hashed** | `{ userId: "hashed" }` | equality only; used for **hash sharding** |
| **Geospatial** | `{ location: "2dsphere" }` | "near me" queries |
| **TTL** | `{ createdAt: 1 }, { expireAfterSeconds: 3600 }` | auto-delete old documents (sessions, logs) |
| **Unique** | `{ email: 1 }, { unique: true }` | no duplicate values |
| **Partial** | `{ ... }, { partialFilterExpression: { active: true } }` | index only some documents (smaller) |
| **Sparse** | `{ ... }, { sparse: true }` | skip documents that lack the field |
| **Wildcard** | `{ "attrs.$**": 1 }` | fields you cannot predict |

**Unique index** — the database rejects duplicates:

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

```result
email_1
```

```javascript
// expect-error
db.users.insertOne({ _id: 20, name: "Copy", email: "asha@example.com" })      // E11000 duplicate key error
```

**Text index** and a `$text` search:

```javascript
db.products.createIndex({ name: "text", tags: "text" })
db.products.find({ $text: { $search: "computer" } }, { _id: 0, name: 1 }).sort({ _id: 1 })
```

```result
[ { name: 'Laptop' }, { name: 'Mouse' } ]
```

**TTL index** — MongoDB deletes each document about `expireAfterSeconds` after the date in that field:

```javascript
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
```

```result
createdAt_1
```

---

## 3. Compound indexes — order matters (the ESR rule)

Order the fields in a compound index as **E → S → R**:

1. **E**quality fields first (`city = "Mumbai"`)
2. **S**ort fields next (`sort age`)
3. **R**ange fields last (`age > 20`)

An index on `{ city: 1, age: -1 }` also works for queries that use only its **left-most prefix** (`city`), but **not** for `age` alone (same idea as the leftmost-prefix rule in SQL).

Helper that lists the stages of a plan (a `SORT` stage means the sort happens **in memory** — slow):

```javascript
function stages(p) { const s = []; for (let x = p; x; x = x.inputStage) s.push(x.stage); return s; }

// only the city index exists → the database must sort in memory
stages(db.users.find({ city: "Mumbai" }).sort({ age: -1 }).explain().queryPlanner.winningPlan)
```

```result
[ 'SORT', 'FETCH', 'IXSCAN' ]
```

```javascript
db.users.createIndex({ city: 1, age: -1 })
function stages(p) { const s = []; for (let x = p; x; x = x.inputStage) s.push(x.stage); return s; }

// same query, now the index already stores age in sorted order → no SORT stage
stages(db.users.find({ city: "Mumbai" }).sort({ age: -1 }).explain().queryPlanner.winningPlan)
```

```result
[ 'FETCH', 'IXSCAN' ]
```

### Covered query — answered from the index alone

If the filter **and** the projection use only indexed fields (and `_id: 0`), MongoDB never reads the documents:

```javascript
const plan = db.users.find({ city: "Mumbai" }, { _id: 0, city: 1, age: 1 }).explain("executionStats");
({ docsExamined: plan.executionStats.totalDocsExamined, returned: plan.executionStats.nReturned })
```

```result
{ docsExamined: 0, returned: 2 }
```

---

## 4. When an index does not help

- **No index on the query fields** → `COLLSCAN`.
- **Unanchored regex** (`/abc/`) or **case-insensitive regex** → cannot use the index well. `/^abc/` can.
- **`$ne` / `$nin` / `$not`** are usually not selective.
- **Low-cardinality field** (e.g. `active: true/false`) → index rarely helps alone.
- **Fields in a different order** than the compound index (skipping the first field).
- **Too many indexes** → slower inserts/updates, more RAM. (Limit: 64 indexes per collection.)

Manage indexes:

```js
db.users.getIndexes()
db.users.dropIndex("city_1")
db.users.find({ city: "Pune" }).hint({ city: 1 })      // force a specific index (for testing)
db.users.totalIndexSize()
```

---

## 5. Finding slow queries

1. **Profiler**: `db.setProfilingLevel(1, { slowms: 100 })` then read `db.system.profile` (queries slower than 100 ms).
2. **`explain("executionStats")`** on the slow query — look for `COLLSCAN`, big `totalDocsExamined`, in-memory `SORT`.
3. Add or fix an index (ESR), or rewrite the query / pipeline.
4. Keep the **working set** (hot data + indexes) in **RAM**.

Other quick wins: use **projection** (return fewer fields), **limit** results, prefer **range-based pagination** (`_id > lastId`) over big `skip()`, use `$match` first in pipelines.

---

> 🗣️ **Interview mein aise bolo**: *"Query slow ho toh main explain("executionStats") dekhta hun. COLLSCAN mila toh ESR rule se compound index banata hun: Equality, Sort, Range."*

## ⚡ Quick revision

- No index → `COLLSCAN` (reads everything). Index → `IXSCAN`. Check with **`explain("executionStats")`**.
- `_id` is always indexed. Compound index = **left-most prefix** rule + **ESR** (Equality, Sort, Range).
- **Covered query** = answered only from the index (`docsExamined: 0`).
- Special indexes: **multikey** (arrays), **text**, **TTL** (auto-expire), **unique**, **partial**, **hashed** (sharding).
- A `SORT` stage in the plan = in-memory sort → add an index that matches the sort.
- Indexes speed up reads but slow down writes and use RAM.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [05-data-modeling.md](05-data-modeling.md)
