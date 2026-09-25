# DSA 6/8 — Graphs & Matrix

**Easy analogy — graph = city ka metro map**: Stations = nodes, lines = edges. "Kya A se B ja sakte hain?" → BFS/DFS. "Kam se kam kitne stops?" → BFS. "Loop mein ghoom rahe ho?" → cycle detection. "Saare stations sabse sasti wiring se jodo" → MST. Pehle **graph pehchano** (nodes kya, edges kya) — Visa ke graph questions aksar *strings* ya *cities* ke roop mein chhupe hote hain.

| # | Problem | Reporter level | Freq | Status |
|---|---|---|---|---|
| 1 | Number of Islands | **EC (10 months)** | MEDIUM (BFS-grid family: + GFG "medium BFS") | Exact |
| 2 | Word Ladder (return true/false) | **EC (1.5 YOE)**, onsite | LOW | Exact (variant) |
| 3 | Strings as a graph (last letter → first letter): detect a cycle | **EC (1.10 YOE)** | LOW | Reported |
| 4 | Reconstruct the journey from source→destination city pairs | **EC (1.10 YOE)** | LOW | Reported |
| 5 | Minimum spanning tree with Kruskal | ? (2025) | LOW | Reported |
| 6 | Fit N people in M rooms with "can't share" constraints | ? (2022 onsite) | LOW | Reported |

Spiral matrix (OA) is in [OA 3/3](../02-online-assessment/03-oa-matrix-graph-dp-simulation.md#x1-spiral-traversal--medium--low--reported--leetcode-54).

---

## 1. Number of Islands

| Field | Details |
|---|---|
| **Reported problem** | "one dsa (number of islands)" — **Exact** ([LC 200](https://leetcode.com/problems/number-of-islands/)) |
| **Source** | [LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/) · Jan 2026 · **SWE, 10 months experience** (offer) · related: "DS & Algorithms — medium-level graph problems (BFS focused)" ([GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/), 1.5 YOE, selected) |
| **Round** | Development-track round 2 (with GenAI + basic system design discussion) |
| **Difficulty** | Medium |
| **Pattern** | Flood fill (BFS or DFS) on a grid; count how many times you start a new fill |
| **Frequency** | MEDIUM (BFS family, 2 EC reports) |

**Brute force** = the optimal idea here; the only choices are BFS vs DFS vs Union-Find.

```
 1 1 0 0 0        start at (0,0) → flood (0,0),(0,1),(1,0),(1,1)  → island 1
 1 1 0 0 0        next unvisited '1' at (2,2) → flood               → island 2
 0 0 1 0 0        next at (3,3) → flood (3,3),(3,4)                → island 3
 0 0 0 1 1
```

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Islands {
    static int count(char[][] grid) {
        int rows = grid.length, cols = grid[0].length, islands = 0;
        boolean[][] seen = new boolean[rows][cols];              // don't modify the caller's grid
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] != '1' || seen[r][c]) continue;
                islands++;                                        // new island found → flood it
                Deque<int[]> queue = new ArrayDeque<>();
                queue.add(new int[]{r, c});
                seen[r][c] = true;
                while (!queue.isEmpty()) {
                    int[] cell = queue.poll();
                    for (int[] d : dirs) {
                        int nr = cell[0] + d[0], nc = cell[1] + d[1];
                        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                        if (grid[nr][nc] != '1' || seen[nr][nc]) continue;
                        seen[nr][nc] = true;                     // mark when ADDING, not when polling
                        queue.add(new int[]{nr, nc});
                    }
                }
            }
        return islands;
    }
}
```

**Time**: O(R·C). **Space**: O(R·C) for `seen` (BFS queue ≤ O(min(R, C)) wide).
**Follow-ups**: recursive DFS on a 1000×1000 grid → StackOverflowError (use BFS/iterative) · diagonal connections (8 directions) · largest island area ([LC 695](https://leetcode.com/problems/max-area-of-island/)) · islands added one by one → Union-Find ([LC 305](https://leetcode.com/problems/number-of-islands-ii/) 🔒 premium) · can you modify the input? (ask before sinking cells).
**🗣️ Interview mein aise bolo**: "Har unvisited land cell se flood fill karta hoon aur count badhata hoon. Visited ko queue mein daalte waqt mark karta hoon, warna same cell kai baar queue mein aa jaata hai. Bade grid pe recursion stack overflow kar sakti hai, isliye BFS."

---

## 2. Word Ladder (return true / false)

| Field | Details |
|---|---|
| **Reported problem** | "LeetCode Hard — word-ladder. Same problem — instead of distance, asked to return true if we can get the destination string or else false." — **Exact** (variant of [LC 127](https://leetcode.com/problems/word-ladder/)) |
| **Source** | [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) · Feb 2025 · **SWE-I, 1.5 YOE** · onsite, **pen and paper** |
| **Round** | Technical round 2 (DSA, 60 min) — followed by two O(1) maths puzzles |
| **Difficulty** | Hard (LeetCode label) — the boolean version is easier than the distance version |
| **Pattern** | Implicit graph: words are nodes, one-letter changes are edges → BFS/DFS reachability |
| **Frequency** | LOW |

**Brute force**: compare every pair of words to build edges → O(n² · L), then BFS.
**Optimal**: don't build edges; from each word try all `L × 26` one-letter changes and look them up in a `HashSet` → O(n · L · 26) lookups.

```
 begin "hit" → end "cog", dict [hot, dot, dog, lot, log, cog]
 hit → hot → dot → dog → cog      reachable → true   (distance version would return 5)
