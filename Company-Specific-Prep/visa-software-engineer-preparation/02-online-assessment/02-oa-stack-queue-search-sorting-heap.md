# OA Questions 2/3 — Stack · Queue · Linked List · Binary Search · Sorting · Heap · Math/Logic

> Same rules as [OA 1/3](01-oa-arrays-strings-hashmap.md): **Exact / Reported / Reconstructed** status, **HIGH / MEDIUM / LOW** frequency, and every Java block is compiled + tested against brute force.

**Easy analogy — kitchen tools**: Stack = **plates ka dher** (last plate on top comes out first). Queue = **ration ki line**. Heap = **hospital emergency** (sabse critical patient pehle, aane ka order nahi). Binary search = **dictionary mein shabd dhoondhna** (beech se kholo, aadha hissa phenko). OA mein sahi "tool" pehchaan liya toh aadha kaam ho gaya.

| # | Question | Difficulty | Freq | Status | Source |
|---|---|---|---|---|---|
| K1 | Largest square inside a skyline | Medium | LOW | Reported | [LC-6819912](https://leetcode.com/discuss/post/6819912/visa-online-assessment-by-anonymous_user-pyap/) |
| Q1 | Reactor with a limited waiting chamber | Medium | LOW | Reconstructed | [LC-7232120](https://leetcode.com/discuss/post/7232120/visa-oa-pre-screen-for-new-grad-waca-usa-mpf8/) (US) |
| L1 | Linked list | — | none in OA | — | see note |
| B1 | Min difference between values at least `x` apart | Medium | **HIGH** (3) | Reported (= LC 2817) | [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-7382120](https://leetcode.com/discuss/post/7382120/visa-oa-sde1-question-by-anonymous_user-iyvw/) |
| B2 | Mission time with two sorted departure lists | Easy-Medium | LOW | Reconstructed | [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) |
| R1 | Earliest meeting slot free for every employee | Medium | LOW | Exact | [LC-5630895](https://leetcode.com/discuss/post/5630895/visa-software-engineer-oa-by-anonymous_u-utw6/) |
| R2 | E-scooters: distance travelled on scooters | Easy | MEDIUM | Exact | [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/), [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) |
| P1 | State array with `L` and `C<i>` operations | Easy-Medium | MEDIUM | Exact | [LC-7479591](https://leetcode.com/discuss/post/7479591/visa-oa-ctc31lpa-asked-in-2026-sde-inter-gmrl/), [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) |
| P2 | Repeatedly remove the smallest peak | Medium | LOW | Reported | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) |
| P3 | Minimum refueling stops | Hard | LOW | Reported (= LC 871) | [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/) (US) |
| M1 | Count numbers with an odd number of zeros | Easy | MEDIUM | Reported | [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) |
| M2 | Maximum digital root | Easy | LOW | Reported | [LC-7354481](https://leetcode.com/discuss/post/7354481/visa-codesignal-17112025-failed-by-node-pndhb/) |
| M3 | Grade from marks | Easy | LOW | Reported | [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) |
| M4 | Hollow square pattern | Easy | LOW | Reported | [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) |

---

## Stack

### K1. Largest square inside a skyline — Medium · LOW · Reported

**Source**: [LC-6819912](https://leetcode.com/discuss/post/6819912/visa-online-assessment-by-anonymous_user-pyap/) · Jun 2025 · Visa OA.
Buildings of width 1 stand side by side with heights `cityline[i]`. Return the **area of the largest square** that fits inside the skyline. `[1,2,3,2,1]` → `4` (a 2×2 square).

**Pattern**: monotonic stack — the same idea as [LC 84 Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/). For each bar, find how far it can stretch left and right while it is the shortest bar. A rectangle of height `h` and width `w` holds a square of side `min(h, w)`.

```
 heights   1 2 3 2 1           bar h=2 (index 1) stretches over indices 1..3 → width 3
               █                side = min(2, 3) = 2  → area 4
             █ █ █
           █ █ █ █ █
```

```java
import java.util.ArrayDeque;
import java.util.Deque;

class LargestSquareInSkyline {
    static long area(int[] h) {
        int n = h.length;
        Deque<Integer> stack = new ArrayDeque<>();          // indices with increasing heights
        long bestSide = 0;
        for (int i = 0; i <= n; i++) {
            int cur = (i == n) ? 0 : h[i];                  // height 0 at the end flushes the stack
            while (!stack.isEmpty() && h[stack.peek()] >= cur) {
                int height = h[stack.pop()];
                int left = stack.isEmpty() ? -1 : stack.peek();
                int width = i - left - 1;                   // bar is the minimum on (left, i)
                bestSide = Math.max(bestSide, Math.min(height, width));
            }
            stack.push(i);
        }
        return bestSide * bestSide;
    }
}
```

**Complexity**: O(n) time, O(n) space. **Other valid approach**: binary search on the side `s` + sliding-window minimum (O(n log n)).

---

## Queue

### Q1. Reactor with a limited waiting chamber — Medium · LOW · Reconstructed

**Source**: [LC-7232120](https://leetcode.com/discuss/post/7232120/visa-oa-pre-screen-for-new-grad-waca-usa-mpf8/) · Sep 2025 · new grad, **US** pre-screen. Reported: *"Samples arrive at different times and must be processed by a reactor, one at a time, in order. A cooling chamber can hold up to 10 waiting samples; if more than 10 are waiting, new arrivals are rejected. Compute the total time to process all accepted samples."* The processing time per sample was **not** reported.
Also: [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (Apr 2025, 1 YOE, Bengaluru) had an OA question "on queue" with no details.

**Reconstruction (our assumptions)**: arrivals are sorted; every sample takes `duration` time units; at most `capacity` samples may **wait** (the one inside the reactor is not waiting); a sample that finishes at time `t` frees the reactor before a sample arriving at `t` is checked. Return the time the last accepted sample finishes.

**Pattern**: queue simulation — "advance the machine up to the current time, then handle the new arrival".

```java
import java.util.ArrayDeque;
import java.util.Deque;

class BoundedReactor {
    static long finishTime(int[] arrivals, int duration, int capacity) {
        Deque<Integer> waiting = new ArrayDeque<>();
        long freeAt = 0;                                   // when the reactor is next free
        for (int t : arrivals) {
            // start waiting samples whose turn comes before this arrival
            while (!waiting.isEmpty() && freeAt <= t) {
                long start = Math.max(freeAt, waiting.poll());
                freeAt = start + duration;
            }
            if (waiting.isEmpty() && freeAt <= t) freeAt = (long) t + duration;   // straight in
            else if (waiting.size() < capacity) waiting.add(t);                    // wait
            // else: chamber full → rejected
        }
        while (!waiting.isEmpty()) freeAt = Math.max(freeAt, waiting.poll()) + duration;
        return freeAt;
    }
}
```

**Complexity**: O(n) time, O(capacity) space. In the real test, first confirm what "total time" means (finish time of the last sample vs sum of busy time).

---

## Linked List

**No linked-list question was reported in any 2023–2026 Visa OA we found.** The closest item is an "LRU-cache-like" design in a US SDE-1 OA ([LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/)), which needs a HashMap + doubly linked list — see [08-lld/01-custom-cache-lru-ttl.md](../08-lld/01-custom-cache-lru-ttl.md). Linked lists do appear in **technical rounds** — see [03-dsa/04-linked-list-stack-heap-sorting.md](../03-dsa/04-linked-list-stack-heap-sorting.md).

---

## Binary Search

### B1. Minimum difference between values at least `x` apart — Medium · **HIGH** · Reported (= LeetCode 2817)

**Sources** (3 independent reports):
- [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/) · Oct 2025 · on-campus India · Q4 = [LC 2817](https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint/).
- [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) · Apr 2026 · Senior · "View gap mountain, find minGap".
- [LC-7382120](https://leetcode.com/discuss/post/7382120/visa-oa-sde1-question-by-anonymous_user-iyvw/) · Nov 2025 · SDE-1 · hills: a hiker at hill `i` can see hills `i+gap, i+gap+1, …`; return the minimum height difference he can see. `[2,4,9,10]`, `gap = 2` → `6`.

**Pattern**: ordered set (TreeSet) as a sliding "already allowed" window. When we are at index `i`, every index `≤ i − x` is allowed. Add `nums[i − x]` to the set, then ask for the closest value to `nums[i]` using `floor` / `ceiling` (binary search inside the tree).

```
 nums = [2, 4, 9, 10], x = 2
 i=2: add nums[0]=2  → set {2}      closest to 9  → 2   diff 7
 i=3: add nums[1]=4  → set {2,4}    closest to 10 → 4   diff 6   → answer 6
```

```java
import java.util.TreeSet;

class MinDiffWithGap {
    static int minAbsoluteDifference(int[] nums, int x) {
        TreeSet<Integer> allowed = new TreeSet<>();
        int best = Integer.MAX_VALUE;
        for (int i = x; i < nums.length; i++) {
            allowed.add(nums[i - x]);                    // this value is now far enough
            Integer up = allowed.ceiling(nums[i]);       // smallest value >= nums[i]
            Integer down = allowed.floor(nums[i]);       // largest value <= nums[i]
            if (up != null) best = Math.min(best, up - nums[i]);
            if (down != null) best = Math.min(best, nums[i] - down);
            if (best == 0) return 0;
        }
        return best;
    }
}
```

**Complexity**: O(n log n) time, O(n) space.
**Trap (real one from [LC-7382120](https://leetcode.com/discuss/post/7382120/visa-oa-sde1-question-by-anonymous_user-iyvw/))**: the poster used C++ `std::lower_bound(s.begin(), s.end(), x)` on a `std::set` and got **TLE on 7 of 20 tests**. On a set, that generic call walks the tree step by step (O(n)); `s.lower_bound(x)` is O(log n). In Java, always use the collection's own `ceiling` / `floor`.

### B2. Mission time with two sorted departure lists — Easy-Medium · LOW · Reconstructed

**Source**: [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) · Aug 2025 · intern on-campus · Q2: "two sorted arrays of departure times of two spaceships and an integer `mission`… for each element in array1 pick the next greater element from array2, repeat `mission` times, return the end time".
**Our reconstruction**: start at time 0. One round = take the first departure in `a` at or after the current time, then the first departure in `b` **strictly after** that. Do `mission` rounds and return the final time, or `-1` if a departure is missing.

**Pattern**: "next greater element in a sorted array" = **upper bound** with binary search.

```java
class MissionTime {
    // index of the first value > target (a.length if none)
    static int upperBound(int[] a, int target) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] <= target) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    static int endTime(int[] a, int[] b, int mission) {
        int time = 0;
        for (int round = 0; round < mission; round++) {
            int i = upperBound(a, time - 1);         // first a >= time
            if (i == a.length) return -1;
            int j = upperBound(b, a[i]);             // first b > a[i]
            if (j == b.length) return -1;
            time = b[j];
        }
        return time;
    }
}
```

**Complexity**: O(mission · log n). **Explain**: "Sorted array + 'next bigger' = upper bound. Linear scan bhi chalega, par binary search dikhane se interviewer impressed hota hai."

---

## Sorting

### R1. Earliest meeting slot free for every employee — Medium · LOW · Exact

**Source**: [LC-5630895](https://leetcode.com/discuss/post/5630895/visa-software-engineer-oa-by-anonymous_u-utw6/) · Aug 2024 · Visa Software Engineer OA · CodeSignal **Q3 of 4** (screenshots, Java).
`schedules[i]` = list of `[start, finish]` meetings of employee `i` in minutes (≤ 24·60). Find the **earliest start** for a new meeting of `length` minutes that fits everyone and ends by `24·60`, else `-1`. Starting exactly when another meeting finishes is allowed (example: a meeting may start at 240 after one that ends at 240).
- `[[[480,510]], [[240,330]], [[375,400]]]`, `length = 180` → `0`
- `[[[0,1439]], [[0,1439]], [[0,390],[480,510]]]`, `length = 90` → `-1`

**Pattern**: merge all busy intervals (sort by start), then sweep for the first gap `≥ length`.

```
 busy (all employees, sorted):  [240,330] [375,400] [480,510]
 free pointer: 0 ──gap 240── 240        → 240 >= 180 → answer 0
```

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class EarliestCommonSlot {
    static final int DAY_END = 24 * 60;

    static int earliestStart(int[][][] schedules, int length) {
        List<int[]> busy = new ArrayList<>();
        for (int[][] employee : schedules) for (int[] meeting : employee) busy.add(meeting);
        busy.sort(Comparator.comparingInt(m -> m[0]));
        int free = 0;                                   // everything before `free` is checked
        for (int[] m : busy) {
            if (m[0] - free >= length) return free;     // gap [free, m[0]] is long enough
            free = Math.max(free, m[1]);                // push the pointer past this meeting
        }
        return DAY_END - free >= length ? free : -1;
    }
}
```

**Complexity**: O(M log M) for `M` meetings, O(M) space. The statement even allows O(n²·m²), so a simpler minute-by-minute check also passes — use whatever you can write fastest.

### R2. E-scooters — Easy · MEDIUM · Exact

**Sources**: [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/) (Aug 2023, full statement in screenshots) and [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) (Nov 2025, **Bangalore**, "E-Scooter Distance on a Line").
Street from `0` to `finish` (`≤ 1000`); scooters at distinct points `1 ≤ scooters[i] < finish` (≤ 200). Algorithm: walk to the nearest scooter **at or ahead of you**; ride it up to 10 points (or until `finish`); repeat; if no scooter is ahead, walk to the end. Return the distance travelled **on scooters**.
- `finish = 23`, `[7, 4, 14]` → `19` (4→14 on one, 14→23 on another)
- `finish = 27`, `[15, 7, 3, 10]` → `20` · `finish = 10`, `[]` → `0`

**Pattern**: sort + greedy simulation with a pointer.

```java
import java.util.Arrays;

class EScooters {
    static int distanceOnScooters(int finish, int[] scooters) {
        int[] s = scooters.clone();
        Arrays.sort(s);
        int pos = 0, ridden = 0, i = 0;
        while (pos < finish) {
            while (i < s.length && s[i] < pos) i++;      // scooters behind us are useless
            if (i == s.length) break;                    // walk the rest
            pos = s[i++];                                // walk to the nearest scooter ahead
            int ride = Math.min(10, finish - pos);
            ridden += ride;
            pos += ride;
        }
        return ridden;
    }
}
```

**Complexity**: O(k log k) for `k` scooters. **Trap**: a scooter exactly where you get off (`14` in example 1) **is** usable — that's why the check is `s[i] < pos`, not `<=`.

---

## Heap

### P1. State array with `L` and `C<i>` operations — Easy-Medium · MEDIUM · Exact

**Sources**: [LC-7479591](https://leetcode.com/discuss/post/7479591/visa-oa-ctc31lpa-asked-in-2026-sde-inter-gmrl/) (Jan 2026, SDE intern / SDE-1, CodeSignal **Q4 of 4**, full statement in screenshots) and [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) (Nov 2025, Bangalore, "State Array with Operations").
`state` is a binary array (`≤ 10^5`), `operations` (`≤ 5·10^5`) are:
- `"L"` — find the **smallest** index with `state[i] = 0` and set it to 1 (do nothing if none);
- `"C<index>"` — set `state[index] = 0`.
Return the final state as a string. `state = [0]*10`, `["L","L","C0","L","C3"]` → `"1100000000"`.

**Pattern**: naive scan for every `L` is O(n·q) = 5·10^10 → TLE. Keep a **min-heap of free indices**.

```
 ops:    L        L        C0       L        C3
 heap:  {0..9}   {1..9}   {2..9}   {0,2..9} {2..9} → 3 pushed back
 state: 1000…    1100…    0100…    1100…    1100000000
```

```java
import java.util.PriorityQueue;

class StateOperations {
    static String apply(int[] state, String[] operations) {
        PriorityQueue<Integer> free = new PriorityQueue<>();      // indices that are 0
        for (int i = 0; i < state.length; i++) if (state[i] == 0) free.add(i);
        for (String op : operations) {
            if (op.equals("L")) {
                if (!free.isEmpty()) state[free.poll()] = 1;      // smallest free index
            } else {                                              // "C<index>"
                int idx = Integer.parseInt(op.substring(1));
                if (state[idx] == 1) {                            // already 0 → already in heap
                    state[idx] = 0;
                    free.add(idx);
                }
            }
        }
        StringBuilder sb = new StringBuilder(state.length);
        for (int v : state) sb.append(v);
        return sb.toString();
    }
}
```

**Complexity**: O((n + q) log n) time, O(n) space. **Trap**: pushing an index twice (when `C` hits a cell that is already 0) — the `state[idx] == 1` check prevents it. A `TreeSet<Integer>` with `pollFirst()` also works.

### P2. Repeatedly remove the smallest peak — Medium · LOW · Reported

**Source**: [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) · 2025 · new grad · CodeSignal Q2: "Given an array of **distinct** elements, repeatedly find the smallest peak (an element greater than its neighbours), remove it, and continue until the array is empty. Return the sequence of removed peaks."
**Assumption**: the first/last element compares only with its one neighbour; a single element is a peak.
`[2, 7, 8, 5, 1, 6, 3, 9, 4]` → `[6, 8, 7, 5, 2, 9, 4, 3, 1]` (peaks at the start: 8, 6, 9 → remove 6; then 8; then the new peak 7; …).

**Pattern**: brute force (scan for peaks every time) is O(n²). Faster: a **min-heap of current peaks** + a **doubly linked list** (`prev[]`, `next[]`) so removal is O(1). Only the two neighbours of a removed peak can become new peaks.

```java
import java.util.PriorityQueue;

class SmallestPeakRemoval {
    static int[] removalOrder(int[] a) {
        int n = a.length;
        int[] prev = new int[n], next = new int[n];
        for (int i = 0; i < n; i++) { prev[i] = i - 1; next[i] = (i + 1 < n) ? i + 1 : -1; }
        PriorityQueue<Integer> heap = new PriorityQueue<>((x, y) -> Integer.compare(a[x], a[y]));
        boolean[] queued = new boolean[n];
        for (int i = 0; i < n; i++) if (isPeak(a, prev, next, i)) { heap.add(i); queued[i] = true; }
        int[] order = new int[n];
        for (int k = 0; k < n; k++) {
            int i = heap.poll();                        // smallest current peak
            order[k] = a[i];
            int p = prev[i], q = next[i];
            if (p != -1) next[p] = q;                   // unlink i
            if (q != -1) prev[q] = p;
            if (p != -1 && !queued[p] && isPeak(a, prev, next, p)) { heap.add(p); queued[p] = true; }
            if (q != -1 && !queued[q] && isPeak(a, prev, next, q)) { heap.add(q); queued[q] = true; }
        }
        return order;
    }

    static boolean isPeak(int[] a, int[] prev, int[] next, int i) {
        return (prev[i] == -1 || a[i] > a[prev[i]]) && (next[i] == -1 || a[i] > a[next[i]]);
    }
}
```

**Why a peak never "expires" in the heap**: two neighbours can't both be peaks (values are distinct), so removing a peak only changes the neighbourhood of **non-peaks**.
**Complexity**: O(n log n) time, O(n) space.

### P3. Minimum refueling stops — Hard · LOW · Reported (= LeetCode 871)

**Source**: [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/) · Nov 2025 · SDE-1, **US** · CodeSignal Q2 "same as [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/)" (solved in ~30 min).

**Pattern**: greedy with a max-heap — drive as far as fuel allows, remember every station passed; when stuck, refuel from the **largest** station passed (as if you had stopped there).

```java
import java.util.Collections;
import java.util.PriorityQueue;

class MinRefuelStops {
    static int minStops(int target, int startFuel, int[][] stations) {
        PriorityQueue<Integer> passed = new PriorityQueue<>(Collections.reverseOrder());
        long reach = startFuel;
        int stops = 0, i = 0;
        while (reach < target) {
            while (i < stations.length && stations[i][0] <= reach) passed.add(stations[i++][1]);
            if (passed.isEmpty()) return -1;            // can't reach any new station
            reach += passed.poll();                     // best refuel we could have taken
            stops++;
        }
        return stops;
    }
}
```

**Complexity**: O(n log n) time, O(n) space.

---

## Math / Logic (usually Q1 — finish fast)

### M1. Count numbers with an odd number of zeros — Easy · MEDIUM · Reported

**Sources**: [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/) (Oct 2025, on-campus India, Q1) and [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) (Apr 2026, "Numbers with odd 0s").

```java
class OddZeroCounter {
    static int zeros(long x) {
        if (x == 0) return 1;                    // "0" has one zero digit
        x = Math.abs(x);
        int z = 0;
        for (; x > 0; x /= 10) if (x % 10 == 0) z++;
        return z;
    }

    static int countOddZeros(int[] nums) {
        int count = 0;
        for (int v : nums) if (zeros(v) % 2 == 1) count++;
        return count;
    }
}
```

**Trap**: forgetting that `0` itself has one zero; `Math.abs(Integer.MIN_VALUE)` overflows as `int` — that's why we widen to `long`.

### M2. Maximum digital root — Easy · LOW · Reported

**Source**: [LC-7354481](https://leetcode.com/discuss/post/7354481/visa-codesignal-17112025-failed-by-node-pndhb/) · Nov 2025 · CodeSignal Q2: keep adding the digits of each number until one digit is left; return the maximum. `[123, 456, 789, 101]` → roots `6, 6, 6, 2` → `6`.

```java
class DigitalRoot {
    static int root(long n) {
        while (n > 9) {
            long s = 0;
            for (; n > 0; n /= 10) s += n % 10;
            n = s;
        }
        return (int) n;
    }

    static int maxRoot(int[] readings) {
        int best = 0;
        for (int r : readings) best = Math.max(best, root(r));
        return best;
    }
}
```

**Bonus line for the interviewer**: for `n > 0`, digital root = `1 + (n − 1) % 9` (O(1)).

### M3. Grade from marks — Easy · LOW · Reported

**Source**: [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) · Nov 2025 · Bangalore · "90–100 → A, 80–<90 → B, 70–<80 → C, and so on". Lower bands were not reported; we assume D for 60s and F below.

```java
class GradeCalculator {
    static char grade(int marks) {
        if (marks >= 90) return 'A';
        if (marks >= 80) return 'B';
        if (marks >= 70) return 'C';
        if (marks >= 60) return 'D';
        return 'F';
    }
}
```

**Trap**: boundary values — test 90, 89, 80, 79 yourself before submitting.

### M4. Hollow square pattern — Easy · LOW · Reported

**Source**: [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) · Oct 2025 · intern on-campus · Q1: for `n = 4` print a square of `*` with an empty inside (the poster showed the inside as `-`; use whatever character the statement says).

```java
import java.util.ArrayList;
import java.util.List;

class HollowSquare {
    static List<String> draw(int n, char inside) {
        List<String> rows = new ArrayList<>();
        for (int r = 0; r < n; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < n; c++) {
                boolean border = r == 0 || r == n - 1 || c == 0 || c == n - 1;
                sb.append(border ? '*' : inside);
            }
            rows.add(sb.toString());
        }
        return rows;
    }

    public static void main(String[] args) {
        draw(4, '-').forEach(System.out::println);
    }
}
```

```text
****
*--*
*--*
****
```

---

⚡ **Quick revision**: "smallest free index" → min-heap / TreeSet · "closest value among allowed ones" → TreeSet `floor`/`ceiling` · "next bigger in sorted" → upper bound · merge intervals → sweep for gaps · histogram → monotonic stack.

Next: [OA 3/3 — Matrix · Graphs · Trees/Trie · DP · File/Data processing →](03-oa-matrix-graph-dp-simulation.md)
