# 20. Graph Algorithms (Topological Sort, Shortest Path, MST, Bipartite)

> Pehle ye aane chahiye: [Graph Basics](../00-syllabus/05-graphs/19-graph-basics.md), [Topological Sort](../00-syllabus/05-graphs/20-topological-sort.md), [Shortest Path](../00-syllabus/05-graphs/22-shortest-path.md), [MST](../00-syllabus/05-graphs/23-minimum-spanning-tree.md), [BFS](11-bfs.md), [Union-Find](15-union-find.md)

> **Standard definition**: Algorithms operating on graphs (nodes + edges) to solve problems like ordering nodes respecting dependencies (topological sort) or finding minimum-cost paths (shortest path algorithms like Dijkstra/Bellman-Ford).

**Ek line mein**: Jab problem mein **"dependencies"** (X, Y se pehle hona chahiye) ya **"shortest/cheapest path"** ka zikar ho, ye graph algorithms yaad karo — BFS/DFS se aage ka level hai. Sabse zaroori kaam: **sahi algorithm chunna** (neeche ka flowchart).

**Trick yaad rakhne ki**: *"College ke prerequisite courses"* — "Data Structures" lene se pehle "Programming Basics" lena zaroori hai. Isi dependency order ko nikalna **Topological Sort** hai. Aur "sabse sasta raasta" dhoondhna (jaha edges ka apna "cost/weight" hai) **Dijkstra/Bellman-Ford** hai.

```
Sawaal graph pe hai — kaunsa algorithm?
 │
 ├─ "order / dependency / cycle (directed)"              →  ① Topological Sort  (Kahn, in-degree)
 ├─ "shortest path"
 │     ├─ edges unweighted (sab barabar)                 →  BFS  (pattern 11)
 │     ├─ weights ≥ 0                                    →  ② Dijkstra   (sirf 0/1 weights → 0-1 BFS)
 │     ├─ negative weights  /  "at most K edges"         →  ③ Bellman-Ford
 │     └─ SAARE pairs (n ≤ ~400)                         →  ④ Floyd-Warshall
 ├─ "sab nodes ko sabse sasti edges se jodo"             →  ⑤ MST  (Prim / Kruskal + Union-Find)
 ├─ "do groups mein baanto / 2-colorable"                →  ⑥ Bipartite  (coloring)
 └─ "connected? components? cycle (undirected)?"         →  DFS / Union-Find  (patterns 12, 15)
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Nodes + edges ka structure  (cities-roads, courses-prerequisites, computers-cables, people-relations)
✅ "Pehle ye, phir wo" (dependency)  /  "minimum cost / time / hops"  /  "sab jud gaye kya?"
```

| Sawaal ki bhasha | Algorithm |
|---|---|
| "**course order**", "**build order**", "**cycle hai to impossible**", "**alien dictionary**" | ① **Topological Sort** |
| "**minimum time / cost source se sab tak**" (weights ≥ 0) | ② **Dijkstra** |
| "**at most K stops**", "**negative weight**", "**negative cycle?**" | ③ **Bellman-Ford** |
| "**har pair ke beech** shortest", n chhota | ④ **Floyd-Warshall** |
| "**sab nodes ko sabse sasta jodo**" | ⑤ **MST** (Prim / Kruskal) |
| "**do teams**", "**dislike pairs**", "**odd cycle?**" | ⑥ **Bipartite** |

