# 1. Sliding Window

> Pehle ye aane chahiye: [Arrays](../00-syllabus/01-basics/02-arrays.md), [Strings](../00-syllabus/01-basics/03-strings.md), [Hashing](../00-syllabus/01-basics/04-hashing.md)

> **Standard definition**: A technique that maintains a contiguous range (window) over an array/string, expanding or shrinking its boundaries based on a condition, to avoid recomputing over the same elements repeatedly.

**Ek line mein**: Array/string ke ek **contiguous hisse (window)** ko do pointers `left` aur `right` se pakdo — **`right` naya element andar leta hai, `left` purana element bahar nikalta hai** — aur poora subarray baar-baar recompute karne ki jagah **sirf farak update** karo. O(n²) → **O(n)**.

**Trick yaad rakhne ki**: *"Train ki khidki"* — khidki ka size ek hi rehta hai, train aage badhti hai: **naya scene andar aata hai, purana bahar jata hai**, poora scene dobara nahi dekhna padta. Aur **do darwaze** yaad rakho:
- **`right` = andar aane wala darwaza** (window bada karta hai)
- **`left` = bahar jaane wala darwaza** (window chhota karta hai)

```
arr :  [ 2   1   5   1   3   2 ]
idx :    0   1   2   3   4   5

              L       R
              │       │
           window = [ 1   5   1 ]         size = R − L + 1 = 3

3 hi moves hain:   R++  → window BADA hua (naya andar)
                   L++  → window CHHOTA hua (purana bahar)
                   dono → window KHISKI (size wahi)
```

**Kyun O(n)?** `right` sirf aage jata hai, `left` bhi sirf aage jata hai (**kabhi peeche nahi**) — toh har element **zyada se zyada ek baar andar aur ek baar bahar** aata hai. Do loops dikhne pe bhi total kaam **2n**, `n²` nahi.

---

## 1. Kab use karo — kaise PEHCHANO

Sliding window tab lagta hai jab **ye teeno** ek saath ho:

```
✅ 1. Sawaal SUBARRAY / SUBSTRING ka hai  →  elements ek-doosre ke bagal mein (CONTIGUOUS)
✅ 2. Kuch OPTIMIZE karna hai: longest / shortest / max sum / count  —  ya  "size k ki window" di hai
✅ 3. Brute force O(n²) hai (har start × har end) aur usme wahi elements baar-baar dobara jodte ho
```

**Sawaal ki bhasha se pehchano:**

| Sawaal mein ye shabd dikhein | Kaunsa sliding window |
|---|---|
| "size **k** ka subarray", "**k consecutive** elements", "har window ka ..." | **Fixed size** |
| "anagram / permutation **in string**" (pattern ki lambai fix hai) | **Fixed size** (size = `p.length()`) |
| "**longest** substring/subarray jisme ... (**no repeat** / **at most k** / **≤ k zeros**)" | **Variable — Longest** |
| "**shortest / minimum length** subarray jiska sum **≥ target**", "**minimum window** jisme sab ho" | **Variable — Shortest** |
| "**kitne subarrays** jinme ... **at most K**" | **Count** (`atMost(K)`) |
| "**exactly K** distinct / odd numbers wale subarrays kitne" | `atMost(K) − atMost(K−1)` |

### ❌ Kab sliding window NAHI lagega

| Situation | Kyun nahi | Kya lo |
|---|---|---|
| **Subsequence** (elements bagal mein nahi, beech se chhod sakte ho) | Window contiguous hoti hai | DP / Greedy |
| Array mein **negative numbers** hain aur **sum = target** dhoondhna hai | Element jodne pe sum **ghat** bhi sakta hai — "bada hua toh shrink" wala rule toot jata hai | [Prefix Sum + HashMap](07-prefix-sum.md) |
| Condition **monotonic nahi** hai (window badi karne pe kabhi valid, kabhi nahi, koi pattern nahi) | Left ko kab hatana hai ye decide nahi ho sakta | DP / brute force |

```
Kyun negative numbers se toot jata hai?      nums = [2, -1, 2],  sum = 3 chahiye

[2]        sum = 2   (kam hai)  → right badhao
[2, -1]    sum = 1   (aur KAM ho gaya!)   ← "window badi = sum bada" wala bharosa yahin galat
[2, -1, 2] sum = 3   ✅  (par shrink/expand ka faisla ab andhere mein tha)
```

