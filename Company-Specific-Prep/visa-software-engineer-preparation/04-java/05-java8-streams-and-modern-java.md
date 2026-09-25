# Java 5/5 — Java 8 Streams, Lambdas & Modern Java (11 / 17 / 21)

**Easy analogy — stream = water purifier ki pipeline**: Paani (data) ek taraf se aata hai, **filter** (gandagi hatao) → **map** (minerals add karo) → **collect** (bottle mein bharo). Jab tak nal (terminal operation) nahi kholte, pipeline mein paani chalta hi nahi — yahi **lazy evaluation** hai.

| Topic | Visa reports | Freq |
|---|---|---|
| Streams: group by department, filter, sort, count, multiple keys | [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/) (SSE, Java + React), [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**, 1.7 YOE), [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) (Senior) | **HIGH** (3) |
| Java 8 features: default methods, Optional, Predicate, Consumer, functional interfaces | [LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/) ("lots of Java 8 questions"), [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/) | MEDIUM (senior) |
| "Which Java version do you use? What's new in Java 17?" | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**) | LOW |

A Staff candidate's advice after a Java-8-fixated interviewer: *"prepare for Java 8 strictly"* ([LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/)). For you: be fluent in streams + lambdas, and know 3–4 Java 17 features you've actually used.

---

## 1. Lambdas and the core functional interfaces

| Interface | Method | Shape | Example |
|---|---|---|---|
| `Predicate<T>` | `test` | T → boolean | `t -> t.amount() > 1000` |
| `Function<T,R>` | `apply` | T → R | `Txn::merchant` |
| `Consumer<T>` | `accept` | T → void | `System.out::println` |
| `Supplier<T>` | `get` | () → T | `ArrayList::new` |
| `BiFunction<T,U,R>` | `apply` | (T, U) → R | `(a, b) -> a + b` |
| `UnaryOperator<T>` / `BinaryOperator<T>` | `apply` | T → T / (T, T) → T | `Long::sum` |

```java
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

class FunctionalBasics {
    public static void main(String[] args) {
        Predicate<Long> isLarge = amount -> amount > 10_000;
        Predicate<Long> isSuspicious = isLarge.and(amount -> amount % 1000 == 0);   // compose predicates
        Function<Long, String> format = paise -> "₹" + paise / 100 + "." + String.format("%02d", paise % 100);
        Consumer<String> print = System.out::println;                               // method reference
        Supplier<List<Long>> amounts = () -> List.of(5_000L, 20_000L, 25_050L);

        for (long a : amounts.get()) print.accept(format.apply(a) + " suspicious=" + isSuspicious.test(a));
    }
}
```

```text
₹50.00 suspicious=false
₹200.00 suspicious=true
₹250.50 suspicious=false
```

**Interview answer**: "A lambda is a short implementation of a functional interface — one abstract method. `Predicate` tests, `Function` transforms, `Consumer` does side effects, `Supplier` produces. They compose (`and`, `andThen`), which keeps business rules small and testable."

---

## 2. The exact stream questions candidates got

**Setup** (the `Emp` class from [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/) and [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/)):

