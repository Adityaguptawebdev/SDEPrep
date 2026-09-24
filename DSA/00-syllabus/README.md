# DSA Syllabus — Basics se Advance (Start se End tak)

**29 topics, 7 units — Complexity aur Arrays se shuru karke Graphs, Trees, Recursion, DP aur Segment Tree tak**, ek sahi kram (order) mein. Har topic pehle wale topic pe khada hai, isliye **upar se neeche padho.**

> Ye **syllabus** hai (concept zero se). Isi ke saath [`../01-patterns/`](../01-patterns/01-sliding-window.md) folder mein **20 problem-solving patterns** alag se hain — syllabus khatam karke un templates se problem pehchanna seekho. **Patterns folder mein kuch badla nahi gaya hai** — syllabus ke notes sirf unhe link karte hain.

## Roadmap ek nazar mein

```
 UNIT 1               UNIT 2              UNIT 3                UNIT 4            UNIT 5           UNIT 6           UNIT 7
 BASICS         ──▶   LINEAR         ──▶  TREES & HEAPS    ──▶  PARADIGMS    ──▶  GRAPHS      ──▶  DYNAMIC     ──▶  ADVANCED
 (neev)               (chain, line)       (hierarchy)           (soch ke tareeke)  (network)        PROGRAMMING      (tools)

 Complexity           Linked List         Binary Tree           Backtracking       Graph Basics     DP Basics        Segment Tree
 Arrays               Stack               BST                   Greedy             Topo Sort        2D DP            & Fenwick
 Strings              Queue / Deque       Heap                                     Union-Find       Knapsack         KMP &
 Hashing                                  Trie                                     Shortest Path    DP Advanced      Rabin-Karp
 Math · Bits                                                                       MST
 Sorting · Binary Search
 Recursion
```

## Kaun kiske baad — dependency map

```
Recursion ─┬─▶ Binary Tree ─▶ BST
           ├─▶ Backtracking
           ├─▶ DP Basics ─▶ 2D DP ─▶ Knapsack ─▶ DP Advanced
           └─▶ Graph DFS

Stack  ────┬─▶ Iterative DFS / Tree traversal ─▶ Monotonic Stack
Queue  ────┴─▶ BFS ─▶ Graph Basics ─▶ Topological Sort · Shortest Path (BFS)

Sorting ───▶ Binary Search · Greedy · Merge Intervals
Heap ──────▶ Top-K · Greedy · Dijkstra · Prim (MST)
Hashing ───▶ Two Sum · Prefix-sum-hash · Trie · LRU Cache
Union-Find ▶ Kruskal (MST) · Connected Components
Bit Manipulation ▶ Bitmask DP
```

## Har note ki banawat (ek jaisi — seekhne mein aasan)

```
📍 Syllabus mein tum kahan ho + pehle kya aana chahiye
Standard definition     ← interview mein bolne wali English definition
Ek line mein            ← 1 line ka matlab
Trick yaad rakhne ki    ← har topic ki apni alag real-life analogy (train, hospital, shaadi, Google Maps ...)
Kab use karo            ← kis sawaal mein ye topic lagega
Diagrams + Code         ← ASCII picture pehle, phir commented Java (Line by line samjho)
Common galtiyan         ← jaha log fasste hain
💡 Interview mein bolne wali line
Practice table          ← basic se advance (Easy → Hard), har problem ke saath "kya seekhoge"
```

## Unit-wise topics (apna progress khud tick karo)

### Unit 1 — Basics (neev)
- [ ] 01 · [Complexity Analysis (Big-O)](01-basics/01-complexity-analysis.md) — time/space, growth, constraints se complexity guess
- [ ] 02 · [Arrays](01-basics/02-arrays.md) — memory layout, insert/delete, Kadane, rotate, matrix
- [ ] 03 · [Strings](01-basics/03-strings.md) — immutability, StringBuilder, palindrome, anagram
- [ ] 04 · [Hashing (HashMap / HashSet)](01-basics/04-hashing.md) — frequency, grouping, prefix-sum + map
- [ ] 05 · [Math for DSA](01-basics/05-math-basics.md) — modulo, GCD, primes, sieve, fast power
- [ ] 06 · [Bit Manipulation](01-basics/06-bit-manipulation.md) — XOR tricks, masks, `n & (n-1)`
- [ ] 07 · [Sorting](01-basics/07-sorting.md) — bubble → quick, stability, comparators
- [ ] 08 · [Binary Search](01-basics/08-binary-search.md) — templates, lower/upper bound, rotated array
- [ ] 09 · [Recursion](01-basics/09-recursion.md) — call stack, base case, Hanoi, subsets