### ❌ Kab NAHI
- **Unweighted** shortest path → seedha [BFS](11-bfs.md) (Dijkstra overkill).
- **Undirected** graph mein "order" → topological sort sirf **directed acyclic** ke liye.
- **Negative weight** ho toh Dijkstra **galat** — Bellman-Ford.

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. GRAPH     →  adjacency list banao:  directed ya undirected?  weights?  (edge list → list of lists)
2. INIT      →  in-degree[] = 0 / dist[] = ∞ (dist[src] = 0) / color[] = 0 / visited[]
3. STRUCTURE →  Queue (Kahn, BFS)   /   PriorityQueue {node, dist} (Dijkstra)   /   K rounds (Bellman-Ford)
4. RULE      →  in-degree 0 → queue mein   /   relax:  dist[u] + w < dist[v]   /   padosi ka opposite color
5. ANSWER    →  order.size() == n?   /   max(dist) ya dist[dst]   /   kya koi node unreachable (∞)?
```

**Teen skeleton** (yehi likhna hai):

```
KAHN (topological):                      DIJKSTRA:                                    BELLMAN-FORD (K edges tak):
indeg[v] = incoming edges                dist[src] = 0;  heap.add({src, 0})           dist = ∞;  dist[src] = 0
queue = { v : indeg[v] == 0 }            while heap not empty:                        repeat K (ya V−1) baar:
while queue:                                 (u, d) = heap.poll()                         next = copy of dist      # 🔑 pichhla round
    u = queue.poll();  order.add(u)          if d > dist[u]: continue    # 🔑 stale     for (u, v, w) in edges:
    for v in adj[u]:                         for (v, w) in adj[u]:                            if dist[u] + w < next[v]: next[v] = dist[u] + w
        if --indeg[v] == 0: queue.add(v)         if d + w < dist[v]:                      dist = next
order.size() < n  →  CYCLE                           dist[v] = d + w;  heap.add({v, dist[v]})
```

**Do ratta:**
1. **Dijkstra mein poll ke baad `if (d > dist[u]) continue;`** — purani (stale) entries chhodo.
2. **Bellman-Ford K-limit mein `dist` ka copy** — same round ke naye values mat use karo.
3. **Floyd mein `k` sabse bahar** wala loop.

---

## 3. ① Topological Sort — Kahn (in-degree BFS)

**Idea**: `inDegree[i]` = course `i` ke **kitne prerequisites bache hain**. Jinka `0` hai unhe turant le sakte hain (queue). Ek course complete → uspe depend karne walon ka `inDegree` **ghatao**; jiska `0` ho gaya wo bhi ready. Agar end mein sab complete nahi hue → **cycle**.

```
courses 0..3,  [1,0] [2,0] [3,1] [3,2]     (a,b = "a lene se pehle b")   edges: 0→1, 0→2, 1→3, 2→3

inDegree: 0:0  1:1  2:1  3:2
queue [0]  →  0 nikla (order: 0)      1 aur 2 ka inDegree 0 → queue [1, 2]
           →  1 nikla (0,1)            3 ka inDegree 2 → 1
           →  2 nikla (0,1,2)          3 ka inDegree 0 → queue [3]
           →  3 nikla (0,1,2,3)        done == 4 ✓   →  order = [0, 1, 2, 3]  (koi bhi valid order chalta hai)
```

```java
// Course Schedule — kya saare courses ho sakte hain (cycle nahi)?
public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] inDegree = new int[numCourses];                              // 🔑 har course ke "kitne prerequisites bache"
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        graph.get(p[1]).add(p[0]);                                     // p[1] → p[0]  (p[1] pehle chahiye)
        inDegree[p[0]]++;
    }
    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.add(i);                            // jinka koi prerequisite nahi
    }
    int done = 0;
    while (!queue.isEmpty()) {
        int course = queue.poll();
        done++;
        for (int next : graph.get(course)) {
            if (--inDegree[next] == 0) queue.add(next);                // 🔑 ab sab prerequisites poore → ready
        }
    }
    return done == numCourses;                                         // kam → CYCLE
}

// Course Schedule II — ek valid order (cycle ho toh khaali)
public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] inDegree = new int[numCourses];
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        graph.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }
    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.add(i);
    }
    int[] order = new int[numCourses];
    int idx = 0;
    while (!queue.isEmpty()) {
        int course = queue.poll();
        order[idx++] = course;                                         // 🔑 nikalne ka order hi topological order
        for (int next : graph.get(course)) {
            if (--inDegree[next] == 0) queue.add(next);
        }
    }
    return idx == numCourses ? order : new int[0];
}

