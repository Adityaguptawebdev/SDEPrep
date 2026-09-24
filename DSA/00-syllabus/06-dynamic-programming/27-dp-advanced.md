# 27. DP Advanced (State Machine, Interval, Bitmask, Tree)

> 📍 **Syllabus**: Unit 6 — Dynamic Programming · Topic 27 / 29 · Pehle chahiye: [DP Basics](24-dp-basics.md), [2D DP](25-dp-grid-and-strings.md), [Knapsack](26-dp-knapsack-and-subsequences.md), [Bit Manipulation](../01-basics/06-bit-manipulation.md), [Binary Tree](../03-trees-and-heaps/13-binary-tree.md)

> **Standard definition**: Advanced dynamic programming patterns in which the state encodes more than a simple index — an extra situation flag (state-machine DP), a range `[i, j]` (interval DP), a subset of items represented as a bitmask (bitmask DP), or a tree node with its sub-results (tree DP) — so that overlapping subproblems can still be solved once and reused.

**Ek line mein**: Ab DP ka asli hunar — **"state" khud design karna.** Sawaal khud puchho: *"Agle kadam ke faisle ke liye mujhe **peeche ki kaunsi baat yaad rakhni zaroori hai**?"* — bas wahi state.

**Trick yaad rakhne ki**: *"Board game ki position"* — shatranj mein agla chaal sochne ke liye tumhe **poori history nahi**, sirf **abhi board kaisa hai** wo chahiye. DP ka state bhi wahi "board position" hai: itna hi yaad rakho jisse aage ka faisla ho sake — na kam (galat answer), na zyada (bahut saari states, TLE).

**Kab use karo**: Jab simple `dp[i]` / `dp[i][j]` se kaam na chale — jaise problem mein **"cooldown/holding" jaisi situation**, **range ke andar ka best (`i..j`)**, **choose kiye hue items ka subset (`n ≤ 20`)**, ya **tree ke har node par decision**.

## 4 naye roop ek nazar mein

| Roop | State kya hoga | Kab | Example |
|---|---|---|---|
| **State Machine** | `dp[din][situation]` | "Holding / cooldown / transaction" jaisi conditions | Stock buy-sell |
| **Interval DP** | `dp[i][j]` = range `i..j` ka best | Range ko todkar solve, andar-se-bahar | Burst Balloons |
| **Bitmask DP** | `dp[mask]` = kaunse items le liye | `n ≤ 20`, subset ka track | K Equal Sum Subsets, TSP |
| **Tree DP** | Har node ke liye (kuch values ka pair) | Tree pe decision | House Robber III |

## 1. State Machine DP — Stock (Cooldown ke saath)

**Problem**: `prices[i]` = din `i` ka share ka bhav. Jitni baar chaho buy-sell, par **sell ke baad agle din cooldown** (kuch nahi kar sakte). Max profit?

**Trick**: *"Har din tum ek **situation** mein ho"* — aur situation din-ba-din **badalti** hai (jaise traffic signal). Yahan 3 situations:

```
HOLD  → share hai tumhare paas
SOLD  → aaj hi share becha (kal cooldown)
REST  → share nahi hai aur khareed sakte ho (free)

Aaj ki situation ← kal ki situation se:
   HOLD ← kal HOLD (rakhe rahe)   ya   kal REST mein thay aur aaj KHAREEDA (−price)
   SOLD ← kal HOLD tha aur aaj BECHA (+price)
   REST ← kal REST (kuch nahi kiya)   ya   kal SOLD (cooldown khatam)
```

```java
public int maxProfit(int[] prices) {
    int hold = Integer.MIN_VALUE / 2;     // shuru mein share nahi → HOLD asambhav (bahut negative)
    int sold = 0;
    int rest = 0;
    for (int p : prices) {
        int prevHold = hold, prevSold = sold, prevRest = rest;
        hold = Math.max(prevHold, prevRest - p);   // 🔑 rakho, ya REST se khareedo (SOLD se seedha khareed nahi sakte — cooldown)
        sold = prevHold + p;                        // HOLD tha, aaj becha
        rest = Math.max(prevRest, prevSold);        // kuch nahi kiya, ya cooldown khatam hua
    }
    return Math.max(sold, rest);                    // aakhir mein share hold karna faayda nahi
}
```

