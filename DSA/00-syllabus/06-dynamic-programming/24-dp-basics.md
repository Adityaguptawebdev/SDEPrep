# 24. DP Basics (Memoization, Tabulation, 1D DP)

> 📍 **Syllabus**: Unit 6 — Dynamic Programming · Topic 24 / 29 · Pehle chahiye: [Recursion](../01-basics/09-recursion.md) (khaaskar Fibonacci wala hissa), [Arrays](../01-basics/02-arrays.md)

> **Standard definition**: An optimization technique that solves a complex problem by breaking it into overlapping subproblems, solving each subproblem only once and storing its result (memoization or tabulation) so that it can be reused instead of recomputed.

**Ek line mein**: **Wahi chhota sawaal baar-baar solve mat karo — ek baar solve karo, likh lo, aur agli baar seedha padh lo.**

**Trick yaad rakhne ki**: *"Seedhiyon pe sticky notes"* — tumhe 10 seedhiyan chadhni hain (ek baar mein 1 ya 2 seedhi). Har seedhi pe ek **sticky note** chipkao: *"yahan tak pahunchne ke kitne tarike."*
- Seedhi 5 ka note bharne ke liye tumhe **sirf seedhi 4 aur seedhi 3 ke notes padhne** hain — poori kahani dobara nahi.
- Ek baar note likh diya, toh baar-baar ginne ki zarurat nahi.

Yehi DP hai: **chhote sawaalon ke jawab likh-likh ke, bade sawaal ka jawab banana.**

**Kab use karo**: **Optimization** (max/min) ya **counting** (kitne tarike) problems mein, jab recursion likho toh **same calls baar-baar** dikhein. Interview mein "**minimum / maximum / kitne ways / possible hai ya nahi**" + choices ho toh DP soch lo.

## DP hai ya nahi — 2 sawaal

```
1. Overlapping subproblems  →  Kya same chhota sawaal baar-baar solve ho raha hai?
                               (recursion tree mein repeat dikhe — jaise fib(3) kai baar)

2. Optimal substructure     →  Kya bade sawaal ka best answer, chhote sawaalon ke best answers se ban jata hai?
```

Dono "haan" ⇒ **DP**. Overlap nahi hai (har subproblem alag) ⇒ sirf simple recursion / backtracking / divide & conquer.

## Ek hi problem — 4 roop mein (Climbing Stairs)

**Problem**: `n` seedhiyan hain, ek baar mein 1 ya 2 chadh sakte ho. Kitne alag tarike?

**Soch**: Seedhi `i` pe pahunchne ke **sirf 2 raaste** — `i−1` se 1 kadam, ya `i−2` se 2 kadam. Isliye `ways(i) = ways(i−1) + ways(i−2)`.

```
                       ways(5)
                ┌────────┴────────┐
            ways(4)              ways(3)            ← ways(3) DOBARA
         ┌─────┴─────┐         ┌───┴───┐
     ways(3)      ways(2)   ways(2)  ways(1)        ← ways(2) TEEN baar
   ┌───┴───┐
ways(2) ways(1)
        ↑
   same kaam baar-baar → O(2ⁿ)  ❌
```

```java
// 1) ❌ Plain recursion — O(2ⁿ): same subproblems baar-baar
public int climbRecursive(int n) {
    if (n <= 2) return n;
    return climbRecursive(n - 1) + climbRecursive(n - 2);
}

// 2) ✅ Top-down (Memoization) — O(n): recursion + "pehle se nikala hua yaad rakho"
public int climbMemo(int n) {
    return memo(n, new int[n + 1]);
}

private int memo(int n, int[] cache) {
    if (n <= 2) return n;
    if (cache[n] != 0) return cache[n];               // 🔑 pehle nikaal chuke → seedha de do
    return cache[n] = memo(n - 1, cache) + memo(n - 2, cache);
}

// 3) ✅ Bottom-up (Tabulation) — O(n) time, O(n) space: chhote se bade tak table bharo
public int climbTable(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];                         // dp[i] = seedhi i tak pahunchne ke tarike
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];                 // 🔑 pichhle 2 sticky notes padho
    }
    return dp[n];
}

// 4) ✅ Space optimized — O(1): sirf pichhle 2 notes chahiye, poori table nahi
public int climbOptimized(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;                          // dp[i-2], dp[i-1]
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
```

```
Tabulation ka table (n = 6):

  i     :  1   2   3   4   5   6
  dp[i] :  1   2   3   5   8   13        dp[i] = dp[i-1] + dp[i-2]        answer = dp[6] = 13
                   ↑ 1+2   ↑ 2+3   ↑ 3+5
```

## Top-down vs Bottom-up