**Monotonic** ka matlab: window mein **element jodne se condition sirf ek hi disha mein badalti hai** (jaise zyada duplicates ya sum sirf badhta hai) — tabhi hum "ab bahut ho gaya, left se hatao" bharose se keh sakte hain.

---

## 2. Fixed ya Variable — kaise decide karein

```
                        Kya sawaal mein window ki size (k) DI hui hai?
                       ┌────────────────────┴────────────────────┐
                     HAAN                                        NAHI
                       │                                          │
                 ① FIXED SIZE                        Kya sawaal "longest/max" maangta hai?
              (har step: 1 andar, 1 bahar)          ┌───────────────┴───────────────┐
                                                  HAAN                            NAHI
                                                    │                               │
                                       ② VARIABLE — LONGEST          "shortest/min" ya "count" hai?
                                     (invalid hote hi left se shrink)     ┌──────────┴──────────┐
                                                                     shortest/min            count
                                                                          │                    │
                                                              ③ VARIABLE — SHORTEST      ④ atMost(K) trick
                                                          (valid hote hi shrink karke     (K − (K−1))
                                                                answer chhota karo)
```

| | ① Fixed | ② Variable — Longest | ③ Variable — Shortest |
|---|---|---|---|
| Window size | Hamesha `k` | Badalti rehti hai | Badalti rehti hai |
| `right` | Har step +1 | Har step +1 | Har step +1 |
| `left` | Ek saath: `right − k` wala nikalo (**`if`**) | **`while` window INVALID** hai | **`while` window VALID** hai |
| Answer kab update | Window poori banne ke baad | `while` ke **BAAD** (window valid hai) | `while` ke **ANDAR** (pehle answer, phir shrink) |
| Ek line mein | "Ek andar, ek bahar" | "Bigda? → left se theek karo, phir napo" | "Ban gaya? → jitna chhota kar sako karo" |

---

## 3. Code likhne ki 4-step recipe (har problem mein yehi poochho)

```
1. STATE  →  window ke andar kya yaad rakhna hai?    (sum / count array / HashMap / zeros ki ginti / missing)
2. JODO   →  right pe naya element aaye toh state kaise badle?
3. SHART  →  window kab INVALID hai (Longest)?   kab VALID hai (Shortest)?
4. HATAO  →  left wala element nikle toh state kaise wapas (undo) ho?
```

Bas ye 4 cheezein tay ho gayi toh **template mein bharna** hi baaki rehta hai — neeche har type ke liye.

---

## 4. TYPE ① — Fixed Size Window

**Template** (ek hi loop mein — `if` se dono kaam):

```
state = khaali
for right in 0 .. n-1:
    state mein nums[right] JODO                      # naya andar
    if right >= k:
        state se nums[right - k] HATAO               # purana bahar (window ka size k rakhne ke liye)
    if right >= k - 1:                               # window poori ban gayi (k elements ho gaye)
        answer update karo
```

### Example 1 — Maximum Average Subarray I (size `k` ka max average)

`nums = [1, 12, -5, -6, 50, 3], k = 4`

```
STATE  = window ka sum       JODO = sum += nums[right]       HATAO = sum -= nums[right - k]

right=0..2 : window abhi poori nahi (k=4 elements chahiye)
right=3    : [1, 12, -5, -6]   sum = 2                 ← pehli window poori, best = 2
right=4    : + 50, − 1  →  [12, -5, -6, 50]  sum = 51   ← best = 51
right=5    : + 3, − 12  →  [-5, -6, 50, 3]   sum = 42

best sum = 51  →  average = 51 / 4 = 12.75 ✅
```

```java
public double findMaxAverage(int[] nums, int k) {
    int sum = 0;
    int best = Integer.MIN_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];                          // JODO: naya element andar
        if (right >= k) sum -= nums[right - k];      // HATAO: purana bahar (window ka size k hi rahe)
        if (right >= k - 1) {                        // 🔑 window poori bani → tabhi answer update
            best = Math.max(best, sum);
        }
    }
    return (double) best / k;
}
```

