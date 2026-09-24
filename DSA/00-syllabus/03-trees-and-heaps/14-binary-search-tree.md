# 14. Binary Search Tree (BST)

> 📍 **Syllabus**: Unit 3 — Trees & Heaps · Topic 14 / 29 · Pehle chahiye: [Binary Tree](13-binary-tree.md), [Binary Search](../01-basics/08-binary-search.md)

> **Standard definition**: A binary tree in which every node's value is greater than all values in its left subtree and less than all values in its right subtree, which allows searching, insertion and deletion in O(h) time, where h is the height of the tree.

**Ek line mein**: Binary tree jisme **har node ke baayein sab chhote, daayein sab bade** — matlab **binary search ko hi tree bana diya**.

**Trick yaad rakhne ki**: *"Chauraha (crossroad) ka signboard"* — har chauraha pe likha hai: **"chhota number → baayein raasta, bada number → daayein raasta."** Kahin bhi pahunchna ho toh har chauraha pe **sirf ek raasta** chunna hai — poore shehar ki khaak nahi chhaanni padti. Ek step mein **aadha shehar** kat jata hai.

**Kab use karo**: Jab data ko **sorted rakhna ho aur saath mein baar-baar insert/delete** bhi ho, ya **floor/ceiling/next bada/range** jaise sawaal hon. (Sirf lookup chahiye toh HashMap kaafi hai; sorted array mein insert mehnga hai.)

## BST kaisa dikhta hai

```
              8
            /   \
           3     10
          / \      \
         1   6     14
            / \    /
           4   7  13

Rule har node pe:   (left subtree ke SAB)  <  node  <  (right subtree ke SAB)

Inorder (Left, Root, Right):  1  3  4  6  7  8  10  13  14     ← SORTED! ⭐
```

**Sabse zaroori fact**: BST ka **inorder traversal hamesha sorted** aata hai. Iske bahut saare sawaal (kth smallest, validate, two sum) isi pe khade hain.

## Search — chauraha wala tarika

`7` dhoondhna hai:

```
8  → 7 < 8 → LEFT
3  → 7 > 3 → RIGHT
6  → 7 > 6 → RIGHT
7  → mil gaya ✅        (sirf 4 nodes dekhe, 9 mein se)
```

Har step pe **aadha subtree chhod** dete ho → balanced tree mein **O(log n)**.

## Code example 1 — Search, Insert, Min/Max

```java
// Search — iterative (recursion ki zarurat nahi)
public TreeNode search(TreeNode root, int val) {
    while (root != null && root.val != val) {
        root = (val < root.val) ? root.left : root.right;   // 🔑 har step pe aadha tree chhod do
    }
    return root;                                             // mila toh node, nahi toh null
}

// Insert — nayi value hamesha kisi LEAF ki jagah jati hai
public TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);              // khaali jagah mil gayi → yahin naya node
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;                                             // duplicate ho toh kuch mat karo
}

public int findMin(TreeNode root) {                          // sabse chhota = sabse LEFT
    while (root.left != null) root = root.left;
    return root.val;
}

public int findMax(TreeNode root) {                          // sabse bada = sabse RIGHT
    while (root.right != null) root = root.right;
    return root.val;
}
```

## Code example 2 — Delete (3 cases)

```
Case 1: LEAF hai              →  seedha hata do
Case 2: EK bachcha hai        →  us bachche ko delete hue node ki jagah laga do
Case 3: DO bachche hain       →  inorder successor (right subtree ka SABSE CHHOTA) ki value
                                 copy karo, phir successor ko hatao (wo case 1/2 hoga)

Delete 3  (do bachche: 1 aur 6).   Successor = right subtree [6, 4, 7] ka minimum = 4

   PEHLE                              BAAD MEIN
        8                                  8
      /   \                              /   \
     3     10                          4     10        ← 3 ki jagah 4 aa gaya
    / \      \                        / \      \
   1   6     14          ───▶      1   6     14
      / \    /                          \    /
     4   7  13                           7  13         ← purana 4 (leaf) hata diya
```

```java
public TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) {
        root.left = deleteNode(root.left, key);              // chhota hai → left mein dhundho
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {                                                 // mil gaya — ab 3 cases
        if (root.left == null) return root.right;            // leaf ya sirf right bachcha → right ko upar lao
        if (root.right == null) return root.left;            // sirf left bachcha → left ko upar lao

        TreeNode successor = root.right;                     // do bachche wala case
        while (successor.left != null) successor = successor.left;   // 🔑 successor = right subtree ka sabse chhota
        root.val = successor.val;                            // uski value yahan copy
        root.right = deleteNode(root.right, successor.val);  // ab successor ko right subtree se hata do
    }
    return root;
}
```

