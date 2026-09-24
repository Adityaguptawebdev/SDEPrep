# 18. Greedy Algorithms

> 📍 **Syllabus**: Unit 4 — Paradigms · Topic 18 / 29 · Pehle chahiye: [Sorting](../01-basics/07-sorting.md), [Heap](../03-trees-and-heaps/15-heap-priority-queue.md)

> **Standard definition**: An algorithmic paradigm that builds a solution step by step by always making the locally optimal choice at each step; it yields a globally optimal solution when the problem has the greedy-choice property and optimal substructure.

**Ek line mein**: **Har step pe abhi ka sabse achha option chuno, aur peeche mudke kabhi mat dekho.** Koi undo nahi (backtracking se ulta), koi sab options ka hisaab nahi (DP se ulta) — bas **ek rule, ek pass**.

**Trick yaad rakhne ki**: *"Dukaandaar chhutte paise lautata hai"* — tumhe 87 rupay lautane hain. Dukaandaar **sabse bada note/coin pehle** deta hai: 50, phir 20, phir 10, 5, 2. Wo har baar sochta nahi ki "kya pehle 20 dene se fayda hoga?" — bas **jo abhi sabse bada fit ho, wo utha leta hai**. Ye greedy hai.

**Kab use karo**: **Optimization** (min/max) problems mein jab **"abhi ka best choice aage kabhi nuksaan nahi karega"** ka pakka bharosa ho — **intervals/scheduling, jumps, "sabse kam/zyada cheezein"**. Ye aksar **sort ya heap** ke saath aata hai. Fast hota hai (O(n log n) ya O(n)), par **har problem pe chalta nahi.**

## ⚠️ Greedy kab FAIL hota hai (sabse zaroori sawaal)

Dukaandaar wala rule tabhi chalta hai jab notes **{50, 20, 10, 5, 2, 1}** jaise hon. Ab socho ek ajeeb desh ke coins **{4, 3, 1}** hain aur tumhe **6** lautana hai:

```
Greedy (sabse bada pehle):   4 + 1 + 1        = 3 coins
Sabse achha (optimal):       3 + 3            = 2 coins   ← greedy haar gaya! ❌

Greedy ne 4 utha liya (abhi ka best), par uske baad ka raasta kharab nikla.
```

Aisi problems **DP** se hoti hain ([DP Knapsack & Subsequences](../06-dynamic-programming/26-dp-knapsack-and-subsequences.md)). Toh greedy kab sahi hai?

| Do sharten | Matlab |
|---|---|
| **Greedy-choice property** | Abhi ka local best choice lene ke baad bhi global best answer **mumkin rehta hai** |
| **Optimal substructure** | Choice ke baad bacha hua problem bhi wahi type ka chhota problem hai |

**Proof ka tarika (exchange argument — aasan bhasha mein)**: *"Maan lo koi optimal answer hai jisme mera greedy choice nahi hai. Main us answer ka ek choice **badal ke** apna greedy choice laga du — kya answer kharab hota hai? Nahi hota, toh greedy choice safe hai."*

**Interview trick**: Greedy laga ke **chhote counterexample** (2–4 elements) socho ya brute force se compare karo. Ek bhi galat nikla toh DP.

## Code example 1 — Coin change (jab greedy chalta hai)

```java
// coinsDesc BADE se CHHOTE sorted ho. Sirf "canonical" coin systems (jaise Indian notes) pe sahi
public int minCoinsGreedy(int[] coinsDesc, int amount) {
    int count = 0;
    for (int coin : coinsDesc) {
        count += amount / coin;      // 🔑 is coin ke jitne bhi lag sakte hain, utne le lo (sabse bada pehle)
        amount %= coin;              // bacha hua amount
    }
    return amount == 0 ? count : -1; // amount poora lautaya ya nahi
}
```