### Unit 2 — Linear Structures
- [ ] 10 · [Linked List](02-linear-structures/10-linked-list.md) — reverse, slow/fast, merge, doubly
- [ ] 11 · [Stack](02-linear-structures/11-stack.md) — brackets, Min Stack, RPN, monotonic stack
- [ ] 12 · [Queue & Deque](02-linear-structures/12-queue-and-deque.md) — circular queue, BFS jhalak, sliding window max

### Unit 3 — Trees & Heaps
- [ ] 13 · [Binary Tree](03-trees-and-heaps/13-binary-tree.md) — traversals, height, diameter, LCA
- [ ] 14 · [Binary Search Tree](03-trees-and-heaps/14-binary-search-tree.md) — search/insert/delete, validate, TreeMap
- [ ] 15 · [Heap & Priority Queue](03-trees-and-heaps/15-heap-priority-queue.md) — sift up/down, Top-K, two-heap median
- [ ] 16 · [Trie](03-trees-and-heaps/16-trie.md) — prefix search, autocomplete, Word Search II

### Unit 4 — Paradigms
- [ ] 17 · [Backtracking](04-paradigms/17-backtracking.md) — choose/explore/un-choose, N-Queens
- [ ] 18 · [Greedy](04-paradigms/18-greedy.md) — kab chalta hai, kab fail hota hai, intervals, jumps

### Unit 5 — Graphs
- [ ] 19 · [Graph Basics](05-graphs/19-graph-basics.md) — representation, BFS/DFS, cycle, bipartite, grid
- [ ] 20 · [Topological Sort](05-graphs/20-topological-sort.md) — Kahn, DFS, Alien Dictionary
- [ ] 21 · [Union-Find](05-graphs/21-union-find.md) — path compression, accounts merge
- [ ] 22 · [Shortest Path](05-graphs/22-shortest-path.md) — Dijkstra, Bellman-Ford, Floyd-Warshall, 0-1 BFS
- [ ] 23 · [Minimum Spanning Tree](05-graphs/23-minimum-spanning-tree.md) — Kruskal, Prim

### Unit 6 — Dynamic Programming
- [ ] 24 · [DP Basics](06-dynamic-programming/24-dp-basics.md) — memo → table → O(1) space, 5-step recipe
- [ ] 25 · [2D DP: Grid & Strings](06-dynamic-programming/25-dp-grid-and-strings.md) — paths, LCS, edit distance
- [ ] 26 · [Knapsack & Subsequences](06-dynamic-programming/26-dp-knapsack-and-subsequences.md) — 0/1, unbounded, coin change, LIS
- [ ] 27 · [DP Advanced](06-dynamic-programming/27-dp-advanced.md) — state machine, interval, bitmask, tree DP

### Unit 7 — Advanced
- [ ] 28 · [Segment Tree & Fenwick Tree](07-advanced/28-segment-tree-and-fenwick.md) — range query + update, lazy propagation
- [ ] 29 · [KMP & Rabin-Karp](07-advanced/29-advanced-string-algorithms.md) — LPS, rolling hash

## Suggested study plan (roughly 10–12 hafte)

| Hafta | Unit | Milestone (ye kar lo toh aage badho) |
|---|---|---|
| 1–2 | **Unit 1** Basics | Har topic ke **Easy** problems + Two Sum, Kadane, Binary Search bina dekhe likh sako |
| 3 | **Unit 2** Linear | Reverse Linked List, Valid Parentheses, Min Stack, Sliding Window Max |
| 4–5 | **Unit 3** Trees & Heaps | Saare traversals (recursive + iterative), Validate BST, Top-K, Word Search II idea |
| 6 | **Unit 4** Paradigms | Subsets/Permutations/N-Queens, Intervals + Jump Game (aur greedy ka counterexample) |
| 7–8 | **Unit 5** Graphs | BFS/DFS template zubaani, Course Schedule, Dijkstra, Union-Find class |
| 9–11 | **Unit 6** DP | 5-step recipe har problem pe; Climbing Stairs → Coin Change → LCS → Edit Distance |
| 12 | **Unit 7** + Patterns | Segment/Fenwick, KMP; phir [Patterns](../01-patterns/01-sliding-window.md) revise |

**Rule**: Har topic pe **pehle note padho → code khud likho (dekhe bina) → practice table ke Easy 3–4 solve karo**, phir agla topic. Aur har problem ke baad **time + space complexity** zaroor bolo.

## Cheat-sheet: problem dekh ke kaunsa topic socho?

