# 19. Dynamic Programming (DP)

> Pehle ye aane chahiye: [DP Basics (syllabus)](../00-syllabus/06-dynamic-programming/24-dp-basics.md), [Recursion](../00-syllabus/01-basics/09-recursion.md), [Backtracking (pattern)](13-backtracking.md)

> **Standard definition**: An optimization technique that solves a complex problem by breaking it into overlapping subproblems, solving each subproblem once, and storing (memoizing) its result to avoid redundant recomputation.

**Ek line mein**: Agar ek bada problem **chhote, overlapping subproblems** mein tootta hai (same subproblem baar-baar solve karna pad raha hai), uska answer **ek baar solve karke store** kar lo (memoize), dobara solve mat karo.

**Trick yaad rakhne ki**: *"Exam mein pichhle saal ke solved papers ka answer yaad rakhna"* — agar wahi sawaal dobara aaye, poora solve karne ki zarurat nahi, seedha yaad kiya hua jawab likh do. Yehi **memoization** hai.

**Trick pehchanne ki — DP hai ya nahi**: Khud se poocho — *"Kya isme overlapping subproblems hain (same chhota sawaal baar-baar solve ho raha hai)?"* aur *"Kya isme optimal substructure hai (bade problem ka best answer, chhote problems ke best answers se banta hai)?"* Dono "haan" hai toh DP hai.

```
fib(5)                            Bina DP:  fib(3) DO baar,  fib(2) TEEN baar ...  →  exponential
 ├─ fib(4)                        DP:       har fib(k) EK baar  →  yaad rakho (memo)  →  O(n)
 │   ├─ fib(3) ← repeat!
 │   └─ fib(2) ← repeat!
 └─ fib(3) ← repeat!
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ "Kitne tarike (ways)", "minimum / maximum", "kya possible hai?"  — aur har step pe CHOICE hai
✅ Brute-force recursion likh sakte ho aur usme SAME arguments baar-baar aate hain
✅ Greedy ka counterexample mil jata hai  (coins [1,3,4], target 6)
✅ Constraint moderate hai  (n, m ≤ 1000–5000)  — state ki ginti (n × m) chal jaye
```

| Sawaal ki bhasha | Family |
|---|---|
| "**climb**", "**lo ya chhodo (adjacent nahi)**", "**decode**", "kitne tarike" — array/number pe ek line | ① **1D linear** |
| "**grid** mein top-left → bottom-right", "**square**", "**triangle**" | ② **Grid** |
| "**do strings**: common subsequence, edit, match, interleave" | ③ **Two strings** |
| "**subset ka sum = target**", "**do barabar hisse**", "**+/− lagao**" | ④ **0/1 Knapsack** |
| "**coins (unlimited)**", "**min coins / kitne combinations**", "**words se string banao**" | ⑤ **Unbounded Knapsack** |
| "**longest increasing / chain / nested**" | ⑥ **LIS** |
| "**palindrome** substring/subsequence", "**range mein last kaun phoota / kaata**" | ⑦ **Interval / Palindrome** |
| "**buy/sell** cooldown, fee, k transactions" | ⑧ **State machine** |
| "**tree** pe choose node ya nahi (adjacent nahi)" | ⑨ **Tree DP** |

### ❌ Kab NAHI
- **Greedy** kaam karta hai (prove ho jaye) → [Greedy](14-greedy.md) — DP overkill.
- **Saare answers list** chahiye (sirf count/min/max nahi) → [Backtracking](13-backtracking.md).
- State ki ginti bahut badi (`n ≤ 10⁵` pe `n × m`) → koi aur idea (binary search, greedy).

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. STATE      →  dp[...] ka MATLAB kya?  (ek line mein likho: "dp[i] = ...")     ← sabse zaroori
2. TRANSITION →  dp[i] kin chhote states se banta hai?  (choices: lo/chhodo, match/mismatch, coin dalo)
3. BASE       →  sabse chhote states ka jawab kya?  (dp[0], khaali string, pehli row/column)
4. ORDER      →  kis order mein bharun taaki jo chahiye wo pehle bhar chuka ho?  (loop direction!)
5. ANSWER     →  final jawab kahan hai?  dp[n]  /  dp[m][n]  /  max(dp)  /  dp[target]
```

**Ek trick jo code aasan bana deti hai**: pehle **brute-force recursion** likho. Uske **arguments (jo badalte hain) hi DP ke dimensions** hain. Phir usme memo jodo, phir table bana lo.

```
brute:  f(i)  →  f(i+1), f(i+2)             1 argument   →  1D dp
brute:  f(r, c)                              2 arguments  →  2D dp
brute:  f(i, j)  (do strings ke index)       2 arguments  →  dp[i][j]
brute:  f(i, remaining)                      2 arguments  →  dp[i][target]   (knapsack)
```

### Recursion → Memo → Table (ek example — House Robber)

```java
// STEP 1 — brute recursion: f(i) = ghar i se aage ka max loot   (exponential)
public int robBrute(int[] nums, int i) {
    if (i >= nums.length) return 0;                                    // base
    return Math.max(robBrute(nums, i + 1),                             // ghar i chhodo
                    nums[i] + robBrute(nums, i + 2));                  // ghar i lo → agla i+2
}

