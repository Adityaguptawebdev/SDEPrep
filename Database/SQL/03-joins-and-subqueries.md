# SQL 03 — Joins, Set Operators & Subqueries

> **Level**: Beginner → Intermediate · **Read time**: ~30 min · Sample tables: [sample-data.sql](sample-data.sql)

> **Definition**: A **join** combines rows from two (or more) tables using a matching condition, usually `foreign key = primary key`. A **subquery** is a query written inside another query. A **set operator** (`UNION`, `INTERSECT`, `EXCEPT`) combines the *results* of two queries.

**In one line**: Data is split into many tables to avoid repetition — joins put it back together when you need it.

**Easy analogy — wedding guest list and catering list**: Ek sheet mein **guests** ki list hai (naam, table no.), doosri mein **khaane ke orders** (guest ka naam, dish). Kaun kya khayega — yeh jaanne ke liye dono sheets ko guest ke naam se match karte ho → yahi **join** hai. **Inner join** = sirf wo guests jo **dono** sheets mein hain. **Left join** = **saare** guests, chahe unka food order abhi na aaya ho (dish khali = `NULL`).

```
 employees (left)              departments (right)
 ┌────┬───────┬─────────┐      ┌────┬─────────────┐
 │ id │ name  │ dept_id │      │ id │ name        │
 │ 7  │ Neha  │ 3       │─────►│ 3  │ HR          │   matched
 │ 9  │ Pooja │ NULL    │  ✗   │ 4  │ Marketing   │   ✗ nobody works here
 └────┴───────┴─────────┘      └────┴─────────────┘
```

```
 Which rows come back?   (A = left table, B = right table)

                only A       A and B      only B
                (no match)   (matched)    (no match)
 INNER JOIN        ·            ✔            ·
 LEFT JOIN         ✔            ✔            ·        ← unmatched A rows get NULL for B's columns
 RIGHT JOIN        ·            ✔            ✔        ← unmatched B rows get NULL for A's columns
 FULL OUTER JOIN   ✔            ✔            ✔
```

---

## 1. Join types

| Join | Returns | Non-matching rows |
|---|---|---|
| `INNER JOIN` | only rows that match in **both** tables | dropped |
| `LEFT JOIN` | **all** left rows + matches from right | right side becomes `NULL` |
| `RIGHT JOIN` | **all** right rows + matches from left | left side becomes `NULL` |
| `FULL OUTER JOIN` | all rows from **both** | missing side becomes `NULL` (MySQL has no `FULL JOIN`) |
| `CROSS JOIN` | every row × every row (**cartesian product**) | – |
| `SELF JOIN` | a table joined **with itself** (use two aliases) | – |

### INNER JOIN

```sql
SELECT e.name AS employee, d.name AS department
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
WHERE d.name IN ('HR', 'Marketing');
```

```result
employee | department
---------+-----------
Neha     | HR
(1 row)
```

Only Neha appears: Marketing has no employees, and Pooja has no department.

### LEFT JOIN — "show me all, even if there is no match"

Interview classic: **count employees per department, including departments with none**.

```sql
SELECT d.name AS department, COUNT(e.id) AS employees
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.name
ORDER BY d.name;
```

```result
department  | employees
------------+----------
Engineering |         5
HR          |         1
Marketing   |         0
Sales       |         3
(4 rows)
```

Use `COUNT(e.id)` (counts only real matches). `COUNT(*)` would show `1` for Marketing because the `NULL`-filled row still counts as a row.

### FULL OUTER JOIN — rows with **no match on either side**

```sql
SELECT e.name AS employee, d.name AS department
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL OR d.id IS NULL;
```

```result
employee | department
---------+-----------
Pooja    | NULL
NULL     | Marketing
(2 rows)
```

MySQL has no `FULL JOIN` — use `LEFT JOIN` **UNION** `RIGHT JOIN`:

