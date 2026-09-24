# SQL 05 — Indexes, Views & Query Performance

> **Level**: Intermediate · **Read time**: ~25 min · Sample tables: [sample-data.sql](sample-data.sql)

> **Definition**: An **index** is an extra, sorted data structure (usually a **B-tree**) that lets the database find rows **without reading the whole table**. A **view** is a saved `SELECT` that behaves like a virtual table.

**In one line**: Index = faster reads, slower writes, more storage. Add it where you `WHERE`, `JOIN` and `ORDER BY`.

**Easy analogy — the index page at the back of a textbook**: Textbook ke peeche wala **index page**: "photosynthesis" dhoondhna hai toh 400 pages nahi padhte (**full table scan**). Peeche index kholte ho, alphabetical order mein word milta hai, seedha page 212 pe jump (**index lookup**). Lekin author naya chapter add kare toh index bhi update karna padta hai — isiliye har index **writes ko slow** karta hai.

```
 Without index: read every row          With index: walk down the tree

 row1 row2 row3 ... row1,000,000              [ 50 ]                  ← root
      O(n)                                  /        \
                                      [20|35]        [70|90]          ← branches
                                      /  |  \        /  |  \
                                    leaf leaf leaf leaf leaf leaf     ← leaves hold pointers to rows
                                         O(log n)  (3–4 steps for millions of rows)
```

---

## 1. Creating indexes

```sql
CREATE INDEX idx_emp_dept ON employees (dept_id);           -- normal (non-unique) index
CREATE UNIQUE INDEX idx_emp_name ON employees (name);       -- also enforces "no duplicates"
```

A `PRIMARY KEY` and a `UNIQUE` constraint create an index automatically. Drop with `DROP INDEX idx_emp_dept;` (MySQL: `DROP INDEX idx ON table`).

### Is my index used? — read the query plan

Use `EXPLAIN` (MySQL, PostgreSQL) or `EXPLAIN QUERY PLAN` (SQLite). You look for **scan** (bad on big tables) vs **index search/seek** (good). The wording of the plan differs between databases.

```sql
EXPLAIN QUERY PLAN SELECT * FROM employees WHERE dept_id = 2;
```

```result
plan
-----------------------------------------------------
SEARCH employees USING INDEX idx_emp_dept (dept_id=?)
(1 row)
```

```sql
-- no index on hire_date → the whole table is scanned
EXPLAIN QUERY PLAN SELECT * FROM employees WHERE hire_date = '2021-02-20';
```

```result
plan
--------------
SCAN employees
(1 row)
```

```mysql
-- MySQL / PostgreSQL: the same idea (look at "type" or "Seq Scan / Index Scan")
EXPLAIN SELECT * FROM employees WHERE dept_id = 2;
```

---

## 2. Types of indexes

| Type | What it is | Notes |
|---|---|---|
| **Clustered** | the table rows are **stored in the index order** | only **one** per table; the primary key in MySQL InnoDB / SQL Server |
| **Non-clustered** (secondary) | separate structure with pointers to rows | many per table |
| **Unique** | no duplicate values allowed | |
| **Composite** | index on 2+ columns | order of columns matters |
| **Covering** | index contains **all** columns the query needs, so the table is never touched | fastest reads |
| **Hash** | equality lookups only (`=`) | no range or sorting |
| **Full-text** | word search inside long text | `MATCH … AGAINST`, `tsvector` |

**Clustered vs non-clustered (interview classic)**

| | Clustered | Non-clustered |
|---|---|---|
| Analogy | phone directory — the **data itself** is sorted by name | index at the back of a book — **points** to pages |
| How many per table | **1** | many |
| Lookup | leaf node **is** the row | leaf node has a pointer, then one more hop to the row |
| Extra storage | none (it is the table) | yes |

> PostgreSQL tables are "heaps": every index is non-clustered (you can run `CLUSTER` once to reorder the table).

---

## 3. Composite index — the leftmost-prefix rule

An index on `(dept_id, salary)` is sorted by `dept_id` first, then by `salary` inside each department (like a phone book sorted by *city, then name*).

| Query filters on | Uses the index? |
|---|---|
| `dept_id` | ✅ yes |
| `dept_id` **and** `salary` | ✅ yes (best) |
| `salary` only | ❌ no (skips the leftmost column) |

```sql
CREATE INDEX idx_emp_dept_salary ON employees (dept_id, salary);   -- composite (multi-column) index

EXPLAIN QUERY PLAN SELECT * FROM employees WHERE dept_id = 1 AND salary > 70000;   -- both columns → uses it
```

```result
plan
-------------------------------------------------------------------------
SEARCH employees USING INDEX idx_emp_dept_salary (dept_id=? AND salary>?)
(1 row)
```

```sql
EXPLAIN QUERY PLAN SELECT * FROM employees WHERE salary > 70000;     -- only the 2nd column → cannot use it
```

```result
plan
--------------
SCAN employees
(1 row)
```

**Rule of thumb for column order**: equality columns first, then the range column, then sort columns.

---

## 4. When an index is NOT used (or does not help)

