# Java 1/5 — OOP & Class Design

> Each topic: **Simple explanation → Interview answer (say this) → Example (compiled + run) → Follow-ups → Traps → Visa source**. Frequency labels as everywhere: HIGH ≥ 3 reports, MEDIUM = 2, LOW = 1.

**Easy analogy — OOP = a food-delivery app**: `Order` class ek **form** hai, har order ek **object**. Restaurant ko tumhara card number nahi dikhta (**encapsulation**), tum sirf "Place order" dabate ho, andar ka kaam nahi dekhte (**abstraction**), `VegOrder` aur `NonVegOrder` dono `Order` hain (**inheritance**), aur "deliver()" har order apne tareeke se karta hai — bike, cycle, drone (**polymorphism**).

| Topic | Visa reports | Freq |
|---|---|---|
| 4 OOP pillars with real examples | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/), [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/), [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/), [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) | **HIGH** (5) |
| Interface vs abstract class, default methods, diamond problem | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/), [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/), [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/) | **HIGH** (5) |
| Overloading vs overriding, static vs dynamic binding | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/), [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/), [JT-SSE-Apr25](https://www.jointaro.com/interviews/companies/visa/experiences/senior-software-engineer-bangalore-rural-april-1-2025-declined-offer-positive-62dc9dd3/) | **HIGH** (3) |
| Singleton (and how it breaks) | [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/), [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | **HIGH** (3) |
| Static vs instance (non-static) | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/), [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) | MEDIUM |
| Encapsulation vs abstraction | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | MEDIUM |
| Constructors, `super()` | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/), [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | MEDIUM |
| Pass by value vs reference | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) | LOW |
| `public static void main(String[] args)` explained; why `main` can't be overridden | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) | LOW |
| `Map<K,V> m = new HashMap<>()` — why the interface on the left | [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/) | LOW |
| Marker interface | [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/) (Staff) | LOW |
| `final` / `finally` / `finalize` | not found in Visa reports (classic — know it anyway) | — |

---

## 1. The 4 pillars — with real examples (HIGH)

