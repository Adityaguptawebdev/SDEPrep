# 26. DP — Knapsack aur Subsequences

> 📍 **Syllabus**: Unit 6 — Dynamic Programming · Topic 26 / 29 · Pehle chahiye: [DP Basics](24-dp-basics.md), [2D DP](25-dp-grid-and-strings.md), [Binary Search](../01-basics/08-binary-search.md)

> **Standard definition**: The knapsack family of dynamic programming problems chooses items to reach a target or stay within a limit — each item is either taken or skipped (0/1 knapsack) or may be reused any number of times (unbounded knapsack) — with a state of the form (items considered, remaining capacity/target); the related subsequence DP (such as Longest Increasing Subsequence) builds the best subsequence ending at each position.

**Ek line mein**: Har cheez ke liye **"lo ya chhodo"**, aur ek **limit / target** (capacity, sum, amount) ke saath — `dp[capacity]` mein best answer store karte jao.

**Trick yaad rakhne ki**: *"Trip pe bag pack karna"* — bag mein **weight ki limit** hai. Har cheez ke liye do hi choices: **bag mein daalo ya chhodo.**
- **0/1 Knapsack** = *"har cheez ki **sirf ek copy** hai"* (ek hi laptop).
- **Unbounded Knapsack** = *"dukaan mein **unlimited copies**"* (samose jitne chaho — coins jitne baar chaho).

**Kab use karo**: **"Kuch cheezein chuno taaki sum/weight/amount exactly ya at-most X ho"**, **"kitne tarike"**, **"minimum items/coins"**, "kya **possible** hai?" — aur **subsequence** wale sawaal (LIS).

## Sabse zaroori rule — loop ki DIRECTION

```
0/1 Knapsack   (har item EK baar)   →  capacity ka loop PEECHE se:   for (w = W; w >= item; w--)
Unbounded      (item kitni bhi baar) →  capacity ka loop AAGE se:    for (w = item; w <= W; w++)
```

**Kyun?** 1D table `dp[w]` mein jab hum `dp[w - item]` padhte hain:
- **Peeche se** chalne pe `dp[w - item]` abhi **purane item-set** ka hai (isi item ko abhi shamil nahi kiya) → item **ek hi baar** lag paya.
- **Aage se** chalne pe `dp[w - item]` mein **isi item ka fayda pehle se ghus chuka** hai → item **dobara** lag sakta hai (unbounded).

## Part 1 — 0/1 Knapsack

**Problem**: Cheezein `(weight, value)`. Bag ki capacity `W`. **Maximum total value?** (Har cheez ek baar.)

**State**: `dp[i][w]` = pehli `i` cheezein use karke, capacity `w` mein **max value**. **Transition**: cheez `i` ko **chhodo** (`dp[i-1][w]`) ya **lo** (`dp[i-1][w - wt] + val`) — jo zyada.

```
items:  A (w=1, v=15)    B (w=3, v=20)    C (w=4, v=30)          capacity = 4

           w=0   1    2    3    4
 0 items    0    0    0    0    0
 + A        0   15   15   15   15
 + B        0   15   15   20   35       w=4: B lo (20) + A ka w=1 wala (15) = 35
 + C        0   15   15   20   35       w=4: C lo = 30 < 35 → nahi lete

 answer = 35   (A + B)
```

