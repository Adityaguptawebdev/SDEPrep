# 13. Binary Tree

> 📍 **Syllabus**: Unit 3 — Trees & Heaps · Topic 13 / 29 · Pehle chahiye: [Recursion](../01-basics/09-recursion.md), [Linked List](../02-linear-structures/10-linked-list.md), [Queue](../02-linear-structures/12-queue-and-deque.md)

> **Standard definition**: A hierarchical, non-linear data structure made of nodes connected by edges, with a single root node and every other node having exactly one parent; in a binary tree each node has at most two children, called the left child and the right child.

**Ek line mein**: **Family tree** jaisa structure — ek **root** (dada), aur har node ke **zyada se zyada 2 bachche** (left, right). Har node apne aap mein **ek chhote tree ka root** hai — isi liye tree ki har problem **recursion** se hoti hai.

**Trick yaad rakhne ki**: *"Company ka org chart"* — CEO (root) ke neeche managers, unke neeche employees. CEO ko poori company ka hisaab chahiye toh wo **apne 2 managers se poochhta hai** ("apni team ka hisaab do"), wo apne employees se poochhte hain... aur sab **upar ki taraf answer bhejte** hain. Tree ka har kaam yehi hai: **left se poochho, right se poochho, combine karo.**

**Kab use karo**: Jab data **hierarchical** ho (folders, org chart, HTML DOM, expression tree), ya jab problem mein **"left/right subtree"**, **height**, **path**, **ancestor** ki baat ho. BST, Heap, Trie — sab tree ke hi roop hain.

## Tree ki bhasha (terminology)

```
                1              level 0  ← ROOT (sabse upar, iska koi parent nahi)
              /   \
             2     3           level 1  ← 2 aur 3 "siblings" hain, 1 unka "parent"
            / \     \
           4   5     6         level 2  ← 4, 5 leaf hain (bachche nahi)
                    /
                   7           level 3  ← 7 bhi leaf hai

Subtree of 2  =  { 2, 4, 5 }     (2 ko root maan lo toh ek chhota tree)
```

| Term | Matlab | Is tree mein |
|---|---|---|
| **Root** | Sabse upar ka node | 1 |
| **Leaf** | Jiske koi bachcha nahi | 4, 5, 7 |
| **Depth** of node | Root se us node tak kitne edges | depth(7) = 3 |
| **Height** of tree | Root se sabse door leaf tak ke edges | 3 (nodes ginte toh 4 — `maxDepth()` yahi deta hai) |
| **Level** | Depth jaisa (root = level 0) | 4 levels |
| **Subtree** | Kisi node + uske neeche ka sab kuch | subtree(3) = {3, 6, 7} |

**Formulas**: Level `i` pe **max 2ⁱ** nodes. Height `h` ke tree mein **max 2^(h+1) − 1** nodes.

## Binary Tree ke roop

```
Full (0 ya 2 bachche)    Complete (last level     Perfect (sab levels    Skewed / Degenerate
                         ko chhod sab bhare,      poore bhare)           (linked list jaisa —
      1                  left se bharte hain)           1                 height = n, bura!)
     / \                        1                     /   \                 1
    2   3                     /   \                  2     3                 \
       / \                   2     3                / \   / \                 2
      4   5                 / \   /                4   5 6   7                 \
                           4   5 6                                               3
```

**Balanced** = left aur right ki height ka farq kam (≤ 1) — tab height ≈ **log n**. Skewed mein height = **n**. Tree ki zyadatar speed **height pe hi depend** karti hai.

## Code example 1 — Node aur traversals (DFS)

**Traversal** = saare nodes ko ek order mein ghoomna. DFS ke **3 order** hain — fark sirf itna ki **root ka kaam kab karte ho**:

**Memory trick**: *"Pre = root **PEHLE**, In = root **BEECH** mein, Post = root **BAAD** mein"* (left-right hamesha isi order mein).

