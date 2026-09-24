# 8. Bit Manipulation

> Pehle ye aane chahiye: [Bit Manipulation (basics)](../00-syllabus/01-basics/06-bit-manipulation.md), [Math for DSA](../00-syllabus/01-basics/05-math-basics.md)

> **Standard definition**: Using bitwise operators (AND `&`, OR `|`, XOR `^`, shifts `<<`/`>>`) to solve problems at the binary-representation level, often achieving O(1) space and faster constant-time operations.

**Ek line mein**: Numbers ko unke **binary bits** ke level pe dekho — kai problems (akela number, subsets, power-of-2, bina `+` ke jodna) **bina extra space** ke, bit tricks se solve ho jati hain.

**Trick yaad rakhne ki (sabse important — XOR)**: *"XOR = jodi ko cancel karne wala"* — `a ^ a = 0` aur `a ^ 0 = a`. Agar list mein **sab numbers pair mein hain, ek akela**, sabko XOR kar do: pairs **gayab**, akela **bach jata hai**.

```
4 ^ 1 ^ 2 ^ 1 ^ 2   =   4 ^ (1^1) ^ (2^2)   =   4 ^ 0 ^ 0   =   4  ✅
```

---

## 1. Kab use karo — kaise PEHCHANO

| Sawaal ki bhasha | Variation |
|---|---|
| "sab **pair mein**, ek **akela** / ek **missing** / ek **extra letter**", "do akele" | ① **XOR cancel** |
| "kitne **1 bits**", "**power of two / four**", "kitne bits alag (Hamming)" | ② **Count / check bits** |
| "**saare subsets** (n ≤ 20)", "kisi mask ke saare **submasks**" | ③ **Bitmask** |
| "har number **3 baar**, ek **akela**", "**saari jodiyon** ka Hamming distance" | ④ **Bit-by-bit (har position alag)** |
| "**`+` `−` `/` operator mat use karo**" | ⑤ **Arithmetic bit se** |
| "bits **ulte**", "**range ka AND**" (common prefix) | ⑥ **Reverse / Common prefix** |
| "**do numbers ka maximum XOR**" | ⑦ **Greedy bit-by-bit (prefix set / trie)** |

```
✅ "constant extra space" mangi hai  (HashSet mana)
✅ Numbers ke saath "pairs cancel", "har bit alag", "subset = mask" jaisi baat
✅ n chhota (≤ 20) aur subsets chahiye  →  mask
```

---

## 2. Toolbox — code likhte waqt ye 10 line seedha copy karo

| Kaam | Code | Kaise kaam karta hai |
|---|---|---|
| `i`-th bit **dekho** | `(n >> i) & 1` | i-th bit ko sabse dahine laao, baaki 0 |
| `i`-th bit **ON** | `n \| (1 << i)` | mask `1<<i` se OR |
| `i`-th bit **OFF** | `n & ~(1 << i)` | mask ulta karke AND |
| `i`-th bit **ulta** | `n ^ (1 << i)` | XOR se flip |
| **sabse dahina 1 hatao** | `n & (n - 1)` | `n−1` mein wo 1 → 0, uske daayein 0 → 1 |
| **sabse dahina 1 alag karo** | `n & -n` | (lowbit) sirf wahi bit bachta hai |
| **power of two?** | `n > 0 && (n & (n-1)) == 0` | sirf ek hi 1 bit |
| **k ones ka mask** | `(1 << k) - 1` | jaise `(1<<3)−1 = 0b111` |
| **odd / even** | `n & 1` | last bit |
| **`x * 2ᵏ` / `x / 2ᵏ`** | `x << k` / `x >> k` | shift |

```
n = 12 = 1100
n − 1  = 1011              n & (n − 1) = 1000   ← sabse dahina 1 (bit 2) hat gaya
−n     = 0100 (+ upar ke 1s) n & −n      = 0100   ← sirf sabse dahina 1 bacha (lowbit)
```

