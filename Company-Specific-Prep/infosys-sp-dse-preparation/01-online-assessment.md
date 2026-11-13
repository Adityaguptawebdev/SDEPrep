# 01 — Online / Onsite Coding Assessment (SP & DSE)

**Legend:** 📌 **Reported** = a candidate said this was asked (source ID → [sources.md](sources.md)) · 🧪 **Practice** = not reported, added for preparation.
Statements are **reconstructed by candidates from memory**, so wording and constraints can differ in your slot. Every Java solution below was tested against a brute-force version on random inputs.

## Pattern seen in 2025–2026

| Drive | Format | Shortlist rule reported |
|---|---|---|
| Off-campus virtual OA (HackerRank / Wingspan) | **3 questions, 3 hours** (e.g. Jul 2025, 1 Aug 2026: Easy, Easy, Medium) [LC-6958976, LC-8434114] | solved 1 + partial was enough for some [LC-6984942] |
| Onsite / on-campus OA (Wingspan) | **4 questions: Easy, Medium, Hard, Complex — solve any 3**, 3 hours, 12 hidden tests each [LC-7492648, LC-8460608, LC-8531964] | "**70%** needed" shown on the portal (off-campus onsite, Sep 2026) [LC-8503419]; some campuses shortlisted anyone with **≥ 1 full solve** [LC-8512263, LC-8531964] |
| HackWithInfy | R1: 3 Q / 3 h · R2: 4 Q / 3 h (Easy → Complex) [LC-8161351, LC-8161532] | role (DSE / SP L1 / L2 / L3) decided by score + interview [LC-8573384, LC-8356446] |

- You **can't go back** to an earlier question in some drives [LC-6436250]. Questions are **not always in difficulty order** [LC-8513911].
- Most-reported topics: **DP (by far), Greedy, prefix sums, graphs (BFS/Dijkstra), monotonic stack, bit tricks, number theory**.
- Tip from candidates: brute force often passes the sample tests but **0 hidden tests**, so write the optimal version [LC-8278125, LC-8564309].

## Index

| # | Problem | Reported in | Topic |
|---|---|---|---|
| 1 | Minimum bags × K | SP OA, Jul 2025 | bitmask DP |
| 2 | Max element on both sides of the peak | SP/DSE OA, 1 Aug 2026 | hashing |
| 3 | Max subarray sum, flip one sign | SP/DSE OA, 1 Aug 2026 | Kadane + prefix/suffix |
| 4 | Split into K parts, min cost | SP/DSE OA, 1 Aug 2026 | partition DP |
| 5 | Strings over {a,b,c,d}, odd count of `a` | OA (21 LPA set), Aug 2026 | DP with states |
| 6 | Strings of A/B/C without "ABC" | HackWithInfy R1, 2025 | DP with states |
| 7 | Max `(a[i] − a[j]) · a[k]`, i < j < k | DSE/SP OA, Aug 2026 | prefix max/min |
| 8 | Break n into two numbers of different parity | On-campus OA (2027 batch), Aug 2026 | math |
| 9 | Remove one element, min clipping points | DSE/SP OA, 6 Aug 2026 | local recount |
| 10 | Sum of (max − min) over all subarrays | Off-campus onsite OA, Sep 2026 | monotonic stack |
| 11 | Min battery replacements with one boost | OA, Sep 2026 | DP O(n²) |
| 12 | Longest subsequence with sum = target + cooldown | OA, 2 Aug 2026 | DP |
| 13 | Max OR after k doublings | HackWithInfy R2, May 2026 | prefix/suffix OR |
| 14 | Min path sum on two grids, switch cost S | DSE onsite OA (HWI), May 2026 | grid DP |
| 15 | Max items within budget + one-time bag cost | On-campus OA, Aug 2026 | greedy |

---

## 1. Minimum bags × K — 📌 SP OA, Jul 2025 [LC-6958976]

`N` items with weights `A[i]`, each bag holds at most `K`. Find the minimum number of bags `Q` and print `Q × K`. **N ≤ 10**.
`N=2, K=8, A=[3,4] → 8` · `A=[4,5] → 16` · `K=81, A=[70,36] → 162`

