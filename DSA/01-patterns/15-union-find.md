# 15. Union-Find (Disjoint Set Union)

> Pehle ye aane chahiye: [Union-Find (syllabus)](../00-syllabus/05-graphs/21-union-find.md), [Graph Basics](../00-syllabus/05-graphs/19-graph-basics.md), [DFS (pattern)](12-dfs.md)

> **Standard definition**: A data structure that tracks a set of elements partitioned into disjoint (non-overlapping) subsets, supporting two efficient operations — `find` (which set does an element belong to) and `union` (merge two sets).

**Ek line mein**: Har element ka ek "parent" track karo — `find()` se pata karo kaunse **group (root)** ka hai, `union()` se do groups ko **jod do**. "Kya ye dono ek hi group mein hain?" aur "kitne groups bache?" **lagbhag O(1)** mein.

**Trick yaad rakhne ki**: *"Dosti groups"* — har banda apne "group leader" (parent) ko jaanta hai. Do bande dost bane (`union`), toh ek ke group ka leader doosre ke leader ka "boss" ban jata hai. `find()` se pata chalta hai koi banda kis group mein hai — agar do bandon ka leader same nikla, wo **already ek hi group** mein hain.

```
parent = [0, 0, 1, 3, 3]          find(2):  2 → 1 → 0   (root 0)          groups: {0,1,2}  {3,4}

union(2, 4):  root(2)=0,  root(4)=3   alag → jodo   →   groups: {0,1,2,3,4}      union ne TRUE diya (merge hua)
union(1, 4):  root(1)=0,  root(4)=0   SAME          →   union ne FALSE diya   →   ye edge CYCLE banayega!
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ "Kya A aur B connected / same group mein hain?"  — baar-baar puchna
✅ "Kitne groups / components bache?"
✅ Edges ek-ek karke aati hain (dynamic connectivity)  ya  "extra edge jo cycle banaye"
✅ Cheezein "kisi shared cheez" (email, row/column, letter, equality) se jud rahi hain → group banao
✅ Minimum Spanning Tree (Kruskal): sasti edge tab lo jab wo do alag groups jode
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**kitne provinces / components**", "**connect karne ke liye kitne cables**" | ① **Components count** |
| "**extra edge jo cycle banaye**", "**kya ye valid tree hai?**" | ② **Cycle detection** (`union` false = cycle) |
| "**accounts merge**", "**stones row/col share**", "**swap allowed pairs**" — shared key se group | ③ **Group by shared key** |
| "**a == b**, **a != b** — sab ek saath sach ho sakte hain?" | ④ **Equality constraints** |
| "**islands**", "**surrounded region**" (grid) | ⑤ **Grid as graph** |
| "**minimum cost se sab jodo**", "**sasti edge pehle**" | ⑥ **Kruskal (MST)** |
| "**sabse bade group ka size**", "**longest consecutive**" | ⑦ **Group size / extra data** |

### Union-Find ya DFS/BFS?

| Situation | Kaun? |
|---|---|
| Edges **aate rahen** aur connectivity puchhi jaye (**online**) | **Union-Find** |
| Sirf "connected? / kitne components?" (static graph) | Dono chalte hain — UF ka code chhota |
| **Raasta / shortest path / order / levels** chahiye | **BFS / DFS** (UF raasta nahi batata) |
| **Directed** graph ka cycle | DFS (3-state) / topological sort — **UF undirected ke liye** hai |
| Kruskal / minimum spanning tree | **Union-Find** |

### ❌ Kab NAHI
- **Directed** edges ka cycle / order (course schedule) → [DFS](12-dfs.md) / topological sort.
- **Raasta** ya **doori** chahiye → [BFS](11-bfs.md).
- Groups ko **tod** (delete edge) rahe ho → UF sirf jodta hai (offline mein ulta process karke chalta hai).

---

## 2. Code likhne ki recipe — 4 sawaal

```
1. NODE     →  "node" kya hai?   0..n−1 seedha  /  string → map se index  /  grid (r, c) → r*cols + c  /  row & col → alag ids
2. UNION    →  kis condition pe union(a, b)?   (edge di hai / same email / '==' / padosi land / sasti edge)
3. QUESTION →  answer kya?   components()  /  union ka false = cycle  /  connected(a, b)  /  size(x)
4. ORDER    →  edges jaise di hain?  pehle sort (Kruskal)?  pehle saare unions, phir queries? (equality equations)
```

**Ek template class** (yehi yaad karo, baaki sab isse chalta hai):

```java
class UnionFind {
    private final int[] parent, size;
    private int components;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        components = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;                                       // shuru mein har banda apna leader
            size[i] = 1;
        }
    }

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];                       // 🔑 path halving: dada se jod do (chain chhoti)
            x = parent[x];
        }
        return x;                                                // (iterative — recursion mein deep chain pe overflow ho sakta hai)
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);                          // 🔑 hamesha ROOTS pe kaam, a/b pe nahi
        if (ra == rb) return false;                              // pehle se ek group → false (cycle ka signal)
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;                                         // 🔑 chhota group bade ke neeche
        size[ra] += size[rb];
        components--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }
    int size(int x) { return size[find(x)]; }
    int components() { return components; }
}
```

**Teen ratta:**
1. `union` mein **roots** jodo (`find` ke baad), original nodes nahi.
2. `union` **true = naya merge**, **false = pehle se ek hi group** (cycle / redundant).
3. Nodes **1..n** ho toh `new UnionFind(n + 1)`.

Complexity: path compression + union by size ke saath har operation **≈ O(α(n))** ≈ O(1).

---

## 3. ① Components count — kitne groups

**Idea**: Har edge pe `union`. Aakhir mein `components()` hi jawab (ya usse related). Har successful merge `components` ko 1 kam karta hai.

```
Number of Provinces  [[1,1,0],[1,1,0],[0,0,1]]:   union(0,1)  →  components 3 → 2       answer 2

