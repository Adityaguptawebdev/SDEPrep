# 19. Graph Basics (Representation, BFS, DFS)

> 📍 **Syllabus**: Unit 5 — Graphs · Topic 19 / 29 · Pehle chahiye: [Binary Tree](../03-trees-and-heaps/13-binary-tree.md), [Stack](../02-linear-structures/11-stack.md), [Queue](../02-linear-structures/12-queue-and-deque.md), [Hashing](../01-basics/04-hashing.md)

> **Standard definition**: A non-linear data structure consisting of a set of vertices (nodes) and a set of edges connecting pairs of vertices; edges may be directed or undirected, and weighted or unweighted. A tree is a special graph that is connected and has no cycles.

**Ek line mein**: **Nodes (points) aur unhe jodne wali edges (lines)** — bas. Tree mein har node ka ek hi parent hota tha; graph mein **koi bhi node kisi bhi node se jud sakta hai**, aur **cycle** (ghoom ke wapas wahin aana) bhi ban sakti hai.

**Trick yaad rakhne ki**: *"Metro ka map"* — **stations = nodes**, **track = edges**. Do stations ke beech track **dono taraf** chalta hai (undirected) — par kisi **one-way gali** ko *directed* maano (Instagram "follow" — tum use follow karte ho, wo tumhe nahi). Track pe likha **kiraya/time = weight**.

**Kab use karo**: Jab cheezein **ek-doosre se jude ho** — friends network, maps/roads, dependencies, web pages ke links, grid pe "paas-paas ke cells". Aur agar problem mein **"connected", "path", "network", "islands", "friends"** shabd dikhe.

## Graph ki bhasha

```
      0 ──── 1
      │      │              6 nodes (0..5), 6 edges
      2      3              Ye ek gol raasta hai (cycle): 0-1-3-5-4-2-0
      │      │
      4 ──── 5
```

| Term | Matlab |
|---|---|
| **Vertex / Node** | Ek point (station) |
| **Edge** | Do vertices ko jodne wali line |
| **Undirected / Directed** | Edge dono taraf chalti hai / sirf ek taraf (`u → v`) |
| **Weighted** | Edge pe cost/distance likha hai |
| **Degree** | Node se kitni edges judi hain (directed mein **in-degree** aur **out-degree** alag) |
| **Path** | Nodes ka ek raasta jo edges se juda ho |
| **Cycle** | Ek path jo wapas usi node pe khatam ho |
| **Connected** | Kisi bhi node se kisi bhi node tak raasta hai |
| **Connected Component** | Ek-doosre se jude nodes ka alag "dweep (island)" |
| **DAG** | **D**irected **A**cyclic **G**raph — directed, par koi cycle nahi |

**Tree = connected + koi cycle nahi + `n` nodes pe exactly `n − 1` edges.**

## Graph ko store kaise karein — 3 tarike

Upar wale graph ki edges: `0-1, 0-2, 1-3, 2-4, 3-5, 4-5`

```
1) Adjacency LIST  ⭐ (sabse common)        2) Adjacency MATRIX               3) Edge LIST
   0 → [1, 2]                                    0 1 2 3 4 5                     [0,1] [0,2] [1,3]
   1 → [0, 3]                                 0  0 1 1 0 0 0                     [2,4] [3,5] [4,5]
   2 → [0, 4]                                 1  1 0 0 1 0 0
   3 → [1, 5]                                 2  1 0 0 0 1 0
   4 → [2, 5]                                 3  0 1 0 0 0 1
   5 → [3, 4]                                 4  0 0 1 0 0 1
                                              5  0 0 0 1 1 0
```

| | Adjacency List | Adjacency Matrix |
|---|---|---|
| Space | **O(V + E)** | O(V²) |
| "u-v edge hai?" | O(degree) | **O(1)** |
| Neighbors dhoondhna | **O(degree)** | O(V) |
| Kab lo | **Zyadatar problems** (sparse graph) | Chhota V ya dense graph (Floyd–Warshall) |

