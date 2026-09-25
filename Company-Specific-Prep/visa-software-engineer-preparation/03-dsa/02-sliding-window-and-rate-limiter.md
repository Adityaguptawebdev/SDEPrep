# DSA 2/8 — Sliding Window · Rate Limiting IPs · Two Pointers

**Easy analogy — toll plaza CCTV**: Camera sirf **pichhle 10 minute** ki gaadiyan yaad rakhti hai. Nayi gaadi aayi → purani (10 min se pehle wali) list se hata do → ab count dekho. Yahi sliding window hai: **aage se add, peeche se remove**, poora record dobara mat gino.

| # | Problem | Reporter level | Freq | Status |
|---|---|---|---|---|
| 1 | Rate-limit IPs from a log file (x requests / 10 min) + DDoS + "log is GBs" | **EC, 10 months** | LOW (but a flagship Visa-flavoured question) | Reconstructed |
| 2 | Longest Substring Without Repeating Characters | EC + Senior + Staff | **HIGH** (3) | Exact |
| 3 | Sliding Window Maximum | NCG + ? | MEDIUM (2) | Exact |
| 4 | Trapping Rain Water ("sand and mountains") | ? | LOW | Close |
| 5 | Minimum Window Substring | Staff | LOW | Exact |

---

## 1. Rate-limit IPs from a log file

| Field | Details |
|---|---|
| **Reported problem** | "Given a log file with timestamps and IPs, rate-limit IPs making more than *x* requests in a 10-minute window." Started with "What is a DDoS attack? How to prevent it?" Approach discussed: sliding window. Follow-up: "What if the log file is in GBs?" → external sorting. — **Reconstructed** (log format and output format not given). |
| **Source** | [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) · May 2025 · **Software Engineer, 10 months experience, Bangalore — Selected** |
| **Round** | Technical round 1 (after ~30 min of resume/Kafka discussion) |
| **Difficulty** | Medium (+ design follow-ups) |
| **Pattern** | Sliding window per key: `HashMap<ip, Deque<timestamp>>` |
| **Frequency** | LOW as an exact question — but the same idea appears as an HLD question ([LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), Senior, "design rate limiter") → see [07-system-design/01-rate-limiter.md](../07-system-design/01-rate-limiter.md) |

**Clarify first (say these out loud)**
1. Line format? We assume `"<epochSeconds> <ip>"`, sorted by time.
2. Output? (a) the set of IPs that **ever** exceeded x requests in any 10-minute window, or (b) for each request, allow/block like a live limiter. We do both.
3. Window = `(t − 600, t]` seconds. Do blocked requests count? For detection we count every request; for the live limiter we count only allowed ones.

**Brute force**: for every request, count that IP's requests in the previous 600 s by scanning → O(n²).
**Optimal**: one pass; per IP keep a deque of recent timestamps; pop from the front while older than the window. Each timestamp enters and leaves once → O(n).

```
 x = 3, window = 600s          deque for 10.0.0.1
 t=0     10.0.0.1  → [0]
 t=100   10.0.0.1  → [0,100]
 t=500   10.0.0.1  → [0,100,500]
 t=550   10.0.0.1  → [0,100,500,550]   size 4 > 3 → FLAG 10.0.0.1
 t=700   10.0.0.1  → drop 0 (≤ 700−600=100? 0 ≤ 100 yes), drop 100 → [500,550,700]
```

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

class IpRateLimit {
    // (a) Offline: which IPs made more than maxRequests in any window of windowSec seconds?
    static Set<String> abusiveIps(BufferedReader log, int maxRequests, long windowSec) throws IOException {
        Map<String, Deque<Long>> recent = new HashMap<>();
        Set<String> flagged = new LinkedHashSet<>();
        String line;
        while ((line = log.readLine()) != null) {                    // streams: one line in memory
            String[] parts = line.trim().split("\\s+");
            if (parts.length != 2) continue;                         // skip malformed lines
            long ts;
            try { ts = Long.parseLong(parts[0]); } catch (NumberFormatException e) { continue; }
            Deque<Long> q = recent.computeIfAbsent(parts[1], k -> new ArrayDeque<>());
            while (!q.isEmpty() && q.peekFirst() <= ts - windowSec) q.pollFirst();   // left the window
            q.addLast(ts);
            if (q.size() > maxRequests) flagged.add(parts[1]);
        }
        return flagged;
    }