```java
// 2D table — samajhne ke liye
public int knapsack2D(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];                                          // chhodo
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);   // ya lo
            }
        }
    }
    return dp[n][capacity];
}

// 1D table — space O(W). Capacity PEECHE se!
public int knapsack1D(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];                     // dp[w] = capacity w mein max value
    for (int i = 0; i < weights.length; i++) {
        for (int w = capacity; w >= weights[i]; w--) {     // 🔑 PEECHE se: har item sirf ek baar
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

## Part 2 — 0/1 Knapsack ke chehre: Subset Sum, Partition, Target Sum

### Partition Equal Subset Sum (kya dono hisse barabar ho sakte hain?)

**Soch**: Total sum `S` ka **aadha (`S/2`) kuch numbers se banta hai?** — ye **subset sum** hai: "kya kuch numbers ka sum **exactly `target`** ban sakta hai?" `dp[s]` = *sum `s` ban sakta hai?* (`true/false`).

```java
public boolean canPartition(int[] nums) {
    int sum = 0;
    for (int x : nums) sum += x;
    if (sum % 2 != 0) return false;               // odd sum — barabar do hisse ho hi nahi sakte
    int target = sum / 2;
    boolean[] dp = new boolean[target + 1];        // dp[s] = kuch numbers ka sum exactly s ban sakta hai?
    dp[0] = true;                                   // khaali subset ka sum 0
    for (int x : nums) {
        for (int s = target; s >= x; s--) {        // 🔑 PEECHE se: har number sirf ek baar
            if (dp[s - x]) dp[s] = true;
        }
    }
    return dp[target];
}
```

### Target Sum (har number se `+` ya `−` lagao, kitne tarike?)

**Trick (bahut sundar)**: Jin numbers pe `+` lagaya unka sum `P`, jin pe `−` lagaya unka sum `N`. `P + N = S` (total) aur `P − N = target` ⇒ **`P = (S + target) / 2`**. Ab sawaal ban gaya: **"kitne subsets ka sum `P` hai?"** — 0/1 knapsack (counting).

```java
public int findTargetSumWays(int[] nums, int target) {
    int sum = 0;
    for (int x : nums) sum += x;
    if (Math.abs(target) > sum || (sum + target) % 2 != 0) return 0;   // asambhav
    int need = (sum + target) / 2;                 // 🔑 '+' wale numbers ka sum
    int[] dp = new int[need + 1];                   // dp[s] = kitne subsets ka sum s
    dp[0] = 1;
    for (int x : nums) {
        for (int s = need; s >= x; s--) dp[s] += dp[s - x];   // PEECHE se (0/1)
    }
    return dp[need];
}
```

## Part 3 — Unbounded Knapsack: Coin Change

### Coin Change — minimum coins

**Problem**: `coins` (unlimited) se `amount` banao, **kam se kam coins**. (Yaad hai? [Greedy note](../04-paradigms/18-greedy.md) mein `{4,3,1}` pe greedy fail hua tha — sahi tarika ye DP hai.)

**State**: `dp[a]` = amount `a` banane ke min coins. **Transition**: **aakhri coin** `c` ho toh baaki `a − c` ka best + 1 → `min` over saare coins.

```
coins = {4, 3, 1},  amount = 6

a :   0  1  2  3  4  5  6
dp:   0  1  2  1  1  2  2        dp[6] = min( dp[6-4]+1 = 3,  dp[6-3]+1 = 2,  dp[6-1]+1 = 3 ) = 2  (3 + 3) ✅
```

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);                    // "infinity" — amount + 1 se zyada coins kabhi nahi lagte
    dp[0] = 0;                                       // 0 banane ke 0 coins
    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);   // 🔑 aakhri coin = coin → baaki a − coin ka best + 1
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];   // amount + 1 hi reh gaya → banana mumkin nahi
}
```

### Coin Change II vs Combination Sum IV — loop ka ORDER kya farq laata hai?

Dono mein **kitne tarike** ginne hain, par **order matter** karta hai ya nahi:

```
coins = {1, 2},  amount = 3

Coin Change II    (COMBINATIONS — order matter nahi):   {1,1,1}, {1,2}                  = 2 tarike
Combination Sum IV (PERMUTATIONS — order matter):       1+1+1, 1+2, 2+1                 = 3 tarike

Coins BAHAR wala loop  →  har combination ek hi fixed order mein banti hai  (combinations)
Amount BAHAR wala loop →  har amount pe har coin ko last ki tarah try kiya  (permutations)
```

