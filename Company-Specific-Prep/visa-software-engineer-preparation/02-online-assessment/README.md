# 02 — Visa Online Assessment (OA)

> Built from **36 candidate OA reports (2023–2026) containing 99 questions** — see [research-findings.md](../01-hiring-process/research-findings.md#5-group-c--oa-only-reports-all-levels-used-for-oa-patterns).
> Files: [OA 1/3 Arrays · Strings · HashMap](01-oa-arrays-strings-hashmap.md) · [OA 2/3 Stack · Search · Sorting · Heap · Maths](02-oa-stack-queue-search-sorting-heap.md) · [OA 3/3 Matrix · Graph · DP · File](03-oa-matrix-graph-dp-simulation.md) · [Mock OA sets](04-mock-oa-sets.md) · [Answer key](05-mock-oa-answer-key.md)

**Easy analogy — OA = driving test at the RTO**: Examiner ko fancy drifting nahi chahiye. **Signal dena, lane mein rehna, parking karna** (arrays, strings, simulation) — basics clean hone chahiye, aur **time ke andar**. Ek bhi basic galti = retest.

---

## 1. Format (what candidates actually saw)

| Item | What reports say | Evidence |
|---|---|---|
| Platform | **CodeSignal** (almost all 2024–2026 India SWE reports) | 20+ reports |
| Questions / time | **4 questions in ~70 min** (a few: 75 or 90 min; a few got 3 questions) | [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/), [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (75 min) |
| Score | Each question 300 raw points; report shown **out of 600** (e.g. 910/1200 → 503/600) | [LC-7435146](https://leetcode.com/discuss/post/7435146/visa-sse-code-signal-by-anonymous_user-mb5c/), [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/) |
| Difficulty curve | Q1 easy → Q2 easy/medium → Q3 **medium, implementation-heavy** → Q4 medium-hard/hard | [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) (E, M, M-H, H), [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/) (E, E-M, M, H) |
| Proctoring | Webcam, mic, screen share, photo ID; "typing pattern" / "gaze away" flags → forced retake | [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/), [LC-6767451](https://leetcode.com/discuss/post/6767451/visa-online-assessment-id-verification-h-j9ug/), [LC-7346747](https://leetcode.com/discuss/post/7346747/visa-2nd-oa-by-jethiya_babuchak-l93o/) |
| Where | Usually from home; some on-campus tests in college labs; one Nov 2025 test **at the Visa Bangalore office** | [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/), [LC-7376211](https://leetcode.com/discuss/post/7376211/visa-codesignal-assessment-bangalore-nov-o4nb/) |
| Cut-off | **Not public.** 567/600 was rejected ([LC-7403009](https://leetcode.com/discuss/post/7403009/visa-oa-cutoff-score-rejected-by-prudhvi-cy5e/)); 600/600 still got no call for some ([LC-7549059](https://leetcode.com/discuss/post/7549059/visa-oa-criteria-needed-by-harshitha2006-289k/)). One Staff candidate claimed "at least 389/600" ([LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/)) — unverified. | LOW confidence on any number |
| Other platforms | HackerRank "Coding – Intermediate / Advanced / Expert" (2–3 Qs, 90 min) mostly for senior/US roles; HackerEarth once (Apr 2025); 2021–2022 campus tests were HackerRank | [LC-8404717](https://leetcode.com/discuss/post/8404717/visa-oa-staff-software-engineer-rejected-c0gg/), [LC-7561130](https://leetcode.com/discuss/post/7561130/visa-oa-coding-expert-by-anonymous_user-pvbu/), [JT-2025-04](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-april-1-2025-no-offer-positive-14930f23/) |

```
 70 minutes, 4 questions — a plan that matches the difficulty curve
 ┌──────────┬──────────┬───────────────────────┬──────────────────────────┐
 │ Q1  ~8m  │ Q2 ~12m  │ Q4 attempt ~20m        │ Q3 ~25m  (implementation)│  + 5m buffer
 └──────────┴──────────┴───────────────────────┴──────────────────────────┘
   easy       easy-med   hard: partial tests      long but mechanical: finish
                         still earn points         carefully, test examples
```

Two different candidates independently advised **1 → 2 → 4 → 3** ([LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/), [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/)), because Q3 is long-but-easy and Q4 gives partial points.

---

## 2. TOP VISA OA PATTERNS TO MASTER (ranked **only** by frequency)

Counted from the 36 reports. "Reports" = in how many candidates' OAs the topic appeared at least once; "Questions" = total questions with that topic (a question can have 2 topics). Recursion: 0 reports.

| Rank | Pattern | Reports | Questions | Label | Where to practise |
|---|---|---|---|---|---|
| 1 | **Arrays** (scans, prefix sums, counting) | 21 | 24 | HIGH | [OA 1/3 → Arrays](01-oa-arrays-strings-hashmap.md#arrays) |
| 2 | **Strings** (parsing, windows, formatting) | 17 | 22 | HIGH | [OA 1/3 → Strings](01-oa-arrays-strings-hashmap.md#strings) |
| 3 | **Simulation / implementation-heavy** | 16 | 20 | HIGH | allocator, state array, scooters, bubbles, packages |
| 4 | **HashMap / HashSet** | 12 | 14 | HIGH | [OA 1/3 → HashMap](01-oa-arrays-strings-hashmap.md#hashmap) |
| 5 | **Matrix / 2D grid** | 10 | 10 | HIGH | [OA 3/3 → Matrix](03-oa-matrix-graph-dp-simulation.md#matrix) |
| 6 | **Graphs** (BFS/DFS, paths) | 8 | 9 | HIGH | [OA 3/3 → Graphs](03-oa-matrix-graph-dp-simulation.md#graphs) |
| 6 | **Math / logic** (digits, patterns) | 8 | 8 | HIGH | [OA 2/3 → Math](02-oa-stack-queue-search-sorting-heap.md#math--logic-usually-q1--finish-fast) |
| 8 | **Binary search / ordered set** | 6 | 8 | HIGH | [OA 2/3 → Binary Search](02-oa-stack-queue-search-sorting-heap.md#binary-search) |
| 8 | **Sliding window** | 6 | 6 | HIGH | [OA 1/3 → Sliding Window](01-oa-arrays-strings-hashmap.md#sliding-window) |
| 10 | **Trees (mostly Trie)** | 5 | 5 | HIGH | [OA 3/3 → Trie](03-oa-matrix-graph-dp-simulation.md#trees-trie) |
| 10 | **Dynamic programming** | 5 | 5 | HIGH | [OA 3/3 → DP](03-oa-matrix-graph-dp-simulation.md#dynamic-programming) |
| 12 | **Sorting** | 4 | 4 | HIGH | [OA 2/3 → Sorting](02-oa-stack-queue-search-sorting-heap.md#sorting) |
| 12 | **Heap / priority queue** | 4 | 4 | HIGH | [OA 2/3 → Heap](02-oa-stack-queue-search-sorting-heap.md#heap) |
| 14 | Two pointers | 3 | 3 | HIGH | [T1](01-oa-arrays-strings-hashmap.md#two-pointers) |
| 14 | Stack (monotonic) | 3 | 3 | HIGH | [K1](02-oa-stack-queue-search-sorting-heap.md#stack) |
| 16 | Queue | 2 | 2 | MEDIUM | [Q1](02-oa-stack-queue-search-sorting-heap.md#queue) |
| 17 | Linked list (inside an LRU-like design) | 1 | 1 | LOW | — |
| 17 | File / data processing | 1 | 1 | LOW | [F2](03-oa-matrix-graph-dp-simulation.md#file--data-processing) |
| — | Recursion | 0 | 0 | — | not seen in OAs |

### Specific questions that repeated (same problem, different candidates)

| Question | Times reported | Label | Where |
|---|---|---|---|
| Bus departure / next shuttle with `"HH:MM"` times | **4** (Feb 2025 → Apr 2026) | HIGH | [S1](01-oa-arrays-strings-hashmap.md#s1-bus-departures-in-hhmm--easy--high--reported) |
| Min difference between values at least `x` indices apart (LC 2817) | **3** | HIGH | [B1](02-oa-stack-queue-search-sorting-heap.md#b1-minimum-difference-between-values-at-least-x-apart--medium--high--reported--leetcode-2817) |
| Text justification / newspaper variants (LC 68) | **3** | HIGH | [S6](01-oa-arrays-strings-hashmap.md#s6-newspaper--text-justification-with-a--border--medium-implementation--high--reconstructed) |
| Trie-based question | 2 (+2 LC 3043 reports solvable with a Trie) | MEDIUM | [TR1](03-oa-matrix-graph-dp-simulation.md#tr1-trie-based-problem--medium--medium--reported-no-details) |
| Count numbers with an odd number of zeros | 2 | MEDIUM | [M1](02-oa-stack-queue-search-sorting-heap.md#m1-count-numbers-with-an-odd-number-of-zeros--easy--medium--reported) |
| Memory allocator (≈ LC 2502) | 2 | MEDIUM | [A6](01-oa-arrays-strings-hashmap.md#a6-memory-allocator--medium--medium--reported--leetcode-2502) |
| State array `L` / `C<i>` | 2 | MEDIUM | [P1](02-oa-stack-queue-search-sorting-heap.md#p1-state-array-with-l-and-ci-operations--easy-medium--medium--exact) |
| E-scooters | 2 (2023, 2025) | MEDIUM | [R2](02-oa-stack-queue-search-sorting-heap.md#r2-e-scooters--easy--medium--exact) |
| Longest common prefix between two number arrays (LC 3043) | 2 (2023, 2025) | MEDIUM | [H2](01-oa-arrays-strings-hashmap.md#h2-longest-common-prefix-between-numbers-of-two-arrays--medium--medium--reported--leetcode-3043) |
| Length-3 substring counting | 2 | MEDIUM | [S2](01-oa-arrays-strings-hashmap.md#s2-count-length-3-substrings-with-a-property--easy--medium--reported) |
| "Subarrays with at least k …" | 2 | MEDIUM | [W1](01-oa-arrays-strings-hashmap.md#w1-subarrays-with-at-least-k-distinct-values--medium--medium-family--reported), [W2](01-oa-arrays-strings-hashmap.md#w2-subarrays-with-at-least-k-equal-pairs--medium--medium-family--exact) |
| Colour/bubble "pop and fall" matrix simulation | 2 (similar) | MEDIUM | [X2](03-oa-matrix-graph-dp-simulation.md#x2-bubble-explosion--gravity--medium--medium-family--exact) |

**Observation**: the same set "bus departure · odd zeros · memory allocator · min gap" was reported by an **on-campus Indian** candidate (Oct 2025) and a **Senior** candidate (Apr 2026) → CodeSignal question banks look **shared across levels**, so senior OA reports are still useful practice.

---

## 3. OA day checklist

- [ ] Photo ID, quiet room, webcam + mic working, single monitor, no phone on desk.
- [ ] Choose **Java** and test `import java.util.*;` works in the editor before the timer matters.
- [ ] Read **all 4** questions in the first 3 minutes; mark which one is "long but mechanical".
- [ ] For every question: run the given examples, then 2 of your own edge cases (empty, single element, all equal, max values).
- [ ] Use `long` for sums/counts; watch `"HH:MM"` parsing and output format.
- [ ] If stuck on Q4 after ~20 min: submit a brute force — partial tests = partial points.
- [ ] Don't copy-paste from outside, don't look away for long, don't type in bursts — proctoring flags are real ([LC-7346747](https://leetcode.com/discuss/post/7346747/visa-2nd-oa-by-jethiya_babuchak-l93o/)).

**🗣️ Aise socho**: "Q3 lamba hai, mushkil nahi. Q4 mushkil hai, lamba nahi. Dono ke liye alag strategy."

Next: [OA 1/3 →](01-oa-arrays-strings-hashmap.md) · Then: [Mock OA sets](04-mock-oa-sets.md)
