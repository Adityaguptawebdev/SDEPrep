# MongoDB 01 — Basics: Documents, Collections & CRUD

> **Level**: Beginner · **Read time**: ~25 min · Sample data: [sample-data.js](sample-data.js) (database `shop`)

> **Definition**: **MongoDB** is an open-source **document database** (a type of NoSQL database). It stores data as flexible, JSON-like **documents** (stored internally as **BSON**), grouped into **collections**, instead of rows in fixed tables.

**In one line**: A document = one JSON object that holds *everything about one thing* (a user with their address and skills), so you often need **no joins**.

**Easy analogy — tiffin box vs separate registers**: SQL mein ek student ki details kai registers mein bikhri hoti hain (student register, address register, marks register) aur tum unhe **join** karte ho. MongoDB mein student **ek tiffin box** hai jisme sab kuch pack hai — name, address, subjects ki list. Ek box kholo, sab mil gaya. Aur har box mein items thode alag ho sakte hain (flexible schema).

```
 SQL row (flat)                   MongoDB document (nested, flexible)
 ┌────┬───────┬───────┐           {
 │ id │ name  │ city  │             _id: 1,
 │ 1  │ Asha  │ Delhi │             name: "Asha",
 └────┴───────┴───────┘             address: { city: "Delhi", pin: "110001" },   ← nested object
 skills → separate table            skills: ["js", "node", "mongodb"]            ← array
 (needs a JOIN)                   }
```

---

## 1. SQL vs NoSQL — quick picture

**NoSQL** ("not only SQL") = databases that do not use the classic table model.

| Type | Stores | Examples | Good for |
|---|---|---|---|
| **Document** | JSON-like documents | **MongoDB**, CouchDB | catalogs, user profiles, content |
| **Key-value** | key → value | Redis, DynamoDB | cache, sessions |
| **Column-family** | rows with dynamic columns | Cassandra, HBase | huge write-heavy data, time series |
| **Graph** | nodes and edges | Neo4j | relationships (social, recommendations) |

| | SQL (RDBMS) | MongoDB |
|---|---|---|
| Structure | tables, fixed schema | collections, **flexible schema** |
| Data unit | row | **document** |
| Relations | joins, foreign keys | **embedding** (or references + `$lookup`) |
| Query language | SQL | MongoDB Query API (JSON-style) |
| Scaling | mostly vertical (bigger machine), sharding is harder | built for **horizontal** scaling (sharding) |
| Transactions | strong ACID everywhere | ACID for single doc; multi-document transactions supported |
| Best when | data is highly relational, strict rules, complex joins | data is hierarchical, changes shape, needs scale |

---

## 2. Terminology map

| SQL | MongoDB |
|---|---|
| database | database |
| table | **collection** |
| row / record | **document** |
| column | **field** |
| primary key | **`_id`** (auto-created, always unique) |
| foreign key / join | embedded document, or reference + **`$lookup`** |
| `GROUP BY` | **aggregation pipeline** (`$group`) |
| index | index |

---

## 3. Documents, BSON and `_id`

- A document is a set of `field: value` pairs. Values can be strings, numbers, booleans, dates, **arrays**, **nested documents**, `null`…
- **BSON** = *Binary JSON*: the format MongoDB really stores. It adds types JSON does not have: `ObjectId`, `Date`, `Int32`, `Int64 (Long)`, `Decimal128`, binary data.
- A document can be up to **16 MB**.
- Every document has a unique **`_id`**. If you do not give one, the driver creates an **`ObjectId`**.

```
 ObjectId("65f1c2a4b7d3e9a1c4f0a1b2")   =  12 bytes
 ├── 4 bytes  timestamp (seconds since 1970)   → ids sort roughly by creation time
 ├── 5 bytes  random value (per machine/process)
 └── 3 bytes  incrementing counter             → unique even within the same second
```

- `_id` is **automatically indexed** and **cannot be changed**.
- You may use your own `_id` (a number, string…). In our sample data users have `_id: 1, 2, 3…`.

> 💡 A **database** and a **collection** are created automatically the first time you insert data. You never write `CREATE`.

---

## 4. Getting started (mongosh)

```js
mongosh                       // open the shell
show dbs                      // list databases
use shop                      // switch to (or create) database "shop"
show collections              // list collections
load("sample-data.js")        // fill the sample data used in these notes
```

Inside `mongosh`, `db` always means the current database, and `db.users` is the `users` collection.

---

## 5. CRUD — Create, Read, Update, Delete

