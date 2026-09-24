# 28. Segment Tree & Fenwick Tree (Range Queries with Updates)

> 📍 **Syllabus**: Unit 7 — Advanced · Topic 28 / 29 · Pehle chahiye: [Binary Tree](../03-trees-and-heaps/13-binary-tree.md), [Recursion](../01-basics/09-recursion.md), [Bit Manipulation](../01-basics/06-bit-manipulation.md), [Prefix Sum pattern](../../01-patterns/07-prefix-sum.md)

> **Standard definition**: A segment tree is a binary tree built over an array in which every node stores an aggregate (such as sum, minimum or maximum) of a contiguous range, supporting range queries and point (or lazily, range) updates in O(log n). A Fenwick tree (Binary Indexed Tree) is a compact array-based structure that maintains prefix sums with point updates and prefix queries in O(log n).

**Ek line mein**: Array pe **"l se r tak ka sum/min/max"** bhi baar-baar poochna hai **aur beech-beech mein values badalni** bhi hain — dono **O(log n)** mein.

**Trick yaad rakhne ki**: *"Company ka org chart"* — har **manager ke paas apni poori team ka total salary pehle se likha** hota hai.
- Kisi **employee ka salary badla** → sirf uske **upar ke managers** (CEO tak — bas ~**log n** managers) ka total theek karo.
- **"Employee 3 se 8 tak ka total?"** → poori team gino mat — **jo poori teams (managers) is range mein aati hain unka total jod do**, baaki kuch akele log.

**Kab use karo**: **Range query + point/range update** dono chahiye (sum, min, max, gcd). Sirf query ho toh [Prefix Sum](../../01-patterns/07-prefix-sum.md) kaafi hai.

## Kyun zaroorat? — teen tarike ki cost

| Tarika | Query `sum(l, r)` | Update `arr[i] = v` |
|---|---|---|
| Seedha array | O(n) | O(1) |
| Prefix Sum array | **O(1)** | O(n) (poora prefix dobara) |
| **Segment Tree / Fenwick** | **O(log n)** | **O(log n)** |

Jab **dono baar-baar** ho (`10⁵` queries + updates), toh O(n) wale dono tarike TLE denge — yahan `O(log n)` chahiye.

## Segment Tree — dekho kaisa dikhta hai

Array `[1, 3, 5, 7, 9, 11]` ke liye (har node = ek range ka **sum**):

```
                   [0..5] = 36
                 ╱                ╲
         [0..2] = 9              [3..5] = 27
         ╱        ╲              ╱         ╲
    [0..1] = 4   [2] = 5    [3..4] = 16    [5] = 11
     ╱     ╲                  ╱      ╲
  [0] = 1  [1] = 3         [3] = 7  [4] = 9        ← leaves = asli array

Har parent = dono bachcho ka sum.       Height ≈ log n
```

**Query `sum(1, 4)`** (= 3 + 5 + 7 + 9 = 24):

```
[0..5]  partial   → dono bachcho se pucho
 ├─ [0..2] partial → dono bachcho se pucho
 │    ├─ [0..1] partial → [0] bahar (0)   [1] andar ✅ 3
 │    └─ [2]    poori andar ✅ 5
 └─ [3..5] partial
      ├─ [3..4] poori andar ✅ 16          ← ek hi node ne 2 elements ka sum de diya!
      └─ [5]    bahar (0)

total = 3 + 5 + 16 = 24 ✅         (sirf kuch hi nodes chhue — O(log n))
```

**Har node ke 3 halaat** query mein: **(1)** range **bilkul bahar** → `0` (sum ka "kuch nahi"), **(2)** range **poori andar** → seedha stored value, **(3)** **partial** → dono bachcho se pucho. Har level pe **zyada se zyada 2 nodes partial** hote hain, isliye **O(log n)**.

## Code example 1 — Segment Tree (Sum)