`{50, 20, 10, 5, 2, 1}` aur `87` → `50 + 20 + 10 + 5 + 2` = **5 coins** ✅. Par `{4, 3, 1}` aur `6` pe ye **3** dega jabki sahi answer **2** hai — upar wala jaal.

## Code example 2 — Non-overlapping Intervals (Activity Selection)

**Problem**: Kuch meetings/intervals hain. **Kam se kam kitne hatane padenge** taaki koi overlap na rahe? (= zyada se zyada meetings rakho.)

**Trick**: *"Jo meeting **sabse jaldi khatam** hoti hai use pehle chuno"* — wo baaki sabke liye **sabse zyada waqt chhod deti hai**. (Start time se sort karna galat hai: ek lambi meeting poora din kha sakti hai.)

```
[[1,2], [2,3], [3,4], [1,3]]     END time se sort:  [1,2] [2,3] [1,3] [3,4]

time:     1   2   3   4
[1,2]     ████                    ✓ rakha         (lastEnd = 2)
[2,3]         ████                ✓ rakha         (2 ≥ 2 : chhoone ki ijaazat hai)   (lastEnd = 3)
[1,3]     ████████                ✗ hata          (1 < 3 : overlap)
[3,4]             ████            ✓ rakha         (3 ≥ 3)

rakhe 3, kul 4 → hatana pada 4 − 3 = 1
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));   // 🔑 END time se sort: jo jaldi khatam, wo pehle
    int kept = 0;
    int lastEnd = Integer.MIN_VALUE;
    for (int[] in : intervals) {
        if (in[0] >= lastEnd) {          // pichhli rakhi meeting ke baad shuru hoti hai → rakh lo
            kept++;
            lastEnd = in[1];
        }                                // warna overlap → ise skip (hata diya)
    }
    return intervals.length - kept;
}
```

Interval problems ka poora pattern: [Merge Intervals](../../01-patterns/04-merge-intervals.md).

## Code example 3 — Jump Game I aur II

**Jump Game**: `nums[i]` = `i` se **max** kitna aage jump kar sakte ho. Kya aakhri index tak pahunch sakte ho?

**Trick**: *"Bas ye yaad rakho ki ab tak sabse door kahan tak pahunch sakte ho (`farthest`)."* Agar koi index `farthest` se bhi door hai toh wahan pahunche hi nahi.

```java
public boolean canJump(int[] nums) {
    int farthest = 0;                                  // ab tak jahan tak pahunch sakte hain
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;                // 🔑 is index tak pahunch hi nahi paye → atak gaye
        farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
}

// Jump Game II — kam se kam kitne jumps? (aakhri tak pahunchna pakka hai)
public int jump(int[] nums) {
    int jumps = 0, currentEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == currentEnd) {                         // 🔑 is jump ki range khatam → ek aur jump lena hi padega
            jumps++;
            currentEnd = farthest;                     // naye jump se jahan tak pahunch sakte hain
        }
    }
    return jumps;
}
```

```
nums = [2, 3, 1, 1, 4]
idx :   0  1  2  3  4

Jump 1: index 0 se  →  range [1, 2]   (farthest = 2)
Jump 2: us range mein sabse door jaane wala index 1 (1 + 3 = 4)  →  aakhir tak ✅     →  2 jumps
```

**Line by line samjho**: `jump` ek tarah ka **BFS** hai — `currentEnd` = "is jump se jahan tak pahunch sakte ho", uske andar ke saare indexes dekhte hue `farthest` badhate ho; jaise hi `currentEnd` tak pahunche, ek jump **zaroori** ho gaya.

## Code example 4 — Gas Station

**Problem**: Ek gol raaste pe `n` petrol pump. `gas[i]` = milne wala petrol, `cost[i]` = agle pump tak jaane ka kharch. **Kaunse pump se shuru karein** taaki poora chakkar lag jaye? (Nahi ho sakta toh −1.)

**Trick**: *"Agar `i` tak aate-aate tank negative ho gaya, toh **shuru ke saare pumps** (jahan se chale the, `i` tak) galat the — agla start `i + 1`."* Aur agar **poore chakkar mein total petrol ≥ total kharch** hai toh koi na koi start zaroor kaam karega.