```java
// Coin Change II — kitne COMBINATIONS
public int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;                                       // 0 banane ka ek hi tarika: kuch mat lo
    for (int coin : coins) {                         // 🔑 coins BAHAR — har coin ek fixed order mein
        for (int a = coin; a <= amount; a++) {       // AAGE se (unbounded: coin kitni bhi baar)
            dp[a] += dp[a - coin];
        }
    }
    return dp[amount];
}

// Combination Sum IV — kitne PERMUTATIONS (1+2 aur 2+1 alag)
public int combinationSum4(int[] nums, int target) {
    int[] dp = new int[target + 1];
    dp[0] = 1;
    for (int t = 1; t <= target; t++) {              // 🔑 amount BAHAR — har amount pe har number ko "aakhri" maano
        for (int x : nums) {
            if (x <= t) dp[t] += dp[t - x];
        }
    }
    return dp[target];
}
```

### Perfect Squares (min squares jinka sum `n`)

```java
public int numSquares(int n) {
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        for (int sq = 1; sq * sq <= i; sq++) {
            dp[i] = Math.min(dp[i], dp[i - sq * sq] + 1);   // "coins" = 1, 4, 9, 16, ... (unbounded)
        }
    }
    return dp[n];
}
```

## Part 4 — Longest Increasing Subsequence (LIS)

**Problem**: `[10, 9, 2, 5, 3, 7, 101, 18]` mein **sabse lamba strictly badhta hua subsequence** (kuch elements hatao, order wahi) — `[2, 3, 7, 18]` = **4**.

**O(n²) DP**: `dp[i]` = **`nums[i]` pe khatam** hone wale LIS ki lambai. Har `j < i` jahan `nums[j] < nums[i]`, wahan se aage badha lo.

**O(n log n) — "taash ke patte (Patience)"**: Ek array `tails` rakho — `tails[k]` = **length `k+1` ke increasing subsequence ka sabse chhota possible aakhri element**. Naya `x` aaye toh `tails` mein **binary search** se uski jagah dhundo: ya toh kisi tail ko **chhota kar do** (behtar option) ya **sabse lamba badha do**.

```
nums = [10, 9, 2, 5, 3, 7, 101, 18]

x=10  → tails = [10]
x=9   → 9 < 10, 10 ki jagah 9      → [9]
x=2   → [2]
x=5   → 5 > 2, jodo                → [2, 5]
x=3   → 3 ne 5 ki jagah li         → [2, 3]          (chhota tail = aage badhne ke zyada mauke)
x=7   → jodo                       → [2, 3, 7]
x=101 → jodo                       → [2, 3, 7, 101]
x=18  → 18 ne 101 ki jagah li      → [2, 3, 7, 18]

length = 4 ✅      (⚠️ tails khud LIS nahi hota, sirf uski lambai sahi hoti hai)
```

```java
// O(n²)
public int lengthOfLIS(int[] nums) {
    int n = nums.length, best = 0;
    int[] dp = new int[n];                           // dp[i] = nums[i] pe KHATAM hone wale LIS ki lambai
    for (int i = 0; i < n; i++) {
        dp[i] = 1;                                    // akela nums[i] bhi ek subsequence
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);   // 🔑 j ke baad nums[i] jod do
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}

// O(n log n) — tails + binary search (lower bound)
public int lengthOfLISFast(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {                             // pehla index dhoondho jahan tails[idx] >= x
            int mid = (lo + hi) / 2;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;                                // 🔑 x ko sahi jagah rakho (ya tail chhota kar do)
        if (lo == size) size++;                       // sabse lamba badh gaya
    }
    return size;
}
```

## Kaunsa DP kab — pehchano