    // (b) Online: a live limiter — allow at most maxRequests per IP in the last windowSec
    private final int maxRequests;
    private final long windowSec;
    private final Map<String, Deque<Long>> allowed = new HashMap<>();

    IpRateLimit(int maxRequests, long windowSec) { this.maxRequests = maxRequests; this.windowSec = windowSec; }

    boolean allow(String ip, long ts) {
        Deque<Long> q = allowed.computeIfAbsent(ip, k -> new ArrayDeque<>());
        while (!q.isEmpty() && q.peekFirst() <= ts - windowSec) q.pollFirst();
        if (q.size() >= maxRequests) return false;                   // over the limit → block
        q.addLast(ts);
        return true;
    }

    public static void main(String[] args) throws IOException {
        String log = "0 10.0.0.1\n100 10.0.0.1\n120 10.0.0.2\n500 10.0.0.1\nbad line\n550 10.0.0.1\n700 10.0.0.2";
        System.out.println(abusiveIps(new BufferedReader(new StringReader(log)), 3, 600));
        IpRateLimit limiter = new IpRateLimit(2, 600);
        System.out.println(limiter.allow("1.1.1.1", 0) + " " + limiter.allow("1.1.1.1", 10)
                + " " + limiter.allow("1.1.1.1", 20) + " " + limiter.allow("1.1.1.1", 601));
    }
}
```

```text
[10.0.0.1]
true true false true
```

**Time**: O(n) for the whole log (each timestamp added and removed once). **Space**: O(active IPs × x) — only timestamps inside the window are kept.

**Follow-up 1 — "What is a DDoS attack? How to prevent it?"**
A **Distributed Denial of Service** attack floods a service from many machines so real users can't get through. Layers of defence (say 3–4, not all):

| Layer | What it does |
|---|---|
| CDN / edge (e.g. a cloud WAF) | absorbs volumetric traffic far from your servers |
| Rate limiting per IP / API key / user | this exact problem — token bucket or sliding window at the API gateway |
| WAF rules, IP reputation, geo-blocking | drop known-bad traffic early |
| SYN cookies, connection limits | protect against network-level floods |
| Autoscaling + graceful degradation | survive what gets through; shed non-critical features |
| CAPTCHA / proof-of-work on suspicious clients | slow down bots |

Note: per-IP limits alone fail against *distributed* attacks (many IPs, few requests each) — mention global limits and anomaly detection.

**Follow-up 2 — "The log file is in GBs"** (the candidate answered *external sorting*)

```
 20 GB log, 2 GB RAM
 ┌──────────┐  split + sort each chunk (by ip, then time)   ┌─────────┐
 │ big log  │ ──────────────────────────────────────────►   │ run1..10│  sorted files on disk
 └──────────┘                                               └────┬────┘
                          k-way merge with a min-heap           │
                          (one pointer per run)                  ▼
                    stream of (ip, time) in order → sliding window per ip, O(1) memory per ip
