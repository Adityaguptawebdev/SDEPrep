# 02 — DSA in the Interview (SP & DSE)

**Legend:** 📌 **Reported** (source ID → [sources.md](sources.md)) · 🧪 **Practice**. All Java below was tested against brute force on random inputs.

## How the interview coding works (2025–2026 reports)

- It usually **starts with a mini coding round**: **2 problems on the Wingspan portal, solve any 1 in 15–45 min**, often while the interviewer watches [LC-7204748, LC-7233197, LC-8498620, LC-8531964, LC-8564309].
- **DSE drives:** often **pen-and-paper** basics, with the most optimal approach expected. Example: move zeros + second max in 15 minutes for 10 candidates at once [LC-8178418].
- Then you **explain your code** and its time/space complexity, and get 1–3 more live problems [LC-6567886, LC-8512263].
- **SP L2/L3** get a second part: harder DSA (LRU, coin change, merging without extra space), plus LLD/HLD [LC-8218681, LC-8433956].
- Panels **repeat the same questions** across candidates on the same day [LC-8218681, LC-8278419].

| Level | Problems reported in interviews |
|---|---|
| **Basics (DSE and every L1 panel)** | second largest, move zeros, palindrome, reverse string, binary search, bubble/quick/merge sort, Fibonacci, climbing stairs, swap without a temp variable, stock buy-sell, char frequency, equilibrium index, transpose |
| **Medium** | jump game, coin change, product except self, longest substring without repeats, string rotation, all subsequences, count subsets with sum, celebrity, swap nodes in pairs, sort words, count close equal pairs, assign cookies (parity), alternating binary string |
| **Hard (SP L2/L3)** | LRU / LFU cache, merge two sorted arrays without extra space, remove invalid parentheses, closest palindrome |

---

## A. Basics — 📌 asked again and again

**Second largest element** — 📌 DSE/HWI, May 2026 [LC-8278419, LC-8178418]. One pass: when a new max comes, the old max becomes the second.

```java
static int secondLargest(int[] a) {
    long first = Long.MIN_VALUE, second = Long.MIN_VALUE;
    for (int x : a) {
        if (x > first) { second = first; first = x; }
        else if (x < first && x > second) second = x;      // skip duplicates of the max
    }
    return second == Long.MIN_VALUE ? -1 : (int) second;    // -1 = no second distinct value
}
```
**Time** O(n) · **Space** O(1)