**Java ke jaal**: `n & 1 == 0` ✗ (precedence) → `(n & 1) == 0`. `1 << 35` wrap hota hai → bade shifts ke liye `1L << i`. `>>` sign copy karta hai, `>>>` zero bharta hai.

## 3. Code likhne ki recipe — 3 sawaal

```
1. STRUCTURE →  pairs cancel ho rahe hain?  (XOR)     har bit position alag se dekh sakta hoon? (32 loops)
                subsets chahiye n ≤ 20? (mask)        operators mana hain? (XOR + AND-carry)
2. TOOLBOX   →  upar ki table se jo line chahiye wo lo
3. DOUBLE-CHECK → negative numbers? 32 bits? (int mein bit 31 sign hai)
```

---

## 4. ① XOR cancel

### Single Number / Missing Number / Extra Letter

```java
// Sab do-do baar, ek akela
public int singleNumber(int[] nums) {
    int result = 0;
    for (int x : nums) result ^= x;                 // 🔑 pairs cancel, akela bacha
    return result;
}

// 0..n mein se ek missing: index aur value dono XOR — jo dono jagah hai wo cancel
public int missingNumber(int[] nums) {
    int xor = nums.length;                           // n ko pehle le lo (index sirf 0..n-1)
    for (int i = 0; i < nums.length; i++) xor ^= i ^ nums[i];
    return xor;
}

// t = s ka shuffle + ek EXTRA letter → wahi letter
public char findTheDifference(String s, String t) {
    int xor = 0;
    for (char c : s.toCharArray()) xor ^= c;
    for (char c : t.toCharArray()) xor ^= c;         // s ke letter do baar → cancel; extra bacha
    return (char) xor;
}
```

### Do akele numbers (Single Number III) — **lowbit se do group**

Sab XOR karo → `a ^ b` (dono akele ka XOR). Isme **koi bhi 1 bit** wahan hoga jahan `a` aur `b` **alag** hain. **Us bit ke hisaab se numbers ko 2 groups** mein baanto — har group mein ek akela + pairs. Har group ko alag XOR karo!

```
nums = [1, 2, 1, 3, 2, 5]      a ^ b = 3 ^ 5 = 0110 = 6      lowbit (6 & −6) = 0010 (bit 1)

bit 1 OFF wale:  1, 1, 5   → 1^1^5 = 5        bit 1 ON wale:  2, 3, 2  → 2^3^2 = 3       ⇒ {3, 5}  ✅
```

```java
public int[] singleNumberIII(int[] nums) {
    int xor = 0;
    for (int x : nums) xor ^= x;                      // = a ^ b
    int lowbit = xor & -xor;                           // 🔑 sabse dahina 1 — yahan a aur b ALAG hain
    int a = 0, b = 0;
    for (int x : nums) {
        if ((x & lowbit) == 0) a ^= x;                 // group 1: is bit 0 wale
        else b ^= x;                                    // group 2: is bit 1 wale
    }
    return new int[]{a, b};
}
```

---

## 5. ② Count / Check bits

```java
// Kitne 1 bits (Brian Kernighan — jitne 1, utne hi loop)
public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= n - 1;                                    // 🔑 sabse dahina 1 hatao
        count++;
    }
    return count;
}

// Hamming distance = x aur y ke kitne bits alag  =  (x ^ y) mein kitne 1
public int hammingDistance(int x, int y) {
    return hammingWeight(x ^ y);
}

// 0..n sab ke bits ki ginti — DP: i ke bits = (i/2 ke bits) + last bit
public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}

public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;                 // sirf ek hi 1 bit
}

// Power of four: power of two + wo ek 1 bit EVEN position pe (mask 0x55555555 = 0101...01)
public boolean isPowerOfFour(int n) {
    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;
}
```

---

## 6. ③ Bitmask (subsets)

**Idea**: `n` items ke **har subset = ek `n`-bit number**. Bit `i` ON = item `i` chuna gaya. Saare subsets = `mask` ko `0` se `2ⁿ − 1` tak chalao.

