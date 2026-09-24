# 14. Greedy Algorithms

> Pehle ye aane chahiye: [Greedy (syllabus)](../00-syllabus/04-paradigms/18-greedy.md), [Sorting](../00-syllabus/01-basics/07-sorting.md), [Heap / Priority Queue](../00-syllabus/03-trees-and-heaps/15-heap-priority-queue.md)

> **Standard definition**: An algorithmic approach that builds a solution piece by piece, always choosing the option that looks best (locally optimal) at the current step, without reconsidering previous choices.

**Ek line mein**: Har step pe **sabse achha lagne wala local choice** lo, bina future sochte hue — aur (prove karke) bharosa rakho ki ye local choices milke **global optimal answer** dengi. **Koi undo nahi, koi backtrack nahi — bas ek rule, ek pass.**

**Trick yaad rakhne ki**: *"Change dena — sabse bada coin pehle try karo"* — 100, 50, 20, 10 mein se jitna bada coin fit ho wahi pehle do. Ye **hamesha kaam nahi karta** (isliye Greedy **sabhi problems** mein sahi nahi hota) — pehle **prove / convince** karna padta hai ki greedy choice yahan sahi hai.

```
Greedy ka asli sawaal:  "RULE kya hai?"  aur  "us rule ko lagane ke liye ORDER kya hai?"

   sort karo  (kis KEY pe?)   ─┐
   heap rakho (sabse bada/chhota)  ├─▶  order mein chalo,  rule lagao,  answer update
   ek pass    (running state)  ─┘
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Optimization sawaal:  minimum / maximum / "kitne kam mein"  /  "kya possible hai?"
✅ Har step pe ek CHOICE hai, aur ek rule lagta hai:  "sabse jaldi khatam", "sabse bada", "sabse chhota", "sabse kam nuksan"
✅ Ek choice lene ke baad baaki problem BAS chhoti wahi problem ban jati hai (subproblem)
✅ Jitni cheezein choose karni hain wo sort/heap se order mein aa sakti hain
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**pahunch sakte ho? / minimum jumps / circular tour**" | ① **Reach / Jump** (running farthest) |
| "**assign / pair up / schedule / max kitne**" — sort karke jodo | ② **Sort by KEY** |
| "**har baar sabse bada/chhota uthao**, update, dobara" (stones, ladders, tasks) | ③ **Heap greedy** |
| "**dono taraf ke padosi** se compare" (rating, height) | ④ **Two-pass sweep** |
| "**ek pass mein running sum/count/state**" (profit, subarray, partition, brackets) | ⑤ **One-pass state** |
| "**digits/chars hatao** taaki number chhota/bada ho" | ⑥ **Greedy + stack** |

### ⚠️ Greedy kab FAIL hota hai (pehle ye socho)

```
Coin Change  coins = [1, 3, 4],  amount = 6
  greedy (sabse bada pehle):  4 + 1 + 1 = 3 coins
  asli best                :  3 + 3     = 2 coins      →  greedy GALAT  →  DP chahiye

0/1 Knapsack, longest path, "count karo kitne tarike"  →  greedy nahi chalta
```

**Jaanchne ka tarika (interview mein bhi bolo):**
1. Rule likho. **2–4 elements ka chhota counterexample** socho — kaam kiya toh aage badho.
2. **Exchange argument**: *"Maan lo koi optimal answer mera greedy choice use nahi karta. Uska ek choice badal ke mera choice laga du — answer kharab hota hai? Nahi → greedy safe."*
3. Shak ho toh **brute force se compare** karo (chhote inputs pe).

### ❌ Kab NAHI
- **Count** kitne tarike / saare answers list → [DP](19-dynamic-programming.md) / [Backtracking](13-backtracking.md).
- Choice **aage ke options badal deta hai** aur uska nuksan turant nahi dikhta (0/1 knapsack, coin change arbitrary coins) → DP.

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. GOAL   →  kya optimize karna hai?  (min / max / count / possible?)
2. RULE   →  local choice kya?   "sabse jaldi khatam"  "sabse bada"  "sabse chhota"  "sabse kam nuksan"
3. ORDER  →  rule lagane ke liye:   sort? (kis KEY pe?)   heap?   ya bas ek pass + running state?
4. CHECK  →  chhota counterexample / exchange argument  (greedy sahi hai ya DP?)
5. LOOP   →  order mein chalo → rule lagao → answer update → (aakhir mein return)
```

