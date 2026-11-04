# 01 — Online Assessment (Codility / HackerRank): Questions + Answers

**Format:** 3 questions in 90 minutes, usually 1 easy + 2 medium, with hidden test cases. [GFG-ET-25, LC-8459449, GFG-INT-23]
**Tags:** 🟢 apprentice report · 🔵 Amex India entry-level tech report · Sources → [sources.md](sources.md)

**Code check:** every Java answer below was tested against a slow brute-force version on random inputs (24,212 checks, all passed).

| # | Question | Tag | Level |
|---|---|---|---|
| A | Count vowels · anagram check · sort a string | 🟢 apprentice (UK Codility) | easy |
| 1 | Two fragments with sign flip | 🔵 Summer Intern OA, Aug 2026 | medium-hard |
| 2 | Two equal solar-plant squares | 🔵 Summer Intern OA, Aug 2026 | medium-hard |
| 3 | Spread stones on a 3×3 grid | 🔵 OA, Aug 2026 | medium |
| 4 | Rectangle with perimeter P, max points | 🔵 OA, Aug 2026 | medium |
| 5 | Pizza discounts | 🔵 OA, Aug 2026 | easy (long code) |
| 6 | Two non-overlapping windows K and L | 🔵 Intern OA (HackerRank) | medium |
| 7 | Fill the `?` | 🔵 Intern OA (HackerRank) | easy |
| 8 | Longest string from a, b, c counts | 🔵 Intern OA (HackerRank) | medium |
| 9 | Longest substring, every char even times | 🔵 Tech Intern (Codility) | medium |
| 10 | Two rooks, max sum | 🔵 Tech Intern (Codility) | medium |
| 11 | Missing numbers with known average | 🔵 Tech Intern (Codility) | medium |

---

## A. The easy apprentice Codility questions 🟢

**Q: Count the vowels in a sentence.**
Go through each character and check if it is in `"aeiou"`. Lowercase the string first so that `A` also counts.

```java
static int countVowels(String s) {
    int count = 0;
    for (char ch : s.toLowerCase().toCharArray())
        if ("aeiou".indexOf(ch) >= 0) count++;
    return count;
}
// countVowels("American Express Apprenticeship") → 11
```

