# Database Interview Questions — SQL + MongoDB

> One file for **quick revision**: important **questions with short answers**, plus **coding problems with tested code**.
> Read the notes first ([SQL](SQL/01-sql-basics.md), [MongoDB](MongoDB/01-mongodb-basics.md)), then use this file to practise and revise.

**How to use**

| Part | What is inside |
|---|---|
| **A** | SQL — concept questions (definitions, differences, "why") |
| **B** | SQL — coding problems with solutions and output |
| **C** | MongoDB — concept questions |
| **D** | MongoDB — coding problems with solutions and output |
| **E** | Scenario / design questions (SQL vs MongoDB, scaling, schema) |
| **F** | Last-minute cheat sheet |

Sample tables used in Part B: [sample-data.sql](SQL/sample-data.sql) · sample collections in Part D: [sample-data.js](MongoDB/sample-data.js). All outputs below were produced by really running the code (SQL on SQLite, MongoDB on MongoDB 7).

> 💡 **Interview habit**: first give the **one-line definition**, then a **small example**, then a **trade-off**. Yaad rakho — *pehle definition, phir example, phir trade-off*. That structure alone makes an average answer sound strong.

---

# Part A — SQL: Concept Questions

## A1. Basics

**Q1. DBMS vs RDBMS?**
A **DBMS** stores and manages data (could be plain files). An **RDBMS** stores data in **tables** with **relationships** (primary/foreign keys), enforces **constraints**, and supports **ACID** transactions and SQL. Examples: MySQL, PostgreSQL, Oracle, SQL Server.

**Q2. SQL vs MySQL?**
SQL is the **language**. MySQL is a **database product** that understands SQL (like PostgreSQL, Oracle, SQL Server). SQL is *declarative*: you say **what** you want, not **how** to get it.

**Q3. Types of SQL commands?**
**DDL** (`CREATE, ALTER, DROP, TRUNCATE`) structure · **DML** (`INSERT, UPDATE, DELETE`) data · **DQL** (`SELECT`) read · **DCL** (`GRANT, REVOKE`) permissions · **TCL** (`COMMIT, ROLLBACK, SAVEPOINT`) transactions.

**Q4. Primary key vs unique key vs foreign key?**
**Primary key**: uniquely identifies a row, **not NULL**, only **one** per table. **Unique key**: no duplicates, **NULL allowed**, many per table. **Foreign key**: a column that must match a key in **another table** — keeps data consistent (referential integrity).

**Q5. Super key, candidate key, alternate key, composite key, surrogate key?**
**Super key** = any column set that identifies a row. **Candidate key** = a *minimal* super key. **Primary key** = the candidate you choose; the rest are **alternate keys**. **Composite key** = key made of 2+ columns. **Surrogate key** = artificial id (auto-increment / UUID); **natural key** = real-world value (email, PAN).

**Q6. What are constraints?**
Rules enforced by the database: `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, `DEFAULT`.

**Q7. DELETE vs TRUNCATE vs DROP?**
`DELETE` removes chosen rows (has `WHERE`, DML, can roll back, slower). `TRUNCATE` removes **all rows** fast (DDL, no `WHERE`, resets auto-increment). `DROP` removes the **whole table** (structure + data).

**Q8. CHAR vs VARCHAR? DECIMAL vs FLOAT?**
`CHAR(n)` is fixed length, `VARCHAR(n)` variable length. `DECIMAL` is **exact** (use for money); `FLOAT` is **approximate** (rounding errors).

**Q9. What is NULL? How do you compare with it?**
`NULL` = unknown/missing (not 0, not empty string). Any comparison with `NULL` is *unknown*, so use `IS NULL` / `IS NOT NULL`, never `= NULL`. Aggregates (`SUM, AVG, COUNT(col)`) **ignore** NULLs; `COUNT(*)` does not. `COALESCE(x, 0)` replaces NULL.

## A2. Querying

**Q10. WHERE vs HAVING?**
`WHERE` filters **rows before** grouping (cannot use aggregates). `HAVING` filters **groups after** `GROUP BY` (can use aggregates like `COUNT(*) > 2`).

**Q11. Order of execution of a query?**
`FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT`. That is why a **column alias** from `SELECT` cannot be used in `WHERE` but can be used in `ORDER BY`.

**Q12. COUNT(\*) vs COUNT(col) vs COUNT(DISTINCT col)?**
`COUNT(*)` counts all rows. `COUNT(col)` counts rows where `col` is **not NULL**. `COUNT(DISTINCT col)` counts **different** non-NULL values.

**Q13. Rules of GROUP BY?**
Every non-aggregated column in `SELECT` must be in `GROUP BY`. All `NULL`s form **one group**.

**Q14. UNION vs UNION ALL? INTERSECT? EXCEPT?**
`UNION` merges results and **removes duplicates** (slower). `UNION ALL` keeps duplicates (faster). `INTERSECT` = rows in both. `EXCEPT` (Oracle `MINUS`) = rows in the first but not the second. Same number and compatible types of columns required.

**Q15. LIKE wildcards? BETWEEN? IN vs EXISTS?**
`%` = any text, `_` = one character. `BETWEEN a AND b` includes **both ends**. `IN` compares with a list/subquery result; `EXISTS` only checks "is there any row?" and is often faster for big subqueries.

**Q16. DISTINCT vs GROUP BY?**
Both remove duplicates. `GROUP BY` is needed when you also **aggregate**. For plain de-duplication `DISTINCT` is clearer.

**Q17. How do you paginate?**
`ORDER BY id LIMIT 10 OFFSET 20` (MySQL/PostgreSQL/SQLite), `TOP` (SQL Server), `FETCH FIRST n ROWS ONLY` (Oracle 12c+). Always add a **unique** column in `ORDER BY`. For deep pages use **keyset pagination** (`WHERE id > last_id`).

**Q18. CASE, COALESCE, NULLIF?**
`CASE WHEN … THEN … ELSE … END` = if/else. `COALESCE(a, b, c)` = first non-NULL. `NULLIF(a, b)` = NULL if `a = b` (avoids divide-by-zero: `x / NULLIF(y, 0)`).

## A3. Joins and subqueries

**Q19. Types of joins?**
`INNER` (only matches), `LEFT` (all left + matches), `RIGHT`, `FULL OUTER` (all rows both sides), `CROSS` (every combination), `SELF` (table joined with itself). MySQL has no `FULL JOIN` → `LEFT UNION RIGHT`.

**Q20. What is a self join? Give an example.**
A table joined with itself using two aliases — e.g. `employees e JOIN employees m ON e.manager_id = m.id` gives each employee with their manager.

**Q21. Join vs subquery?**
A join can return columns from both tables and is usually optimised well. A subquery is often easier to read for "exists / greater than average" logic. Modern optimisers often turn one into the other; **measure with `EXPLAIN`**.

**Q22. What is a correlated subquery?**
A subquery that uses a column of the **outer** query, so it runs **once per outer row** (can be slow). Example: salary greater than the average of the employee's own department.

**Q23. Why does `NOT IN` sometimes return nothing?**
If the subquery returns even one `NULL`, `x NOT IN (…, NULL)` is never true. Use `NOT EXISTS` or filter `WHERE col IS NOT NULL` inside the subquery.

**Q24. CTE vs subquery vs temp table?**
A **CTE** (`WITH`) is a named, readable subquery valid for **one statement**; it can be **recursive** (hierarchies). A **temp table** is stored for the session and can be indexed and reused. A plain **subquery** is inline and can't be referenced twice.

**Q25. `ON` vs `WHERE` in a LEFT JOIN?**
Conditions on the **right table** in `WHERE` remove the NULL rows and turn the join into an `INNER JOIN`. Put such conditions in `ON`.

## A4. Window functions

**Q26. What is a window function? How is it different from GROUP BY?**
It calculates across related rows (a "window") **without collapsing** them — every row stays. `GROUP BY` returns one row per group.

**Q27. ROW_NUMBER vs RANK vs DENSE_RANK?**
For salaries `100, 90, 90, 80`: `ROW_NUMBER` = 1,2,3,4 · `RANK` = 1,2,2,**4** (gap) · `DENSE_RANK` = 1,2,2,**3** (no gap). Use `DENSE_RANK` for "Nth highest **distinct** value".

**Q28. What do LAG and LEAD do? How do you make a running total?**
`LAG(col)` = value from the **previous** row, `LEAD(col)` = from the **next** row. Running total: `SUM(x) OVER (ORDER BY d ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.

## A5. Indexes and performance

**Q29. What is an index? How does it help?**
A sorted structure (usually a **B-tree**) that lets the DB find rows in **O(log n)** instead of scanning the whole table. **Cost**: extra disk, slower `INSERT/UPDATE/DELETE`.

**Q30. Clustered vs non-clustered index?**
**Clustered**: the table rows are **stored in the index order** — only **one** per table (the primary key in InnoDB / SQL Server). **Non-clustered**: a separate structure with **pointers** to the rows — many allowed.

**Q31. Composite index and the leftmost-prefix rule? Covering index?**
An index on `(a, b)` helps queries filtering on `a` or on `a` and `b`, **not `b` alone**. A **covering** index contains every column the query needs, so the table is never read.

**Q32. When is an index NOT used?**
Function on the column (`WHERE YEAR(d) = 2024`), leading wildcard (`LIKE '%x'`), type mismatch, low-selectivity column (gender), skipping the first column of a composite index, tiny tables.

**Q33. What is `EXPLAIN`?**
It shows the **execution plan** — full scan vs index, join order, estimated rows. Look for full scans on big tables.

**Q34. How do you optimise a slow query?**
1) `EXPLAIN` it. 2) Add/fix indexes on `WHERE`, `JOIN`, `ORDER BY` columns. 3) Select only needed columns. 4) Don't wrap indexed columns in functions. 5) Avoid `SELECT *` and N+1 queries. 6) Use keyset pagination. 7) Denormalize or cache if reads dominate.

