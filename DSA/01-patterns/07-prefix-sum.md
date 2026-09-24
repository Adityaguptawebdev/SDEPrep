# 7. Prefix Sum

> Pehle ye aane chahiye: [Arrays](../00-syllabus/01-basics/02-arrays.md), [Hashing](../00-syllabus/01-basics/04-hashing.md)

> **Standard definition**: Precomputing cumulative sums of an array so that the sum of any subarray/range can be answered in O(1) time instead of recomputing it each time.

**Ek line mein**: `prefix[i]` = **shuru se `i` tak ka total**. Tab **koi bhi subarray ka sum = do prefix ka farak** — `sum(l..r) = prefix[r+1] − prefix[l]` — aur "kaunsa subarray ka sum X hai?" wala sawaal ban jata hai **"do prefix dhoondho jinka farak X ho"** (HashMap se O(1)).

**Trick yaad rakhne ki**: *"Bank passbook ka running balance"* — har transaction ke baad **balance** likha hota hai. Do dates ke beech kitna kharch hua? Poori list dobara mat jodo — **dono dates ka balance ghata do**.

```
nums     :   [  3    1    4    1    5  ]
prefix   :  [0    3    4    8    9   14 ]        prefix[i] = pehle i elements ka sum,  prefix[0] = 0 (khaali)

sum(1..3) = nums[1] + nums[2] + nums[3] = 1 + 4 + 1 = 6
          = prefix[4] − prefix[1] = 9 − 3 = 6   ✅
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Sawaal SUBARRAY / range ka sum (ya XOR / count) ka hai
✅ Ek hi array pe BAAR-BAAR range query  —  ya  "kitne / sabse lamba subarray jiska sum = k"
✅ Numbers NEGATIVE ho sakte hain (sliding window yahan fail hota hai — prefix chalta hai!)
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**range `[l, r]` ka sum**" baar-baar (immutable array) | ① **Range Query** |
| "**kitne subarrays** ka sum = k" | ② **Count (HashMap: prefix → count)** |
| "subarray ka sum **k se divisible / multiple**" | ③ **Remainder (prefix % k)** |
| "**sabse lamba** subarray jiska sum = k / barabar 0-1" | ④ **Longest (HashMap: prefix → FIRST index)** |
| "**matrix** mein sub-rectangle ka sum" | ⑤ **2D Prefix** |
| "range mein **+x** kai baar (updates), phir final array" | ⑥ **Difference Array** |
| "**baayein ka sab / daayein ka sab** (i ko chhod ke)" — product except self, pivot | ⑦ **Prefix + Suffix** |

**Prefix Sum vs Sliding Window** — dono subarray, farak kya?

| | [Sliding Window](01-sliding-window.md) | Prefix Sum (+ HashMap) |
|---|---|---|
| Numbers | Sirf **positive** / condition monotonic | **Negative bhi** chalta hai |
| Sawaal | longest/shortest jinme "at most / at least" | **exactly = k**, divisible, range queries |
| Space | O(1) ya O(k) | O(n) (map/array) |

**Rule**: *"Subarray sum **exactly k** + negative numbers → Prefix Sum + HashMap."*

### ❌ Kab NAHI
- Array **baar-baar badalta** hai (point updates) aur range query bhi → [Fenwick / Segment Tree](../00-syllabus/07-advanced/28-segment-tree-and-fenwick.md).
- Sirf **ek baar** ek subarray ka sum chahiye → seedha loop.

---

## 2. Code likhne ki recipe — 3 sawaal

```
1. PREFIX KYA?   →  sum / xor / count / prefix % k         (jo cheez "ghatane se" wapas nikal sakti ho)
2. FORMULA       →  prefix[j] − prefix[i] = target   ⇒   dhoondho:  prefix[i] = prefix[j] − target
3. MAP MEIN KYA  →  kitni baar (COUNT)  /  pehli baar kahan (FIRST INDEX)  /  hai ya nahi
```

**Sabse zaroori (HashMap wale sawaalon ke liye):**

```
Har j pe:   pehle QUERY  (map mein  prefix[j] − target  dhoondho)   →   phir prefix[j] ko map mein DAALO
Shuruaat:   map mein "khaali prefix" pehle se daalo  →   prefix 0  ↔  count 1  (ya  index −1)
```

| Sawaal | Map | Shuru mein | Har step pe |
|---|---|---|---|
| **Count** subarrays, sum = k | prefix → **count** | `{0 : 1}` | `ans += map[prefix − k]`; `map[prefix]++` |
| **Longest** subarray, sum = k | prefix → **pehla index** | `{0 : −1}` | `ans = max(ans, i − map[prefix − k])`; **sirf agar pehle nahi tha** toh `put` |
| Count, sum **divisible by k** | `prefix % k` → count | `{0 : 1}` | `ans += map[mod]`; `map[mod]++` |
| Exists, sum **multiple of k**, length ≥ 2 | `prefix % k` → pehla index | `{0 : −1}` | mila aur `i − idx ≥ 2` → `true` |

**"Longest" mein FIRST index kyun?** Sabse **pehla** index rakhne se `i − index` **sabse bada** milta hai (subarray sabse lamba). Isliye dobara aane pe **overwrite mat karo**.

---

## 3. ① Range Query (prefix array)

```java
class NumArray {
    private final int[] prefix;

