# 25. 2D DP — Grid aur Strings

> 📍 **Syllabus**: Unit 6 — Dynamic Programming · Topic 25 / 29 · Pehle chahiye: [DP Basics](24-dp-basics.md), [Strings](../01-basics/03-strings.md)

> **Standard definition**: Two-dimensional dynamic programming defines the state by two variables (for example a grid position (row, column) or a pair of prefix lengths of two strings) and fills a table where each cell is computed from previously computed neighbouring cells.

**Ek line mein**: DP ka table **do dimension** ka — har cell `dp[i][j]` **do cheezon** ka jawab hai (grid mein row-column, ya do strings mein "pehle `i` aur pehle `j` akshar"), aur har cell **apne upar / baayein / tirchhe cell** se banta hai.

**Trick yaad rakhne ki**: *"Excel sheet"* — har cell ka ek **formula** hota hai jo uske **upar wale**, **baayein wale** (kabhi **tirchhe**) cell ko padhta hai. Tum pehli row aur pehla column (base case) pehle bhar dete ho, phir baaki sheet formula se **khud bharti chali jati hai** — bas sahi order mein (upar-baayein se neeche-daayein).

**Kab use karo**: **Grid** pe raaste ginna / minimum kharch, **do strings** ko compare/convert karna (LCS, edit distance), ya **ek string ke andar do sire** (`i`, `j`) ka sawaal (palindrome). Jab **state mein do cheezein** hon — 1D table kam padegi.

## Part 1 — Grid DP

### Unique Paths (kitne raaste)

Robot `(0,0)` se aakhri cell tak sirf **daayein** ya **neeche** ja sakta hai. Kitne raaste?

**State**: `dp[i][j]` = `(i, j)` tak pahunchne ke raaste. **Transition**: `(i, j)` pe ya **upar** se aaye ya **baayein** se → `dp[i-1][j] + dp[i][j-1]`. **Base**: pehli row aur pehla column mein sirf ek hi raasta.

```
3 × 3 grid ka dp table:

   1   1   1          pehli row/column: sirf 1 raasta
   1   2   3          2 = upar(1) + baayein(1)     3 = upar(1) + baayein(2)
   1   3   6          6 = upar(3) + baayein(3)     ← answer 6 raaste
```

```java
public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) dp[i][0] = 1;              // pehla column: sirf neeche
    for (int j = 0; j < n; j++) dp[0][j] = 1;              // pehli row: sirf daayein
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];        // 🔑 upar se aaye + baayein se aaye
        }
    }
    return dp[m - 1][n - 1];
}

// Space optimize: har cell ko sirf upar wali aur baayein wali chahiye → ek row kaafi
public int uniquePathsOptimized(int m, int n) {
    int[] row = new int[n];
    Arrays.fill(row, 1);                                    // pehli row
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            row[j] += row[j - 1];                           // row[j] = upar wala (purana), row[j-1] = baayein wala (naya)
        }
    }
    return row[n - 1];
}
```

### Rukawat (obstacle) ke saath aur Minimum Path Sum

```java
// Unique Paths II — grid[i][j] == 1 matlab rukawat
public int uniquePathsWithObstacles(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) { dp[i][j] = 0; continue; }       // rukawat → yahan se koi raasta nahi
            if (i == 0 && j == 0) { dp[i][j] = 1; continue; }
            int fromTop = i > 0 ? dp[i - 1][j] : 0;
            int fromLeft = j > 0 ? dp[i][j - 1] : 0;
            dp[i][j] = fromTop + fromLeft;
        }
    }
    return dp[m - 1][n - 1];
}
```

```
Minimum Path Sum — (0,0) se aakhri tak, sirf daayein/neeche, cells ka sum minimum

grid:              dp:
 1  3  1            1   4   5        dp[i][j] = grid[i][j] + min(upar, baayein)
 1  5  1            2   7   6
 4  2  1            6   8   7   ← 7  (raasta 1 → 3 → 1 → 1 → 1)
```

```java
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) dp[i][j] = grid[i][j];
            else if (i == 0) dp[i][j] = dp[i][j - 1] + grid[i][j];          // pehli row: sirf baayein se aa sakte
            else if (j == 0) dp[i][j] = dp[i - 1][j] + grid[i][j];          // pehla column: sirf upar se
            else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];   // 🔑 upar ya baayein — jo sasta
        }
    }
    return dp[m - 1][n - 1];
}
```

### Maximal Square (teeno padosi mein sabse kamzor + 1) ⭐

Matrix `'0'/'1'` ka hai. Sabse bada **sirf `'1'` wala square** dhoondho.

**State**: `dp[i][j]` = `(i, j)` pe **khatam** hone wale sabse bade square ki **side**. **Trick**: *"Square ki side utni hi badi ho sakti hai jitna uska **sabse kamzor padosi** (upar, baayein, tirchha) allow kare, +1."*