**Q35. View vs materialized view?**
A **view** is a saved query (no data stored; always fresh). A **materialized view** stores the **result** (fast reads, must be refreshed). Views simplify queries and restrict access to columns.

**Q36. Stored procedure vs function vs trigger?**
**Procedure**: reusable block you `CALL` (can change data, multiple results). **Function**: returns a value and can be used inside `SELECT`. **Trigger**: runs **automatically** on `INSERT/UPDATE/DELETE` (audit logs, keeping totals in sync).

**Q37. What is the N+1 query problem?**
1 query to get a list, then **N more** queries (one per row) to get related data. Fix with a `JOIN` or one `WHERE id IN (...)` query.

**Q38. Partitioning vs sharding vs replication?**
**Partitioning**: split one big table into parts inside **one** database. **Sharding**: split data across **many servers** (horizontal scale for size and writes). **Replication**: **copies** on other servers (availability and read scaling).

## A6. Transactions

**Q39. What is a transaction? Explain ACID.**
A group of statements that succeed or fail **together**. **A**tomicity (all or nothing), **C**onsistency (rules always hold), **I**solation (parallel transactions don't disturb each other), **D**urability (committed data survives a crash).

**Q40. Isolation levels and the problems they prevent?**
**Dirty read** (reading uncommitted data), **non-repeatable read** (same row, different value), **phantom read** (new rows appear). `Read Uncommitted` allows all; `Read Committed` blocks dirty reads; `Repeatable Read` also blocks non-repeatable reads; `Serializable` blocks all. Defaults: MySQL = Repeatable Read, PostgreSQL/Oracle/SQL Server = Read Committed.

**Q41. What is a deadlock? How to avoid it?**
Two transactions each hold a lock the other needs → both wait forever; the DB kills one (the victim). Avoid: lock in the **same order**, keep transactions **short**, **retry** on deadlock.

**Q42. Optimistic vs pessimistic locking? What is MVCC?**
**Pessimistic**: lock first (`SELECT … FOR UPDATE`). **Optimistic**: no lock; check a `version` column at update time. **MVCC** keeps multiple row versions so **readers don't block writers**.

**Q43. COMMIT, ROLLBACK, SAVEPOINT, auto-commit?**
`COMMIT` saves, `ROLLBACK` undoes, `SAVEPOINT` lets you roll back only part. In **auto-commit** mode every statement is its own transaction.

## A7. Design

**Q44. What is normalization? Explain 1NF, 2NF, 3NF, BCNF.**
Organising tables so each fact is stored **once** (removes insert/update/delete anomalies). **1NF**: atomic values, no repeating groups. **2NF**: 1NF + no **partial** dependency on part of a composite key. **3NF**: 2NF + no **transitive** dependency (non-key → non-key). **BCNF**: every determinant is a super key.

**Q45. What is denormalization? When do you use it?**
Adding controlled duplicate data to avoid joins — for **read-heavy** systems, reporting, dashboards. Trade-off: faster reads, harder/riskier writes.

**Q46. How do you model one-to-many and many-to-many?**
One-to-many: foreign key on the **many** side. Many-to-many: a **junction table** with two foreign keys (and a composite primary key).

**Q47. OLTP vs OLAP?**
**OLTP**: many small transactions (orders, payments), normalized. **OLAP**: heavy analytical queries over big history, denormalized (star schema, data warehouse).

**Q48. Auto-increment id vs UUID?**
Auto-increment: small, ordered, fast, but leaks counts and is hard to generate across servers. UUID: unique anywhere (good for distributed systems/merging), but bigger and random (worse index locality).

**Q49. What is SQL injection? How do you prevent it?**
An attacker puts SQL into an input (`' OR '1'='1`) and changes the query. Prevent with **parameterized queries / prepared statements**, an ORM, input validation, and **least-privilege** DB users. Never build SQL by string concatenation.

**Q50. Soft delete vs hard delete?**
Soft delete = mark `is_deleted` / `deleted_at` (data recoverable, must filter everywhere, table grows). Hard delete = remove the row (clean, irreversible).

---

# Part B — SQL: Coding Problems

Tables `departments`, `employees`, `customers`, `orders` come from [sample-data.sql](SQL/sample-data.sql). A few problems use small extra tables, created here:

```sql
CREATE TABLE person (id INT PRIMARY KEY, email VARCHAR(50));
INSERT INTO person VALUES (1,'a@x.com'), (2,'b@x.com'), (3,'a@x.com'), (4,'c@x.com'), (5,'b@x.com');

CREATE TABLE logs (id INT PRIMARY KEY, num INT);
INSERT INTO logs VALUES (1,1), (2,1), (3,1), (4,2), (5,1), (6,2), (7,2);

CREATE TABLE logins (user_id INT, login_date DATE);
INSERT INTO logins VALUES (1,'2024-03-01'), (1,'2024-03-02'), (1,'2024-03-03'), (1,'2024-03-05'),
                          (2,'2024-03-01'), (2,'2024-03-03'), (2,'2024-03-04');

CREATE TABLE weather (id INT PRIMARY KEY, record_date DATE, temperature INT);
INSERT INTO weather VALUES (1,'2024-01-01',10), (2,'2024-01-02',25), (3,'2024-01-03',20), (4,'2024-01-04',30);

CREATE TABLE staff (id INT PRIMARY KEY, name VARCHAR(30), sex CHAR(1));
INSERT INTO staff VALUES (1,'Asha','f'), (2,'Ravi','m'), (3,'Meena','f'), (4,'Karan','m');
```

Salaries in `employees` (sorted): `120000, 90000, 75000, 75000, 70000, 65000, 60000, 55000, 50000, 40000`.

### P1. Second highest salary

```sql
-- Way 1: LIMIT / OFFSET on DISTINCT salaries (returns no row if there is no 2nd salary)
SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;
```

```result
salary
------
 90000
(1 row)
```

```sql
-- Way 2: subquery, no LIMIT needed (works in every database) — NULL if there is no 2nd salary
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

```result
second_highest
--------------
         90000
(1 row)
```

### P2. Nth highest salary (N = 3)

```sql
-- DENSE_RANK handles ties: 75000 is the 3rd distinct salary even though two people have it
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees) t
WHERE rnk = 3;                                    -- change 3 to any N
```

```result
salary
------
 75000
