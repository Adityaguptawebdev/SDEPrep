# 03 — SQL / DBMS: Questions + Answers

All of these are 🔵 (Amex India entry-level reports). Every query was run in SQLite. `DENSE_RANK` also works in MySQL 8+ and PostgreSQL.

**Sample tables used below:**

```
Employee                           Dept
id | name | salary | dept_id       id | dname
1  | Asha | 50000  | 1             1  | Tech
2  | Ravi | 70000  | 1             2  | Risk
3  | Neha | 70000  | 2             3  | HR
4  | Amit | 40000  | NULL
```

---

## Queries

**Q: Find the 2nd highest salary.** [LC 176](https://leetcode.com/problems/second-highest-salary/) (Engineer Trainee, Aug 2025)
Take the biggest salary that is smaller than the max.

```sql
SELECT MAX(salary) FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);         -- 50000

-- another way
SELECT DISTINCT salary FROM Employee
ORDER BY salary DESC LIMIT 1 OFFSET 1;                     -- 50000
```

**Q: Find the employees with the 10th to 15th highest salaries.** [LC 177](https://leetcode.com/problems/nth-highest-salary/) (Engineer Trainee, Aug 2025)
`DENSE_RANK()` gives rank 1 to the top salary, and equal salaries share a rank. Then filter the ranks.

```sql
SELECT name, salary
FROM (SELECT name, salary,
             DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
      FROM Employee) t
WHERE rnk BETWEEN 10 AND 15;
```

> 💡 **Hinglish:** `RANK` ties ke baad number skip karta hai (1,1,3). `DENSE_RANK` skip nahi karta (1,1,2). "Nth highest salary" mein mostly `DENSE_RANK` chahiye.

**Q: Write a query to delete a column from a table.** (Intern)

```sql
ALTER TABLE Employee DROP COLUMN dept_id;
```

**Q: How do you create and delete a table?** (Intern)

```sql
CREATE TABLE Student (
    id    INT PRIMARY KEY,
    name  VARCHAR(50) NOT NULL,
    marks INT
);
DROP TABLE Student;
```

**Q: TRUNCATE vs DROP (vs DELETE)?** (Intern)

| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| Removes | chosen rows (`WHERE`) | **all** rows | the **whole table** (rows + structure) |
| Table still exists? | Yes | Yes | No |
| Can use WHERE? | Yes | No | No |
| Speed | slow (row by row) | fast | fast |
| Type | DML | DDL | DDL |

**Q: Explain joins with an example.** (Intern, Engineer 1)

```
INNER JOIN  → only matching rows          Asha-Tech, Ravi-Tech, Neha-Risk
LEFT JOIN   → all employees + match       ... + Amit-NULL
RIGHT JOIN  → all departments + match     ... + NULL-HR
FULL JOIN   → everything from both sides
CROSS JOIN  → every row × every row       4 × 3 = 12 rows
NATURAL JOIN→ joins automatically on columns with the same name
```

```sql
SELECT e.name, d.dname
FROM Employee e
LEFT JOIN Dept d ON e.dept_id = d.id;
```

**Cross join example:** a `Sizes` table (S, M, L) × a `Colours` table (Red, Blue) gives all 6 size-colour pairs. That is useful for making every combination.

**Q: Write GROUP BY + HAVING queries.** (Intern)
`WHERE` filters **rows before** grouping. `HAVING` filters **groups after** grouping.

```sql
-- departments with at least 2 employees
SELECT dept_id, COUNT(*) AS cnt, AVG(salary) AS avg_sal
FROM Employee
WHERE dept_id IS NOT NULL
GROUP BY dept_id
HAVING COUNT(*) >= 2;                 -- 1 | 2 | 60000

-- departments whose total salary is above 60000
SELECT d.dname, SUM(e.salary) AS total
FROM Employee e JOIN Dept d ON e.dept_id = d.id
GROUP BY d.dname
HAVING SUM(e.salary) > 60000;         -- Risk 70000, Tech 120000
```

---

## DBMS theory

**Q: Primary key vs foreign key?**
- **Primary key:** uniquely identifies each row. It can't be NULL or repeated. Example: `Employee.id`.
- **Foreign key:** a column that points to the primary key of **another** table. Example: `Employee.dept_id → Dept.id`. It keeps the data consistent, so you can't add an employee to a department that doesn't exist.

**Q: What is indexing?**
An index is like the **index at the back of a book**. The database keeps a sorted structure (usually a **B+ tree**) on a column, so search becomes O(log n) instead of scanning every row.
Downside: it uses extra space, and inserts/updates become a little slower.

**Q: What is normalization? What are its types?**
Normalization means splitting tables to **remove duplicate data** and update problems.

| Form | Rule (easy words) |
|---|---|
| 1NF | each cell has one value (no lists in a cell) |
| 2NF | 1NF + every column depends on the **whole** primary key, not just part of it |
| 3NF | 2NF + no column depends on another non-key column |
| BCNF | stricter 3NF: every determinant must be a candidate key |

**Q: Why denormalize?** To make **reads faster**. You keep some duplicate data so you need fewer joins. It's common in reporting and analytics.

**Q: Explain ACID.**

| | Meaning | Card-payment example |
|---|---|---|
| **A**tomicity | all steps happen or none | money leaves A **and** reaches B, or nothing happens |
| **C**onsistency | data stays valid after the transaction | the balance never goes below the allowed limit |
| **I**solation | parallel transactions don't disturb each other | two swipes at the same time don't mix up the balance |
| **D**urability | once committed, it is saved even after a crash | a payment marked successful stays successful |

**Q: What is locking in DBMS?**
A lock stops other transactions from changing data you are using.
- **Shared lock (read):** many can read together.
- **Exclusive lock (write):** only one can write, and nobody else can read or write that row meanwhile.
Too much locking can cause a **deadlock**: two transactions wait for each other forever.

**Q: Two users order the only remaining copy of a book at the same time. What is this problem and how do you handle it?**
This is a **race condition** (also called a **lost update**). Both read "1 copy left" and both buy it.
Fix: do the check and the update **in one step, inside a transaction**.

```sql
UPDATE Books SET stock = stock - 1
WHERE id = 42 AND stock > 0;
-- if 1 row changed → order placed; if 0 rows changed → "out of stock"
```
Or lock the row first with `SELECT ... FOR UPDATE`.

**Q: Explain the CAP theorem.**
In a distributed database, when the network breaks (**P**artition), you must choose between:
- **C**onsistency: every read gets the latest data, or
- **A**vailability: every request gets an answer, even if the data may be old.

**Q: Can consistency and availability be achieved together?** Yes, but only **while there is no network partition**. During a partition you must pick one. Banks and payments pick **C** (a wrong balance is worse than a short wait). Social media likes pick **A** (an old like count is fine).

**Q: SQL vs NoSQL? When to use which?**

| | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB, Cassandra) |
|---|---|---|
| Data shape | fixed tables and columns | flexible documents / key-value |
| Relations | joins, foreign keys | usually embed the data instead |
| Transactions | strong ACID | often simpler (MongoDB supports some ACID) |
| Scaling | mostly vertical (bigger machine) | easy horizontal (more machines) |
| Use when | payments, banking, orders | catalogs, logs, chat, fast-changing data |

**Q: Why did you use MongoDB and not SQL in your project?** Give your real reason. For example: "The data had no fixed shape and few relations, and JSON documents matched my Node.js code. For payments, I would use SQL because of ACID."

**Q: Types of RAID?** RAID combines many disks into one.
- **RAID 0:** striping. Fast, but no backup.
- **RAID 1:** mirroring. A full copy on a second disk.
- **RAID 5:** striping + parity. It survives 1 disk failure.
- **RAID 10:** mirroring + striping. Fast and safe, but costly.

Agla: [04-oop-os-cn-java.md](04-oop-os-cn-java.md)
