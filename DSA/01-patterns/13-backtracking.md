# 13. Backtracking

> **Standard definition**: A refinement of brute-force search that incrementally builds candidates to a solution, and abandons ("backtracks" from) a candidate as soon as it determines it cannot lead to a valid solution.

**Ek line mein**: Ek **choice try karo**, aage badho — agar galat nikla ya
dead-end aaya, **wapas aake (backtrack) usse undo karo** aur doosri choice
try karo.

**Trick yaad rakhne ki**: *"Pencil se maze solve karna"* — ek raasta try
karo, agar dead-end aaye toh **pencil se mita do** (undo/backtrack) aur
doosra raasta try karo. Pen se nahi likhte kyunki galti undo karni pad sakti hai.

**Kab use karo**: Saare **permutations, combinations, subsets** generate
karne hain, ya "valid arrangement dhoondo" jaisi problems (N-Queens, Sudoku)
jaha bahut sare choices hain aur galat choice ko undo karna padta hai.

## Code example — Combination Sum

```java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] candidates, int remaining, int start,
                        List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) {
        result.add(new ArrayList<>(current));   // 🔑 valid combination mil gaya, copy save karo
        return;
    }
    if (remaining < 0) return;   // dead-end, backtrack karo

    for (int i = start; i < candidates.length; i++) {
        current.add(candidates[i]);                          // CHOOSE: is number ko lo
        backtrack(candidates, remaining - candidates[i], i, current, result);  // EXPLORE aage
        current.remove(current.size() - 1);                  // UN-CHOOSE: backtrack karo
    }
}
```

**Line by line samjho**: Ye **Choose → Explore → Un-choose** pattern hi
backtracking ka dil hai. `current.add()` se ek number choose karte hain,
recursively aage explore karte hain (`i` pass kiya, `i+1` nahi, kyunki
same number **dobara use** ho sakta hai is problem mein), aur wapas aane
pe `current.remove()` se **undo** kar dete hain taaki agli choice (loop ka
next `i`) clean state se try ho.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | N-Queens | Hard | [leetcode.com/problems/n-queens](https://leetcode.com/problems/n-queens/) |
| 2 | Sudoku Solver | Hard | [leetcode.com/problems/sudoku-solver](https://leetcode.com/problems/sudoku-solver/) |
| 3 | Combination Sum | Medium | [leetcode.com/problems/combination-sum](https://leetcode.com/problems/combination-sum/) |
| 4 | Permutations | Medium | [leetcode.com/problems/permutations](https://leetcode.com/problems/permutations/) |
| 5 | Subsets II | Medium | [leetcode.com/problems/subsets-ii](https://leetcode.com/problems/subsets-ii/) |

Agla: [14-greedy.md](14-greedy.md)
