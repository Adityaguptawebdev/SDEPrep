# DB 2/3 — Every SQL Question Reported in Visa Interviews (with tested answers)

> Each problem: **schema → problem → query → real output → explanation → follow-up**. Every ```sql block was executed in **SQLite 3.51** and the ```text block under it is the real output. Syntax that differs in MySQL/PostgreSQL is shown in ```mysql blocks (not executed) and called out.

**Easy analogy — SQL = kirana store ka hisaab**: `WHERE` = pehle kaun se bill dekhne hain (sirf September ke), `GROUP BY` = bills ko customer ke hisaab se alag dher mein rakho, `HAVING` = sirf woh dher dikhao jinka total ₹1000 se zyada ho. Order yaad rakho: **pehle rows chhaanto (WHERE), phir dher banao (GROUP BY), phir dher chhaanto (HAVING).**

| # | Problem | Reporter | Freq |
|---|---|---|---|
| 1 | Students per department with CGPA > 9 | **EC** (1.10 YOE) | LOW |
| 2 | Find (and delete) duplicate rows | **EC** (1.10 YOE) | LOW |
| 3 | Count of males and females | **EC** (1.7 YOE, selected) | LOW |
| 4 | Second highest salary | NCG + Data Eng | MEDIUM (2) |
| 5 | Datacenters → servers → microservices: schema + count per datacenter | ? (2025) | LOW |
| 6 | Order-delivery schema + monthly order cost summary | NCG (selected) | LOW |
| 7 | Query across two tables, then optimise it | **EC** (6–18 mo band) | LOW |
| 8–11 | Employee–manager self-join · duplicates without joins · "not in Marketing" · even/odd sums | Data Engineer (1–2 YOE, adjacent role) | LOW each |
| 12 | Actors from your favourite genre | Senior Data Scientist (adjacent role) | LOW |

Overall, **at least one SQL question** appears in many early-career Visa reports → **HIGH** as a round component ([research](../01-hiring-process/research-findings.md#1-executive-summary-read-this-first)).

---

## 1. Students per department with CGPA > 9

**Source**: [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) · Jun 2025 · **SDE-1, 1.10 YOE** · technical round 2 (rejected). Table given: `student(StudentId, Name, Dep, CGPA)` — *"print number of students in each dep where cgpa > 9"*.

```sql
DROP TABLE IF EXISTS student;
CREATE TABLE student (StudentId INTEGER PRIMARY KEY, Name TEXT, Dep TEXT, CGPA REAL);
INSERT INTO student VALUES
 (1,'Asha','CSE',9.4),(2,'Ravi','CSE',8.7),(3,'Neha','ECE',9.1),
 (4,'Kabir','CSE',9.8),(5,'Isha','ME',7.9),(6,'Om','ECE',8.2);
