# Visa OA Mock Sets — Answer Key

> Attempt [the mocks](04-mock-oa-sets.md) first. Every solution below is compiled and checked against a brute-force version on random inputs.

| Mock Q | Mirrors this reported pattern | Key idea |
|---|---|---|
| 1.1 | odd zeros / digital root (Q1 maths) | digit loop on `abs` |
| 1.2 | bus `"HH:MM"` questions | minutes + split at midnight |
| 1.3 | memory allocator, state array | array simulation, leftmost fit |
| 1.4 | "subarrays with at least k …" | window + two monotonic deques |
| 2.1 | length-3 / string transforms | run scanning |
| 2.2 | entity updates, house segments | HashMap + "first time it happens" |
| 2.3 | bubble explosion, falling figure | rotate index math + per-column gravity |
| 2.4 | graph Q4 | Dijkstra |
| 3.1 | vowel-ends, triples | per-word check |
| 3.2 | e-scooters, refueling stops | greedy farthest reach |
| 3.3 | newspaper / text justification | a line-builder helper |
| 3.4 | meeting slots + DP | sort by end + binary search DP |

---

## Mock 1

### 1.1 Even digit sums

```java
class EvenDigitSums {
    static int count(int[] amounts) {
        int count = 0;
        for (int a : amounts) {
            long v = Math.abs((long) a);                 // long: abs(Integer.MIN_VALUE) overflows int
            int sum = 0;
            for (; v > 0; v /= 10) sum += (int) (v % 10);
            if (sum % 2 == 0) count++;
        }
        return count;
    }
}
```
O(n · digits), O(1). **Trap**: negatives and `0`.

### 1.2 Shift overlap

Think of the day as a circle of 1440 minutes. A night shift is really **two** intervals: `[start, 1440)` and `[0, end)`.

```
 A: 22:00 → 02:00   = [1320,1440) ∪ [0,120)
 B: 01:00 → 06:00   = [60,360)
 overlap            = [60,120) → 60 minutes
```

```java
import java.util.ArrayList;
import java.util.List;

class ShiftOverlap {
    static int minutes(String t) {
        return Integer.parseInt(t.substring(0, 2)) * 60 + Integer.parseInt(t.substring(3));
    }

    static List<int[]> pieces(String[] shift) {             // half-open [from, to) pieces within one day
        int s = minutes(shift[0]), e = minutes(shift[1]);
        List<int[]> out = new ArrayList<>();
        if (s < e) out.add(new int[]{s, e});
        else { out.add(new int[]{s, 1440}); out.add(new int[]{0, e}); }
        return out;
    }

    static int overlap(String[] a, String[] b) {
        int total = 0;
        for (int[] x : pieces(a))
            for (int[] y : pieces(b))
                total += Math.max(0, Math.min(x[1], y[1]) - Math.max(x[0], y[0]));
        return total;
    }
}
```
O(1). **Trap**: treating `"02:00"` < `"22:00"` as a normal interval.

### 1.3 Seat booking

```java
import java.util.ArrayList;
import java.util.List;

class SeatBooking {
    static List<Integer> process(int n, String[] operations) {
        int[] seat = new int[n];                              // 0 = free, else booking id
        int nextId = 1;
        List<Integer> out = new ArrayList<>();
        for (String op : operations) {
            String[] p = op.split(" ");
            int value = Integer.parseInt(p[1]);
            if (p[0].equals("BOOK")) {
                int run = 0, start = -1;
                for (int i = 0; i < n && start == -1; i++) {
                    run = (seat[i] == 0) ? run + 1 : 0;
                    if (run == value) start = i - value + 1;  // leftmost fit
                }
                if (start != -1) {
                    for (int i = start; i < start + value; i++) seat[i] = nextId;
                    nextId++;
                }
                out.add(start);
            } else {                                          // CANCEL id
                int freed = 0;
                for (int i = 0; i < n; i++) if (seat[i] == value) { seat[i] = 0; freed++; }
                out.add(freed);
            }
        }
        return out;
    }
}
```
O(n) per operation. **Trap**: using a new id for a failed booking.

### 1.4 Stable price windows

For each right end, keep the smallest left such that `max − min ≤ limit`. Two deques give window max and min in O(1).

