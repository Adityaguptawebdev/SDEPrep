# MongoDB 03 — Aggregation Pipeline

> **Level**: Intermediate · **Read time**: ~30 min · Sample data: [sample-data.js](sample-data.js) (`users`, `products`, `orders`)

> **Definition**: The **aggregation pipeline** processes documents through an ordered list of **stages**. Each stage transforms the documents and passes the result to the next stage — like a conveyor belt. It is MongoDB's answer to SQL `GROUP BY`, `JOIN`, `HAVING` and more.

**In one line**: `db.collection.aggregate([ stage1, stage2, stage3 ])` — output of one stage = input of the next.

**Easy analogy — factory conveyor belt**: Factory ki **conveyor belt**: kacche santre belt pe aate hain. Station 1 **kharab santre hatata hai** (`$match`). Station 2 **size ke hisaab se boxes mein daalta hai** (`$group`). Station 3 **sirf box ka label aur count rakhta hai** (`$project`). Station 4 **sabse bada box pehle rakhta hai** (`$sort`). Belt ke end pe jo nikla, wahi tumhara result hai.

```
 orders ──► $match ──► $unwind ──► $group ──► $sort ──► $limit ──► result
            keep       one doc     total per   biggest   top 3
            delivered  per item    product     first
```

---

## 1. The stages you must know

| Stage | Does | SQL idea |
|---|---|---|
| `$match` | filter documents | `WHERE` (before grouping) / `HAVING` (after) |
| `$group` | group and calculate (`$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`, `$first`, `$last`) | `GROUP BY` |
| `$project` | choose / rename / compute fields | `SELECT` list |
| `$addFields` / `$set` | add computed fields, keep the rest | computed column |
| `$sort` | order | `ORDER BY` |
| `$limit`, `$skip` | paging | `LIMIT`, `OFFSET` |
| `$unwind` | turn an **array** into one document per element | join-like flatten |
| `$lookup` | join another collection | `LEFT JOIN` |
| `$count` | count documents | `COUNT(*)` |
| `$facet` | run several pipelines on the same input | multiple reports |
| `$out` / `$merge` | write the result to a collection | `INSERT … SELECT` |

---

## 2. `$match` + `$group` — totals per group

Revenue and number of orders **per status**:

```javascript
db.orders.aggregate([
  { $group: { _id: "$status", orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
  { $sort: { revenue: -1 } }
])
```

```result
[
  { _id: 'delivered', orders: 3, revenue: 55750 },
  { _id: 'shipped', orders: 2, revenue: 5500 },
  { _id: 'cancelled', orders: 1, revenue: 2000 },
  { _id: 'pending', orders: 1, revenue: 200 }
]
```

- `_id` in `$group` is the **group key** (like `GROUP BY status`). `"$status"` means "the value of the field `status`".
- `{ $sum: 1 }` counts documents; `{ $sum: "$total" }` adds up a field.
- To group **everything** into one result use `_id: null`.

Filter first with `$match`, then group (SQL: `WHERE` before `GROUP BY`):

```javascript
db.orders.aggregate([
  { $match: { status: { $in: ["delivered", "shipped"] } } },
  { $group: { _id: "$userId", spent: { $sum: "$total" }, orders: { $sum: 1 } } },
  { $match: { spent: { $gt: 1000 } } },          // a second $match after $group = SQL HAVING
  { $sort: { spent: -1 } }
])
```

```result
[
  { _id: 1, spent: 59700, orders: 3 },
  { _id: 2, spent: 1550, orders: 2 }
]
```

---

## 3. `$unwind` — one document per array element

`orders.items` is an array. To analyse items, first **unwind** it. Best-selling products by quantity:

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.sku", unitsSold: { $sum: "$items.qty" } } },
  { $sort: { unitsSold: -1 } },
  { $limit: 3 }
])
```

```result
[
  { _id: 'P1', unitsSold: 15 },
  { _id: 'P2', unitsSold: 6 },
  { _id: 'P4', unitsSold: 4 }
]
```

```
 { _id: 101, items: [ {P1}, {P2} ] }   ──$unwind "$items"──►   { _id: 101, items: {P1} }
                                                               { _id: 101, items: {P2} }
```

---

## 4. `$project` and expressions

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $project: { _id: 0, order: "$_id", sku: "$items.sku",
                lineTotal: { $multiply: ["$items.qty", "$items.price"] } } },
  { $limit: 3 }
])
```

```result
[
  { order: 101, sku: 'P1', lineTotal: 100 },
  { order: 101, sku: 'P2', lineTotal: 100 },
  { order: 102, sku: 'P3', lineTotal: 55000 }
]
```

`$addFields` (or `$set`) with `$cond` (if / else) adds a computed field and **keeps** all the others:

```javascript
db.orders.aggregate([
  { $addFields: { size: { $cond: [ { $gte: ["$total", 1000] }, "big", "small" ] } } },
  { $project: { _id: 1, total: 1, size: 1 } },
  { $limit: 4 }
])
```

