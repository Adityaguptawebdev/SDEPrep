# 2. Two Pointers

> Pehle ye aane chahiye: [Arrays](../00-syllabus/01-basics/02-arrays.md), [Sorting](../00-syllabus/01-basics/07-sorting.md)

> **Standard definition**: A technique using two index pointers that traverse a data structure (often from opposite ends, or both from the start at different speeds) to reduce time complexity, typically from O(n²) to O(n).

**Ek line mein**: Do pointers rakho aur **har step pe ek rule se tay karo ki kaunsa hilana hai** — ek hi baar mein poori array ki jodi/partition/merge O(n) mein ho jaye, O(n²) nested loop ki jagah.

**Trick yaad rakhne ki**: *"Do log ek kamre ko dono taraf se saaf karte hain, beech mein milte hain"* — akela ek taraf se scan karne ke bajaye **dono taraf ki jaankari ek saath** use hoti hai (khaaskar **sorted** data pe).

```
① Opposite ends       ② Read / Write           ③ Do sequences         ⑤ 3 pointers
L →           ← R      W ← R →                  i →      j →           low mid → high
[1 2 3 4 5 6 7]        [0 1 0 3 0 5]            [1 3 5]  [2 4 6]        [0 0 1 1 | 2 2]
 beech mein milo       R padhta hai, W likhta   dono ko merge/match     teen zone banao
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Array / string / linked list  +  koi ORDER hai (sorted) ya do cheezein saath-saath dekhni hain
✅ Sawaal "pair / triplet", "in-place badlo", "do sorted lists merge karo", "palindrome" jaisa hai
✅ Brute force do nested loop (i, j) hai — aur har (i, j) ko dekhna zaroori nahi
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**sorted** array mein do numbers jinka sum X", "container/pani/deewar", "palindrome", "squares of sorted array" | ① **Opposite ends** |
| "**in-place** hatao/compact karo/zeroes peeche bhejo", "duplicates hatao (extra space nahi)" | ② **Read / Write** |
| "**do sorted arrays** merge karo / common elements / **subsequence** hai?" | ③ **Do sequences** |
| "**triplet / 4 numbers** jinka sum X (unique)" | ④ **K-Sum** (fix + two pointers) |
| "sirf **0, 1, 2**" ya "even-odd alag karo" (partition) | ⑤ **3-way / 2-way partition** |

**Two Pointers vs Sliding Window — confuse mat hona:**

| | Two Pointers | [Sliding Window](01-sliding-window.md) |
|---|---|---|
| Pointers | Alag-alag kaam (opposite / read-write / do arrays) | Ek **window** ke do sire (`left..right` ke beech ka hissa) |
| Sawaal | Pair, partition, merge, palindrome | **Contiguous subarray** ka longest / shortest / count |
| Sorted zaroori? | Aksar haan | Nahi |

### ❌ Kab NAHI lagega
- **Unsorted array mein pair-sum** (aur sort nahi kar sakte kyunki index chahiye) → [HashMap](../00-syllabus/01-basics/04-hashing.md) lo.
- Condition **monotonic nahi** (ek pointer hilane se answer ka sahi ya galat hona pakka nahi) → DP / brute force.

---

## 2. Variations ek nazar mein

```
                    Data / sawaal kaisa hai?
        ┌───────────────┬────────────────┬─────────────────┬──────────────────┐
   Ek hi array,     Ek hi array,     Do alag          Triplet /          Sirf 2-3 values
   dono taraf       ek pass mein     sequences        4 numbers          ka partition
   se andar         "rakho / hatao"                   ka sum
        │                │                │                │                  │
   ① OPPOSITE       ② READ/WRITE     ③ DO SEQUENCES    ④ K-SUM            ⑤ PARTITION
   L=0, R=n-1       W=0, R=0..n      i=0, j=0          fix i +            low, mid, high
   (milte hain)     (W ≤ R)          (do arrays)       ① on the rest      (Dutch flag)
```

## 3. Code likhne ki recipe — 3 sawaal

```
1. SHURUAT  →  pointers kahan se? (0 aur n-1  /  dono 0  /  har array ke liye 0)
2. MOVE RULE →  kis condition pe KAUNSA pointer hile?   ← yahi asli soch hai
3. ROKO     →  loop kab tak?   (left < right  /  read < n  /  i < n && j < m)
```

**Move rule kaise soche**: *"Jo pointer hilane se answer galat nahi hota, use hilao."* Sorted array mein sum bada hai → right ko hilana hi padega (kyunki left ko hilane se sum aur bada hoga).

---

## 4. ① Opposite Ends (dono sire se andar)

**Template**:

```
left = 0, right = n - 1
while (left < right):
    current = nums[left], nums[right] se kuch nikaalo
    answer update
    if (left ko hilana sahi):   left++
    else:                       right--
