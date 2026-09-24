# 12. DFS (Depth-First Search)

> Pehle ye aane chahiye: [Recursion](../00-syllabus/01-basics/09-recursion.md), [Binary Tree](../00-syllabus/03-trees-and-heaps/13-binary-tree.md), [Graph Basics](../00-syllabus/05-graphs/19-graph-basics.md), [BFS (pattern)](11-bfs.md)

> **Standard definition**: A graph/tree traversal algorithm that explores as far as possible down one branch before backtracking, typically implemented via recursion or an explicit stack.

**Ek line mein**: Ek path pe **poori tarah neeche/aage** jao jab tak dead-end na aaye, phir **peeche aake** agla path try karo. Recursion khud ek **stack** hai — isliye DFS recursion mein bahut aasan likha jata hai.

**Trick yaad rakhne ki**: *"Bhulbhulaiya (maze) mein ek raasta pura explore karo pehle, dead-end mile toh peeche aake doosra raasta try karo"* — BFS "chaudai" mein failta hai, DFS "gehraai" mein jaata hai.

```
        A                      DFS order:  A → B → D → (dead end, peeche) → E → (peeche) → C → F
       / \
      B   C                    Har node pe:  "pehle apne BACHCHON ko poora khatam karo, phir aage"
     / \   \
    D   E   F
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Tree ki koi property nikalni hai  (height, sum, balanced, LCA, diameter, path)
✅ Grid/graph mein "connected group" dhoondna / ginna / naapna  (island, component, flood fill)
✅ "Kya path exist karta hai?"  /  "saare paths do"  /  "cycle hai kya?"
✅ Har sub-problem baaki se independent hai  → recursion se natural fit
```

| Sawaal ki bhasha | Variation |
|---|---|
| tree mein **root se yahan tak** ka sum / max / path-condition | ① **Tree top-down** (info neeche bhejo) |
| tree ka **height, diameter, balanced, LCA, max path sum** | ② **Tree bottom-up** (jawab upar laao) |
| **saare root-to-leaf paths** do / target sum wale paths | ③ **Path collect** (choose → un-choose) |
| **islands ginno / area / flood fill / border se juda** | ④ **Grid DFS** |
| **connected components, path exists, cycle, clone, saare paths** | ⑤ **Graph DFS** |
| bahut gehri chain (10⁵ deep) — recursion **overflow** hoga | ⑥ **Iterative DFS** (stack) |

### DFS ya BFS?

| Sawaal | Kaun? |
|---|---|
| Minimum steps / shortest (unweighted) | **BFS** |
| Level by level | **BFS** |
| Connected components, flood fill, tree property, cycle, saare paths | **DFS** |
| Dono chalta hai (sirf "reach ho sakta hai?") | Jo aasan lage — DFS ka code chhota |

### ❌ Kab NAHI
- **Shortest path** chahiye (unweighted) → [BFS](11-bfs.md). DFS pehla mila raasta deta hai, chhota nahi.
- **Har choice pe undo karke saare combinations/permutations** (sirf path nahi) → [Backtracking](13-backtracking.md).
- Chain bahut gehri (10⁵) → recursion nahi, **iterative** (⑥).

---

## 2. Code likhne ki recipe — 4 sawaal

```
1. BASE CASE  →  kab ruk jao?  node == null  /  grid ke bahar  /  wall  /  already visited
2. VISITED    →  dobara jaane se kaise roku?   grid: cell badal do   graph: boolean[] / state[]   tree: zaroorat NAHI
3. INFO       →  neeche kya BHEJUN (parameter)?   upar kya LAUTAUN (return)?
4. COMBINE    →  bachchon ke jawab se apna jawab kaise banau?  (sum, max, OR, count)
```

**Teen skeletons** (yehi likhna hai):

```
TREE:                                   GRID:                                   GRAPH:
dfs(node, info):                        dfs(r, c):                              dfs(u):
  if node == null: return base            if bahar ya wall ya visited: return     visited[u] = true
  a = dfs(node.left,  newInfo)            mark visited                            for v in adj[u]:
  b = dfs(node.right, newInfo)            for 4 directions: dfs(nr, nc)              if !visited[v]: dfs(v)
  return combine(a, b, node)
```

**Do ratta:** **base case pehle**, aur **visited tab mark karo jab andar aao** (grid/graph mein) — warna infinite recursion.