```

**The query the candidate wrote** — `select Dep, count(*) from student group by Dep having cgpa > 9;` — is **wrong**: `HAVING` filters **groups**, and `CGPA` is neither grouped nor aggregated. PostgreSQL/MySQL (strict mode) reject it. SQLite quietly runs it and returns misleading numbers — look:

```sql
SELECT Dep, COUNT(*) AS count FROM student GROUP BY Dep HAVING CGPA > 9;   -- WRONG
```

```text
Dep  count
---  -----
CSE  3    
ECE  2    
```

It returned the **total** head-count of CSE (3) and ECE (2) instead of the toppers (2 and 1). SQLite took `CGPA` from one arbitrary row of each group, and those rows happened to be above 9; ME disappeared for the same accidental reason. A query that "works" by accident is the worst kind of bug.

**Correct** — filter rows **before** grouping:

```sql
SELECT Dep, COUNT(*) AS toppers
FROM student
WHERE CGPA > 9
GROUP BY Dep
ORDER BY Dep;
```

```text
Dep  toppers
---  -------
CSE  2      
ECE  1      
```

**Follow-ups**: include departments with **zero** toppers → conditional aggregation `SUM(CASE WHEN CGPA > 9 THEN 1 ELSE 0 END)` over all rows · average CGPA per department only for departments with ≥ 2 students (**that's** where `HAVING COUNT(*) >= 2` belongs).

```sql
SELECT Dep, SUM(CASE WHEN CGPA > 9 THEN 1 ELSE 0 END) AS toppers, COUNT(*) AS total
FROM student GROUP BY Dep ORDER BY Dep;
```

```text
Dep  toppers  total
---  -------  -----
CSE  2        3    
ECE  1        2    
ME   0        1    
```

**🗣️ Interview mein aise bolo**: "Row-level condition WHERE mein, group-level condition (aggregate pe) HAVING mein. CGPA > 9 har student ki condition hai, toh WHERE."

---

## 2. Find (and delete) duplicate rows

**Source**: same round, [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) — *"duplicate row in the table"*. The candidate wrote `select * from student groupby studentId having count(*) > 1` — two problems: a primary key can't have duplicates (so this finds nothing), and `SELECT *` with `GROUP BY` one column isn't valid standard SQL. "Duplicate" means the **business columns** repeat (with different ids).

```sql
DROP TABLE IF EXISTS signup;
CREATE TABLE signup (id INTEGER PRIMARY KEY, email TEXT, name TEXT, city TEXT);
INSERT INTO signup VALUES
 (1,'a@x.com','Asha','Pune'),(2,'b@x.com','Ravi','Delhi'),(3,'a@x.com','Asha','Pune'),
 (4,'c@x.com','Neha','Goa'),(5,'a@x.com','Asha','Pune'),(6,'b@x.com','Ravi','Mumbai');
```

**Which values are duplicated, and how many times?**

```sql
SELECT email, name, city, COUNT(*) AS copies
FROM signup
GROUP BY email, name, city
HAVING COUNT(*) > 1;
```

```text
email    name  city  copies
-------  ----  ----  ------
a@x.com  Asha  Pune  3     
```

**Show every duplicate row (with ids)** — window function:

```sql
SELECT id, email, name, city
FROM (SELECT s.*, COUNT(*) OVER (PARTITION BY email, name, city) AS c FROM signup s) t
WHERE c > 1
ORDER BY id;
```

```text
id  email    name  city
--  -------  ----  ----
1   a@x.com  Asha  Pune
3   a@x.com  Asha  Pune
5   a@x.com  Asha  Pune
```

**Delete duplicates, keep the lowest id** (follow-up that often comes next):

```sql
DELETE FROM signup
WHERE id NOT IN (SELECT MIN(id) FROM signup GROUP BY email, name, city);
SELECT * FROM signup ORDER BY id;
```

```text
id  email    name  city  
--  -------  ----  ------
1   a@x.com  Asha  Pune  
2   b@x.com  Ravi  Delhi 
4   c@x.com  Neha  Goa   
6   b@x.com  Ravi  Mumbai
```

(`b@x.com` has two rows with **different** cities, so they are not full duplicates and both stay.) Then prevent it: `CREATE UNIQUE INDEX ux_signup_email ON signup(email);`.

---

## 3. Count of males and females

**Source**: [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) · Apr 2025 · **SDE-1, 1.7 YOE (selected)** — *"given a table with id and gender, find the count of male and females via SQL query"*. The candidate knew `GROUP BY gender` but got confused while writing and offered two queries — practise writing it cleanly.

```sql
DROP TABLE IF EXISTS emp;
CREATE TABLE emp (id INTEGER PRIMARY KEY, gender TEXT);
INSERT INTO emp VALUES (1,'M'),(2,'F'),(3,'F'),(4,'M'),(5,'F'),(6,NULL);
```

```sql
SELECT gender, COUNT(id) AS total FROM emp GROUP BY gender ORDER BY gender;
```

```text
gender  total
------  -----
        1    
F       3    
M       2    
```

**One row, two columns** (pivot with conditional aggregation — a nice follow-up):

```sql
SELECT SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS males,
       SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS females,
       SUM(CASE WHEN gender IS NULL THEN 1 ELSE 0 END) AS unknown