**Line by line samjho**: Har din **teeno situations ke best profit** update hote hain, aur **naye value purane (`prev...`) se** bante hain (isliye copy). Time **O(n)**, space **O(1)**.

**"At most K transactions"** (Stock IV): situation ke saath **`t` = kitne transactions ho chuke** bhi state mein.

```java
public int maxProfitK(int k, int[] prices) {
    int n = prices.length;
    if (k == 0 || n < 2) return 0;
    if (k >= n / 2) {                                // itne transactions ki zarurat hi nahi — jitni baar chaho jaisa
        int profit = 0;
        for (int i = 1; i < n; i++) if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        return profit;
    }
    int[] buy = new int[k + 1];                      // buy[t]  = t-th transaction ki khareed ke baad best (cash)
    int[] sell = new int[k + 1];                     // sell[t] = t-th transaction poori hone ke baad best (cash)
    Arrays.fill(buy, Integer.MIN_VALUE / 2);
    for (int p : prices) {
        for (int t = 1; t <= k; t++) {
            buy[t] = Math.max(buy[t], sell[t - 1] - p);   // pichhli (t−1) poori karke t-th khareedo
            sell[t] = Math.max(sell[t], buy[t] + p);      // t-th becho
        }
    }
    return sell[k];
}
```

## 2. Interval DP — Burst Balloons

**Problem**: Balloons `nums[]`. Balloon `i` phodne pe coins = `nums[left] × nums[i] × nums[right]` (jo abhi padosi hain). Sab phodke **max coins**?

**Kyun mushkil?** Pehle konsa phodo — har choice se padosi badal jate hain, subproblems **independent nahi**.

**Trick (dimag ghuma dene wala)**: *"Pehle nahi — **AAKHRI** balloon socho."* Range `(i, j)` mein agar `k` **sabse aakhir mein** phoda jaye, toh us waqt uske padosi **`i` aur `j`** hi hain (beech ke sab pehle phut chuke) — aur `k` ke **baayein** aur **daayein** ke subproblems **ek-doosre se alag** hain!

```
nums = [3, 1, 5, 8]   dono taraf 1 ka padding → [1, 3, 1, 5, 8, 1]

dp[i][j] = i aur j ke BEECH ke saare balloons phodne ka max (i, j khud nahi phodte)

dp[i][j] = max over k in (i, j) of:   dp[i][k]  +  dp[k][j]  +  val[i] × val[k] × val[j]
                                      (baayein)    (daayein)    (k aakhri: padosi i aur j)

Order: chhoti range (gap) se badi range tak.   Answer = dp[0][n+1] = 167
```

```java
public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] val = new int[n + 2];
    val[0] = val[n + 1] = 1;                           // 🔑 dono taraf 1 ka padding
    for (int i = 0; i < n; i++) val[i + 1] = nums[i];

    int[][] dp = new int[n + 2][n + 2];                // dp[i][j] = (i, j) ke beech ke balloons ka max coins
    for (int len = 2; len <= n + 1; len++) {           // gap chhote se bada (chhoti range pehle chahiye)
        for (int i = 0; i + len <= n + 1; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++) {          // k = is range mein AAKHRI phoda jaane wala balloon
                dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k][j] + val[i] * val[k] * val[j]);
            }
        }
    }
    return dp[0][n + 1];
}
```

**Interval DP ka template**: `dp[i][j]` ko `dp[i][k]` aur `dp[k][j]` (chhoti ranges) se banao, **gap (length) ke order mein**. Time **O(n³)**. Aur pehle dekha hua [Longest Palindromic Subsequence](25-dp-grid-and-strings.md) bhi isi family ka hai.

## 3. Bitmask DP — K Equal Sum Subsets

**Problem**: `nums` ko `k` **barabar-sum** subsets mein baant sakte ho? (`n ≤ 16`)

**Trick**: *"Shaadi ke mehmaanon ka tick-box"* ([Bit Manipulation](../01-basics/06-bit-manipulation.md) mein dekha) — **kaunse numbers ab tak baante ja chuke** wo ek `mask` mein. `dp[mask]` = mask ke numbers rakhne ke baad **current (adhoore) bucket mein kitna bhara hai**. Bucket `target` tak bhar gaya toh **0 se naya bucket** (`% target`).