### Example 2 — Find All Anagrams in a String (state = letters ki ginti)

`s = "cbaebabacd", p = "abc"` — `s` mein **kahan-kahan `p` ka anagram** shuru hota hai? Window ka size **`p.length() = 3` (fixed)**.

```
STATE = have[26] (window mein har letter kitni baar)     need[26] = p ke letters ki ginti
JODO  = have[s[right]]++     HATAO = have[s[right - k]]--      SHART = have == need  →  anagram!

windows:  [cba] ✅ start 0   [bae]   [aeb]   [eba]   [bab]   [aba]   [bac] ✅ start 6   [acd]
answer = [0, 6]
```

```java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    int k = p.length();
    int[] need = new int[26];
    for (char c : p.toCharArray()) need[c - 'a']++;

    int[] have = new int[26];                            // STATE: window ke letters ki ginti
    for (int right = 0; right < s.length(); right++) {
        have[s.charAt(right) - 'a']++;                    // JODO
        if (right >= k) have[s.charAt(right - k) - 'a']--;   // HATAO: window ka size k rakho
        if (right >= k - 1 && Arrays.equals(need, have)) {   // window poori + ginti barabar → anagram
            result.add(right - k + 1);                    // window ka start index
        }
    }
    return result;
}
```

**Line by line samjho**: Har baar ek letter andar, ek bahar — `have` array O(1) mein update hota hai. `Arrays.equals` sirf 26 cells compare karta hai (constant). Total **O(n)**.

> **Sliding Window Maximum** (har window ka max) bhi fixed size hai, par sirf sum ki tarah "hatana" aasan nahi — wahan **monotonic deque** chahiye: [Queue & Deque note](../00-syllabus/02-linear-structures/12-queue-and-deque.md).

---

## 5. TYPE ② — Variable Size, **LONGEST** (max length)

**Idea**: *"Window ko badhate jao. Jaise hi **bigad** jaye (invalid), `left` se tab tak hatao jab tak **theek** na ho jaye. Phir window ki lambai napo."*

**Template**:

```
left = 0
for right in 0 .. n-1:
    state mein nums[right] JODO
    while (window INVALID):                     # ⚠️ while (if nahi!) — ek se zyada baar hatana pad sakta hai
        state se nums[left] HATAO
        left++
    answer = max(answer, right - left + 1)      # yahan window VALID hai → ab napo
```

### Example 3 — Longest Substring Without Repeating Characters

`s = "abcabcbb"` → **INVALID** = koi letter window mein **2 baar** hai.

```
STATE = count[128]      JODO = count[s[right]]++      SHART (invalid) = count[s[right]] > 1      HATAO = count[s[left]]--, left++

right  akshar   window (shrink ke baad)   length   best
  0      a        "a"                       1       1
  1      b        "ab"                      2       2
  2      c        "abc"                     3       3
  3      a        a dobara! left se hatao → "bca"   3       3
  4      b        b dobara! → "cab"                 3       3
  5      c        c dobara! → "abc"                 3       3
  6      b        b dobara! a hatao, phir b hatao → "cb"    2       3
  7      b        b dobara! c hatao, phir b hatao → "b"     1       3

answer = 3
```

```java
public int lengthOfLongestSubstring(String s) {
    int[] count = new int[128];                       // STATE: window mein har letter kitni baar
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        count[s.charAt(right)]++;                      // JODO
        while (count[s.charAt(right)] > 1) {           // 🔑 INVALID: ye letter window mein 2 baar → left se hatao
            count[s.charAt(left)]--;                   // HATAO
            left++;
        }
        best = Math.max(best, right - left + 1);       // ab window VALID (koi repeat nahi) → napo
    }
    return best;
}
```

### Example 4 — Max Consecutive Ones III (`k` zeros tak flip kar sakte ho)

`nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2` — **sabse lambi 1s ki line** jisme **zyada se zyada `k` zeros** ho (unhe 1 bana denge).

Yahan sochne wali baat: *"flip"* alag se karne ki zarurat nahi — bas **window mein zeros ki ginti ≤ k** rakhni hai. **INVALID** = `zeros > k`.

