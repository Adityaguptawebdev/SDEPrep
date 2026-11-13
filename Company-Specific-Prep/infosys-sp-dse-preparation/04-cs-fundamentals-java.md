# 04 — OOP, Java, OS, CN, System Design, AI/ML, HR

**Legend:** 📌 **Reported** (source ID → [sources.md](sources.md)) · 🧪 **Practice** (expected, not reported). Answers are short, so say them in your own words. Every Java snippet was run on JDK 26.

> **The #1 rule from candidates:** "Back every keyword on your resume". Panels asked about AWS, Docker, React, Next.js, Node.js, OAuth, bcrypt, NumPy, OpenCV, RAG and vector DBs **only because they were on the resume** [LC-8278125, LC-8178418, LC-8512263, LC-8561188, LC-8531964].

---

## OOP — 📌

**Q: Explain the OOP pillars with a real-world example. Why OOP?** [LC-6567886, LC-7233197, LC-8441416]
Banking example (used by a selected candidate):
- **Encapsulation:** `balance` is private; you change it only through `deposit()` / `withdraw()`, which check the rules.
- **Abstraction:** you call `transfer()` without knowing about the network or ledger.
- **Inheritance:** `SavingsAccount` and `CurrentAccount` extend `Account`.
- **Polymorphism:** `calculateInterest()` gives a different result for each account type.

**Why OOP:** code is reusable, safer, easier to change, and models real things.

**Q: Compile-time vs runtime polymorphism? How do you create an object?** [LC-8178418]
- **Compile-time = overloading:** same name, different parameters, chosen by the compiler.
- **Runtime = overriding:** a child replaces a parent method, and the JVM picks it from the **actual object**: `Account a = new SavingsAccount(); a.calculateInterest();` runs the Savings version.
- **Creating objects:** `new` (normal), reflection (`Class.forName(..).getDeclaredConstructor().newInstance()`), `clone()`, deserialization.

**Q: Write any two constructors.** [LC-8278125] Constructor chaining with `this(...)`:

```java
class Account {
    private final String owner;
    private double balance;
    Account() { this("guest", 0); }                                    // default → calls the other one
    Account(String owner, double balance) { this.owner = owner; this.balance = balance; } // parameterized
}
// new Account() → guest:0.0    new Account("Asha", 500) → Asha:500.0
```

**Q: Access modifiers.** [LC-7204748] `private` (same class) < default (same package) < `protected` (package + subclasses) < `public` (everyone). Fields are usually private; the API methods are public.

**Q: Interfaces in Java. Interface vs abstract class?** [LC-6567886]

| Interface | Abstract class |
|---|---|
| a contract: "can do" (`Comparable`, `Runnable`) | a partial base: "is a" |
| a class implements **many** | a class extends **one** |
| fields are `public static final` only | any fields, constructors, state |
| `default` / `static` / `private` methods since Java 8/9 | normal + abstract methods |

**Q: Why doesn't Java support multiple inheritance (of classes)?** [LC-6567886] The **diamond problem**: if B and C both override `A.show()` and D extends both, which `show()` should D get? Java avoids this ambiguity. Multiple **interfaces** are allowed; if two `default` methods clash, the class **must override** and choose (`B.super.show()`).

**Q: Virtual functions / the `virtual` keyword?** [LC-7233197, LC-8406888] In C++, a `virtual` method is resolved at **runtime** through the object's vtable, which enables runtime polymorphism (`Base* p = new Derived(); p->f();` calls `Derived::f`). Without `virtual`, the call is fixed at compile time. In **Java every non-static, non-final, non-private method is virtual** by default. A **pure virtual** function (`= 0`) makes the class abstract.

**Q: Operator overloading with an example.** [LC-8441416] Giving an operator a meaning for your own type, in C++: `Complex operator+(const Complex& o) const { return {re + o.re, im + o.im}; }`, so `c1 + c2` works. **Java doesn't allow it** (only `+` for String concatenation is built in).

