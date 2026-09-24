# 13. Backtracking

> Pehle ye aane chahiye: [Recursion](../00-syllabus/01-basics/09-recursion.md), [Backtracking (syllabus)](../00-syllabus/04-paradigms/17-backtracking.md), [DFS (pattern)](12-dfs.md)

> **Standard definition**: A refinement of brute-force search that incrementally builds candidates to a solution, and abandons ("backtracks" from) a candidate as soon as it determines it cannot lead to a valid solution.

**Ek line mein**: Ek **choice try karo**, aage badho — agar galat nikla ya dead-end aaya, **wapas aake (backtrack) usse undo karo** aur doosri choice try karo. Sab kuch ek hi shape: **Choose → Explore → Un-choose**.

**Trick yaad rakhne ki**: *"Pencil se maze solve karna"* — ek raasta try karo, agar dead-end aaye toh **pencil se mita do** (undo/backtrack) aur doosra raasta try karo. Pen se nahi likhte kyunki galti undo karni pad sakti hai.

```
                       []                 subsets of [1,2,3]  —  recursion TREE
          /            |            \      har node = ek "path" (abhi tak ke choices)
       [1]            [2]           [3]
      /    \            \
   [1,2]  [1,3]        [2,3]
     |
  [1,2,3]

Neeche jao = CHOOSE.  Wapas aao = UN-CHOOSE.  Har node pe (ya sirf leaf pe) answer ka COPY.
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ "Saare" subsets / permutations / combinations / arrangements / partitions GENERATE karne hain
✅ "Kya koi valid arrangement hai?" — bahut sare choices, galat wale pehle hi kaat sakte ho  (N-Queens, Sudoku)
✅ Constraint chhota hai:  n ≤ 15–20  (exponential chalega)
✅ Har step pe kuch options → choose → aage → undo
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**saare subsets / power set**" | ① **Subsets** |
| "**k numbers ka combination**" / "**sum = target wale combinations**" | ② **Combinations** |
| "**saare arrangements / permutations**" (order matter) | ③ **Permutations** |
| "string ko **todo** (palindrome/valid IP)" / "**phone digits → letters**" / "**brackets generate**" | ④ **Build / Partition** |
| "**board pe rakho** (N-Queens, Sudoku)" / "**grid mein word dhoondo**" | ⑤ **Constraint search** |

### ❌ Kab NAHI
- Sirf **count** / **min / max** chahiye aur subproblems repeat hote hain → [DP](19-dynamic-programming.md) (backtracking exponential hai).
- Kaam **greedy** se ho jata hai (locally best choice hi sahi) → [Greedy](14-greedy.md).
- n bahut bada (≥ 25) aur saare answers nahi maange → kuch aur socho.

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. STATE   →  aage kya track karun?   path (list)  +  start index  /  used[]  /  remaining  /  row
2. GOAL    →  kab answer SAVE karun?   path.size()==k  /  remaining==0  /  index==n  /  har node pe
3. CHOICES →  loop kispe?   i = start..n  (sirf aage)   /   i = 0..n with used[]   /   sirf 2 options
4. PRUNE   →  kab CONTINUE / BREAK?   remaining<0  /  invalid  /  duplicate  /  attack
5. UNDO    →  choose ke baad explore, phir bilkul ULTA karke undo
```

**Ek universal skeleton** (yehi baar-baar likhna hai):

```
backtrack(state):
    if goal(state):
        result.add( COPY of path )                # 🔑 copy!  path aage badalta rahega
        return
    for choice in choices(state):
        if not valid(choice): continue             # PRUNE
        apply(choice)                              # CHOOSE     path.add(x)
        backtrack(next state)                      # EXPLORE
        undo(choice)                               # UN-CHOOSE  path.remove(last)
```

**Teen ratta:**
1. **Copy** save karo: `new ArrayList<>(path)` — seedha `path` nahi.
2. **Undo hamesha** explore ke baad, **bilkul ulta**.
3. **Order matter?** Nahi → `start` index se sirf aage; Haan → `used[]` se saare unused.

### `start` ya `used[]`? — sabse zaroori faisla