**Skeleton** (teen shakal):

```
SORT-GREEDY:                     HEAP-GREEDY:                       ONE-PASS:
sort(items, by KEY)              heap.addAll(items)                 state = initial
for item in items:               while heap not empty:              for x in items:
    if item fits rule:               best = heap.poll()                 state = update(state, x)
        take(item)                   use(best), maybe heap.add(new)     if state broken: reset / fail
return answer                    return answer                      return answer
```

**Do ratta:** greedy mein sabse zyada galti **KEY chunne** mein hoti hai — *"start time"* ya *"end time"*? *"bada"* ya *"chhota"*? Pehle 2 chhote example haath se karo.

---

## 3. ① Reach / Jump — running farthest

**Idea**: Ek variable rakho — ab tak **sabse door kahan tak** pahunch sakte hain (`farthest`). Har index dekhkar use badhao. Koi ek specific jump "decide" nahi karte.

```
Jump Game      nums = [2,3,1,1,4]      farthest:  i=0 → 2,  i=1 → 4 (≥ last)  → true
               nums = [3,2,1,0,4]      i=3 pe farthest = 3, i=4 > farthest       → false

Jump Game II   [2,3,1,1,4]:  currentEnd = "is jump se jahan tak pahunche"
   i=0: farthest=2, i==currentEnd(0) → jump#1, currentEnd=2
   i=1: farthest=4
   i=2: farthest=4, i==currentEnd(2) → jump#2, currentEnd=4      → answer 2

Gas Station    tank negative hua i pe → shuru ke saare start galat → start = i+1, tank = 0
               aakhir mein total (gas − cost) ≥ 0 ho toh start hi answer
```

```java
// Jump Game — aakhri index tak pahunch sakte hain?
public boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;                          // 🔑 is index tak pahunch hi nahi sakte
        farthest = Math.max(farthest, i + nums[i]);              // greedy: sabse door ka reach rakho
    }
    return true;
}

// Jump Game II — minimum jumps (aakhri index reachable guaranteed)
public int jump(int[] nums) {
    int jumps = 0, currentEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {                  // 🔑 aakhri index tak nahi (pahunch gaye toh jump nahi)
        farthest = Math.max(farthest, i + nums[i]);
        if (i == currentEnd) {                                   // is jump ka range khatam → ek jump zaroori
            jumps++;
            currentEnd = farthest;
        }
    }
    return jumps;
}

// Gas Station — kis pump se shuru karein (nahi ho sakta toh -1)
public int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if (tank < 0) {                                          // 🔑 yahan tak ke saare start galat
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
}
```

---

## 4. ② Sort by KEY — phir order mein pick / pair

**Idea**: Greedy ka sabse bada hissa: **kis cheez pe sort karun?** Sahi KEY chuno → baaki sab ek simple loop.

| Problem | Sort KEY | Rule |
|---|---|---|
| Assign Cookies | dono list **ascending** | sabse chhota cookie jo sabse kam greedy bachche ko tript kare |
| Boats to Save People | **ascending** | sabse halka + sabse bhaari ek boat mein (agar fit) |
| Two City Scheduling | **`costA − costB`** | jinke liye A sabse sasta hai unhe A bhejo |
| Largest Number | **`b+a` vs `a+b`** (string) | jo pehle rakhne se bada number bane |
| Queue Reconstruction | **height ↓, k ↑** | lambe pehle rakho, phir `k` index pe daalo |
| Non-overlapping Intervals | **end time ↑** | sabse jaldi khatam hone wala rakho — baaki ke liye zyada waqt |

```
Activity selection — start pe sort GALAT:   [1,100], [2,3], [3,4]     start se → [1,100] le liya → sirf 1 meeting
                     end pe sort SAHI:      [2,3], [3,4], [1,100]      → [2,3], [3,4] le liye → 2 meetings

Exchange argument:  optimal mein jo pehli meeting hai wo mere end-sabse-pehle wali se baad mein khatam hoti hai
                    → use mere wali se badal do → baaki meetings pe koi asar nahi (mere wali pehle khatam)
```

