# SD 2 — Payment Service

> **Visa evidence** (all **senior** — used here at an early-career depth): "HLD for payment service like PhonePe, generating unique transaction id for each transaction" ([LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), 2021) · "one system design question (UPI app) HLD and deep discussion" ([LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/), 2023) · "Design a payment system, focusing on payment states, various payment methods, durable execution and retries — HLD + LLD" ([LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/), 2026). Frequency: **HIGH** (senior). LLD version: [08-lld/05](../08-lld/05-payment-processing-lld.md).

**Easy analogy — payment = courier with tracking**: Parcel (paisa) ke har step pe status update hota hai — *booked → picked → in transit → delivered* (payment states). Same parcel dobara book mat karo agar customer ne button do baar dabaya (**idempotency**). Aur har din godown ka stock register (ledger) courier company ke register se milao (**reconciliation**).

### Requirements (clarify first)
- Who pays whom? (customer → merchant, via cards/UPI/wallet) · one-time payments, refunds, maybe payouts.
- Scale: e.g. 1,000 payments/sec average, 10× at sales peaks.
- Must never **double charge** or **lose** a payment; every state change auditable.
- Latency target for the customer (e.g. < 2–3 s end to end, most time spent at the bank/network).

### Functional Requirements
- Create a payment (amount, currency, method, merchant) → authorize → capture → settle.
- Refunds (full/partial) · query payment status · merchant webhooks/notifications.
- Support multiple payment methods through a common interface (card, UPI, wallet).

### Non-functional Requirements
- **Correctness first**: exactly-once *effect* (idempotency), strong consistency for money state.
- High availability (payments down = revenue lost), durability of every accepted request.
- Security & compliance: PCI-DSS style handling of card data (tokenize, never store CVV), encryption, audit.
- Observability: trace every payment across services.

### APIs
```
 POST /api/v1/payments                     Idempotency-Key: <uuid from client>
      {"merchantId":"m1","amountMinor":49900,"currency":"INR","method":"CARD","cardToken":"tok_…"}
      → 201 {"paymentId":"pay_…","status":"AUTHORIZED"}   (same response on retry with same key)
 POST /api/v1/payments/{id}/capture         → {"status":"CAPTURED"}
 POST /api/v1/payments/{id}/refunds         Idempotency-Key: …   {"amountMinor":10000}
 GET  /api/v1/payments/{id}                 → current status + history
 Webhook to merchant: POST {merchantUrl}    {"event":"payment.captured","paymentId":…}  (signed, retried)
```

### High-level architecture
```
 Merchant app/checkout
        │ HTTPS
        ▼
 API Gateway (auth, rate limit) ──► Payment Service ──────────────► Payment DB (SQL: payments,
        │                          │  (state machine,                 attempts, idempotency keys,
        │                          │   idempotency)                   outbox)  ── primary + replicas
        │                          ├──► Risk/Fraud service (score, in parallel)
        │                          ├──► Method adapters (Strategy): Card │ UPI │ Wallet
        │                          │         └──► external processor / card network / bank
        │                          └──► Outbox relay ──► Kafka "payment-events"
        │                                                 ├──► Ledger service (double-entry)
        │                                                 ├──► Notification service (merchant webhooks, SMS)
        │                                                 └──► Settlement & reconciliation (batch)
 Tokenization vault (separate, locked-down) holds card numbers; everything else sees tokens.
```

**Card flow at a high level** (general industry model): cardholder pays a **merchant**; the merchant's **acquirer/payment gateway** sends an **authorization** request over a **card network** to the card **issuer** (the cardholder's bank), which approves or declines. Later, **clearing and settlement** move the actual funds between issuer and acquirer in batches.

### Components
- **Payment service**: validates, enforces idempotency, runs the **state machine**, persists every transition.
- **Method adapters** (Strategy pattern): one per method, all behind `PaymentMethodProcessor`.
- **Risk service**: fraud score before authorizing.
- **Ledger service**: immutable **double-entry** records (each movement = debit one account, credit another).
- **Outbox relay**: publishes events written in the same DB transaction as the state change.
- **Reconciliation job**: compares our records with processor/bank settlement files daily.

```
 CREATED ──authorize ok──► AUTHORIZED ──capture──► CAPTURED ──settlement file──► SETTLED
    │                          │                       │
    └─declined/error─► FAILED  └──void──► VOIDED        └──refund──► REFUNDED (partial/full)
 Timeout talking to the network? → UNKNOWN → status inquiry / reconciliation decides, never a blind re-charge
```

```java
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

enum PayState { CREATED, AUTHORIZED, CAPTURED, SETTLED, FAILED, VOIDED, REFUNDED, UNKNOWN }

class PaymentStateMachine {
    private static final Map<PayState, Set<PayState>> ALLOWED = Map.of(
            PayState.CREATED, EnumSet.of(PayState.AUTHORIZED, PayState.FAILED, PayState.UNKNOWN),
            PayState.UNKNOWN, EnumSet.of(PayState.AUTHORIZED, PayState.FAILED),
            PayState.AUTHORIZED, EnumSet.of(PayState.CAPTURED, PayState.VOIDED),
            PayState.CAPTURED, EnumSet.of(PayState.SETTLED, PayState.REFUNDED),
            PayState.SETTLED, EnumSet.of(PayState.REFUNDED),
            PayState.FAILED, EnumSet.noneOf(PayState.class),
            PayState.VOIDED, EnumSet.noneOf(PayState.class),
            PayState.REFUNDED, EnumSet.noneOf(PayState.class));

    static PayState transition(PayState from, PayState to) {
        if (!ALLOWED.get(from).contains(to))
            throw new IllegalStateException("illegal transition " + from + " -> " + to);
        return to;                                   // in the service: UPDATE … WHERE id=? AND state=?from
    }

    public static void main(String[] args) {
        PayState s = PayState.CREATED;
        s = transition(s, PayState.AUTHORIZED);
        s = transition(s, PayState.CAPTURED);
        System.out.println("now " + s);
        try { transition(PayState.FAILED, PayState.CAPTURED); }
        catch (IllegalStateException e) { System.out.println(e.getMessage()); }
    }
}
```