**Q: SOLID principles.** [LC-8561188, LC-8564309]
- **S**ingle responsibility: one class, one reason to change (`InvoicePrinter` separate from `InvoiceCalculator`).
- **O**pen/closed: add new behaviour by adding classes, not by editing old ones (a new `Payment` type).
- **L**iskov substitution: a child must work wherever the parent works (a `Square` that breaks `Rectangle.setWidth` violates it).
- **I**nterface segregation: many small interfaces instead of one fat one.
- **D**ependency inversion: depend on interfaces and inject them (`OrderService(PaymentGateway g)`).

**Q: Design patterns: Singleton, Factory (+ Decorator, etc.).** [LC-8433956, LC-8564309, LC-6436250]

```java
final class Config {                                     // Singleton, lazy + thread-safe (holder idiom)
    private Config() {}
    private static class Holder { static final Config INSTANCE = new Config(); }
    static Config getInstance() { return Holder.INSTANCE; }
}

interface Payment { String pay(double amt); }            // Factory: the caller doesn't use `new` on concrete classes
class Upi implements Payment { public String pay(double a) { return "UPI " + a; } }
class Card implements Payment { public String pay(double a) { return "Card " + a; } }
class PaymentFactory {
    static Payment create(String type) {
        return switch (type) {
            case "upi" -> new Upi();
            case "card" -> new Card();
            default -> throw new IllegalArgumentException(type);
        };
    }
}
```
Others in one line each: **Builder** (step-by-step object creation), **Observer** (notify subscribers, as in event listeners), **Strategy** (swap an algorithm at runtime), **Decorator** (wrap an object to add behaviour, as in Java I/O streams), **Adapter** (convert one interface to another).

---

## Java — 📌

**Q: Call by value or call by reference in Java?** [LC-6567886] **Always call by value.** For objects, the **reference is copied**: you can change the object's contents, but reassigning the parameter doesn't affect the caller.

```java
static void change(int x, int[] arr, StringBuilder sb) {
    x = 99; arr[0] = 99; sb.append("!"); sb = new StringBuilder("new");
}
// before: x=1, arr={1}, sb="hi"   after: x=1, arr[0]=99, sb="hi!"
```

**Q: Memory management and garbage collection. Stack vs heap.** [LC-6567886, LC-8278125, LC-8433956]
- **Stack** (per thread): method frames, local primitives and references. Freed automatically when a method returns. Overflow → `StackOverflowError`.
- **Heap** (shared): every object made with `new`. Freed by the **GC**. Full → `OutOfMemoryError`.
- **GC:** it starts from roots (stack variables, static fields), **marks** reachable objects, and **sweeps/compacts** the rest. Generational: Young (Eden + Survivor, frequent fast minor GCs) → Old (fewer, slower major GCs). The default collector is G1. `System.gc()` is only a request.

**Q: Exception handling. Checked vs unchecked.** [LC-8498620]
- `try / catch / finally` (finally always runs), plus **try-with-resources** for auto-closing.
- **Checked** exceptions (`IOException`, `SQLException`) must be caught or declared with `throws`.
- **Unchecked** exceptions (`RuntimeException` such as `NullPointerException`, `ArithmeticException`) don't have to be.
- `Error` (such as `OutOfMemoryError`) is not meant to be caught.
- `throw` raises an exception; `throws` declares one.

**Q: Java 8 features.** [LC-8498620] Lambdas · functional interfaces (`Predicate`, `Function`, `Supplier`, `Consumer`) · **Streams** (`filter/map/collect`) · `Optional` · default and static methods in interfaces · method references (`String::length`) · new Date-Time API (`LocalDate`) · `CompletableFuture`.

```java
List<String> topNames = employees.stream()
        .filter(e -> e.salary() > 50000)
        .sorted(Comparator.comparingInt(Employee::salary).reversed())
        .map(Employee::name)
        .collect(Collectors.toList());
```

**Q: How does a HashMap work internally?** [LC-8406888]
1. `hashCode()` → spread the bits → bucket index = `hash & (n − 1)`.
2. Collisions go into a **linked list** in that bucket. Since Java 8, a list longer than 8 becomes a **red-black tree** (when the table has ≥ 64 buckets).
3. When `size > capacity × 0.75`, the table doubles and entries are redistributed.

Average O(1), worst O(log n) with trees. That's why `equals()` and `hashCode()` must be overridden **together**.

