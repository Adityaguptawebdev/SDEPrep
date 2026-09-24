# 8. Binary Search

> 📍 **Syllabus**: Unit 1 — Basics · Topic 8 / 29 · Pehle chahiye: [Arrays](02-arrays.md), [Sorting](07-sorting.md)

> **Standard definition**: A search algorithm that finds a target in a sorted collection by repeatedly comparing the target with the middle element and discarding the half that cannot contain it, running in O(log n) time.

**Ek line mein**: Sorted data mein **beech ka element dekho, aur jis taraf answer nahi ho sakta, wo poora aadha hissa fenk do** — har step mein search space aadha.

**Trick yaad rakhne ki**: *"Number guess karne ka khel"* — dost ne 1 se 100 ke beech ek number socha hai. Tum **seedha 50** poochte ho. Dost bolta hai *"bada hai"* → ab 1–49 gaya, 51–100 bacha. Phir **75**... Sirf **7 sawaal** mein pakad lete ho (`log₂ 100 ≈ 7`), 100 nahi. Dictionary mein bhi aise hi **beech ka page** kholte ho.

**Kab use karo**: Data **sorted** ho, ya problem mein **"pehla True"** / **"minimum jo chalega"** jaisa koi **monotonic** (F F F T T T) sawaal ho. Iski ek poori family hai — [Binary Search pattern](../../01-patterns/09-binary-search.md) aur [Binary Search on Answer](../../01-patterns/10-binary-search-on-answer.md) bhi dekho.

## Kaise kaam karta hai — 23 dhoondhna hai

```
idx :   0   1   2    3    4    5    6    7    8    9
val :   2   5   8   12   16   23   38   56   72   91

step 1:  L=0 ............ mid=4 (16) ........... R=9      16 < 23  →  target daayein hai  →  L = 5
step 2:            L=5 .......... mid=7 (56) .... R=9      56 > 23  →  target baayein hai →  R = 6
step 3:            L=5 mid=5 (23) R=6                      23 == 23 →  MIL GAYA ✅  (3 steps, 10 elements mein)
```

**Kitna fast**: `n → n/2 → n/4 → ... → 1` — **log₂ n** steps. 100 crore elements mein bhi sirf **~30 steps**!

## Mental model: "F F F T T T" (sabse zaroori idea)

```
condition(i):   F   F   F   F   T   T   T   T
                                ↑
                      PEHLA True — binary search yahi dhoondhta hai
```

Jab bhi tumhare paas aisi line ho jisme **pehle sab False, phir sab True** (monotonic), binary search us **boundary** ko O(log n) mein pakad leta hai. Sorted array mein target dhundhna, "pehla element ≥ x", "sabse chhota valid answer" — sab isi ke roop hain.

## Code example 1 — Classic Binary Search

```java
public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;      // 🔑 (left + right) / 2 nahi — bade numbers pe overflow ho sakta hai
        if (arr[mid] == target) return mid;       // mil gaya
        if (arr[mid] < target) left = mid + 1;    // target daayein hai → baayein aadha fenk do
        else right = mid - 1;                     // target baayein hai → daayein aadha fenk do
    }
    return -1;                                    // left > right ho gaya → element hai hi nahi
}
```

**Line by line samjho**: `left..right` wo **zone** hai jahan target ho sakta hai. Har baar `mid` dekhte hain; `mid` galat nikla toh `mid ± 1` se zone chhota karte hain (`mid` ko bhi hata dete hain kyunki wo check ho chuka). Zone khaali (`left > right`) ho gaya → target nahi hai.

## Code example 2 — Lower Bound / Upper Bound (duplicates ke liye)

`arr = [1, 2, 2, 2, 3]`, target = 2:

```
idx        :  0  1  2  3  4
val        :  1  2  2  2  3
arr[i] >= 2:  F  T  T  T  T     →  lowerBound = 1   (pehla index jahan arr[i] >= 2)
arr[i] >  2:  F  F  F  F  T     →  upperBound = 4   (pehla index jahan arr[i] >  2)

2 kahan-kahan hai:  index 1 se (4 − 1) = 3, yaani [1, 3]      count = upper − lower = 3
```

```java
// Pehla index jahan arr[i] >= target  (agar sab chhote hain toh arr.length)
public int lowerBound(int[] arr, int target) {
    int left = 0, right = arr.length;             // 🔑 right = length: answer array ke BAHAR (length) bhi ho sakta hai
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) right = mid;      // mid khud answer ho sakta hai → rakho (mid − 1 nahi!)
        else left = mid + 1;
    }
    return left;
}

// Pehla index jahan arr[i] > target
public int upperBound(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > target) right = mid;
        else left = mid + 1;
    }
    return left;
}

// Find First and Last Position of Element — do bounds se
public int[] searchRange(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};   // target hai hi nahi
    return new int[]{first, upperBound(nums, target) - 1};
}
```

**Trick — do templates yaad rakho**:
| Template | Loop | Jab use karo |
|---|---|---|
| **Exact match** | `while (left <= right)`, `mid ± 1` | "Target hai ya nahi" |
| **Boundary (F F T T)** | `while (left < right)`, `right = mid` / `left = mid + 1` | "Pehla index jahan..." |

