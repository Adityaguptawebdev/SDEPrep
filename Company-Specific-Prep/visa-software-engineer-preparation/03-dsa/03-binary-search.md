# DSA 3/8 — Binary Search (on arrays and on the answer)

**Easy analogy — bathroom geyser ka temperature**: Knob ko 0 se 100 tak ek-ek karke nahi ghumaate. **Beech mein rakho** → zyada garam? aadha neeche. Thanda? aadha upar. 7 tries mein perfect. **Binary search on answer** yahi hai: answer ki range pe search karo, har guess ke liye sirf **"yeh chalega ya nahi?"** (feasibility) check karo.

| # | Problem | Reporter level | Freq | Status |
|---|---|---|---|---|
| 1 | Search in Rotated Sorted Array | **EC (10 months)** + Senior | MEDIUM (2) | Exact |
| 2 | Aggressive Cows (variation) | **EC (10 months), Selected** | **HIGH as a family** (BS on answer: 3 reports) | Reported variation |
| 3 | Book-allocation-like binary search | ? | (same family) | Close |
| 4 | Minimum Time to Complete Trips | Senior | (same family) | Exact |

```
 Binary search on the answer — the recipe
 1. What is the answer?            (a distance, a page limit, a time)
 2. Range [lo, hi] where it lies   (smallest possible … largest possible)
 3. feasible(x) in O(n)            (greedy check: "can we do it with x?")
 4. Is feasible monotonic?         (if x works, does x+1 also work? → yes/no decides lo/hi moves)
 5. Search for the first/last x that works
```

---

## 1. Search in Rotated Sorted Array

| Field | Details |
|---|---|
| **Reported problem** | "one dsa question (search in rotated sorted array)" — **Exact** ([LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/)) |
| **Source** | [LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/) · Dec 2025 · **SWE, 10 months experience** (offer, Feb 2026) · also [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/) (Oct 2023, Senior, 3 YOE, round 1) |
| **Round** | Technical round 1 (after intro + project discussion) |
| **Difficulty** | Medium |
| **Pattern** | Modified binary search — one half is always sorted |
| **Frequency** | MEDIUM (2 reports) |

**Brute force**: linear scan O(n).
**Optimal**: at every `mid`, either `[lo..mid]` or `[mid..hi]` is sorted. Check if the target lies inside the sorted half; keep that half or the other one.

```
 nums = [4,5,6,7,0,1,2], target = 0
 lo=0 hi=6 mid=3 (7): left half 4..7 sorted, 0 not in [4,7] → go right  lo=4
 lo=4 hi=6 mid=5 (1): left half 0..1 sorted, 0 in [0,1)       → go left   hi=4
 lo=4 hi=4 mid=4 (0): found at 4
```

```java
class RotatedSearch {
    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;                     // no overflow
            if (a[mid] == target) return mid;
            if (a[lo] <= a[mid]) {                            // left half is sorted
                if (a[lo] <= target && target < a[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                                          // right half is sorted
                if (a[mid] < target && target <= a[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}
```

**Time**: O(log n). **Space**: O(1).
**Follow-ups**: duplicates allowed ([LC 81](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) — worst case O(n) when `a[lo] == a[mid] == a[hi]`, shrink both ends) · find the rotation point / minimum ([LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)) · why `lo + (hi − lo) / 2`?
**🗣️ Interview mein aise bolo**: "Rotation ke baad bhi har mid pe ek half sorted hota hai. Main check karta hoon target us sorted half ki range mein hai ya nahi — haan toh wahi half, nahi toh doosra. O(log n)."

---

## 2. Aggressive Cows (variation) — binary search on the answer

