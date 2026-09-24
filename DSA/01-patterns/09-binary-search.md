# 9. Binary Search

> Pehle ye aane chahiye: [Binary Search (basics)](../00-syllabus/01-basics/08-binary-search.md), [Sorting](../00-syllabus/01-basics/07-sorting.md)

> **Standard definition**: A search algorithm that repeatedly halves a sorted (or monotonic) search space by comparing the target to the middle element, achieving O(log n) time.

**Ek line mein**: Har step mein **beech dekho, aur jis taraf answer nahi ho sakta wo poora aadha hissa fenk do.** Sirf **sorted array** hi nahi — jahan bhi **"F F F T T T"** jaisi boundary ho, wahan chalta hai.

**Trick yaad rakhne ki**: *"Dictionary mein word dhoondhna"* — beech ka page kholo, word pehle ka hai ya baad ka dekho, aadhi dictionary discard. **Aur sabse zaroori mental model:**

```
predicate P(i):    F   F   F   F   T   T   T   T          ← binary search is BOUNDARY ko dhoondhta hai
                                   ↑
                        PEHLA True  (ya  aakhri False ke ek baad)
```

Har problem ko is line mein badlo: *"**`P(i)` kya hai** jo pehle False, phir True hota hai?"*

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Data SORTED hai  —  ya  koi bhi MONOTONIC condition hai  (ek taraf sab False, doosri taraf sab True)
✅ Sawaal "O(log n)" mangta hai  —  ya  n bahut bada (10⁵–10⁹) aur linear scan slow
✅ "pehla / aakhri", "insert kahan", "minimum jo chale", "peak", "rotated"
```

| Sawaal ki bhasha | Variation |
|---|---|
| "target **hai ya nahi** / index batao" (sorted) | ① **Exact** |
| "**pehla / aakhri** position", "**insert kahan**", "pehla bad version" | ② **Boundary** (first True / last True) |
| "**rotated** sorted array mein search / **minimum**" | ③ **Rotated** |
| "**peak / mountain** element" | ④ **Peak** (slope se) |
| "**sorted matrix** mein search" | ⑤ **2D** |
| "sorted par ek **akela alag**" (pairs mein), koi chhupa hua pattern | ⑥ **Hidden monotonic** |
| "do sorted arrays ka **median**" | ⑦ **Partition search** |
| "**minimum X jo** condition satisfy kare" (array nahi, answer ki range) | → [Binary Search on Answer](10-binary-search-on-answer.md) |

### ❌ Kab NAHI
- Data **unsorted** aur koi monotonic property nahi → linear / hashing.
- **Saare matches** chahiye (sirf ek nahi) → sort + scan / two pointers.
- `n` bahut chhota (≤ 20) → seedha loop bhi theek.

---

## 2. Teen templates — yehi yaad karo (baaki sab inhi se bante hain)

```
TEMPLATE A — EXACT (mila ya nahi)              TEMPLATE B — PEHLA TRUE                 TEMPLATE C — AAKHRI TRUE
lo = 0, hi = n − 1                              lo = 0, hi = n        (n = "koi nahi")   lo = −1, hi = n − 1   (−1 = "koi nahi")
while (lo <= hi):                               while (lo < hi):                         while (lo < hi):
    mid = lo + (hi − lo) / 2                        mid = lo + (hi − lo) / 2                 mid = lo + (hi − lo + 1) / 2   ← +1 !
    if a[mid] == target: return mid                 if P(mid): hi = mid                       if P(mid): lo = mid
    if a[mid] <  target: lo = mid + 1               else:      lo = mid + 1                   else:      hi = mid − 1
    else:                hi = mid − 1           return lo                                   return lo