```java
public int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        total += diff;                 // poore chakkar ka net petrol
        tank += diff;                  // current start se ab tak ka tank
        if (tank < 0) {                // 🔑 yahan tak nahi pahunch sakte → start ko i + 1 pe le jao
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;    // total kam hai toh koi start kaam nahi karega
}
```

## Code example 5 — Stock II, Assign Cookies, Partition Labels

```java
// Best Time to Buy and Sell Stock II — jitni baar chaho buy-sell. Har "chadhav" ka fayda pakad lo
public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];   // 🔑 kal se aaj mehnga → wo fayda le lo
    }
    return profit;
}

// Assign Cookies — zyada se zyada bachhe khush. greed[i] = bachhe ko kam se kam kitni badi cookie chahiye
public int findContentChildren(int[] greed, int[] cookies) {
    Arrays.sort(greed);
    Arrays.sort(cookies);
    int child = 0;
    for (int cookie : cookies) {
        if (child < greed.length && cookie >= greed[child]) child++;   // 🔑 sabse kam lalchi bachhe ko sabse chhoti kaam-aane wali cookie
    }
    return child;
}

// Partition Labels — string ko aise tukdon mein todo ki har letter sirf ek hi tukde mein aaye
public List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;      // har letter ki AAKHRI position
    List<Integer> parts = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);    // 🔑 is tukde ko kam se kam wahan tak failana hi padega
        if (i == end) {                                   // yahan tukda band ho sakta hai
            parts.add(end - start + 1);
            start = i + 1;
        }
    }
    return parts;
}
```

```
s = "ababcbacadefegdehijhklij"

a ki aakhri position = 8  →  tukda kam se kam index 8 tak    (a, b, c sab is tukde mein: last[c]=7 ≤ 8)
   [ababcbaca]  → 9
d ki aakhri = 14, e = 15, f = 11, g = 13  →  tukda index 15 tak
   [defegde]    → 7
h, i, j, k, l ...  →  [hijhklij] → 8

answer = [9, 7, 8]
```

## Code example 6 — Fractional Knapsack (textbook greedy)

Cheez ke **tukde kar sakte ho**. Bag ki capacity limited hai — **sabse zyada "value per kg" wali cheez pehle** bharo.

```
items (value, weight):  A(60, 10)   B(100, 20)   C(120, 30)      capacity = 50
value/weight         :   6           5            4

A poora (10 kg)  → 60          capacity bachi 40
B poora (20 kg)  → 100         capacity bachi 20
C ka 20/30 hissa → 120 × 20/30 = 80
                        total = 240  ✅
```

```java
public double fractionalKnapsack(int[] values, int[] weights, int capacity) {
    int n = values.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> Double.compare((double) values[b] / weights[b],
                                              (double) values[a] / weights[a]));   // 🔑 value/weight ghatte order mein
    double total = 0;
    for (int i : idx) {
        if (capacity == 0) break;
        int take = Math.min(weights[i], capacity);            // poori cheez, ya jitni jagah bachi
        total += (double) values[i] * take / weights[i];
        capacity -= take;
    }
    return total;
}
```

⚠️ Yehi problem jab **"tukde nahi kar sakte" (0/1 Knapsack)** ho jaye toh greedy **fail** — wahan DP lagta hai (wahi `{4,3,1}` wala jaal).

## Greedy vs DP vs Backtracking

| | Kaise sochta hai | Speed | Kab sahi |
|---|---|---|---|
| **Greedy** | Abhi ka best, peeche nahi dekhta | Sabse tez | Jab greedy-choice property ho |
| **DP** | Saare subproblems ke answers store karke best chunta hai | Medium | Jab greedy fail ho, choices overlap karein |
| **Backtracking** | Saare raaste try, galat ko undo | Sabse slow | Jab "saare answers" chahiye ya n chhota ho |