---

## 3. ① Tree Top-Down — info NEECHE bhejo

**Idea**: Root se yahan tak ka kuch pata hai (remaining sum, ab tak ka max) → **parameter** mein neeche bhejte jao. Har node us info se decide karta hai.

```
hasPathSum(root, 22):   [..] = us node ke call mein aaya target (neeche bheja hua)

                 5 [22]
               /        \
         4 [17]          8 [17]
         /              /      \
   11 [13]         13 [9]      4 [9]
    /    \                          \
 7 [2]   2 [2] ✓                     1 [5]

leaf 2 pe:  node.val (2) == target (2)  → true
```

```
goodNodes:  maxSoFar neeche jata hai;  node.val >= maxSoFar  →  good

        3            root hamesha good
       / \
      1   4          1 < 3 ✗        4 ≥ 3 ✓        (ab maxSoFar = 4)
     /   / \
    3   1   5        3 ≥ 3 ✓        1 < 4 ✗        5 ≥ 4 ✓        →  good = 4
```

```java
// Path Sum — kya root se kisi leaf tak ka sum == target?
public boolean hasPathSum(TreeNode root, int target) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return root.val == target;   // 🔑 LEAF pe check (null pe nahi)
    return hasPathSum(root.left, target - root.val)                            // 🔑 remaining neeche bheja
        || hasPathSum(root.right, target - root.val);
}

// Count Good Nodes — node good hai agar root se us tak sab values <= node.val
public int goodNodes(TreeNode root) { return goodNodes(root, Integer.MIN_VALUE); }

private int goodNodes(TreeNode node, int maxSoFar) {
    if (node == null) return 0;
    int good = node.val >= maxSoFar ? 1 : 0;
    int newMax = Math.max(maxSoFar, node.val);                                 // 🔑 ab tak ka max neeche bhejo
    return good + goodNodes(node.left, newMax) + goodNodes(node.right, newMax);
}

// Do trees ek saath (dono mein ek saath neeche jao)
public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null || q == null) return p == q;                                 // dono null → true, ek null → false
    return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

public boolean isSymmetric(TreeNode root) { return root == null || mirror(root.left, root.right); }

private boolean mirror(TreeNode a, TreeNode b) {
    if (a == null || b == null) return a == b;
    return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);   // 🔑 left↔right cross
}

public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left), right = invertTree(root.right);
    root.left = right;                                                          // dono bachche swap
    root.right = left;
    return root;
}
```

**Path Sum mein leaf pe hi check kyun?** `[1,2]` mein target 1 → root ke baad ek child `null` hai lekin root **leaf nahi** hai — null pe check karoge toh galat `true` aayega.

---

## 4. ② Tree Bottom-Up — jawab UPAR laao

**Idea**: Pehle left aur right se **poochho** (unka jawab return mein aata hai), phir **apna** jawab banao. Height/balanced/LCA sab yehi.

```
maxDepth(node) = 1 + max( maxDepth(left), maxDepth(right) )      # bachchon se pooch ke

Return vs Global (diameter / max path sum ka rule):
  UPAR kya jaye?   sirf EK side ka raasta  (parent ek hi taraf se judega)
  NODE pe kya best?  DONO side jodke  →  global variable mein update

        1        node 1: l = depth(2) = 2, r = depth(3) = 1
       / \       diameter = max(diameter, l + r) = 3       (4→2→1→3, edges mein)
      2   3      return 1 + max(l, r) = 3                   (upar sirf lamba side)
     / \
    4   5
```

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Balanced? — height return karo, "-1" = balanced nahi (signal)
public boolean isBalanced(TreeNode root) { return height(root) != -1; }

private int height(TreeNode node) {
    if (node == null) return 0;
    int l = height(node.left);
    if (l == -1) return -1;                                   // 🔑 neeche hi gadbad → seedha -1 upar bhejo
    int r = height(node.right);
    if (r == -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
}

// Diameter (edges mein) — GLOBAL mein best, RETURN mein ek side
private int diameter;

public int diameterOfBinaryTree(TreeNode root) {
    diameter = 0;
    depth(root);
    return diameter;
}

private int depth(TreeNode node) {
    if (node == null) return 0;
    int l = depth(node.left), r = depth(node.right);
    diameter = Math.max(diameter, l + r);                     // 🔑 is node se guzarne wala path (dono side)
    return 1 + Math.max(l, r);                                // 🔑 upar sirf ek side
}

// Lowest Common Ancestor
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;  // mil gaya (ya null)
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;           // 🔑 p ek side, q doosri → yehi LCA
    return left != null ? left : right;                       // jo side mila wahi upar bhejo
}