**Interview mein 90% adjacency list.** Java mein: `List<List<Integer>>` (nodes 0..n−1 ho toh) ya `Map<Integer, List<Integer>>`.

## Code example 1 — Edges se graph banana

```java
// Undirected: edge (u, v) matlab u→v AUR v→u dono
public List<List<Integer>> buildUndirected(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());     // har node ke liye khaali list
    for (int[] e : edges) {
        graph.get(e[0]).add(e[1]);
        graph.get(e[1]).add(e[0]);                                // 🔑 dono taraf jodo
    }
    return graph;
}

// Directed: edge (u, v) matlab sirf u→v
public List<List<Integer>> buildDirected(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) graph.get(e[0]).add(e[1]);              // sirf ek taraf
    return graph;
}
```

**Weighted graph** ke liye list mein `int[]{neighbor, weight}` rakhte hain (Dijkstra ke note mein aayega).

## BFS vs DFS — dono ko ek graph pe dekho

**BFS (Breadth-First)** = *"paani mein kankad phenko — lehrein **gol-gol, ek layer, phir agli layer** failti hain."* **Queue** use hoti hai.
**DFS (Depth-First)** = *"bhulbhulaiya — ek raasta **poora andar tak** jao, dead-end pe wapas aakar doosra raasta."* **Recursion / Stack** use hoti hai.

```
Graph:  0–1, 0–2, 1–3, 2–4, 3–5, 4–5      start = 0       adjacency: 0:[1,2] 1:[0,3] 2:[0,4] 3:[1,5] 4:[2,5] 5:[3,4]

BFS (layer by layer)                      DFS (gehraai mein)
  layer 0:  0                               0 → 1 → 3 → 5 → 4 → 2
  layer 1:  1  2        (0 ke padosi)       (0 se 1, 1 se 3, 3 se 5, 5 se 4, 4 se 2)
  layer 2:  3  4        (1, 2 ke padosi)
  layer 3:  5
  order:  0 1 2 3 4 5                       order:  0 1 3 5 4 2
```

**Dono mein zaroori**: **`visited`** — warna cycle mein infinite loop.

```java
// BFS — queue, layer by layer.  Time O(V + E), Space O(V)
public List<Integer> bfs(List<List<Integer>> graph, int start) {
    List<Integer> order = new ArrayList<>();
    boolean[] visited = new boolean[graph.size()];
    Queue<Integer> queue = new ArrayDeque<>();
    queue.offer(start);
    visited[start] = true;                       // 🔑 queue mein DAALTE hi visited mark (duplicate se bachne ke liye)
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : graph.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                queue.offer(v);
            }
        }
    }
    return order;
}

// DFS — recursion
public List<Integer> dfs(List<List<Integer>> graph, int start) {
    List<Integer> order = new ArrayList<>();
    dfsHelper(graph, start, new boolean[graph.size()], order);
    return order;
}

private void dfsHelper(List<List<Integer>> graph, int u, boolean[] visited, List<Integer> order) {
    visited[u] = true;                           // aate hi mark
    order.add(u);
    for (int v : graph.get(u)) {
        if (!visited[v]) dfsHelper(graph, v, visited, order);
    }
}

// DFS — iterative (khud ka stack) — bahut gehre graph mein StackOverflow se bachne ke liye
public List<Integer> dfsIterative(List<List<Integer>> graph, int start) {
    List<Integer> order = new ArrayList<>();
    boolean[] visited = new boolean[graph.size()];
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);
    while (!stack.isEmpty()) {
        int u = stack.pop();
        if (visited[u]) continue;                // 🔑 stack mein duplicate ho sakta hai → pop pe check
        visited[u] = true;
        order.add(u);
        for (int v : graph.get(u)) {
            if (!visited[v]) stack.push(v);
        }
    }
    return order;
}
```

> ⚠️ `dfsIterative` ka visit order recursive DFS se **ulta-sa** aa sakta hai (stack LIFO hai) — dono valid DFS hain, bas neighbors ka order alag hota hai.

