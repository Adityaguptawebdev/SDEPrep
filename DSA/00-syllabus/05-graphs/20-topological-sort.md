# 20. Topological Sort

> 📍 **Syllabus**: Unit 5 — Graphs · Topic 20 / 29 · Pehle chahiye: [Graph Basics](19-graph-basics.md) (BFS, DFS, cycle detection)

> **Standard definition**: A linear ordering of the vertices of a directed acyclic graph (DAG) such that for every directed edge u → v, vertex u appears before vertex v in the ordering; it exists if and only if the graph has no directed cycle.

**Ek line mein**: Kaam aise **dependencies** ke saath hain ki *"A pehle, phir B"* — inhe **ek line mein aise lagao** ki **har kaam apni saari dependencies ke baad** aaye.

**Trick yaad rakhne ki**: *"Subah tayyar hona"* — **moze pehle, joote baad mein**; **kachha pehle, pant baad mein**; pant ke baad hi belt aur joote. Tum kuch bhi order mein pehno, bas **ye dependencies na tootein**. Kai valid order ho sakte hain (moze pehle pehno ya shirt — farq nahi). Par agar rule ho *"joote pehne bina moze nahi, moze bina joote nahi"* — toh **kabhi tayyar hi nahi ho sakte** (cycle!).

**Kab use karo**: **Dependencies / prerequisites / build order** wale sawaal — course schedule, task scheduling, "pehle ye compile karo phir wo", package install order, spreadsheet cells ka evaluation order. Keyword: **"order", "prerequisite", "dependency", "kya sab complete ho sakta hai?"**

## Graph banao — kaun kiske baad

```
Kaam:  0 = kachha   1 = pant   2 = moze   3 = joote   4 = shirt   5 = belt

Rules (u → v  matlab  "u pehle, v baad mein"):
   0 → 1     kachha  →  pant
   1 → 3     pant    →  joote
   2 → 3     moze    →  joote
   1 → 5     pant    →  belt
   4 → 5     shirt   →  belt

Layer-wise picture (ek layer ke kaam ek saath ho sakte hain):

  Layer 0 (koi dependency nahi) :  kachha    moze    shirt
  Layer 1                       :  pant                        (kachha ke baad)
  Layer 2                       :  joote (pant + moze ke baad)   belt (pant + shirt ke baad)

Ek valid order:  kachha, moze, shirt, pant, joote, belt        [0, 2, 4, 1, 3, 5]
```

**Zaroori shart**: Graph **DAG** ho — **directed** aur **koi cycle nahi**. Cycle hai toh order **exist hi nahi** karta.

## Tarika 1 — Kahn's Algorithm (BFS + in-degree) ⭐ (interview ka favourite)

**In-degree** = kitni dependencies (aane wali edges) abhi bachi hain.

**Trick**: *"Jinki koi dependency nahi, unhe pehle kar do. Jab koi kaam ho jaye, us par depend karne wale kaamon ki dependency ek kam kar do. Jiski dependency 0 ho jaye wo ab ready."*

```
in-degree shuru mein:  kachha 0 │ pant 1 │ moze 0 │ joote 2 │ shirt 0 │ belt 2

queue = [kachha, moze, shirt]   (in-degree 0 wale)

nikala kachha  → pant: 1 → 0  ✅ ready → queue += pant           order: kachha
nikala moze    → joote: 2 → 1                                     order: kachha, moze
nikala shirt   → belt:  2 → 1                                     order: ..., shirt
nikala pant    → joote: 1 → 0 ✅, belt: 1 → 0 ✅ → queue += joote, belt
nikala joote, belt                                               order: kachha, moze, shirt, pant, joote, belt

Saare 6 nikal gaye ⇒ koi cycle nahi ✅
Agar kuch kaam nikle hi nahi (queue khaali par count < n) ⇒ CYCLE ❌
```

```java
// Course Schedule II — prerequisites[i] = {course, prereq}: course karne se pehle prereq zaroori
public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] inDegree = new int[numCourses];
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        graph.get(p[1]).add(p[0]);            // prereq p[1] pehle → course p[0] baad mein
        inDegree[p[0]]++;                     // p[0] pe ek aur dependency
    }

    Queue<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.offer(i); // jinpe koi dependency nahi — abhi kar sakte hain
    }

    int[] order = new int[numCourses];
    int count = 0;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order[count++] = u;                   // u ab ho gaya
        for (int v : graph.get(u)) {
            if (--inDegree[v] == 0) queue.offer(v);   // 🔑 v ki aakhri dependency poori → v ab ready
        }
    }
    return count == numCourses ? order : new int[0];  // sab nahi nikle → cycle → order possible nahi
}
```

**Line by line samjho**: `inDegree` = "abhi kitni dependencies bachi hain". Jaise hi kisi kaam ko `poll` karke "kar diya", uske aage wale kaamon ka `inDegree` ghatata hai. Jiska `0` ho gaya wo queue mein. **Cycle** ke nodes ka `inDegree` kabhi 0 hota hi nahi (har node ko cycle ka doosra node rok ke rakhta hai) — isliye wo kabhi nikalte nahi, aur `count < n` reh jata hai. Time **O(V + E)**.