// Binary Tree Maximum Path Sum (values negative bhi ho sakte hain)
private int bestPath;

public int maxPathSum(TreeNode root) {
    bestPath = Integer.MIN_VALUE;
    gain(root);
    return bestPath;
}

private int gain(TreeNode node) {
    if (node == null) return 0;
    int l = Math.max(0, gain(node.left));                     // 🔑 negative raasta chhod do (0 = mat lo)
    int r = Math.max(0, gain(node.right));
    bestPath = Math.max(bestPath, node.val + l + r);          // is node ko "peak" maan ke best
    return node.val + Math.max(l, r);                         // upar sirf ek side
}
```

**Rule**: jawab **subtree ke andar** ki cheez hai → **return**. Jawab wo path hai jo **node se guzarta hai** (dono side) → **global** mein rakho, aur return mein sirf ek side.

---

## 5. ③ Path Collect — choose → un-choose (backtracking ka pehla kadam)

**Idea**: Saare root-to-leaf paths chahiye → ek **`path` list** saath-saath le chalo. Node pe aao → **add**, bachchon ko dekho, wapas jao → **remove**. Jab answer milega, **copy** save karo.

```
pathSum(root, 22):    path = [5]  → [5,4] → [5,4,11] → [5,4,11,7]   leaf, sum ≠ 22, wapas: remove 7
                                                      [5,4,11,2]   leaf, sum == 22 ✓  copy save
```

```java
// Path Sum II — saare root-to-leaf paths jinka sum == target
public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    walk(root, targetSum, new ArrayList<>(), result);
    return result;
}

private void walk(TreeNode node, int remaining, List<Integer> path, List<List<Integer>> result) {
    if (node == null) return;
    path.add(node.val);                                                       // CHOOSE
    if (node.left == null && node.right == null && remaining == node.val) {
        result.add(new ArrayList<>(path));                                    // 🔑 COPY (path aage badalta rahega)
    }
    walk(node.left, remaining - node.val, path, result);
    walk(node.right, remaining - node.val, path, result);
    path.remove(path.size() - 1);                                             // UN-CHOOSE
}

// Binary Tree Paths — "1->2->5". String immutable hai → un-choose ki zaroorat NAHI
public List<String> binaryTreePaths(TreeNode root) {
    List<String> result = new ArrayList<>();
    if (root != null) paths(root, "", result);
    return result;
}

private void paths(TreeNode node, String prefix, List<String> result) {
    String cur = prefix + node.val;
    if (node.left == null && node.right == null) { result.add(cur); return; }
    if (node.left != null) paths(node.left, cur + "->", result);
    if (node.right != null) paths(node.right, cur + "->", result);
}
```

Yehi **Choose → Explore → Un-choose** ka structure [Backtracking](13-backtracking.md) mein subsets/permutations pe lagta hai.

---

## 6. ④ Grid DFS — flood fill family

**Idea**: Grid = graph, har cell ke 4 padosi. **Visited = cell ki value badal do** (input mutate) — alag `visited` array nahi chahiye.

```
grid:  1 1 0 0 0        numIslands   = 3   (top-left 2×2, akela (2,2), neeche (3,3)+(3,4))
       1 1 0 0 0        maxArea      = 4
       0 0 1 0 0
       0 0 0 1 1
```

**Chaar sub-templates** — sab ek hi DFS ke chhote badlav:

```
COUNT   :  har unvisited land pe  count++  aur poora island "sink"          (numIslands)
SIZE    :  dfs ka return = 1 + (chaaro padosiyon ka size)                    (maxAreaOfIsland)
FILL    :  purana color check → naya color; SAME color ho toh chhodo         (floodFill)
BORDER  :  ULTA socho — border se shuru karke jo pahunche unhe mark karo     (Surrounded Regions, Enclaves, Pacific Atlantic)
```

```java
private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

// COUNT — Number of Islands
public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                sink(grid, r, c);                                              // 🔑 pura island visited
            }
        }
    }
    return count;
}