**Move all zeros to the end** — 📌 DSE, May 2026 [LC-8178418] · [LC 283](https://leetcode.com/problems/move-zeroes/)

```java
static void moveZeroes(int[] a) {
    int w = 0;
    for (int x : a) if (x != 0) a[w++] = x;   // keep non-zeros in order
    while (w < a.length) a[w++] = 0;
}
```
**Time** O(n) · **Space** O(1)

**Palindrome check · reverse a string** — 📌 HWI DSE, May 2026 [LC-8278419]. Two pointers from both ends.

```java
static boolean isPalindrome(String s) {
    for (int i = 0, j = s.length() - 1; i < j; i++, j--)
        if (s.charAt(i) != s.charAt(j)) return false;
    return true;
}

static String reverse(String s) {
    char[] c = s.toCharArray();
    for (int i = 0, j = c.length - 1; i < j; i++, j--) { char t = c[i]; c[i] = c[j]; c[j] = t; }
    return new String(c);
}
```

**Binary search** — 📌 [LC-8278419] · [LC 704](https://leetcode.com/problems/binary-search/)

```java
static int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;          // no overflow
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
```
**Time** O(log n)

**Bubble sort · quick sort** — 📌 [LC-8278125, LC-8278419]. Merge sort was also asked [LC-7233305].

```java
static void bubbleSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < a.length - 1 - i; j++)
            if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; swapped = true; }
        if (!swapped) break;                    // already sorted → O(n) best case
    }
}

static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;                  // Lomuto partition
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;      // pivot to its final place
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}
```

| | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | yes |
| Quick | O(n log n) | O(n log n) | O(n²) (sorted input + last pivot) | O(log n) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |

**Fibonacci: recursive, then its complexity** — 📌 SP, Mar 2025 [LC-6567886]; also [LC-8278125, LC-8278419]

```java
static long fibRecursive(int n) {               // Time O(2^n), Space O(n) call stack
    return n < 2 ? n : fibRecursive(n - 1) + fibRecursive(n - 2);
}

static long fib(int n) {                         // Time O(n), Space O(1)
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long c = a + b; a = b; b = c; }
    return a;
}
```
Climbing Stairs ([LC 70](https://leetcode.com/problems/climbing-stairs/), 📌 [LC-7233305]) is the same recurrence: `ways(n) = ways(n-1) + ways(n-2)`.

**Swap two numbers without a third variable ("different ways")** — 📌 [LC-7233305, LC-8441416, LC-8278419]

```java
// 1) arithmetic: a = a + b; b = a - b; a = a - b;   (can overflow)
// 2) XOR:        a = a ^ b; b = a ^ b; a = a ^ b;   (no overflow)
// 3) one line:   b = a + b - (a = b);
```

**Best time to buy and sell stock** — 📌 DSE onsite, May 2026 [LC-8278125] · [LC 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

```java
static int maxProfit(int[] p) {
    int minSoFar = Integer.MAX_VALUE, best = 0;
    for (int x : p) {
        minSoFar = Math.min(minSoFar, x);          // cheapest buy so far
        best = Math.max(best, x - minSoFar);       // sell today
    }
    return best;
}
```

**Character frequency** (`aaabbbcc → a=3, b=3, c=2`) · **equilibrium indices** (left sum = right sum) · **transpose** — 📌 SP, Sep 2025 [LCO-1, LCO-2]

```java
static String charFrequency(String s) {
    Map<Character, Integer> f = new LinkedHashMap<>();       // keeps first-seen order
    for (char c : s.toCharArray()) f.merge(c, 1, Integer::sum);
    StringBuilder sb = new StringBuilder();
    for (Map.Entry<Character, Integer> e : f.entrySet()) {
        if (sb.length() > 0) sb.append(", ");
        sb.append(e.getKey()).append('=').append(e.getValue());
    }
    return sb.toString();
}

static List<Integer> equilibriumIndices(int[] a) {
    long total = 0, left = 0;
    for (int x : a) total += x;
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < a.length; i++) {
        if (left == total - left - a[i]) res.add(i);         // a[i] itself is excluded
        left += a[i];
    }
    return res;
}

static int[][] transpose(int[][] m) {
    int[][] t = new int[m[0].length][m.length];
    for (int i = 0; i < m.length; i++)
        for (int j = 0; j < m[0].length; j++) t[j][i] = m[i][j];
    return t;
}
```

---

## B. Medium — 📌 reported

**Jump Game** — 📌 HWI L2/L3, Apr–May 2026 [LC-8100039, LC-8218681] · [LC 55](https://leetcode.com/problems/jump-game/). Keep the farthest reachable index.

```java
static boolean canJump(int[] a) {
    int far = 0;
    for (int i = 0; i < a.length; i++) {
        if (i > far) return false;                 // stuck before i
        far = Math.max(far, i + a[i]);
    }
    return true;
}
```
**Time** O(n) · **Space** O(1)

**Coin change (min coins, unlimited supply)** — 📌 SP L3, Jan 2026 [LC-8433956] · [LC 322](https://leetcode.com/problems/coin-change/)

```java
static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);                   // "infinity"
    dp[0] = 0;
    for (int s = 1; s <= amount; s++)
        for (int c : coins)
            if (c <= s) dp[s] = Math.min(dp[s], dp[s - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
```
**Time** O(amount·coins) · **Space** O(amount)

**Product of array except self** · **longest substring without repeating characters** — 📌 DSE/SP on-campus, Sep 2026 [LC-8512263] · [LC 238](https://leetcode.com/problems/product-of-array-except-self/) · [LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

```java
static int[] productExceptSelf(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    res[0] = 1;
    for (int i = 1; i < n; i++) res[i] = res[i - 1] * a[i - 1];   // product of the left side
    int right = 1;
    for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= a[i]; } // times the right side
    return res;
}

static int lengthOfLongestSubstring(String s) {
    int[] last = new int[128];                     // last index + 1 of each char
    int best = 0;
    for (int l = 0, r = 0; r < s.length(); r++) {
        l = Math.max(l, last[s.charAt(r)]);        // jump past the repeat
        best = Math.max(best, r - l + 1);
        last[s.charAt(r)] = r + 1;
    }
    return best;
}
```
Both O(n). No division in the first one.

**Does S1 appear in any rotation of S?** (`S = "absdsdf", S1 = "fab"` → yes) — 📌 [LC-8512263]. Every rotation of S is inside `S + S`. Related: [LC 796](https://leetcode.com/problems/rotate-string/).

```java
static boolean inSomeRotation(String s, String s1) {
    return s1.length() <= s.length() && (s + s).contains(s1);
}
```

**All subsequences of "abc"** (brute force O(2ⁿ)) — 📌 [LC-8512263] · [LC 78](https://leetcode.com/problems/subsets/)

```java
static List<String> allSubsequences(String s) {
    List<String> out = new ArrayList<>();
    build(s, 0, new StringBuilder(), out);
    return out;                                    // "abc" → abc, ab, ac, a, bc, b, c, ""
}

static void build(String s, int i, StringBuilder cur, List<String> out) {
    if (i == s.length()) { out.add(cur.toString()); return; }
    cur.append(s.charAt(i));
    build(s, i + 1, cur, out);                     // take s[i]
    cur.deleteCharAt(cur.length() - 1);
    build(s, i + 1, cur, out);                     // skip s[i]
}
```
**Time** O(n·2ⁿ)

**Count subsequences whose sum = target** — 📌 HWI SP interview coding round [LC-8406888]. The candidate's brute force got TLE; the DP is the 0/1-knapsack count.

```java
static long countSubsetsWithSum(int[] a, int target) {   // a[i] >= 0
    long[] dp = new long[target + 1];
    dp[0] = 1;                                     // empty subset
    for (int x : a)
        for (int s = target; s >= x; s--)          // backwards → each item used once
            dp[s] += dp[s - x];
    return dp[target];
}
```
**Time** O(n·target) · **Space** O(target). Add `% MOD` if the problem asks.

**Celebrity problem, using a stack** — 📌 SP, Feb 2025 [LC-6367311] · [LC 277 🔒](https://leetcode.com/problems/find-the-celebrity/). A celebrity knows nobody and everybody knows them.

```java
static int findCelebrity(boolean[][] knows) {
    int n = knows.length;
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) st.push(i);
    while (st.size() > 1) {
        int a = st.pop(), b = st.pop();
        st.push(knows[a][b] ? b : a);              // if a knows b, a is not the celebrity
    }
    int c = st.pop();
    for (int i = 0; i < n; i++)                    // verify the last candidate
        if (i != c && (knows[c][i] || !knows[i][c])) return -1;
    return c;
}
```
**Time** O(n) · **Space** O(n). The two-pointer version needs O(1) space.

**Swap nodes in pairs** — 📌 HWI L3, May 2026 [LC-8218681] · [LC 24](https://leetcode.com/problems/swap-nodes-in-pairs/)

```java
static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

static ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0), prev = dummy;
    dummy.next = head;
    while (prev.next != null && prev.next.next != null) {
        ListNode a = prev.next, b = a.next;
        a.next = b.next;                           // prev → b → a → rest
        b.next = a;
        prev.next = b;
        prev = a;
    }
    return dummy.next;
}
```

**Sort words by length, then alphabetically** — 📌 SP L3, Jan 2026 [LC-8433956]

```java
static String sortWords(String sentence) {
    String[] w = sentence.trim().split("\\s+");
    Arrays.sort(w, Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
    return String.join(" ", w);                    // "the cat is on a mat" → "a is on cat mat the"
}
```

**Count pairs `i < j` with `code[i] == code[j]` and `j − i ≤ k`** · **Assign Cookies where greed and cookie must have the same parity** — 📌 on-campus interview, Sep 2026 [LC-8512263] · [LC 455](https://leetcode.com/problems/assign-cookies/)

```java
static long countClosePairs(int[] code, int k) {
    Map<Integer, Integer> window = new HashMap<>();   // values in the last k positions
    long pairs = 0;
    for (int j = 0; j < code.length; j++) {
        if (j - k - 1 >= 0) window.merge(code[j - k - 1], -1, Integer::sum); // slide out
        pairs += window.getOrDefault(code[j], 0);
        window.merge(code[j], 1, Integer::sum);
    }
    return pairs;
}

static int assignCookiesSameParity(int[] greed, int[] cookies) {
    int total = 0;
    for (int p = 0; p < 2; p++) {                     // odd and even groups never mix
        final int par = p;
        int[] g = Arrays.stream(greed).filter(x -> x % 2 == par).sorted().toArray();
        int[] s = Arrays.stream(cookies).filter(x -> x % 2 == par).sorted().toArray();
        int i = 0;
        for (int j = 0; j < s.length && i < g.length; j++)
            if (s[j] >= g[i]) i++;                    // smallest cookie that satisfies the least greedy child
        total += i;
    }
    return total;
}
```
Both O(n log n) or better.

**Min flips to make a binary string alternating, no two flipped positions adjacent** — 📌 on-campus SE/DSE interview, Oct 2026 [LC-8564309]. Try both targets `0101…` and `1010…`. A target works only if no two mismatched positions are next to each other. (Without the rule: [LC 1758](https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string/).)

```java
static int minFlipsNoAdjacent(String s) {
    int best = Integer.MAX_VALUE;
    for (int start = 0; start < 2; start++) {
        int flips = 0, prevBad = -2;
        boolean ok = true;
        for (int i = 0; i < s.length(); i++) {
            int want = (start + i) % 2;
            if (s.charAt(i) - '0' != want) {
                if (prevBad == i - 1) { ok = false; break; }   // two neighbours would need flipping
                prevBad = i;
                flips++;
            }
        }
        if (ok) best = Math.min(best, flips);
    }
    return best == Integer.MAX_VALUE ? -1 : best;
}
```

**Max gap = (max product of two even-index elements) − (min product of two odd-index elements)** — 📌 [LC-8564309]. After sorting, the max product is `max(first two, last two)`, and the min product is `min(first two, last two, first × last)`.

```java
static long maxGap(int[] a) {                          // needs n >= 4
    List<Long> even = new ArrayList<>(), odd = new ArrayList<>();
    for (int i = 0; i < a.length; i++) (i % 2 == 0 ? even : odd).add((long) a[i]);
    Collections.sort(even);
    Collections.sort(odd);
    int e = even.size(), o = odd.size();
    long maxEven = Math.max(even.get(0) * even.get(1), even.get(e - 1) * even.get(e - 2));
    long minOdd = Math.min(Math.min(odd.get(0) * odd.get(1), odd.get(o - 1) * odd.get(o - 2)),
                           odd.get(0) * odd.get(o - 1));
    return maxEven - minOdd;
}
```

**Dijkstra (and when to use Bellman-Ford)** — 📌 SP, Feb 2025 and HWI SP 2025: "positive weights → which algorithm? negative weights?" [LC-6367311, LC-8406888]

```java
static long[] dijkstra(List<int[]>[] adj, int src) {   // adj[u] = {v, w}, w >= 0
    long[] dist = new long[adj.length];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(x -> x[1]));
    pq.add(new long[]{src, 0});
    while (!pq.isEmpty()) {
        long[] cur = pq.poll();
        int u = (int) cur[0];
        if (cur[1] > dist[u]) continue;                 // stale entry
        for (int[] e : adj[u])
            if (dist[u] + e[1] < dist[e[0]]) {
                dist[e[0]] = dist[u] + e[1];
                pq.add(new long[]{e[0], dist[e[0]]});
            }
    }
    return dist;
}
```

| Graph | Use | Time |
|---|---|---|
| unweighted | BFS | O(V + E) |
| weights ≥ 0 | **Dijkstra** (min-heap) | O((V + E) log V) |
| negative weights, or "at most K edges" | **Bellman-Ford** (relax all edges V−1 times; one more pass finds a negative cycle) | O(V·E) |
| all pairs, small V | Floyd-Warshall | O(V³) |

Dijkstra fails with negative edges because a node, once finalised, could later get a cheaper path.

---

## C. Hard — 📌 SP L2/L3

**LRU Cache** — 📌 HWI L3, May 2026 [LC-8218681] · [LC 146](https://leetcode.com/problems/lru-cache/). Use a **HashMap** for O(1) lookup and a **doubly linked list** for recency (most recent at the head).

```java
static class LRUCache {
    class Node { int key, val; Node prev, next; Node(int k, int v) { key = k; val = v; } }
    private final int cap;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);   // sentinels

    LRUCache(int capacity) { cap = capacity; head.next = tail; tail.prev = head; }

    int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        remove(n); addFront(n);                          // mark as most recent
        return n.val;
    }

    void put(int key, int value) {
        Node n = map.get(key);
        if (n != null) { n.val = value; remove(n); addFront(n); return; }
        if (map.size() == cap) { Node lru = tail.prev; remove(lru); map.remove(lru.key); }
        n = new Node(key, value);
        map.put(key, n);
        addFront(n);
    }

    private void remove(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFront(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }
}
```
`get` and `put` are O(1). **LFU Cache** was asked in an SP interview too [LC-6436250] → practise [LC 460](https://leetcode.com/problems/lfu-cache/) (HashMap key→node + HashMap freq→list + `minFreq`).

**Merge two sorted arrays so that all of `a` < all of `b`, both sorted, no extra space** — 📌 SP L3 interview, Jan 2026 ("Hard") [LC-8433956]. Use the **gap (Shell) method** on the two arrays treated as one.

```java
static void mergeNoExtraSpace(int[] a, int[] b) {
    int n = a.length, len = n + b.length;
    for (int gap = (len + 1) / 2; gap > 0; gap = gap == 1 ? 0 : (gap + 1) / 2)
        for (int i = 0; i + gap < len; i++) {
            int j = i + gap;
            int x = i < n ? a[i] : b[i - n], y = j < n ? a[j] : b[j - n];
            if (x > y) {                                 // swap across the virtual array
                if (i < n) a[i] = y; else b[i - n] = y;
                if (j < n) a[j] = x; else b[j - n] = x;
            }
        }
}
```
**Time** O((n+m) log(n+m)) · **Space** O(1)

**Remove invalid parentheses (all minimal answers)** — 📌 SP interview, Feb 2025 [LC-6414393] · [LC 301](https://leetcode.com/problems/remove-invalid-parentheses/). **BFS by number of removals**: the first level with any valid string is the answer.

```java
static List<String> removeInvalidParentheses(String s) {
    List<String> res = new ArrayList<>();
    Set<String> seen = new HashSet<>(List.of(s));
    Queue<String> q = new ArrayDeque<>(List.of(s));
    while (!q.isEmpty() && res.isEmpty()) {
        for (int size = q.size(); size > 0; size--) {    // one BFS level = one more removal
            String cur = q.poll();
            if (isValidParens(cur)) { res.add(cur); continue; }
            for (int i = 0; i < cur.length(); i++) {
                char c = cur.charAt(i);
                if (c != '(' && c != ')') continue;
                String next = cur.substring(0, i) + cur.substring(i + 1);
                if (seen.add(next)) q.add(next);
            }
        }
    }
    return res;                                          // "()())()" → ["(())()", "()()()"]
}

static boolean isValidParens(String s) {
    int bal = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') bal++;
        else if (c == ')' && --bal < 0) return false;
    }
    return bal == 0;
}
```

**Closest palindrome (+ the next strictly greater palindrome)** — 📌 HWI L3 [LC-8218681] → practise [LC 564](https://leetcode.com/problems/find-the-closest-palindrome/). Candidates: mirror the left half, mirror (left half ± 1), plus `10…01` and `9…9`.

🧪 **Also practise** (reported only by topic: trees, BST, DP, LIS/LCS [LC-6436250, LC-7233197, LC-7233305]): [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) · [LIS](https://leetcode.com/problems/longest-increasing-subsequence/) · [LCS](https://leetcode.com/problems/longest-common-subsequence/) · [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) · [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) · [Find Pivot Index](https://leetcode.com/problems/find-pivot-index/)

Next: [03-sql-dbms.md](03-sql-dbms.md)
