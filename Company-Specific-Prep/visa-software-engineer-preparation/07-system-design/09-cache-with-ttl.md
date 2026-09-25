# SD 9 — Cache with TTL (a caching layer for a payments backend)

> **Visa evidence**: "write code for a custom cache… then tweaked the question" ([LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/), Senior) · "**caching and replacement techniques**; LRU cache design with pseudocode and complexity" ([GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), new grad, selected) · "possible optimizations, including **caching strategies**, Kafka integration and database improvements" for your own architecture ([LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/), **SWE-I, 1.5 YOE**) · "scenario-based questions to reduce latency in cache" ([LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/), Staff). Frequency: **HIGH** (caching as a topic). The in-process **LRU + TTL implementation** (code) is in [08-lld/01](../08-lld/01-custom-cache-lru-ttl.md).

**Easy analogy — kitchen ka fridge**: Roz ka doodh-dahi (hot data) fridge mein (cache), baaki godown mein (DB). Har cheez pe **expiry date** (TTL). Fridge bhar gaya toh sabse purani/kam use hone wali cheez nikaalo (**eviction: LRU/LFU**). Godown mein maal badla toh fridge wala purana maal phenko (**invalidation**).

### Requirements (clarify first)
- What is cached? e.g. merchant configuration, BIN → card-type lookups, FX rates, product/menu data, session tokens.
- How stale may data be? (seconds for FX, minutes for menus; **never** stale for balances used in decisions)
- Read/write ratio, data size, latency target (e.g. p99 < 5 ms vs DB 30 ms).

### Functional Requirements
- `get(key)`, `put(key, value, ttl)`, `delete(key)`; entries expire after their TTL.
- Evict when memory is full (LRU/LFU); invalidate when the source changes.

### Non-functional Requirements
- Sub-millisecond to few-ms reads; high hit ratio (> 90% for hot data).
- Horizontally scalable; losing a cache node must **not** lose data (DB is the source of truth).

### APIs
```
 library/service:  Optional<V> get(K key);  void put(K key, V value, Duration ttl);  void invalidate(K key)
 Redis equivalents: GET k · SET k v EX 300 · DEL k · SET k v NX PX 30000 (locks)
```

### High-level architecture
```
 service instances (small local L1 cache, e.g. Caffeine, TTL 5–30 s)
        │ miss
        ▼
 Redis cluster (L2, shared)  ── consistent hashing / hash slots across shards, each shard has a replica
        │ miss
        ▼
 Database (source of truth) ── on update → publish "config-changed" event → evict L1/L2 keys
```

**Caching strategies**

| Strategy | Read path | Write path | Use when |
|---|---|---|---|
| **Cache-aside** (lazy) | app checks cache → miss → DB → put in cache | write DB, then **delete** cache key | default choice |
| Read-through | cache library loads from DB on miss | — | cleaner code, library support |
| Write-through | — | write cache and DB together | reads must see writes immediately |
| Write-behind | — | write cache, DB later (async) | extreme write speed, risk of loss |

### Components
- **L1 local cache** per instance (fastest, tiny, short TTL).
- **L2 distributed cache** (Redis cluster) shared by all instances.
- **Invalidation publisher** (on DB change → event → delete keys).
- **Loader** with single-flight protection (see concurrency).

### Database schema
```
 (the cache stores copies of existing tables)
 key naming:  merchant:cfg:{merchantId}:v{schemaVersion}     value: JSON      TTL: 300 s ± jitter
 versioned keys let you roll out a new value format without flushing everything
```

### Cache
**Eviction policies**: **LRU** (least recently used — good default), **LFU** (least frequently used — better for stable "popular" items), FIFO, random, TTL-based expiry. Redis offers `allkeys-lru`, `allkeys-lfu`, `volatile-ttl`, etc.

**Three classic failure modes and fixes**

| Problem | What happens | Fix |
|---|---|---|
| **Stampede / breakdown** | a hot key expires → thousands of requests hit the DB together | single-flight lock (`SET NX`), early refresh before expiry, serve stale while revalidating |
| **Avalanche** | many keys expire at the same moment (same TTL) | add random **jitter** to TTLs; warm up gradually |
| **Penetration** | requests for keys that don't exist always miss → DB | cache "not found" briefly (negative caching), Bloom filter, input validation |

### Queue
- Invalidation events via Kafka/Redis pub-sub (`merchant-config-changed`) so every instance drops its L1 copy.

### Scaling
- Shard keys across nodes with **consistent hashing** (Redis Cluster uses 16,384 hash slots) — adding a node moves only ~1/N of keys:

