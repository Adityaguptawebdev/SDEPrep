# Databases — SQL vs NoSQL, Indexing, Replication, Sharding

## SQL vs NoSQL — decision trick

**Analogy**: **SQL** database ek **strict Excel sheet** jaisa hai — har row
mein wahi columns hone chahiye, format fix hai, par tables ke beech
**relationships** (jaise "ye order kis customer ka hai") bahut accurately
track ho sakte hain. **NoSQL** ek **flexible diary/notebook** jaisa hai —
har entry alag shape ki ho sakti hai, likhna fast hai, par cross-checking
(joins) mushkil hai.

**Trick — khud se ye 3 sawaal poocho:**

| Sawaal | "Haan" ka jawab | Database type |
|---|---|---|
| Data ka structure fixed/predictable hai? | Haan | SQL |
| Multiple tables ke beech complex relationships/joins chahiye? | Haan | SQL |
| Massive scale (crores of writes/sec) aur structure flexible chahiye? | Haan | NoSQL |
| Strong consistency (transactions) chahiye — jaise banking? | Haan | SQL |

| | SQL (MySQL, Postgres) | NoSQL (MongoDB, DynamoDB, Cassandra) |
|---|---|---|
| Schema | Fixed | Flexible |
| Scaling | Vertical (mostly) | Horizontal (built for it) |
| Consistency | Strong (ACID) | Eventual (mostly) |
| Best for | Banking, Orders, Inventory | Social media feed, logs, chat messages |

> 💡 **Interview mein bolne wali line**: *"User ke posts ka structure fixed
> nahi hai aur scale bahut zyada hai, isliye NoSQL (jaise MongoDB) choose
> karunga. Lekin payment/order data ke liye SQL use karunga kyunki wahan
> transactions aur consistency critical hai."*

## ACID vs BASE

- **ACID** (SQL ka guarantee) — **A**tomicity (sab ya kuch nahi), **C**onsistency,
  **I**solation, **D**urability. Trick: *"Transaction poori hogi ya bilkul nahi hogi — beech mein kuch nahi."*
- **BASE** (NoSQL ka guarantee) — **B**asically **A**vailable, **S**oft state,
  **E**ventually consistent. Trick: *"Turant available rahega, data thoda der baad sync ho jayega."*

Ye seedha [CAP theorem](02-latency-throughput-availability.md) se juda hai — SQL generally CP ki taraf jhukta hai, NoSQL generally AP ki taraf.

## Indexing — database ko fast banane ka #1 tarika

**Analogy**: Kitab ka **index page** — bina index ke, ek topic dhoondhne ke
liye **poori kitab** padhni padegi (page by page — ye "full table scan" hai).
Index ke saath, seedha page number pata chal jata hai.

**Trick**: Index us column pe lagao jispe tum **baar-baar `WHERE` ya
`ORDER BY` mein search karte ho** (jaise `user_id`, `email`).

```sql
-- Bina index: har row check karega, O(n)
SELECT * FROM users WHERE email = 'a@x.com';

-- Index lagate hi: seedha jump kar sakta hai, O(log n)
CREATE INDEX idx_email ON users(email);
```

> ⚠️ **Trade-off jo bolna zaroori hai**: Index se **read fast** hota hai,
> par **write thoda slow** ho jata hai (kyunki har insert/update pe index
> bhi update karna padta hai). Isliye **har column pe index nahi lagate**.

## Replication — same data, multiple copies (availability ke liye)

**Analogy**: Bank ki ek hi branch nahi, kai branches — koi ek down ho toh
doosri se kaam chal jaye.

```
        Writes
           │
           ▼
      ┌─────────┐
      │ Primary  │ ────────┐
      │ (Master) │         │  (data copy ho raha hai)
      └─────────┘         ▼
                      ┌─────────┐   ┌─────────┐
                      │ Replica1 │   │ Replica2 │  ← Reads yahan se serve honge
                      └─────────┘   └─────────┘
```

**Trick**: **"Likhna ek jagah (Primary), padhna kayi jagah (Replicas)"**
— isse read-heavy systems bahut zyada scale ho jate hain (replicas jitni
chahiye utni bana lo, sab parallel reads serve karengi), aur agar Primary
crash ho jaye, ek Replica ko Primary bana diya jata hai (failover).

## Sharding / Partitioning — jab ek database bhi kaafi nahi

**Analogy**: Ek library mein 1 crore kitabein — sab ek hi almari mein
nahi rakhoge, alphabet ke hisaab se **alag almariyan** banaoge (A-M ek
almari, N-Z doosri). Yehi **sharding** hai — data ko **multiple databases**
mein baant dena.

```
User ID 1-1000000    → Shard 1 (Database Server A)
User ID 1000001-2000000 → Shard 2 (Database Server B)
```

**Trick — Replication vs Sharding mein confusion na ho**:
- **Replication** = **same data ki copies** (availability + read-scaling ke liye)
- **Sharding** = **data ko tukdon mein baant do** (write-scaling + storage ke liye, kyunki ek machine mein sara data fit hi nahi hota)

Real systems dono use karte hain: har shard ke apni replicas hoti hain.

**Sharding key choose karna — bahut important interview point**: Wrong key
choose kiya (jaise sirf `country` se shard kiya) toh ek shard mein data
**skew** (asamaan baant) ho sakta hai (India wala shard bahut bada ban jayega,
baaki chhote). Achha sharding key wo hai jo **evenly distribute** kare —
isiliye aksar `user_id % N` ya **consistent hashing** use hoti hai
([08-consistent-hashing.md](08-consistent-hashing.md) mein aage dekhenge).

Agla: [06-message-queues.md](06-message-queues.md)
