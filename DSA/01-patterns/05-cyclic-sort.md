# 5. Cyclic Sort

> Pehle ye aane chahiye: [Arrays](../00-syllabus/01-basics/02-arrays.md), [Sorting](../00-syllabus/01-basics/07-sorting.md)

> **Standard definition**: A technique for arrays containing numbers in a known, fixed range (typically 1 to N), placing each number at its "correct" index (value == index) in a single pass, without extra space.

**Ek line mein**: Agar numbers **`1..n` (ya `0..n`) ke range** mein hain, toh **har number ki apni fixed seat (index) hai** — `value v` ki seat `index v − 1`. Har number ko uski seat pe **swap** karke bhejo. Phir jo seat pe **galat** number baitha hai, wahi **missing / duplicate** ka suraag hai. **O(n) time, O(1) space.**

**Trick yaad rakhne ki**: *"Roll number ke hisaab se bachchon ko unki seat pe baithao"* — roll number `5` ko seat `4` (index) pe baithna hai. Jo galat seat pe baitha hai use uski sahi seat pe bhejo (swap). Jo bachcha ab uski jagah aa gaya use **bhi dekho** (isliye `i` tabhi badhta hai jab current sahi seat pe ho). Ant mein jo seat pe **galat roll number** dikhe: wo seat ka asli roll number **gayab (missing)** hai, aur jo galat roll number baitha hai wo **duplicate** hai.

```
Seat (index) :   0    1    2    3    4
Sahi roll no :   1    2    3    4    5        ← value v ki seat = v − 1

[3, 1, 5, 4, 2]   →  swap karte jao  →   [1, 2, 3, 4, 5]   ✅ sab apni seat pe
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Array ke numbers ek KNOWN RANGE mein hain:  1..n  (n = length)   ya  0..n
✅ Sawaal "missing", "duplicate", "first missing positive", "corrupt pair" jaisa hai
✅ O(n) time + O(1) extra space chahiye  (sort O(n log n), HashSet O(n) space — mana)
```

| Sawaal ki bhasha | Variation |
|---|---|
| "array ko `1..n` mein **sort** karo" (permutation) | ① **Basic sort** |
| "`0..n` mein se **ek missing**", "**saare missing** (`1..n`)" | ② **Missing** |
| "**ek duplicate**", "**saare duplicates**" | ③ **Duplicate** |
| "**ek duplicate aur ek missing** (dono)" | ④ **Corrupt pair (Set Mismatch)** |
| "**sabse chhota missing positive**" (numbers kuch bhi ho sakte hain, negative/bade bhi) | ⑤ **Range filter** |

**Ek line ki pehchaan**: *"numbers ki range **array ki length se bandhi** hai"* (values `1..n`, length `n`) — yehi sabse bada hint hai.

### ❌ Kab NAHI
- Range **nahi bandhi** hai aur bahut bade numbers hain (values `10⁹`) → HashSet / sort.
- **Array modify nahi kar sakte** (read-only) → HashSet ya [Fast & Slow (Floyd)](03-fast-slow-pointers.md) (Find Duplicate ka doosra tareeka).
- Sirf ek missing, aur sum/XOR ka trick chalega → `n(n+1)/2 − sum` (par duplicates + missing dono ho toh nahi).

---

## 2. Variations ek nazar mein

```
Numbers ki range = array ki length (1..n ya 0..n)?
        │  HAAN
        ▼
HISSA 1 — Cyclic sort chalao (har number ko uski seat pe bhejo)
        │
        ▼
HISSA 2 — Scan karo. Jis seat pe GALAT number baitha hai, wahi suraag hai:

   ② Missing    →  us seat ka asli number (i + 1) gayab hai
   ③ Duplicate  →  jo galat number baitha hai (nums[i]) wahi duplicate hai
   ④ Dono       →  nums[i] = duplicate,   i + 1 = missing
   ⑤ Range ke bahar wale numbers (negative / bahut bade) sort mein SKIP karo, phir wahi scan
```

## 3. Code likhne ki recipe — 2 hisse

```
HISSA 1  (sort):   i = 0
                   while i < n:
                       v = nums[i]
                       if  v RANGE mein hai   AND   nums[seat(v)] != v :     ← seat(v) = v−1  (0..n−1 wale mein v)
                           swap(nums[i], nums[seat(v)])                      ← v ko uski seat pe bhejo (i nahi badhta!)
                       else:
                           i++                                               ← sahi seat pe hai / duplicate / range ke bahar

HISSA 2  (scan):   for i in 0..n-1:
                       if nums[i] != seat_value(i):     ← i pe galat number baitha hai
                           i+1 = MISSING,   nums[i] = DUPLICATE        (sawaal ke hisaab se)
```