**Simple explanation**
- **Encapsulation** — keep data `private`, expose only safe methods. *Why:* the object protects its own rules (balance can't go negative).
- **Abstraction** — show *what* something does, hide *how* (interfaces, abstract classes). *Why:* callers depend on a small, stable contract.
- **Inheritance** — a class reuses/extends another (`class SavingsAccount extends Account`). *Why:* share common code; model "is-a".
- **Polymorphism** — one call, many behaviours: the actual object decides which method runs at runtime (overriding), or the compiler picks by parameters (overloading).

**Interview answer (say this)**: "Encapsulation protects state, abstraction hides implementation behind a contract, inheritance reuses behaviour for is-a relationships, and polymorphism lets me write code against the parent type while each subtype supplies its own behaviour. In my project [CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE], for example, …"

**Example — payment methods (Visa-flavoured)**

```java
import java.util.List;

interface PaymentMethod {                                   // ABSTRACTION: what, not how
    String pay(long amountPaise);
}

abstract class Card implements PaymentMethod {              // INHERITANCE: shared card logic
    private final String last4;                             // ENCAPSULATION: private + final
    protected Card(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 12) throw new IllegalArgumentException("bad card");
        this.last4 = cardNumber.substring(cardNumber.length() - 4);
    }
    protected String masked() { return "**** " + last4; }  // never expose the full number
}

class CreditCard extends Card {
    CreditCard(String number) { super(number); }
    @Override public String pay(long p) { return "credit " + masked() + " charged " + p; }
}

class DebitCard extends Card {
    DebitCard(String number) { super(number); }
    @Override public String pay(long p) { return "debit " + masked() + " debited " + p; }
}

class Upi implements PaymentMethod {
    private final String vpa;
    Upi(String vpa) { this.vpa = vpa; }
    @Override public String pay(long p) { return "upi " + vpa + " paid " + p; }
}

class Checkout {
    public static void main(String[] args) {
        List<PaymentMethod> methods = List.of(new CreditCard("4111111111111111"),
                new DebitCard("4000123412341234"), new Upi("demo@okbank"));
        for (PaymentMethod m : methods) System.out.println(m.pay(49900));   // POLYMORPHISM
    }
}
```

```text
credit **** 1111 charged 49900
debit **** 1234 debited 49900
upi demo@okbank paid 49900
```

**Follow-ups**: "Which pillar did you use in your project and why?" · "Is inheritance always good?" (no — prefer **composition** when it's has-a, or when parents change often) · "Can abstraction exist without an interface?" (yes, abstract classes, even well-named methods).
**Traps**: reciting textbook definitions without an example — one reporter said interviewers wanted *"explanations of design choices, not just textbook definitions"* ([LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/)).
**🗣️ Interview mein aise bolo**: "Main har pillar ko apne project ke ek real class se jod ke batata hoon — definition 1 line, example 3 lines."

---

## 2. Encapsulation vs abstraction (MEDIUM)

| | Encapsulation | Abstraction |
|---|---|---|
| Question it answers | "Who can touch this data?" | "What does the caller need to know?" |
| Tool | `private` fields, getters/setters with rules, immutability | interfaces, abstract classes |
| Level | implementation level (inside a class) | design level (between classes) |
| Example | `balance` is private; `withdraw()` checks the limit | `PaymentMethod.pay()` hides card vs UPI details |

**Interview answer**: "Encapsulation is about **hiding data** and controlling access; abstraction is about **hiding complexity** behind a simple contract. Encapsulation is *how* I protect an object; abstraction is *what* I expose to the rest of the system."
**Trap**: saying "getters and setters = encapsulation". A public setter with no validation breaks encapsulation just like a public field.

---

## 3. Inheritance, constructors and `super()` (MEDIUM)

**Simple explanation**: a constructor initialises a new object. If you don't write one, Java adds a no-arg default constructor. In a subclass, the **first line** of every constructor is a call to a parent constructor — `super(...)` — written by you or inserted by the compiler as `super()`. So parent state is always built first.

**Memory (asked with `super()` in [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/))**: `new SavingsAccount()` creates **one object on the heap** containing the fields of both classes; the reference variable lives on the **stack** of the calling method.

```
 stack (main)                  heap
 ┌──────────────┐     ┌──────────────────────────────────┐
 │ acc ─────────┼────►│ SavingsAccount object              │
 └──────────────┘     │  from Account:  id, balance        │   one object,
                      │  from Savings:  interestRate       │   parent part built first
                      └──────────────────────────────────┘
```

```java
class Account {
    protected final String id;
    protected long balance;

    Account(String id) {
        this.id = id;
        System.out.println("Account constructor");
    }
}

class SavingsAccount extends Account {
    private final double interestRate;

    SavingsAccount(String id, double rate) {
        super(id);                                   // must be the first statement
        this.interestRate = rate;
        System.out.println("SavingsAccount constructor");
    }

    SavingsAccount(String id) {
        this(id, 3.5);                               // constructor chaining in the same class
    }

    public static void main(String[] args) {
        SavingsAccount s = new SavingsAccount("ACC-1");
        System.out.println(s.id + " " + s.interestRate);
    }
}
```

```text
Account constructor
SavingsAccount constructor
ACC-1 3.5
```

**Follow-ups**: can a constructor be `private`? (yes — Singleton, factories) · are constructors inherited? (no) · can a constructor be `final`/`static`/`abstract`? (no) · what if the parent has no no-arg constructor? (the child **must** call `super(args)` explicitly, else compile error) · why do we need constructors? (guarantee a valid object from birth — asked in [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/)).
**Trap**: calling an overridable method from a constructor — the child's override runs before the child's fields are set.

---

## 4. Polymorphism: overloading vs overriding, static vs dynamic binding (HIGH)

| | Overloading | Overriding |
|---|---|---|
| Where | same class (or subclass) | subclass redefines a parent method |
| Signature | **different** parameter list | **same** name + parameters (return type same or covariant) |
| Decided at | **compile time** (static binding) | **runtime** by the actual object (dynamic binding) |
| `static` methods | can be overloaded | can't be overridden — they are **hidden** |
| Access modifier | anything | can't be more restrictive |
| Exceptions | anything | can't throw broader **checked** exceptions |

```java
class Notifier {
    String send(String to) { return "email to " + to; }
    String send(String to, int retries) { return "email to " + to + " x" + retries; }   // overload
    static String type() { return "base"; }
}

class SmsNotifier extends Notifier {
    @Override String send(String to) { return "sms to " + to; }                        // override
    static String type() { return "sms"; }                                             // hides, not overrides
}

class BindingDemo {
    public static void main(String[] args) {
        Notifier n = new SmsNotifier();              // reference type Notifier, object SmsNotifier
        System.out.println(n.send("9999"));          // dynamic binding → SmsNotifier.send
        System.out.println(n.send("9999", 2));       // overload chosen at compile time
        System.out.println(Notifier.type() + " " + SmsNotifier.type());   // static: by class name
    }
}
```

```text
sms to 9999
email to 9999 x2
base sms
```

**Interview answer**: "Overloading = same method name, different parameters, resolved by the compiler. Overriding = subclass gives its own implementation of the same signature, resolved at runtime from the actual object — that's dynamic binding, the basis of runtime polymorphism. Static, private and final methods are bound at compile time."
**Follow-ups**: can we overload `main`? (yes, but the JVM calls only `main(String[])`) · can we override a `private` method? (no, it's not visible — a same-named method is a new method) · covariant return types · "virtual functions" in Java? (every non-static, non-private, non-final method is effectively virtual — asked as a C++ comparison in [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/)).
**Trap**: "static methods can be overridden" — no, they are hidden; the call depends on the **reference type / class name**.

---

## 5. Interface vs abstract class, default methods, diamond problem (HIGH)

| | Interface | Abstract class |
|---|---|---|
| Purpose | a **capability/contract** ("can pay", "can be compared") | a **partial base class** ("is a card") |
| State | only `public static final` constants | any fields, including instance state |
| Methods | abstract, `default`, `static`, `private` (Java 9+) | abstract + concrete, any access |
| Constructors | no | yes (called via `super`) |
| Multiple | a class can implement **many** | a class can extend **one** |
| Use when | unrelated classes share behaviour | related classes share code + state |

**Default methods** (Java 8) let interfaces add methods without breaking every implementor — that's how `Collection.stream()` was added (asked: "Stream API is built on collections but interfaces don't have function definitions — how did Java overcome this?" → default methods, [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/)).

**Diamond problem**: two interfaces give the same default method → the class **must override** it and can pick one with `X.super.method()`. Classes can't extend two classes, so the classic C++ diamond on state doesn't exist in Java.

```java
interface Refundable {
    default String policy() { return "refund in 7 days"; }
}

interface Replaceable {
    default String policy() { return "replace in 10 days"; }
}

class Order implements Refundable, Replaceable {
    @Override
    public String policy() {                       // compile error without this override
        return Refundable.super.policy() + " / " + Replaceable.super.policy();
    }

    public static void main(String[] args) {
        System.out.println(new Order().policy());
    }
}
```

```text
refund in 7 days / replace in 10 days
```

**Functional interface**: exactly one abstract method (`Runnable`, `Comparator`, `Predicate`) → can be a lambda. `@FunctionalInterface` is optional — it only makes the compiler check the rule ("Will a functional interface work without the annotation?" → yes, [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/)).
**Marker interface**: no methods at all (`Serializable`, `Cloneable`) — a tag the JVM/frameworks check with `instanceof`. Modern code often uses annotations instead ([LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/)).
**Interview answer**: "Interface for *what a thing can do* across unrelated types, abstract class for *what a family of related types shares*, including state and constructors. Since Java 8 interfaces can have default methods, but they still can't hold instance state."
**Trap**: saying "interfaces can't have method bodies" (outdated since Java 8).

---

## 6. Static vs instance (MEDIUM)

**Simple explanation**: `static` belongs to the **class** (one copy, loaded once); instance members belong to **each object**. A static method has no `this`, so it can't touch instance fields directly.

```java
class TransactionIdGenerator {
    private static long counter = 0;                // one copy for the whole JVM
    private final String prefix;                    // one copy per object

    TransactionIdGenerator(String prefix) { this.prefix = prefix; }

    static synchronized long nextNumber() { return ++counter; }       // class-level lock
    String nextId() { return prefix + "-" + nextNumber(); }          // instance method uses both

    public static void main(String[] args) {
        TransactionIdGenerator upi = new TransactionIdGenerator("UPI");
        TransactionIdGenerator card = new TransactionIdGenerator("CARD");
        System.out.println(upi.nextId() + " " + card.nextId() + " " + upi.nextId());
    }
}
```

```text
UPI-1 CARD-2 UPI-3
```

**Static vs instance methods in multithreaded code** (asked in [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/)): a `static synchronized` method locks the **Class object**; an instance `synchronized` method locks **`this`**. They don't block each other. Shared static fields are shared by **all threads and all objects** — the most common source of race conditions.
**Follow-ups**: static block (runs once at class loading) · static nested vs inner class · can a static method be abstract? (no) · why is `main` static? (JVM calls it without creating an object).
**Trap**: mutable `static` fields in a web app = data leaking across requests/users.

---

## 7. Pass by value (LOW, but a classic trap)

**Java is always pass-by-value.** For objects, the *value* passed is the **reference** (a copy of the pointer). You can change the object's contents through it, but reassigning the parameter doesn't affect the caller.

```java
class PassByValue {
    static class Wallet { long balance = 100; }

    static void addMoney(Wallet w) { w.balance += 50; }          // modifies the SAME object
    static void replace(Wallet w) { w = new Wallet(); w.balance = 0; }   // only the local copy changes
    static void bump(int x) { x++; }                              // primitive copy

    public static void main(String[] args) {
        Wallet mine = new Wallet();
        int n = 5;
        addMoney(mine);
        replace(mine);
        bump(n);
        System.out.println(mine.balance + " " + n);
    }
}
```

```text
150 5
```

**Interview answer**: "Java passes everything by value; for objects the value is a copy of the reference. So I can mutate the object, but I can't make the caller's variable point somewhere else."

---

## 8. `public static void main(String[] args)` (LOW)

Asked word by word in [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) (2 YOE, in person):

| Keyword | Why |
|---|---|
| `public` | the JVM (outside the class) must be able to call it |
| `static` | called without creating an object |
| `void` | returns nothing to the JVM (use `System.exit(code)` for an exit status) |
| `main` | the name the JVM looks for |
| `String[] args` | command-line arguments (`java App a b` → `args = ["a","b"]`) |

**"Why can't `main` be overridden?"** — it's `static`; static methods are hidden, not overridden. A subclass can declare its own `main`, and the JVM runs whichever class you launch.
**Follow-ups**: `String... args` also works · can `main` be `final`/`synchronized`? (yes) · Java 21+ has preview "instance main methods" (don't go there unless asked).

---

## 9. Singleton — and how it breaks (HIGH)

**Simple explanation**: exactly one instance per JVM (per classloader), with global access — e.g. a config holder, a connection-pool manager. In Spring you rarely hand-write it: beans are **singleton-scoped by default** (asked alongside DI in [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/)).

```java
class ConfigRegistry {
    private static volatile ConfigRegistry instance;          // volatile: safe publication

    private ConfigRegistry() {
        if (instance != null) throw new IllegalStateException("use getInstance()");   // blocks reflection
    }

    static ConfigRegistry getInstance() {
        ConfigRegistry local = instance;
        if (local == null) {                                   // 1st check without locking (fast path)
            synchronized (ConfigRegistry.class) {
                local = instance;
                if (local == null) instance = local = new ConfigRegistry();   // 2nd check with lock
            }
        }
        return local;
    }
}

enum PaymentGatewayClient {                                    // simplest safe singleton
    INSTANCE;
    String call() { return "calling gateway"; }
}

class SingletonDemo {
    public static void main(String[] args) {
        System.out.println(ConfigRegistry.getInstance() == ConfigRegistry.getInstance());
        System.out.println(PaymentGatewayClient.INSTANCE.call());
    }
}
```

```text
true
calling gateway
```

**How a singleton can be broken** ([LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/)) and the fix:

| Attack | Fix |
|---|---|
| Two threads create it at once | double-checked locking with `volatile`, or eager init, or holder class, or `enum` |
| Reflection calls the private constructor | throw in the constructor if an instance exists, or use `enum` |
| Serialization creates a new copy on deserialize | implement `readResolve()` returning the instance, or use `enum` |
| Cloning | don't implement `Cloneable` / throw in `clone()` |
| Multiple classloaders | one instance per classloader — know that it's a limitation |

**Interview answer**: "Private constructor, a static accessor, lazy creation made thread-safe with double-checked locking and `volatile` — or just an enum, which also survives reflection and serialization. In Spring I let the container manage it: beans are singletons by default."
**Trap**: forgetting `volatile` — another thread can see a half-constructed object.

---

## 10. Program to an interface: `Map<String,String> map = new HashMap<>()` (LOW)

Asked in [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/): *"why is the left side `Map` and the right side `HashMap`?"*
**Answer**: "The variable type is the **contract** (`Map`), the object is one **implementation**. My code only uses `Map` methods, so I can switch to `LinkedHashMap` (keep insertion order) or `ConcurrentHashMap` (thread safety) by changing one line. It's the Dependency Inversion idea — depend on abstractions — and it's also why Spring injects interfaces."
**Trap**: then calling a `HashMap`-only method — there are none worth it; if you need `TreeMap` navigation methods, declare `NavigableMap`.

---

## 11. `final` vs `finally` vs `finalize` (not reported — quick classic)

| | Meaning |
|---|---|
| `final` | variable: assign once · method: can't override · class: can't extend (`String`) |
| `finally` | block after `try` that runs whether or not an exception happened (not on `System.exit` or JVM crash) |
| `finalize()` | old GC hook — **deprecated** (Java 9) and deprecated **for removal** (Java 18); use try-with-resources / `Cleaner` |

**Trap**: `final List<String> list` — the reference is final, the list is still mutable.

---

⚡ **Quick revision**: 4 pillars + one project example each · interface = capability, abstract class = shared base with state · overloading = compile time, overriding = runtime · static = class-level (hidden, not overridden) · Java is pass-by-value · singleton: DCL + `volatile` or `enum` · declare interfaces on the left.

Next: [Java 2/5 — Collections & HashMap internals →](02-collections-hashmap-internals.md)
