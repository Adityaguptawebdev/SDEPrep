# 4. Merge Intervals

> Pehle ye aane chahiye: [Sorting](../00-syllabus/01-basics/07-sorting.md), [Arrays](../00-syllabus/01-basics/02-arrays.md), [Greedy](../00-syllabus/04-paradigms/18-greedy.md)

> **Standard definition**: A technique for problems involving overlapping ranges — sort intervals by start time, then merge any two intervals whose ranges overlap.

**Ek line mein**: Intervals ko **sahi cheez ke hisaab se sort** karo (aksar **start**), phir **ek-ek karke** dekho — pichhle se **overlap** kare toh merge / count / skip, warna naya group.

**Trick yaad rakhne ki**: *"Calendar meetings"* — pehle time ke hisaab se line mein lagao, phir dekho kaunsi meetings ek-doosre se **takra** rahi hain. Takraayi toh ek badi meeting bana do; nahi takraayi toh alag rehne do.

```
A = [1, 4]    B = [3, 6]      →  overlap hai  (B.start 3 ≤ A.end 4)       merge = [1, 6]
A = [1, 4]    B = [5, 6]      →  overlap NAHI (B.start 5 > A.end 4)       alag-alag
A = [1, 4]    B = [4, 6]      →  chhoo rahe hain (touch)  →  problem ke hisaab se: merge ya alag
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Data (start, end) ke JODE ke roop mein hai: meetings, bookings, ranges, [l, r]
✅ Sawaal "overlap", "merge", "conflict", "kitne rooms/arrows/hataane padenge", "common time" jaisa hai
```

| Sawaal ki bhasha | Variation |
|---|---|
| "overlapping intervals **merge** karo" | ① **Merge** |
| "sorted non-overlapping list mein **ek naya interval daalo**" | ② **Insert** |
| "do interval lists ka **common (intersection)** hissa" | ③ **Intersection** |
| "**sab meetings attend** ho sakti hain?", "**minimum rooms**", "**max ek saath kitne**" (car pooling) | ④ **Conflict / Max overlap** |
| "**kam se kam kitne hatao** taaki overlap na ho", "**minimum arrows/points** jo sabko chhoo le" | ⑤ **Greedy (END se sort)** |
| "jo interval **kisi doosre ke andar** hai use hatao" | ⑥ **Covered (tie-break sort)** |

### ❌ Kab NAHI
- Data **intervals nahi** (points) — [Two Pointers](02-two-pointers.md) / [Binary Search](09-binary-search.md).
- **Weighted** interval scheduling (har interval ka profit hai, max profit chahiye) → **DP**, greedy nahi.

---

## 2. Sort kis pe karein — sabse pehla faisla

```
                 Kya intervals PEHLE SE sorted (aur non-overlapping) diye hain?
                     ┌─────────────────────┴─────────────────────┐
                   HAAN                                          NAHI  →  SORT karna padega
                     │                                            ┌────────────┴───────────────┐
        ② INSERT / ③ INTERSECTION                     Kya "jitne zyada rakh sako / min removals"?
        (sort ki zarurat nahi,                          ┌───────────┴────────────┐
         do pointers / 3 phases)                       HAAN                     NAHI
                                                         │                        │
                                              ⑤ END se sort              ① MERGE / ⑥ COVERED → START se sort
                                              (jo jaldi khatam)          ④ ROOMS → starts aur ends ALAG sort
```

| Problem | Sort kis pe | Kyun |
|---|---|---|
| Merge, Covered | **start** (Covered mein tie: end **bada pehle**) | Left se right chalte hue sirf pichhle se compare |
| Max non-overlapping / min arrows | **end** | Jo **jaldi khatam** hota hai wo baaki ke liye zyada jagah chhodta hai |
| Min meeting rooms | **starts** aur **ends** alag arrays | Kitne meetings ek saath chal rahe hain, ye ginna hai |
| Insert, Intersection | **nahi** | Pehle se sorted |