```java
// Assign Cookies — g[i] = bachche ki greed, s[j] = cookie ka size
public int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);
    int child = 0;
    for (int cookie = 0; cookie < s.length && child < g.length; cookie++) {
        if (s[cookie] >= g[child]) child++;                      // 🔑 sabse kam greed wale ko sabse chhota kaafi cookie
    }
    return child;
}

// Boats to Save People — ek boat mein max 2 log, weight limit
public int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int lo = 0, hi = people.length - 1, boats = 0;
    while (lo <= hi) {
        if (people[lo] + people[hi] <= limit) lo++;              // 🔑 sabse halka, sabse bhaari ke saath baith sakta hai
        hi--;                                                    // sabse bhaari toh jayega hi
        boats++;
    }
    return boats;
}

// Two City Scheduling — 2n logon mein se n ko city A, n ko city B, kam se kam total cost
public int twoCitySchedCost(int[][] costs) {
    Arrays.sort(costs, (x, y) -> Integer.compare(x[0] - x[1], y[0] - y[1]));   // 🔑 key = A − B (jitna kam, A utna behtar)
    int n = costs.length / 2, total = 0;
    for (int i = 0; i < costs.length; i++) total += i < n ? costs[i][0] : costs[i][1];
    return total;
}

// Largest Number — numbers jodke sabse bada number
public String largestNumber(int[] nums) {
    String[] s = new String[nums.length];
    for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
    Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));          // 🔑 "a+b" vs "b+a": jo pehle rakhne pe bada ho
    if (s[0].equals("0")) return "0";                            // sab zero → "000" nahi, "0"
    return String.join("", s);
}

// Queue Reconstruction by Height — people[i] = {height, k = kitne log aage jo mujhse lambe/barabar}
public int[][] reconstructQueue(int[][] people) {
    Arrays.sort(people, (a, b) -> a[0] != b[0] ? Integer.compare(b[0], a[0]) : Integer.compare(a[1], b[1]));   // height ↓, k ↑
    List<int[]> queue = new ArrayList<>();
    for (int[] p : people) queue.add(p[1], p);                   // 🔑 k index pe daalo — lambe pehle se baithe hain, chhote unhe nahi gadbadate
    return queue.toArray(new int[0][]);
}

// Non-overlapping Intervals — kam se kam kitne hatao (touch karna overlap nahi)
public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));   // 🔑 END pe sort
    int kept = 0, lastEnd = Integer.MIN_VALUE;
    for (int[] in : intervals) {
        if (in[0] >= lastEnd) {                                  // overlap nahi → rakh lo
            kept++;
            lastEnd = in[1];
        }
    }
    return intervals.length - kept;
}
```

---

## 5. ③ Heap Greedy — har baar best utha lo

**Idea**: Jab bhi bolo *"abhi jo sabse bada / chhota hai wo lo"* aur **lene ke baad naya element aa sakta hai** (ya baad mein badalna padta hai) → **heap**. Sort ek baar hota hai, heap **badalte data** pe kaam karta hai.

```
Last Stone Weight   [2,7,4,1,8,1]:  max-heap se har baar do sabse bhaari nikalo, farak wapas daalo
   8,7 → 1 wapas    4,2 → 2 wapas    2,1 → 1 wapas    1,1 → 0 (dono khatam)    bacha [1]  →  answer 1

Furthest Building   bricks=5, ladders=1:  ladder SABSE BADE climb pe lagani hai
   climb aaya → min-heap mein daalo (ladder pe maano)
   heap size > ladders → sabse CHHOTA climb nikalo, usko bricks se pura karo
   bricks < 0 → yahin ruk jao

Task Scheduler      A A A B B C, n=2:   sabse zyada baar aane wala task frame banata hai
   A . . A . . A   →  (max−1) blocks × (n+1) + (kitne tasks max baar aaye)  =  (3−1)·3 + 1 = 7
   answer = max(len(tasks), formula)
```