```
nums = [4, 3, 2, 3, 5, 2, 1],  k = 4,  sum = 20,  target = 5

mask mein kaunse numbers aaye → dp[mask] = current bucket ka bhara hua hissa
Ek number `i` add karo (agar mask mein nahi hai aur bucket overflow nahi hota):
       dp[mask | (1<<i)] = (dp[mask] + nums[i]) % target

Aakhir mein saare bits ON (mask = 2ⁿ − 1) aur dp[...] == 0  ⇒  saare buckets exactly bhar gaye ✅
```

```java
// (nums[i] >= 1 maan ke)
public boolean canPartitionKSubsets(int[] nums, int k) {
    int sum = 0;
    for (int x : nums) sum += x;
    if (sum % k != 0) return false;
    int target = sum / k;
    int n = nums.length;

    int[] dp = new int[1 << n];                        // dp[mask] = current bucket mein bhara hua (-1 = ye mask banana asambhav)
    Arrays.fill(dp, -1);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] == -1) continue;                  // ye mask kabhi ban hi nahi sakta
        for (int i = 0; i < n; i++) {
            if ((mask >> i & 1) == 1) continue;                  // i pehle se le liya
            if (dp[mask] + nums[i] > target) continue;           // current bucket overflow ho jayega
            dp[mask | (1 << i)] = (dp[mask] + nums[i]) % target; // 🔑 bucket bhara toh 0 (naya bucket)
        }
    }
    return dp[(1 << n) - 1] == 0;                      // saare numbers baant diye aur koi bucket adhoora nahi
}
```

**Time O(n · 2ⁿ)**. Bitmask DP ka sabse famous example **Travelling Salesman (TSP)**: `dp[mask][last]` = `mask` ke shehar ghoom liye aur abhi `last` pe hain — minimum cost. `n ≤ 20` tak chalta hai.

## 4. Tree DP — House Robber III

**Problem**: Ghar ek **binary tree** mein hain. **Parent aur bachcha (seedhe judey) dono nahi loot sakte.** Max paisa?

**Trick**: *"Har node apne baap ko **do jawab** deta hai: 'agar mujhe **chhoda** toh best kya', 'agar mujhe **liya** toh best kya'."* Baap dono jawab dekhke faisla karta hai. Ye [Binary Tree](../03-trees-and-heaps/13-binary-tree.md) ka **bottom-up** style hai — bas har node **ek ki jagah do values** return karta hai.

```
Har node ke saath {CHHODO, LO} likha hai:

                    3   {6, 7}                  root: LO = 3 + (2 ka CHHODO = 3) + (3 ka CHHODO = 1) = 7
                  /   \                                CHHODO = max(3,2) + max(1,3) = 6
   {3, 2}        2     3   {1, 3}
                  \     \
         {0, 3}    3     1   {0, 1}             leaf: {0, val}

answer = max(6, 7) = 7      (root 3 + neeche ka 3 + neeche ka 1)
```

```java
public int rob(TreeNode root) {
    int[] res = dfs(root);
    return Math.max(res[0], res[1]);
}

// return {is node ko CHHODNE pe best, is node ko LENE pe best}
private int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] left = dfs(node.left);
    int[] right = dfs(node.right);
    int skip = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);   // node chhodo → bachche jo behtar karein
    int take = node.val + left[0] + right[0];                                // 🔑 node lo → bachche NAHI le sakte
    return new int[]{skip, take};
}
```

## State kaise chuno — checklist

```
1. Faisla kya hai har step pe? (lo/chhodo, khareedo/becho, kahan kaato ...)
2. Us faisle ke liye peeche ki kaunsi cheez yaad rakhni zaroori hai?  → wahi state ke dimensions
3. State ka size kitna (n × situation, n², 2ⁿ) — constraints mein fit hota hai?
4. Ek state se agli states kaunsi (transition) — order kya?
```

| State ka size | Kab chalega |
|---|---|
| `n × (chhoti situations)` | `n` ≤ 10⁵ |
| `n²` | `n` ≤ 5000 |
| `n³` | `n` ≤ 500 |
| `2ⁿ × n` | `n` ≤ 20 |