```
ORDER MATTER NAHI   ([1,2] aur [2,1] SAME)         ORDER MATTER  ([1,2] aur [2,1] ALAG)
   Subsets, Combinations                              Permutations
   loop:  i = start .. n−1                            loop:  i = 0 .. n−1,  skip if used[i]
   recurse(i + 1)   ← sirf aage dekho                 recurse(...) with used[i] = true
   (i wapas nahi jaata → dohrao nahi)                 (koi bhi unused pehle aa sakta hai)
```

**Element dobara use kar sakte ho?** (Combination Sum) → `recurse(i)`; nahi → `recurse(i + 1)`.

**Input mein duplicates?** → **sort** karo, aur same level pe **same value skip**:
```
Subsets/Combinations :   if (i > start && nums[i] == nums[i-1]) continue;
Permutations         :   if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;
```

---

## 3. ① Subsets — include/exclude, har node ek answer

**Idea**: Har node pe **path ka copy save** karo (har path ek valid subset hai), phir `i = start..` se ek-ek element jodke aage badho.

```
nums = [1,2,3]:   [] → [1] → [1,2] → [1,2,3]     (har step pe save)
                       ↘ [1,3]
                  [] → [2] → [2,3]
                  [] → [3]                        total 2ⁿ = 8

Duplicates [1,2,2] (sorted):  loop level pe  i=1 → 2 ✓   i=2 → 2 ✗ (nums[2]==nums[1], i > start) skip
                              lekin [2,2] chahiye → wo NEECHE level pe milta hai (start=2, i == start → allowed)
```

```java
// Subsets — distinct numbers
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    build(nums, 0, new ArrayList<>(), result);
    return result;
}

private void build(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
    result.add(new ArrayList<>(path));                          // 🔑 har node ek answer (copy)
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                                      // CHOOSE
        build(nums, i + 1, path, result);                       // EXPLORE (i + 1: sirf aage)
        path.remove(path.size() - 1);                           // UN-CHOOSE
    }
}

// Subsets II — duplicates ho sakte hain
public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);                                          // 🔑 duplicates paas-paas laao
    List<List<Integer>> result = new ArrayList<>();
    buildDup(nums, 0, new ArrayList<>(), result);
    return result;
}

private void buildDup(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
    result.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;      // 🔑 same level pe same value dobara nahi
        path.add(nums[i]);
        buildDup(nums, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}
```

**`i > start` kyun (`i > 0` nahi)?** `i == start` ka matlab is level ka **pehla** choice — wahan duplicate bhi chalega (`[2,2]` ka doosra 2 gehre level pe `start` hi hota hai). Sirf **bhai-behen (same level)** repeat skip hote hain.

---

## 4. ② Combinations — k numbers ya target sum

**Idea**: Subsets jaisa hi `start` loop, bas **goal** alag: `size == k` ya `remaining == 0`.

| Sawaal | Goal | Recurse index | Extra |
|---|---|---|---|
| Combinations `C(n, k)` | `path.size() == k` | `i + 1` | loop ka upper bound prune |
| Combination Sum (reuse, distinct) | `remaining == 0` | **`i`** (reuse) | sort + `break` jab `nums[i] > remaining` |
| Combination Sum II (no reuse, dups) | `remaining == 0` | `i + 1` | sort + **dup skip** |
| Combination Sum III (1..9, k numbers) | `size == k` **aur** `remaining == 0` | `i + 1` | `i > remaining` pe break |

```
Combination Sum  candidates=[2,3,5], target=8   (reuse allowed → recurse(i))

[] rem=8 → [2] rem=6 → [2,2] rem=4 → [2,2,2] rem=2 → [2,2,2,2] rem=0 ✓ save
                                                      → [2,2,2,3] rem<0 ✗ (break: sorted)
                             → [2,3] rem=3 → [2,3,3] rem=0 ✓
                     → [3] → [3,5] rem=0 ✓                        answer: [2,2,2,2],[2,3,3],[3,5]
```

