# 22. Shortest Path (Dijkstra, Bellman-Ford, Floyd-Warshall)

> 📍 **Syllabus**: Unit 5 — Graphs · Topic 22 / 29 · Pehle chahiye: [Graph Basics](19-graph-basics.md), [Heap](../03-trees-and-heaps/15-heap-priority-queue.md), [Greedy](../04-paradigms/18-greedy.md)

> **Standard definition**: Algorithms that find the minimum-cost path between vertices of a weighted graph — BFS for unweighted graphs, Dijkstra's algorithm for non-negative edge weights, Bellman-Ford for graphs that may contain negative weights (and detects negative cycles), and Floyd-Warshall for the shortest paths between all pairs of vertices.

**Ek line mein**: Ek jagah se doosri jagah **sabse sasta / sabse chhota raasta** — jahan har raaste (edge) ka apna **kharch (weight)** hai.

**Trick yaad rakhne ki**: *"Google Maps"* — har sadak pe **minutes** likhe hain.
- **BFS** = saari sadak barabar (1 minute) — **kitne mod (hops)** kam.
- **Dijkstra** = *"Jo jagah abhi **sabse kam time mein** pahunchi ja sakti hai use **pakka (final)** kar do, phir wahan se aage ki sadak dekho."* (Greedy + Heap.)
- **Bellman-Ford** = *"Saari sadkon ko **baar-baar dobara check** karo — kya kisi sadak se aane pe short-cut mil raha hai?"* — **negative** kharch (jaise cashback wali sadak) ho toh bhi chalta hai.
- **Floyd-Warshall** = *"Har shehar `k` ke liye poochho: **`k` se guzarke** har jodi (i → j) ka raasta chhota hota hai kya?"*

**Kab use karo**: **"Minimum cost / distance / time / effort"** wale sawaal — maps, network delay, flights, grid pe sabse asaan raasta.

## Kaunsa algorithm kab — pehle ye table yaad karo

| Algorithm | Kab | Negative edge? | Time |
|---|---|---|---|
| **BFS** | Sab edges barabar (unweighted) | — | O(V + E) |
| **0-1 BFS** | Weights sirf 0 ya 1 | ❌ | O(V + E) |
| **Dijkstra** ⭐ | Ek source se, weights **≥ 0** | ❌ **nahi chalega** | O((V + E) log V) |
| **Bellman-Ford** | Ek source se, **negative weights** ho sakte | ✅ (negative cycle bhi pakadta hai) | O(V · E) |
| **Floyd-Warshall** | **Saari jodiyon** ka shortest path, V chhota (≤ ~400) | ✅ | O(V³) |

## Do idea jo sabme common hain

**Relaxation**: *"Kya `u` ke raaste `v` tak pahunchna, abhi ke best se sasta hai?"*

```
dist[u] = 5,   edge  u → v  ka weight = 2,   dist[v] = 9 (abhi tak ka best)

5 + 2 = 7  <  9   →   dist[v] = 7     ✅ (naya, chhota raasta mila — "relax" ho gaya)
```

Sabhi algorithms (BFS chhodke) bas **alag-alag order mein relaxation** karte hain.

## Dijkstra — dekho kaise chalta hai

Directed graph (weights ke saath), source = **0**: `0→1 (4)`, `0→2 (1)`, `2→1 (2)`, `1→3 (1)`, `2→3 (5)`, `3→4 (3)`

```
                 4
         (0) ───────▶ (1) ──1──▶ (3) ──3──▶ (4)
          │            ▲          ▲
        1 │          2 │          │ 5
          ▼            │          │
         (2) ──────────┘──────────┘

Min-heap mein (node, distance) jodi rakhte hain — sabse kam distance pehle nikalta hai.

step  pop        dist[0..4] baad mein            kya hua
 1    (0, d=0)   [0, 4, 1, ∞, ∞]                 0 se 1 (4), 2 (1) relax
 2    (2, d=1)   [0, 3, 1, 6, ∞]                 2→1: 1+2=3 < 4 ✅   2→3: 1+5=6
 3    (1, d=3)   [0, 3, 1, 4, ∞]                 1→3: 3+1=4 < 6 ✅
 4    (1, d=4)   skip (purani entry — dist[1]=3 hai, 4 > 3)
 5    (3, d=4)   [0, 3, 1, 4, 7]                 3→4: 4+3=7
 6    (3, d=6)   skip (purani)
 7    (4, d=7)   —

Final:  0→0: 0,  0→1: 3,  0→2: 1,  0→3: 4,  0→4: 7

(Step 4 aur 5 mein dono entries ka distance 4 hai — heap koi bhi pehle nikaale, final answer wahi rehta hai.)
```

