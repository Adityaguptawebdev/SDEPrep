# SQL 04 — Window Functions

> **Level**: Intermediate · **Read time**: ~25 min · Sample tables: [sample-data.sql](sample-data.sql)

> **Definition**: A **window function** does a calculation across a set of rows related to the current row (its *window*) — **but every row stays in the result**. `GROUP BY` collapses rows; a window function does not.

**In one line**: `function() OVER (PARTITION BY group ORDER BY sort)` — "for each row, look at the other rows in its group and compute something".

**Easy analogy — school merit list**: School ki **merit list** socho: har student ki row list mein rehti hai (koi gayab nahi hota). Naam ke saath extra columns hote hain: **section mein rank** aur **topper se kitne marks kam**. Students merge nahi hote — har ek apni row rakhta hai aur uske saath extra info judti hai. Wahi extra column ek window function hai. `PARTITION BY section` = "har section ke andar alag rank".

```
 GROUP BY dept                          Window function (OVER PARTITION BY dept)
 ─────────────                          ───────────────────────────────────────
 dept │ avg_salary                      name   │ dept │ salary │ dept_avg
 ─────┼───────────                      ───────┼──────┼────────┼─────────
  1   │ 86000        ← 5 rows → 1 row   Asha   │  1   │ 90000  │ 86000    ← every row stays
  2   │ 58333                           Ravi   │  1   │ 75000  │ 86000
                                        Karan  │  2   │ 60000  │ 58333
```

Syntax:

```
function_name(...) OVER (
    PARTITION BY column      -- optional: restart the calculation for each group
    ORDER BY column          -- optional: order inside the window
    ROWS BETWEEN ...         -- optional: frame (which nearby rows to include)
)
```

---

## 1. Aggregate as a window (no collapsing)

```sql
SELECT name, dept_id, salary,
       ROUND(AVG(salary) OVER (PARTITION BY dept_id)) AS dept_avg,
       salary - ROUND(AVG(salary) OVER (PARTITION BY dept_id)) AS diff_from_avg
FROM employees
WHERE dept_id = 2
ORDER BY salary DESC;
```

```result
name   | dept_id | salary | dept_avg | diff_from_avg
-------+---------+--------+----------+--------------
Sara   |       2 |  65000 |  58333.0 |        6667.0
Karan  |       2 |  60000 |  58333.0 |        1667.0
Vikram |       2 |  50000 |  58333.0 |       -8333.0
(3 rows)
```

---

## 2. Ranking functions — the most asked topic

| Function | Ties | Example for salaries `120, 90, 75, 75, 70` |
|---|---|---|
| `ROW_NUMBER()` | never ties, always 1, 2, 3… | 1, 2, 3, 4, 5 |
| `RANK()` | same rank for ties, **skips** the next numbers | 1, 2, **3, 3**, 5 |
| `DENSE_RANK()` | same rank for ties, **no gap** | 1, 2, **3, 3**, 4 |
| `NTILE(n)` | splits rows into `n` equal buckets | quartiles, deciles |

```sql
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC, name) AS row_num,
       RANK()       OVER (ORDER BY salary DESC)       AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC)       AS dense_rnk
FROM employees
WHERE dept_id = 1
ORDER BY salary DESC, name;
```

```result
name  | salary | row_num | rnk | dense_rnk
------+--------+---------+-----+----------
Omar  | 120000 |       1 |   1 |         1
Asha  |  90000 |       2 |   2 |         2
Meena |  75000 |       3 |   3 |         3
Ravi  |  75000 |       4 |   3 |         3
Dev   |  70000 |       5 |   5 |         4
(5 rows)
```

Meena and Ravi earn the same (75000): `RANK` gives both 3 and then jumps to 5; `DENSE_RANK` gives both 3 and continues with 4.

---

## 3. PARTITION BY — rank inside each group

**Top earner of every department** — you cannot write `WHERE rnk = 1` in the same query (window functions run *after* `WHERE`), so wrap it in a CTE or subquery:

```sql
WITH ranked AS (
    SELECT name, dept_id, salary,
           RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
    WHERE dept_id IS NOT NULL
)
SELECT dept_id, name, salary FROM ranked WHERE rnk = 1 ORDER BY dept_id;
```

```result
dept_id | name | salary
--------+------+-------
      1 | Omar | 120000
      2 | Sara |  65000
      3 | Neha |  55000
(3 rows)
```

**2 highest-paid people per department** — use `ROW_NUMBER` when you want *exactly* N rows per group, `DENSE_RANK` when you want N *salary levels* (ties included):

```sql
WITH ranked AS (
    SELECT name, dept_id, salary,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, name) AS rn
    FROM employees
    WHERE dept_id IS NOT NULL
)
SELECT dept_id, name, salary FROM ranked WHERE rn <= 2 ORDER BY dept_id, rn;
```

```result
dept_id | name  | salary
--------+-------+-------
      1 | Omar  | 120000
      1 | Asha  |  90000
      2 | Sara  |  65000
      2 | Karan |  60000
      3 | Neha  |  55000
(5 rows)
```

### Nth highest salary (a top-3 interview question)

```sql
-- 2nd highest DISTINCT salary
SELECT DISTINCT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS d FROM employees
) t
WHERE d = 2;
```

