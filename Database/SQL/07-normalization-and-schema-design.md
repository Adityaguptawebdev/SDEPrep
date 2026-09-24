# SQL 07 — Normalization & Schema Design

> **Level**: Intermediate · **Read time**: ~25 min

> **Definition**: **Normalization** is the process of organising tables so that **each fact is stored only once**. It removes duplicate data and prevents *insert, update and delete anomalies*. **Denormalization** is the opposite: adding controlled duplication on purpose to make reads faster.

**In one line**: One fact → one place. Link tables with keys instead of copying data.

**Easy analogy — kirana store udhaar register**: Kirana dukaan ka **udhaar register**: agar dukaandaar har entry pe customer ka poora naam, phone aur address baar-baar likhe, aur customer ka number badle, toh 40 pages fix karne padenge (**update anomaly**) aur kuch chhoot bhi sakte hain. Behtar hai: customer ka **alag card** (card number ke saath), aur udhaar ke pages pe sirf "card no. 12, ₹200". Yahi normalization hai.

```
 BAD (one big table)                                 GOOD (normalized)
 ┌────────┬────────┬────────┬─────────┬───────┐      customers          orders
 │order_id│ cust   │ phone  │ product │ price │      ┌────┬──────┬─────┐  ┌──────────┬─────────────┐
 │ 1      │ Anil   │ 98111  │ Pen     │ 10    │      │ id │ name │phone│  │ order_id │ customer_id │
 │ 2      │ Anil   │ 98111  │ Book    │ 50    │      │ 1  │ Anil │98111│◄─│ 1        │ 1           │
 │ 3      │ Anil   │ 98111  │ Pen     │ 10    │      └────┴──────┴─────┘  │ 2        │ 1           │
 └────────┴────────┴────────┴─────────┴───────┘                            └──────────┴─────────────┘
   Anil's phone stored 3 times ✗                        phone stored ONCE ✓
```

---

## 1. The three anomalies (why we normalize)

| Anomaly | Meaning | Example in the bad table |
|---|---|---|
| **Insert** | cannot add one fact without another | cannot add a new product until someone orders it |
| **Update** | same fact in many rows → must change all | change Anil's phone in 3 places, miss one → conflicting data |
| **Delete** | deleting a row loses unrelated facts | delete Anil's only order → we lose Anil's phone number |

---

## 2. Functional dependency (the idea behind normal forms)

`A → B` means: **if you know A, you know exactly one B**.
`customer_id → customer_name` is true. `customer_name → customer_id` is not (two customers can share a name).

---

## 3. Normal forms with one worked example

Start with a messy table:

| order_id | customer | phone | products |
|---|---|---|---|
| 1 | Anil | 98111, 98222 | Pen, Notebook |

### 1NF — every cell holds **one** value, no repeating groups

Rule: atomic values, no lists inside a cell, each row identifiable.

| order_id | product_id | product_name | qty | customer_id | customer_name | phone |
|---|---|---|---|---|---|---|
| 1 | P1 | Pen | 10 | 1 | Anil | 98111 |
| 1 | P2 | Notebook | 2 | 1 | Anil | 98111 |

Primary key = `(order_id, product_id)`.

### 2NF — 1NF **and** no *partial* dependency

Rule: every non-key column must depend on the **whole** key, not just a part of a composite key.

- `product_name` depends only on `product_id` (part of the key) ✗
- `customer_name` depends only on `order_id` (part of the key) ✗

Split them out:

```
 orders(order_id, customer_id, customer_name, phone)
 order_items(order_id, product_id, qty)
 products(product_id, product_name, price)
```

### 3NF — 2NF **and** no *transitive* dependency

Rule: non-key columns must depend **only on the key** — not on another non-key column.

In `orders`: `order_id → customer_id → customer_name, phone`. Name and phone depend on `customer_id`, not directly on `order_id` ✗. Split again:

```
 customers(customer_id, name, phone)
 orders(order_id, customer_id)
 order_items(order_id, product_id, qty)
 products(product_id, product_name, price)
```

> 💡 **Memory line**: *"Every non-key column depends on **the key** (1NF), **the whole key** (2NF), and **nothing but the key** (3NF), so help me Codd."*

### BCNF (Boyce-Codd) — a stricter 3NF

Rule: for **every** dependency `X → Y`, `X` must be a **super key**.

`class(student, subject, teacher)` where each teacher teaches only one subject: `teacher → subject`. But `teacher` is not a key of the table ✗ → split into `teacher_subject(teacher, subject)` and `student_teacher(student, teacher)`.

| Form | Removes |
|---|---|
| 1NF | repeating groups / multi-valued cells |
| 2NF | partial dependency (composite keys) |
| 3NF | transitive dependency |
| BCNF | any dependency whose left side is not a super key |

