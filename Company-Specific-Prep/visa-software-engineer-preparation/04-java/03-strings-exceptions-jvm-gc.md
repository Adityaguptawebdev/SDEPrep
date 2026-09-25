# Java 3/5 — Strings · Immutability · Exceptions · JVM Memory · GC

**Easy analogy — JVM memory = a restaurant**: **Stack** = har waiter ka chhota order-pad (har method call ka apna page, kaam khatam → page phaad do, super fast). **Heap** = badi kitchen jahan saara khaana (objects) banta hai, sab waiters share karte hain. **GC** = safai wala jo woh plates uthata hai jinhe koi table use nahi kar rahi (unreachable objects).

| Topic | Visa reports | Freq |
|---|---|---|
| `==` vs `equals()` · String vs StringBuilder | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) (**EC**, 2 YOE) | LOW |
| String pool · `char[]` for passwords · immutable objects | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) (Senior) | LOW |
| Checked vs unchecked exceptions | [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/), [LC-6906343](https://leetcode.com/discuss/post/6906343/visa-sr-data-engineer-javabig-data-inter-ni6l/) | MEDIUM (senior) |
| Heap vs stack memory (with `super()`) | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**, 1 YOE, selected) | LOW |
| JVM architecture, 3 classloaders, GC types, choosing JVM memory | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) (Senior, incl. a written HackerRank question) | LOW |
| Java data types · pointers in Java · Java vs Python | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/) | LOW each |

---

## 1. Strings: immutability, pool, `==` vs `equals`

**Simple explanation**: a `String` object never changes. "Changing" it creates a new object. String **literals** are stored once in the **string pool** (inside the heap) and reused. `==` compares **references** (same object?), `equals()` compares **content**.

```java
class StringDemo {
    public static void main(String[] args) {
        String a = "visa";                        // pooled literal
        String b = "visa";                        // same pooled object
        String c = new String("visa");            // forced new object on the heap
        String d = c.intern();                    // pooled copy of c's content
        System.out.println((a == b) + " " + (a == c) + " " + a.equals(c) + " " + (a == d));

        String s = "pay";
        s.concat("ment");                         // result ignored — s is unchanged
        System.out.println(s);
        s = s.concat("ment");                     // new object, variable re-pointed
        System.out.println(s);
    }
}
```

```text
true false true true
pay
payment
```