```java
class SegmentTree {
    private final int n;
    private final int[] tree;                       // tree[node] = us node ki range ka sum (node 1 = root)

    SegmentTree(int[] nums) {
        n = nums.length;
        tree = new int[4 * n];                      // 4n kaafi hota hai
        if (n > 0) build(nums, 1, 0, n - 1);
    }

    private void build(int[] nums, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = nums[lo]; return; }             // leaf
        int mid = (lo + hi) / 2;
        build(nums, 2 * node, lo, mid);                               // baayein bachcha = 2·node
        build(nums, 2 * node + 1, mid + 1, hi);                       // daayein bachcha = 2·node + 1
        tree[node] = tree[2 * node] + tree[2 * node + 1];             // parent = dono ka sum
    }

    // arr[index] = value
    void update(int index, int value) {
        update(1, 0, n - 1, index, value);
    }

    private void update(int node, int lo, int hi, int index, int value) {
        if (lo == hi) { tree[node] = value; return; }
        int mid = (lo + hi) / 2;
        if (index <= mid) update(2 * node, lo, mid, index, value);
        else update(2 * node + 1, mid + 1, hi, index, value);
        tree[node] = tree[2 * node] + tree[2 * node + 1];             // 🔑 wapas aate hue upar ke sab parents theek
    }

    // arr[left..right] ka sum (dono shamil)
    int query(int left, int right) {
        return query(1, 0, n - 1, left, right);
    }

    private int query(int node, int lo, int hi, int left, int right) {
        if (right < lo || hi < left) return 0;                        // bilkul bahar → sum mein kuch nahi
        if (left <= lo && hi <= right) return tree[node];             // 🔑 poori range andar → seedha ready jawab
        int mid = (lo + hi) / 2;
        return query(2 * node, lo, mid, left, right)
             + query(2 * node + 1, mid + 1, hi, left, right);         // partial → dono bachcho se pucho
    }
}
```

**Sum ki jagah Min/Max/GCD?** Bas **do jagah** badlo: `+` ki jagah `Math.min` / `Math.max` / `gcd`, aur "bilkul bahar" wale case mein **identity value** (`min` ke liye `Integer.MAX_VALUE`, `max` ke liye `MIN_VALUE`). Baaki sab wahi.

## Fenwick Tree (BIT) — chhota aur tez

**Idea**: Poora tree nahi — ek **array `bit[]`** jisme har index **`i`** ek **khaas lambai ki range** ka sum sambhalta hai: **`lowbit(i)`** = `i & -i` (i ka sabse dahina `1` bit).

```
n = 8:
 index i :   1     2     3     4     5     6     7     8
 lowbit  :   1     2     1     4     1     2     1     8        ( i & -i )
 bit[i] ka   [1]  [1..2] [3]  [1..4] [5]  [5..6] [7]  [1..8]
 range

prefixSum(7):   7  →  6  →  4  →  0      (i −= lowbit)      bit[7] + bit[6] + bit[4]  =  [7] + [5..6] + [1..4]  ✅ (3 jumps)
add(5, +1)  :   5  →  6  →  8            (i += lowbit)      wahi bit[] update jo 5 ko cover karte hain
```

**Do loops yaad rakhne layak**: **query mein `i -= i & -i`**, **update mein `i += i & -i`**. Dono **O(log n)**.

```java
class FenwickTree {
    private final int[] bit;                        // 1-indexed (bit[0] ka use nahi)

    FenwickTree(int[] nums) {                       // O(n) mein build
        bit = new int[nums.length + 1];
        for (int i = 1; i <= nums.length; i++) {
            bit[i] += nums[i - 1];
            int parent = i + (i & -i);              // i ka "zimmedaar" agla index
            if (parent < bit.length) bit[parent] += bit[i];
        }
    }

    // index i (1-indexed) pe delta jodo
    void add(int i, int delta) {
        for (; i < bit.length; i += i & -i) {       // 🔑 i & -i = lowbit: agla index jo mujhe cover karta hai
            bit[i] += delta;
        }
    }

    // arr[1..i] ka sum
    int prefixSum(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) {                // lowbit hatate jao
            sum += bit[i];
        }
        return sum;
    }

    int rangeSum(int l, int r) {                    // arr[l..r] (1-indexed)
        return prefixSum(r) - prefixSum(l - 1);
    }
}
```

**Line by line samjho**: `i & -i` `i` ka sabse **chhota ON bit** deta hai (`6 = 110₂` → `2`). `add` mein `i` ko bar-bar itna badhate hain jab tak array ke bahar na nikle — wahi saare `bit[]` jo `i` ko cover karte hain. `prefixSum` mein utna hi ghatate jate hain — wo saare tukde jinka jod `[1..i]` banata hai. **Zaroori**: **index 1 se** (0 se nahi) — `0 & -0 = 0` se **infinite loop**.

**Fenwick ka "value set" karna**: `bit` sirf **delta** samajhta hai — toh `arr[i] = v` ke liye `add(i, v - arr[i])` (purani value alag array mein rakho).

## Code example 2 — Fenwick ka asli use: Count of Smaller Numbers After Self ⭐

**Problem**: Har `nums[i]` ke liye **uske daayein taraf kitne elements usse chhote** hain?