// STEP 2 — memo (top-down): wahi code + "pehle se pata hai?" check    (O(n))
public int robMemo(int[] nums) {
    int[] memo = new int[nums.length];
    Arrays.fill(memo, -1);                                             // -1 = abhi solve nahi hua
    return robMemo(nums, 0, memo);
}

private int robMemo(int[] nums, int i, int[] memo) {
    if (i >= nums.length) return 0;
    if (memo[i] != -1) return memo[i];                                 // 🔑 pehle solve ho chuka → seedha lo
    memo[i] = Math.max(robMemo(nums, i + 1, memo), nums[i] + robMemo(nums, i + 2, memo));
    return memo[i];
}

// STEP 3 — table (bottom-up): recursion ka ulta, loop se (no stack overflow)
public int robTable(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n + 2];                                         // dp[i] = i se aage ka max;  dp[n] = dp[n+1] = 0
    for (int i = n - 1; i >= 0; i--) {
        dp[i] = Math.max(dp[i + 1], nums[i] + dp[i + 2]);
    }
    return dp[0];
}
```

| | Top-down (memo) | Bottom-up (table) |
|---|---|---|
| Kaise | recursion + `memo[]` | loop + `dp[]` |
| Fayda | brute se seedha, sirf zaroori states | no recursion overflow, space optimize aasan |
| Dhyan | recursion depth (n ~ 10⁵ pe overflow) | order (loop direction) sahi rakho |

**Space optimization**: agar `dp[i]` sirf pichhle 1–2 states pe depend karta hai → poori array ki jagah **do variables** (ya ek row).

---

## 3. ① 1D Linear — `dp[i]` pichhle 1–2 states se

**Idea**: `dp[i]` = "pehle `i` cheezon ka best / tarike". Transition: **lo ya chhodo** ya **pichhle 1–2 steps se aana**.

```
Climbing Stairs   dp[i] = dp[i−1] + dp[i−2]              1, 2, 3, 5, 8 ...
House Robber      dp[i] = max( dp[i−1],  dp[i−2] + nums[i] )
                        ↑ ghar i chhodo   ↑ ghar i lo (pichhla chhodna padega)
   nums = [2,7,9,3,1]:   dp = 2, 7, 11, 11, 12         →  12  (2 + 9 + 1)

Decode Ways "226":  dp[i] = (akela digit valid? dp[i−1]) + (do digit 10..26 valid? dp[i−2])
   dp[0]=1 (khaali)   "2"→1   "22"→ 2 (2|2, 22)   "226" → 3 (2|2|6, 22|6, 2|26)
```

```java
// Climbing Stairs — n steps, 1 ya 2 chadho
public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;                                          // dp[1], dp[2]
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;                                       // 🔑 (i−1) se 1 step ya (i−2) se 2 step
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

// House Robber — adjacent ghar nahi
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;                                          // dp[i−2], dp[i−1]
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x);                          // 🔑 chhodo ya lo
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

// House Robber II — gaanv gol hai (pehla aur aakhri adjacent)
public int robCircular(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    return Math.max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));   // 🔑 ya pehla nahi, ya aakhri nahi
}

private int robRange(int[] nums, int lo, int hi) {
    int prev2 = 0, prev1 = 0;
    for (int i = lo; i <= hi; i++) {
        int cur = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

// Min Cost Climbing Stairs — step 0 ya 1 se shuru, top = cost.length
public int minCostClimbingStairs(int[] cost) {
    int n = cost.length;
    int prev2 = 0, prev1 = 0;                                          // step 0 aur 1 pe khade hone ka cost 0
    for (int i = 2; i <= n; i++) {
        int cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);  // 1 step ya 2 step se aaye
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

// Decode Ways — "12" → AB ya L
public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];                                         // dp[i] = pehle i chars ko decode karne ke tarike
    dp[0] = 1;                                                         // khaali string = 1 tarika
    for (int i = 1; i <= n; i++) {
        if (s.charAt(i - 1) != '0') dp[i] += dp[i - 1];                // akela digit 1-9
        if (i >= 2) {
            int two = Integer.parseInt(s.substring(i - 2, i));
            if (two >= 10 && two <= 26) dp[i] += dp[i - 2];            // 🔑 do digit: 10..26 (06 nahi)
        }
    }
    return dp[n];
}
```

---

## 4. ② Grid DP — `dp[r][c]` upar aur left se

**Idea**: `dp[r][c]` = `(r, c)` tak pahunchne ke tarike / minimum cost. Transition sirf **upar** aur **left** (kyunki sirf right/down chal sakte hain). **Pehli row / column base** hai.

```
Unique Paths 3×3:       1 1 1        dp[r][c] = dp[r−1][c] + dp[r][c−1]
                        1 2 3        (pehli row/column = 1: ek hi raasta)
                        1 3 6   →  6

Minimum Path Sum:  dp[r][c] = grid[r][c] + min(dp[r−1][c], dp[r][c−1])

Maximal Square:    dp[r][c] = (r,c) pe KHATAM hone wale sabse bade square ki side
                   '1' ho toh  1 + min(upar, left, upar-left)         (teeno se chhota decide karta hai)
```

```java
// Unique Paths — m×n grid, sirf right/down. 1D array kaafi (ek row)
public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);                                                // pehli row: sab 1
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            dp[c] += dp[c - 1];                                        // 🔑 dp[c] (upar) + dp[c−1] (left)
        }
    }
    return dp[n - 1];
}

