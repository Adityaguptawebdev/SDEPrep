# OA Questions 3/3 — Matrix · Graphs · Trees/Trie · Recursion · DP · File/Data Processing

> Same rules as [OA 1/3](01-oa-arrays-strings-hashmap.md). Every Java block compiled + tested. At the end: the **older (2021–2022) HackerRank campus format**, kept separate because it is not how 2024–2026 OAs look.

**Easy analogy — matrix questions = Ludo board**: Har cell ek ghar hai, har move ek rule hai ("upar-neeche-left-right jao", "same colour phoot jaaye", "girti goti"). Code likhne se pehle **rules ko ek-ek line mein likh lo**, warna simulation mein ek chhota rule miss hua aur aadhe test cases fail.

| # | Question | Difficulty | Freq | Status | Source |
|---|---|---|---|---|---|
| X1 | Spiral traversal of a matrix | Medium | LOW | Reported (= LC 54) | [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) |
| X2 | Bubble explosion + gravity | Medium | MEDIUM (family) | Exact | [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/) (+ similar "colours pop" in [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/)) |
| X3 | Falling figure — fewest obstacles to remove | Medium | LOW | Reconstructed | [LC-6782864](https://leetcode.com/discuss/post/6782864/visa-ot-questions-by-samarpreneur-celb/) |
| X4 | Time for water / colour to reach every cell | Medium | MEDIUM (family) | Reconstructed | [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/), [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) |
| G1 | Restore the visit order from adjacent pairs | Medium | LOW | Reported (= LC 1743) | [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) |
| G2 | Minimum score of a path (Staff HackerRank) | Medium | LOW | Reported (≈ LC 2492) | [LC-8404717](https://leetcode.com/discuss/post/8404717/visa-oa-staff-software-engineer-rejected-c0gg/) |
| TR1 | Trie-based problem | Medium | MEDIUM | Reported (no details) | [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/), [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/) |
| D1 | Palindromic subsequences of length 5 in a binary string | Hard | LOW | Reported (LC 2484 variation) | [LC-7561130](https://leetcode.com/discuss/post/7561130/visa-oa-coding-expert-by-anonymous_user-pvbu/) |
| D2 | Minimum cost for tickets / courses (Staff HackerRank) | Medium | LOW | Reported (≈ LC 983) | [LC-8404717](https://leetcode.com/discuss/post/8404717/visa-oa-staff-software-engineer-rejected-c0gg/) |
| F1 | Package-processing centres (log simulation) | Medium | LOW | Exact | [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) |
| F2 | "File parsing and file manipulation" | ? | LOW | Topic only | [JT-2025-11](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-karnataka-november-17-2025-no-offer-positive-a80c80fc/) |

---

## Matrix

### X1. Spiral traversal — Medium · LOW · Reported (= LeetCode 54)

**Source**: [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) · Feb 2025 · **SWE-I, 1.5 YOE** · CodeSignal Q3 "Spiral traversal in a matrix". Problem: [LC 54 Spiral Matrix](https://leetcode.com/problems/spiral-matrix/).

**Pattern**: four boundaries (`top`, `bottom`, `left`, `right`) that shrink after each side.

```
 → → → ↓        top    row: left..right, then top++
 ↑ → ↓ ↓        right  col: top..bottom,  then right--
 ↑ ← ← ↓        bottom row: right..left,  then bottom--  (only if top <= bottom)
 ← ← ← ←        left   col: bottom..top,  then left++    (only if left <= right)
```

```java
import java.util.ArrayList;
import java.util.List;

class SpiralOrder {
    static List<Integer> spiral(int[][] m) {
        List<Integer> out = new ArrayList<>();
        if (m.length == 0) return out;
        int top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) out.add(m[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) out.add(m[r][right]);
            right--;
            if (top <= bottom) {                       // a single row left? don't repeat it
                for (int c = right; c >= left; c--) out.add(m[bottom][c]);
                bottom--;
            }
            if (left <= right) {                       // a single column left? don't repeat it
                for (int r = bottom; r >= top; r--) out.add(m[r][left]);
                left++;
            }
        }
        return out;
    }
}
```

**Complexity**: O(n·m) / O(1) extra. **Trap**: 1×n and n×1 matrices (the two `if` checks).

### X2. Bubble explosion + gravity — Medium · MEDIUM (family) · Exact

**Source**: [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/) · Aug 2023 · CodeSignal (full statement in screenshots; board ≤ 100×100, colours ≤ 10^4). A 2025 Bangalore candidate reported a similar "colours spread and equal colours pop into 0" matrix question ([LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/), details not exact).

**Rules**
1. A bubble is **eligible** if at least **2 of its 4 neighbours** have the same colour.
2. Every eligible bubble **and** its same-colour neighbours are **marked**.
3. All marked bubbles explode **at the same time** (become empty).
4. Remaining bubbles **fall down** in their column; empty cells become `0`.

```
 before            marked (x)         after explosion      after gravity
 3 1 2 1           3 x 2 1            3 . 2 1              0 0 0 1
 1 1 1 4           x x x 4            . . . 4              0 0 0 4
 3 1 2 2           x x 2 2            . . 2 2              0 0 2 2
 3 3 3 4           x x x 4            . . . 4              3 0 2 4
```

Why these cells? `(1,1) = 1` has **four** `1`-neighbours → it and all four explode. `(3,0) = 3` and `(3,1) = 3` each have **two** `3`-neighbours → they and their `3`-neighbours `(2,0)`, `(3,2)` explode. `(3,2) = 3` itself has only one `3`-neighbour, but it is marked because an eligible neighbour marked it.

```java
import java.util.Arrays;

class BubbleExplosion {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    static int[][] explode(int[][] b) {
        int n = b.length, m = b[0].length;
        boolean[][] marked = new boolean[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                int same = 0;
                for (int[] d : DIRS) if (sameColour(b, i + d[0], j + d[1], b[i][j])) same++;
                if (same >= 2) {                                   // eligible
                    marked[i][j] = true;
                    for (int[] d : DIRS)                           // mark same-colour neighbours
                        if (sameColour(b, i + d[0], j + d[1], b[i][j])) marked[i + d[0]][j + d[1]] = true;
                }
            }
        int[][] out = new int[n][m];                               // all 0 = empty
        for (int j = 0; j < m; j++) {                              // gravity column by column
            int write = n - 1;
            for (int i = n - 1; i >= 0; i--) if (!marked[i][j]) out[write--][j] = b[i][j];
        }
        return out;
    }

    static boolean sameColour(int[][] b, int i, int j, int colour) {
        return i >= 0 && j >= 0 && i < b.length && j < b[0].length && b[i][j] == colour;
    }

    public static void main(String[] args) {
        int[][] board = {{3, 1, 2, 1}, {1, 1, 1, 4}, {3, 1, 2, 2}, {3, 3, 3, 4}};
        for (int[] row : explode(board)) System.out.println(Arrays.toString(row));
    }
}
```

```text
[0, 0, 0, 1]
[0, 0, 0, 4]
[0, 0, 2, 2]
[3, 0, 2, 4]
```

**Complexity**: O(n·m) time and space. **Trap**: exploding bubbles one by one while you scan (changes later checks) — mark first, explode later.

### X3. Falling figure — fewest obstacles to remove — Medium · LOW · Reconstructed

**Source**: [LC-6782864](https://leetcode.com/discuss/post/6782864/visa-ot-questions-by-samarpreneur-celb/) · May 2025 · screenshot of a CodeSignal question: board with `-` empty, `#` obstacle, `*` part of one connected figure. *"Simulate how the figure falls and find the minimum number of obstacles to be removed to let the figure fall to the bottom of the board with at least one of its cells."*
**Our reading**: the figure moves straight down as one rigid piece until its lowest cell reaches the last row. Every obstacle that any figure cell passes through on the way must be removed, and those are exactly the ones we count.

```
 - * * -      figure lowest cell is in row 1; board has 5 rows → falls 3 rows
 - * - -      column 1 path: rows 1..4 (from the top cell), column 2 path: rows 1..3
 # - # -      obstacles on those paths: (2,2) and (3,1) → answer 2
 - # - #      (2,0) and (3,3) are not on any path
 - - - -
```

```java
class FallingFigure {
    static int obstaclesToRemove(char[][] board) {
        int rows = board.length, cols = board[0].length, lowest = -1;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) if (board[r][c] == '*') lowest = Math.max(lowest, r);
        int drop = rows - 1 - lowest;                        // rows the figure must fall
        boolean[][] onPath = new boolean[rows][cols];
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (board[r][c] == '*')
                    for (int k = 1; k <= drop; k++) onPath[r + k][c] = true;
        int count = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) if (onPath[r][c] && board[r][c] == '#') count++;
        return count;
    }
}
```

**Complexity**: O(rows · cols · drop) — fine for CodeSignal sizes; can be O(rows · cols) with a per-column scan.

### X4. Time for water / colour to reach every cell — Medium · MEDIUM (family) · Reconstructed

**Sources**: [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) (2024, new grad, CodeSignal: "2D water flow simulation determining time-to-reach for each cell") and [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) (Nov 2025, Bangalore: "each colour grows simultaneously in all four directions at the same pace"). Neither exact statement is public, so here is the **pattern both share**:

**Reconstructed statement**: grid of `S` (water source), `#` (wall), `.` (empty). Every minute, water spreads from wet cells to the 4 neighbours. Return the minute each cell gets wet (`-1` if never, walls `-1`).

**Pattern**: **multi-source BFS** — put all sources in the queue at time 0 (like [LC 994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)).

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class WaterSpread {
    static int[][] arrivalTime(char[][] g) {
        int n = g.length, m = g[0].length;
        int[][] time = new int[n][m];
        for (int[] row : time) Arrays.fill(row, -1);
        Deque<int[]> queue = new ArrayDeque<>();
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                if (g[i][j] == 'S') { time[i][j] = 0; queue.add(new int[]{i, j}); }   // all sources at t=0
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int r = cell[0] + d[0], c = cell[1] + d[1];
                if (r < 0 || c < 0 || r >= n || c >= m || g[r][c] == '#' || time[r][c] != -1) continue;
                time[r][c] = time[cell[0]][cell[1]] + 1;
                queue.add(new int[]{r, c});
            }
        }
        return time;
    }
}
```

**Complexity**: O(n·m). **Trap**: running a separate BFS from each source (O(sources·n·m)) → TLE.

---

## Graphs

### G1. Restore the visit order from adjacent pairs — Medium · LOW · Reported (= LeetCode 1743)

**Source**: [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) · Dec 2025 · Senior applicant · CodeSignal Q4 (not attempted: "not an easy approach"). *"You visited islands but forgot the order. Each pair `[a, b]` means a and b were visited one after another (either order). Form the order."* `[1,2], [2,3], [4,5], [1,5]` → `4, 5, 1, 2, 3`. Problem: [LC 1743 Restore the Array From Adjacent Pairs](https://leetcode.com/problems/restore-the-array-from-adjacent-pairs/).

**Pattern**: build an adjacency map; the two **ends** of the path have exactly one neighbour; walk from one end, never going back.

```
 1 ─ 2 ─ 3          degrees: 1→2, 2→2, 3→1, 4→1, 5→2
 │                  ends = 3 and 4
 5 ─ 4              walk from 4: 4 → 5 → 1 → 2 → 3
```

Which end to start from? The poster's example starts at 4 (the larger end); the reverse `3,2,1,5,4` is equally valid unless the statement says otherwise — read the tie rule in your test.

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class RestoreVisitOrder {
    static int[] restore(int[][] pairs) {
        Map<Integer, List<Integer>> adj = new HashMap<>();
        for (int[] p : pairs) {
            adj.computeIfAbsent(p[0], k -> new ArrayList<>()).add(p[1]);
            adj.computeIfAbsent(p[1], k -> new ArrayList<>()).add(p[0]);
        }
        int start = Integer.MIN_VALUE;
        for (Map.Entry<Integer, List<Integer>> e : adj.entrySet())
            if (e.getValue().size() == 1) start = Math.max(start, e.getKey());   // an end of the path
        int[] order = new int[pairs.length + 1];
        order[0] = start;
        for (int k = 1; k < order.length; k++) {
            int cur = order[k - 1];
            Integer prev = (k >= 2) ? order[k - 2] : null;
            for (int next : adj.get(cur)) {
                if (prev == null || next != prev) { order[k] = next; break; }     // don't go back
            }
        }
        return order;
    }
}
```

**Complexity**: O(n) time and space.

### G2. Minimum score of a path (Staff HackerRank) — Medium · LOW · Reported (≈ LeetCode 2492)

**Source**: [LC-8404717](https://leetcode.com/discuss/post/8404717/visa-oa-staff-software-engineer-rejected-c0gg/) · Jul 2026 · **Staff** applicant · HackerRank, 2 questions in 90 min, "similar to [LC 2492](https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/)". Included only as graph practice — not your level's OA.

**Pattern**: the answer is the smallest edge weight in the **connected component of city 1** (you may revisit roads). BFS/DFS the component and take the min edge.

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

class MinScorePath {
    static int minScore(int n, int[][] roads) {                 // roads: {a, b, distance}, cities 1..n
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] r : roads) {
            adj.get(r[0]).add(new int[]{r[1], r[2]});
            adj.get(r[1]).add(new int[]{r[0], r[2]});
        }
        boolean[] seen = new boolean[n + 1];
        Deque<Integer> queue = new ArrayDeque<>();
        queue.add(1);
        seen[1] = true;
        int best = Integer.MAX_VALUE;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int[] e : adj.get(u)) {
                best = Math.min(best, e[1]);                     // every edge of the component
                if (!seen[e[0]]) { seen[e[0]] = true; queue.add(e[0]); }
            }
        }
        return best;
    }
}
```

**Complexity**: O(n + E).

**Graph OA questions reported without details** (practice the classics): OA Q4 "on graph" ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/), 1 YOE, Apr 2025), "2 graph questions" ([LC-7131092](https://leetcode.com/discuss/post/7131092/visa-sr-sw-engineer-java-full-stack-inte-zt7k/)), "graph problem" ([LC-7232120](https://leetcode.com/discuss/post/7232120/visa-oa-pre-screen-for-new-grad-waca-usa-mpf8/)), "graph" topic ([LC-7568020](https://leetcode.com/discuss/post/7568020/visa-recent-oa-qs-by-anonymous_user-b51z/)). Practice: [200 Number of Islands](https://leetcode.com/problems/number-of-islands/), [994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/), [207 Course Schedule](https://leetcode.com/problems/course-schedule/), [1743](https://leetcode.com/problems/restore-the-array-from-adjacent-pairs/), [2492](https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/).

---

## Trees (Trie)

### TR1. Trie-based problem — Medium · MEDIUM · Reported (no details)

**Sources**: [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/) (Feb 2026, Senior: "1 medium (Trie-based problem)") and [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/) (Mar 2025: "Leetcode mediums were ugly implementation based and Tries"). A tree-topic question was also reported by a fresher ([LC-7568020](https://leetcode.com/discuss/post/7568020/visa-recent-oa-qs-by-anonymous_user-b51z/)) with no details.

Since the exact Trie question is unknown, here is a reusable **Trie** that also solves the reported LC 3043 ([H2](01-oa-arrays-strings-hashmap.md#h2-longest-common-prefix-between-numbers-of-two-arrays--medium--medium--reported--leetcode-3043)) by inserting numbers as digit strings.

```java
class PrefixTrie {
    private final PrefixTrie[] child = new PrefixTrie[128];
    private int passCount;                                   // words passing through this node

    void insert(String word) {
        PrefixTrie node = this;
        for (char ch : word.toCharArray()) {
            if (node.child[ch] == null) node.child[ch] = new PrefixTrie();
            node = node.child[ch];
            node.passCount++;
        }
    }

    int countWithPrefix(String prefix) {                     // how many inserted words start with prefix
        PrefixTrie node = this;
        for (char ch : prefix.toCharArray()) {
            node = node.child[ch];
            if (node == null) return 0;
        }
        return node.passCount;
    }

    int longestCommonPrefix(String word) {                   // longest prefix of word present in trie
        PrefixTrie node = this;
        int len = 0;
        for (char ch : word.toCharArray()) {
            node = node.child[ch];
            if (node == null) break;
            len++;
        }
        return len;
    }

    static int longestAcrossArrays(int[] arr1, int[] arr2) {  // LC 3043 with a trie
        PrefixTrie trie = new PrefixTrie();
        for (int x : arr1) trie.insert(String.valueOf(x));
        int best = 0;
        for (int y : arr2) best = Math.max(best, trie.longestCommonPrefix(String.valueOf(y)));
        return best;
    }
}
```

**Complexity**: insert/search O(L) per word. Practice: [208 Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/), [1268 Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/), [3043](https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix/).

---

## Recursion

**No OA question in 2023–2026 reports was described as recursion/backtracking.** Recursion shows up in technical rounds instead (Letter Combinations of a Phone Number, [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)) — see [03-dsa/01-arrays-strings-hashing.md](../03-dsa/01-arrays-strings-hashing.md).

---

## Dynamic Programming

### D1. Palindromic subsequences of length 5 in a binary string — Hard · LOW · Reported (LC 2484 variation)

**Source**: [LC-7561130](https://leetcode.com/discuss/post/7561130/visa-oa-coding-expert-by-anonymous_user-pvbu/) · Feb 2026 · "Coding-Expert" test, Q3: "a variation of LC 2484, with the input only consisting of 1 and 0. Couldn't pass all the test cases as 8/15 were getting timed out." Problem family: [LC 2484 Count Palindromic Subsequences](https://leetcode.com/problems/count-palindromic-subsequences/) (length-5 palindromic subsequences, answer mod 1e9+7).

**Pattern**: fix the **middle** character. A length-5 palindrome is `x y M y x`. Count pairs `(x, y)` on the left of `M` and pairs `(y, x)` on the right. With only 2 characters there are just 4 pair types → **O(n)**.

```
 s = 1 0 1 0 1 ...
 left pairs (p<q<mid):  count[x][y]      right pairs (mid<r<t): suffix[y][x]
 answer += Σ over x,y of  left[x][y] * right[y][x]
```

```java
class BinaryPalindromes5 {
    static final long MOD = 1_000_000_007L;

    static long count(String s) {
        int n = s.length();
        long[][][] right = new long[n + 1][2][2];   // right[i][a][b] = pairs r<t, r>=i, s[r]=a, s[t]=b
        long[] onesZerosRight = new long[2];
        for (int i = n - 1; i >= 0; i--) {
            int c = s.charAt(i) - '0';
            for (int a = 0; a < 2; a++)
                for (int b = 0; b < 2; b++) right[i][a][b] = right[i + 1][a][b];
            for (int b = 0; b < 2; b++) right[i][c][b] = (right[i][c][b] + onesZerosRight[b]) % MOD;
            onesZerosRight[c]++;
        }
        long[][] left = new long[2][2];              // pairs p<q before the middle
        long[] seen = new long[2];
        long answer = 0;
        for (int mid = 0; mid < n; mid++) {
            for (int x = 0; x < 2; x++)
                for (int y = 0; y < 2; y++)
                    answer = (answer + left[x][y] * right[mid + 1][y][x]) % MOD;
            int c = s.charAt(mid) - '0';
            for (int x = 0; x < 2; x++) left[x][c] = (left[x][c] + seen[x]) % MOD;
            seen[c]++;
        }
        return answer;
    }
}
```

**Complexity**: O(n) time, O(n) space. The poster's timeouts suggest their solution was O(n²) or worse.

### D2. Minimum cost for tickets / courses — Medium · LOW · Reported (≈ LeetCode 983)

**Source**: [LC-8404717](https://leetcode.com/discuss/post/8404717/visa-oa-staff-software-engineer-rejected-c0gg/) · Jul 2026 · **Staff** · "Minimum price to take courses — DP, similar to [LC 983 Minimum Cost For Tickets](https://leetcode.com/problems/minimum-cost-for-tickets/)".

```java
class MinCostTickets {
    static int minCost(int[] days, int[] costs) {            // costs for 1-, 7-, 30-day passes
        int last = days[days.length - 1];
        boolean[] travel = new boolean[last + 1];
        for (int d : days) travel[d] = true;
        int[] dp = new int[last + 1];                        // dp[d] = min cost to cover days 1..d
        for (int d = 1; d <= last; d++) {
            if (!travel[d]) { dp[d] = dp[d - 1]; continue; }
            dp[d] = Math.min(dp[d - 1] + costs[0],
                    Math.min(dp[Math.max(0, d - 7)] + costs[1], dp[Math.max(0, d - 30)] + costs[2]));
        }
        return dp[last];
    }
}
```

**Complexity**: O(last day). **Other DP OA reports without details**: [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) Q4 "DP-related", [LC-6510481](https://leetcode.com/discuss/post/6510481/visa-inc-code-signal-screening-staff-sof-eran/) "DP optimization", [LC-7568020](https://leetcode.com/discuss/post/7568020/visa-recent-oa-qs-by-anonymous_user-b51z/) "DP". DP patterns that the **technical rounds** asked (House Robber, Word Break) are in [03-dsa/07-dynamic-programming.md](../03-dsa/07-dynamic-programming.md).

---

## File / Data Processing

### F1. Package-processing centres — Medium · LOW · Exact

**Source**: [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) · Jun 2025 · CodeSignal Q4 (full statement quoted by the poster). An aggregator lists the same "Package Processing Centers" question for another Dec 2025 CodeSignal test ([codingkaro](https://www.codingkaro.in/jobs-internships/leetcode-interview-experience/VISA); original post not found, so not counted twice).

**Problem**: `centerCapacities[i]` (1..5) = packages centre `i` handles before it needs a reset. `dailyLog` has `"PACKAGE"` (a package arrives) or `"CLOSURE j"` (centre `j` closes for good). Packages go to centres **in order**: a centre takes packages until its capacity is used, then the next **open** centre takes over. After a full rotation (back to centre 0) all open centres get full capacity again. Return the centre that processed the most packages (ties → highest index).

**Pattern**: log-driven simulation with a pointer + "reset on wrap-around".

```
 capacities [1, 2, 1], log: P P P P CLOSURE-1 P P
 P→c0 | P→c1 | P→c1 | P→c2 | c1 closed | wrap, reset → P→c0 | P→c2 (skip closed c1)
 processed = [2, 2, 2]  → tie → answer 2 (highest index)
```

```java
class PackageCenters {
    static int busiestCenter(int[] capacities, String[] dailyLog) {
        int n = capacities.length;
        int[] left = capacities.clone();
        boolean[] closed = new boolean[n];
        int[] processed = new int[n];
        int cur = 0;
        for (String entry : dailyLog) {
            if (entry.startsWith("CLOSURE")) {
                closed[Integer.parseInt(entry.substring("CLOSURE".length()).trim())] = true;
                continue;
            }
            while (closed[cur] || left[cur] == 0) {          // find the centre for this package
                cur++;
                if (cur == n) {                              // full rotation → reset capacities
                    cur = 0;
                    left = capacities.clone();
                }
            }
            processed[cur]++;
            left[cur]--;
        }
        int best = 0;
        for (int i = 0; i < n; i++) if (processed[i] >= processed[best]) best = i;   // ties → higher index
        return best;
    }
}
```

**Complexity**: O(log length · n) worst case. **Trap**: forgetting to reset capacities on wrap-around, or letting a closed centre take packages. The statement guarantees at least one centre stays open (otherwise the loop never ends).

### F2. "File parsing and file manipulation" — LOW · Topic only

**Source**: [JT-2025-11](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-karnataka-november-17-2025-no-offer-positive-a80c80fc/) · Nov 2025 · Software Engineer, Bengaluru · CodeSignal + 2 technical rounds, topic "file parsing and file manipulation" — no statement given. Related: a CodeSignal GCA with "managing and organizing entities (classifications and updates)" ([LC-7333944](https://leetcode.com/discuss/post/7333944/visa-oa-codesignal-experience-by-anonymo-pcna/)), and the technical-round question "rate-limit IPs from a log file; what if the file is GBs?" ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)).
**Practice**: [03-dsa/08-file-and-log-processing.md](../03-dsa/08-file-and-log-processing.md) (parse lines safely, skip bad rows, aggregate with maps, external sort idea).

---

## Older format (2021–2022 campus OAs on HackerRank) — lower priority

These were **HackerRank** tests with 2–3 questions for on-campus drives. 2024–2026 reports show CodeSignal instead, so use these only as extra practice.

| Question | Year · source | Pattern | Similar |
|---|---|---|---|
| Maximize revenue (price = remaining stock) | 2022 · [LC-2571045](https://leetcode.com/discuss/post/2571045/visa-company-3-coding-questions-15-hours-pdos/) | max-heap greedy | code below |
| Visible towers on both sides | 2022 · [LC-2571045](https://leetcode.com/discuss/post/2571045/visa-company-3-coding-questions-15-hours-pdos/), [LC-2626818](https://leetcode.com/discuss/post/2626818/visa-sde-intern-bengaluru-sept-2022-by-a-5x5w/) (**2 reports**) | monotonic stack | code below |
| Series solver (odd one out by letter gaps) | 2022 · [LC-2571045](https://leetcode.com/discuss/post/2571045/visa-company-3-coding-questions-15-hours-pdos/) | hashing a pattern | code below |
| Pairs with sum in `[x, y]` | 2022 · [LC-2626818](https://leetcode.com/discuss/post/2626818/visa-sde-intern-bengaluru-sept-2022-by-a-5x5w/) | sort + two pointers | [LC 2563](https://leetcode.com/problems/count-the-number-of-fair-pairs/), code below |
| Assigned parking (cars side by side on a line) | 2022 · [LC-2557529](https://leetcode.com/discuss/post/2557529/visa-oa-assigned-parking-new-grad-2023-b-liwh/) | sort + median | — |
| Maximize OR after k doublings | 2022 · [LC-2557202](https://leetcode.com/discuss/post/2557202/visa-oa-question-sde-fresher-on-campus-b-3e7e/) | prefix/suffix OR | [LC 2680](https://leetcode.com/problems/maximum-or/) |
| Make neighbours alternate parity by halving | 2022 · [LC-2440366](https://leetcode.com/discuss/post/2440366/visa-online-assesment-by-anonymous_user-o1df/) | greedy / DP | — |
| Equal vowels and consonants with ±1 letter moves | 2022 · [LC-2724889](https://leetcode.com/discuss/post/2724889/visa-hackerank-question-by-anonymous_use-znwe/) | greedy on costs | — |

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Collections;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.ArrayList;

class OlderCampusOA {
    // Maximize revenue: sell m items, an item of type i costs its current remaining quantity
    static long maxRevenue(int[] quantity, int m) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
        for (int q : quantity) if (q > 0) heap.add(q);
        long revenue = 0;
        for (int k = 0; k < m && !heap.isEmpty(); k++) {
            int top = heap.poll();                   // always sell the most expensive item
            revenue += top;
            if (top > 1) heap.add(top - 1);
        }
        return revenue;
    }

    // Visible towers: x is visible from y if every tower between them is strictly shorter than x
    static int[] visibleTowers(int[] h) {
        int n = h.length;
        int[] chainRight = new int[n], chainLeft = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = n - 1; i >= 0; i--) {           // records seen when looking right, starting at i
            while (!st.isEmpty() && h[st.peek()] <= h[i]) st.pop();
            chainRight[i] = 1 + (st.isEmpty() ? 0 : chainRight[st.peek()]);
            st.push(i);
        }
        st.clear();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && h[st.peek()] <= h[i]) st.pop();
            chainLeft[i] = 1 + (st.isEmpty() ? 0 : chainLeft[st.peek()]);
            st.push(i);
        }
        int[] visible = new int[n];
        for (int y = 0; y < n; y++)
            visible[y] = (y + 1 < n ? chainRight[y + 1] : 0) + (y - 1 >= 0 ? chainLeft[y - 1] : 0);
        return visible;
    }

    // Series solver: all strings but one share the same gaps between consecutive letters
    static String oddOneOut(String[] series) {
        Map<String, List<String>> byPattern = new HashMap<>();
        for (String s : series) {
            StringBuilder key = new StringBuilder();
            for (int i = 1; i < s.length(); i++) key.append(s.charAt(i) - s.charAt(i - 1)).append(',');
            byPattern.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(s);
        }
        for (List<String> group : byPattern.values()) if (group.size() == 1) return group.get(0);
        return "";
    }

    // Pairs i<j with lower <= a[i]+a[j] <= upper
    static long pairsInRange(int[] a, int lower, int upper) {
        int[] s = a.clone();
        Arrays.sort(s);
        return pairsAtMost(s, upper) - pairsAtMost(s, lower - 1);
    }

    static long pairsAtMost(int[] s, long limit) {
        long count = 0;
        int i = 0, j = s.length - 1;
        while (i < j) {
            if ((long) s[i] + s[j] <= limit) { count += j - i; i++; }   // s[i] pairs with all of i+1..j
            else j--;
        }
        return count;
    }
}
```

Examples from the screenshots: `maxRevenue([1,2,4], 4) = 11` · `visibleTowers([5,2,10,1]) = [2,2,3,1]` · `oddOneOut(["ACB","BDC","CED","DEF"]) = "DEF"`.

---

⚡ **Quick revision**: mark first, change later (bubbles) · many sources → one BFS queue · path from pairs → start at a degree-1 node · fix the middle for palindromic subsequences · log simulation → pointer + reset rule.

Back to [OA overview & top patterns](README.md) · Next: [Mock OA sets →](04-mock-oa-sets.md)