## DP ki poori seedhi (Unit 6 ka saar)

```
1D          →  dp[i]                      (Climbing Stairs, House Robber)
2D          →  dp[i][j]                   (Grid, LCS, Edit Distance)
Knapsack    →  dp[capacity]               (lo/chhodo + limit)
Subsequence →  dp[i] = i pe khatam       (LIS)
State M/C   →  dp[i][situation]          (Stocks)
Interval    →  dp[i][j] = range          (Burst Balloons)
Bitmask     →  dp[mask]                   (subset)
Tree        →  node ke liye value-pair    (House Robber III)
```

**Har baar wahi 5 step**: State → Transition → Base → Order → Answer ([DP Basics](24-dp-basics.md)).

## Common galtiyan

- **Stock DP mein naye values ko purane values se hi banana** — `hold` update karke turant `sold` mein use kar lena (copy `prev...` rakho).
- **Interval DP mein galat order** — badi range pehle bharna; **gap chhote se bada** chalo.
- **Bitmask mein `1 << i` ke bajaye `1 << n` bhoolna** — `1 << n` = 2ⁿ (mask ki total ginti).
- **Tree DP mein sirf ek value return karna** jab do situations chahiye (lo / chhodo).
- **State bahut bada rakhna** (poori history) — constraints se pehle check karo ki table fit hoti hai ya nahi.

> 💡 **Interview mein bolne wali line**: *"Yahan har din ki ek situation hai (hold/sold/rest), aur kal ki situation aaj ki decide karti hai, isliye state machine DP — teen variables, O(1) space, O(n) time."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Best Time to Buy and Sell Stock with Cooldown | Medium | State machine (3 states) | [leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) |
| 2 | Best Time to Buy and Sell Stock with Transaction Fee | Medium | State machine + fee | [leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) |
| 3 | House Robber III | Medium | Tree DP (do values) | [leetcode.com/problems/house-robber-iii](https://leetcode.com/problems/house-robber-iii/) |
| 4 | Partition to K Equal Sum Subsets | Medium | Bitmask DP | [leetcode.com/problems/partition-to-k-equal-sum-subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/) |
| 5 | Best Time to Buy and Sell Stock III | Hard | Max 2 transactions | [leetcode.com/problems/best-time-to-buy-and-sell-stock-iii](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) |
| 6 | Best Time to Buy and Sell Stock IV | Hard | Max K transactions | [leetcode.com/problems/best-time-to-buy-and-sell-stock-iv](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) |
| 7 | Binary Tree Cameras | Hard | Tree DP (3 states) | [leetcode.com/problems/binary-tree-cameras](https://leetcode.com/problems/binary-tree-cameras/) |
| 8 | Burst Balloons | Hard | Interval DP (last burst) | [leetcode.com/problems/burst-balloons](https://leetcode.com/problems/burst-balloons/) |
| 9 | Minimum Cost to Cut a Stick | Hard | Interval DP | [leetcode.com/problems/minimum-cost-to-cut-a-stick](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/) |
| 10 | Palindrome Partitioning II | Hard | Cuts DP + palindrome table | [leetcode.com/problems/palindrome-partitioning-ii](https://leetcode.com/problems/palindrome-partitioning-ii/) |
| 11 | Shortest Path Visiting All Nodes | Hard | Bitmask + BFS | [leetcode.com/problems/shortest-path-visiting-all-nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) |
| 12 | Cherry Pickup | Hard | DP on two paths at once | [leetcode.com/problems/cherry-pickup](https://leetcode.com/problems/cherry-pickup/) |

---

## ✅ Unit 6 (Dynamic Programming) khatam!

**DP Basics → 2D → Knapsack → Advanced** — ab tum recursion ko memo/table mein badalna aur **state khud design karna** jaante ho. Interview ke sabse mushkil topic ki neev pakki hai.

Aakhri unit mein do **advanced tools** hain — jo bade-bade interviews mein "wow" wale sawaalon mein aate hain: **range queries with updates** aur **fast string matching.**

Agla: [Unit 7 — Advanced → Segment Tree & Fenwick Tree](../07-advanced/28-segment-tree-and-fenwick.md)