    NumArray(int[] nums) {
        prefix = new int[nums.length + 1];                         // prefix[i] = pehle i elements ka sum
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];                    // 🔑 [left..right] = prefix[right+1] − prefix[left]
    }
}
```

**`prefix` ka size `n + 1` kyun?** `prefix[0] = 0` (khaali) rakhne se **`left = 0` ke liye alag `if` nahi** lagta — sab range ek jaisi.

**Sum ki jagah XOR bhi chalta hai** (XOR khud ka ulta hai: `a ^ a = 0`):

```java
public int[] xorQueries(int[] arr, int[][] queries) {
    int[] prefix = new int[arr.length + 1];
    for (int i = 0; i < arr.length; i++) prefix[i + 1] = prefix[i] ^ arr[i];
    int[] ans = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        ans[q] = prefix[queries[q][1] + 1] ^ prefix[queries[q][0]];   // "ghatana" ki jagah XOR
    }
    return ans;
}
```

---

## 4. ② Count Subarrays — Subarray Sum Equals K

```
nums = [1, 2, 3],  k = 3           map = {0: 1}

x=1: prefix = 1   dhoondho (1 − 3 = −2) → 0 baar          map {0:1, 1:1}
x=2: prefix = 3   dhoondho (3 − 3 =  0) → 1 baar ✅ [1,2]   map {0:1, 1:1, 3:1}
x=3: prefix = 6   dhoondho (6 − 3 =  3) → 1 baar ✅ [3]     map {..., 6:1}

answer = 2
```

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    count.put(0, 1);                                        // 🔑 khaali prefix (sum 0) ek baar dekha ja chuka hai
    int prefix = 0, ans = 0;
    for (int x : nums) {
        prefix += x;
        ans += count.getOrDefault(prefix - k, 0);           // pehle QUERY: kitne prefix (prefix − k) ke the
        count.merge(prefix, 1, Integer::sum);                // phir is prefix ko record
    }
    return ans;
}
```

**Order (pehle query, phir insert) kyun?** Ulta karoge toh `k = 0` pe **khud ko hi gin loge** (khaali subarray).

---

## 5. ③ Remainder (divisible by K)

**Idea**: `(prefix[j] − prefix[i]) % k == 0` ⟺ **`prefix[j] % k == prefix[i] % k`**. Yaani **same remainder wale do prefix** dhoondho.

**Java ka jaal**: `%` negative dega (`−3 % 5 = −3`). **`((x % k) + k) % k`** se hamesha `0..k−1`.

