# DSA 5/8 — Trees (traversals and views)

**Easy analogy — family photo on the stairs**: Level order = har seedhi (generation) ki line se photo. Left view = **baayi taraf** se khade photographer ko jo dikhe (har seedhi ka pehla insaan). Top view = **chhat** se neeche dekho — har vertical column ka sabse upar wala insaan dikhta hai.

| # | Problem | Reporter level | Freq | Status |
|---|---|---|---|---|
| 1 | Level order traversal (+ zigzag) | NCG + NCG + Staff (data eng) | **HIGH** (3) | Exact |
| 2 | Minimum depth of a binary tree | NCG | LOW | Exact |
| 3 | Top view (+ left / right view) — *you asked for it* | Senior (2021, 2023) | MEDIUM (2, senior) | Exact |
| 4 | Inorder traversal of the mirror image | Senior (2021) | LOW | Exact |
| 5 | Binary tree maximum path sum | Senior (2021) | LOW | Exact |
| 6 | LCA of deepest leaves | Intern (2022) | LOW | Exact |

All code uses this node:

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
```

---

## 1. Level order traversal (+ zigzag)

| Field | Details |
|---|---|
| **Reported problems** | "level order traversal: leetcode.com/problems/binary-tree-level-order-traversal" ([LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/), Feb 2025, NCG, round 3) · "Level-order binary tree traversal with reversed alternate levels" ([GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/), NCG, round 1) · "Write a program to print a tree in level order" ([LC-6653237](https://leetcode.com/discuss/post/6653237/visa-inc-staff-data-engineer-by-rahulx33-p1si/), Apr 2025, Staff data engineer) — **Exact** ([LC 102](https://leetcode.com/problems/binary-tree-level-order-traversal/), [LC 103](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)) |
| **Round** | Technical rounds |
| **Difficulty** | Medium |
| **Pattern** | BFS with a queue, processing one level at a time (`size` snapshot) |
| **Frequency** | **HIGH** (3 reports) |

**Brute force**: find the height, then for each depth do a DFS that collects nodes at that depth → O(n · h) (O(n²) for a skewed tree).
**Optimal**: BFS; at the start of each level, `size = queue.size()` tells how many nodes belong to this level.

```
        3              level 0: [3]
       / \             level 1: [9, 20]
      9   20           level 2: [15, 7]
         /  \          zigzag:  [3], [20, 9], [15, 7]
        15   7
```

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

class LevelOrder {
    static List<List<Integer>> levels(TreeNode root, boolean zigzag) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();                          // nodes on this level
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            if (zigzag && out.size() % 2 == 1) Collections.reverse(level);   // every other level
            out.add(level);
        }
        return out;
    }
}
```

**Time**: O(n). **Space**: O(w) where w = max width (≤ n/2 for a full tree).
**Follow-ups**: bottom-up levels ([LC 107](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/)) · average of each level · right side view (last node of each level) · do it with DFS + depth parameter · zigzag with a deque instead of reversing.
**🗣️ Interview mein aise bolo**: "BFS mein level ka size pehle hi note kar leta hoon — utne hi nodes nikaalta hoon, baaki agle level ke. Zigzag ke liye odd levels ko reverse."

---

## 2. Minimum depth of a binary tree