| | **Top-down (Memoization)** | **Bottom-up (Tabulation)** |
|---|---|---|
| Kaise | Recursion likho + `cache` | Loop se table bharo (chhote se bade) |
| Soch | *"Bade se shuru, zarurat pe chhota nikalo"* | *"Chhote se shuru, upar tak banao"* |
| Fayda | Likhna aasan (recursion se seedha); sirf **zaroori** states nikalta hai | Recursion nahi → stack overflow ka dar nahi; space optimize aasan |
| Nuksaan | Recursion depth (bahut bada `n` mein) | Sahi **order** sochna padta hai |

**Interview mein**: pehle **recursion + memo** se shuru karo (safe), phir bolo *"space O(1) tak optimize kar sakta hoon"*.

## DP ki 5-step recipe (har problem mein yehi poochho)

```
1. STATE       →  dp[i] ka matlab kya hai? (ye sabse zaroori — yahin galti hoti hai)
2. TRANSITION  →  dp[i] ko chhote dp values se kaise banaun?  (choices kya-kya hain)
3. BASE CASE   →  sabse chhote i ke liye answer kya (seedha pata)?
4. ORDER       →  kis order mein bharun taaki zarurat ki values pehle se ready hon?
5. ANSWER      →  final answer dp[kahan] mein hai?
```

Climbing Stairs mein: (1) `dp[i]` = seedhi i tak ke tarike, (2) `dp[i-1] + dp[i-2]`, (3) `dp[1]=1, dp[2]=2`, (4) `i` chhote se bade, (5) `dp[n]`.

## Code example 2 — House Robber ("lo ya chhodo" ka pehla darshan)

**Problem**: Gharon ki line hai, `nums[i]` = ghar `i` mein paisa. **Paas-paas ke do ghar nahi loot sakte.** Maximum kitna loot sakte ho?

**Trick**: *"Har ghar pe sirf 2 choices — **chhodo** ya **loot lo**."* Chhodo toh pichhle ghar tak ka best (`dp[i-1]`). Loot lo toh pichhla ghar chhodna padega (`dp[i-2] + nums[i]`). **Jo zyada, wahi.**

```
nums = [2, 7, 9, 3, 1]

ghar 0:  best = 2
ghar 1:  max(chhodo=2, lo=0+7)      = 7
ghar 2:  max(chhodo=7, lo=2+9)      = 11
ghar 3:  max(chhodo=11, lo=7+3)     = 11
ghar 4:  max(chhodo=11, lo=11+1)    = 12       ← answer 12  (2 + 9 + 1)
```

```java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;                       // dp[i-2], dp[i-1] (shuru mein 0)
    for (int money : nums) {
        int cur = Math.max(prev1, prev2 + money);   // 🔑 chhodo (prev1) ya loot lo (prev2 + money) — jo zyada
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

// House Robber II — ghar GOL hain (pehla aur aakhri bhi paas-paas)
public int robCircular(int[] nums) {
    if (nums.length == 1) return nums[0];
    return Math.max(robRange(nums, 0, nums.length - 2),     // pehla ghar le sakte, aakhri nahi
                    robRange(nums, 1, nums.length - 1));     // pehla nahi, aakhri le sakte
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
```

**Line by line samjho**: Gol hone pe pehla aur aakhri ghar **ek saath nahi** le sakte. Toh do line-problems mein tod do: *aakhri ke bina* aur *pehle ke bina* — dono ka best, phir `max`. Ye **"ek badi problem ko do chhoti problems mein todna"** DP ka common trick hai.

## Code example 3 — Decode Ways (choices ke saath conditions)

**Problem**: `'A'=1, 'B'=2, ..., 'Z'=26`. String `"226"` ko kitne tarike se decode kar sakte ho?

**Trick**: *Har position pe 2 raaste* — **1 digit** (agar `'0'` nahi hai) ya **2 digit** (agar 10 se 26 ke beech ho). Dono raaste alag-alag "tarike" hain, toh **jodo**.

```
s = "226"
dp[0] = 1                                    (khaali string — 1 tarika, base)
i=1  '2'  : 1-digit ok → dp[0]                                      = 1     ("B")
i=2  '2'  : 1-digit ok → dp[1] = 1;  "22" ok → dp[0] = 1             = 2     ("BB", "V")
i=3  '6'  : 1-digit ok → dp[2] = 2;  "26" ok → dp[1] = 1             = 3     ("BBF", "VF", "BZ")
```

```java
public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];                      // dp[i] = pehle i characters ko decode karne ke tarike
    dp[0] = 1;                                       // khaali string
    for (int i = 1; i <= n; i++) {
        if (s.charAt(i - 1) != '0') dp[i] += dp[i - 1];          // 1 digit (1-9) ko akela letter banao
        if (i >= 2) {
            int two = Integer.parseInt(s.substring(i - 2, i));
            if (two >= 10 && two <= 26) dp[i] += dp[i - 2];      // 🔑 2 digit (10-26) ko ek letter banao
        }
    }
    return dp[n];
}
```

