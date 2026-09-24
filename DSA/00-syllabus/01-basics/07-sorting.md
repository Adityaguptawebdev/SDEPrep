# 7. Sorting

> 📍 **Syllabus**: Unit 1 — Basics · Topic 7 / 29 · Pehle chahiye: [Arrays](02-arrays.md), [Complexity Analysis](01-complexity-analysis.md)

> **Standard definition**: The process of rearranging the elements of a collection into a defined order (ascending or descending) using a comparison-based or non-comparison-based algorithm; algorithms are compared by time complexity, extra space, and stability.

**Ek line mein**: Elements ko **order mein lagana** — aur order mein aate hi baaki kaam (dhundhna, jodi banana, intervals milana) **bahut aasan** ho jata hai.

**Trick yaad rakhne ki**: *"PT ki line mein bachhe height ke hisaab se khade karna"* — har sorting algorithm bas ek alag **tarika** hai bachhon ko line mein lagane ka:

| Algorithm | Real-life picture |
|---|---|
| **Bubble** | *Paani ke bulbule* — sabse bada bulbula har baar upar (end mein) pahunch jata hai |
| **Selection** | *Cricket team chunna* — har baar bache hue mein se **sabse achha** khiladi chuno |
| **Insertion** | *Taash ke patte haath mein sort karna* — naya patta uski sahi jagah pe ghusa do |
| **Merge** | *Do sorted line ko ek line mein milana (zip)* — aadha-aadha baanto, phir milao |
| **Quick** | *Monitor (pivot) chuno* — chhote uske baayein, bade uske daayein khade ho jayein |
| **Counting** | *Vote ginti* — kisko kitne vote mile, gino aur likh do |

**Kab use karo**: Jab problem mein **"sorted karke socho"** wali baat ho — duplicates paas-paas laane hain, two pointers lagane hain, intervals merge karne hain, ya binary search karna hai. Aksar **`Arrays.sort()` hi kaafi hai** — par algorithms ka andar ka kaam samajhna interview mein zaroori hai.

## Sab algorithms ek nazar mein

| Algorithm | Best | Average | Worst | Extra Space | Stable? |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| **Merge** | O(n log n) | O(n log n) | **O(n log n)** | O(n) | ✅ |
| **Quick** | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap ([Heap note](../03-trees-and-heaps/15-heap-priority-queue.md)) | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | ✅ |

**Stable** = jinki value **barabar** hai unka **purana order na bigde**.

```
Students: (Aman, 80)  (Ravi, 90)  (Zoya, 80)      ← marks se sort karna hai

Stable sort   :  Ravi 90 │ Aman 80, Zoya 80       ← Aman ab bhi Zoya se pehle ✅
Unstable sort :  Ravi 90 │ Zoya 80, Aman 80       ← barabar wale aage-peeche ho gaye ❌
```

Stability tab zaroori hai jab **do baar sort** karte ho (pehle naam se, phir marks se) — pehla order tabhi bachta hai.

## 1. Bubble Sort — "bulbule upar aate hain"

```
[5, 3, 4, 1]
pass 1:  5>3 swap → [3,5,4,1] → 5>4 swap → [3,4,5,1] → 5>1 swap → [3,4,1,5]   ← 5 (sabse bada) aakhir mein
pass 2:  3<4 ok   → 4>1 swap → [3,1,4,5]                                       ← 4 apni jagah
pass 3:  3>1 swap → [1,3,4,5] ✅
```

```java
public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int pass = 0; pass < n - 1; pass++) {
        boolean swapped = false;
        for (int i = 0; i < n - 1 - pass; i++) {       // 🔑 har pass ke baad aakhri 'pass' elements pehle se sahi jagah pe
            if (arr[i] > arr[i + 1]) {
                int t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t;
                swapped = true;
            }
        }
        if (!swapped) break;                            // ek pass mein koi swap nahi → array pehle se sorted (best case O(n))
    }
}
```

## 2. Selection Sort — "har baar sabse chhota chuno"