```
        1
       / \
      2   3
     / \
    4   5

Preorder   (Root, Left, Right)  :  1  2  4  5  3
Inorder    (Left, Root, Right)  :  4  2  5  1  3
Postorder  (Left, Right, Root)  :  4  5  2  3  1
Level order (BFS, level-by-level):  1  2  3  4  5
```

```java
class TreeNode {
    int val;
    TreeNode left, right;                 // baayein aur daayein bachche (null = nahi hai)
    TreeNode(int val) { this.val = val; }
}
```

```java
public List<Integer> preorder(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    pre(root, res);
    return res;
}
private void pre(TreeNode node, List<Integer> res) {
    if (node == null) return;             // base case: khaali jagah
    res.add(node.val);                    // ROOT pehle
    pre(node.left, res);
    pre(node.right, res);
}

public List<Integer> inorder(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    in(root, res);
    return res;
}
private void in(TreeNode node, List<Integer> res) {
    if (node == null) return;
    in(node.left, res);
    res.add(node.val);                    // ROOT beech mein
    in(node.right, res);
}

public List<Integer> postorder(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    post(root, res);
    return res;
}
private void post(TreeNode node, List<Integer> res) {
    if (node == null) return;
    post(node.left, res);
    post(node.right, res);
    res.add(node.val);                    // ROOT baad mein
}
```

**Kaun sa traversal kab**:

| Traversal | Kab kaam aata hai |
|---|---|
| **Preorder** | Tree ki **copy / serialize** (root pehle chahiye) |
| **Inorder** | **BST** mein sorted order milta hai |
| **Postorder** | **Bottom-up** kaam — pehle bachchon ka answer, phir root (height, delete tree) |
| **Level order** | Level-wise, **shortest path** jaise sawaal |

## Code example 2 — Iterative traversal (recursion ki jagah apna stack)

Bahut gehre tree pe recursion se `StackOverflow` ho sakta hai. Interviewer aksar poochta hai *"iteratively karo."*

```java
// Iterative inorder — "jitna left ja sako jao, phir wapas aakar kaam karo"
public List<Integer> inorderIterative(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {             // 🔑 jitna left ja sakte ho jao (raaste ke nodes stack mein)
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();                // left khatam → ab is node ki baari
        res.add(cur.val);
        cur = cur.right;                  // ab right subtree ke liye wahi kaam
    }
    return res;
}

// Iterative preorder
public List<Integer> preorderIterative(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        res.add(node.val);
        if (node.right != null) stack.push(node.right);   // 🔑 right PEHLE push — taaki left pehle nikle (LIFO)
        if (node.left != null) stack.push(node.left);
    }
    return res;
}
```

## Tree ki har problem ka universal recipe

```
1. Base case   :  node == null → kya return karun?  (0 / true / false / null)
2. Left se    :  left subtree se answer maango   (bharosa rakho, recursion dega!)
3. Right se   :  right subtree se answer maango
4. Combine    :  dono + current node ka kaam  →  apna answer upar bhejo
```

**Do style**: *Bottom-up* (bachchon se answer upar aata hai — height, diameter) aur *Top-down* (parameter neeche bhejte ho — `target - root.val`).

## Code example 3 — Height, Invert, Same, Symmetric

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;                                       // khaali tree ki height 0
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));   // main (1) + bade bachche ki height
}

public int countNodes(TreeNode root) {
    if (root == null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}

// Tree ko "mirror" karo — har node ke left aur right swap
public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;                    // 🔑 dono bachche swap
    root.right = left;
    return root;
}

public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;      // dono khatam ek saath → same
    if (p == null || q == null) return false;     // ek khatam, doosra nahi → alag
    return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