(1 row)
```

```sql
-- Same answer without window functions (correlated subquery): "exactly N-1 distinct salaries are higher"
SELECT DISTINCT e1.salary
FROM employees e1
WHERE (SELECT COUNT(DISTINCT e2.salary) FROM employees e2 WHERE e2.salary > e1.salary) = 2;   -- N - 1
```

```result
salary
------
 75000
(1 row)
```

### P3. Highest-paid employee in each department

```sql
SELECT d.name AS department, e.name AS employee, e.salary
FROM employees e
JOIN departments d ON d.id = e.dept_id
WHERE e.salary = (SELECT MAX(salary) FROM employees WHERE dept_id = e.dept_id)
ORDER BY d.name;
```

```result
department  | employee | salary
------------+----------+-------
Engineering | Omar     | 120000
HR          | Neha     |  55000
Sales       | Sara     |  65000
(3 rows)
```

If two people tie for highest, **both** are returned (that is usually what the interviewer wants).

### P4. Top 3 salaries in each department (with ties)

```sql
WITH ranked AS (
    SELECT dept_id, name, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
    WHERE dept_id IS NOT NULL
)
SELECT d.name AS department, r.name AS employee, r.salary
FROM ranked r
JOIN departments d ON d.id = r.dept_id
WHERE r.rnk <= 3
ORDER BY d.name, r.salary DESC, r.name;
```

```result
department  | employee | salary
------------+----------+-------
Engineering | Omar     | 120000
Engineering | Asha     |  90000
Engineering | Meena    |  75000
Engineering | Ravi     |  75000
HR          | Neha     |  55000
Sales       | Sara     |  65000
Sales       | Karan    |  60000
Sales       | Vikram   |  50000
(8 rows)
```

### P5. Employees who earn more than their manager

```sql
SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary
ORDER BY e.id;
```

```result
employee | salary | manager | manager_salary
---------+--------+---------+---------------
Sara     |  65000 | Karan   |          60000
Omar     | 120000 | Asha    |          90000
(2 rows)
```

### P6. Departments with more than 2 employees

```sql
SELECT d.name AS department, COUNT(*) AS headcount
FROM departments d
JOIN employees e ON e.dept_id = d.id
GROUP BY d.name
HAVING COUNT(*) > 2
ORDER BY d.name;
```

```result
department  | headcount
------------+----------
Engineering |         5
Sales       |         3
(2 rows)
```

### P7. Departments with no employees / employees with no department

```sql
SELECT d.name AS department_without_employees
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
WHERE e.id IS NULL;
```

```result
department_without_employees
----------------------------
Marketing
(1 row)
```

```sql
SELECT name AS employee_without_department FROM employees WHERE dept_id IS NULL;
```

```result
employee_without_department
---------------------------
Pooja
(1 row)
```

### P8. Customers who never placed an order

```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;                                -- or: WHERE NOT EXISTS (SELECT 1 FROM orders WHERE customer_id = c.id)
```

```result
name
-----
Divya
(1 row)
```

### P9. Total spent per customer (include customers with no orders)

```sql
SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;
```

```result
name   | total_spent | orders
-------+-------------+-------
Anil   |        1250 |      3
Bina   |         850 |      2
Chirag |         200 |      1
Divya  |           0 |      0
(4 rows)
```

### P10. Customers with at least 2 orders

```sql
SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2
ORDER BY customer_id;
```

```result
customer_id | orders
------------+-------
          1 |      3
          2 |      2