```

### Example 1 — Two Sum II (sorted array, target sum)

```
numbers = [2, 7, 11, 15], target = 9

L=0 R=3 : 2 + 15 = 17 > 9  → sum bada, right ko ghatao   R=2
L=0 R=2 : 2 + 11 = 13 > 9  → R=1
L=0 R=1 : 2 +  7 =  9 ✅   → answer [1, 2] (1-indexed)
```

```java
public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};     // 1-indexed answer
        if (sum < target) left++;      // 🔑 sum chhota → bada number chahiye → left aage
        else right--;                   // sum bada → chhota chahiye → right peeche
    }
    return new int[]{-1, -1};
}
```

### Example 2 — Container With Most Water (kaunsi deewar hilaye?)

Area = `min(height[L], height[R]) × (R − L)`. **Rule**: *"Chhoti deewar ko hilao."* Kyun? Area **chhoti deewar** se bandhi hai. Badi deewar ko hilate ho toh width bhi ghatti hai aur height (min) badh nahi sakti → area kabhi behtar nahi. Chhoti hilane pe hi mauka hai.

```
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]

L=0(1) R=8(7): area = 1×8 = 8     chhoti = left (1) → L++
L=1(8) R=8(7): area = 7×7 = 49 ⭐ chhoti = right (7) → R--
L=1(8) R=7(3): area = 3×6 = 18     chhoti = right → R--
...                                                        best = 49
```

```java
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1, best = 0;
    while (left < right) {
        best = Math.max(best, Math.min(height[left], height[right]) * (right - left));
        if (height[left] < height[right]) left++;    // 🔑 chhoti deewar ko hilao
        else right--;
    }
    return best;
}
```

### Example 3 — Trapping Rain Water (jo side chhoti, wahan ka paani pakka)

Har position pe paani = `min(leftMax, rightMax) − height`. Do pointers se: **jis side ki current height chhoti hai, us side ka paani us side ke `max` se decide ho jata hai** (doosri taraf koi na koi ≥ height maujood hai).

```
height = [3, 0, 2, 0, 4]

L=0(3) R=4(4): 3 < 4 → left side. 3 ≥ leftMax(0) → leftMax = 3.          water = 0
L=1(0):        0 < 4 → left side. 0 < leftMax(3) → paani += 3 − 0 = 3    water = 3
L=2(2):        paani += 3 − 2 = 1                                        water = 4
L=3(0):        paani += 3 − 0 = 3                                        water = 7 ✅
```

```java
public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {                 // 🔑 chhoti side ki taraf kaam karo
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];            // leftMax se neecha → paani rukega
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}
```

### Example 4 — Valid Palindrome II (ek akshar hata sakte ho)

Dono sire se match karo. **Pehla mismatch** mila toh do hi option: **left wala chhodo** ya **right wala chhodo** — phir bacha hissa palindrome hona chahiye.

```java
public boolean validPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return isPalindrome(s, left + 1, right)        // left wala akshar hata ke
                || isPalindrome(s, left, right - 1);        // ya right wala hata ke
        }
        left++;
        right--;
    }
    return true;
}

private boolean isPalindrome(String s, int l, int r) {
    while (l < r) {
        if (s.charAt(l++) != s.charAt(r--)) return false;
    }
    return true;
}
```

### Example 5 — Squares of a Sorted Array (peeche se bharo)

`[-4, -1, 0, 3, 10]` → squares sorted. Sabse bada square hamesha **kisi ek sire** pe hota hai (bada negative ya bada positive). Toh **dono sire compare karo, bada wala result ke peeche daalo**.

```java
public int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int left = 0, right = n - 1;
    for (int pos = n - 1; pos >= 0; pos--) {                 // 🔑 sabse bada square pehle, peeche se bharo
        if (Math.abs(nums[left]) > Math.abs(nums[right])) {
            result[pos] = nums[left] * nums[left];
            left++;
        } else {
            result[pos] = nums[right] * nums[right];
            right--;
        }
    }
    return result;
}
```

---

## 5. ② Read / Write (in-place compact karna)

**Idea**: `read` **har element ko padhta hai**, `write` **wo jagah hai jahan agla "rakhne layak" element likhna hai**. `write ≤ read` hamesha. Ye **extra array ke bina** filter karna hai.

**Template**:

```
write = 0
for read in 0 .. n-1:
    if (nums[read] RAKHNE LAYAK hai):
        nums[write] = nums[read]
        write++
