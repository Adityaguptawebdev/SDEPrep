# 23. Minimum Spanning Tree (Kruskal & Prim)

> 📍 **Syllabus**: Unit 5 — Graphs · Topic 23 / 29 · Pehle chahiye: [Union-Find](21-union-find.md), [Graph Basics](19-graph-basics.md), [Heap](../03-trees-and-heaps/15-heap-priority-queue.md), [Greedy](../04-paradigms/18-greedy.md)

> **Standard definition**: A minimum spanning tree (MST) of a connected, undirected, weighted graph is a subset of its edges that connects all the vertices, contains no cycle, and has the minimum possible total edge weight; it can be found with the greedy algorithms of Kruskal or Prim.

**Ek line mein**: **Saare nodes ko jodo, sabse kam total kharch mein, aur koi cycle (faltu raasta) na ho.**

**Trick yaad rakhne ki**: *"Gaon ke beech sabse sasti sadak"* — 5 gaon hain, aur har do gaon ke beech sadak banane ka alag kharch. Sarkar ko chahiye ki **har gaon kisi na kisi raaste se baaki sab se jud jaye**, par **kul kharch minimum** ho. Agar teen gaon ke beech triangle ban raha hai toh **sabse mehngi sadak mat banao** — do sadak se hi teeno jude hain. Aisa **"tree"** bachta hai: **`n` gaon ke liye exactly `n − 1` sadak**.

**Kab use karo**: **Network/cable/pipeline/road** bichhana (minimum kharch mein sab jude), "**sab ko connect karo, kam se kam cost**" wale sawaal, clustering (Kruskal ko beech mein rok do). Keywords: **"minimum cost to connect all"**.

## Spanning Tree kya hai

```
Graph (5 nodes, 7 edges):
    0 ──2── 1 ──3── 2            edges: 0-1(2)  1-2(3)  0-3(6)  1-3(8)  1-4(5)  2-4(7)  3-4(9)
    │     ╱ │       │
    6   8   5       7
    │ ╱     │       │
    3 ──9── 4 ──────┘

Ek spanning tree (n − 1 = 4 edges, koi cycle nahi) — ye wahi MST hai:
    0 ──2── 1 ──3── 2
    │       │
    6       5              total = 2 + 3 + 5 + 6 = 16
    │       │
    3       4
```

Spanning tree ke 3 gun: **(1)** saare nodes shamil, **(2)** connected, **(3)** koi cycle nahi ⇒ **exactly `n − 1` edges**. Ek graph ke kai spanning trees ho sakte hain; **minimum total weight wala = MST**.

**Sabse zaroori sacchai (kyun greedy chalta hai)** — *Cut property*: *"Nodes ko kisi bhi tarah do hisson mein baanto — un dono hisson ko jodne wali **sabse sasti edge MST mein zaroor hoti hai**."* Isliye har baar sabse sasti "safe" edge uthana galat nahi ho sakta.

**⚠️ MST ≠ Shortest Path Tree** (log yahan confuse hote hain):

```
A ──1── B ──1── C          A–C seedha: 1.5

MST (kul kharch minimum):       A–B, B–C      = 2    (A se C tak jaane mein 2 lagta hai)
A se C ka shortest path:        A–C seedha    = 1.5  (MST mein ye edge hai hi nahi)
```

MST **poore network ka kul kharch** minimum karta hai; shortest path **ek source se har node tak ka raasta**.

## Tarika 1 — Kruskal's Algorithm ⭐ (Union-Find se)

**Trick**: *"Saari sadkon ko **sasti se mehngi** line mein lagao. Ek-ek uthao — agar wo **do alag groups** ko jodti hai toh bana do, agar wo **pehle se jude** gaon ko jodti hai (cycle) toh **chhod do**."* Isme **Union-Find** ka `union` ka `true/false` kaam aata hai.

```
Edges (sorted):  0-1(2)  1-2(3)  1-4(5)  0-3(6)  2-4(7)  1-3(8)  3-4(9)

edge   w    kya 2 alag groups ko jodti hai?     action        total
0-1    2    haan  ({0}, {1})                    ✅ bana do       2
1-2    3    haan  ({0,1}, {2})                  ✅ bana do       5
1-4    5    haan  ({0,1,2}, {4})                ✅ bana do      10
0-3    6    haan  ({0,1,2,4}, {3})              ✅ bana do      16    ← 4 edges = n − 1 → BAS, ruk jao

MST ka total weight = 16.   (Baaki edges dekhni hi nahi padti. Agar rukte nahi, toh 2-4 (7) skip hoti —
                             2 aur 4 pehle se 1 ke raaste jude hain, yaani cycle banti.)
```

**Union-Find ka chhota roop** ([pichhle note](21-union-find.md) wala, yaad ke liye):

```java
class UnionFind {
    private int[] parent, size;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);      // path compression
        return parent[x];
    }

    boolean union(int a, int b) {                              // false = pehle se ek hi group (cycle banegi)
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        size[ra] += size[rb];
        return true;
    }
}
```

