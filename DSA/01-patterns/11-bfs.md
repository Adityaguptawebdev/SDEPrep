# 11. BFS (Breadth-First Search)

> Pehle ye aane chahiye: [Queue & Deque](../00-syllabus/02-linear-structures/12-queue-and-deque.md), [Graph Basics](../00-syllabus/05-graphs/19-graph-basics.md), [Binary Tree](../00-syllabus/03-trees-and-heaps/13-binary-tree.md)

> **Standard definition**: A graph/tree traversal algorithm that explores all neighbors at the current depth level before moving to nodes at the next depth level, using a queue.

**Ek line mein**: Ek **queue** rakho, start se shuru karo, **ek level ke saare nodes** process karo (unke naye padosi queue mein), phir agla level. **Level number = start se distance** — isliye **unweighted shortest path** BFS se milta hai.

**Trick yaad rakhne ki**: *"Talaab mein pathar phenka — ripples"* — pehli ripple (level 1) turant paas, phir doosri (level 2) uske baad. Jo cheez **pehli ripple mein** pahunchi wo **sabse kam steps** mein pahunchi.

```
start ──▶ level 0:  S
          level 1:  a  b        ← S se 1 step
          level 2:  c  d  e     ← S se 2 steps
          level 3:  ...
Pehli baar jis level mein target dikha = SHORTEST steps
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Sawaal "minimum steps / moves / transformations / shortest path" ka hai  —  aur har move ki COST BARABAR hai (unweighted)
✅ Ya "level by level" kaam karna hai  (tree ke levels, infection ek saath phailna)
✅ Ya "har cell ke liye NEAREST X ki doori"
```

| Sawaal ki bhasha | Variation |
|---|---|
| tree ka **level order / right view / zigzag / min depth** | ① **Level order** |
| grid/graph mein **start se end tak minimum steps** | ② **Shortest path (single source)** |
| **saare sade santre ek saath** phaile, **har cell ki nearest 0/land** ki doori | ③ **Multi-source BFS** |
| **words badalna / lock ke wheels / positions** — graph diya nahi, **states** hain | ④ **Implicit graph (state-space)** |
| "**k obstacles tak hata sakte ho**", "chaabiyan (keys) uthate hue" — state mein **extra info** | ⑤ **Extra state (visited 3D)** |
| graph **copy** / connected traversal | ⑥ **Graph BFS (hashmap ke saath)** |

### ❌ Kab NAHI
- **Weighted** edges (alag-alag cost) → [Dijkstra](../00-syllabus/05-graphs/22-shortest-path.md) (sirf 0/1 weights ho toh 0-1 BFS).
- **Saare raaste / permutations** chahiye → [DFS](12-dfs.md) / [Backtracking](13-backtracking.md).
- Bahut **gehra** aur andar hi answer ho → DFS memory mein sasta.

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. START     →  kahan se shuru?  ek node  ya  SAARE sources ek saath (multi-source)?
2. STATE     →  queue mein kya jaye?  node / (row, col) / string / (row, col, k) / (row, col, keys)
3. PADOSI    →  agle states kaise? (4/8 directions, word ka ek akshar badlo, wheel ±1 ...)
4. VISITED   →  kab mark? QUEUE MEIN DAALTE HI  (poll pe nahi) + boundary check
5. ANSWER    →  level (steps) kab return?  target milte hi  /  queue khatam hone pe
```

**Ek universal skeleton** (yehi baar-baar likhna hai):

```
queue.add(start);  visited.add(start);  steps = 0
while queue not empty:
    for (size = queue.size(); size > 0; size--):       # 🔑 ek poora LEVEL
        cur = queue.poll()
        if cur == target:  return steps
        for next in neighbors(cur):
            if next valid AND not visited:
                visited.add(next)                        # 🔑 daalte hi mark
                queue.add(next)
    steps++
