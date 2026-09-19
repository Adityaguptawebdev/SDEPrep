# 15. Union-Find (Disjoint Set Union)

> **Standard definition**: A data structure that tracks a set of elements partitioned into disjoint (non-overlapping) subsets, supporting two efficient operations — `find` (which set does an element belong to) and `union` (merge two sets).

**Ek line mein**: Har element ka ek "parent" track karo — `find()` se pata
karo kaunse **group (root)** ka hai, `union()` se do groups ko **jod do**.
Cycle detection aur "kitne connected groups hain" jaisi problems **bahut
fast** solve ho jati hain.

**Trick yaad rakhne ki**: *"Dosti groups"* — har banda apne "group leader"
(parent) ko jaanta hai. Do bande dost bane (`union`), toh ek ke group ka
leader doosre ke group ke leader ka "boss" ban jata hai. `find()` se pata
chalta hai koi banda kis group mein hai — agar do bandon ka group-leader
same nikla, wo already ek hi group mein hain.

**Kab use karo**: **Cycle detection** (undirected graph mein), **connected
components** count karna, ya "kya ye do cheezein already jude hue hain"
jaisa sawaal.

## Code example — Redundant Connection (extra edge dhoondo jo cycle banata hai)

```java
public int[] findRedundantConnection(int[][] edges) {
    int[] parent = new int[edges.length + 1];
    for (int i = 0; i < parent.length; i++) parent[i] = i;   // shuru mein har node apna khud ka parent

    for (int[] edge : edges) {
        int rootA = find(parent, edge[0]);
        int rootB = find(parent, edge[1]);

        if (rootA == rootB) {
            return edge;   // 🔑 dono already same group mein hain — ye edge cycle banayega!
        }
        parent[rootA] = rootB;   // union: dono groups jodo
    }
    return new int[]{};
}

private int find(int[] parent, int x) {
    if (parent[x] != x) {
        parent[x] = find(parent, parent[x]);   // 🔑 path compression: seedha root se jod do (future fast ho)
    }
    return parent[x];
}
```

**Line by line samjho**: Har edge process karte waqt, dono nodes ka **root
(group leader)** dhoondo. Agar **dono ka root already same** hai, matlab
wo dono pehle se ek hi group mein connected hain — ye naya edge unhe **cycle**
mein daal dega, yehi answer hai. `find()` mein **path compression**
(`parent[x] = find(...)`) future queries ko fast banata hai — tree "flat"
hoti jaati hai.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Redundant Connection | Medium | [leetcode.com/problems/redundant-connection](https://leetcode.com/problems/redundant-connection/) |
| 2 | Accounts Merge | Medium | [leetcode.com/problems/accounts-merge](https://leetcode.com/problems/accounts-merge/) |
| 3 | Number of Provinces | Medium | [leetcode.com/problems/number-of-provinces](https://leetcode.com/problems/number-of-provinces/) |
| 4 | Satisfiability of Equality Equations | Medium | [leetcode.com/problems/satisfiability-of-equality-equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) |
| 5 | Most Stones Removed with Same Row or Column | Medium | [leetcode.com/problems/most-stones-removed-with-same-row-or-column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) |

Agla: [16-stack.md](16-stack.md)