## 3. Code likhne ki recipe — 3 sawaal

```
1. SORT     →  kis pe? (start / end / nahi)      ← upar ki table
2. OVERLAP  →  do intervals kab overlap? (a.start ≤ b.end ?  ya  <  ?)     ← problem se puchho: "chhoona" overlap hai?
3. ACTION   →  overlap pe kya? (end badhao = merge  /  count++  /  skip  /  room badhao)
```

**Do intervals ka gyaan (yaad kar lo)** — `a = [a1, a2]`, `b = [b1, b2]`, `a1 ≤ b1` (sorted hai):

```
overlap hai  ⟺  b1 ≤ a2                      (chhoone ko overlap maano toh ≤,  nahi maano toh <)
merge        =  [a1, max(a2, b2)]              ← end hamesha MAX lo (b, a ke andar bhi ho sakta hai)
intersection =  [max(a1, b1), min(a2, b2)]     ← valid tabhi jab  max(start) ≤ min(end)
```

---

## 4. ① Merge Overlapping Intervals

**Template**:

```
sort(intervals, start se)
result = [ intervals[0] ]
for cur in intervals[1..]:
    last = result ka aakhri
    if cur.start <= last.end:         # overlap
        last.end = max(last.end, cur.end)
    else:
        result.add(cur)
```

```
[[1,3], [2,6], [8,10], [15,18]]    (pehle se sorted)

last=[1,3]  cur=[2,6]  : 2 ≤ 3 overlap  → last=[1,6]
last=[1,6]  cur=[8,10] : 8 > 6 alag     → add [8,10]
last=[8,10] cur=[15,18]: 15 > 10 alag   → add [15,18]

answer: [[1,6], [8,10], [15,18]]
```

```java
public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));     // 🔑 start se sort (a[0]-b[0] nahi: overflow)
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = result.get(result.size() - 1);
        int[] cur = intervals[i];
        if (cur[0] <= last[1]) {
            last[1] = Math.max(last[1], cur[1]);                        // overlap → end BADA wala rakho
        } else {
            result.add(cur);                                            // alag → naya group
        }
    }
    return result.toArray(new int[result.size()][]);
}
```

**Kyun sirf `last` se compare?** Sort ke baad har naya interval **start ke hisaab se pichhlon se aage** hai. Agar wo `last` se overlap nahi karta, toh usse pehle ke kisi se bhi nahi karega.

---

## 5. ② Insert Interval (pehle se sorted, non-overlapping list)

**3 phase** (sort nahi, ek pass):

```
newInterval = [4, 8]           intervals = [[1,2], [3,5], [6,7], [8,10], [12,16]]

PHASE 1: jo poori tarah PEHLE hain  (interval.end < new.start)   →  seedha result mein    [1,2]
PHASE 2: jo new se OVERLAP karte hain (interval.start ≤ new.end) →  new ko phailao        [3,5],[6,7],[8,10]
              new = [min(starts), max(ends)] = [3, 10]
              new ko result mein daalo
PHASE 3: jo poori tarah BAAD mein hain                          →  seedha result mein    [12,16]

answer: [[1,2], [3,10], [12,16]]
```

```java
public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0, n = intervals.length;
    while (i < n && intervals[i][1] < newInterval[0]) {         // phase 1: new se poori tarah pehle
        result.add(intervals[i++]);
    }
    while (i < n && intervals[i][0] <= newInterval[1]) {        // phase 2: new se overlap
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.add(newInterval);                                     // 🔑 merge hua new interval ab daalo
    while (i < n) {                                              // phase 3: baaki poore baad wale
        result.add(intervals[i++]);
    }
    return result.toArray(new int[result.size()][]);
}
```

---

## 6. ③ Intersection of Two Interval Lists