return -1                                                # target tak pahunch hi nahi paye
```

**Do ratta:** `size = queue.size()` loop ke **shuru mein freeze** karo (level ke nodes), aur `visited` **queue mein daalte hi** mark karo (warna ek node kai baar queue mein aayega).

---

## 3. ① Level Order (tree)

```
        3                   levelOrder     : [[3], [9, 20], [15, 7]]
       / \                  rightSideView  : [3, 20, 7]         (har level ka AAKHRI)
      9   20                zigzag         : [[3], [20, 9], [15, 7]]   (har doosra level ulta)
         /  \               minDepth       : 2                  (pehla leaf 9 level 1 pe → depth 2)
        15   7
```

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();                              // 🔑 is level ke nodes freeze
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}

// Right Side View — har level ka AAKHRI node
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> view = new ArrayList<>();
    if (root == null) return view;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (i == size - 1) view.add(node.val);            // level ka aakhri
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return view;
}

// Zigzag — har doosra level ulta (add(0, x) se aage jodo)
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    boolean leftToRight = true;
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (leftToRight) level.add(node.val);
            else level.add(0, node.val);                       // ulta order: aage jodo
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
        leftToRight = !leftToRight;
    }
    return result;
}

// Minimum Depth — pehla LEAF milte hi ruk jao (DFS poora tree ghoomta, BFS jaldi rukta hai)
public int minDepth(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    int depth = 1;
    while (!queue.isEmpty()) {
        for (int size = queue.size(); size > 0; size--) {
            TreeNode node = queue.poll();
            if (node.left == null && node.right == null) return depth;    // 🔑 pehla leaf = sabse kam depth
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        depth++;
    }
    return depth;
}
```

---

## 4. ② Shortest Path (single source, grid)

**Shortest Path in Binary Matrix**: `0` = khula, `1` = deewar. **8 directions** mein `(0,0)` se `(n−1,n−1)` tak minimum **cells** ka raasta.

```
grid:  0 0 0          steps (level):   1 2 3        raasta: (0,0) → (1,1) → (2,2)   = 3 cells
       1 1 0                           . 2 3?       (8 direction mein tirchha bhi allowed)
       1 1 0
```

```java
public int shortestPathBinaryMatrix(int[][] grid) {
    int n = grid.length;
    if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};   // 8 directions
    Queue<int[]> queue = new ArrayDeque<>();
    queue.offer(new int[]{0, 0});
    grid[0][0] = 1;                                              // visited: deewar bana do (input mein hi mark)
    int steps = 1;                                                // cells ginte hain (start bhi ek cell)
    while (!queue.isEmpty()) {
        for (int size = queue.size(); size > 0; size--) {
            int[] cur = queue.poll();
            if (cur[0] == n - 1 && cur[1] == n - 1) return steps;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 1) continue;   // bahar ya deewar/visited
                grid[nr][nc] = 1;                                 // 🔑 daalte hi visited
                queue.offer(new int[]{nr, nc});
            }
        }
        steps++;
    }
    return -1;
}
```

---

## 5. ③ Multi-Source BFS

**Idea**: Saare sources ko **shuru mein hi ek saath queue mein** daal do (level 0). BFS unse **ek saath phailta** hai — har cell ko **sabse paas wale source ki doori** milti hai.

```
01 Matrix:  har cell ki nearest 0 tak doori
mat:      0 0 0        dist:   0 0 0
          0 1 0                0 1 0
          1 1 1                1 2 1

Saare 0 → queue (dist 0).  Unke 1-padosi → dist 1.  Unke padosi → dist 2 ...
```

