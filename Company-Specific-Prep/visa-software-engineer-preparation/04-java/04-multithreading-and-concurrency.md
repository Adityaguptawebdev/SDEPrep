# Java 4/5 — Multithreading & Concurrency

**Easy analogy — threads = cooks in one kitchen**: Ek kitchen (process) mein kai cooks (threads) — same fridge (heap) use karte hain, par har cook ka apna chopping board (stack). Do cooks ek hi dabbe se ek saath namak nikaalein aur dono "count" update karein → ek update gum (**race condition**). Ek cook ne knife pakda aur board maang raha hai, doosre ne board pakda aur knife maang raha hai → dono ruk gaye (**deadlock**).

| Topic | Visa reports | Freq |
|---|---|---|
| Process vs thread, multithreading basics (OS side) | [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/) | **HIGH** (4) |
| Deadlock: conditions and prevention | [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) | MEDIUM |
| "Predict the output" of thread code | [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) (**EC**) | LOW |
| `synchronized`, monitors & locks, concurrency in your project | [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/), [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/), [LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/) | **HIGH** (3, senior) |
| Thread pools / ExecutorService · CompletableFuture | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/), [LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/) | **HIGH** (3, senior) |
| Static vs instance methods in multithreaded code | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) | LOW |

---

## 1. Process vs thread (+ the OS questions that come with it)

| | Process | Thread |
|---|---|---|
| Memory | own address space | shares the process heap; own stack + registers |
| Creation / switch cost | heavy | light |
| Communication | IPC (pipes, sockets, shared memory) | shared objects (needs synchronisation) |
| Crash impact | isolated | one thread can crash / corrupt the whole process |

**OS terms asked alongside** ([GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/)): *multiprogramming* = several programs in memory so the CPU is never idle · *multitasking* = time-sharing the CPU between tasks · *multiprocessing* = several CPUs/cores running in parallel · *multithreading* = several threads inside one process · *thrashing* = the system spends more time swapping pages than doing work (too little RAM for the working set) · *swap memory* = disk space used as overflow RAM · *kernel* = core of the OS managing CPU, memory, devices, system calls.

**Interview answer**: "A process is an independent program with its own memory; threads are lighter units of execution inside a process that share its heap but have their own stacks. Sharing makes threads fast to communicate but introduces race conditions, so shared mutable state needs synchronisation."

---

## 2. Race condition → three fixes

`count++` is **three** steps (read, add, write). Two threads can read the same value and one update is lost.

```java
class RaceDemo {                                         // output varies — that's the point
    static int unsafeCount = 0;

    public static void main(String[] args) throws InterruptedException {
        Runnable work = () -> { for (int i = 0; i < 100_000; i++) unsafeCount++; };
        Thread t1 = new Thread(work), t2 = new Thread(work);
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("expected 200000, got " + unsafeCount);   // usually less
    }
}
```

**Three correct versions** (deterministic output):

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

class RaceFixes {
    private int syncCount = 0;
    private final AtomicInteger atomicCount = new AtomicInteger();
    private int lockCount = 0;
    private final ReentrantLock lock = new ReentrantLock();

    synchronized void incSync() { syncCount++; }                 // 1. intrinsic lock on `this`
    void incAtomic() { atomicCount.incrementAndGet(); }          // 2. lock-free CAS
    void incLock() {                                             // 3. explicit lock
        lock.lock();
        try { lockCount++; } finally { lock.unlock(); }          // always unlock in finally
    }

    public static void main(String[] args) throws InterruptedException {
        RaceFixes c = new RaceFixes();
        Runnable work = () -> { for (int i = 0; i < 100_000; i++) { c.incSync(); c.incAtomic(); c.incLock(); } };
        Thread t1 = new Thread(work), t2 = new Thread(work);
        t1.start(); t2.start();
        t1.join(); t2.join();                                    // wait for both to finish
        System.out.println(c.syncCount + " " + c.atomicCount.get() + " " + c.lockCount);
    }
}
```

```text
200000 200000 200000
```

**Interview answer**: "A race condition is when the result depends on thread timing because a read-modify-write on shared data isn't atomic. I fix it by making the critical section atomic — `synchronized`, an atomic variable, or a lock — or better, by not sharing mutable state at all (confinement, immutability)."

---

## 3. `synchronized`, monitors, `volatile`

- Every object has a **monitor** (intrinsic lock). `synchronized` method → locks `this`; `static synchronized` → locks the `Class` object; `synchronized (obj) { … }` → locks `obj` (smaller critical section = better).
- `synchronized` gives **mutual exclusion + visibility** (changes are visible to the next thread that takes the same lock). It is **re-entrant** (the same thread can enter again).
- `volatile` gives **visibility and ordering only**, not atomicity: fine for a stop flag, wrong for `count++`.
- `wait()/notify()` must be called while holding the monitor; prefer `java.util.concurrent` (BlockingQueue, CountDownLatch) in real code.

```java
class StopFlag {
    private volatile boolean running = true;                    // without volatile the loop may never see false