```java
// Combinations — 1..n mein se k numbers
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> result = new ArrayList<>();
    pick(n, k, 1, new ArrayList<>(), result);
    return result;
}

private void pick(int n, int k, int start, List<Integer> path, List<List<Integer>> result) {
    if (path.size() == k) { result.add(new ArrayList<>(path)); return; }
    for (int i = start; i <= n - (k - path.size()) + 1; i++) {   // 🔑 prune: bache numbers kam pade toh loop hi mat chalao
        path.add(i);
        pick(n, k, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}

// Combination Sum — distinct candidates, har number kitni bhi baar
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> result = new ArrayList<>();
    sum(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

private void sum(int[] nums, int remaining, int start, List<Integer> path, List<List<Integer>> result) {
    if (remaining == 0) { result.add(new ArrayList<>(path)); return; }
    for (int i = start; i < nums.length; i++) {
        if (nums[i] > remaining) break;                            // 🔑 sorted hai → aage sab bade, loop tod do
        path.add(nums[i]);
        sum(nums, remaining - nums[i], i, path, result);           // 🔑 i (i + 1 nahi) → same number dobara
        path.remove(path.size() - 1);
    }
}

// Combination Sum II — duplicates hain, har number EK baar
public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> result = new ArrayList<>();
    sumOnce(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

private void sumOnce(int[] nums, int remaining, int start, List<Integer> path, List<List<Integer>> result) {
    if (remaining == 0) { result.add(new ArrayList<>(path)); return; }
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;          // 🔑 same level dup skip
        if (nums[i] > remaining) break;
        path.add(nums[i]);
        sumOnce(nums, remaining - nums[i], i + 1, path, result);    // 🔑 i + 1 → ek baar hi
        path.remove(path.size() - 1);
    }
}

// Combination Sum III — 1..9 mein se k numbers jinka sum n
public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> result = new ArrayList<>();
    sumK(k, n, 1, new ArrayList<>(), result);
    return result;
}

private void sumK(int k, int remaining, int start, List<Integer> path, List<List<Integer>> result) {
    if (path.size() == k) {
        if (remaining == 0) result.add(new ArrayList<>(path));      // dono shart: k numbers aur sum
        return;
    }
    for (int i = start; i <= 9; i++) {
        if (i > remaining) break;
        path.add(i);
        sumK(k, remaining - i, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}
```

---

## 5. ③ Permutations — saare arrangements (`used[]`)

**Idea**: Har position pe **koi bhi abhi tak na use hua element** aa sakta hai. Isliye loop **0 se**, aur `used[]` se bhare hue ko skip. Goal: `path.size() == n`.

```
nums = [1,2,3]                          3! = 6 leaves

         []
    /     |     \
  [1]    [2]    [3]                    used[] mark → recurse → used[] unmark
  / \    / \    / \
[1,2][1,3][2,1][2,3][3,1][3,2]   →  [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]

Duplicates [1,1,2] (sorted):  loop mein i=1 pe  nums[1]==nums[0]  aur  !used[0]  → skip
   ("pehla 1 abhi use nahi hua toh doosra 1 pehle nahi aa sakta" — tabhi ek hi order ginega)
```

```java
// Permutations — distinct numbers
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    arrange(nums, new boolean[nums.length], new ArrayList<>(), result);
    return result;
}

private void arrange(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
    if (path.size() == nums.length) { result.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {                       // 🔑 0 se (start nahi) — order matter
        if (used[i]) continue;
        used[i] = true;                                           // CHOOSE
        path.add(nums[i]);
        arrange(nums, used, path, result);                        // EXPLORE
        path.remove(path.size() - 1);                             // UN-CHOOSE
        used[i] = false;                                          // 🔑 used bhi wapas false
    }
}

// Permutations II — duplicates ho sakte hain
public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);                                            // 🔑 sort
    List<List<Integer>> result = new ArrayList<>();
    arrangeUnique(nums, new boolean[nums.length], new ArrayList<>(), result);
    return result;
}

private void arrangeUnique(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
    if (path.size() == nums.length) { result.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;   // 🔑 dup: pehla wala pehle use hona chahiye
        used[i] = true;
        path.add(nums[i]);
        arrangeUnique(nums, used, path, result);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}
```

---

## 6. ④ Build / Partition — string ko banao ya todo

**Idea**: Har **level = ek decision** (kaunsa digit ka letter / kahan cut / `(` ya `)`). Answer tab jab **poori string** bani / kat gayi. Yahan **prune = validity**.

```
Letter Combinations "23":  level 0 → digit 2 → a,b,c    level 1 → digit 3 → d,e,f     →  9 strings (ad, ae, af, bd, ...)

Palindrome Partitioning "aab":  cut kahan?  "a" | "a" | "b"      "aa" | "b"      ("ab" palindrome nahi → prune)

Generate Parentheses n=2:  '(' tab lagao jab open < n      ')' tab lagao jab close < open     →  (()), ()()

Restore IP "25525511135":  4 parts, har part 1–3 digits, 0..255, leading zero nahi
```