```java
// 01 Matrix — har cell ki nearest 0 tak (4-direction) doori
public int[][] updateMatrix(int[][] mat) {
    int m = mat.length, n = mat[0].length;
    int[][] dist = new int[m][n];
    Queue<int[]> queue = new ArrayDeque<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (mat[r][c] == 0) queue.offer(new int[]{r, c});     // 🔑 saare 0 shuru mein queue mein (multi-source)
            else dist[r][c] = -1;                                  // -1 = abhi tak pahunche nahi
        }
    }
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        for (int[] d : dirs) {
            int nr = cur[0] + d[0], nc = cur[1] + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[cur[0]][cur[1]] + 1;               // pichhle level + 1
            queue.offer(new int[]{nr, nc});
        }
    }
    return dist;
}

// As Far from Land as Possible — paani wala wo cell jo land se SABSE door ho (Manhattan). Land = 1
public int maxDistance(int[][] grid) {
    int n = grid.length;
    Queue<int[]> queue = new ArrayDeque<>();
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) queue.offer(new int[]{r, c});      // saari zameen ek saath source
        }
    }
    if (queue.isEmpty() || queue.size() == n * n) return -1;         // sirf paani ya sirf zameen
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    int level = -1;
    while (!queue.isEmpty()) {
        level++;
        for (int size = queue.size(); size > 0; size--) {
            int[] cur = queue.poll();
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 1) continue;
                grid[nr][nc] = 1;                                     // paani ko zameen bana do = visited
                queue.offer(new int[]{nr, nc});
            }
        }
    }
    return level;                                                     // aakhri level = sabse door paani
}
```

**Rotting Oranges** bhi yehi hai (sade santre = sources, level = minute) — [Graph Basics](../00-syllabus/05-graphs/19-graph-basics.md) mein code hai.

---

## 6. ④ Implicit Graph (state-space) — graph diya nahi, states khud banao

**Idea**: Har **state** ek node hai; **ek move** = edge. Padosi **generate** karo, `visited` ke liye **`Set<String>`**.

```
Open the Lock:   "0000" → 4 wheels, har wheel ±1 (0↔9 gol)  →  ek state ke 8 padosi
                  target "0202",  deadends = ["0201","0101","0102","1212","2002"]

0000 ──▶ 1000, 9000, 0100, 0900, 0010, 0090, 0001, 0009      (level 1)
       ... deadend wale states queue mein daalo hi mat (unhe pehle se visited maan lo)
level 6 mein 0202 → answer 6
```

```java
public int openLock(String[] deadends, String target) {
    Set<String> visited = new HashSet<>(Arrays.asList(deadends));   // 🔑 deadend = pehle se visited (wahan jaana mana)
    if (visited.contains("0000")) return -1;
    Queue<String> queue = new ArrayDeque<>();
    queue.offer("0000");
    visited.add("0000");
    int steps = 0;
    while (!queue.isEmpty()) {
        for (int size = queue.size(); size > 0; size--) {
            String cur = queue.poll();
            if (cur.equals(target)) return steps;
            for (int i = 0; i < 4; i++) {                             // 4 wheels
                for (int delta : new int[]{1, 9}) {                   // +1 aur −1 (9 = −1 mod 10)
                    char[] next = cur.toCharArray();
                    next[i] = (char) ('0' + (next[i] - '0' + delta) % 10);
                    String s = new String(next);
                    if (visited.add(s)) queue.offer(s);               // add() true = pehli baar → queue mein
                }
            }
        }
        steps++;
    }
    return -1;
}

// Word Ladder — beginWord se endWord, har step mein EK akshar badlo (naya word wordList mein ho)
public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<>(wordList);
    if (!words.contains(endWord)) return 0;
    Queue<String> queue = new ArrayDeque<>();
    queue.offer(beginWord);
    words.remove(beginWord);
    int steps = 1;                                                     // words ginte hain (begin bhi ek)
    while (!queue.isEmpty()) {
        for (int size = queue.size(); size > 0; size--) {
            String cur = queue.poll();
            if (cur.equals(endWord)) return steps;
            char[] chars = cur.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {                    // 🔑 har position pe har akshar try
                    chars[i] = c;
                    String next = new String(chars);
                    if (words.remove(next)) queue.offer(next);         // remove() true = word tha aur ab visited
                }
                chars[i] = original;                                    // wapas theek karo
            }
        }
        steps++;
    }
    return 0;
}
```