return −1
```

| Chahiye | Template | `P(i)` |
|---|---|---|
| Target hai ya nahi | **A** | — |
| **Pehla** index jahan `a[i] ≥ x` (lower bound), insert position | **B** | `a[i] >= x` |
| **Pehla** bad version / pehla True | **B** | `isBad(i)` |
| **Aakhri** index jahan `a[i] ≤ x` | **C** | `a[i] <= x` |
| Minimum (rotated / answer) | **B** | `a[i] <= a[hi]` jaisa |

**Do zaroori baatein:**
1. **`mid = lo + (hi − lo) / 2`** (`(lo + hi) / 2` nahi — overflow).
2. **Template C mein `+1`** (`upper mid`) — warna `lo = mid` pe **infinite loop** (jab `hi = lo + 1` ho toh `mid == lo`).

## 3. Code likhne ki recipe — 3 sawaal

```
1. P(i) KYA?     →  "F F F T T T" wali condition likho.  (Sorted array mein aksar  a[i] >= x)
2. SEARCH SPACE  →  lo..hi kya?  Kya answer array ke BAHAR (n) ho sakta hai?  (haan → hi = n)
3. TEMPLATE      →  pehla True → B,   aakhri True → C,   sirf hai/nahi → A
```

---

## 4. ① Exact (Template A)

```java
public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;                 // 🔑 overflow-safe
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;               // target daayein hai
        else right = mid - 1;                                  // target baayein hai
    }
    return -1;
}
```

---

## 5. ② Boundary — Lower bound, First/Last Position, Insert Position

```
nums = [1, 2, 2, 2, 3],  target = 2

a[i] >= 2  :   F  T  T  T  T      → PEHLA True = index 1   (Template B)   ← first position
a[i] <= 2  :   T  T  T  T  F      → AAKHRI True = index 3  (Template C)   ← last position
```

```java
// Find First and Last Position of Element in Sorted Array
public int[] searchRange(int[] nums, int target) {
    int first = firstGE(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};   // target hai hi nahi
    return new int[]{first, lastLE(nums, target)};
}

// TEMPLATE B — pehla index jahan nums[i] >= target   (koi nahi → n)
private int firstGE(int[] nums, int target) {
    int lo = 0, hi = nums.length;                               // 🔑 hi = n: answer array ke bahar bhi ho sakta hai
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid;                       // P(mid) True → mid khud answer ho sakta hai
        else lo = mid + 1;
    }
    return lo;
}

// TEMPLATE C — aakhri index jahan nums[i] <= target   (koi nahi → −1)
private int lastLE(int[] nums, int target) {
    int lo = -1, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;                        // 🔑 upper mid (+1)
        if (nums[mid] <= target) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
```

**Search Insert Position** aur **First Bad Version** — dono **Template B** hain:

```java
// Insert Position: pehla index jahan nums[i] >= target (ya n)
public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

// First Bad Version: versions 1..n, isBad(v) pehle False phir True. Pehla True dhoondo
public int firstBadVersion(int n, java.util.function.IntPredicate isBad) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (isBad.test(mid)) hi = mid;                           // bad → pehla bad yahan ya usse pehle
        else lo = mid + 1;
    }
    return lo;
}
```

---

## 6. ③ Rotated Sorted Array

`[4, 5, 6, 7, 0, 1, 2]` — sorted array ko kisi jagah se ghuma diya.

**Do tareeke** (dono yaad rakho — jo aasan lage):

### Tareeka 1 — Minimum dhoondo (Template B), phir search

**Minimum ke liye `P`**: *"`nums[mid]` **`nums[hi]` se chhota ya barabar** hai?"* Kyunki minimum ke **daayein** sab `≤ nums[hi]`, aur **baayein** sab `> nums[hi]`.

```
nums = [4, 5, 6, 7, 0, 1, 2]        hi ka element = 2
P(i) = nums[i] <= 2 :   F  F  F  F  T  T  T        ← PEHLA True = minimum (index 4)

mid element > nums[hi]  →  minimum daayein hai   →  lo = mid + 1
mid element ≤ nums[hi]  →  minimum mid pe ya baayein →  hi = mid
```

```java
public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;                  // 🔑 mid badhte hisse mein → minimum daayein
        else hi = mid;                                            // minimum mid pe ya baayein
    }
    return nums[lo];
}

