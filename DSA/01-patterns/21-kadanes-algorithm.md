# 21. Kadane's Algorithm (Maximum Subarray)

> Pehle ye aane chahiye: [Arrays (syllabus)](../00-syllabus/01-basics/02-arrays.md), [Prefix Sum (pattern)](07-prefix-sum.md), [DP Basics (syllabus)](../00-syllabus/06-dynamic-programming/24-dp-basics.md)

> **Standard definition**: A linear-time algorithm that finds the contiguous subarray with the largest sum. For every position it keeps the best sum of a subarray that *ends* there, and chooses between extending the previous subarray or starting a new one.

**Ek line mein** (in one line): At every element ask one question — *"Is the sum I have so far positive? **Yes** → keep it and extend. **No** → drop it and start fresh from this element."* One pass, **O(n)** time, **O(1)** space.

**Trick yaad rakhne ki**: *"Sabzi mandi ki daily profit/loss diary"* — every evening you write today's profit or loss. You want the **best stretch of consecutive days**. Each morning ask: *"Is my running total from the earlier days positive?"* **Yes** → carry those days forward, they are helping. **No** (zero or negative) → forget them and start a fresh stretch today.

```
day i          0    1    2    3    4    5    6    7    8
nums[i]       -2    1   -3    4   -1    2    1   -5    4
sum before     –   -2    1   -2    4    3    5    6    1        (cur of the previous day)
before > 0 ?   –   NO  YES   NO  YES  YES  YES  YES  YES
action        start restart extend restart extend extend extend extend extend
cur           -2    1   -2    4    3    5    6    1    5
best          -2    1    1    4    4    5    6    6    6        →  answer 6   subarray [4, -1, 2, 1]
```

---

## 1. Kab use karo — how to RECOGNISE it

Answer these questions in order. The first **Yes** tells you the tool.

| Question | Answer | Use |
|---|---|---|
| Must the piece be **contiguous** (no gaps)? | **No** | Not Kadane — it is a subset problem (DP / greedy) |
| Is the sum required to be **exactly `k`**? | **Yes** | [Prefix Sum + HashMap](07-prefix-sum.md) |
| Do you want the **longest / shortest** subarray with a condition? | **Yes** | [Sliding Window](01-sliding-window.md) |
| Do you want the **max / min sum (or product / profit)** of a contiguous piece? | **Yes** | **Kadane** ✅ |

```
✅ Contiguous subarray?                                   YES
✅ Asking for MAXIMUM (or MINIMUM) sum / product / profit?  YES
✅ Negative numbers present? (else "take everything" is the answer)   YES
```

| Question wording | Variation |
|---|---|
| "**maximum sum** contiguous subarray" (maybe "return the subarray too") | ① **Basic Kadane** |
| "**minimum** sum subarray", "**maximum absolute** sum" | ② **Min / Absolute** |
| "**circular** array" (end connects to start) | ③ **Circular** |
| "maximum **product** subarray" | ④ **Product** (track max and min) |
| "**delete one element**", "**buy and sell once**", "**reset when the pattern breaks**" (ascending / alternating) | ⑤ **Kadane with a twist** |
| "maximum sum **rectangle** in a matrix" | ⑥ **2D Kadane** |

### ❌ Kab NAHI
- **Sum = k** or "how many subarrays have sum k" → Prefix Sum + HashMap.
- **Longest subarray** with at most k distinct / sum ≤ k (all positive) → Sliding Window.
- **Non-contiguous** choice (pick any elements) → [DP](19-dynamic-programming.md) / [Greedy](14-greedy.md).

---

## 2. Code likhne ki recipe — 4 questions

```
1. STATE   →  cur  = best sum of a subarray that ENDS at index i   (it must include nums[i])
2. CHOICE  →  YES/NO:  "is cur (before i) positive?"     →   cur = max( nums[i],  cur + nums[i] )
                          NO  → restart with nums[i]           YES → extend
3. ANSWER  →  best = max(best, cur)         # the best subarray can end ANYWHERE, so check every step
4. INIT    →  cur = best = nums[0]          # NOT 0  (an all-negative array must return the largest negative number)
```

```
cur = best = nums[0]
for i in 1 .. n-1:
    cur  = max( nums[i], cur + nums[i] )      # restart or extend
    best = max( best, cur )
return best
```

**Three rules to remember:**
1. `cur` **must include** the current element (the subarray *ends here*).
2. Start with `nums[0]`, **not 0** — unless an empty subarray is allowed (then 0 is correct).
3. `cur` can go down and restart, but `best` **only goes up**.