// Unique Paths II — obstacles (1)
public int uniquePathsWithObstacles(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = 1;                                                         // shuru ka ek tarika (obstacle ho toh neeche 0 ho jayega)
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) dp[c] = 0;                            // 🔑 obstacle pe koi raasta nahi
            else if (c > 0) dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}

// Minimum Path Sum
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) { dp[r][c] = grid[r][c]; continue; }
            int best = Integer.MAX_VALUE;
            if (r > 0) best = dp[r - 1][c];                            // upar se
            if (c > 0) best = Math.min(best, dp[r][c - 1]);            // left se
            dp[r][c] = grid[r][c] + best;
        }
    }
    return dp[m - 1][n - 1];
}

// Maximal Square — sabse bade all-'1' square ka area
public int maximalSquare(char[][] matrix) {
    int m = matrix.length, n = matrix[0].length, side = 0;
    int[][] dp = new int[m + 1][n + 1];                                // 1-indexed: pehli row/col 0 (padding)
    for (int r = 1; r <= m; r++) {
        for (int c = 1; c <= n; c++) {
            if (matrix[r - 1][c - 1] == '1') {
                dp[r][c] = 1 + Math.min(dp[r - 1][c], Math.min(dp[r][c - 1], dp[r - 1][c - 1]));   // 🔑 teeno mein sabse chhota
                side = Math.max(side, dp[r][c]);
            }
        }
    }
    return side * side;
}

// Triangle — upar se neeche minimum path sum (neeche se upar DP: ek array)
public int minimumTotal(List<List<Integer>> triangle) {
    int n = triangle.size();
    int[] dp = new int[n + 1];                                         // dp[c] = us cell se neeche tak ka min
    for (int r = n - 1; r >= 0; r--) {
        for (int c = 0; c <= r; c++) {
            dp[c] = triangle.get(r).get(c) + Math.min(dp[c], dp[c + 1]);   // 🔑 neeche wale do padosiyon mein chhota
        }
    }
    return dp[0];
}
```

---

## 5. ③ Two Strings — `dp[i][j]` = `a[0..i)` aur `b[0..j)`

**Idea**: `dp[i][j]` = pehli string ke pehle `i` aur doosri ke pehle `j` chars ka answer. Transition: **aakhri chars match** karte hain ya nahi. Row/column **0** = khaali string (base).

```
LCS("abcde", "ace"):            ""  a  c  e
   match → diagonal + 1    ""    0  0  0  0
   nahi  → max(upar, left) a     0  1  1  1
                            b     0  1  1  1
                            c     0  1  2  2
                            d     0  1  2  2
                            e     0  1  2  3      LCS = 3 ("ace")

Edit Distance:   match       →  dp[i−1][j−1]
                 mismatch    →  1 + min( dp[i−1][j−1] replace,  dp[i−1][j] delete,  dp[i][j−1] insert )
                 base:  dp[i][0] = i  (i delete)     dp[0][j] = j  (j insert)
```

```java
// Longest Common Subsequence
public int longestCommonSubsequence(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;    // 🔑 match → dono ko aage badhao
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);                        // ek ko chhodo
        }
    }
    return dp[m][n];
}

// Edit Distance — insert / delete / replace
public int minDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;                         // base: a ke i chars delete
    for (int j = 0; j <= n; j++) dp[0][j] = j;                         // base: b ke j chars insert
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));   // replace, delete, insert
        }
    }
    return dp[m][n];
}

// Distinct Subsequences — s ke kitne subsequences t ke barabar
public int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = 1;                         // 🔑 khaali t = 1 tarika (kuch mat chuno)
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i - 1][j];                                   // s[i−1] mat lo
            if (s.charAt(i - 1) == t.charAt(j - 1)) dp[i][j] += dp[i - 1][j - 1];   // ya lo (agar match)
        }
    }
    return dp[m][n];
}

// Interleaving String — s1 aur s2 ko mix karke s3 bana sakte hain (order bina badle)?
public boolean isInterleave(String s1, String s2, String s3) {
    int m = s1.length(), n = s2.length();
    if (m + n != s3.length()) return false;
    boolean[][] dp = new boolean[m + 1][n + 1];                        // dp[i][j] = s1[0..i) + s2[0..j) se s3[0..i+j) bana?
    dp[0][0] = true;
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i > 0 && dp[i - 1][j] && s1.charAt(i - 1) == s3.charAt(i + j - 1)) dp[i][j] = true;   // aakhri char s1 se
            if (j > 0 && dp[i][j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1)) dp[i][j] = true;   // ya s2 se
        }
    }
    return dp[m][n];
}
```

---

## 6. ④ 0/1 Knapsack — har cheez **ek baar**

**Idea**: Elements mein se **subset** chuno. `dp[s]` = kya sum `s` ban sakta hai (ya kitne tarike). Har element ke liye **sum ko bade se chhote (DESCENDING)** update karo taaki wo element **ek hi baar** use ho.

```
Partition Equal Subset Sum:   total ka aadha (target) ban sakta hai?
Target Sum (+/−):             P − N = target,  P + N = total   →   P = (total + target) / 2    →  subset-sum COUNT
Last Stone Weight II:         stones ko do group mein baanto, farak minimum  →  half tak ka sabse bada sum s   →  total − 2s

