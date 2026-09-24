# 2. Arrays

> 📍 **Syllabus**: Unit 1 — Basics · Topic 2 / 29 · Pehle chahiye: [Complexity Analysis](01-complexity-analysis.md)

> **Standard definition**: A linear data structure that stores a fixed number of elements of the same type in **contiguous memory locations**, where each element is accessed directly by its index in constant time.

**Ek line mein**: Ek line mein **barabar-barabar size ke dabbe**, ek ke baad ek, aur har dabbe ka ek **number (index)** — number pata hai toh seedha dabba khol lo.

**Trick yaad rakhne ki**: *"Cinema hall ki ek row ki seats"* — seat numbers 0, 1, 2, 3... ek line mein fixed hain. Seat number pata ho toh **seedha wahin pahunch jao** (koi dhundhna nahi) → **access O(1)**. Par beech mein ek nayi seat daalni ho toh **baaki sabko ek-ek seat khiskana** padega → **insert/delete O(n)**. Aur row ki seats **badh nahi sakti** (fixed size).

**Kab use karo**: Jab data **ek ke baad ek** rakha ho, **index se seedha access** chahiye, aur size pehle se pata ho. Almost har problem ka **starting point** array hi hota hai.

## Array memory mein kaisa dikhta hai

```
index:      0      1      2      3      4
         ┌──────┬──────┬──────┬──────┬──────┐
arr =    │  10  │  20  │  30  │  40  │  50  │      ← saare dabbe ek-doosre ke bagal mein
         └──────┴──────┴──────┴──────┴──────┘
address:   100    104    108    112    116          (int = 4 bytes ka hota hai)

arr[i] ka address = 100 + i × 4     →  seedha formula, koi search nahi  →  O(1)
```

Yahi **contiguous memory** array ki taakat bhi hai (O(1) access, cache-friendly) aur kamzori bhi (beech mein jagah banane ke liye khiskana padta hai, size fix hai).

## Operations aur unki complexity

| Operation | Time | Kyun |
|---|---|---|
| Access `arr[i]` | **O(1)** | Address formula se seedha jump |
| Update `arr[i] = x` | **O(1)** | Wahi jump, bas value badal do |
| Search (unsorted) | O(n) | Ek-ek karke dekhna padega |
| Search (sorted) | O(log n) | [Binary Search](08-binary-search.md) |
| Insert at end | O(1)* | *Jagah bachi ho toh (dynamic array mein amortized) |
| Insert at start / middle | **O(n)** | Baaki elements ko **daayein khiskana** |
| Delete at start / middle | **O(n)** | Khaali jagah **baayein se bharna** |

## Java mein Array vs ArrayList

| | `int[]` (Array) | `ArrayList<Integer>` (Dynamic array) |
|---|---|---|
| Size | **Fixed** (banate waqt tay) | **Badhta-ghatta** rehta hai |
| Type | Primitives (`int`) bhi | Sirf objects (`Integer`) |
| Length | `arr.length` (bina `()`) | `list.size()` |
| Access | `arr[i]` | `list.get(i)` |
| Jab use karo | Size pata ho, speed chahiye | Size pata nahi (insert/delete zyada) |

## Code example 1 — Basics aur `Arrays` ke useful tools

```java
public void basics() {
    int[] a = new int[5];              // size 5, sab elements default 0
    int[] b = {10, 20, 30, 40, 50};    // seedha values ke saath

    System.out.println(b[2]);          // 30 → index se access, O(1)
    b[2] = 99;                         // update, O(1)
    System.out.println(b.length);      // 5 (length property hai, method nahi)

    for (int i = 0; i < b.length; i++) System.out.println(b[i]);   // index chahiye toh ye
    for (int x : b) System.out.println(x);                         // sirf value chahiye toh for-each
}

public void arraysUtil() {
    int[] a = {5, 3, 1, 4};
    Arrays.sort(a);                              // [1, 3, 4, 5]   O(n log n)
    System.out.println(Arrays.toString(a));      // print ke liye — seedha print(a) karoge toh address aayega
    int[] bigger = Arrays.copyOf(a, 6);          // [1, 3, 4, 5, 0, 0]  (naya size 6, extra jagah 0)
    int[] part = Arrays.copyOfRange(a, 1, 3);    // [3, 4]  (from inclusive, to EXCLUSIVE)
    Arrays.fill(bigger, -1);                     // sab -1

    int[] alias = a;                             // ❌ copy nahi, sirf doosra naam (dono same array)
    int[] real = a.clone();                      // ✅ asli copy
    System.out.println(Arrays.equals(a, real));  // true → values compare karta hai (a == real false hota)
}
```

## Code example 2 — Insert aur Delete (khiskane ka khel)