```

- If the file is **already sorted by time**, you don't need to sort at all — one streaming pass (the code above) needs memory only for the IPs active in the last 10 minutes.
- If not sorted: **external merge sort** (sort chunks that fit in RAM, write runs, k-way merge with a heap) — or **hash-partition** by IP into N files (`hash(ip) % N`) so each file fits in memory, then process files one by one.
- Many machines: MapReduce/Spark — map by IP, reduce with the window logic.
A working external-sort example is in [DSA 8/8](08-file-and-log-processing.md).

**Other follow-ups**: fixed window vs sliding log vs token bucket (memory vs accuracy) · many servers → shared store (Redis sorted set / counters) · what response to send (HTTP 429 + `Retry-After`).
**🗣️ Interview mein aise bolo**: "Har IP ke liye ek deque rakhta hoon jisme sirf pichhle 10 minute ke timestamps hain. Naya request aaya → purane pop, naya push, size check. Har timestamp ek baar aata hai, ek baar jaata hai — O(n). File GBs mein ho toh agar time-sorted hai toh streaming kaafi hai, warna external sort ya IP pe hash-partition."

---

## 2. Longest Substring Without Repeating Characters

| Field | Details |
|---|---|
| **Reported problem** | [LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — **Exact** in all three |
| **Source** | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (Jun 2025, **SDE-1, 1.10 YOE**, R1) · [LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/) (Jun 2026, Staff, "longest subarray without repeating characters") · [LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/) (Mar 2022, Senior, "max subarray without repeated characters") |
| **Round** | Technical round 1 (EC) |
| **Difficulty** | Medium |
| **Pattern** | Variable sliding window + last-seen index map |
| **Frequency** | **HIGH** (3 reports, across levels) |

**Brute force**: all substrings + a set check → O(n³) (or O(n²) with an incremental set).
**Optimal**: keep window `[left, right]` with no duplicates. When `s[right]` was seen inside the window, jump `left` to `lastSeen + 1`.

```
 s = "abcabcbb"
 r=0 a  window "a"      best 1
 r=1 b  window "ab"     best 2
 r=2 c  window "abc"    best 3
 r=3 a  seen at 0 → left=1  window "bca"
 r=4 b  seen at 1 → left=2  window "cab"
 ...                          answer 3
```

```java
import java.util.HashMap;
import java.util.Map;

