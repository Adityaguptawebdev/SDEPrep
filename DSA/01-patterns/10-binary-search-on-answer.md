# 10. Binary Search on Answer

> Pehle ye aane chahiye: [Binary Search (pattern)](09-binary-search.md), [Greedy](../00-syllabus/04-paradigms/18-greedy.md)

> **Standard definition**: Applying binary search not on a sorted array, but on the range of possible answers to an optimization problem — used when the feasibility of an answer is monotonic (once true, stays true for all "better" values).

**Ek line mein**: Array pe nahi, **answer ki value ki range pe** binary search karo. Har guess `x` ke liye ek **`feasible(x)`** function (aksar greedy, O(n)) puchta hai *"kya `x` chalega?"* — aur `feasible` ka **F F F T T T** monotonic hona hi binary search ko valid banata hai.

**Trick yaad rakhne ki**: *"Kitni tez gaadi chahiye taaki time pe pahunch jao?"* — agar 60 km/h kaafi hai toh 70 bhi kaafi hai (monotonic). Toh **beech ki speed try karo**: kaam kar gayi → thodi kam try karo, nahi kiya → badhao. Poori speeds ek-ek karke check nahi karte.

```
speed :      10   20   30   40   50   60   70   80
feasible :    F    F    F    F    T    T    T    T          ← sabse chhota T = minimum speed = 50
                                  ↑ binary search yahan pahunchta hai (O(log range) guesses)
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Sawaal "MINIMUM X jo ... kar de"  ya  "MAXIMUM X jo ... ho sake"  ka hai
✅ Ek guess X dene pe "chalega ya nahi" GREEDY se O(n) mein check ho jata hai   →   feasible(X)
✅ X ki range pata hai (lo..hi) aur feasible(X) MONOTONIC hai
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**minimum speed / capacity / days / divisor** jo kaam kare", "**minimize the maximum**" (kisi ka bhi bada hissa) | ① **MIN X** jahan feasible |
| "**maximum** minimum distance / candies / length", "**maximize the minimum**" | ② **MAX X** jahan feasible |
| "**K-th smallest**" jahan seedha sort/heap mehenga ho (matrix, table) | ③ **Count-based** (`count(≤ x) ≥ k`) |
| "**sqrt**", "floating point answer", "precision 1e-5" | ④ **Real / long answer** |
| "**minimize the maximum**" + andar sort/greedy check | ⑤ **Min-max with greedy check** |

**Ek line ki pehchaan**: Sawaal mein **"minimize the maximum"** ya **"maximize the minimum"** dikhe → **lagbhag hamesha Binary Search on Answer.**

### ❌ Kab NAHI
- `feasible(x)` **monotonic nahi** (kabhi True, kabhi False, koi pattern nahi) → DP / brute force.
- `feasible` khud **O(n²)/exponential** hai → total slow. Greedy O(n) check chahiye.

---

## 2. Do skeleton — bas yehi likhna hai

**Direction ka faisla**: *feasible bade `x` pe hai (F F F T T T)?* → **MIN X** (Template B). *feasible chhote `x` pe hai (T T T F F F)?* → **MAX X** (Template C).

```
MIN X jahan feasible  (F F F T T T)                      MAX X jahan feasible  (T T T F F F)

lo = LOW, hi = HIGH                                       lo = LOW, hi = HIGH
while (lo < hi):                                          while (lo < hi):
    mid = lo + (hi − lo) / 2                                  mid = lo + (hi − lo + 1) / 2     ← +1  (upper mid)
    if feasible(mid):  hi = mid        # mid chalta hai,      if feasible(mid):  lo = mid       # mid chalta hai,
                                        # aur chhota try                                       # aur bada try
    else:              lo = mid + 1                           else:              hi = mid − 1
