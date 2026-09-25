# Java 2/5 — Collections & HashMap Internals

**Easy analogy — HashMap = post office sorting racks**: Har letter ka **pin code** (hash) dekh ke usse sahi **rack** (bucket) mein daalte ho. Do letters ka rack same ho gaya (collision) toh rack mein ek **line** ban jaati hai (linked list); line bahut lambi ho jaaye toh usse **sorted register** (red-black tree) bana dete ho taaki dhoondhna fast ho. Racks bhar gaye (75%) toh **double racks** laga ke saare letters dobara sort (resize/rehash).

| Topic | Visa reports | Freq |
|---|---|---|
| HashMap internals (hashing, collisions, Java 8 trees, resize) | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**), [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/), [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) | **HIGH** (6) |
| `equals()` / `hashCode()` contract | [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) | **HIGH** (3) |
| Array vs LinkedList (ArrayList vs LinkedList) | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) (**EC**), [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/), [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/) | **HIGH** (3) |
| Map types you know (HashMap, TreeMap, LinkedHashMap, ConcurrentHashMap) | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**), [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) | MEDIUM |
| HashMap vs ConcurrentHashMap | [LC-7535007](https://leetcode.com/discuss/post/7535007/visa-senior-sde-interview-by-anonymous_u-xonj/), [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/) | MEDIUM (senior) |
| Comparable vs Comparator (+ lambda) | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**) | LOW |
| Fail-fast vs fail-safe iterators · initial size of HashMap | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) | LOW (senior) |

---

## 1. Collections map + ArrayList vs LinkedList vs array (HIGH)

```
 Collection
 ├── List   (ordered, duplicates)    ArrayList · LinkedList · CopyOnWriteArrayList
 ├── Set    (no duplicates)          HashSet · LinkedHashSet · TreeSet
 └── Queue  (FIFO / priority)        ArrayDeque · PriorityQueue · LinkedList
 Map (key → value, not a Collection) HashMap · LinkedHashMap · TreeMap · ConcurrentHashMap
```

| Operation | array | ArrayList | LinkedList |
|---|---|---|---|
| get(i) | O(1) | O(1) | O(n) — walk the nodes |
| add at end | fixed size | O(1) amortised (grows ~1.5×) | O(1) |
| add/remove in the middle | O(n) shift | O(n) shift | O(1) **once you're at the node** (finding it is O(n)) |
| memory | smallest | array + spare capacity | a node object per element (2 extra references) |
| cache friendliness | best | good (contiguous) | poor (nodes scattered) |

**Interview answer**: "Array/ArrayList give O(1) random access and are cache-friendly; LinkedList only wins when I already hold the node and insert/remove a lot at the ends or middle. In practice I default to ArrayList, and ArrayDeque for queues/stacks."
**Trap**: "LinkedList insertion is O(1)" — only after you've found the position.

---

## 2. HashMap internals (HIGH)

**`put(key, value)` step by step**

```
 1. h = key.hashCode()                       null key → hash 0 → bucket 0 (one null key allowed)
 2. h = h ^ (h >>> 16)                       "spread": mix high bits into low bits
 3. index = h & (capacity - 1)               capacity is a power of two (16, 32, …) → cheap modulo
 4. bucket empty?  → put a new node
    else walk the bucket: same hash AND equals()? → replace value
                          otherwise           → append (linked list) / insert (tree)
 5. bucket length ≥ 8 AND capacity ≥ 64  → TREEIFY the bucket into a red-black tree
    (capacity < 64 → resize instead; a tree shrinks back to a list at ≤ 6 nodes)
 6. size > capacity × 0.75 (load factor)  → RESIZE: capacity × 2, nodes split into
                                           "stay at i" or "move to i + oldCapacity"
```

| | Average | Worst (all keys collide) |
|---|---|---|
| get / put before Java 8 | O(1) | O(n) — one long linked list |
| get / put Java 8+ | O(1) | **O(log n)** — the bucket becomes a red-black tree |

This is exactly the follow-up chain an SDE-1 got ([LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/)): *"TC of chaining insert?"* → O(m) for m colliding entries → *"how would you improve it?"* → the interviewer hinted "ordering & trees" → **Java 8 converts long buckets into balanced (red-black) trees**, so lookups become O(log m). (The candidate said AVL; Java uses red-black, which is also balanced.)

```java
import java.util.List;

class BucketDemo {
    static int spread(Object key) {                       // same mixing HashMap uses
        int h = key.hashCode();
        return h ^ (h >>> 16);
    }

    public static void main(String[] args) {
        int capacity = 16;
        for (String key : List.of("visa", "upi", "card", "Aa", "BB")) {
            System.out.println(key + " → hashCode " + key.hashCode() + " → bucket " + (spread(key) & (capacity - 1)));
        }
    }
}
```

```text
visa → hashCode 3619905 → bucket 6
upi → hashCode 116014 → bucket 15
card → hashCode 3046160 → bucket 14
Aa → hashCode 2112 → bucket 0
BB → hashCode 2112 → bucket 0
```