return write                      # naya size
```

```
Remove Element (val = 2) :  [3, 2, 2, 3]          Move Zeroes :  [0, 1, 0, 3, 12]

R=0: 3 rakho → W=0 pe 3, W=1                        non-zero ko aage laate jao (swap), zeroes peeche
R=1: 2 skip                                          [1, 3, 12, 0, 0]
R=2: 2 skip
R=3: 3 rakho → W=1 pe 3, W=2                        answer size = 2 → [3, 3, _, _]
```

**Ek line ka farak**: *"Rakhne ki shart"* badalti hai:

| Problem | Rakhne ki shart |
|---|---|
| Remove Element | `nums[read] != val` |
| Remove Duplicates (sorted, ek baar) | `nums[read] != nums[write − 1]` |
| Remove Duplicates II (at most **2** baar) | `write < 2 \|\| nums[read] != nums[write − 2]` |
| Move Zeroes | `nums[read] != 0` (aur **swap** karo, sirf likho mat) |

```java
public int removeElement(int[] nums, int val) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != val) nums[write++] = nums[read];     // rakhne layak → write pe likho
    }
    return write;
}

// Sorted array — har value sirf ek baar
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;                                              // pehla element hamesha rakho
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[write - 1]) nums[write++] = nums[read];   // 🔑 last rakhe hue se alag ho toh naya
    }
    return write;
}

// Sorted array — har value at most 2 baar   ("k baar allowed" = nums[write − k] se compare)
public int removeDuplicatesII(int[] nums) {
    int write = 0;
    for (int x : nums) {
        if (write < 2 || x != nums[write - 2]) nums[write++] = x;
    }
    return write;
}

public void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            int t = nums[write]; nums[write] = nums[read]; nums[read] = t;   // non-zero aage, zero peeche
            write++;
        }
    }
}
```

**Remove Duplicates II trace** — `[1,1,1,2,2,3]`: `1`(rakha) → `1`(rakha) → `1` (nums[write−2]=1 ke barabar → skip) → `2`(rakha) → `2`(rakha) → `3`(rakha) → **`[1,1,2,2,3]`**, size 5.

---

## 6. ③ Do Sequences (do arrays / do strings)

**Template**:

```
i = 0, j = 0
while (i < n  &&  j < m):
    compare a[i], b[j]
    ...apne rule se i++ ya j++ ya dono
(bacha hua hissa ho toh alag se handle)
```

```java
// Merge Sorted Array — nums1 mein peeche khaali jagah hai. PEECHE se bharo (overwrite ka darr nahi)
public void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;              // teeno ka aakhri index
    while (j >= 0) {                                        // nums2 khatam → nums1 ka bacha hissa pehle se sahi jagah pe
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}

// Is Subsequence — s ke akshar t mein order se milte hain?
public boolean isSubsequence(String s, String t) {
    int i = 0;                                              // s ka pointer
    for (int j = 0; j < t.length() && i < s.length(); j++) {
        if (s.charAt(i) == t.charAt(j)) i++;                // match → s ka agla akshar
    }
    return i == s.length();
}

// Do arrays ke common (unique) elements — pehle sort, phir two pointers
public int[] intersection(int[] a, int[] b) {
    Arrays.sort(a);
    Arrays.sort(b);
    List<Integer> out = new ArrayList<>();
    int i = 0, j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] < b[j]) i++;
        else if (a[i] > b[j]) j++;
        else {                                              // barabar → common
            if (out.isEmpty() || out.get(out.size() - 1) != a[i]) out.add(a[i]);   // unique rakhne ke liye
            i++;
            j++;
        }
    }
    int[] result = new int[out.size()];
    for (int k = 0; k < result.length; k++) result[k] = out.get(k);
    return result;
}
```

**Merge peeche se kyun?** Aage se bharte toh `nums1` ke abhi tak na dekhe hue elements overwrite ho jaate. Peeche se bharne pe jo jagah likh rahe ho wo **hamesha khaali ya padhi ja chuki** hoti hai.

---

## 7. ④ K-Sum (ek number fix karo + baaki pe Two Pointers)

**Idea**: 3Sum = *"ek number `nums[i]` fix karo, baaki array mein **Two Sum II** lagao (target = `−nums[i]`)."* 4Sum = do fix. **Zaroori**: pehle **sort**, aur **duplicates skip** karo (taaki same triplet dobara na aaye).

```
Template:
sort(nums)
for i in 0 .. n-3:
    if (i > 0 && nums[i] == nums[i-1])  continue        # fixed number ka duplicate skip
    left = i+1, right = n-1
    while (left < right):
        sum = nums[i] + nums[left] + nums[right]
        sum == target → answer; left++, right--; left/right ke duplicate skip
        sum <  target → left++
        sum >  target → right--