```
insert 25 at index 2:

before:  [10][20][30][40][50][  ]
                  │   │   │
                  ▼   ▼   ▼      ← peeche se shuru karke sab ko ek kadam DAAYEIN
after:   [10][20][25][30][40][50]
```

```java
// arr mein size tak valid elements hain, aur arr.length > size (jagah bachi hai)
// index pe insert — O(n), kyunki baaki elements ko daayein khiskana padta hai
public int insertAt(int[] arr, int size, int index, int value) {
    for (int i = size; i > index; i--) {
        arr[i] = arr[i - 1];     // 🔑 PEECHE se shuru karo, warna aage wali values overwrite ho jayengi
    }
    arr[index] = value;
    return size + 1;             // naya size
}

// index se delete — O(n), kyunki khaali jagah baayein se bharni padti hai
public int deleteAt(int[] arr, int size, int index) {
    for (int i = index; i < size - 1; i++) {
        arr[i] = arr[i + 1];     // 🔑 AAGE se shuru karo, sab ko ek kadam baayein
    }
    return size - 1;
}
```

**Line by line samjho**: Insert mein direction **peeche se aage** hai kyunki hum `arr[i]` mein `arr[i-1]` copy kar rahe hain — agar aage se shuru karte toh ek hi value poore array mein copy ho jati. Delete mein ulta hai: **aage se peeche**, kyunki `arr[i+1]` ko `arr[i]` pe laa rahe hain. **Yaad rakhne ka trick**: insert = jagah banana (peeche wale pehle hilte hain), delete = jagah bharna (aage wale pehle hilte hain).

## Code example 3 — Reverse aur Rotate (3 reversal ka jaadu)

```
Rotate [1 2 3 4 5 6 7] ko k = 3 se daayein:

original             :  1 2 3 4 5 6 7
step 1: poora reverse:  7 6 5 4 3 2 1
step 2: pehle k ulte :  5 6 7 │ 4 3 2 1
step 3: baaki ulte   :  5 6 7 │ 1 2 3 4     ✅ answer
```

```java
// Array ko in-place ulta karo — O(n) time, O(1) space
public void reverse(int[] arr, int left, int right) {
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}

// Rotate Array (k steps right) — extra array ki zarurat nahi
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;                        // 🔑 k > n ho sakta hai, n rotation ke baad array wapas wahi hota hai
    reverse(nums, 0, n - 1);          // step 1: poora ulta
    reverse(nums, 0, k - 1);          // step 2: pehle k elements ulte
    reverse(nums, k, n - 1);          // step 3: baaki elements ulte
}
```

## Code example 4 — Kadane's Algorithm (Maximum Subarray)

**Trick**: *"Bojh mat dhoo"* — agar ab tak ka sum **negative** ho gaya, toh wo aage ke liye sirf bojh hai, use phenk do aur **naye sire se** shuru karo.

```java
public int maxSubArray(int[] nums) {
    int current = nums[0];    // yahin pe KHATAM hone wale best subarray ka sum
    int best = nums[0];       // ab tak ka sabse bada sum

    for (int i = 1; i < nums.length; i++) {
        // 🔑 sirf 2 options: pichhla subarray aage badhao, ya yahin se naya shuru karo
        current = Math.max(nums[i], current + nums[i]);
        best = Math.max(best, current);
    }
    return best;
}
```

```
nums    :  -2   1   -3   4   -1   2   1   -5   4
current :  -2   1   -2   4    3   5   6    1   5
best    :  -2   1    1   4    4   5   6    6   6     → answer 6  (subarray [4, -1, 2, 1])
```

**Line by line samjho**: `current` = "jo subarray **index i pe khatam** ho raha hai, uska best sum". Ya toh `nums[i]` akela (pichhla sum negative tha, chhod diya), ya `current + nums[i]` (pichhle ko aage badhaya). `best` poori journey ka maximum yaad rakhta hai. **Ek hi pass → O(n)**, extra space O(1).