```java
// Subarray Sums Divisible by K — kitne subarrays
public int subarraysDivByK(int[] nums, int k) {
    int[] count = new int[k];                                // count[r] = remainder r wale prefix kitne
    count[0] = 1;                                            // khaali prefix
    int prefix = 0, ans = 0;
    for (int x : nums) {
        prefix = ((prefix + x) % k + k) % k;                 // 🔑 negative-safe remainder
        ans += count[prefix];                                 // pehle jitne prefix ka remainder same tha
        count[prefix]++;
    }
    return ans;
}

// Continuous Subarray Sum — length ≥ 2 ka subarray jiska sum k ka multiple ho? (pehla index rakho)
public boolean checkSubarraySum(int[] nums, int k) {
    Map<Integer, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0, -1);
    int prefix = 0;
    for (int i = 0; i < nums.length; i++) {
        prefix = ((prefix + nums[i]) % k + k) % k;
        if (firstIndex.containsKey(prefix)) {
            if (i - firstIndex.get(prefix) >= 2) return true;   // length ≥ 2
        } else {
            firstIndex.put(prefix, i);                           // sirf PEHLI baar (sabse lamba subarray)
        }
    }
    return false;
}
```

---

## 6. ④ Longest Subarray (FIRST index map)

### Contiguous Array — barabar 0 aur 1 wala sabse lamba subarray

**Trick**: **`0` ko `−1` maan lo**. Ab "barabar 0 aur 1" = "**sum 0**". Aur "sum 0" = "**do prefix barabar**" — sabse door wale do barabar prefix ka farak = answer.

```
nums = [0, 1, 0, 0, 1, 1]      0 → −1:  [−1, +1, −1, −1, +1, +1]

i : -1   0    1    2    3    4    5
bal: 0  -1    0   -1   -2   -1    0          balance = ab tak ka prefix
       ↑    ↑    ↑         ↑    ↑
   pehli baar dikha: 0 @ -1,  -1 @ 0,  -2 @ 3

i=1: bal 0 → pehle -1 pe dekha → length 1 − (−1) = 2
i=2: bal -1 → pehle 0 pe → length 2 − 0 = 2
i=4: bal -1 → pehle 0 pe → length 4 − 0 = 4
i=5: bal  0 → pehle -1 pe → length 5 − (−1) = 6  ✅ (poora array)
```

```java
public int findMaxLength(int[] nums) {
    Map<Integer, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0, -1);                                   // khaali prefix index −1 pe
    int balance = 0, best = 0;
    for (int i = 0; i < nums.length; i++) {
        balance += nums[i] == 1 ? 1 : -1;                     // 🔑 0 ko −1 maano
        if (firstIndex.containsKey(balance)) {
            best = Math.max(best, i - firstIndex.get(balance));   // pehle jahan dikha wahan se yahan tak
        } else {
            firstIndex.put(balance, i);                       // PEHLI baar hi likho
        }
    }
    return best;
}

// Maximum Size Subarray Sum Equals K (Premium) — negative numbers ke saath sum exactly k wala sabse lamba
public int maxSubArrayLen(int[] nums, int k) {
    Map<Integer, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0, -1);
    int prefix = 0, best = 0;
    for (int i = 0; i < nums.length; i++) {
        prefix += nums[i];
        if (firstIndex.containsKey(prefix - k)) {
            best = Math.max(best, i - firstIndex.get(prefix - k));
        }
        firstIndex.putIfAbsent(prefix, i);                    // pehli baar hi (overwrite nahi)
    }
    return best;
}
```

---

## 7. ⑤ 2D Prefix Sum (matrix ke andar rectangle)

`prefix[i][j]` = **top-left `(0,0)` se `(i−1, j−1)` tak ke rectangle ka sum**. **Inclusion–Exclusion**: upar wala + baayein wala **− dono mein jo double gina gaya**.

```
Banate waqt:    P[i+1][j+1] = M[i][j] + P[i][j+1] + P[i+1][j] − P[i][j]
                              (cell)   (upar ka)   (baayein ka)  (dono mein common)

Query (r1,c1)–(r2,c2):   P[r2+1][c2+1]  −  P[r1][c2+1]  −  P[r2+1][c1]  +  P[r1][c1]
                         (bada rect)      (upar kaato)     (baayein kaato)  (dono kate → wapas jodo)
```