**Kyun chalta hai?** Jo node heap se **sabse pehle** nikla (sabse kam distance), uske liye **koi aur raasta sasta ho hi nahi sakta** — kyunki baaki raaste ab isse zyada ya barabar hi honge (aur edges **≥ 0** hain). Isliye wo **final** hai. Negative edge aate hi ye bharosa toot jata hai.

## Code example 1 — Dijkstra

```java
// edges[i] = {u, v, w} (directed, w >= 0). Return: src se har node ka distance (Integer.MAX_VALUE = pahunch nahi sakte)
public int[] dijkstra(int n, int[][] edges, int src) {
    List<List<int[]>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) graph.get(e[0]).add(new int[]{e[1], e[2]});      // {padosi, weight}

    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[1], y[1]));   // {node, distance} — kam distance pehle
    pq.offer(new int[]{src, 0});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[0], d = cur[1];
        if (d > dist[u]) continue;                     // 🔑 purani (stale) entry — isse behtar raasta pehle mil chuka
        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {               // RELAX: u ke raaste v sasta hai?
                dist[v] = dist[u] + w;
                pq.offer(new int[]{v, dist[v]});       // naya (chhota) distance heap mein
            }
        }
    }
    return dist;
}
```

**Line by line samjho**: Heap mein ek node kai baar (alag-alag distances ke saath) aa sakta hai; `if (d > dist[u]) continue;` **purani entries ko ignore** karta hai. Har edge par ek `offer` (`O(log V)`) → total **O((V + E) log V)**. Isi ko chhoti si tweak se kai problems mein use kiya jata hai — neeche dekho.

## Code example 2 — Dijkstra ka twist: "kharch" jod nahi, MAX bhi ho sakta hai

**Path With Minimum Effort**: Grid mein heights hain. Raaste ki **"effort" = raaste mein ek kadam ka sabse bada height-farq**. `(0,0)` se aakhri cell tak **minimum effort** batao.

**Trick**: *Dijkstra ko sirf itna chahiye ki kharch aage badhne pe **ghate nahi**.* Yahan "kharch" = `max(ab tak ka effort, is kadam ka farq)` — ye kabhi ghatta nahi, toh Dijkstra chalega.

```java
public int minimumEffortPath(int[][] heights) {
    int rows = heights.length, cols = heights[0].length;
    int[][] effort = new int[rows][cols];
    for (int[] row : effort) Arrays.fill(row, Integer.MAX_VALUE);
    effort[0][0] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[2], y[2]));   // {r, c, effort}
    pq.offer(new int[]{0, 0, 0});
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[0], c = cur[1], e = cur[2];
        if (e > effort[r][c]) continue;                       // purani entry
        if (r == rows - 1 && c == cols - 1) return e;         // aakhri cell pakki (final) ho gayi
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            int newEffort = Math.max(e, Math.abs(heights[nr][nc] - heights[r][c]));   // 🔑 JOD nahi, MAX
            if (newEffort < effort[nr][nc]) {
                effort[nr][nc] = newEffort;
                pq.offer(new int[]{nr, nc, newEffort});
            }
        }
    }
    return 0;
}
```

## Code example 3 — Bellman-Ford (negative edges ke liye)

**Kyun Bellman-Ford?** Negative weight (jaise "cashback wali sadak") ho toh Dijkstra ka "final ho gaya" wala bharosa toot jata hai. Bellman-Ford **sab edges ko `V − 1` baar relax** karta hai.

**Kyun `V − 1` baar?** Koi bhi shortest path mein **zyada se zyada `V − 1` edges** hoti hain. Round `i` ke baad **`i` edges tak ke saare shortest paths sahi** ho jate hain.

**Negative cycle** (aisa gol chakkar jiska total kharch negative ho) mein "sabse chhota raasta" hota hi nahi — hum chakkar lagate ja sakte hain aur kharch ghatta rahega. `V`-th round mein bhi sudhar mile toh **negative cycle** pakda gaya.

```java
// edges[i] = {u, v, w} (directed, w negative bhi ho sakta hai). Negative cycle mile toh null
public long[] bellmanFord(int n, int[][] edges, int src) {
    final long INF = Long.MAX_VALUE / 4;
    long[] dist = new long[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;

    for (int round = 1; round <= n - 1; round++) {
        boolean changed = false;
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {    // RELAX
                dist[v] = dist[u] + w;
                changed = true;
            }
        }
        if (!changed) break;                                   // 🔑 kuch nahi badla → aur rounds bekaar
    }
    for (int[] e : edges) {                                    // V-th round: ab bhi sudhar mile → NEGATIVE CYCLE
        if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]]) return null;
    }
    return dist;
}
```