### Kadane = Prefix Sum in disguise

```
sum(i..j) = prefix[j] − prefix[i−1]
For a fixed end j, the best start is the one with the SMALLEST earlier prefix.
So:  best = max over j of ( prefix[j] − smallest prefix seen before j )      ← same answer as Kadane
```

---

## 3. ① Basic Kadane — max sum, and the subarray itself

```java
// Maximum Subarray — sum only
public int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];                        // 🔑 nums[0], not 0 → all-negative arrays work
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);               // YES (cur > 0): extend.  NO: restart at nums[i]
        best = Math.max(best, cur);
    }
    return best;
}

// Same, but also return WHERE the best subarray is:  {sum, start, end}
public int[] maxSubArrayRange(int[] nums) {
    int cur = nums[0], start = 0;
    int best = nums[0], bestStart = 0, bestEnd = 0;
    for (int i = 1; i < nums.length; i++) {
        if (cur < 0) {                                        // NO: earlier sum only hurts → restart here
            cur = nums[i];
            start = i;                                        // 🔑 a restart = a new start index
        } else {                                              // YES: earlier sum helps → extend
            cur += nums[i];
        }
        if (cur > best) {
            best = cur;
            bestStart = start;
            bestEnd = i;
        }
    }
    return new int[]{best, bestStart, bestEnd};
}

// The Prefix Sum view of the same idea
public int maxSubArrayPrefix(int[] nums) {
    int prefix = 0, minPrefix = 0, best = Integer.MIN_VALUE;
    for (int x : nums) {
        prefix += x;
        best = Math.max(best, prefix - minPrefix);            // best subarray ending here = prefix − smallest earlier prefix
        minPrefix = Math.min(minPrefix, prefix);              // update AFTER using it (subarray must be non-empty)
    }
    return best;
}
```

**Yes / No check on edge cases**
- All numbers negative, e.g. `[-3, -1, -2]`? → answer is `-1` (the largest single number). Works because we start from `nums[0]`.
- Single element? → that element.
- Need the subarray? → track `start` on every restart (`maxSubArrayRange`).

---

## 4. ② Min subarray and Maximum Absolute Sum

**Idea**: Flip `max` to `min` and you get the **minimum** subarray sum. The **maximum absolute** sum is `max( biggest positive sum, |smallest negative sum| )` — run both in the same loop.

```
nums = [1, -3, 2, 3, -4]

max-side cur:  1  0  2  5  1      best 5  ([2,3])
min-side cur:  0 -3 -1  0 -4      worst -4  ([-4])         →  max absolute sum = max(5, |-4|) = 5
(here an EMPTY subarray is allowed, so cur is floored at 0 → start with 0, not nums[0])
```

```java
// Minimum sum of a contiguous subarray
public int minSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.min(nums[i], cur + nums[i]);               // mirror image of max
        best = Math.min(best, cur);
    }
    return best;
}

// Maximum Absolute Sum of Any Subarray (empty subarray allowed → answer is never negative)
public int maxAbsoluteSum(int[] nums) {
    int maxCur = 0, minCur = 0, best = 0;                     // 0 is correct here because the empty subarray is allowed
    for (int x : nums) {
        maxCur = Math.max(0, maxCur + x);                     // YES/NO: a negative running sum is dropped (reset to 0)
        minCur = Math.min(0, minCur + x);                     // a positive running sum is dropped for the min side
        best = Math.max(best, Math.max(maxCur, -minCur));     // 🔑 biggest positive OR biggest |negative|
    }
    return best;
}
```

---

## 5. ③ Circular array

**Idea**: In a circular array the best piece is either **(A) in the middle** (normal Kadane) or **(B) wraps around** the end. A wrapping piece = **everything except a middle piece**, so `wrap = total − (minimum middle subarray)`.

```
nums = [5, -3, 5]                      total = 7

Case A (middle only) : normal Kadane            → 7   ([5, -3, 5])
Case B (wraps around): total − min subarray     → 7 − (−3) = 10   ([5 from the end, 5 from the start])
answer = max(A, B) = 10

Special case — every number is NEGATIVE:  B would be total − total = 0 = an EMPTY piece → NOT allowed.
                                          So if maxSum < 0  →  answer = A (the normal Kadane result).
```