```java
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

class StreamQuestions {
    record Emp(int empId, String name, String dept, String city, long salary) {}

    static final List<Emp> EMPS = List.of(
            new Emp(1, "Aditi", "Payments", "Bengaluru", 1_800_000),
            new Emp(2, "Rahul", "Risk", "Bengaluru", 2_400_000),
            new Emp(3, "Arjun", "Payments", "Pune", 1_600_000),
            new Emp(4, "Meera", "Risk", "Bengaluru", 3_000_000),
            new Emp(5, "Anil", "Payments", "Bengaluru", 2_000_000));

    public static void main(String[] args) {
        // Q1 (LC-7501159): map with key = dept, value = employees of that dept
        Map<String, List<String>> byDept = EMPS.stream().collect(Collectors.groupingBy(
                Emp::dept, TreeMap::new, Collectors.mapping(Emp::name, Collectors.toList())));
        System.out.println("Q1 " + byDept);

        // Q2 (LC-6618617): names starting with "A" (the candidate's own first name in the interview)
        List<String> startsWithA = EMPS.stream().map(Emp::name).filter(n -> n.startsWith("A")).toList();
        System.out.println("Q2 " + startsWithA);

        // Q3 (LC-6618617): sort the same list in reverse — with streams
        List<String> reversed = EMPS.stream().sorted(Comparator.comparing(Emp::name).reversed())
                .map(Emp::name).toList();
        System.out.println("Q3 " + reversed);

        // Q4 (LC-2209203): group on MULTIPLE keys and count frequency
        Map<String, Map<String, Long>> deptCity = EMPS.stream().collect(Collectors.groupingBy(
                Emp::dept, TreeMap::new, Collectors.groupingBy(Emp::city, TreeMap::new, Collectors.counting())));
        System.out.println("Q4 " + deptCity);

        // Q5 (very common follow-up): second highest salary
        Optional<Long> second = EMPS.stream().map(Emp::salary).distinct()
                .sorted(Comparator.reverseOrder()).skip(1).findFirst();
        System.out.println("Q5 " + second.orElse(-1L));

        // Q6: average salary per dept, and highest-paid per dept
        Map<String, Double> avg = EMPS.stream().collect(Collectors.groupingBy(Emp::dept, TreeMap::new,
                Collectors.averagingLong(Emp::salary)));
        Map<String, String> topPaid = EMPS.stream().collect(Collectors.groupingBy(Emp::dept, TreeMap::new,
                Collectors.collectingAndThen(Collectors.maxBy(Comparator.comparingLong(Emp::salary)),
                        e -> e.map(Emp::name).orElse("-"))));
        System.out.println("Q6 " + avg + " " + topPaid);

        // Q7: partition — above / below 20 LPA
        Map<Boolean, Long> split = EMPS.stream()
                .collect(Collectors.partitioningBy(e -> e.salary() >= 2_000_000, Collectors.counting()));
        System.out.println("Q7 " + split);
    }
}
```

```text
Q1 {Payments=[Aditi, Arjun, Anil], Risk=[Rahul, Meera]}
Q2 [Aditi, Arjun, Anil]
Q3 [Rahul, Meera, Arjun, Anil, Aditi]
Q4 {Payments={Bengaluru=2, Pune=1}, Risk={Bengaluru=2}}
Q5 2400000
Q6 {Payments=1800000.0, Risk=2700000.0} {Payments=Anil, Risk=Meera}
Q7 {false=2, true=3}
```

**If you forget the stream syntax** (it happened to the EC candidate for Q3 — the interviewer accepted `list.sort(...)` with a comparator lambda and then asked about `Comparator` and lambdas): say "the stream version uses `sorted(Comparator.comparing(...).reversed())`; without streams I'd do `list.sort(Comparator.comparing(Emp::name).reversed())`". Honesty + the idea is better than freezing.
**Traps**: streams can be consumed **once** · `toList()` (Java 16) returns an unmodifiable list; `collect(Collectors.toList())` doesn't promise mutability either · `Collectors.toMap` throws on duplicate keys unless you pass a merge function · `peek` is for debugging only · don't mutate outside state from `map`/`filter`.

---

## 3. Optional, method references, default/static interface methods

