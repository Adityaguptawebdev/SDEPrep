# 6. Bit Manipulation

> 📍 **Syllabus**: Unit 1 — Basics · Topic 6 / 29 · Pehle chahiye: [Math for DSA](05-math-basics.md)

> **Standard definition**: The technique of operating directly on the binary representation of integers using bitwise operators (AND, OR, XOR, NOT and shifts) to solve problems in constant time and with minimal extra memory.

**Ek line mein**: Har number andar se **0 aur 1 ke switches** ki ek line hai — un switches ko seedha **on/off/ulta** karke kaam bahut tezi se ho jata hai.

**Trick yaad rakhne ki**: *"Bijli ka switch board"* — har bit ek switch hai (ON = 1, OFF = 0):
- **AND `&`** = *series circuit* — **dono** switch ON hon tabhi bulb jalega.
- **OR `|`** = *parallel circuit* — **koi ek bhi** ON ho toh bulb jalega.
- **XOR `^`** = *seedhi ke upar-neeche wale do switch* (2-way switch) — **dono alag position** mein hon tabhi light ON.
- **NOT `~`** = *saare switches ulte* kar do.

**Kab use karo**: **Akela number dhoondhna** (XOR), **power of two**, **set bits ginna**, **subsets banana** (bitmask), ya jab **O(1) extra space** maangi ho.

## Number = switches ki line

```
5  =  0 1 0 1        ← 32 switches mein se sirf last 4 dikhaye
      │ │ │ └─ bit 0  (1 ka ghar)
      │ │ └─── bit 1  (2 ka ghar)
      │ └───── bit 2  (4 ka ghar)
      └─────── bit 3  (8 ka ghar)

5 = 4 + 1 = (bit 2 ON) + (bit 0 ON)
```

## Operators ka table (a = 5 = `0101`, b = 3 = `0011`)