```sql
SELECT e.name AS employee, d.name AS department
FROM employees e LEFT JOIN departments d ON e.dept_id = d.id
WHERE d.id IS NULL
UNION
SELECT e.name, d.name
FROM employees e RIGHT JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL;
```

```result
employee | department
---------+-----------
NULL     | Marketing
Pooja    | NULL
(2 rows)
```

### SELF JOIN — employee and manager live in the same table

```sql
-- employees who earn more than their manager
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

### CROSS JOIN

```sql
SELECT COUNT(*) AS combinations FROM departments CROSS JOIN customers;   -- 4 x 4
```

```result
combinations
------------
          16
(1 row)
```

### ⚠️ `ON` vs `WHERE` in an outer join

A filter on the **right** table inside `WHERE` throws away the `NULL` rows, so your `LEFT JOIN` quietly becomes an `INNER JOIN`. Put such filters in `ON`.

```sql
-- RIGHT: departments with no high earners still show up with 0
SELECT d.name AS department, COUNT(e.id) AS earning_over_70k
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id AND e.salary > 70000
GROUP BY d.name
ORDER BY d.name;
```

```result
department  | earning_over_70k
------------+-----------------
Engineering |                4
HR          |                0
Marketing   |                0
Sales       |                0
(4 rows)
```

```sql
-- WRONG (for this goal): WHERE removes the NULL rows, departments with 0 disappear
SELECT d.name AS department, COUNT(e.id) AS earning_over_70k
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
WHERE e.salary > 70000
GROUP BY d.name;
```

```result
department  | earning_over_70k
------------+-----------------
Engineering |                4
(1 row)
```

---

## 2. Set operators — combine two result sets

| Operator | Returns | Duplicates |
|---|---|---|
| `UNION` | rows in either query | **removed** (slower, has to sort/compare) |
| `UNION ALL` | rows in either query | **kept** (faster) |
| `INTERSECT` | rows in **both** | removed |
| `EXCEPT` (Oracle: `MINUS`) | rows in the first but **not** the second | removed |

Rules: both queries need the **same number of columns** with **compatible types**. (MySQL supports `INTERSECT` / `EXCEPT` only from version 8.0.31.)

```sql
SELECT name FROM employees WHERE salary >= 75000      -- 4 people
UNION
SELECT name FROM employees WHERE dept_id = 1          -- 5 people (4 of them are also above)
ORDER BY name;
```

```result
name
-----
Asha
Dev
Meena
Omar
Ravi
(5 rows)
```

```sql
SELECT COUNT(*) AS rows_with_union_all FROM (
    SELECT name FROM employees WHERE salary >= 75000
    UNION ALL
    SELECT name FROM employees WHERE dept_id = 1
) t;
```

```result
rows_with_union_all
-------------------
                  9
(1 row)
```

```sql
-- in Engineering but NOT earning >= 75000
SELECT name FROM employees WHERE dept_id = 1
EXCEPT
SELECT name FROM employees WHERE salary >= 75000;
```

```result
name
----
Dev
(1 row)
```

---

## 3. Subqueries

A subquery can return **one value** (scalar), **a list** (for `IN`), or **a table** (in `FROM`).

```sql
-- scalar subquery: earns more than the company average
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;
```

```result
name  | salary
------+-------
Omar  | 120000
Asha  |  90000
Ravi  |  75000
Meena |  75000
(4 rows)
```

```sql
-- IN subquery: people who work in HR or Sales
SELECT name FROM employees
WHERE dept_id IN (SELECT id FROM departments WHERE name IN ('HR', 'Sales'))
ORDER BY id;
```

```result
name
------
Karan
Sara
Vikram
Neha
(4 rows)
```

### Correlated subquery — the inner query uses a column of the outer query

It runs **once per outer row**, so it can be slow on big tables.

```sql
-- employees earning more than the average of THEIR OWN department
SELECT e.name, e.dept_id, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id)
ORDER BY e.id;
```

```result
name  | dept_id | salary
------+---------+-------
Asha  |       1 |  90000
Karan |       2 |  60000
Sara  |       2 |  65000
Omar  |       1 | 120000
(4 rows)
```

### EXISTS / NOT EXISTS

`EXISTS` only asks "is there **at least one** row?" and stops at the first one.

```sql
-- customers who never placed an order
SELECT c.name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