| Problem | Example | Fix |
|---|---|---|
| **Function on the column** | `WHERE YEAR(hire_date) = 2021` | `WHERE hire_date >= '2021-01-01' AND hire_date < '2022-01-01'` |
| **Leading wildcard** | `LIKE '%son'` | `LIKE 'son%'` or a full-text index |
| **Type mismatch** | `WHERE phone = 98765` (phone is text) | compare with `'98765'` |
| **Low selectivity** column | index on `gender` (2 values) | usually useless; index high-cardinality columns |
| **`OR` across different columns** | `a = 1 OR b = 2` | `UNION` of two indexed queries |
| **Tiny table** | 50 rows | the database prefers a scan, and that is fine |

**Cost of indexes**: every `INSERT` / `UPDATE` / `DELETE` must update every index → too many indexes slow writes and waste disk. Index what you *query*, not everything.

---

## 5. Views

A **view** stores a query, not data. Every time you read the view, its query runs.

```sql
CREATE VIEW dept_summary AS
SELECT d.name AS department, COUNT(e.id) AS headcount, SUM(e.salary) AS payroll
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.name;

SELECT * FROM dept_summary ORDER BY department;
```

```result
department  | headcount | payroll
------------+-----------+--------
Engineering |         5 |  430000
HR          |         1 |   55000
Marketing   |         0 |    NULL
Sales       |         3 |  175000
(4 rows)
```

| Why use views | |
|---|---|
| **Simplify** | hide a complex join behind a simple name |
| **Security** | expose only some columns/rows (e.g. hide `salary`) |
| **Consistency** | one definition of "active customer" for everyone |

| | View | Materialized view |
|---|---|---|
| Stores data? | no (runs the query each time) | **yes** (a saved snapshot) |
| Speed | as slow as the query | fast to read |
| Fresh data? | always | only after `REFRESH` (PostgreSQL, Oracle) |

Views with `GROUP BY`, `DISTINCT` or joins are usually **not updatable** (you cannot `UPDATE` through them).

---

## 6. Stored procedure vs function vs trigger

| | Stored procedure | Function | Trigger |
|---|---|---|---|
| What | saved block of SQL you `CALL` | saved code that **returns a value** | runs **automatically** on `INSERT` / `UPDATE` / `DELETE` |
| Return | 0 or more result sets / OUT params | one value (or table) | nothing |
| Used inside `SELECT`? | no | **yes** | no |
| Typical use | multi-step business logic, batch jobs | calculations (`tax(amount)`) | audit log, keep totals in sync |

```mysql
-- MySQL example: a trigger that writes an audit row whenever a salary changes
CREATE TRIGGER trg_salary_audit AFTER UPDATE ON employees
FOR EACH ROW
  INSERT INTO salary_audit (emp_id, old_salary, new_salary, changed_at)
  VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
```

---

## 7. Query optimisation checklist

1. **Measure first** — use `EXPLAIN`, don't guess.
2. Select **only the columns you need** (`SELECT *` reads more and blocks covering indexes).
3. Index columns used in `WHERE`, `JOIN ... ON`, `ORDER BY`, `GROUP BY`.
4. Don't wrap indexed columns in functions; don't start `LIKE` with `%`.
5. Prefer `EXISTS` to `IN` for big subqueries; avoid correlated subqueries on huge tables.
6. Avoid the **N+1 problem** — one query for the list, then one query *per row*. Use a `JOIN` or `IN (...)` instead.
7. Use **keyset pagination** instead of huge `OFFSET`s.
8. Insert in **batches**, keep transactions short.
9. Update statistics / vacuum, and archive old data.

### Keyset (seek) pagination vs OFFSET

`OFFSET 100000` still reads and throws away 100,000 rows. Remember the last id you showed and continue from there:

```sql
-- page 1 (first 3 rows)         then       page 2: "give me rows after id 3"
SELECT id, name FROM employees WHERE id > 3 ORDER BY id LIMIT 3;
```

```result
id | name
---+-------
 4 | Karan
 5 | Sara
 6 | Vikram
(3 rows)
```

| Technique | Speed on deep pages | Can jump to page 50? |
|---|---|---|
| `LIMIT n OFFSET m` | slower and slower | yes |
| Keyset (`WHERE id > last`) | **constant** | no (only next/previous) |

---

## 8. Scaling a database (short version)

| Technique | Meaning | Solves |
|---|---|---|
| **Replication** | copies of the data on other servers (primary → replicas) | read load, high availability |
| **Partitioning** | split **one big table** into pieces inside one database (by date, region…) | faster queries, easy archiving |
| **Sharding** | split data across **many servers** by a shard key | write load and data size beyond one machine |
| **Caching** (Redis) | keep hot results in memory | repeated reads |

---

> 🗣️ **Interview mein aise bolo**: *"Index B-tree hota hai jo lookup ko O(log n) bana deta hai. Reads fast, writes slow — isliye sirf WHERE, JOIN aur ORDER BY wale columns pe index lagata hun."*

## ⚡ Quick revision

- Index = sorted B-tree → **O(log n)** lookup instead of full scan. Cost: slower writes + disk.
- **Clustered** = rows stored in index order (one per table). **Non-clustered** = separate, points to rows.
- Composite index follows the **leftmost-prefix** rule. Covering index = no table lookup.
- Index is skipped for: functions on the column, `LIKE '%x'`, type mismatch, low-selectivity columns.
- **View** = saved query. **Materialized view** = saved *result*.
- Use `EXPLAIN`. Prefer keyset pagination for deep pages. Avoid N+1 queries.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [06-transactions-and-acid.md](06-transactions-and-acid.md)