```java
public void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;      // 🔑 bache hue hisse ka sabse chhota dhundho
        }
        int t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t;   // use i-th jagah pe rakh do
    }
}
```

Selection sort mein **swaps sirf O(n)** hote hain (jab swap mehnga ho tab kaam ka) — par comparisons hamesha O(n²).

## 3. Insertion Sort — "taash ke patte"

```
[ 3 5 │ 4 1 ]        ← '│' ke baayein sorted hissa (haath ke patte)
naya patta = 4 → 5 ko daayein khiskao → 4 ko beech mein daalo → [ 3 4 5 │ 1 ]
naya patta = 1 → 5, 4, 3 sab daayein khiskao → 1 sabse aage      → [ 1 3 4 5 ]
```

```java
public void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];                  // ye "naya patta" hai
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];           // 🔑 bade patte ko ek jagah daayein khiskao
            j--;
        }
        arr[j + 1] = key;                  // sahi jagah pe patta rakh do
    }
}
```

**Kab achha hai**: Array **almost sorted** ho ya **bahut chhota** ho (≤ 20 elements) — tab ye sabse tez. Java ka `TimSort` bhi chhote hisson pe yahi use karta hai.

## 4. Merge Sort — "aadha karo, sort karo, zip karo" (Divide & Conquer)

```
                 [38, 27, 43, 3]
                 /              \
          [38, 27]              [43, 3]            ← DIVIDE: aadha-aadha karte jao
          /     \               /     \
       [38]    [27]          [43]     [3]          ← 1 element = already sorted
          \     /               \     /
          [27, 38]              [3, 43]            ← CONQUER: do sorted list ko milao
                 \              /
              [3, 27, 38, 43]

Merge kaise: [27, 38] aur [3, 43]  →  dono ke aage wale compare karo, chhota utha lo
   27 vs 3 → 3    │   27 vs 43 → 27    │   38 vs 43 → 38    │   bacha 43   →   [3, 27, 38, 43]
```

```java
public void mergeSort(int[] arr) {
    if (arr.length < 2) return;
    sort(arr, new int[arr.length], 0, arr.length - 1);
}

private void sort(int[] arr, int[] temp, int left, int right) {
    if (left >= right) return;                     // 1 ya 0 element → pehle se sorted (base case)
    int mid = left + (right - left) / 2;
    sort(arr, temp, left, mid);                    // baayein aadhe ko sort karo
    sort(arr, temp, mid + 1, right);               // daayein aadhe ko sort karo
    merge(arr, temp, left, mid, right);            // 🔑 dono sorted aadhon ko milao
}

private void merge(int[] arr, int[] temp, int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];    // <= isliye: barabar ho toh baayein wala pehle (STABLE)
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];         // baayein mein jo bacha
    while (j <= right) temp[k++] = arr[j++];       // daayein mein jo bacha
    for (int x = left; x <= right; x++) arr[x] = temp[x];   // wapas original array mein copy
}
```

**Line by line samjho**: Array ko tab tak aadha karte hain jab tak 1-1 element na bache (wo already sorted hai). Phir wapas aate hue **do sorted list ko zip** karte jaate hain. Height `log n` hai aur har level pe merge mein `n` kaam → **O(n log n)**, **hamesha** (worst case bhi). Kimat: `O(n)` extra `temp` array.

## 5. Quick Sort — "pivot chuno, chhote-bade baant do"

```
arr = [7, 2, 1, 6, 8, 5, 3, 4]      pivot = 4 (last)       i = -1  (i = "chhote zone" ka aakhri index)

j=0: 7 > 4 → skip
j=1: 2 < 4 → i=0, swap(0,1) → [2,7,1,6,8,5,3,4]
j=2: 1 < 4 → i=1, swap(1,2) → [2,1,7,6,8,5,3,4]
j=3,4,5: 6, 8, 5 → sab bade, skip
j=6: 3 < 4 → i=2, swap(2,6) → [2,1,3,6,8,5,7,4]
Aakhir mein: pivot ko i+1 = 3 pe swap → [2,1,3,4,8,5,7,6]
                                         └chhote┘ ↑ └──bade──┘
                                              pivot apni FINAL jagah pe ✅ (ab ye kabhi nahi hilega)
```