```java
import java.util.Map;
import java.util.Optional;

class OptionalDemo {
    static final Map<String, String> CARD_TO_USER = Map.of("4111", "u1");

    static Optional<String> findUser(String card) { return Optional.ofNullable(CARD_TO_USER.get(card)); }

    public static void main(String[] args) {
        System.out.println(findUser("4111").map(String::toUpperCase).orElse("unknown"));
        System.out.println(findUser("9999").map(String::toUpperCase).orElse("unknown"));
        try {
            findUser("9999").orElseThrow(() -> new IllegalArgumentException("card not registered"));
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

```text
U1
unknown
card not registered
```

**Rules of thumb**: use `Optional` as a **return type** for "maybe no result"; don't use it for fields, parameters or collections (return an empty list instead); never call `get()` without checking — prefer `orElse`, `orElseGet`, `orElseThrow`, `map`, `ifPresent`.
**Default methods** let interfaces evolve (see [Java 1/5 §5](01-oop-and-class-design.md#5-interface-vs-abstract-class-default-methods-diamond-problem-high)); **static interface methods** are helpers like `Comparator.comparing`.

---

## 4. "What's new in Java 17?" — features to name (and use)

| Version | Feature | One-line example |
|---|---|---|
| 10 | `var` for local variables | `var totals = new HashMap<String, Long>();` |
| 11 | new String methods, `HttpClient` | `" ".isBlank()`, `"ab".repeat(3)`, `s.strip()`, `s.lines()` |
| 14 | switch expressions · helpful NullPointerException messages | `int fee = switch (type) { case "UPI" -> 0; default -> 2; };` |
| 15 | text blocks | multi-line SQL/JSON in `"""` … `"""` |
| 16 | **records** · pattern matching for `instanceof` · `Stream.toList()` | `record Money(String cur, long minor) {}` · `if (o instanceof Card c) c.pay()` |
| 17 (LTS) | **sealed classes** | `sealed interface Payment permits Card, Upi {}` |
| 21 (LTS) | **virtual threads**, pattern matching for `switch`, record patterns, sequenced collections | `Executors.newVirtualThreadPerTaskExecutor()` |

```java
class ModernJava {
    sealed interface Payment permits Card, Upi {}
    record Card(String last4, long amount) implements Payment {}
    record Upi(String vpa, long amount) implements Payment {}

    static String describe(Object o) {
        if (o instanceof Card c && c.amount() > 10_000) return "large card payment ****" + c.last4();   // pattern matching
        if (o instanceof Payment p) return "payment " + p;
        return "unknown";
    }

    public static void main(String[] args) {
        var payments = java.util.List.<Object>of(new Card("1111", 50_000), new Upi("demo@okbank", 300), "hello");
        for (var p : payments) System.out.println(describe(p));
        String type = "UPI";
        int feePercent = switch (type) {                            // switch expression
            case "UPI" -> 0;
            case "CARD" -> 2;
            default -> throw new IllegalArgumentException("unknown type");
        };
        String json = """
                {"type": "%s", "fee": %d}""".formatted(type, feePercent);   // text block
        System.out.println(json);
    }
}
```

```text
large card payment ****1111
payment Upi[vpa=demo@okbank, amount=300]
unknown
{"type": "UPI", "fee": 0}
```

**Interview answer (if you use 17)**: "We're on Java 17. I use records for DTOs, switch expressions, text blocks for SQL in tests, and pattern-matching `instanceof`. Sealed interfaces help model a closed set of payment types. [CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE — only name features you've really used.]"
**Trap**: claiming a version you don't use — the next question is "which feature did you use and where?".

---

## 5. Parallel streams — when NOT to

`parallelStream()` splits work on the common ForkJoinPool. Good for large, CPU-bound, independent work on arrays/ArrayLists. Bad for: small lists, I/O (blocks the shared pool), order-dependent logic, shared mutable state, and anything inside a web request where the common pool is shared by everyone.

---

⚡ **Quick revision**: groupingBy(key, mapFactory, downstream) · mapping/counting/averaging downstream collectors · sorted(Comparator.comparing(..).reversed()) · distinct+sorted+skip for "second highest" · Optional only as a return type · Java 17 = records, sealed, switch expressions, text blocks, pattern matching.

Back to [Java index](README.md) · Next: [05 — Spring Boot →](../05-spring-boot/README.md)