```java
public int maxSubarraySumCircular(int[] nums) {
    int total = 0;
    int curMax = 0, maxSum = nums[0];                         // normal Kadane (max side)
    int curMin = 0, minSum = nums[0];                         // Kadane for the MINIMUM subarray
    for (int x : nums) {
        curMax = Math.max(curMax + x, x);
        maxSum = Math.max(maxSum, curMax);
        curMin = Math.min(curMin + x, x);
        minSum = Math.min(minSum, curMin);
        total += x;
    }
    if (maxSum < 0) return maxSum;                            // 🔑 all negative → wrapping would mean "empty" → not allowed
    return Math.max(maxSum, total - minSum);                  // middle piece  vs  wrap-around piece
}
```

---

## 6. ④ Maximum Product Subarray

**Idea**: With products, a **negative** number can turn the *smallest* product into the *biggest*. So track **both** `curMax` and `curMin`. A `0` resets both automatically (`x` itself is one of the choices).

```
nums = [-2, 3, -4]

start          curMax = -2   curMin = -2   best = -2
x =  3   →  candidates:  3,  (-2)*3 = -6,  (-2)*3 = -6         curMax = 3    curMin = -6   best = 3
x = -4   →  candidates: -4,  3*(-4) = -12, (-6)*(-4) = 24      curMax = 24   curMin = -12  best = 24 ✓
                                                                 ↑ the smallest (−6) became the biggest!
```

```java
public int maxProduct(int[] nums) {
    int curMax = nums[0], curMin = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int x = nums[i];
        int a = curMax * x, b = curMin * x;                   // 🔑 both extremes can produce the new max
        curMax = Math.max(x, Math.max(a, b));                 // restart at x, or extend the max/min product
        curMin = Math.min(x, Math.min(a, b));                 // keep the min too — a later negative will flip it
        best = Math.max(best, curMax);
    }
    return best;
}
```

---

## 7. ⑤ Kadane with a twist — extra state, or a different "reset" rule

**Idea**: The skeleton stays the same (**extend or restart**). Only the *state* or the *reset condition* changes.

```
A) One deletion allowed:   two states per position
      keep = best sum ending here, nothing deleted:        keep = max( x,  keep_prev + x )
      del  = best sum ending here, ONE element deleted:    del  = max( keep_prev  (delete THIS x),  del_prev + x )

      arr = [1, -2, 0, 3]
      i       0    1    2    3
      keep    1   -1    0    3
      del     –    1    1    4          best = 4  (delete −2 → 1 + 0 + 3)

B) Buy and sell once = Kadane on the DAILY DIFFERENCES (cur is floored at 0 = "don't trade")
      prices [7,1,5,3,6,4] → diffs [-6, 4, -2, 3, -2] → cur: 0 4 2 5 3 → best 5  (buy at 1, sell at 6)

C) Different reset rule:  Maximum Ascending Subarray Sum
      Is nums[i] > nums[i−1]?   YES → extend (as usual)      NO → the order broke → restart
      [10,20,30,5,10,50]:  cur = 10, 30, 60, 5, 15, 65   →  best 65
```

```java
// Maximum Subarray Sum with One Deletion (result must be non-empty)
public int maximumSum(int[] arr) {
    int keep = arr[0];                                        // best sum ending here, nothing deleted
    int del = Integer.MIN_VALUE / 2;                          // best sum ending here, one element deleted (not possible yet)
    int best = arr[0];
    for (int i = 1; i < arr.length; i++) {
        int x = arr[i];
        del = Math.max(keep, del + x);                        // 🔑 delete x itself (use keep_prev), or extend an earlier deletion
        keep = Math.max(keep + x, x);                         // normal Kadane
        best = Math.max(best, Math.max(keep, del));
    }
    return best;
}

// Best Time to Buy and Sell Stock (one transaction)
public int maxProfit(int[] prices) {
    int cur = 0, best = 0;                                    // 0 = "do not trade" is allowed
    for (int i = 1; i < prices.length; i++) {
        cur = Math.max(0, cur + prices[i] - prices[i - 1]);   // 🔑 Kadane on price[i] − price[i−1]
        best = Math.max(best, cur);
    }
    return best;
}

// Maximum Ascending Subarray Sum — reset when the order breaks
public int maxAscendingSum(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) cur = Math.max(nums[i], cur + nums[i]);   // YES (still ascending) → extend or restart
        else cur = nums[i];                                                   // NO (order broke) → restart
        best = Math.max(best, cur);
    }
    return best;                                       // (LeetCode numbers are positive, so plain cur + nums[i] also works)
}
```