Most real systems aim for **3NF**.

---

## 4. Relationships and how to model them

| Relationship | Example | How to store |
|---|---|---|
| **One-to-one** | user ↔ passport | foreign key + `UNIQUE` (or same primary key) |
| **One-to-many** | department → employees | foreign key on the **"many"** side (`employees.dept_id`) |
| **Many-to-many** | books ↔ authors, students ↔ courses | a **junction (bridge) table** with two foreign keys |

```
 books ────< book_authors >──── authors           (junction table makes many-to-many possible)
 ┌────┬───────────┐  ┌─────────┬───────────┐     ┌────┬────────┐
 │ id │ title     │  │ book_id │ author_id │     │ id │ name   │
 │ 1  │ SQL Basics│  │ 1       │ 1         │     │ 1  │ Rekha  │
 │ 2  │ Mongo 101 │  │ 1       │ 2         │     │ 2  │ Sameer │
 └────┴───────────┘  │ 2       │ 2         │     └────┴────────┘
                     └─────────┴───────────┘
                     PK = (book_id, author_id)
```

```sql
CREATE TABLE books   (id INT PRIMARY KEY, title VARCHAR(100));
CREATE TABLE authors (id INT PRIMARY KEY, name  VARCHAR(50));
CREATE TABLE book_authors (
    book_id   INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id)   REFERENCES books(id),
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO books   VALUES (1, 'SQL Basics'), (2, 'Mongo 101');
INSERT INTO authors VALUES (1, 'Rekha'), (2, 'Sameer');
INSERT INTO book_authors VALUES (1, 1), (1, 2), (2, 2);

SELECT b.title, a.name AS author
FROM books b
JOIN book_authors ba ON ba.book_id = b.id
JOIN authors a       ON a.id = ba.author_id
ORDER BY b.title, a.name;
```

```result
title      | author
-----------+-------
Mongo 101  | Sameer
SQL Basics | Rekha
SQL Basics | Sameer
(3 rows)
```

---

## 5. Denormalization — when to break the rules

Normalized data needs **joins** on every read. If reads are far more common than writes (reports, dashboards, feeds), you can store some data twice.

| | Normalized | Denormalized |
|---|---|---|
| Duplicate data | none | some (on purpose) |
| Writes | simple, one place to update | must update all copies |
| Reads | need joins (slower) | fewer joins (**faster**) |
| Risk | – | copies can drift apart |
| Good for | **OLTP** (orders, payments, banking) | **OLAP / reporting**, read-heavy apps, caches |

Examples: store `order_total` in `orders` instead of summing items each time; keep `comment_count` on a post; a **star schema** in a data warehouse (one big *fact* table + small *dimension* tables).

| | OLTP | OLAP |
|---|---|---|
| Purpose | day-to-day transactions | analysis and reports |
| Queries | many small reads/writes | few huge reads/aggregations |
| Design | normalized | denormalized (star/snowflake) |

---

## 6. Practical schema-design tips

- Give every table a **primary key**. Index every **foreign key** you join on.
- Use the **right type**: money → `DECIMAL`, dates → `DATE`/`TIMESTAMP` (not text), flags → `BOOLEAN`.
- **Never store lists** as comma-separated text (`'red,blue'`) — use a child table.
- Add **audit columns**: `created_at`, `updated_at` (and `created_by` if needed).
- **Soft delete** (`is_deleted` / `deleted_at`) when you may need the data back; remember to filter it in every query.
- Choose a key style: **auto-increment** (small, ordered, easy) vs **UUID** (safe to generate anywhere, good for distributed systems, bigger and unordered).
- Use `NOT NULL`, `UNIQUE`, `CHECK` and foreign keys — let the database protect your data.
- Name things consistently (`snake_case`, singular or plural — pick one).

---

> 🗣️ **Interview mein aise bolo**: *"Normalization mein har fact sirf ek jagah store hota hai. Main 3NF tak jaata hun, aur read-heavy reports ke liye jaan-boojh ke denormalize karta hun."*

## ⚡ Quick revision

- Normalization = **store each fact once**; it prevents insert/update/delete anomalies.
- **1NF** atomic cells · **2NF** no partial dependency · **3NF** no transitive dependency · **BCNF** left side of every dependency is a super key.
- One-to-many → foreign key on the "many" side. Many-to-many → **junction table**.
- Denormalize for **read speed** (reporting, OLAP), accept the risk of duplicated data.
- OLTP = normalized and transactional. OLAP = denormalized and analytical.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [MongoDB 01 — Basics](../MongoDB/01-mongodb-basics.md)