**Do "safety" conditions** (dono zaroori):
1. **`nums[seat(v)] != v`** — agar seat pe **pehle se wahi number** hai (ya main khud sahi seat pe hoon), toh swap mat karo. Warna **duplicate hone pe infinite loop**.
2. **`v` range mein hai** — warna `nums[v − 1]` crash (index bahar).

---

## 4. ① Basic — `1..n` ka permutation sort karo

```
[3, 1, 5, 4, 2]

i=0: v=3 → seat 2 (nums[2]=5 ≠ 3) → swap → [5, 1, 3, 4, 2]
i=0: v=5 → seat 4 (nums[4]=2 ≠ 5) → swap → [2, 1, 3, 4, 5]
i=0: v=2 → seat 1 (nums[1]=1 ≠ 2) → swap → [1, 2, 3, 4, 5]
i=0: v=1 → seat 0 (khud) → sahi → i++ ... baaki sab sahi seat pe → DONE
```

```java
public void cyclicSort(int[] nums) {              // nums = 1..n ka permutation
    int i = 0;
    while (i < nums.length) {
        int seat = nums[i] - 1;                    // nums[i] ki sahi jagah (index)
        if (nums[i] != nums[seat]) swap(nums, i, seat);   // 🔑 wahan pehle se wahi nahi hai → bhejo (i wahin rahega)
        else i++;                                   // sahi seat pe hai → aage
    }
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

**Time O(n)** — dekhne mein `while` ke andar swap hai par **har swap ek number ko hamesha ke liye uski sahi seat pe bitha deta hai** → zyada se zyada `n − 1` swaps, aur `i` `n` baar badhta hai → total `≈ 2n`.

---

## 5. ② Missing numbers

### `0..n` mein ek missing (Missing Number)

Array mein `n` numbers hain, range `0..n` (yaani `n + 1` possible values). **Value `v` ki seat = index `v`.** Value `n` ke liye koi seat nahi (index `n` array mein hai hi nahi) → use **skip**.

```
[3, 0, 1]     n = 3

i=0: 3 == n → koi seat nahi → i++
i=1: 0 → seat 0 (nums[0]=3 ≠ 0) → swap → [0, 3, 1]
i=1: 3 == n → skip → i++
i=2: 1 → seat 1 (nums[1]=3 ≠ 1) → swap → [0, 1, 3]
i=2: 3 == n → skip

SCAN: nums[i] != i pehli baar i=2 pe (nums[2]=3) → missing = 2 ✅   (koi bhi mismatch nahi hota toh missing = n)
```

```java
public int missingNumber(int[] nums) {
    int i = 0, n = nums.length;
    while (i < n) {
        int v = nums[i];
        if (v < n && nums[v] != v) swap(nums, i, v);      // v range (0..n-1) mein aur seat pe nahi → bhejo
        else i++;                                          // v == n ya sahi seat pe
    }
    for (int j = 0; j < n; j++) {
        if (nums[j] != j) return j;                        // j seat pe galat number → j hi missing
    }
    return n;                                              // sab seat pe sahi → n missing
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

### `1..n` mein saare missing (Find All Numbers Disappeared)

Duplicates bhi ho sakte hain, isliye kai numbers missing. Sort ke baad **jis seat pe galat number hai wahi missing**.

```
[4, 3, 2, 7, 8, 2, 3, 1]     sort ke baad →  [1, 2, 3, 4, 3, 2, 7, 8]

idx :        0  1  2  3  4  5  6  7
seat wala :  1  2  3  4  5  6  7  8      ← ye hona chahiye
actual    :  1  2  3  4  3  2  7  8
                         ✗  ✗                 idx 4 → 5 missing,   idx 5 → 6 missing    →  [5, 6]
```

```java
public List<Integer> findDisappearedNumbers(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        int seat = nums[i] - 1;
        if (nums[i] != nums[seat]) swap(nums, i, seat);    // duplicate ho toh wahan wahi hai → swap nahi → i++
        else i++;
    }
    List<Integer> missing = new ArrayList<>();
    for (int j = 0; j < nums.length; j++) {
        if (nums[j] != j + 1) missing.add(j + 1);           // 🔑 j+1 seat pe galat number → j+1 gayab
    }
    return missing;
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

---

## 6. ③ Duplicates

**Wahi sorted arrangement** (`[1, 2, 3, 4, 3, 2, 7, 8]`): jo number **galat seat** pe baitha hai (`nums[j] != j + 1`) wahi **duplicate** hai (uski sahi seat pe already uski copy baithi hai).

```java
// Find All Duplicates (har number 1 ya 2 baar)
public List<Integer> findDuplicates(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        int seat = nums[i] - 1;
        if (nums[i] != nums[seat]) swap(nums, i, seat);
        else i++;
    }
    List<Integer> dups = new ArrayList<>();
    for (int j = 0; j < nums.length; j++) {
        if (nums[j] != j + 1) dups.add(nums[j]);            // 🔑 galat seat pe baitha number = duplicate
    }
    return dups;
}