Dono lists **sorted aur khud mein non-overlapping**. **Two pointers** `i`, `j`: common hissa `[max(starts), min(ends)]` (agar valid ho). Phir **jo interval jaldi khatam hota hai use aage badhao** (wo agle se shayad hi overlap kare).

```
A = [[0,2], [5,10], [13,23], [24,25]]     B = [[1,5], [8,12], [15,24], [25,26]]

i=0 j=0: [0,2] & [1,5]   → [max(0,1), min(2,5)] = [1,2] ✅    A[0] jaldi khatam → i++
i=1 j=0: [5,10] & [1,5]  → [5,5] ✅ (chhoona)                  B[0] jaldi khatam (5<10) → j++
i=1 j=1: [5,10] & [8,12] → [8,10] ✅                            A[1] jaldi khatam → i++
...
```

```java
public int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> result = new ArrayList<>();
    int i = 0, j = 0;
    while (i < A.length && j < B.length) {
        int start = Math.max(A[i][0], B[j][0]);
        int end = Math.min(A[i][1], B[j][1]);
        if (start <= end) result.add(new int[]{start, end});      // 🔑 valid intersection
        if (A[i][1] < B[j][1]) i++;                                // jo jaldi khatam hua use aage badhao
        else j++;
    }
    return result.toArray(new int[result.size()][]);
}
```

---

## 7. ④ Conflict aur Max Overlap (meetings, rooms, car pooling)

### Can attend all meetings? (sort by start, pichhle se compare)

```java
// Meeting Rooms (Premium): koi do meetings overlap toh nahi?  (chhoona overlap NAHI maana gaya)
public boolean canAttendMeetings(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;    // agli meeting pichhli khatam hone se pehle shuru
    }
    return true;
}
```

### Minimum Meeting Rooms — starts aur ends **alag-alag** sort

**Trick**: *"Har meeting ke shuru hone pe dekho: koi purani meeting khatam hui kya? Ho gayi toh uska room reuse, nahi toh naya room."*

```
intervals = [[0,30], [5,10], [15,20]]

starts = [0, 5, 15]      ends = [10, 20, 30]      (dono alag sort)

start 0 : 0  < ends[0]=10 → koi khatam nahi → rooms = 1
start 5 : 5  < 10         → rooms = 2
start 15: 15 ≥ 10         → ek meeting khatam hui → room reuse  (endPtr++)  rooms = 2

answer 2
```

```java
// Meeting Rooms II (Premium)
public int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);
    int rooms = 0, endPtr = 0;
    for (int i = 0; i < n; i++) {
        if (starts[i] < ends[endPtr]) rooms++;      // 🔑 abhi tak koi meeting khatam nahi → naya room
        else endPtr++;                                // ek khatam → uska room reuse
    }
    return rooms;
}
```

### Car Pooling — difference array (sweep line)

`trips[i] = {passengers, from, to}`. **Pickup pe `+`, drop pe `−`** — phir left se right jodte chalo; kabhi capacity se zyada hua toh ❌.

```java
public boolean carPooling(int[][] trips, int capacity) {
    int[] delta = new int[1001];                        // stops 0..1000
    for (int[] t : trips) {
        delta[t[1]] += t[0];                             // from pe log chadhe
        delta[t[2]] -= t[0];                             // to pe log utre (to pe already utar gaye)
    }
    int current = 0;
    for (int d : delta) {
        current += d;                                    // 🔑 abhi gaadi mein kitne log
        if (current > capacity) return false;
    }
    return true;
}
```

Ye "**+ start, − end, running sum**" trick hi **Max Overlap** ka general tareeka hai (My Calendar, Meeting Rooms — sab isi se).

---

## 8. ⑤ Greedy: END se sort (kam se kam hatao / minimum arrows)

**Idea**: *"Jo interval sabse jaldi khatam hota hai use pakdo — wo baaki sabke liye zyada jagah chhodta hai."*