return lo                                                 return lo
```

## 3. Code likhne ki recipe — 4 sawaal

```
1. ANSWER KYA?    →  x = speed / capacity / days / distance / count ...  (jo tum guess kar rahe ho)
2. RANGE          →  LOW = sabse chhota possible answer,   HIGH = sabse bada possible answer
3. feasible(x)    →  O(n) greedy simulation:  "x diya, kya kaam ho jayega?"  →  boolean
4. DIRECTION      →  MIN feasible → hi = mid  |  MAX feasible → lo = mid  (+1 wala upper mid)
```

**Range kaise chuno:**

| Kya dhundh rahe ho | `LOW` | `HIGH` |
|---|---|---|
| Min speed (Koko) | `1` | `max(piles)` |
| Min capacity (ship) | `max(weights)` (sabse bhaari cheez to jaani chahiye) | `sum(weights)` |
| Max min-distance | `1` | `maxPos − minPos` |
| K-th smallest (matrix) | `matrix[0][0]` | `matrix[n−1][n−1]` |

**Yaad rakho**: `LOW` aur `HIGH` ke beech **answer hamesha hona chahiye** — thoda dheela bhi chalega, par **tang** nahi.

---

## 4. ① MIN X jahan feasible

### Koko Eating Bananas

`piles`, `h` ghante. Speed `s` (per ghanta ek pile se `s` kele, chhoti pile hui toh us ghante bacha time bekaar). **Minimum `s`** jisse `h` ghante mein sab khatam?

```
piles = [3, 6, 7, 11], h = 8

speed :        1   2   3   4   5   6   7   8   11
ghante lage :  27  15  10  8   ...
feasible(≤8):  F   F   F   T   T   T   T   T   T        → minimum speed = 4 ✅

speed 4 pe:  ceil(3/4)=1 + ceil(6/4)=2 + ceil(7/4)=2 + ceil(11/4)=3  =  8 ghante ≤ 8 ✓
```

```java
public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);              // itni speed pe har pile 1 ghante mein → isse zyada bekaar
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (hoursNeeded(piles, mid) <= h) hi = mid;         // 🔑 chalta hai → aur kam speed try
        else lo = mid + 1;                                   // nahi chalta → speed badhao
    }
    return lo;
}

private long hoursNeeded(int[] piles, int speed) {
    long hours = 0;
    for (int p : piles) hours += (p - 1) / speed + 1;      // ceil(p / speed) integer mein (p ≥ 1)
    return hours;
}

