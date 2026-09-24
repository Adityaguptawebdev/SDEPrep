# SQL 06 — Transactions, ACID & Concurrency

> **Level**: Intermediate · **Read time**: ~25 min

> **Definition**: A **transaction** is a group of SQL statements that the database treats as **one single unit of work** — either **all** of them succeed (`COMMIT`) or **none** of them take effect (`ROLLBACK`).

**In one line**: Transaction = "all or nothing". ACID = the four promises a database makes about transactions.

**Easy analogy — money transfer at an ATM / UPI**: Tum dost ko ₹300 bhejte ho. Do kaam hone chahiye: *tumhare account se −300* **aur** *dost ke account mein +300*. App beech mein crash ho jaye toh tumhare ₹300 kat jayein aur dost ko na mile — yeh nahi chalega. Isliye dono steps ek transaction mein: ya toh **dono ho jayein**, ya **kuch bhi nahi** (sab undo).

```
 BEGIN
   UPDATE accounts SET balance = balance - 300 WHERE id = 1;   ← step 1
   UPDATE accounts SET balance = balance + 300 WHERE id = 2;   ← step 2
 COMMIT     ← both saved permanently
 (or ROLLBACK ← both undone, as if nothing happened)
```

---

## 1. Transaction commands

| Command | Meaning |
|---|---|
| `BEGIN` / `START TRANSACTION` | start a transaction |
| `COMMIT` | save all changes permanently |
| `ROLLBACK` | undo everything since `BEGIN` |
| `SAVEPOINT name` / `ROLLBACK TO name` | undo only part of the work |

```sql
CREATE TABLE accounts (
    id      INT PRIMARY KEY,
    owner   VARCHAR(50),
    balance INT CHECK (balance >= 0)
);
INSERT INTO accounts VALUES (1, 'Anil', 1000), (2, 'Bina', 500);

BEGIN;
UPDATE accounts SET balance = balance - 300 WHERE id = 1;
UPDATE accounts SET balance = balance + 300 WHERE id = 2;
COMMIT;

SELECT * FROM accounts ORDER BY id;
```

```result
id | owner | balance
---+-------+--------
 1 | Anil  |     700
 2 | Bina  |     800
(2 rows)
```

`ROLLBACK` throws the changes away:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
ROLLBACK;
SELECT * FROM accounts ORDER BY id;
```

```result
id | owner | balance
---+-------+--------
 1 | Anil  |     700
 2 | Bina  |     800