```java
// edges[i] = {u, v, w} (undirected). MST ka total weight; graph connected nahi ho toh -1
public int kruskal(int n, int[][] edges) {
    int[][] sorted = edges.clone();
    Arrays.sort(sorted, (a, b) -> Integer.compare(a[2], b[2]));    // 🔑 sabse sasti sadak pehle
    UnionFind uf = new UnionFind(n);
    int total = 0, used = 0;
    for (int[] e : sorted) {
        if (uf.union(e[0], e[1])) {         // do alag groups the → ye sadak bana do (cycle nahi banegi)
            total += e[2];
            used++;
            if (used == n - 1) break;       // MST mein hamesha n − 1 edges
        }                                    // warna pehle se jude hain → sadak faltu (cycle) — skip
    }
    return used == n - 1 ? total : -1;      // n − 1 edges nahi mili → graph connected hi nahi
}
```

**Line by line samjho**: Sort karne se **greedy order** mil jata hai. `union` ka `false` = "ye do gaon pehle se kisi raaste se jude hain" = ye sadak **cycle** banayegi. **Time O(E log E)** (sort ka kharch).

## Tarika 2 — Prim's Algorithm (ek gaon se tree ugao)

**Trick**: *"Ek gaon se shuru karo. Har baar us **tree ko baaki gaon se jodne wali sabse sasti sadak** chuno aur naya gaon tree mein le lo."* Jaise **ped ugta hai** — ek jad se, sabse sasta raasta dekhkar failta jata hai. Min-heap se "sabse sasti sadak" nikalte hain (Dijkstra jaisa, par distance nahi — **sirf edge ka weight**).

```
Shuru: tree = {0}

  tree se nikalti edges: 0-1(2), 0-3(6)           → sabse sasti 0-1 (2)     tree = {0,1}    total 2
  ab: 0-3(6), 1-2(3), 1-3(8), 1-4(5)              → sabse sasti 1-2 (3)     tree = {0,1,2}  total 5
  ab: 0-3(6), 1-3(8), 1-4(5), 2-4(7)              → sabse sasti 1-4 (5)     tree = {0,1,2,4} total 10
  ab: 0-3(6), 1-3(8), 3-4(9)                      → sabse sasti 0-3 (6)     tree = {0,1,2,3,4} total 16 ✅
```

```java
public int prim(int n, int[][] edges) {
    List<List<int[]>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) {
        graph.get(e[0]).add(new int[]{e[1], e[2]});      // undirected → dono taraf
        graph.get(e[1]).add(new int[]{e[0], e[2]});
    }

    boolean[] inTree = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[1], y[1]));   // {node, wo edge jo isse tree se jodti hai}
    pq.offer(new int[]{0, 0});                            // 0 se shuru, jodne ka kharch 0
    int total = 0, count = 0;

    while (!pq.isEmpty() && count < n) {
        int[] cur = pq.poll();
        int u = cur[0];
        if (inTree[u]) continue;                          // pehle se tree mein hai → is (mehngi) entry ko skip
        inTree[u] = true;                                 // 🔑 sabse sasti edge se jodne wala node tree mein aa gaya
        total += cur[1];
        count++;
        for (int[] edge : graph.get(u)) {
            if (!inTree[edge[0]]) pq.offer(new int[]{edge[0], edge[1]});   // naye node ki edges heap mein
        }
    }
    return count == n ? total : -1;                       // saare nodes nahi jude → connected nahi
}
```

## Dense graph pe Prim (heap ke bina) — Min Cost to Connect All Points

Jab **har do points ke beech edge** ho (complete graph, `E = n²`), Kruskal ko `n²` edges sort karni padengi. Yahan **heap-less Prim** `O(n²)` mein chalta hai: har baar tree ke bahar wale nodes mein se **sabse kam `minDist`** wala chuno.

```java
// points[i] = {x, y}. Do points ke beech kharch = Manhattan distance. Sab points jodne ka minimum kharch
public int minCostConnectPoints(int[][] points) {
    int n = points.length;
    int[] minDist = new int[n];                  // tree se node i tak jodne ki abhi tak ki sabse sasti sadak
    Arrays.fill(minDist, Integer.MAX_VALUE);
    boolean[] inTree = new boolean[n];
    minDist[0] = 0;
    int total = 0;

    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int i = 0; i < n; i++) {            // tree ke bahar wale mein sabse kam minDist chuno
            if (!inTree[i] && (u == -1 || minDist[i] < minDist[u])) u = i;
        }
        inTree[u] = true;
        total += minDist[u];
        for (int v = 0; v < n; v++) {            // u tree mein aaya → baaki nodes ki sasti sadak update
            if (!inTree[v]) {
                int cost = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                if (cost < minDist[v]) minDist[v] = cost;
            }
        }
    }
    return total;
}
```

## Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| Idea | **Edges** ko sort karke jodo | **Nodes** ko ek-ek karke tree mein lao |
| Data structure | Union-Find | Min-Heap |
| Time | O(E log E) | O(E log V) (heap) · O(V²) (heap ke bina) |
| Kab achha | **Sparse** graph (E kam) | **Dense** graph (E ≈ V²) |
| Disconnected graph | Jungle (forest) deta hai (kai trees) | Sirf ek component ka tree |

Dono ka **MST ka total weight barabar** aata hai (edges alag ho sakti hain agar weights barabar hon).

## MST ke facts

- **`n − 1` edges**, koi cycle nahi, connected.
- Agar **saare edge weights alag-alag** hain toh **MST unique** hai.
- **Cycle property**: kisi bhi cycle ki **sabse mehngi edge** (agar wo akeli sabse mehngi ho) MST mein **nahi** hoti.
- Kruskal ko **`k` groups bache** tab rok do → **clustering** (`k` clusters) — data science mein kaam aata hai.

## Kab lagana hai — pehchano

| Problem ka hint | MST |
|---|---|
| "**Sab ko connect karo, minimum cost**" | Kruskal / Prim |
| "Kam se kam cable/pipe/road bichhao" | MST |
| "Kitni **extra edges hata** sakte ho (connected rehne ke saath)" | Total edges − (n − 1) (Union-Find se) |
| **Complete graph** (har jodi ke beech cost) | Prim `O(n²)` |
| "**Minimum bottleneck** path" | MST par path (ya Kruskal beech mein rokna) |

## Common galtiyan

- **Directed graph pe MST** — MST sirf **undirected** ke liye hai (directed ke liye alag algorithm).
- **`n − 1` edges ki ginti na karna** — Kruskal jaldi rok sakta hai; aur agar `used < n − 1` toh graph connected nahi.
- **Prim mein `inTree` check bhoolna** — mehngi purani entries se galat total.
- **MST aur shortest path ko ek samajhna** (upar wala triangle example).
- **Kruskal mein sort ke baad Union-Find ki jagah `visited` lagana** — cycle detection galat hogi.
- **Complete graph pe Kruskal** — `n²` edges banana aur sort karna bhaari; Prim `O(n²)` lo.

> 💡 **Interview mein bolne wali line**: *"Yahan har jodi ke beech cost hai aur sab points jodne hain, toh ye MST hai. Points kam hain aur graph dense hai, isliye main heap-less Prim use karunga — O(n²). Kruskal sort ke saath O(E log E) padta."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Number of Operations to Make Network Connected | Medium | Extra edges vs components (Union-Find) | [leetcode.com/problems/number-of-operations-to-make-network-connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) |
| 2 | Min Cost to Connect All Points | Medium | Prim `O(n²)` / Kruskal | [leetcode.com/problems/min-cost-to-connect-all-points](https://leetcode.com/problems/min-cost-to-connect-all-points/) |
| 3 | Connecting Cities With Minimum Cost 🔒 (Premium) | Medium | Seedha Kruskal | [leetcode.com/problems/connecting-cities-with-minimum-cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/) |
| 4 | The Earliest Moment When Everyone Become Friends 🔒 (Premium) | Medium | Sort by time + Union-Find | [leetcode.com/problems/the-earliest-moment-when-everyone-become-friends](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/) |
| 5 | Path With Minimum Effort | Medium | Kruskal jaisa (edges sort + union) | [leetcode.com/problems/path-with-minimum-effort](https://leetcode.com/problems/path-with-minimum-effort/) |
| 6 | Optimize Water Distribution in a Village 🔒 (Premium) | Hard | Extra "virtual" node + MST | [leetcode.com/problems/optimize-water-distribution-in-a-village](https://leetcode.com/problems/optimize-water-distribution-in-a-village/) |
| 7 | Remove Max Number of Edges to Keep Graph Fully Traversable | Hard | Do Union-Find (Alice, Bob) | [leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable](https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/) |
| 8 | Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree | Hard | MST ke saath edge include/exclude | [leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/) |
| 9 | Checking Existence of Edge Length Limited Paths | Hard | Offline queries + Kruskal | [leetcode.com/problems/checking-existence-of-edge-length-limited-paths](https://leetcode.com/problems/checking-existence-of-edge-length-limited-paths/) |

---

## ✅ Unit 5 (Graphs) khatam!

Graph basics (BFS/DFS), Topological Sort, Union-Find, Shortest Path (Dijkstra/Bellman-Ford/Floyd) aur MST — graphs ke saare bade tools ab tumhare paas hain.

Ab hum ek aisi technique seekhte hain jo **interview ki sabse mushkil mani jati hai par asal mein bahut systematic hai** — **Dynamic Programming**. Pehle **recursion se memoization**, phir **table (tabulation)**.

Agla: [Unit 6 — Dynamic Programming → DP Basics](../06-dynamic-programming/24-dp-basics.md)