// Smallest Divisor Given a Threshold — bilkul wahi skeleton, sirf feasible alag
public int smallestDivisor(int[] nums, int threshold) {
    int lo = 1, hi = 0;
    for (int x : nums) hi = Math.max(hi, x);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long sum = 0;
        for (int x : nums) sum += (x - 1) / mid + 1;        // ceil(x / mid) ka sum
        if (sum <= threshold) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

**`ceil(a / b)` integer mein**: `(a − 1) / b + 1` (`a ≥ 1`) — `Math.ceil((double)…)` se bachna (precision + slow).

### Ship Packages / Split Array Largest Sum — "Minimize the Maximum"

**Same problem, do naam**: packages ko **order mein** `D` din mein baanto; **ek din mein jitna load, uska max minimum** karna hai. Split Array: array ko `k` subarrays mein baanto, **sabse bada subarray-sum minimum**.

```
weights = [1,2,3,4,5,6,7,8,9,10], D = 5

capacity guess 15:   din1: 1+2+3+4+5 = 15   din2: 6+7 = 13   din3: 8   din4: 9   din5: 10   →  5 din ✓ feasible
capacity guess 14:   din1: 1+2+3+4 = 10 (+5 = 15 > 14)  ...  →  6 din ✗
sabse chhota feasible = 15 ✅
```

```java
public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = Math.max(lo, w);                                // 🔑 capacity ≥ sabse bhaari (warna wo ja hi nahi sakta)
        hi += w;                                              // sab ek din mein
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (daysNeeded(weights, mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private int daysNeeded(int[] weights, int capacity) {
    int days = 1, load = 0;
    for (int w : weights) {
        if (load + w > capacity) {                            // aaj ki gaadi bhar gayi → agla din
            days++;
            load = 0;
        }
        load += w;
    }
    return days;
}

// Split Array Largest Sum = wahi cheez (k subarray, unka max sum minimum)
public int splitArray(int[] nums, int k) {
    return shipWithinDays(nums, k);
}
```

### Minimum Days to Make m Bouquets

`bloomDay[i]` = phool `i` kis din khilega. `m` bouquets, har ek mein **k paas-paas** phool. **Minimum din?** `feasible(day)` = us din tak khile phoolon se kitne bouquets bante hain `≥ m`?

```java
public int minDays(int[] bloomDay, int m, int k) {
    if ((long) m * k > bloomDay.length) return -1;            // itne phool hain hi nahi
    int lo = Integer.MAX_VALUE, hi = 0;
    for (int d : bloomDay) {
        lo = Math.min(lo, d);
        hi = Math.max(hi, d);
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (bouquets(bloomDay, mid, k) >= m) hi = mid;         // itne din mein ho jata hai → kam din try
        else lo = mid + 1;
    }
    return lo;
}

private int bouquets(int[] bloomDay, int day, int k) {
    int count = 0, run = 0;
    for (int d : bloomDay) {
        if (d <= day) {                                        // phool khil chuka
            run++;
            if (run == k) { count++; run = 0; }                 // k paas-paas mile → ek bouquet
        } else {
            run = 0;                                            // beech mein khila nahi → ginti tootti hai
        }
    }
    return count;
}
```

---

## 5. ② MAX X jahan feasible ("Maximize the Minimum")

### Magnetic Force Between Two Balls

`m` balls ko baskets mein rakho taaki **kisi bhi do balls ke beech ka sabse chhota gap (min distance) sabse bada** ho. `feasible(gap)` = *kam se kam `gap` doori rakhte hue `m` balls rakh sakte hain?* — **chhote gap pe haan, bade pe nahi** (T T T F F F) ⇒ **MAX**, upper mid.

```
position = [1, 2, 3, 4, 7], m = 3

gap 3 : 1 → (4) → (7)   ✓ 3 balls   feasible      gap 4 : 1 → (7)   sirf 2   ✗
maximum gap = 3 ✅
```

```java
public int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int lo = 1, hi = position[position.length - 1] - position[0];
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;                       // 🔑 upper mid (+1) — MAX wale mein
        if (canPlace(position, m, mid)) lo = mid;                // itna gap chalta hai → aur bada try
        else hi = mid - 1;
    }
    return lo;
}

// Greedy: pehli ball pehle basket mein, agli tabhi jab gap ≥ mid
private boolean canPlace(int[] pos, int m, int gap) {
    int placed = 1, last = pos[0];
    for (int i = 1; i < pos.length; i++) {
        if (pos[i] - last >= gap) {
            placed++;
            last = pos[i];
        }
    }
    return placed >= m;
}

// Maximum Candies Allocated to K Children — har bachhe ko barabar candies (ek pile se hi), max kitni?
public int maximumCandies(int[] candies, long k) {
    int lo = 0, hi = 0;
    for (int c : candies) hi = Math.max(hi, c);
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;                        // mid ≥ 1 (isliye c / mid safe)
        long children = 0;
        for (int c : candies) children += c / mid;               // mid-mid candies ke kitne parts bante hain
        if (children >= k) lo = mid;                              // chalta hai → aur bada
        else hi = mid - 1;
    }
    return lo;
}
```

---

## 6. ③ Count-based — "K-th smallest" answer ki range pe

**Idea**: K-th smallest `v` ka matlab: *"`v` se chhote-ya-barabar elements ki ginti `≥ k`"* aur `v` sabse chhota aisa. **`P(x) = count(≤ x) ≥ k`** — F F F T T T ⇒ **MIN X**.

```
matrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]],  k = 8

x=11: count(≤ 11) = 5  (1,5,9,10,11)      ✗ (< 8)
x=13: count(≤ 13) = 8  (… 12,13,13)       ✓ (≥ 8)      pehla x jahan ≥ 8 → 13 ✅
```

```java
// Kth Smallest Element in a Sorted Matrix (rows aur columns sorted)
public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    int lo = matrix[0][0], hi = matrix[n - 1][n - 1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (countLE(matrix, mid) >= k) hi = mid;                  // mid tak k ya zyada elements → answer mid ya usse chhota
        else lo = mid + 1;
    }
    return lo;
}

// x se chhote-ya-barabar kitne: neeche-baayein kone se "seedhi" chalo — O(n)
private int countLE(int[][] matrix, int x) {
    int n = matrix.length, row = n - 1, col = 0, count = 0;
    while (row >= 0 && col < n) {
        if (matrix[row][col] <= x) {
            count += row + 1;                                       // is column mein upar ke saare ≤ x
            col++;
        } else {
            row--;
        }
    }
    return count;
}

// Kth Smallest Number in Multiplication Table (m × n, table[i][j] = i·j)
public int findKthNumber(int m, int n, int k) {
    int lo = 1, hi = m * n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int count = 0;
        for (int i = 1; i <= m; i++) count += Math.min(mid / i, n);   // row i mein mid tak kitne (i·j ≤ mid ⇒ j ≤ mid/i)
        if (count >= k) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

---

## 7. ④ Real / Long answer

### sqrt — MAX X jahan `x·x ≤ n`

```java
public int mySqrt(int x) {
    long lo = 0, hi = x;
    while (lo < hi) {
        long mid = lo + (hi - lo + 1) / 2;                          // upper mid (MAX wala)
        if (mid * mid <= x) lo = mid;                                // mid * mid int mein overflow → long
        else hi = mid - 1;
    }
    return (int) lo;
}

// Decimal answer: "lo < hi" nahi chalta (floats kabhi barabar nahi hote) → FIXED iterations (100 kaafi)
public double sqrtDouble(double x) {                                  // x ≥ 0
    double lo = 0, hi = Math.max(1, x);
    for (int i = 0; i < 100; i++) {
        double mid = (lo + hi) / 2;
        if (mid * mid <= x) lo = mid;
        else hi = mid;
    }
    return lo;
}
```

### `long` ki zarurat — Minimum Time to Complete Trips

Buses ke `time[i]` (ek trip ka time), kul `totalTrips` chahiye. **Minimum time `t`?** `feasible(t)` = `Σ (t / time[i]) ≥ totalTrips`. Answer **10¹⁴** tak — `int` overflow!

```java
public long minimumTime(int[] time, int totalTrips) {
    long fastest = Long.MAX_VALUE;
    for (int t : time) fastest = Math.min(fastest, t);
    long lo = 1, hi = fastest * totalTrips;                            // 🔑 long: 10⁷ × 10⁷ int mein nahi aata
    while (lo < hi) {
        long mid = lo + (hi - lo) / 2;
        long trips = 0;
        for (int t : time) trips += mid / t;
        if (trips >= totalTrips) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

---

## 8. ⑤ Min-Max with greedy check — Minimize the Maximum Difference of Pairs

`p` **alag-alag jodiyan** banao (koi index do baar nahi) taaki **sabse bada `|a − b|` minimum** ho. **Sort** karo — adjacent elements ki jodi hi best. `feasible(d)` = *adjacent jodiyan (diff ≤ `d`) **greedy** banao — kya `p` ban sakti hain?*

```java
public int minimizeMax(int[] nums, int p) {
    Arrays.sort(nums);
    int lo = 0, hi = nums[nums.length - 1] - nums[0];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (countPairs(nums, mid) >= p) hi = mid;                      // itne diff mein p jodiyan ban jati hain → kam try
        else lo = mid + 1;
    }
    return lo;
}

private int countPairs(int[] nums, int maxDiff) {
    int count = 0;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] <= maxDiff) {                        // adjacent jodi mil gayi
            count++;
            i++;                                                        // 🔑 dono use ho gaye → agla element chhodo
        }
    }
    return count;
}
```

---

## 9. Sab ek nazar mein — feasible(x) kaise likhte hain

| Problem | Direction | `feasible(x)` (greedy, O(n)) | Range |
|---|---|---|---|
| Koko | MIN | `Σ ceil(pile / x) ≤ h` | `1 .. max` |
| Smallest divisor | MIN | `Σ ceil(a / x) ≤ threshold` | `1 .. max` |
| Ship / Split array | MIN | load bharte jao, `> x` pe naya din; `days ≤ D` | `max .. sum` |
| Bouquets | MIN | `x` din tak khile phoolon se bouquets `≥ m` | `min .. max` |
| Magnetic force | **MAX** | gap `≥ x` rakhte hue `m` balls | `1 .. span` |
| Max candies | **MAX** | `Σ (c / x) ≥ k` | `0 .. max` |
| Kth smallest matrix | MIN | `count(≤ x) ≥ k` | `first .. last` |
| Mult. table | MIN | `Σ min(x / i, n) ≥ k` | `1 .. m·n` |
| Min time trips | MIN (long) | `Σ (x / t) ≥ trips` | `1 .. fastest·trips` |
| Min max pair diff | MIN | adjacent jodi ≤ x, `p` ban jaye | `0 .. span` |

## Common galtiyan

- **Direction galat** — MAX wale mein `hi = mid` likhna (infinite loop) ya upper mid (`+1`) bhoolna.
- **Range mein answer chhoot jana** — ship mein `lo` ko `max(weights)` se bada rakhna ya `hi` ko `sum` se chhota rakhna. **Dheela range chalta hai, tang nahi.**
- **`feasible` monotonic nahi socha** — pehle 3–4 `x` pe likhke `F F T T` dekh lo.
- **`int` overflow** — sums, products (`mid * mid`, `fastest * trips`) — `long`.
- **`Math.ceil((double) a / b)`** — slow aur galat ho sakta hai. Integer ceil: `(a − 1) / b + 1`.
- **Float pe `while (lo < hi)`** — kabhi khatam nahi hoga. Fixed iterations.
- **`feasible` mein O(n²)** — greedy O(n) banao (aksar sort ke baad).

> 💡 **Interview mein bolne wali line**: *"Answer ki range monotonic hai — agar capacity `x` kaam karti hai toh `x+1` bhi karegi. Isliye range `[max(weights), sum]` pe binary search karunga, aur har guess ke liye greedy se O(n) mein check karunga ki kitne din lagte hain. Total O(n log(sum))."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Sqrt(x) | ④ Real / MAX | Easy | [leetcode.com/problems/sqrtx](https://leetcode.com/problems/sqrtx/) |
| 2 | Valid Perfect Square | ④ Integer | Easy | [leetcode.com/problems/valid-perfect-square](https://leetcode.com/problems/valid-perfect-square/) |
| 3 | Koko Eating Bananas | ① MIN | Medium | [leetcode.com/problems/koko-eating-bananas](https://leetcode.com/problems/koko-eating-bananas/) |
| 4 | Find the Smallest Divisor Given a Threshold | ① MIN | Medium | [leetcode.com/problems/find-the-smallest-divisor-given-a-threshold](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/) |
| 5 | Capacity To Ship Packages Within D Days | ① MIN (min-max) | Medium | [leetcode.com/problems/capacity-to-ship-packages-within-d-days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) |
| 6 | Minimum Number of Days to Make m Bouquets | ① MIN | Medium | [leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) |
| 7 | Minimum Time to Complete Trips | ① MIN (long) | Medium | [leetcode.com/problems/minimum-time-to-complete-trips](https://leetcode.com/problems/minimum-time-to-complete-trips/) |
| 8 | Magnetic Force Between Two Balls | ② MAX (max-min) | Medium | [leetcode.com/problems/magnetic-force-between-two-balls](https://leetcode.com/problems/magnetic-force-between-two-balls/) |
| 9 | Maximum Candies Allocated to K Children | ② MAX | Medium | [leetcode.com/problems/maximum-candies-allocated-to-k-children](https://leetcode.com/problems/maximum-candies-allocated-to-k-children/) |
| 10 | Kth Smallest Element in a Sorted Matrix | ③ Count | Medium | [leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) |
| 11 | Minimize the Maximum Difference of Pairs | ⑤ Min-max + greedy | Medium | [leetcode.com/problems/minimize-the-maximum-difference-of-pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs/) |
| 12 | Split Array Largest Sum | ① MIN (min-max) | Hard | [leetcode.com/problems/split-array-largest-sum](https://leetcode.com/problems/split-array-largest-sum/) |
| 13 | Kth Smallest Number in Multiplication Table | ③ Count | Hard | [leetcode.com/problems/kth-smallest-number-in-multiplication-table](https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/) |
| 14 | Find K-th Smallest Pair Distance | ③ Count + two pointers | Hard | [leetcode.com/problems/find-k-th-smallest-pair-distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/) |
| 15 | Minimize Max Distance to Gas Station 🔒 (Premium) | ④ Real answer | Hard | [leetcode.com/problems/minimize-max-distance-to-gas-station](https://leetcode.com/problems/minimize-max-distance-to-gas-station/) |

**Kaise practice karein**: Har problem pe pehle likho — *"x kya? Range kya? `feasible(x)` kaise (greedy)? MIN ya MAX?"* — phir code.

Agla: [11-bfs.md](11-bfs.md)
