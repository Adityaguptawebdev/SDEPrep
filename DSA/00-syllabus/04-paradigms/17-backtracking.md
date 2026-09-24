# 17. Backtracking

> 📍 **Syllabus**: Unit 4 — Paradigms · Topic 17 / 29 · Pehle chahiye: [Recursion](../01-basics/09-recursion.md), [Binary Tree](../03-trees-and-heaps/13-binary-tree.md)

> **Standard definition**: An algorithmic technique that builds a solution incrementally, making one choice at a time and exploring it recursively; whenever a partial solution cannot lead to a valid complete solution, it abandons that choice (backtracks) and tries the next alternative.

**Ek line mein**: **Ek choice karo → aage badho → agar galat nikla toh wapas aakar (undo) doosri choice try karo.** Brute force hi hai, bas **jaise hi pata chale ki ye raasta kaam nahi karega, wahin rok do** (prune).

**Trick yaad rakhne ki**: *"Shaadi mein seating arrangement"* — tum mehmaanon ko **ek-ek karke table pe bithate** ho. Kisi ko bithaya aur pata chala ki uske bagal mein jhagdalu chacha baithe hain → **usse uthao (undo), kisi doosri seat pe bithao.** Agar us seat ke saare options khatam ho gaye toh **pichhle mehmaan ko hi hilana** padega. Pura arrangement bana toh answer likh lo aur dusre arrangements ke liye bhi wapas jao.

**Kab use karo**: **"Saare subsets / permutations / combinations nikaalo"**, **"valid arrangement dhoondo"** (N-Queens, Sudoku), grid/string pe **saare paths** — aur jab `n` chhota ho (≈ 10–20), kyunki time **exponential** hota hai.

## Decision Tree — backtracking ki asli tasveer

Har step pe **kuch choices** hain; har choice ek **shaakha (branch)** hai. Poora kaam is tree ko **DFS se ghoomna** hai — jahan raasta galat dikhe wahin kaat do.

```
Subsets of [1, 2, 3]  (har node = ek subset, "aage ke elements mein se hi chuno")

                    [ ]
          ┌──────────┼──────────┐
         [1]        [2]        [3]
        ┌──┴──┐       │
     [1,2]  [1,3]   [2,3]
        │
    [1,2,3]

8 nodes = 2³ subsets ✅
```

## Template — Choose, Explore, Un-choose (sab problems isi se banti hain)

```
void backtrack(state):
    if (goal ho gaya):                    # answer mil gaya
        answer mein save karo (COPY!)
        return

    for (har possible choice):
        if (choice valid nahi):  continue    # ⭐ PRUNE — galat raaste ko shuru mein hi kaato
        choice KARO              # CHOOSE      (state mein jodo)
        backtrack(agla state)    # EXPLORE     (aage badho)
        choice UNDO karo         # UN-CHOOSE   (state wapas pehle jaisi — BACKTRACK)
```

**Sabse zaroori line**: *UN-CHOOSE.* Agar undo nahi kiya toh agli choice ko purani choice ka kachra mil jayega.

## Backtracking vs baaki

| | Kaise kaam karta hai |
|---|---|
| **Brute force** | Saare combinations pehle bana lo, phir check karo |
| **Backtracking** | Step-by-step banao, **galat lagte hi ruk jao** (prune) — brute force ka smart roop |
| **DP** | Jab **wahi subproblems baar-baar** aayein toh answer store karo. Backtracking mein har path alag hota hai (repeat nahi) |

## Code example 1 — Subsets aur Subsets II (duplicates ke saath)

```java
// Subsets — "start index": sirf AAGE ke elements mein se chuno, taaki [1,2] aur [2,1] dono na bane
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));          // 🔑 tree ka har node ek valid subset hai — COPY save karo
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);                       // CHOOSE
        backtrack(nums, i + 1, current, result);    // EXPLORE (i + 1: is element ko dobara nahi lenge)
        current.remove(current.size() - 1);         // UN-CHOOSE
    }
}

// Subsets II — nums mein DUPLICATES hain, par duplicate subsets nahi chahiye
public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);                              // 🔑 pehle sort: barabar values paas-paas aa jati hain
    List<List<Integer>> result = new ArrayList<>();
    dfs(nums, 0, new ArrayList<>(), result);
    return result;
}

private void dfs(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;   // 🔑 isi level pe ye value pehle try ho chuki → skip
        current.add(nums[i]);
        dfs(nums, i + 1, current, result);
        current.remove(current.size() - 1);
    }
}
```