    void stop() { running = false; }

    public static void main(String[] args) throws InterruptedException {
        StopFlag f = new StopFlag();
        Thread worker = new Thread(() -> { long spins = 0; while (f.running) spins++; });
        worker.start();
        Thread.sleep(50);
        f.stop();
        worker.join(2000);
        System.out.println("worker stopped: " + !worker.isAlive());
    }
}
```

```text
worker stopped: true
```

**Follow-ups**: `synchronized` vs `ReentrantLock` (lock has `tryLock` with timeout, fairness, multiple conditions, interruptible waits) · `synchronized` on a `String` literal or boxed `Integer` (shared/interned objects — dangerous) · double-checked locking needs `volatile` ([Java 1/5 §9](01-oop-and-class-design.md#9-singleton--and-how-it-breaks-high)).

---

## 4. Deadlock (MEDIUM)

**Four Coffman conditions — all must hold**: (1) mutual exclusion, (2) hold and wait, (3) no preemption, (4) circular wait. Break any one → no deadlock.

```
 Thread A: lock(acc1) ──► wants acc2          acc1 ◄── held by A
 Thread B: lock(acc2) ──► wants acc1          acc2 ◄── held by B      circular wait → both stuck
```

**Prevention used in payments code — lock ordering**: always lock the account with the smaller id first, so a cycle can't form.

```java
class Account2 {
    final int id;
    long balance;
    Account2(int id, long balance) { this.id = id; this.balance = balance; }
}

class SafeTransfer {
    static void transfer(Account2 from, Account2 to, long amount) {
        Account2 first = from.id < to.id ? from : to;             // global order breaks circular wait
        Account2 second = from.id < to.id ? to : from;
        synchronized (first) {
            synchronized (second) {
                if (from.balance >= amount) { from.balance -= amount; to.balance += amount; }
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Account2 a = new Account2(1, 1_000_000), b = new Account2(2, 1_000_000);
        Thread t1 = new Thread(() -> { for (int i = 0; i < 100_000; i++) transfer(a, b, 1); });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 100_000; i++) transfer(b, a, 1); });   // opposite direction
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("total = " + (a.balance + b.balance) + ", no deadlock");
    }
}
```

```text
total = 2000000, no deadlock
```

Other ways out: `tryLock(timeout)` and back off · one coarse lock · avoid holding a lock while calling unknown code · detect with a thread dump (`jstack`) — it prints "Found one Java-level deadlock".
**Interview answer**: "Deadlock needs mutual exclusion, hold-and-wait, no preemption and circular wait. In code I break circular wait with a fixed lock order — e.g. lock accounts by id — or use tryLock with a timeout. In databases the same thing happens with row locks, and the DB detects it and aborts one transaction."

---

## 5. ExecutorService, thread pools, Future

Creating a `new Thread` per task is expensive and unbounded. A **thread pool** reuses a fixed set of threads fed by a queue.

| Factory (Executors) | Behaviour | Watch out |
|---|---|---|
| `newFixedThreadPool(n)` | n threads, unbounded queue | queue can grow → memory |
| `newCachedThreadPool()` | grows as needed, reuses idle threads | can create thousands of threads under load |
| `newSingleThreadExecutor()` | one thread, tasks in order | — |
| `newScheduledThreadPool(n)` | delayed / periodic tasks | — |
| `newVirtualThreadPerTaskExecutor()` (Java 21) | a cheap virtual thread per task | great for blocking I/O |
| `new ThreadPoolExecutor(core, max, keepAlive, queue, rejectPolicy)` | full control | preferred in production (bounded queue) |

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

class PoolDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        try {
            List<Callable<Long>> jobs = new ArrayList<>();
            for (int batch = 1; batch <= 4; batch++) {
                final int b = batch;
                jobs.add(() -> (long) b * 1000);                      // pretend: settle batch b
            }
            long total = 0;
            for (Future<Long> f : pool.invokeAll(jobs)) total += f.get();   // results in submission order
            System.out.println("settled total = " + total);
        } finally {
            pool.shutdown();
            System.out.println("terminated: " + pool.awaitTermination(1, TimeUnit.SECONDS));
        }
    }
}
```