## Tarika 2 — DFS se (post-order ulta)

**Trick**: *"Jab kisi node ke **neeche ke sab kaam khatam** ho jayein, tab use ek stack pe rakh do. Aakhir mein stack ko ulta padho."* — jo **baad mein finish** hua wo **pehle** aata hai.

```
Edges: 0 → 1, 1 → 3, 2 → 3

DFS(0): 0 → 1 → 3 ... 3 khatam (push 3), 1 khatam (push 1), 0 khatam (push 0)     stack (top → neeche): 0, 1, 3
DFS(2): 3 pehle se visited ... 2 khatam (push 2)                                   stack (top → neeche): 2, 0, 1, 3

topological order = stack ko top se padho = [2, 0, 1, 3]   ✅  (2 → 3 ✓, 0 → 1 → 3 ✓)
```

```java
public List<Integer> topoSortDfs(int n, int[][] edges) {      // edges[i] = {u, v}: u pehle, v baad mein
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) graph.get(e[0]).add(e[1]);

    int[] state = new int[n];                    // 0 = naya, 1 = abhi raaste pe, 2 = khatam
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && !dfs(graph, i, state, stack)) return new ArrayList<>();   // cycle mili → khaali
    }
    return new ArrayList<>(stack);               // stack ke top se neeche = topological order
}

private boolean dfs(List<List<Integer>> graph, int u, int[] state, Deque<Integer> stack) {
    state[u] = 1;
    for (int v : graph.get(u)) {
        if (state[v] == 1) return false;         // raaste pe hi wapas mile → CYCLE
        if (state[v] == 0 && !dfs(graph, v, state, stack)) return false;
    }
    state[u] = 2;
    stack.push(u);                               // 🔑 POST-order: u ke neeche ke sab khatam → tab u stack pe
    return true;
}
```

**Kahn vs DFS**:

| | Kahn (BFS) | DFS |
|---|---|---|
| Idea | In-degree 0 wale pehle | Post-order ka ulta |
| Cycle pata | `count < n` | Raaste pe wapas mila (`state == 1`) |
| Layers (parallel) | ✅ Aasani se (level by level) | ❌ Nahi |
| Kab | Interview default | Jab DFS already chal raha ho |

## Code example 3 — Kam se kam kitne semester? (Layers = Parallel Courses)

**Trick**: *"Ek semester mein wo saare courses jinki dependency poori ho gayi."* Kahn's algorithm ka **ek BFS layer = ek semester**. Layers ki ginti = **sabse lambi dependency chain**.

```java
// relations[i] = {prev, next} (courses 1..n). Kam se kam semesters; cycle ho toh -1
public int minimumSemesters(int n, int[][] relations) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());
    int[] inDegree = new int[n + 1];
    for (int[] r : relations) {
        graph.get(r[0]).add(r[1]);
        inDegree[r[1]]++;
    }
    Queue<Integer> queue = new ArrayDeque<>();
    for (int i = 1; i <= n; i++) {
        if (inDegree[i] == 0) queue.offer(i);
    }
    int semesters = 0, taken = 0;
    while (!queue.isEmpty()) {
        semesters++;                                    // 🔑 ek layer = ek semester
        for (int size = queue.size(); size > 0; size--) {
            int u = queue.poll();
            taken++;
            for (int v : graph.get(u)) {
                if (--inDegree[v] == 0) queue.offer(v);
            }
        }
    }
    return taken == n ? semesters : -1;                 // saare nahi liye → cycle
}
```

## Code example 4 — Alien Dictionary (graph khud banana) ⭐

**Problem**: Ek alien bhasha ke words **uske alphabet ke hisaab se sorted** diye hain. Alphabet ka order batao.

**Trick**: *"Do padosi words compare karo — **pehla alag akshar** hi order batata hai (`x` pehle, `y` baad mein), uske baad ke akshar bekaar."* Har aisi jodi ek **edge `x → y`**. Phir **topological sort**.

```
words = [wrt, wrf, er, ett, rftt]

wrt vs wrf   → pehla alag akshar: t, f   →  t → f
wrf vs er    →                    w, e   →  w → e
er  vs ett   →                    r, t   →  r → t
ett vs rftt  →                    e, r   →  e → r

Graph:  w → e → r → t → f       ⇒  order = "wertf" ✅
```

```java
public String alienOrder(String[] words) {
    Map<Character, Set<Character>> graph = new HashMap<>();
    Map<Character, Integer> inDegree = new HashMap<>();
    for (String w : words) {
        for (char c : w.toCharArray()) {                 // saare letters ko nodes bana lo
            graph.putIfAbsent(c, new HashSet<>());
            inDegree.putIfAbsent(c, 0);
        }
    }

    for (int i = 0; i + 1 < words.length; i++) {
        String a = words[i], b = words[i + 1];
        if (a.length() > b.length() && a.startsWith(b)) return "";       // 🔑 "abc" ke BAAD "ab" — invalid
        for (int j = 0; j < Math.min(a.length(), b.length()); j++) {
            char x = a.charAt(j), y = b.charAt(j);
            if (x != y) {                                                // pehla alag akshar → edge x → y
                if (graph.get(x).add(y)) inDegree.merge(y, 1, Integer::sum);   // duplicate edge dobara count na ho
                break;                                                    // iske baad ke aksharon se koi info nahi
            }
        }
    }

    Queue<Character> queue = new ArrayDeque<>();
    for (char c : inDegree.keySet()) {
        if (inDegree.get(c) == 0) queue.offer(c);
    }
    StringBuilder sb = new StringBuilder();
    while (!queue.isEmpty()) {
        char c = queue.poll();
        sb.append(c);
        for (char next : graph.get(c)) {
            if (inDegree.merge(next, -1, Integer::sum) == 0) queue.offer(next);
        }
    }
    return sb.length() == graph.size() ? sb.toString() : "";             // sab nahi nikle → cycle → invalid
}
```

