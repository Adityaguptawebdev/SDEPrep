# SD 10 — Large-Scale Transaction Processing System

> **Visa evidence** (senior/staff themes; pitched here for 0–1 YOE with "stretch" notes): "Design a **write-intensive server** which can perform both reads and writes — explain trade-offs" ([LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), Senior HM round) · "redesign your project at planet scale — **massive write traffic**, resiliency, multi-datacenter setup, DB replication, DNS routing" ([LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/), Staff) · "scenarios of concurrency, multithreading and **consistency in a distributed system**" ([LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/), Senior). Visa's own JD lists "Payment Services, Transaction Platforms, Real-Time Payments" ([VISA-JD-SSE](https://visa.wd5.myworkdayjobs.com/Visa/job/IN---Bengaluru-India/Sr-Software-Engineer_REF078405W)).
>
> ⚠️ This is a **generic** design exercise. It does **not** describe Visa's internal architecture (which isn't public). Official numbers below are quoted only for scale awareness.

**Easy analogy — toll plaza on a national highway**: Har gaadi ko 2 second mein haan/na (authorization) chahiye — line nahi rukni chahiye. Paisa ka asli hisaab (settlement) raat ko sab plazas ka jodkar hota hai. Ek lane kharab? Baaki lanes chalti rahein (redundancy). Ek plaza band? Traffic doosre plaza pe (multi-region failover).

