# SQL 01 — Database & SQL Basics

> **Level**: Beginner · **Read time**: ~20 min · Sample tables: [sample-data.sql](sample-data.sql)

> **Definition**: A **database** is an organised collection of data. A **DBMS** (Database Management System) is the software that stores, reads and protects that data. An **RDBMS** is a DBMS that keeps data in **tables** linked by keys. **SQL** (Structured Query Language) is the language we use to talk to an RDBMS.

**In one line**: SQL = the language, MySQL / PostgreSQL / SQL Server / Oracle / SQLite = the software that understands it.

**Easy analogy — school attendance register**: Table ko school ki **attendance register** samjho. Register ka ek page = ek table. Har **row** ek student ki entry, har **column** ek field (name, roll no, city). **Roll number** kabhi repeat nahi hota → wahi **primary key** hai. Library card pe sirf "roll no 7" likha ho, toh wo wapas register ki taraf point karta hai → yeh **foreign key** hai.

```
 students  (table)
 ┌────┬────────┬─────────────────────┬─────┐
 │ id │ name   │ email               │ age │   ← columns (fields / attributes)
 ├────┼────────┼─────────────────────┼─────┤
 │  1 │ Aman   │ aman@x.com          │  20 │   ← row (record / tuple)
 │  2 │ Bela   │ bela@x.com          │  22 │
 └────┴────────┴─────────────────────┴─────┘
   PK = id (unique, never NULL)
```

---

## 1. DBMS vs RDBMS

| | DBMS | RDBMS |
|---|---|---|
| Data stored as | files / any format | **tables** (rows and columns) |
| Relationships | usually none | **yes** (primary key ↔ foreign key) |
| Rules (constraints) | limited | strong (NOT NULL, UNIQUE, CHECK…) |
| Multi-user + ACID | maybe | **yes** |
| Examples | file system, early XML stores | MySQL, PostgreSQL, Oracle, SQL Server |

> 💡 **Interview tip**: "SQL" and "MySQL" are **not** the same thing. SQL is a language, MySQL is a database product.

---

## 2. The 5 groups of SQL commands

| Group | Full name | What it does | Commands |
|---|---|---|---|
| **DDL** | Data Definition | creates / changes the **structure** | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Data Manipulation | changes the **data** | `INSERT`, `UPDATE`, `DELETE` |
| **DQL** | Data Query | reads data | `SELECT` |
| **DCL** | Data Control | permissions | `GRANT`, `REVOKE` |
| **TCL** | Transaction Control | saves or undoes work | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

---

## 3. Data types (the ones interviewers ask about)

| Type | Use for | Note |
|---|---|---|
| `INT`, `BIGINT` | whole numbers | `BIGINT` for ids that may cross 2 billion |
| `DECIMAL(p, s)` | **money**, exact numbers | `DECIMAL(10,2)` = 10 digits, 2 after the point |
| `FLOAT`, `DOUBLE` | scientific values | approximate → **never use for money** |
| `CHAR(n)` | fixed length (country code `IN`) | always uses n characters |
| `VARCHAR(n)` | variable length text (names) | uses only what it needs |
| `TEXT` | long text | blog body, description |
| `DATE`, `TIME`, `TIMESTAMP` | date and time | store in UTC |
| `BOOLEAN` | true / false | MySQL stores it as `TINYINT(1)` |

---

## 4. Create a table with constraints

**Constraint** = a rule the database enforces for you.

| Constraint | Meaning |
|---|---|
| `PRIMARY KEY` | unique + not null; identifies a row (only **one** per table) |
| `FOREIGN KEY` | value must exist in another table's key (keeps data consistent) |
| `UNIQUE` | no duplicates (NULL allowed, once or many depending on DB) |
| `NOT NULL` | value is required |
| `CHECK` | value must satisfy a condition |
| `DEFAULT` | value used when you give none |

```sql
CREATE TABLE students (
    id    INT PRIMARY KEY,
    name  VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age   INT CHECK (age >= 16),
    city  VARCHAR(50) DEFAULT 'Delhi'
);

CREATE TABLE enrollments (
    id         INT PRIMARY KEY,
    student_id INT NOT NULL,
    course     VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

---

## 5. INSERT, UPDATE, DELETE (DML)

```sql
INSERT INTO students (id, name, email, age) VALUES
    (1, 'Aman', 'aman@x.com', 20),
    (2, 'Bela', 'bela@x.com', 22);

UPDATE students SET age = 21 WHERE id = 1;

SELECT * FROM students;
```

```result
id | name | email      | age | city
---+------+------------+-----+------
 1 | Aman | aman@x.com |  21 | Delhi
 2 | Bela | bela@x.com |  22 | Delhi
