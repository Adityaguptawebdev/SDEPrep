# 06 — Database & SQL for Visa

> SQL blocks run in **SQLite 3.51**; MongoDB blocks run with **mongosh on MongoDB 7.0** (replica set). The outputs shown are real. MySQL/PostgreSQL-only syntax is shown in ```mysql blocks and not executed.

**Easy analogy — DB round = CA checking your account books**: CA sirf total nahi dekhta — poochta hai "yeh entry kahan se aayi (join)? do baar toh nahi likhi (duplicates)? transaction beech mein toot gaya toh (ACID)? itni badi bahi mein ek entry jaldi kaise dhoondhoge (index)?"

## What Visa candidates were asked (ranked)

| Rank | Topic | Reports | Freq | Where |
|---|---|---|---|---|
| 1 | Writing a SQL query live (GROUP BY/HAVING, duplicates, gender count, 2nd highest, schema + count, monthly summary, two-table query) | 9+ reports across levels | **HIGH** | [DB 2/3](02-reported-sql-problems.md) |
| 2 | SQL vs NoSQL | 4 | **HIGH** | [DB 3/3 §1](03-nosql-mongodb.md#1-sql-vs-nosql--and-when-to-pick-which-high) |
| 2 | Joins | 4 | **HIGH** | [DB 1/3 §3](01-sql-and-dbms-concepts.md#3-joins-high) |
| 2 | Indexes / query optimisation | 4 | **HIGH** | [DB 1/3 §7](01-sql-and-dbms-concepts.md#7-indexes-high-and-query-optimisation) |
| 5 | Keys (PK/FK/composite), DB types | 3 | **HIGH** | [DB 1/3 §1](01-sql-and-dbms-concepts.md#1-keys-and-database-types) |
| 6 | ACID / transactions | 2 | MEDIUM | [DB 1/3 §6](01-sql-and-dbms-concepts.md#6-transactions-acid-isolation-levels) |
| 6 | Second highest salary | 2 | MEDIUM | [DB 2/3 §4](02-reported-sql-problems.md#4-second-highest-salary-and-n-th-highest) |
| 6 | Window functions / RANK | 2 | MEDIUM | [DB 1/3 §8](01-sql-and-dbms-concepts.md#8-window-functions) |
| 6 | Vertical vs horizontal scaling | 2 | MEDIUM | [DB 3/3 §2](03-nosql-mongodb.md#2-vertical-vs-horizontal-scaling-medium) |
| 6 | Data integrity / keeping write order (project discussion) | 2 | MEDIUM | [DB 1/3 §11](01-sql-and-dbms-concepts.md#11-data-integrity-strategies--keeping-write-order-managerial--project-questions) |
| — | Normalization · views/triggers · isolation levels · DDL vs DML · cursors · schema change in prod · composite keys in NoSQL · Redis vs Couchbase | 1 each | LOW | DB 1/3 and 3/3 |

**Pattern across reports**: early-career candidates got **one practical SQL query** inside a Java/Spring round (not a separate SQL round), plus **SQL vs NoSQL** theory. Two EC candidates visibly struggled with basic GROUP BY syntax under pressure ([LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/), [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/)) — practise writing queries by hand until they're automatic.

## Files

1. [SQL & DBMS concepts](01-sql-and-dbms-concepts.md) — keys, joins, WHERE vs HAVING, CTEs, ACID + rollback demo, isolation, indexes + EXPLAIN, windows, normalization, views, triggers, keyset pagination, integrity & ordering
2. [Every reported SQL question, solved and tested](02-reported-sql-problems.md)
3. [NoSQL & MongoDB](03-nosql-mongodb.md) — SQL vs NoSQL, scaling, modelling, indexes, aggregation, transactions, consistency, schema changes, Redis

Deeper general notes in this repo: [Database/README](../../../Database/README.md) (7 SQL + 6 MongoDB notes, all tested) · [Database interview questions](../../../Database/interview-questions.md).

Next: [07 — System design →](../07-system-design/README.md)