Network Connected (n computers, cables):   n−1 cables se kam → -1 (jud hi nahi sakte)
    warna kitne components hain → utne − 1 cables shift karke jodne padenge
```

```java
// Number of Provinces — adjacency matrix
public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    UnionFind uf = new UnionFind(n);
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (isConnected[i][j] == 1) uf.union(i, j);
        }
    }
    return uf.components();                                       // 🔑 bache hue groups
}

// Number of Connected Components in an Undirected Graph — edge list
public int countComponents(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] e : edges) uf.union(e[0], e[1]);
    return uf.components();
}

// Number of Operations to Make Network Connected
public int makeConnected(int n, int[][] connections) {
    if (connections.length < n - 1) return -1;                    // 🔑 n computers ko jodne ko kam se kam n−1 cables
    UnionFind uf = new UnionFind(n);
    for (int[] c : connections) uf.union(c[0], c[1]);
    return uf.components() - 1;                                    // itne components ko jodne ke liye itni cables
}
```

---

## 4. ② Cycle detection — `union` false = cycle

**Idea**: Edge `(a, b)` aayi. Agar `a` aur `b` **pehle se same group** mein hain, toh ye edge ek **naya raasta** banati hai jo pehle se tha → **cycle**.

```
edges = [[1,2],[1,3],[2,3]]      union(1,2) true     union(1,3) true     union(2,3):  root(2)=root(3)  → FALSE → yehi redundant edge

Valid Tree (n nodes):   tree  ⇔   n − 1 edges   AUR   koi bhi edge cycle na banaye   (ya:  n−1 edges + 1 component)
```

```java
// Redundant Connection — tree + ek extra edge; wo edge jo cycle banati hai (nodes 1..n)
public int[] findRedundantConnection(int[][] edges) {
    UnionFind uf = new UnionFind(edges.length + 1);               // 🔑 nodes 1-indexed → size n + 1
    for (int[] e : edges) {
        if (!uf.union(e[0], e[1])) return e;                      // 🔑 pehle se connected → yehi extra edge
    }
    return new int[0];
}