```
Non-overlapping Intervals:   [[1,2], [2,3], [3,4], [1,3]]     END se sort: [1,2] [2,3] [1,3] [3,4]

lastEnd = -∞
[1,2]: start 1 ≥ -∞      → rakho    lastEnd = 2
[2,3]: start 2 ≥ 2       → rakho    lastEnd = 3      (chhoona theek)
[1,3]: start 1 <  3      → HATAO (overlap)
[3,4]: start 3 ≥ 3       → rakho    lastEnd = 4
rakhe 3 / kul 4  →  hataye = 1
```

```java
// Non-overlapping Intervals — kam se kam kitne hatao
public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));    // 🔑 END se sort
    int kept = 0;
    int lastEnd = Integer.MIN_VALUE;
    for (int[] in : intervals) {
        if (in[0] >= lastEnd) {                                        // pichhle rakhe hue ke baad shuru → rakho
            kept++;
            lastEnd = in[1];
        }                                                              // warna overlap → hata diya
    }
    return intervals.length - kept;
}

// Minimum Number of Arrows to Burst Balloons — ek teer x pe chhodo toh saare intervals jinme x hai phoot jaate hain
public int findMinArrowShots(int[][] points) {
    if (points.length == 0) return 0;
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));       // END se sort
    int arrows = 1;
    int arrowAt = points[0][1];                                        // pehla teer pehle interval ke END pe
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > arrowAt) {                                   // 🔑 ye interval teer se bahar → naya teer
            arrows++;
            arrowAt = points[i][1];
        }
    }
    return arrows;
}
```

**Dono ka rishta**: *"Min arrows" = "max non-overlapping intervals"* ka hi roop hai — dono mein **END se sort**, pehle pakka wala rakho. Farak sirf **chhoona (`>=` vs `>`)**: Non-overlapping mein `[1,2]` aur `[2,3]` alag maane jaate hain (`>=`), balloons mein ek teer `x = 2` dono ko phod deta hai (isliye naya teer tabhi jab `start > arrowAt`).

---

## 9. ⑥ Remove Covered Intervals (sort ka tie-break)

**Problem**: Jo interval kisi doosre ke **poori tarah andar** hai (`[1,4]` ke andar `[2,3]`) use hatao. Bacha hua count?

**Sort**: **start badhta**, aur **start barabar ho toh end GHATTA** (bada interval pehle). Kyun? Taaki chhota, bade ke andar dikhe.

```
[[1,4], [3,6], [2,8]]   sort (start ↑, end ↓) : [1,4] [2,8] [3,6]

maxEnd = -∞
[1,4]: end 4 > maxEnd → alag  count 1   maxEnd = 4
[2,8]: end 8 > 4      → alag  count 2   maxEnd = 8
[3,6]: end 6 ≤ 8      → [2,8] ke andar (covered) → skip
answer 2
```

```java
public int removeCoveredIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] != b[0]
            ? Integer.compare(a[0], b[0])                    // start badhta
            : Integer.compare(b[1], a[1]));                   // 🔑 start barabar → end GHATTA (bada pehle)
    int count = 0, maxEnd = Integer.MIN_VALUE;
    for (int[] in : intervals) {
        if (in[1] > maxEnd) {                                 // ab tak ke sabse door end se aage jata hai → covered nahi
            count++;
            maxEnd = in[1];
        }
    }
    return count;
}
```

---

## 10. Sab ek nazar mein

| Variation | Sort | Overlap check | Overlap pe action |
|---|---|---|---|
| ① Merge | start | `cur.start ≤ last.end` | `last.end = max(...)` |
| ② Insert | — (pehle se sorted) | `iv.end < new.start` (pehle) / `iv.start ≤ new.end` (overlap) | new ko phailao |
| ③ Intersection | — | `max(start) ≤ min(end)` | `[max start, min end]` add; jo jaldi khatam, use aage |
| ④ Attend all | start | `cur.start < last.end` | `false` |
| ④ Min rooms | starts, ends alag | `start < ends[endPtr]` | `rooms++` warna `endPtr++` |
| ④ Car pooling | — (difference array) | running sum `> capacity` | `false` |
| ⑤ Greedy select | **end** | `start ≥ lastEnd` → rakho | warna hata do / naya arrow |
| ⑥ Covered | start ↑, end ↓ | `end ≤ maxEnd` | covered → skip |