**Duplicates ka trick samjho** — `nums = [1, 2, 2]` (sorted):

```
Root level pe i = 1 (pehla 2) aur i = 2 (doosra 2) dono ko choose karte toh [2] DO baar banta.
   i = 1 → choose 2 → subtree se [2], [2,2] bante hain
   i = 2 → nums[2] == nums[1] aur i > start  →  SKIP  ✅ (wahi subtree dobara nahi)

Par andar ke level pe [2, 2] banta hai: wahan start = 2 hai, toh i > start false → doosra 2 allowed.
Rule: "Ek hi level (loop) mein same value do baar mat lo, par gehrai mein alag-alag level pe le sakte ho."
```

## Code example 2 — Permutations (saari arrangements)

Yahan **order matter** karta hai (`[1,2]` ≠ `[2,1]`), isliye har baar **0 se shuru** karte hain aur `used[]` se dekhte hain kaun pehle se le liya:

```
Permutations of [1, 2, 3]

                    [ ]
        ┌───────────┼───────────┐
       [1]         [2]         [3]
      ┌─┴─┐       ┌─┴─┐       ┌─┴─┐
   [1,2] [1,3]  [2,1] [2,3]  [3,1] [3,2]
     │     │      │     │      │     │
 [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]      ← 3! = 6 answers
```

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    permute(nums, new boolean[nums.length], new ArrayList<>(), result);
    return result;
}

private void permute(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
    if (current.size() == nums.length) {              // saari jagah bhar gayi
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;                         // 🔑 jo pehle se use ho chuka, dobara nahi
        used[i] = true;                                // CHOOSE
        current.add(nums[i]);
        permute(nums, used, current, result);          // EXPLORE
        current.remove(current.size() - 1);            // UN-CHOOSE
        used[i] = false;
    }
}
```

**Subsets vs Permutations yaad rakho**: Subsets/Combinations mein `for` loop **`start` se** chalta hai (aage hi dekho). Permutations mein **0 se** chalta hai + `used[]`.

## Code example 3 — Combinations aur Combination Sum

```java
// Combinations: 1..n mein se k numbers chuno
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> result = new ArrayList<>();
    pick(n, k, 1, new ArrayList<>(), result);
    return result;
}

private void pick(int n, int k, int start, List<Integer> current, List<List<Integer>> result) {
    if (current.size() == k) {
        result.add(new ArrayList<>(current));
        return;
    }
    // 🔑 PRUNE: bache (k - size) numbers ke liye [i..n] mein kam se kam utne numbers hone chahiye → i <= n - (k - size) + 1
    for (int i = start; i <= n - (k - current.size()) + 1; i++) {
        current.add(i);
        pick(n, k, i + 1, current, result);
        current.remove(current.size() - 1);
    }
}

// Combination Sum: distinct candidates, har number KITNI BHI baar; sum = target
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);                            // sort → chhote pehle, pruning aasan
    List<List<Integer>> result = new ArrayList<>();
    sum(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

private void sum(int[] c, int remaining, int start, List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = start; i < c.length; i++) {
        if (c[i] > remaining) break;                    // 🔑 sorted hai → aage ke sab bhi bade → loop hi rok do
        current.add(c[i]);
        sum(c, remaining - c[i], i, current, result);   // i (i + 1 nahi): SAME number dobara use ho sakta hai
        current.remove(current.size() - 1);
    }
}
```

**Line by line samjho**: `remaining` = target mein abhi kitna bacha. `c[i] > remaining` pe `break` ek **prune** hai — chhota-pehle sort ki wajah se aage ke sab bade honge. `i` pass karna (na ki `i + 1`) matlab **reuse allowed**. Pattern-style notes: [Backtracking pattern](../../01-patterns/13-backtracking.md).

## Code example 4 — N-Queens (constraint wali problem)

`n × n` board pe `n` queens aise rakho ki **koi ek-doosre ko attack na kare** (same row, column, ya diagonal).

**Soch**: *Har row mein ek hi queen hogi*, toh **row-by-row** decide karo — sirf **column chunna** hai. Pehle se rakhi queens se **column ya diagonal clash** ho toh us column ko **PRUNE**.

```
n = 4 ka ek solution:

 col:  0 1 2 3
row 0: . Q . .       queenCol[0] = 1
row 1: . . . Q       queenCol[1] = 3
row 2: Q . . .       queenCol[2] = 0
row 3: . . Q .       queenCol[3] = 2