`'0'` akela kabhi letter nahi banta (`"06"` = 0 tarike), aur `"10"` sirf `"J"` ban sakta hai — ye conditions hi is problem ka asli maza hain.

## Code example 4 — Word Break ("pehle tak ban sakta hai + aakhri tukda word hai")

**Problem**: String `s` ko dictionary ke words mein todh sakte hain kya? (`"leetcode"` = `"leet" + "code"`)

**State**: `dp[i]` = `s` ke **pehle `i` characters** dictionary words se ban sakte hain? **Transition**: koi `j < i` ho jahan `dp[j]` sach ho **aur** `s[j..i)` ek dictionary word ho.

```
s = "leetcode",  dict = {leet, code}

dp[0] = true
dp[4]: j = 0 → dp[0] true  aur  s[0..4) = "leet" ∈ dict  → true
dp[8]: j = 4 → dp[4] true  aur  s[4..8) = "code" ∈ dict  → true    ✅ answer true
```

```java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> words = new HashSet<>(wordDict);       // O(1) lookup ke liye
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;                                       // khaali string hamesha ban sakti hai
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && words.contains(s.substring(j, i))) {   // 🔑 pehle j chars ban sakte + baaki tukda ek word
                dp[i] = true;
                break;                                   // ek tarika mil gaya, aur dhundhne ki zarurat nahi
            }
        }
    }
    return dp[s.length()];
}
```

## Common galtiyan

- **State galat define karna** — `dp[i]` "i-th tak" hai ya "i ke saath khatam" — pehle likh lo, phir transition.
- **Base case bhoolna / off-by-one** — `dp[0]`, `dp[1]` ka matlab clearly likho.
- **Memo mein `0` ko "abhi nikala nahi" maan lena** jab `0` asli answer ho sakta hai — `-1` se initialize karo.
- **`int` overflow** — ways ginte waqt jawab bada ho sakta hai (`long` ya `% 1_000_000_007`).
- **Table ka order galat** — `dp[i]` bharte waqt uski dependencies (`dp[i-1]` etc.) pehle se bhari honi chahiye.
- **Space optimize karte waqt purani value overwrite kar dena** — `prev2 = prev1; prev1 = cur;` ka order yaad rakho.

> 💡 **Interview mein bolne wali line**: *"Recursion tree mein same subproblems repeat ho rahe hain, isliye ye DP hai. State `dp[i]` = ..., transition `dp[i] = ...`, base case `...`. Time O(n), aur kyunki sirf pichhle do values chahiye, space O(1) tak le ja sakta hoon."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Fibonacci Number | Easy | 4 roop (recursion → O(1)) | [leetcode.com/problems/fibonacci-number](https://leetcode.com/problems/fibonacci-number/) |
| 2 | Climbing Stairs | Easy | `dp[i-1] + dp[i-2]` | [leetcode.com/problems/climbing-stairs](https://leetcode.com/problems/climbing-stairs/) |
| 3 | Min Cost Climbing Stairs | Easy | Min of 2 choices | [leetcode.com/problems/min-cost-climbing-stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) |
| 4 | N-th Tribonacci Number | Easy | 3 pichhli values | [leetcode.com/problems/n-th-tribonacci-number](https://leetcode.com/problems/n-th-tribonacci-number/) |
| 5 | House Robber | Medium | Lo ya chhodo | [leetcode.com/problems/house-robber](https://leetcode.com/problems/house-robber/) |
| 6 | Maximum Subarray | Medium | Kadane = 1D DP | [leetcode.com/problems/maximum-subarray](https://leetcode.com/problems/maximum-subarray/) |
| 7 | House Robber II | Medium | Gol → do range | [leetcode.com/problems/house-robber-ii](https://leetcode.com/problems/house-robber-ii/) |
| 8 | Decode Ways | Medium | 1 digit / 2 digit | [leetcode.com/problems/decode-ways](https://leetcode.com/problems/decode-ways/) |
| 9 | Word Break | Medium | Pehle j ban sakte + tukda word | [leetcode.com/problems/word-break](https://leetcode.com/problems/word-break/) |
| 10 | Delete and Earn | Medium | House Robber mein badlo | [leetcode.com/problems/delete-and-earn](https://leetcode.com/problems/delete-and-earn/) |
| 11 | Integer Break | Medium | `dp[i] = max(j × dp[i-j])` | [leetcode.com/problems/integer-break](https://leetcode.com/problems/integer-break/) |
| 12 | Maximum Product Subarray | Medium | Max aur min dono track karo | [leetcode.com/problems/maximum-product-subarray](https://leetcode.com/problems/maximum-product-subarray/) |

Pattern-style notes: [Dynamic Programming pattern](../../01-patterns/19-dynamic-programming.md).

Agla: [25-dp-grid-and-strings.md](25-dp-grid-and-strings.md)
