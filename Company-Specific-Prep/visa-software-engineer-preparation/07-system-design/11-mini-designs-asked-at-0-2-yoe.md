# SD 11 — Mini Designs Actually Asked at 0–2 YOE

> These are the **small design questions early-career candidates reported**. They are more likely at your level than a full "design Visa" question. Keep answers to 5–10 minutes each.

**Easy analogy**: Yeh "full wedding planning" nahi, "ek function ka arrangement" hai — chhota scope, par har cheez ka reason batana hai.

## 1. Live count of users on a page without refresh

**Source**: [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) (SWE-I, 1.5 YOE, onsite, pen and paper).

```
 browser ──WebSocket/SSE──► app server ──heartbeat every 10s──► Redis sorted set
                                                                  key: page:{id}:viewers
                                                                  member: sessionId, score: lastSeenMs
 count = ZCOUNT(now − 30s, now); a scheduler pushes the count to connected clients every 2–5 s
```

- **Push options**: WebSocket (two-way) or **Server-Sent Events** (one-way, simpler, enough for a counter). Fallback: polling every few seconds.
- **Why a sorted set with timestamps**: tabs close without saying goodbye; entries older than 30 s simply stop counting (`ZREMRANGEBYSCORE` cleans them).
- **Scale**: many app servers → the count lives in Redis, not in one server's memory; push through Redis pub/sub so every server can notify its own connections.
- **Say**: "Exact-to-the-second isn't needed, so I'd accept a few seconds of delay and batch updates."

## 2. "How would you build a new microservice?" (DB, async, cache)

**Source**: [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (1 YOE, selected). Full checklist: [Spring 5/5 §2](../05-spring-boot/05-microservices-and-async.md#2-how-would-you-approach-building-a-new-microservice-asked-to-a-1-yoe-selected-candidate). Order: responsibility → API → own DB (SQL for money) → sync vs async (events) → cache for read-heavy config → timeouts/retries → security → monitoring → CI/CD.

## 3. Image / document upload API

**Source**: senior HM rounds ([LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/), [LC-1736047](https://leetcode.com/discuss/post/1736047/visa-sr-software-engineer-bangalore-jan-lwgky/)) — "what if the image doesn't upload? how would you tell the user?"

```
 1. client → POST /uploads {fileName, size, type} → server validates, returns a pre-signed URL (valid 5 min)
 2. client → PUT file directly to object storage (S3) — app servers never carry the bytes
 3. storage event → worker: virus scan, resize/thumbnail, extract metadata → status READY / FAILED
 4. client polls GET /uploads/{id} or gets a push when done
```

Failures: size/type rejected before upload · network drop → retry / multipart **resumable** upload · processing fails → status FAILED with a reason shown to the user · orphan files cleaned by a lifecycle rule.

## 4. Your project at 10x to 100x scale

**Sources**: [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) (10 months, selected: "grilled on resume and system design… scalability and performance trade-offs, used Excalidraw"), [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) (React → Spring Boot → DB flow + caching/Kafka/DB improvements), [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/) (Staff version: planet scale).

Walk through it layer by layer:

| Layer | What breaks at 10–100× | What you'd add |
|---|---|---|
| Frontend | big bundles, too many API calls | code splitting, CDN, debounced search, pagination |
| API servers | CPU/threads | stateless instances behind a load balancer, autoscaling |
| Database | slow queries, connection limits | indexes, read replicas, connection pooling, then partitioning/sharding |
| Hot reads | same data read repeatedly | Redis cache-aside + TTL |
| Slow side work | emails, reports block requests | queue (Kafka/SQS) + workers |
| Reliability | one dependency slows everything | timeouts, retries, circuit breakers, rate limits |
| Visibility | "it's slow" with no data | metrics, logs with correlation ids, tracing, alerts |

**Say**: "First I'd measure where the bottleneck is — then fix the biggest one first, not everything at once."

## 5. Keeping the order of data written to the DB

**Source**: [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) (a 30-minute discussion that decided the result). Answer: [DB 1/3 §11](../06-database-sql/01-sql-and-dbms-concepts.md#11-data-integrity-strategies--keeping-write-order-managerial--project-questions) — per-entity sequence numbers, one ordered pipeline per key (Kafka partition key), conditional idempotent writes, don't trust wall clocks.

Back to [System design index](README.md) · Next: [08 — LLD →](../08-lld/README.md)