(2 rows)
```

### P11. Find duplicate rows

```sql
SELECT email, COUNT(*) AS times
FROM person
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY email;
```

```result
email   | times
--------+------
a@x.com |     2
b@x.com |     2
(2 rows)
```

### P12. Salaries shared by more than one employee (show the employees)

```sql
SELECT name, salary
FROM (SELECT name, salary, COUNT(*) OVER (PARTITION BY salary) AS same_salary FROM employees) t
WHERE same_salary > 1
ORDER BY name;
```

```result
name  | salary
------+-------
Meena |  75000
Ravi  |  75000
(2 rows)
```

### P13. Departments whose average salary is above the company average

```sql
SELECT d.name AS department, ROUND(AVG(e.salary)) AS avg_salary
FROM employees e
JOIN departments d ON d.id = e.dept_id
GROUP BY d.name
HAVING AVG(e.salary) > (SELECT AVG(salary) FROM employees);     -- company average = 70000
```

```result
department  | avg_salary
------------+-----------
Engineering |    86000.0
(1 row)
```

### P14. How many people report to each manager?

```sql
SELECT m.name AS manager, COUNT(*) AS direct_reports
FROM employees e
JOIN employees m ON e.manager_id = m.id
GROUP BY m.id, m.name
ORDER BY direct_reports DESC, m.name;
```

```result
manager | direct_reports
--------+---------------
Asha    |              5
Karan   |              2
Neha    |              1
Ravi    |              1
(4 rows)
```

### P15. Running total of order amounts, per customer

```sql
SELECT customer_id, order_date, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date, id
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders
ORDER BY customer_id, order_date;
```

```result
customer_id | order_date | amount | running_total
------------+------------+--------+--------------
          1 | 2024-01-05 |    500 |           500
          1 | 2024-01-20 |    300 |           800
          1 | 2024-03-01 |    450 |          1250
          2 | 2024-02-02 |    700 |           700
          2 | 2024-03-09 |    150 |           850
          3 | 2024-02-14 |    200 |           200
(6 rows)
```

### P16. Month-over-month change in total sales

```sql
-- SQLite: strftime('%Y-%m', d). MySQL: DATE_FORMAT(d, '%Y-%m'). PostgreSQL: TO_CHAR(d, 'YYYY-MM').
WITH monthly AS (
    SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS total
    FROM orders
    GROUP BY strftime('%Y-%m', order_date)
)
SELECT month, total,
       total - LAG(total) OVER (ORDER BY month) AS change_from_previous
FROM monthly
ORDER BY month;
```

```result
month   | total | change_from_previous
--------+-------+---------------------
2024-01 |   800 |                 NULL
2024-02 |   900 |                  100
2024-03 |   600 |                 -300
(3 rows)
```

### P17. Median salary

```sql
WITH ranked AS (
    SELECT salary,
           ROW_NUMBER() OVER (ORDER BY salary) AS rn,
           COUNT(*) OVER ()                    AS cnt
    FROM employees
)
SELECT AVG(salary) AS median
FROM ranked
WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2);       -- middle one row (odd count) or two rows (even count)
```

```result
median
-------
67500.0
(1 row)
```

In MySQL, `/` gives a decimal — use `DIV` (integer division) instead.

### P18. Numbers that appear at least 3 times in a row

```sql
SELECT DISTINCT num AS consecutive_num
FROM (SELECT num,
             LAG(num, 1) OVER (ORDER BY id) AS prev1,
             LAG(num, 2) OVER (ORDER BY id) AS prev2
      FROM logs) t
WHERE num = prev1 AND num = prev2;
```

```result
consecutive_num
---------------
              1
(1 row)
```

### P19. Users who logged in 3 or more days in a row (gaps and islands)

Idea: number each user's dates (`rn`). For consecutive days, `date − rn` is **the same** for the whole streak — that constant is the "island" id.

```sql
-- SQLite date arithmetic. MySQL: DATE_SUB(login_date, INTERVAL rn DAY). PostgreSQL: login_date - rn.
WITH numbered AS (
    SELECT user_id, login_date,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
    FROM (SELECT DISTINCT user_id, login_date FROM logins)
),
islands AS (
    SELECT user_id, login_date, DATE(login_date, '-' || rn || ' day') AS grp
    FROM numbered
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS days
FROM islands
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;
```

```result
user_id | streak_start | streak_end | days
--------+--------------+------------+-----
      1 | 2024-03-01   | 2024-03-03 |    3
(1 row)
```

### P20. Days that were hotter than the previous day

```sql
-- SQLite: DATE(d, '+1 day'). MySQL: DATE_ADD(d, INTERVAL 1 DAY). PostgreSQL: d + 1.
SELECT id, record_date, temperature
FROM (SELECT id, record_date, temperature,
             LAG(temperature) OVER (ORDER BY record_date) AS prev_temp,
             LAG(record_date) OVER (ORDER BY record_date) AS prev_date
      FROM weather) t
WHERE temperature > prev_temp
  AND record_date = DATE(prev_date, '+1 day');        -- the previous row must really be the previous DAY
```

```result
id | record_date | temperature
---+-------------+------------
 2 | 2024-01-02  |          25
 4 | 2024-01-04  |          30
(2 rows)
```

### P21. Pivot rows into columns (conditional aggregation)

Total amount per customer, one column per month:

```sql
SELECT customer_id,
       SUM(CASE WHEN strftime('%m', order_date) = '01' THEN amount ELSE 0 END) AS jan,
       SUM(CASE WHEN strftime('%m', order_date) = '02' THEN amount ELSE 0 END) AS feb,
       SUM(CASE WHEN strftime('%m', order_date) = '03' THEN amount ELSE 0 END) AS mar
FROM orders
GROUP BY customer_id
ORDER BY customer_id;
```

```result
customer_id | jan | feb | mar
------------+-----+-----+----
          1 | 800 |   0 | 450
          2 |   0 | 700 | 150
          3 |   0 | 200 |   0
(3 rows)
```

### P22. Delete duplicate rows, keep the smallest id

```sql
DELETE FROM person
WHERE id NOT IN (SELECT keep_id FROM (SELECT MIN(id) AS keep_id FROM person GROUP BY email) t);   -- wrapper needed in MySQL

SELECT * FROM person ORDER BY id;
```

```result
id | email
---+--------
 1 | a@x.com
 2 | b@x.com
 4 | c@x.com
(3 rows)
```

Alternative with a window function (PostgreSQL / SQL Server): delete rows where `ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) > 1`.

### P23. Swap values with a single UPDATE

```sql
UPDATE staff SET sex = CASE sex WHEN 'm' THEN 'f' ELSE 'm' END;
SELECT * FROM staff ORDER BY id;
```

```result
id | name  | sex
---+-------+----
 1 | Asha  | m
 2 | Ravi  | f
 3 | Meena | m
 4 | Karan | f