| Field | Details |
|---|---|
| **Reported problem** | "A variation of the Aggressive Cows problem (SPOJ AGGRCOW). Required applying binary search on answers. Wrote code with all edge cases covered." — **Reported variation / reconstructed from candidate experience**: the exact twist was not shared, so we solve the classic version. |
| **Source** | [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) · May 2025 · **Software Engineer, 10 months experience, Bangalore — Selected** |
| **Round** | Technical round 2 (after ~40 min of resume, architecture and tech-stack questions) |
| **Difficulty** | Medium (Hard for many if they don't know the pattern) |
| **Pattern** | Binary search on the answer + greedy feasibility check |
| **Frequency** | **HIGH** as a family (binary search on answer: this + Book Allocation + Min Time for Trips) |

**Problem**: `stalls[]` positions on a line, `k` cows. Place cows so that the **minimum distance between any two cows is as large as possible**. Return that distance. ([SPOJ AGGRCOW](https://www.spoj.com/problems/AGGRCOW/); similar: [LC 1552 Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/))

**Brute force**: try every distance `d` from 1 upward and check feasibility → O(range · n).
**Optimal**: `feasible(d)` = "place cows greedily from the left, each at the first stall ≥ previous + d; did we place k?" If `d` works, every smaller `d` works → monotonic → binary search the **largest** feasible `d`.

```
 stalls = [1,2,4,8,9], k = 3 (sorted)
 d=4: cows at 1, 8(≥5) , then need ≥12 → only 2 cows ✗
 d=3: cows at 1, 4(≥4), 8(≥7) → 3 cows ✔
 answer = 3        search:  lo=1 hi=8 → mid 4 ✗ → hi=3 → mid 2 ✔ (best 2) → lo=3 → mid 3 ✔ (best 3) → lo=4 > hi → stop
```

```java
import java.util.Arrays;

class AggressiveCows {
    static int largestMinDistance(int[] stallsInput, int k) {
        int[] stalls = stallsInput.clone();
        Arrays.sort(stalls);
        int lo = 1, hi = stalls[stalls.length - 1] - stalls[0];   // answer range
        int best = 0;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (canPlace(stalls, k, mid)) { best = mid; lo = mid + 1; }   // works → try bigger
            else hi = mid - 1;                                          // fails → go smaller
        }
        return best;
    }

    static boolean canPlace(int[] stalls, int k, int d) {
        int placed = 1, last = stalls[0];                          // first cow at the first stall
        for (int i = 1; i < stalls.length && placed < k; i++) {
            if (stalls[i] - last >= d) { placed++; last = stalls[i]; }
        }
        return placed >= k;
    }
}
```

**Time**: O(n log n + n log(range)). **Space**: O(n) for the sorted copy (O(1) if sorting in place is allowed).
**Edge cases the candidate mentioned "covering"**: `k = 1` (no pair exists — every distance "works", so this code returns `max − min`; ask what they expect, usually `k ≥ 2` is guaranteed), a single stall (returns 0), `k = n`, duplicate positions (distance 0 pairs), unsorted input, large coordinates (use `long` if positions can reach 2·10⁹).
**Possible "variations"** to prepare: place routers/ATMs/servers to maximise minimum distance · minimise the maximum distance to a customer · return the positions too.
**🗣️ Interview mein aise bolo**: "Answer ek distance hai, range 1 se (max − min) tak. Kisi distance d ke liye greedy se check karta hoon ki k cows fit hoti hain ya nahi. Agar d chalta hai toh chhota bhi chalega — monotonic hai, toh answer pe binary search. O(n log range)."

---

## 3. Book-allocation-like binary search

| Field | Details |
|---|---|
| **Reported problem** | "Binary search question, similar to the book allocation problem but more complex. The problem statement given by the interviewer was very short, and I didn't find a similar question on LeetCode." — **Close**; we solve classic Book Allocation (= [LC 410 Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)) |
| **Source** | [LC-6536057](https://leetcode.com/discuss/post/6536057/visa-interview-experience-ghosted-by-rec-2xye/) · Mar 2025 · level not stated · solved it (then ghosted by recruiter) |
| **Round** | Interview 2 (DSA + problem solving), with House Robber |
| **Difficulty** | Medium-Hard |
| **Pattern** | Binary search on the answer (minimise the maximum) |
| **Frequency** | same family as Aggressive Cows |

**Problem**: `pages[i]` books in order, `m` students, each student gets a **contiguous** block, every book assigned. Minimise the **maximum** pages any student reads.

**Note the mirror image**: Aggressive Cows *maximises a minimum*; Book Allocation *minimises a maximum*. Same recipe, opposite direction.

```java
class BookAllocation {
    static long minMaxPages(int[] pages, int students) {
        if (students > pages.length) return -1;                // someone would get no book
        long lo = 0, hi = 0;
        for (int p : pages) { lo = Math.max(lo, p); hi += p; } // answer in [max book, total]
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (studentsNeeded(pages, mid) <= students) hi = mid;   // limit works → try smaller
            else lo = mid + 1;
        }
        return lo;
    }

    static int studentsNeeded(int[] pages, long limit) {
        int count = 1;
        long current = 0;
        for (int p : pages) {
            if (current + p > limit) { count++; current = 0; }  // start a new student
            current += p;
        }
        return count;
    }
}
```

**Dry run**: `pages = [12, 34, 67, 90]`, `m = 2` → range [90, 203]; limit 113 → [12,34,67] + [90] ✔; limit 112 → needs 3 ✗ → answer **113**.
**Time**: O(n log(sum)). **Space**: O(1).
**Follow-ups**: painters partition · ship packages within D days ([LC 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)) · Koko eating bananas ([LC 875](https://leetcode.com/problems/koko-eating-bananas/)).
**🗣️ Interview mein aise bolo**: "Max pages limit guess karo; greedy se dekho kitne students lagenge. Limit badhao toh students kam lagte hain — monotonic. Chhota se chhota limit dhoondo jisme students ≤ m."

---

## 4. Minimum Time to Complete Trips *(Senior report)*

| Field | Details |
|---|---|
| **Reported problem** | [LC 2187](https://leetcode.com/problems/minimum-time-to-complete-trips/) — **Exact** |
| **Source** | [LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/) · May 2023 · **Senior**, 3 YOE (offer) |
| **Round** | Round 1 (DSA), with merge-linked-lists and top view | **Difficulty**: Medium | **Pattern**: binary search on time |

```java
class TripsTime {
    static long minimumTime(int[] time, long totalTrips) {
        long fastest = Long.MAX_VALUE;
        for (int t : time) fastest = Math.min(fastest, t);
        long lo = 1, hi = fastest * totalTrips;                   // one bus could do everything
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (tripsBy(time, mid, totalTrips) >= totalTrips) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    static long tripsBy(int[] time, long t, long cap) {
        long trips = 0;
        for (int x : time) {
            trips += t / x;
            if (trips >= cap) return trips;                        // early exit avoids overflow
        }
        return trips;
    }
}
```

**Time**: O(n log(min·total)). **Space**: O(1).

---

⚡ **Quick revision**: rotated array → "which half is sorted?" · maximise the minimum / minimise the maximum → binary search the answer + greedy check · always ask "is feasibility monotonic?" · use `lo + (hi − lo) / 2` and `long` for big ranges.

Next: [DSA 4/8 — Linked list · Stack · Heap · Sorting →](04-linked-list-stack-heap-sorting.md)