// Graph Valid Tree
public boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;                      // tree mein exactly n−1 edges
    UnionFind uf = new UnionFind(n);
    for (int[] e : edges) {
        if (!uf.union(e[0], e[1])) return false;                  // cycle mili
    }
    return true;                                                  // n−1 edges + no cycle ⇒ connected bhi
}
```

---

## 5. ③ Group by shared key — cheez ko "key" se jodo

**Idea**: Jab do cheezein **koi shared cheez** rakhti hain (email, row, column, allowed swap), unhe **union** karo. Nodes ka number nahi diya toh **map** se bana lo.

```
Accounts Merge:   John [a, b]   John [b, c]   Mary [d]
    email → pehla account jisme dikha:   a→0  b→0  (b dobara account 1 mein dikha → union(1, 0))  c→1  d→2
    ek group = ek insaan;  group ke saare emails sorted;  naam = koi bhi account ka naam

Most Stones Removed:  stone (r, c)  =  row r aur column c ko jodne wali cheez  →  union(r, c + OFFSET)
    har connected component se ek stone bachta hai:   answer = stones − components

Smallest String With Swaps:  jin positions ke beech swap allowed → ek group;
    group ke andar koi bhi ORDER ban sakta hai → chhote akshar aage (sort karke wapas rakh do)
```

```java
// Accounts Merge
public List<List<String>> accountsMerge(List<List<String>> accounts) {
    UnionFind uf = new UnionFind(accounts.size());
    Map<String, Integer> owner = new HashMap<>();                 // email → pehla account jisme dikha
    for (int i = 0; i < accounts.size(); i++) {
        for (int j = 1; j < accounts.get(i).size(); j++) {        // j = 0 naam hai
            String email = accounts.get(i).get(j);
            if (owner.containsKey(email)) uf.union(i, owner.get(email));   // 🔑 same email → same insaan
            else owner.put(email, i);
        }
    }
    Map<Integer, TreeSet<String>> emails = new HashMap<>();       // group root → sorted emails
    for (Map.Entry<String, Integer> e : owner.entrySet()) {
        emails.computeIfAbsent(uf.find(e.getValue()), k -> new TreeSet<>()).add(e.getKey());
    }
    List<List<String>> result = new ArrayList<>();
    for (Map.Entry<Integer, TreeSet<String>> e : emails.entrySet()) {
        List<String> row = new ArrayList<>();
        row.add(accounts.get(e.getKey()).get(0));                 // naam
        row.addAll(e.getValue());
        result.add(row);
    }
    return result;
}

// Most Stones Removed with Same Row or Column
public int removeStones(int[][] stones) {
    UnionFind uf = new UnionFind(20002);                          // rows 0..10000, columns 10001..20001
    for (int[] s : stones) uf.union(s[0], s[1] + 10001);          // 🔑 stone = row aur column ka jod
    Set<Integer> roots = new HashSet<>();
    for (int[] s : stones) roots.add(uf.find(s[0]));
    return stones.length - roots.size();                          // har component se ek stone bachta hai
}

