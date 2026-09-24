# Database — SQL + MongoDB (Interview Notes)

Short, easy-English notes for **database interviews**: basics first, then the topics interviewers actually ask.
Every note follows the same shape — **definition → one-line idea → easy analogy → diagram → tested code → quick revision**.

> 💡 Every SQL and MongoDB snippet in these notes was **really executed** (SQL on SQLite, MongoDB on MongoDB 7.0) and the outputs shown are the real outputs. The coding problems in the interview file were also checked against brute-force answers on random data.

## Folder layout

```
Database/
├── README.md                    ← you are here
├── interview-questions.md       ← ALL questions in one file: definitions + coding problems (revise here)
├── SQL/
│   ├── sample-data.sql          ← tables used in every SQL note
│   ├── 01-sql-basics.md
│   ├── 02-select-filter-aggregate.md
│   ├── 03-joins-and-subqueries.md
│   ├── 04-window-functions.md
│   ├── 05-indexes-views-and-performance.md
│   ├── 06-transactions-and-acid.md
│   └── 07-normalization-and-schema-design.md
└── MongoDB/
    ├── sample-data.js           ← collections used in every MongoDB note
    ├── 01-mongodb-basics.md
    ├── 02-crud-queries-and-operators.md
    ├── 03-aggregation-pipeline.md
    ├── 04-indexes-and-performance.md
    ├── 05-data-modeling.md
    └── 06-transactions-replication-sharding.md
```

## Learning path

| # | Note | You will learn | Time |
|---|---|---|---|
| 1 | [SQL 01 — Basics](SQL/01-sql-basics.md) | DBMS/RDBMS, command groups, data types, constraints, keys, `DELETE` vs `TRUNCATE` vs `DROP` | 20 min |
| 2 | [SQL 02 — SELECT & Aggregates](SQL/02-select-filter-aggregate.md) | `WHERE`, `NULL`, `GROUP BY`, `HAVING`, execution order, `CASE` | 25 min |
| 3 | [SQL 03 — Joins & Subqueries](SQL/03-joins-and-subqueries.md) | all joins, `UNION`, `EXISTS`, correlated subquery, `NOT IN` trap, CTE | 30 min |
| 4 | [SQL 04 — Window Functions](SQL/04-window-functions.md) | `RANK`, `DENSE_RANK`, `LAG`, running total, Nth highest, top-N per group | 25 min |
| 5 | [SQL 05 — Indexes & Performance](SQL/05-indexes-views-and-performance.md) | B-tree, clustered vs non-clustered, `EXPLAIN`, views, optimisation checklist | 25 min |
| 6 | [SQL 06 — Transactions & ACID](SQL/06-transactions-and-acid.md) | ACID, isolation levels, dirty/phantom reads, locks, deadlock | 25 min |
| 7 | [SQL 07 — Normalization & Design](SQL/07-normalization-and-schema-design.md) | 1NF–BCNF, denormalization, relationships, OLTP vs OLAP | 25 min |
| 8 | [MongoDB 01 — Basics](MongoDB/01-mongodb-basics.md) | NoSQL, documents, BSON, `_id`, CRUD | 25 min |
| 9 | [MongoDB 02 — Queries & Operators](MongoDB/02-crud-queries-and-operators.md) | `$gt`/`$in`/`$or`, arrays, `$elemMatch`, update operators, upsert | 30 min |
| 10 | [MongoDB 03 — Aggregation](MongoDB/03-aggregation-pipeline.md) | `$match`, `$group`, `$unwind`, `$lookup`, monthly reports | 30 min |
| 11 | [MongoDB 04 — Indexes](MongoDB/04-indexes-and-performance.md) | `explain()`, compound index (ESR), covered query, TTL/text/unique | 25 min |
| 12 | [MongoDB 05 — Data Modeling](MongoDB/05-data-modeling.md) | embed vs reference, patterns, schema validation | 25 min |
| 13 | [MongoDB 06 — Transactions, Replication, Sharding](MongoDB/06-transactions-replication-sharding.md) | transactions, write concern, replica set, shard key, CAP | 30 min |
| 14 | [**Interview questions**](interview-questions.md) | 95 concept questions, 24 SQL + 18 MongoDB coding problems, 13 design scenarios, cheat sheet | revise anytime |

**Short on time?** Read the *Quick revision* box at the end of each note, then go straight to [interview-questions.md](interview-questions.md).

## Practise with the sample data

```bash
# SQLite (easiest — no server needed)
sqlite3 practice.db < SQL/sample-data.sql

# MySQL / PostgreSQL
mysql -u root -p practice < SQL/sample-data.sql
psql -d practice -f SQL/sample-data.sql

# MongoDB (creates the "shop" database)
mongosh --file MongoDB/sample-data.js
```

## Topic → where to find it

| Interview topic | Notes | Questions |
|---|---|---|
| DBMS vs RDBMS, keys, constraints | SQL 01 | Q1–Q9 |
| `WHERE` vs `HAVING`, `NULL`, execution order | SQL 02 | Q10–Q18 |
| Joins, subqueries, CTE | SQL 03 | Q19–Q25, P3–P10 |
| Window functions, Nth highest | SQL 04 | Q26–Q28, P1–P4, P15–P20 |
| Indexes, query tuning | SQL 05 | Q29–Q38 |
| Transactions, ACID, isolation, deadlock | SQL 06 | Q39–Q43 |
| Normalization, schema design | SQL 07 | Q44–Q50, E2 |
| MongoDB basics and CRUD | MongoDB 01–02 | Q51–Q68, D1–D5, D14–D18 |
| Aggregation pipeline | MongoDB 03 | Q69–Q74, D6–D13 |
| MongoDB indexes | MongoDB 04 | Q75–Q79 |
| Data modeling | MongoDB 05 | Q80–Q83, E3 |
| Replication, sharding, CAP | MongoDB 06 | Q84–Q95, E5 |
| Scaling, design scenarios | both | E1–E13 |

Back to the repo overview: [../README.md](../README.md)