Diagonal pehchaan (trick):   "/" diagonal pe  row + col  same rehta hai
                             "\" diagonal pe  row − col  same rehta hai
```

```java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    place(0, n, new int[n], new boolean[n], new boolean[2 * n], new boolean[2 * n], result);
    return result;
}

// cols[c]: column c mein queen hai | diag[r + c]: "/" diagonal | anti[r - c + n]: "\" diagonal
private void place(int row, int n, int[] queenCol, boolean[] cols, boolean[] diag, boolean[] anti,
                   List<List<String>> result) {
    if (row == n) {                                   // saari rows mein queen rakh di → ek solution
        result.add(draw(queenCol, n));
        return;
    }
    for (int col = 0; col < n; col++) {
        if (cols[col] || diag[row + col] || anti[row - col + n]) continue;   // 🔑 PRUNE: pehle wali queen attack karegi
        queenCol[row] = col;
        cols[col] = diag[row + col] = anti[row - col + n] = true;             // CHOOSE
        place(row + 1, n, queenCol, cols, diag, anti, result);                // EXPLORE
        cols[col] = diag[row + col] = anti[row - col + n] = false;            // UN-CHOOSE
    }
}

private List<String> draw(int[] queenCol, int n) {
    List<String> board = new ArrayList<>();
    for (int r = 0; r < n; r++) {
        char[] line = new char[n];
        Arrays.fill(line, '.');
        line[queenCol[r]] = 'Q';
        board.add(new String(line));
    }
    return board;
}
```

**Line by line samjho**: Clash dhundhne ke liye poora board scan karne ki jagah **3 boolean arrays** rakhe (column, "/" diagonal, "\" diagonal) — har check **O(1)**. `n` = 8 pe sirf 92 solutions hain aur pruning ki wajah se search 8⁸ (~1.6 crore) ki jagah bahut kam raasto tak simit rehta hai.

## Code example 5 — Generate Parentheses aur Word Search

**Generate Parentheses**: `n` jodi ke saare **valid** brackets. **Constraint rules** (prune): `'('` tabhi lagao jab abhi `n` se kam khule hon; `')'` tabhi jab koi khula bracket **band hone ko baaki** ho.

```
n = 2:            ""
                   │  '('  (open < 2)
                  "("
          ┌────────┴────────┐
        "(("               "()"          ← ')' allowed kyunki close < open
          │ ')'               │ '('
        "(()"              "()("
          │ ')'               │ ')'
        "(())" ✅           "()()" ✅

Jaise "))(" jaisi galat shaakhein banti hi nahi — pehle hi PRUNE ho gayi.
```

```java
public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    build(n, 0, 0, new StringBuilder(), result);
    return result;
}

private void build(int n, int open, int close, StringBuilder sb, List<String> result) {
    if (sb.length() == 2 * n) {
        result.add(sb.toString());
        return;
    }
    if (open < n) {                                  // 🔑 '(' tabhi jab abhi n se kam khule hain
        sb.append('(');                              // CHOOSE
        build(n, open + 1, close, sb, result);       // EXPLORE
        sb.deleteCharAt(sb.length() - 1);            // UN-CHOOSE
    }
    if (close < open) {                              // ')' tabhi jab koi khula bracket baaki ho
        sb.append(')');
        build(n, open, close + 1, sb, result);
        sb.deleteCharAt(sb.length() - 1);
    }
}
```

**Word Search** — grid mein word ek-ek akshar paas-paas ke cells jodke ban sakta hai kya (ek cell ek baar):

```java
public boolean exist(char[][] board, String word) {
    for (int r = 0; r < board.length; r++) {
        for (int c = 0; c < board[0].length; c++) {
            if (search(board, word, 0, r, c)) return true;     // har cell se shuru karke dekho
        }
    }
    return false;
}