(4 rows)
```

### P24. Fetch the first and the last record

```sql
SELECT 'first' AS which, name FROM (SELECT name FROM employees ORDER BY id ASC  LIMIT 1)
UNION ALL
SELECT 'last',           name FROM (SELECT name FROM employees ORDER BY id DESC LIMIT 1);
```

```result
which | name
------+-----
first | Asha
last  | Dev
(2 rows)
```

| Task | SQLite | MySQL | PostgreSQL |
|---|---|---|---|
| Year-month of a date | `strftime('%Y-%m', d)` | `DATE_FORMAT(d, '%Y-%m')` | `TO_CHAR(d, 'YYYY-MM')` |
| Subtract N days | `DATE(d, '-N day')` | `DATE_SUB(d, INTERVAL N DAY)` | `d - N` |
| Today | `DATE('now')` | `CURDATE()` | `CURRENT_DATE` |
| First N rows | `LIMIT N` | `LIMIT N` | `LIMIT N` |

---

# Part C — MongoDB: Concept Questions

## C1. Basics

**Q51. What is MongoDB? Why use it?**
An open-source **document database** (NoSQL). It stores flexible JSON-like documents (BSON) in collections. Use it for **hierarchical or fast-changing data**, high write volume, and easy **horizontal scaling** (sharding).

**Q52. SQL vs MongoDB terms?**
Database = database · **table = collection** · **row = document** · **column = field** · primary key = **`_id`** · join = **`$lookup`** or embedding · `GROUP BY` = **aggregation pipeline**.

**Q53. What is BSON? How is it different from JSON?**
**Binary JSON** — the storage format. It is faster to parse and supports extra types: `ObjectId`, `Date`, `Int32/Int64`, `Decimal128`, binary data. JSON is text with only strings, numbers, booleans, arrays, objects and null.

**Q54. What is `_id` and `ObjectId`?**
Every document has a unique **`_id`** (auto-indexed, immutable). Default type **ObjectId** = 12 bytes: 4-byte timestamp + 5-byte random value + 3-byte counter. You can use your own `_id` (number, string).

**Q55. What are a collection and a document? Size limit?**
A collection is a group of documents (like a table, but **schema-less** by default). A document is a set of field-value pairs. Max document size is **16 MB** (use **GridFS** for bigger files).

**Q56. Is MongoDB really "schema-less"? How do you enforce rules?**
Flexible, not lawless. Use **`$jsonSchema` validation** on the collection (required fields, types, ranges) or **Mongoose** schemas in the app.

**Q57. Advantages and disadvantages of MongoDB?**
**Pros**: flexible schema, fast reads of whole objects (no joins), horizontal scaling, rich queries + aggregation, replication built in. **Cons**: no real multi-table joins (`$lookup` is slower), data duplication, transactions cost more, needs careful modeling and indexing, memory hungry.

**Q58. When to choose MongoDB over MySQL, and when not?**
Choose Mongo for catalogs, content, profiles, IoT/events, rapidly changing schema, huge scale. Choose SQL for **highly relational** data, complex joins, strict multi-table transactions and reporting (banking, accounting).

## C2. CRUD and queries

**Q59. `find()` vs `findOne()`? What is projection?**
`find()` returns a **cursor** (many), `findOne()` returns **one document or null**. Projection selects fields: `{ name: 1, _id: 0 }`.

**Q60. `updateOne` with `$set` vs `replaceOne`?**
`$set` changes only the listed fields. `replaceOne` **replaces the whole document** (except `_id`). An update without operators is an error in `updateOne`.

**Q61. What is upsert?**
`updateOne(filter, update, { upsert: true })` → update if a match exists, **otherwise insert** a new document. Great for counters and "create if missing".

**Q62. `insertMany` ordered vs unordered? `bulkWrite`?**
Ordered (default) stops at the first error; `{ ordered: false }` continues. `bulkWrite` sends many mixed writes (insert/update/delete) in one round trip.

**Q63. Difference between null and missing field in a query?**
`{ x: null }` matches documents where `x` is null **or missing**. `{ x: { $exists: false } }` matches only missing.

**Q64. Important array operators?**
Query: `$all`, `$size`, `$elemMatch`, `"arr.0"`. Update: `$push`, `$addToSet` (no duplicates), `$pull`, `$pop`, `$each`, positional `$`, `$[]`, `$[id]` with `arrayFilters`.

**Q65. Why `$elemMatch`?**
To require **several conditions on the same array element**. Without it, different elements may satisfy different conditions.

**Q66. `countDocuments` vs `estimatedDocumentCount`?**
`countDocuments(filter)` is exact and accepts a filter. `estimatedDocumentCount()` uses metadata — instant, no filter.

**Q67. How do you paginate?**
`find().sort({ _id: 1 }).skip(n).limit(k)` is simple but slow for large `n`. Better: **range-based** — `find({ _id: { $gt: lastId } }).sort({ _id: 1 }).limit(k)`.

**Q68. Why is `findOneAndUpdate` useful?**
It **updates and returns** the document in one **atomic** step — used for counters, job queues, "claim the next task".

## C3. Aggregation

**Q69. What is the aggregation pipeline?**
A list of **stages**; each stage transforms the documents and passes them on: `$match → $group → $sort → $project → $limit …`. It replaces `GROUP BY`, `HAVING`, joins and computed columns.

**Q70. Explain `$match`, `$group`, `$project`, `$unwind`, `$lookup`.**
`$match` filters. `$group` groups and aggregates (`$sum, $avg, $min, $max, $push, $addToSet`). `$project` picks/renames/computes fields. `$unwind` makes **one document per array element**. `$lookup` **left-joins** another collection (result is an array).

**Q71. Does MongoDB support joins?**
Yes, with **`$lookup`** (left outer join) inside aggregation — but it is heavier than SQL joins, so model data to **embed** what is read together.

**Q72. How do you do `HAVING` in MongoDB?**
Add a `$match` stage **after** `$group`.

**Q73. Aggregation pipeline vs map-reduce?**
The pipeline is faster, simpler and the recommended way. Map-reduce (custom JavaScript) is deprecated.

**Q74. How do you make an aggregation fast?**
Put `$match` and `$sort` **first** (they can use indexes), `$project` early, index the `$lookup` foreign field, and use `allowDiskUse` for big `$group` / `$sort` stages (about 100 MB of RAM per stage before spilling to disk).

## C4. Indexes

**Q75. What is an index in MongoDB? Which types exist?**
A B-tree on one or more fields that avoids scanning every document. Types: **single, compound, multikey (arrays), text, hashed, geospatial, TTL, unique, partial, sparse, wildcard**.

**Q76. What is the ESR rule? Leftmost prefix?**
Compound index order: **E**quality fields, then **S**ort fields, then **R**ange fields. An index `{a, b, c}` supports queries on `a`, `a+b`, `a+b+c` — not `b` alone.

**Q77. What does `explain()` show? What is a covered query?**
The plan: `COLLSCAN` (full scan) vs `IXSCAN` (index), `totalDocsExamined`, in-memory `SORT`. A **covered query** is answered from the index only (`totalDocsExamined = 0`).

**Q78. What are TTL, unique, sparse and partial indexes?**
**TTL** auto-deletes documents after N seconds. **Unique** rejects duplicates. **Sparse** skips documents without the field. **Partial** indexes only documents matching a filter (smaller index).

**Q79. Downsides of many indexes?**
Slower writes, more disk/RAM. Keep indexes for real queries; the index working set should fit in RAM. Max 64 per collection.

## C5. Data modeling

**Q80. Embedding vs referencing?**
**Embed** when data is read together, small and bounded (one-to-one, one-to-few) → one query, atomic update. **Reference** when the "many" side is large/unbounded, shared, or used alone → separate collection, `$lookup`.

**Q81. How do you model one-to-many? What is the unbounded array problem?**
One-to-few → embed an array. One-to-many/squillions → store the **parent id in each child**. An ever-growing embedded array can hit the **16 MB** limit and slow updates.

**Q82. Is duplicating data OK in MongoDB?**
Yes, when it removes joins and the data rarely changes (e.g. product **price at purchase time** inside the order). Accept extra update work in return for fast reads.

**Q83. Name some schema design patterns.**
**Subset** (embed only the latest N), **bucket** (group time-series points), **computed** (store counts), **extended reference** (copy a few fields), **schema versioning**, **polymorphic**.

## C6. Transactions, replication, sharding

**Q84. Does MongoDB support ACID?**
Single-document writes are always atomic. **Multi-document transactions** are supported (4.0+ replica sets, 4.2+ sharded clusters) but cost performance — good modeling avoids them.

**Q85. Write concern, read concern, read preference?**
**Write concern** `w` = how many members must confirm a write (`"majority"` = safe). **Read concern** = how safe the data is (`local`, `majority`, `snapshot`). **Read preference** = which member to read from (`primary`, `secondary`, `nearest`; secondaries can be stale).

**Q86. What is a replica set? Election? Oplog?**
A group of servers with the **same data**: one **primary** (writes) + **secondaries**. If the primary fails, members **vote** (a **majority** is needed) and a secondary becomes primary. The **oplog** is a capped collection of all writes that secondaries replay.

**Q87. Why use an odd number of replica set members?**
A majority is needed to elect a primary. 3 members tolerate 1 failure; 4 also tolerate only 1 — the extra member adds cost, not safety.

**Q88. What is sharding? What is a shard key?**
Splitting data across servers for **size and write throughput**. Parts: **shards**, **mongos** router, **config servers**. The **shard key** decides where a document goes: it should have **high cardinality**, **low frequency** and **not be monotonic** (or a hot shard appears). **Hashed** = even spread; **ranged** = good for range queries.

**Q89. Replication vs sharding?**
Replication = **copies** (availability, read scaling). Sharding = **splits** (data size, write scaling). Production uses both: every shard is a replica set.

**Q90. CAP theorem — where does MongoDB stand? ACID vs BASE?**
During a network partition you choose consistency or availability. MongoDB is **CP** by default (a minority side cannot accept writes). **ACID** = strict correctness (SQL); **BASE** = basically available, soft state, eventual consistency (many NoSQL systems).

**Q91. Which storage engine? What is journaling?**
**WiredTiger** (default): document-level locking, compression, checkpoints. The **journal** is a write-ahead log so committed writes survive a crash.

**Q92. What are GridFS, capped collections and change streams?**
**GridFS** stores files > 16 MB in chunks. **Capped collection** = fixed size, oldest data overwritten (logs). **Change streams** (`watch()`) give a live feed of changes (built on the oplog).

**Q93. How do you secure MongoDB? What is NoSQL injection?**
Enable **authentication + role-based access**, TLS, encryption at rest, network rules. **NoSQL injection**: attacker sends an object like `{ "$ne": null }` as a password. Validate input types, never pass raw request bodies into queries.

**Q94. Is replication a backup?**
No — a bad delete replicates to every member. Use `mongodump`/`mongorestore`, snapshots, or a **delayed member**, plus tested restores.

**Q95. Mongoose vs the native driver?**
Mongoose (Node.js ODM) adds **schemas, validation, middleware, population** on top of the native driver. The native driver is lighter and closer to the shell.

---

# Part D — MongoDB: Coding Problems

Collections `users`, `products`, `orders` come from [sample-data.js](MongoDB/sample-data.js). Read-only problems come first; problems that change data come last.

### D1. Users older than 25 who live in Delhi or Mumbai

```javascript
db.users.find({ age: { $gt: 25 }, city: { $in: ["Delhi", "Mumbai"] } }, { _id: 0, name: 1, city: 1, age: 1 })
```

```result
[
  { name: 'Asha', age: 28, city: 'Delhi' },
  { name: 'Ravi', age: 35, city: 'Mumbai' },
  { name: 'Sara', age: 30, city: 'Mumbai' }
]
```

### D2. Users without an email, and users whose name starts with "a" (any case)

```javascript
db.users.find({ email: { $exists: false } }, { _id: 0, name: 1 })
```

```result
[ { name: 'Meena' } ]
```

```javascript
db.users.find({ name: /^a/i }, { _id: 0, name: 1 })
```

```result
[ { name: 'Asha' } ]
```

### D3. Users who know both `sql` and `mongodb`, and users who know `java` or `go`

```javascript
db.users.find({ skills: { $all: ["sql", "mongodb"] } }, { _id: 0, name: 1 })
```

```result
[ { name: 'Meena' } ]
```

```javascript
db.users.find({ skills: { $in: ["java", "go"] } }, { _id: 0, name: 1, skills: 1 })
```

```result
[
  { name: 'Ravi', skills: [ 'java', 'sql' ] },
  { name: 'Karan', skills: [ 'go' ] }
]
```

### D4. In-stock products priced between 100 and 5000, most expensive first

```javascript
db.products.find(
  { stock: { $gt: 0 }, price: { $gte: 100, $lte: 5000 } },
  { _id: 0, name: 1, price: 1 }
).sort({ price: -1 })
```

```result
[ { name: 'Headphones', price: 2000 }, { name: 'Mouse', price: 500 } ]
```

### D5. Second most expensive product

```javascript
db.products.find({}, { _id: 0, name: 1, price: 1 }).sort({ price: -1 }).skip(1).limit(1)
```

```result
[ { name: 'Headphones', price: 2000 } ]
```

### D6. Total revenue of all orders that are not cancelled

```javascript
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 } } }
])
```

```result
[ { _id: null, revenue: 61450, orders: 6 } ]
```

### D7. Top 2 customers by amount spent (skip cancelled orders) — with their names

```javascript
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: { _id: "$userId", spent: { $sum: "$total" } } },
  { $sort: { spent: -1 } },
  { $limit: 2 },
  { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
  { $unwind: "$user" },
  { $project: { _id: 0, name: "$user.name", spent: 1 } }
])
```

```result
[ { spent: 59700, name: 'Asha' }, { spent: 1550, name: 'Ravi' } ]
```

### D8. Best-selling product (by units) with its name

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.sku", units: { $sum: "$items.qty" } } },
  { $sort: { units: -1 } },
  { $limit: 1 },
  { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $project: { _id: 0, product: "$product.name", units: 1 } }
])
```