**Trick**: `wordList` ke `Set` se **`remove` karna hi "visited" hai** — alag `visited` set nahi chahiye.

---

## 7. ⑤ Extra State (visited 3D) — Obstacles Elimination

**Sawaal**: Grid mein `1` = deewar. **Zyada se zyada `k` deewarein** tod sakte ho. `(0,0)` se `(m−1,n−1)` tak minimum steps?

**Dikkat**: Ek hi cell `(r, c)` pe **alag-alag `k` bache hue** ke saath aana **alag situation** hai (zyada bache = behtar). Toh **visited `(r, c)` pe nahi, `(r, c, kBacha)` pe**.

```
STATE = (row, col, tode-bina bache hue k)     visited[r][c][kLeft]

next cell 0 ho → kLeft wahi;   next cell 1 ho → kLeft − 1  (kLeft < 0 ho toh jaana mana)
```

```java
public int shortestPath(int[][] grid, int k) {
    int m = grid.length, n = grid[0].length;
    boolean[][][] visited = new boolean[m][n][k + 1];               // 🔑 state: (r, c, bache hue eliminations)
    Queue<int[]> queue = new ArrayDeque<>();
    queue.offer(new int[]{0, 0, k});
    visited[0][0][k] = true;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    int steps = 0;
    while (!queue.isEmpty()) {
        for (int size = queue.size(); size > 0; size--) {
            int[] cur = queue.poll();
            if (cur[0] == m - 1 && cur[1] == n - 1) return steps;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
                int left = cur[2] - grid[nr][nc];                    // deewar (1) pe ek elimination kharch
                if (left < 0 || visited[nr][nc][left]) continue;     // elimination khatam ya ye state dekh chuke
                visited[nr][nc][left] = true;
                queue.offer(new int[]{nr, nc, left});
            }
        }
        steps++;
    }
    return -1;
}
```

Isi tarah **"keys uthate hue"** (bitmask state) ya **"kitne stops"** — jab bhi answer **sirf position** se decide nahi hota, **extra info ko state mein** daalo.

---

## 8. ⑥ Graph BFS with HashMap — Clone Graph

**Problem**: Connected undirected graph ki **deep copy**. **Trick**: `Map<old, new>` — jo node pehle copy ho chuka, uska naya version yahan se lo (yahi `visited` bhi hai).

```java
class Node {
    public int val;
    public List<Node> neighbors = new ArrayList<>();
    Node(int val) { this.val = val; }
}

public Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> copy = new HashMap<>();                          // purana → naya (aur visited bhi)
    copy.put(node, new Node(node.val));
    Queue<Node> queue = new ArrayDeque<>();
    queue.offer(node);
    while (!queue.isEmpty()) {
        Node cur = queue.poll();
        for (Node nb : cur.neighbors) {
            if (!copy.containsKey(nb)) {                              // pehli baar dikha → naya banao, queue mein
                copy.put(nb, new Node(nb.val));
                queue.offer(nb);
            }
            copy.get(cur).neighbors.add(copy.get(nb));                // 🔑 naye cur ke neighbors mein naya nb jodo
        }
    }
    return copy.get(node);
}
```

---

## 9. Sab ek nazar mein

| Variation | Start | State | Padosi | Return |
|---|---|---|---|---|
| ① Level order | root | node | `left`, `right` | level lists / pehla leaf |
| ② Shortest path | ek cell | `(r, c)` | 4 / 8 directions | target milte hi `steps` |
| ③ Multi-source | **saare sources** level 0 pe | `(r, c)` | 4 directions | `dist[][]` / aakhri level |
| ④ Implicit graph | start state | `String` | ek akshar badlo / wheel ±1 | target state milte hi |
| ⑤ Extra state | `(0,0,k)` | `(r, c, k)` | 4 dir, `k −= wall` | `(m−1, n−1)` milte hi |
| ⑥ Graph copy | ek node | node | `neighbors` | `copy.get(node)` |