```result
name
-----
Divya
(1 row)
```

### 🪤 The `NOT IN` + `NULL` trap

```sql
-- We expect "Marketing", but employees.dept_id contains a NULL (Pooja) → NOT IN returns NOTHING
SELECT name FROM departments WHERE id NOT IN (SELECT dept_id FROM employees);
```

```result
name
----
(0 rows)
```

```sql
-- Safe versions
SELECT d.name FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);
```

```result
name
---------
Marketing
(1 row)
```

**Why?** `id NOT IN (1, 2, 3, NULL)` means `id <> 1 AND id <> 2 AND id <> 3 AND id <> NULL`. The last part is *unknown*, so the whole thing is never true.

| Use | When |
|---|---|
| `IN` | small list, or subquery that cannot return `NULL` |
| `EXISTS` | "does a related row exist?" — usually faster on big tables |
| `NOT EXISTS` | safest way to say "has no matching row" |
| `JOIN` | you need columns from both tables |

---

## 4. CTE — `WITH` (a named, readable subquery)

```sql
WITH dept_avg AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT e.name, e.salary, ROUND(d.avg_salary) AS dept_average
FROM employees e
JOIN dept_avg d ON e.dept_id = d.dept_id
WHERE e.salary > d.avg_salary
ORDER BY e.id;
```

```result
name  | salary | dept_average
------+--------+-------------
Asha  |  90000 |      86000.0
Karan |  60000 |      58333.0
Sara  |  65000 |      58333.0
Omar  | 120000 |      86000.0
(4 rows)
```

A **recursive CTE** walks a hierarchy (org chart, categories). Start at the boss, then keep adding people who report to the previous level (SQL Server: write `WITH` without the word `RECURSIVE`):

```sql
WITH RECURSIVE chain AS (
    SELECT id, name, 1 AS level FROM employees WHERE manager_id IS NULL     -- anchor: the top boss
    UNION ALL
    SELECT e.id, e.name, c.level + 1                                        -- recursive step
    FROM employees e JOIN chain c ON e.manager_id = c.id
)
SELECT name, level FROM chain ORDER BY level, name;
```

```result
name   | level
-------+------
Asha   |     1
Karan  |     2
Meena  |     2
Neha   |     2
Omar   |     2
Ravi   |     2
Dev    |     3
Pooja  |     3
Sara   |     3
Vikram |     3
(10 rows)
```

| | Subquery | CTE | Temp table / View |
|---|---|---|---|
| Lives for | one statement | one statement | session / permanent |
| Readable? | nested = harder | **named = easier** | yes |
| Can be reused twice in the same query? | no | **yes** | yes |
| Can be recursive? | no | **yes** | no |

---

> 🗣️ **Interview mein aise bolo**: *"LEFT JOIN mein saari left rows aati hain. Right table ki condition main ON mein likhta hun, WHERE mein nahi — warna wo INNER JOIN ban jata hai."*

## ⚡ Quick revision

- `INNER` = matches only · `LEFT` = all left + matches · `FULL` = all rows from both · `CROSS` = every combination.
- **Self join** = same table twice with different aliases (employee ↔ manager).
- Count with `COUNT(right_table.id)` after a `LEFT JOIN`, not `COUNT(*)`.
- Filter the **right** table of a `LEFT JOIN` in `ON`, not `WHERE`.
- `UNION` removes duplicates, `UNION ALL` keeps them and is faster.
- `NOT IN` breaks when the list has `NULL` → use `NOT EXISTS`.
- Correlated subquery = runs once per outer row.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [04-window-functions.md](04-window-functions.md)
