# 02 — Technical Round DSA: Meeting Rooms I · II · III + Coupon for Category

The intern technical round was "mostly DSA" [LC-6116156]. **Meeting Rooms II** was the real intern OA question (minimum cores, see [01 Q1](01-online-assessment.md#1-minimum-cores-meeting-rooms-ii-variant)). **Coupon for Category** is Wayfair's most repeated live-coding question.

| Problem | LeetCode | Why it's here |
|---|---|---|
| Meeting Rooms I | [252](https://leetcode.com/problems/meeting-rooms/) · Easy · 🔒 | warm-up for II |
| Meeting Rooms II | [253](https://leetcode.com/problems/meeting-rooms-ii/) · Medium · 🔒 | asked in the intern OA |
| Meeting Rooms III | [2402](https://leetcode.com/problems/meeting-rooms-iii/) · Hard | the hard follow-up |
| Coupon for Category | Wayfair-only | 13 Wayfair reports (2023–2026, mostly SE-II/III) |

🔒 = LeetCode Premium. The statement and examples are written below, so you can practise without it.

> 💡 **Hinglish:** Interval questions ka pehla step hamesha same hai: **start time se sort karo**. Phir socho, "abhi kaunsa room sabse pehle khaali hoga?" Wahi heap ka top hai.

---

## Meeting Rooms I — can one person attend all meetings?

Given meetings `[start, end]`, return `true` if no two overlap. A meeting ending at `10` and one starting at `10` do **not** overlap.

```text
[[0,30],[5,10],[15,20]]  → false
[[7,10],[2,4]]           → true
```

**Idea:** sort by start. If any meeting starts before the previous one ends → `false`.

```java
import java.util.Arrays;

class MeetingRooms1 {
    static boolean canAttendAll(int[][] intervals) {
        int[][] a = intervals.clone();
        Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));
        for (int i = 1; i < a.length; i++) {
            if (a[i][0] < a[i - 1][1]) return false;    // starts before the previous one ends
        }
        return true;
    }
}
```

**Time** O(n log n) · **Space** O(n) for the copy

---

## Meeting Rooms II — minimum number of rooms

Same input. Return the minimum number of rooms. `end == start` can share a room.

```text
[[0,30],[5,10],[15,20]]  → 2
[[7,10],[2,4]]           → 1
```

**Idea:** sort by start. Keep a **min-heap of end times** of busy rooms. If the earliest-ending room is already free (`end ≤ start`), reuse it. Push the new end time. The heap size at the end = rooms needed.

```
time   0    5    10   15   20        30
room1  [=========== 0–30 =============]
room2       [5–10]    [15–20]            ← room2 reused after 10
```

```java
import java.util.Arrays;
import java.util.PriorityQueue;

class MeetingRooms2 {
    static int minRooms(int[][] intervals) {
        int[][] a = intervals.clone();
        Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));
        PriorityQueue<Integer> ends = new PriorityQueue<>();       // end times of rooms in use
        for (int[] m : a) {
            if (!ends.isEmpty() && ends.peek() <= m[0]) ends.poll(); // earliest room is free → reuse it
            ends.add(m[1]);
        }
        return ends.size();
    }
}
```

**Time** O(n log n) · **Space** O(n)
**Wayfair twist:** in the intern OA, `end == start` counted as an **overlap**, so change `<=` to `<`.

---

## Meeting Rooms III — which room held the most meetings? (LC 2402, Hard)

There are `n` rooms (`0 … n−1`), and the meetings have unique start times. Each meeting takes the **lowest-numbered free room**. If no room is free, it **waits** for the room that frees first (lowest number on a tie) and keeps its duration. Return the room with the most meetings (lowest number on a tie).

```text
n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]          → 0
n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]   → 1
```

**Idea:** sort by start and use two heaps:

- `free`: free room numbers (smallest first)
- `busy`: `{endTime, room}` (earliest end first, then smallest room)

Before each meeting, move rooms that have finished into `free`. If `free` is empty, take the first room from `busy` and delay the meeting.

```java
import java.util.Arrays;
import java.util.PriorityQueue;

class MeetingRooms3 {
    static int mostBooked(int n, int[][] meetings) {
        int[][] a = meetings.clone();
        Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));
        PriorityQueue<Integer> free = new PriorityQueue<>();
        for (int r = 0; r < n; r++) free.add(r);
        PriorityQueue<long[]> busy = new PriorityQueue<>(            // {endTime, room}
                (x, y) -> x[0] != y[0] ? Long.compare(x[0], y[0]) : Long.compare(x[1], y[1]));
        int[] count = new int[n];

        for (int[] m : a) {
            long start = m[0], duration = m[1] - m[0];
            while (!busy.isEmpty() && busy.peek()[0] <= start) free.add((int) busy.poll()[1]);
            int room;
            long end;
            if (!free.isEmpty()) {
                room = free.poll();
                end = start + duration;
            } else {                                  // every room busy → wait for the first one
                long[] first = busy.poll();
                room = (int) first[1];
                end = first[0] + duration;            // delayed start, same duration
            }
            busy.add(new long[]{end, room});
            count[room]++;
        }

        int best = 0;
        for (int r = 1; r < n; r++) if (count[r] > count[best]) best = r;
        return best;
    }
}
```

**Time** O(m log m + m log n) · **Space** O(n). Use `long`, because delays can push end times past the `int` range.

---

## Coupon for Category ⭐ Wayfair favourite

**Source:** [LC-8351645](https://leetcode.com/discuss/post/8351645/wayfair-interview-experience-reject-by-s-1z7g/) (Jun 2026, **Exact** example) + 12 more reports (2023–2025).
You get **coupons** (category → coupon) and **categories** (category → parent; the root's parent is `null`). `getCouponForCategory(name)` returns the category's own coupon if it has one, otherwise the **nearest parent's** coupon, otherwise `null`.

```text
Coupons:    Comforter Sets → "Comforters Sale", Bedding → "Savings on Bedding", Bed & Bath → "Low price for Bed & Bath"
Categories: Comforter Sets → Bedding → Bed & Bath → null
            Soap Dispensers → Bathroom Accessories → Bed & Bath
            Toy Organizers → Baby And Kids → null

getCouponForCategory("Comforter Sets")  → "Comforters Sale"           (own coupon)
getCouponForCategory("Soap Dispensers") → "Low price for Bed & Bath"  (found 2 levels up)
getCouponForCategory("Toy Organizers")  → null
```

```java
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

class CouponFinder {
    private final Map<String, String> couponOf = new HashMap<>();   // category → coupon
    private final Map<String, String> parentOf = new HashMap<>();   // category → parent (null = root)

    CouponFinder(String[][] coupons, String[][] categories) {
        for (String[] c : coupons) couponOf.put(c[0], c[1]);
        for (String[] c : categories) parentOf.put(c[0], c[1]);
    }

    String getCouponForCategory(String category) {
        Set<String> seen = new HashSet<>();                         // stops an infinite loop if the data has a cycle
        while (category != null && seen.add(category)) {
            String coupon = couponOf.get(category);
            if (coupon != null) return coupon;
            category = parentOf.get(category);                      // go one level up
        }
        return null;
    }
}
```

**Time** O(depth) per query · **Space** O(categories)

**Reported follow-ups:**

- A category can have **several coupons with dates**: pick by the rule the interviewer gives (e.g. the latest `DateModified` that is not in the future).
- **Many queries:** cache the answer per category (memoization).
