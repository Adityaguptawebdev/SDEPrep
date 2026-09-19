# 19. Dynamic Programming (DP)

> **Standard definition**: An optimization technique that solves a complex problem by breaking it into overlapping subproblems, solving each subproblem once, and storing (memoizing) its result to avoid redundant recomputation.

**Ek line mein**: Agar ek bada problem **chhote, overlapping subproblems**
mein tootta hai (same subproblem baar-baar solve karna pad raha hai),
uska answer **ek baar solve karke store** kar lo (memoize), dobara solve
mat karo.

**Trick yaad rakhne ki**: *"Exam mein pichhle saal ke solved papers ka
answer yaad rakhna"* — agar wahi sawaal dobara aaye, poora solve karne ki
zarurat nahi, seedha yaad kiya hua jawab likh do. Yehi **memoization** hai.

**Trick pehchanne ki — DP hai ya nahi**: Khud se poocho — *"Kya isme
overlapping subproblems hain (same chhota sawaal baar-baar solve ho raha
hai)?"* aur *"Kya isme optimal substructure hai (bade problem ka best
answer, chhote problems ke best answers se banta hai)?"* Dono "haan" hai
toh DP hai.

**Kab use karo**: **Optimization** problems (minimum/maximum/count ways) —
recursion likhoge toh same calls **baar-baar** repeat hote dikhenge.

## DP ke 4 common types (sab practice karne hain)

| Type | Matlab | Example |
|---|---|---|
| 1D DP | Ek variable pe state depend karta hai | Climbing Stairs, House Robber |
| 2D DP | Do variables pe state (jaise grid, ya 2 strings) | Unique Paths, Edit Distance |
| DP on Subsets | Kisi set ka subset choose karna hai (Knapsack-jaisa) | Partition Equal Subset Sum |
| DP on Strings | Do strings compare/transform karni hain | Longest Common Subsequence, Decode Ways |

## Code example — Climbing Stairs (1D DP)

```java
public int climbStairs(int n) {
    if (n <= 2) return n;

    int[] dp = new int[n + 1];
    dp[1] = 1;   // 1 step door — sirf 1 tarika
    dp[2] = 2;   // 2 steps door — 2 tarike (1+1, ya 2)

    for (int i = 3; i <= n; i++) {
        // 🔑 core insight: i-th step pe pahunchne ke liye, ya toh (i-1) se 1 step chadhe,
        // ya (i-2) se 2 steps chadhe — dono ways ka total
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

**Line by line samjho**: `dp[i]` ka matlab hai "i-th step tak pahunchne ke
kitne tarike hain". Har step pe pahunchne ka **sirf 2 hi tarika** hai — ya
`(i-1)` se ek step lo, ya `(i-2)` se do step lo. Isliye `dp[i] = dp[i-1] +
dp[i-2]` — ye **Fibonacci jaisa hi pattern** hai. Bina DP ke (plain
recursion), `dp[i-2]` jaisi values **baar-baar recompute** hoti, DP unhe
**ek hi baar** compute karke store kar leta hai.

## Practice — kam se kam 7 LeetCode problems (types cover karne ke liye)

| # | Problem | Type | Difficulty | Link |
|---|---|---|---|---|
| 1 | Climbing Stairs | 1D | Easy | [leetcode.com/problems/climbing-stairs](https://leetcode.com/problems/climbing-stairs/) |
| 2 | House Robber | 1D | Medium | [leetcode.com/problems/house-robber](https://leetcode.com/problems/house-robber/) |
| 3 | Unique Paths | 2D | Medium | [leetcode.com/problems/unique-paths](https://leetcode.com/problems/unique-paths/) |
| 4 | Edit Distance | 2D | Medium | [leetcode.com/problems/edit-distance](https://leetcode.com/problems/edit-distance/) |
| 5 | Partition Equal Subset Sum | Subsets | Medium | [leetcode.com/problems/partition-equal-subset-sum](https://leetcode.com/problems/partition-equal-subset-sum/) |
| 6 | Longest Common Subsequence | Strings | Medium | [leetcode.com/problems/longest-common-subsequence](https://leetcode.com/problems/longest-common-subsequence/) |
| 7 | Decode Ways | Strings | Medium | [leetcode.com/problems/decode-ways](https://leetcode.com/problems/decode-ways/) |

Agla: [20-graph-algorithms.md](20-graph-algorithms.md)