// Find the Duplicate Number (n+1 numbers, range 1..n, ek value repeat). ⚠️ ARRAY MODIFY hota hai
public int findDuplicate(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        if (nums[i] != i + 1) {
            int seat = nums[i] - 1;
            if (nums[i] != nums[seat]) swap(nums, i, seat);
            else return nums[i];                             // 🔑 seat pe pehle se wahi → ye duplicate hai
        } else {
            i++;
        }
    }
    return -1;
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

> ⚠️ `findDuplicate` array badalta hai. LeetCode ka sawaal "array modify mat karo" bolta hai — waha [Fast & Slow (Floyd)](03-fast-slow-pointers.md) lo. Interview mein **pehle poochho**: *"Kya array modify kar sakta hoon?"*

### Bonus: Sort ke bina — "index ko hash bana lo" (negative marking)

Agar **swap nahi** karna, toh **`nums[v − 1]` ko negative** karke "v dikh chuka hai" mark karo. Dobara dikha toh **duplicate**.

```java
public List<Integer> findDuplicatesByMarking(int[] nums) {
    List<Integer> dups = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;                    // ye number kis seat ka hai
        if (nums[idx] < 0) dups.add(Math.abs(nums[i]));     // seat pehle se negative → number pehle dikh chuka → duplicate
        else nums[idx] = -nums[idx];                         // pehli baar dikha → seat ko negative mark karo
    }
    return dups;
}
```

---

## 7. ④ Duplicate + Missing dono (Set Mismatch)

`[1, 2, 2, 4]` (`1..4` mein ek number do baar, ek gayab). Sort ke baad **jo seat galat hai**: `nums[i]` = duplicate, `i + 1` = missing.

```
[1, 2, 2, 4]   →  sort  →  [1, 2, 2, 4]
                       seat 3 (idx 2): hona chahiye 3, baitha hai 2   →  duplicate = 2, missing = 3   →  [2, 3] ✅
```

```java
public int[] findErrorNums(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        int seat = nums[i] - 1;
        if (nums[i] != nums[seat]) swap(nums, i, seat);
        else i++;
    }
    for (int j = 0; j < nums.length; j++) {
        if (nums[j] != j + 1) return new int[]{nums[j], j + 1};   // {duplicate, missing}
    }
    return new int[]{-1, -1};
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

---

## 8. ⑤ First Missing Positive — range filter (hard)

Numbers **kuch bhi** ho sakte hain (negative, `0`, bahut bade). Par **answer hamesha `1..n+1`** ke beech hoga (kyunki `n` numbers mein `1..n` sab hote toh answer `n + 1`). Toh **sirf `1..n` wale numbers ko seat pe bhejo**, baaki ko **ignore** (skip).

```
[3, 4, -1, 1]

i=0: 3  → range mein, seat 2 (nums[2]=-1 ≠ 3) → swap → [-1, 4, 3, 1]
i=0: -1 → range ke BAHAR → i++
i=1: 4  → seat 3 (nums[3]=1 ≠ 4) → swap → [-1, 1, 3, 4]
i=1: 1  → seat 0 (nums[0]=-1 ≠ 1) → swap → [1, -1, 3, 4]
i=1: -1 → range ke bahar → i++;  i=2: 3 sahi;  i=3: 4 sahi