**Q: Multiply an integer and a decimal in Java.** [LC-8278125] `int × double` is promoted to `double`: `5 * 2.5 = 12.5`. A cast **truncates**: `(int)(5 * 2.5) = 12`. Watch integer division: `5 / 2 = 2`, but `5 / 2.0 = 2.5`.

**Q: Print only the alphanumeric characters of a string.** [LC-8278125]

```java
String s = "Ab#1 c@2!";
System.out.println(s.replaceAll("[^A-Za-z0-9]", ""));      // Ab1c2
// or, without regex:
StringBuilder sb = new StringBuilder();
for (char c : s.toCharArray()) if (Character.isLetterOrDigit(c)) sb.append(c);
```

**Q: while vs do-while.** [LC-8278419] `while` checks **before** the body (it may run 0 times). `do { } while (cond);` checks **after**, so it runs **at least once**.

**Q: What are `<>`, `!=`, `==`, `:=`, `MOD`, `abs`?** [LC-8278125, LC-8278419]
- `<>` and `!=` both mean *not equal* in SQL (`<>` is the ANSI form).
- `==` is equality in Java/Python. For Java objects it compares **references**; use `.equals()` for content.
- `:=` is Python's **walrus** operator (assign inside an expression: `if (n := len(a)) > 10:`), or variable assignment in MySQL.
- `MOD(a, b)` / `%` is the remainder. In Java `-7 % 3 = -1` (use `Math.floorMod` for 2).
- `abs()` is the absolute value.

---

## OS — 📌

**Q: Deadlock: what is it, the 4 conditions, how to handle it.** [LC-7233197]
Two or more processes wait forever for each other's resources. All 4 conditions must hold (Coffman):
1. **Mutual exclusion**
2. **Hold and wait**
3. **No preemption**
4. **Circular wait**