**Approach:** N ≤ 10 → bitmask DP. For each set of packed items, store the **fewest bags** and, for that count, the **smallest load in the last bag**.

```java
static int bagsTimesK(int[] a, int K) {
    int n = a.length, full = 1 << n;
    for (int x : a) if (x > K) return -1;            // an item can't fit at all
    int[] bags = new int[full], load = new int[full];
    Arrays.fill(bags, Integer.MAX_VALUE);
    bags[0] = 1;                                      // one empty bag open
    for (int mask = 0; mask < full; mask++) {
        if (bags[mask] == Integer.MAX_VALUE) continue;
        for (int i = 0; i < n; i++) {
            if ((mask >> i & 1) == 1) continue;
            int nm = mask | 1 << i, b, l;
            if (load[mask] + a[i] <= K) { b = bags[mask]; l = load[mask] + a[i]; }
            else { b = bags[mask] + 1; l = a[i]; }    // open a new bag
            if (b < bags[nm] || (b == bags[nm] && l < load[nm])) { bags[nm] = b; load[nm] = l; }
        }
    }
    return bags[full - 1] * K;
}
```
**Time** O(2ⁿ·n) · **Space** O(2ⁿ)

---

## 2. Max element on both sides of the peak — 📌 SP/DSE OA, 1 Aug 2026 [LC-8434114]

The array has one peak (its maximum). Return the largest value that appears **both** left and right of the peak. `N ≤ 1e5`.

```java
static int maxOnBothSides(int[] a) {
    int p = 0;
    for (int i = 1; i < a.length; i++) if (a[i] > a[p]) p = i;   // peak index
    Set<Integer> left = new HashSet<>();
    for (int i = 0; i < p; i++) left.add(a[i]);
    int best = -1;                                                // -1 = no common value
    for (int i = p + 1; i < a.length; i++) if (left.contains(a[i])) best = Math.max(best, a[i]);
    return best;
}
```
**Time** O(n) · **Space** O(n)

---

## 3. Max subarray sum, flip the sign of at most one element — 📌 SP/DSE OA, 1 Aug 2026 [LC-8434114]

**Approach:** `endHere[i]` = best subarray ending at `i`, `startHere[i]` = best subarray starting at `i` (Kadane both ways). If we flip `a[i]`, the best subarray through `i` is `max(0, endHere[i-1]) + |a[i]| + max(0, startHere[i+1])`.