```java
public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;                  // JODO: zero aaya toh ginti +1
        while (zeros > k) {                              // 🔑 INVALID: k se zyada zeros
            if (nums[left] == 0) zeros--;                // HATAO: jo nikal raha hai wo zero tha toh ginti −1
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

### Example 5 — Longest Substring with At Most K Distinct Characters

Ye "**at most K distinct**" wala sabse common roop hai (Fruit Into Baskets = `k = 2`). State = **HashMap (letter → ginti)**, **INVALID** = `map.size() > k`.

```java
public int longestAtMostKDistinct(String s, int k) {
    Map<Character, Integer> count = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        count.merge(s.charAt(right), 1, Integer::sum);         // JODO
        while (count.size() > k) {                              // 🔑 INVALID: k se zyada alag-alag letters
            char out = s.charAt(left);
            if (count.merge(out, -1, Integer::sum) == 0) {      // HATAO
                count.remove(out);                              // ⚠️ ginti 0 hui toh key HI hata do, warna size() galat rahegi
            }
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

---

## 6. TYPE ③ — Variable Size, **SHORTEST** (min length)

**Idea**: *"Window ko tab tak badhao jab tak **ban na jaye** (valid). Ban gayi toh **jitna chhota kar sako karo** — har baar answer note karte hue."*

**Template**:

```
left = 0
for right in 0 .. n-1:
    state mein nums[right] JODO
    while (window VALID):                        # ban gayi
        answer = min(answer, right - left + 1)   # ⭐ PEHLE answer note karo (window valid hai)
        state se nums[left] HATAO
        left++                                   # ab chhota karke dekho — shayad ab bhi valid ho
```

### Example 6 — Minimum Size Subarray Sum (sum ≥ target, sab numbers positive)

`target = 7, nums = [2,3,1,2,4,3]`

```
STATE = sum      JODO = sum += nums[right]      SHART (valid) = sum ≥ target      HATAO = sum -= nums[left]

right=0..2 : sum = 2, 5, 6           (abhi < 7)
right=3    : sum = 8 ≥ 7 ✅ valid → len 4 note; left hatao (−2) → sum 6, valid nahi → ruko
right=4    : sum = 10 ≥ 7 ✅ → len 4 ([3,1,2,4]); −3 → 7 ≥ 7 ✅ → len 3 ([1,2,4]); −1 → 6 → ruko
right=5    : sum = 9 ≥ 7 ✅ → len 3; −2 → 7 ✅ → len 2 ([4,3]) ⭐; −4 → 3 → ruko

answer = 2
```

```java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];                               // JODO
        while (sum >= target) {                           // 🔑 window VALID hai → chhota karke dekho
            best = Math.min(best, right - left + 1);      // PEHLE answer
            sum -= nums[left];                            // HATAO
            left++;
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;          // kabhi valid hui hi nahi → 0
}
```

> ⚠️ Ye tabhi chalta hai jab **numbers positive** hon (tabhi "element hatao → sum ghatega" pakka hai). Negative hon toh upar ka ❌ section dekho.

### Example 7 — Minimum Window Substring (Hard, sabse famous)

`s = "ADOBECODEBANC", t = "ABC"` — `s` ka **sabse chhota hissa jisme `t` ke saare letters (ginti ke saath) ho**. Answer: `"BANC"`.

**State**: `need[c]` = `t` mein `c` kitne chahiye; **`missing`** = `t` ke kitne letters abhi bhi window mein **kam** hain. **VALID** = `missing == 0`.

```
JODO  : need[c]--       (c window mein aaya)      agar pehle need[c] > 0 tha → ek zaroori letter mila → missing--
HATAO : need[c]++       (c window se gaya)        agar ab need[c] > 0 hua → ek zaroori letter khoya    → missing++
(zaroorat se zyada letters ke liye need[c] NEGATIVE ho jata hai — wo "extra" hain, unse missing nahi badhta)

s = A D O B E C O D E B A N C        t = A B C     need = {A:1, B:1, C:1}, missing = 3

right=5 (C): window "ADOBEC"  → A, B, C sab mil gaye, missing = 0 ✅ valid → len 6; left hatao...
             A hatao → missing = 1 → ruko
...
right=12 (C): window "BANC"   valid, len 4   ← sabse chhota ✅
```

```java
public String minWindow(String s, String t) {
    int[] need = new int[128];
    for (char c : t.toCharArray()) need[c]++;
    int missing = t.length();                            // abhi t ke kitne letters aur chahiye
    int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;

    for (int right = 0; right < s.length(); right++) {
        if (need[s.charAt(right)]-- > 0) missing--;       // JODO: zaroori letter mila toh missing kam
        while (missing == 0) {                            // 🔑 window VALID
            if (right - left + 1 < bestLen) {             // PEHLE answer
                bestLen = right - left + 1;
                bestStart = left;
            }
            if (++need[s.charAt(left)] > 0) missing++;    // HATAO: nikalne wala zaroori tha toh missing wapas badha
            left++;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}
```

---

## 7. Longest vs Shortest — code mein SIRF ek jagah ka farak

```
LONGEST  (max):   while (INVALID) { shrink }          answer update  ← while ke BAAD    (window valid hai)
SHORTEST (min):   while (VALID)   { answer update;  shrink }         ← while ke ANDAR    (valid rehte hue chhota karo)
```

**Yaad rakhne ka trick**: *"Longest mein bigadne pe theek karo, shortest mein banne pe ghatao."*

## 8. Bonus — Subarrays ki GINTI: `atMost(K)` trick

**Problem**: **Kitne subarrays** mein **exactly `K`** odd numbers hain? (Count Number of Nice Subarrays)

**Trick**: *"Exactly K"* seedha window se mushkil hai. Par **"at most K"** (`≤ K`) monotonic hai — window se aasan! Toh:

```
exactly(K)  =  atMost(K)  −  atMost(K − 1)
```

**Aur "at most" mein ginti kaise?** Har `right` ke liye, `left` se `right` tak ke **saare subarrays jo `right` pe khatam hote hain valid hain** — unki sankhya = **`right − left + 1`**.

```
nums = [1, 1, 2, 1, 1],   K = 3 odd numbers

atMost(3):  har right pe (right − left + 1) jodo  →  1 + 2 + 3 + 4 + 4  = 14
atMost(2):                                          1 + 2 + 3 + 3 + 3  = 12

exactly(3) = 14 − 12 = 2  ✅    (subarrays: [1,1,2,1] aur [1,2,1,1])
```

```java
public int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);         // exactly K = atMost(K) − atMost(K − 1)
}

private int atMost(int[] nums, int k) {
    if (k < 0) return 0;
    int left = 0, odd = 0, count = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) odd++;                   // JODO
        while (odd > k) {                                   // INVALID: k se zyada odd
            if (nums[left] % 2 == 1) odd--;                 // HATAO
            left++;
        }
        count += right - left + 1;                          // 🔑 right pe khatam hone wale saare valid subarrays
    }
    return count;
}
```

---

## 9. Sab ek nazar mein — 4 sawaal har problem ke liye

| Problem | Type | STATE | JODO | SHART | HATAO |
|---|---|---|---|---|---|
| Max Average Subarray | Fixed | `sum` | `sum += r` | `right ≥ k−1` (poori window) | `sum −= [r−k]` |
| Find All Anagrams | Fixed | `have[26]` | `have[r]++` | `have == need` | `have[r−k]--` |
| Longest No-Repeat | Longest | `count[128]` | `count[r]++` | `count[r] > 1` (INVALID) | `count[l]--` |
| Max Consecutive Ones III | Longest | `zeros` | zero ho toh `zeros++` | `zeros > k` (INVALID) | zero tha toh `zeros--` |
| At Most K Distinct | Longest | `HashMap` | `map[r]++` | `map.size() > k` (INVALID) | `map[l]--` (0 → key hata) |
| Min Size Subarray Sum | Shortest | `sum` | `sum += r` | `sum ≥ target` (VALID) | `sum −= l` |
| Min Window Substring | Shortest | `need[]`, `missing` | `need[r]--` | `missing == 0` (VALID) | `need[l]++` |
| Nice Subarrays | Count | `odd` | odd ho toh `odd++` | `odd > k` (INVALID) | odd tha toh `odd--` |

## Common galtiyan

- **`while` ki jagah `if`** (variable window mein) — ek nayi entry ke baad **kai baar** left hatana pad sakta hai. Hamesha `while`.
- **Answer galat jagah update karna** — Longest mein `while` ke **baad**, Shortest mein `while` ke **andar**.
- **Fixed window mein `right >= k − 1` check bhoolna** — window poori banne se pehle hi answer update ho jata hai.
- **Window ki lambai `right − left + 1`** hai (`+1` mat bhoolo, ye off-by-one sabse common hai).
- **`HashMap` mein ginti 0 hone pe key na hatana** — `map.size()` galat aata hai (distinct ginne wale sawaalon mein).
- **Negative numbers mein sum wale sawaal pe sliding window** lagana — [Prefix Sum + HashMap](07-prefix-sum.md) lo.
- **Kuch kabhi valid hi na ho** (Shortest mein) — `best` ko `MAX_VALUE` se shuru karke end mein check karo (`0` / `""` return).

> 💡 **Interview mein bolne wali line**: *"Ye contiguous subarray ka sawaal hai aur brute force O(n²) hoga. Main sliding window use karunga — `right` se naya element jodunga aur jab window invalid ho jaye toh `left` se tab tak hataunga jab tak valid na ho. Har element ek baar andar aur ek baar bahar aata hai, isliye time O(n), space state ke hisaab se O(1) ya O(k)."*

## Practice — kam se kam 5 LeetCode problems (type ke hisaab se, easy se hard)

| # | Problem | Type | Difficulty | Link |
|---|---|---|---|---|
| 1 | Maximum Average Subarray I | ① Fixed | Easy | [leetcode.com/problems/maximum-average-subarray-i](https://leetcode.com/problems/maximum-average-subarray-i/) |
| 2 | Find All Anagrams in a String | ① Fixed | Medium | [leetcode.com/problems/find-all-anagrams-in-a-string](https://leetcode.com/problems/find-all-anagrams-in-a-string/) |
| 3 | Permutation in String | ① Fixed | Medium | [leetcode.com/problems/permutation-in-string](https://leetcode.com/problems/permutation-in-string/) |
| 4 | Sliding Window Maximum | ① Fixed (monotonic deque) | Hard | [leetcode.com/problems/sliding-window-maximum](https://leetcode.com/problems/sliding-window-maximum/) |
| 5 | Longest Substring Without Repeating Characters | ② Longest | Medium | [leetcode.com/problems/longest-substring-without-repeating-characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| 6 | Max Consecutive Ones III | ② Longest | Medium | [leetcode.com/problems/max-consecutive-ones-iii](https://leetcode.com/problems/max-consecutive-ones-iii/) |
| 7 | Fruit Into Baskets | ② Longest (at most 2 distinct) | Medium | [leetcode.com/problems/fruit-into-baskets](https://leetcode.com/problems/fruit-into-baskets/) |
| 8 | Longest Repeating Character Replacement | ② Longest (maxFreq trick) | Medium | [leetcode.com/problems/longest-repeating-character-replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) |
| 9 | Minimum Size Subarray Sum | ③ Shortest | Medium | [leetcode.com/problems/minimum-size-subarray-sum](https://leetcode.com/problems/minimum-size-subarray-sum/) |
| 10 | Minimum Window Substring | ③ Shortest | Hard | [leetcode.com/problems/minimum-window-substring](https://leetcode.com/problems/minimum-window-substring/) |
| 11 | Count Number of Nice Subarrays | ④ Count (atMost) | Medium | [leetcode.com/problems/count-number-of-nice-subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/) |
| 12 | Subarray Product Less Than K | ④ Count | Medium | [leetcode.com/problems/subarray-product-less-than-k](https://leetcode.com/problems/subarray-product-less-than-k/) |
| 13 | Subarrays with K Different Integers | ④ Count (atMost) | Hard | [leetcode.com/problems/subarrays-with-k-different-integers](https://leetcode.com/problems/subarrays-with-k-different-integers/) |

**Kaise practice karein**: Har problem padhte hi pehle likho — *"Fixed hai ya Variable? Longest hai ya Shortest? STATE kya, JODO kya, SHART kya, HATAO kya?"* — phir hi code likho.

Agla: [02-two-pointers.md](02-two-pointers.md)
