# MongoDB 02 — Query & Update Operators

> **Level**: Beginner → Intermediate · **Read time**: ~30 min · Sample data: [sample-data.js](sample-data.js)

> **Definition**: **Operators** are special keywords starting with `$` that you use inside a query or update document. **Query operators** (`$gt`, `$in`, `$or`…) decide *which documents match*. **Update operators** (`$set`, `$inc`, `$push`…) decide *how to change them*.

**In one line**: `db.collection.find({ field: { $operator: value } })` — the filter is just a JSON object.

**Easy analogy — filter panel on a shopping site**: Amazon ke left side ke filters: *price 500–2000*, *brand in [A, B]*, *rating ≥ 4*, *in stock*. Har tick ek **query operator** hai, aur sab ticks **AND** se judte hain. "Add to cart" dabane pe quantity +1 hoti hai → yeh **update operator** (`$inc`) hai.

```
 find(  { price: { $gte: 500, $lte: 2000 },  brand: { $in: ["A","B"] },  stock: { $gt: 0 } }  )
          └── AND ──────────────────────────┘   └── AND ─────────────┘     └── AND ────────┘
 (fields written side by side in one object are combined with AND automatically)
```

---

## 1. Comparison and logical operators

| Operator | Meaning | SQL |
|---|---|---|
| `$eq`, `$ne` | equal, not equal | `=`, `<>` |
| `$gt`, `$gte`, `$lt`, `$lte` | greater / less | `>`, `>=`, `<`, `<=` |
| `$in`, `$nin` | matches any value in a list / none | `IN`, `NOT IN` |
| `$and`, `$or`, `$nor`, `$not` | combine conditions | `AND`, `OR`, `NOT` |
| `$exists` | field present or not | `IS NOT NULL` (roughly) |
| `$regex` | pattern match | `LIKE` |

```javascript
db.users.find({ age: { $gte: 30 } }, { _id: 0, name: 1, age: 1 })
```

```result
[
  { name: 'Ravi', age: 35 },
  { name: 'Karan', age: 41 },
  { name: 'Sara', age: 30 }
]
```

```javascript
db.users.find({ city: { $in: ["Delhi", "Pune"] } }, { _id: 0, name: 1, city: 1 })
```

```result
[
  { name: 'Asha', city: 'Delhi' },
  { name: 'Meena', city: 'Delhi' },
  { name: 'Karan', city: 'Pune' }
]
```

**AND is implicit**; use `$or` when you need OR:

```javascript
// Mumbai AND active  (two fields side by side = AND)
db.users.find({ city: "Mumbai", active: true }, { _id: 0, name: 1 })
```

```result
[ { name: 'Ravi' }, { name: 'Sara' } ]
```

```javascript
// younger than 25  OR  lives in Pune
db.users.find({ $or: [ { age: { $lt: 25 } }, { city: "Pune" } ] }, { _id: 0, name: 1 })
```

```result
[ { name: 'Meena' }, { name: 'Karan' } ]
```

### `$exists`, `null` and `$regex`

```javascript
db.users.find({ email: { $exists: false } }, { _id: 0, name: 1 })     // field is missing
```

```result
[ { name: 'Meena' } ]
```

> ⚠️ `{ email: null }` matches documents where `email` is `null` **or missing**. Use `$exists` when you must tell them apart.

```javascript
db.users.find({ name: /^[AK]/ }, { _id: 0, name: 1 })                // names starting with A or K
```

```result
[ { name: 'Asha' }, { name: 'Karan' } ]
```

`/^abc/` (anchored at the start) can use an index; `/abc/` or `/.*abc/` cannot.

---

## 2. Nested fields and arrays

**Dot notation** reaches inside nested documents (put the path in quotes):

```javascript
db.users.find({ "address.city": "Mumbai" }, { _id: 0, name: 1 })
```

```result
[ { name: 'Ravi' } ]
```

**Arrays** — a plain value matches if the array **contains** it:

| Query | Meaning |
|---|---|
| `{ skills: "sql" }` | array contains `"sql"` |
| `{ skills: ["java", "sql"] }` | array is **exactly** `["java","sql"]` (same order) |
| `{ skills: { $all: ["sql", "mongodb"] } }` | contains **all** of these |
| `{ skills: { $size: 0 } }` | array has exactly this length |
| `{ "skills.0": "js" }` | first element is `"js"` |