```text
now CAPTURED
illegal transition FAILED -> CAPTURED
```

### Database schema
```
 payment(id PK, merchant_id, amount_minor BIGINT, currency CHAR(3), method, card_token,
         status, version INT, created_at, updated_at)                 idx(merchant_id, created_at)
 idempotency_key(key PK, merchant_id, request_hash, payment_id, response_json, created_at)  -- UNIQUE key
 payment_attempt(id PK, payment_id FK, processor, request_id, result, error_code, latency_ms, created_at)
 payment_state_history(payment_id, from_state, to_state, reason, at)   -- audit trail
 ledger_entry(id PK, txn_ref, account_id, direction ENUM(DEBIT,CREDIT), amount_minor, at)
             -- invariant: for each txn_ref, SUM(debits) = SUM(credits)
 outbox(id PK, aggregate_id, event_type, payload_json, created_at, published_at NULL)
```
SQL (PostgreSQL/MySQL) because of transactions, constraints and auditing; money as **integer minor units**, never floats.

### Cache
- Merchant config, method routing rules, FX rates → Redis with TTL.
- **Not** payment status as the source of truth (always read the DB for money decisions); a short-TTL cache for "GET status" polling is fine.

### Queue
- Outbox → Kafka `payment-events` (keyed by `paymentId` → ordered per payment) → ledger, notifications, analytics, settlement.
- Webhook delivery queue with retries + exponential backoff + DLQ.

### Scaling
- Stateless payment service behind the gateway; scale horizontally.
- DB: vertical first, read replicas for queries/reports, later **shard by merchant_id** (keeps a merchant's payments together).
- External processors are the bottleneck → connection pools, timeouts, parallel risk check.

### Load balancing
- L7 load balancer / gateway round-robin across stateless instances; health checks remove bad nodes.
- Route to processors by health and cost (smart routing), with failover to a backup processor where allowed.

### Failure handling
- **Client retries** → idempotency key returns the stored result (unique constraint makes it race-safe).
- **Processor timeout** → mark `UNKNOWN`, query status later (or wait for reconciliation) — **never** blindly retry a charge.
- Service crash after DB commit but before publishing → **outbox** guarantees the event is eventually published.
- Kafka consumers are idempotent (dedupe by event id) because delivery is at-least-once.
- Daily **reconciliation** catches anything that slipped through.

### Consistency
- Strong consistency for payment state (single-row transactional updates, `version` column / conditional updates on state).
- Eventual consistency for ledger projections, notifications, analytics (via events).
- A payment and its outbox row are written in **one** local transaction; no distributed 2PC.

### Concurrency
- Double-click "Pay" → same idempotency key → one payment.
- Capture and refund racing on one payment → `UPDATE payment SET status=? WHERE id=? AND status=?` (compare-and-set) or optimistic `version`; the loser gets a conflict.

### Security
- Tokenize PAN (card number) in a separate vault; services see tokens only; **never store CVV**.
- TLS everywhere, mTLS between services; secrets in a vault/HSM; sign webhooks (HMAC) so merchants can verify them.
- Least-privilege DB access, full audit trail, PII masking in logs, rate limits per card/merchant against card-testing.

### Monitoring
- Authorization success rate per method/processor, p95/p99 latency, `UNKNOWN` count, webhook failure rate, Kafka lag, reconciliation mismatches. Alert on sudden drops in success rate.

### Trade-offs
- Sync authorization (customer waits) vs async capture/settlement.
- Strong consistency on the core vs eventual consistency on side effects (throughput and decoupling).
- One processor (simple) vs multi-processor routing (resilience, complexity).

### What a Visa interviewer might ask next
1. "How do you guarantee the customer isn't charged twice?" → idempotency key + unique constraint + state machine.
2. "The bank/network timed out — was the payment successful?" → UNKNOWN state, status inquiry, reconciliation.
3. "How do you generate unique transaction IDs across data centres?" → [SD 3](03-unique-transaction-id-generator.md).
4. "Where do you store card numbers?" → tokenization vault, PCI scope reduction.
5. "Add a new payment method" → new Strategy implementation, no change to the core ([08-lld/05](../08-lld/05-payment-processing-lld.md)).
6. (Senior) "Make it multi-region active-active" → partition by merchant/region, avoid cross-region writes on the hot path.

**🗣️ Interview mein aise bolo**: "Payment ko main ek state machine ki tarah treat karta hoon — har transition DB mein conditional update se, taaki galat order mein status na badle. Retries ke liye idempotency key, side effects ke liye outbox + Kafka, aur timeout ko failure nahi — UNKNOWN maanta hoon jise reconciliation clear karta hai."

Next: [SD 3 — Unique transaction ID generator →](03-unique-transaction-id-generator.md)