```
nums = [a, b, c]     mask (c b a) →  subset
                        0 0 0     →  { }
                        0 1 1     →  { a, b }
                        1 0 1     →  { a, c }
                        1 1 1     →  { a, b, c }
```

```java
public List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {          // 0 se 2ⁿ − 1
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (((mask >> i) & 1) == 1) subset.add(nums[i]);   // i-th bit ON → nums[i] chuna
        }
        result.add(subset);
    }
    return result;
}

// Kisi mask ke SAARE submasks (mask ke ON bits ke andar-andar ke subsets) — sirf 2^(ON bits) baar
public List<Integer> submasks(int mask) {
    List<Integer> out = new ArrayList<>();
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {   // 🔑 (sub − 1) & mask = agla chhota submask
        out.add(sub);
    }
    out.add(0);                                                // khaali submask
    return out;
}
```

`n ≤ 20` ke sawaal (subsets, "har item ya toh is group ya us group") aksar mask se hi hote hain; iska DP roop: [DP Advanced (Bitmask)](../00-syllabus/06-dynamic-programming/27-dp-advanced.md).

---

## 7. ④ Bit-by-bit (har position alag se)

**Idea**: 32 bits ke liye **32 alag chhote sawaal** — *"is position pe kitne numbers mein 1 hai?"* Phir us ginti se jawab banao.

### Single Number II — har number **3 baar**, ek akela

XOR yahan kaam nahi karta (3 baar = cancel nahi). **Har bit position pe 1 ki ginti karo** — jin numbers 3 baar aaye unka bit **3 ka multiple** dega; jo bit **3 ka multiple nahi**, wo akele number ka hai.

```
nums = [2, 2, 3, 2]       (2 = 010, 3 = 011)

bit 0: 1s = 1 (sirf 3)       1 % 3 ≠ 0  → akele ka bit 0 = 1
bit 1: 1s = 4 (2,2,3,2)      4 % 3 = 1 ≠ 0 → akele ka bit 1 = 1          ⇒  result = 011 = 3 ✅
```

```java
public int singleNumberII(int[] nums) {
    int result = 0;
    for (int bit = 0; bit < 32; bit++) {
        int count = 0;
        for (int x : nums) count += (x >> bit) & 1;        // is bit pe kitne 1
        if (count % 3 != 0) result |= 1 << bit;             // 🔑 3 ka multiple nahi → akele ka bit ON
    }
    return result;
}
```

### Total Hamming Distance — saari jodiyon ka

Har jodi ko alag dekhna `O(n²)`. **Har bit position pe**: `ones` numbers mein 1 aur `n − ones` mein 0 → **`ones × (n − ones)` jodiyan** is bit pe alag hongi.

```java
public int totalHammingDistance(int[] nums) {
    int total = 0, n = nums.length;
    for (int bit = 0; bit < 32; bit++) {
        int ones = 0;
        for (int x : nums) ones += (x >> bit) & 1;
        total += ones * (n - ones);                          // 🔑 is bit pe (1, 0) wali jodiyan
    }
    return total;
}
```

---

## 8. ⑤ Arithmetic bit se (operator mana hai)

### Sum of Two Integers — `+` ke bina

**Trick (school ka addition)**: `a ^ b` = **carry ke bina sum**, `(a & b) << 1` = **carry**. Carry `0` hone tak dohrao.

```
a = 5 (101), b = 3 (011)

round 1:  a ^ b = 110 (6)      carry = (101 & 011) << 1 = 001 << 1 = 010 (2)      →  a = 6, b = 2
round 2:  a ^ b = 100 (4)      carry = (110 & 010) << 1 = 010 << 1 = 100 (4)      →  a = 4, b = 4
round 3:  a ^ b = 000 (0)      carry = (100 & 100) << 1 = 1000 (8)                →  a = 0, b = 8
round 4:  a ^ b = 1000 (8)     carry = 0                                           →  DONE = 8 ✅
```

```java
public int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;                            // jahan dono 1 → carry agle bit pe
        a = a ^ b;                                            // carry ke bina sum
        b = carry;                                            // carry ko dobara jodo
    }
    return a;
}
```