```java
private final Random rand = new Random();

public void quickSort(int[] arr) {
    quick(arr, 0, arr.length - 1);
}

private void quick(int[] arr, int low, int high) {
    if (low >= high) return;
    int p = partition(arr, low, high);        // pivot apni final jagah pe pahunch gaya
    quick(arr, low, p - 1);                   // pivot ke baayein wale sort karo
    quick(arr, p + 1, high);                  // pivot ke daayein wale sort karo
}

private int partition(int[] arr, int low, int high) {
    swap(arr, low + rand.nextInt(high - low + 1), high);   // 🔑 random pivot: sorted input pe bhi O(n²) se bachata hai
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);                  // chhote element ko chhote-zone mein le aao
        }
    }
    swap(arr, i + 1, high);                   // pivot ko chhote-zone ke thik baad rakh do
    return i + 1;
}

private void swap(int[] arr, int a, int b) {
    int t = arr[a]; arr[a] = arr[b]; arr[b] = t;
}
```

**Line by line samjho**: Ek pivot chuna, aur **partition** ne saare chhote elements uske baayein aur bade daayein kar diye — ab pivot **apni final jagah** pe hai. Phir baayein aur daayein hisse pe wahi kaam recursion se. Achha pivot milne pe har baar array aadha hota hai → **O(n log n)**. Kharab pivot (hamesha sabse chhota/bada) → **O(n²)** — isliye **random pivot**. Merge sort se fast chalta hai practice mein (cache-friendly, extra array nahi).

### ⚠️ Quick Sort ka jaal — bahut saare BARABAR elements

Upar wala partition `arr[j] < pivot` dekhta hai. Agar **saare (ya bahut saare) elements barabar** hain, toh **koi bhi element pivot se "chhota" nahi** hota — har baar split **(n−1) aur 0** ka hota hai. Random pivot bhi yahan **kaam nahi aata** (saari values same hain, kaunsa bhi pivot chuno).

```
arr = [5, 5, 5, 5, 5, 5]      pivot = 5

partition ke baad:  [5, 5, 5, 5, 5 | 5]     ← chhota zone khaali, saare 5 "bade/barabar" maane gaye
agli call phir (n−1) size pe … phir (n−2) pe …   →   O(n²) time  aur  n level gehri recursion (StackOverflow!)
```

**Ilaaj — 3-way partition (Dutch National Flag)**: *"Teen rang ke jhande"* — array ko **teen zone** mein baanto: **chhote | barabar | bade**. **Barabar wale ek hi baar mein nipat jate hain** aur dobara kabhi nahi chhue jate.

```
[ chhote (<pivot) | barabar (==pivot) | ... abhi dekhna baaki ... | bade (>pivot) ]
  low .. lt-1        lt .. i-1              i .. gt                   gt+1 .. high

arr = [4, 2, 4, 1, 4, 3]     pivot = 4
 i=1: 2 < 4  → chhote zone mein  [2,4,4,1,4,3]   lt=1
 i=2: 4 == 4 → beech mein rehne do
 i=3: 1 < 4  → chhote zone mein  [2,1,4,4,4,3]   lt=2
 i=4: 4 == 4 → rehne do
 i=5: 3 < 4  → chhote zone mein  [2,1,3,4,4,4]   lt=3
 Zone:  [2,1,3] | [4,4,4] | (bade: koi nahi)    →  sirf [2,1,3] pe recursion; teeno 4 apni jagah pakke ✅
```