```

```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class WordLadder {
    static boolean canReach(String begin, String end, List<String> dictionary) {
        Set<String> unvisited = new HashSet<>(dictionary);
        if (!unvisited.contains(end)) return false;
        Deque<String> queue = new ArrayDeque<>();
        queue.add(begin);
        unvisited.remove(begin);
        while (!queue.isEmpty()) {
            String word = queue.poll();
            if (word.equals(end)) return true;
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (c == original) continue;
                    chars[i] = c;
                    String next = new String(chars);
                    if (unvisited.remove(next)) queue.add(next);   // remove = mark visited
                }
                chars[i] = original;
            }
        }
        return false;
    }
}
```

**Time**: O(n · L · 26 · L) (building each candidate string costs L). **Space**: O(n · L).
**Follow-ups**: shortest number of steps (count BFS levels) · print one path (store parents) · all shortest paths ([LC 126](https://leetcode.com/problems/word-ladder-ii/)) · bidirectional BFS for speed.
**🗣️ Interview mein aise bolo**: "Words nodes hain, ek letter badalna edge hai. Edges pehle se nahi banata — har word ke har position pe 26 letters try karke set mein dekhta hoon. Set se remove karna hi visited mark karna hai."

---

## 3. Strings as a graph — detect a cycle

| Field | Details |
|---|---|
| **Reported problem** | "You have been given a list of Strings where the adjacency list is built using the first and last letters: `"abc","def","cfg","gza"` — abc is connected to cfg because the last letter of abc is `c` and the first letter of cfg is `c`. The question was to find whether a cycle exists in this graph." — **Reported** (our assumption: edge `i → j` for `i ≠ j`) |
| **Source** | [LC-6772395](https://leetcode.com/discuss/post/6772395/visa-virtual-interview-se-1-by-anonymous-plas/) · May 2025 · **SE-1, 1.10 YOE** (a July 2026 blog on devbrainiac repeats the same two questions) |
| **Round** | Technical round 1 |
| **Difficulty** | Medium |
| **Pattern** | Directed graph cycle detection — DFS with 3 colours (or Kahn's topological sort) |
| **Frequency** | LOW |

```
 abc ──c──► cfg ──g──► gza ──a──► abc      cycle ✔
 def (no edges)
 colours: WHITE = not visited, GRAY = on the current DFS path, BLACK = finished
 reaching a GRAY node again = back edge = cycle
```

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class WordChainCycle {
    static boolean hasCycle(String[] words) {
        int n = words.length;
        Map<Character, List<Integer>> startsWith = new HashMap<>();
        for (int i = 0; i < n; i++) startsWith.computeIfAbsent(words[i].charAt(0), k -> new ArrayList<>()).add(i);
        int[] colour = new int[n];                                  // 0 white, 1 gray, 2 black
        for (int i = 0; i < n; i++) if (colour[i] == 0 && dfs(i, words, startsWith, colour)) return true;
        return false;
    }

    private static boolean dfs(int u, String[] words, Map<Character, List<Integer>> startsWith, int[] colour) {
        colour[u] = 1;
        char last = words[u].charAt(words[u].length() - 1);
        for (int v : startsWith.getOrDefault(last, List.of())) {
            if (v == u) continue;                                   // assumption: no self-edge
            if (colour[v] == 1) return true;                        // back edge → cycle
            if (colour[v] == 0 && dfs(v, words, startsWith, colour)) return true;
        }
        colour[u] = 2;
        return false;
    }
}
```

