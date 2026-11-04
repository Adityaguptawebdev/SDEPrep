# 01 — Online Assessment (HackerRank)

**Status:** **Exact** = the candidate's own examples · **Reconstructed** = the candidate didn't remember the exact wording.

| # | Question | Seen in | Reports |
|---|---|---|---|
| 1 | Minimum cores for processes (= Meeting Rooms II) | **Intern OA**, Jul 2024 | 1 |
| 2 | Counter for every index | **Intern OA**, Jul 2024 | 1 |
| 3 | Anagrams for each query | SWE / SE-II / L3 OAs, 2023–2025 | **16 (HIGH)** |
| 4 | Minimum moves in a maze, jump up to k | SWE / SE-II / L3 OAs, 2023–2025 | **15 (HIGH)** |
| 5 | Max sum with jumps of k | L2–L4 OA, Dec 2023 | 1 |
| 6 | Two pointers · heap · sieve (topics only) | On-campus fresher OA, 2024 | 1 |

Q3 and Q4 come from full-time OAs, but they come **together in almost every Wayfair OA** report, so practise them first.

---

## 1. Minimum cores (Meeting Rooms II variant)

**Source:** [LC-5454797](https://leetcode.com/discuss/post/5454797/wayfair-sde-intern-oa-l0-by-anonymous_us-xa56/), intern OA, Jul 2024 · **Exact** examples
Given `start[]` and `end[]` of processes, return the minimum number of cores. A process can reuse a core only if the earlier process **ended before** it starts.

```text
start = [1, 3, 4], end = [3, 5, 6]  → 2
start = [1, 2, 3], end = [3, 3, 5]  → 3
```

⚠️ **Trap:** in both examples, a process ending at `3` and one starting at `3` **overlap** (the end time is inclusive). On LeetCode 253 they can share a room. Read the examples carefully!

**Idea:** sort starts and ends separately. For each start, free every core whose process ended strictly before it, then take a core.

```java
import java.util.Arrays;

class MinCores {
    static int minCores(int[] start, int[] end) {
        int[] s = start.clone(), e = end.clone();
        Arrays.sort(s);
        Arrays.sort(e);
        int busy = 0, best = 0, j = 0;
        for (int st : s) {
            while (j < e.length && e[j] < st) { // ended before st → core is free (LeetCode 253: e[j] <= st)
                j++;
                busy--;
            }
            busy++;
            best = Math.max(best, busy);
        }
        return best;
    }
}
```

**Time** O(n log n) · **Space** O(n)

---

## 2. Counter for every index

**Source:** [LC-5454797](https://leetcode.com/discuss/post/5454797/wayfair-sde-intern-oa-l0-by-anonymous_us-xa56/), intern OA, Jul 2024 · **Reconstructed** wording, **Exact** example
For each `i`, walk back over every earlier element `j`. If `arr[j] < arr[i]`, add the difference; if `arr[j] > arr[i]`, subtract it. `result[i]` = the counter. `n ≤ 2·10⁶` (the O(n²) loop got TLE).

```text
arr = [2, 4, 3]  → [0, 2, 0]
```

**Key insight:** both cases add the same thing, `arr[i] − arr[j]` (subtracting `arr[j] − arr[i]` = adding `arr[i] − arr[j]`).
So `result[i] = i · arr[i] − (arr[0] + … + arr[i−1])`, which one prefix-sum pass gives in O(n).

> 💡 **Hinglish:** Dono case me same formula nikalta hai, bas `arr[i] - arr[j]` jodte jao. Isliye prefix sum se ek hi pass me ho jaata hai.

```java
class CounterSum {
    static long[] counters(int[] arr) {
        long[] result = new long[arr.length];
        long prefix = 0;                                 // arr[0] + ... + arr[i-1]
        for (int i = 0; i < arr.length; i++) {
            result[i] = (long) i * arr[i] - prefix;
            prefix += arr[i];
        }
        return result;
    }
}
```

**Time** O(n) · **Space** O(1) extra. Use `long`, because 2·10⁶ × value overflows `int`.

---

## 3. Anagrams for each query ⭐ most repeated

**Source:** [LC-5505127](https://leetcode.com/discuss/post/5505127/wayfair-software-engineer-ii-oa-by-anony-ojuu/), [LC-4666462](https://leetcode.com/discuss/post/4666462/wayfair-oa-se-2-feb-2-2024-by-anonymous_-f7wy/) + 14 more · **Exact** examples
Given `words[]` and `queries[]`: for each query, return the words that are anagrams of it, sorted alphabetically.

```text
words = ["duel","speed","dule","cars"], queries = ["spede","deul"]
→ [["speed"], ["duel","dule"]]

words = ["cat","act","allot","peach","cheap","dusty"], queries = ["study","peahc","tac"]
→ [["dusty"], ["cheap","peach"], ["act","cat"]]
```

**Idea:** two words are anagrams if their **sorted letters** are the same. Group the words by that key once, sort each group, then answer every query with a map lookup (like [LC 49 Group Anagrams](https://leetcode.com/problems/group-anagrams/)).

```java
import java.util.*;

class AnagramQueries {
    static List<List<String>> answer(String[] words, String[] queries) {
        Map<String, List<String>> groups = new HashMap<>();   // sorted letters → words
        for (String w : words) groups.computeIfAbsent(key(w), k -> new ArrayList<>()).add(w);
        for (List<String> g : groups.values()) Collections.sort(g);

        List<List<String>> result = new ArrayList<>();
        for (String q : queries) result.add(groups.getOrDefault(key(q), List.of()));
        return result;
    }

    private static String key(String s) {
        char[] c = s.toCharArray();
        Arrays.sort(c);
        return new String(c);
    }
}
```

**Time** O((W + Q) · L log L) · **Space** O(W · L). **Follow-up:** for long words, use a 26-letter count as the key instead of sorting.

---

## 4. Minimum moves in a maze, jump up to k ⭐ most repeated

**Source:** [LC-5505127](https://leetcode.com/discuss/post/5505127/wayfair-software-engineer-ii-oa-by-anony-ojuu/), [LC-6234330](https://leetcode.com/discuss/post/6234330/wayfair-hackerrank-round-by-anonymous_us-afky/) + 13 more · **Exact** examples
A grid has `0` (free) and `1` (wall). Start at `(0,0)`, reach `(n−1, m−1)`. One move = go **1 to k cells** in one of 4 directions, with **no wall on the way**. Return the minimum moves, or `−1`. `n, m, k ≤ 100`.

```text
[[0,0,0,0],
 [0,1,1,0]], k = 3  → 2   ((0,0) → (0,3) → (1,3))
[[0,0],[1,0]], k = 2 → 2
```

**Idea:** every move costs 1, so use **BFS**. From a cell, walk each direction step by step. Stop at a wall or the edge. Every new cell gets `dist + 1`. (One candidate used DFS and got TLE: BFS is the fix.)

```java
import java.util.ArrayDeque;
import java.util.Arrays;

class JumpMaze {
    static int minMoves(int[][] maze, int k) {
        int n = maze.length, m = maze[0].length;
        if (maze[0][0] == 1 || maze[n - 1][m - 1] == 1) return -1;
        int[][] dist = new int[n][m];
        for (int[] row : dist) Arrays.fill(row, -1);
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        dist[0][0] = 0;
        queue.add(new int[]{0, 0});

        while (!queue.isEmpty()) {
            int[] cur = queue.poll();
            int r = cur[0], c = cur[1];
            if (r == n - 1 && c == m - 1) return dist[r][c];
            for (int[] d : dirs) {
                for (int step = 1; step <= k; step++) {
                    int nr = r + d[0] * step, nc = c + d[1] * step;
                    if (nr < 0 || nc < 0 || nr >= n || nc >= m || maze[nr][nc] == 1) break; // wall/edge blocks the rest
                    if (dist[nr][nc] == -1) {
                        dist[nr][nc] = dist[r][c] + 1;
                        queue.add(new int[]{nr, nc});
                    }
                }
            }
        }
        return -1;
    }
}
```

**Time** O(n · m · 4k), which is ≤ 4·10⁶ here · **Space** O(n · m).

---

## 5. Max sum with jumps of k

**Source:** [LC-4440539](https://leetcode.com/discuss/post/4440539/wayfair-l2-l4-online-assesment-dec-2023-xlcd4/), L2–L4 OA, Dec 2023 · **Exact** example · same as [LC 3147](https://leetcode.com/problems/taking-maximum-energy-from-the-mystic-dungeon/)
Each node has a security value. Start at any node `x`, then jump to `x+k`, `x+2k`, … until you leave the array, adding every value. Return the best total.

```text
[2, -3, 4, 6, 1], k = 2  → 7   (2 + 4 + 1)
```

**Idea:** go from the right: `best[i] = a[i] + best[i + k]`. The answer is the max of all `best[i]`.

```java
class JumpSum {
    static long maxSum(int[] a, int k) {
        int n = a.length;
        long[] best = new long[n];
        long answer = Long.MIN_VALUE;
        for (int i = n - 1; i >= 0; i--) {
            best[i] = a[i] + (i + k < n ? best[i + k] : 0);
            answer = Math.max(answer, best[i]);
        }
        return answer;
    }
}
```

**Time** O(n) · **Space** O(n)

---

## 6. Two pointers · heap · sieve (on-campus fresher OA)

**Source:** [LC-6553789](https://leetcode.com/discuss/post/6553789/interview-wayfair-oa-technical-hr-by-ano-6awr/) / [GFG-FRESHER-25](https://www.geeksforgeeks.org/interview-experiences/wayfair-interview-experience-fresher-sde1-role/). The report names only the **topics**, so practise one classic of each:

| Topic | Practise | Key idea |
|---|---|---|
| Two pointers on a sorted array | [LC 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | sum too small → move left pointer, too big → move right |
| Heap / priority queue | [LC 215](https://leetcode.com/problems/kth-largest-element-in-an-array/) | keep a min-heap of size k; its top is the answer |
| Sieve of Eratosthenes | [LC 204](https://leetcode.com/problems/count-primes/) | cross out multiples starting from `i*i` |

```java
class Sieve {
    static int countPrimes(int n) {                     // number of primes < n
        if (n < 3) return 0;
        boolean[] composite = new boolean[n];
        int count = 0;
        for (int i = 2; i < n; i++) {
            if (composite[i]) continue;
            count++;
            for (long j = (long) i * i; j < n; j += i) composite[(int) j] = true;
        }
        return count;
    }
}
```

**Time** O(n log log n) · **Space** O(n)
