# 21. Union-Find (Disjoint Set Union)

> 📍 **Syllabus**: Unit 5 — Graphs · Topic 21 / 29 · Pehle chahiye: [Graph Basics](19-graph-basics.md), [Arrays](../01-basics/02-arrays.md)

> **Standard definition**: A data structure that maintains a collection of disjoint (non-overlapping) sets and supports two operations — `find` (which set does an element belong to) and `union` (merge two sets) — in nearly constant amortized time when implemented with path compression and union by size/rank.

**Ek line mein**: **Logon ko groups mein baantna, do groups ko jodna, aur ye puchna ki "kya ye dono ek hi group mein hain?"** — teeno kaam **lagbhag O(1)** mein.

**Trick yaad rakhne ki**: *"Mohalle ki cricket teams"* — har team ka ek **captain** hota hai. Kisi khiladi se puchho *"tera captain kaun?"* toh wo **apne se upar wale** ka naam batata hai, wo apne upar wale ka... jab tak **asli captain** (jo khud apna captain hai) na mile.
- **Do teams merge** karni ho toh **ek captain doosre ko apna captain maan leta hai.**
- **Path compression** = *"Har baar chain follow karne ki jagah, ek baar asli captain mil gaya toh **sab ko seedha uska naam yaad karwa do**."* Agli baar puchhne pe ek hi kadam.

**Kab use karo**: **"Kya ye dono ek hi group/network mein hain?"** wale sawaal, **connected components ki ginti**, **edges aate rahen aur connectivity puchhi jaye** (dynamic), **cycle detection (undirected)**, aur **Kruskal's MST** ([MST note](23-minimum-spanning-tree.md)).

## Andar se kaise dikhta hai

Har element ke paas sirf ek `parent` hai. **Jiska parent wo khud hai wahi captain (root).**

```
6 log (0..5), shuru mein har koi apna captain:      parent = [0, 1, 2, 3, 4, 5]     groups = 6

union(0, 1)  →  1 ka captain 0                        parent = [0, 0, 2, 3, 4, 5]
union(2, 3)  →  3 ka captain 2                        parent = [0, 0, 2, 2, 4, 5]
union(1, 3)  →  1 ka captain 0, 3 ka captain 2  →  dono captains jude: 2 ko 0 ke neeche
union(4, 5)  →  5 ka captain 4

Ab groups:   {0, 1, 2, 3}   aur   {4, 5}                groups = 2

        0            4
       ╱ ╲           │
      1   2          5              connected(1, 3)?  1 ka captain 0, 3 ka captain 0  → HAAN ✅
          │                         connected(1, 5)?  0 ≠ 4  → NAHI ❌
          3
```

## Do jaadu jo ise fast banate hain

**Problem**: Agar hamesha ek naya sa captain upar chadhta gaya toh chain bahut lambi ho sakti hai (`0 ← 1 ← 2 ← 3 ← ...`) aur `find` O(n) ho jayega.

**Jaadu 1 — Path Compression**: `find` karte waqt raaste ke **saare nodes ko seedha root se jod do**.

```
find(3) se pehle:   0 ← 1 ← 2 ← 3         (chain: 3 → 2 → 1 → 0)

find(3) ke baad:        0
                     ╱  │  ╲
                    1   2   3              (sab seedha root se — agli baar sirf 1 kadam!)
```

**Jaadu 2 — Union by Size**: Do groups jodte waqt **chhote group ko bade ke neeche** lagao (naki ulta) — tree **chhota-sa (gehraai kam)** rehta hai.

Dono saath lagane pe har operation **amortized O(α(n))** hai — jahan **α (inverse Ackermann) 5 se bhi kam** rehta hai kisi bhi practical `n` ke liye. Matlab **practically O(1)**.

## Code example 1 — UnionFind class (ye yaad kar lo)

```java
class UnionFind {
    private int[] parent;
    private int[] size;                     // har group ka size (union by size ke liye)
    private int components;                 // abhi kitne alag groups hain

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        components = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;                  // shuru mein har koi apna captain
            size[i] = 1;
        }
    }

    // Captain dhoondho — raaste ke sabko seedha captain se jod do (path compression)
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);   // 🔑 wapas aate hue sabka parent = asli captain
        return parent[x];
    }

    // Do groups jodo. Pehle se ek hi group mein the toh false (kuch nahi badla)
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;                        // 🔑 pehle se jude hain → ye edge cycle banayegi
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }   // chhota group bade ke neeche
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }
    int count() { return components; }
    int sizeOf(int x) { return size[find(x)]; }
}
```