// Alien Dictionary — sorted words se letters ka order (edge = pehla alag akshar)
public String alienOrder(String[] words) {
    Map<Character, Set<Character>> graph = new HashMap<>();
    Map<Character, Integer> inDegree = new HashMap<>();
    for (String w : words) {
        for (char c : w.toCharArray()) {
            graph.putIfAbsent(c, new HashSet<>());
            inDegree.putIfAbsent(c, 0);
        }
    }
    for (int i = 0; i + 1 < words.length; i++) {
        String a = words[i], b = words[i + 1];
        if (a.length() > b.length() && a.startsWith(b)) return "";     // 🔑 "abc" ke baad "ab" — invalid
        for (int j = 0; j < Math.min(a.length(), b.length()); j++) {
            if (a.charAt(j) != b.charAt(j)) {                          // 🔑 pehla farak = ek constraint a[j] < b[j]
                if (graph.get(a.charAt(j)).add(b.charAt(j))) inDegree.merge(b.charAt(j), 1, Integer::sum);
                break;                                                 // baaki akshar kuch nahi batate
            }
        }
    }
    Deque<Character> queue = new ArrayDeque<>();
    for (Map.Entry<Character, Integer> e : inDegree.entrySet()) {
        if (e.getValue() == 0) queue.add(e.getKey());
    }
    StringBuilder sb = new StringBuilder();
    while (!queue.isEmpty()) {
        char c = queue.poll();
        sb.append(c);
        for (char next : graph.get(c)) {
            if (inDegree.merge(next, -1, Integer::sum) == 0) queue.add(next);
        }
    }
    return sb.length() == inDegree.size() ? sb.toString() : "";        // sab akshar nahi aaye → cycle
}

// Minimum Height Trees — leaves ko parat-dar-parat hatao, aakhri 1-2 nodes = centers
public List<Integer> findMinHeightTrees(int n, int[][] edges) {
    if (n == 1) return Collections.singletonList(0);
    List<Set<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new HashSet<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    List<Integer> leaves = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if (adj.get(i).size() == 1) leaves.add(i);
    }
    int remaining = n;
    while (remaining > 2) {                                            // 🔑 2 se zyada nodes → leaves hatate jao
        remaining -= leaves.size();
        List<Integer> next = new ArrayList<>();
        for (int leaf : leaves) {
            int neighbor = adj.get(leaf).iterator().next();
            adj.get(neighbor).remove(leaf);
            if (adj.get(neighbor).size() == 1) next.add(neighbor);     // wo bhi ab leaf ban gaya
        }
        leaves = next;
    }
    return leaves;
}

// Find Eventual Safe States — ulta graph pe topological sort (terminal nodes se shuru)
public List<Integer> eventualSafeNodes(int[][] graph) {
    int n = graph.length;
    List<List<Integer>> reverse = new ArrayList<>();
    int[] outDegree = new int[n];
    for (int i = 0; i < n; i++) reverse.add(new ArrayList<>());
    for (int u = 0; u < n; u++) {
        outDegree[u] = graph[u].length;
        for (int v : graph[u]) reverse.get(v).add(u);                  // 🔑 edges ulti
    }
    Deque<Integer> queue = new ArrayDeque<>();
    for (int u = 0; u < n; u++) {
        if (outDegree[u] == 0) queue.add(u);                           // terminal node = safe
    }
    boolean[] safe = new boolean[n];
    while (!queue.isEmpty()) {
        int u = queue.poll();
        safe[u] = true;
        for (int parent : reverse.get(u)) {
            if (--outDegree[parent] == 0) queue.add(parent);           // parent ke saare raaste safe pe khatam
        }
    }
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if (safe[i]) result.add(i);
    }
    return result;
}
```

---

## 4. ② Dijkstra — weights ≥ 0, single source

**Idea**: **Sabse kam dist wala node** pehle finalize karo (min-heap). Uske padosiyon ko **relax** karo: `dist[u] + w < dist[v]` toh update. Ek node ki `dist` **jab heap se nikle tab final** (kyunki weights ≥ 0).

```
Network Delay Time   times = [[2,1,1],[2,3,1],[3,4,1]],  n = 4,  k = 2