**Trick**: *"Daayein se baayein chalo. Ek Fenwick tree rakho jisme 'abhi tak dekhe hue values ki ginti' ho. Har number pe poochho: mujhse chhote kitne dekh chuke? Phir mujhe bhi gin lo."* Values badi ho sakti hain, isliye unhe **rank (1..n)** mein badlo (**coordinate compression**).

```
nums = [5, 2, 6, 1]     rank (sorted position): 5→3, 2→2, 6→4, 1→1

i=3 (1): mujhse chhote dekhe hue = prefix(rank−1 = 0) = 0     → result 0   phir rank 1 add
i=2 (6): prefix(3) = 1 (sirf '1')                              → result 1   phir rank 4 add
i=1 (2): prefix(1) = 1 (sirf '1')                              → result 1   phir rank 2 add
i=0 (5): prefix(2) = 2 ('1' aur '2')                           → result 2

answer = [2, 1, 1, 0]
```

```java
public List<Integer> countSmaller(int[] nums) {
    int n = nums.length;
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int[] rank = new int[n];
    for (int i = 0; i < n; i++) rank[i] = lowerBound(sorted, nums[i]) + 1;   // duplicates ka same rank, 1-indexed

    int[] bit = new int[n + 1];
    Integer[] result = new Integer[n];
    for (int i = n - 1; i >= 0; i--) {                 // 🔑 daayein se baayein
        result[i] = prefix(bit, rank[i] - 1);           // mujhse chhote (kam rank) kitne pehle dekh chuke
        add(bit, rank[i]);                              // ab mujhe bhi gin lo
    }
    return Arrays.asList(result);
}

private int lowerBound(int[] sorted, int x) {           // pehla index jahan sorted[idx] >= x
    int lo = 0, hi = sorted.length;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (sorted[mid] < x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

private void add(int[] bit, int i) {
    for (; i < bit.length; i += i & -i) bit[i]++;
}

private int prefix(int[] bit, int i) {
    int sum = 0;
    for (; i > 0; i -= i & -i) sum += bit[i];
    return sum;
}
```

Time **O(n log n)** (brute force O(n²) tha).

## Segment Tree ka "Lazy" roop — Range Update

**Problem**: Ab **poori range mein ek saath `+delta`** (`rangeAdd(l, r, delta)`) bhi karna hai, aur `rangeSum` bhi. Har element ko alag update karna O(n) hoga.

**Trick (Lazy Propagation)**: *"Manager ko bola: 'poori team ko ₹100 bonus.' Wo har karmchari ko **turant** nahi batata — bas apne register mein likh leta hai ('pending: +100'). **Jab koi neeche ka sawaal aaye** tabhi wo bachcho ko batata hai."* Har node ke saath ek `lazy` (pending) value.

```
rangeAdd(0, 5, +10) — root ki range poori andar hai:
   root ka sum += 10 × length(6)     ✅ (seedha)
   root.lazy   += 10                 (bachche abhi update NAHI hue — "pending")

Baad mein query aayi jo root ke neeche jaati hai → pehle PUSH: pending +10 dono bachcho ko de do, phir aage badho.
```

```java
class LazySegmentTree {
    private final int n;
    private final long[] sum, lazy;               // lazy[node] = is range ke har element mein jodna BAAKI (bachchon ke liye)

    LazySegmentTree(int[] nums) {
        n = nums.length;
        sum = new long[4 * n];
        lazy = new long[4 * n];
        if (n > 0) build(nums, 1, 0, n - 1);
    }

    private void build(int[] nums, int node, int lo, int hi) {
        if (lo == hi) { sum[node] = nums[lo]; return; }
        int mid = (lo + hi) / 2;
        build(nums, 2 * node, lo, mid);
        build(nums, 2 * node + 1, mid + 1, hi);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    private void apply(int node, int lo, int hi, long delta) {
        sum[node] += delta * (hi - lo + 1);            // poori range mein har element +delta → sum badhta hai delta × lambai
        lazy[node] += delta;                            // bachchon ko baad mein batayenge
    }

    private void push(int node, int lo, int hi) {       // pending kaam bachchon ko de do
        if (lazy[node] != 0) {
            int mid = (lo + hi) / 2;
            apply(2 * node, lo, mid, lazy[node]);
            apply(2 * node + 1, mid + 1, hi, lazy[node]);
            lazy[node] = 0;
        }
    }

    void rangeAdd(int left, int right, long delta) {
        rangeAdd(1, 0, n - 1, left, right, delta);
    }

    private void rangeAdd(int node, int lo, int hi, int left, int right, long delta) {
        if (right < lo || hi < left) return;
        if (left <= lo && hi <= right) { apply(node, lo, hi, delta); return; }   // 🔑 poori range andar → yahin ruk jao (lazy)
        push(node, lo, hi);                              // neeche jaane se pehle purana pending pahuncha do
        int mid = (lo + hi) / 2;
        rangeAdd(2 * node, lo, mid, left, right, delta);
        rangeAdd(2 * node + 1, mid + 1, hi, left, right, delta);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    long rangeSum(int left, int right) {
        return rangeSum(1, 0, n - 1, left, right);
    }

    private long rangeSum(int node, int lo, int hi, int left, int right) {
        if (right < lo || hi < left) return 0;
        if (left <= lo && hi <= right) return sum[node];
        push(node, lo, hi);                              // 🔑 neeche jaane se pehle pending push
        int mid = (lo + hi) / 2;
        return rangeSum(2 * node, lo, mid, left, right) + rangeSum(2 * node + 1, mid + 1, hi, left, right);
    }
}
```

