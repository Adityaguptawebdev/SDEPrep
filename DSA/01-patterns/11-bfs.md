# 11. BFS (Breadth-First Search)

> **Standard definition**: A graph/tree traversal algorithm that explores all neighbors at the current depth level before moving to nodes at the next depth level, using a queue.

**Ek line mein**: Ek **queue** use karo — root/start se shuru karo, uske
saare **immediate neighbors** ek level pe process karo, phir agle level pe
jao. **Level-by-level** traversal.

**Trick yaad rakhne ki**: *"Talaab mein pathar phenka — pehli ripple (level 1)
turant sabse paas failti hai, phir doosri ripple (level 2) uske baad"* —
BFS bhi isi tarah "distance ke hisaab se" failta hai, isliye **unweighted
graph mein shortest path** BFS se milta hai.

**Kab use karo**: Tree ka **level-order traversal**, ya unweighted graph
mein **shortest path/minimum steps** dhoondhna hai.

## Code example — Binary Tree Level Order Traversal

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();   // 🔑 is level mein kitne nodes hain, pehle hi note kar lo
        List<Integer> currentLevel = new ArrayList<>();

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);

            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(currentLevel);   // poora ek level complete hua
    }
    return result;
}
```

**Line by line samjho**: `levelSize = queue.size()` **is level ke exact
nodes ki count** capture kar leta hai, us waqt tak jo bhi queue mein hai
wahi current level ka hai (unke children abhi add nahi hue). Isi count tak
loop chala ke, current level poora process ho jata hai, aur unke children
**agle level ke liye** queue mein add ho jate hain.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Binary Tree Level Order Traversal | Medium | [leetcode.com/problems/binary-tree-level-order-traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| 2 | Word Ladder | Hard | [leetcode.com/problems/word-ladder](https://leetcode.com/problems/word-ladder/) |
| 3 | Rotting Oranges | Medium | [leetcode.com/problems/rotting-oranges](https://leetcode.com/problems/rotting-oranges/) |
| 4 | 01 Matrix | Medium | [leetcode.com/problems/01-matrix](https://leetcode.com/problems/01-matrix/) |
| 5 | Shortest Path in Binary Matrix | Medium | [leetcode.com/problems/shortest-path-in-binary-matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) |

Agla: [12-dfs.md](12-dfs.md)