dist = [_, ∞, 0, ∞, ∞]          heap [(2,0)]
poll (2,0):   1 → 0+1 = 1 ✓   3 → 0+1 = 1 ✓                  heap [(1,1),(3,1)]
poll (1,1):   1 ke koi outgoing nahi
poll (3,1):   4 → 1+1 = 2 ✓                                  heap [(4,2)]
poll (4,2):   done       →  dist = [_,1,0,1,2]  →  sabse door = 2  (aakhri node tak signal 2 mein)

Stale entry:  ek node do baar heap mein aa sakta hai (pehle bada dist, phir chhota mila).
              poll pe  d > dist[u]  ho toh ye purani hai → chhod do.
```

```java
// Network Delay Time — k se sab tak signal kitne time mein (sab na pahunche toh -1)
public int networkDelayTime(int[][] times, int n, int k) {
    List<List<int[]>> graph = new ArrayList<>();
    for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());         // nodes 1..n
    for (int[] t : times) graph.get(t[0]).add(new int[]{t[1], t[2]});  // {to, weight}
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));   // {node, dist}
    heap.add(new int[]{k, 0});
    while (!heap.isEmpty()) {
        int[] cur = heap.poll();
        int u = cur[0], d = cur[1];
        if (d > dist[u]) continue;                                     // 🔑 purani (stale) entry
        for (int[] e : graph.get(u)) {
            int v = e[0], nd = d + e[1];
            if (nd < dist[v]) {                                        // 🔑 relax
                dist[v] = nd;
                heap.add(new int[]{v, nd});
            }
        }
    }
    int max = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == Integer.MAX_VALUE) return -1;                   // koi node tak pahunch hi nahi paya
        max = Math.max(max, dist[i]);
    }
    return max;
}

// Path With Minimum Effort — grid; path ka cost = raaste ka sabse bada |height difference| (sum nahi)
public int minimumEffortPath(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    int[][] effort = new int[m][n];
    for (int[] row : effort) Arrays.fill(row, Integer.MAX_VALUE);
    effort[0][0] = 0;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[2], b[2]));   // {r, c, effort}
    heap.add(new int[]{0, 0, 0});
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!heap.isEmpty()) {
        int[] cur = heap.poll();
        int r = cur[0], c = cur[1];
        if (cur[2] > effort[r][c]) continue;
        if (r == m - 1 && c == n - 1) return cur[2];
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
            int cost = Math.max(cur[2], Math.abs(heights[nr][nc] - heights[r][c]));   // 🔑 sum nahi, max
            if (cost < effort[nr][nc]) {
                effort[nr][nc] = cost;
                heap.add(new int[]{nr, nc, cost});
            }
        }
    }
    return 0;
}