```java
// Last Stone Weight — do sabse bhaari tod do, bacha hua wapas
public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int s : stones) maxHeap.add(s);
    while (maxHeap.size() > 1) {
        int a = maxHeap.poll(), b = maxHeap.poll();              // 🔑 a >= b: do sabse bhaari
        if (a != b) maxHeap.add(a - b);
    }
    return maxHeap.isEmpty() ? 0 : maxHeap.peek();
}

// Furthest Building You Can Reach — ladders sabse bade climbs pe
public int furthestBuilding(int[] heights, int bricks, int ladders) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();     // jin climbs pe abhi ladder lagi hai
    for (int i = 0; i + 1 < heights.length; i++) {
        int climb = heights[i + 1] - heights[i];
        if (climb <= 0) continue;                                // utarna / barabar: free
        minHeap.add(climb);                                      // pehle ladder maan lo
        if (minHeap.size() > ladders) bricks -= minHeap.poll();  // 🔑 ladders kam pade → sabse CHHOTI climb ko bricks se
        if (bricks < 0) return i;                                // i+1 tak nahi pahunch sakte
    }
    return heights.length - 1;
}

// Task Scheduler — heap ke bina formula (frame idea)
public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;
    int max = 0;
    for (int f : freq) max = Math.max(max, f);
    int countMax = 0;
    for (int f : freq) if (f == max) countMax++;                 // kitne tasks max baar aaye
    return Math.max(tasks.length, (max - 1) * (n + 1) + countMax);   // 🔑 frame: (max−1) poore block + aakhri row
}
```

---

## 6. ④ Two-Pass Sweep — dono taraf ke padosi

**Idea**: Jab har element ko **left aur right dono** ke saath compare karna ho, ek pass mein dono nahi sambhalte. Do pass: **left→right** (left padosi ka rule), phir **right→left** (right padosi ka rule, `max` lekar dono satisfy).

```
Candy  ratings = [1,0,2]   har bachhe ko ≥1 candy, zyada rating wale ko padosi se zyada

start:        [1, 1, 1]
L → R  (i > i−1 to +1):     [1, 1, 2]
R → L  (i > i+1 to max(cur, right+1)):   [2, 1, 2]                total = 5

L→R ne "left se bada" wale rule satisfy kiye, R→L ne "right se bada"; max lene se pehla wala tootta nahi.
```

```java
public int candy(int[] ratings) {
    int n = ratings.length;
    int[] candies = new int[n];
    Arrays.fill(candies, 1);                                     // sabko kam se kam 1
    for (int i = 1; i < n; i++) {                                // left → right
        if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
    }
    for (int i = n - 2; i >= 0; i--) {                           // right → left
        if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);   // 🔑 max: pehla pass mat todo
    }
    int total = 0;
    for (int c : candies) total += c;
    return total;
}
```

---

## 7. ⑤ One-Pass State — ek loop, kuch variables

**Idea**: Ek baar chalo, **chhota sa running state** rakho (profit, cur sum, last position, open-bracket range) aur har element pe decide karo.

```
Stock II          [7,1,5,3,6,4]:  har chadhai ka paisa le lo   (5−1)+(6−3) = 7      "kal kharido, aaj bech do"
Kadane            cur = max(x, cur + x):  cur negative ho gaya toh peeche ka sab chhod do, x se naya shuru
Partition Labels  "ababcbacadefegdehijhklij":  har akshar ka LAST index — end = max(last[c]);  i == end → cut
                   ababcbaca | defegde | hijhklij   →  [9, 7, 8]
Valid Paren String  '*' = '(' ya ')' ya khaali:  open count ki RANGE [lo, hi] rakho
Lemonade Change    $20 pe pehle 10+5 (5 zyada kaam ke hain), warna 5+5+5
```