| Field | Details |
|---|---|
| **Reported problem** | "minimum depth of binary tree: leetcode.com/problems/minimum-depth-of-binary-tree" — **Exact** ([LC 111](https://leetcode.com/problems/minimum-depth-of-binary-tree/)) |
| **Source** | [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) · Feb 2025 · NCG · round 3 |
| **Difficulty** | Easy | **Pattern**: BFS — the first **leaf** you meet is the answer | **Frequency**: LOW |

**Trap**: `1 + min(depth(left), depth(right))` is **wrong** when one child is null (a node with one child is not a leaf). BFS avoids the trap and stops early.

```java
import java.util.ArrayDeque;
import java.util.Deque;

class MinDepth {
    static int minDepth(TreeNode root) {
        if (root == null) return 0;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        int depth = 1;
        while (!queue.isEmpty()) {
            for (int i = queue.size(); i > 0; i--) {
                TreeNode node = queue.poll();
                if (node.left == null && node.right == null) return depth;   // first leaf
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            depth++;
        }
        return depth;
    }
}
```

**Time**: O(n) worst, often much less (stops at the first leaf). **Space**: O(w).
**🗣️ Interview mein aise bolo**: "Minimum depth = pehla leaf. BFS level by level chalata hoon — jaise hi leaf mila, wahi answer. Recursive min mein null child wala trap hai."

---

## 3. Top view (+ left / right view)

| Field | Details |
|---|---|
| **Reported problems** | "print the top view of a binary tree" ([LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/), Jan 2021, experienced SWE, 6 YOE, round 1) · "binary tree top view, left/right view" ([LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/), May 2023, Senior, 3 YOE, round 1) — **Exact** (classic; right view = [LC 199](https://leetcode.com/problems/binary-tree-right-side-view/)) |
| **Round** | Technical round 1 (DSA) |
| **Difficulty** | Medium |
| **Pattern** | BFS with horizontal distance (`hd`) → first node seen per `hd` (top view); first/last node per level (left/right view) |
| **Frequency** | MEDIUM (2 reports, both **Senior** — included because you asked) |

**Brute force**: DFS recording `(hd, depth)` for every node, then pick the minimum depth per `hd` — works, but a plain DFS without depth comparison gives **wrong** answers (a deeper left-subtree node can be visited first).
**Optimal**: BFS guarantees we meet each `hd` for the first time at its **top-most** node. Store in a `TreeMap<hd, value>` (sorted left → right).

```
            1          level 0      hd:   -1   0   +1
          /   \                           2    1    3      ← top-most node per column
         2     3       level 1
          \                         top view   = [2, 1, 3]
           4           level 2      (4 sits at hd 0 below 1; 5 sits at hd +1 below 3)
            \
             5         level 3      left view  = [1, 2, 4, 5]   right view = [1, 3, 4, 5]
```

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

class TreeViews {
    static List<Integer> topView(TreeNode root) {
        Map<Integer, Integer> firstAtHd = new TreeMap<>();          // hd → top-most value
        if (root == null) return new ArrayList<>();
        Deque<Object[]> queue = new ArrayDeque<>();                  // {node, hd}
        queue.add(new Object[]{root, 0});
        while (!queue.isEmpty()) {
            Object[] item = queue.poll();
            TreeNode node = (TreeNode) item[0];
            int hd = (Integer) item[1];
            firstAtHd.putIfAbsent(hd, node.val);                     // BFS: first seen = highest
            if (node.left != null) queue.add(new Object[]{node.left, hd - 1});
            if (node.right != null) queue.add(new Object[]{node.right, hd + 1});
        }
        return new ArrayList<>(firstAtHd.values());
    }

    static List<Integer> sideView(TreeNode root, boolean left) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if ((left && i == 0) || (!left && i == size - 1)) out.add(node.val);   // first / last of level
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
        }
        return out;
    }
}
```

**Time**: top view O(n log n) with `TreeMap` (O(n) if you track min/max hd and use an array/HashMap) · side views O(n). **Space**: O(n).
**Follow-ups**: bottom view (`put` instead of `putIfAbsent` — last seen per hd) · vertical order traversal ([LC 987](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/)) · why does DFS need the depth? (to compare which node is higher).
**🗣️ Interview mein aise bolo**: "Root ka horizontal distance 0, left −1, right +1. BFS mein har hd pe jo pehla node aata hai wahi upar se dikhta hai — `putIfAbsent`. Bottom view ke liye bas overwrite."

---

## 4. Inorder traversal of the mirror image

| Field | Details |
|---|---|
| **Reported problem** | "Inorder traversal of the mirror image of the binary tree" with tree `3 / 4 5 / 6 7 8 9` → `9, 5, 8, 3, 7, 4, 6` — **Exact** |
| **Source** | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) · Jul 2021 · **Senior**, Bangalore · round 3 |
| **Difficulty** | Easy | **Pattern**: mirror's inorder = original's **reverse inorder** (right, root, left) — no need to build the mirror | **Frequency**: LOW |

```java
import java.util.ArrayList;
import java.util.List;

class MirrorInorder {
    static List<Integer> mirrorInorder(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        walk(root, out);
        return out;
    }

    private static void walk(TreeNode node, List<Integer> out) {
        if (node == null) return;
        walk(node.right, out);          // mirror swaps children → visit right first
        out.add(node.val);
        walk(node.left, out);
    }
}
```

**Time**: O(n). **Space**: O(h). **Follow-up**: actually mirror the tree in place ([LC 226](https://leetcode.com/problems/invert-binary-tree/)).

---

## 5. Binary tree maximum path sum

| Field | Details |
|---|---|
| **Reported problem** | [LC 124](https://leetcode.com/problems/binary-tree-maximum-path-sum/) — **Exact** |
| **Source** | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) · Jul 2021 · **Senior** · round 2 | **Difficulty**: Hard | **Pattern**: post-order DFS returning the best "downward" path; update a global best with left + node + right |

```java
class MaxPathSum {
    private static long best;

    static long maxPathSum(TreeNode root) {
        best = Long.MIN_VALUE;
        down(root);
        return best;
    }

    private static long down(TreeNode node) {           // best path starting at node going down
        if (node == null) return 0;
        long left = Math.max(0, down(node.left));      // negative branch? don't take it
        long right = Math.max(0, down(node.right));
        best = Math.max(best, left + node.val + right); // path that bends at this node
        return node.val + Math.max(left, right);        // parent can extend only one side
    }
}
```

**Time**: O(n). **Space**: O(h).

---

## 6. LCA of deepest leaves

| Field | Details |
|---|---|
| **Reported problem** | "1123. Lowest common ancestor of deepest leaves" — **Exact** ([LC 1123](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/)) |
| **Source** | [LC-2626818](https://leetcode.com/discuss/post/2626818/visa-sde-intern-bengaluru-sept-2022-by-a-5x5w/) · Sep 2022 · SDE intern, Bengaluru (older) | **Difficulty**: Medium | **Pattern**: DFS returning (depth, lca) |

```java
class DeepestLeavesLca {
    static TreeNode lca(TreeNode root) { return (TreeNode) dfs(root)[1]; }

    private static Object[] dfs(TreeNode node) {        // {depth, lca of deepest leaves in subtree}
        if (node == null) return new Object[]{0, null};
        Object[] l = dfs(node.left), r = dfs(node.right);
        int dl = (Integer) l[0], dr = (Integer) r[0];
        if (dl == dr) return new Object[]{dl + 1, node}; // deepest leaves on both sides → node
        return dl > dr ? new Object[]{dl + 1, l[1]} : new Object[]{dr + 1, r[1]};
    }
}
```

**Time**: O(n). **Space**: O(h).

---

⚡ **Quick revision**: level order = BFS + size snapshot · min depth = first leaf in BFS · top view = BFS + hd + `putIfAbsent` · left/right view = first/last node per level · mirror inorder = right-root-left · path sum = return one side up, record both sides at the bend.

Next: [DSA 6/8 — Graphs & matrix →](06-graphs-and-matrix.md)