private void sink(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;   // 🔑 guard pehle
    grid[r][c] = '0';                                                          // visited
    for (int[] d : DIRS) sink(grid, r + d[0], c + d[1]);
}

// SIZE — Max Area of Island
public int maxAreaOfIsland(int[][] grid) {
    int best = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == 1) best = Math.max(best, area(grid, r, c));
        }
    }
    return best;
}

private int area(int[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != 1) return 0;
    grid[r][c] = 0;
    int size = 1;                                                              // 🔑 khud + chaaro taraf ka size
    for (int[] d : DIRS) size += area(grid, r + d[0], c + d[1]);
    return size;
}

// FILL — Flood Fill
public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int old = image[sr][sc];
    if (old != color) fill(image, sr, sc, old, color);                         // 🔑 same color pe chalaya toh infinite loop
    return image;
}

private void fill(int[][] img, int r, int c, int old, int color) {
    if (r < 0 || c < 0 || r >= img.length || c >= img[0].length || img[r][c] != old) return;
    img[r][c] = color;                                                         // naya color hi visited ka kaam karta hai
    for (int[] d : DIRS) fill(img, r + d[0], c + d[1], old, color);
}

// BORDER-FIRST — Surrounded Regions: border se juda 'O' safe, baaki 'O' → 'X'
public void solve(char[][] board) {
    int m = board.length, n = board[0].length;
    for (int r = 0; r < m; r++) { markSafe(board, r, 0); markSafe(board, r, n - 1); }
    for (int c = 0; c < n; c++) { markSafe(board, 0, c); markSafe(board, m - 1, c); }
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (board[r][c] == 'O') board[r][c] = 'X';                         // border se nahi juda → surrounded
            else if (board[r][c] == '#') board[r][c] = 'O';                    // safe wapas
        }
    }
}

private void markSafe(char[][] b, int r, int c) {
    if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != 'O') return;
    b[r][c] = '#';                                                             // temporary "safe" mark
    for (int[] d : DIRS) markSafe(b, r + d[0], c + d[1]);
}

// BORDER-FIRST — Number of Enclaves: jo land border se nahi pahunch sakta
public int numEnclaves(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    for (int r = 0; r < m; r++) { sinkLand(grid, r, 0); sinkLand(grid, r, n - 1); }
    for (int c = 0; c < n; c++) { sinkLand(grid, 0, c); sinkLand(grid, m - 1, c); }
    int count = 0;
    for (int[] row : grid) for (int v : row) count += v;                       // bacha hua land = enclave
    return count;
}

private void sinkLand(int[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1) return;
    g[r][c] = 0;
    for (int[] d : DIRS) sinkLand(g, r + d[0], c + d[1]);
}

// BORDER-FIRST — Pacific Atlantic: paani ULTA (neeche se upar) chalta socho, dono ocean se reach
public List<List<Integer>> pacificAtlantic(int[][] h) {
    int m = h.length, n = h[0].length;
    boolean[][] pacific = new boolean[m][n], atlantic = new boolean[m][n];
    for (int r = 0; r < m; r++) { climb(h, pacific, r, 0); climb(h, atlantic, r, n - 1); }
    for (int c = 0; c < n; c++) { climb(h, pacific, 0, c); climb(h, atlantic, m - 1, c); }
    List<List<Integer>> result = new ArrayList<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (pacific[r][c] && atlantic[r][c]) result.add(Arrays.asList(r, c));   // 🔑 dono se pahunch sakta hai
        }
    }
    return result;
}

private void climb(int[][] h, boolean[][] seen, int r, int c) {
    seen[r][c] = true;
    for (int[] d : DIRS) {
        int nr = r + d[0], nc = c + d[1];
        if (nr < 0 || nc < 0 || nr >= h.length || nc >= h[0].length || seen[nr][nc]) continue;
        if (h[nr][nc] >= h[r][c]) climb(h, seen, nr, nc);                      // ulta chalte hain → upar ya barabar
    }
}
```

**Border-first kyun?** "Kaun surrounded hai?" seedha pucho toh har cell ke liye check karna padta hai. **Ulta**: "kaun **bach sakta** hai?" — border se DFS karo, jo mila wo safe, baaki sab surrounded.

```
X X X X        X X X X
X O O X   →    X X X X      andar ke O border se juda nahi → X
X X O X        X X X X
X O X X        X O X X      neeche wala O border pe hai → safe
```

---

## 7. ⑤ Graph DFS — components, path, cycle, clone, all paths

**Idea**: Graph mein `visited[]` **zaroori** hai (tree mein nahi tha kyunki cycle nahi). Edge list mili ho toh pehle **adjacency list** banao.

```java
// COMPONENTS — Number of Provinces (adjacency matrix diya hai)
public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length, provinces = 0;
    boolean[] visited = new boolean[n];
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            provinces++;                                                       // 🔑 naya unvisited node = naya component
            visit(isConnected, visited, i);
        }
    }
    return provinces;
}

