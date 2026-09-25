# Visa OA Mock Sets (3 × 4 questions, no solutions here)

> ⚠️ These are **original practice problems written for this guide**. They are **not** leaked or reported Visa questions. Each one is designed to mirror a pattern that **was** reported (the mapping is in the [answer key](05-mock-oa-answer-key.md)).
>
> **Rules for yourself**: 70 minutes per mock · Java only · no notes, no AI · run the examples · submit brute force if stuck · record your score out of 4 and the time per question.

**Easy analogy — nets practice before the match**: Mock OA = nets mein wahi bowling machine jo match mein milegi — same speed, same line. Asli match mein surprise kam hoga.

| Mock | Time | Q1 (Easy) | Q2 (Easy-Medium) | Q3 (Medium-Hard, implementation) | Q4 (Hard) |
|---|---|---|---|---|---|
| 1 — Payments platform | 70 min | Math / digits | Strings + time | Simulation (allocator) | Sliding window + deques |
| 2 — Merchant analytics | 70 min | Strings | HashMap + ordering | Matrix + gravity | Graph (shortest path) |
| 3 — Billing & bookings | 70 min | Strings | Greedy | Text formatting | DP + binary search |

---

## Mock OA 1 — Payments platform (70 min)

### 1.1 Even digit sums — Easy
You are given an integer array `amounts` (`1 ≤ length ≤ 10^5`, `|amounts[i]| ≤ 10^9`). The **digit sum** of a number is the sum of the digits of its absolute value (`digitSum(0) = 0`). Return how many amounts have an **even** digit sum.
- `[12, 7, 101, -44, 0]` → `3` (digit sums 3, 7, 2, 8, 0)
- `[9]` → `0`

### 1.2 Shift overlap — Easy-Medium
Two support engineers work the same shift **every day**. Each shift is `["HH:MM", "HH:MM"]` = `[start, end]`. If `end` is earlier than `start`, the shift runs past midnight. `start != end`. Return how many **minutes per day** both engineers are working at the same time.
- `A = ["09:00","17:00"]`, `B = ["12:30","20:00"]` → `270`
- `A = ["22:00","02:00"]`, `B = ["01:00","06:00"]` → `60`
- `A = ["23:00","01:00"]`, `B = ["23:30","00:30"]` → `60`

### 1.3 Seat booking — Medium-Hard (implementation)
A cinema row has `n` seats numbered `0..n-1` (`n ≤ 1000`). Process `operations` (`≤ 1000`) in order and return one integer per operation:
- `"BOOK k"` — find the **leftmost** block of `k` consecutive free seats. If found, book it under the next booking id (ids start at 1 and increase only when a booking succeeds) and return the first seat index; otherwise return `-1`.
- `"CANCEL id"` — free the seats of booking `id` if it is active and return how many seats were freed; otherwise return `0`.

Example: `n = 5`, `["BOOK 2","BOOK 2","CANCEL 1","BOOK 3","BOOK 1","BOOK 2"]` → `[0, 2, 2, -1, 0, -1]`

### 1.4 Stable price windows — Hard
Given `prices` (`n ≤ 10^5`, values `≤ 10^9`) and `limit`, count the contiguous subarrays whose `max − min ≤ limit`.
- `prices = [4, 2, 2, 5, 3]`, `limit = 2` → `9`
- `prices = [1, 1, 1]`, `limit = 0` → `6`

---

## Mock OA 2 — Merchant analytics (70 min)

### 2.1 Run-length code — Easy
Compress a lowercase string: every maximal run of the same letter becomes `letter + runLength`.
- `"aaabccdddd"` → `"a3b1c2d4"` · `"z"` → `"z1"` · `""` → `""`