public boolean isSymmetric(TreeNode root) {
    return root == null || mirror(root.left, root.right);
}
private boolean mirror(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.val == b.val
        && mirror(a.left, b.right)        // 🔑 left ka right se match
        && mirror(a.right, b.left);       //      right ka left se match
}
```

## Code example 4 — Diameter aur Balanced (bottom-up ka jaadu)

**Diameter** = tree mein **kisi bhi do nodes ke beech sabse lamba raasta** (edges mein). Raasta root se hokar jaana zaroori nahi.

**Trick**: *"Har node se sochho — agar main hi mod (turning point) hoon toh raasta kitna lamba: left height + right height."* Function **height return karta hai**, par **answer ek alag variable mein** update karta rehta hai.

```
        1            Diameter = 3 edges  (path 4 → 2 → 1 → 3,  ya  5 → 2 → 1 → 3)
       / \           node 2 pe: left height 1 (4) + right height 1 (5) = 2
      2   3          node 1 pe: left height 2 (via 2) + right height 1 (3) = 3   ← best
     / \
    4   5
```

```java
private int best = 0;

public int diameterOfBinaryTree(TreeNode root) {
    best = 0;
    height(root);
    return best;
}

private int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    best = Math.max(best, left + right);   // 🔑 agar yahin se "mud" jaun toh raasta = left + right
    return 1 + Math.max(left, right);      // upar walon ko sirf EK taraf ki height chahiye
}

// Balanced: har node pe left-right height ka farq ≤ 1.   -1 = "neeche hi kahin unbalanced mil gaya"
public boolean isBalanced(TreeNode root) {
    return check(root) != -1;
}
private int check(TreeNode node) {
    if (node == null) return 0;
    int left = check(node.left);
    if (left == -1) return -1;             // neeche gadbad → seedha upar bata do (aage kaam ki zarurat nahi)
    int right = check(node.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}
```

## Code example 5 — LCA aur Path Sum

**LCA (Lowest Common Ancestor)** = do nodes `p`, `q` ka **sabse neeche wala common baap**. **Trick**: *"Dono ke raaste jahan alag hote hain, wahi sangam hai."*

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;      // p ya q mil gaya (ya raasta khatam)
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;               // 🔑 p ek taraf, q doosri taraf → main hi sangam (LCA)
    return left != null ? left : right;                           // dono ek hi taraf → wahi ka answer upar bhejo
}

// Root se leaf tak koi raasta jiska sum = target hai kya?  (Top-down: target ghatate jao)
public boolean hasPathSum(TreeNode root, int target) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return root.val == target;   // leaf pe pahunche → check
    return hasPathSum(root.left, target - root.val)
        || hasPathSum(root.right, target - root.val);                         // 🔑 apna value target se ghatake neeche bhejo
}
```

## Code example 6 — Preorder + Inorder se tree wapas banana

**Trick**: *"Preorder ka pehla element hamesha root hota hai. Inorder mein us root ke baayein wale = left subtree, daayein wale = right subtree."*

```
preorder = [3, 9, 20, 15, 7]        inorder = [9, 3, 15, 20, 7]

root = 3  (preorder ka pehla)
inorder mein 3 kahan?  →  [9] │ 3 │ [15, 20, 7]
                          left      right
left subtree  = { 9 }              right subtree = { 20, 15, 7 }  → wahi kaam recursion se

        3
       / \
      9   20
         /  \
        15   7
```

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
    Map<Integer, Integer> pos = new HashMap<>();            // value → inorder mein index (O(1) lookup)
    for (int i = 0; i < inorder.length; i++) pos.put(inorder[i], i);
    return build(preorder, 0, 0, inorder.length - 1, pos);
}

private TreeNode build(int[] pre, int preIdx, int inLeft, int inRight, Map<Integer, Integer> pos) {
    if (inLeft > inRight) return null;                      // is range mein koi node nahi
    TreeNode root = new TreeNode(pre[preIdx]);              // 🔑 preorder ka pehla element hi root
    int mid = pos.get(root.val);                            // inorder mein root kahan hai
    int leftSize = mid - inLeft;                            // left subtree mein kitne nodes
    root.left = build(pre, preIdx + 1, inLeft, mid - 1, pos);
    root.right = build(pre, preIdx + 1 + leftSize, mid + 1, inRight, pos);
    return root;
}
```

## Code example 7 — Level order ka use: Right Side View

Agar tum tree ko **daayein taraf se dekho** toh har level ka **aakhri node** dikhega. [Queue note](../02-linear-structures/12-queue-and-deque.md) ke BFS template se:

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> view = new ArrayList<>();
    if (root == null) return view;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();                          // is level ke nodes freeze
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (i == size - 1) view.add(node.val);    // 🔑 har level ka AAKHRI node daayein se dikhta hai
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
    }
    return view;
}
```

