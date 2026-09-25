# SD 3 — Unique Transaction ID Generator

> **Visa evidence**: "HLD for payment service like PhonePe, **generating unique transaction id for each transaction**" ([LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), 2021, Senior). A Staff candidate also used "a globally unique id per notification event" for idempotency ([LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/)). Frequency: **LOW** as a standalone question, but it's the classic deep-dive inside any payments design. Generic note: [HLD distributed ID generator](../../../HLD/02-problems/09-distributed-id-generator.md).

**Easy analogy — railway PNR number**: Har ticket ka PNR unique hona chahiye, chahe Delhi counter ho ya Chennai — aur counters ko har PNR ke liye headquarters ko phone nahi karna chahiye. Toh har counter ko apna **code** mil jaata hai, aur woh **time + counter code + apna sequence** jod ke PNR bana leta hai.

### Requirements (clarify first)
- Unique across **all services, data centres and time** — no collisions, ever.
- Numeric 64-bit (fits a `BIGINT`) or string? Sortable by time? Human-readable reference needed separately?
- Throughput: e.g. 100k IDs/sec across the fleet; generation must not need a network call.
- Must IDs be unpredictable (security) or just unique?

### Functional Requirements
- `nextId()` returns a unique ID quickly; IDs roughly increase with time (good for DB indexes, debugging).
- Decode an ID into (timestamp, datacenter, worker) for debugging.

### Non-functional Requirements
- No single point of failure (no central counter on the hot path).
- Very low latency (in-process), high throughput, survives restarts without reusing IDs.

### APIs
```
 in-process library:   long nextId()
 optional service:     GET /ids?count=100  → [ … ]        (for clients that can't embed the library)
 user-facing reference: "VP" + base36(id) or a date-prefixed code — separate from the internal id
```

### High-level architecture
```
 64-bit Snowflake-style layout
 ┌─┬──────────────────────────────────────────┬───────┬───────┬────────────┐
 │0│ 41 bits: milliseconds since custom epoch │ 5 bits│ 5 bits│ 12 bits    │
 │ │ (~69 years)                              │  DC   │ worker│ sequence   │
 └─┴──────────────────────────────────────────┴───────┴───────┴────────────┘
   sign                                         32 DCs × 32 workers, 4096 ids per ms per worker
 worker ids assigned at startup (config / Kubernetes ordinal / ZooKeeper lease) — must be unique per DC
```

### Components
- **Generator library** inside each service instance (no network hop).
- **Worker-id assignment**: static config per pod, or a lease from a coordinator (ZooKeeper/etcd/DB table) so two live instances never share an id.
- **Clock discipline**: NTP; detect clocks moving backwards.

```java
import java.util.function.LongSupplier;

class SnowflakeId {
    static final long EPOCH = 1_735_689_600_000L;       // 2025-01-01T00:00:00Z (custom epoch)
    static final int DC_BITS = 5, WORKER_BITS = 5, SEQ_BITS = 12;
    static final long MAX_SEQ = (1L << SEQ_BITS) - 1;

    private final long dc, worker;
    private final LongSupplier clockMs;
    private long lastMs = -1, seq = 0;

    SnowflakeId(long dc, long worker, LongSupplier clockMs) {
        if (dc < 0 || dc >= (1 << DC_BITS) || worker < 0 || worker >= (1 << WORKER_BITS))
            throw new IllegalArgumentException("dc/worker out of range");
        this.dc = dc; this.worker = worker; this.clockMs = clockMs;
    }

    synchronized long nextId() {
        long now = clockMs.getAsLong();
        if (now < lastMs) throw new IllegalStateException("clock moved backwards by " + (lastMs - now) + " ms");
        if (now == lastMs) {
            seq = (seq + 1) & MAX_SEQ;
            if (seq == 0) {                               // 4096 ids used this ms → wait for the next ms
                while ((now = clockMs.getAsLong()) <= lastMs) { Thread.onSpinWait(); }
            }
        } else {
            seq = 0;
        }
        lastMs = now;
        return ((now - EPOCH) << (DC_BITS + WORKER_BITS + SEQ_BITS)) | (dc << (WORKER_BITS + SEQ_BITS))
                | (worker << SEQ_BITS) | seq;
    }

    static String decode(long id) {
        long seq = id & MAX_SEQ;
        long worker = (id >> SEQ_BITS) & ((1 << WORKER_BITS) - 1);
        long dc = (id >> (SEQ_BITS + WORKER_BITS)) & ((1 << DC_BITS) - 1);
        long ms = (id >> (SEQ_BITS + WORKER_BITS + DC_BITS)) + EPOCH;
        return "ms=" + ms + " dc=" + dc + " worker=" + worker + " seq=" + seq;
    }

    public static void main(String[] args) {
        long[] now = {1_758_758_400_000L};                  // a fixed test time (2025-09-25T00:00Z)
        SnowflakeId gen = new SnowflakeId(3, 7, () -> now[0]);
        long a = gen.nextId(), b = gen.nextId();
        now[0] += 1;
        long c = gen.nextId();
        System.out.println(decode(a));
        System.out.println(decode(b));
        System.out.println(decode(c));
        System.out.println("sorted by time: " + (a < b && b < c));
        now[0] -= 5;
        try { gen.nextId(); } catch (IllegalStateException e) { System.out.println(e.getMessage()); }
    }
}
```