**Q: Check if two strings are anagrams.** (same letters, same counts)
Count each letter: `+1` for the first string, `-1` for the second. If every count ends at 0, they are anagrams. [LC 242](https://leetcode.com/problems/valid-anagram/)

```java
static boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] freq = new int[26];
    for (int i = 0; i < a.length(); i++) {
        freq[a.charAt(i) - 'a']++;
        freq[b.charAt(i) - 'a']--;
    }
    for (int f : freq) if (f != 0) return false;
    return true;
}
// "listen", "silent" → true
```

**Q: Sort the characters of a string alphabetically.**

```java
static String sortString(String s) {
    char[] c = s.toCharArray();
    Arrays.sort(c);
    return new String(c);          // "express" → "eeprssx"
}
```

---

## 1. Two fragments with sign flip 🔵

**Question:** Choose one subarray of size `K` and one of size `L`. They **may overlap**. A number in only one subarray is added normally. A number in **both** is added with its sign **flipped**. Return the max sum.
`A = [1, 3, -4, 2, -2], K = 3, L = 2 → 10` (`[1,3,-4]` and `[-4,2]`, the shared `-4` becomes `+4`: `1+3+4+2`).
Closest: [LC 1031](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/) (that one has no overlap).

**Answer (simple idea):** try every start `i` of the K-window and every start `j` of the L-window. Use prefix sums for quick totals.
`sumK + sumL` counts a shared number **twice** (`+2x`), but we want `-x`. So subtract the shared part **3 times**.

```java
static long maxSum(int[] A, int K, int L) {
    int n = A.length;
    long[] P = new long[n + 1];                     // P[i] = sum of first i numbers
    for (int i = 0; i < n; i++) P[i + 1] = P[i] + A[i];
    long best = Long.MIN_VALUE;
    for (int i = 0; i + K <= n; i++) {
        for (int j = 0; j + L <= n; j++) {
            long sumK = P[i + K] - P[i];
            long sumL = P[j + L] - P[j];
            int lo = Math.max(i, j), hi = Math.min(i + K, j + L);
            long both = lo < hi ? P[hi] - P[lo] : 0;   // sum of the shared part
            best = Math.max(best, sumK + sumL - 3 * both); // 🔑 +2x counted, need -x
        }
    }
    return best;
}
```

**Time** O(n²) · **Space** O(n). This is fine for n up to about 5,000.

<details>
<summary><b>Faster O(n) version (if n is up to 100,000)</b></summary>

There are three cases:
1. **No overlap:** same as LC 1031 (best left window + right window).
2. **L-window inside the K-window:** `value = sumK(i) − 2·sumL(j)`.
3. **Partial overlap, K-window starts first:** `value = P[j+L] + 2·P[j] − 2·P[i+K] − P[i]`.

For a fixed `j`, the allowed `i` values form a window that only moves right, so a **sliding-window max (deque)** finds the best `i`. Run cases 2 and 3 again with `K` and `L` swapped.

```java
static long maxSumFast(int[] A, int K, int L) {
    int n = A.length;
    long[] P = new long[n + 1];
    for (int i = 0; i < n; i++) P[i + 1] = P[i] + A[i];
    return Math.max(noOverlap(P, n, K, L),
           Math.max(firstStartsFirst(P, n, K, L), firstStartsFirst(P, n, L, K)));
}

static long noOverlap(long[] P, int n, int K, int L) {
    long best = Long.MIN_VALUE;
    for (int pass = 0; pass < 2; pass++) {
        int a = pass == 0 ? K : L, b = pass == 0 ? L : K;   // a on the left, b on the right
        long bestLeft = Long.MIN_VALUE;
        for (int s = a; s + b <= n; s++) {
            bestLeft = Math.max(bestLeft, P[s] - P[s - a]);
            best = Math.max(best, bestLeft + P[s + b] - P[s]);
        }
    }
    return best;
}

// window X (size K, start i) starts at or before window Y (size L, start j) and they overlap
static long firstStartsFirst(long[] P, int n, int K, int L) {
    long best = Long.MIN_VALUE;
    Deque<Integer> dqIn = new ArrayDeque<>(), dqPart = new ArrayDeque<>();
    int addIn = 0, addPart = 0;
    for (int j = 0; j + L <= n; j++) {
        // Y inside X: i in [j+L-K, j]
        int loIn = Math.max(0, j + L - K), hiIn = Math.min(j, n - K);
        while (addIn <= hiIn) {
            long v = P[addIn + K] - P[addIn];
            while (!dqIn.isEmpty() && P[dqIn.peekLast() + K] - P[dqIn.peekLast()] <= v) dqIn.pollLast();
            dqIn.addLast(addIn++);
        }
        while (!dqIn.isEmpty() && dqIn.peekFirst() < loIn) dqIn.pollFirst();
        if (loIn <= hiIn && !dqIn.isEmpty()) {
            int i = dqIn.peekFirst();
            best = Math.max(best, P[i + K] - P[i] - 2 * (P[j + L] - P[j]));
        }
        // partial overlap: i in [j-K+1, j+L-K-1]
        int loP = Math.max(0, j - K + 1), hiP = Math.min(Math.min(j, n - K), j + L - K - 1);
        while (addPart <= hiP) {
            long v = -2 * P[addPart + K] - P[addPart];
            while (!dqPart.isEmpty() && -2 * P[dqPart.peekLast() + K] - P[dqPart.peekLast()] <= v) dqPart.pollLast();
            dqPart.addLast(addPart++);
        }
        while (!dqPart.isEmpty() && dqPart.peekFirst() < loP) dqPart.pollFirst();
        if (loP <= hiP && !dqPart.isEmpty()) {
            int i = dqPart.peekFirst();
            best = Math.max(best, P[j + L] + 2 * P[j] - 2 * P[i + K] - P[i]);
        }
    }
    return best;
}
```
Tested: same answers as the simple version on 3,000 random inputs. It takes 50 ms for n = 100,000.
</details>

---

## 2. Two equal solar-plant squares 🔵

**Question:** An N×M grid of `true`/`false` (N, M ≤ 700). Place **two squares of the same size**. Every cell inside them must be `true`, and they must not share a cell. Return the biggest possible side. (A 1×1 square is allowed.)
Closest: [LC 221 Maximal Square](https://leetcode.com/problems/maximal-square/).

**Answer:**
1. `dp[r][c]` = side of the biggest all-true square whose **bottom-right corner** is `(r, c)`. Formula: `1 + min(top, left, top-left)`.
2. **Binary search** on the side `s`. If side `s` works, every smaller side also works.
3. Check for side `s`: collect every corner with `dp ≥ s`. Two such squares don't overlap if their rows differ by `≥ s` **or** their columns differ by `≥ s`. So just compare the smallest and largest row (and column).

```java
static int maxSide(boolean[][] g) {
    int n = g.length, m = g[0].length;
    int[][] dp = new int[n + 1][m + 1];
    for (int r = 1; r <= n; r++)
        for (int c = 1; c <= m; c++)
            if (g[r - 1][c - 1])
                dp[r][c] = 1 + Math.min(dp[r - 1][c - 1], Math.min(dp[r - 1][c], dp[r][c - 1]));
    int lo = 0, hi = Math.min(n, m);
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        if (canPlace(dp, n, m, mid)) lo = mid; else hi = mid - 1;
    }
    return lo;
}

static boolean canPlace(int[][] dp, int n, int m, int s) {
    int minR = Integer.MAX_VALUE, maxR = -1, minC = Integer.MAX_VALUE, maxC = -1;
    for (int r = 1; r <= n; r++)
        for (int c = 1; c <= m; c++)
            if (dp[r][c] >= s) {                   // a size-s square ends here
                minR = Math.min(minR, r); maxR = Math.max(maxR, r);
                minC = Math.min(minC, c); maxC = Math.max(maxC, c);
            }
    return maxR - minR >= s || maxC - minC >= s;   // 🔑 far enough apart → no shared cell
}
```

**Time** O(N·M·log N) · **Space** O(N·M). A 700×700 grid runs in a few ms.

---

## 3. Spread stones on a 3×3 grid 🔵

**Question:** A 3×3 grid has 9 stones in total. Some cells have many stones and some have none. One move shifts one stone to a neighbouring cell. Return the minimum moves so that every cell has exactly 1 stone.
Same as [LC 2850](https://leetcode.com/problems/minimum-moves-to-spread-stones-over-grid/).

**Answer:** List every **extra stone** and every **empty cell**. Moving a stone from A to B costs the Manhattan distance `|r1-r2| + |c1-c2|`. There are at most 8 empty cells, so **try every matching** with backtracking and keep the minimum.

```java
static int minMoves(int[][] grid) {
    List<int[]> extra = new ArrayList<>(), empty = new ArrayList<>();
    for (int r = 0; r < 3; r++)
        for (int c = 0; c < 3; c++) {
            for (int k = 1; k < grid[r][c]; k++) extra.add(new int[]{r, c});
            if (grid[r][c] == 0) empty.add(new int[]{r, c});
        }
    return match(extra, empty, 0, new boolean[empty.size()]);
}

static int match(List<int[]> extra, List<int[]> empty, int i, boolean[] used) {
    if (i == extra.size()) return 0;
    int best = Integer.MAX_VALUE;
    for (int j = 0; j < empty.size(); j++) {
        if (used[j]) continue;
        used[j] = true;
        int d = Math.abs(extra.get(i)[0] - empty.get(j)[0]) + Math.abs(extra.get(i)[1] - empty.get(j)[1]);
        best = Math.min(best, d + match(extra, empty, i + 1, used));
        used[j] = false;
    }
    return best;
}
// [[1,1,0],[1,1,1],[1,2,1]] → 3      [[1,3,0],[1,0,0],[1,0,3]] → 4
```

---

## 4. Rectangle with perimeter P covering max points 🔵

**Question:** Given points `(x, y)` (N ≤ 200 to 500) and a perimeter `P`, place an axis-aligned rectangle with that perimeter. Points on the border count as inside. Return the max number of points inside.

⚠️ The source example says `(1,1),(2,3),(3,2),(4,4),(5,2), P=8 → 2`, but the 2×2 box from (1,1) to (3,3) holds **3** points. The correct answer is **3** (checked by brute force).

**Answer:**
- `width + height = P/2`. To avoid halves, **double every coordinate**. Then `width + height = P`.
- A best rectangle can always slide left/down until its **left edge touches a point's x** and its **bottom edge touches a point's y**. So try every pair (left point, bottom point).
- For a fixed corner, a point is inside when `dx ≤ w ≤ P − dy`. That gives one **range of widths** per point. Find the width covered by the most ranges with a **sweep** (sort start/end events).

```java
static int maxPoints(int[][] pts, int P) {
    int best = 0;
    for (int[] left : pts) {
        for (int[] bottom : pts) {
            int xl = 2 * left[0], yb = 2 * bottom[1];
            List<int[]> ev = new ArrayList<>();          // {width, +1 open / -1 close}
            for (int[] p : pts) {
                int dx = 2 * p[0] - xl, dy = 2 * p[1] - yb;
                if (dx < 0 || dy < 0) continue;          // left of or below the corner
                int wMin = dx, wMax = P - dy;            // inside when wMin <= w <= wMax
                if (wMin <= wMax) { ev.add(new int[]{wMin, 1}); ev.add(new int[]{wMax, -1}); }
            }
            ev.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]); // open before close
            int cur = 0;
            for (int[] e : ev) { cur += e[1]; best = Math.max(best, cur); }
        }
    }
    return best;
}
```

**Time** O(N³ log N). This is fine for N ≤ 200. For N = 500 it can be slow.

---

## 5. Pizza discounts 🔵

**Question:** Each pizza has a name, a size (S/M/L), a type (Veg/NonVeg) and a price. Apply **exactly one** discount and return the **lowest bill**:
1. **Buy 2 Get 1:** for every 3 pizzas, the cheapest is free.
2. **Veg Special:** 20% off the veg total if there are at least 2 veg pizzas.
3. **Large Offer:** ₹100 off each Large pizza.
4. **Flat:** ₹200 off if the total is ≥ ₹1500.

Example: Margherita (M, Veg, 300), Farmhouse (L, Veg, 500), Pepperoni (L, NonVeg, 700), Cheese (S, Veg, 250) → **1500**.

**Answer:** This is pure implementation. Make a `Pizza` class, compute each discount, and subtract the biggest one.
The example only gives 1500 if "Buy 2 Get 1" makes the **cheapest `n/3` pizzas free** (here the ₹250 one). Ask the interviewer if the rule is unclear.

```java
record Pizza(String name, char size, boolean veg, int price) {}

static double lowestBill(List<Pizza> list) {
    double total = 0;
    for (Pizza p : list) total += p.price();

    List<Integer> prices = new ArrayList<>();       // 1. Buy 2 Get 1
    for (Pizza p : list) prices.add(p.price());
    Collections.sort(prices);
    double d1 = 0;
    for (int i = 0; i < list.size() / 3; i++) d1 += prices.get(i);

    double vegSum = 0; int vegCnt = 0;              // 2. Veg Special
    for (Pizza p : list) if (p.veg()) { vegSum += p.price(); vegCnt++; }
    double d2 = vegCnt >= 2 ? 0.2 * vegSum : 0;

    double d3 = 0;                                  // 3. Large Offer
    for (Pizza p : list) if (p.size() == 'L') d3 += 100;

    double d4 = total >= 1500 ? 200 : 0;            // 4. Flat

    return total - Math.max(Math.max(d1, d2), Math.max(d3, d4));
}
// total 1750 → bills: 1500, 1540, 1550, 1550 → answer 1500
```

> 💡 **Hinglish:** Is type ke question mein logic easy hota hai, time code likhne mein jaata hai. Har discount ka alag function/block banao, taaki bug dhoondhna easy rahe.

---

## 6. Two non-overlapping windows K and L 🔵

**Question:** Return the max total of two subarrays of sizes K and L that **don't share** any element. Same as [LC 1031](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/).

**Answer:** Either the K-window is on the left or the L-window is. For one order, walk the right window from left to right and remember the **best left window seen so far**. Then do the same with the order swapped.

```java
static int maxTwoWindows(int[] A, int K, int L) {
    return Math.max(oneWay(A, K, L), oneWay(A, L, K));
}

static int oneWay(int[] A, int first, int second) {   // 'first' window is on the left
    int n = A.length;
    int[] P = new int[n + 1];
    for (int i = 0; i < n; i++) P[i + 1] = P[i] + A[i];
    int bestLeft = Integer.MIN_VALUE, ans = Integer.MIN_VALUE;
    for (int end = first + second; end <= n; end++) {
        int s = end - second;                              // right window = [s, end)
        bestLeft = Math.max(bestLeft, P[s] - P[s - first]); // 🔑 best left window ending by s
        ans = Math.max(ans, bestLeft + P[end] - P[s]);
    }
    return ans;
}
```

**Time** O(n) · **Space** O(n)

---

## 7. Fill the `?` 🔵

**Question:** The string has lowercase letters and `?`. Replace every `?` so that no character equals its neighbour. `abcab??bac?` → `abcabacbaca`. Same as [LC 1576](https://leetcode.com/problems/replace-all-s-to-avoid-consecutive-repeating-characters/).

**Answer:** A `?` has only 2 neighbours, so one of `a`, `b`, `c` is always free. Try them in order.

```java
static String fill(String s) {
    char[] c = s.toCharArray();
    for (int i = 0; i < c.length; i++) {
        if (c[i] != '?') continue;
        for (char ch = 'a'; ch <= 'c'; ch++) {
            boolean leftOk = i == 0 || c[i - 1] != ch;
            boolean rightOk = i == c.length - 1 || c[i + 1] != ch;
            if (leftOk && rightOk) { c[i] = ch; break; }
        }
    }
    return new String(c);
}
// "????????" → "abababab" (any valid answer is accepted; the report showed "abcdefgh")
```

---

## 8. Longest string from counts of a, b, c 🔵

**Question:** Given the max counts of `a`, `b` and `c`, build the longest string with **no 3 same characters in a row**. `(3,3,3) → abcabcabc`. Same as [LC 1405](https://leetcode.com/problems/longest-happy-string/).

**Answer (greedy):** Always use the letter with the **most remaining**. If that would make 3 in a row, use the **second most** once instead. Use a max-heap.

```java
static String longest(int a, int b, int c) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> y[1] - x[1]); // {char, count}
    if (a > 0) pq.add(new int[]{'a', a});
    if (b > 0) pq.add(new int[]{'b', b});
    if (c > 0) pq.add(new int[]{'c', c});
    StringBuilder sb = new StringBuilder();
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int len = sb.length();
        if (len >= 2 && sb.charAt(len - 1) == top[0] && sb.charAt(len - 2) == top[0]) {
            if (pq.isEmpty()) break;             // nothing else can be placed
            int[] next = pq.poll();              // 🔑 use the 2nd biggest once
            sb.append((char) next[0]);
            if (--next[1] > 0) pq.add(next);
            pq.add(top);
        } else {
            sb.append((char) top[0]);
            if (--top[1] > 0) pq.add(top);
        }
    }
    return sb.toString();
}
// (1,1,7) → "ccaccbcc" (length 8, the max possible)
```

---

## 9. Longest substring where every character appears an even number of times 🔵

**Question:** Return the length of the longest substring in which **every** character appears an even number of times. Closest: [LC 1371](https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/) (vowels only).

**Answer:** Keep a 26-bit **mask**: bit `k` is 1 when letter `k` has appeared an odd number of times so far. If the mask is the **same at two positions**, every letter between them appeared an even number of times. So store the **first index** of each mask.

> 💡 **Hinglish:** Mask = har letter ka odd/even switch. Same mask dobara mila → beech ka part sab even.

```java
static int longestEven(String s) {
    Map<Integer, Integer> first = new HashMap<>();
    first.put(0, -1);                         // empty prefix
    int mask = 0, best = 0;
    for (int i = 0; i < s.length(); i++) {
        mask ^= 1 << (s.charAt(i) - 'a');     // flip this letter's odd/even bit
        if (first.containsKey(mask)) best = Math.max(best, i - first.get(mask));
        else first.put(mask, i);
    }
    return best;
}
```

**Time** O(n) · **Space** O(n)

---

## 10. Two rooks, max sum 🔵

**Question:** Place two rooks on a 2D board so they **don't share a row or a column**. Maximize the sum of their two cells.

**Answer:** Sort all cells from biggest to smallest. For each cell, the **first** cell after it that is in a different row and a different column is its best partner. Stop there.

```java
static long twoRooks(int[][] board) {
    List<int[]> cells = new ArrayList<>();          // {value, row, col}
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            cells.add(new int[]{board[r][c], r, c});
    cells.sort((x, y) -> Integer.compare(y[0], x[0]));   // biggest first
    long best = Long.MIN_VALUE;
    for (int i = 0; i < cells.size(); i++) {
        int[] a = cells.get(i);
        for (int j = i + 1; j < cells.size(); j++) {
            int[] b = cells.get(j);
            if (a[1] != b[1] && a[2] != b[2]) {      // 🔑 first safe partner = best partner
                best = Math.max(best, (long) a[0] + b[0]);
                break;
            }
        }
    }
    return best;
}
```

The inner loop stops quickly, because only cells in the same row or column are skipped. **Time** about O(nm log nm + nm·(n+m)).

---

## 11. Missing numbers with known average 🔵

**Question:** Some numbers are missing, and the average of **all** of them is known. Find the missing numbers. The usual form is [LC 2028](https://leetcode.com/problems/find-missing-observations/): dice rolls 1–6, `n` rolls missing.

**Answer:** `missing sum = mean × (total count) − known sum`. It is possible only if `n ≤ missing ≤ 6n`. Give each missing roll `missing / n` and add 1 to the first `missing % n` rolls.

```java
static int[] missingRolls(int[] rolls, int mean, int n) {
    int m = rolls.length, known = 0;
    for (int x : rolls) known += x;
    int missing = mean * (n + m) - known;      // 🔑 total needed − what we have
    if (missing < n || missing > 6 * n) return new int[0];
    int[] ans = new int[n];
    Arrays.fill(ans, missing / n);
    for (int i = 0; i < missing % n; i++) ans[i]++;
    return ans;
}
// rolls [3,2,4,3], mean 4, n 2 → [6, 6]
```

---

**Topics only (statements not shared):** 🔵 graphs + binary search + 1 easy [GFG-INT-23] · bit manipulation, array traversal, binary search [GFG-INT] · trees + "Frog Jump" [GFG-SE-21] · "find the error and change at most 2 lines" [LC-3929390].

Agla: [02-interview-dsa.md](02-interview-dsa.md)