FROM emp;
```

```text
males  females  unknown
-----  -------  -------
2      3        1      
```

**Trap**: `NULL` forms its own group (the empty `gender` row above); `COUNT(gender)` would skip NULLs while `COUNT(*)` counts them.

---

## 4. Second highest salary (and N-th highest)

**Sources**: [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) (Feb 2025, on-campus NCG, round 2) and [LC-7104374](https://leetcode.com/discuss/post/7104374/big-data-engineer-interview-at-visa-by-a-p2p6/) (Aug 2025, Big Data Engineer 1–2 YOE) → **MEDIUM**. Classic: [LC 176](https://leetcode.com/problems/second-highest-salary/).

```sql
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INTEGER, manager_id INTEGER);
INSERT INTO employees VALUES
 (1,'Meera','Risk',300000,NULL),(2,'Rahul','Risk',240000,1),(3,'Aditi','Payments',180000,1),
 (4,'Arjun','Payments',160000,3),(5,'Anil','Payments',240000,3),(6,'Zoya','Risk',120000,2);
```

**Way 1 — subquery (works everywhere)**:

```sql
SELECT MAX(salary) AS second_highest FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

```text
second_highest
--------------
240000        
```

**Way 2 — DISTINCT + LIMIT/OFFSET** (returns no row if it doesn't exist; wrap in a subquery to get NULL):

```sql
SELECT (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;
```

```text
second_highest
--------------
240000        
```

**Way 3 — `DENSE_RANK()`** (best for N-th highest and "per department"):

```sql
SELECT dept, name, salary
FROM (SELECT e.*, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk FROM employees e) t
WHERE rnk = 2
ORDER BY dept;
```

```text
dept      name   salary
--------  -----  ------
Payments  Aditi  180000
Risk      Rahul  240000
```

**Why DENSE_RANK and not ROW_NUMBER?** Across the whole company Rahul and Anil tie at 240000; `ROW_NUMBER` would arbitrarily call one of them "2nd" and the other "3rd". `RANK` leaves gaps (1, 2, 2, 4), `DENSE_RANK` doesn't (1, 2, 2, 3) — "N-th highest **salary**" means distinct salary values → `DENSE_RANK`.

---

## 5. Datacenters → servers → microservices (schema design + count)

**Source**: [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/) · Mar 2025 · round 1 — *"we have datacenters, each datacenter has some servers, these servers have some microservices running; design the DB schema, then write a query to list the total number of microservices hosted by each datacenter."*

```
 datacenter 1───* server *───* microservice          (a service runs on many servers,
                    └── deployment (server_id, service_id) ──┘    a server runs many services)
```

```sql
DROP TABLE IF EXISTS deployment; DROP TABLE IF EXISTS server;
DROP TABLE IF EXISTS microservice; DROP TABLE IF EXISTS datacenter;
CREATE TABLE datacenter (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, region TEXT);
CREATE TABLE server (id INTEGER PRIMARY KEY, hostname TEXT NOT NULL UNIQUE,
                     datacenter_id INTEGER NOT NULL REFERENCES datacenter(id));
CREATE TABLE microservice (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE deployment (server_id INTEGER NOT NULL REFERENCES server(id),
                         service_id INTEGER NOT NULL REFERENCES microservice(id),
                         PRIMARY KEY (server_id, service_id));        -- composite key: no duplicates
CREATE INDEX ix_server_dc ON server(datacenter_id);
INSERT INTO datacenter VALUES (1,'BLR-1','IN'),(2,'MUM-1','IN'),(3,'SIN-1','SG');
INSERT INTO server VALUES (10,'blr-a',1),(11,'blr-b',1),(20,'mum-a',2);
INSERT INTO microservice VALUES (100,'auth'),(101,'payments'),(102,'fraud');
INSERT INTO deployment VALUES (10,100),(10,101),(11,101),(11,102),(20,100);
```

```sql
SELECT d.name AS datacenter, COUNT(DISTINCT dep.service_id) AS microservices
FROM datacenter d
LEFT JOIN server s       ON s.datacenter_id = d.id
LEFT JOIN deployment dep ON dep.server_id = s.id
GROUP BY d.id, d.name
ORDER BY d.name;
```

```text
datacenter  microservices
----------  -------------
BLR-1       3            
MUM-1       1            
SIN-1       0            
```

**Explanation**: `LEFT JOIN` keeps SIN-1 (no servers) with 0; `COUNT(DISTINCT …)` counts `payments` once in BLR-1 even though it runs on two servers.
**Follow-ups**: "instances per service per DC" (`COUNT(*)` instead of `DISTINCT`) · which DCs run **all** services (relational division: `HAVING COUNT(DISTINCT service_id) = (SELECT COUNT(*) FROM microservice)`) · which index helps (`deployment(server_id)` is covered by the PK; add `server(datacenter_id)`).

---

## 6. Order delivery system: schema + monthly order cost summary

**Source**: [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) · 2025 · new grad (selected) · round 2 — *"database schema for customers and orders; API routes for customer creation, retrieval, order status filtering; SQL query for monthly order cost summaries."* (API routes: [Spring 2/5 §2](../05-spring-boot/02-rest-apis-filters-exceptions.md#2-a-crud-rest-controller-the-product-with-crud-operations-question).)

```sql
DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS customers;
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
                        created_at TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY,
                     customer_id INTEGER NOT NULL REFERENCES customers(id),
                     status TEXT NOT NULL CHECK (status IN ('PLACED','DISPATCHED','DELIVERED','CANCELLED')),
                     amount_paise INTEGER NOT NULL CHECK (amount_paise >= 0),
                     ordered_at TEXT NOT NULL);
CREATE INDEX ix_orders_customer_time ON orders(customer_id, ordered_at);
CREATE INDEX ix_orders_status ON orders(status);
INSERT INTO customers VALUES (1,'Asha','asha@x.com','2025-01-02'),(2,'Ravi','ravi@x.com','2025-02-10');
INSERT INTO orders VALUES
 (1,1,'DELIVERED',49900,'2025-08-03'),(2,1,'DELIVERED',12000,'2025-08-21'),
 (3,2,'CANCELLED',99900,'2025-08-25'),(4,2,'DELIVERED',25000,'2025-09-01'),
 (5,1,'PLACED',5000,'2025-09-14'),(6,2,'DELIVERED',7500,'2025-09-30');
```

**Monthly summary per customer** (ignore cancelled orders):

```sql
SELECT c.name,
       strftime('%Y-%m', o.ordered_at) AS month,
       COUNT(*) AS orders,
       SUM(o.amount_paise) / 100.0 AS total_rupees
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status <> 'CANCELLED'
GROUP BY c.name, month
ORDER BY month, c.name;
```

```text
name  month    orders  total_rupees
----  -------  ------  ------------
Asha  2025-08  2       619.0       
Asha  2025-09  1       50.0        
Ravi  2025-09  2       325.0       
```

Same thing in MySQL / PostgreSQL (date function differs):

```mysql
-- MySQL:      DATE_FORMAT(o.ordered_at, '%Y-%m')
-- PostgreSQL: to_char(o.ordered_at, 'YYYY-MM')   or   date_trunc('month', o.ordered_at)
```

**"Filter orders by status" endpoint** → `SELECT … FROM orders WHERE customer_id = ? AND status = ? ORDER BY ordered_at DESC LIMIT 20` → the composite index `(customer_id, ordered_at)` plus the status filter keeps it fast.
**Follow-ups**: store money as integer paise (never FLOAT) · order line items table (`order_items`) for normalisation · status history table for auditing · soft delete vs hard delete.

---

## 7. A query across two tables — then optimise it

**Source**: [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) · May 2025 · **SDE-1, 6–18 months band** · round 3 — *"a relational data operation where I had to write and optimize a SQL query across two tables."* The exact query isn't public — **reconstructed** practice using the tables from §6: *top 2 customers by delivered spend since 2025-08-01*.

```sql
SELECT c.id, c.name, SUM(o.amount_paise) AS spend
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'DELIVERED' AND o.ordered_at >= '2025-08-01'
GROUP BY c.id, c.name
ORDER BY spend DESC
LIMIT 2;
```

```text
id  name  spend
--  ----  -----
1   Asha  61900
2   Ravi  32500
```

**How to "optimise" out loud**
1. `EXPLAIN` / `EXPLAIN QUERY PLAN` first — don't guess.
2. Index the join key and the filters: here `orders(customer_id, ordered_at)` exists; for a status + date filter a composite index **`(status, ordered_at, customer_id, amount_paise)`** lets the DB answer from the index alone (**covering index**).
3. Filter early (WHERE before GROUP BY), select only needed columns (no `SELECT *`), avoid functions on indexed columns in WHERE (`strftime(ordered_at) = …` can't use the index; use a range instead).

```sql
CREATE INDEX ix_orders_status_time_cover ON orders(status, ordered_at, customer_id, amount_paise);
EXPLAIN QUERY PLAN
SELECT c.id, c.name, SUM(o.amount_paise) AS spend
FROM customers c JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'DELIVERED' AND o.ordered_at >= '2025-08-01'
GROUP BY c.id, c.name ORDER BY spend DESC LIMIT 2;
```

```text
QUERY PLAN
|--SEARCH o USING COVERING INDEX ix_orders_status_time_cover (status=? AND ordered_at>?)
|--SEARCH c USING INTEGER PRIMARY KEY (rowid=?)
|--USE TEMP B-TREE FOR GROUP BY
`--USE TEMP B-TREE FOR ORDER BY
```

`USING COVERING INDEX` = the orders table itself is never read. (Plan text is SQLite's; MySQL/PostgreSQL show similar information with `EXPLAIN`/`EXPLAIN ANALYZE`.)

---

## 8–11. Data-engineer round SQL (adjacent role, 1–2 YOE)

**Source**: [LC-7104374](https://leetcode.com/discuss/post/7104374/big-data-engineer-interview-at-visa-by-a-p2p6/) · Aug 2025 · **Big Data Engineer, 1–2 YOE** (not SWE, but same company, same level, and these are standard SWE SQL questions too).

**8. Employees and their managers (self-join)** — uses the `employees` table from §4:

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id          -- LEFT: keep the CEO (no manager)
ORDER BY e.id;
```

```text
employee  manager
--------  -------
Meera            
Rahul     Meera  
Aditi     Meera  
Arjun     Aditi  
Anil      Aditi  
Zoya      Rahul  
```

**9. Rows of table B that also exist in A — "without joins"** → `EXISTS` (or `INTERSECT`):

```sql
DROP TABLE IF EXISTS a; DROP TABLE IF EXISTS b;
CREATE TABLE a (card_token TEXT); CREATE TABLE b (card_token TEXT);
INSERT INTO a VALUES ('tok1'),('tok2'),('tok3');
INSERT INTO b VALUES ('tok2'),('tok9'),('tok3'),('tok3');
SELECT DISTINCT card_token FROM b
WHERE EXISTS (SELECT 1 FROM a WHERE a.card_token = b.card_token)
ORDER BY card_token;
```

```text
card_token
----------
tok2      
tok3      
```

**10. Employees who have NOT worked on any Marketing project** — the candidate's version (`WHERE DepartmentName <> 'Marketing' OR DepartmentName IS NULL`) is a classic bug: someone on a Marketing **and** a Finance project still appears. Use `NOT EXISTS`:

```sql
DROP TABLE IF EXISTS emp_project; DROP TABLE IF EXISTS project;
CREATE TABLE project (id INTEGER PRIMARY KEY, dept TEXT);
CREATE TABLE emp_project (emp_id INTEGER, project_id INTEGER);
INSERT INTO project VALUES (1,'Marketing'),(2,'Finance'),(3,'Risk');
INSERT INTO emp_project VALUES (1,1),(1,2),(2,2),(3,3),(4,1);
-- employees 1..6 come from the employees table (§4); 5 and 6 have no projects
SELECT e.id, e.name FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM emp_project ep JOIN project p ON p.id = ep.project_id
                  WHERE ep.emp_id = e.id AND p.dept = 'Marketing')
ORDER BY e.id;
```

```text
id  name 
--  -----
2   Rahul
3   Aditi
5   Anil 
6   Zoya 
```

(Meera, id 1, works on Marketing **and** Finance → correctly excluded. Avoid `NOT IN (subquery)` if the subquery can return NULL — then it returns no rows at all.)

**11. Sum of even and odd numbers in a column**:

```sql
DROP TABLE IF EXISTS numbers;
CREATE TABLE numbers (n INTEGER);
INSERT INTO numbers VALUES (1),(2),(3),(4),(5),(10);
SELECT SUM(CASE WHEN n % 2 = 0 THEN n ELSE 0 END) AS even_sum,
       SUM(CASE WHEN n % 2 <> 0 THEN n ELSE 0 END) AS odd_sum
FROM numbers;
```

```text
even_sum  odd_sum
--------  -------
16        9      
```

---

## 12. Actors from your favourite genre (Senior Data Scientist round)

**Source**: [LC-6937441](https://leetcode.com/discuss/post/6937441/visa-coding-round-bengaluru-senior-data-t3zk2/) · Jul 2025 · Senior Data Scientist, Bengaluru (adjacent role) — tables `WatchedMovies(movie_id, genre)`, `GenreActors(genre, actor_id)`, `Actors(actor_id, age)`: *"find the actors you'd be interested in based on your favourite genre (the genre you watched most); return actor_id and age sorted by age desc."*

```sql
DROP TABLE IF EXISTS watched; DROP TABLE IF EXISTS genre_actors; DROP TABLE IF EXISTS actors;
CREATE TABLE watched (movie_id INTEGER, genre TEXT);
CREATE TABLE genre_actors (genre TEXT, actor_id INTEGER);
CREATE TABLE actors (actor_id INTEGER, age INTEGER);
INSERT INTO watched VALUES (1,'Action'),(2,'Comedy'),(3,'Action'),(4,'Drama');
INSERT INTO genre_actors VALUES ('Action',10),('Comedy',12),('Drama',13),('Action',11);
INSERT INTO actors VALUES (10,45),(11,50),(12,30),(13,60);
WITH genre_counts AS (
  SELECT genre, COUNT(*) AS watched_count FROM watched GROUP BY genre
), favourite AS (
  SELECT genre FROM genre_counts
  WHERE watched_count = (SELECT MAX(watched_count) FROM genre_counts)   -- keeps ties
)
SELECT a.actor_id, a.age
FROM actors a
JOIN genre_actors ga ON ga.actor_id = a.actor_id
WHERE ga.genre IN (SELECT genre FROM favourite)
ORDER BY a.age DESC;
```

```text
actor_id  age
--------  ---
11        50 
10        45 
```

**Tie note**: `ORDER BY count DESC LIMIT 1` silently drops a tied favourite genre; comparing with `MAX` keeps all of them — say which behaviour you chose.

---

⚡ **Quick revision**: WHERE filters rows, HAVING filters groups · duplicates = GROUP BY business columns HAVING COUNT(*) > 1; delete keeping MIN(id) · pivot with SUM(CASE…) · N-th highest = DENSE_RANK · LEFT JOIN + COUNT(DISTINCT) for "including zero" · EXISTS / NOT EXISTS instead of IN / NOT IN with NULLs · money as integer paise · optimise with EXPLAIN + composite/covering indexes + ranges instead of functions on columns.

Next: [DB 3/3 — NoSQL & MongoDB →](03-nosql-mongodb.md)