| Problem mein ye dikhe | Socho | Note |
|---|---|---|
| "**Subarray / substring**" ka sum/max/longest | Sliding window / Kadane / Prefix sum | [Arrays](01-basics/02-arrays.md) · [Sliding Window](../01-patterns/01-sliding-window.md) |
| "**Pehle dekha hai?**", frequency, duplicate, pair sum | HashMap / HashSet | [Hashing](01-basics/04-hashing.md) |
| **Sorted** array, dhoondhna, "pehla True", "minimum jo chale" | Binary Search (aur uska answer pe roop) | [Binary Search](01-basics/08-binary-search.md) |
| `n ≤ 20`, "saare subsets / permutations" | Backtracking / Bitmask | [Backtracking](04-paradigms/17-backtracking.md) |
| **Brackets / undo / nested / next greater** | Stack | [Stack](02-linear-structures/11-stack.md) |
| **Level by level**, shortest path (unweighted) | BFS + Queue | [Queue](02-linear-structures/12-queue-and-deque.md) · [Graph Basics](05-graphs/19-graph-basics.md) |
| "**Top K**", "K-th largest", "baar-baar min/max" | Heap | [Heap](03-trees-and-heaps/15-heap-priority-queue.md) |
| **Prefix**, autocomplete, words ka board pe search | Trie | [Trie](03-trees-and-heaps/16-trie.md) |
| **Tree** ki koi bhi baat (height, path, ancestor) | Tree recursion (left, right, combine) | [Binary Tree](03-trees-and-heaps/13-binary-tree.md) |
| **Sorted + insert/delete**, floor/ceiling | BST / TreeMap | [BST](03-trees-and-heaps/14-binary-search-tree.md) |
| **Dependencies / prerequisites / order** | Topological Sort | [Topological Sort](05-graphs/20-topological-sort.md) |
| "**Connected?**", groups merge, cycle (undirected) | Union-Find | [Union-Find](05-graphs/21-union-find.md) |
| **Weighted shortest path** / minimum cost / effort | Dijkstra (negative → Bellman-Ford) | [Shortest Path](05-graphs/22-shortest-path.md) |
| "**Sab ko connect karo, kam cost**" | MST (Kruskal / Prim) | [MST](05-graphs/23-minimum-spanning-tree.md) |
| **Intervals / scheduling**, "abhi ka best" | Greedy (sort by end) | [Greedy](04-paradigms/18-greedy.md) |
| "**Min/Max/Kitne tarike**" + choices, recursion mein repeat | DP (5-step recipe) | [DP Basics](06-dynamic-programming/24-dp-basics.md) |
| **Do strings** compare/convert | 2D DP (LCS, edit distance) | [2D DP](06-dynamic-programming/25-dp-grid-and-strings.md) |
| "Items chuno, sum/limit X", unlimited coins | Knapsack DP | [Knapsack](06-dynamic-programming/26-dp-knapsack-and-subsequences.md) |
| **Range query + update** (sum/min/max) | Segment / Fenwick Tree | [Segment Tree & Fenwick](07-advanced/28-segment-tree-and-fenwick.md) |
| Bade text mein **pattern**, "prefix jo suffix bhi ho" | KMP / Rabin-Karp | [KMP & Rabin-Karp](07-advanced/29-advanced-string-algorithms.md) |
| `answer mod 10⁹+7`, prime, GCD, `x^n` | Math tools | [Math](01-basics/05-math-basics.md) |
| **XOR**, "akela number", power of two, subsets ka mask | Bit Manipulation | [Bits](01-basics/06-bit-manipulation.md) |

**Sabse pehle constraints dekho**: `n ≤ 10⁵` → `O(n log n)`; `n ≤ 5000` → `O(n²)`; `n ≤ 20` → `O(2ⁿ)`. Poori table: [Complexity Analysis](01-basics/01-complexity-analysis.md) ka "Constraints dekh ke complexity guess karo" section.

## Numbers mein

- **29 topics**, **7 units**, ~**8,000 lines** ke notes
- **158 Java code examples** (har ek compile hota hai; algorithms ko random inputs pe brute-force / reference se check kiya gaya hai)
- **200+ diagrams aur step-by-step traces** (memory layout, tables, trees, graphs — ASCII, kahin bhi render hote hain)
- **310+ LeetCode problems**, har topic mein **Easy → Hard** order mein (premium wale 🔒 se marked)

## Note ki bhasha ke baare mein

Notes tumhare baaki repo ki tarah **Hinglish** mein hain (Roman script mein Hindi + English terms): `Ek line mein`, `Trick yaad rakhne ki`, `Kab use karo`, `Line by line samjho`. Code comments bhi wahi — `// 🔑` wali line har code ka **sabse zaroori insight** hai.