(2 rows)
```

> 💡 Most databases run in **auto-commit** mode: every single statement is its own transaction. You need `BEGIN` to group several statements.

---

## 2. ACID — the four promises

| Letter | Property | Meaning | How the database does it |
|---|---|---|---|
| **A** | **Atomicity** | all steps happen or none | **undo log** (rollback) |
| **C** | **Consistency** | data always moves from one **valid** state to another (constraints hold) | constraints, triggers, your rules |
| **I** | **Isolation** | transactions running together do not disturb each other | **locks** / **MVCC** |
| **D** | **Durability** | once committed, data survives a crash or power cut | **write-ahead log (WAL)** / redo log on disk |

```
 Atomicity   → "all or nothing"
 Consistency → "rules never broken" (balance can't go negative, totals match)
 Isolation   → "my transaction works as if it were alone"
 Durability  → "committed = permanent"
```

---

## 3. What can go wrong when transactions run at the same time

Two users use the same data together. These are the **concurrency problems**:

**Dirty read** — you read data another transaction has **not committed** yet (and it may be rolled back).

```
 T1: UPDATE balance = 0        (not committed)
                                  T2: SELECT balance → 0      ← dirty read
 T1: ROLLBACK                     (balance was never really 0!)
```

**Non-repeatable read** — you read the **same row twice** and get **different values**, because someone committed a change in between.

```
 T1: SELECT balance → 1000
                                  T2: UPDATE balance = 500; COMMIT
 T1: SELECT balance → 500        ← same query, different answer
```

**Phantom read** — you run the **same range query twice** and a **new row** appears (or disappears).

```
 T1: SELECT COUNT(*) WHERE dept = 1 → 5
                                  T2: INSERT employee (dept = 1); COMMIT
 T1: SELECT COUNT(*) WHERE dept = 1 → 6      ← a "phantom" row
```

**Lost update** — two transactions read the same value, both change it, and one overwrites the other.

```
 balance = 100
 T1: reads 100                    T2: reads 100
 T1: writes 100 + 50 = 150
                                  T2: writes 100 + 20 = 120     ← T1's +50 is lost (should be 170)
```

---

## 4. Isolation levels

Higher isolation = safer but **slower** (more locking / waiting). ✅ = prevented, ❌ = can happen.

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| **Read Uncommitted** | ❌ | ❌ | ❌ |
| **Read Committed** | ✅ | ❌ | ❌ |
| **Repeatable Read** | ✅ | ✅ | ❌ (standard) |
| **Serializable** | ✅ | ✅ | ✅ |

| Database | Default level |
|---|---|
| MySQL (InnoDB) | Repeatable Read (it also blocks most phantoms) |
| PostgreSQL, Oracle, SQL Server | Read Committed |

```mysql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;      -- for the next transaction
START TRANSACTION;
```

**MVCC** (Multi-Version Concurrency Control): instead of blocking, the database keeps **several versions** of a row. Readers see a consistent snapshot, so **readers do not block writers** and writers do not block readers (PostgreSQL, MySQL InnoDB, Oracle).

---

## 5. Locks

| Lock | Meaning |
|---|---|
| **Shared (S)** lock | many transactions can **read** together; nobody can write |
| **Exclusive (X)** lock | one transaction **writes**; others must wait |
| **Row-level** vs **table-level** | row locks = more concurrency; table locks = simple but blocking |

### Pessimistic vs optimistic locking

| | Pessimistic | Optimistic |
|---|---|---|
| Idea | "Someone will conflict — **lock first**" | "Conflicts are rare — **check at the end**" |
| How | `SELECT … FOR UPDATE` | a `version` column checked in `WHERE` |
| Best when | high contention (bank balance, ticket booking) | low contention (profile edit) |

```mysql
-- Pessimistic: lock the row until COMMIT
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

```mysql
-- Optimistic: succeeds only if nobody changed the row since we read version 7
UPDATE accounts SET balance = 900, version = version + 1
WHERE id = 1 AND version = 7;          -- 0 rows updated → conflict → re-read and retry
```

The simplest fix for a lost update is often to let the database do the maths atomically: `UPDATE accounts SET balance = balance + 50 WHERE id = 1;` (no read-then-write in your app).

---

## 6. Deadlock

Two transactions each hold a lock the other one needs — both wait forever.

```
 T1: locks row A ───────────► wants row B  ─┐
                                            │  circular wait = DEADLOCK
 T2: locks row B ───────────► wants row A  ─┘
```

- The database **detects** it and **kills one transaction** (the "victim"); the other continues.
- **Avoid** it: always lock rows in the **same order**, keep transactions **short**, and **retry** the victim.

---

## 7. Savepoint

```sql
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 1;
SAVEPOINT after_first_step;
UPDATE accounts SET balance = balance - 100 WHERE id = 2;      -- oops, wrong account
ROLLBACK TO after_first_step;                                  -- undo only the second update
COMMIT;
SELECT * FROM accounts ORDER BY id;
```

```result
id | owner | balance
---+-------+--------
 1 | Anil  |     650
 2 | Bina  |     800
(2 rows)
```

---

> 🗣️ **Interview mein aise bolo**: *"Transaction all-or-nothing hai. ACID = Atomicity, Consistency, Isolation, Durability. Isolation jitna high, safety utni zyada lekin speed utni kam."*

## ⚡ Quick revision

- Transaction = **all or nothing**. `BEGIN … COMMIT` or `ROLLBACK`.
- **ACID**: Atomicity (undo log), Consistency (constraints), Isolation (locks/MVCC), Durability (WAL).
- Problems: **dirty read**, **non-repeatable read**, **phantom read**, **lost update**.
- Isolation levels (low → high): Read Uncommitted → Read Committed → Repeatable Read → Serializable.
- Defaults: MySQL = Repeatable Read, PostgreSQL / Oracle / SQL Server = Read Committed.
- **Deadlock** = circular wait → DB kills a victim → keep lock order same, retry.
- Pessimistic = lock first (`FOR UPDATE`), Optimistic = version column.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [07-normalization-and-schema-design.md](07-normalization-and-schema-design.md)