```java
class NumMatrix {
    private final int[][] prefix;

    NumMatrix(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        prefix = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefix[i + 1][j + 1] = matrix[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];   // 🔑 double-count hata do
            }
        }
    }

    int sumRegion(int r1, int c1, int r2, int c2) {
        return prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];
    }
}
```

---

## 8. ⑥ Difference Array (range update — ulta prefix sum)

**Problem**: Kai baar **"`[l, r]` mein sab pe `+x`"** karna hai, aakhir mein final array chahiye. Har baar `l..r` loop = O(n) × updates — bahut slow.

**Trick**: **Sirf do jagah** likho — `diff[l] += x` (yahan se +x shuru) aur `diff[r+1] -= x` (yahan khatam). Aakhir mein **prefix sum** lo — wahi final array!

```
n = 5,   [2, 4] mein +10  aur  [1, 3] mein +20         (1-indexed)

diff:  index :  1    2    3    4    5    6
              +20  +10        −20  −10              ← diff[1]+=20, diff[4]−=20, diff[2]+=10, diff[5]−=10
prefix sum:    20   30   30   10    0                ← final array
```

```java
// Corporate Flight Bookings: bookings[i] = {first, last, seats}  →  har flight ke total seats (1..n)
public int[] corpFlightBookings(int[][] bookings, int n) {
    int[] diff = new int[n + 2];
    for (int[] b : bookings) {
        diff[b[0]] += b[2];                                  // first se seats shuru
        diff[b[1] + 1] -= b[2];                              // last ke ek baad khatam
    }
    int[] ans = new int[n];
    int running = 0;
    for (int i = 1; i <= n; i++) {
        running += diff[i];                                   // 🔑 prefix sum = final value
        ans[i - 1] = running;
    }
    return ans;
}
```

(Car Pooling — [Merge Intervals note](04-merge-intervals.md) — isi ka roop hai.)

---

## 9. ⑦ Prefix + Suffix (i ko chhod ke baayein aur daayein)

**Idea**: `i` pe jawab = **(`i` se pehle sab) ka kuch** aur **(`i` ke baad sab) ka kuch**. Ek pass left→right (prefix), ek right→left (suffix).

```java
// Find Pivot Index — jahan baayein ka sum == daayein ka sum
public int pivotIndex(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    int left = 0;                                            // abhi tak (i se pehle) ka sum
    for (int i = 0; i < nums.length; i++) {
        if (left == total - left - nums[i]) return i;        // 🔑 daayein ka sum = total − left − nums[i]
        left += nums[i];
    }
    return -1;
}

// Product of Array Except Self — division ke bina, O(1) extra space (output array ke alawa)
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    ans[0] = 1;
    for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];        // ans[i] = i se PEHLE sabka product
    int suffix = 1;                                                       // i ke BAAD sabka product
    for (int i = n - 1; i >= 0; i--) {
        ans[i] *= suffix;                                                  // prefix × suffix
        suffix *= nums[i];
    }
    return ans;
}
```

```
nums = [1, 2, 3, 4]
prefix product (i se pehle):   [1, 1, 2, 6]
suffix product (i ke baad):    [24, 12, 4, 1]
ans = prefix × suffix      :   [24, 12, 8, 6]  ✅
```

---

## 10. Sab ek nazar mein

| Variation | Prefix kya | Formula / query | Map |
|---|---|---|---|
| ① Range sum | `prefix[i+1] = prefix[i] + a[i]` | `prefix[r+1] − prefix[l]` | — |
| ② Count = k | running sum | `map[prefix − k]` | prefix → **count**, `{0:1}` |
| ③ Divisible | `prefix % k` (negative-safe) | `count[mod]` | mod → count, `{0:1}` |
| ④ Longest | running sum / balance | `i − map[prefix − k]` | prefix → **first index**, `{0:−1}` |
| ⑤ 2D | inclusion–exclusion | 4 corner formula | — |
| ⑥ Range update | **difference** array | phir prefix sum | — |
| ⑦ Prefix + Suffix | left pass + right pass | `prefix[i] ⊕ suffix[i]` | — |

