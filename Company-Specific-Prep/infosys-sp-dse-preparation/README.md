# Infosys — Specialist Programmer (SP) & Digital Specialist Engineer (DSE) Trainee Prep

Built from **49 dated candidate reports (Jan 2025 – Nov 2026)**: off-campus, on-campus and HackWithInfy. Research date: **13 Nov 2026**. Every claim has a source ID → [sources.md](sources.md).

**Legend used in every file:** 📌 **Reported** = a candidate said it was asked · 🧪 **Practice** = expected or useful, but not reported.

> ⚠️ Candidates reconstruct questions from memory, and different slots get different sets. Learn the **pattern**, not the exact statement.

## Process (what 2025–2026 candidates reported)

```
Registration ─► Coding assessment ─► (onsite) Coding round 2 ─► Interview day ─► Role offered
                3 Q / 3 h (virtual)    4 Q / 3 h, solve any 3     2 Q on Wingspan,    DSE / SP L1 / L2 / L3
                                       E · M · H · Complex        solve 1 → technical  (by score + interview)
```

| Stage | What happened |
|---|---|
| **Assessment** | Virtual: 3 Q / 3 h [LC-6958976, LC-8434114]. Onsite or on-campus: **4 Q (Easy, Medium, Hard, Complex), solve any 3**, 12 hidden tests each [LC-7492648, LC-8460608]. HackWithInfy: R1 3 Q, R2 4 Q [LC-8161351, LC-8161532]. |
| **Cutoff** | "70%" shown on the portal (Sep 2026 onsite) [LC-8503419]. Some campuses shortlisted anyone with **≥ 1 full solve** [LC-8512263, LC-8531964]. Many say partial hidden tests matter [LC-8278125]. |
| **Interview day** | Starts with **2 coding problems on Wingspan, solve 1 in 15–45 min** [LC-7233197, LC-8531964]. Then resume + DSA + SQL + OOP/DBMS/OS/CN. **L2/L3** add harder DSA + LLD/HLD [LC-8218681, LC-8433956]. DSE can be one ~10-minute round with pen-paper code [LC-8178418]. |
| **Result** | 1 day to 2+ months [LC-6436250, LC-7233197]. **Down-grades are common**: interviewed for L3 → offered L1, L2 or DSE [LC-8356446, LC-8433956, LC-8218681]. |

**Pay reported by candidates (not official):** DSE ₹6.25–7 LPA [LC-7077420, LC-7545877] · SP L1 ₹9.25–11 LPA incl. bonus, + ₹1 L joining bonus [LC-8349173, LC-7613124, LC-8356446] · SP L2 ≈ ₹16 LPA · SP L3 ≈ ₹21 LPA [LC-7545877]. Training is in Mysore [LC-7613124]. A new off-campus drive (2024–2026 batches) closed registration on 6 Nov 2026 [LC-8594509]. **Check the official notice for eligibility.**

## What gets asked most (high priority first)

| Area | Most-reported items | File |
|---|---|---|
| **OA coding** | DP (subsequence, partition, grid, string-state), greedy, prefix sums, Kadane variants, monotonic stack | [01-online-assessment.md](01-online-assessment.md) |
| **Interview DSA** | second largest, move zeros, sorting (bubble/quick/merge), Fibonacci, binary search, stock, jump game, coin change, LRU | [02-interview-dsa.md](02-interview-dsa.md) |
| **SQL** | **Nth highest salary (3 ways)**, RANK/DENSE_RANK/ROW_NUMBER, DELETE/TRUNCATE/DROP, joins, GROUP BY | [03-sql-dbms.md](03-sql-dbms.md) |
| **DBMS** | ACID, normalization, indexing, keys, CAP, ER diagram | [03-sql-dbms.md](03-sql-dbms.md) |
| **OOP / Java** | pillars with an example, polymorphism, interfaces, multiple inheritance, GC, HashMap internals, Java 8, SOLID, Singleton/Factory | [04-cs-fundamentals-java.md](04-cs-fundamentals-java.md) |
| **OS / CN** | deadlock, semaphore vs mutex, fragmentation, "type google.com" | [04-cs-fundamentals-java.md](04-cs-fundamentals-java.md) |
| **2026 extras** | AI/ML basics, LLM, RAG, system design (L2/L3), **every keyword on your resume** | [04-cs-fundamentals-java.md](04-cs-fundamentals-java.md) |

## If you have one week

1. **Days 1–3, OA:** do all 15 problems in [01](01-online-assessment.md). Write the DP versions; brute force often passes 0 hidden tests.
2. **Day 4, interview DSA:** type every **Basics** problem in [02](02-interview-dsa.md) from memory in under 5 minutes each (they are given on paper). Then LRU + coin change.
3. **Day 5, SQL:** the 4 ways to find the Nth highest salary + RANK vs DENSE_RANK + DELETE/TRUNCATE/DROP.
4. **Day 6, theory:** OOP, Java, OS, CN, plus 2 lines each on AI/ML/RAG.
5. **Day 7, resume:** explain every project, its architecture diagram, and every tool you listed. Prepare "Why Infosys?" and "rate yourself out of 5".

**Code check:** every Java solution was extracted from these markdown files and tested against brute-force versions on random inputs (93k+ checks, all passed). All SQL was run in SQLite.