// Path with Maximum Probability — max-heap, probabilities ka product
public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
    List<List<double[]>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int i = 0; i < edges.length; i++) {
        graph.get(edges[i][0]).add(new double[]{edges[i][1], succProb[i]});
        graph.get(edges[i][1]).add(new double[]{edges[i][0], succProb[i]});
    }
    double[] best = new double[n];
    best[start] = 1.0;
    PriorityQueue<double[]> heap = new PriorityQueue<>((a, b) -> Double.compare(b[1], a[1]));   // 🔑 MAX-heap
    heap.add(new double[]{start, 1.0});
    while (!heap.isEmpty()) {
        double[] cur = heap.poll();
        int u = (int) cur[0];
        if (u == end) return cur[1];
        if (cur[1] < best[u]) continue;                                // stale
        for (double[] e : graph.get(u)) {
            int v = (int) e[0];
            double p = cur[1] * e[1];                                  // product (probabilities ≤ 1 → ghatti hi hai)
            if (p > best[v]) {
                best[v] = p;
                heap.add(new double[]{v, p});
            }
        }
    }
    return 0.0;
}
```

**"Cost" alag bhi ho sakta hai**: sum (normal), **max** edge (Minimum Effort), **product** (Probability) — bas relax rule badalta hai, structure wahi.

**0/1 weights ho toh**: **0-1 BFS** — `Deque`, weight-0 edge → `addFirst`, weight-1 → `addLast`. Heap ki zaroorat nahi (O(V + E)).

---

## 5. ③ Bellman-Ford — negative weights / at most K edges

**Idea**: Har round mein **saari edges relax** karo. `r` rounds ke baad `dist[v]` = **at most `r` edges** wale raaste ka best. Isliye "**K stops = K+1 edges**" ke liye **K+1 rounds**. **Har round mein `dist` ki copy** se padho taaki ek round mein ek hi edge badhe.

```
Cheapest Flights Within K Stops:  n=4, flights [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3

k = 1 (2 edges tak):   round 1:  dist = [0, 100, ∞, ∞]
                       round 2:  dist = [0, 100, 200, 700]        →  answer 700  (0→1→3)
k = 2 (3 edges tak):   round 3:  dist[3] = min(700, 200 + 200) = 400   →  answer 400  (0→1→2→3)

Copy kyun?  round 2 mein 1→2 se dist[2] = 200 bana; agar usi round mein 2→3 bhi chala dete toh 3 edges ho jati (K ke bahar).

Negative cycle:  V−1 rounds ke baad bhi koi relax ho jaye  →  negative cycle hai
```

```java
// Cheapest Flights Within K Stops
public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int INF = Integer.MAX_VALUE / 2;
    int[] dist = new int[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    for (int round = 0; round <= k; round++) {                         // 🔑 k stops = k+1 edges = k+1 rounds
        int[] next = dist.clone();                                     // 🔑 pichhle round ki values se hi kaam
        for (int[] f : flights) {
            if (dist[f[0]] != INF && dist[f[0]] + f[2] < next[f[1]]) {
                next[f[1]] = dist[f[0]] + f[2];
            }
        }
        dist = next;
    }
    return dist[dst] >= INF ? -1 : dist[dst];
}

// Negative cycle hai kya? (edges: {u, v, w}, directed)
public boolean hasNegativeCycle(int n, int[][] edges) {
    int[] dist = new int[n];                                           // sab 0 se shuru: har component ka cycle pakde
    for (int round = 0; round < n; round++) {
        boolean changed = false;
        for (int[] e : edges) {
            if (dist[e[0]] + e[2] < dist[e[1]]) {
                dist[e[1]] = dist[e[0]] + e[2];
                changed = true;
            }
        }
        if (!changed) return false;                                    // stable → koi negative cycle nahi
    }
    return true;                                                       // 🔑 n rounds ke baad bhi sudhar → negative cycle
}
```

---

## 6. ④ Floyd-Warshall — saare pairs ka shortest

**Idea**: `d[i][j]` = `i` se `j` tak ka best. Har `k` ke liye pucho: *"kya `k` ke through jaana behtar hai?"* → `d[i][j] = min(d[i][j], d[i][k] + d[k][j])`. **`k` sabse bahar** — matlab "ab tak sirf nodes `0..k` beech mein use ho sakte hain".

```
n ≤ ~400 (O(n³));   n = 4 ke liye  64 steps
d[i][i] = 0,  edge (u,v,w) pe d[u][v] = w,  baaki ∞

Find the City ...:  har city ke liye  d[i][j] <= threshold wale cities gino;  sabse kam count wali city (tie → bada index)
```

```java
// Find the City With the Smallest Number of Neighbors at a Threshold Distance
public int findTheCity(int n, int[][] edges, int distanceThreshold) {
    int INF = 1_000_000;
    int[][] d = new int[n][n];
    for (int[] row : d) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) d[i][i] = 0;
    for (int[] e : edges) {
        d[e[0]][e[1]] = Math.min(d[e[0]][e[1]], e[2]);                 // parallel edges mein sabse chhoti
        d[e[1]][e[0]] = Math.min(d[e[1]][e[0]], e[2]);                 // undirected
    }
    for (int k = 0; k < n; k++) {                                      // 🔑 k SABSE BAHAR
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
            }
        }
    }
    int best = -1, bestCount = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            if (i != j && d[i][j] <= distanceThreshold) count++;
        }
        if (count <= bestCount) {                                      // 🔑 <= : tie mein bada index
            bestCount = count;
            best = i;
        }
    }
    return best;
}
```

---

## 7. ⑤ MST — Minimum Spanning Tree (Prim)

**Idea**: **Sab nodes ko jodne wali** sabse sasti edges ka set (koi cycle nahi, `n − 1` edges). Do tareeke: **Kruskal** (edges sort + [Union-Find](15-union-find.md)) aur **Prim** (ek node se shuru, heap se sabse sasti edge jo **bahar ke node** tak jaye).

```
Prim:   tree = {0}.  heap mein 0 ke edges.  poll sabse sasti edge (u→v):  v tree mein nahi → v jodo, cost += w, v ki edges heap mein.
Kruskal: saari edges sort → sasti se shuru → agar do alag groups jude (union true) → lo.