// Smallest String With Swaps
public String smallestStringWithSwaps(String s, List<List<Integer>> pairs) {
    int n = s.length();
    UnionFind uf = new UnionFind(n);
    for (List<Integer> p : pairs) uf.union(p.get(0), p.get(1));
    Map<Integer, List<Integer>> groups = new HashMap<>();         // root → us group ki positions (badhte order mein)
    for (int i = 0; i < n; i++) groups.computeIfAbsent(uf.find(i), k -> new ArrayList<>()).add(i);
    char[] result = new char[n];
    for (List<Integer> positions : groups.values()) {
        char[] chars = new char[positions.size()];
        for (int k = 0; k < chars.length; k++) chars[k] = s.charAt(positions.get(k));
        Arrays.sort(chars);                                       // 🔑 group ke andar koi bhi arrangement possible
        for (int k = 0; k < chars.length; k++) result[positions.get(k)] = chars[k];
    }
    return new String(result);
}
```

---

## 6. ④ Equality constraints — pehle `==`, phir `!=`

**Idea**: `a == b` = *same group*, `a != b` = *alag group hona chahiye*. **Do pass**: pehle **saare `==`** union karo, phir har `!=` dekho — agar wo do **ek hi group** mein hain toh jhooth.

```
["a==b", "b!=c", "c==a"]
pass 1 (==):  union(a,b),  union(c,a)   →  {a,b,c} ek group
pass 2 (!=):  b != c ?   b aur c same group  →  CONTRADICTION  →  false
```

```java
public boolean equationsPossible(String[] equations) {
    UnionFind uf = new UnionFind(26);                             // 26 letters = 26 nodes
    for (String e : equations) {
        if (e.charAt(1) == '=') uf.union(e.charAt(0) - 'a', e.charAt(3) - 'a');   // pass 1: sirf "=="
    }
    for (String e : equations) {
        if (e.charAt(1) == '!' && uf.connected(e.charAt(0) - 'a', e.charAt(3) - 'a')) return false;   // 🔑 pass 2: "!="
    }
    return true;
}
```

**Order zaroori kyun?** `!=` pehle check kar diya toh baad ka `==` use tod sakta hai — isliye pehle saare jodo, phir contradiction dhoondo.

---

## 7. ⑤ Grid as graph — `(r, c)` → `r * cols + c`

**Idea**: Har cell ek node, padosi cell (right, down kaafi hain) ko `union`. **Dummy node** = "border / ocean" jaisa special group.

```
numIslands:   land cells ke beech union;  components() mein WATER cells bhi gine gaye  →  water count kam karo
Surrounded Regions:  border wale 'O' ko dummy node se jodo   →  jo 'O' dummy se juda NAHI = surrounded → 'X'

id(r, c) = r * n + c            dummy = m * n            (size m*n + 1)
```

```java
// Number of Islands (Union-Find version)
public int numIslands(char[][] grid) {
    int m = grid.length, n = grid[0].length, water = 0;
    UnionFind uf = new UnionFind(m * n);
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == '0') { water++; continue; }
            if (r + 1 < m && grid[r + 1][c] == '1') uf.union(r * n + c, (r + 1) * n + c);   // niche
            if (c + 1 < n && grid[r][c + 1] == '1') uf.union(r * n + c, r * n + c + 1);     // daayein
        }
    }
    return uf.components() - water;                               // 🔑 har water cell apna alag component tha
}