### Divide Two Integers — shift + subtract

`a / b` = **`b` ko `2ˢʰⁱᶠᵗ` se guna karke `a` se ghatate jao** (bade shift se pehle) — binary long division.

```java
public int divide(int dividend, int divisor) {
    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;   // overflow ka ek hi case
    long a = Math.abs((long) dividend), b = Math.abs((long) divisor);                 // long: abs(MIN_VALUE) int mein nahi aata
    int result = 0;
    for (int shift = 31; shift >= 0; shift--) {
        if ((a >> shift) >= b) {                              // 🔑 b × 2^shift, a mein fit hota hai
            a -= b << shift;
            result += 1 << shift;
        }
    }
    return (dividend > 0) == (divisor > 0) ? result : -result;
}
```

---

## 9. ⑥ Reverse aur Common Prefix

```java
// Bits ulte karo (32-bit)
public int reverseBits(int n) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);                    // n ka last bit result ke last mein
        n >>>= 1;                                             // >>> (unsigned) — negative n pe bhi sahi
    }
    return result;
}

// Range [left, right] ka bitwise AND = un dono ka COMMON PREFIX (baaki bits beech mein kahin 0 ho jate hain)
public int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left != right) {                                   // jab tak alag hain, dono ko daayein khiskao
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;                                     // common prefix wapas apni jagah
}
```

```
left = 5 (101), right = 7 (111)      alag hain → shift: 10 & 11 → alag → shift: 1 & 1 → SAME (shift = 2)   →  1 << 2 = 100 = 4 ✅
```

---

## 10. ⑦ Maximum XOR — bit-by-bit greedy

**Idea**: Answer ko **upar ke bit se** banao. Har bit ke liye **koshish karo ki wo bit 1 ho jaye**: `candidate = max | (1 << bit)`. Kya **do numbers** hain jinke (upar ke bits tak ke) prefix ka XOR `candidate` hai? `a ^ b = candidate ⇒ b = a ^ candidate` — **HashSet mein dhoondho.**

```java
public int findMaximumXOR(int[] nums) {
    int max = 0, mask = 0;
    for (int bit = 30; bit >= 0; bit--) {
        mask |= 1 << bit;                                     // ab tak ke upar ke bits tak dekhna hai
        Set<Integer> prefixes = new HashSet<>();
        for (int x : nums) prefixes.add(x & mask);            // har number ka prefix
        int candidate = max | (1 << bit);                     // is bit ko 1 karne ki koshish
        for (int p : prefixes) {
            if (prefixes.contains(p ^ candidate)) {            // 🔑 a ^ b = candidate → b = a ^ candidate
                max = candidate;
                break;
            }
        }
    }
    return max;
}
```

(Doosra tarika: **Binary Trie** — [Trie note](18-trie.md) / [Trie topic](../00-syllabus/03-trees-and-heaps/16-trie.md).)

---

## 11. Sab ek nazar mein

| Variation | Core idea | Ek line |
|---|---|---|
| ① Single / Missing | XOR sab | `result ^= x` |
| ① Do akele | XOR + **lowbit** se do group | `xor & -xor` |
| ② Count bits | Kernighan | `n &= n − 1` |
| ② Power of two | ek hi 1 bit | `(n & (n−1)) == 0` |
| ③ Subsets | mask `0..2ⁿ−1` | `(mask >> i) & 1` |
| ③ Submasks | `(sub − 1) & mask` | — |
| ④ 3 baar wala | har bit ki ginti `% 3` | `count % 3 != 0` |
| ④ Total Hamming | har bit `ones × (n − ones)` | — |
| ⑤ Sum bina `+` | XOR + AND-carry loop | `a ^ b`, `(a & b) << 1` |
| ⑤ Divide | shift + subtract | `(a >> s) >= b` |
| ⑥ AND of range | common prefix | dono ko shift jab tak barabar |
| ⑦ Max XOR | greedy bit + prefix set | `p ^ candidate` |