```javascript
db.users.find({ skills: { $all: ["sql", "mongodb"] } }, { _id: 0, name: 1, skills: 1 })
```

```result
[ { name: 'Meena', skills: [ 'python', 'sql', 'mongodb' ] } ]
```

### `$elemMatch` — several conditions on the **same** array element

`orders.items` is an array of objects. We want an order that has **one** item with `sku = "P4"` **and** `qty >= 2`.

```javascript
// RIGHT: both conditions must hold for the SAME item
db.orders.find({ items: { $elemMatch: { sku: "P4", qty: { $gte: 2 } } } }, { _id: 1 })
```

```result
[ { _id: 103 } ]
```

```javascript
// WRONG: conditions can be satisfied by DIFFERENT items → extra orders match
db.orders.find({ "items.sku": "P4", "items.qty": { $gte: 2 } }, { _id: 1 })
```

```result
[ { _id: 103 }, { _id: 105 }, { _id: 107 } ]
```

---

## 3. Sorting, paging and counting

```javascript
db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1 }).skip(1).limit(2)
```

```result
[ { name: 'Ravi', age: 35 }, { name: 'Sara', age: 30 } ]
```

`sort({ age: -1 })` = `ORDER BY age DESC` · `skip(1)` = `OFFSET 1` · `limit(2)` = `LIMIT 2`. The order you chain them does not matter — MongoDB always does **sort → skip → limit**.

```javascript
db.users.distinct("city")                    // unique values, like SELECT DISTINCT
```

```result
[ 'Delhi', 'Mumbai', 'Pune' ]
```

`countDocuments(filter)` counts matches exactly. `estimatedDocumentCount()` is instant but takes no filter.

---

## 4. Update operators

| Operator | Does | Example |
|---|---|---|
| `$set` | set / add a field | `{ $set: { age: 30 } }` |
| `$unset` | remove a field | `{ $unset: { phone: "" } }` |
| `$inc` | add a number (negative to subtract) | `{ $inc: { stock: -1 } }` |
| `$mul` | multiply | `{ $mul: { price: 1.1 } }` |
| `$min` / `$max` | update only if smaller / larger | `{ $max: { score: 90 } }` |
| `$rename` | rename a field | `{ $rename: { city: "town" } }` |
| `$currentDate` | set to now | `{ $currentDate: { updatedAt: true } }` |

```javascript
db.products.updateOne({ _id: "P1" }, { $inc: { stock: -5 }, $set: { onSale: true } })
db.products.findOne({ _id: "P1" }, { name: 1, stock: 1, onSale: 1 })
```

```result
{ _id: 'P1', name: 'Pen', stock: 195, onSale: true }
```

### Array update operators

| Operator | Does |
|---|---|
| `$push` | add an element to the end (duplicates allowed) |
| `$addToSet` | add only if **not already present** |
| `$pull` | remove elements that match a condition |
| `$pop` | remove first (`-1`) or last (`1`) element |
| `$each` | add many elements at once (inside `$push`/`$addToSet`) |

```javascript
db.users.updateOne({ _id: 5 }, { $push: { skills: { $each: ["docker", "k8s"] } } })
db.users.updateOne({ _id: 5 }, { $addToSet: { skills: "docker" } })        // already there → no change
db.users.updateOne({ _id: 5 }, { $pull: { skills: "k8s" } })
db.users.findOne({ _id: 5 }, { name: 1, skills: 1 })
```

```result
{ _id: 5, name: 'Sara', skills: [ 'docker' ] }
```

### Updating one element inside an array

```javascript
// $  = "the first array element that matched the filter"
db.orders.updateOne({ _id: 101, "items.sku": "P1" }, { $set: { "items.$.qty": 12 } })
db.orders.findOne({ _id: 101 }, { items: 1 })
```

```result
{
  _id: 101,
  items: [
    { sku: 'P1', qty: 12, price: 10 },
    { sku: 'P2', qty: 2, price: 50 }
  ]
}
```