**BFS ya DFS?** — **Shortest path (unweighted)**, level-wise → **BFS**. **Saare paths, cycle, components, backtracking** → **DFS**. Dono ke patterns: [BFS](../../01-patterns/11-bfs.md), [DFS](../../01-patterns/12-dfs.md).

## Code example 2 — Connected Components aur Path

**Trick**: *"Har bina-dekhe node se ek DFS shuru karo — ek DFS = ek poora 'dweep' (component) khatam."* Kitni baar naya DFS shuru karna pada = components ki ginti.

```java
public int countComponents(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) {
        graph.get(e[0]).add(e[1]);
        graph.get(e[1]).add(e[0]);
    }
    boolean[] visited = new boolean[n];
    int components = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            components++;                        // 🔑 naya dweep mila
            visit(graph, i, visited);            // is poore dweep ko visited kar do
        }
    }
    return components;
}

private void visit(List<List<Integer>> graph, int u, boolean[] visited) {
    visited[u] = true;
    for (int v : graph.get(u)) {
        if (!visited[v]) visit(graph, v, visited);
    }
}
```

## Code example 3 — Cycle Detection (undirected aur directed) + Bipartite

**Undirected — "parent" trick**: *"Jis raaste se aaye, wapas wahi jaana cycle nahi hai. Par koi **doosra, pehle se dekha hua** node mila toh cycle hai."*

```
0 ── 1        DFS: 0 → 1 → 2 → (2 ka padosi 0: visited aur 2 ka parent nahi hai (parent 1 hai))
│   /                                                                          → CYCLE ✅
└ 2
```

```java
// (simple graph maan ke — do nodes ke beech ek se zyada edge nahi)
public boolean hasCycleUndirected(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) {
        graph.get(e[0]).add(e[1]);
        graph.get(e[1]).add(e[0]);
    }
    boolean[] visited = new boolean[n];
    for (int i = 0; i < n; i++) {
        if (!visited[i] && dfsCycle(graph, i, -1, visited)) return true;    // har component ke liye
    }
    return false;
}

private boolean dfsCycle(List<List<Integer>> graph, int u, int parent, boolean[] visited) {
    visited[u] = true;
    for (int v : graph.get(u)) {
        if (v == parent) continue;                  // jis raaste se aaye wahi wapas — cycle nahi
        if (visited[v]) return true;                // 🔑 kisi aur raaste se pehle dekha hua node → CYCLE
        if (dfsCycle(graph, v, u, visited)) return true;
    }
    return false;
}
```

**Directed — 3 rang ka trick**: *"Kaun abhi **is raaste pe hai** (stack mein) — agar dobara wahi mila toh cycle."* Sirf `visited` kaafi nahi (directed mein alag raaste se pehle dekha hua node cycle nahi hota).

```
State:  0 = abhi dekha nahi    1 = "abhi is raaste pe hai" (DFS stack mein)    2 = poora khatam (sab neeche dekh liya)

0 → 1 → 2 → 0     2 se 0 dekha: state[0] == 1 (abhi raaste pe hai) → CYCLE ✅
0 → 1, 0 → 2, 1 → 2   2 ko doosre raaste se dekha: state[2] == 2 (khatam) → cycle NAHI ✅
```

```java
public boolean hasCycleDirected(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) graph.get(e[0]).add(e[1]);
    int[] state = new int[n];
    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfs(graph, i, state)) return true;
    }
    return false;
}

private boolean dfs(List<List<Integer>> graph, int u, int[] state) {
    state[u] = 1;                                   // is raaste pe chal rahe hain
    for (int v : graph.get(u)) {
        if (state[v] == 1) return true;             // 🔑 apne hi raaste ka node dobara chhua → CYCLE
        if (state[v] == 0 && dfs(graph, v, state)) return true;
    }
    state[u] = 2;                                   // is node ke neeche sab dekh liya, cycle nahi
    return false;
}
```

