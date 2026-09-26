# LLD 1 — Custom Cache (LRU + TTL)

> **Visa evidence**: "write code for a custom cache… then tweaked the question" ([LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/), Senior) · "LRU cache implementation" ([LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), Senior) · "Design LRU cache" in an HM round ([LC-1510140](https://leetcode.com/discuss/post/1510140/visa-sse-4-yr-blr-by-user7518i-xrn3/)) · "LRU cache design — pseudocode, time/space complexity" ([GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), **new grad, selected**) · "very similar to LRU Cache" in a US SDE-1 OA ([LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/)). Frequency: **HIGH**. Caching as a system: [SD 9](../07-system-design/09-cache-with-ttl.md).

**Easy analogy — steel almirah with limited shelves**: Jo cheez abhi use ki, sabse aage rakho. Jagah khatam? Sabse peeche wali (sabse purani use) nikaalo. Har cheez pe expiry sticker (TTL) — expire ho gayi toh use mat karo.

## Requirements
- `get(key)` and `put(key, value)` in **O(1)**.
- Fixed capacity → evict the **least recently used** entry.
- Each entry expires after a TTL ("the tweak" interviewers like to add).
- Thread-safe enough for a service (at least `synchronized`).

## Design

```
 HashMap<K, Node>  ── O(1) lookup ──►  doubly linked list (most recent at head)
   head ⇄ [c] ⇄ [a] ⇄ [b] ⇄ tail        get(a) → move a to head
                                        put(new) when full → remove tail.prev (b)
 Node = {key, value, expiresAt, prev, next}      expired on read → remove, return null
```

Why both structures: the map finds a node in O(1); the list moves/removes a node in O(1) (it knows its neighbours). `LinkedHashMap(accessOrder = true)` + `removeEldestEntry` does the same in 10 lines — mention it, but interviewers usually want the manual version.

## Code

```java
import java.util.HashMap;
import java.util.Map;
import java.util.function.LongSupplier;

class LruTtlCache<K, V> {
    private final class Node {
        K key; V value; long expiresAt;
        Node prev, next;
    }

    private final int capacity;
    private final long ttlMs;
    private final LongSupplier clockMs;                       // injectable → testable
    private final Map<K, Node> map = new HashMap<>();
    private final Node head = new Node(), tail = new Node();  // sentinels, no null checks

    LruTtlCache(int capacity, long ttlMs, LongSupplier clockMs) {
        this.capacity = capacity; this.ttlMs = ttlMs; this.clockMs = clockMs;
        head.next = tail; tail.prev = head;
    }

    synchronized V get(K key) {
        Node n = map.get(key);
        if (n == null) return null;
        if (clockMs.getAsLong() >= n.expiresAt) { unlink(n); map.remove(key); return null; }   // lazy expiry
        unlink(n); addFront(n);                               // now most recently used
        return n.value;
    }

    synchronized void put(K key, V value) {
        Node n = map.get(key);
        if (n != null) unlink(n);
        else {
            n = new Node();
            n.key = key;
            map.put(key, n);
            if (map.size() > capacity) {                      // evict least recently used
                Node lru = tail.prev;
                unlink(lru);
                map.remove(lru.key);
            }
        }
        n.value = value;
        n.expiresAt = clockMs.getAsLong() + ttlMs;
        addFront(n);
    }

    synchronized int size() { return map.size(); }

    private void unlink(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFront(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }

    public static void main(String[] args) {
        long[] now = {0};
        LruTtlCache<String, Integer> cache = new LruTtlCache<>(2, 1_000, () -> now[0]);
        cache.put("a", 1);
        cache.put("b", 2);
        System.out.println("get a = " + cache.get("a"));     // a becomes most recent
        cache.put("c", 3);                                   // full → evicts b (least recent)
        System.out.println("get b = " + cache.get("b"));
        System.out.println("get c = " + cache.get("c"));
        now[0] = 1_500;                                      // 1.5 s later → a and c expired
        System.out.println("after 1.5s get a = " + cache.get("a") + ", size = " + cache.size());
    }
}
```

```text
get a = 1
get b = null
get c = 3
after 1.5s get a = null, size = 1
```

**Complexity**: `get`/`put` O(1); space O(capacity).

## Concurrency
- `synchronized` methods are correct but serialize all access. For high concurrency: segment the cache (N smaller caches by `hash(key) % N`), or use a library (Caffeine) that uses lock-free structures.
- Expired entries only disappear when touched (lazy); add a background sweeper if memory matters.

## Follow-ups
1. "LFU instead of LRU?" → frequency map + list per frequency (O(1) LFU) — mention the idea.
2. "Make eviction pluggable" → `EvictionPolicy` interface (Strategy pattern).
3. "Distributed cache?" → [SD 9](../07-system-design/09-cache-with-ttl.md) (Redis, consistent hashing).
4. "Why a doubly linked list, not singly?" → removing a node needs its previous node in O(1).

**🗣️ Interview mein aise bolo**: "HashMap se O(1) mein node milta hai, doubly linked list se O(1) mein usko aage laata ya hataata hoon. Capacity cross hui toh tail wala (least recent) nikaal do. TTL ke liye har node pe expiry time, read pe check."

Next: [LLD 2 — Notification service (factory + strategy) →](02-notification-service-factory-strategy.md)