### 2.2 Big spenders — Easy-Medium
`logs[i]` is `"<userId> <amount>"` (amount is a positive integer). Keep a running total per user. Return the users whose total **reaches at least** `threshold`, in the order in which they reached it (each user appears once).
- `logs = ["alice 300","bob 150","alice 250","carol 600","bob 400"]`, `threshold = 500` → `["alice","carol","bob"]`
- `logs = ["x 10"]`, `threshold = 500` → `[]`

### 2.3 Rotate and drop — Medium-Hard (matrix simulation)
A warehouse grid (`m × n`, both `≤ 500`) has `'#'` = box, `'*'` = fixed pillar, `'.'` = empty. The grid is rotated **90° clockwise**, then gravity pulls every box **down** until it lands on a pillar, another box, or the floor. Pillars never move. Return the final grid.
- `[["#",".","#"]]` → `[["."],["#"],["#"]]`
- `[["#",".","*","."],["#","#","*","."]]` → `[["#","."],["#","#"],["*","*"],[".","."]]`

### 2.4 Payment network delay — Hard
There are `n` servers `1..n` and directed links `times[i] = [u, v, ms]` (message from `u` reaches `v` after `ms`). A message starts at server `k`. Return the minimum time until **every** server has received it, or `-1` if some server never does. `n ≤ 100`, links `≤ 6000`.
- `times = [[2,1,1],[2,3,1],[3,4,1]]`, `n = 4`, `k = 2` → `2`
- `times = [[1,2,1]]`, `n = 2`, `k = 2` → `-1`

---

## Mock OA 3 — Billing & bookings (70 min)

### 3.1 Same-letter words — Easy
A sentence has words separated by single spaces. Count the words whose first and last letters are the same, **ignoring case** (a one-letter word counts).
- `"Anna saw a racecar at noon"` → `4` (Anna, a, racecar, noon)
- `"visa pays"` → `0`

### 3.2 Charging stops — Easy-Medium
An electric scooter drives from `0` to `destination` with a battery range of `range` km; it starts full and every charge refills it to full. Charging stations are at the sorted, distinct positions `stations` (`0 < s < destination`). Return the **minimum number of charges** needed, or `-1` if impossible.
- `destination = 100`, `range = 40`, `stations = [30, 50, 70, 90]` → `2`
- `destination = 100`, `range = 30`, `stations = [40]` → `-1`

### 3.3 Receipt formatter — Medium-Hard (text formatting)
Print a receipt of width `W` (`12 ≤ W ≤ 60`). `items[i] = [name, priceInPaise]`. Money is printed as rupees with 2 decimals (`1250 → "12.50"`, `5 → "0.05"`).
- An item line is `name + dots + price` with **at least one dot**, exactly `W` characters.
- Long names wrap: cut the name into pieces of `W` characters (the last piece may be shorter) and print every piece except the last on its own line.
- If the last piece + one dot + the price fits in `W`, print them together. Otherwise print the last piece padded with spaces to `W`, and then a line of dots + price.
- After the items print `W` dashes, then a `TOTAL` line built the same way.

`W = 16`, `items = [["Tea","1250"],["Masala Dosa Special","9900"]]` →
```
Tea........12.50
Masala Dosa Spec
ial........99.00
----------------
TOTAL.....111.50
```

### 3.4 Max-profit bookings — Hard
`bookings[i] = [start, end, profit]` (`n ≤ 5·10^4`, times `≤ 10^9`). Choose bookings that do not overlap (a booking may start exactly when another ends) to maximize total profit.
- `[[1,3,50],[2,4,10],[3,5,40],[3,6,70]]` → `120`
- `[[1,2,5],[1,3,6],[1,4,4]]` → `6`

---

**Score yourself**: 4/4 in time → you are OA-ready · 3/4 with Q4 partial → typical passing profile in reports · ≤ 2/4 → redo the reported questions in [OA 1/3](01-oa-arrays-strings-hashmap.md)–[3/3](03-oa-matrix-graph-dp-simulation.md) first.

Answers: [05-mock-oa-answer-key.md](05-mock-oa-answer-key.md)