```text
settled total = 10000
terminated: true
```

**Interview answer**: "I use an ExecutorService instead of raw threads: it reuses threads, bounds concurrency and gives me Futures. For production I prefer a ThreadPoolExecutor with a bounded queue and a rejection policy, and I always shut the pool down."

---

## 6. CompletableFuture (Senior report) — async composition

```java
import java.util.concurrent.CompletableFuture;

class AsyncCheckout {
    static long fraudScore(String card) { return card.endsWith("0000") ? 90 : 10; }
    static long balance(String card) { return 5_000; }

    public static void main(String[] args) {
        String card = "4111111111111111";
        CompletableFuture<Long> score = CompletableFuture.supplyAsync(() -> fraudScore(card));   // runs in parallel
        CompletableFuture<Long> funds = CompletableFuture.supplyAsync(() -> balance(card));
        String decision = score.thenCombine(funds, (s, b) -> (s < 50 && b >= 1_000) ? "APPROVED" : "DECLINED")
                .exceptionally(ex -> "DECLINED (error: " + ex.getMessage() + ")")
                .join();
        System.out.println(decision);
    }
}
```

```text
APPROVED
```

**Follow-ups**: `thenApply` vs `thenCompose` (map vs flatMap) · `allOf` for many calls · default pool is the common ForkJoinPool — pass your own executor for blocking I/O · timeouts: `orTimeout(…)` (Java 9+) · Spring `@Async` returns a `CompletableFuture` ([Spring 5/5](../05-spring-boot/05-microservices-and-async.md)).

---

## 7. Producer–consumer with a BlockingQueue

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

class ProducerConsumer {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(2);          // bounded: back-pressure
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 4; i++) queue.put("txn-" + i);          // blocks when full
                queue.put("DONE");                                           // poison pill
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        Thread consumer = new Thread(() -> {
            try {
                String item;
                while (!(item = queue.take()).equals("DONE")) System.out.println("processed " + item);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
    }
}
```

```text
processed txn-1
processed txn-2
processed txn-3
processed txn-4
```

This is the same idea as Kafka/RabbitMQ between services — a bounded buffer that absorbs bursts ([07-system-design](../07-system-design/README.md)).

---

## 8. "Predict the output" — thread snippets (EC report)

A 6–18-month candidate was shown code with threads and asked to predict the output and explain it ([LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/)). Typical traps:

| Snippet | Answer |
|---|---|
| `t.run()` instead of `t.start()` | runs on the **current** thread, no new thread is created |
| calling `start()` twice on the same Thread | `IllegalThreadStateException` |
| two threads printing without `join()` | order is **not** guaranteed |
| `main` ends before a non-daemon thread | JVM waits for the non-daemon thread; daemon threads are killed |
| `synchronized` instance method + `static synchronized` method | don't block each other (different locks) |

```java
class RunVsStart {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("running in: " + Thread.currentThread().getName()), "worker");
        t.run();                                                  // plain method call on main
        t.start();                                                // real new thread
        t.join();
        try { t.start(); } catch (IllegalThreadStateException e) { System.out.println("can't start twice"); }
    }
}
```

```text
running in: main
running in: worker
can't start twice
```

---

⚡ **Quick revision**: process = own memory, thread = shared heap + own stack · race = non-atomic read-modify-write → synchronized / Atomic / Lock · volatile = visibility only · deadlock = 4 conditions → lock ordering / tryLock · use pools, not raw threads; bounded queues · CompletableFuture for parallel calls · `run()` ≠ `start()`.

Next: [Java 5/5 — Java 8+ streams & modern Java →](05-java8-streams-and-modern-java.md)