## Complexity ek nazar mein

| | Time | Space |
|---|---|---|
| Koi bhi traversal (DFS/BFS) | **O(n)** — har node ek baar | DFS: **O(h)** (recursion stack), BFS: O(width) |
| Height, count, same, invert | O(n) | O(h) |
| `h` kya hai? | Balanced: **log n**, Skewed: **n** | |

## Common galtiyan

- **Base case (`node == null`) bhoolna** → `NullPointerException`.
- **Height ko nodes mein ginu ya edges mein** — is note ka `maxDepth` **nodes** ginta hai (null = 0, leaf = 1; LeetCode ka Maximum Depth bhi yahi hai). Sawaal "edges mein" pooche toh `maxDepth − 1`. Diameter ka `left + right` edges mein hi aata hai.
- **Diameter mein `best` ko reset na karna** (agar field hai) — pehle ki call ka answer chipak jata hai.
- **Do trees compare karte waqt `==` se node compare karna** — value ke liye `.val` compare karo.
- **BFS mein level ka `size` freeze na karna.**
- **Skewed tree pe recursion** — depth n → `StackOverflowError`. Iterative ya `-Xss` badhao.

> 💡 **Interview mein bolne wali line**: *"Har node pe main left aur right subtree se recursion se answer maangunga aur combine karunga. Time O(n) kyunki har node ek baar aata hai, space O(h) recursion stack ke liye."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Maximum Depth of Binary Tree | Easy | Bottom-up height | [leetcode.com/problems/maximum-depth-of-binary-tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) |
| 2 | Invert Binary Tree | Easy | Swap left-right | [leetcode.com/problems/invert-binary-tree](https://leetcode.com/problems/invert-binary-tree/) |
| 3 | Same Tree | Easy | Do trees ek saath | [leetcode.com/problems/same-tree](https://leetcode.com/problems/same-tree/) |
| 4 | Symmetric Tree | Easy | Mirror recursion | [leetcode.com/problems/symmetric-tree](https://leetcode.com/problems/symmetric-tree/) |
| 5 | Binary Tree Inorder Traversal | Easy | Recursive + iterative | [leetcode.com/problems/binary-tree-inorder-traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) |
| 6 | Path Sum | Easy | Top-down, target ghatao | [leetcode.com/problems/path-sum](https://leetcode.com/problems/path-sum/) |
| 7 | Balanced Binary Tree | Easy | Height + -1 trick | [leetcode.com/problems/balanced-binary-tree](https://leetcode.com/problems/balanced-binary-tree/) |
| 8 | Diameter of Binary Tree | Easy | Height se global answer | [leetcode.com/problems/diameter-of-binary-tree](https://leetcode.com/problems/diameter-of-binary-tree/) |
| 9 | Binary Tree Right Side View | Medium | Level order ka aakhri node | [leetcode.com/problems/binary-tree-right-side-view](https://leetcode.com/problems/binary-tree-right-side-view/) |
| 10 | Lowest Common Ancestor of a Binary Tree | Medium | Sangam wala node | [leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) |
| 11 | Construct Binary Tree from Preorder and Inorder Traversal | Medium | Root + inorder split | [leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) |
| 12 | Binary Tree Maximum Path Sum | Hard | Diameter jaisa, sum ke saath | [leetcode.com/problems/binary-tree-maximum-path-sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) |
| 13 | Serialize and Deserialize Binary Tree | Hard | Preorder + null markers | [leetcode.com/problems/serialize-and-deserialize-binary-tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) |

Agla: [14-binary-search-tree.md](14-binary-search-tree.md)
