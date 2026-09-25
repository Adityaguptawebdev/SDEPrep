# DB 1/3 — SQL & DBMS Concepts (what Visa candidates were asked)

> Every ```sql block runs in **SQLite 3.51**; the ```text under it is the real output. For deeper theory the repo already has tested notes: [Database/SQL](../../../Database/SQL/01-sql-basics.md) — this file is the **Visa-focused** layer on top.

**Easy analogy — database = bank ka locker room**: **Primary key** = locker number (unique), **foreign key** = "yeh chaabi us locker ki hai" wala link, **index** = register jo batata hai kaunsa locker kis row mein hai (dhoondhna fast), **transaction** = do lockers ke beech paisa shift karna — ya poora hoga ya bilkul nahi, **normalization** = ek hi cheez do jagah mat rakho, warna ek jagah update karke doosri bhool jaoge.

| Topic | Visa reports | Freq |
|---|---|---|
| Joins (all types, self-join, two-table queries) | [LC-7104374](https://leetcode.com/discuss/post/7104374/big-data-engineer-interview-at-visa-by-a-p2p6/), [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) (**EC**), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) | **HIGH** (4) |
| ACID / transactions | [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/), [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/) | MEDIUM |
| GROUP BY / HAVING | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (**EC**), [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/) | MEDIUM |
| Indexes / query optimisation | [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) (**EC**), [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/) (**EC**), [LC-7104374](https://leetcode.com/discuss/post/7104374/big-data-engineer-interview-at-visa-by-a-p2p6/), [LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/) | **HIGH** (4) |
| Window functions / RANK | [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-7104374](https://leetcode.com/discuss/post/7104374/big-data-engineer-interview-at-visa-by-a-p2p6/) | MEDIUM |
| Keys (PK/FK/composite) · DB types | [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/), [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | **HIGH** (3) |
| Normalization | [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/) | LOW |
| Views, triggers | [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/) | LOW |
| Isolation levels | [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | LOW |
| DDL vs DML · cursors · schema changes in production | [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | LOW |
| DELETE vs TRUNCATE vs DROP · subquery vs CTE vs correlated | [LC-7104374](https://leetcode.com/discuss/post/7104374/big-data-engineer-interview-at-visa-by-a-p2p6/) | LOW |
| Data integrity strategies · keeping the order of data written to the DB | [JT-2024-10](https://www.jointaro.com/interviews/companies/visa/experiences/software-developer-bengaluru-october-1-2024-no-offer-positive-6df1bf4d/), [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) | MEDIUM |

Sample tables used below:

```sql
DROP TABLE IF EXISTS txn; DROP TABLE IF EXISTS merchant;
CREATE TABLE merchant (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, city TEXT);
CREATE TABLE txn (id INTEGER PRIMARY KEY,
                  merchant_id INTEGER REFERENCES merchant(id),
                  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
                  status TEXT NOT NULL,
                  created_at TEXT NOT NULL);
INSERT INTO merchant VALUES (1,'ChaiPoint','Bengaluru'),(2,'BookNook','Pune'),(3,'NewShop','Delhi');
INSERT INTO txn VALUES
 (1,1,15000,'SUCCESS','2025-09-01'),(2,1,22000,'SUCCESS','2025-09-02'),(3,2,99000,'FAILED','2025-09-02'),
 (4,2,45000,'SUCCESS','2025-09-03'),(5,1,5000,'SUCCESS','2025-09-04'),(6,NULL,1000,'SUCCESS','2025-09-04');
```

---

## 1. Keys and database types

| Key | Meaning | Example |
|---|---|---|
| Primary key | unique + not null, identifies a row | `txn.id` |
| Candidate key | any column set that *could* be the PK | `merchant.name` (unique) |
| Composite key | PK made of 2+ columns | `deployment(server_id, service_id)` |
| Foreign key | references another table's key → referential integrity | `txn.merchant_id → merchant.id` |
| Unique key | unique but may allow NULL | `idempotency_key` |
| Surrogate vs natural | generated id vs real-world value | `id` vs card-number (don't use sensitive data as keys) |

**Database types with examples** (asked to an NCG): relational (PostgreSQL, MySQL, Oracle) · document (MongoDB) · key-value (Redis, DynamoDB) · wide-column (Cassandra) · graph (Neo4j) · time-series (InfluxDB) · search (Elasticsearch). A payment ledger is relational; a session cache is key-value; fraud relationship analysis can be graph.

## 2. DDL / DML / DCL / TCL and DELETE vs TRUNCATE vs DROP

| Group | Commands | Purpose |
|---|---|---|
| DDL | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` | define structure |
| DML | `SELECT`, `INSERT`, `UPDATE`, `DELETE` | work with data |
| DCL | `GRANT`, `REVOKE` | permissions |
| TCL | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | transactions |

| | `DELETE` | `TRUNCATE` | `DROP` |
|---|---|---|---|
| Removes | chosen rows (`WHERE`) | all rows | the whole table (structure too) |
| Rollback | yes (DML, logged per row) | usually not / engine-specific | no |
| Triggers fire | yes | no | no |
| Speed | slow for big tables | fast | fast |

## 3. Joins (HIGH)

```sql
SELECT m.name, t.id AS txn_id, t.amount_paise
FROM merchant m
LEFT JOIN txn t ON t.merchant_id = m.id AND t.status = 'SUCCESS'
ORDER BY m.id, t.id;
```

```text
name       txn_id  amount_paise
---------  ------  ------------
ChaiPoint  1       15000       
ChaiPoint  2       22000       
ChaiPoint  5       5000        
BookNook   4       45000       
NewShop                        
```

- `INNER JOIN` → only matching rows (NewShop would disappear). `LEFT JOIN` → all merchants, NULLs where no transaction.
- Putting `t.status = 'SUCCESS'` in the **ON** clause keeps NewShop; putting it in **WHERE** would remove it (WHERE runs after the join and NULL ≠ 'SUCCESS').
- Transaction 6 has no merchant — only a `RIGHT`/`FULL` join (or starting from `txn`) would show it. That's why `merchant_id` should be `NOT NULL` + FK.

## 4. WHERE vs HAVING and the logical order of a query

```
 FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
 (rows)      (row filter)       (group filter)     (columns)            (paging)
```

```sql
SELECT m.name, COUNT(*) AS txns, SUM(t.amount_paise) AS total
FROM txn t JOIN merchant m ON m.id = t.merchant_id
WHERE t.status = 'SUCCESS'                 -- row-level condition
GROUP BY m.name
HAVING SUM(t.amount_paise) > 40000         -- group-level condition (aggregate)
ORDER BY total DESC;
```

```text
name       txns  total
---------  ----  -----
BookNook   1     45000
ChaiPoint  3     42000
```

The EC candidate's bug in [DB 2/3 §1](02-reported-sql-problems.md#1-students-per-department-with-cgpa--9) was exactly putting a row condition in `HAVING`.

## 5. Subquery vs correlated subquery vs CTE

```sql
WITH merchant_totals AS (                  -- CTE: a named, readable subquery
  SELECT merchant_id, SUM(amount_paise) AS total FROM txn WHERE status = 'SUCCESS' GROUP BY merchant_id
)
SELECT m.name, mt.total,
       (SELECT COUNT(*) FROM txn t2 WHERE t2.merchant_id = m.id) AS all_attempts   -- correlated: runs per row
FROM merchant m JOIN merchant_totals mt ON mt.merchant_id = m.id
WHERE mt.total > (SELECT AVG(total) FROM merchant_totals)                        -- plain subquery
ORDER BY m.name;
```

```text
name       total  all_attempts
---------  -----  ------------
BookNook   45000  2           
ChaiPoint  42000  3           
```

A **correlated** subquery references the outer row (`m.id`), so conceptually it runs once per outer row — often rewritable as a join/window for speed.

## 6. Transactions, ACID, isolation levels

| Letter | Meaning | Payments example |
|---|---|---|
| **A**tomicity | all or nothing | debit + credit both happen or neither |
| **C**onsistency | constraints always hold | balance never negative (CHECK), FK valid |
| **I**solation | concurrent transactions don't see each other's half-done work | two refunds on one payment don't both succeed |
| **D**urability | committed = survives a crash | write-ahead log flushed before "OK" |

```sql
DROP TABLE IF EXISTS wallet;
CREATE TABLE wallet (user_id TEXT PRIMARY KEY, balance INTEGER NOT NULL CHECK (balance >= 0));
INSERT INTO wallet VALUES ('asha', 500), ('ravi', 100);
BEGIN;
UPDATE wallet SET balance = balance - 300 WHERE user_id = 'asha';   -- debit
UPDATE wallet SET balance = balance + 300 WHERE user_id = 'ravi';   -- credit
SELECT user_id, balance FROM wallet ORDER BY user_id;               -- inside the transaction
ROLLBACK;                                                           -- e.g. the fraud check failed afterwards
SELECT user_id, balance FROM wallet ORDER BY user_id;               -- both changes undone together
```

```text
user_id  balance
-------  -------
asha     200    
ravi     400    
user_id  balance
-------  -------
asha     500    
ravi     100    
```

Both updates disappeared together — that's **atomicity**. And if a statement breaks a rule (say `asha − 700` → balance −200), the `CHECK (balance >= 0)` constraint rejects it with an error and the application rolls the whole transaction back — that's **consistency** enforced by the database.

**Isolation anomalies and levels** (details + Spring usage: [Spring 3/5 §3](../05-spring-boot/03-data-jpa-transactions-pooling.md#3-isolation-levels-low-here--detail-in-the-db-section)):

| Anomaly | What happens |
|---|---|
| Dirty read | you read another transaction's **uncommitted** change (it may roll back) |
| Non-repeatable read | you read a row twice and get different values (someone committed in between) |
| Phantom read | you run the same range query twice and **new rows** appear |
| Lost update | two transactions read-modify-write the same row; one overwrites the other |

READ UNCOMMITTED < **READ COMMITTED** (common default) < REPEATABLE READ < SERIALIZABLE. Lost updates are prevented with `SELECT … FOR UPDATE` (pessimistic) or a version column (optimistic, `@Version`).

## 7. Indexes (HIGH) and query optimisation

- An index (usually a **B+ tree**) is a sorted copy of some columns + pointers → lookups in O(log n) instead of scanning the table.
- **Composite index** `(a, b, c)` helps queries filtering on `a`, `a,b`, `a,b,c` (**leftmost prefix**), not on `b` alone.
- **Covering index** contains every column the query needs → the table isn't touched at all.
- Costs: extra storage, slower `INSERT/UPDATE/DELETE`, and too many indexes confuse the planner.
- Index is **not used** when you wrap the column in a function (`WHERE date(created_at) = …`), use a leading wildcard (`LIKE '%abc'`), compare with a different type, or the filter matches most rows (low selectivity).

```sql
CREATE INDEX ix_txn_merchant_status ON txn(merchant_id, status);
EXPLAIN QUERY PLAN SELECT id FROM txn WHERE merchant_id = 1 AND status = 'SUCCESS';
```

```text
QUERY PLAN
`--SEARCH txn USING COVERING INDEX ix_txn_merchant_status (merchant_id=? AND status=?)
```

```sql
EXPLAIN QUERY PLAN SELECT id FROM txn WHERE status = 'SUCCESS';   -- not the leftmost column
```

```text
QUERY PLAN
`--SCAN txn
```

**Lesson from a Staff report** ([LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/)): asked to "create an index on an imaginary table", the candidate indexed column 1 while the interviewer expected column 5. **Always ask "which queries run most often?" before choosing index columns.**
**Optimisation checklist to say**: EXPLAIN first → add/adjust indexes for WHERE/JOIN/ORDER BY columns → select only needed columns → avoid N+1 queries → paginate with keyset instead of big OFFSETs (§10) → cache hot reads → archive/partition huge tables.

## 8. Window functions

```sql
SELECT id, merchant_id, amount_paise,
       SUM(amount_paise) OVER (PARTITION BY merchant_id ORDER BY id) AS running_total,
       DENSE_RANK() OVER (ORDER BY amount_paise DESC)               AS amount_rank
FROM txn WHERE status = 'SUCCESS' AND merchant_id IS NOT NULL
ORDER BY merchant_id, id;
```

```text
id  merchant_id  amount_paise  running_total  amount_rank
--  -----------  ------------  -------------  -----------
1   1            15000         15000          3          
2   1            22000         37000          2          
5   1            5000          42000          4          
4   2            45000         45000          1          
```

Window functions compute across related rows **without collapsing them** (unlike `GROUP BY`). `ROW_NUMBER` (unique 1, 2, 3), `RANK` (1, 2, 2, 4), `DENSE_RANK` (1, 2, 2, 3), `LAG/LEAD` (previous/next row), running totals.

## 9. Normalization (and when to denormalize)

```
 Unnormalized: txn(id, merchant_name, merchant_city, items="tea,cake")
 1NF: atomic values, no repeating groups       → items moved to txn_item(txn_id, item)
 2NF: no partial dependency on part of a composite key
 3NF: no transitive dependency (non-key → non-key): merchant_city depends on merchant, not on txn
      → merchant(id, name, city) + txn(id, merchant_id, …)
 BCNF: every determinant is a candidate key
```

**Why**: no update anomalies (change a city in one place), less duplicate data. **Denormalize deliberately** for read-heavy reporting (precomputed daily totals), accepting the job of keeping copies in sync.

## 10. Views, triggers, cursors, pagination

```sql
CREATE VIEW merchant_daily AS
  SELECT merchant_id, created_at AS day, SUM(amount_paise) AS total
  FROM txn WHERE status = 'SUCCESS' AND merchant_id IS NOT NULL
  GROUP BY merchant_id, created_at;

DROP TABLE IF EXISTS audit_log;
CREATE TABLE audit_log (txn_id INTEGER, old_status TEXT, new_status TEXT);
CREATE TRIGGER trg_txn_status AFTER UPDATE OF status ON txn
BEGIN
  INSERT INTO audit_log VALUES (OLD.id, OLD.status, NEW.status);    -- automatic audit trail
END;

UPDATE txn SET status = 'REFUNDED' WHERE id = 4;
SELECT * FROM merchant_daily ORDER BY merchant_id, day;   -- a view is re-evaluated on every read
SELECT * FROM audit_log;
```

```text
merchant_id  day         total
-----------  ----------  -----
1            2025-09-01  15000
1            2025-09-02  22000
1            2025-09-04  5000 
txn_id  old_status  new_status
------  ----------  ----------
4       SUCCESS     REFUNDED  
```

BookNook (merchant 2) no longer appears in the view: its only successful transaction was just refunded, and a normal view always reflects the current table data.

- **View** = a saved query (virtual table): simplify complex joins, restrict columns for security. A **materialized view** stores the result and must be refreshed.
- **Trigger** = code the DB runs automatically on INSERT/UPDATE/DELETE: audit logs, derived columns. Use sparingly — hidden logic is hard to debug and slows writes.
- **Database cursor** = a server-side pointer to iterate a result set row by row (stored procedures, JDBC streaming) — not the same as **cursor-based pagination** (an intern gave the wrong answer here, [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/)):

```sql
-- OFFSET pagination: page 3 = skip 2 pages (slow for deep pages; rows shift if new data arrives)
SELECT id, amount_paise FROM txn ORDER BY id LIMIT 2 OFFSET 2;
-- Keyset / cursor pagination: "give me 2 rows after the last id I saw" (fast, stable)
SELECT id, amount_paise FROM txn WHERE id > 2 ORDER BY id LIMIT 2;
```

```text
id  amount_paise
--  ------------
3   99000       
4   45000       
id  amount_paise
--  ------------
3   99000       
4   45000       
```

Same rows here, but the keyset version uses the index to jump straight to `id > 2` and doesn't skip/duplicate rows when new transactions are inserted between page loads — that's what a "next page cursor" in an API usually encodes.

## 11. Data integrity strategies & keeping write order (managerial / project questions)

Asked as project discussions: *"data integrity strategies for backend systems"* ([JT-2024-10](https://www.jointaro.com/interviews/companies/visa/experiences/software-developer-bengaluru-october-1-2024-no-offer-positive-6df1bf4d/)) and *"how can we maintain the order of data which we send to the database?"* — a 30-minute discussion that decided a rejection ([LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/)).

**Integrity toolkit**: constraints (`NOT NULL`, `UNIQUE`, `CHECK`, FKs) · transactions around multi-row changes · validation at the API · idempotency keys for retries · optimistic locking (`@Version`) · audit trails (triggers/outbox) · reconciliation jobs (compare ledger vs processor reports) · backups + point-in-time recovery.

**Keeping order** (think out loud through these):
1. Where can order break? multiple app instances, retries, async queues, parallel consumers.
2. Give each event an **ordering key + sequence number** (or a monotonic version per entity) created at the source.
3. Route all events of one entity to **one place in order** — e.g. Kafka partition keyed by account id, one consumer per partition.
4. At the DB: apply only if `new_seq = last_seq + 1` (or `>` last) in a conditional UPDATE; buffer or reject out-of-order ones; make writes idempotent so retries don't duplicate.
5. Don't rely on wall-clock timestamps from different machines for ordering (clock skew).

---

⚡ **Quick revision**: PK/FK/composite keys · ON vs WHERE in LEFT JOIN · WHERE (rows) before HAVING (groups) · CTE for readability, correlated subquery runs per row · ACID + anomalies + READ COMMITTED default · composite index = leftmost prefix; covering index; functions on columns kill indexes · DENSE_RANK for N-th highest · 3NF, denormalize on purpose · keyset pagination over OFFSET · order = per-key sequence + single ordered pipeline + conditional idempotent writes.

Next: [DB 2/3 — every SQL question reported, with tested answers →](02-reported-sql-problems.md)