```result
[ { units: 15, product: 'Pen' } ]
```

### D9. Users who never placed an order

```javascript
db.users.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
  { $match: { orders: { $size: 0 } } },
  { $project: { _id: 0, name: 1 } }
])
```

```result
[ { name: 'Sara' } ]
```

### D10. Revenue per product category (two joins: order items → products)

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $lookup: { from: "products", localField: "items.sku", foreignField: "_id", as: "p" } },
  { $unwind: "$p" },
  { $group: { _id: "$p.category", revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } } } },
  { $sort: { revenue: -1 } }
])
```

```result
[
  { _id: 'electronics', revenue: 63000 },
  { _id: 'stationery', revenue: 450 }
]
```

### D11. Group users by city — names and average age

```javascript
db.users.aggregate([
  { $group: { _id: "$city", users: { $push: "$name" }, avgAge: { $avg: "$age" }, count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

```result
[
  { _id: 'Delhi', users: [ 'Asha', 'Meena' ], avgAge: 25, count: 2 },
  { _id: 'Mumbai', users: [ 'Ravi', 'Sara' ], avgAge: 32.5, count: 2 },
  { _id: 'Pune', users: [ 'Karan' ], avgAge: 41, count: 1 }
]
```

### D12. Cities that have more than one user (find duplicates)

```javascript
db.users.aggregate([
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } },
  { $sort: { _id: 1 } }
])
```

```result
[ { _id: 'Delhi', count: 2 }, { _id: 'Mumbai', count: 2 } ]
```

### D13. Count products in price ranges with `$bucket`

```javascript
db.products.aggregate([
  { $bucket: { groupBy: "$price", boundaries: [0, 100, 1000, 100000], default: "other", output: { count: { $sum: 1 } } } }
])
```

```result
[
  { _id: 0, count: 2 },
  { _id: 100, count: 2 },
  { _id: 1000, count: 2 }
]
```

### D14. Range-based pagination (page size 2)

```javascript
// page 1
db.users.find({}, { _id: 1, name: 1 }).sort({ _id: 1 }).limit(2)
```

```result
[ { _id: 1, name: 'Asha' }, { _id: 2, name: 'Ravi' } ]
```

```javascript
// page 2: continue after the last _id we showed (2) — no slow skip()
db.users.find({ _id: { $gt: 2 } }, { _id: 1, name: 1 }).sort({ _id: 1 }).limit(2)
```

```result
[ { _id: 3, name: 'Meena' }, { _id: 4, name: 'Karan' } ]
```

### D15. Sell a product safely — decrement stock only if enough is left

```javascript
// Desk Lamp has stock 0 → filter does not match → nothing changes (no overselling)
db.products.updateOne({ _id: "P5", stock: { $gte: 1 } }, { $inc: { stock: -1 } })
```

```result
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 0,
  modifiedCount: 0,
  upsertedCount: 0
}
```

```javascript
// Mouse has stock 80 → sold one
db.products.updateOne({ _id: "P4", stock: { $gte: 1 } }, { $inc: { stock: -1 } })
```

```result
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

The condition and the update happen in **one atomic operation**, so two buyers cannot both take the last item.

### D16. Add a skill without duplicates, then remove another

```javascript
db.users.updateOne({ _id: 4 }, { $addToSet: { skills: "docker" } })
db.users.updateOne({ _id: 4 }, { $addToSet: { skills: "docker" } })       // second time: no change
db.users.updateOne({ _id: 4 }, { $pull: { skills: "go" } })
db.users.findOne({ _id: 4 }, { _id: 0, name: 1, skills: 1 })
```

```result
{ name: 'Karan', skills: [ 'docker' ] }
```

### D17. Page-view counter with upsert (create if missing)

```javascript
db.counters.updateOne({ _id: "home" }, { $inc: { views: 1 } }, { upsert: true })
db.counters.updateOne({ _id: "home" }, { $inc: { views: 1 } }, { upsert: true })
db.counters.findOne({ _id: "home" })
```

```result
{ _id: 'home', views: 2 }
```

### D18. Raise the price of all electronics by 100, then delete cancelled orders

```javascript
db.products.updateMany({ category: "electronics" }, { $inc: { price: 100 } })
```

```result
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 3,
  modifiedCount: 3,
  upsertedCount: 0
}
```

```javascript
db.orders.deleteMany({ status: "cancelled" })
```

```result
{ acknowledged: true, deletedCount: 1 }
```

---

# Part E — Scenario and Design Questions

**E1. SQL or MongoDB for an e-commerce site?**
Often **both**: **SQL** for orders, payments, inventory counts (strict relations, transactions) and **MongoDB** for the product catalog (many different attributes per product, nested data, fast reads). Say *why* for each part — that is what interviewers want.

**E2. Design the SQL tables for an e-commerce app.**
`users(id PK, name, email UNIQUE)` · `products(id PK, name, price DECIMAL, stock)` · `orders(id PK, user_id FK, status, created_at)` · `order_items(order_id FK, product_id FK, qty, unit_price, PRIMARY KEY (order_id, product_id))` · `payments(id PK, order_id FK, amount, status)`. Index every foreign key. Copy `unit_price` into `order_items` so old orders never change.

**E3. Design MongoDB for a blog with comments.**
Post document with **embedded** author summary and the **latest 10 comments** (subset pattern); older comments in a `comments` collection with `postId` (reference from child to parent, index on `postId`). Reason: comments are unbounded.

**E4. A query is slow in production. What do you do?**
1) Find it (slow query log / profiler). 2) `EXPLAIN` — full scan? in-memory sort? 3) Add or fix the **index** (equality → sort → range). 4) Rewrite: fewer columns, no function on indexed columns, avoid N+1, keyset pagination. 5) Check locks/contention. 6) Cache or denormalize if it is a read-heavy hot path. 7) Measure again.

**E5. How do you scale a database?**
In this order: **optimise queries + indexes** → **cache** (Redis) → **read replicas** (replication) → **vertical scaling** → **partitioning** → **sharding** (last, it adds complexity). Also archive old data.

**E6. How do you prevent overselling / double payment when 2 users act at the same time?**
Do the check **and** the change atomically: `UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0` (check rows affected) or `SELECT … FOR UPDATE` in a transaction. In MongoDB: `updateOne({ _id, stock: { $gte: 1 } }, { $inc: { stock: -1 } })`. For payments use an **idempotency key** with a **unique** constraint, so a retry cannot charge twice.

**E7. How do you implement "unique username" safely?**
Put a **unique index/constraint** on the column and handle the duplicate-key error. "Check then insert" in application code has a **race condition**.

**E8. How do you paginate an infinite-scroll feed?**
**Keyset pagination**: `WHERE (created_at, id) < (:last_created_at, :last_id) ORDER BY created_at DESC, id DESC LIMIT 20`. Fast on any page and stable when new rows arrive; `OFFSET` gets slow and can repeat/skip rows.

**E9. How do you store hierarchical data (categories, comments)?**
**SQL**: adjacency list (`parent_id`) + **recursive CTE**; or materialized path (`'/1/4/9/'`), or nested sets. **MongoDB**: store `parentId`, or an **array of ancestors** for fast subtree queries, or embed small trees.

**E10. How do you change a schema without downtime?**
SQL: **expand → migrate → contract** (add the new column, backfill in batches, switch the code, drop the old column later); avoid long locks. MongoDB: add `schemaVersion`, write new format, migrate lazily or in the background.

**E11. How do you store money and time?**
Money: `DECIMAL` (or integer **paise/cents**) — never `FLOAT`. Time: store in **UTC** (`TIMESTAMP`/`Date`), convert to local time in the UI.

**E12. How would you add search to the app?**
Small: SQL `LIKE 'abc%'` with an index, or full-text index (`MATCH … AGAINST`, PostgreSQL `tsvector`), MongoDB **text index** / Atlas Search. Large or fuzzy: a search engine like **Elasticsearch**, fed from the main database.

**E13. What would you check before migrating from SQL to MongoDB?**
Are the access patterns document-shaped? Are many-to-many joins and multi-table transactions rare? Can you model with embedding? Do you have a plan for reporting, data migration and team skills? If most queries are joins, stay on SQL.

---

# Part F — Last-Minute Cheat Sheet

### SQL in 12 lines

```
Execution order : FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
Joins           : INNER (matches) · LEFT (all left) · FULL · CROSS · SELF; filter right table in ON
NULL            : IS NULL, never = NULL · aggregates skip NULL · NOT IN + NULL = no rows → NOT EXISTS
Ranking         : ROW_NUMBER unique · RANK gaps · DENSE_RANK no gaps  (Nth highest distinct → DENSE_RANK)
Window          : fn() OVER (PARTITION BY g ORDER BY o ROWS BETWEEN ...) · LAG/LEAD · running SUM
Index           : B-tree, O(log n) · clustered (1/table) vs non-clustered · leftmost prefix · covering
Index NOT used  : function on column · LIKE '%x' · type mismatch · low selectivity
ACID            : Atomicity, Consistency, Isolation, Durability
Isolation       : Read Uncommitted < Read Committed < Repeatable Read < Serializable
Anomalies       : dirty read · non-repeatable read · phantom read · lost update
Normal forms    : 1NF atomic · 2NF no partial dep · 3NF no transitive dep · BCNF determinant = super key
Scaling         : indexes → cache → replicas → partition → shard
```

### MongoDB in 12 lines

```
Terms           : collection = table · document = row · field = column · _id = PK · $lookup = join
CRUD            : insertOne/Many · find/findOne · updateOne/Many ($set) · deleteOne/Many · replaceOne
Query ops       : $eq $ne $gt $gte $lt $lte $in $nin $and $or $exists $regex $elemMatch $all $size
Update ops      : $set $unset $inc $mul $push $addToSet $pull $pop · upsert · findOneAndUpdate
Aggregation     : $match → $group → $sort → $project → $limit · $unwind · $lookup · $bucket · $count
Index           : createIndex · ESR (Equality, Sort, Range) · explain("executionStats") · COLLSCAN vs IXSCAN
Index types     : compound · multikey · text · TTL · unique · partial · hashed
Modeling        : embed = read together + small + bounded · reference = large / unbounded / shared
Atomicity       : single-document writes are atomic · multi-doc transactions need a replica set
Replication     : primary + secondaries · oplog · election needs a majority · odd number of members
Sharding        : shards + mongos + config servers · shard key: high cardinality, not monotonic
CAP             : MongoDB is CP by default · replication is not a backup
```

### SQL vs MongoDB — final comparison

| | SQL (RDBMS) | MongoDB |
|---|---|---|
| Model | tables, rows, fixed schema | collections, documents, flexible schema |
| Relations | joins + foreign keys | embedding / `$lookup` |
| Transactions | strong ACID | ACID per document; multi-document supported |
| Scaling | vertical first; sharding is complex | designed for horizontal scaling |
| Query language | SQL (standard) | MongoDB Query API (JSON) |
| Best for | relational data, reporting, banking | hierarchical / changing data, catalogs, big scale |
| Weak spot | rigid schema changes, hard to shard | joins, cross-document consistency, duplication |

🎯 Go back to the notes: [SQL 01](SQL/01-sql-basics.md) · [MongoDB 01](MongoDB/01-mongodb-basics.md) · [Database README](README.md)