### Create (insert)

```javascript
db.users.insertOne({ _id: 6, name: "Dev", age: 26, city: "Pune", skills: ["react"] })
```

```result
{ acknowledged: true, insertedId: 6 }
```

```javascript
db.users.insertMany([
  { _id: 7, name: "Tara", age: 24, city: "Delhi" },
  { _id: 8, name: "Uday", age: 33, city: "Mumbai" }
])
```

```result
{ acknowledged: true, insertedIds: { '0': 7, '1': 8 } }
```

Documents in one collection **do not need the same fields** (Meena has no `email`, Tara has no `skills`).

### Read (find)

`find(filter, projection)` — the *filter* says **which** documents, the *projection* says **which fields** to return (`1` = include, `0` = exclude; `_id` is included unless you write `_id: 0`).

```javascript
db.users.find({ city: "Delhi" }, { _id: 0, name: 1, age: 1 })
```

```result
[
  { name: 'Asha', age: 28 },
  { name: 'Meena', age: 22 },
  { name: 'Tara', age: 24 }
]
```

```javascript
db.users.findOne({ _id: 2 })          // returns ONE document (or null)
```

```result
{
  _id: 2,
  name: 'Ravi',
  age: 35,
  city: 'Mumbai',
  email: 'ravi@example.com',
  skills: [ 'java', 'sql' ],
  active: true,
  address: { city: 'Mumbai', pin: '400001' }
}
```

```javascript
db.users.countDocuments({ city: "Delhi" })
```

```result
3
```

### Update

`updateOne(filter, update)` changes the **first** match, `updateMany` changes **all** matches. The update **must use operators** such as `$set`.

```javascript
db.users.updateOne({ _id: 6 }, { $set: { age: 27 } })
```

```result
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

```javascript
db.users.updateMany({ city: "Delhi" }, { $set: { country: "India" } })
```

```result
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 3,
  modifiedCount: 3,
  upsertedCount: 0
}
```

### Delete

```javascript
db.users.deleteOne({ _id: 6 })
```

```result
{ acknowledged: true, deletedCount: 1 }
```

```javascript
db.users.deleteMany({ _id: { $in: [7, 8] } })
```

```result
{ acknowledged: true, deletedCount: 2 }
```

| Task | Method |
|---|---|
| Insert one / many | `insertOne`, `insertMany` |
| Read one / many | `findOne`, `find` |
| Update one / many | `updateOne`, `updateMany` |
| Replace a whole document | `replaceOne` |
| Delete one / many | `deleteOne`, `deleteMany` |
| Update and get the document back | `findOneAndUpdate` |

> ⚠️ `deleteMany({})` removes **every** document in the collection (the collection itself stays). `db.users.drop()` removes the collection.

---

## 6. Using MongoDB from Node.js (short)

```js
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const users = client.db("shop").collection("users");

const delhiUsers = await users.find({ city: "Delhi" }).toArray();
await users.insertOne({ name: "Ira", age: 29 });
await client.close();
```

**Mongoose** (popular library) adds schemas and validation on top of the driver: `new Schema({ name: { type: String, required: true } })`.

---

## 7. When to choose MongoDB

| Choose MongoDB when… | Prefer SQL when… |
|---|---|
| data is nested / hierarchical (product catalog, CMS, user profile) | data is highly relational, many-to-many joins everywhere |
| the schema changes often, fields differ per item | you need strict rules and multi-table transactions (banking, accounting) |
| you need to scale writes horizontally | you need complex reporting with many joins |
| you read a whole "object" in one go | the data shape is stable and well understood |

---

> 🗣️ **Interview mein aise bolo**: *"MongoDB ek document database hai: data JSON jaise documents mein, collections ke andar. Schema flexible hai aur horizontal scaling ke liye bana hai."*

## ⚡ Quick revision

- MongoDB = **document database**; collection ≈ table, document ≈ row, field ≈ column.
- Stored as **BSON**, max **16 MB** per document, every document has a unique **`_id`** (default `ObjectId`).
- Schema is **flexible**: documents in one collection can have different fields.
- CRUD: `insertOne/Many`, `find/findOne`, `updateOne/Many` (with `$set`), `deleteOne/Many`.
- `find(filter, projection)` — projection `1` include / `0` exclude.
- Database and collection are created automatically on first insert.

🎯 Practice questions: [interview-questions.md](../interview-questions.md)

Agla: [02-crud-queries-and-operators.md](02-crud-queries-and-operators.md)
