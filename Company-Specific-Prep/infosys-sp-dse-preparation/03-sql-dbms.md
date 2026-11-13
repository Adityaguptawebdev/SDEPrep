# 03 — SQL & DBMS

**Legend:** 📌 **Reported** (source ID → [sources.md](sources.md)) · 🧪 **Practice**.
SQL was asked in almost every SP/DSE interview report, often **in both rounds** [LC-8218681]. Every query below was run in SQLite in this order. The same SQL works in MySQL 8+ (where MySQL differs, it's noted).

> 💡 A candidate's tip: LeetCode's [Top SQL 50](https://leetcode.com/studyplan/top-sql-50/) is enough, but also practise **INSERT / UPDATE / DELETE**, because online judges rarely ask them [LC-8218681].

**Sample tables:**

```sql
CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(30), salary INT, sex CHAR(1), dept_id INT);
INSERT INTO Employee VALUES
 (1,'Asha',90000,'f',1),(2,'Ravi',70000,'m',1),(3,'Neha',70000,'f',2),
 (4,'Amit',50000,'m',2),(5,'Ravi',40000,'m',3),(6,'Kiran',30000,'f',3);
```

---

## Queries — 📌 reported

**Q1. Nth highest salary: with a subquery, then without one (LIMIT/OFFSET)** — 📌 SP, Sep 2025 [LC-7233197]. Also asked as the 2nd [LC-8278419], 4th [LCO-2] and 10th highest [LC-8561188]. · [LC 176](https://leetcode.com/problems/second-highest-salary/), [LC 177](https://leetcode.com/problems/nth-highest-salary/)

```sql
-- 2nd highest, subquery
SELECT MAX(salary) AS second_highest FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);                    -- 70000

-- Nth highest (N = 3), correlated subquery: exactly N-1 distinct salaries are bigger
SELECT DISTINCT salary FROM Employee e1
WHERE 3 - 1 = (SELECT COUNT(DISTINCT salary) FROM Employee e2 WHERE e2.salary > e1.salary); -- 50000

-- Nth highest without a subquery: skip N-1 distinct values
SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 2;   -- 50000

-- with a window function (also handles "all employees having the Nth salary")
SELECT name, salary FROM (
  SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM Employee
) t WHERE rnk = 3;                                                     -- Amit 50000
```

**Q2. RANK vs DENSE_RANK vs ROW_NUMBER** — 📌 [LC-7233197, LC-8278419]

```sql
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,     -- 1,2,3,4,5,6  always unique
       RANK()       OVER (ORDER BY salary DESC) AS rnk,    -- 1,2,2,4,5,6  ties share, then a gap
       DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk    -- 1,2,2,3,4,5  ties share, no gap
FROM Employee;
```
`ROW_NUMBER()` is used for "pick one row per group", for example the latest order per customer: `PARTITION BY customer ORDER BY date DESC` → `rn = 1`.

**Q3. Find duplicate employees** — 📌 SP, Sep 2025 [LCO-2] · [LC 182](https://leetcode.com/problems/duplicate-emails/)

```sql
SELECT name, COUNT(*) AS times FROM Employee
GROUP BY name HAVING COUNT(*) > 1;                                     -- Ravi 2
```

**Q4. Full name from first, middle and last name, where middle/last can be NULL** — 📌 SP L3, Jan 2026 [LC-8433956]

```sql
CREATE TABLE Person (first_name VARCHAR(20), middle_name VARCHAR(20), last_name VARCHAR(20));
INSERT INTO Person VALUES ('Rahul','Kumar','Sharma'), ('Priya',NULL,'Iyer'), ('Arjun',NULL,NULL);

SELECT CONCAT_WS(' ', first_name, middle_name, last_name) AS full_name FROM Person;
-- Rahul Kumar Sharma | Priya Iyer | Arjun       (CONCAT_WS skips NULLs)
```
`CONCAT(first, ' ', middle)` returns **NULL** if any part is NULL. That's the trap. `COALESCE(middle_name, '')` is the other fix.

**Q5. Swap the values 'm' and 'f' with one UPDATE** — 📌 SP L1/L2, Sep 2026 [LC-8573384] · [LC 627](https://leetcode.com/problems/swap-sex-of-employees/)

```sql
UPDATE Employee SET sex = CASE sex WHEN 'm' THEN 'f' ELSE 'm' END;
UPDATE Employee SET sex = CASE sex WHEN 'm' THEN 'f' ELSE 'm' END;   -- run twice → back to the original
```

**Q6. For every day and department, count the successful transactions** — 📌 DSE/SP on-campus, Sep 2026 [LC-8512263]

```sql
CREATE TABLE Transactions (product_id INT, dept_id INT, transaction_date DATE, price INT, status VARCHAR(10));
INSERT INTO Transactions VALUES
 (1,1,'2026-09-01',100,'success'),(2,1,'2026-09-01',200,'failed'),
 (3,2,'2026-09-01',150,'success'),(1,1,'2026-09-02',100,'success'),(4,1,'2026-09-02',120,'success');

SELECT transaction_date, dept_id,
       SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS success_count
FROM Transactions
GROUP BY transaction_date, dept_id
ORDER BY transaction_date, dept_id;
-- 09-01 dept1 1 · 09-01 dept2 1 · 09-02 dept1 2
```
Using `SUM(CASE …)` instead of `WHERE status = 'success'` also keeps the groups that have **0** successes. A plain join with `Products` is needed only if the department lives in that table.

**Q7. Trips and Users (cancellation rate)** — 📌 HWI L2 interview, Apr 2026: "one SQL hard query" [LC-8100039] · [LC 262](https://leetcode.com/problems/trips-and-users/)

```sql
CREATE TABLE Users (users_id INT, banned VARCHAR(3), role VARCHAR(10));
CREATE TABLE Trips (id INT, client_id INT, driver_id INT, status VARCHAR(30), request_at VARCHAR(10));
INSERT INTO Users VALUES (1,'No','client'),(2,'Yes','client'),(3,'No','client'),(4,'No','client'),
                         (10,'No','driver'),(11,'No','driver'),(12,'No','driver'),(13,'No','driver');
INSERT INTO Trips VALUES
 (1,1,10,'completed','2013-10-01'),(2,2,11,'cancelled_by_driver','2013-10-01'),
 (3,3,12,'completed','2013-10-01'),(4,4,13,'cancelled_by_client','2013-10-01'),
 (5,1,10,'completed','2013-10-02'),(6,2,11,'completed','2013-10-02'),
 (7,3,12,'completed','2013-10-02'),(8,2,12,'completed','2013-10-03'),
 (9,3,10,'completed','2013-10-03'),(10,4,13,'cancelled_by_driver','2013-10-03');

SELECT t.request_at AS Day,
       ROUND(SUM(CASE WHEN t.status <> 'completed' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 2) AS "Cancellation Rate"
FROM Trips t
JOIN Users c ON t.client_id = c.users_id AND c.banned = 'No'
JOIN Users d ON t.driver_id = d.users_id AND d.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at;
-- 2013-10-01 0.33 · 2013-10-02 0.0 · 2013-10-03 0.5
```

**Q8. Joins + an aggregate per department** — 📌 joins asked in [LC-8278419, LC-8531964]

```sql
CREATE TABLE Dept (id INT PRIMARY KEY, dname VARCHAR(20));
INSERT INTO Dept VALUES (1,'Tech'),(2,'Risk'),(3,'HR'),(4,'Legal');

SELECT d.dname, COUNT(e.id) AS employees, COALESCE(MAX(e.salary), 0) AS top_salary
FROM Dept d LEFT JOIN Employee e ON e.dept_id = d.id
GROUP BY d.dname ORDER BY d.dname;
-- HR 2 40000 · Legal 0 0 · Risk 2 70000 · Tech 2 90000
```
`LEFT JOIN` keeps **Legal** (no employees). `COUNT(e.id)` gives 0 there, while `COUNT(*)` would wrongly give 1.

🧪 **Practice next:** [LC 185 Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries/) · [LC 178 Rank Scores](https://leetcode.com/problems/rank-scores/) · [LC 196 Delete Duplicate Emails](https://leetcode.com/problems/delete-duplicate-emails/)

---

## Short-answer theory — 📌 reported

**DELETE vs TRUNCATE vs DROP** ("at least 3 differences") — 📌 [LC-8278125, LCO-2]

| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| Removes | chosen rows (`WHERE`) | all rows | the whole table + structure |
| Type | DML | DDL | DDL |
| Rollback | yes (inside a transaction) | not in MySQL (auto-commit) | no |
| Triggers fire | yes | no | no |
| Speed / logging | slow, row by row | fast, deallocates pages | fast |
| Auto-increment | keeps counting | resets | gone |

**COUNT(\*) vs COUNT(column)** — 📌 [LC-8278419]: `COUNT(*)` counts **all rows**. `COUNT(col)` skips rows where `col` is **NULL**. `COUNT(DISTINCT col)` counts unique non-NULL values.

**UNION vs UNION ALL** — 📌 [LC-8278419]: `UNION` removes duplicates (extra sort/hash step, slower). `UNION ALL` keeps everything (faster). The column count and types must match.

**Primary key vs unique key** — 📌 HWI PPI, Aug 2026 [LC-8441416]

| Primary key | Unique key |
|---|---|
| one per table | many per table |
| no NULLs | NULL allowed (one NULL in SQL Server; many in MySQL/PostgreSQL) |
| usually the clustered index (InnoDB) | non-clustered index |

Other keys: **candidate** (any minimal unique set), **composite** (2+ columns), **foreign** (points to another table's PK).

**ACID** — 📌 [LC-7233197, LC-8498620]: **Atomicity** = all steps or none (a bank transfer debits **and** credits). **Consistency** = rules/constraints hold before and after. **Isolation** = parallel transactions don't see each other's half-done work. **Durability** = once committed, it survives a crash (write-ahead log).

**Normalization (and why)** — 📌 [LC-7233197, LC-8278419, LC-8498620]: split tables to remove duplicate data and insert/update/delete anomalies.
- **1NF:** atomic values (no lists in a cell).
- **2NF:** 1NF + no partial dependency on part of a composite key.
- **3NF:** 2NF + no transitive dependency (non-key → non-key).
- **BCNF:** every determinant is a candidate key.

Denormalize for read-heavy reporting.

**Indexing** — 📌 [LC-8278419]: a B+ tree on a column makes lookups O(log n) instead of a full scan. **Clustered** = the table rows are stored in index order (one per table). **Non-clustered** = a separate structure pointing to rows. Cost: slower writes and extra space. Don't index low-cardinality columns like `gender`.

**Transactions / isolation levels** — 📌 [LC-8498620]: Read Uncommitted (dirty reads) → Read Committed → Repeatable Read (MySQL default) → Serializable. Higher = safer but slower.

**MySQL vs MongoDB · SQL vs NoSQL** — 📌 [LCO-2, LC-8433956]: SQL = fixed schema, tables, joins, strong ACID, scales up (vertically). NoSQL (MongoDB) = flexible JSON documents, scales out (horizontal sharding), better for changing or huge data. Pick SQL for payments/orders and NoSQL for catalogs, logs and chat.

**CAP theorem; where SQL and Redis sit** — 📌 SP L3, Jan 2026 [LC-8433956]; also [LC-8498620]. In a network **P**artition, a distributed store must choose **C**onsistency (refuse or wait) or **A**vailability (answer, maybe stale).
- A single-node SQL DB is CA (no partition to handle). Replicated SQL with synchronous commits leans **CP**.
- Redis with async replication leans **AP** (a failover can lose recent writes). Redis Cluster isn't strongly consistent.

**ER diagram for Zomato / Uber** — 📌 [LC-8356446, LC-8433956]. Zomato: `User(1)–(N)Order(N)–(1)Restaurant`, `Order(1)–(N)OrderItem(N)–(1)MenuItem`, `Order(1)–(1)Payment`, `Order(N)–(1)DeliveryPartner`, `User(1)–(N)Address`, `User–Review–Restaurant`. Uber: `Rider–Trip–Driver`, `Driver(1)–(1)Vehicle`, `Trip(1)–(1)Payment`, `Trip(1)–(N)LocationPing`, `Rider/Driver–Rating`. Say the **cardinality** on every line.

Next: [04-cs-fundamentals-java.md](04-cs-fundamentals-java.md)
