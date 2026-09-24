# MongoDB 06 — Transactions, Replication & Sharding

> **Level**: Intermediate → Advanced · **Read time**: ~30 min

> **Definition**: **Transactions** keep multi-step changes all-or-nothing. **Replication** keeps **copies** of the data on several servers (for safety and availability). **Sharding** **splits** the data across several servers (for size and speed).

**In one line**: Replication = *same data, many copies* (don't lose it). Sharding = *different data, many servers* (fit and scale it).

**Easy analogy — a school**: **Replica set** = ek class jisme **class teacher (primary)** aur **do deputies (secondaries)** hain. Teacher jo notes likhta hai, deputies unhe copy karte hain. Teacher absent ho jaye toh deputies **vote** karke ek ko naya teacher bana lete hain — class kabhi rukti nahi. **Sharding** tab hoti hai jab school itna bada ho jaye ki ek building mein sab na aayein: students ko roll number ranges ke hisaab se alag **branches** mein baant dete hain, aur **reception (mongos)** parents ko batata hai kaunsi branch jana hai.

---

## 1. Transactions and ACID in MongoDB

| Level | What is atomic |
|---|---|
| **Single document** | always atomic (even with nested fields and arrays) — no transaction needed |
| **Multiple documents / collections** | needs a **multi-document transaction** (MongoDB 4.0+ on replica sets, 4.2+ on sharded clusters) |

> 💡 Good data modeling (embedding, see note 05) means you need transactions **rarely**. They cost performance, hold locks and must finish quickly (default limit: 60 seconds).

```javascript
db.accounts.insertMany([ { _id: "A", balance: 1000 }, { _id: "B", balance: 500 } ])
```

```javascript
// Transfer 300 from A to B — both updates succeed or neither does
const session = db.getMongo().startSession();
const accounts = session.getDatabase("shop").accounts;
session.startTransaction({ readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
try {
  accounts.updateOne({ _id: "A" }, { $inc: { balance: -300 } });
  accounts.updateOne({ _id: "B" }, { $inc: { balance: 300 } });
  session.commitTransaction();          // make both changes permanent
} catch (e) {
  session.abortTransaction();           // undo both
  throw e;
} finally {
  session.endSession();
}
db.accounts.find().sort({ _id: 1 })
```

```result
[ { _id: 'A', balance: 700 }, { _id: 'B', balance: 800 } ]
```

In Node.js drivers use `session.withTransaction(async () => { ... })`, which also **retries** transient errors for you.

Transactions need a **replica set** (even a single-node one) — they do not run on a plain standalone server.

---

## 2. Write concern, read concern, read preference

**Write concern (`w`)** — *how many servers must confirm a write before you get "OK"*.

| Setting | Meaning | Trade-off |
|---|---|---|
| `w: 0` | fire and forget | fastest, may lose data silently |
| `w: 1` (default in older versions) | the **primary** confirmed | fast; lost if the primary crashes before replicating |
| `w: "majority"` (default since 5.0) | **most** members confirmed | safe (survives a failover), a bit slower |
| `j: true` | written to the on-disk **journal** | durable across a crash |

```js
db.orders.insertOne({ item: "pen" }, { writeConcern: { w: "majority", j: true, wtimeout: 5000 } })
```

**Read concern** — *how safe is the data you read*: `local` (default; may later be rolled back), `majority` (only data confirmed by a majority), `snapshot` (inside transactions), `linearizable` (latest committed, slowest).

**Read preference** — *which member you read from*:

| Mode | Reads from |
|---|---|
| `primary` (default) | the primary — always the latest data |
| `primaryPreferred` | primary, else a secondary |
| `secondary` / `secondaryPreferred` | secondaries — spreads read load but data can be **slightly stale** |
| `nearest` | lowest network latency |

---

## 3. Replication — replica set

A **replica set** = a group of `mongod` servers holding the **same data**: one **primary** (takes all writes) and one or more **secondaries** (copy the primary's changes).

```
                    writes + reads
   client ─────────────────────────────►  PRIMARY
                                             │  writes are recorded in the oplog
                          ┌──────────────────┴──────────────────┐
                          ▼                                     ▼
                     SECONDARY 1                           SECONDARY 2
                   (copies the oplog)                    (copies the oplog)

   heartbeat every 2 s between members. Primary unreachable ~10 s → an ELECTION → a secondary becomes primary.
```

| Term | Meaning |
|---|---|
| **Oplog** | special capped collection with a log of every write; secondaries replay it |
| **Election** | members **vote**; a candidate needs **votes from a majority** |
| **Arbiter** | votes in elections but holds **no data** (saves cost) |
| **Hidden / delayed member** | for backups / "undo" (e.g. delayed by 1 hour) |
| **Failover** | automatic switch to a new primary (a few seconds) |
| **Rollback** | writes on an old primary that never reached the majority are undone when it returns |

**Why an odd number of members (3, 5, 7)?** A majority is needed to elect a primary. With 3 members you survive 1 failure; with 4 you still survive only 1 (majority of 4 is 3), so the 4th adds no safety. If a network split leaves a member in a **minority**, it cannot become primary.

**Benefits**: high availability, data safety (backups), read scaling (secondary reads), zero-downtime maintenance.

---

## 4. Sharding — horizontal scaling

When one server cannot hold all data or handle all traffic, **split the data** across several servers called **shards**. (Each shard is itself usually a replica set.)

```
                        application
                            │
                        ┌───▼───┐
                        │mongos │  ← query router (many can run)      ┌──────────────┐
                        └───┬───┘                                     │ config servers│  ← where each chunk lives
        ┌───────────────────┼───────────────────┐                     └──────────────┘
        ▼                   ▼                   ▼
    Shard 1             Shard 2             Shard 3           each shard = a replica set
  userId 1-1000      userId 1001-2000     userId 2001-3000    holding ONE part of the data
```

| Component | Job |
|---|---|
| **Shard** | holds a subset of the data |
| **mongos** | router — sends each query to the right shard(s) |
| **Config servers** | store the map "which chunk is on which shard" |
| **Chunk** | a range of shard-key values (default ~128 MB); the **balancer** moves chunks to keep shards even |

### The shard key — the most important decision

The **shard key** is the field (or fields) that decides which shard a document goes to. It is hard to change later, so choose carefully.

| Good shard key | Why |
|---|---|
| **High cardinality** | many different values → many chunks |
| **Low frequency** | no single value has a huge number of documents |
| **Not monotonically increasing** | otherwise every new write goes to the **same** shard (a **hot shard**) |
| Matches your **queries** | queries that include the shard key are *targeted* to 1 shard; otherwise *scatter-gather* to all shards |

| Strategy | How | Good for | Downside |
|---|---|---|---|
| **Ranged** | documents with nearby key values stay together | range queries | can create hot shards (e.g. timestamp) |
| **Hashed** | key is hashed, spreads evenly | even writes, equality lookups | range queries hit all shards |

```js
sh.enableSharding("shop")
sh.shardCollection("shop.orders", { userId: "hashed" })     // spread orders evenly by user
```

**Bad shard keys**: `_id` (ObjectId) or a plain `timestamp` (always increasing → hot shard), a boolean or a country with 3 values (low cardinality).

### Replication vs sharding

| | Replication | Sharding |
|---|---|---|
| Purpose | **availability** and safety | **scale** (data size and throughput) |
| Each server holds | a **full copy** | **part** of the data |
| Adds capacity for | reads (secondary reads) | reads **and writes**, storage |
| Failure of one server | others take over | that shard needs its own replicas |
| Used together? | **yes** — every shard is a replica set | |

---

## 5. CAP theorem and BASE

In a distributed database, when the **network splits (Partition)**, you can keep **only one** of these:

- **C — Consistency**: every read sees the latest write.
- **A — Availability**: every request gets an answer.
- **P — Partition tolerance**: the system keeps working when messages between servers are lost. (Networks *do* fail, so P is a must.)

**MongoDB is CP by default**: during a partition, the side without a majority cannot elect a primary and stops accepting writes (it gives up availability to stay consistent). Reading from secondaries can return **stale** data — that is *eventual consistency*.

| | ACID | BASE |
|---|---|---|
| Stands for | Atomicity, Consistency, Isolation, Durability | **B**asically **A**vailable, **S**oft state, **E**ventual consistency |
| Focus | correctness first | availability and scale first |
| Typical | SQL databases | many NoSQL systems (MongoDB can be tuned either way) |

---

## 6. Other things interviewers ask

| Topic | One-line answer |
|---|---|
| **Change streams** | `db.orders.watch()` — a live feed of inserts/updates/deletes (built on the oplog) |
| **GridFS** | stores files larger than 16 MB by splitting them into chunks |
| **Capped collection** | fixed-size collection that overwrites the oldest data (like a circular log) |
| **Backup** | `mongodump` / `mongorestore`, filesystem snapshots, or Atlas backups; **replication is not a backup** |
| **Security** | enable authentication, role-based access control, TLS, encryption at rest, IP allow-list |
| **NoSQL injection** | never pass raw user JSON into a query (`{ password: { $ne: null } }` bypasses a login) — validate types, sanitize |
| **Why is MongoDB fast?** | documents are read in one go (no joins), indexes, memory-mapped working set, horizontal scaling |
| **Storage engine** | **WiredTiger** (default): document-level locking, compression, journaling |

---

> 🗣️ **Interview mein aise bolo**: *"Replica set availability ke liye hai, sharding scale ke liye. Shard key high cardinality aur non-monotonic honi chahiye. MongoDB default mein CP hai."*

## ⚡ Quick revision

- Single-document writes are atomic; multi-document **transactions** need a replica set and cost performance.
- Write concern `w: "majority"` = safe writes. Read preference `secondary` = maybe stale data.
- **Replica set** = 1 primary + secondaries, oplog, automatic election (majority vote) → **use an odd number** of members.
- **Sharding** = split data: shards + **mongos** + config servers; pick a **high-cardinality, non-monotonic shard key**; hashed = even spread, ranged = good for range queries.
- Replication = availability, sharding = scale — use **both**.
- **CAP**: MongoDB is **CP** by default. ACID vs BASE.
- Replication is **not** a backup.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [interview-questions.md](../interview-questions.md)