class LongestUniqueSubstring {
    static int length(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int best = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer prev = lastSeen.get(c);
            if (prev != null && prev >= left) left = prev + 1;   // duplicate inside window → jump
            lastSeen.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

**Time**: O(n). **Space**: O(min(n, alphabet)).
**Follow-ups**: return the substring itself · at most k distinct characters ([LC 340](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) 🔒 premium / [LC 904](https://leetcode.com/problems/fruit-into-baskets/)) · array of integers instead of a string (same code with `Map<Integer,Integer>`).
**🗣️ Interview mein aise bolo**: "Window ke andar duplicate aate hi left ko us character ke last index + 1 pe jump kar deta hoon. `prev >= left` check zaroori hai, warna window ke bahar wala purana index left ko peeche kheench dega."

---

## 3. Sliding Window Maximum

| Field | Details |
|---|---|
| **Reported problem** | [LC 239](https://leetcode.com/problems/sliding-window-maximum/) — **Exact** |
| **Source** | [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) (Feb 2025, on-campus NCG, round 3) · [LC-6536057](https://leetcode.com/discuss/post/6536057/visa-interview-experience-ghosted-by-rec-2xye/) (Mar 2025, level not stated, interview 1) |
| **Round** | Technical |
| **Difficulty** | Hard (LeetCode label) |
| **Pattern** | Monotonic deque (decreasing) of indices |
| **Frequency** | MEDIUM (2 reports) |

**Brute force**: max of every window → O(n·k). A max-heap gives O(n log n).
**Optimal**: deque keeps indices of **useful** candidates in decreasing value order. A new bigger value makes smaller ones useless forever — pop them from the back. Pop the front when it leaves the window.

```
 nums = [1,3,-1,-3,5,3,6,7], k = 3
 i=2  deque(values) [3,-1]        max 3
 i=3  [3,-1,-3]                   max 3
 i=4  5 kills -3,-1,3 → [5]       max 5
 i=5  [5,3]                       max 5
 i=6  6 kills 3,5 → [6]           max 6
 i=7  7 kills 6 → [7]             max 7     → [3,3,5,5,6,7]
```

```java
import java.util.ArrayDeque;
import java.util.Deque;

class SlidingMax {
    static int[] maxOfWindows(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[Math.max(0, n - k + 1)];
        Deque<Integer> dq = new ArrayDeque<>();                    // indices, values decreasing
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();      // left the window
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();   // useless now
            dq.addLast(i);
            if (i >= k - 1) out[i - k + 1] = nums[dq.peekFirst()];
        }
        return out;
    }
}
```

**Time**: O(n) (each index pushed/popped once). **Space**: O(k).
**Follow-ups**: minimum instead of maximum · max − min ≤ limit windows ([mock 1.4](../02-online-assessment/05-mock-oa-answer-key.md#14-stable-price-windows)) · streaming data (same deque, no array).
**🗣️ Interview mein aise bolo**: "Deque mein sirf wahi log rakhta hoon jo kabhi max ban sakte hain. Naya bada aaya toh chhote wale kabhi max nahi banenge — unhe pop. Har element ek baar aata, ek baar jaata — O(n)."

---

## 4. Trapping Rain Water ("sand and mountains")

| Field | Details |
|---|---|
| **Reported problem** | "Trapping rainwater (rephrased as sand and mountains)" — **Close** ([LC 42](https://leetcode.com/problems/trapping-rain-water/)) |
| **Source** | [LC-6536057](https://leetcode.com/discuss/post/6536057/visa-interview-experience-ghosted-by-rec-2xye/) · Mar 2025 · level not stated · solved both questions of the round |
| **Round** | Interview 1 (DSA) |
| **Difficulty** | Hard |
| **Pattern** | Two pointers with running `leftMax` / `rightMax` |
| **Frequency** | LOW |

**Brute force**: for each bar, water = `min(max left, max right) − height` → O(n²). Prefix/suffix max arrays → O(n) time, O(n) space.
**Optimal**: two pointers. The side with the **smaller** max decides the water level on that side, so move that pointer.

```
 height 0 1 0 2 1 0 1 3 2 1 2 1
 water  . . 1 . 1 2 1 . . 1 . .   total 6
```

```java
class TrappingRain {
    static long trap(int[] h) {
        int left = 0, right = h.length - 1;
        int leftMax = 0, rightMax = 0;
        long water = 0;
        while (left < right) {
            if (h[left] < h[right]) {                      // left side is the limiting side
                leftMax = Math.max(leftMax, h[left]);
                water += leftMax - h[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, h[right]);
                water += rightMax - h[right];
                right--;
            }
        }
        return water;
    }
}
```

**Time**: O(n). **Space**: O(1).
**Follow-ups**: 2D version ([LC 407](https://leetcode.com/problems/trapping-rain-water-ii/), heap) · container with most water ([LC 11](https://leetcode.com/problems/container-with-most-water/)).
**🗣️ Interview mein aise bolo**: "Har position pe paani = dono taraf ke max ka minimum − height. Jis taraf ka max chhota hai wahi limit hai, toh us pointer ko aage badhata hoon — O(1) space."

---

## 5. Minimum Window Substring *(Staff level — optional)*

| Field | Details |
|---|---|
| **Reported problem** | "Minimum Window Substring (LeetCode Hard) — Solved" — **Exact** ([LC 76](https://leetcode.com/problems/minimum-window-substring/)) |
| **Source** | [LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/) · Sep 2025 · **Staff** (7+ YOE), Visa cybersecurity team |
| **Round** | DSA round | **Difficulty**: Hard | **Pattern**: variable window + "missing count" | **Frequency**: LOW |

```java
class MinWindow {
    static String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), bestLen = Integer.MAX_VALUE, bestStart = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) missing--;             // this char was still needed
            while (missing == 0) {                                   // window covers t → shrink
                if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
                if (++need[s.charAt(left++)] > 0) missing++;         // removed a needed char
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}
```

**Time**: O(|s| + |t|). **Space**: O(1) (fixed alphabet).

---

⚡ **Quick revision**: key → deque of times (rate limit) · jump left to lastSeen+1 (unique chars) · decreasing deque (window max) · move the side with the smaller max (rain water) · GB logs → stream if sorted, else external sort / hash-partition.

Next: [DSA 3/8 — Binary search →](03-binary-search.md)
