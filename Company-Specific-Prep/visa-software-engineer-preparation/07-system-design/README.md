# 07 — System Design for Visa (0–1 YOE level)

> **Level check**: for early-career candidates, reports show **small, practical** design questions — TinyURL, an order-delivery schema with APIs, "how would you build a new microservice", "draw your project and scale it", "show a live visitor count without refresh". Big multi-datacenter designs (payment platform HLD+LLD, planet-scale redesign) were reported for **Senior/Staff** candidates. The 10 designs below are pitched at the early-career level, with "stretch" notes where seniors were pushed further.

**Easy analogy — system design = planning a wedding for 500 guests**: Pehle poochho **kitne log, kya menu, kya budget** (requirements). Phir **venue layout** (high-level architecture), **kitchen ki line** (queues), **pehle se bana ke rakha khaana** (cache), **extra caterer standby** (replication/failover), aur **kaun kya sambhalega** (components). Seedha "biryani kaise banegi" (code) pe mat koodo.

## 1. What Visa actually asked (evidence)

| Design question | Reporter level | Source | Frequency |
|---|---|---|---|
| Payment service / payment system / UPI app (+ unique transaction id) | Senior ×2, Staff | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), [LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/), [LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/) | **HIGH** (senior) |
| URL shortener / TinyURL | **EC (1.5 YOE, selected)**, Senior | [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/), [LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/) | MEDIUM |
| Rate limiter (HLD) / rate-limit IPs from logs | Senior, **EC (selected)** | [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) | MEDIUM |
| Food / order delivery (Swiggy architecture; order schema + APIs) | NCG ×2 | [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) | MEDIUM |
| Notification system (+ email/SMS code structure) | Staff, Senior | [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | MEDIUM |
| Custom cache / caching strategies / cache replacement | Senior, NCG, **EC** | [LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) | **HIGH** |
| Many transaction files processed in parallel | Senior (2021) | [LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/) | LOW |
| Write-intensive server · planet-scale redesign of your project | Senior, Staff | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/) | MEDIUM (senior) |
| **Your own project**: draw it, then scale it / improve it | **EC ×3** | [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/), [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/), [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) | **HIGH** |
| "How would you build a new microservice (DB, async, cache)?" | **EC (selected)** | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) | LOW |
| Live count of users on a page without refresh | **EC (1.5 YOE)** | [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) | LOW |
| Chat system | — | **not found in any Visa report** (included because you asked) | — |
| Also seen once (mostly senior): BookMyShow, Splitwise, YouTube, LinkedIn, Twitter feed, image-upload API, distributed scheduler, secure remote printing, write-heavy server | mixed | see [research-findings](../01-hiring-process/research-findings.md) | LOW each |

**Takeaway**: at your level the most likely design conversation is **your own project** (draw → explain choices → "what if 10× users?") plus one small classic (TinyURL / rate limiter / order system). Prepare those deeply before the big ones.

## 2. The 45-minute framework (say the steps out loud)

```
 1. Clarify (5 min)      users? scale (requests/sec, data size)? read vs write heavy? latency? consistency needs?
 2. Estimate (3 min)     QPS, storage/day, peak vs average — rough numbers are fine
 3. API (5 min)          3–5 endpoints with request/response + idempotency for writes
 4. Data model (5 min)   tables/collections, keys, indexes; SQL vs NoSQL with a reason
 5. HLD (10 min)         client → LB/gateway → services → cache → DB; queues for async work
 6. Deep dive (10 min)   the interesting part: ID generation, hot keys, consistency, failure
 7. Wrap up (5 min)      bottlenecks, monitoring, trade-offs, what you'd do next
```

## 3. Building blocks cheat-sheet

| Block | One-liner | When to add it |
|---|---|---|
| Load balancer | spreads requests over instances (round robin, least connections, consistent hashing) | > 1 instance, health checks, zero-downtime deploys |
| API gateway | single entry: auth, rate limiting, routing, TLS | many services / external clients |
| Cache (Redis) | keep hot data in memory; cache-aside + TTL | read-heavy, same data read often |
| CDN | cache static/media near users | images, JS, downloads |
| Message queue / log (Kafka, SQS) | decouple, absorb spikes, async work, fan-out | slow side effects, many consumers |
| SQL DB | ACID, relations, constraints | money, orders, anything needing correctness |
| NoSQL | flexible schema, huge scale, simple access patterns | events, logs, catalogues, sessions |
| Replication | copies for availability + read scaling | always for important data |
| Sharding | split data by a key for write/storage scale | one machine isn't enough |
| Consistent hashing | add/remove nodes moving few keys | caches, sharded stores |
| Object storage (S3) | cheap durable blobs | files, images, exports |

## 4. Payments ideas that make any Visa answer stronger

- **Idempotency keys** on every money-moving write (retries must not double charge).
- **State machines** for payments (CREATED → AUTHORIZED → CAPTURED → SETTLED / FAILED / REFUNDED) with allowed transitions only.
- **Double-entry ledger** (every movement = a debit + a credit; balances are derived and auditable).
- **Outbox + events** for side effects (notify, settle) without losing messages.
- **Timeouts ≠ failure**: an unknown outcome needs a status check/reconciliation, not a blind retry.
- **Security**: tokenize card numbers, never store CVV, TLS everywhere, least privilege, audit logs.
- **Scale facts to quote (official)**: VisaNet can process *up to 83,000 transaction messages per second* and Visa reports *99.9999% uptime* across seven data centres ([VISA-TECH-25](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/inside-visa-global-commerce-engine.html)). Use them to show interest — don't pretend to know internals.

## 5. The designs

| # | Design | Visa evidence | Depth |
|---|---|---|---|
| 1 | [Rate limiter](01-rate-limiter.md) | Senior HLD + EC log question | full + tested token bucket |
| 2 | [Payment service](02-payment-service.md) | Senior ×2, Staff | full |
| 3 | [Unique transaction ID generator](03-unique-transaction-id-generator.md) | Senior (2021) | full + tested Snowflake-style generator |
| 4 | [Notification system](04-notification-system.md) | Staff, Senior | full |
| 5 | [URL shortener](05-url-shortener.md) | **EC**, Senior | full + tested base62 |
| 6 | [File processing system](06-file-processing-system.md) | Senior, EC topic | full |
| 7 | [Food delivery system](07-food-delivery-system.md) | NCG ×2 | full |
| 8 | [Chat system](08-chat-system.md) | not reported | full (EC level) |
| 9 | [Cache with TTL](09-cache-with-ttl.md) | Senior, NCG, EC | full |
| 10 | [Large-scale transaction processing](10-transaction-processing-system.md) | Senior/Staff themes | full (EC level + stretch) |
| + | [Mini designs asked at 0–2 YOE](11-mini-designs-asked-at-0-2-yoe.md) | **EC** | live visitor count, new microservice, image upload API, your project at 10× |

Deeper generic notes already in this repo: [HLD fundamentals](../../../HLD/README.md) · [How to approach any HLD problem](../../../HLD/01-how-to-approach-any-problem.md) · [HLD case studies](../../../HLD/02-problems/README.md).

Next: [Rate limiter →](01-rate-limiter.md)
