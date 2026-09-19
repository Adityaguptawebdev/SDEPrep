# 4. Merge Intervals

> **Standard definition**: A technique for problems involving overlapping ranges — sort intervals by start time, then merge any two intervals whose ranges overlap.

**Ek line mein**: Intervals ko **start time se sort** karo, phir ek-ek karke
dekho — agar current interval, **pichhle wale se overlap** karta hai, unhe
**merge** kar do; nahi toh alag rehne do.

**Trick yaad rakhne ki**: *"Calendar meetings — pehle time ke hisaab se
sort karo, phir dekho konse meetings ek dusre se takra rahe hain (overlap),
unhe ek badi meeting mein combine kar do."*

**Kab use karo**: Scheduling, booking systems, ya kisi bhi problem jisme
**ranges/intervals overlap** karte hain.

## Code example — Merge Intervals

```java
public int[][] merge(int[][] intervals) {
    // 🔑 Step 1: start time ke hisaab se sort karo — bina isके overlap check hi galat hoga
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] last = result.get(result.size() - 1);
        int[] current = intervals[i];

        if (current[0] <= last[1]) {
            // 🔑 overlap hai — last interval ka end, bada wala rakho
            last[1] = Math.max(last[1], current[1]);
        } else {
            // overlap nahi hai — alag interval ki tarah add karo
            result.add(current);
        }
    }
    return result.toArray(new int[result.size()][]);
}
```

**Line by line samjho**: Sort karne ke baad, sirf **result ke last interval**
se compare karna kaafi hai (kyunki sorted hai, koi purana interval isse aage
nahi ja sakta). `current[0] <= last[1]` ka matlab hai naye interval ki
shuruaat, purane ke khatam hone se pehle hi ho gayi — **overlap** hai, merge
karo. Warna, naya alag interval hai.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Merge Intervals | Medium | [leetcode.com/problems/merge-intervals](https://leetcode.com/problems/merge-intervals/) |
| 2 | Insert Interval | Medium | [leetcode.com/problems/insert-interval](https://leetcode.com/problems/insert-interval/) |
| 3 | Non-overlapping Intervals | Medium | [leetcode.com/problems/non-overlapping-intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| 4 | Minimum Number of Arrows to Burst Balloons | Medium | [leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) |
| 5 | Interval List Intersections | Medium | [leetcode.com/problems/interval-list-intersections](https://leetcode.com/problems/interval-list-intersections/) |

Agla: [05-cyclic-sort.md](05-cyclic-sort.md)