private void visit(int[][] g, boolean[] visited, int i) {
    visited[i] = true;
    for (int j = 0; j < g.length; j++) {
        if (g[i][j] == 1 && !visited[j]) visit(g, visited, j);
    }
}

// PATH EXISTS — edge list → adjacency list → DFS
public boolean validPath(int n, int[][] edges, int source, int destination) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }   // undirected: dono taraf
    return reach(adj, new boolean[n], source, destination);
}

private boolean reach(List<List<Integer>> adj, boolean[] visited, int cur, int dest) {
    if (cur == dest) return true;
    visited[cur] = true;
    for (int next : adj.get(cur)) {
        if (!visited[next] && reach(adj, visited, next, dest)) return true;    // 🔑 mil gaya toh turant true upar bhejo
    }
    return false;
}

// ALL PATHS — DAG mein 0 se n-1 tak saare raaste (choose/un-choose)
public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
    List<List<Integer>> paths = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    path.add(0);
    collect(graph, 0, path, paths);
    return paths;
}

private void collect(int[][] graph, int node, List<Integer> path, List<List<Integer>> paths) {
    if (node == graph.length - 1) { paths.add(new ArrayList<>(path)); return; }
    for (int next : graph[node]) {
        path.add(next);                                                        // CHOOSE
        collect(graph, next, path, paths);
        path.remove(path.size() - 1);                                          // UN-CHOOSE (visited nahi — DAG mein loop nahi)
    }
}
```

### Cycle detection — directed vs undirected (alag trick!)

```
UNDIRECTED :  jis raaste se AAYE usko chhod ke koi visited padosi mila → cycle      ("parent" skip)
DIRECTED   :  sirf "visited" kaafi nahi — 3 state chahiye:
                 0 = unvisited    1 = abhi is recursion path pe (visiting)    2 = done
              path pe wapas aaye (state 1 dikha) → cycle

  A → B → C → A :  A(1) → B(1) → C(1) → A dikha, state 1  →  CYCLE ✓
  A → B, A → C, C → B :  B pehle done(2) tha; C se B dobara dikha (state 2) → cycle NAHI (diamond)
```

```java
// DIRECTED cycle — Course Schedule (cycle hai toh saare course nahi ho sakte)
public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);                     // p[1] pehle, phir p[0]
    int[] state = new int[numCourses];                                         // 0 unvisited, 1 visiting, 2 done
    for (int i = 0; i < numCourses; i++) {
        if (hasCycle(adj, state, i)) return false;
    }
    return true;
}

private boolean hasCycle(List<List<Integer>> adj, int[] state, int cur) {
    if (state[cur] == 1) return true;                                          // 🔑 apne hi path pe wapas → cycle
    if (state[cur] == 2) return false;                                         // pehle hi poora dekh chuke
    state[cur] = 1;
    for (int next : adj.get(cur)) {
        if (hasCycle(adj, state, next)) return true;
    }
    state[cur] = 2;
    return false;
}

// UNDIRECTED cycle (simple graph: parallel edges nahi) — parent skip
public boolean hasCycleUndirected(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
    boolean[] visited = new boolean[n];
    for (int i = 0; i < n; i++) {
        if (!visited[i] && cycleFrom(adj, visited, i, -1)) return true;
    }
    return false;
}

private boolean cycleFrom(List<List<Integer>> adj, boolean[] visited, int cur, int parent) {
    visited[cur] = true;
    for (int next : adj.get(cur)) {
        if (next == parent) continue;                                          // 🔑 jis edge se aaye wahi wapas nahi
        if (visited[next] || cycleFrom(adj, visited, next, cur)) return true;  // visited padosi (parent nahi) → cycle
    }
    return false;
}
```

### Clone Graph (DFS + HashMap)

```java
class Node {
    public int val;
    public List<Node> neighbors = new ArrayList<>();
    Node(int val) { this.val = val; }
}