## Greedy kab lagana hai — pehchano

| Problem ka hint | Greedy idea |
|---|---|
| Intervals / meetings / scheduling | **End time** se sort |
| "Kam se kam items / jumps / arrows" | Sort + har baar sabse achha fit |
| "Pehle sabse chhota/bada pehle" | Sort ya Heap |
| Jodi banana (cookies, tasks) | Dono sort, two pointers |
| "Farthest tak pahunch sakte ho" | Ek variable mein max reach |

## Common galtiyan

- **Bina soche greedy laga dena** — hamesha ek **counterexample** try karo (`{4,3,1}` jaisa).
- **Galat cheez se sort karna** — intervals mein **end** se, start se nahi.
- **Ties (barabar values) ka dhyaan na rakhna** — `>=` vs `>` (intervals ka chhoona overlap hai ya nahi, problem se puchho).
- **Sort ke baad original index kho dena** — index chahiye toh `Integer[] idx` ya pair banao.
- **Greedy ko "proof" ke bina interview mein bolna** — 1 line mein bolo *kyun* safe hai (exchange argument).

> 💡 **Interview mein bolne wali line**: *"Yahan main har step pe [X] chunta hoon kyunki agar optimal solution mein ye nahi hota, toh main use swap karke bhi answer kharab nahi karta (exchange argument). Sorting ke wajah se O(n log n), baaki ek pass."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Assign Cookies | Easy | Dono sort + two pointers | [leetcode.com/problems/assign-cookies](https://leetcode.com/problems/assign-cookies/) |
| 2 | Lemonade Change | Easy | Bada note pehle lautao | [leetcode.com/problems/lemonade-change](https://leetcode.com/problems/lemonade-change/) |
| 3 | Best Time to Buy and Sell Stock II | Medium | Har chadhav ka fayda | [leetcode.com/problems/best-time-to-buy-and-sell-stock-ii](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) |
| 4 | Jump Game | Medium | Farthest reach | [leetcode.com/problems/jump-game](https://leetcode.com/problems/jump-game/) |
| 5 | Jump Game II | Medium | BFS jaisa greedy | [leetcode.com/problems/jump-game-ii](https://leetcode.com/problems/jump-game-ii/) |
| 6 | Gas Station | Medium | Tank negative → start reset | [leetcode.com/problems/gas-station](https://leetcode.com/problems/gas-station/) |
| 7 | Partition Labels | Medium | Aakhri position tak failao | [leetcode.com/problems/partition-labels](https://leetcode.com/problems/partition-labels/) |
| 8 | Non-overlapping Intervals | Medium | End time se sort | [leetcode.com/problems/non-overlapping-intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| 9 | Minimum Number of Arrows to Burst Balloons | Medium | Intervals ka overlap group | [leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) |
| 10 | Task Scheduler | Medium | Sabse frequent task ke gap | [leetcode.com/problems/task-scheduler](https://leetcode.com/problems/task-scheduler/) |
| 11 | Queue Reconstruction by Height | Medium | Height se sort + insert | [leetcode.com/problems/queue-reconstruction-by-height](https://leetcode.com/problems/queue-reconstruction-by-height/) |
| 12 | Candy | Hard | Do pass (left → right, right → left) | [leetcode.com/problems/candy](https://leetcode.com/problems/candy/) |

Poora pattern-style practice: [Greedy pattern](../../01-patterns/14-greedy.md).

---

## ✅ Unit 4 (Paradigms) khatam!

**Backtracking** (saare raaste, galat ko undo) aur **Greedy** (abhi ka best) — ye do soch ab tumhare paas hain. Agla bada topic: **Graphs** — jahan trees ki tarah nodes hain, par **koi bhi node kisi bhi node se jud sakta hai**, aur **cycles** bhi ho sakte hain.

Agla: [Unit 5 — Graphs → Graph Basics](../05-graphs/19-graph-basics.md)