SCAN:  idx 1 pe nums[1] = -1 ≠ 2  →  answer 2 ✅        (sab sahi hote toh answer n + 1)
```

```java
public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    int i = 0;
    while (i < n) {
        int v = nums[i];
        if (v >= 1 && v <= n && nums[v - 1] != v) swap(nums, i, v - 1);   // 🔑 range CHECK pehle: 1..n mein ho toh hi seat pe bhejo
        else i++;                                                          // range ke bahar / sahi seat / duplicate
    }
    for (int j = 0; j < n; j++) {
        if (nums[j] != j + 1) return j + 1;                                // j+1 seat pe galat → j+1 sabse chhota missing
    }
    return n + 1;                                                           // 1..n sab maujood
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

---

## 9. Sab ek nazar mein — sirf 2 cheezein badalti hain

| Variation | Seat ka formula | Range check | Scan mein kya |
|---|---|---|---|
| ① Sort `1..n` | `seat = v − 1` | zaroori nahi | — |
| ② Missing (`0..n`) | `seat = v` | `v < n` (n ki seat nahi) | `nums[j] != j` → `j`; koi nahi → `n` |
| ② Missing (`1..n`, saare) | `seat = v − 1` | zaroori nahi | `nums[j] != j+1` → `j+1` |
| ③ Duplicate(s) | `seat = v − 1` | zaroori nahi | `nums[j] != j+1` → `nums[j]` |
| ④ Set Mismatch | `seat = v − 1` | zaroori nahi | `{nums[j], j+1}` |
| ⑤ First Missing Positive | `seat = v − 1` | **`1 ≤ v ≤ n`** | pehla `nums[j] != j+1` → `j+1`; koi nahi → `n+1` |

## Common galtiyan

- **`nums[seat] != nums[i]` check bhoolna** — duplicates hone pe **infinite loop** (swap karte raho, kuch badalta nahi).
- **`i++` swap ke baad kar dena** — swap se jo number `i` pe aaya wo abhi dekha nahi. `i` sirf tab badhta hai jab **swap nahi hua**.
- **Range check bhoolna** (First Missing Positive) — negative/bade number pe `nums[v − 1]` crash.
- **`0..n` aur `1..n` ka seat formula confuse karna** — `0..n` mein `seat = v`, `1..n` mein `seat = v − 1`.
- **Value `n` (`0..n` wale sawaal mein) ko swap karne ki koshish** — uski seat nahi hai.
- **Array modify hona** — interview mein pehle poochho ki allowed hai ya nahi.

> 💡 **Interview mein bolne wali line**: *"Numbers ki range array ki length se bandhi hai, isliye main har number ko uske index pe swap karke bhej sakta hoon — cyclic sort. Har swap ek number ko hamesha ke liye sahi jagah deta hai, isliye O(n) time, O(1) space. Uske baad ek scan mein galat jagah wale se missing/duplicate mil jata hai."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Missing Number | ② `0..n` | Easy | [leetcode.com/problems/missing-number](https://leetcode.com/problems/missing-number/) |
| 2 | Find All Numbers Disappeared in an Array | ② `1..n` saare | Easy | [leetcode.com/problems/find-all-numbers-disappeared-in-an-array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) |
| 3 | Set Mismatch | ④ Dono | Easy | [leetcode.com/problems/set-mismatch](https://leetcode.com/problems/set-mismatch/) |
| 4 | Find Missing and Repeated Values | ④ Dono (2D grid) | Easy | [leetcode.com/problems/find-missing-and-repeated-values](https://leetcode.com/problems/find-missing-and-repeated-values/) |
| 5 | Find the Duplicate Number | ③ Ek duplicate | Medium | [leetcode.com/problems/find-the-duplicate-number](https://leetcode.com/problems/find-the-duplicate-number/) |
| 6 | Find All Duplicates in an Array | ③ Saare duplicates | Medium | [leetcode.com/problems/find-all-duplicates-in-an-array](https://leetcode.com/problems/find-all-duplicates-in-an-array/) |
| 7 | Max Chunks To Make Sorted | ① Sort ka idea | Medium | [leetcode.com/problems/max-chunks-to-make-sorted](https://leetcode.com/problems/max-chunks-to-make-sorted/) |
| 8 | First Missing Positive | ⑤ Range filter | Hard | [leetcode.com/problems/first-missing-positive](https://leetcode.com/problems/first-missing-positive/) |
| 9 | Couples Holding Hands | ① Swap-to-place | Hard | [leetcode.com/problems/couples-holding-hands](https://leetcode.com/problems/couples-holding-hands/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Range kya? Seat ka formula? Range check chahiye? Scan mein kya dhoondhna hai?"* — phir code.

Agla: [06-top-k-elements.md](06-top-k-elements.md)