**FACT (official, for scale)**: Visa says its network processes *up to 83,000 transaction messages per second*, handled *322+ billion transactions annually*, runs across *seven independent data centres* and reports *99.9999 percent uptime* ([VISA-TECH-25](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/inside-visa-global-commerce-engine.html), Oct 2025). The FY2025 10-K reports *258 billion transactions processed by Visa* ([VISA-10K-25](https://www.sec.gov/Archives/edgar/data/1403161/000140316125000089/v-20250930.htm)).

### Requirements (clarify first)
- Which part? **Authorization** (real-time yes/no) vs **clearing & settlement** (batch money movement) vs **reporting**.
- Our assumption for the exercise: average 10,000 authorizations/sec, peak 50,000/sec; p99 latency budget ~ 200 ms inside our system (issuer time excluded); no transaction lost; every decision auditable for years.

**Back-of-envelope**: 10,000/s × 86,400 s ≈ 864M transactions/day; ~1 KB per record → ~0.9 TB/day raw, ~300 TB/year before compression/replication → needs partitioned storage and tiering (hot → warm → archive).

### Functional Requirements
- Receive an authorization request (card token, amount, merchant, currency), validate, score risk, route to the issuer/decision engine, return approve/decline.
- Record every request/response; support reversals/refunds; later clear and settle in batches; reconcile.

### Non-functional Requirements
- Very high availability (multi-AZ, multi-region), low and predictable latency, horizontal scalability.
- **Exactly-once effect** per transaction (idempotent), strong consistency for balances/limits where used, durability.
- Security/compliance (tokenization, encryption, audit), observability.

### APIs
```
 POST /authorizations        {"txnId":…, "cardToken":…, "amountMinor":…, "currency":"INR", "merchantId":…,
                               "mcc":"5812", "entryMode":"CHIP", "ts":…}
      → 200 {"txnId":…, "decision":"APPROVED", "authCode":"A1B2C3", "riskScore":12}
 POST /reversals             {"originalTxnId":…}                    (idempotent by txnId)
 GET  /transactions/{txnId}  → status + history (served from a read store, not the hot path)
 Batch: clearing file in → settlement positions out (per issuer/acquirer, per day)
```

### High-level architecture
```
                       GeoDNS / global load balancer (route to nearest healthy region)
                                          │
        ┌───────────────────── Region A (active) ─────────────────────┐   Region B (active) … same
        │  Edge gateway (TLS, authN, rate limits)                     │
        │        │                                                    │
        │  Authorization service (stateless, many instances)          │
        │    ├─ idempotency check (txnId)  ── Redis/KV                │
        │    ├─ risk scoring (parallel, strict timeout, ML model)     │
        │    ├─ limits/balance check ── partitioned KV/SQL by account │
        │    └─ route to issuer / decision engine (timeout → fallback │
        │       rules decided in advance, within limits)              │
        │        │                                                    │
        │  append-only transaction log (Kafka, partitioned by card    │
        │  token / account; replicated)                               │
        │        ├──► transaction store (write-optimised, partitioned) │
        │        ├──► fraud stream processing (real-time features)    │
        │        ├──► read models / reporting (CQRS)                  │
        │        └──► clearing & settlement batch ──► reconciliation   │
        └─────────────────────────────────────────────────────────────┘
```

### Components
- **Edge gateway**: TLS termination, client authentication (mTLS/API keys), rate limiting.
- **Authorization service**: stateless; orchestrates idempotency, risk, limits and routing within a latency budget.
- **Risk/fraud scoring**: fast model inference with features from a low-latency store; hard timeout with a safe default.
- **Transaction log** (Kafka): the durable, ordered record of every event; everything downstream is built from it.
- **Stores**: hot transaction store (partitioned, write-optimised), read models for queries, archive.
- **Clearing & settlement** batch jobs + **reconciliation** ([SD 6](06-file-processing-system.md)).

### Database schema
```
 authorization(txn_id PK, card_token, merchant_id, amount_minor, currency, decision, auth_code,
               risk_score, created_at)            partition by hash(card_token) or by day; TTL/archival policy
 account_limit(account_id PK, daily_limit, spent_today, version)     -- updated with conditional writes
 idempotency(txn_id PK, response, created_at)                         -- or a KV store with TTL
 settlement_position(date, issuer_id, acquirer_id, net_amount_minor, PRIMARY KEY(date, issuer_id, acquirer_id))
```
Write-heavy data → append-only, partitioned tables or an LSM-based store (Cassandra/ScyllaDB-style) for the log/history; relational (sharded) for limits and settlement where transactions and constraints matter.

### Cache
- Card/BIN metadata, merchant profiles, routing tables, risk features — in-memory/Redis with versioned refresh.
- **Not** the authoritative balance/limit (or only with strict write-through + conditional updates).

### Queue
- Kafka as the backbone: partition by card token/account so all events of one card are ordered; consumers for fraud, storage, notifications, settlement.
- Backpressure: bounded queues; shed low-priority work (analytics) before authorizations.

### Scaling
- Stateless services scale horizontally behind load balancers; partition data by a key with good spread (card token hash), avoid hot partitions (one mega-merchant → partition by card, not merchant, on the hot path).
- **Write-intensive** tricks (the Senior question): append-only writes, batching, async secondary indexes, separate read models (CQRS), avoid cross-partition transactions, idempotent upserts.

### Load balancing
- Global: GeoDNS/anycast to the nearest healthy region. Regional: L4/L7 LBs with health checks, least-connections. Client-side LB for internal RPC.

### Failure handling
- **Timeouts everywhere** with budgets (e.g. risk ≤ 50 ms); on timeout use pre-agreed fallback rules rather than hanging.
- Region failure → traffic shifts to other regions (capacity headroom required, e.g. N+1).
- Duplicate requests after network retries → idempotency by `txnId`.
- Unknown outcomes → reversal/inquiry flows and reconciliation.
- Chaos testing / game days to prove failover works.

### Consistency
- Per-transaction and per-account strong consistency (partitioned ownership: one region/partition leader writes a given account's limits at a time).
- Downstream views eventually consistent (seconds).
- Multi-region active-active: route each card/account to a **home region** for writes, or use conflict-free designs; avoid synchronous cross-region commits on the hot path (latency).

### Concurrency
- Two simultaneous authorizations on the same card against a daily limit → conditional update (`spent + amt <= limit AND version = v`) or a single-writer partition per account.
- Ordering per card preserved by the Kafka partition key.

### Security
- Tokenized card data, HSMs for keys/PIN handling, encryption in transit and at rest, strict network segmentation, least privilege, tamper-evident audit logs, fraud and anomaly monitoring (Visa cites monitoring *22 billion security events every day* — [VISA-TECH-25](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/inside-visa-global-commerce-engine.html)).

### Monitoring
- TPS, approval rate by issuer/region, p50/p95/p99 latency per hop, timeout/fallback rate, Kafka lag, partition skew, error budgets/SLOs, reconciliation breaks. Alert on approval-rate drops (often the first sign of an outage).

### Trade-offs
- Latency vs accuracy (bigger fraud models are slower) · strong vs eventual consistency per data type · active-active (resilience, complexity) vs active-passive (simpler, slower failover) · SQL (constraints) vs LSM stores (write throughput).

### What a Visa interviewer might ask next
1. "Where does the 200 ms go?" → latency budget per hop, parallel calls, timeouts.
2. "The issuer doesn't respond" → timeout + fallback policy + later reconciliation.
3. "One region goes down" → global LB shifts traffic, capacity headroom, data replication.
4. "Two authorizations race on the same card limit" → conditional updates / single writer per account.
5. "The table grows by 1 TB a day" → partitioning, tiered storage, archival, read models.
6. (EC version) "How would **your** project handle 100× traffic?" → [11 — mini designs](11-mini-designs-asked-at-0-2-yoe.md#4-your-project-at-10x-to-100x-scale).

**🗣️ Interview mein aise bolo**: "Authorization path real-time aur chhota rakhunga — idempotency, risk score, limit check, routing — sab timeouts ke saath. Har event Kafka log mein, jisse storage, fraud, settlement sab alag se build hote hain. Data card token se partition, ek card ke events ordered. Region fail ho toh traffic doosre region pe, aur jo outcomes unknown rahe unhe reconciliation theek karta hai."

Next: [11 — Mini designs asked at 0–2 YOE →](11-mini-designs-asked-at-0-2-yoe.md)
