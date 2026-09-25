# 03 — DSA for Visa Technical Rounds

> Questions asked **live** in Visa technical / HM rounds (the OA is in [02-online-assessment](../02-online-assessment/README.md)). Every question is from a candidate report and links to its source; every Java solution is compiled and tested against brute force.

**Easy analogy — technical round = driving with the instructor next to you**: OA mein sirf manzil (output) dekhi jaati thi. Yahan instructor dekhta hai **kaise chala rahe ho** — mirror check kiya? indicator diya? Isliye har step bolke karo: brute force → better idea → code → dry run → complexity.

## What the reports say about this round

- **Usually 1 DSA question per round (sometimes 2–4)**, mostly LeetCode **Medium**, often **after 20–40 minutes of resume discussion** ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/), [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)).
- Some are **real-world flavoured** instead of named LeetCode problems: log files + rate limiting, city routes, strings as a graph, two-team elimination ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/), [LC-6772395](https://leetcode.com/discuss/post/6772395/visa-virtual-interview-se-1-by-anonymous-plas/), [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/)).
- Onsite drives use **pen and paper, no laptop** ([LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/)); virtual rounds use CodeSignal / HackerRank CodePair.
- Interviewers expect the **optimal** complexity when one exists ("3-Sum: expected O(n²)", [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)) and ask **"why did you use this?"** while you code.

## All reported technical-round DSA questions

Ranked by frequency (HIGH ≥ 3 reports, MEDIUM = 2, LOW = 1). Level: **EC** = 0–2 YOE (your level), NCG/INT = campus, SR/STAFF = experienced.

| Problem / family | Reports (level) | Freq | Pattern | Notes |
|---|---|---|---|---|
| K-th largest / second largest without sorting | 5 (EC, NCG ×2, ?, STAFF) | **HIGH** | heap / one pass / quickselect | [DSA 4 §3](04-linked-list-stack-heap-sorting.md#3-k-th-largest--second-largest-without-sorting) |
| Linked list set (merge, cycle, intersection, reverse middle, sort) | 6 (mostly SR/STAFF, 1 EC) | **HIGH** (family) | pointers | [DSA 4 §1](04-linked-list-stack-heap-sorting.md#1-linked-list-set) |
| House Robber → circular | 3 (EC ×2, ?) | **HIGH** | 1D DP | [DSA 7 §1](07-dynamic-programming.md#1-house-robber--house-robber-ii-circular) |
| Binary search on the answer (Aggressive Cows, Book Allocation, trips) | 3 (EC, ?, SR) | **HIGH** (family) | BS on answer + greedy | [DSA 3](03-binary-search.md) |
| Level order traversal (+ zigzag) | 3 (NCG ×2, STAFF-DE) | **HIGH** | BFS | [DSA 5 §1](05-trees.md#1-level-order-traversal--zigzag) |
| Longest Substring Without Repeating Characters | 3 (EC, SR, STAFF) | **HIGH** | sliding window | [DSA 2 §2](02-sliding-window-and-rate-limiter.md#2-longest-substring-without-repeating-characters) |
| Best Time to Buy/Sell Stock (I, II, cooldown) | 3 (SR ×3) | **HIGH** (senior) | DP / greedy | [DSA 7 §3](07-dynamic-programming.md#3-best-time-to-buy-and-sell-stock--i-ii-with-cooldown-senior-reports) |
| BFS on grid / implicit graph (Islands, Word Ladder, "medium BFS") | 3 (EC ×3) | **HIGH** (family) | BFS | [DSA 6 §1–2](06-graphs-and-matrix.md) |
| Search in Rotated Sorted Array | 2 (EC, SR) | MEDIUM | modified binary search | [DSA 3 §1](03-binary-search.md#1-search-in-rotated-sorted-array) |
| Sliding Window Maximum | 2 (NCG, ?) | MEDIUM | monotonic deque | [DSA 2 §3](02-sliding-window-and-rate-limiter.md#3-sliding-window-maximum) |
| Two Sum → 3Sum | 2 (EC, STAFF) | MEDIUM | hashing / two pointers | [DSA 1 §1](01-arrays-strings-hashing.md#1-two-sum--3sum) |
| Palindrome check / all palindromic substrings | 2 (EC, NCG) | MEDIUM | expand around centre | [DSA 1 §6](01-arrays-strings-hashing.md#6-palindrome-check--all-palindromic-substrings) |
| Merge sort from scratch + dry run | 2 (EC, INT) | MEDIUM | divide & conquer | [DSA 4 §4](04-linked-list-stack-heap-sorting.md#4-merge-sort-from-scratch-with-a-dry-run) |
| Merge / non-overlapping intervals | 2 (INT-2022, SR-DE) | MEDIUM | sort + sweep | [DSA 4 §5](04-linked-list-stack-heap-sorting.md#5-merge-intervals-you-asked-for-it) |
| Top view / left & right view | 2 (SR ×2) | MEDIUM (senior) | BFS + horizontal distance | [DSA 5 §3](05-trees.md#3-top-view--left--right-view) |
| Rate-limit IPs from a log file (+ DDoS, GB file) | 1 (**EC, selected**) | LOW | per-key sliding window | [DSA 2 §1](02-sliding-window-and-rate-limiter.md#1-rate-limit-ips-from-a-log-file) |
| Number of Matching Subsequences | 1 (EC, selected) | LOW | waiting buckets | [DSA 1 §3](01-arrays-strings-hashing.md#3-number-of-matching-subsequences) |
| Word Break | 1 (EC) | LOW | prefix DP | [DSA 7 §2](07-dynamic-programming.md#2-word-break) |
| Letter Combinations of a Phone Number | 1 (EC) | LOW | backtracking | [DSA 1 §2](01-arrays-strings-hashing.md#2-letter-combinations-of-a-phone-number) |
| Longest Common Prefix → Longest Common Substring | 1 (EC, selected) | LOW | scan / DP | [DSA 1 §4](01-arrays-strings-hashing.md#4-longest-common-prefix--longest-common-substring-follow-up) |
| Strings as a graph: detect a cycle | 1 (EC) | LOW | 3-colour DFS | [DSA 6 §3](06-graphs-and-matrix.md#3-strings-as-a-graph--detect-a-cycle) |
| Reconstruct a journey from city pairs | 1 (EC) | LOW | map + set | [DSA 6 §4](06-graphs-and-matrix.md#4-reconstruct-the-journey-from-source--destination-pairs) |
| Pairs `a+b=n` in O(1) · two-team elimination in O(1) | 1 (EC) | LOW | maths | [DSA 1 §7](01-arrays-strings-hashing.md#7-two-o1-maths-questions-pen-and-paper-onsite) |
| Custom stack with encapsulation | 1 (EC) | LOW | class design | [DSA 4 §2](04-linked-list-stack-heap-sorting.md#2-custom-stack-with-encapsulation) |
| Maps + PriorityQueue data processing | 1 (EC) | LOW | aggregate + top-k | [DSA 4 §6](04-linked-list-stack-heap-sorting.md#6-data-processing-with-maps--priorityqueue-top-k) |
| Min depth of a binary tree · Single Number II | 1 each (NCG) | LOW | BFS · bits | [DSA 5 §2](05-trees.md#2-minimum-depth-of-a-binary-tree), [DSA 1 §9](01-arrays-strings-hashing.md#9-single-number-ii) |
| Trapping Rain Water | 1 (?) | LOW | two pointers | [DSA 2 §4](02-sliding-window-and-rate-limiter.md#4-trapping-rain-water-sand-and-mountains) |
| MST with Kruskal | 1 (?) | LOW | sort + DSU | [DSA 6 §5](06-graphs-and-matrix.md#5-minimum-spanning-tree-with-kruskal) |
| Count repeated words in a text | 1 (INT) | LOW | HashMap | [DSA 1 §8](01-arrays-strings-hashing.md#8-count-repeated-words-in-a-text) |
| Bricks: min cost for ≥ 100 kg (greedy vs DP) | 1 (INT) | LOW | unbounded knapsack | [DSA 7 §5](07-dynamic-programming.md#5-bricks--minimum-cost-to-reach-at-least-100-kg) |
| Group Anagrams | 1 (SR, 2021) | LOW | hashing | [DSA 1 §5](01-arrays-strings-hashing.md#5-group-anagrams-you-asked-for-it--reported-at-senior-level) |
| File parsing / big files / parallel files | 2 (EC topic, SR) | MEDIUM (topic) | streaming, external sort, thread pool | [DSA 8](08-file-and-log-processing.md) |
| Senior/Staff one-offs: Bag of Tokens, Add Binary, Hand of Straights, LIS, Min Window Substring, Combination Sum III, subset sum k, max path sum, mirror inorder, LCA deepest leaves, O(1) getRandom, N-people-M-rooms | 1 each | LOW | various | spread across DSA 1–7 |

**Not found in any Visa report** (so lower priority, even though they are "classic"): segment trees, tries in interviews (tries were OA-only), topological sort by name, advanced DP on trees/bitmasks, string algorithms like KMP (one OA mentioned "pattern searching", [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/)).

## How to answer any DSA question in a Visa interview

```
 1. Restate + clarify (1 min)     input size? duplicates? negatives? sorted? what to return on empty?
 2. Brute force (1 min)           say it + its complexity — never skip this
 3. Better idea (3–5 min)         name the pattern, why it applies, the complexity you'll reach
 4. Code (10–15 min)              clean names, small helper methods, explain each block briefly
 5. Dry run (3 min)               on the example AND one edge case, out loud
 6. Complexity + trade-offs       time, space, what you'd change for 10x data / streams / concurrency
```

**🗣️ Interview mein aise bolo (template)**: "Brute force yeh hoga, O(n²). Isme repeated kaam yeh hai, toh HashMap / window / binary search lagaunga — O(n). Code likhta hoon… ab example pe dry run karta hoon… aur empty input pe yeh hoga."

## Files

1. [Arrays · Strings · Hashing](01-arrays-strings-hashing.md)
2. [Sliding window · Rate-limit IPs · Two pointers](02-sliding-window-and-rate-limiter.md)
3. [Binary search (on arrays and on the answer)](03-binary-search.md)
4. [Linked list · Stack · Heap · Sorting](04-linked-list-stack-heap-sorting.md)
5. [Trees](05-trees.md)
6. [Graphs & matrix](06-graphs-and-matrix.md)
7. [Dynamic programming](07-dynamic-programming.md)
8. [File & log processing](08-file-and-log-processing.md)

Want more pattern practice beyond Visa reports? The repo's general notes: [DSA patterns](../../../DSA/01-patterns/01-sliding-window.md) · [DSA syllabus](../../../DSA/00-syllabus/README.md).

Next: [04 — Core Java →](../04-java/README.md)
