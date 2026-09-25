# Spring Boot 5/5 — Microservices · Kafka · Resilience · Async · Docker/K8s · CI/CD

**Easy analogy — monolith vs microservices = joint family kitchen vs food court**: Joint family kitchen (monolith) — ek hi chulha, sab ek saath banta hai; simple, par ek dish jal gayi toh poora kitchen ruk jaata hai. Food court (microservices) — har counter apna menu, apna staff, apna gas cylinder (own DB); ek counter band ho toh baaki chalte rahte hain, par **billing, cleaning aur coordination** ka kaam badh jaata hai.

| Topic | Visa reports | Freq |
|---|---|---|
| Microservice architecture / monolith vs microservices | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**), [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/), [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/) (**EC**, HM round), [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/) | **HIGH** (4) |
| "How would you build a new microservice? (DB, async, cache)" | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**, selected) | LOW (but high value) |
| Kafka: why, alternatives, trade-offs | [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) (**EC**, selected), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/), [LC-7564195](https://leetcode.com/discuss/post/7564195/visa-staff-se-backend-r-1-by-debmalyapan-nw6e/), [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/) | **HIGH** (4) |
| Service communication · event-driven · production debugging | [LC-8220228](https://leetcode.com/discuss/post/8220228/visa-sse-interview-experience-by-prashan-h0d0/) | LOW (senior) |
| Saga, strangler fig, API gateway, canary | [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/) (Staff) | LOW |
| Async programming in Spring (`@Async`) | [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | LOW |
| Docker vs Kubernetes · CI/CD on a whiteboard · cloud | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) (**EC**, 2 YOE) | LOW |
| "REST API vs microservice — which would you choose?" (confusing HM question) | [LC-2267640](https://leetcode.com/discuss/post/2267640/not-able-to-clear-hiring-manager-rounds-rm3qj/) | LOW |

---

## 1. Monolith vs microservices

| | Monolith | Microservices |
|---|---|---|
| Deploy | one unit | each service independently |
| Scale | whole app | only the hot service (e.g. authorization, not reporting) |
| Data | one shared DB | **each service owns its DB** (no sharing tables) |
| Failure | one bug can take everything down | isolated — if timeouts/circuit breakers exist |
| Complexity | simple to build, test, debug | network calls, eventual consistency, tracing, many pipelines |
| Team fit | small team, early product | many teams owning clear business domains |

**"REST API vs microservice?"** — they aren't alternatives. A microservice is a **deployment/architecture unit**; REST is **one way** it can expose an API (others: gRPC, messaging). Politely clarify that in the interview instead of picking one.
**Interview answer**: "Start with a well-modularised monolith; split out a service when a domain needs independent scaling, deployment or ownership. Each service owns its data and talks through APIs or events. The price is distributed-systems complexity, so you need timeouts, retries with idempotency, tracing and automation from day one."

---

## 2. "How would you approach building a new microservice?" (asked to a 1-YOE selected candidate)

The interviewer was *"asking about choosing of db, asynchronization, cache, etc."* ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)). Walk through this checklist — it's also a mini system-design answer:

```
 1. Responsibility     one business capability (e.g. "refunds"), what it owns, what it doesn't
 2. API contract       REST endpoints / events; versioned; idempotency keys for writes
 3. Data               own database; SQL (transactions, relations — payments/ledger)
                       vs NoSQL (flexible schema, huge write volume — logs, events)
 4. Sync vs async      user waiting? → sync REST. Side effects (email, analytics, settlement)? → publish an event (Kafka)
 5. Cache              read-heavy, rarely changing data (merchant config) → Redis cache-aside + TTL;
                       never cache what must be exact right now (balances) without care
 6. Resilience         timeouts on every call, retries with backoff for idempotent calls, circuit breaker, DLQ
 7. Security           authN via gateway/JWT, authZ per endpoint, secrets in a vault, TLS/mTLS
 8. Observability      structured logs + correlation id, metrics (rate, errors, latency), tracing, alerts
 9. Delivery           Docker image, CI/CD with tests, health/readiness probes, config per environment
10. Testing            unit (mocks), integration (Testcontainers), contract tests with consumers
```

**🗣️ Interview mein aise bolo**: "Main pehle service ki zimmedari aur data ownership decide karta hoon, phir DB (payments ke liye SQL kyunki transactions chahiye), phir kaunse kaam synchronous aur kaunse event se async, phir cache sirf read-heavy config ke liye, aur end mein timeouts/retries/monitoring."

---

## 3. Service-to-service communication

| | Synchronous (REST / gRPC) | Asynchronous (Kafka / RabbitMQ / SQS) |
|---|---|---|
| Caller waits? | yes | no — fire an event, continue |
| Coupling | temporal coupling (callee must be up) | decoupled in time; broker buffers |
| Good for | queries, user-facing request/response | side effects, fan-out, spikes, workflows |
| Failure handling | timeouts, retries, circuit breakers | retries, DLQ, idempotent consumers |
| Consistency | immediate | eventual |

---

## 4. Kafka — "Why Kafka? Alternatives? Trade-offs?" (EC, selected)

```
 producer ──key=merchantId──► topic "payments" (3 partitions, replication factor 3)
                               P0: m1 m4 m1 …   ← same key → same partition → ORDER kept per key
                               P1: m2 m5 …
                               P2: m3 …
 consumer group "settlement": consumer A ← P0, P1   consumer B ← P2   (a partition → one consumer in a group)
 consumer group "analytics":  reads the SAME events independently, at its own pace (offsets per group)
 retention: 7 days → a new service can REPLAY history
```

**Why teams pick Kafka**: very high throughput, durable replicated log, **replay** by resetting offsets, **ordering per key**, many independent consumer groups on the same stream, backpressure (consumers pull), good ecosystem (Kafka Connect, Streams).
**Trade-offs**: operational complexity (brokers, partitions, rebalancing, monitoring lag), ordering only **within a partition**, at-least-once delivery by default → **consumers must be idempotent**, not a task queue (no per-message priority/delay out of the box), exactly-once only within Kafka transactions.
**Alternatives**: RabbitMQ (smart routing, per-message ack, priorities — classic work queues) · AWS SQS/SNS or GCP Pub/Sub (fully managed) · Redis Streams (light) · Apache Pulsar (Kafka-like + multi-tenancy) · or just a DB table + scheduler for small volumes.

```java
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

record PaymentAuthorized(String eventId, String paymentId, String merchantId, long amountPaise) {}

@Service
class PaymentEventPublisher {
    private final KafkaTemplate<String, PaymentAuthorized> kafka;

    PaymentEventPublisher(KafkaTemplate<String, PaymentAuthorized> kafka) { this.kafka = kafka; }

    void publish(PaymentAuthorized event) {
        kafka.send("payments.authorized", event.merchantId(), event);   // key → partition → per-merchant order
    }
}

@Component
class SettlementConsumer {
    private final Set<String> processed = ConcurrentHashMap.newKeySet();   // prod: a processed_events table

    @KafkaListener(topics = "payments.authorized", groupId = "settlement")
    void onAuthorized(PaymentAuthorized event) {
        if (!processed.add(event.eventId())) return;                     // duplicate delivery → ignore (idempotent)
        // add to the settlement batch …
    }
}
```

**Interview answer (if Kafka is on your resume, expect exactly this)**: "We used Kafka because [CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE — e.g. several services needed the same order events and we wanted to replay them]. We keyed by order id to keep per-order ordering, made consumers idempotent because delivery is at-least-once, and sent poison messages to a dead-letter topic. RabbitMQ would have been simpler for plain work queues; SQS if we wanted fully managed."
**Trap**: listing Kafka on the resume when you only consumed one topic once — the follow-ups go deep (partitions, consumer groups, offsets, rebalancing, lag).

---

## 5. Resilience patterns (say these for any "what if the downstream is slow/down?" question)

| Pattern | What it prevents |
|---|---|
| **Timeout** | threads stuck forever on a slow dependency |
| **Retry with exponential backoff + jitter** | failing on a short blip (only for **idempotent** operations) |
| **Circuit breaker** | hammering a dead service; fail fast + recover automatically |
| **Bulkhead** | one slow dependency using up all threads |
| **Fallback** | degrade gracefully (cached value, "try again later") |
| **Rate limiting** | overload / abuse ([07-system-design/01](../07-system-design/01-rate-limiter.md)) |
| **Idempotency keys** | double effects from retries (double charge!) |

```java
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;

interface RiskClient { int score(String cardToken); }

@Service
class RiskScoringService {
    private final RiskClient client;

    RiskScoringService(RiskClient client) { this.client = client; }

    @CircuitBreaker(name = "risk", fallbackMethod = "fallbackScore")   // opens after repeated failures
    @Retry(name = "risk")                                               // backoff settings in application.yml
    public int score(String cardToken) {
        return client.score(cardToken);                                 // client itself has timeouts
    }

    int fallbackScore(String cardToken, Throwable cause) {
        return 50;                                                      // neutral score → route to extra checks
    }
}
```

---

## 6. Transactions across services — saga and outbox

A single DB transaction can't span two services' databases. Options:
- **2PC (two-phase commit)**: strong consistency, but blocking and fragile — rarely used between microservices.
- **Saga**: a sequence of local transactions; if a later step fails, run **compensating** actions (refund, release inventory). *Choreography* = services react to each other's events; *orchestration* = a coordinator tells each service what to do (easier to follow).
- **Transactional outbox**: in the same local transaction, write the business row **and** an `outbox` row; a relay publishes outbox rows to Kafka → no "DB committed but event lost" gap.

```
 Order svc: create order (PENDING) ──event──► Payment svc: charge ──event──► Inventory svc: reserve
                                                   │ fails
                                                   └──compensate──► Order svc: mark CANCELLED
```

The Staff candidate answered the "data is scattered after splitting the monolith, how do transactions work?" question with **Saga** ([LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/)). At 0–1 YOE, knowing *what* a saga and an outbox are is enough.

---

## 7. API gateway, discovery, config

```
 clients ─► API Gateway (auth, rate limit, routing /v1/payments → payment-svc, TLS termination)
               │
               ├─► payment-svc (3 pods) ◄─ service discovery (Kubernetes Service / Eureka) + load balancing
               ├─► refund-svc
               └─► merchant-svc
 config: environment variables / ConfigMaps / a config server; secrets from a vault
```

---

## 8. `@Async` in Spring (Senior report)

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

@Configuration
@EnableAsync
class AsyncConfig {
    @Bean(name = "notificationExecutor")
    Executor notificationExecutor() {
        ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(4);
        ex.setMaxPoolSize(8);
        ex.setQueueCapacity(500);                          // bounded: don't hide overload in memory
        ex.setThreadNamePrefix("notify-");
        ex.initialize();
        return ex;
    }
}

@Service
class ReceiptEmailService {
    @Async("notificationExecutor")                         // runs on the pool; caller returns immediately
    public CompletableFuture<String> sendReceipt(String paymentId) {
        return CompletableFuture.completedFuture("receipt sent for " + paymentId);
    }
}
```

**Traps**: same self-invocation proxy trap as `@Transactional` · the default executor may not suit production — define your own · `@Async` work is lost if the pod dies → for important work use a message queue instead.

---

## 9. Docker vs Kubernetes, CI/CD (asked to a 2-YOE candidate, incl. a whiteboard)

| | Docker | Kubernetes |
|---|---|---|
| What | packages the app + runtime into an **image**, runs **containers** | **orchestrates** many containers across machines |
| Solves | "works on my machine" | scaling, self-healing (restarts), rolling updates, service discovery, config/secrets |

```
 CI/CD (what to draw)
 git push ─► CI: build ─► unit tests ─► static analysis / dependency scan ─► integration tests
         ─► build Docker image ─► push to registry
         ─► CD: deploy to staging ─► smoke / contract tests ─► approval
         ─► prod: rolling or canary deploy ─► health checks + metrics watch ─► auto-rollback on errors
```

**Feature flags** as a safety net (the "bypass a risky feature without a code change" question an experienced candidate blanked on, [LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/)): ship the code turned off, enable per merchant/percentage, turn it off instantly if errors rise.

---

## 10. Production debugging checklist (event-driven / on-call questions)

1. **Scope**: which endpoint/merchants/region, since when, what changed (deploy, config, traffic)?
2. **Dashboards**: error rate, latency percentiles (p95/p99), saturation (CPU, pool usage, consumer lag).
3. **Logs** by **correlation id** across services; **traces** to find the slow hop.
4. **Mitigate first** (rollback, feature flag off, scale out), **then** root-cause.
5. **Post-mortem**: timeline, root cause, fix, action items (alerts, tests) — blameless.

---

⚡ **Quick revision**: microservices = independent deploy/scale + own data, paid for with distributed complexity · new service: responsibility → API → DB → sync/async → cache → resilience → security → observability → CI/CD · Kafka = partitioned replicated log, order per key, replay, at-least-once → idempotent consumers · timeouts + retries (idempotent only) + circuit breaker · saga + outbox instead of distributed transactions.

Back to [Spring index](README.md) · Next: [06 — Database & SQL →](../06-database-sql/README.md)