Boundary wale template mein `right = mid` isliye kyunki `mid` **khud answer** ho sakta hai.

## Code example 3 — Rotated Sorted Array

`[4, 5, 6, 7, 0, 1, 2]` — sorted array ko kisi jagah se ghuma diya. **Trick**: *"Beech se todo — ek aadha hamesha sorted hi hota hai."*

```
[4  5  6  7 │ 0  1  2]     target = 0
 L        mid         R
 baayein hissa [4..7] sorted hai (nums[left] <= nums[mid]) → kya 0 iske range [4, 7) mein hai? Nahi
 → toh target daayein hissa mein hoga → left = mid + 1
```

```java
public int searchRotated(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) {                                   // 🔑 baayein aadha sorted hai
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;   // target is sorted hisse ke andar hai
            else left = mid + 1;
        } else {                                                          // daayein aadha sorted hai
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}
```

## Code example 4 — Answer pe Binary Search (jhalak)

Kabhi array sorted nahi hota, par **answer ki range** monotonic hoti hai. Jaise `√x` nikaalna: `mid × mid <= x` wala condition **T T T T F F F** hota hai — sabse bada True dhoondho.

```java
public int mySqrt(int x) {
    long left = 0, right = x, ans = 0;
    while (left <= right) {
        long mid = left + (right - left) / 2;
        if (mid * mid <= x) {          // mid valid hai (zyada bada nahi) → shayad aur bada bhi chalega
            ans = mid;                 // abhi tak ka best answer yaad rakho
            left = mid + 1;
        } else {
            right = mid - 1;           // mid ka square bahut bada → chhota try karo
        }
    }
    return (int) ans;
}
```

Isi idea ka poora roop — *"minimum speed / capacity / days jo kaam kar de"* — [Binary Search on Answer pattern](../../01-patterns/10-binary-search-on-answer.md) mein hai.

## Java ka built-in

```java
public void builtIn() {
    int[] arr = {2, 5, 8, 12};
    int found = Arrays.binarySearch(arr, 8);       // 2  → mil gaya, uska index
    int missing = Arrays.binarySearch(arr, 6);     // -3 → nahi mila. Formula: -(insertion point) - 1 = -(2) - 1
}
```

## Common galtiyan

- **Infinite loop**: `left = mid` likh diya (bina `+1`) `left < right` template mein — jab `right = left + 1` ho, `mid == left` rehta hai, loop atak jata hai.
- **`<=` vs `<` mix-up**: ek template ka loop doosre ke updates ke saath mat milao.
- **Overflow**: `(left + right) / 2`. Hamesha `left + (right - left) / 2`.
- **Unsorted array pe** binary search chalana — pehle `Arrays.sort` (ya socho ki monotonic property hai kya).
- **Duplicates ko ignore karna** — "pehla / aakhri" chahiye toh lower/upper bound use karo.

> 💡 **Interview mein bolne wali line**: *"Array sorted hai, isliye main har step mein search space aadha kar sakta hoon — O(log n). Boundary dhoondhna hai toh main `left < right` wala template use karunga kyunki `mid` khud answer ho sakta hai."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Binary Search | Easy | Classic template | [leetcode.com/problems/binary-search](https://leetcode.com/problems/binary-search/) |
| 2 | Search Insert Position | Easy | Lower bound | [leetcode.com/problems/search-insert-position](https://leetcode.com/problems/search-insert-position/) |
| 3 | First Bad Version | Easy | "Pehla True" (F F T T) | [leetcode.com/problems/first-bad-version](https://leetcode.com/problems/first-bad-version/) |
| 4 | Valid Perfect Square | Easy | Answer pe binary search | [leetcode.com/problems/valid-perfect-square](https://leetcode.com/problems/valid-perfect-square/) |
| 5 | Find First and Last Position of Element in Sorted Array | Medium | Lower + upper bound | [leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| 6 | Search in Rotated Sorted Array | Medium | Ek aadha hamesha sorted | [leetcode.com/problems/search-in-rotated-sorted-array](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| 7 | Find Minimum in Rotated Sorted Array | Medium | Boundary dhoondhna | [leetcode.com/problems/find-minimum-in-rotated-sorted-array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| 8 | Find Peak Element | Medium | Unsorted mein bhi (slope se) | [leetcode.com/problems/find-peak-element](https://leetcode.com/problems/find-peak-element/) |
| 9 | Search a 2D Matrix | Medium | 2D ko 1D samjho | [leetcode.com/problems/search-a-2d-matrix](https://leetcode.com/problems/search-a-2d-matrix/) |
| 10 | Koko Eating Bananas | Medium | Answer pe binary search | [leetcode.com/problems/koko-eating-bananas](https://leetcode.com/problems/koko-eating-bananas/) |
| 11 | Split Array Largest Sum | Hard | Answer pe binary search + greedy check | [leetcode.com/problems/split-array-largest-sum](https://leetcode.com/problems/split-array-largest-sum/) |
| 12 | Median of Two Sorted Arrays | Hard | Partition pe binary search | [leetcode.com/problems/median-of-two-sorted-arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) |

Agla: [09-recursion.md](09-recursion.md)