**Line by line samjho**: `find` recursion se root tak jata hai aur **wapas aate hue** har node ka `parent` seedha root kar deta hai. `union` pehle dono ke captains nikalta hai; agar **same captain** toh pehle se ek hi group (isi liye `false` return karna **cycle detect** karne ka tareeka hai). Warna chhote group ka captain bade ke neeche lagata hai aur `components` ek kam.

## Code example 2 — Components ki ginti aur Redundant Connection

```java
// Connected Components — har union pe agar sach mein jura toh groups ek kam
public int countComponents(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] e : edges) uf.union(e[0], e[1]);
    return uf.count();                                     // bache hue groups
}

// Redundant Connection — tree (nodes 1..n) mein ek extra edge jud gayi hai. Wo edge dhoondho jo cycle banati hai
public int[] findRedundantConnection(int[][] edges) {
    UnionFind uf = new UnionFind(edges.length + 1);         // nodes 1..n (0 ka use nahi)
    for (int[] e : edges) {
        if (!uf.union(e[0], e[1])) return e;                // 🔑 dono pehle se ek group mein → ye edge cycle banayegi
    }
    return new int[0];
}
```

```
edges = [[1,2], [1,3], [2,3]]

union(1,2) ✓  →  {1,2}
union(1,3) ✓  →  {1,2,3}
union(2,3) ✗  →  2 aur 3 pehle se ek hi group mein!  →  [2,3] hi extra (redundant) edge hai ✅
```

## Code example 3 — Accounts Merge (asli zindagi wala use)

**Problem**: Kai accounts hain `[naam, email1, email2, ...]`. **Agar do accounts mein ek bhi email common hai, toh wo ek hi insaan hai** — merge karo.

**Trick**: *"Har account ek khiladi. Ek email jo do accounts mein dikhe, wo un dono khiladiyon ko ek team mein daal deta hai."*

```
A: [John, a@x, b@x]
B: [John, b@x, c@x]     b@x A aur B dono mein → A, B ek team
C: [Mary, d@x]

union(A, B)   →  {A, B}  aur {C}
Answer: [John, a@x, b@x, c@x]   aur   [Mary, d@x]
```

```java
public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, Integer> emailToId = new HashMap<>();       // email → pehli baar kis account mein dikha
    UnionFind uf = new UnionFind(accounts.size());

    for (int i = 0; i < accounts.size(); i++) {
        for (int j = 1; j < accounts.get(i).size(); j++) {   // j = 0 naam hai, emails 1 se
            String email = accounts.get(i).get(j);
            if (emailToId.containsKey(email)) {
                uf.union(i, emailToId.get(email));           // 🔑 ye email pehle kisi aur account mein bhi thi → dono ek insaan
            } else {
                emailToId.put(email, i);
            }
        }
    }

    Map<Integer, TreeSet<String>> groups = new HashMap<>();  // captain → uske saare emails (sorted)
    for (Map.Entry<String, Integer> e : emailToId.entrySet()) {
        groups.computeIfAbsent(uf.find(e.getValue()), k -> new TreeSet<>()).add(e.getKey());
    }

    List<List<String>> result = new ArrayList<>();
    for (Map.Entry<Integer, TreeSet<String>> g : groups.entrySet()) {
        List<String> merged = new ArrayList<>();
        merged.add(accounts.get(g.getKey()).get(0));          // naam (captain account se)
        merged.addAll(g.getValue());                          // sorted emails
        result.add(merged);
    }
    return result;
}
```

## Code example 4 — "==" aur "!=" (union ka creative use)

**Problem**: `["a==b", "b!=c", "c==a"]` jaise equations ek saath sach ho sakte hain kya?

**Trick**: *"Pehle saare `==` se logon ko ek group mein daalo. Phir har `!=` dekho — agar wo do variable **ek hi group mein** hain toh **jhooth**."*