```

```
3Sum:  [-1, 0, 1, 2, -1, -4]  →  sort  →  [-4, -1, -1, 0, 1, 2]

i=0 (-4): koi jodi -4+... = 0 nahi milti
i=1 (-1): L=2(-1) R=5(2):  -1 -1 +2 = 0 ✅ [-1,-1,2]      L=3(0) R=4(1): -1+0+1 = 0 ✅ [-1,0,1]
i=2 (-1): pichhle jaisa hi (duplicate) → SKIP
i=3 (0) : 0 + 1 + 2 = 3 > 0 → R--   →  koi nahi
answer: [[-1,-1,2], [-1,0,1]]
```

```java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;              // 🔑 fixed number ka duplicate skip
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                right--;
                while (left < right && nums[left] == nums[left - 1]) left++;          // left ka duplicate skip
                while (left < right && nums[right] == nums[right + 1]) right--;       // right ka duplicate skip
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}

// 3Sum Closest — target ke sabse paas ka sum
public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < nums.length - 2; i++) {
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;   // paas wala rakho
            if (sum < target) left++;
            else if (sum > target) right--;
            else return sum;                                                     // exactly mil gaya
        }
    }
    return best;
}

// 4Sum — do number fix, baaki pe two pointers
public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int left = j + 1, right = n - 1;
            while (left < right) {
                long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];   // 🔑 long — int overflow se bachne ke liye
                if (sum == target) {
                    result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                    left++;
                    right--;
                    while (left < right && nums[left] == nums[left - 1]) left++;
                    while (left < right && nums[right] == nums[right + 1]) right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    return result;
}
```

**Time**: 3Sum `O(n²)`, 4Sum `O(n³)`. (Brute force `O(n³)` / `O(n⁴)`.)

---

## 8. ⑤ Partition (Dutch National Flag — 3 pointers)

**Sort Colors**: array mein sirf `0, 1, 2`. **Ek pass, extra space nahi.** Teen zone banao: `[0 wale | 1 wale | ... abhi dekhna baaki ... | 2 wale]`.

```
low  = 0 wale zone ke baad ka pehla index        mid = abhi jo dekh rahe hain      high = 2 wale zone se pehle ka aakhri index

nums[mid] == 0 → low ke saath swap, low++, mid++          (0 aage bheja, jo aaya wo 1 tha — dekha hua)
nums[mid] == 2 → high ke saath swap, high--               (mid NAHI badhta — swap hokar jo aaya wo abhi dekha nahi!)
nums[mid] == 1 → mid++
```

```
[2, 0, 2, 1, 1, 0]      low=0 mid=0 high=5

mid=0: 2 → swap(0,5) → [0,0,2,1,1,2]  high=4
mid=0: 0 → swap(0,0)                   low=1 mid=1
mid=1: 0 → swap(1,1)                   low=2 mid=2
mid=2: 2 → swap(2,4) → [0,0,1,1,2,2]  high=3
mid=2: 1 → mid=3;  mid=3: 1 → mid=4  > high  → STOP   ✅ [0,0,1,1,2,2]
```

```java
public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums, low++, mid++);          // 0 → left zone
        else if (nums[mid] == 2) swap(nums, mid, high--);      // 2 → right zone (mid nahi badhta)
        else mid++;                                             // 1 → beech mein hi rehne do
    }
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}

