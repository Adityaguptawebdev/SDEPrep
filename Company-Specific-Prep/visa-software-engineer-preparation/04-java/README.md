# 04 — Core Java for Visa (from reported questions)

> Only topics that Visa candidates reported are treated as priorities; classics that were **not** reported are marked. All examples compile and their printed output is checked.

**Easy analogy — Java round = viva after the practical**: Code chal gaya (DSA), ab examiner poochta hai "yeh HashMap andar se kaise kaam karta hai? thread-safe hai?" Jo sirf ratta maarta hai woh 2nd follow-up pe atak jaata hai; jo **apne project se jodta hai** woh aage nikal jaata hai. A 1.10-YOE candidate was rejected partly for *"not able to provide correct answer for few conceptual java questions"* ([LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)).

## Most-reported Java topics (ranked by number of reports)

| Rank | Topic | Reports | Freq | Note |
|---|---|---|---|---|
| 1 | HashMap internals (+ equals/hashCode) | 6 | HIGH | [Java 2 §2–3](02-collections-hashmap-internals.md#2-hashmap-internals-high) |
| 2 | OOP pillars with real examples | 5 | HIGH | [Java 1 §1](01-oop-and-class-design.md#1-the-4-pillars--with-real-examples-high) |
| 2 | Interface vs abstract class · default methods · diamond | 5 | HIGH | [Java 1 §5](01-oop-and-class-design.md#5-interface-vs-abstract-class-default-methods-diamond-problem-high) |
| 4 | Process vs thread / multithreading basics | 4 | HIGH | [Java 4 §1](04-multithreading-and-concurrency.md#1-process-vs-thread--the-os-questions-that-come-with-it) |
| 5 | Overloading vs overriding · static vs dynamic binding | 3 | HIGH | [Java 1 §4](01-oop-and-class-design.md#4-polymorphism-overloading-vs-overriding-static-vs-dynamic-binding-high) |
| 5 | Singleton (and breaking it) | 3 | HIGH | [Java 1 §9](01-oop-and-class-design.md#9-singleton--and-how-it-breaks-high) |
| 5 | Streams (groupingBy, filter, sort, counting) | 3 | HIGH | [Java 5 §2](05-java8-streams-and-modern-java.md#2-the-exact-stream-questions-candidates-got) |
| 5 | Array vs LinkedList | 3 | HIGH | [Java 2 §1](02-collections-hashmap-internals.md#1-collections-map--arraylist-vs-linkedlist-vs-array-high) |
| 5 | synchronized / locks / concurrency in projects | 3 (senior) | HIGH | [Java 4 §2–4](04-multithreading-and-concurrency.md) |
| 5 | Thread pools · ExecutorService · CompletableFuture | 3 (senior) | HIGH | [Java 4 §5–6](04-multithreading-and-concurrency.md#5-executorservice-thread-pools-future) |
| 11 | Static vs instance | 2 | MEDIUM | [Java 1 §6](01-oop-and-class-design.md#6-static-vs-instance-medium) |
| 11 | Encapsulation vs abstraction | 2 | MEDIUM | [Java 1 §2](01-oop-and-class-design.md#2-encapsulation-vs-abstraction-medium) |
| 11 | Constructors · `super()` | 2 | MEDIUM | [Java 1 §3](01-oop-and-class-design.md#3-inheritance-constructors-and-super-medium) |
| 11 | Deadlock | 2 | MEDIUM | [Java 4 §4](04-multithreading-and-concurrency.md#4-deadlock-medium) |
| 11 | Checked vs unchecked exceptions | 2 (senior) | MEDIUM | [Java 3 §5](03-strings-exceptions-jvm-gc.md#5-exceptions--checked-vs-unchecked-medium-senior) |
| 11 | Map types · HashMap vs ConcurrentHashMap | 2 | MEDIUM | [Java 2 §4](02-collections-hashmap-internals.md#4-map-types--hashmap-vs-concurrenthashmap-medium) |
| — | Heap vs stack · `==` vs equals · String vs StringBuilder · `main` explained · pass by value · Comparable vs Comparator · Java 17 features · data types · immutability · JVM/GC · fail-fast · marker interface | 1 each | LOW | spread across Java 1–5 |
| — | `final`/`finally`/`finalize`, `transient`, serialization details, reflection, generics wildcards | **0** | not reported | know the basics only |

## How to answer a Java theory question (Visa style)

```
 1. One-line definition          "HashMap is an array of buckets indexed by the key's hash."
 2. How it works (2–3 lines)     buckets → collisions → tree at 8 → resize at 0.75
 3. Where YOU used it            "In my project I cached merchant configs in a ConcurrentHashMap because…"
 4. Trade-off / trap             "not thread-safe; keys must be immutable"
 5. Stop — let them follow up    (don't lecture for 5 minutes)
```

**🗣️ Interview mein aise bolo**: "Definition ek line, internals do line, apne project ka example ek line, aur ek trap — bas. Interviewer khud aage le jaayega."

## Files

1. [OOP & class design](01-oop-and-class-design.md) — pillars, interfaces, polymorphism, constructors, static, pass-by-value, `main`, Singleton
2. [Collections & HashMap internals](02-collections-hashmap-internals.md) — HashMap, equals/hashCode, ConcurrentHashMap, iterators, Comparator
3. [Strings, exceptions, JVM memory & GC](03-strings-exceptions-jvm-gc.md)
4. [Multithreading & concurrency](04-multithreading-and-concurrency.md)
5. [Java 8 streams & modern Java](05-java8-streams-and-modern-java.md)

Deeper general notes in this repo: [LLD OOP basics](../../../LLD/00-fundamentals/01-oop-basics.md) · [SOLID](../../../LLD/00-fundamentals/02-solid-principles.md) · [Singleton pattern](../../../LLD/02-design-patterns/creational/01-singleton.md).

Next: [05 — Spring Boot →](../05-spring-boot/README.md)