```java
static long maxSumOneFlip(int[] a) {
    int n = a.length;
    long[] endHere = new long[n], startHere = new long[n];
    endHere[0] = a[0];
    for (int i = 1; i < n; i++) endHere[i] = Math.max(a[i], endHere[i - 1] + a[i]);
    startHere[n - 1] = a[n - 1];
    for (int i = n - 2; i >= 0; i--) startHere[i] = Math.max(a[i], startHere[i + 1] + a[i]);
    long best = Long.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        best = Math.max(best, endHere[i]);                           // no flip
        long left = i > 0 ? Math.max(0, endHere[i - 1]) : 0;
        long right = i < n - 1 ? Math.max(0, startHere[i + 1]) : 0;
        best = Math.max(best, left + Math.abs((long) a[i]) + right); // flip a[i]
    }
    return best;
}
```
**Time** O(n) · **Space** O(n). Related: [LC 53](https://leetcode.com/problems/maximum-subarray/).

---

## 4. Split into exactly K contiguous parts, minimum cost — 📌 SP/DSE OA, 1 Aug 2026 [LC-8434114]

Cost of a part = `(max − min)` + `|first element − last element|`. Minimise the total. `N ≤ 500`.
(The report says "abs(left end − right end)"; this solution reads it as the **values** at the two ends.)

**Approach:** `dp[k][i]` = min cost to split the first `i` elements into `k` parts. Try every start `j` of the last part, growing it leftwards so max/min update in O(1).

```java
static long minPartitionCost(int[] a, int K) {
    int n = a.length;
    long INF = Long.MAX_VALUE / 4;
    long[][] dp = new long[K + 1][n + 1];
    for (long[] row : dp) Arrays.fill(row, INF);
    dp[0][0] = 0;
    for (int k = 1; k <= K; k++)
        for (int i = k; i <= n; i++) {                 // last part = a[j .. i-1]
            int mx = Integer.MIN_VALUE, mn = Integer.MAX_VALUE;
            for (int j = i - 1; j >= k - 1; j--) {
                mx = Math.max(mx, a[j]);
                mn = Math.min(mn, a[j]);
                if (dp[k - 1][j] == INF) continue;
                long cost = (long) mx - mn + Math.abs((long) a[j] - a[i - 1]);
                dp[k][i] = Math.min(dp[k][i], dp[k - 1][j] + cost);
            }
        }
    return dp[K][n];
}
```
**Time** O(K·n²) · **Space** O(K·n)

---

## 5. Strings over {a, b, c, d}: no neighbouring letters side by side, odd number of `a` — 📌 OA (21 LPA set), Aug 2026 [LC-8473850]

Forbidden pairs: `ab, ba, bc, cb, cd, dc`. Count strings of length `N` (≤ 1e5) with an **odd** count of `a`, mod 1e9+7.
`N=1 → 1` · `N=2 → 4` · `N=3 → 11`. The report also says `N=4 → 29`, but brute force over all 256 strings with these rules gives **30**, so that example (or a rule) was probably misremembered.

**Approach:** state = (last letter, parity of `a` count).

```java
static long countAbcd(int n) {
    final long MOD = 1_000_000_007L;
    long[][] dp = new long[4][2];                    // dp[last][parity of 'a' count]
    for (int c = 0; c < 4; c++) dp[c][c == 0 ? 1 : 0] = 1;
    for (int step = 2; step <= n; step++) {
        long[][] nd = new long[4][2];
        for (int last = 0; last < 4; last++)
            for (int par = 0; par < 2; par++) {
                if (dp[last][par] == 0) continue;
                for (int c = 0; c < 4; c++) {
                    if (Math.abs(c - last) == 1) continue;          // ab, bc, cd (both ways)
                    int np = par ^ (c == 0 ? 1 : 0);
                    nd[c][np] = (nd[c][np] + dp[last][par]) % MOD;
                }
            }
        dp = nd;
    }
    long ans = 0;
    for (int c = 0; c < 4; c++) ans = (ans + dp[c][1]) % MOD;
    return ans;
}
```
**Time** O(16·N) · **Space** O(1)

---

## 6. Count strings of A/B/C of length N without "ABC" — 📌 HackWithInfy R1, 2025 [LC-6904345]

**Approach:** track how much of "ABC" the string currently ends with: nothing, "A", or "AB".

```java
static long countNoABC(int n) {
    final long MOD = 1_000_000_007L;
    long s0 = 1, s1 = 0, s2 = 0;     // ends with: nothing useful / "A" / "AB"
    for (int i = 0; i < n; i++) {
        long n1 = (s0 + s1 + s2) % MOD;            // add 'A' to anything
        long n2 = s1;                              // "A" + 'B'
        long n0 = (2 * s0 + s1 + s2) % MOD;        // s0+'B', s0+'C', s1+'C', s2+'B'  ("AB"+'C' is banned)
        s0 = n0; s1 = n1; s2 = n2;
    }
    return (s0 + s1 + s2) % MOD;                   // n = 3 → 26
}
```
**Time** O(N) · **Space** O(1). For N up to 1e18, use **matrix exponentiation** on this 3×3 transition (one Aug 2026 slot needed it [LC-8436287]).

---

## 7. Maximise `(a[i] − a[j]) · a[k]` with i < j < k — 📌 DSE/SP OA, Aug 2026 [LC-8460608]

Values can be negative, so keep **both** the max and the min of `a[i] − a[j]` seen so far.

```java
static long maxTriple(int[] a) {
    long pMax = a[0], pMin = a[0];                 // best a[i] so far
    long dMax = Long.MIN_VALUE, dMin = Long.MAX_VALUE, best = Long.MIN_VALUE;
    for (int k = 1; k < a.length; k++) {
        if (k >= 2) best = Math.max(best, Math.max(dMax * a[k], dMin * a[k])); // a[k] as k
        dMax = Math.max(dMax, pMax - a[k]);        // a[k] as j
        dMin = Math.min(dMin, pMin - a[k]);
        pMax = Math.max(pMax, a[k]);
        pMin = Math.min(pMin, a[k]);
    }
    return best;
}
```
**Time** O(n) · **Space** O(1)

---

## 8. Break n into two numbers of different parity, max product — 📌 On-campus OA (2027 batch), Aug 2026 [LC-8454392]

`2 → -1` · `3 → 2` · `5 → 6`. Odd + even is always odd, so **even n is impossible**. For odd n, the closest pair `n/2` and `n − n/2` differs by 1 (different parity) and gives the max product.

```java
static long breakDifferentParity(int n) {
    if (n % 2 == 0) return -1;
    long a = n / 2, b = n - a;
    return a * b;
}
```
**Time** O(1)

---

## 9. Remove one element to minimise clipping points — 📌 DSE/SP OA, 6 Aug 2026 [LC-8443431]

An inner element is a clipping point if it is bigger than both neighbours or smaller than both. Remove exactly one element. `[1,5,2,4,3] → 1` (remove 2).

**Approach:** removing index `r` only changes the status of `r-1`, `r`, `r+1`. Subtract their old status and add the new status of `r-1` and `r+1`.

```java
static boolean isClip(int[] a, int i, int l, int r) {
    return (a[i] > a[l] && a[i] > a[r]) || (a[i] < a[l] && a[i] < a[r]);
}

static int minClipsAfterRemoval(int[] a) {
    int n = a.length;
    if (n <= 3) return 0;                          // 2 or fewer left → no inner element
    int[] c = new int[n];
    int total = 0;
    for (int i = 1; i < n - 1; i++) if (isClip(a, i, i - 1, i + 1)) { c[i] = 1; total++; }
    int best = Integer.MAX_VALUE;
    for (int r = 0; r < n; r++) {
        int now = total - c[r] - (r > 0 ? c[r - 1] : 0) - (r < n - 1 ? c[r + 1] : 0);
        int x = r - 1, y = r + 1;                  // they become neighbours
        if (x >= 1 && y <= n - 1 && isClip(a, x, x - 1, y)) now++;
        if (y <= n - 2 && x >= 0 && isClip(a, y, x, y + 1)) now++;
        best = Math.min(best, now);
    }
    return best;
}
```
**Time** O(n) · **Space** O(n)

---

## 10. Sum of (max − min) over all subarrays — 📌 Off-campus onsite OA, Sep 2026 [LC-8503419]

The story talked about DSU and "levels", but the examples reduce to [LC 2104 Sum of Subarray Ranges](https://leetcode.com/problems/sum-of-subarray-ranges/). `N ≤ 1e5`.

**Approach:** `Σmax − Σmin`. Each element is the max of `(i − left)·(right − i)` subarrays. Find `left` and `right` with a **monotonic stack** (next greater / next smaller).

```java
static long sumOfRanges(int[] a) {
    return sumOfExtremes(a, true) - sumOfExtremes(a, false);
}

static long sumOfExtremes(int[] a, boolean isMax) {
    int n = a.length;
    long total = 0;
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i <= n; i++) {
        while (!st.isEmpty() && (i == n || (isMax ? a[st.peek()] <= a[i] : a[st.peek()] >= a[i]))) {
            int m = st.pop();
            int left = st.isEmpty() ? -1 : st.peek();
            total += (long) a[m] * (m - left) * (i - m);   // subarrays where a[m] is the extreme
        }
        st.push(i);
    }
    return total;
}
```
**Time** O(n) · **Space** O(n)

---

## 11. Minimum battery replacements with one capacity boost — 📌 OA, Sep 2026 [LC-8505532]

Start at 0 with range `startBattery`. At a station you **replace** the battery (old charge is lost). **Once**, you may double the battery you install. Min stops to reach `target`, else -1. `n ≤ 2000`.
`pos=[4,8,12], bat=[5,6,4], start=7, target=16 → 2` · `pos=[5,11], bat=[4,10], start=5, target=20 → 2` · `pos=[6,15], bat=[5,10], start=5, target=25 → -1`

**Approach:** DP over the station where you last stopped, with 3 states: upgrade **not used yet** (`f0`), used **earlier** (`f1`), used **here** (`g`, doubled range).

```java
static int minBatteryStops(int[] pos, int[] bat, int start, int target) {
    if (start >= target) return 0;
    int n = pos.length, INF = Integer.MAX_VALUE / 2, best = INF;
    int[] f0 = new int[n], f1 = new int[n], g = new int[n];
    Arrays.fill(f0, INF); Arrays.fill(f1, INF); Arrays.fill(g, INF);
    for (int i = 0; i < n; i++) {
        if (pos[i] <= start) { f0[i] = 1; g[i] = 1; }               // first stop
        for (int j = 0; j < i; j++) {
            long normal = (long) pos[j] + bat[j], boosted = (long) pos[j] + 2L * bat[j];
            if (normal >= pos[i]) {
                if (f0[j] < INF) { f0[i] = Math.min(f0[i], f0[j] + 1); g[i] = Math.min(g[i], f0[j] + 1); }
                if (f1[j] < INF) f1[i] = Math.min(f1[i], f1[j] + 1);
            }
            if (boosted >= pos[i] && g[j] < INF) f1[i] = Math.min(f1[i], g[j] + 1);
        }
        if ((long) pos[i] + bat[i] >= target) best = Math.min(best, Math.min(f0[i], f1[i]));
        if ((long) pos[i] + 2L * bat[i] >= target) best = Math.min(best, g[i]);
    }
    return best >= INF ? -1 : best;
}
```
**Time** O(n²) · **Space** O(n). Close classic: [LC 871](https://leetcode.com/problems/minimum-number-of-refueling-stops/) (there, fuel adds up and a heap gives O(n log n)).

---

## 12. Longest subsequence with sum = target, with cooldown — 📌 OA, 2 Aug 2026 [LC-8443415]

Positive `nums`. If you pick `nums[i]`, you **can't pick the next `nums[i] % 4`** elements. Return the max length with sum exactly `target`, else -1.

```java
static int longestTargetSubseq(int[] nums, int target) {
    int n = nums.length, NEG = Integer.MIN_VALUE / 2;
    int[][] dp = new int[n + 1][target + 1];        // dp[i][s]: best length from index i with sum s
    Arrays.fill(dp[n], NEG);
    dp[n][0] = 0;
    for (int i = n - 1; i >= 0; i--)
        for (int s = 0; s <= target; s++) {
            int best = dp[i + 1][s];                                // skip nums[i]
            if (nums[i] <= s) {
                int next = Math.min(n, i + 1 + nums[i] % 4);        // 🔑 jump over the cooldown
                if (dp[next][s - nums[i]] > NEG) best = Math.max(best, 1 + dp[next][s - nums[i]]);
            }
            dp[i][s] = best;
        }
    return dp[0][target] < 0 ? -1 : dp[0][target];
}
```
**Time** O(n·target) · **Space** O(n·target)

---

## 13. Max OR after doubling numbers k times — 📌 HackWithInfy R2, May 2026 [LC-8161532]

Same as [LC 2680 Maximum OR](https://leetcode.com/problems/maximum-or/). Instead of guessing which element to double, use the proven fact: it's always best to put **all k doublings on one element** (it pushes that element's top bit highest). So try each element with prefix/suffix OR.

```java
static long maximumOr(int[] a, int k) {
    int n = a.length;
    long[] suf = new long[n + 1];
    for (int i = n - 1; i >= 0; i--) suf[i] = suf[i + 1] | a[i];
    long pre = 0, best = 0;
    for (int i = 0; i < n; i++) {
        best = Math.max(best, pre | ((long) a[i] << k) | suf[i + 1]);
        pre |= a[i];
    }
    return best;
}
```
**Time** O(n) · **Space** O(n)

---

## 14. Min path sum on two grids, switching costs S — 📌 DSE onsite OA (HackWithInfy), May 2026 [LC-8278125]

Move right/down from (0,0) to (n-1,m-1). At any step you can move to the **other grid** by paying `S`. (Assumed: you may start on either grid.)

```java
static long minPathTwoGrids(int[][] g1, int[][] g2, long S) {
    int n = g1.length, m = g1[0].length;
    int[][][] g = {g1, g2};
    long[][][] dp = new long[2][n][m];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            for (int t = 0; t < 2; t++) {
                if (i == 0 && j == 0) { dp[t][0][0] = g[t][0][0]; continue; }
                long prev = Long.MAX_VALUE;
                if (i > 0) prev = Math.min(prev, Math.min(dp[t][i - 1][j], dp[1 - t][i - 1][j] + S));
                if (j > 0) prev = Math.min(prev, Math.min(dp[t][i][j - 1], dp[1 - t][i][j - 1] + S));
                dp[t][i][j] = prev + g[t][i][j];
            }
    return Math.min(dp[0][n - 1][m - 1], dp[1][n - 1][m - 1]);
}
```
**Time** O(n·m) · **Space** O(n·m)

---

## 15. Max items within budget, type-1 items need a one-time bag cost C — 📌 On-campus OA, Aug 2026 [LC-8472744]

Items have `cost[i]` and `type[i]` (0/1). Budget `B`. If you take **any** type-1 item, you pay `C` once. Maximise the count.

**Approach:** two cases, take the better one. (a) Only type-0 items, cheapest first. (b) Pay `C`, then cheapest first from **all** items.

```java
static int maxItems(int[] cost, int[] type, long B, long C) {
    List<Integer> zero = new ArrayList<>(), all = new ArrayList<>();
    for (int i = 0; i < cost.length; i++) {
        all.add(cost[i]);
        if (type[i] == 0) zero.add(cost[i]);
    }
    int best = takeCheapest(zero, B);
    if (B >= C) best = Math.max(best, takeCheapest(all, B - C));
    return best;
}

static int takeCheapest(List<Integer> items, long budget) {
    Collections.sort(items);
    int count = 0;
    for (int c : items) {
        if (c > budget) break;
        budget -= c;
        count++;
    }
    return count;
}
```
**Time** O(n log n) · **Space** O(n)

---

## Reported problems that match a LeetCode problem (practise these directly)

| Reported in | Problem | Link |
|---|---|---|
| HackWithInfy 2026, L3 R1 [LC-8097136] | Spiral Matrix | [LC 54](https://leetcode.com/problems/spiral-matrix/) |
| HackWithInfy 2026, L3 R1 [LC-8097136] | Palindrome Pairs (variant) | [LC 336](https://leetcode.com/problems/palindrome-pairs/) |
| OA 6 Aug 2026 [LC-8443431] | Music playlist DP | [LC 920](https://leetcode.com/problems/number-of-music-playlists/) |
| OA 6 Aug 2026 [LC-8443431] | Stock with (variable) cooldown | [LC 309](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) |
| OA Aug 2026 [LC-8460608] | Max genetic difference (trie on tree) | [LC 1938](https://leetcode.com/problems/maximum-genetic-difference-query/) |
| OA 2 Aug 2026 [LC-8443415] | Refueling stops, no two adjacent stations | [LC 871](https://leetcode.com/problems/minimum-number-of-refueling-stops/) |
| On-campus OA, Sep 2026 [LC-8564309] | Trapping rain water with "contaminated" pillars | [LC 42](https://leetcode.com/problems/trapping-rain-water/) |

**Other reported topics (no clear statement):** prime factorisation + subarray conditions, LIS-style 2D DP, tree + bitmask DP [LC-8433956] · Johnson's rule (2-machine scheduling) and Convex Hull Trick DP [LC-8503419] · segment tree + DP, 0/1/2 swap counting [LC-8513911] · count coprime-ish pairs with Euler's totient [LC-7492648] · broker interval cover queries, segment tree [LC-6904345].

🧪 **Practice to cover these:** [Subsets](https://leetcode.com/problems/subsets/) · [LIS](https://leetcode.com/problems/longest-increasing-subsequence/) · [LCS](https://leetcode.com/problems/longest-common-subsequence/) · [Coin Change](https://leetcode.com/problems/coin-change/) · [Network Delay Time (Dijkstra)](https://leetcode.com/problems/network-delay-time/) · [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) · [Sort Colors (0/1/2)](https://leetcode.com/problems/sort-colors/) · [Integer Break](https://leetcode.com/problems/integer-break/)

Next: [02-interview-dsa.md](02-interview-dsa.md)