LOOP DIRECTION (sabse zaroori):
   nums = [2],  target 4
   descending (s = 4 → 2):  dp[4] |= dp[2] (abhi false) ✓  phir dp[2] |= dp[0]     →  dp[4] false ✓  (2 sirf ek baar)
   ascending  (s = 2 → 4):  dp[2] = true,  phir dp[4] |= dp[2] = true ✗           →  2 do baar use ho gaya
```

```java
// Partition Equal Subset Sum
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % 2 != 0) return false;                                  // odd → do barabar hisse nahi
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];                            // dp[s] = kya sum s ban sakta hai
    dp[0] = true;                                                      // 🔑 khaali subset = sum 0
    for (int x : nums) {
        for (int s = target; s >= x; s--) {                            // 🔑 DESCENDING → har number ek baar
            dp[s] = dp[s] || dp[s - x];
        }
    }
    return dp[target];
}

// Target Sum — har number ke aage + ya −, kitne tarike se total = target
public int findTargetSumWays(int[] nums, int target) {
    int total = 0;
    for (int x : nums) total += x;
    if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
    int want = (total + target) / 2;                                   // 🔑 "+" wale numbers ka sum = P
    int[] dp = new int[want + 1];
    dp[0] = 1;
    for (int x : nums) {
        for (int s = want; s >= x; s--) dp[s] += dp[s - x];            // count: lo (dp[s−x]) + chhodo (purana dp[s])
    }
    return dp[want];
}

// Last Stone Weight II — do group, farak minimum
public int lastStoneWeightII(int[] stones) {
    int total = 0;
    for (int x : stones) total += x;
    int half = total / 2;
    boolean[] dp = new boolean[half + 1];
    dp[0] = true;
    for (int x : stones) {
        for (int s = half; s >= x; s--) dp[s] |= dp[s - x];
    }
    for (int s = half; s >= 0; s--) {
        if (dp[s]) return total - 2 * s;                               // 🔑 ek group s, doosra total−s → farak total−2s
    }
    return 0;
}

// Ones and Zeroes — m zeros, n ones ke budget mein zyada se zyada strings (2D knapsack)
public int findMaxForm(String[] strs, int m, int n) {
    int[][] dp = new int[m + 1][n + 1];                                // dp[z][o] = z zeros, o ones ke budget mein max strings
    for (String str : strs) {
        int zeros = 0, ones = 0;
        for (char c : str.toCharArray()) {
            if (c == '0') zeros++;
            else ones++;
        }
        for (int z = m; z >= zeros; z--) {                             // dono dimension DESCENDING
            for (int o = n; o >= ones; o--) {
                dp[z][o] = Math.max(dp[z][o], dp[z - zeros][o - ones] + 1);
            }
        }
    }
    return dp[m][n];
}
```

---

## 7. ⑤ Unbounded Knapsack — har cheez **kitni bhi baar** (Coin Change)

**Idea**: `dp[a]` = amount `a` ke liye min coins / tarike. Coin **dobara use** ho sakta hai → loop **ASCENDING**.

```
Coin Change (min):        dp[a] = min( dp[a − c] + 1 )  har coin c pe        dp[0] = 0,  baaki ∞
Coin Change II (COMBOS):  OUTER coins,  INNER amount ↑     →  {1,2} aur {2,1} SAME ek hi gine jate hain
Combination Sum IV (PERMS): OUTER amount, INNER nums       →  (1,2) aur (2,1) ALAG

coins [1,2], amount 3:    combinations = 2  {1,1,1}, {1,2}          permutations = 3  (1,1,1), (1,2), (2,1)

Word Break:   dp[i] = kya s ke pehle i chars words se ban sakte hain?
              dp[i] = kisi j < i ke liye  (dp[j] true  AUR  s[j..i) dictionary mein)
```

```java
// Coin Change — minimum coins
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);                                       // "infinity" (amount+1 se zyada coin lag nahi sakte)
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);        // 🔑 ek coin c dalo
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

// Coin Change II — kitne COMBINATIONS (order nahi)
public int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;                                                         // amount 0 ke liye ek tarika (kuch mat lo)
    for (int c : coins) {                                              // 🔑 OUTER: coins → combinations
        for (int a = c; a <= amount; a++) dp[a] += dp[a - c];          // 🔑 INNER ascending → coin reuse
    }
    return dp[amount];
}

// Combination Sum IV — kitni PERMUTATIONS (order matter)
public int combinationSum4(int[] nums, int target) {
    int[] dp = new int[target + 1];
    dp[0] = 1;
    for (int a = 1; a <= target; a++) {                                // 🔑 OUTER: amount → orderings alag
        for (int x : nums) {
            if (x <= a) dp[a] += dp[a - x];
        }
    }
    return dp[target];
}

