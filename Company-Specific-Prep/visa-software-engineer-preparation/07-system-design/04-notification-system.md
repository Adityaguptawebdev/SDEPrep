# SD 4 — Notification System (e.g. transaction alerts)

> **Visa evidence**: "How do you design a notification system?" with follow-ups on multi-datacenter consistency and **"how do you make sure a notification event is not consumed twice?"** → globally unique event id for idempotency ([LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/), 2026, Staff) · "I have to send out email and SMS notifications, how will you structure the code?" → interface + factory ([LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/), 2025, Senior). Frequency: **MEDIUM**. Code-structure (LLD) version: [08-lld/02](../08-lld/02-notification-service-factory-strategy.md). Generic note: [HLD notification system](../../../HLD/02-problems/05-notification-system.md).

**Easy analogy — shaadi ka invitation**: Card chhapna (template), guest list (user preferences), kisko WhatsApp, kisko courier (channels), kisi ka phone band (retry), ek hi aadmi ko do card na jaayein (dedupe), aur "card mila?" ki tracking (delivery status).

### Requirements (clarify first)
- Channels: SMS, email, push, in-app? Which events (payment success, OTP, refund, marketing)?
- Priority: OTP/fraud alerts must arrive in seconds; marketing can wait or be batched.
- Scale: e.g. 50M notifications/day, peaks 5× during sales.
- User preferences / opt-outs / quiet hours? Delivery tracking needed?

### Functional Requirements
- Accept a notification request (event → user) and deliver via the user's preferred channels using templates.
- Respect preferences, opt-outs and legal rules (no marketing without consent).
- Retry failures, track status (queued → sent → delivered/failed), let users/merchants see history.

### Non-functional Requirements
- **At-least-once delivery with dedupe** (so effectively once for the user).
- Low latency for high-priority messages; high throughput for bulk.
- Provider independence (switch SMS vendors on outage), no single point of failure.

### APIs
```
 POST /api/v1/notifications
      {"eventId":"evt_91f…","userId":"u1","type":"PAYMENT_SUCCESS","priority":"HIGH",
       "data":{"amount":"499.00","merchant":"ChaiPoint"}}          → 202 Accepted {"notificationId":"n_…"}
 GET  /api/v1/notifications/{id}                                   → status per channel
 PUT  /api/v1/users/{id}/notification-preferences  {"sms":true,"email":false,"quietHours":"22-07"}
```

### High-level architecture
```
 payment-service ──event──► Kafka "domain-events" ─► Notification API / consumer
                                                        │ 1. dedupe by eventId (Redis/DB unique)
                                                        │ 2. load preferences + template
                                                        │ 3. store notification row (QUEUED)
                                                        ▼
                                   ┌──────────── priority topics ────────────┐
                                   │ notif.high (OTP, fraud)  notif.low (promo)│
                                   └──────┬──────────────┬──────────────┬────┘
                                          ▼              ▼              ▼
                                    SMS workers     Email workers   Push workers   (scale separately)
                                          │              │              │
                                     SMS provider A/B   Email provider  FCM/APNs
                                          └── status callbacks ──► update status (SENT/DELIVERED/FAILED)
                        failures → retry topic with backoff → DLQ after N attempts → alert/ops
```

### Components
- **Ingest/consumer**: validates, de-duplicates, fans out to channels.
- **Preference service** + **template service** (versioned templates, localisation).
- **Channel workers** (Strategy per channel) with **provider adapters** (Adapter pattern) and failover.
- **Status store** + provider **callback/webhook** handler.
- **Scheduler** for delayed/quiet-hours messages.

### Database schema
```
 notification(id PK, event_id UNIQUE, user_id, type, priority, created_at)
 notification_delivery(id PK, notification_id FK, channel, provider, status, attempts,
                       last_error, next_retry_at, updated_at)       idx(status, next_retry_at)
 user_preference(user_id PK, sms BOOL, email BOOL, push BOOL, quiet_start, quiet_end, locale)
 template(id, type, channel, locale, version, body)                  PK(type, channel, locale, version)
```

### Cache
- Preferences and templates in Redis/local cache (read on every message, change rarely); invalidate on update.
- Dedupe keys `seen:{eventId}` in Redis with TTL (e.g. 24 h) in front of the DB unique constraint.

### Queue
- Kafka topics per priority (and per channel) so promo floods can't delay OTPs; partition by `userId` to keep a user's messages ordered.
- Retry topics with increasing delays (1 min, 5 min, 30 min) + a **dead-letter queue**.

### Scaling
- Workers are stateless consumers → add instances/partitions per channel.
- Provider rate limits → per-provider token buckets; batch emails; spread promo sends over time.

### Load balancing
- Kafka consumer groups balance partitions across workers; the HTTP ingest API sits behind an LB.
- Multiple SMS providers: weighted routing by cost/success rate, automatic failover on errors.

### Failure handling
- Provider down → circuit breaker → switch provider; messages wait in the queue (durable).
- Worker crash mid-send → message redelivered → **dedupe** (by `notificationId + channel`) prevents double SMS.
- Poison message (bad template data) → DLQ, alert, don't block the partition.

### Consistency
- Eventual: the payment commits first, the alert follows in seconds via the event.
- Exactly-once *effect* = at-least-once delivery + idempotent processing keyed by event id (the Staff candidate's answer).
- Multi-DC (senior follow-up): replicate Kafka and the status DB across DCs; dedupe keys must be visible in both, or route each user to a home DC.

### Concurrency
- Two consumers get the same event after a rebalance → the unique `event_id` insert lets only one proceed.
- Status updates from callbacks can arrive out of order → only move status "forward" (`QUEUED < SENT < DELIVERED`), ignore stale ones.

### Security
- Never put full card numbers or OTPs in logs; mask PII; OTPs short-lived.
- Signed provider callbacks; per-tenant auth on the API; opt-out and consent records (compliance).

### Monitoring
- End-to-end latency per priority (event time → delivered), provider success/failure rates, queue lag, DLQ size, cost per provider. Alert when OTP p95 > a few seconds.

### Trade-offs
- Separate topics per priority (isolation) vs one topic (simplicity).
- Push vs SMS cost; multiple providers (resilience) vs one (simpler integration).
- Storing every notification forever (audit) vs TTL/archival (cost).

### What a Visa interviewer might ask next
1. "How do you make sure a notification is not sent twice?" → event id + unique constraint/Redis dedupe + idempotent workers.
2. "OTP must arrive in 5 seconds even during a promo blast" → priority topics, reserved capacity.
3. "SMS provider is down" → circuit breaker + failover provider + queue buffering.
4. "Show me the code structure for email vs SMS" → interface + factory/strategy ([08-lld/02](../08-lld/02-notification-service-factory-strategy.md)).
5. (Senior) "Users are served from two data centres — consistency?" → replicated log/DB, dedupe visible across DCs or user-to-DC affinity.

**🗣️ Interview mein aise bolo**: "Payment service sirf event publish karti hai; notification service usse consume karke preferences, template aur channel decide karti hai. Priority ke hisaab se alag queues, provider failover, retries with backoff aur DLQ — aur har event ki unique id se dedupe, taaki user ko do SMS na jaayein."

Next: [SD 5 — URL shortener →](05-url-shortener.md)