## Common galtiyan

- **Precedence** — `n & 1 == 0` ✗. Hamesha bracket: `(n & 1) == 0`.
- **`1 << i` (`i ≥ 31`)** — int mein wrap. `1L << i`.
- **Negative numbers pe `>>`** — sign bit copy hota hai; unsigned chahiye toh **`>>>`**.
- **`abs(Integer.MIN_VALUE)`** negative hi rehta hai — `long` mein badlo (Divide Two Integers).
- **XOR-swap same index pe** — value `0` ho jati hai.
- **Single Number II mein XOR lagana** — 3 baar ke liye kaam nahi karta; bit-count `% 3`.
- **Kernighan loop `n != 0` ki jagah `n > 0`** — negative `n` pe atak jata hai.

> 💡 **Interview mein bolne wali line**: *"HashSet O(n) space lagta. XOR se pairs cancel ho jaate hain, akela number bachta hai — O(n) time, O(1) space. Do akele hon toh unke XOR ka koi ek set bit lekar numbers ko do groups mein baant dunga."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Single Number | ① XOR | Easy | [leetcode.com/problems/single-number](https://leetcode.com/problems/single-number/) |
| 2 | Missing Number | ① XOR | Easy | [leetcode.com/problems/missing-number](https://leetcode.com/problems/missing-number/) |
| 3 | Find the Difference | ① XOR | Easy | [leetcode.com/problems/find-the-difference](https://leetcode.com/problems/find-the-difference/) |
| 4 | Number of 1 Bits | ② Count | Easy | [leetcode.com/problems/number-of-1-bits](https://leetcode.com/problems/number-of-1-bits/) |
| 5 | Counting Bits | ② Count (DP) | Easy | [leetcode.com/problems/counting-bits](https://leetcode.com/problems/counting-bits/) |
| 6 | Power of Two | ② Check | Easy | [leetcode.com/problems/power-of-two](https://leetcode.com/problems/power-of-two/) |
| 7 | Hamming Distance | ② XOR + count | Easy | [leetcode.com/problems/hamming-distance](https://leetcode.com/problems/hamming-distance/) |
| 8 | Reverse Bits | ⑥ Reverse | Easy | [leetcode.com/problems/reverse-bits](https://leetcode.com/problems/reverse-bits/) |
| 9 | Sum of All Subset XOR Totals | ③ Mask | Easy | [leetcode.com/problems/sum-of-all-subset-xor-totals](https://leetcode.com/problems/sum-of-all-subset-xor-totals/) |
| 10 | Subsets | ③ Mask | Medium | [leetcode.com/problems/subsets](https://leetcode.com/problems/subsets/) |
| 11 | Single Number II | ④ Bit-by-bit | Medium | [leetcode.com/problems/single-number-ii](https://leetcode.com/problems/single-number-ii/) |
| 12 | Single Number III | ① Lowbit split | Medium | [leetcode.com/problems/single-number-iii](https://leetcode.com/problems/single-number-iii/) |
| 13 | Total Hamming Distance | ④ Bit-by-bit | Medium | [leetcode.com/problems/total-hamming-distance](https://leetcode.com/problems/total-hamming-distance/) |
| 14 | Sum of Two Integers | ⑤ Arithmetic | Medium | [leetcode.com/problems/sum-of-two-integers](https://leetcode.com/problems/sum-of-two-integers/) |
| 15 | Bitwise AND of Numbers Range | ⑥ Common prefix | Medium | [leetcode.com/problems/bitwise-and-of-numbers-range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) |
| 16 | Divide Two Integers | ⑤ Arithmetic | Medium | [leetcode.com/problems/divide-two-integers](https://leetcode.com/problems/divide-two-integers/) |
| 17 | Maximum XOR of Two Numbers in an Array | ⑦ Greedy bits | Medium | [leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Pairs cancel? Har bit alag? Subset mask? Operator mana? — kaunsi variation?"* — phir toolbox se line uthao.

Agla: [09-binary-search.md](09-binary-search.md)