// Perfect Squares — n ko minimum perfect squares ke sum se
public int numSquares(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = Integer.MAX_VALUE;
        for (int sq = 1; sq * sq <= i; sq++) {
            dp[i] = Math.min(dp[i], dp[i - sq * sq] + 1);
        }
    }
    return dp[n];
}

// Word Break
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> words = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;                                                      // khaali string ban sakti hai
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && words.contains(s.substring(j, i))) {          // 🔑 pehle tak ban sakta hai + aakhri tukda word hai
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}
```

---

## 8. ⑥ LIS — Longest Increasing Subsequence

**Idea**: `dp[i]` = `nums[i]` pe **khatam** hone wali sabse lambi increasing subsequence. `dp[i] = 1 + max(dp[j])` jahan `j < i` aur `nums[j] < nums[i]`. **O(n²)**. Tez tareeka: **tails[]** + binary search → **O(n log n)**.

```
tails[k] = (k+1) length ki increasing subsequence ka SABSE CHHOTA aakhri element

nums = [10, 9, 2, 5, 3, 7, 101, 18]
  10 → [10]         9 → [9]       2 → [2]       5 → [2,5]      3 → [2,3]       (3 ne 5 ko replace kiya)
  7 → [2,3,7]       101 → [2,3,7,101]           18 → [2,3,7,18]                 →  length 4

x aaye: tails mein PEHLA element jo >= x dhoondo (binary search) → use x se replace; sab chhote nikle toh append
(tails khud subsequence nahi hai — sirf LENGTH sahi hai)
```

```java
// LIS — O(n²) dp
public int lengthOfLIS(int[] nums) {
    int n = nums.length, best = 1;
    int[] dp = new int[n];                                             // dp[i] = nums[i] pe khatam hone wali LIS ki length
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);   // 🔑 j ke baad nums[i] jodo
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}

// LIS — O(n log n): tails + binary search
public int lengthOfLISFast(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {                                              // pehla tails[k] >= x (strictly increasing ke liye)
            int mid = (lo + hi) >>> 1;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;                                                 // 🔑 replace (ya append agar lo == size)
        if (lo == size) size++;
    }
    return size;
}

// Number of Longest Increasing Subsequences — length ke saath count
public int findNumberOfLIS(int[] nums) {
    int n = nums.length, best = 0, total = 0;
    int[] len = new int[n], cnt = new int[n];                          // len[i] = LIS ending at i,  cnt[i] = kitni aisi
    for (int i = 0; i < n; i++) {
        len[i] = 1;
        cnt[i] = 1;
        for (int j = 0; j < i; j++) {
            if (nums[j] >= nums[i]) continue;
            if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; }   // 🔑 naya lamba raasta → count reset
            else if (len[j] + 1 == len[i]) cnt[i] += cnt[j];                       // barabar lamba → count jodo
        }
        if (len[i] > best) { best = len[i]; total = cnt[i]; }
        else if (len[i] == best) total += cnt[i];
    }
    return total;
}

// Russian Doll Envelopes — width ↑ sort, tie mein height ↓, phir heights pe LIS
public int maxEnvelopes(int[][] envelopes) {
    Arrays.sort(envelopes, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1]));   // 🔑 tie: height ulta
    int[] heights = new int[envelopes.length];
    for (int i = 0; i < envelopes.length; i++) heights[i] = envelopes[i][1];
    return lengthOfLISFast(heights);                                   // upar wala O(n log n) function
}
```

**Tie mein height ulta kyun?** Same width ke envelopes ek-doosre mein nahi ghus sakte — heights ulta sort karo taaki LIS unme se **do** na chun sake (strictly increasing).

---

## 9. ⑦ Interval / Palindrome — `dp[i][j]` = `s[i..j]`

**Idea**: State ek **range** `[i, j]` hai. Chhoti range se badi range banti hai — isliye loop **range ki lambai (len) badhate hue** ya `i` ko peeche se, `j` ko aage se.

```
Longest Palindromic Substring:  har center se dono taraf phailao (odd + even)   O(n²), O(1) space

Longest Palindromic Subsequence:  dp[i][j] = s[i..j] ki LPS
     s[i] == s[j]  →  dp[i+1][j−1] + 2         (dono kinare jodo)
     nahi          →  max(dp[i+1][j],  dp[i][j−1])     (ek kinara chhodo)
     "bbbab":   dp[0][4] = 4  ("bbbb")

Burst Balloons (Hard):  k = AAKHRI phutne wala balloon (l, r ke beech)  ← yehi soch trick hai
     dp[l][r] = max over k :  dp[l][k] + nums[l]·nums[k]·nums[r] + dp[k][r]
     (k aakhri hai, isliye jab wo phutta hai uske dono taraf ke balloons pehle hi phut chuke — l aur r hi padosi bache)
```

```java
// Longest Palindromic Substring — expand around center
public String longestPalindrome(String s) {
    int start = 0, end = 0;
    for (int center = 0; center < s.length(); center++) {
        int len = Math.max(expand(s, center, center), expand(s, center, center + 1));   // 🔑 odd aur even center
        if (len > end - start + 1) {
            start = center - (len - 1) / 2;
            end = center + len / 2;
        }
    }
    return s.substring(start, end + 1);
}