```java
private final Random rand = new Random();

public void quickSort3Way(int[] arr) {
    quick3(arr, 0, arr.length - 1);
}

private void quick3(int[] arr, int low, int high) {
    if (low >= high) return;
    swap(arr, low, low + rand.nextInt(high - low + 1));   // random pivot ko shuru mein le aao
    int pivot = arr[low];
    int lt = low;                 // arr[low .. lt-1]   < pivot
    int i = low + 1;              // arr[lt .. i-1]    == pivot
    int gt = high;                // arr[gt+1 .. high]  > pivot        (arr[i .. gt] abhi dekhna baaki)
    while (i <= gt) {
        if (arr[i] < pivot) swap(arr, lt++, i++);         // chhota → left zone mein
        else if (arr[i] > pivot) swap(arr, i, gt--);      // bada → right zone mein (i wahin — swap hokar aaya element abhi dekha nahi)
        else i++;                                          // barabar → beech mein rehne do
    }
    quick3(arr, low, lt - 1);     // sirf STRICTLY chhote wale
    quick3(arr, gt + 1, high);    // sirf STRICTLY bade wale — barabar wale ab kabhi nahi chhue jayenge
}

private void swap(int[] arr, int a, int b) {
    int t = arr[a]; arr[a] = arr[b]; arr[b] = t;
}
```

Ab **saare elements barabar** hon toh bhi **ek hi pass mein O(n)** — aur bahut saare duplicates wale data pe ye asli-zindagi mein bhi tez hai. Yehi idea **Sort Colors** (sirf 0, 1, 2) ka jawab hai. Java ka `Arrays.sort(int[])` (dual-pivot quicksort) bhi duplicates ko aise hi sambhalta hai.

## 6. Counting Sort — "vote ginti" (bina compare kiye)

Jab values ki **range chhoti** ho (jaise marks 0–100, ages 0–120), to compare karne ki zarurat hi nahi:

```java
public int[] countingSort(int[] arr, int maxValue) {     // sirf non-negative numbers
    int[] count = new int[maxValue + 1];
    for (int x : arr) count[x]++;                        // 🔑 har value kitni baar aayi
    int idx = 0;
    for (int v = 0; v <= maxValue; v++) {
        while (count[v]-- > 0) arr[idx++] = v;           // value v ko count[v] baar likh do
    }
    return arr;
}
```

**O(n + k)** time, jahan `k` = values ki range. Comparison-based sorting ki lower limit O(n log n) ko ye **tod deta hai** — par sirf tab jab `k` chhota ho.

## Java mein sorting — jo roz kaam aati hai

```java
public void javaSorting() {
    int[] nums = {5, 2, 9, 1};
    Arrays.sort(nums);                                        // ascending (primitives: dual-pivot quicksort)

    Integer[] boxed = {5, 2, 9, 1};
    Arrays.sort(boxed, Collections.reverseOrder());           // descending — primitive int[] pe comparator nahi chalta, Integer[] lo

    int[][] intervals = {{5, 8}, {1, 3}, {2, 4}};
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // 🔑 start ke hisaab se sort
    // ❌ (a, b) -> a[0] - b[0] mat likho: bade/negative numbers pe subtract overflow kar jata hai

    String[] words = {"pear", "fig", "apple"};
    Arrays.sort(words, Comparator.comparing(String::length)   // pehle length se
                                 .thenComparing(Comparator.naturalOrder()));   // barabar length pe alphabet se

    List<Integer> list = new ArrayList<>(Arrays.asList(3, 1, 2));
    Collections.sort(list);                                   // objects ke liye TimSort — stable
    list.sort(Collections.reverseOrder());                    // descending
}
```

| Java ka sort | Algorithm | Stable? |
|---|---|---|
| `Arrays.sort(int[])` (primitives) | Dual-Pivot Quicksort | — (farq nahi padta, primitives hain) |
| `Arrays.sort(T[])`, `Collections.sort`, `list.sort` | **TimSort** (Merge + Insertion mix) | ✅ |

## Sort karke problem kab aasan hoti hai