// Surrounded Regions — dummy node trick
public void solve(char[][] board) {
    int m = board.length, n = board[0].length, dummy = m * n;
    UnionFind uf = new UnionFind(m * n + 1);
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (board[r][c] != 'O') continue;
            int id = r * n + c;
            if (r == 0 || c == 0 || r == m - 1 || c == n - 1) uf.union(id, dummy);   // 🔑 border 'O' = safe
            if (r + 1 < m && board[r + 1][c] == 'O') uf.union(id, id + n);
            if (c + 1 < n && board[r][c + 1] == 'O') uf.union(id, id + 1);
        }
    }
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (board[r][c] == 'O' && !uf.connected(r * n + c, dummy)) board[r][c] = 'X';   // dummy se nahi juda → surrounded
        }
    }
}
```

**DFS ya UF grid pe?** Static grid mein DFS/BFS aasan hai. **UF tab** jab land **ek-ek karke add** ho (Number of Islands II) — har add ke baad count chahiye.

---

## 8. ⑥ Kruskal (MST) — sasti edge pehle, agar do alag groups jode

**Idea**: Saari edges **weight se sort** karo. Har edge pe `union`; **true** aaya (do alag groups jude) toh edge tree mein rakho, cost jodo. **false** = cycle banti, skip.

```
points → har pair ke beech Manhattan doori = edge weight
sort edges ↑ → sabse sasti edge se shuru → union true? cost += w  →  (n − 1) edges lag gayi to ruk sakte ho
```

```java
// Min Cost to Connect All Points (Kruskal)
public int minCostConnectPoints(int[][] points) {
    int n = points.length;
    List<int[]> edges = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int dist = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
            edges.add(new int[]{i, j, dist});
        }
    }
    edges.sort((a, b) -> Integer.compare(a[2], b[2]));           // 🔑 sasti edges pehle
    UnionFind uf = new UnionFind(n);
    int cost = 0;
    for (int[] e : edges) {
        if (uf.union(e[0], e[1])) cost += e[2];                   // 🔑 sirf wo jo do alag groups jode
    }
    return cost;
}
```

Isi shape mein: **"kab pehli baar sab jud gaye"** (edges ko time se sort karo, jab `components() == 1` ho tab time return) aur **Swim in Rising Water / Path With Minimum Effort** (edges ko cost se sort karo, jab `start` aur `end` connected ho jaye tab cost).

---

## 9. ⑦ Group size / extra data at the root

**Idea**: Root pe extra jaankari rakh sakte ho (`size`, min, max). Template mein `size` pehle se hai — `uf.size(x)` seedha us group ka size deta hai.

```
Longest Consecutive Sequence [100, 4, 200, 1, 3, 2]:
   har value ek node;  x aur x+1 dono maujood ho → union  →  {1,2,3,4} ka size 4  = answer
