# SQL 02 — SELECT, Filtering & Aggregates

> **Level**: Beginner · **Read time**: ~25 min · Sample tables: [sample-data.sql](sample-data.sql) (`employees`, `departments`, `customers`, `orders`)

> **Definition**: `SELECT` reads data. `WHERE` filters **rows**, `GROUP BY` puts rows into **groups**, aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) turn each group into **one value**, and `HAVING` filters **groups**.

**In one line**: `SELECT` what you want → `FROM` where it lives → `WHERE` which rows → `GROUP BY` how to bundle → `HAVING` which bundles → `ORDER BY` sort → `LIMIT` how many.

**Easy analogy — restaurant kitchen**: Kitchen mein kaam ek fixed order mein hota hai: pehle **saaman lao** (`FROM`) → **kharab cheezein hatao** (`WHERE`) → **piles mein baanto** (`GROUP BY`) → **chhote piles phenko** (`HAVING`) → **pakao** (`SELECT`) → **plate sajao** (`ORDER BY`) → **sirf pehle kuch serve karo** (`LIMIT`). SQL *likhte* waqt order alag hota hai, lekin database *chalata* isi kitchen order mein hai.

```
 Written order            Execution order (how the database really runs it)
 ─────────────            ─────────────────────────────────────────────────
 SELECT  ...              1. FROM / JOIN      pick the tables
 FROM    ...              2. WHERE            filter rows
 WHERE   ...              3. GROUP BY         make groups
 GROUP BY ...             4. HAVING           filter groups
 HAVING  ...              5. SELECT           compute columns and aliases
 ORDER BY ...             6. DISTINCT         remove duplicates
 LIMIT   ...              7. ORDER BY         sort
                          8. LIMIT / OFFSET   cut
```

---

## 1. SELECT basics

```sql
SELECT name, salary * 12 AS yearly_salary     -- expression + alias
FROM employees
WHERE dept_id = 2;
```

```result
name   | yearly_salary
-------+--------------
Karan  |        720000
Sara   |        780000
Vikram |        600000
(3 rows)
```

- `AS` gives a column a **nicer name** (alias). Avoid `SELECT *` in real code — ask only for what you need.
- `DISTINCT` removes duplicate rows:

```sql
SELECT DISTINCT dept_id FROM employees WHERE dept_id IS NOT NULL ORDER BY dept_id;
```

```result
dept_id
-------
      1
      2
      3
(3 rows)
```

---

## 2. WHERE — filtering rows

| Operator | Meaning | Example |
|---|---|---|
| `=`, `<>` (or `!=`), `<`, `>`, `<=`, `>=` | compare | `salary >= 60000` |
| `AND`, `OR`, `NOT` | combine (use brackets!) | `dept_id = 1 AND salary > 70000` |
| `IN (…)` | matches any in a list | `dept_id IN (1, 3)` |
| `BETWEEN a AND b` | range, **both ends included** | `salary BETWEEN 70000 AND 90000` |
| `LIKE` | pattern: `%` = any text, `_` = one character | `name LIKE 'M%'` |
| `IS NULL` / `IS NOT NULL` | check for missing value | `dept_id IS NULL` |

```sql
SELECT name, salary FROM employees
WHERE dept_id = 1 AND salary BETWEEN 70000 AND 90000
ORDER BY salary DESC, name;
```

```result
name  | salary
------+-------
Asha  |  90000
Meena |  75000
Ravi  |  75000
Dev   |  70000
(4 rows)
```

`LIKE` patterns — `_a%` means "second letter is **a**, then anything":

```sql
SELECT name FROM employees WHERE name LIKE '_a%' ORDER BY name;
```

```result
name
-----
Karan
Ravi
Sara
(3 rows)
```

> 💡 `LIKE 'abc%'` can use an index. `LIKE '%abc'` **cannot** (it has to scan everything).

### NULL — the #1 source of interview questions

`NULL` means **unknown / missing**. It is **not** `0` and **not** `''`.

```sql
SELECT name FROM employees WHERE dept_id = NULL;      -- WRONG: comparing with NULL is never true
```

```result
name
----
(0 rows)
```

```sql
SELECT name FROM employees WHERE dept_id IS NULL;     -- RIGHT
```

```result
name
-----
Pooja
(1 row)
```

| Fact | Example |
|---|---|
| Any comparison with `NULL` gives *unknown* | `NULL = NULL` → not true, `NULL <> 5` → not true |
| Arithmetic with `NULL` gives `NULL` | `100 + NULL` → `NULL` |
| Aggregates **ignore** `NULL` (except `COUNT(*)`) | `AVG` skips `NULL` rows |
| `COALESCE(a, b, …)` returns the first non-`NULL` | `COALESCE(manager_id, 0)` |
| `NOT IN` + a `NULL` in the list → **no rows** | classic trap, prefer `NOT EXISTS` |

```sql
SELECT name, COALESCE(manager_id, 0) AS manager FROM employees WHERE id <= 2;
```

```result
name | manager
-----+--------
Asha |       0
Ravi |       1
(2 rows)
```

---

## 3. ORDER BY, LIMIT, OFFSET (sorting and pagination)

```sql
-- page 2 if each page has 4 rows would be OFFSET 4; here we skip 2 rows and take 4
SELECT name, salary FROM employees
ORDER BY salary DESC, name        -- 2nd column breaks ties so the result is stable
LIMIT 4 OFFSET 2;
```

```result
name  | salary
------+-------
Meena |  75000
Ravi  |  75000
Dev   |  70000
Sara  |  65000
(4 rows)
```