private int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
        l--;
        r++;
    }
    return r - l - 1;                                                  // palindrome ki length
}

// Longest Palindromic Subsequence
public int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = n - 1; i >= 0; i--) {                                 // i peeche se → dp[i+1][..] pehle bhar chuka
        dp[i][i] = 1;                                                  // akela akshar
        for (int j = i + 1; j < n; j++) {
            if (s.charAt(i) == s.charAt(j)) dp[i][j] = dp[i + 1][j - 1] + 2;    // 🔑 dono kinare match
            else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
        }
    }
    return dp[0][n - 1];
}

// Burst Balloons
public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] a = new int[n + 2];
    a[0] = 1;                                                          // kinare pe virtual 1
    a[n + 1] = 1;
    for (int i = 0; i < n; i++) a[i + 1] = nums[i];
    int[][] dp = new int[n + 2][n + 2];                                // dp[l][r] = (l, r) ke BEECH ke sab balloons ka max (l, r nahi phute)
    for (int len = 2; len <= n + 1; len++) {                           // range chhoti se badi
        for (int l = 0; l + len <= n + 1; l++) {
            int r = l + len;
            for (int k = l + 1; k < r; k++) {                          // 🔑 k = aakhri phutne wala
                dp[l][r] = Math.max(dp[l][r], dp[l][k] + a[l] * a[k] * a[r] + dp[k][r]);
            }
        }
    }
    return dp[0][n + 1];
}
```

---

## 10. ⑧ State Machine — stock (hold / sold / rest)

**Idea**: Har din tum **kisi ek state** mein ho (share hai / nahi hai / cooldown). Har state ke liye ek variable, **har din sab update**. Transitions = machine ke arrows.

```
Cooldown wala:            buy (−p)              sell (+p)           agle din
                 rest ───────────▶ hold ───────────▶ sold ──────────▶ rest
                  ↺ (kuch nahi)       ↺ (hold jaari)                    (cooldown: kal seedha buy nahi)

   hold = max( hold,  rest − p )        # pehle se hold, ya aaj khareeda (rest se, sold se nahi)
   sold = hold_pichhla + p              # aaj becha
   rest = max( rest,  sold_pichhla )    # aaj kuch nahi

Transaction Fee:  cash = max(cash, hold + p − fee);   hold = max(hold, cash − p)
k transactions:   buy[t], sell[t] — t-th transaction ke liye state          buy[t] = max(buy[t], sell[t−1] − p)
```

```java
// Best Time to Buy and Sell Stock with Cooldown
public int maxProfitCooldown(int[] prices) {
    int hold = Integer.MIN_VALUE / 2, sold = 0, rest = 0;
    for (int p : prices) {
        int prevSold = sold;
        sold = hold + p;                                               // aaj becha
        hold = Math.max(hold, rest - p);                               // 🔑 khareedne ke liye pichhla din "rest" hona chahiye
        rest = Math.max(rest, prevSold);                               // aaj kuch nahi (kal becha tha toh cooldown khatam)
    }
    return Math.max(sold, rest);
}

// Best Time to Buy and Sell Stock with Transaction Fee
public int maxProfitFee(int[] prices, int fee) {
    int cash = 0, hold = -prices[0];
    for (int i = 1; i < prices.length; i++) {
        cash = Math.max(cash, hold + prices[i] - fee);                 // bechne pe fee
        hold = Math.max(hold, cash - prices[i]);                       // 🔑 cash (naya) se khareedna — same din becha-kharida ka faida nahi
    }
    return cash;
}

// Best Time to Buy and Sell Stock IV — at most k transactions
public int maxProfitK(int k, int[] prices) {
    if (prices.length == 0 || k == 0) return 0;
    if (k >= prices.length / 2) {                                      // 🔑 k bahut bada → unlimited: har chadhai le lo
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        }
        return profit;
    }
    int[] buy = new int[k + 1], sell = new int[k + 1];                 // buy[t] = t-th kharidne ke baad best, sell[t] = t-th bechne ke baad
    Arrays.fill(buy, Integer.MIN_VALUE / 2);
    for (int p : prices) {
        for (int t = 1; t <= k; t++) {
            buy[t] = Math.max(buy[t], sell[t - 1] - p);                // (t−1) transactions ke baad t-th khareedo
            sell[t] = Math.max(sell[t], buy[t] + p);
        }
    }
    return sell[k];
}
```

---

## 11. ⑨ Tree DP — har node pe ek **jodi** (take, skip)

**Idea**: Har node ke liye do jawab return karo: **is node ko lene par** aur **na lene par** ka best. Bachchon ke jawab se parent ka jawab banta hai. (Post-order [DFS](12-dfs.md).)

```
House Robber III:         3            node 3 ko loot:   3 + (children ko CHHODO)      = 3 + skip(2) + skip(3)
                         / \           node 3 ko chhodo: children AZAAD  = max(take, skip) dono ka
                        2   3
                         \   \         return {take, skip}     root pe  max(take, skip)
                          3   1