```java
// Best Time to Buy and Sell Stock II — jitni baar chahe
public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];   // 🔑 har chadhai le lo
    }
    return profit;
}

// Maximum Subarray (Kadane) — poori Kadane note: 21-kadanes-algorithm.md
public int maxSubArray(int[] nums) {
    int best = nums[0], cur = 0;
    for (int x : nums) {
        cur = Math.max(x, cur + x);                              // 🔑 peeche ka sum negative → chhodo
        best = Math.max(best, cur);
    }
    return best;
}

// Partition Labels — string ko itne tukdon mein todo ki har akshar ek hi tukde mein
public List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
    List<Integer> sizes = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);            // 🔑 is tukde ko itna to failna hi padega
        if (i == end) {                                          // yahan cut safe
            sizes.add(end - start + 1);
            start = i + 1;
        }
    }
    return sizes;
}

// Valid Parenthesis String — '(' ')' aur '*' (jo '(' ya ')' ya khaali ho sakta hai)
public boolean checkValidString(String s) {
    int lo = 0, hi = 0;                                          // lo..hi = khule brackets ki possible sankhya
    for (char c : s.toCharArray()) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }                                     // '*': ')' ya khaali ya '('
        if (hi < 0) return false;                                // ')' zyada ho gaye chahe jo bhi karo
        lo = Math.max(lo, 0);                                    // 🔑 negative open count possible nahi
    }
    return lo == 0;
}

// Lemonade Change — 5, 10, 20 ke bills
public boolean lemonadeChange(int[] bills) {
    int five = 0, ten = 0;
    for (int b : bills) {
        if (b == 5) five++;
        else if (b == 10) {
            if (five == 0) return false;
            five--;
            ten++;
        } else {
            if (ten > 0 && five > 0) { ten--; five--; }         // 🔑 pehle 10+5 (5 zyada kaam ki cheez hai)
            else if (five >= 3) five -= 3;
            else return false;
        }
    }
    return true;
}
```

---

## 8. ⑥ Greedy + Stack — digits hatao

**Idea**: *"`k` digits hatao taaki number sabse chhota ho."* Rule: **jab koi digit apne pichhle se chhota aaye, pichhla (bada) hata do** — chhota digit aage laana hi number ko chhota karta hai. Ye **monotonic (increasing) stack** hai.

```
num = "1432219", k = 3
1        → [1]
4        → [1,4]
3 < 4    → 4 hatao (k=2) → [1,3]
2 < 3    → 3 hatao (k=1) → [1,2]
2        → [1,2,2]
1 < 2    → 2 hatao (k=0) → [1,2,1]
9        → [1,2,1,9]         →  "1219"

Agar k bach gaya (digits already increasing the) → peeche se hatao.   Leading zeros hatao.  Khaali → "0".
```

```java
public String removeKdigits(String num, int k) {
    StringBuilder stack = new StringBuilder();
    for (char c : num.toCharArray()) {
        while (k > 0 && stack.length() > 0 && stack.charAt(stack.length() - 1) > c) {
            stack.deleteCharAt(stack.length() - 1);              // 🔑 bada digit pehle aaya → hata do
            k--;
        }
        stack.append(c);
    }
    while (k > 0 && stack.length() > 0) {                        // digits increasing the → peeche ke bade hatao
        stack.deleteCharAt(stack.length() - 1);
        k--;
    }
    int i = 0;
    while (i < stack.length() && stack.charAt(i) == '0') i++;    // leading zeros
    String result = stack.substring(i);
    return result.isEmpty() ? "0" : result;
}
```

Ye [Monotonic Stack](17-monotonic-stack.md) ka hi ek roop hai.

---

## 9. Sab ek nazar mein

| Variation | Order kaise? | Rule | Extra |
|---|---|---|---|
| ① Reach / Jump | ek pass | `farthest = max(farthest, i + nums[i])` | tank reset (Gas Station) |
| ② Sort by KEY | **sort** (sahi KEY!) | sabse jaldi khatam / sabse chhota fit / `A−B` | comparator `Integer.compare` |
| ③ Heap | **heap** | poll best → use → (naya add) | `Collections.reverseOrder()` max-heap |
| ④ Two-pass | L→R phir R→L | har side ka rule, `max` | pehla pass mat todna |
| ⑤ One-pass state | ek pass | running state update / reset | Kadane, Stock II, partition |
| ⑥ Stack | ek pass + stack | bada pichhla hata do | `k` bacha → peeche se |

## Common galtiyan

- **Galat KEY** — start pe sort kiya jahan end chahiye; ya bada ke bajay chhota.
- **Greedy prove/test nahi kiya** — chhota counterexample (`[1,3,4]`, target 6) 30 second mein dikha deta hai.
- **Comparator mein `a - b`** — overflow ho sakta hai; `Integer.compare(a, b)` likho.
- **Ties** (barabar keys) ko handle na karna — height ↓ **aur** `k` ↑ jaisa dusra key.
- **Do-pass mein `max` bhoolna** — pehle pass ka kaam toot jata hai.
- **Heap direction** — max chahiye toh `Collections.reverseOrder()`; "K largest" ke liye **min**-heap.
- **Jump Game II mein last index tak loop** — extra jump gina jata hai (`i < n - 1`).
- **Intervals mein touching (`[1,2],[2,3]`)** overlap hai ya nahi — sawaal padho; `>=` vs `>`.
- **Sab zero (Largest Number) / khaali string (Remove K Digits)** ke edge cases.