`"Aa"` and `"BB"` have the **same** `hashCode` (2112) → same bucket → `equals()` decides they are different keys. That's a real collision.

**Capacity questions** ("initial size of HashMap and how it changes", [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/))
- Default capacity **16**, load factor **0.75** → first resize after the **13th** entry.
- `new HashMap<>(100)` → capacity rounded up to **128** (power of two).
- Expecting N entries and want zero resizes: `HashMap.newHashMap(N)` (Java 19+) or `new HashMap<>((int) (N / 0.75f) + 1)`.

**Interview answer**: "HashMap is an array of buckets. The key's hashCode is spread and masked with capacity−1 to find the bucket; collisions are chained, and since Java 8 a bucket with more than 8 entries becomes a red-black tree when the table has at least 64 buckets, so the worst case is O(log n). When size crosses 75% of capacity the table doubles and entries are redistributed. equals() decides key equality inside a bucket."
**Follow-ups**: why power-of-two capacity? (`&` instead of `%`) · why load factor 0.75? (time/space trade-off) · is HashMap thread-safe? (no — concurrent `put` can lose updates or corrupt structure → use ConcurrentHashMap) · HashSet internals (a HashMap with a dummy value) · why are `String`/`Integer` good keys? (immutable + good `hashCode`).

---

## 3. `equals()` and `hashCode()` contract (HIGH)

**The contract**
1. `a.equals(b)` ⇒ `a.hashCode() == b.hashCode()` (the reverse is **not** required — collisions are allowed).
2. Consistent: same result while the fields used don't change.
3. `equals` is reflexive, symmetric, transitive, and `x.equals(null)` is false.

**When to override** ([LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/)): whenever two different objects should count as "the same" — value objects used as **HashMap keys / HashSet elements** (card number, (merchantId, date) pairs). Override **both**, using the **same fields**.

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

class MerchantDay {                                          // correct value-object key
    private final String merchantId;
    private final String date;

    MerchantDay(String merchantId, String date) { this.merchantId = merchantId; this.date = date; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MerchantDay)) return false;
        MerchantDay other = (MerchantDay) o;
        return merchantId.equals(other.merchantId) && date.equals(other.date);
    }

    @Override public int hashCode() { return Objects.hash(merchantId, date); }
}

class BrokenKey {                                            // equals WITHOUT hashCode
    private final String id;
    BrokenKey(String id) { this.id = id; }
    @Override public boolean equals(Object o) { return o instanceof BrokenKey && ((BrokenKey) o).id.equals(id); }
}

class MutableKey {
    String id;
    MutableKey(String id) { this.id = id; }
    @Override public boolean equals(Object o) { return o instanceof MutableKey && ((MutableKey) o).id.equals(id); }
    @Override public int hashCode() { return id.hashCode(); }
}

class HashContractDemo {
    public static void main(String[] args) {
        Map<MerchantDay, Long> good = new HashMap<>();
        good.put(new MerchantDay("m1", "2026-09-25"), 500L);
        System.out.println("good key found: " + good.get(new MerchantDay("m1", "2026-09-25")));

        Map<BrokenKey, Long> broken = new HashMap<>();
        broken.put(new BrokenKey("m1"), 500L);
        System.out.println("broken key found: " + broken.get(new BrokenKey("m1")));   // different hashCode

        Map<MutableKey, Long> mutable = new HashMap<>();
        MutableKey k = new MutableKey("m1");
        mutable.put(k, 500L);
        k.id = "m2";                                          // hash changed after insertion
        System.out.println("mutated key found: " + mutable.get(k) + ", size = " + mutable.size());
    }
}
```

```text
good key found: 500
broken key found: null
mutated key found: null, size = 1
```

**Interview answer**: "Equal objects must have equal hash codes, otherwise HashMap looks in the wrong bucket and never even calls equals — the 'broken key' case. Keys should also be immutable; if a key's fields change after insertion, its bucket is wrong and the entry is effectively lost."
**Traps**: overriding `equals(MerchantDay other)` (overload, not override — use `Object`) · using mutable fields in `hashCode` · forgetting `@Override`.

---

## 4. Map types + HashMap vs ConcurrentHashMap (MEDIUM)

| Map | Order | Null key? | Thread-safe? | Use for |
|---|---|---|---|---|
| `HashMap` | none | 1 allowed | no | default |
| `LinkedHashMap` | insertion (or access order) | yes | no | predictable iteration, **LRU cache** |
| `TreeMap` | sorted by key (red-black tree, O(log n)) | no | no | ranges, floor/ceiling, sorted reports |
| `Hashtable` | none | no | yes (every method `synchronized`) | legacy — avoid |
| `Collections.synchronizedMap` | wraps a map | depends | yes (one lock) | simple, low contention |
| `ConcurrentHashMap` | none | **no** (null key/value not allowed) | yes, fine-grained | shared caches, counters |

**How ConcurrentHashMap stays fast (Java 8+)**: reads are lock-free (`volatile` reads). A write to an **empty** bucket uses **CAS**; a write to a non-empty bucket locks **only that bucket's head node**. So threads writing to different buckets don't block each other. `compute`, `merge`, `putIfAbsent` are **atomic per key**. Iterators are weakly consistent (no `ConcurrentModificationException`). Java 7 used 16 "segments" instead — mention only if asked.

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

class ConcurrentCounter {
    public static void main(String[] args) throws InterruptedException {
        Map<String, Integer> hits = new ConcurrentHashMap<>();
        Runnable work = () -> { for (int i = 0; i < 10_000; i++) hits.merge("merchant-42", 1, Integer::sum); };
        Thread[] threads = new Thread[4];
        for (int i = 0; i < threads.length; i++) { threads[i] = new Thread(work); threads[i].start(); }
        for (Thread t : threads) t.join();
        System.out.println(hits.get("merchant-42"));        // always 40000: merge is atomic per key
    }
}
```

