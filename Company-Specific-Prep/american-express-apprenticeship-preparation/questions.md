# Amex — Reported Interview Questions

**Tags:** 🟢 **Apprentice** report · 🔵 Amex India entry-level tech (intern / Engineer Trainee / fresher SDE) · ✍️ my addition.
The wording is short and close to what the candidate wrote. Source IDs → [sources.md](sources.md).

---

## 1. Apprentice-only questions 🟢

| Question | Source |
|---|---|
| 2 DSA questions, "slightly medium" LeetCode (titles not shared) | GD-AP (Gurgaon, 2025–26) |
| Code pasted in chat → **"tell the output"** | GD-TA (Chennai, 2025) |
| Java: how does **garbage collection** work? **Memory management** in Java? | GD-AP (Nov 2025) |
| Explain your full-stack eCommerce project: features, tech, your role, challenges | GD-AP |
| Count the **vowels** in a sentence (any language) | GD-UK (Codility) |
| Check if two strings are **anagrams** · sort a string's characters alphabetically · "2 array + 2 string manipulation questions, same level as the Codility demo" | GD-UK |
| Why did you choose this career path? How do you see yourself fitting at Amex? | JT-UK-25, GD-AP |

---

## 2. Online assessment coding (Codility / HackerRank)

Format: **3 questions, 90 min**, usually 1 easy + 2 medium, hidden test cases. [GFG-ET-25, LC-8459449, GFG-INT-23]