> 💡 **Interview mein bolne wali line**: *"Har step pe [rule] choose karunga kyunki [exchange argument: agar optimal mein alag choice ho toh use swap karne se answer kharab nahi hota]. Iske liye [sort by X / heap / ek pass] chahiye, isliye time O(n log n) (ya O(n)). Main ek chhote counterexample se check kar chuka hun ki greedy yahan tootta nahi."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Assign Cookies | ② Sort | Easy | [leetcode.com/problems/assign-cookies](https://leetcode.com/problems/assign-cookies/) |
| 2 | Lemonade Change | ⑤ One-pass | Easy | [leetcode.com/problems/lemonade-change](https://leetcode.com/problems/lemonade-change/) |
| 3 | Best Time to Buy and Sell Stock II | ⑤ One-pass | Medium | [leetcode.com/problems/best-time-to-buy-and-sell-stock-ii](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) |
| 4 | Last Stone Weight | ③ Heap | Easy | [leetcode.com/problems/last-stone-weight](https://leetcode.com/problems/last-stone-weight/) |
| 5 | Maximum Subarray | ⑤ One-pass (Kadane) | Medium | [leetcode.com/problems/maximum-subarray](https://leetcode.com/problems/maximum-subarray/) |
| 6 | Jump Game | ① Reach | Medium | [leetcode.com/problems/jump-game](https://leetcode.com/problems/jump-game/) |
| 7 | Jump Game II | ① Reach | Medium | [leetcode.com/problems/jump-game-ii](https://leetcode.com/problems/jump-game-ii/) |
| 8 | Gas Station | ① Reach | Medium | [leetcode.com/problems/gas-station](https://leetcode.com/problems/gas-station/) |
| 9 | Boats to Save People | ② Sort | Medium | [leetcode.com/problems/boats-to-save-people](https://leetcode.com/problems/boats-to-save-people/) |
| 10 | Two City Scheduling | ② Sort (key = A−B) | Medium | [leetcode.com/problems/two-city-scheduling](https://leetcode.com/problems/two-city-scheduling/) |
| 11 | Non-overlapping Intervals | ② Sort by end | Medium | [leetcode.com/problems/non-overlapping-intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| 12 | Partition Labels | ⑤ One-pass | Medium | [leetcode.com/problems/partition-labels](https://leetcode.com/problems/partition-labels/) |
| 13 | Largest Number | ② Sort (comparator) | Medium | [leetcode.com/problems/largest-number](https://leetcode.com/problems/largest-number/) |
| 14 | Queue Reconstruction by Height | ② Sort + insert | Medium | [leetcode.com/problems/queue-reconstruction-by-height](https://leetcode.com/problems/queue-reconstruction-by-height/) |
| 15 | Task Scheduler | ③ Heap / formula | Medium | [leetcode.com/problems/task-scheduler](https://leetcode.com/problems/task-scheduler/) |
| 16 | Remove K Digits | ⑥ Stack | Medium | [leetcode.com/problems/remove-k-digits](https://leetcode.com/problems/remove-k-digits/) |
| 17 | Valid Parenthesis String | ⑤ One-pass (range) | Medium | [leetcode.com/problems/valid-parenthesis-string](https://leetcode.com/problems/valid-parenthesis-string/) |
| 18 | Furthest Building You Can Reach | ③ Heap | Medium | [leetcode.com/problems/furthest-building-you-can-reach](https://leetcode.com/problems/furthest-building-you-can-reach/) |
| 19 | Candy | ④ Two-pass | Hard | [leetcode.com/problems/candy](https://leetcode.com/problems/candy/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Goal kya? Rule kya? Order kaunsa (sort key / heap / ek pass)? Counterexample koi?"* — phir code.

Agla: [15-union-find.md](15-union-find.md)
