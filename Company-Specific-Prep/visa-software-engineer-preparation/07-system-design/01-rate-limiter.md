# SD 1 — Rate Limiter

> **Visa evidence**: "HLD discussion → design Rate Limiter" after a project-architecture discussion ([LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), Apr 2026, Senior); the coding version — rate-limit IPs from a log, DDoS, GB-size logs — for a **10-month SWE who was selected** ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)). Frequency: **MEDIUM**. Coding version: [DSA 2/8 §1](../03-dsa/02-sliding-window-and-rate-limiter.md#1-rate-limit-ips-from-a-log-file). Deeper generic note: [HLD rate limiter](../../../HLD/02-problems/02-rate-limiter.md).

**Easy analogy — metro station token gate**: Har second kuch tokens machine mein girte hain (refill). Tumhe andar jaane ke liye ek token chahiye. Rush hour mein tokens khatam → "kripya pratiksha karein" (429). Bucket ka size decide karta hai ki ek saath kitne log ghus sakte hain (burst).

### Requirements (clarify first)
- Limit **whom**? per API key / per user / per IP / per merchant — and per **which endpoint**?
- Limits like "100 requests/minute" and "10 payment attempts/minute per card"? Bursts allowed?
- Where does it run — in the API gateway (one place) or inside each service?
- Hard block (429) or soft (queue / degrade)? What if the limiter itself is down?

### Functional Requirements
- Allow or reject each request based on configurable rules (key + limit + window).
- Return `429 Too Many Requests` with `Retry-After` and `X-RateLimit-Remaining` headers.
- Rules changeable without redeploy (per client tier: free/partner/internal).

### Non-functional Requirements
- **Low latency**: < 1–2 ms added per request (it sits on the hot path).
- **Correct across many instances** (a user's requests hit different servers).
- Highly available; decide **fail-open** (allow if limiter is down) vs **fail-closed** (block) per endpoint.
- Scales with traffic (millions of keys).

### APIs
```
 internal:  boolean allow(String key, String ruleId)          // called by gateway/filter
 admin:     PUT /api/v1/rate-limit-rules/{ruleId}  {"limit":100,"windowSec":60,"burst":20}
 response to clients when blocked:
            HTTP 429  Retry-After: 12  X-RateLimit-Limit: 100  X-RateLimit-Remaining: 0
```

### High-level architecture
```
 client ─► Load balancer ─► API Gateway ──(1) check key──► Rate-limit service/lib ──► Redis cluster
                               │        ◄─ allow / 429 ──                              (counters/buckets,
                               │ (2) allowed                                            TTL per key)
                               ▼
                         backend services
 rules: config DB / config service ──(cached in memory, refreshed every few seconds)──► gateway
```

### Components
- **Rules store** (DB/config) + in-memory cache of rules in each gateway node.
- **Limiter logic** in the gateway (a filter) — algorithm below.
- **Shared counter store**: Redis (atomic ops, TTL, microsecond latency).
- **Metrics**: allowed/blocked counts per rule for dashboards and abuse detection.

**Algorithms** (know three, pick one with a reason):

| Algorithm | How | Pros | Cons |
|---|---|---|---|
| Fixed window counter | `INCR key:minute`, expire at window end | tiny memory, simple | 2× burst at the window boundary |
| Sliding window log | store each timestamp (sorted set), drop old ones | exact | memory ∝ requests |
| Sliding window counter | weighted mix of current + previous window counts | good accuracy, small memory | approximation |
| **Token bucket** | tokens refill at rate r up to capacity b; each request takes 1 | allows controlled bursts, O(1) state | slightly more logic |
| Leaky bucket | queue drains at a fixed rate | smooth output | adds latency/queueing |

```java
import java.util.function.LongSupplier;

class TokenBucket {
    private final long capacity;                 // max burst
    private final double refillPerNano;          // tokens per nanosecond
    private final LongSupplier clock;            // injectable → testable
    private double tokens;
    private long lastRefill;

    TokenBucket(long capacity, double tokensPerSecond, LongSupplier nanoClock) {
        this.capacity = capacity;
        this.refillPerNano = tokensPerSecond / 1_000_000_000.0;
        this.clock = nanoClock;
        this.tokens = capacity;                  // start full
        this.lastRefill = nanoClock.getAsLong();
    }

    synchronized boolean tryAcquire() {
        long now = clock.getAsLong();
        tokens = Math.min(capacity, tokens + (now - lastRefill) * refillPerNano);   // lazy refill
        lastRefill = now;
        if (tokens >= 1) { tokens -= 1; return true; }
        return false;
    }

    public static void main(String[] args) {
        long[] now = {0};                                       // fake clock in nanoseconds
        TokenBucket bucket = new TokenBucket(3, 1.0, () -> now[0]);   // burst 3, 1 token/sec
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) sb.append(bucket.tryAcquire() ? 'Y' : 'N');   // burst at t=0
        now[0] += 2_000_000_000L;                               // 2 seconds later → 2 tokens back
        sb.append(' ');
        for (int i = 0; i < 3; i++) sb.append(bucket.tryAcquire() ? 'Y' : 'N');
        System.out.println(sb);
    }
}
```

```text
YYYNN YYN
```

### Database schema
```
 rate_limit_rule(rule_id PK, key_type ENUM(API_KEY,USER,IP,CARD), endpoint_pattern,
                 limit_count INT, window_sec INT, burst INT, tier, enabled, updated_at)
 Redis keys (per limited key):  rl:{ruleId}:{key}  →  hash {tokens, lastRefillMs}   TTL = 2 × window
```

### Cache
- Rules: cached in gateway memory (refresh every few seconds / on change event).
- Counters: Redis *is* the cache; optionally a small **local** pre-check for very hot keys (accept small inaccuracy).

### Queue
- Not on the hot path. Blocked-request events → Kafka → analytics / abuse detection / alerting (async, so the limiter stays fast).

### Scaling
- Redis cluster sharded by key (`rl:{ruleId}:{key}` hashes to one shard → atomic per key).
- One Redis round trip per request: do refill + consume in a **Lua script** (atomic, single call).
- Gateway nodes scale horizontally; they share only Redis.

### Load balancing
- Any node can serve any request because state is in Redis — plain round robin / least connections at the LB.
- (Alternative with sticky routing by key → local counters, no Redis, but uneven load and state lost on node restart.)

### Failure handling
- Redis slow/down → **fail-open** for normal reads (don't take the site down with the limiter), **fail-closed** for sensitive actions (login, payment attempts).
- Timeouts of a few ms on Redis calls; circuit breaker around it.
- Clock issues: compute time on Redis (`TIME`) inside the Lua script, not on each gateway.

### Consistency
- Per-key atomicity via Lua/`INCR`; across replicas a small over-admit during failover is acceptable (rate limiting is a protection, not accounting).
- Multi-region: per-region limits (limit/N each) or async-synced global counters — exact global limits cost latency.

### Concurrency
- Two gateway nodes updating the same bucket at once → the Lua script makes read-refill-consume one atomic step. (In the Java class above, `synchronized` does the same for one JVM.)

### Security
- Key choice matters: IP-only limits hurt users behind NAT and are dodged by botnets (DDoS) → combine API key/user/card + IP; add a global limit and WAF/CDN protection in front.
- Don't leak internal rule details in errors; protect the admin API.

### Monitoring
- Allowed vs blocked per rule/client, Redis latency/errors, top blocked keys, fail-open events. Alert on sudden block spikes (attack or a bad rule).

### Trade-offs
- Token bucket (bursty, cheap) vs sliding log (exact, memory-heavy).
- Central Redis (accurate) vs local counters (fast, approximate).
- Fail-open (availability) vs fail-closed (safety).

### What a Visa interviewer might ask next
1. "What's a DDoS attack and how do you stop it?" (asked to the EC candidate) — edge/CDN + WAF, per-key limits, global limits, autoscaling.
2. "The same user hits two servers — how is the limit shared?" → Redis + atomic script.
3. "Rate-limit by **card** for payment attempts — why?" → card-testing fraud (bots try many card numbers).
4. "What happens if Redis fails?" → fail-open vs fail-closed per endpoint.
5. "Your log file is 20 GB — find abusive IPs offline" → streaming / external sort ([DSA 8/8](../03-dsa/08-file-and-log-processing.md)).

**🗣️ Interview mein aise bolo**: "Main token bucket lunga kyunki woh controlled burst allow karta hai aur state sirf do numbers hai. Counter Redis mein, refill+consume ek Lua script mein — atomic. Redis down ho toh normal APIs fail-open, payment APIs fail-closed."

Next: [SD 2 — Payment service →](02-payment-service.md)