(2 rows)
```

> ⚠️ `UPDATE` or `DELETE` **without `WHERE`** changes **every row**. In real work, first run the same condition as a `SELECT`.

The database rejects bad data — that is the whole point of constraints:

```sql
-- expect-error
INSERT INTO students (id, name) VALUES (1, 'Duplicate id');   -- PRIMARY KEY violated
```

```sql
-- expect-error
INSERT INTO students (id, name, age) VALUES (3, 'Kid', 10);   -- CHECK (age >= 16) violated
```

```sql
-- expect-error
INSERT INTO enrollments (id, student_id, course) VALUES (1, 99, 'SQL');   -- student 99 does not exist (FOREIGN KEY)
```

### What happens to child rows? (`ON DELETE`)

| Option | When the parent row is deleted… |
|---|---|
| `RESTRICT` / `NO ACTION` (default) | delete is **blocked** if children exist |
| `CASCADE` | children are **deleted too** |
| `SET NULL` | child's foreign key becomes `NULL` |

```sql
INSERT INTO enrollments (id, student_id, course) VALUES (1, 1, 'SQL'), (2, 1, 'MongoDB'), (3, 2, 'SQL');
DELETE FROM students WHERE id = 1;          -- CASCADE removes Aman's enrollments too
SELECT * FROM enrollments;
```

```result
id | student_id | course
---+------------+-------
 3 |          2 | SQL
(1 row)
```

---

## 6. ALTER — change the structure (DDL)

```sql
ALTER TABLE students ADD COLUMN phone VARCHAR(15);
ALTER TABLE students RENAME COLUMN phone TO mobile;
ALTER TABLE students DROP COLUMN mobile;
```

Changing a column's type differs by database:

```mysql
ALTER TABLE students MODIFY COLUMN name VARCHAR(100);              -- MySQL
```

```postgresql
ALTER TABLE students ALTER COLUMN name TYPE VARCHAR(100);          -- PostgreSQL
```

---

## 7. Keys — the classic interview table

Take `employees(id, name, email, phone)`.

| Key | Meaning | Example |
|---|---|---|
| **Super key** | any set of columns that identifies a row | `{id}`, `{id, name}`, `{email}` |
| **Candidate key** | a **minimal** super key (nothing can be removed) | `{id}`, `{email}`, `{phone}` |
| **Primary key** | the candidate key you **choose** | `id` |
| **Alternate key** | candidates you did **not** choose | `email`, `phone` |
| **Composite key** | key made of 2+ columns | `(student_id, course_id)` in an enrollment table |
| **Foreign key** | column that points to another table's key | `employees.dept_id → departments.id` |
| **Surrogate key** | artificial id with no meaning (auto-increment, UUID) | `id` |
| **Natural key** | real-world value used as key | email, PAN number |

```
 super keys ⊇ candidate keys ⊇ primary key
 (every primary key is a candidate key, every candidate key is a super key)
```

**Primary key vs Unique key**: PK = one per table, never `NULL`. Unique = many per table, `NULL` allowed.

---

## 8. DELETE vs TRUNCATE vs DROP

| | `DELETE` | `TRUNCATE` | `DROP` |
|---|---|---|---|
| Type | DML | DDL | DDL |
| Removes | chosen rows (with `WHERE`) or all | **all rows** | rows **and the table** itself |
| `WHERE` allowed? | yes | no | no |
| Speed | slower (row by row, logged) | fast | fast |
| Rollback | yes (inside a transaction) | usually **no** (MySQL); yes in PostgreSQL | usually no |
| Resets auto-increment | no | **yes** | table gone |

```mysql
DELETE FROM students WHERE id = 2;   -- some rows
TRUNCATE TABLE students;             -- all rows, keep the table
DROP TABLE students;                 -- remove the table itself
```

---

> 🗣️ **Interview mein aise bolo**: *"SQL ek language hai aur MySQL ek database product. RDBMS mein data tables mein rehta hai, keys se related hota hai, aur constraints database khud enforce karta hai."*

## ⚡ Quick revision

- **SQL** = language, **RDBMS** = software that stores data in related tables.
- 5 command groups: **DDL, DML, DQL, DCL, TCL**.
- **Primary key** = unique + not null, one per table. **Foreign key** = link to another table.
- Money → `DECIMAL`, never `FLOAT`. Names → `VARCHAR`.
- `DELETE` (rows, rollback-able) · `TRUNCATE` (all rows, fast) · `DROP` (whole table).
- `ON DELETE CASCADE` deletes children automatically.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [02-select-filter-aggregate.md](02-select-filter-aggregate.md)
