# 12. DFS (Depth-First Search)

> **Standard definition**: A graph/tree traversal algorithm that explores as far as possible down one branch before backtracking, typically implemented via recursion or an explicit stack.

**Ek line mein**: Ek path pe **poori tarah neeche/aage** jao jab tak dead-end
na aaye, phir **backtrack** karke agla path try karo.

**Trick yaad rakhne ki**: *"Bhulbhulaiya (maze) mein ek raasta pura explore
karo pehle, dead-end mile toh peeche aake doosra raasta try karo"* — BFS
"chaudai" mein failta hai, DFS "gehraai" mein jaata hai.

**Kab use karo**: **Saare paths explore** karne hain, connected
components/islands dhoondhne hain, ya tree/graph recursively traverse
karna hai.

## Code example — Number of Islands

```java
public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);   // 🔑 pura island "sink" kar do (visited mark karo)
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    // boundary check + already visited/water check
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
        return;
    }
    grid[r][c] = '0';   // 🔑 visited mark kar diya, taaki dobara count na ho

    // 4 directions mein aage badho
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
```

**Line by line samjho**: Jaise hi ek naya `'1'` (land) milta hai, `count++`
karke us **poore connected island ko DFS se "sink"** kar dete hain (sab
`'1'` ko `'0'` bana dete hain) — taaki wahi island dobara count na ho.
Recursion **4 directions** mein failta hai jab tak boundary ya paani
(`'0'`) na mil jaye.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Number of Islands | Medium | [leetcode.com/problems/number-of-islands](https://leetcode.com/problems/number-of-islands/) |
| 2 | Path Sum | Easy | [leetcode.com/problems/path-sum](https://leetcode.com/problems/path-sum/) |
| 3 | Clone Graph | Medium | [leetcode.com/problems/clone-graph](https://leetcode.com/problems/clone-graph/) |
| 4 | Max Area of Island | Medium | [leetcode.com/problems/max-area-of-island](https://leetcode.com/problems/max-area-of-island/) |
| 5 | Surrounded Regions | Medium | [leetcode.com/problems/surrounded-regions](https://leetcode.com/problems/surrounded-regions/) |

Agla: [13-backtracking.md](13-backtracking.md)