```java
// Letter Combinations of a Phone Number — har level pe ek digit
private static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

public List<String> letterCombinations(String digits) {
    List<String> result = new ArrayList<>();
    if (digits.isEmpty()) return result;
    fill(digits, 0, new StringBuilder(), result);
    return result;
}

private void fill(String digits, int idx, StringBuilder sb, List<String> result) {
    if (idx == digits.length()) { result.add(sb.toString()); return; }
    for (char ch : KEYS[digits.charAt(idx) - '0'].toCharArray()) {
        sb.append(ch);                                             // CHOOSE
        fill(digits, idx + 1, sb, result);                         // EXPLORE (agla digit)
        sb.deleteCharAt(sb.length() - 1);                          // UN-CHOOSE
    }
}

// Palindrome Partitioning — saare tarike jisme har tukda palindrome
public List<List<String>> partition(String s) {
    List<List<String>> result = new ArrayList<>();
    cut(s, 0, new ArrayList<>(), result);
    return result;
}

private void cut(String s, int start, List<String> path, List<List<String>> result) {
    if (start == s.length()) { result.add(new ArrayList<>(path)); return; }
    for (int end = start + 1; end <= s.length(); end++) {
        if (!isPalindrome(s, start, end - 1)) continue;            // 🔑 prune: pehla tukda valid ho tabhi aage
        path.add(s.substring(start, end));
        cut(s, end, path, result);
        path.remove(path.size() - 1);
    }
}

private boolean isPalindrome(String s, int lo, int hi) {
    while (lo < hi) {
        if (s.charAt(lo++) != s.charAt(hi--)) return false;
    }
    return true;
}

// Restore IP Addresses
public List<String> restoreIpAddresses(String s) {
    List<String> result = new ArrayList<>();
    ip(s, 0, new ArrayList<>(), result);
    return result;
}

private void ip(String s, int start, List<String> parts, List<String> result) {
    if (parts.size() == 4) {
        if (start == s.length()) result.add(String.join(".", parts));   // 4 parts aur poori string use hui
        return;
    }
    for (int len = 1; len <= 3 && start + len <= s.length(); len++) {
        String part = s.substring(start, start + len);
        if (part.length() > 1 && part.charAt(0) == '0') break;          // 🔑 leading zero → aage bhi sab galat
        if (Integer.parseInt(part) > 255) break;
        parts.add(part);
        ip(s, start + len, parts, result);
        parts.remove(parts.size() - 1);
    }
}

// Generate Parentheses — rules se hi galat string banne hi nahi dete
public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    gen(n, 0, 0, new StringBuilder(), result);
    return result;
}

private void gen(int n, int open, int close, StringBuilder sb, List<String> result) {
    if (sb.length() == 2 * n) { result.add(sb.toString()); return; }
    if (open < n) {
        sb.append('(');
        gen(n, open + 1, close, sb, result);
        sb.deleteCharAt(sb.length() - 1);
    }
    if (close < open) {                                             // 🔑 ')' kabhi '(' se zyada nahi
        sb.append(')');
        gen(n, open, close + 1, sb, result);
        sb.deleteCharAt(sb.length() - 1);
    }
}
```

**Yaad**: `StringBuilder` mein un-choose = `deleteCharAt(last)`. Agar `String` pass karo (`cur + ch`) toh un-choose ki zaroorat nahi (naya string banta hai) — par thoda slow.

---

## 7. ⑤ Constraint Search — board pe rakhna, grid mein path

**Idea**: Har step pe **kai jagah** try, **constraint todne wale ko turant reject** (prune). Do tarah ke goals:

```
SAARE solutions chahiye  (N-Queens list)   → goal pe save, phir aage bhi try karte raho, return void
EK solution chahiye     (Sudoku, Word Search) → mil gaya toh TURANT true return, undo mat karo (ya mila toh ruk jao)
                                                 kisi option se nahi hua → false return (caller undo karega)
```

```
N-Queens n=4 :  row-by-row ek queen; column, "/" diagonal (row+col), "\" diagonal (row−col) — teeno O(1) check
                  cols[c]   diag[row + c]   anti[row − c + n]

  . Q . .        row0: col1     row1: col3     row2: col0     row3: col2      (ek solution)
  . . . Q
  Q . . .
  . . Q .

Word Search:  visited cell ko '#' bana do (CHOOSE), 4 direction try, wapas original (UN-CHOOSE)
```