## Segment Tree vs Fenwick Tree

| | Segment Tree | Fenwick Tree (BIT) |
|---|---|---|
| Code | Lamba | **Bahut chhota** |
| Memory | `4n` | `n` |
| Kya kar sakta hai | **Koi bhi** associative kaam (sum, **min, max**, gcd) | Sirf **prefix-sum jaise** (sum, xor, count) |
| Range update | ✅ (Lazy se) | Mushkil (tricks se) |
| Kab lo | Min/max query, range update | Sirf sum/count, chhota code chahiye |

## Kab lagana hai — pehchano

| Hint | Kya lo |
|---|---|
| Range sum + **point update** | Fenwick / Segment Tree |
| Range **min/max** + update | Segment Tree |
| **Range update** + range query | Lazy Segment Tree |
| "**Kitne chhote/bade** (order ke hisaab se) dekhe hue" | Fenwick + coordinate compression |
| Sirf query, koi update nahi | Prefix Sum (simple!) |

## Common galtiyan

- **Fenwick mein 0-indexed index** — `i & -i` `0` pe `0` deta hai → infinite loop. **1-indexed** rakho.
- **Segment tree array chhota banana** (`2n`) — recursive version ke liye `4n`.
- **`update` mein wapas aate hue parents theek karna bhoolna.**
- **Lazy mein `push` bhoolna** neeche jaane se pehle — purane pending updates kho jate hain / galat sums aate hain.
- **Sum `int` mein overflow** — bade values/range updates pe `long`.
- **"Bahar" case ka identity value galat** (min-tree mein `0` return karna) — `Integer.MAX_VALUE`.

> 💡 **Interview mein bolne wali line**: *"Prefix sum se query O(1) hai par update O(n). Yahan queries aur updates dono bahut hain, isliye Fenwick tree — dono O(log n), aur code bhi chhota. Agar range min chahiye hota toh Segment Tree."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Range Sum Query - Immutable | Easy | Prefix Sum (jab update nahi) | [leetcode.com/problems/range-sum-query-immutable](https://leetcode.com/problems/range-sum-query-immutable/) |
| 2 | Range Sum Query - Mutable | Medium | Fenwick / Segment Tree | [leetcode.com/problems/range-sum-query-mutable](https://leetcode.com/problems/range-sum-query-mutable/) |
| 3 | Range Sum Query 2D - Mutable 🔒 (Premium) | Medium | 2D Fenwick | [leetcode.com/problems/range-sum-query-2d-mutable](https://leetcode.com/problems/range-sum-query-2d-mutable/) |
| 4 | Count of Smaller Numbers After Self | Hard | Fenwick + rank | [leetcode.com/problems/count-of-smaller-numbers-after-self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) |
| 5 | Count of Range Sum | Hard | Prefix sums + Fenwick | [leetcode.com/problems/count-of-range-sum](https://leetcode.com/problems/count-of-range-sum/) |
| 6 | Reverse Pairs | Hard | Fenwick / merge sort | [leetcode.com/problems/reverse-pairs](https://leetcode.com/problems/reverse-pairs/) |
| 7 | My Calendar III | Hard | Lazy Segment Tree (range +1, max) | [leetcode.com/problems/my-calendar-iii](https://leetcode.com/problems/my-calendar-iii/) |
| 8 | Falling Squares | Hard | Range max + range assign | [leetcode.com/problems/falling-squares](https://leetcode.com/problems/falling-squares/) |
| 9 | The Skyline Problem | Hard | Segment Tree / heap | [leetcode.com/problems/the-skyline-problem](https://leetcode.com/problems/the-skyline-problem/) |

Agla: [29-advanced-string-algorithms.md](29-advanced-string-algorithms.md)