Kab kaun?   edge list di hai / sparse → Kruskal (UF)        dense graph (points, har pair) → Prim ya Kruskal dono
```

```java
// Min Cost to Connect All Points — Prim (Manhattan distance)
public int minCostConnectPoints(int[][] points) {
    int n = points.length, cost = 0, taken = 0;
    boolean[] inTree = new boolean[n];
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));   // {node, edge weight}
    heap.add(new int[]{0, 0});
    while (taken < n) {
        int[] cur = heap.poll();
        int u = cur[0];
        if (inTree[u]) continue;                                       // 🔑 pehle hi tree mein — purani entry
        inTree[u] = true;
        cost += cur[1];
        taken++;
        for (int v = 0; v < n; v++) {
            if (!inTree[v]) {
                int dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                heap.add(new int[]{v, dist});                          // tree se v tak ki edge
            }
        }
    }
    return cost;
}
```

---

## 8. ⑥ Bipartite — 2-coloring

**Idea**: Graph **bipartite** hai agar nodes ko **2 colors** mein rang sako ki **har edge ke dono end alag color** ke ho. BFS/DFS se rang do: padosi ko **ulta color**; agar padosi pehle se **same color** ka mila → **odd cycle** → bipartite nahi.

```
Square (0-1-2-3-0):  0=A 1=B 2=A 3=B  ✓ bipartite           Triangle (0-1-2-0):  0=A 1=B 2=? (0 se A, 1 se A) ✗

Possible Bipartition:  "dislike" pairs alag group mein hone chahiye  →  dislike graph bipartite ho toh hi possible
```

```java
// Is Graph Bipartite? — graph[u] = padosi
public boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];                                          // 0 = abhi rang nahi, 1 / −1 = do colors
    for (int s = 0; s < n; s++) {                                      // disconnected graph ke liye har component
        if (color[s] != 0) continue;
        color[s] = 1;
        Deque<Integer> queue = new ArrayDeque<>();
        queue.add(s);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : graph[u]) {
                if (color[v] == 0) {
                    color[v] = -color[u];                              // 🔑 padosi ko ulta color
                    queue.add(v);
                } else if (color[v] == color[u]) {
                    return false;                                      // 🔑 same color padosi → odd cycle
                }
            }
        }
    }
    return true;
}

