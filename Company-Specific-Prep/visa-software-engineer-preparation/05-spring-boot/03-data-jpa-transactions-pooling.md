# Spring Boot 3/5 — JPA · `@Transactional` · Isolation · Connection Pooling · Schedulers

**Easy analogy — `@Transactional` = UPI transfer ka "all or nothing"**: Paise tumhare account se kate aur dost ke account mein nahi pahunche — aisa kabhi nahi hona chahiye. Ya toh **dono** kaam (debit + credit + ledger entry) honge, ya **koi nahi** (rollback). Connection pool = office ke **shared cabs**: har employee ke liye nayi cab book karna mehenga, isliye 10 cabs ghoomti rehti hain aur jo free ho woh le jaata hai.

| Topic | Visa reports | Freq |
|---|---|---|
| `@Transactional` / rollback of several SQL statements | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (**EC**), [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | **HIGH** (3) |
| JPA / Hibernate ("did you use JPA repository or Hibernate?", "JPA implementation") | [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | **HIGH** (3, senior) |
| `@Scheduled` cron · many instances updating the same row · ShedLock | [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | MEDIUM (senior) |
| Isolation levels | [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | LOW |
| Database connection pool | [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/) | LOW |

---

## 1. JPA vs Hibernate vs Spring Data JPA

| Layer | What it is |
|---|---|
| **JPA** (Jakarta Persistence) | the **specification**: `@Entity`, `EntityManager`, JPQL |
| **Hibernate** | the most common **implementation** of JPA (Spring Boot's default) |
| **Spring Data JPA** | a layer on top: you write an **interface**, Spring generates the repository (CRUD, derived queries, paging) |

**Interview answer ("JPA repository or Hibernate?")**: "Both, really — I used Spring Data JPA repositories, which call JPA, and Hibernate is the JPA provider underneath. For complex queries I used `@Query` with JPQL or native SQL."

```java
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.LockModeType;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

enum PaymentStatus { PENDING, AUTHORIZED, SETTLED, FAILED }

@Entity
@Table(name = "payments")
class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true)
    String idempotencyKey;                                   // DB-level guarantee against double charge

    @Column(nullable = false)
    String merchantId;

    long amountPaise;

    @Enumerated(EnumType.STRING)                             // store "PENDING", not 0 — safe if enum order changes
    PaymentStatus status = PaymentStatus.PENDING;

    @Version                                                 // optimistic locking: concurrent updates detected
    long version;

    protected Payment() {}                                   // JPA needs a no-arg constructor
    Payment(String key, String merchantId, long amountPaise) {
        this.idempotencyKey = key; this.merchantId = merchantId; this.amountPaise = amountPaise;
    }
}

interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByIdempotencyKey(String key);                         // derived query
    List<Payment> findByMerchantIdAndStatus(String merchantId, PaymentStatus s);

    @Query("select coalesce(sum(p.amountPaise), 0) from Payment p where p.merchantId = :m and p.status = 'SETTLED'")
    long settledTotal(@Param("m") String merchantId);                           // JPQL

    @Lock(LockModeType.PESSIMISTIC_WRITE)                                       // SELECT … FOR UPDATE
    @Query("select p from Payment p where p.id = :id")
    Optional<Payment> findForUpdate(@Param("id") Long id);
}
```

**N+1 problem** (classic JPA follow-up): loading 100 orders then touching `order.getItems()` in a loop fires 1 + 100 queries. Fix with `join fetch`, `@EntityGraph`, or batch fetching; keep associations `LAZY` by default.

---

## 2. `@Transactional` — what it really does (HIGH)

```
 caller ──► [ Spring PROXY ] ──► PaymentService.transfer()
              │ begin tx (get connection, autocommit=false)
              │     debit, credit, ledger insert … all on the SAME connection
              │ method returns normally          → COMMIT
              │ RuntimeException / Error thrown  → ROLLBACK
              │ checked exception thrown         → COMMIT (!) unless rollbackFor is set
```

**"If I have a series of SQL statements, how do you manage rollback?"** ([LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/)) → put them in **one** `@Transactional` service method; any runtime exception rolls all of them back.

```java
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.NoSuchElementException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Entity
class Wallet {
    @Id String userId;
    long balancePaise;
    protected Wallet() {}
}

@Entity
class LedgerEntry {
    @Id String id;
    String fromUser;
    String toUser;
    long amountPaise;
    protected LedgerEntry() {}
    LedgerEntry(String id, String from, String to, long amount) { this.id = id; this.fromUser = from; this.toUser = to; this.amountPaise = amount; }
}

interface WalletRepository extends JpaRepository<Wallet, String> {}
interface LedgerRepository extends JpaRepository<LedgerEntry, String> {}

class InsufficientFunds extends RuntimeException {
    InsufficientFunds(String m) { super(m); }
}

@Service
class TransferService {
    private final WalletRepository wallets;
    private final LedgerRepository ledger;
    private final AuditService audit;

    TransferService(WalletRepository wallets, LedgerRepository ledger, AuditService audit) {
        this.wallets = wallets; this.ledger = ledger; this.audit = audit;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)           // one DB transaction for all 3 writes
    public void transfer(String txnId, String from, String to, long amount) {
        Wallet a = wallets.findById(from).orElseThrow(() -> new NoSuchElementException(from));
        Wallet b = wallets.findById(to).orElseThrow(() -> new NoSuchElementException(to));
        if (a.balancePaise < amount) throw new InsufficientFunds("balance too low");   // → rollback
        a.balancePaise -= amount;                                    // dirty checking: saved at commit
        b.balancePaise += amount;
        ledger.save(new LedgerEntry(txnId, from, to, amount));
        audit.record("transfer " + txnId);                           // runs in ITS OWN transaction
    }

    @Transactional(readOnly = true)                                  // hint: no flush, can use replicas
    public long balance(String user) {
        return wallets.findById(user).map(w -> w.balancePaise).orElse(0L);
    }
}

@Service
class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)          // survives the caller's rollback
    public void record(String message) { /* insert into audit_log */ }
}
```

**Propagation (know 3)**: `REQUIRED` (default — join the current transaction or start one) · `REQUIRES_NEW` (suspend the caller's and start a fresh one — audit logs) · `NESTED` (savepoint inside the current one).
**Rollback rules**: default rollback on `RuntimeException` and `Error` only → for checked exceptions use `@Transactional(rollbackFor = Exception.class)`.
**Traps interviewers love**
1. **Self-invocation**: calling `this.transfer()` from another method **in the same class** bypasses the proxy → no transaction. Move it to another bean or call through the proxy.
2. `@Transactional` on a **private** method → ignored (proxies intercept public calls).
3. Catching the exception inside the method and not rethrowing → Spring never sees it → **commit**.
4. Long transactions holding row locks while calling external APIs → move remote calls outside the transaction.

**🗣️ Interview mein aise bolo**: "`@Transactional` ek proxy banata hai — method se pehle transaction start, normal return pe commit, runtime exception pe rollback. Checked exception pe rollback chahiye toh `rollbackFor`. Same class ke andar se call karoge toh proxy bypass ho jaata hai — yeh sabse common bug hai."

---

## 3. Isolation levels (LOW here — detail in the DB section)

| Level | Dirty read | Non-repeatable read | Phantom read | Note |
|---|---|---|---|---|
| READ UNCOMMITTED | possible | possible | possible | almost never used |
| **READ COMMITTED** | no | possible | possible | default in PostgreSQL, Oracle, SQL Server |
| **REPEATABLE READ** | no | no | possible* | default in MySQL InnoDB (*InnoDB blocks most phantoms with gap locks) |
| SERIALIZABLE | no | no | no | safest, slowest (retries on conflicts) |

`@Transactional(isolation = Isolation.REPEATABLE_READ)` overrides the DB default for that transaction. Full explanations with examples: [06-database-sql/01](../06-database-sql/01-sql-and-dbms-concepts.md#6-transactions-acid-isolation-levels).

---

## 4. Connection pooling (HikariCP)

Opening a DB connection = TCP + TLS + authentication → tens of milliseconds. A **pool** keeps N open connections and lends them out per transaction. Spring Boot uses **HikariCP** by default.

```
 app threads (200 Tomcat threads)      pool (maximum-pool-size: 10)       database
 T1 ─┐                                 ┌───────────┐
 T2 ─┼─ borrow ─────────────────────►  │ c1 c2 … c10│ ───────────────────► (max_connections)
 …  ─┘  wait up to connection-timeout  └───────────┘  return after commit/rollback
        (then SQLTransientConnectionException)
```

```
 spring.datasource.hikari.maximum-pool-size=10      # small is usually better than big
 spring.datasource.hikari.minimum-idle=10
 spring.datasource.hikari.connection-timeout=3000   # ms to wait for a free connection
 spring.datasource.hikari.max-lifetime=1800000      # recycle before the DB/network kills it
```

**Interview answer**: "A pool reuses open connections because creating them is expensive. I size it from measurements, not guesses — more connections than the DB can run in parallel only adds contention. Pool exhaustion usually means slow queries or long transactions (for example, calling an external API inside a transaction), so I fix those first. With many service instances I remember that `instances × pool size` must stay under the database's connection limit."

---

## 5. `@Scheduled` jobs on many instances — "won't two instances update the same row?"

Asked to a Senior ([LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/): "How will you ensure multiple instances of cron job workers won't update the same row?") and "ShedLock" to another ([LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/)). With 3 pods, a plain `@Scheduled` job runs **3 times**. Options:

| Option | How | Good for |
|---|---|---|
| **ShedLock** | a lock row in a DB/Redis table; only the instance that grabs it runs the job | "run this job once per schedule" |
| **Claim rows atomically** | `UPDATE … SET status='PROCESSING', owner=:me WHERE id=:id AND status='PENDING'` → proceed only if 1 row updated | many workers sharing a queue of rows |
| `SELECT … FOR UPDATE SKIP LOCKED` | each worker locks different rows, skips locked ones (PostgreSQL/MySQL 8) | parallel batch processing |
| Optimistic locking (`@Version`) | the second writer gets `OptimisticLockException` → retry/skip | rare conflicts |
| Leader election / a single scheduler service | only the leader schedules | bigger platforms |

```java
import java.util.List;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT10M")          // a LockProvider bean (JDBC/Redis) is also needed
class SchedulingConfig {}

interface SettlementRepository extends JpaRepository<Payment, Long> {
    @Query(value = "select id from payments where status = 'AUTHORIZED' order by id limit 100", nativeQuery = true)
    List<Long> nextBatch();

    @Modifying
    @Transactional
    @Query("update Payment p set p.status = 'SETTLED' where p.id = :id and p.status = 'AUTHORIZED'")
    int settleIfStillAuthorized(@Param("id") Long id);           // atomic claim: returns 0 if someone else did it
}

@Component
class NightlySettlementJob {
    private final SettlementRepository repo;

    NightlySettlementJob(SettlementRepository repo) { this.repo = repo; }

    @Scheduled(cron = "0 0 2 * * *", zone = "Asia/Kolkata")    // 02:00 every night
    @SchedulerLock(name = "nightlySettlement", lockAtLeastFor = "PT1M")
    void run() {
        for (Long id : repo.nextBatch()) {
            if (repo.settleIfStillAuthorized(id) == 1) {
                // we won this row → publish "payment settled" event, etc.
            }
        }
    }
}
```

**Interview answer**: "Two layers: ShedLock so only one instance runs the scheduled job, and idempotent row updates — a conditional UPDATE that only succeeds if the row is still in the expected state — so even if two workers overlap, each row is processed once."

---

⚡ **Quick revision**: JPA = spec, Hibernate = implementation, Spring Data = generated repositories · `@Transactional` = proxy; commit on return, rollback on runtime exceptions · watch self-invocation, private methods, swallowed exceptions · READ COMMITTED is the common default · pool small + fast queries + short transactions · scheduled jobs on many pods → ShedLock + conditional updates.

Next: [Spring 4/5 — Security: AuthN vs AuthZ, JWT →](04-security-authn-authz-jwt.md)