```result
salary
------
 90000
(1 row)
```

Change `d = 2` to any N. `DENSE_RANK` is right here because we want the Nth **distinct** salary. (Other ways: `LIMIT 1 OFFSET N-1` on `SELECT DISTINCT salary ... ORDER BY salary DESC`, or a correlated subquery — see the interview file.)

---

## 4. LAG and LEAD — look at the previous / next row

```sql
-- how did customer 1's order amount change from the previous order?
SELECT order_date, amount,
       LAG(amount)  OVER (ORDER BY order_date) AS previous_amount,
       amount - LAG(amount) OVER (ORDER BY order_date) AS change
FROM orders
WHERE customer_id = 1
ORDER BY order_date;
```

```result
order_date | amount | previous_amount | change
-----------+--------+-----------------+-------
2024-01-05 |    500 |            NULL |   NULL
2024-01-20 |    300 |             500 |   -200
2024-03-01 |    450 |             300 |    150
(3 rows)
```

The first row has no previous row, so `LAG` gives `NULL` (you can pass a default: `LAG(amount, 1, 0)`). `LEAD` looks **forward** instead.

Typical uses: month-over-month growth, time between two events, finding a value that changed.

---

## 5. Running total and moving average

```sql
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, id
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders
ORDER BY order_date, id;
```

```result
order_date | amount | running_total
-----------+--------+--------------
2024-01-05 |    500 |           500
2024-01-20 |    300 |           800
2024-02-02 |    700 |          1500
2024-02-14 |    200 |          1700
2024-03-01 |    450 |          2150
2024-03-09 |    150 |          2300
(6 rows)
```

Per-customer running total = add `PARTITION BY customer_id`. A **moving average** of the last 3 orders:

```sql
SELECT order_date, amount,
       ROUND(AVG(amount) OVER (ORDER BY order_date, id
                               ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_avg_3
FROM orders
ORDER BY order_date, id;
```

```result
order_date | amount | moving_avg_3
-----------+--------+-------------
2024-01-05 |    500 |        500.0
2024-01-20 |    300 |        400.0
2024-02-02 |    700 |        500.0
2024-02-14 |    200 |        400.0
2024-03-01 |    450 |        450.0
2024-03-09 |    150 |        266.7
(6 rows)
```

```
 frame options (which rows are in the window for the current row ●)
 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW   [■ ■ ■ ●] □ □      running total
 ROWS BETWEEN 2 PRECEDING AND CURRENT ROW              □ [■ ■ ●] □      moving average of 3
 ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING              □ [■ ● ■] □      centred average
```

> ⚠️ If you write only `ORDER BY` (no frame), the default is `RANGE ... UNBOUNDED PRECEDING`, which treats rows with the **same** `ORDER BY` value as one unit. For a clean running total use `ROWS` (as above) and add a unique tie-breaker.

---

## 6. Percentage of total

```sql
SELECT customer_id, amount,
       ROUND(amount * 100.0 / SUM(amount) OVER (PARTITION BY customer_id), 1) AS pct_of_customer_total
FROM orders
WHERE customer_id IN (1, 2)
ORDER BY customer_id, order_date;
```

```result
customer_id | amount | pct_of_customer_total
------------+--------+----------------------
          1 |    500 |                  40.0
          1 |    300 |                  24.0
          1 |    450 |                  36.0
          2 |    700 |                  82.4
          2 |    150 |                  17.6
(5 rows)
```

`OVER ()` with nothing inside = the whole result set is one window.

---

## 7. Cheat sheet

| Need | Use |
|---|---|
| Unique row number / remove duplicates / pagination | `ROW_NUMBER()` |
| Ranking with gaps after ties | `RANK()` |
| Nth highest **distinct** value | `DENSE_RANK()` |
| Compare with previous / next row | `LAG()` / `LEAD()` |
| Running total, moving average | `SUM()/AVG() OVER (ORDER BY … ROWS …)` |
| Share of total | `value / SUM(value) OVER (...)` |
| First / last value in a group | `FIRST_VALUE()`, `LAST_VALUE()` (watch the frame!) |
| Split into buckets | `NTILE(4)` |

| | `GROUP BY` | Window function |
|---|---|---|
| Rows in result | one per group | **same as input** |
| Can show detail columns next to the aggregate? | no | **yes** |
| Where used | `SELECT … GROUP BY` | in `SELECT` / `ORDER BY` only (not in `WHERE`) |

---

> 🗣️ **Interview mein aise bolo**: *"Window function rows ko collapse nahi karta. RANK mein ties ke baad gap aata hai, DENSE_RANK mein nahi — Nth highest distinct salary ke liye DENSE_RANK."*

## ⚡ Quick revision

- Window function = calculation across related rows **without collapsing** them.
- `ROW_NUMBER` unique · `RANK` gaps after ties · `DENSE_RANK` no gaps.
- `PARTITION BY` = restart per group · `ORDER BY` = order inside the window.
- Cannot filter a window result in `WHERE` → use a **CTE / subquery**.
- `LAG` = previous row, `LEAD` = next row.
- Running total → `SUM() OVER (ORDER BY … ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [05-indexes-views-and-performance.md](05-indexes-views-and-performance.md)