// Possible Bipartition — people 1..n, dislikes edges
public boolean possibleBipartition(int n, int[][] dislikes) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] d : dislikes) {
        adj.get(d[0] - 1).add(d[1] - 1);
        adj.get(d[1] - 1).add(d[0] - 1);
    }
    int[][] graph = new int[n][];
    for (int i = 0; i < n; i++) {
        graph[i] = new int[adj.get(i).size()];
        for (int j = 0; j < graph[i].length; j++) graph[i][j] = adj.get(i).get(j);
    }
    return isBipartite(graph);
}
```

---

## 9. Sab ek nazar mein

| Algorithm | Kab | Time | Structure | Yaad |
|---|---|---|---|---|
| ① Kahn (topological) | DAG order / cycle | O(V + E) | Queue + in-degree | `order.size() < n` → cycle |
| ② Dijkstra | weights ≥ 0, ek source | O((V + E) log V) | Min-heap `{node, dist}` | stale check `d > dist[u]` |
| ③ Bellman-Ford | negative / at most K edges | O(V · E) | K rounds + copy | negative cycle = V-th round mein sudhar |
| ④ Floyd-Warshall | saare pairs | O(V³) | 3 loops, **k bahar** | `d[i][i] = 0`, INF |
| ⑤ MST (Prim / Kruskal) | sab jodo, min cost | O(E log V) | heap / sort + UF | `n − 1` edges |
| ⑥ Bipartite | 2 groups | O(V + E) | BFS/DFS colors | same color padosi → nahi |

## Common galtiyan

- **Negative weight pe Dijkstra** — galat; Bellman-Ford.
- **Stale entries** (`d > dist[u]`) skip na karna — time badh jata hai (kabhi galat bhi).
- **`Integer.MAX_VALUE + w` overflow** — INF ko `MAX / 2` rakho ya check karo (`dist[u] != INF`).
- **Bellman-Ford K-limit mein copy na lena** — ek round mein kai edges chal jati hain.
- **Floyd mein loop order** — `k` sabse bahar, warna galat.
- **Topological sort mein edge direction ulti** — `[a, b]` ka matlab "b pehle" → edge `b → a`.
- **Disconnected graph** (bipartite, topological, MST) — har component handle karo.
- **Node numbering 1-indexed** — `n + 1` size ya `-1` shift.
- **Parallel edges / self loops** — matrix mein `min` lo; adjacency list mein sab rakho.
- **Undirected graph mein Kahn** — kaam nahi karta (in-degree ka matlab hi directed hai).

> 💡 **Interview mein bolne wali line**: *"Yahan [dependencies / weighted shortest path / connect-all] hai, isliye [Kahn / Dijkstra / Prim]. Weights non-negative hain isliye Dijkstra valid hai; O((V+E) log V). Cycle ho toh Kahn mein `order.size() < n` se pakad lunga."*

## Practice — algorithm ke hisaab se (easy se hard)

| # | Problem | Algorithm | Difficulty | Link |
|---|---|---|---|---|
| 1 | Course Schedule | ① Topological | Medium | [leetcode.com/problems/course-schedule](https://leetcode.com/problems/course-schedule/) |
| 2 | Course Schedule II | ① Topological | Medium | [leetcode.com/problems/course-schedule-ii](https://leetcode.com/problems/course-schedule-ii/) |
| 3 | Find Eventual Safe States | ① Topological (reverse) | Medium | [leetcode.com/problems/find-eventual-safe-states](https://leetcode.com/problems/find-eventual-safe-states/) |
| 4 | Minimum Height Trees | ① Topological-jaisa (leaves) | Medium | [leetcode.com/problems/minimum-height-trees](https://leetcode.com/problems/minimum-height-trees/) |
| 5 | Parallel Courses 🔒 | ① Topological (levels) | Medium | [leetcode.com/problems/parallel-courses](https://leetcode.com/problems/parallel-courses/) |
| 6 | Alien Dictionary 🔒 | ① Topological | Hard | [leetcode.com/problems/alien-dictionary](https://leetcode.com/problems/alien-dictionary/) |
| 7 | Network Delay Time | ② Dijkstra | Medium | [leetcode.com/problems/network-delay-time](https://leetcode.com/problems/network-delay-time/) |
| 8 | Path with Maximum Probability | ② Dijkstra (max-heap) | Medium | [leetcode.com/problems/path-with-maximum-probability](https://leetcode.com/problems/path-with-maximum-probability/) |
| 9 | Path With Minimum Effort | ② Dijkstra (max edge) | Medium | [leetcode.com/problems/path-with-minimum-effort](https://leetcode.com/problems/path-with-minimum-effort/) |
| 10 | Swim in Rising Water | ② Dijkstra (max cell) | Hard | [leetcode.com/problems/swim-in-rising-water](https://leetcode.com/problems/swim-in-rising-water/) |
| 11 | Minimum Cost to Make at Least One Valid Path in a Grid | ② 0-1 BFS | Hard | [leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/) |
| 12 | Cheapest Flights Within K Stops | ③ Bellman-Ford | Medium | [leetcode.com/problems/cheapest-flights-within-k-stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) |
| 13 | Find the City With the Smallest Number of Neighbors at a Threshold Distance | ④ Floyd-Warshall | Medium | [leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) |
| 14 | Min Cost to Connect All Points | ⑤ MST (Prim/Kruskal) | Medium | [leetcode.com/problems/min-cost-to-connect-all-points](https://leetcode.com/problems/min-cost-to-connect-all-points/) |
| 15 | Is Graph Bipartite? | ⑥ Bipartite | Medium | [leetcode.com/problems/is-graph-bipartite](https://leetcode.com/problems/is-graph-bipartite/) |
| 16 | Possible Bipartition | ⑥ Bipartite | Medium | [leetcode.com/problems/possible-bipartition](https://leetcode.com/problems/possible-bipartition/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Graph directed/weighted? Kaunsa algorithm (flowchart)? Structure (queue / heap / rounds)? Relax rule? Answer kahan?"* — phir code.

---

## Sab 20 patterns ho gaye

Ye 20 patterns hi 90% LeetCode problems cover karte hain — jab bhi koi naya problem dekho, sabse pehle poocho **"ye kaunse pattern jaisa lag raha hai?"** Pattern pehchan lo, phir uski **recipe** (har note mein "Code likhne ki recipe") se code likhna bahut aasan ho jata hai.

**Sawaal ki bhasha → pattern (ek nazar mein):**

| Sawaal mein ye dikhe | Pattern |
|---|---|
| contiguous **subarray/substring** + window condition | [01 Sliding Window](01-sliding-window.md) |
| **sorted** array, pair/triplet, ya dono taraf se | [02 Two Pointers](02-two-pointers.md) |
| **linked list** cycle / middle / nth from end | [03 Fast & Slow](03-fast-slow-pointers.md) |
| **intervals** overlap / merge / rooms | [04 Merge Intervals](04-merge-intervals.md) |
| `1..n` ka array, **missing / duplicate** | [05 Cyclic Sort](05-cyclic-sort.md) |
| **k-th** / top k / k closest | [06 Top K Elements](06-top-k-elements.md) |
| **range sum** / subarray sum = k | [07 Prefix Sum](07-prefix-sum.md) |
| **single number**, XOR, bits, power of 2 | [08 Bit Manipulation](08-bit-manipulation.md) |
| **sorted / rotated** array mein dhoondo | [09 Binary Search](09-binary-search.md) |
| "**minimum X jo condition satisfy kare**" (answer pe search) | [10 Binary Search on Answer](10-binary-search-on-answer.md) |
| **shortest steps** / level order / multi-source | [11 BFS](11-bfs.md) |
| **islands**, tree property, saare paths, cycle | [12 DFS](12-dfs.md) |
| **saare** subsets / permutations / N-Queens | [13 Backtracking](13-backtracking.md) |
| local best choice + sort / heap | [14 Greedy](14-greedy.md) |
| **connected groups**, extra edge, Kruskal | [15 Union-Find](15-union-find.md) |
| **brackets**, expression, undo | [16 Stack](16-stack.md) |
| **next greater/smaller**, histogram | [17 Monotonic Stack](17-monotonic-stack.md) |
| **prefix** / autocomplete / dictionary | [18 Trie](18-trie.md) |
| **min / max / count ways** + overlapping subproblems | [19 Dynamic Programming](19-dynamic-programming.md) |
| **dependencies**, weighted shortest path, MST | [20 Graph Algorithms](20-graph-algorithms.md) |

Practice order suggestion: Sliding Window → Two Pointers → Fast/Slow → Prefix Sum → Binary Search → Stack → Monotonic Stack → BFS/DFS → Backtracking → Greedy → Union-Find → Trie → Heap/Top-K → DP → Graph Algorithms — ye roughly easy se hard ka order hai.