// Duplicates ke saath (Find Minimum II): nums[mid] == nums[hi] pe pata nahi → hi ko ek ghatao
public int findMinWithDuplicates(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else if (nums[mid] < nums[hi]) hi = mid;
        else hi--;                                                // barabar: hi safe hai chhodna (mid uska copy hai)
    }
    return nums[lo];
}
```

**Ab search**: minimum ki index (`pivot`) pata hai toh array **"virtually sorted"** hai — `mid` ko **`(mid + pivot) % n`** se asli index mein badlo aur **normal Template A** chalao!

```java
public int searchRotatedByPivot(int[] nums, int target) {
    int n = nums.length;
    int pivot = minIndex(nums);                                   // minimum kahan hai
    int lo = 0, hi = n - 1;
    while (lo <= hi) {                                             // Template A, virtual sorted array pe
        int mid = lo + (hi - lo) / 2;
        int real = (mid + pivot) % n;                              // 🔑 virtual index → asli index
        if (nums[real] == target) return real;
        if (nums[real] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

private int minIndex(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
```

### Tareeka 2 — Ek hi pass: "kaunsa aadha sorted hai?"

**Trick**: Beech se todo — **ek aadha hamesha sorted** hota hai. Dekho `target` us sorted aadhe ke range mein hai ya nahi.

```
[4  5  6  7 │ 0  1  2]      target = 0        mid = 7
 lo        mid       hi
nums[lo] <= nums[mid]  →  baayein aadha [4..7] sorted hai.  0 uski range [4, 7) mein? NAHI → daayein jao (lo = mid + 1)
```

```java
public int searchRotated(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {                               // 🔑 baayein aadha sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;   // target sorted aadhe ke andar
            else lo = mid + 1;
        } else {                                                   // daayein aadha sorted
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}

// Duplicates ke saath (Search in Rotated II): nums[lo] == nums[mid] == nums[hi] pe kaunsa aadha sorted, pata nahi → dono sire ek-ek andar
public boolean searchRotatedWithDuplicates(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return true;
        if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; continue; }   // 🔑 pata nahi chal raha → shrink
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return false;
}
```

---

## 7. ④ Peak / Mountain (slope se)

**Idea**: `nums[mid]` ko **agle** `nums[mid + 1]` se compare karo — **slope** batati hai peak kis taraf hai. **`P(i)` = "`nums[i] > nums[i+1]`"** (utraai shuru) — pehle F (chadhai), phir T. **Template B.**

```
nums = [1, 2, 3, 1]

mid=1 (2):  2 < 3  → abhi CHADH rahe hain → peak daayein   lo = mid + 1
mid=2 (3):  3 > 1  → utar rahe hain      → peak mid pe ya baayein   hi = mid     →  peak = index 2 ✅
```

```java
// Find Peak Element (koi bhi peak chalega; nums[-1] = nums[n] = −∞ maano)
public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;              // 🔑 chadh rahe hain → peak daayein
        else hi = mid;                                             // utar rahe → peak mid pe ya baayein
    }
    return lo;
}
```

(Peak Index in Mountain Array bhi bilkul yahi code hai.)

---

## 8. ⑤ 2D Sorted Matrix

**Search a 2D Matrix** (har row sorted, aur row ka pehla > pichhli row ka aakhri): matrix ko **ek lambi sorted 1D array** maano — `mid` se `row = mid / cols`, `col = mid % cols`.

```java
public boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int lo = 0, hi = rows * cols - 1;                              // virtual 1D array
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int value = matrix[mid / cols][mid % cols];                // 🔑 1D index → (row, col)
        if (value == target) return true;
        if (value < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}

// Search a 2D Matrix II (row aur column dono sorted, par rows ke beech koi rishta nahi) — staircase, O(m + n)
public boolean searchMatrixII(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;                       // upar-daayein kone se
    while (row < matrix.length && col >= 0) {
        int v = matrix[row][col];
        if (v == target) return true;
        if (v > target) col--;                                     // bada hai → is column mein neeche sab aur bade → column hatao
        else row++;                                                 // chhota hai → is row mein baayein sab aur chhote → row hatao
    }
    return false;
}
```

---

## 9. ⑥ Hidden Monotonic — Single Element in a Sorted Array

Har number **do baar**, ek **akela**. **Sorted**. Akele se **pehle**: jodi **(even, odd)** index pe (`nums[2k] == nums[2k+1]`). Akele ke **baad**: jodi **(odd, even)** pe. Yaani **"jodi even index se shuru hoti hai?"** — pehle T, phir F.

```
nums = [1, 1, 2, 3, 3, 4, 4, 8, 8]        index:  0  1  2  3  4  5  6  7  8      (akela = 2, index 2)

lo=0 hi=8: mid=4 (even)  nums[4]=3, nums[5]=4  → barabar NAHI → jodi toot chuki → akela mid pe ya baayein → hi = 4
lo=0 hi=4: mid=2 (even)  nums[2]=2, nums[3]=3  → barabar NAHI                                             → hi = 2
lo=0 hi=2: mid=1 (odd → mid=0)  nums[0]=1, nums[1]=1 → barabar ✓ → jodi theek → akela daayein            → lo = 2
lo == hi = 2  →  nums[2] = 2  ✅
```

```java
public int singleNonDuplicate(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;                                    // 🔑 mid ko hamesha EVEN index pe rakho (jodi ka pehla)
        if (nums[mid] == nums[mid + 1]) lo = mid + 2;               // jodi sahi → akela iske daayein
        else hi = mid;                                               // jodi toot gayi → akela mid pe ya baayein
    }
    return nums[lo];
}
```

Ye sikhata hai ki **kabhi-kabhi monotonic property chhupi hoti hai** — "**kuch aisa** jo pehle sach, phir jhooth" dhoondho.

---

## 10. ⑦ Median of Two Sorted Arrays — Partition par search (Hard)

**Idea**: Median = **dono arrays ko ek saath aadha-aadha baantne wali line**. Chhoti array `a` mein **kitne elements baayein hisse mein jayenge (`i`)** — us pe binary search. Baaki `j = half − i` `b` se aate hain. **Sahi partition** tab: `aLeft ≤ bRight` **aur** `bLeft ≤ aRight`.

```
a = [1, 3]      b = [2]        total 3, half = (3+1)/2 = 2  (baayein hisse mein 2 elements)

i = 1 (a se [1]),  j = 1 (b se [2])   →  baayein: {1, 2}   daayein: {3}
aLeft=1  aRight=3   bLeft=2  bRight=+∞
aLeft ≤ bRight ✓   bLeft ≤ aRight (2 ≤ 3) ✓   →  sahi partition
total ODD → median = max(aLeft, bLeft) = 2 ✅
```

```java
public double findMedianSortedArrays(int[] a, int[] b) {
    if (a.length > b.length) return findMedianSortedArrays(b, a);    // 🔑 chhoti array pe search
    int m = a.length, n = b.length;
    int lo = 0, hi = m;
    int half = (m + n + 1) / 2;                                       // baayein hisse mein kitne elements
    while (lo <= hi) {
        int i = lo + (hi - lo) / 2;                                   // a se i elements baayein
        int j = half - i;                                             // b se j elements baayein
        int aLeft  = i == 0 ? Integer.MIN_VALUE : a[i - 1];
        int aRight = i == m ? Integer.MAX_VALUE : a[i];
        int bLeft  = j == 0 ? Integer.MIN_VALUE : b[j - 1];
        int bRight = j == n ? Integer.MAX_VALUE : b[j];
        if (aLeft <= bRight && bLeft <= aRight) {                     // sahi partition
            if ((m + n) % 2 == 1) return Math.max(aLeft, bLeft);
            return (Math.max(aLeft, bLeft) + (double) Math.min(aRight, bRight)) / 2;
        } else if (aLeft > bRight) {
            hi = i - 1;                                                // a ka baayein hissa bada → i ghatao
        } else {
            lo = i + 1;                                                // a se aur lo
        }
    }
    throw new IllegalArgumentException("arrays sorted nahi hain");
}
```

---

## 11. Sab ek nazar mein

| Variation | Template | `P(i)` / kya compare | Space `lo..hi` |
|---|---|---|---|
| ① Exact | A | `a[mid] == target` | `0 .. n−1` |
| ② First ≥ x / insert | **B** | `a[i] >= x` | `0 .. n` |
| ② Last ≤ x | **C** | `a[i] <= x` | `−1 .. n−1` |
| ② First bad version | **B** | `isBad(i)` | `1 .. n` |
| ③ Rotated min | **B** | `a[mid] <= a[hi]` | `0 .. n−1` |
| ③ Rotated search | A (2 tareeke) | sorted aadha / pivot shift | `0 .. n−1` |
| ④ Peak | **B** | `a[mid] > a[mid+1]` | `0 .. n−1` |
| ⑤ Matrix | A | `mid / cols`, `mid % cols` | `0 .. m·n−1` |
| ⑥ Single element | B jaisa | `nums[even] == nums[even+1]` | `0 .. n−1` |
| ⑦ Median | partition | `aLeft ≤ bRight && bLeft ≤ aRight` | `0 .. m` |

## Common galtiyan

- **Template C mein `+1` bhoolna** — infinite loop (`lo = mid` pe atak jaata hai).
- **`lo <= hi` aur `lo < hi` mix karna** — template ke saath updates (`mid ± 1` vs `mid`) bhi milao.
- **`hi = n − 1` rakhna jab answer `n` ho sakta hai** (sabse bada element bhi chhota nikla) — `hi = n`.
- **Rotated array mein `nums[mid]` ko `nums[lo]` se compare karke minimum dhundhna** — `nums[hi]` se compare karo (`lo` se ambiguity hoti hai).
- **Duplicates mein `hi--` / `lo++` bhoolna** — worst case O(n) hota hai, par sahi rehta hai.
- **`(lo + hi) / 2`** — overflow.
- **Comparator ya `P(i)` monotonic nahi** — pehle 3–4 index pe likhke `F F T T` dekh lo.

> 💡 **Interview mein bolne wali line**: *"Yahan ek monotonic predicate hai — pehle false, phir true. Main us boundary pe binary search karunga: `mid` pe predicate true toh `hi = mid` (mid khud answer ho sakta hai), false toh `lo = mid + 1`. O(log n) time, O(1) space."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Binary Search | ① Exact | Easy | [leetcode.com/problems/binary-search](https://leetcode.com/problems/binary-search/) |
| 2 | Search Insert Position | ② Boundary | Easy | [leetcode.com/problems/search-insert-position](https://leetcode.com/problems/search-insert-position/) |
| 3 | First Bad Version | ② Boundary | Easy | [leetcode.com/problems/first-bad-version](https://leetcode.com/problems/first-bad-version/) |
| 4 | Find First and Last Position of Element in Sorted Array | ② B + C | Medium | [leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| 5 | Find Minimum in Rotated Sorted Array | ③ Rotated | Medium | [leetcode.com/problems/find-minimum-in-rotated-sorted-array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| 6 | Search in Rotated Sorted Array | ③ Rotated | Medium | [leetcode.com/problems/search-in-rotated-sorted-array](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| 7 | Search in Rotated Sorted Array II | ③ Duplicates | Medium | [leetcode.com/problems/search-in-rotated-sorted-array-ii](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) |
| 8 | Find Minimum in Rotated Sorted Array II | ③ Duplicates | Hard | [leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) |
| 9 | Find Peak Element | ④ Peak | Medium | [leetcode.com/problems/find-peak-element](https://leetcode.com/problems/find-peak-element/) |
| 10 | Peak Index in a Mountain Array | ④ Peak | Medium | [leetcode.com/problems/peak-index-in-a-mountain-array](https://leetcode.com/problems/peak-index-in-a-mountain-array/) |
| 11 | Search a 2D Matrix | ⑤ 2D | Medium | [leetcode.com/problems/search-a-2d-matrix](https://leetcode.com/problems/search-a-2d-matrix/) |
| 12 | Search a 2D Matrix II | ⑤ Staircase | Medium | [leetcode.com/problems/search-a-2d-matrix-ii](https://leetcode.com/problems/search-a-2d-matrix-ii/) |
| 13 | Single Element in a Sorted Array | ⑥ Hidden | Medium | [leetcode.com/problems/single-element-in-a-sorted-array](https://leetcode.com/problems/single-element-in-a-sorted-array/) |
| 14 | Time Based Key-Value Store | ② Last ≤ time | Medium | [leetcode.com/problems/time-based-key-value-store](https://leetcode.com/problems/time-based-key-value-store/) |
| 15 | Median of Two Sorted Arrays | ⑦ Partition | Hard | [leetcode.com/problems/median-of-two-sorted-arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) |

**Kaise practice karein**: Har problem pe pehle likho — *"`P(i)` kya (F F F T T T)? Space `lo..hi` kya? Template A / B / C?"* — phir code.

Agla: [10-binary-search-on-answer.md](10-binary-search-on-answer.md)