## Common galtiyan

- **`prefix` ka size `n`** (`n + 1` nahi) — `left = 0` pe alag case lagana padta hai. `prefix[0] = 0` rakho.
- **Map mein `{0: 1}` (ya `{0: −1}`) bhoolna** — **shuru se wale** subarrays chhoot jaate hain.
- **Query se pehle insert** — `k = 0` pe khali subarray gin jaata hai.
- **Longest wale mein index overwrite** — pehla index hi rakho (`putIfAbsent`).
- **Negative remainder** — `((x % k) + k) % k`.
- **`int` overflow** (`sum` bahut bada) — `long`.
- **Sliding window lagana negative numbers pe** — galat; prefix + map lo.

> 💡 **Interview mein bolne wali line**: *"Sliding window negative numbers mein kaam nahi karega. Prefix sum lunga: subarray `(i, j]` ka sum = `prefix[j] − prefix[i]`. `= k` chahiye toh har `j` pe dekhunga `prefix[j] − k` pehle kabhi aaya tha kya — HashMap se O(1). Total O(n) time aur O(n) space."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Range Sum Query - Immutable | ① Range | Easy | [leetcode.com/problems/range-sum-query-immutable](https://leetcode.com/problems/range-sum-query-immutable/) |
| 2 | XOR Queries of a Subarray | ① XOR prefix | Medium | [leetcode.com/problems/xor-queries-of-a-subarray](https://leetcode.com/problems/xor-queries-of-a-subarray/) |
| 3 | Subarray Sum Equals K | ② Count | Medium | [leetcode.com/problems/subarray-sum-equals-k](https://leetcode.com/problems/subarray-sum-equals-k/) |
| 4 | Count Number of Nice Subarrays | ② Count | Medium | [leetcode.com/problems/count-number-of-nice-subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/) |
| 5 | Subarray Sums Divisible by K | ③ Remainder | Medium | [leetcode.com/problems/subarray-sums-divisible-by-k](https://leetcode.com/problems/subarray-sums-divisible-by-k/) |
| 6 | Continuous Subarray Sum | ③ Remainder + index | Medium | [leetcode.com/problems/continuous-subarray-sum](https://leetcode.com/problems/continuous-subarray-sum/) |
| 7 | Contiguous Array | ④ Longest | Medium | [leetcode.com/problems/contiguous-array](https://leetcode.com/problems/contiguous-array/) |
| 8 | Maximum Size Subarray Sum Equals k 🔒 (Premium) | ④ Longest | Medium | [leetcode.com/problems/maximum-size-subarray-sum-equals-k](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/) |
| 9 | Range Sum Query 2D - Immutable | ⑤ 2D | Medium | [leetcode.com/problems/range-sum-query-2d-immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/) |
| 10 | Corporate Flight Bookings | ⑥ Difference | Medium | [leetcode.com/problems/corporate-flight-bookings](https://leetcode.com/problems/corporate-flight-bookings/) |
| 11 | Car Pooling | ⑥ Difference | Medium | [leetcode.com/problems/car-pooling](https://leetcode.com/problems/car-pooling/) |
| 12 | Find Pivot Index | ⑦ Prefix + suffix | Easy | [leetcode.com/problems/find-pivot-index](https://leetcode.com/problems/find-pivot-index/) |
| 13 | Product of Array Except Self | ⑦ Prefix + suffix | Medium | [leetcode.com/problems/product-of-array-except-self](https://leetcode.com/problems/product-of-array-except-self/) |
| 14 | Make Sum Divisible by P | ③ Remainder (hard-ish) | Medium | [leetcode.com/problems/make-sum-divisible-by-p](https://leetcode.com/problems/make-sum-divisible-by-p/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Prefix kya? Formula kya (`prefix[j] − target`)? Map mein count ya first index? Map ka shuruati entry?"* — phir code.

Agla: [08-bit-manipulation.md](08-bit-manipulation.md)