**Bellman-Ford ka doosra use — "K stops tak"**: **Cheapest Flights Within K Stops** — `k` stops matlab **zyada se zyada `k + 1` flights (edges)**. Bellman-Ford ke **exactly `k + 1` rounds** chalao. **Zaroori**: har round mein **pichhle round ki copy** (`next`) se kaam karo, nahi toh ek hi round mein kai edges ek ke baad ek lag jayengi.

```java
public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int INF = Integer.MAX_VALUE;
    int[] dist = new int[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {                      // 🔑 k stops = k + 1 flights = k + 1 rounds
        int[] next = dist.clone();                       // pichhle round ka snapshot: is round mein sirf EK naya edge lagega
        for (int[] f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INF && dist[u] + w < next[v]) next[v] = dist[u] + w;
        }
        dist = next;
    }
    return dist[dst] == INF ? -1 : dist[dst];
}
```

## Code example 4 — Floyd-Warshall (saari jodiyon ka raasta)

**Trick**: *"Beech ka shehar `k`"* — har `k` ke liye poochho: **`i → k → j`** `i → j` seedhe se sasta hai kya? `k` ko **sabse bahar wale loop** mein rakhte hain: `k` tak ke shehron ko beech mein allowed maankar hum aage badhte hain.

```
dist[i][j] = min( dist[i][j],  dist[i][k] + dist[k][j] )      har k = 0..n-1 ke liye

Ek naya "beech ka shehar" allow karte hi, jo raaste uske through sasta ho gaye wo update.
```

```java
// Find the City With the Smallest Number of Neighbors at a Threshold Distance
public int findTheCity(int n, int[][] edges, int distanceThreshold) {
    int INF = 1_000_000;                                  // "infinity" jo do baar jodne pe bhi int overflow na kare
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) {                               // undirected; ek hi jodi ke beech kai edges ho toh sasti wali rakho
        dist[e[0]][e[1]] = Math.min(dist[e[0]][e[1]], e[2]);
        dist[e[1]][e[0]] = Math.min(dist[e[1]][e[0]], e[2]);
    }

    for (int k = 0; k < n; k++) {                         // 🔑 k (beech ka shehar) sabse BAHAR wala loop
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j]; // i → k → j sasta hai
                }
            }
        }
    }

    int bestCity = -1, fewest = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int reachable = 0;
        for (int j = 0; j < n; j++) {
            if (i != j && dist[i][j] <= distanceThreshold) reachable++;
        }
        if (reachable <= fewest) {                        // barabar ho toh bada number wala shehar (problem ka rule)
            fewest = reachable;
            bestCity = i;
        }
    }
    return bestCity;
}
```

**Time O(V³)** — isliye `V` chhota (≈ 100–400) ho tabhi. Code sabse chhota hai aur negative edges bhi sambhalta hai (par negative cycle nahi).

## Code example 5 — 0-1 BFS (jab weights sirf 0 ya 1 hon)

**Trick**: *"0-kharch wali edge = free pass → line mein **aage** khada karo. 1-kharch wali → **peeche**."* Deque se Dijkstra ka heap hat jata hai — **O(V + E)**.

```java
// edges[i] = {u, v, w}, w sirf 0 ya 1 (directed)
public int[] zeroOneBfs(int n, int[][] edges, int src) {
    List<List<int[]>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) graph.get(e[0]).add(new int[]{e[1], e[2]});

    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    Deque<Integer> deque = new ArrayDeque<>();
    deque.offerFirst(src);
    while (!deque.isEmpty()) {
        int u = deque.pollFirst();
        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) deque.offerFirst(v);          // 🔑 free edge → aage (isi distance ka)
                else deque.offerLast(v);                   // 1 kharch → peeche
            }
        }
    }
    return dist;
}
```

## Negative edge pe Dijkstra kyun galat?

```
0 → 1 (weight 2),   0 → 2 (weight 5),   2 → 1 (weight −4)

Sahi answer:  0→2→1 = 5 + (−4) = 1
Classic Dijkstra:   "1 heap se distance 2 pe pehle nikla (2 < 5) → FINAL maan liya!"   ← par asli sasta raasta 1 hai
```