**Line by line samjho**: Do bachcho wale node ko hatate hain toh uski jagah **aisi value chahiye jo left ke sab se bada aur right ke sab se chhota** ho — wo hai **inorder successor** (right subtree ka min). Value copy karke successor ko hatana aasaan hai kyunki successor ke **left bachcha nahi** hota (case 1/2).

## Code example 3 — Validate BST (sabse common jaal)

**Galat soch**: *"Har node ko sirf apne parent se compare karo."* Ye fail hota hai:

```
      5
     / \
    1   6          ← har node apne parent se theek dikhta hai...
       / \
      3   7        ← par 3 chhota hai root 5 se, aur 5 ke RIGHT mein baitha hai → INVALID ❌
```

**Sahi soch**: *"Har node ke liye ek **range (low, high)** hai jisme use hona chahiye"* — neeche jaate hue range tang hoti jati hai.

```java
public boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);       // long: Integer.MIN/MAX_VALUE wale nodes ke liye
}

private boolean valid(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;    // 🔑 range ke bahar → invalid
    return valid(node.left, low, node.val)                     // left mein sab node.val se CHHOTE (upar ki limit = node.val)
        && valid(node.right, node.val, high);                  // right mein sab node.val se BADE (neeche ki limit = node.val)
}
```

**Doosra tarika**: Inorder traversal karo — agar output **strictly badhta** hua nahi hai toh BST nahi.

## Code example 4 — Kth Smallest (inorder ka fayda)

Inorder = sorted, isliye **k-th nikalne wala node** hi k-th smallest hai. Poora traversal karne ki bhi zarurat nahi — k-th pe **ruk jao**:

```java
public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {                 // jitna left ja sako jao
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        if (--k == 0) return cur.val;         // 🔑 inorder mein k-th baar nikla node = k-th smallest
        cur = cur.right;
    }
    return -1;                                // k, nodes se zyada thi
}
```

## Code example 5 — LCA in BST aur Sorted Array → BST

```java
// LCA — BST ki property se O(h), poora tree dhoondhne ki zarurat nahi
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;           // dono chhote → dono left mein
        else if (p.val > root.val && q.val > root.val) root = root.right;     // dono bade → dono right mein
        else return root;                                                      // 🔑 raaste alag hue (ya ek khud root hai) → yahi LCA
    }
    return null;
}

// Sorted array se BALANCED BST — beech ka element root
public TreeNode sortedArrayToBST(int[] nums) {
    return build(nums, 0, nums.length - 1);
}

private TreeNode build(int[] nums, int lo, int hi) {
    if (lo > hi) return null;
    int mid = lo + (hi - lo) / 2;                 // 🔑 beech wala root → dono taraf lagbhag barabar nodes
    TreeNode node = new TreeNode(nums[mid]);
    node.left = build(nums, lo, mid - 1);
    node.right = build(nums, mid + 1, hi);
    return node;
}
```

## BST ki kamzori aur uska ilaaj — Balancing

Agar values **pehle se sorted** insert karo (1, 2, 3, 4...) toh BST **linked list** ban jata hai — height = n, sab operations O(n):

```
Sorted order mein insert: 1, 2, 3           Rotation ke baad (balanced):

    1                                              2
     \                                            / \
      2          ─── rotate ───▶                 1   3
       \
        3      height 3 (bura!)                  height 2 ✅
```

**Self-balancing BST** (AVL, Red-Black) insert/delete ke baad **rotation** karke height ko `log n` mein rakhte hain. Interview mein unhe khud likhna aam taur pe nahi poochha jata — **Java ke `TreeMap` / `TreeSet` andar se Red-Black Tree hain**, seedha use karo:

```java
public void treeMapDemo() {
    TreeMap<Integer, String> map = new TreeMap<>();   // hamesha balanced — sab operations O(log n)
    map.put(10, "a");
    map.put(30, "b");
    map.put(20, "c");

    int first = map.firstKey();              // 10 — sabse chhota key
    int last = map.lastKey();                // 30 — sabse bada key
    Integer floor = map.floorKey(25);        // 20 — 25 ke barabar ya usse chhote mein sabse bada
    Integer ceil = map.ceilingKey(25);       // 30 — 25 ke barabar ya usse bade mein sabse chhota
    Integer lower = map.lowerKey(20);        // 10 — STRICTLY chhota
    Integer higher = map.higherKey(20);      // 30 — STRICTLY bada

    TreeSet<Integer> set = new TreeSet<>(map.keySet());
    Integer f = set.floor(15);               // 10
}
```