```java
// N-Queens — saare solutions
public List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    place(n, 0, new int[n], new boolean[n], new boolean[2 * n], new boolean[2 * n], result);
    return result;
}

private void place(int n, int row, int[] queenCol, boolean[] cols, boolean[] diag, boolean[] anti,
                   List<List<String>> result) {
    if (row == n) { result.add(draw(queenCol)); return; }
    for (int c = 0; c < n; c++) {
        if (cols[c] || diag[row + c] || anti[row - c + n]) continue;   // 🔑 O(1) attack check
        cols[c] = diag[row + c] = anti[row - c + n] = true;             // CHOOSE
        queenCol[row] = c;
        place(n, row + 1, queenCol, cols, diag, anti, result);          // EXPLORE (agli row)
        cols[c] = diag[row + c] = anti[row - c + n] = false;            // UN-CHOOSE
    }
}

private List<String> draw(int[] queenCol) {
    int n = queenCol.length;
    List<String> board = new ArrayList<>();
    for (int r = 0; r < n; r++) {
        char[] line = new char[n];
        Arrays.fill(line, '.');
        line[queenCol[r]] = 'Q';
        board.add(new String(line));
    }
    return board;
}

// Word Search — grid mein path (har cell ek baar)
public boolean exist(char[][] board, String word) {
    for (int r = 0; r < board.length; r++) {
        for (int c = 0; c < board[0].length; c++) {
            if (search(board, word, 0, r, c)) return true;
        }
    }
    return false;
}

private boolean search(char[][] b, String word, int idx, int r, int c) {
    if (idx == word.length()) return true;                               // saare akshar mil gaye
    if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != word.charAt(idx)) return false;
    char saved = b[r][c];
    b[r][c] = '#';                                                       // CHOOSE: is path mein dobara nahi
    boolean found = search(b, word, idx + 1, r + 1, c) || search(b, word, idx + 1, r - 1, c)
                 || search(b, word, idx + 1, r, c + 1) || search(b, word, idx + 1, r, c - 1);
    b[r][c] = saved;                                                     // UN-CHOOSE (mil bhi gaya ho tab bhi restore)
    return found;
}

// Sudoku Solver — EK solution: mil gaya toh true
public void solveSudoku(char[][] board) {
    fillNext(board);
}

private boolean fillNext(char[][] b) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (b[r][c] != '.') continue;
            for (char d = '1'; d <= '9'; d++) {
                if (!canPlace(b, r, c, d)) continue;                     // 🔑 prune
                b[r][c] = d;                                             // CHOOSE
                if (fillNext(b)) return true;                            // 🔑 solution mila → turant upar bhejo
                b[r][c] = '.';                                           // UN-CHOOSE
            }
            return false;                                                // 🔑 koi digit nahi chala → peeche jao
        }
    }
    return true;                                                         // koi '.' bacha hi nahi = solved
}

private boolean canPlace(char[][] b, int r, int c, char d) {
    for (int i = 0; i < 9; i++) {
        if (b[r][i] == d || b[i][c] == d) return false;                  // row, column
        if (b[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == d) return false;   // 3×3 box
    }
    return true;
}
```

---

## 8. Sab ek nazar mein

| Variation | Loop | Recurse | Goal (save) | Prune |
|---|---|---|---|---|
| ① Subsets | `i = start..n` | `i + 1` | **har node** | dup: `i > start && same` |
| ② Combinations | `i = start..` | `i` (reuse) / `i + 1` | `size == k` / `remaining == 0` | `remaining < 0` → `break` (sorted) |
| ③ Permutations | `i = 0..n`, `used[]` | (`used` mark) | `size == n` | dup: `!used[i-1]` |
| ④ Build / Partition | ek level = ek decision | `idx + 1` / `end` | poori string ban gayi | validity (palindrome / `close < open`) |
| ⑤ Constraint | row-by-row / cell-by-cell | agli row / cell | `row == n` / `true` | O(1) attack / `canPlace` |

**Time**: subsets `O(n · 2ⁿ)`, permutations `O(n · n!)`, baaki bhi exponential — **prune** hi asli speed-up hai.

## Common galtiyan