📌 Kadane ki saari variations (min, circular, product, one deletion, 2D) ek jagah: [Kadane's Algorithm (pattern)](../../01-patterns/21-kadanes-algorithm.md).

## Code example 5 — 2D Array (Matrix)

```
         col 0  col 1  col 2
row 0  [   1      2      3  ]         grid[r][c]  →  r = row (upar se neeche)
row 1  [   4      5      6  ]                        c = column (baayein se daayein)
row 2  [   7      8      9  ]         grid[1][2] = 6
```

```java
// 🔑 4 directions ka trick — grid/graph problems mein BAAR-BAAR aayega
public int countNeighbours(int[][] grid, int r, int c) {
    int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};   // up, down, left, right
    int count = 0;
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
            count++;                                      // boundary ke andar hai toh valid neighbour
        }
    }
    return count;
}

// Rotate Image (90° clockwise) = Transpose + har row ko ulta karo
public void rotateImage(int[][] m) {
    int n = m.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {        // 🔑 j = i+1 se: warna har pair 2 baar swap hoke wapas wahi aa jayega
            int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
        }
    }
    for (int[] row : m) {
        for (int l = 0, r = n - 1; l < r; l++, r--) {
            int t = row[l]; row[l] = row[r]; row[r] = t;
        }
    }
}
```

```
1 2 3         1 4 7         7 4 1
4 5 6  ─T──▶  2 5 8  ─R──▶  8 5 2       (T = transpose, R = har row reverse)
7 8 9         3 6 9         9 6 3
```

## Array ke problems mein kaunsi technique lagegi

| Problem ka hint | Technique | Kahan padhna |
|---|---|---|
| **Contiguous subarray** ka sum/max/min | Sliding Window / Kadane | [Sliding Window](../../01-patterns/01-sliding-window.md) |
| **Sorted array**, pair/triplet dhoondhna | Two Pointers | [Two Pointers](../../01-patterns/02-two-pointers.md) |
| **Range sum** baar-baar poochha jaye | Prefix Sum | [Prefix Sum](../../01-patterns/07-prefix-sum.md) |
| Numbers `1..n` mein **missing / duplicate** | Cyclic Sort | [Cyclic Sort](../../01-patterns/05-cyclic-sort.md) |
| Sorted array mein element dhoondna | Binary Search | [Binary Search](08-binary-search.md) |
| "**k-th** largest / smallest" | Heap | [Heap](../03-trees-and-heaps/15-heap-priority-queue.md) |

## Common galtiyan

- **Off-by-one**: valid index `0` se `length - 1` tak hai. `arr[arr.length]` = `ArrayIndexOutOfBoundsException`.
- **`int[] b = a;` copy nahi hai** — dono ek hi array ko point karte hain. Asli copy ke liye `a.clone()`.
- **Sum overflow**: `int` ~2.1 × 10⁹ pe overflow ho jata hai. Bade sums ke liye `long` lo.
- **`Arrays.asList(intArray)`** primitives ke array pe kaam nahi karta (sirf `Integer[]` pe).
- **Loop chalte waqt insert/delete** mat karo — index gadbad ho jate hain.

> 💡 **Interview mein bolne wali line**: *"Array mein access O(1) hai par insert/delete O(n), kyunki elements shift hote hain. Is problem mein main extra array nahi banaunga — in-place karunga, O(1) space mein."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Remove Duplicates from Sorted Array | Easy | In-place, do index (read / write) | [leetcode.com/problems/remove-duplicates-from-sorted-array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) |
| 2 | Move Zeroes | Easy | In-place shifting | [leetcode.com/problems/move-zeroes](https://leetcode.com/problems/move-zeroes/) |
| 3 | Best Time to Buy and Sell Stock | Easy | Ek pass, min-so-far | [leetcode.com/problems/best-time-to-buy-and-sell-stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| 4 | Majority Element | Easy | Boyer-Moore voting | [leetcode.com/problems/majority-element](https://leetcode.com/problems/majority-element/) |
| 5 | Maximum Subarray | Medium | Kadane's algorithm | [leetcode.com/problems/maximum-subarray](https://leetcode.com/problems/maximum-subarray/) |
| 6 | Rotate Array | Medium | 3-reversal trick | [leetcode.com/problems/rotate-array](https://leetcode.com/problems/rotate-array/) |
| 7 | Product of Array Except Self | Medium | Prefix × suffix | [leetcode.com/problems/product-of-array-except-self](https://leetcode.com/problems/product-of-array-except-self/) |
| 8 | Set Matrix Zeroes | Medium | 2D in-place marking | [leetcode.com/problems/set-matrix-zeroes](https://leetcode.com/problems/set-matrix-zeroes/) |
| 9 | Spiral Matrix | Medium | Boundary shrink | [leetcode.com/problems/spiral-matrix](https://leetcode.com/problems/spiral-matrix/) |
| 10 | Rotate Image | Medium | Transpose + reverse | [leetcode.com/problems/rotate-image](https://leetcode.com/problems/rotate-image/) |
| 11 | Trapping Rain Water | Hard | Two pointers / prefix max | [leetcode.com/problems/trapping-rain-water](https://leetcode.com/problems/trapping-rain-water/) |
| 12 | First Missing Positive | Hard | Index as hash (in-place) | [leetcode.com/problems/first-missing-positive](https://leetcode.com/problems/first-missing-positive/) |

Agla: [03-strings.md](03-strings.md)