**Bipartite** = nodes ko **2 rang** mein aise rang sakte ho ki **har edge ke dono sire alag rang** ke hon? **Trick**: *"Shaadi mein seating: dulha paksh aur dulhan paksh — jinme jhagda hai wo alag paksh mein."* BFS se padosi ko **ulta rang** do; padosi ka rang same mila toh nahi ho sakta.

```java
public boolean isBipartite(int[][] graph) {           // graph[i] = i ke padosi
    int n = graph.length;
    int[] color = new int[n];                          // 0 = rang nahi, 1 / -1 = do rang
    for (int start = 0; start < n; start++) {          // disconnected ho sakta hai → har component
        if (color[start] != 0) continue;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        color[start] = 1;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : graph[u]) {
                if (color[v] == 0) {
                    color[v] = -color[u];              // 🔑 padosi ko ULTA rang
                    queue.offer(v);
                } else if (color[v] == color[u]) {
                    return false;                       // padosi ka rang same → 2 rang mein nahi baant sakte
                }
            }
        }
    }
    return true;
}
```

(Fact: graph bipartite hai **⟺ usme koi odd-length cycle nahi**.)

## Code example 4 — Grid ek graph hai! (Islands aur Rotting Oranges)

Grid ka **har cell = node**, aur **4 padosi cells (up/down/left/right) = edges**. Alag se graph banane ki zarurat nahi — bas **direction array** (`dirs`).

```
grid:        Har cell (r, c) ke padosi:      (r-1, c)
 1 1 0                                   (r, c-1)  (r,c)  (r, c+1)     dirs = {{-1,0},{1,0},{0,-1},{0,1}}
 1 0 0                                        (r+1, c)
 0 0 1       →  2 islands (1 ke jude hue jhund)
```

```java
// Number of Islands — BFS se (DFS wala version [DFS pattern] mein hai)
public int numIslands(char[][] grid) {
    int rows = grid.length, cols = grid[0].length, count = 0;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] != '1') continue;
            count++;                                     // naya island mila
            Queue<int[]> queue = new ArrayDeque<>();
            queue.offer(new int[]{r, c});
            grid[r][c] = '0';                            // 🔑 daalte hi visited (grid mein hi '0' karke)
            while (!queue.isEmpty()) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                        grid[nr][nc] = '0';
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
        }
    }
    return count;
}
```

**Multi-source BFS** — *"Ek se zyada jagah se ek saath shuru"*: **Rotting Oranges** mein saare **sade hue santre ek saath queue mein** daalo; har BFS **layer = 1 minute**.

```java
public int orangesRotting(int[][] grid) {
    int rows = grid.length, cols = grid[0].length, fresh = 0;
    Queue<int[]> queue = new ArrayDeque<>();
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) queue.offer(new int[]{r, c});   // 🔑 MULTI-SOURCE: saare sade santre pehle se queue mein
            else if (grid[r][c] == 1) fresh++;
        }
    }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    int minutes = 0;
    while (!queue.isEmpty() && fresh > 0) {
        minutes++;                                                // ek layer = ek minute
        for (int size = queue.size(); size > 0; size--) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;                             // taaza santra sad gaya
                    fresh--;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
    }
    return fresh == 0 ? minutes : -1;                             // koi taaza bacha toh kabhi nahi sadega
}
```

## Code example 5 — BFS se Shortest Path (unweighted)

**Trick**: *"BFS layer-by-layer chalta hai, toh **pehli baar** jis layer mein node mile wahi uska sabse chhota distance hai."* `dist` array mein layer number likh do.

```
graph:  0–1, 0–2, 1–3, 2–4, 3–5, 4–5       src = 0, dst = 5

dist:   0:0   1:1   2:1   3:2   4:2   5:3          →  0 se 5 tak minimum 3 edges ✅
```