```java
public boolean equationsPossible(String[] equations) {
    UnionFind uf = new UnionFind(26);                         // a..z
    for (String eq : equations) {
        if (eq.charAt(1) == '=') {                            // "a==b" (index 1 aur 2 dono '=' hote hain)
            uf.union(eq.charAt(0) - 'a', eq.charAt(3) - 'a'); // 🔑 pehle saare "==" jodo
        }
    }
    for (String eq : equations) {
        if (eq.charAt(1) == '!' && uf.connected(eq.charAt(0) - 'a', eq.charAt(3) - 'a')) {
            return false;                                     // "!=" wale par ek hi group mein → contradiction
        }
    }
    return true;
}
```

## Union-Find vs BFS/DFS — kab kya

| Situation | Kya lo |
|---|---|
| Graph **ek baar** diya hai, components ginne hain | BFS/DFS bhi chalega (simple) |
| **Edges ek-ek karke aa rahe hain** aur beech-beech mein "connected?" pooch rahe | **Union-Find** (DFS baar-baar chalana padta) |
| **Cycle detection (undirected)** | **Union-Find** — `union` false = cycle |
| Kruskal's MST | **Union-Find** |
| Edge **hatani** hai (disconnect) | ❌ Union-Find se nahi hota (sirf jodna) |
| **Directed** graph ka cycle | ❌ (yahan DFS colors / topological sort) |

Poora pattern-style practice: [Union-Find pattern](../../01-patterns/15-union-find.md).

## Common galtiyan

- **`find` mein path compression bhoolna** (`return find(parent[x])` likhna bina assign kiye) — chain lambi ho jati hai, TLE.
- **`union(a, b)` mein `parent[a] = b` seedha karna** — `a` aur `b` ke **roots** pe kaam karna hai, unpe nahi.
- **1-indexed nodes mein array `n` size ka banana** — `n + 1` lo.
- **`components` ko galat ghatana** — sirf tab jab `union` ne sach mein do alag groups jode.
- **Union-Find se path/distance nikalne ki koshish** — ye sirf "same group?" batata hai, raasta nahi.

> 💡 **Interview mein bolne wali line**: *"Yahan edges dynamically aa rahi hain aur mujhe baar-baar 'kya ye connected hain' chahiye, isliye Union-Find — path compression aur union by size ke saath har operation amortized near O(1), total O(E · α(n))."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Number of Provinces | Medium | Components ki ginti | [leetcode.com/problems/number-of-provinces](https://leetcode.com/problems/number-of-provinces/) |
| 2 | Satisfiability of Equality Equations | Medium | Pehle `==`, phir `!=` | [leetcode.com/problems/satisfiability-of-equality-equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) |
| 3 | Redundant Connection | Medium | `union` false = cycle | [leetcode.com/problems/redundant-connection](https://leetcode.com/problems/redundant-connection/) |
| 4 | Number of Operations to Make Network Connected | Medium | Extra edges vs components | [leetcode.com/problems/number-of-operations-to-make-network-connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) |
| 5 | Graph Valid Tree 🔒 (Premium) | Medium | `n-1` edges + no cycle | [leetcode.com/problems/graph-valid-tree](https://leetcode.com/problems/graph-valid-tree/) |
| 6 | Number of Connected Components in an Undirected Graph 🔒 (Premium) | Medium | Seedha Union-Find | [leetcode.com/problems/number-of-connected-components-in-an-undirected-graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) |
| 7 | Accounts Merge | Medium | Email se accounts jodo | [leetcode.com/problems/accounts-merge](https://leetcode.com/problems/accounts-merge/) |
| 8 | Most Stones Removed with Same Row or Column | Medium | Row aur column ko nodes maano | [leetcode.com/problems/most-stones-removed-with-same-row-or-column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) |
| 9 | Smallest String With Swaps | Medium | Group ke andar sort | [leetcode.com/problems/smallest-string-with-swaps](https://leetcode.com/problems/smallest-string-with-swaps/) |
| 10 | Evaluate Division | Medium | Weighted Union-Find (ya graph) | [leetcode.com/problems/evaluate-division](https://leetcode.com/problems/evaluate-division/) |
| 11 | Regions Cut By Slashes | Medium | Cell ko 4 tukdon mein todo | [leetcode.com/problems/regions-cut-by-slashes](https://leetcode.com/problems/regions-cut-by-slashes/) |
| 12 | Making A Large Island | Hard | Components ka size + size dena | [leetcode.com/problems/making-a-large-island](https://leetcode.com/problems/making-a-large-island/) |

Agla: [22-shortest-path.md](22-shortest-path.md)