```
matrix:            dp (side):
 1 0 1 0 0          1 0 1 0 0
 1 0 1 1 1          1 0 1 1 1
 1 1 1 1 1          1 1 1 2 2       ← (2,3): min(upar-baayein 1, upar 1, baayein 1) + 1 = 2
 1 0 0 1 0          1 0 0 1 0

sabse badi side = 2  →  area = 4
```

```java
public int maximalSquare(char[][] matrix) {
    int m = matrix.length, n = matrix[0].length, best = 0;
    int[][] dp = new int[m + 1][n + 1];                  // 1-indexed (pehli row/col 0) → boundary check nahi lagana
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (matrix[i - 1][j - 1] == '1') {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));   // 🔑 teeno mein sabse kamzor + 1
                best = Math.max(best, dp[i][j]);
            }
        }
    }
    return best * best;                                   // side → area
}
```

## Part 2 — Do Strings ka DP

**Trick**: Table mein **row = pehli string ke akshar**, **column = doosri string ke akshar**. `dp[i][j]` = pehli ke **pehle `i`** aur doosri ke **pehle `j`** aksharon ka jawab. Har cell **3 padosiyon** se banta hai:

```
          j-1      j
   i-1  [diag ]  [ up ]        dp[i][j] kya dekhta hai:
   i    [left ]  [ dp ]           diag = dono ka ek-ek akshar chhod diya
                                  up   = pehli string ka akshar chhod diya
                                  left = doosri string ka akshar chhod diya
```

### LCS — Longest Common Subsequence

**Subsequence** = kuch aksharon ko hatane pe bachi string (order wahi). `"abcde"` aur `"ace"` ka LCS = `"ace"` (3).

**Trick**: *Akshar **match** hue → dono ko chhodke `+1`. Match nahi → ek string ka akshar chhod do (dono option dekho, jo behtar).*

```
         ""   a   c   e
   ""     0   0   0   0
   a      0   1   1   1        a = a match → diag(0) + 1
   b      0   1   1   1        b kisi se match nahi → max(upar, left)
   c      0   1   2   2        c = c match → diag(1) + 1 = 2
   d      0   1   2   2
   e      0   1   2   3   ←  e = e match → diag(2) + 1 = 3   ✅ LCS = 3 ("ace")
```

```java
public int longestCommonSubsequence(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];        // dp[i][j] = a ke pehle i aur b ke pehle j aksharon ka LCS (row/col 0 = khaali string)
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;                    // 🔑 akshar match → dono ko chhodke +1
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);    // match nahi → ek string ka akshar chhod do
            }
        }
    }
    return dp[m][n];
}
```

### Edit Distance (ek string ko doosri banana)

Operations: **insert**, **delete**, **replace** (har ek ka cost 1). `"horse"` → `"ros"` kam se kam kitne operations?

**Transition**: Aakhri aksharon ko dekho. **Same** → koi operation nahi (`dp[i-1][j-1]`). **Alag** → teeno mein se **sabse sasta + 1**:
- **Replace**: `dp[i-1][j-1]`
- **Delete** (pehli ka akshar hatao): `dp[i-1][j]`
- **Insert** (doosri ka akshar jodo): `dp[i][j-1]`

```
         ""   r   o   s
   ""     0   1   2   3       pehli row = j inserts,  pehla column = i deletes (base)
   h      1   1   2   3
   o      2   2   1   2       o = o match → diag (1)
   r      3   2   2   2       r = r match → diag (2)
   s      4   3   3   2       s = s match → diag (2)
   e      5   4   4   3   ←  answer 3   (horse → rorse → rose → ros)
```

```java
public int minDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];          // dp[i][j] = a[0..i) ko b[0..j) banane ke min operations
    for (int i = 0; i <= m; i++) dp[i][0] = i;   // a ko khaali banana = i deletes
    for (int j = 0; j <= n; j++) dp[0][j] = j;   // khaali se b banana = j inserts
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];                     // akshar same → koi operation nahi
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],        // replace
                                Math.min(dp[i - 1][j],           // delete
                                         dp[i][j - 1]));         // insert
            }
        }
    }
    return dp[m][n];
}
```

### Longest Palindromic Subsequence (ek hi string ke andar `i..j`)

Yahan table `dp[i][j]` = `s[i..j]` (dono sire shamil) ka **sabse lamba palindromic subsequence**. **Trick**: *Dono sire same hain toh andar wale hisse ka answer + 2. Nahi toh ek sira chhodo.*

`dp[i][j]` ko `dp[i+1][j-1]`, `dp[i+1][j]`, `dp[i][j-1]` chahiye — matlab **`i` neeche se upar** chalna padega (ye **interval DP** ka pehla darshan hai).