```java
public int shortestPath(List<List<Integer>> graph, int src, int dst) {
    int[] dist = new int[graph.size()];
    Arrays.fill(dist, -1);                        // -1 = abhi tak pahunche nahi
    Queue<Integer> queue = new ArrayDeque<>();
    queue.offer(src);
    dist[src] = 0;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        if (u == dst) return dist[u];
        for (int v : graph.get(u)) {
            if (dist[v] == -1) {                  // 🔑 pehli baar pahunche = sabse chhota raasta
                dist[v] = dist[u] + 1;
                queue.offer(v);
            }
        }
    }
    return -1;                                    // dst tak raasta hi nahi
}
```

Weighted edges pe BFS **galat** hota hai — wahan [Shortest Path (Dijkstra)](22-shortest-path.md) aayega.

## Complexity

| | Time | Space |
|---|---|---|
| BFS / DFS | **O(V + E)** — har node ek baar, har edge ek/do baar | O(V) (`visited` + queue/stack) |
| Grid (`R × C`) | O(R · C) | O(R · C) |

## Common galtiyan

- **`visited` bhoolna** — cycle wale graph mein infinite loop.
- **BFS mein `poll()` pe visited mark karna** — ek hi node queue mein kai baar aa sakta hai. **Daalte hi** mark karo.
- **Undirected graph mein sirf ek taraf edge jodna** — `u→v` aur `v→u` dono.
- **Disconnected graph ko ek hi DFS/BFS se cover karna** — saare nodes pe loop lagao.
- **Directed cycle ke liye sirf `visited` use karna** — 3 states (ya recursion-stack set) chahiye.
- **Grid mein boundary check bhoolna** — `nr >= 0 && nr < rows ...` pehle.
- **Node numbering** — 0-indexed ya 1-indexed? Array size `n + 1` lo agar 1-indexed.

> 💡 **Interview mein bolne wali line**: *"Main graph ko adjacency list mein rakhunga — O(V + E) space. Shortest path (unweighted) ke liye BFS, kyunki wo layer-by-layer chalta hai; `visited` se har node ek hi baar aayega, isliye O(V + E) time."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Find Center of Star Graph | Easy | Degree ka use | [leetcode.com/problems/find-center-of-star-graph](https://leetcode.com/problems/find-center-of-star-graph/) |
| 2 | Find if Path Exists in Graph | Easy | BFS/DFS reachability | [leetcode.com/problems/find-if-path-exists-in-graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) |
| 3 | Flood Fill | Easy | Grid DFS/BFS | [leetcode.com/problems/flood-fill](https://leetcode.com/problems/flood-fill/) |
| 4 | Number of Provinces | Medium | Connected components | [leetcode.com/problems/number-of-provinces](https://leetcode.com/problems/number-of-provinces/) |
| 5 | Number of Islands | Medium | Grid components | [leetcode.com/problems/number-of-islands](https://leetcode.com/problems/number-of-islands/) |
| 6 | Rotting Oranges | Medium | Multi-source BFS | [leetcode.com/problems/rotting-oranges](https://leetcode.com/problems/rotting-oranges/) |
| 7 | Is Graph Bipartite? | Medium | 2-coloring | [leetcode.com/problems/is-graph-bipartite](https://leetcode.com/problems/is-graph-bipartite/) |
| 8 | Clone Graph | Medium | DFS + HashMap (old → new) | [leetcode.com/problems/clone-graph](https://leetcode.com/problems/clone-graph/) |
| 9 | 01 Matrix | Medium | Multi-source BFS (distance) | [leetcode.com/problems/01-matrix](https://leetcode.com/problems/01-matrix/) |
| 10 | Surrounded Regions | Medium | Border se DFS | [leetcode.com/problems/surrounded-regions](https://leetcode.com/problems/surrounded-regions/) |
| 11 | Pacific Atlantic Water Flow | Medium | Ulta DFS (dono oceans se) | [leetcode.com/problems/pacific-atlantic-water-flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) |
| 12 | Word Ladder | Hard | Implicit graph pe BFS | [leetcode.com/problems/word-ladder](https://leetcode.com/problems/word-ladder/) |

Agla: [20-topological-sort.md](20-topological-sort.md)
