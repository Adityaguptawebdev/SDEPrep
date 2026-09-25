# DSA 7/8 — Dynamic Programming

**Easy analogy — DP = exam ke rough notes**: Ek hi sum baar-baar solve mat karo — pehli baar ka jawab margin mein likh lo (memo), agli baar seedha utha lo. DP question pehchanne ka tareeka: "**har step pe choice** (lo/chhodo) + **pichhle choices ka result dobara chahiye**".

| # | Problem | Reporter level | Freq | Status |
|---|---|---|---|---|
| 1 | House Robber → circular House Robber II ("max non-adjacent coins") | **EC ×2** + ? | **HIGH** (3) | Exact / Close |
| 2 | Word Break | **EC (10 months)** | LOW | Exact |
| 3 | Best Time to Buy and Sell Stock (I, II, cooldown) | Senior ×3 | **HIGH** (3, senior) | Exact |
| 4 | Longest Increasing Subsequence (+ O(n log n)) | Staff | LOW | Exact |
| 5 | Bricks: minimum cost to reach ≥ 100 kg (greedy vs DP) | Intern | LOW | Reconstructed |
| 6 | Subsets with sum k · Combination Sum III | Senior · Staff | LOW each | Exact |

---

## 1. House Robber → House Robber II (circular)

| Field | Details |
|---|---|
| **Reported problems** | "one dsa and one follow up (max non-adjacent coin collection) and follow up was similar to circular house robber problem" ([LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/), Feb 2026, **SWE, 10 months**, offer) · "1 DSA question similar to house-robber-ii" ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/), Apr 2025, **SWE, 1 YOE**, selected) · "House robber problem" ([LC-6536057](https://leetcode.com/discuss/post/6536057/visa-interview-experience-ghosted-by-rec-2xye/), Mar 2025) — [LC 198](https://leetcode.com/problems/house-robber/) / [LC 213](https://leetcode.com/problems/house-robber-ii/) |
| **Round** | Technical round 2/3 |
| **Difficulty** | Medium |
| **Pattern** | 1D DP "take or skip"; circular → run the linear version twice (without first / without last) |
| **Frequency** | **HIGH** (3 reports, 2 of them early-career selected candidates) |

**Brute force**: try every subset of non-adjacent houses → O(2ⁿ).
**Optimal**: `best(i) = max(best(i−1), best(i−2) + coins[i])` — either skip house `i` or take it (then `i−1` is forbidden). Only two previous values are needed → O(1) space.
**Circular**: the first and last houses are neighbours, so you can't take both. Answer = `max(linear(0..n−2), linear(1..n−1))`.

```
 coins    2   7   9   3   1
 best     2   7  11  11  12        best(i) = max(best(i-1), best(i-2) + coins[i])
                                   11 = max(7, 2+9);  12 = max(11, 11+1)
 circular [2,3,2]: without last → 2+? → max(2,3)=3 ; without first → 3 ; answer 3 (not 4)
```

```java
class HouseRobber {
    static long linear(int[] coins, int from, int to) {          // inclusive range
        long prev2 = 0, prev1 = 0;                               // best up to i-2, i-1
        for (int i = from; i <= to; i++) {
            long cur = Math.max(prev1, prev2 + coins[i]);        // skip i  vs  take i
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    static long rob(int[] coins) {
        return coins.length == 0 ? 0 : linear(coins, 0, coins.length - 1);
    }

    static long robCircular(int[] coins) {
        int n = coins.length;
        if (n == 0) return 0;
        if (n == 1) return coins[0];
        return Math.max(linear(coins, 0, n - 2), linear(coins, 1, n - 1));   // never both ends
    }
}
```

**Time**: O(n). **Space**: O(1).
**Follow-ups**: print which houses were robbed (keep a `dp[]` array and walk back) · houses in a binary tree ([LC 337](https://leetcode.com/problems/house-robber-iii/)) · negative values? (skipping is free, so the formula still works) · "delete and earn" ([LC 740](https://leetcode.com/problems/delete-and-earn/), same recurrence after bucketing).
**🗣️ Interview mein aise bolo**: "Har ghar pe do choice — lo toh pichhla ghar nahi le sakte, chhodo toh pichhla best chalega. `dp[i] = max(dp[i−1], dp[i−2] + a[i])`, sirf do variables. Circular mein first aur last dono nahi le sakte, toh do baar linear chalao — ek bina first ke, ek bina last ke."

---

## 2. Word Break

| Field | Details |
|---|---|
| **Reported problem** | "one DSA (word break problem)" — **Exact** ([LC 139](https://leetcode.com/problems/word-break/)) |
| **Source** | [LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/) · Jan 2026 · **SWE, 10 months** (offer) |
| **Round** | Development-track round 1 (with the hiring manager: experience + projects + 1 DSA) |
| **Difficulty** | Medium |
| **Pattern** | Prefix DP: `ok[i]` = can `s[0..i)` be split into dictionary words |
| **Frequency** | LOW (a Senior Data Scientist round asked a CamelCase variant in Python: [LC-6937441](https://leetcode.com/discuss/post/6937441/visa-coding-round-bengaluru-senior-data-t3zk2/)) |

**Brute force**: recursion trying every prefix → O(2ⁿ) in the worst case (`"aaaa…ab"`).
**Optimal**: `ok[i] = true` if some `j < i` has `ok[j]` and `s[j..i)` in the dictionary. Limit `j` to the longest word length.

```
 s = "visapay", dict = {visa, pay, vis, apay}
 ok[0]=T  ok[3]("vis")=T  ok[4]("visa")=T  ok[7]: "pay" from 4 ✔ (or "apay" from 3 ✔) → true
```

```java
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class WordBreak {
    static boolean canSegment(String s, List<String> words) {
        Set<String> dict = new HashSet<>(words);
        int maxLen = 0;
        for (String w : words) maxLen = Math.max(maxLen, w.length());
        boolean[] ok = new boolean[s.length() + 1];
        ok[0] = true;                                            // empty prefix
        for (int i = 1; i <= s.length(); i++) {
            for (int j = i - 1; j >= Math.max(0, i - maxLen); j--) {
                if (ok[j] && dict.contains(s.substring(j, i))) { ok[i] = true; break; }
            }
        }
        return ok[s.length()];
    }
}
```

**Time**: O(n · maxLen · maxLen) (substring cost). **Space**: O(n).
**Follow-ups**: return all sentences ([LC 140](https://leetcode.com/problems/word-break-ii/), backtracking + memo) · very large dictionary → Trie to walk prefixes · case-insensitive CamelCase splitting.
**🗣️ Interview mein aise bolo**: "`ok[i]` matlab pehle i characters todne layak hain. Har i ke liye pichhle j dekhta hoon jahan `ok[j]` true aur beech ka tukda dictionary mein ho. Recursion + memo bhi same cheez hai."

---

## 3. Best Time to Buy and Sell Stock — I, II, with cooldown *(Senior reports)*

| Field | Details |
|---|---|
| **Reported problems** | I ([LC 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)) — [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) (Senior, 2022) · I and II ([LC 122](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)) — [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/) (Senior, 2026) · with cooldown ([LC 309](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)) — [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/) (Senior, 3 YOE, 2023: "got stuck… 1–2 hints") — **Exact** |
| **Round** | Coding rounds | **Difficulty**: Easy / Medium / Medium | **Pattern**: running min (I) · sum of rises (II) · state machine DP (cooldown) | **Frequency**: **HIGH** (3, all Senior) |

```
 cooldown states per day:   hold ──sell──► sold ──(1 day)──► rest ──buy──► hold
 hold[i] = max(hold[i-1], rest[i-1] - p)   sold[i] = hold[i-1] + p   rest[i] = max(rest[i-1], sold[i-1])
```

```java
class StockProfits {
    static int oneTransaction(int[] p) {                         // LC 121
        int minSoFar = Integer.MAX_VALUE, best = 0;
        for (int price : p) {
            minSoFar = Math.min(minSoFar, price);
            best = Math.max(best, price - minSoFar);
        }
        return best;
    }

    static int unlimited(int[] p) {                              // LC 122: take every rise
        int profit = 0;
        for (int i = 1; i < p.length; i++) profit += Math.max(0, p[i] - p[i - 1]);
        return profit;
    }

    static int withCooldown(int[] p) {                           // LC 309
        long hold = Long.MIN_VALUE / 2, sold = 0, rest = 0;
        for (int price : p) {
            long prevHold = hold, prevSold = sold;
            hold = Math.max(hold, rest - price);                 // keep holding, or buy after resting
            sold = prevHold + price;                             // sell today
            rest = Math.max(rest, prevSold);                     // yesterday's sale → cooldown ends
        }
        return (int) Math.max(sold, rest);
    }
}
```

**Time**: O(n) each. **Space**: O(1).
**🗣️ Interview mein aise bolo**: "Cooldown mein states likh deta hoon — hold, sold, rest — aur har din ke transitions. State machine bana lo toh DP apne aap likh jaati hai."

---

## 4. Longest Increasing Subsequence *(Staff report)*

| Field | Details |
|---|---|
| **Reported problem** | "Find the longest strictly increasing subsequence. I solved it with O(n²) DP. Follow-up: can you optimise this?" — the candidate thought "binary search on answers" but it is **patience sorting** (binary search on a `tails` array) — **Exact** ([LC 300](https://leetcode.com/problems/longest-increasing-subsequence/)) |
| **Source** | [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/) · May 2026 · **Staff**, 8.8 YOE, Bangalore · round 1 | **Difficulty**: Medium | **Frequency**: LOW |

```
 nums: 10 9 2 5 3 7 101 18
 tails (smallest tail of an increasing subsequence of each length):
 10 → [10]; 9 → [9]; 2 → [2]; 5 → [2,5]; 3 → [2,3]; 7 → [2,3,7]; 101 → [2,3,7,101]; 18 → [2,3,7,18]
 LIS length = 4
```

```java
import java.util.Arrays;

class LongestIncreasingSubsequence {
    static int quadratic(int[] a) {                              // O(n²) DP: dp[i] = LIS ending at i
        int[] dp = new int[a.length];
        int best = 0;
        for (int i = 0; i < a.length; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            best = Math.max(best, dp[i]);
        }
        return best;
    }

    static int nLogN(int[] a) {                                  // patience sorting
        int[] tails = new int[a.length];
        int size = 0;
        for (int x : a) {
            int pos = Arrays.binarySearch(tails, 0, size, x);
            if (pos < 0) pos = -(pos + 1);                        // first tail >= x
            tails[pos] = x;                                      // x improves (lowers) that tail
            if (pos == size) size++;                             // x extends the longest one
        }
        return size;
    }
}
```

**Time**: O(n²) → O(n log n). **Space**: O(n).

---

## 5. Bricks — minimum cost to reach at least 100 kg

| Field | Details |
|---|---|
| **Reported problem** | "Bricks with weights and costs — find the minimum bricks required for 100 kg at least cost (greedy problem). Had to explain greedy approach justification, sorting methodology, and a Dynamic Programming alternative." — **Reconstructed**: we assume unlimited bricks of each type and "at least W kg". |
| **Source** | [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/) · Oct 2025 · **SWE intern**, NIT, on-campus (selected) |
| **Round** | Technical + HR | **Difficulty**: Medium | **Pattern**: unbounded knapsack (min cost to reach ≥ W) | **Frequency**: LOW |

**Why greedy is risky**: sorting by cost-per-kg and filling greedily can overshoot. Types `A = 60 kg for ₹60` (₹1/kg) and `B = 50 kg for ₹55` (₹1.1/kg), target 100 kg: greedy takes 2×A = ₹120, but 2×B = 100 kg for **₹110**. Say this in the interview — it is exactly the "justify greedy, then give DP" discussion they reported.

```java
import java.util.Arrays;

class BricksMinCost {
    // dp[w] = min cost to get AT LEAST w kg (w capped at target)
    static long minCost(int[] weight, int[] cost, int target) {
        long INF = Long.MAX_VALUE / 4;
        long[] dp = new long[target + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int w = 1; w <= target; w++) {
            for (int i = 0; i < weight.length; i++) {
                int before = Math.max(0, w - weight[i]);          // overshooting is allowed
                if (dp[before] < INF) dp[w] = Math.min(dp[w], dp[before] + cost[i]);
            }
        }
        return dp[target] >= INF ? -1 : dp[target];
    }

    public static void main(String[] args) {
        System.out.println(minCost(new int[]{60, 50}, new int[]{60, 55}, 100));   // DP answer
    }
}
```

```text
110
```

**Time**: O(W · types). **Space**: O(W).

---

## 6. Subsets with sum k · Combination Sum III

| Field | Details |
|---|---|
| **Reported problems** | "Print the subset with sum k" ([LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/), Senior full stack, 2024) · "Combination Sum III: attempted, couldn't complete due to debugging issues — the critical miss" ([LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/), Staff, 2025; [LC 216](https://leetcode.com/problems/combination-sum-iii/)) — **Exact** |
| **Difficulty** | Medium | **Pattern**: backtracking (include / exclude) | **Frequency**: LOW each |

```java
import java.util.ArrayList;
import java.util.List;

class SubsetSums {
    static List<List<Integer>> subsetsWithSum(int[] a, int k) {    // every subset (by index) summing to k
        List<List<Integer>> out = new ArrayList<>();
        pick(a, 0, k, new ArrayList<>(), out);
        return out;
    }

    private static void pick(int[] a, int i, int remaining, List<Integer> cur, List<List<Integer>> out) {
        if (i == a.length) {
            if (remaining == 0) out.add(new ArrayList<>(cur));
            return;
        }
        cur.add(a[i]);                                             // include a[i]
        pick(a, i + 1, remaining - a[i], cur, out);
        cur.remove(cur.size() - 1);                                // exclude a[i]
        pick(a, i + 1, remaining, cur, out);
    }

    static List<List<Integer>> combinationSum3(int k, int n) {     // k distinct digits 1..9 summing to n
        List<List<Integer>> out = new ArrayList<>();
        digits(1, k, n, new ArrayList<>(), out);
        return out;
    }

    private static void digits(int start, int k, int remaining, List<Integer> cur, List<List<Integer>> out) {
        if (cur.size() == k) {
            if (remaining == 0) out.add(new ArrayList<>(cur));
            return;
        }
        for (int d = start; d <= 9 && d <= remaining; d++) {       // prune: digits are increasing
            cur.add(d);
            digits(d + 1, k, remaining - d, cur, out);
            cur.remove(cur.size() - 1);
        }
    }
}
```

**Time**: O(2ⁿ · n) for subsets · tiny for Combination Sum III (at most C(9, k)). **Space**: O(n) recursion.
**Lesson from the Staff report**: the candidate lost the round on **debugging**, not the idea — practise writing backtracking cleanly: choose → recurse → un-choose, and copy the list when saving.

**Other DP asked only at Senior level in 2021** (practice links): [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/), [Get the Maximum Score](https://leetcode.com/problems/get-the-maximum-score/) ([LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/)).

---

⚡ **Quick revision**: take/skip → `max(dp[i−1], dp[i−2] + a[i])` · circular → run linear twice · prefix split → `ok[i]` over `j` · stocks → running min / sum of rises / state machine · LIS → `tails` + binary search · "at least W" knapsack → `dp[max(0, w − weight)]` · backtracking → choose, recurse, un-choose.

Next: [DSA 8/8 — File & log processing →](08-file-and-log-processing.md)