| # | Question (as reported) | Closest LeetCode | Hint ✍️ |
|---|---|---|---|
| 1 | 🔵 **Two fragments with sign flip** (Summer Intern OA, Aug 2026): choose a size-K and a size-L subarray, they *may* overlap; an element in both is added with its sign **flipped**. Max sum? `A=[1,3,-4,2,-2], K=3, L=2 → 10` | [1031](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/) (harder variant) | fix one window, try every position of the other; then optimise with prefix sums |
| 2 | 🔵 **Two equal solar squares** (Summer Intern OA, Aug 2026): boolean N×M grid (N, M ≤ 700). Place 2 same-size, all-`true`, non-overlapping squares. Max side? | [221](https://leetcode.com/problems/maximal-square/) | `dp` = largest square ending at a cell. Binary search the side `s`: two squares fit if (max row − min row ≥ s) or (max col − min col ≥ s) among valid corners |
| 3 | 🔵 **Spread stones on 3×3 grid** (OA, Aug 2026): move stones to adjacent cells so each cell has exactly 1. Min moves? | [2850](https://leetcode.com/problems/minimum-moves-to-spread-stones-over-grid/) | backtracking: try every match of an extra stone → empty cell, cost = Manhattan distance |
| 4 | 🔵 **Rectangle with perimeter P covering max points** (OA, Aug 2026): axis-aligned, boundary counts as inside | — | try every width `w` (so `h = P/2 − w`) and anchor the left/bottom edge on a point's x/y |
| 5 | 🔵 **Pizza discounts** (OA, Aug 2026): 4 schemes, apply exactly one, return the lowest bill: Buy-2-Get-1 (cheapest of every 3 free), Veg 20% off if ≥ 2 veg, ₹100 off each Large, ₹200 off if total ≥ ₹1500. Example: 300 (M,Veg), 500 (L,Veg), 700 (L,NonVeg), 250 (S,Veg) → **1500** | — | pure implementation: a `Pizza` class and one function per discount, take the min |
| 6 | 🔵 **Two windows, no overlap** (Intern OA, HackerRank): sizes K and L, max total sum | [1031](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/) | prefix sums + best-left-window so far |
| 7 | 🔵 **Fill the `?`** so no char equals its neighbour: `abcab??bac?` → `abcabacbaca` | [1576](https://leetcode.com/problems/replace-all-s-to-avoid-consecutive-repeating-characters/) | for each `?` try `a`, `b`, `c` |
| 8 | 🔵 **Longest string from counts of a, b, c**, no 3 same chars in a row: `(3,3,3) → abcabcabc` | [1405](https://leetcode.com/problems/longest-happy-string/) | greedy with a max-heap |
| 9 | 🔵 **Longest substring where every char appears an even number of times** (Tech Intern, Codility) | [1371](https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/) (vowels only) | prefix XOR bitmask of 26 bits + first index of each mask |
| 10 | 🔵 **Two rooks, max sum**: 2D board, rooks must not share a row or column | [3256](https://leetcode.com/problems/maximum-value-sum-by-placing-three-rooks-i/) (3 rooks) | sort cells by value; for each cell take the first non-conflicting partner, stop early |
| 11 | 🔵 **Missing numbers, known average**: some values missing, the average is given → find them | [2028](https://leetcode.com/problems/find-missing-observations/) | missing sum = `avg × total − known sum`, then spread it |

⚠️ For Q4 the source's example says `points (1,1),(2,3),(3,2),(4,4),(5,2), P=8 → 2`, but a 2×2 box from (1,1) to (3,3) covers **3** points (checked by brute force). Don't trust that example.

**Topics only (no statements shared):** 🔵 graphs + binary search + 1 easy [GFG-INT-23] · bit manipulation, array traversal, binary search [GFG-INT] · trees + "Frog Jump" [GFG-SE-21] · implementation-heavy, greedy, simulation, classes/structs [LC-8440291] · "find the error and change at most 2 lines" [LC-3929390]

---

## 3. DSA in interviews

| Question | Tag | Practice |
|---|---|---|
| Climbing Stairs | 🔵 Engineer Trainee, Aug 2025 | [70](https://leetcode.com/problems/climbing-stairs/) |
| Maximum Subarray Sum | 🔵 Engineer Trainee, Aug 2025 | [53](https://leetcode.com/problems/maximum-subarray/) |
| Write **Merge Sort** and trace it on an array. Does `mid = (low+high)/2` have a problem? Fix it. | 🔵 Engineer Trainee, Aug 2025 | [912](https://leetcode.com/problems/sort-an-array/) · overflow → `low + (high-low)/2` |
| Merge Sort vs Quick Sort; when is Quick Sort O(n²)? | 🔵 Tech Intern | sorted input + bad pivot |
| Find the min element · the **49th smallest** element (what if the array has only 15?) · **Kth largest** (brute → priority queue) | 🔵 Tech Intern | [215](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| Delete a linked-list node when you only have **that node** · linked-list operation complexities | 🔵 Tech Intern | [237](https://leetcode.com/problems/delete-node-in-a-linked-list/) |
| Swap 2 variables **without a third** | 🔵 SE Trainee, 2021 | `a=a+b; b=a-b; a=a-b;` or XOR |
| Add two numbers → what if two **strings** are passed? → add exception handling and explain why | 🔵 Intern | see §6 Q2 |
| Types of trees | 🔵 SE Trainee, 2021 | — |

---

## 4. SQL / DBMS

| Question | Tag |
|---|---|
| Employee with the **2nd highest salary** | 🔵 Engineer Trainee, Aug 2025 |
| Employees with the **10th to 15th highest** salaries | 🔵 Engineer Trainee, Aug 2025 |
| Write a query to **delete a column** from a table | 🔵 Intern |
| Create and delete tables · **TRUNCATE vs DROP** · other commands | 🔵 Intern |
| Natural, cross, left/right outer **joins** with diagrams · cross join with example | 🔵 Intern, Engineer 1 |
| Write 2 basic **GROUP BY + HAVING** queries | 🔵 Intern |
| Primary key vs foreign key · indexing · **normalization** + types · why denormalize? | 🔵 SE Trainee, Tech Intern |
| **ACID** · locking in DBMS · **CAP theorem** · can consistency and availability exist together? | 🔵 Engineer Trainee, SE Trainee |
| SQL vs NoSQL, when to use which · why MongoDB and not SQL in your project? | 🔵 Engineer Trainee, SDE 2023 |
| Two users buy the **last copy of a book** at the same time — what is this problem, how do you handle it? | 🔵 Engineer Trainee, Tech Intern |
| Types of RAID | 🔵 Intern |

**Answers to the top 2** ✍️ (tested in SQLite; `DENSE_RANK` works in MySQL 8+ too):

```sql
-- 2nd highest salary
SELECT MAX(salary) FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- 10th to 15th highest salaries (ties share a rank)
SELECT name, salary
FROM (SELECT name, salary,
             DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
      FROM Employee) t
WHERE rnk BETWEEN 10 AND 15;
```

> 💡 **Last book problem:** isko **race condition / lost update** bolte hain. Fix: one transaction + row lock (`SELECT ... FOR UPDATE`) or `UPDATE stock SET qty = qty - 1 WHERE id = ? AND qty > 0` and check the affected rows.

---

## 5. CS fundamentals (OOP, OS, CN, Java)

**OOP** 🔵
- 4 pillars of OOP, with respect to classes, with real-life examples
- What is OOP and why do we use it? Is **Java completely object-oriented**? (No: primitives like `int`.)
- Overloading vs overriding · compile-time vs runtime polymorphism · abstraction
- Constructor and its types · destructor (can it be overloaded?) · class vs object · structure vs class
- Inheritance and its types · access specifiers (when to use which) · function vs operator overloading

**OS** 🔵 (Engineer Trainee, Aug 2025)
- Process vs thread · multithreading · do threads of one process have separate memory?
- Critical section · context switching · parallelism (and why you need multiple cores)

**CN / Web** 🔵
- OSI model · HTTP vs HTTPS · how does your website work end to end?

**Java** 🟢🔵
- Garbage collection and memory management (heap vs stack) 🟢
- "Some tricky Java output questions" 🔵 → practise §6

**Other** 🔵 zero character `'0'` vs `NULL` · C vs C++ · exception handling in C++ · OAuth in your project · Git/GitHub

---

## 6. Output prediction practice (my addition)

✍️ The apprentice round asked "tell the output" [GD-TA], so here are 7 classic Java traps. Every answer below was run on JDK 26.

```java
String a = "hi", b = "hi", c = new String("hi");
System.out.println((a == b) + " " + (a == c) + " " + a.equals(c)); // Q1

System.out.println(1 + 2 + "3" + 4 + 5);                           // Q2

Integer x = 127, y = 127, p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));                     // Q3

int i = 5;  i = i++ + ++i;  System.out.println(i);                 // Q4

static void f(Object o) {...}  static void f(String s) {...}
f(null);                                                           // Q5: which one runs?

String s = "amex";  s.toUpperCase();  System.out.println(s);       // Q6

try { System.out.println(10 / 0); }
catch (ArithmeticException e) { System.out.println("caught"); }
finally { System.out.println("finally"); }                         // Q7
```

| Q | Output | Why |
|---|---|---|
| 1 | `true false true` | literals share the String pool; `new` makes a new object; `equals` compares content |
| 2 | `3345` | left to right: `1+2=3`, then string concatenation |
| 3 | `true false` | `Integer` caches −128..127 only |
| 4 | `12` | `5 + 7` (`i++` gives 5 then i=6; `++i` makes 7) |
| 5 | `f(String)` | the most specific overload wins |
| 6 | `amex` | Strings are immutable; the result was not stored |
| 7 | `caught` then `finally` | `finally` always runs |

---

## 7. HR / managerial

- 🟢 Why this career path? · how will you fit at Amex? · explain your project (features, role, challenges)
- 🔵 Why Amex, what do you know about it? · **Amex's revenue model** · what happens when you **swipe a card** (Engineer 1)
- 🔵 Why did you choose this project? What difficulties did you face? · strengths/weaknesses · goals · biggest achievement and failure
- 🔵 What positive impact do you want to create on society? · what is software development? · do you know Excel?
- 🔵 Puzzles (intern rounds): 3 bulbs and 3 switches · measure 45 minutes with two wires · monkey climbs 3 ft and slips 2 ft on a 20 ft tree · bag of coins

> 💡 **Revenue model, one line:** Amex mainly earns from the **merchant discount fee** on each card swipe, plus annual card fees and interest. Ye "closed loop" network hai: Amex khud issuer bhi hai aur network bhi.