---

## 8. ⑥ 2D Kadane — maximum sum rectangle

**Idea**: Fix a **top row** and a **bottom row**. Add the rows together **column by column** into one 1D array (`colSum`). A rectangle between those two rows is now just a **subarray of `colSum`** → run normal Kadane. Try every (top, bottom) pair. Time **O(rows² × cols)**.

```
matrix        1   2  -1
             -3   4   2

top=0, bottom=0 →  colSum = [ 1,  2, -1]   Kadane = 3
top=0, bottom=1 →  colSum = [-2,  6,  1]   Kadane = 7   ← columns 1..2 of both rows: 2 + (−1) + 4 + 2 = 7
top=1, bottom=1 →  colSum = [-3,  4,  2]   Kadane = 6
answer = 7
```

```java
public int maxSumRectangle(int[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length;
    int best = Integer.MIN_VALUE;
    for (int top = 0; top < rows; top++) {
        int[] colSum = new int[cols];                         // squashed rows top..bottom
        for (int bottom = top; bottom < rows; bottom++) {
            for (int c = 0; c < cols; c++) colSum[c] += matrix[bottom][c];   // 🔑 add one more row
            best = Math.max(best, maxSubArray(colSum));       // rectangle between top..bottom = subarray of colSum
        }
    }
    return best;
}

private int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}
```

(For "max sum rectangle **no larger than K**" the inner step needs a `TreeSet` — Kadane alone is not enough.)

---

## 9. Sab ek nazar mein

| Variation | State | Extend or restart | Answer |
|---|---|---|---|
| ① Basic | `cur` = best sum ending here | `max(x, cur + x)` | `max` of all `cur` |
| ② Min / Absolute | `curMin` (and `curMax`) | `min(x, cur + x)`; floor at 0 if empty allowed | `min`, or `max(maxCur, -minCur)` |
| ③ Circular | `curMax`, `curMin`, `total` | both Kadanes | `max(maxSum, total − minSum)`; all negative → `maxSum` |
| ④ Product | `curMax` **and** `curMin` | best of `x`, `max*x`, `min*x` | `max` of all `curMax` |
| ⑤ Twist | extra state (`keep`/`del`) or new reset rule | extend or restart with the new rule | `max` over all states |
| ⑥ 2D | `colSum` per (top, bottom) | Kadane on `colSum` | `max` over all pairs |

| Problem type | Tool |
|---|---|
| Max/min sum of a contiguous piece | **Kadane** — O(n) |
| Sum = k | Prefix Sum + HashMap |
| Longest / shortest with a condition | Sliding Window |
| Range sum queries (many) | Prefix Sum array |

## Common galtiyan

- **Starting with `cur = best = 0`** when all numbers can be negative → returns `0`, which is wrong. Start with `nums[0]`.
- **Forgetting that `cur` must include the current element** → you accidentally allow an empty subarray.
- **Updating `best` only when `cur` restarts** — update it on **every** step.
- **Product variant: tracking only the max** — a negative number can flip the min into the max. Track both.
- **Circular variant with all negatives** — `total − minSum` becomes `0` (empty piece). Return `maxSum` instead.
- **Empty subarray allowed vs not** — read the problem. Allowed → floor at `0`. Not allowed → start from `nums[0]`.
- **Using Kadane for "sum = k"** — it does not work; use Prefix Sum + HashMap.
- **`int` overflow** on big inputs — use `long` if the constraints say so.

> 💡 **Interview mein bolne wali line** (what to say): *"I need the maximum sum of a contiguous subarray, so I use Kadane's algorithm. For each index I keep the best sum of a subarray that ends there: either extend the previous one or start fresh — I extend only if the previous sum is positive. I keep a global maximum. One pass, O(n) time, O(1) space. I initialise with the first element so that an all-negative array still works."*