## Common galtiyan

- **Galat cheez pe sort** — Merge ke liye start, Greedy select ke liye **end**.
- **Merge mein end ko `max` na lena** — `[1,10]` aur `[2,3]` mein end `10` hi rehna chahiye (`3` nahi).
- **`<` vs `<=`** — chhoona overlap hai ya nahi, ye sawaal se pucho (`[1,2]`,`[2,3]` merge hote hain, par meetings ke liye alag rooms nahi lagte).
- **Comparator mein `a[0] - b[0]`** — overflow. **`Integer.compare`**.
- **Insert Interval mein `newInterval` ko result mein daalna bhoolna** (phase 2 ke baad).
- **Covered mein tie-break na lagana** — same start wale mein chhota pehle aa gaya toh bade ko "naya" maan lega.
- **Sort ke baad original array badalna** (agar original chahiye toh copy).

> 💡 **Interview mein bolne wali line**: *"Intervals ko start se sort karunga taaki overlap sirf pichhle wale se check karna pade. Overlap mila toh end ka max lekar merge; warna naya group. Sort ki wajah se O(n log n), baaki ek pass."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Summary Ranges | Consecutive ranges banana | Easy | [leetcode.com/problems/summary-ranges](https://leetcode.com/problems/summary-ranges/) |
| 2 | Merge Intervals | ① Merge | Medium | [leetcode.com/problems/merge-intervals](https://leetcode.com/problems/merge-intervals/) |
| 3 | Insert Interval | ② Insert | Medium | [leetcode.com/problems/insert-interval](https://leetcode.com/problems/insert-interval/) |
| 4 | Interval List Intersections | ③ Intersection | Medium | [leetcode.com/problems/interval-list-intersections](https://leetcode.com/problems/interval-list-intersections/) |
| 5 | Meeting Rooms 🔒 (Premium) | ④ Conflict | Easy | [leetcode.com/problems/meeting-rooms](https://leetcode.com/problems/meeting-rooms/) |
| 6 | Meeting Rooms II 🔒 (Premium) | ④ Min rooms | Medium | [leetcode.com/problems/meeting-rooms-ii](https://leetcode.com/problems/meeting-rooms-ii/) |
| 7 | Car Pooling | ④ Difference array | Medium | [leetcode.com/problems/car-pooling](https://leetcode.com/problems/car-pooling/) |
| 8 | My Calendar I | ④ Conflict check | Medium | [leetcode.com/problems/my-calendar-i](https://leetcode.com/problems/my-calendar-i/) |
| 9 | Non-overlapping Intervals | ⑤ Greedy (end) | Medium | [leetcode.com/problems/non-overlapping-intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| 10 | Minimum Number of Arrows to Burst Balloons | ⑤ Greedy (end) | Medium | [leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) |
| 11 | Remove Covered Intervals | ⑥ Covered | Medium | [leetcode.com/problems/remove-covered-intervals](https://leetcode.com/problems/remove-covered-intervals/) |
| 12 | Video Stitching | Greedy cover | Medium | [leetcode.com/problems/video-stitching](https://leetcode.com/problems/video-stitching/) |
| 13 | Employee Free Time 🔒 (Premium) | ① + heap / sweep | Hard | [leetcode.com/problems/employee-free-time](https://leetcode.com/problems/employee-free-time/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Sort kis pe (ya nahi)? Overlap ki shart `<` ya `<=`? Overlap pe kya karna hai?"* — phir code.

Agla: [05-cyclic-sort.md](05-cyclic-sort.md)