| Operator | Naam | Kaise kaam karta hai | Result |
|---|---|---|---|
| `a & b` | AND | Dono 1 → 1 | `0001` = **1** |
| `a \| b` | OR | Koi ek 1 → 1 | `0111` = **7** |
| `a ^ b` | XOR | Dono **alag** → 1 | `0110` = **6** |
| `~a` | NOT | Har bit ulta | `-6` (two's complement) |
| `a << 1` | Left shift | Sab bit **baayein** khiske = **×2** | `1010` = **10** |
| `a >> 1` | Right shift | Sab bit **daayein** khiske = **÷2** | `0010` = **2** |
| `a >>> 1` | Unsigned right shift | Khaali jagah pe **0** aata hai (sign nahi) | (negative pe farq dikhta hai) |

```java
public void bitOperators() {
    int a = 5;    // 0101
    int b = 3;    // 0011
    System.out.println(a & b);       // 1   dono ON hon toh
    System.out.println(a | b);       // 7   koi ek ON ho toh
    System.out.println(a ^ b);       // 6   dono alag hon toh
    System.out.println(~a);          // -6  har switch ulta
    System.out.println(a << 1);      // 10  ×2
    System.out.println(a >> 1);      // 2   ÷2
    System.out.println(-8 >>> 28);   // 15  sign bit ki jagah 0 aata hai (>> hota toh -1 aata)
    System.out.println((a & 1) == 0 ? "even" : "odd");   // 🔑 last bit hi batata hai even/odd
}
```

## 4 kaam jo har bit-problem mein aate hain — "mask" ka trick

**Trick**: `1 << i` ek aisa number banata hai jisme **sirf i-th switch ON** hai. Isse (mask) se kisi bhi bit ko chhed sakte ho.

```
mask = 1 << i     (sirf i-th bit ON)

n = 1010 (10),  i = 1  →  mask = 0010
   check  :  n & mask   = 0010  ≠ 0   → bit ON hai
   clear  :  n & ~mask  = 1000        → bit OFF ho gaya
   toggle :  n ^ mask   = 1000        → ulta ho gaya

n = 1010 (10),  i = 2  →  mask = 0100
   set    :  n | mask   = 1110        → bit ON ho gaya
```

```java
public boolean isBitSet(int n, int i) { return ((n >> i) & 1) == 1; }   // i-th bit ON hai kya?
public int setBit(int n, int i)       { return n | (1 << i); }          // ON karo
public int clearBit(int n, int i)     { return n & ~(1 << i); }         // OFF karo
public int toggleBit(int n, int i)    { return n ^ (1 << i); }          // ulta karo
```

## Sabse famous trick — `n & (n − 1)`

**Ye sabse dahine wala `1` bit hata deta hai.** Kyun? `n − 1` karne pe sabse dahina `1` → `0` ho jata hai aur uske daayein ke saare `0` → `1` ho jate hain. AND karte hi wo hissa saaf.

```
n     = 1 1 0 0   (12)
n − 1 = 1 0 1 1   (11)
        ─────────
AND   = 1 0 0 0   (8)     ← dahine wala '1' (bit 2) gayab ✅
```

Isse 2 badhiya cheezein milti hain:

```java
// Power of two mein sirf EK bit ON hota hai — n & (n-1) usse hata de toh 0 bachega
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

// Brian Kernighan: jitne '1' bits hain, utne hi baar loop (32 baar nahi)
public int countSetBits(int n) {
    int count = 0;
    while (n != 0) {
        n = n & (n - 1);      // 🔑 ek '1' bit kam
        count++;
    }
    return count;
}
```

## XOR ke 3 golden rules

```
a ^ a = 0        (same cheez khud se cancel)
a ^ 0 = a        (0 se kuch nahi badalta)
a ^ b ^ a = b    (order matter nahi karta — sab commutative hai)
```

**Trick**: *"XOR = jodi ko cancel karne wala"* — do-do baar aane wale numbers **gayab** ho jate hain, akela wala bach jata hai.

```
[4, 1, 2, 1, 2]  →  4 ^ 1 ^ 2 ^ 1 ^ 2  =  4 ^ (1^1) ^ (2^2)  =  4 ^ 0 ^ 0  =  4 ✅
```

```java
// Single Number — sab do-do baar hain, ek akela: O(n) time, O(1) space
public int singleNumber(int[] nums) {
    int result = 0;
    for (int x : nums) result ^= x;    // 🔑 jodi wale cancel, akela bacha
    return result;
}

// Missing Number — 0..n mein se ek gayab. Index aur value dono XOR kar do
public int missingNumber(int[] nums) {
    int xor = nums.length;             // n ko pehle le lo (loop mein index sirf 0..n-1 aata hai)
    for (int i = 0; i < nums.length; i++) {
        xor ^= i ^ nums[i];            // jo number index mein bhi hai aur value mein bhi, cancel
    }
    return xor;                        // bacha wahi jo gayab tha
}

// Bina temp ke swap
public void swapXor(int[] arr, int i, int j) {
    if (i == j) return;                // 🔑 same jagah pe XOR-swap karoge toh value 0 ho jayegi
    arr[i] ^= arr[j];
    arr[j] ^= arr[i];
    arr[i] ^= arr[j];
}
```

## Bitmask — ek number mein poora "subset" chhupana

**Trick**: *"Shaadi ki guest list ka tick-box"* — `n` mehmaanon mein se kaun aayega, ye ek `n`-bit number mein likh do (bit ON = aayega). Saare `2ⁿ` number = saare `2ⁿ` subsets!

```
nums = [a, b, c]        bit 0 ↔ a,  bit 1 ↔ b,  bit 2 ↔ c

mask (c b a)  →  subset
   0 0 0      →  { }
   0 0 1      →  { a }
   0 1 0      →  { b }
   0 1 1      →  { a, b }
   1 0 0      →  { c }
   1 0 1      →  { a, c }
   1 1 0      →  { b, c }
   1 1 1      →  { a, b, c }
```

```java
public List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {          // 🔑 0 se 2ⁿ − 1 tak saare masks
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (((mask >> i) & 1) == 1) subset.add(nums[i]);   // i-th bit ON ⇒ nums[i] is subset mein
        }
        result.add(subset);
    }
    return result;
}
```

Ye tarika `n ≤ 20` tak chalta hai (2²⁰ ≈ 10 lakh masks). Bitmask ka **DP** mein use [DP Advanced](../06-dynamic-programming/27-dp-advanced.md) mein aayega.

## Java ke ready-made bit methods

| Method | Kya karta hai |
|---|---|
| `Integer.bitCount(n)` | Kitne `1` bits |
| `Integer.toBinaryString(n)` | Binary string (`"101"`) |
| `Integer.parseInt("101", 2)` | Binary string → number (5) |
| `Integer.highestOneBit(n)` | Sabse bade `1` bit ki value |
| `Integer.numberOfTrailingZeros(n)` | Dahine taraf ke `0` kitne |
| `Long.bitCount(x)` | `long` ke liye same |

## Common galtiyan

- **Precedence**: `n & 1 == 0` galat hai (`==` pehle chalta hai). Hamesha bracket: `(n & 1) == 0`.
- **32+ bits**: `1 << 35` Java mein wrap ho jata hai. Bade shifts ke liye `1L << i` (long) lo.
- **`>>` vs `>>>`**: negative number pe `>>` sign bit copy karta hai, `>>>` `0` bharta hai.
- **`~n` ka matlab `-n - 1`** hota hai (two's complement), "bas bits ulte" nahi dikhta.
- **XOR-swap same index pe** value `0` kar deta hai.

> 💡 **Interview mein bolne wali line**: *"Extra HashSet ki jagah main XOR use kar sakta hoon — jodi wale cancel ho jayenge aur akela number bachega, O(n) time aur O(1) space mein."*

## Practice — basic se advance

Zyada practice ke liye [Bit Manipulation pattern](../../01-patterns/08-bit-manipulation.md) bhi dekho.

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Number of 1 Bits | Easy | `n & (n-1)` | [leetcode.com/problems/number-of-1-bits](https://leetcode.com/problems/number-of-1-bits/) |
| 2 | Power of Two | Easy | Ek hi bit ON | [leetcode.com/problems/power-of-two](https://leetcode.com/problems/power-of-two/) |
| 3 | Single Number | Easy | XOR cancel | [leetcode.com/problems/single-number](https://leetcode.com/problems/single-number/) |
| 4 | Counting Bits | Easy | `dp[i] = dp[i>>1] + (i&1)` | [leetcode.com/problems/counting-bits](https://leetcode.com/problems/counting-bits/) |
| 5 | Reverse Bits | Easy | Bit-by-bit shift | [leetcode.com/problems/reverse-bits](https://leetcode.com/problems/reverse-bits/) |
| 6 | Hamming Distance | Easy | XOR + count bits | [leetcode.com/problems/hamming-distance](https://leetcode.com/problems/hamming-distance/) |
| 7 | Sum of Two Integers | Medium | XOR = sum, AND<<1 = carry | [leetcode.com/problems/sum-of-two-integers](https://leetcode.com/problems/sum-of-two-integers/) |
| 8 | Bitwise AND of Numbers Range | Medium | Common prefix of bits | [leetcode.com/problems/bitwise-and-of-numbers-range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) |
| 9 | Single Number II | Medium | Bit-wise ginti mod 3 | [leetcode.com/problems/single-number-ii](https://leetcode.com/problems/single-number-ii/) |
| 10 | Single Number III | Medium | XOR + bit se do groups | [leetcode.com/problems/single-number-iii](https://leetcode.com/problems/single-number-iii/) |
| 11 | Subsets | Medium | Bitmask se saare subsets | [leetcode.com/problems/subsets](https://leetcode.com/problems/subsets/) |
| 12 | Maximum XOR of Two Numbers in an Array | Medium | Bits + Trie / HashSet | [leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) |

Agla: [07-sorting.md](07-sorting.md)