```text
ms=1758758400000 dc=3 worker=7 seq=0
ms=1758758400000 dc=3 worker=7 seq=1
ms=1758758400001 dc=3 worker=7 seq=0
sorted by time: true
clock moved backwards by 5 ms
```

### Database schema
```
 worker_lease(worker_key PK "dc3-w7", owner_instance, lease_until)      -- if ids are leased dynamically
 payment(id BIGINT PK  ← snowflake id, reference VARCHAR UNIQUE, …)      -- time-ordered PK = good B-tree locality
```

### Cache
- Not needed — generation is pure CPU. (A "range allocator" alternative caches blocks of IDs: take 1,000 from a DB counter, hand them out locally.)

### Queue
- None on the hot path. IDs are attached to events so consumers can **de-duplicate** by id.

### Scaling
- Linear: every new instance gets a new worker id. 4,096 IDs/ms per worker ≈ 4M/sec/worker theoretical.
- Need more than 1,024 workers? Re-balance bits (fewer sequence bits, more worker bits).

### Load balancing
- Not relevant for the library approach; an ID service would be stateless per worker id behind a load balancer.

### Failure handling
- **Clock goes backwards** (NTP correction): refuse (as above), or wait until the clock catches up, or use a logical clock that never goes back.
- **Duplicate worker id** (two pods with the same config) → collisions: prevent with leases; add a startup check.
- **Restart within the same millisecond**: safe as long as the clock moved forward; otherwise wait 1 ms on startup.

### Consistency
- Uniqueness is guaranteed by construction (unique (dc, worker) + monotonic time + sequence) — no coordination per ID.
- Ordering is **roughly** by time across machines (clock skew), exact within one worker.

### Concurrency
- `synchronized nextId()` per generator; contention is tiny (a few ns). Lock-free CAS versions exist for extreme rates.

### Security
- Snowflake IDs are **predictable** (they reveal time and volume). Don't use them as secrets or in URLs where guessing matters — use random tokens (UUIDv4) for those, or add authorization checks everywhere.

### Monitoring
- Clock-skew alarms, sequence-overflow waits, lease renewal failures, duplicate-id detection in the DB (unique-constraint violations).

### Trade-offs
| Approach | Pros | Cons |
|---|---|---|
| DB auto-increment | trivial | single writer, not multi-DC, reveals counts |
| UUIDv4 (random 128-bit) | no coordination, unguessable | not sortable → B-tree index fragmentation; 16 bytes |
| UUIDv7 (time-ordered UUID) | sortable + no coordination | 128-bit, newer standard |
| Ticket server / range allocation | simple numeric ids | central dependency (mitigate with ranges) |
| **Snowflake-style** | 64-bit, sortable, no network hop | needs unique worker ids + sane clocks |

### What a Visa interviewer might ask next
1. "Two data centres generate IDs at the same millisecond — collision?" → no, DC bits differ.
2. "NTP moves the clock back 20 ms — what now?" → refuse/wait; never reuse.
3. "Customers need a short reference to quote on a support call" → separate human-friendly reference mapped to the internal id.
4. "Why not just UUID?" → size, index locality, sortability vs zero coordination.

**🗣️ Interview mein aise bolo**: "Main Snowflake jaisa 64-bit ID lunga — time + datacenter + worker + sequence. Har instance khud ID banata hai, network call nahi. Unique worker id aur clock peeche jaane ki handling — yahi do cheezein galat hui toh collision."

Next: [SD 4 — Notification system →](04-notification-system.md)