```java
public int longestPalindromeSubseq(String s) {
    int n = s.length();
    if (n == 0) return 0;
    int[][] dp = new int[n][n];                  // dp[i][j] = s[i..j] ka longest palindromic subsequence
    for (int i = n - 1; i >= 0; i--) {           // 🔑 i neeche se upar: dp[i+1][...] pehle ready chahiye
        dp[i][i] = 1;                             // ek akshar khud palindrome
        for (int j = i + 1; j < n; j++) {
            if (s.charAt(i) == s.charAt(j)) {
                dp[i][j] = dp[i + 1][j - 1] + 2;                  // dono sire match → andar ka + 2
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);  // ek sira chhodo, jo behtar
            }
        }
    }
    return dp[0][n - 1];
}
```

`"bbbab"` → `"bbbb"` = **4**.

## Kaunsa DP kab

| Problem ka hint | State |
|---|---|
| Grid pe raaste / min-max kharch | `dp[i][j]` = `(i, j)` tak ka best |
| **Do strings** compare/convert | `dp[i][j]` = pehle `i` aur pehle `j` akshar |
| Ek string mein **palindrome / range** | `dp[i][j]` = `s[i..j]` |
| Sabse bada square/rectangle | `dp[i][j]` = `(i, j)` pe khatam hone wala best |

## Space optimization

`dp[i][j]` sirf **pichhli row (`i-1`)** aur **current row** dekhta hai → poori `m × n` table ki jagah **do rows** (ya kabhi ek row) rakh sakte ho: space `O(m·n)` → `O(n)`. (`uniquePathsOptimized` mein dikhaya.) Par agar **actual answer (jaise LCS string) wapas banana** ho toh poori table chahiye (table mein peeche chalke tarika nikalte hain).

## Common galtiyan

- **Table `m × n` banana par indices `m+1 × n+1` chahiye** (strings mein khaali prefix ke liye) — `dp[i][j]` mein `charAt(i - 1)` yaad rakho.
- **Base row/column bharna bhoolna** — edit distance mein `dp[i][0] = i`, `dp[0][j] = j`.
- **`i - 1` ya `j - 1` ka boundary** grid mein bina check kiye (`i > 0`, `j > 0`).
- **Interval DP mein galat loop order** — `dp[i][j]` ke liye `dp[i+1][..]` pehle bharna zaroori.
- **Rukawat/`0` wale cell ko galat handle karna** (Unique Paths II mein pehle rukawat check).

> 💡 **Interview mein bolne wali line**: *"State `dp[i][j]` = pehle `i` aur `j` aksharon ka answer. Match hone pe diagonal se `+1`, warna upar ya left mein se behtar. Time O(m·n), space O(m·n) — rolling row se O(n) kar sakta hoon."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Unique Paths | Medium | Upar + baayein | [leetcode.com/problems/unique-paths](https://leetcode.com/problems/unique-paths/) |
| 2 | Unique Paths II | Medium | Rukawat = 0 | [leetcode.com/problems/unique-paths-ii](https://leetcode.com/problems/unique-paths-ii/) |
| 3 | Minimum Path Sum | Medium | Min of upar/baayein | [leetcode.com/problems/minimum-path-sum](https://leetcode.com/problems/minimum-path-sum/) |
| 4 | Triangle | Medium | Neeche se upar DP | [leetcode.com/problems/triangle](https://leetcode.com/problems/triangle/) |
| 5 | Maximal Square | Medium | 3 padosi ka min + 1 | [leetcode.com/problems/maximal-square](https://leetcode.com/problems/maximal-square/) |
| 6 | Longest Common Subsequence | Medium | Match → diag + 1 | [leetcode.com/problems/longest-common-subsequence](https://leetcode.com/problems/longest-common-subsequence/) |
| 7 | Longest Palindromic Subsequence | Medium | Interval DP `dp[i][j]` | [leetcode.com/problems/longest-palindromic-subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) |
| 8 | Edit Distance | Medium | Insert / delete / replace | [leetcode.com/problems/edit-distance](https://leetcode.com/problems/edit-distance/) |
| 9 | Interleaving String | Medium | Do strings ka merge | [leetcode.com/problems/interleaving-string](https://leetcode.com/problems/interleaving-string/) |
| 10 | Distinct Subsequences | Hard | Kitne tarike se banti hai | [leetcode.com/problems/distinct-subsequences](https://leetcode.com/problems/distinct-subsequences/) |
| 11 | Wildcard Matching | Hard | `*` ke do raaste | [leetcode.com/problems/wildcard-matching](https://leetcode.com/problems/wildcard-matching/) |
| 12 | Regular Expression Matching | Hard | `*` (0 ya zyada) ka transition | [leetcode.com/problems/regular-expression-matching](https://leetcode.com/problems/regular-expression-matching/) |

Agla: [26-dp-knapsack-and-subsequences.md](26-dp-knapsack-and-subsequences.md)