```text
40000
```

With a plain `HashMap` and `put(get() + 1)` the result would be **less than 40000** (lost updates) — and the map can even get corrupted.
**Interview answer**: "HashMap isn't thread-safe. Hashtable/synchronizedMap lock the whole map. ConcurrentHashMap locks per bucket with CAS for empty buckets, keeps reads lock-free, gives atomic compute/merge, and doesn't allow nulls because `get()` returning null would be ambiguous."
**Trap**: `if (!map.containsKey(k)) map.put(k, v)` on a ConcurrentHashMap is **still a race** (check-then-act) → use `putIfAbsent` / `computeIfAbsent`.

---

## 5. Fail-fast vs fail-safe iterators (LOW)

```java
import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

class FailFastDemo {
    public static void main(String[] args) {
        List<String> txns = new ArrayList<>(List.of("t1", "t2", "t3", "t4"));
        try {
            for (String t : txns) if (t.equals("t1")) txns.remove(t);     // modify while iterating
        } catch (ConcurrentModificationException e) {
            System.out.println("fail-fast: ConcurrentModificationException");
        }
        System.out.println("list now: " + txns);

        Iterator<String> it = txns.iterator();                           // the safe way
        while (it.hasNext()) if (it.next().equals("t3")) it.remove();
        System.out.println("after iterator.remove: " + txns);

        List<String> cow = new CopyOnWriteArrayList<>(List.of("a", "b"));
        for (String s : cow) cow.add(s + "!");                           // fail-safe: iterates a snapshot
        System.out.println("copy-on-write: " + cow);
    }
}
```

```text
fail-fast: ConcurrentModificationException
list now: [t2, t3, t4]
after iterator.remove: [t2, t4]
copy-on-write: [a, b, a!, b!]
```

**Interview answer**: "Fail-fast iterators (ArrayList, HashMap) track a `modCount` and throw `ConcurrentModificationException` if the collection is structurally changed outside the iterator. Fail-safe ones (CopyOnWriteArrayList, ConcurrentHashMap) iterate a snapshot or are weakly consistent, so they don't throw. To remove while iterating, use `iterator.remove()` or `removeIf`."
**Trap**: fail-fast is **best-effort**, not guaranteed — removing the second-to-last element can silently end the loop instead of throwing.

---

## 6. Comparable vs Comparator (+ lambda) (LOW)

| | `Comparable<T>` | `Comparator<T>` |
|---|---|---|
| Where | inside the class: `compareTo(T other)` | separate object/lambda: `compare(a, b)` |
| How many | one **natural** order | as many orders as you want |
| Used by | `Collections.sort(list)`, `TreeMap` keys | `list.sort(cmp)`, `new TreeMap<>(cmp)`, streams |

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Txn implements Comparable<Txn> {
    final String id;
    final long amount;
    final long time;

    Txn(String id, long amount, long time) { this.id = id; this.amount = amount; this.time = time; }

    @Override public int compareTo(Txn other) { return Long.compare(time, other.time); }   // natural: by time

    @Override public String toString() { return id; }

    public static void main(String[] args) {
        List<Txn> list = new ArrayList<>(List.of(new Txn("A", 500, 3), new Txn("B", 900, 1), new Txn("C", 500, 2)));
        list.sort(null);                                                   // natural order (Comparable)
        System.out.println("by time: " + list);
        list.sort(Comparator.comparingLong((Txn t) -> t.amount).reversed()
                .thenComparing(t -> t.id));                               // custom order (Comparator)
        System.out.println("by amount desc, then id: " + list);
    }
}
```

```text
by time: [B, C, A]
by amount desc, then id: [B, A, C]
```

**Trap**: `return a.amount - b.amount;` in a comparator — **overflows** for large values; use `Long.compare` / `Integer.compare`.

---

⚡ **Quick revision**: bucket = `(h ^ h>>>16) & (n−1)` · collisions → list → tree at 8 (if capacity ≥ 64) · resize at 0.75 → double · equal objects ⇒ equal hash codes · immutable keys · ConcurrentHashMap = CAS + per-bucket lock, no nulls, atomic merge · iterator.remove() to delete while looping · Comparable = natural order, Comparator = any order.

Next: [Java 3/5 — Strings, exceptions, JVM & GC →](03-strings-exceptions-jvm-gc.md)