| Database | Syntax for "first 4 rows" |
|---|---|
| MySQL, PostgreSQL, SQLite | `LIMIT 4` |
| SQL Server | `SELECT TOP 4 …` |
| Oracle 12c+, standard SQL | `FETCH FIRST 4 ROWS ONLY` |

> 💡 Where do `NULL`s go when you sort? MySQL and SQLite put them **first** in `ASC`, PostgreSQL and Oracle put them **last**. Use `NULLS FIRST` / `NULLS LAST` (PostgreSQL, Oracle, SQLite) when it matters.
> All outputs in these notes are from SQLite, so number formatting (like `40000.0`) may look slightly different in your database.

---

## 4. Aggregate functions

| Function | Returns | Ignores `NULL`? |
|---|---|---|
| `COUNT(*)` | number of rows | **no** (counts every row) |
| `COUNT(col)` | rows where `col` is not `NULL` | yes |
| `COUNT(DISTINCT col)` | number of different non-`NULL` values | yes |
| `SUM`, `AVG`, `MIN`, `MAX` | one number per group | yes |

```sql
SELECT COUNT(*)                AS total_rows,
       COUNT(dept_id)          AS with_dept,
       COUNT(DISTINCT dept_id) AS dept_count,
       SUM(salary)             AS payroll,
       ROUND(AVG(salary), 2)   AS avg_salary,
       MIN(salary)             AS lowest,
       MAX(salary)             AS highest
FROM employees;
```

```result
total_rows | with_dept | dept_count | payroll | avg_salary | lowest | highest
-----------+-----------+------------+---------+------------+--------+--------
        10 |         9 |          3 |  700000 |    70000.0 |  40000 |  120000
(1 row)
```

`COUNT(*)` = 10 but `COUNT(dept_id)` = 9, because Pooja's `dept_id` is `NULL`.

---

## 5. GROUP BY and HAVING

```sql
SELECT dept_id, COUNT(*) AS headcount, ROUND(AVG(salary)) AS avg_salary
FROM employees
GROUP BY dept_id
ORDER BY dept_id;
```

```result
dept_id | headcount | avg_salary
--------+-----------+-----------
   NULL |         1 |    40000.0
      1 |         5 |    86000.0
      2 |         3 |    58333.0
      3 |         1 |    55000.0
(4 rows)
```

**Rule**: every column in `SELECT` must either be in `GROUP BY` or inside an aggregate function.

```
 employees ──GROUP BY dept_id──►  dept 1 → [Asha, Ravi, Meena, Omar, Dev]  → COUNT = 5
                                  dept 2 → [Karan, Sara, Vikram]           → COUNT = 3
                                  dept 3 → [Neha]                          → COUNT = 1
                                  NULL   → [Pooja]                         → COUNT = 1   (NULLs form one group)
```

### WHERE vs HAVING

| | `WHERE` | `HAVING` |
|---|---|---|
| Filters | **rows** | **groups** |
| Runs | **before** grouping | **after** grouping |
| Can use aggregates? | **no** | **yes** |

```sql
-- keep only people earning > 50000 (WHERE), then keep departments with 2+ such people (HAVING)
SELECT dept_id, COUNT(*) AS headcount
FROM employees
WHERE salary > 50000
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY dept_id;
```

```result
dept_id | headcount
--------+----------
      1 |         5
      2 |         2
(2 rows)
```

---

## 6. CASE — if / else inside SQL

```sql
SELECT name, salary,
       CASE WHEN salary >= 100000 THEN 'High'
            WHEN salary >= 60000  THEN 'Medium'
            ELSE 'Low' END AS band
FROM employees
WHERE id IN (1, 6, 8)
ORDER BY salary DESC;
```

```result
name   | salary | band
-------+--------+-------
Omar   | 120000 | High
Asha   |  90000 | Medium
Vikram |  50000 | Low
(3 rows)
```

`CASE` inside an aggregate = **conditional counting** (used a lot in interviews):

```sql
SELECT SUM(CASE WHEN dept_id = 1 THEN 1 ELSE 0 END) AS engineering,
       SUM(CASE WHEN dept_id = 2 THEN 1 ELSE 0 END) AS sales
FROM employees;
```

```result
engineering | sales
------------+------
          5 |     3
(1 row)
```

---

## 7. Handy functions (names differ a little by database)

| Task | Common form |
|---|---|
| Upper / lower case | `UPPER(name)`, `LOWER(name)` |
| Length | `LENGTH(name)` (`LEN` in SQL Server) |
| Part of a string | `SUBSTRING(name, 1, 3)` |
| Join text | `CONCAT(a, b)` or `a \|\| b` |
| Today | `CURRENT_DATE` |
| Year of a date | `EXTRACT(YEAR FROM hire_date)` (MySQL also has `YEAR(hire_date)`) |
| Round | `ROUND(x, 2)` |

---

> 🗣️ **Interview mein aise bolo**: *"WHERE rows ko grouping se pehle filter karta hai, HAVING groups ko grouping ke baad — isliye aggregate condition sirf HAVING mein likhte hain."*

## ⚡ Quick revision

- Run order: **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT**.
- `WHERE` = rows before grouping, `HAVING` = groups after grouping.
- `= NULL` never works → use `IS NULL`. Aggregates skip `NULL`, `COUNT(*)` does not.
- `BETWEEN` includes both ends. `LIKE '%x'` cannot use an index.
- Add a tie-breaker column in `ORDER BY` when you paginate.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [03-joins-and-subqueries.md](03-joins-and-subqueries.md)