```java
import java.nio.charset.StandardCharsets;
import java.util.SortedMap;
import java.util.TreeMap;

class ConsistentHashRing {
    private final TreeMap<Long, String> ring = new TreeMap<>();
    private final int virtualNodes;

    ConsistentHashRing(int virtualNodes) { this.virtualNodes = virtualNodes; }

    static long fnv1a(String s) {                               // stable 32-bit hash (same on every JVM)
        long h = 0x811c9dc5L;
        for (byte b : s.getBytes(StandardCharsets.UTF_8)) { h ^= (b & 0xff); h = (h * 0x01000193L) & 0xffffffffL; }
        return h;
    }

    void addNode(String node) { for (int i = 0; i < virtualNodes; i++) ring.put(fnv1a(node + "#" + i), node); }
    void removeNode(String node) { for (int i = 0; i < virtualNodes; i++) ring.remove(fnv1a(node + "#" + i)); }

    String nodeFor(String key) {
        SortedMap<Long, String> tail = ring.tailMap(fnv1a(key));        // first node clockwise
        return tail.isEmpty() ? ring.firstEntry().getValue() : tail.get(tail.firstKey());
    }

    public static void main(String[] args) {
        ConsistentHashRing ring = new ConsistentHashRing(200);
        for (String n : new String[]{"cache-1", "cache-2", "cache-3"}) ring.addNode(n);
        int keys = 100_000, moved = 0;
        String[] before = new String[keys];
        for (int k = 0; k < keys; k++) before[k] = ring.nodeFor("merchant:" + k);
        ring.addNode("cache-4");
        for (int k = 0; k < keys; k++) if (!ring.nodeFor("merchant:" + k).equals(before[k])) moved++;
        System.out.printf("keys moved after adding a 4th node: %.1f%% (ideal 25%%; mod-N hashing would move ~75%%)%n", 100.0 * moved / keys);
    }
}
```

```text
keys moved after adding a 4th node: 19.5% (ideal 25%; mod-N hashing would move ~75%)
```

(With `hash % N`, going from 3 to 4 nodes remaps every key except those where `h mod 3 == h mod 4` — about 75% of keys → a cache-wide miss storm. Virtual nodes smooth the distribution.)
- **Hot keys** (one merchant during a sale): replicate the key to several shards (`key#1..#k`), keep it in L1, or pre-compute.

### Load balancing
- Clients route by key (hash slot) — no central LB for Redis Cluster; replicas can serve reads (possibly slightly stale).

### Failure handling
- Cache node down → requests fall through to the DB (protect the DB with rate limits / circuit breaker) while a replica is promoted.
- Never treat the cache as the only copy (unless it's a deliberately ephemeral store like sessions with re-login fallback).

### Consistency
- Cache-aside + delete-on-write gives **eventual** consistency; a small race exists (reader loads old value after the writer deleted) → keep TTLs short or use versioned values.
- Don't cache data whose staleness causes wrong money decisions; for such reads go to the DB (or use write-through with care).

### Concurrency
- **Single-flight**: only one request loads a missing key; others wait or serve stale (`SET lock:key NX PX 3000` in Redis, or a per-key future in-process).
- Atomic counters/updates in Redis (`INCR`, Lua) instead of get-modify-set.

### Security
- Don't cache sensitive data unnecessarily (card numbers, PII) — or encrypt it and set short TTLs; Redis AUTH/ACLs + TLS; separate cache namespaces per tenant.

### Monitoring
- Hit ratio (overall and per key prefix), latency, evictions/sec, memory usage, hot keys, DB load after cache misses. A falling hit ratio is an early warning.

### Trade-offs
- Freshness vs speed (TTL length); L1 (fastest, inconsistent across nodes) vs L2 (shared, a network hop); LRU vs LFU; memory cost vs DB cost.

### What a Visa interviewer might ask next
1. "Implement an LRU cache with TTL" → [08-lld/01](../08-lld/01-custom-cache-lru-ttl.md) (HashMap + doubly linked list; O(1)).
2. "How do you keep the cache consistent with the DB?" → cache-aside + delete on write + TTL + events.
3. "A hot key expires and the DB melts" → stampede protection.
4. "Which data would you NOT cache in a payments system?" → balances/limits used for authorization decisions (or cache with strict invalidation).
5. "Reduce latency further" (Staff scenario) → L1 cache, pre-warming, batching, keeping connections warm, moving computation closer (edge).

**🗣️ Interview mein aise bolo**: "Default cache-aside: read pe miss hua toh DB se laake cache mein daalo, write pe DB update karke cache key delete. TTL mein thoda random jitter taaki sab ek saath expire na hon, hot key ke liye single-flight lock. Cache sirf copy hai — source of truth DB hi rahega."

Next: [SD 10 — Large-scale transaction processing →](10-transaction-processing-system.md)