| Hint | Sort ke baad kya karo |
|---|---|
| Duplicates dhoondhna | Duplicate ab **paas-paas** hain — adjacent compare |
| Pair/triplet with sum | [Two Pointers](../../01-patterns/02-two-pointers.md) |
| Overlapping intervals | Start se sort → [Merge Intervals](../../01-patterns/04-merge-intervals.md) |
| Element dhoondhna | [Binary Search](08-binary-search.md) |
| "Sabse achha choose karo" | Sort karke [Greedy](../04-paradigms/18-greedy.md) |
| K-th largest / smallest (sirf ek) | Poora sort mat karo — [Heap](../03-trees-and-heaps/15-heap-priority-queue.md) ya Quickselect |

## Kab kaunsa sort

- **Chhota ya almost-sorted data** → Insertion
- **O(n log n) ki guarantee + stable** → Merge (linked list ke liye bhi best)
- **Array pe practice mein sabse tez** → Quick (random pivot ke saath)
- **Values ki range chhoti** → Counting
- **Interview mein koi bole "sort karo"** → seedha `Arrays.sort()`, aur complexity O(n log n) bolo

## Common galtiyan

- **Comparator mein `a - b`** — `Integer.MIN_VALUE` jaise numbers pe overflow. `Integer.compare(a, b)` use karo.
- **`int[]` pe `Collections.reverseOrder()`** nahi chalta — `Integer[]` chahiye.
- **Quick sort mein fixed pivot** — sorted input pe O(n²) aur stack overflow.
- **Bahut saare barabar elements pe simple (Lomuto) quick sort** — O(n²) aur gehri recursion. 3-way partition lo.
- **`Arrays.sort` original array badal deta hai** — original chahiye toh pehle `clone()`.
- **Merge mein `<` likhna `<=` ki jagah** — sort stable nahi rahega.

> 💡 **Interview mein bolne wali line**: *"Main pehle array ko sort kar leta hoon — O(n log n) — kyunki uske baad two-pointer se O(n) mein jodi mil jayegi. Total O(n log n), brute force ke O(n²) se behtar."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Height Checker | Easy | Sort karke compare | [leetcode.com/problems/height-checker](https://leetcode.com/problems/height-checker/) |
| 2 | Squares of a Sorted Array | Easy | Two pointers (sort ka shortcut) | [leetcode.com/problems/squares-of-a-sorted-array](https://leetcode.com/problems/squares-of-a-sorted-array/) |
| 3 | Relative Sort Array | Easy | Counting sort / custom order | [leetcode.com/problems/relative-sort-array](https://leetcode.com/problems/relative-sort-array/) |
| 4 | Sort Colors | Medium | 3-way partition (Dutch flag) | [leetcode.com/problems/sort-colors](https://leetcode.com/problems/sort-colors/) |
| 5 | Sort an Array | Medium | Merge / Quick khud likho | [leetcode.com/problems/sort-an-array](https://leetcode.com/problems/sort-an-array/) |
| 6 | Merge Intervals | Medium | Sort + merge | [leetcode.com/problems/merge-intervals](https://leetcode.com/problems/merge-intervals/) |
| 7 | Largest Number | Medium | Custom comparator | [leetcode.com/problems/largest-number](https://leetcode.com/problems/largest-number/) |
| 8 | Sort Characters By Frequency | Medium | Count + sort | [leetcode.com/problems/sort-characters-by-frequency](https://leetcode.com/problems/sort-characters-by-frequency/) |
| 9 | Kth Largest Element in an Array | Medium | Quickselect / heap | [leetcode.com/problems/kth-largest-element-in-an-array](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| 10 | Sort List | Medium | Merge sort on linked list | [leetcode.com/problems/sort-list](https://leetcode.com/problems/sort-list/) |
| 11 | Count of Smaller Numbers After Self | Hard | Merge sort ke andar counting | [leetcode.com/problems/count-of-smaller-numbers-after-self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) |
| 12 | Reverse Pairs | Hard | Merge sort ke andar counting | [leetcode.com/problems/reverse-pairs](https://leetcode.com/problems/reverse-pairs/) |

Agla: [08-binary-search.md](08-binary-search.md)