```

```java
public int longestConsecutive(int[] nums) {
    Map<Integer, Integer> index = new HashMap<>();                // value → node number
    for (int x : nums) index.putIfAbsent(x, index.size());        // duplicates ek hi node
    UnionFind uf = new UnionFind(index.size());
    for (int x : index.keySet()) {
        if (index.containsKey(x + 1)) uf.union(index.get(x), index.get(x + 1));   // 🔑 x aur x+1 padosi
    }
    int best = 0;
    for (int i = 0; i < index.size(); i++) best = Math.max(best, uf.size(i));    // sabse bada group
    return best;
}
```

Isi trick se: **Largest Component Size by Common Factor** (number ko uske prime factors se jodo), **Making A Large Island** (har island ka size root pe, phir 0 ko 1 banake padosi groups ke size jodo).

---

## 10. Sab ek nazar mein

| Variation | Node | `union` kab | Answer |
|---|---|---|---|
| ① Components | index | har edge | `components()` |
| ② Cycle | index (1-based ho toh `n + 1`) | har edge | `union` **false** = cycle |
| ③ Shared key | account / row+offset / position | same email / stone / swap pair | group ke hisaab se rebuild |
| ④ Equality | 26 letters | sirf `==` (pass 1) | `!=` mein `connected` → false |
| ⑤ Grid | `r * cols + c` (+ dummy) | padosi land / border | `components() − water` / `connected(dummy)` |
| ⑥ Kruskal | index | **sorted** edge, agar alag groups | `union` true pe cost jodo |
| ⑦ Size | value → index (map) | `x` aur `x + 1` | `uf.size(x)` ka max |

## Common galtiyan

- **`union` mein `find` na karna** — seedha `parent[a] = b` → galat groups.
- **Path compression bhoolna** ya `find` recursion mein deep chain pe StackOverflow — iterative `find`.
- **Union by size bhoolna** — chain lambi, `find` dheema.
- **1-indexed nodes** pe size `n` — `n + 1` chahiye (Redundant Connection).
- **`components()` mein extra nodes** (water cells, dummy, unused ids) ginna — hata do.
- **Directed graph** pe UF lagana — edge ki direction ignore ho jati hai.
- **Kruskal mein sort bhoolna**, ya `union` ka result check na karna (har edge ki cost jod dena).
- **Equality equations mein ek hi pass** — pehle saare `==` phir `!=`.
- **Accounts merge mein naam se merge** — naam same ho sakta hai alag logon ka; **email** hi asli key.
- **Unions ke baad `parent[x]` seedha padhna** — hamesha `find(x)`.

> 💡 **Interview mein bolne wali line**: *"Connectivity baar-baar puchi ja rahi hai aur edges jud rahi hain, isliye Union-Find — path compression aur union by size ke saath har operation almost O(1), yaani α(n). Agar `union` false aaye toh wo edge cycle banata hai."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Number of Provinces | ① Components | Medium | [leetcode.com/problems/number-of-provinces](https://leetcode.com/problems/number-of-provinces/) |
| 2 | Number of Connected Components in an Undirected Graph 🔒 | ① Components | Medium | [leetcode.com/problems/number-of-connected-components-in-an-undirected-graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) |
| 3 | Number of Operations to Make Network Connected | ① Components | Medium | [leetcode.com/problems/number-of-operations-to-make-network-connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) |
| 4 | Redundant Connection | ② Cycle | Medium | [leetcode.com/problems/redundant-connection](https://leetcode.com/problems/redundant-connection/) |
| 5 | Graph Valid Tree 🔒 | ② Cycle | Medium | [leetcode.com/problems/graph-valid-tree](https://leetcode.com/problems/graph-valid-tree/) |
| 6 | Satisfiability of Equality Equations | ④ Equality | Medium | [leetcode.com/problems/satisfiability-of-equality-equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) |
| 7 | Number of Islands | ⑤ Grid | Medium | [leetcode.com/problems/number-of-islands](https://leetcode.com/problems/number-of-islands/) |
| 8 | Surrounded Regions | ⑤ Grid (dummy) | Medium | [leetcode.com/problems/surrounded-regions](https://leetcode.com/problems/surrounded-regions/) |
| 9 | Accounts Merge | ③ Shared key | Medium | [leetcode.com/problems/accounts-merge](https://leetcode.com/problems/accounts-merge/) |
| 10 | Most Stones Removed with Same Row or Column | ③ Shared key | Medium | [leetcode.com/problems/most-stones-removed-with-same-row-or-column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) |
| 11 | Smallest String With Swaps | ③ Shared key | Medium | [leetcode.com/problems/smallest-string-with-swaps](https://leetcode.com/problems/smallest-string-with-swaps/) |
| 12 | Longest Consecutive Sequence | ⑦ Size | Medium | [leetcode.com/problems/longest-consecutive-sequence](https://leetcode.com/problems/longest-consecutive-sequence/) |
| 13 | Min Cost to Connect All Points | ⑥ Kruskal | Medium | [leetcode.com/problems/min-cost-to-connect-all-points](https://leetcode.com/problems/min-cost-to-connect-all-points/) |
| 14 | Connecting Cities With Minimum Cost 🔒 | ⑥ Kruskal | Medium | [leetcode.com/problems/connecting-cities-with-minimum-cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/) |
| 15 | Evaluate Division | ④ Weighted UF | Medium | [leetcode.com/problems/evaluate-division](https://leetcode.com/problems/evaluate-division/) |
| 16 | Regions Cut By Slashes | ⑤ Grid | Medium | [leetcode.com/problems/regions-cut-by-slashes](https://leetcode.com/problems/regions-cut-by-slashes/) |
| 17 | Number of Islands II 🔒 | ⑤ Grid (dynamic) | Hard | [leetcode.com/problems/number-of-islands-ii](https://leetcode.com/problems/number-of-islands-ii/) |
| 18 | Making A Large Island | ⑦ Size | Hard | [leetcode.com/problems/making-a-large-island](https://leetcode.com/problems/making-a-large-island/) |
| 19 | Largest Component Size by Common Factor | ⑦ Size | Hard | [leetcode.com/problems/largest-component-size-by-common-factor](https://leetcode.com/problems/largest-component-size-by-common-factor/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Node kya? Union kab? Answer components / cycle / size mein se kya? Order (sort / do pass)?"* — phir code.

Agla: [16-stack.md](16-stack.md)