**Why immutable?** (a favourite follow-up) — safe to share across threads without locks; safe as HashMap keys (hash never changes; `String` caches its hash); security (a class name / file path / DB URL can't be changed after a check); enables the pool.
**Interview answer**: "`==` checks if two references point to the same object; `equals` checks content. Literals are pooled, `new String()` isn't. Strings are immutable, which makes them thread-safe, cacheable and safe as map keys."
**Trap**: comparing user input with `==` — works in tests with literals, fails in production with runtime strings.

## 2. String vs StringBuilder vs StringBuffer

| | `String` | `StringBuilder` | `StringBuffer` |
|---|---|---|---|
| Mutable | no | yes | yes |
| Thread-safe | yes (immutable) | **no** | yes (`synchronized` methods) |
| Speed for many appends | slow (new object each time) | fastest | slower than Builder (locking) |
| Use | fixed text, keys | building strings in one thread (loops) | legacy / rare shared builder |

```java
class BuilderDemo {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) sb.append(i).append(i < 5 ? "," : "");   // one buffer, grows
        System.out.println(sb.reverse());
    }
}
```

```text
5,4,3,2,1
```

**Interview answer**: "Use String for values, StringBuilder for building text in loops, StringBuffer only if one builder is really shared between threads — which is rare."

## 3. Why `char[]` for passwords? (Senior report)

A `String` password stays in memory (maybe in the pool) until GC runs, and can show up in heap dumps/logs. A `char[]` can be **wiped** right after use (`Arrays.fill(pwd, '\0')`). That's why `JPasswordField.getPassword()` and `Console.readPassword()` return `char[]`.

## 4. Immutable objects — the recipe (Senior report)

1. `final` class (or private constructor + factory) — no subclass can add mutability.
2. All fields `private final`.
3. No setters.
4. **Defensive copies** of mutable inputs (in the constructor) and outputs (in getters).
5. Java 16+: a `record` gives 1–3 for free (still copy mutable components!).

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

final class Settlement {
    private final String merchantId;
    private final long amountPaise;
    private final List<String> txnIds;

    Settlement(String merchantId, long amountPaise, List<String> txnIds) {
        this.merchantId = merchantId;
        this.amountPaise = amountPaise;
        this.txnIds = Collections.unmodifiableList(new ArrayList<>(txnIds));   // defensive copy
    }

    List<String> txnIds() { return txnIds; }                                    // already read-only
    Settlement withAmount(long newAmount) { return new Settlement(merchantId, newAmount, txnIds); }

    public static void main(String[] args) {
        List<String> ids = new ArrayList<>(List.of("t1", "t2"));
        Settlement s = new Settlement("m1", 1000, ids);
        ids.add("t3");                                                         // caller changes its list
        System.out.println(s.txnIds());                                        // settlement unaffected
        try { s.txnIds().add("t4"); } catch (UnsupportedOperationException e) { System.out.println("read-only"); }
        System.out.println(s.withAmount(2000).amountPaise + " vs original " + s.amountPaise);
    }
}

record Money(String currency, long minorUnits) {}                              // immutable data carrier
```

```text
[t1, t2]
read-only
2000 vs original 1000
```

**Interview answer**: "Final class, private final fields, no setters, defensive copies in and out, and 'withX' methods that return a new object. Immutable objects are thread-safe by design — useful for things like money amounts and settlement records."

---

## 5. Exceptions — checked vs unchecked (MEDIUM, senior)

```
 Throwable
 ├── Error                  (JVM problems: OutOfMemoryError, StackOverflowError) — don't catch normally
 └── Exception
     ├── checked            IOException, SQLException, InterruptedException — must catch or declare
     └── RuntimeException   unchecked: NullPointerException, IllegalArgumentException,
                            IllegalStateException, ArithmeticException, IndexOutOfBoundsException
```

| | Checked | Unchecked |
|---|---|---|
| Compiler forces handling? | yes (`try/catch` or `throws`) | no |
| Meaning | recoverable, expected external failure (file missing, network) | programming bug or invalid argument/state |
| Spring `@Transactional` default | **does not roll back** | **rolls back** |

```java
class InsufficientFundsException extends RuntimeException {        // custom, unchecked
    InsufficientFundsException(String msg) { super(msg); }
}

class ExceptionDemo {
    static long withdraw(long balance, long amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        if (amount > balance) throw new InsufficientFundsException("need " + amount + ", have " + balance);
        return balance - amount;
    }

    static String finallyOrder() {
        StringBuilder log = new StringBuilder();
        try {
            log.append("try ");
            throw new IllegalStateException("boom");
        } catch (IllegalStateException e) {
            log.append("catch ");
            return log.append("return-from-catch ").toString();       // value computed here…
        } finally {
            log.append("finally");                                     // …finally still runs
        }
    }

    public static void main(String[] args) throws Exception {
        try {
            withdraw(100, 500);
        } catch (InsufficientFundsException e) {
            System.out.println("declined: " + e.getMessage());
        }
        System.out.println(finallyOrder());
        try (AutoCloseable conn = () -> System.out.println("connection closed")) {   // try-with-resources
            System.out.println("using connection");
        }
    }
}
```

```text
declined: need 500, have 100
try catch return-from-catch
using connection
connection closed
```

(The returned string was built before `finally` appended to the builder, so the printed value doesn't include "finally" — but `finally` **did** run.)
**Interview answer**: "Checked exceptions are for recoverable conditions the caller should handle, and the compiler enforces it; unchecked are for bugs and invalid input. In services I throw specific unchecked domain exceptions and map them to HTTP responses in one global handler (`@ControllerAdvice`). I never swallow exceptions — log with context, then rethrow or translate."
**Follow-ups**: `throw` vs `throws` · can `finally` skip? (`System.exit`, JVM crash) · returning from `finally` hides exceptions (don't) · multi-catch `catch (A | B e)` · exception chaining `new ServiceException("msg", cause)` · global handling in Spring → [Spring 2/5](../05-spring-boot/02-rest-apis-filters-exceptions.md).

---

## 6. Heap vs stack (EC report) + JVM basics

**Asked to a 1-YOE selected candidate** together with `super()` ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)).

```
 ┌───────────────────────────── JVM process ─────────────────────────────┐
 │  Thread 1 stack      Thread 2 stack        HEAP (shared by all threads) │
 │  ┌───────────────┐   ┌───────────────┐     ┌─────────────────────────┐ │
 │  │ frame: pay()  │   │ frame: run()  │     │ young gen: Eden, S0, S1 │ │
 │  │  amount=500   │   │               │     │ old gen: long-lived objs│ │
 │  │  acc ─────────┼───┼───────────────┼────►│ Account object          │ │
 │  ├───────────────┤   └───────────────┘     └─────────────────────────┘ │
 │  │ frame: main() │                          Metaspace: class metadata  │
 │  └───────────────┘                          (outside the heap)         │
 └────────────────────────────────────────────────────────────────────────┘
```

| | Stack | Heap |
|---|---|---|
| Stores | method frames: local primitives, **references**, return address | **objects** and arrays (and the string pool) |
| Shared? | one per thread (thread-safe by nature) | shared by all threads |
| Lifetime | frame popped when the method returns | until unreachable → garbage collected |
| Size / speed | small, very fast (push/pop) | large, managed by GC |
| Error when full | `StackOverflowError` (deep/infinite recursion) | `OutOfMemoryError: Java heap space` |

```java
class StackVsHeap {
    static int depth = 0;
    static void recurse() { depth++; recurse(); }                  // no base case → stack fills up

    public static void main(String[] args) {
        try {
            recurse();
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError after " + (depth > 1000 ? "thousands of" : "few") + " frames");
        }
        int[] onHeap = new int[1_000];                              // reference on stack, array on heap
        System.out.println("array length " + onHeap.length);
    }
}
```

```text
StackOverflowError after thousands of frames
array length 1000
```

**JVM building blocks (short)**: `javac` → bytecode (`.class`) → **class loaders** load it → **bytecode verifier** → **interpreter + JIT compiler** (hot code → native) → runtime data areas above → **GC**.
**Why three class loaders?** ([LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/)) — *Bootstrap* (core `java.*`), *Platform* (other JDK modules), *Application* (your classpath). **Parent delegation**: a loader first asks its parent, so nobody can replace `java.lang.String` with their own — security and consistency.

---

## 7. Garbage collection (Senior report — know the basics)

- An object is garbage when **no live reference chain** reaches it from GC roots (thread stacks, static fields, JNI refs).
- **Generational idea**: most objects die young → collect the **young generation** often (minor GC, cheap), promote survivors to the **old generation** (major/mixed GC, rarer).
- Collectors: **G1** (default since Java 9; region-based, pause-time goals) · **ZGC** / Shenandoah (very low pauses, large heaps) · Parallel (throughput) · Serial (small heaps).
- "Can we choose the GC?" → yes: `-XX:+UseG1GC`, `-XX:+UseZGC`. Heap size: `-Xms` / `-Xmx`; in containers prefer `-XX:MaxRAMPercentage=75`.
- **How to decide JVM memory** (asked as a written question in a HackerRank screen, [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/)): measure live data after full GC under realistic load, add headroom (≈ 2–3× live set), leave room for metaspace, thread stacks and native memory inside the container limit, watch GC logs/latency, then tune.
- **Memory leaks in Java** exist: ever-growing static maps/caches, unclosed resources, listeners never removed, `ThreadLocal` in thread pools.

**Interview answer**: "The JVM frees unreachable objects automatically. The heap is generational because most objects die young; G1 is the default collector, ZGC for very low pause times. I don't call `System.gc()`; I size the heap from measurements and fix leaks like unbounded caches."

---

## 8. Data types, wrappers, and "pointers" in Java (LOW)

| Primitive | Size | Default | Wrapper |
|---|---|---|---|
| `byte` / `short` / `int` / `long` | 1 / 2 / 4 / 8 bytes | 0 | Byte, Short, Integer, Long |
| `float` / `double` | 4 / 8 bytes | 0.0 | Float, Double |
| `char` | 2 bytes (UTF-16 unit) | `'\u0000'` | Character |
| `boolean` | JVM-dependent | false | Boolean |

```java
class WrapperTrap {
    public static void main(String[] args) {
        Integer a = 127, b = 127, c = 128, d = 128;
        System.out.println((a == b) + " " + (c == d) + " " + c.equals(d));   // Integer cache is -128..127
        System.out.println(0.1 + 0.2);                                       // never use double for money
        System.out.println(new java.math.BigDecimal("0.1").add(new java.math.BigDecimal("0.2")));
    }
}
```

```text
true false true
0.30000000000000004
0.3
```

**Pointers** ([GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/)): Java has **references**, not pointers — no pointer arithmetic, no manual `free`, and dereferencing `null` throws `NullPointerException` instead of corrupting memory.
**Java vs Python** ([GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/)): statically vs dynamically typed · compiled to bytecode + JIT vs interpreted (CPython) · true multi-threading vs the GIL (CPython) · verbose but strict vs concise.

---

⚡ **Quick revision**: `==` = same object, `equals` = same content · StringBuilder in loops · immutable = final class + final fields + defensive copies · checked = must handle, unchecked = bugs (and `@Transactional` rolls back only on unchecked by default) · stack = frames per thread, heap = shared objects · G1 default, generational GC · `Integer` cache −128..127 · money = long paise / BigDecimal.

Next: [Java 4/5 — Multithreading & concurrency →](04-multithreading-and-concurrency.md)