private boolean search(char[][] board, String word, int i, int r, int c) {
    if (i == word.length()) return true;                        // saare akshar mil gaye
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length || board[r][c] != word.charAt(i)) {
        return false;                                           // bahar nikle ya akshar match nahi
    }
    char saved = board[r][c];
    board[r][c] = '#';                                          // CHOOSE: is cell ko "visited" mark karo
    boolean found = search(board, word, i + 1, r + 1, c)        // EXPLORE: 4 directions
                 || search(board, word, i + 1, r - 1, c)
                 || search(board, word, i + 1, r, c + 1)
                 || search(board, word, i + 1, r, c - 1);
    board[r][c] = saved;                                        // 🔑 UN-CHOOSE: cell wapas free
    return found;
}
```

## Time complexity — exponential, isliye `n` chhota

| Problem | Answers ki sankhya | Time (lagbhag) |
|---|---|---|
| Subsets | 2ⁿ | O(n · 2ⁿ) — har subset copy karne mein O(n) |
| Permutations | n! | O(n · n!) |
| Combinations C(n, k) | n! / (k!(n−k)!) | O(k · C(n, k)) |
| N-Queens | Kam (n=8 → 92) | Pruning ki wajah se n! se bhi bahut kam |

Isliye constraints mein **`n ≤ 15–20`** dikhe toh backtracking/bitmask soch sakte ho. Badi `n` pe **DP** ya greedy chahiye.

## Backtracking kab lagana hai — pehchano

| Problem ka hint | Kaunsa roop |
|---|---|
| "Saare **subsets**" | Start index, har node answer |
| "Saari **arrangements / permutations**" | `used[]`, 0 se loop |
| "K elements chuno" / "sum = target" | Start index + prune |
| "**Valid arrangement**" (N-Queens, Sudoku) | Constraint check, row-by-row |
| Grid/string pe **path** | Visited mark + undo |

## Common galtiyan

- **UN-CHOOSE bhoolna** (`remove` / `used[i] = false` / visited restore) — sabse common bug.
- **`result.add(current)` (copy nahi)** — `current` baad mein badalti rehti hai, sab answers ek jaise ho jate hain. **`new ArrayList<>(current)`**.
- **`start` vs `0`** ka confusion — subsets/combinations mein `start`, permutations mein `0` + `used[]`.
- **Reuse allowed hai toh `i`, nahi toh `i + 1`** pass karna.
- **Duplicates ke liye sort + `i > start && same as previous → skip`** bhoolna.
- **Prune na karna** — code sahi hoga par TLE aayega.

> 💡 **Interview mein bolne wali line**: *"Ye ek decision tree hai; main DFS se choose–explore–unchoose karunga aur jaise hi partial solution invalid dikhe, us branch ko prune kar dunga. Worst case exponential hai, par pruning se practice mein bahut kam raaste dekhne padte hain."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Subsets | Medium | Start index, har node answer | [leetcode.com/problems/subsets](https://leetcode.com/problems/subsets/) |
| 2 | Permutations | Medium | `used[]` | [leetcode.com/problems/permutations](https://leetcode.com/problems/permutations/) |
| 3 | Combinations | Medium | Start index + prune | [leetcode.com/problems/combinations](https://leetcode.com/problems/combinations/) |
| 4 | Letter Combinations of a Phone Number | Medium | Har digit ke choices | [leetcode.com/problems/letter-combinations-of-a-phone-number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) |
| 5 | Generate Parentheses | Medium | Constraint se prune | [leetcode.com/problems/generate-parentheses](https://leetcode.com/problems/generate-parentheses/) |
| 6 | Combination Sum | Medium | Reuse allowed | [leetcode.com/problems/combination-sum](https://leetcode.com/problems/combination-sum/) |
| 7 | Subsets II | Medium | Duplicates skip | [leetcode.com/problems/subsets-ii](https://leetcode.com/problems/subsets-ii/) |
| 8 | Permutations II | Medium | Duplicates + `used[]` | [leetcode.com/problems/permutations-ii](https://leetcode.com/problems/permutations-ii/) |
| 9 | Combination Sum II | Medium | No reuse + duplicates | [leetcode.com/problems/combination-sum-ii](https://leetcode.com/problems/combination-sum-ii/) |
| 10 | Palindrome Partitioning | Medium | String cuts ka backtracking | [leetcode.com/problems/palindrome-partitioning](https://leetcode.com/problems/palindrome-partitioning/) |
| 11 | Word Search | Medium | Grid + visited undo | [leetcode.com/problems/word-search](https://leetcode.com/problems/word-search/) |
| 12 | N-Queens | Hard | Row-by-row + diagonals | [leetcode.com/problems/n-queens](https://leetcode.com/problems/n-queens/) |
| 13 | Sudoku Solver | Hard | Constraint sets + prune | [leetcode.com/problems/sudoku-solver](https://leetcode.com/problems/sudoku-solver/) |

Agla: [18-greedy.md](18-greedy.md)