| Problem ka hint | Kya karo |
|---|---|
| "Kuch items chuno, sum/weight **≤ ya = X**" (har ek baar) | 0/1 Knapsack — capacity **peeche se** |
| "Kitne **subsets** ka sum X" | 0/1 counting (`dp[s] += dp[s - x]`) |
| "**Unlimited** coins/items" | Unbounded — capacity **aage se** |
| "**Kitne tarike (combinations)**" | Items **bahar** wala loop |
| "**Kitne tarike (permutations / order matter)**" | Amount **bahar** wala loop |
| "Sabse lamba **badhta hua** subsequence" | LIS (O(n²) ya O(n log n)) |
| Do limits (jaise 0s aur 1s ki ginti) | 2D knapsack (`dp[a][b]`) |

## Common galtiyan

- **Loop direction ulti** — 0/1 mein aage se chalane pe item baar-baar lag jata hai (unbounded ban jata hai).
- **Combinations vs permutations ka loop order** ulta likhna — answer galat ginti.
- **`dp[0]` ka base bhoolna** (`dp[0] = 0` min ke liye, `dp[0] = 1` counting ke liye, `true` boolean ke liye).
- **"Infinity" se `+1` karna** (`Integer.MAX_VALUE + 1` overflow) — `amount + 1` jaisa chhota infinity lo ya check lagao.
- **LIS mein `tails` ko hi answer sequence samajhna** — sirf uski **lambai** sahi hoti hai.
- **LIS mein strictly (`<`) vs non-decreasing (`<=`)** — binary search ka condition (`tails[mid] < x` vs `<= x`) badalta hai.

> 💡 **Interview mein bolne wali line**: *"Ye 0/1 knapsack hai — har number ya lo ya chhodo, target `S/2`. Space O(target) rakhne ke liye main capacity ko peeche se loop karunga, taaki har number sirf ek baar use ho."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Partition Equal Subset Sum | Medium | Subset sum (boolean) | [leetcode.com/problems/partition-equal-subset-sum](https://leetcode.com/problems/partition-equal-subset-sum/) |
| 2 | Coin Change | Medium | Unbounded, min coins | [leetcode.com/problems/coin-change](https://leetcode.com/problems/coin-change/) |
| 3 | Perfect Squares | Medium | Unbounded, coins = squares | [leetcode.com/problems/perfect-squares](https://leetcode.com/problems/perfect-squares/) |
| 4 | Coin Change II | Medium | Combinations (coins bahar) | [leetcode.com/problems/coin-change-ii](https://leetcode.com/problems/coin-change-ii/) |
| 5 | Combination Sum IV | Medium | Permutations (amount bahar) | [leetcode.com/problems/combination-sum-iv](https://leetcode.com/problems/combination-sum-iv/) |
| 6 | Target Sum | Medium | `P = (S + target) / 2` | [leetcode.com/problems/target-sum](https://leetcode.com/problems/target-sum/) |
| 7 | Last Stone Weight II | Medium | Subset sum ka closest half | [leetcode.com/problems/last-stone-weight-ii](https://leetcode.com/problems/last-stone-weight-ii/) |
| 8 | Ones and Zeroes | Medium | 2D knapsack (0s, 1s) | [leetcode.com/problems/ones-and-zeroes](https://leetcode.com/problems/ones-and-zeroes/) |
| 9 | Longest Increasing Subsequence | Medium | O(n²) → O(n log n) | [leetcode.com/problems/longest-increasing-subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) |
| 10 | Maximum Length of Pair Chain | Medium | LIS ka pair version | [leetcode.com/problems/maximum-length-of-pair-chain](https://leetcode.com/problems/maximum-length-of-pair-chain/) |
| 11 | Number of Longest Increasing Subsequence | Medium | LIS + count | [leetcode.com/problems/number-of-longest-increasing-subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) |
| 12 | Russian Doll Envelopes | Hard | Sort + LIS (2D) | [leetcode.com/problems/russian-doll-envelopes](https://leetcode.com/problems/russian-doll-envelopes/) |

Agla: [27-dp-advanced.md](27-dp-advanced.md)