```result
[
  { _id: 101, total: 200, size: 'small' },
  { _id: 102, total: 55000, size: 'big' },
  { _id: 103, total: 1000, size: 'big' },
  { _id: 104, total: 2000, size: 'big' }
]
```

Useful expression operators: `$multiply`, `$add`, `$subtract`, `$divide`, `$concat`, `$toUpper`, `$size` (array length), `$cond`, `$ifNull`, `$dateToString`, `$year`, `$month`.

---

## 5. `$lookup` — a join

```javascript
// each order with the customer's name
db.orders.aggregate([
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
  { $unwind: "$user" },
  { $project: { _id: 1, total: 1, customer: "$user.name" } },
  { $sort: { _id: 1 } },
  { $limit: 3 }
])
```

```result
[
  { _id: 101, total: 200, customer: 'Asha' },
  { _id: 102, total: 55000, customer: 'Asha' },
  { _id: 103, total: 1000, customer: 'Ravi' }
]
```

`$lookup` works like a **LEFT JOIN**: `as: "user"` is always an array; it is **empty** when nothing matches. That helps to find users with **no orders** (like `LEFT JOIN … WHERE o.id IS NULL`):

```javascript
db.users.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
  { $project: { _id: 0, name: 1, orderCount: { $size: "$orders" } } }
])
```

```result
[
  { name: 'Asha', orderCount: 3 },
  { name: 'Ravi', orderCount: 2 },
  { name: 'Meena', orderCount: 1 },
  { name: 'Karan', orderCount: 1 },
  { name: 'Sara', orderCount: 0 }
]
```

> 💡 If you need `$lookup` on almost every read, your data model probably wants **embedding** instead (see note 05).

---

## 6. Dates — monthly revenue

```javascript
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, revenue: { $sum: "$total" } } },
  { $sort: { _id: 1 } }
])
```

```result
[
  { _id: '2024-01', revenue: 200 },
  { _id: '2024-02', revenue: 56000 },
  { _id: '2024-03', revenue: 5250 }
]
```

---

## 7. Top-N per group, and counting

**Highest order of each user** (`$sort` first, then `$first` inside `$group`):

```javascript
db.orders.aggregate([
  { $sort: { total: -1 } },
  { $group: { _id: "$userId", biggestOrder: { $first: "$_id" }, amount: { $first: "$total" } } },
  { $sort: { _id: 1 } }
])
```

```result
[
  { _id: 1, biggestOrder: 102, amount: 55000 },
  { _id: 2, biggestOrder: 103, amount: 1000 },
  { _id: 3, biggestOrder: 104, amount: 2000 },
  { _id: 4, biggestOrder: 106, amount: 200 }
]
```

```javascript
db.orders.aggregate([ { $match: { status: "delivered" } }, { $count: "deliveredOrders" } ])
```

```result
[ { deliveredOrders: 3 } ]
```

---

## 8. SQL side by side

```
 SELECT userId, SUM(total) AS spent            db.orders.aggregate([
 FROM orders                                     { $match: { status: "delivered" } },        ← WHERE
 WHERE status = 'delivered'                      { $group: { _id: "$userId",                 ← GROUP BY
 GROUP BY userId                                             spent: { $sum: "$total" } } },
 HAVING SUM(total) > 500                         { $match: { spent: { $gt: 500 } } },        ← HAVING
 ORDER BY spent DESC                             { $sort: { spent: -1 } }                    ← ORDER BY
 LIMIT 3;                                        { $limit: 3 } ])                            ← LIMIT
```

---

## 9. Performance tips

1. Put **`$match` and `$sort` as early as possible** — they can use **indexes** only at the start of the pipeline.
2. Use **`$project` early** to drop fields you do not need.
3. Blocking stages like `$group` and `$sort` use up to about **100 MB** of RAM per stage. Older versions fail beyond that unless you pass `{ allowDiskUse: true }` (MongoDB 6.0+ spills to disk by default).
4. Avoid `$lookup` on huge collections without an index on the `foreignField`.
5. Check the plan: `db.orders.explain("executionStats").aggregate([...])`.

---

> 🗣️ **Interview mein aise bolo**: *"Aggregation pipeline stages ki list hai: $match, $group, $sort... Main $match ko sabse pehle rakhta hun taaki index use ho aur kam documents aage jayein."*

## ⚡ Quick revision

- Pipeline = **ordered stages**; each stage feeds the next.
- `$match` (filter) → `$group` (`GROUP BY`) → `$sort` → `$project` (`SELECT`) → `$limit`.
- `$unwind` flattens an array (one doc per element) — needed before grouping by array items.
- `$lookup` = left join (result is an **array**); `$size` of the array gives the count.
- `$match` after `$group` = **HAVING**. `$group: { _id: null }` = one total for everything.
- Put `$match` first for speed; `allowDiskUse` lets big `$group` / `$sort` spill to disk.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [04-indexes-and-performance.md](04-indexes-and-performance.md)