```

```java
// House Robber III — binary tree, parent-child ek saath nahi
public int robTree(TreeNode root) {
    int[] result = dfs(root);
    return Math.max(result[0], result[1]);
}

private int[] dfs(TreeNode node) {                                     // {is node ko LOOTA, is node ko CHHODA}
    if (node == null) return new int[]{0, 0};
    int[] left = dfs(node.left), right = dfs(node.right);
    int take = node.val + left[1] + right[1];                          // 🔑 node lo → bachche chhodne padenge
    int skip = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);   // node chhodo → bachche free
    return new int[]{take, skip};
}
```

---

## 12. Sab ek nazar mein

| Family | `dp` ka matlab | Transition | Base | Answer |
|---|---|---|---|---|
| ① 1D | `dp[i]` pehle `i` ka best/tarike | `dp[i−1]`, `dp[i−2]` | `dp[0]`, `dp[1]` | `dp[n]` |
| ② Grid | `dp[r][c]` `(r,c)` tak | `dp[r−1][c]`, `dp[r][c−1]` | pehli row/col | `dp[m−1][n−1]` |
| ③ Two strings | `dp[i][j]` `a[0..i)`, `b[0..j)` | match → diagonal, else neighbors | `dp[i][0]`, `dp[0][j]` | `dp[m][n]` |
| ④ 0/1 knapsack | `dp[s]` sum `s` ban sakta / tarike | `dp[s] \|= dp[s−x]` | `dp[0]=true/1` | `dp[target]` |
| ⑤ Unbounded | `dp[a]` amount `a` | `dp[a−c] + 1` / `+=` | `dp[0]=0/1` | `dp[amount]` |
| ⑥ LIS | `dp[i]` `nums[i]` pe khatam | `max dp[j]+1`, `nums[j]<nums[i]` | `1` | `max(dp)` |
| ⑦ Interval | `dp[i][j]` `s[i..j]` | kinare match / split `k` | `dp[i][i]` | `dp[0][n−1]` |
| ⑧ State machine | naam wale states (hold, sold, rest) | din-ba-din update | initial states | `max(final states)` |
| ⑨ Tree | `{take, skip}` per node | bachchon ke jodi se | `null → {0,0}` | root pe `max` |

**Loop direction ka nichod:**

| Situation | Direction |
|---|---|
| 0/1 knapsack (1D) | capacity **DESCENDING** |
| Unbounded knapsack | capacity **ASCENDING** |
| Combinations (order nahi) | **outer = items**, inner = amount |
| Permutations (order matter) | **outer = amount**, inner = items |
| Interval DP | range ki **lambai badhate hue** (ya `i` peeche se) |

## Common galtiyan

- **`dp[i]` ka matlab likhe bina code shuru** — 90% DP bugs yahin se.
- **Base case galat / bhoolna** — `dp[0]`, khaali string, pehli row.
- **0/1 mein ascending loop** — ek item kai baar use ho jata hai.
- **Combinations vs permutations** — loop order ulta → answer galat.
- **`Integer.MAX_VALUE + 1` overflow** — `dp[a - c] + 1` mein; "infinity" `amount + 1` ya `MAX/2` rakho.
- **Index off-by-one** — `dp[i]` = pehle `i` chars ⇒ `s.charAt(i - 1)`.
- **Range DP mein galat order** — `dp[i+1][j-1]` pehle bharna chahiye (`i` peeche se).
- **Memo mein `-1` sentinel jab valid answer `-1` ho sakta hai**, ya `0` ko "not computed" maan lena.
- **Top-down mein deep recursion** (n ~ 10⁵) — bottom-up likho.
- **Sirf answer chahiye toh space optimize** karo; **path** chahiye toh poori table rakho.

> 💡 **Interview mein bolne wali line**: *"Yahan overlapping subproblems aur optimal substructure hain, isliye DP. State `dp[...]` = [matlab], transition [choices], base [..]. Pehle recursion se soch ke memo lagaunga, phir table mein badal ke space optimize kar dunga. Time = states × transitions, space O(states) (ya rolling se kam)."*

## Practice — family ke hisaab se (easy se hard)

| # | Problem | Family | Difficulty | Link |
|---|---|---|---|---|
| 1 | Climbing Stairs | ① 1D | Easy | [leetcode.com/problems/climbing-stairs](https://leetcode.com/problems/climbing-stairs/) |
| 2 | Min Cost Climbing Stairs | ① 1D | Easy | [leetcode.com/problems/min-cost-climbing-stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) |
| 3 | House Robber | ① 1D | Medium | [leetcode.com/problems/house-robber](https://leetcode.com/problems/house-robber/) |
| 4 | House Robber II | ① 1D (circular) | Medium | [leetcode.com/problems/house-robber-ii](https://leetcode.com/problems/house-robber-ii/) |
| 5 | Decode Ways | ① 1D | Medium | [leetcode.com/problems/decode-ways](https://leetcode.com/problems/decode-ways/) |
| 6 | Delete and Earn | ① 1D (→ House Robber) | Medium | [leetcode.com/problems/delete-and-earn](https://leetcode.com/problems/delete-and-earn/) |
| 7 | Unique Paths | ② Grid | Medium | [leetcode.com/problems/unique-paths](https://leetcode.com/problems/unique-paths/) |
| 8 | Unique Paths II | ② Grid | Medium | [leetcode.com/problems/unique-paths-ii](https://leetcode.com/problems/unique-paths-ii/) |
| 9 | Minimum Path Sum | ② Grid | Medium | [leetcode.com/problems/minimum-path-sum](https://leetcode.com/problems/minimum-path-sum/) |
| 10 | Triangle | ② Grid | Medium | [leetcode.com/problems/triangle](https://leetcode.com/problems/triangle/) |
| 11 | Maximal Square | ② Grid | Medium | [leetcode.com/problems/maximal-square](https://leetcode.com/problems/maximal-square/) |
| 12 | Longest Common Subsequence | ③ Two strings | Medium | [leetcode.com/problems/longest-common-subsequence](https://leetcode.com/problems/longest-common-subsequence/) |
| 13 | Edit Distance | ③ Two strings | Medium | [leetcode.com/problems/edit-distance](https://leetcode.com/problems/edit-distance/) |
| 14 | Interleaving String | ③ Two strings | Medium | [leetcode.com/problems/interleaving-string](https://leetcode.com/problems/interleaving-string/) |
| 15 | Distinct Subsequences | ③ Two strings | Hard | [leetcode.com/problems/distinct-subsequences](https://leetcode.com/problems/distinct-subsequences/) |
| 16 | Partition Equal Subset Sum | ④ 0/1 | Medium | [leetcode.com/problems/partition-equal-subset-sum](https://leetcode.com/problems/partition-equal-subset-sum/) |
| 17 | Target Sum | ④ 0/1 (count) | Medium | [leetcode.com/problems/target-sum](https://leetcode.com/problems/target-sum/) |
| 18 | Last Stone Weight II | ④ 0/1 | Medium | [leetcode.com/problems/last-stone-weight-ii](https://leetcode.com/problems/last-stone-weight-ii/) |
| 19 | Ones and Zeroes | ④ 0/1 (2D) | Medium | [leetcode.com/problems/ones-and-zeroes](https://leetcode.com/problems/ones-and-zeroes/) |
| 20 | Coin Change | ⑤ Unbounded (min) | Medium | [leetcode.com/problems/coin-change](https://leetcode.com/problems/coin-change/) |
| 21 | Coin Change II | ⑤ Unbounded (combos) | Medium | [leetcode.com/problems/coin-change-ii](https://leetcode.com/problems/coin-change-ii/) |
| 22 | Combination Sum IV | ⑤ Unbounded (perms) | Medium | [leetcode.com/problems/combination-sum-iv](https://leetcode.com/problems/combination-sum-iv/) |
| 23 | Perfect Squares | ⑤ Unbounded | Medium | [leetcode.com/problems/perfect-squares](https://leetcode.com/problems/perfect-squares/) |
| 24 | Word Break | ⑤ Unbounded | Medium | [leetcode.com/problems/word-break](https://leetcode.com/problems/word-break/) |
| 25 | Longest Increasing Subsequence | ⑥ LIS | Medium | [leetcode.com/problems/longest-increasing-subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) |
| 26 | Number of Longest Increasing Subsequence | ⑥ LIS | Medium | [leetcode.com/problems/number-of-longest-increasing-subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) |
| 27 | Russian Doll Envelopes | ⑥ LIS | Hard | [leetcode.com/problems/russian-doll-envelopes](https://leetcode.com/problems/russian-doll-envelopes/) |
| 28 | Longest Palindromic Substring | ⑦ Palindrome | Medium | [leetcode.com/problems/longest-palindromic-substring](https://leetcode.com/problems/longest-palindromic-substring/) |
| 29 | Longest Palindromic Subsequence | ⑦ Interval | Medium | [leetcode.com/problems/longest-palindromic-subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) |
| 30 | Burst Balloons | ⑦ Interval | Hard | [leetcode.com/problems/burst-balloons](https://leetcode.com/problems/burst-balloons/) |
| 31 | Best Time to Buy and Sell Stock with Cooldown | ⑧ State machine | Medium | [leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) |
| 32 | Best Time to Buy and Sell Stock with Transaction Fee | ⑧ State machine | Medium | [leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) |
| 33 | Best Time to Buy and Sell Stock IV | ⑧ State machine | Hard | [leetcode.com/problems/best-time-to-buy-and-sell-stock-iv](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) |
| 34 | House Robber III | ⑨ Tree DP | Medium | [leetcode.com/problems/house-robber-iii](https://leetcode.com/problems/house-robber-iii/) |
| 35 | Binary Tree Cameras | ⑨ Tree DP (states) | Hard | [leetcode.com/problems/binary-tree-cameras](https://leetcode.com/problems/binary-tree-cameras/) |

**Kaise practice karein**: Har problem pe pehle likho — *"dp[...] ka matlab? Transition (choices)? Base? Loop order? Answer kahan?"* — pehle recursion, phir table.

Agla: [20-graph-algorithms.md](20-graph-algorithms.md)