**Time**: O(n + E) where E can be O(n²) (every word ending with `a` links to every word starting with `a`). **Space**: O(n + E).
**Follow-ups**: should `"aba"` alone count as a cycle? (self-edge — **ask**) · huge n → model **letters as 26 nodes and words as edges** (O(n + 26)) · can all words form **one** circle? (Euler circuit on the letter graph: every letter has in-degree = out-degree, and all used letters are connected) · print the cycle.
**🗣️ Interview mein aise bolo**: "Yeh directed graph hai: word u se word v tak edge agar u ka last letter = v ka first. Cycle ke liye DFS with colours — jo node abhi current path pe hai (gray) wahan dobara pahunche toh cycle. Bade input pe letters ko node bana deta hoon."

---

## 4. Reconstruct the journey from source → destination pairs

| Field | Details |
|---|---|
| **Reported problem** | `"Mumbai" → "Bangalore", "Goa" → "Dehradun", "Calcutta" → "Mumbai", "Dehradun" → "Calcutta"` — find the starting city that completes the travel of all cities; answer `Goa → Dehradun → Calcutta → Mumbai → Bangalore`. "I told the graph approach using DFS, but there is also one HashSet approach." — **Reported** |
| **Source** | [LC-6772395](https://leetcode.com/discuss/post/6772395/visa-virtual-interview-se-1-by-anonymous-plas/) · May 2025 · **SE-1, 1.10 YOE** |
| **Round** | Technical round 2 (same day as round 1) |
| **Difficulty** | Easy-Medium |
| **Pattern** | HashMap `from → to` + HashSet of destinations: the start is the only source that is never a destination (similar: [LC 1436](https://leetcode.com/problems/destination-city/), harder: [LC 332](https://leetcode.com/problems/reconstruct-itinerary/)) |
| **Frequency** | LOW |

**Brute force**: try each city as the start and follow the tickets — O(n²).
**Optimal**: O(n) with a map and a set.

```
 destinations = {Bangalore, Dehradun, Mumbai, Calcutta}
 sources      = {Mumbai, Goa, Calcutta, Dehradun}
 source not in destinations → Goa = start → follow the map
```

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

class JourneyReconstruction {
    static List<String> route(String[][] tickets) {
        Map<String, String> next = new HashMap<>();
        Set<String> destinations = new HashSet<>();
        for (String[] t : tickets) {
            next.put(t[0], t[1]);
            destinations.add(t[1]);
        }
        String start = null;
        for (String from : next.keySet()) if (!destinations.contains(from)) start = from;
        List<String> path = new ArrayList<>();
        if (start == null) return path;                           // circular route: no unique start
        for (String city = start; city != null; city = next.get(city)) {
            path.add(city);
            if (path.size() > tickets.length + 1) break;          // guard against bad input loops
        }
        return path;
    }
}
```

**Time**: O(n). **Space**: O(n).
**Follow-ups**: the same city visited twice / multiple tickets from one city (→ Hierholzer, [LC 332](https://leetcode.com/problems/reconstruct-itinerary/)) · circular trip (no start) · missing ticket (path shorter than n + 1 → report invalid).
**🗣️ Interview mein aise bolo**: "Jo city kabhi kisi ticket ki destination nahi hai, wahi journey ki shuruaat hai. Set se O(n) mein start mil gaya, phir map follow karta hoon."

---

## 5. Minimum spanning tree with Kruskal

| Field | Details |
|---|---|
| **Reported problem** | "A coding question — graph based MST question involving Kruskal Algorithm" — **Reported** (after a DB-design question on datacenters/servers/microservices) |
| **Source** | [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/) · Mar 2025 · level not stated · rejected — "prepare for the worse scenario" |
| **Round** | Technical round 1 |
| **Difficulty** | Medium |
| **Pattern** | Sort edges by weight + Union-Find (DSU) to skip edges that make a cycle |
| **Frequency** | LOW |

**Visa-flavoured framing**: "connect all datacenters with the cheapest set of network links" — that's an MST ([LC 1584 Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)).

```
 edges sorted: (A-B,1) (B-C,2) (A-C,3) (C-D,4)
 take A-B ✔  take B-C ✔  A-C? A and C already connected → skip  take C-D ✔
 MST weight = 1 + 2 + 4 = 7
```

```java
import java.util.Arrays;

class KruskalMst {
    static long mstWeight(int n, int[][] edges) {                 // edges: {u, v, w}, nodes 0..n-1
        int[][] e = edges.clone();
        Arrays.sort(e, (x, y) -> Integer.compare(x[2], y[2]));
        int[] parent = new int[n], rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        long total = 0;
        int used = 0;
        for (int[] edge : e) {
            int a = find(parent, edge[0]), b = find(parent, edge[1]);
            if (a == b) continue;                                 // would create a cycle
            if (rank[a] < rank[b]) { int t = a; a = b; b = t; }
            parent[b] = a;                                        // union by rank
            if (rank[a] == rank[b]) rank[a]++;
            total += edge[2];
            if (++used == n - 1) break;
        }
        return used == n - 1 ? total : -1;                        // -1: graph not connected
    }

    static int find(int[] parent, int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];                        // path halving
            x = parent[x];
        }
        return x;
    }
}
```

**Time**: O(E log E). **Space**: O(V).
**Follow-ups**: Prim's algorithm (heap; better for dense graphs) · why is the greedy choice safe? (cut property) · what if the graph is disconnected (minimum spanning forest).
**🗣️ Interview mein aise bolo**: "Sabse sasti edge pehle — jab tak woh cycle na banaye. Cycle check DSU se almost O(1). V−1 edges ho gayi toh ruk jaata hoon."

---

## 6. Fit N people in M rooms with "can't share" constraints

| Field | Details |
|---|---|
| **Reported problem** | "Accommodate N people in M rooms with k constraints such that two people can't be in the same room. Return true if they can be accommodated. N=3, M=2, k={1,2},{3,2} → true. I was asked to solve this in 12 minutes." — **Reported** |
| **Source** | [LC-2646406](https://leetcode.com/discuss/post/2646406/visa-onsite-by-anonymous_user-vp3y/) · Oct 2022 · onsite · level not stated (older) |
| **Difficulty** | Medium (it is **graph m-colouring**, NP-hard in general → backtracking for small N) |
| **Pattern** | Constraint graph + backtracking colouring |

```java
import java.util.ArrayList;
import java.util.List;

class RoomColouring {
    static boolean canAccommodate(int n, int m, int[][] cannotShare) {     // people 1..n
        List<List<Integer>> conflicts = new ArrayList<>();
        for (int i = 0; i <= n; i++) conflicts.add(new ArrayList<>());
        for (int[] c : cannotShare) { conflicts.get(c[0]).add(c[1]); conflicts.get(c[1]).add(c[0]); }
        return assign(1, n, m, new int[n + 1], conflicts);
    }

    private static boolean assign(int person, int n, int m, int[] room, List<List<Integer>> conflicts) {
        if (person > n) return true;
        for (int r = 1; r <= m; r++) {
            boolean ok = true;
            for (int other : conflicts.get(person)) if (room[other] == r) { ok = false; break; }
            if (!ok) continue;
            room[person] = r;
            if (assign(person + 1, n, m, room, conflicts)) return true;
            room[person] = 0;                                     // backtrack
        }
        return false;
    }
}
```

**Time**: O(mⁿ) worst case (fine for small N). **Special case to mention**: `M = 2` → just check if the conflict graph is **bipartite** with BFS in O(N + K) ([LC 886](https://leetcode.com/problems/possible-bipartition/)).

---

⚡ **Quick revision**: grid = graph (flood fill) · word changes = implicit graph (try 26 letters, HashSet lookup) · directed cycle = 3-colour DFS · journey start = source that's never a destination · MST = sort edges + DSU · "can't be together" + 2 groups = bipartite check.

Next: [DSA 7/8 — Dynamic programming →](07-dynamic-programming.md)