## Topological order ke kuch facts

- **Kai valid orders** ho sakte hain. Order **unique tabhi** jab Kahn ki queue mein **har step pe sirf ek** node ho.
- **Topological order = "DAG hai" ka saboot.** Order ban gaya ⇒ cycle nahi; nahi bana ⇒ cycle hai. (Isliye "Course Schedule" = cycle detection ka hi ek roop.)
- **Longest path in DAG** = layers ki ginti (upar wala `minimumSemesters`).

## Kab lagana hai — pehchano

| Problem ka hint | Topological Sort |
|---|---|
| "**Prerequisite** / dependency / pehle ye phir wo" | Directed graph banao |
| "Kya **sab complete** ho sakta hai?" | Order bana ya nahi (cycle check) |
| "Ek **valid order** do" | Kahn / DFS ka output |
| "**Kam se kam rounds/semesters**" | Kahn ke layers |
| Order kisi rule se nikalna (Alien Dictionary) | Rule → edges → sort |

Pattern-style practice: [Graph Algorithms pattern](../../01-patterns/20-graph-algorithms.md).

## Common galtiyan

- **Edge ki direction ulti** — LeetCode mein `[a, b]` ka matlab aksar *"b pehle, a baad"* hai. Edge `b → a`.
- **`inDegree` ko ek se zyada baar badhana** (duplicate edges) — Alien Dictionary mein `Set` se check.
- **Cycle check bhoolna** — `count < n` ya `state == 1`.
- **Undirected graph pe topological sort** — sirf directed pe hota hai.
- **Alien Dictionary mein prefix wala case** (`"abc"` ke baad `"ab"`) miss karna.
- **Disconnected nodes ko chhod dena** — inka bhi `inDegree` 0 hai, order mein aane chahiye.

> 💡 **Interview mein bolne wali line**: *"Dependencies ko directed graph maanke main Kahn's algorithm chalaunga — in-degree 0 wale queue mein, ek-ek nikalke aage wale ka in-degree ghataunga. Agar saare nodes nikle toh valid order, warna cycle hai. Time O(V + E)."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Course Schedule | Medium | Cycle hai ya nahi (Kahn) | [leetcode.com/problems/course-schedule](https://leetcode.com/problems/course-schedule/) |
| 2 | Course Schedule II | Medium | Order return karo | [leetcode.com/problems/course-schedule-ii](https://leetcode.com/problems/course-schedule-ii/) |
| 3 | Find Eventual Safe States | Medium | Ulta graph + Kahn / DFS colors | [leetcode.com/problems/find-eventual-safe-states](https://leetcode.com/problems/find-eventual-safe-states/) |
| 4 | Minimum Height Trees | Medium | Leaf ko peel karo (Kahn jaisa) | [leetcode.com/problems/minimum-height-trees](https://leetcode.com/problems/minimum-height-trees/) |
| 5 | Course Schedule IV | Medium | Topo order + reachability | [leetcode.com/problems/course-schedule-iv](https://leetcode.com/problems/course-schedule-iv/) |
| 6 | All Ancestors of a Node in a Directed Acyclic Graph | Medium | Topo order pe ancestors jodo | [leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/) |
| 7 | Find All Possible Recipes from Given Supplies | Medium | Kahn on strings | [leetcode.com/problems/find-all-possible-recipes-from-given-supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) |
| 8 | Parallel Courses 🔒 (Premium) | Medium | Kahn ke layers = semesters | [leetcode.com/problems/parallel-courses](https://leetcode.com/problems/parallel-courses/) |
| 9 | Parallel Courses III | Hard | DAG mein longest path (time ke saath) | [leetcode.com/problems/parallel-courses-iii](https://leetcode.com/problems/parallel-courses-iii/) |
| 10 | Alien Dictionary 🔒 (Premium) | Hard | Words → edges → topo | [leetcode.com/problems/alien-dictionary](https://leetcode.com/problems/alien-dictionary/) |
| 11 | Sort Items by Groups Respecting Dependencies | Hard | Do level pe topo sort | [leetcode.com/problems/sort-items-by-groups-respecting-dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/) |
| 12 | Longest Increasing Path in a Matrix | Hard | Grid = DAG, DFS + memo / topo | [leetcode.com/problems/longest-increasing-path-in-a-matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) |

Agla: [21-union-find.md](21-union-find.md)