- **Copy na karna** — `result.add(path)` → aakhir mein sab khaali. `new ArrayList<>(path)`.
- **Un-choose bhoolna** (ya `used[i]` false na karna) → agle raaste pe purana kachra.
- **`i` vs `i + 1`** — reuse allowed ho tabhi `i`.
- **Duplicates mein sort bhoolna**, ya `i > 0` likhna jahan `i > start` chahiye (subsets/combos) — kuch valid answers kat jate hain.
- **Permutations mein `start` use karna** — order matter karta hai, `used[]` + loop 0 se.
- **`path.remove(int)` vs `remove(Object)`** — `List<Integer>` pe `remove(path.size() - 1)` **index** hai (sahi). Value hatani ho toh `Integer.valueOf`.
- **Prune na karna** — `remaining < 0` pe `break`, bounds pe cut; warna TLE.
- **Ek solution wale sawaal mein `boolean` return** na karna — solution milne ke baad bhi search chalti rehti hai (aur board undo ho jata hai).

> 💡 **Interview mein bolne wali line**: *"Yahan saare valid combinations generate karne hain, toh backtracking: har step pe ek choice karke recursion, aur wapas aake undo. Duplicates ko sort + same-level skip se, aur invalid branches ko pehle hi prune karke kaat dunga. Time exponential — O(n · 2ⁿ) subsets ke liye, O(n · n!) permutations ke liye."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Subsets | ① Subsets | Medium | [leetcode.com/problems/subsets](https://leetcode.com/problems/subsets/) |
| 2 | Subsets II | ① Subsets (dups) | Medium | [leetcode.com/problems/subsets-ii](https://leetcode.com/problems/subsets-ii/) |
| 3 | Letter Case Permutation | ① Include/exclude | Medium | [leetcode.com/problems/letter-case-permutation](https://leetcode.com/problems/letter-case-permutation/) |
| 4 | Combinations | ② Combinations | Medium | [leetcode.com/problems/combinations](https://leetcode.com/problems/combinations/) |
| 5 | Combination Sum | ② Reuse | Medium | [leetcode.com/problems/combination-sum](https://leetcode.com/problems/combination-sum/) |
| 6 | Combination Sum II | ② Dups, no reuse | Medium | [leetcode.com/problems/combination-sum-ii](https://leetcode.com/problems/combination-sum-ii/) |
| 7 | Combination Sum III | ② k numbers | Medium | [leetcode.com/problems/combination-sum-iii](https://leetcode.com/problems/combination-sum-iii/) |
| 8 | Permutations | ③ Permutations | Medium | [leetcode.com/problems/permutations](https://leetcode.com/problems/permutations/) |
| 9 | Permutations II | ③ Dups | Medium | [leetcode.com/problems/permutations-ii](https://leetcode.com/problems/permutations-ii/) |
| 10 | Letter Combinations of a Phone Number | ④ Build | Medium | [leetcode.com/problems/letter-combinations-of-a-phone-number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) |
| 11 | Generate Parentheses | ④ Build | Medium | [leetcode.com/problems/generate-parentheses](https://leetcode.com/problems/generate-parentheses/) |
| 12 | Palindrome Partitioning | ④ Partition | Medium | [leetcode.com/problems/palindrome-partitioning](https://leetcode.com/problems/palindrome-partitioning/) |
| 13 | Restore IP Addresses | ④ Partition | Medium | [leetcode.com/problems/restore-ip-addresses](https://leetcode.com/problems/restore-ip-addresses/) |
| 14 | Word Search | ⑤ Constraint (grid) | Medium | [leetcode.com/problems/word-search](https://leetcode.com/problems/word-search/) |
| 15 | N-Queens | ⑤ Constraint | Hard | [leetcode.com/problems/n-queens](https://leetcode.com/problems/n-queens/) |
| 16 | Sudoku Solver | ⑤ Constraint (ek solution) | Hard | [leetcode.com/problems/sudoku-solver](https://leetcode.com/problems/sudoku-solver/) |
| 17 | Word Search II | ⑤ + [Trie](18-trie.md) | Hard | [leetcode.com/problems/word-search-ii](https://leetcode.com/problems/word-search-ii/) |

**Kaise practice karein**: Har problem pe pehle likho — *"State kya? Answer kab save? Loop kispe (start ya used)? Prune kab? Undo kya?"* — phir code.

Agla: [14-greedy.md](14-greedy.md)
