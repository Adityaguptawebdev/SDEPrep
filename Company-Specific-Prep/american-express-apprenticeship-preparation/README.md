# American Express — Technology Apprenticeship (India) Interview Prep

Built from **public candidate reports** (Glassdoor, LeetCode Discuss, GeeksforGeeks, Jointaro) and job listings. Research date: **4 Nov 2026**. All sources, with links, are in [sources.md](sources.md).

> ⚠️ Very few people have written about the **apprenticeship** itself (about 6 reports). So these notes also list questions from Amex India **entry-level tech roles** (intern, Engineer Trainee, fresher SDE). These use the same coding test (Codility/HackerRank) and the same kind of interviews. Each question is tagged with its role.

## Program (from job listings, not confirmed by Amex)

| | |
|---|---|
| Name | Apprentice — Enterprise Technology Services / Apprentice Technology (SDE) |
| Duration | 12 months, paid [JOB-JN, JOB-AGG] |
| Stipend | ₹25,000/month in most listings (one says ₹40k) [JOB-AGG] |
| Where | Bengaluru, Gurugram, Chennai (hybrid) [JOB-AGG] |
| Who | 2025/2026 grads, CS/IT/ECE etc., 60% or 6.0 CGPA, no backlogs [JOB-JN] |

## Process (what apprentice candidates reported)

```
Online DSA test (HackerRank) ──► Technical + Managerial (resume + "tell the output") ──► HR
```

| Report | What happened |
|---|---|
| Chennai, 2025 "Enterprise Technology Apprenticeship" | Round 1 HackerRank. Round 2 Technical + Managerial: **mostly resume**; coding snippets were **pasted in chat and they asked the output**. Rated easy, offer accepted. [GD-TA] |
| Online DSA test Oct 2025, call in Mar 2026 | OA for "Apprenticeship in Enterprise Technology Services" in Oct 2025. HR called months later and said the next round is an **HR round**. [LC-7654147] |
| Gurgaon, page updated Feb 2026 | **Single round**: HR first asked **2 DSA questions (LeetCode slightly-medium)**, then a deep dive on a full-stack eCommerce project, technical questions on it, then HR. The candidate felt the role was more analyst than developer. [GD-AP] |
| Nov 2025 apprentice | Java: **garbage collection and memory management**. [GD-AP] |
| UK apprentice (London, 2024–25) | Codility test (count vowels in a sentence, anagram check, sort a string) → HireVue / assessment centre. [GD-UK, JT-UK-25] |

**Ek line mein:** OA clear karo (easy–medium DSA), phir resume + "output batao" + basic OOP/DBMS/SQL. Bahut hard DSA ki zarurat nahi, but fundamentals solid hone chahiye.

## If you have little time, do this order

1. **OA practice:** the 11 coding questions in [01-oa-coding.md](01-oa-coding.md) (Codility style, 3 Q / 90 min).
2. **"Tell the output":** the 7 Java traps in [05-output-hr-puzzles.md](05-output-hr-puzzles.md). The apprentice round literally asks for the output.
3. **SQL:** 2nd highest and Nth highest salary, joins, GROUP BY + HAVING, TRUNCATE vs DROP → [03-sql-dbms.md](03-sql-dbms.md).
4. **OOP + DBMS + Java GC:** 4 pillars, overloading vs overriding, ACID, normalization, stack vs heap → [04-oop-os-cn-java.md](04-oop-os-cn-java.md).
5. **Live DSA:** Climbing Stairs, Kadane, Merge Sort, Kth largest → [02-interview-dsa.md](02-interview-dsa.md).
6. **Your project + Why Amex:** a 20–25 min project deep dive, Amex's revenue model, and the card-swipe flow.

## Files (every question has an easy answer)

| File | What's inside |
|---|---|
| [01-oa-coding.md](01-oa-coding.md) | 11 real OA questions + 3 easy apprentice Codility ones, with tested Java |
| [02-interview-dsa.md](02-interview-dsa.md) | live-round DSA: Climbing Stairs, Kadane, Merge Sort, Kth element, linked list... |
| [03-sql-dbms.md](03-sql-dbms.md) | SQL queries (tested) + DBMS theory: ACID, normalization, indexing, CAP, locking |
| [04-oop-os-cn-java.md](04-oop-os-cn-java.md) | OOP, OS, OSI/HTTPS, Java garbage collection + memory |
| [05-output-hr-puzzles.md](05-output-hr-puzzles.md) | "tell the output" practice, HR answers, puzzles |
| [sources.md](sources.md) | every source with a link |

**Code check:** the OA Java answers passed 24,212 random brute-force checks. The DSA code, SQL (SQLite), Java output snippets (JDK 26) and the C++ snippet were all run.