"Jo pehle nikla wo final" ka bharosa tabhi sahi hai jab **aage badhne se kharch kabhi ghate nahi** (weights ≥ 0). Negative weight mein ye tootta hai, isliye classic Dijkstra (jo node ko ek baar final maan leta hai) **galat answer** deta hai. Upar wala lazy-heap code negative edge ko dobara relax kar leta hai (chhote example mein sahi answer de dega), par uska **worst-case time exponential** ho sakta hai aur negative *cycle* pe kabhi rukega nahi. Isliye: **negative edge = Bellman-Ford.**

## Kab kaunsa lagana hai — pehchano

| Problem ka hint | Algorithm |
|---|---|
| Unweighted, "kam se kam kadam/hops" | BFS |
| Weights (≥ 0), ek source se | **Dijkstra** |
| "Minimum **effort / max probability / max edge** on path" | Dijkstra ka twist (kharch = max / product) |
| **Negative weights**, ya "**at most K edges/stops**" | **Bellman-Ford** |
| **Saari jodiyon** ka distance, n ≤ ~400 | Floyd-Warshall |
| Weights sirf 0/1 | 0-1 BFS |
| DAG (directed, no cycle) | Topological order pe relax karo — O(V + E) ([Topological Sort](20-topological-sort.md)) |

## Common galtiyan

- **Weighted graph pe BFS lagana** — BFS sirf hops ginta hai, weight nahi.
- **Dijkstra mein negative edge** — galat answer / slow.
- **Stale entries ignore na karna** (`if (d > dist[u]) continue;`) — time badh jata hai.
- **`dist[u] + w` mein overflow** — `Integer.MAX_VALUE + w` negative ho jata hai. `dist[u] != INF` check ya `long`/chhota INF.
- **Floyd-Warshall mein `k` ko andar wale loop mein rakhna** — galat answer. `k` **sabse bahar**.
- **Bellman-Ford (K stops) mein pichhle round ki copy na lena** — `k` se zyada edges lag jayengi.
- **Undirected graph mein edge sirf ek taraf** jodna.

> 💡 **Interview mein bolne wali line**: *"Edges ka weight non-negative hai, isliye Dijkstra — min-heap se har baar sabse kam distance wala node finalize karta hoon. Time O((V + E) log V). Agar negative weights hote toh Bellman-Ford O(V·E)."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Network Delay Time | Medium | Seedha Dijkstra | [leetcode.com/problems/network-delay-time](https://leetcode.com/problems/network-delay-time/) |
| 2 | Shortest Path in Binary Matrix | Medium | Grid pe BFS (8 directions) | [leetcode.com/problems/shortest-path-in-binary-matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) |
| 3 | Path With Minimum Effort | Medium | Dijkstra, kharch = max | [leetcode.com/problems/path-with-minimum-effort](https://leetcode.com/problems/path-with-minimum-effort/) |
| 4 | Path with Maximum Probability | Medium | Dijkstra, kharch = product (max-heap) | [leetcode.com/problems/path-with-maximum-probability](https://leetcode.com/problems/path-with-maximum-probability/) |
| 5 | Cheapest Flights Within K Stops | Medium | Bellman-Ford, k+1 rounds | [leetcode.com/problems/cheapest-flights-within-k-stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) |
| 6 | Find the City With the Smallest Number of Neighbors at a Threshold Distance | Medium | Floyd-Warshall | [leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) |
| 7 | Number of Ways to Arrive at Destination | Medium | Dijkstra + raaste ginna | [leetcode.com/problems/number-of-ways-to-arrive-at-destination](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/) |
| 8 | Swim in Rising Water | Hard | Dijkstra, kharch = max | [leetcode.com/problems/swim-in-rising-water](https://leetcode.com/problems/swim-in-rising-water/) |
| 9 | Minimum Obstacle Removal to Reach Corner | Hard | 0-1 BFS | [leetcode.com/problems/minimum-obstacle-removal-to-reach-corner](https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/) |
| 10 | Minimum Cost to Make at Least One Valid Path in a Grid | Hard | 0-1 BFS | [leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/) |
| 11 | Reachable Nodes In Subdivided Graph | Hard | Dijkstra + edge ke andar nodes | [leetcode.com/problems/reachable-nodes-in-subdivided-graph](https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/) |
| 12 | Design Graph With Shortest Path Calculator | Hard | Class design + Dijkstra/Floyd | [leetcode.com/problems/design-graph-with-shortest-path-calculator](https://leetcode.com/problems/design-graph-with-shortest-path-calculator/) |

Poora pattern-style practice: [Graph Algorithms pattern](../../01-patterns/20-graph-algorithms.md).

Agla: [23-minimum-spanning-tree.md](23-minimum-spanning-tree.md)