## Common galtiyan

- **`visited` poll pe mark karna** — ek node kai baar queue mein → time badh jata hai (kabhi galat bhi).
- **`queue.size()` loop ke andar** dobara use karna — level ka freeze nahi hota.
- **Multi-source mein sources ko baad mein daalna** — sab **shuru mein hi** queue mein.
- **Extra state bhoolna** — obstacles/keys wale sawaal mein sirf `(r, c)` visited rakhna galat answer deta hai.
- **Weighted graph pe BFS** — Dijkstra chahiye.
- **`steps` ka start (0 ya 1)** — sawaal "edges" ginta hai ya "cells/words" — start accordingly.
- **Grid mein boundary check** neighbors pe pehle.

> 💡 **Interview mein bolne wali line**: *"Har move ki cost barabar hai aur minimum steps chahiye, isliye BFS — queue mein level-by-level, kyunki pehli baar jis level mein target aata hai wahi shortest hai. Visited ko queue mein daalte hi mark karunga. Time O(V + E)."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Minimum Depth of Binary Tree | ① Level | Easy | [leetcode.com/problems/minimum-depth-of-binary-tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/) |
| 2 | Binary Tree Level Order Traversal | ① Level | Medium | [leetcode.com/problems/binary-tree-level-order-traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| 3 | Binary Tree Right Side View | ① Level | Medium | [leetcode.com/problems/binary-tree-right-side-view](https://leetcode.com/problems/binary-tree-right-side-view/) |
| 4 | Binary Tree Zigzag Level Order Traversal | ① Level | Medium | [leetcode.com/problems/binary-tree-zigzag-level-order-traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) |
| 5 | Shortest Path in Binary Matrix | ② Shortest | Medium | [leetcode.com/problems/shortest-path-in-binary-matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) |
| 6 | Rotting Oranges | ③ Multi-source | Medium | [leetcode.com/problems/rotting-oranges](https://leetcode.com/problems/rotting-oranges/) |
| 7 | 01 Matrix | ③ Multi-source | Medium | [leetcode.com/problems/01-matrix](https://leetcode.com/problems/01-matrix/) |
| 8 | As Far from Land as Possible | ③ Multi-source | Medium | [leetcode.com/problems/as-far-from-land-as-possible](https://leetcode.com/problems/as-far-from-land-as-possible/) |
| 9 | Open the Lock | ④ Implicit | Medium | [leetcode.com/problems/open-the-lock](https://leetcode.com/problems/open-the-lock/) |
| 10 | Minimum Genetic Mutation | ④ Implicit | Medium | [leetcode.com/problems/minimum-genetic-mutation](https://leetcode.com/problems/minimum-genetic-mutation/) |
| 11 | Perfect Squares | ④ Implicit (levels) | Medium | [leetcode.com/problems/perfect-squares](https://leetcode.com/problems/perfect-squares/) |
| 12 | Snakes and Ladders | ④ Implicit | Medium | [leetcode.com/problems/snakes-and-ladders](https://leetcode.com/problems/snakes-and-ladders/) |
| 13 | Clone Graph | ⑥ Graph copy | Medium | [leetcode.com/problems/clone-graph](https://leetcode.com/problems/clone-graph/) |
| 14 | Word Ladder | ④ Implicit | Hard | [leetcode.com/problems/word-ladder](https://leetcode.com/problems/word-ladder/) |
| 15 | Shortest Path in a Grid with Obstacles Elimination | ⑤ Extra state | Hard | [leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Start kya (ek / multi)? State kya? Padosi kaise? Visited kab mark? Answer kab return?"* — phir code.

Agla: [12-dfs.md](12-dfs.md)