public Node cloneGraph(Node node) {
    return node == null ? null : clone(node, new HashMap<>());
}

private Node clone(Node node, Map<Node, Node> copy) {
    if (copy.containsKey(node)) return copy.get(node);                         // 🔑 pehle hi copy ho chuka (= visited)
    Node cloned = new Node(node.val);
    copy.put(node, cloned);                                                    // 🔑 padosiyon se PEHLE map mein (cycle ke liye)
    for (Node nb : node.neighbors) cloned.neighbors.add(clone(nb, copy));
    return cloned;
}
```

---

## 8. ⑥ Iterative DFS — jab recursion overflow kare

**Kab**: Java ka default stack ~10–20 hazaar frames sambhalta hai. **10⁵ deep chain** (ya bada grid ka ek lamba island) → `StackOverflowError`. Tab **recursion ki jagah apna `Deque` stack**.

```
recursion:  dfs(v) { mark v; for u in adj[v]: dfs(u) }
iterative:  push start, mark start
            while stack not empty:  cur = pop;  for u in adj[cur]: if !visited: mark u, push u
            🔑 push karte hi mark (BFS jaisa) — warna ek node kai baar push hoga
```

```java
// Number of Islands — bina recursion ke
public int numIslandsIterative(char[][] grid) {
    int m = grid.length, n = grid[0].length, count = 0;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    Deque<int[]> stack = new ArrayDeque<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] != '1') continue;
            count++;
            grid[r][c] = '0';                                                  // 🔑 push karte hi visited
            stack.push(new int[]{r, c});
            while (!stack.isEmpty()) {
                int[] cur = stack.pop();
                for (int[] d : dirs) {
                    int nr = cur[0] + d[0], nc = cur[1] + d[1];
                    if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] != '1') continue;
                    grid[nr][nc] = '0';
                    stack.push(new int[]{nr, nc});
                }
            }
        }
    }
    return count;
}
```

**Yaad**: is order mein visit alag ho sakta hai (last push pehle pop). Sirf "kya reach hua / kitne components" ke liye farak nahi padta; **exact DFS order** chahiye toh pop pe hi visited mark karo.

---

## 9. Sab ek nazar mein

| Variation | Info kaise? | Visited | Return / answer |
|---|---|---|---|
| ① Tree top-down | **parameter** (remaining, maxSoFar) | zaroorat nahi | `boolean` / count |
| ② Tree bottom-up | **return value** (height, gain) | zaroorat nahi | `1 + max(l, r)` / global best |
| ③ Path collect | `path` list + **un-choose** | zaroorat nahi | copy jab leaf pe sahi |
| ④ Grid | cell ki value badlo | grid mutate | count / size / mark |
| ⑤ Graph | `visited[]` / `state[]` | zaroori | components / bool / paths |
| ⑥ Iterative | `Deque` stack | push pe mark | same as recursive |

## Common galtiyan

- **Base case baad mein likhna** — `null` / boundary check **sabse pehle**.
- **Visited mark bhoolna** (grid/graph) → infinite recursion. Tree mein zaroorat nahi.
- **`floodFill` mein naya color == purana color** → infinite loop; pehle check karo.
- **Path Sum mein `null` pe check** karna — leaf (`left == null && right == null`) pe karo.
- **Return vs global confuse** — diameter/max path sum mein return mein **ek side**, global mein **dono side**.
- **Result mein `path` seedha add karna** — copy karo: `new ArrayList<>(path)`.
- **Directed cycle mein sirf `visited`** — 3 state (0/1/2) chahiye; **undirected mein parent** skip.
- **Fields (global) reset na karna** — har call ke shuru mein `diameter = 0` jaisa.
- **Grid mutate karne se pehle** poochho ki input badalna allowed hai ya nahi (nahi ho toh `visited[][]`).
- **Bahut gehra recursion** — StackOverflow; iterative stack.

> 💡 **Interview mein bolne wali line**: *"Har sub-problem independent hai aur mujhe poori structure explore karni hai, isliye DFS — base case pehle, visited mark karke. Time O(V + E) (tree mein O(n)), space O(depth) recursion stack ka. Agar chain bahut gehri ho toh explicit stack se iterative kar lunga."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Maximum Depth of Binary Tree | ② Bottom-up | Easy | [leetcode.com/problems/maximum-depth-of-binary-tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) |
| 2 | Same Tree | ① Top-down | Easy | [leetcode.com/problems/same-tree](https://leetcode.com/problems/same-tree/) |
| 3 | Invert Binary Tree | ① Top-down | Easy | [leetcode.com/problems/invert-binary-tree](https://leetcode.com/problems/invert-binary-tree/) |
| 4 | Symmetric Tree | ① Top-down | Easy | [leetcode.com/problems/symmetric-tree](https://leetcode.com/problems/symmetric-tree/) |
| 5 | Path Sum | ① Top-down | Easy | [leetcode.com/problems/path-sum](https://leetcode.com/problems/path-sum/) |
| 6 | Balanced Binary Tree | ② Bottom-up | Easy | [leetcode.com/problems/balanced-binary-tree](https://leetcode.com/problems/balanced-binary-tree/) |
| 7 | Diameter of Binary Tree | ② Bottom-up | Easy | [leetcode.com/problems/diameter-of-binary-tree](https://leetcode.com/problems/diameter-of-binary-tree/) |
| 8 | Binary Tree Paths | ③ Path collect | Easy | [leetcode.com/problems/binary-tree-paths](https://leetcode.com/problems/binary-tree-paths/) |
| 9 | Count Good Nodes in Binary Tree | ① Top-down | Medium | [leetcode.com/problems/count-good-nodes-in-binary-tree](https://leetcode.com/problems/count-good-nodes-in-binary-tree/) |
| 10 | Path Sum II | ③ Path collect | Medium | [leetcode.com/problems/path-sum-ii](https://leetcode.com/problems/path-sum-ii/) |
| 11 | Lowest Common Ancestor of a Binary Tree | ② Bottom-up | Medium | [leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) |
| 12 | Flood Fill | ④ Grid | Easy | [leetcode.com/problems/flood-fill](https://leetcode.com/problems/flood-fill/) |
| 13 | Number of Islands | ④ Grid | Medium | [leetcode.com/problems/number-of-islands](https://leetcode.com/problems/number-of-islands/) |
| 14 | Max Area of Island | ④ Grid | Medium | [leetcode.com/problems/max-area-of-island](https://leetcode.com/problems/max-area-of-island/) |
| 15 | Number of Enclaves | ④ Grid (border-first) | Medium | [leetcode.com/problems/number-of-enclaves](https://leetcode.com/problems/number-of-enclaves/) |
| 16 | Surrounded Regions | ④ Grid (border-first) | Medium | [leetcode.com/problems/surrounded-regions](https://leetcode.com/problems/surrounded-regions/) |
| 17 | Pacific Atlantic Water Flow | ④ Grid (border-first) | Medium | [leetcode.com/problems/pacific-atlantic-water-flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) |
| 18 | Find if Path Exists in Graph | ⑤ Graph | Easy | [leetcode.com/problems/find-if-path-exists-in-graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) |
| 19 | Number of Provinces | ⑤ Graph | Medium | [leetcode.com/problems/number-of-provinces](https://leetcode.com/problems/number-of-provinces/) |
| 20 | All Paths From Source to Target | ⑤ Graph (paths) | Medium | [leetcode.com/problems/all-paths-from-source-to-target](https://leetcode.com/problems/all-paths-from-source-to-target/) |
| 21 | Clone Graph | ⑤ Graph | Medium | [leetcode.com/problems/clone-graph](https://leetcode.com/problems/clone-graph/) |
| 22 | Course Schedule | ⑤ Graph (directed cycle) | Medium | [leetcode.com/problems/course-schedule](https://leetcode.com/problems/course-schedule/) |
| 23 | Graph Valid Tree 🔒 | ⑤ Graph (undirected cycle) | Medium | [leetcode.com/problems/graph-valid-tree](https://leetcode.com/problems/graph-valid-tree/) |
| 24 | Binary Tree Maximum Path Sum | ② Bottom-up (global) | Hard | [leetcode.com/problems/binary-tree-maximum-path-sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Base case? Visited kaise? Neeche kya bhejun / upar kya lautaun? Bachchon ke jawab kaise jodun?"* — phir code.

Agla: [13-backtracking.md](13-backtracking.md)