## BST vs Sorted Array vs HashMap

| | Balanced BST (`TreeMap`) | Sorted Array | HashMap |
|---|---|---|---|
| Search | O(log n) | O(log n) | **O(1)** |
| Insert / Delete | **O(log n)** | O(n) (khiskana) | **O(1)** |
| Min / Max | O(log n) | O(1) | O(n) |
| Floor / Ceiling / Range | **O(log n)** | O(log n) | ❌ nahi hota |
| Sorted order mein traverse | **O(n)** | O(n) | ❌ (sort karna padega) |

**Kab BST**: jab **order chahiye + dynamic insert/delete**. Sirf "hai ya nahi" → HashMap.

## Common galtiyan

- **Validate mein sirf parent se compare karna** — upar wale ancestors ki limit bhool jana. Range (low, high) pass karo.
- **`Integer.MIN_VALUE` / `MAX_VALUE` se range shuru karna** — tree mein wahi values ho sakti hain; `long` ya `null` use karo.
- **Duplicates ka rule socha nahi** — puchho: allowed hain? Kis taraf jayenge? (Standard BST mein nahi hote.)
- **Delete mein successor ko dobara delete karna bhool jana** — value do jagah reh jati hai.
- **Sorted input se BST banana** — skewed ho jayega. Beech se todke banao ya `TreeMap` lo.
- **Sochna ki BST hamesha O(log n) hai** — sirf balanced hone par; worst case O(n).

> 💡 **Interview mein bolne wali line**: *"BST ki property se main har step mein aadha subtree chhod sakta hoon, isliye O(h). Balanced ho toh O(log n); worst case skewed tree mein O(n). Production mein main TreeMap (Red-Black Tree) use karunga."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Search in a Binary Search Tree | Easy | Chauraha wala search | [leetcode.com/problems/search-in-a-binary-search-tree](https://leetcode.com/problems/search-in-a-binary-search-tree/) |
| 2 | Convert Sorted Array to Binary Search Tree | Easy | Beech = root | [leetcode.com/problems/convert-sorted-array-to-binary-search-tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/) |
| 3 | Two Sum IV - Input is a BST | Easy | Inorder + two pointers / set | [leetcode.com/problems/two-sum-iv-input-is-a-bst](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/) |
| 4 | Minimum Absolute Difference in BST | Easy | Inorder mein adjacent | [leetcode.com/problems/minimum-absolute-difference-in-bst](https://leetcode.com/problems/minimum-absolute-difference-in-bst/) |
| 5 | Insert into a Binary Search Tree | Medium | Leaf pe insert | [leetcode.com/problems/insert-into-a-binary-search-tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/) |
| 6 | Lowest Common Ancestor of a Binary Search Tree | Medium | Value se raasta alag hona | [leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) |
| 7 | Validate Binary Search Tree | Medium | Range (low, high) | [leetcode.com/problems/validate-binary-search-tree](https://leetcode.com/problems/validate-binary-search-tree/) |
| 8 | Kth Smallest Element in a BST | Medium | Inorder + early stop | [leetcode.com/problems/kth-smallest-element-in-a-bst](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) |
| 9 | Delete Node in a BST | Medium | 3 cases + successor | [leetcode.com/problems/delete-node-in-a-bst](https://leetcode.com/problems/delete-node-in-a-bst/) |
| 10 | Trim a Binary Search Tree | Medium | Range ke bahar wale hatao | [leetcode.com/problems/trim-a-binary-search-tree](https://leetcode.com/problems/trim-a-binary-search-tree/) |
| 11 | Binary Search Tree Iterator | Medium | Controlled inorder (stack) | [leetcode.com/problems/binary-search-tree-iterator](https://leetcode.com/problems/binary-search-tree-iterator/) |
| 12 | Recover Binary Search Tree | Medium | Inorder mein do galat nodes | [leetcode.com/problems/recover-binary-search-tree](https://leetcode.com/problems/recover-binary-search-tree/) |

Agla: [15-heap-priority-queue.md](15-heap-priority-queue.md)