// 2-way partition: even aage, odd peeche  (opposite ends se)
public int[] sortArrayByParity(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        if (nums[left] % 2 == 0) left++;                       // left sahi jagah pe
        else if (nums[right] % 2 != 0) right--;                // right sahi jagah pe
        else {                                                  // dono galat jagah → swap
            int t = nums[left]; nums[left] = nums[right]; nums[right] = t;
            left++;
            right--;
        }
    }
    return nums;
}
```

---

## 9. Sab ek nazar mein — Move rule kya hai?

| Variation | Pointers | Move rule (kaun hile) | Loop |
|---|---|---|---|
| ① Pair sum (sorted) | `L=0, R=n−1` | `sum < target → L++`, `sum > target → R--` | `L < R` |
| ① Container water | `L=0, R=n−1` | **chhoti deewar** hilao | `L < R` |
| ① Trapping water | `L, R` + `leftMax, rightMax` | **chhoti height wali side** | `L < R` |
| ① Palindrome (skip 1) | `L, R` | mismatch → dono option try | `L < R` |
| ② Compact / filter | `W ≤ R` | `R` hamesha; `W` sirf tab jab rakha | `R < n` |
| ③ Merge / match | `i`, `j` | chhota wala aage (merge) / match pe dono | `i < n && j < m` |
| ④ K-Sum | fix `i` + `L, R` | ① wala rule + duplicate skip | `i` loop + `L < R` |
| ⑤ Dutch flag | `low, mid, high` | 0 → low se swap, 2 → high se swap | `mid ≤ high` |

## Common galtiyan

- **Sort karna bhool jana** (pair-sum, 3Sum, intersection) — bina sorted ke rule galat hai.
- **`left < right` ki jagah `left <= right`** — ek hi element ko khud ke saath jodna (pair mein).
- **K-Sum mein duplicates skip na karna** — same triplet baar-baar aayega.
- **Dutch flag mein `2` swap ke baad `mid++` kar dena** — swap hokar aaya element abhi dekha hi nahi gaya.
- **Merge mein aage se bharna** — `nums1` ke elements overwrite ho jaate hain.
- **4Sum mein `int` sum** — overflow. `long`.
- **Read/Write mein `write` ko `read` se aage nikalne dena** — `write ≤ read` hamesha rehta hai, warna dekhe hue elements bigad jaate hain.

> 💡 **Interview mein bolne wali line**: *"Nested loop O(n²) hoga. Array sorted hai, isliye dono sire se two pointers — sum bada toh right ghatata hoon, chhota toh left badhata hoon. Har step ek element chhodta hai, isliye O(n) aur O(1) space."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Two Sum II - Input Array Is Sorted | ① Opposite | Medium | [leetcode.com/problems/two-sum-ii-input-array-is-sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| 2 | Squares of a Sorted Array | ① Opposite | Easy | [leetcode.com/problems/squares-of-a-sorted-array](https://leetcode.com/problems/squares-of-a-sorted-array/) |
| 3 | Valid Palindrome II | ① Opposite | Easy | [leetcode.com/problems/valid-palindrome-ii](https://leetcode.com/problems/valid-palindrome-ii/) |
| 4 | Container With Most Water | ① Opposite | Medium | [leetcode.com/problems/container-with-most-water](https://leetcode.com/problems/container-with-most-water/) |
| 5 | Trapping Rain Water | ① Opposite | Hard | [leetcode.com/problems/trapping-rain-water](https://leetcode.com/problems/trapping-rain-water/) |
| 6 | Remove Element | ② Read/Write | Easy | [leetcode.com/problems/remove-element](https://leetcode.com/problems/remove-element/) |
| 7 | Move Zeroes | ② Read/Write | Easy | [leetcode.com/problems/move-zeroes](https://leetcode.com/problems/move-zeroes/) |
| 8 | Remove Duplicates from Sorted Array | ② Read/Write | Easy | [leetcode.com/problems/remove-duplicates-from-sorted-array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) |
| 9 | Remove Duplicates from Sorted Array II | ② Read/Write | Medium | [leetcode.com/problems/remove-duplicates-from-sorted-array-ii](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) |
| 10 | Merge Sorted Array | ③ Do sequences | Easy | [leetcode.com/problems/merge-sorted-array](https://leetcode.com/problems/merge-sorted-array/) |
| 11 | Is Subsequence | ③ Do sequences | Easy | [leetcode.com/problems/is-subsequence](https://leetcode.com/problems/is-subsequence/) |
| 12 | Intersection of Two Arrays | ③ Do sequences | Easy | [leetcode.com/problems/intersection-of-two-arrays](https://leetcode.com/problems/intersection-of-two-arrays/) |
| 13 | 3Sum | ④ K-Sum | Medium | [leetcode.com/problems/3sum](https://leetcode.com/problems/3sum/) |
| 14 | 3Sum Closest | ④ K-Sum | Medium | [leetcode.com/problems/3sum-closest](https://leetcode.com/problems/3sum-closest/) |
| 15 | 4Sum | ④ K-Sum | Medium | [leetcode.com/problems/4sum](https://leetcode.com/problems/4sum/) |
| 16 | Sort Array By Parity | ⑤ Partition | Easy | [leetcode.com/problems/sort-array-by-parity](https://leetcode.com/problems/sort-array-by-parity/) |
| 17 | Sort Colors | ⑤ Partition | Medium | [leetcode.com/problems/sort-colors](https://leetcode.com/problems/sort-colors/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Kaunsi variation (①–⑤)? Pointers kahan se shuru? Move rule kya? Loop kab tak?"* — phir code.

Agla: [03-fast-slow-pointers.md](03-fast-slow-pointers.md)