```java
import java.util.ArrayDeque;
import java.util.Deque;

class StableWindows {
    static long count(int[] p, long limit) {
        Deque<Integer> maxQ = new ArrayDeque<>(), minQ = new ArrayDeque<>();   // indices
        long total = 0;
        int left = 0;
        for (int right = 0; right < p.length; right++) {
            while (!maxQ.isEmpty() && p[maxQ.peekLast()] <= p[right]) maxQ.pollLast();
            while (!minQ.isEmpty() && p[minQ.peekLast()] >= p[right]) minQ.pollLast();
            maxQ.addLast(right);
            minQ.addLast(right);
            while ((long) p[maxQ.peekFirst()] - p[minQ.peekFirst()] > limit) {   // shrink
                left++;
                if (maxQ.peekFirst() < left) maxQ.pollFirst();
                if (minQ.peekFirst() < left) minQ.pollFirst();
            }
            total += right - left + 1;                        // windows ending at right
        }
        return total;
    }
}
```
O(n), O(n). Similar: [LC 1438](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/), [LC 2762](https://leetcode.com/problems/continuous-subarrays/).

---

## Mock 2

### 2.1 Run-length code

```java
class RunLength {
    static String encode(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
            sb.append(s.charAt(i)).append(j - i);
            i = j;
        }
        return sb.toString();
    }
}
```
O(n).

### 2.2 Big spenders

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

class BigSpenders {
    static List<String> find(String[] logs, long threshold) {
        Map<String, Long> total = new HashMap<>();
        Set<String> reported = new HashSet<>();
        List<String> order = new ArrayList<>();
        for (String log : logs) {
            String[] p = log.split(" ");
            long now = total.merge(p[0], Long.parseLong(p[1]), Long::sum);
            if (now >= threshold && reported.add(p[0])) order.add(p[0]);   // first time only
        }
        return order;
    }
}
```
O(n). **Trap**: sorting by final total (wrong order) or adding a user twice.

### 2.3 Rotate and drop

Clockwise rotation: `rotated[i][j] = grid[m − 1 − j][i]`. Then per column, scan from the bottom and keep a "landing row".

```java
class RotateAndDrop {
    static char[][] solve(char[][] grid) {
        int m = grid.length, n = grid[0].length;
        char[][] r = new char[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) r[i][j] = grid[m - 1 - j][i];
        for (int col = 0; col < m; col++) {
            int land = n - 1;                                 // lowest free row for the next box
            for (int row = n - 1; row >= 0; row--) {
                if (r[row][col] == '*') land = row - 1;       // pillar: boxes stop above it
                else if (r[row][col] == '#') {
                    r[row][col] = '.';
                    r[land][col] = '#';
                    land--;
                }
            }
        }
        return r;
    }
}
```
O(m·n). Similar: [LC 1861 Rotating the Box](https://leetcode.com/problems/rotating-the-box/).

### 2.4 Payment network delay (Dijkstra)

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

class NetworkDelay {
    static int time(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
        pq.add(new int[]{k, 0});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            if (cur[1] > dist[cur[0]]) continue;             // stale entry
            for (int[] e : adj.get(cur[0])) {
                int nd = cur[1] + e[1];
                if (nd < dist[e[0]]) { dist[e[0]] = nd; pq.add(new int[]{e[0], nd}); }
            }
        }
        int worst = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            worst = Math.max(worst, dist[i]);
        }
        return worst;
    }
}
```
O(E log V). Similar: [LC 743](https://leetcode.com/problems/network-delay-time/).

---

## Mock 3

### 3.1 Same-letter words

```java
class SameLetterWords {
    static int count(String sentence) {
        if (sentence.isEmpty()) return 0;
        int count = 0;
        for (String w : sentence.split(" ")) {
            if (Character.toLowerCase(w.charAt(0)) == Character.toLowerCase(w.charAt(w.length() - 1))) count++;
        }
        return count;
    }
}
```

### 3.2 Charging stops

From your current position, drive to the **farthest** station you can reach; charge there. Repeat.

```java
class ChargingStops {
    static int minCharges(int destination, int range, int[] stations) {
        int pos = 0, charges = 0, i = 0;
        while (pos + range < destination) {
            int best = -1;
            while (i < stations.length && stations[i] <= pos + range) best = stations[i++];
            if (best == -1 || best <= pos) return -1;         // no station ahead within range
            pos = best;
            charges++;
        }
        return charges;
    }
}
```
O(n). **Why greedy is safe**: going to the farthest reachable station never gives you fewer options later.

### 3.3 Receipt formatter

```java
import java.util.ArrayList;
import java.util.List;

class ReceiptFormatter {
    static String money(long paise) {
        return (paise / 100) + "." + String.format("%02d", paise % 100);
    }

    static void addLines(List<String> out, String name, String price, int w) {
        String rest = name;
        while (rest.length() > w) {                          // full-width pieces of a long name
            out.add(rest.substring(0, w));
            rest = rest.substring(w);
        }
        if (rest.length() + 1 + price.length() <= w) {       // last piece + dots + price
            out.add(rest + ".".repeat(w - rest.length() - price.length()) + price);
        } else {                                             // doesn't fit together
            out.add(rest + " ".repeat(w - rest.length()));
            out.add(".".repeat(w - price.length()) + price);
        }
    }

    static List<String> format(String[][] items, int w) {
        List<String> out = new ArrayList<>();
        long total = 0;
        for (String[] item : items) {
            long paise = Long.parseLong(item[1]);
            total += paise;
            addLines(out, item[0], money(paise), w);
        }
        out.add("-".repeat(w));
        addLines(out, "TOTAL", money(total), w);
        return out;
    }

    public static void main(String[] args) {
        format(new String[][]{{"Tea", "1250"}, {"Masala Dosa Special", "9900"}}, 16).forEach(System.out::println);
    }
}
```

```text
Tea........12.50
Masala Dosa Spec
ial........99.00
----------------
TOTAL.....111.50
```

### 3.4 Max-profit bookings

Sort by end time. `dp[i]` = best profit using the first `i` bookings. For booking `i`, binary-search the last booking that ends `≤ start`.

```java
import java.util.Arrays;

class MaxProfitBookings {
    static long maxProfit(int[][] bookings) {
        int[][] b = bookings.clone();
        Arrays.sort(b, (x, y) -> Integer.compare(x[1], y[1]));
        int n = b.length;
        long[] dp = new long[n + 1];                          // dp[i]: first i bookings (by end)
        for (int i = 1; i <= n; i++) {
            int start = b[i - 1][0];
            int lo = 0, hi = i - 1;                           // count of bookings with end <= start
            while (lo < hi) {
                int mid = (lo + hi + 1) >>> 1;
                if (b[mid - 1][1] <= start) lo = mid; else hi = mid - 1;
            }
            dp[i] = Math.max(dp[i - 1], dp[lo] + b[i - 1][2]);   // skip it, or take it
        }
        return dp[n];
    }
}
```
O(n log n). Similar: [LC 1235](https://leetcode.com/problems/maximum-profit-in-job-scheduling/).

Back to [OA overview](README.md) · Next: [03 — DSA for technical rounds →](../03-dsa/README.md)