Handling: **prevent** (break a condition, e.g. always lock resources in a fixed order), **avoid** (Banker's algorithm), **detect and recover** (wait-for graph, kill/rollback), or ignore it (the ostrich approach).

**Q: Semaphore vs mutex.** [LC-7233197]
- **Mutex:** a lock with an **owner**; only the thread that locked it unlocks it; one thread in the critical section.
- **Semaphore:** a **counter** with `wait()` (P, decrement, block at 0) and `signal()` (V, increment), and no owner. A counting semaphore lets N threads in (a pool of N DB connections); a binary semaphore works like a lock.
- Classic use: producer–consumer with `empty`, `full` and `mutex`.

**Q: Fragmentation and its types.** [LC-8433956]
- **Internal:** wasted space **inside** an allocated block (asking for 18 KB and getting a 20 KB block or page).
- **External:** enough free memory in total, but split into **non-contiguous** holes.

Fixes: paging removes external fragmentation (at the cost of some internal), plus compaction, best-fit allocation, segmentation with paging.

🧪 **Process vs thread** (OS basics were asked [LC-8406888]): a process has its own address space and is heavy to create and switch. Threads share the process's heap/code/data but have their own stack and registers, so they are cheap but need synchronisation. **Context switch** = save one PCB/TCB, load another.

---

## Computer Networks — 📌

**Q: What happens when you type google.com in the browser?** [LC-7233197]
1. **DNS:** browser cache → OS → resolver → root → `.com` → Google's name server → IP.
2. **TCP** 3-way handshake (SYN, SYN-ACK, ACK) to port 443.
3. **TLS** handshake: certificate check and session keys.
4. **HTTP GET /** request → load balancer → server.
5. Response (HTML) → the browser parses it, fetches CSS/JS/images, builds the DOM + CSSOM → layout → paint.

🧪 **TCP vs UDP:** TCP is connection-based, reliable, ordered, with flow/congestion control (HTTP, email). UDP has no connection, no guarantees, but is fast (video calls, DNS, gaming).

---

## System design / LLD (asked mostly for SP L2/L3) — 📌

**Q: Monolithic vs microservices.** [LC-8561188] A monolith is one deployable app: simple to build, test and deploy at the start, but it scales and fails as one unit. Microservices are small services that you deploy and scale independently, each with its own DB, talking over REST or queues. The cost: network calls, distributed transactions and harder debugging. Start monolith; split when teams or scale need it.

**Q: An e-commerce order list with a COD/prepaid filter. How do you make the filter fast? What about a write-heavy system?** [LC-6436250]
Add an **index** on `(payment_type, created_at)`, or a **composite index** with `user_id` first if lists are per user. Paginate with a cursor (`WHERE created_at < ? LIMIT 20`). Cache hot pages.
For **write-heavy** systems, every index slows inserts. Keep only the needed composite index, push writes through a queue, and serve filters from a **read replica** or a search index (Elasticsearch) updated asynchronously (CQRS).

**Q: Design WhatsApp (HLD).** [LC-8498620] Clients keep a **WebSocket** to chat servers (a session map in Redis: user → server). Sending: message → chat server → store in a **message DB** (Cassandra, partitioned by chat) → push to the receiver's server, or store for offline delivery + **push notification**. Ticks: sent / delivered / read events. Groups: fan-out to members. Media goes to object storage (S3) + CDN, and only the URL is sent. Also: end-to-end encryption, Kafka between services.

**Q: Design a movie booking service (LLD).** [LC-8218681] Classes: `Movie`, `Theatre`, `Screen`, `Show(movie, screen, time)`, `Seat(type, price)`, `ShowSeat(status: AVAILABLE/LOCKED/BOOKED)`, `Booking`, `Payment`, `User`. Key point: **concurrency**. Lock the chosen `ShowSeat` rows with a TTL (for example 10 min) using `SELECT … FOR UPDATE` or optimistic versioning, then confirm on payment success and release on timeout. Patterns: Strategy (pricing), Factory (payment), Observer (notifications).

**Q: How would you optimise a website's performance?** [LC-8178418] Minify and compress (gzip/brotli), use a CDN, cache headers, lazy-load images/routes (code splitting), use WebP images, avoid re-renders (React `memo`, `useMemo`), debounce input, paginate, add DB indexes, cache in Redis, and reduce API calls.

---

## AI / ML (asked to most 2026 candidates) — 📌

[LC-8441416, LC-8498620, LC-8183159, LC-8433956]
- **AI vs ML:** AI = machines doing tasks that need human-like intelligence. ML = a subset that **learns patterns from data** instead of hand-written rules. Deep learning = ML with neural networks.
- **Types of ML:** **supervised** (labelled data → predict: spam detection, price prediction), **unsupervised** (no labels → find structure: customer clustering), **reinforcement** (an agent learns from rewards: games, robotics).
- **LLM:** a large transformer model trained on huge text to **predict the next token**. It's good at language tasks, but can hallucinate and has a knowledge cut-off.
- **RAG (Retrieval-Augmented Generation):** embed your documents → store them in a **vector DB** → for each question, retrieve the top-k similar chunks → give them to the LLM as context. Answers become grounded and up to date without retraining.

---

## Puzzle — 📌

**Q: An 8 L jug full, plus empty 5 L and 3 L jugs. Get exactly 4 L and 4 L.** [LC-8441416] (8,5,3 contents), 7 pours (checked by BFS):
`(8,0,0) → (3,5,0) → (3,2,3) → (6,2,0) → (6,0,2) → (1,5,2) → (1,4,3) → (4,4,0)`

---

## HR / behavioural — 📌

[LC-7233197, LC-7233305, LC-7204748, LC-6367311, LC-6567886]
- **Why Infosys? Would you join if selected?** Talk about scale (global clients, many domains), the SP/DSE role being core engineering, the Mysore training, and the upskilling platforms (Wingspan/Lex). Answer "yes" clearly.
- **Where do you see yourself in 5 years? What's your dream company? Other interviews or offers?** Be honest but positive. Show long-term growth in engineering, ideally inside Infosys.
- **Rate yourself out of 5** on each resume skill [LC-7233305]. Never give 5. Give 3–4 and justify it, because they will test the skill you rate highest.
- **Why software, coming from a non-CS branch?** [LC-6367311] Have a 30-second story ready.
- Some 2025 drives asked for a **short PPT presentation** of yourself/projects [LC-6567886]. Some 2026 interviews had **no HR round** for DSE [LC-8178418].

Back to: [README.md](README.md)
