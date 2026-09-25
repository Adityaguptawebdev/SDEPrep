# DB 3/3 — NoSQL & MongoDB (SQL vs NoSQL, modelling, indexes, aggregation, transactions, consistency)

> Every ```js block marked `// mongosh` was executed with **mongosh against MongoDB 7.0** (single-node replica set, so transactions work); the ```text below it is the real output. Deeper tested notes: [Database/MongoDB](../../../Database/MongoDB/01-mongodb-basics.md).

**Easy analogy — SQL vs NoSQL = government form vs personal diary**: SQL = sarkari form: har column fixed, har entry same format, cross-check (joins) aasaan, galti ki gunjaaish kam. MongoDB = diary: har page pe jo chahiye likh do (flexible documents), ek order ke saare items ek hi page pe (embedding) — padhna fast, par "saare pages mein X dhoondho" ke liye index chahiye aur rules tumhe khud follow karne padte hain.

| Topic | Visa reports | Freq |
|---|---|---|
| SQL vs NoSQL / relational vs non-relational | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**), [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (**EC**), [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/), [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | **HIGH** (4) |
| Vertical vs horizontal scaling | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (**EC**), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | MEDIUM |
| Composite keys in NoSQL · schema changes in production · cursors | [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | LOW |
| MongoDB on the resume (managerial deep-dive) | [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/) | LOW |
| Redis vs Couchbase · NoSQL/sharding in design rounds | [LC-6653237](https://leetcode.com/discuss/post/6653237/visa-inc-staff-data-engineer-by-rahulx33-p1si/), [LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/) | LOW (senior) |

---

## 1. SQL vs NoSQL — and when to pick which (HIGH)

| | SQL (PostgreSQL, MySQL) | Document NoSQL (MongoDB) |
|---|---|---|
| Data model | tables, fixed schema, relations | JSON-like documents, flexible schema |
| Relationships | joins + foreign keys | embed related data, or reference + `$lookup` |
| Transactions | ACID, multi-row, mature | single-document atomic always; multi-document ACID since 4.0 (with overhead) |
| Scaling | vertical first; read replicas; sharding is harder | built-in **sharding** (horizontal) + replica sets |
| Query | SQL, complex ad-hoc queries | rich queries on documents, aggregation pipeline |
| Best for | money, ledgers, orders, strong consistency, reporting | catalogues, user profiles, content, events/logs, fast-changing schemas |

**Interview answer**: "I choose SQL when data is relational and correctness matters most — payments, ledgers, anything needing multi-row ACID transactions and constraints. I choose a document store like MongoDB when each record is naturally a self-contained document read together, the schema evolves quickly, or I need easy horizontal scale — like a product catalogue or activity feed. Many systems use both."
**Trap**: "NoSQL doesn't support transactions / NoSQL is always faster" — both are outdated or wrong without context.

## 2. Vertical vs horizontal scaling (MEDIUM)

```
 vertical (scale up)                 horizontal (scale out)
 ┌────────┐     ┌──────────────┐      ┌────┐     ┌────┐┌────┐┌────┐
 │ 4 CPU  │ ──► │ 32 CPU 256GB │      │ n1 │ ──► │ n1 ││ n2 ││ n3 │  + load balancer / sharding
 └────────┘     └──────────────┘      └────┘     └────┘└────┘└────┘
 simple, no code change, has a         near-limitless, fault tolerant, but data must be
 ceiling, single point of failure      partitioned and kept consistent
```

**Replication** = copies of the same data (availability + read scaling). **Sharding** = splitting data across nodes by a shard key (write + storage scaling). MongoDB does both: replica sets + sharded clusters.

## 3. Data modelling: embed vs reference

| Embed (sub-documents) | Reference (store the id) |
|---|---|
| data is read together ("order with its items") | data is shared or read separately (customer used by many orders) |
| one-to-few, bounded size | one-to-many unbounded, many-to-many |
| one read, atomic single-document update | avoids duplication; needs `$lookup` or a second query |

```js
// mongosh
db.customers.insertMany([
  { _id: 1, name: 'Asha', city: 'Bengaluru' },
  { _id: 2, name: 'Ravi', city: 'Pune' }
]);
db.orders.insertMany([
  { _id: 101, customerId: 1, status: 'DELIVERED', orderedAt: ISODate('2025-08-03'),
    items: [ { sku: 'TEA', qty: 2, pricePaise: 12000 }, { sku: 'CAKE', qty: 1, pricePaise: 25900 } ] },
  { _id: 102, customerId: 1, status: 'DELIVERED', orderedAt: ISODate('2025-08-21'),
    items: [ { sku: 'TEA', qty: 1, pricePaise: 12000 } ] },
  { _id: 103, customerId: 2, status: 'CANCELLED', orderedAt: ISODate('2025-08-25'),
    items: [ { sku: 'BOOK', qty: 1, pricePaise: 99900 } ] },
  { _id: 104, customerId: 2, status: 'DELIVERED', orderedAt: ISODate('2025-09-01'),
    items: [ { sku: 'PEN', qty: 5, pricePaise: 5000 } ] }
]);
printjson(db.orders.findOne({ _id: 101 }, { items: 1, _id: 0 }));
```

```text
{
  items: [
    {
      sku: 'TEA',
      qty: 2,
      pricePaise: 12000
    },
    {
      sku: 'CAKE',
      qty: 1,
      pricePaise: 25900
    }
  ]
}
```

Items are **embedded** (always read with the order, bounded); the customer is **referenced** by `customerId` (shared by many orders).

## 4. Queries, updates, upserts

```js
// mongosh
printjson(db.orders.find({ status: 'DELIVERED', 'items.sku': 'TEA' }, { _id: 1 }).sort({ _id: 1 }).toArray());
db.orders.updateOne({ _id: 104 }, { $set: { status: 'REFUNDED' }, $inc: { refundCount: 1 } });
db.merchantStats.updateOne({ _id: 'ChaiPoint' }, { $inc: { txns: 1 } }, { upsert: true });   // create if missing
db.merchantStats.updateOne({ _id: 'ChaiPoint' }, { $inc: { txns: 1 } }, { upsert: true });
printjson(db.orders.findOne({ _id: 104 }, { status: 1, refundCount: 1 }));
printjson(db.merchantStats.findOne({ _id: 'ChaiPoint' }));
```

```text
[
  {
    _id: 101
  },
  {
    _id: 102
  }
]
{
  _id: 104,
  status: 'REFUNDED',
  refundCount: 1
}
{
  _id: 'ChaiPoint',
  txns: 2
}
```

`$inc` is **atomic** on a single document — a safe counter without read-modify-write races.

## 5. Indexes and `explain()`

```js
// mongosh
db.orders.createIndex({ customerId: 1, status: 1, orderedAt: -1 });   // ESR: Equality, Sort, Range
const plan = (q) => db.orders.find(q).explain().queryPlanner.winningPlan;
const stageOf = (p) => p.inputStage ? p.stage + ' <- ' + stageOf(p.inputStage) : p.stage;
print('by customer+status : ' + stageOf(plan({ customerId: 1, status: 'DELIVERED' })));
print('by status only     : ' + stageOf(plan({ status: 'DELIVERED' })));
```

```text
by customer+status : FETCH <- IXSCAN
by status only     : COLLSCAN
```

Same **leftmost-prefix** rule as SQL: a compound index on `(customerId, status, orderedAt)` can't serve a query on `status` alone → `COLLSCAN`. Order compound fields as **Equality → Sort → Range**.

## 6. Aggregation pipeline (the Mongo version of GROUP BY)

Monthly delivered spend per customer — the same question as the SQL order-summary problem ([DB 2/3 §6](02-reported-sql-problems.md#6-order-delivery-system-schema--monthly-order-cost-summary)):

```js
// mongosh
printjson(db.orders.aggregate([
  { $match: { status: 'DELIVERED' } },                                        // WHERE
  { $unwind: '$items' },                                                      // one doc per item
  { $group: {                                                                  // GROUP BY
      _id: { customerId: '$customerId', month: { $dateToString: { format: '%Y-%m', date: '$orderedAt' } } },
      spendPaise: { $sum: { $multiply: ['$items.qty', '$items.pricePaise'] } } } },
  { $lookup: { from: 'customers', localField: '_id.customerId', foreignField: '_id', as: 'c' } },   // JOIN
  { $project: { _id: 0, name: { $first: '$c.name' }, month: '$_id.month', spendPaise: 1 } },
  { $sort: { month: 1, name: 1 } }                                            // ORDER BY
]).toArray());
```

```text
[
  {
    spendPaise: 61900,
    name: 'Asha',
    month: '2025-08'
  }
]
```

(Order 104 was refunded in §4, and 103 was cancelled, so only Asha's August orders remain: 2×12000 + 25900 + 12000 = 61900.)

## 7. Multi-document transactions (MongoDB 4.0+, needs a replica set)

```js
// mongosh
db.wallets.insertMany([{ _id: 'asha', balance: 500 }, { _id: 'ravi', balance: 100 }]);
function transfer(from, to, amount) {
  const session = db.getMongo().startSession();
  try {
    session.withTransaction(() => {
      const w = session.getDatabase(db.getName()).wallets;
      const src = w.findOne({ _id: from });
      if (src.balance < amount) throw new Error('insufficient funds');         // aborts the transaction
      w.updateOne({ _id: from }, { $inc: { balance: -amount } });
      w.updateOne({ _id: to }, { $inc: { balance: amount } });
    }, { writeConcern: { w: 'majority' } });
    return 'committed';
  } catch (e) {
    return 'aborted: ' + e.message;
  } finally {
    session.endSession();
  }
}
print(transfer('asha', 'ravi', 300));
print(transfer('asha', 'ravi', 999));
printjson(db.wallets.find().sort({ _id: 1 }).toArray());
```

```text
committed
aborted: insufficient funds
[
  {
    _id: 'asha',
    balance: 200
  },
  {
    _id: 'ravi',
    balance: 400
  }
]
```

**Say this**: "Single-document writes are always atomic in MongoDB, so I model data to keep invariants inside one document where possible. When I truly need several documents to change together, MongoDB has ACID transactions on replica sets, but they cost more, so for a payments ledger I'd still prefer a relational database."

## 8. Consistency: write concern, read concern, CAP

- **Write concern** `w: 1` (primary acknowledged) vs `w: 'majority'` (survives a primary failover) — money writes use `majority`.
- **Read preference**: primary (fresh) vs secondary (may be stale → eventual consistency). **Read concern** `majority` reads only data that can't be rolled back.
- **CAP**: during a network partition you choose consistency or availability. MongoDB with majority writes/reads leans to **consistency**; Cassandra-style stores lean to **availability** with tunable consistency. (PACELC: even without partitions, you trade latency vs consistency.)

## 9. Composite keys in NoSQL (asked to an intern)

MongoDB has only one `_id`, but it can be a **sub-document**, or you add a **unique compound index**:

```js
// mongosh
db.dailyTotals.insertOne({ _id: { merchantId: 'm1', day: '2025-09-25' }, totalPaise: 5000 });
try {
  db.dailyTotals.insertOne({ _id: { merchantId: 'm1', day: '2025-09-25' }, totalPaise: 9999 });
} catch (e) { print('duplicate composite key rejected: ' + e.code); }
db.settlements.createIndex({ merchantId: 1, batchNo: 1 }, { unique: true });       // alternative
db.settlements.insertOne({ merchantId: 'm1', batchNo: 7 });
try { db.settlements.insertOne({ merchantId: 'm1', batchNo: 7 }); }
catch (e) { print('unique compound index rejected: ' + e.code); }
```

```text
duplicate composite key rejected: 11000
unique compound index rejected: 11000
```

(`11000` is MongoDB's duplicate-key error code. In DynamoDB the equivalent is a partition key + sort key; in Cassandra a partition key + clustering columns.)

## 10. Major schema changes in production (asked to an intern)

**Expand → migrate → contract** (works for SQL and NoSQL, no downtime):
1. **Expand**: add the new column/field as optional (nullable, default) — old code keeps working.
2. Deploy code that **writes both** old and new shapes and **reads new with fallback**.
3. **Backfill** existing rows/documents in small batches (throttled, resumable).
4. Switch reads to the new shape; monitor.
5. **Contract**: stop writing the old shape, then drop it in a later release.
Mongo extras: a `schemaVersion` field + lazy upgrade-on-read; JSON-schema validation on the collection. SQL extras: avoid long table locks (online DDL tools), never rename a column in one step.

## 11. Cursor-based pagination in MongoDB

```js
// mongosh
const page1 = db.orders.find({}, { _id: 1 }).sort({ _id: 1 }).limit(2).toArray();
const lastSeen = page1[page1.length - 1]._id;                                     // the "cursor" sent to the client
const page2 = db.orders.find({ _id: { $gt: lastSeen } }, { _id: 1 }).sort({ _id: 1 }).limit(2).toArray();
printjson({ page1, nextCursor: lastSeen, page2 });
```

```text
{
  page1: [
    {
      _id: 101
    },
    {
      _id: 102
    }
  ],
  nextCursor: 102,
  page2: [
    {
      _id: 103
    },
    {
      _id: 104
    }
  ]
}
```

Uses the `_id` index to jump straight to the next page — unlike `skip(n)`, which walks and discards n documents.

## 12. Redis (and "Redis vs Couchbase")

- **Redis**: in-memory key-value store with rich types (strings, hashes, sorted sets, streams). Uses: **cache** (cache-aside + TTL), **rate limiting** counters (`INCR` + `EXPIRE`, sorted sets for sliding windows), **distributed locks** (`SET key val NX PX 30000`), session store, leaderboards. Persistence is optional (RDB/AOF) — treat it as a cache unless configured otherwise.
- **Couchbase**: a distributed document database with a built-in memory cache and SQL-like querying (N1QL) — more of a MongoDB-style primary store. "Redis vs Couchbase" ≈ "fast cache/data-structure server vs durable document database" ([LC-6653237](https://leetcode.com/discuss/post/6653237/visa-inc-staff-data-engineer-by-rahulx33-p1si/), Staff DE).

## 13. "Why MongoDB in your project?" — honest answer framework

> [CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE]
> "We used MongoDB because *(pick what's true)* our records were naturally documents read as a whole (e.g. a form/config with nested sections), the schema changed every sprint, and we didn't need multi-table transactions. We modelled X embedded and Y referenced, indexed on *(your actual query fields)*. If I rebuilt it with payments-like data, I'd move the money/ledger part to PostgreSQL for constraints and ACID, and keep MongoDB for the flexible parts."

Interviewers are checking that the choice was **deliberate** (trade-offs known), not "it was already there". If it *was* already there, say so honestly and then show you understand the trade-offs.

---

⚡ **Quick revision**: SQL for money + relations + ACID, documents for self-contained flexible data · scale up vs scale out; replication ≠ sharding · embed what's read together & bounded, reference what's shared/unbounded · compound index = leftmost prefix, ESR order · aggregation = $match → $group → $lookup → $project → $sort · single-doc writes atomic; multi-doc transactions need a replica set · `w: majority` for important writes · composite key = sub-document `_id` or unique compound index · expand → migrate → contract.

Back to [DB index](README.md) · Next: [07 — System design →](../07-system-design/README.md)