## Practice — by variation (easy to hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Best Time to Buy and Sell Stock | ⑤ Twist (differences) | Easy | [leetcode.com/problems/best-time-to-buy-and-sell-stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| 2 | Maximum Ascending Subarray Sum | ⑤ Twist (reset rule) | Easy | [leetcode.com/problems/maximum-ascending-subarray-sum](https://leetcode.com/problems/maximum-ascending-subarray-sum/) |
| 3 | Maximum Subarray | ① Basic | Medium | [leetcode.com/problems/maximum-subarray](https://leetcode.com/problems/maximum-subarray/) |
| 4 | Maximum Absolute Sum of Any Subarray | ② Min / Absolute | Medium | [leetcode.com/problems/maximum-absolute-sum-of-any-subarray](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) |
| 5 | Maximum Sum Circular Subarray | ③ Circular | Medium | [leetcode.com/problems/maximum-sum-circular-subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/) |
| 6 | Maximum Product Subarray | ④ Product | Medium | [leetcode.com/problems/maximum-product-subarray](https://leetcode.com/problems/maximum-product-subarray/) |
| 7 | Maximum Subarray Sum with One Deletion | ⑤ Twist (extra state) | Medium | [leetcode.com/problems/maximum-subarray-sum-with-one-deletion](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/) |
| 8 | Longest Turbulent Subarray | ⑤ Twist (reset rule) | Medium | [leetcode.com/problems/longest-turbulent-subarray](https://leetcode.com/problems/longest-turbulent-subarray/) |
| 9 | Maximum Alternating Subarray Sum 🔒 | ⑤ Twist (extra state) | Medium | [leetcode.com/problems/maximum-alternating-subarray-sum](https://leetcode.com/problems/maximum-alternating-subarray-sum/) |
| 10 | Max Sum of Rectangle No Larger Than K | ⑥ 2D | Hard | [leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/) |
| 11 | Substring With Largest Variance | ⑤ Twist (letter pairs) | Hard | [leetcode.com/problems/substring-with-largest-variance](https://leetcode.com/problems/substring-with-largest-variance/) |

**Kaise practice karein**: For every problem write down four answers first — *"What is `cur` (ends here)? Extend or restart rule? Is an empty subarray allowed? Do I need extra state (min, deleted, sign)?"* — then code it.

---

## Sab 21 patterns ho gaye

These 21 patterns cover most LeetCode problems. Whenever you see a new problem, first ask **"which pattern does this look like?"** Once you recognise the pattern, use its **recipe** (the "Code likhne ki recipe" section in each note) to write the code.

**Question wording → pattern (at a glance):**

| If the question says … | Pattern |
|---|---|
| contiguous **subarray/substring** + window condition | [01 Sliding Window](01-sliding-window.md) |
| **sorted** array, pair/triplet, or from both ends | [02 Two Pointers](02-two-pointers.md) |
| **linked list** cycle / middle / nth from end | [03 Fast & Slow](03-fast-slow-pointers.md) |
| **intervals** overlap / merge / rooms | [04 Merge Intervals](04-merge-intervals.md) |
| array of `1..n`, **missing / duplicate** | [05 Cyclic Sort](05-cyclic-sort.md) |
| **k-th** / top k / k closest | [06 Top K Elements](06-top-k-elements.md) |
| **range sum** / subarray sum = k | [07 Prefix Sum](07-prefix-sum.md) |
| **single number**, XOR, bits, power of 2 | [08 Bit Manipulation](08-bit-manipulation.md) |
| search in a **sorted / rotated** array | [09 Binary Search](09-binary-search.md) |
| "**minimum X that satisfies a condition**" (search on the answer) | [10 Binary Search on Answer](10-binary-search-on-answer.md) |
| **shortest steps** / level order / multi-source | [11 BFS](11-bfs.md) |
| **islands**, tree property, all paths, cycle | [12 DFS](12-dfs.md) |
| **all** subsets / permutations / N-Queens | [13 Backtracking](13-backtracking.md) |
| local best choice + sort / heap | [14 Greedy](14-greedy.md) |
| **connected groups**, extra edge, Kruskal | [15 Union-Find](15-union-find.md) |
| **brackets**, expression, undo | [16 Stack](16-stack.md) |
| **next greater/smaller**, histogram | [17 Monotonic Stack](17-monotonic-stack.md) |
| **prefix** / autocomplete / dictionary | [18 Trie](18-trie.md) |
| **min / max / count ways** + overlapping subproblems | [19 Dynamic Programming](19-dynamic-programming.md) |
| **dependencies**, weighted shortest path, MST | [20 Graph Algorithms](20-graph-algorithms.md) |
| **max / min sum (or product) of a contiguous subarray** | [21 Kadane's Algorithm](21-kadanes-algorithm.md) |

Practice order suggestion: Sliding Window → Two Pointers → Fast/Slow → Prefix Sum → **Kadane** → Binary Search → Stack → Monotonic Stack → BFS/DFS → Backtracking → Greedy → Union-Find → Trie → Heap/Top-K → DP → Graph Algorithms — roughly easy to hard.