```javascript
// $[name] + arrayFilters = update ALL elements that match a condition
db.orders.updateOne({ _id: 105 }, { $mul: { "items.$[i].price": 2 } }, { arrayFilters: [ { "i.sku": "P4" } ] })
db.orders.findOne({ _id: 105 }, { items: 1 })
```

```result
{
  _id: 105,
  items: [
    { sku: 'P1', qty: 5, price: 10 },
    { sku: 'P4', qty: 1, price: 1000 }
  ]
}
```

---

## 5. Upsert, replace and find-and-modify

**Upsert** = *update if it exists, otherwise insert*:

```javascript
db.users.updateOne({ _id: 9 }, { $set: { name: "Zoya", age: 27 } }, { upsert: true })
```

```result
{
  acknowledged: true,
  insertedId: 9,
  matchedCount: 0,
  modifiedCount: 0,
  upsertedCount: 1
}
```

**`updateOne` with `$set` vs `replaceOne`**: `$set` changes only the listed fields. `replaceOne` **replaces the whole document** (keeps only `_id`).

```javascript
db.users.replaceOne({ _id: 9 }, { name: "Zoya", city: "Goa" })
db.users.findOne({ _id: 9 })                          // age is gone!
```

```result
{ _id: 9, name: 'Zoya', city: 'Goa' }
```

**`findOneAndUpdate`** updates **and returns** the document in one atomic step (the classic "counter" or "claim a job" pattern):

```javascript
db.products.findOneAndUpdate(
  { _id: "P3" },
  { $inc: { stock: -1 } },
  { returnDocument: "after", projection: { name: 1, stock: 1 } }
)
```

```result
{ _id: 'P3', name: 'Laptop', stock: 14 }
```

**`bulkWrite`** sends many different writes in one round trip. **`insertMany`** with `ordered: false` keeps going after a failed document.

---

## 6. SQL → MongoDB cheat sheet

| SQL | MongoDB |
|---|---|
| `SELECT * FROM users` | `db.users.find()` |
| `SELECT name, age FROM users` | `db.users.find({}, { name: 1, age: 1, _id: 0 })` |
| `WHERE age >= 30 AND city = 'Pune'` | `find({ age: { $gte: 30 }, city: "Pune" })` |
| `WHERE city IN ('A','B')` | `find({ city: { $in: ["A", "B"] } })` |
| `ORDER BY age DESC LIMIT 5` | `find().sort({ age: -1 }).limit(5)` |
| `SELECT COUNT(*) …` | `countDocuments({ … })` |
| `UPDATE users SET age = 30 WHERE id = 1` | `updateOne({ _id: 1 }, { $set: { age: 30 } })` |
| `DELETE FROM users WHERE id = 1` | `deleteOne({ _id: 1 })` |
| `INSERT INTO users …` | `insertOne({ … })` |

---

## 7. Common mistakes

- Writing `updateOne({...}, { age: 30 })` **without** an operator → error. Use `{ $set: { age: 30 } }`.
- Forgetting that `find()` returns a **cursor**, not an array — use `.toArray()` in code (mongosh prints the first 20 automatically).
- Using two conditions on an array of objects **without `$elemMatch`**.
- Comparing a number with a string (`age: "30"` will not match `30`) — types matter.
- Trying to change `_id` (not allowed).

---

> 🗣️ **Interview mein aise bolo**: *"Filter ek JSON object hai, alag-alag fields AND hote hain. Array ke ek hi element pe do conditions lagani ho toh $elemMatch chahiye."*

## ⚡ Quick revision

- Filter = JSON object; several fields = **AND**; use `$or` for OR.
- `$in` / `$nin`, `$gt…$lte`, `$exists`, `$regex`; dot notation for nested fields (`"address.city"`).
- Arrays: plain value = contains, `$all`, `$size`, **`$elemMatch`** for same-element conditions.
- `sort → skip → limit`; `projection` picks fields.
- Update operators: `$set`, `$unset`, `$inc`, `$push`, `$addToSet`, `$pull`; upsert = update-or-insert.
- `replaceOne` replaces the whole document; `$set` changes only some fields.
- `findOneAndUpdate` = atomic update + return the document.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [03-aggregation-pipeline.md](03-aggregation-pipeline.md)
