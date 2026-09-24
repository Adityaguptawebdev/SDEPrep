# 5. Math for DSA (Modulo, GCD, Primes, Fast Power)

> 📍 **Syllabus**: Unit 1 — Basics · Topic 5 / 29 · Pehle chahiye: [Complexity Analysis](01-complexity-analysis.md)

> **Standard definition**: The set of arithmetic and number-theory techniques commonly needed in algorithm problems — digit manipulation, modular arithmetic, GCD/LCM, primality testing (including the Sieve of Eratosthenes) and fast (binary) exponentiation.

**Ek line mein**: Interview mein school ka maths hi aata hai — bas **efficient tarike se**: `n` baar loop ki jagah `√n` ya `log n` mein kaam khatam karna.

**Trick yaad rakhne ki**: *"Ghadi (clock) ki tarah gol-gol"* — 14:00 baje ko hum "2 PM" bolte hain kyunki **12 ke baad wapas 0 se shuru**. Ye hi **modulo (`%`)** hai: `14 % 12 = 2`. Jab bhi kuch "wapas ghoom ke aata hai" (circular, cycle, remainder, bade answers), modulo yaad karo.

**Kab use karo**: Problem mein **digits, divisibility, prime, GCD, "answer mod 10⁹+7", ya bahut bada power** dikhe.

## Is note mein kya-kya hai (mini map)

```
                      ┌─ digits ka khel     n % 10, n / 10
                      ├─ Modulo (clock)     (a + b) % m,  10⁹+7
Math for DSA  ────────┼─ GCD / LCM          Euclid ka tarika
                      ├─ Prime              √n check  +  Sieve (chhalni)
                      └─ Fast Power         x^n ko O(log n) mein
```

## 1. Digits ka khel — `% 10` aur `/ 10`

```
n = 4 5 3 7
n % 10 = 7    ← last digit nikaalo
n / 10 = 453  ← last digit hata do

Loop: 4537 → 453 → 45 → 4 → 0  (jab tak n > 0)
```

```java
public int sumOfDigits(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;       // 🔑 last digit nikalo
        n /= 10;             // last digit hata do
    }
    return sum;
}

public boolean isPalindromeNumber(int x) {
    if (x < 0) return false;
    long reversed = 0;                       // long: ulta karne pe int overflow ho sakta hai
    int temp = x;
    while (temp > 0) {
        reversed = reversed * 10 + temp % 10;   // digit ko ulte order mein jodo
        temp /= 10;
    }
    return reversed == x;
}
```

## 2. Modulo — bade answers ko chhota rakhna

Jab answer bahut bada ho sakta hai (jaise 50! ya 2¹⁰⁰⁰⁰), toh problem kehti hai **"answer ko 10⁹ + 7 se mod karke do"**. Mod ke 3 rules (sab `+`, `−`, `×` pe chalte hain, `÷` pe nahi):

```
(a + b) % m = ((a % m) + (b % m)) % m
(a × b) % m = ((a % m) × (b % m)) % m
(a − b) % m = ((a % m) − (b % m) + m) % m        ← +m zaroori (negative se bachne ke liye)
```

```java
public void moduloBasics() {
    int m = 1_000_000_007;                      // 🔑 10⁹ + 7 — sabse popular "mod"
    long a = 1_000_000_000L, b = 1_000_000_000L;

    long sum = (a % m + b % m) % m;             // (a + b) % m
    long product = (a % m) * (b % m) % m;       // long zaroori — int mein (10⁹ × 10⁹) overflow ho jayega
    long diff = ((a - b) % m + m) % m;          // 🔑 Java mein negative % negative aata hai: -3 % 5 = -3 (2 nahi!)

    int wrap = Math.floorMod(-3, 5);            // 2 → floorMod hamesha 0..m-1 deta hai
}
```

## 3. GCD aur LCM — Euclid ka tarika

**GCD** = do numbers ko **poora bhaagne wala sabse bada number**. **Trick**: *"Bade ko chhote se kaato, jo bacha wo chhote ke saath repeat karo — jab kuch na bache, wahi answer."*

```
gcd(48, 18):
   48 = 2 × 18 + 12     →  gcd(18, 12)
   18 = 1 × 12 + 6      →  gcd(12, 6)
   12 = 2 × 6  + 0      →  gcd(6, 0) = 6  ✅

LCM(a, b) = a × b / gcd(a, b)
```

```java
public int gcd(int a, int b) {
    while (b != 0) {
        int rem = a % b;
        a = b;
        b = rem;
    }
    return a;
}

public long lcm(int a, int b) {
    return (long) a / gcd(a, b) * b;      // 🔑 PEHLE divide, phir multiply — overflow se bachne ke liye
}
```

Euclid ka loop **O(log(min(a, b)))** mein khatam ho jata hai — bahut tez.

## 4. Prime number — `√n` ka jaadu aur Sieve (chhalni)

**Prime check**: `n` ke factors **jodi** mein aate hain (`i` aur `n / i`). Chhota factor hamesha **√n ya usse chhota** hota hai, isliye sirf `√n` tak check karo — `O(n)` ki jagah `O(√n)`.

**Sieve of Eratosthenes** — *"Aate ki chhalni"*: 2 se shuru karo, uske saare multiples **chhaan do (kaat do)**. Agla jo na kata ho wo prime — uske multiples chhaan do. Jo bache wahi primes.

```
n = 30 tak primes:

2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

Step 1: 2 prime  → 4, 6, 8, 10, 12, ... sab kaato
Step 2: 3 prime  → 9, 15, 21, 27 ... kaato (6, 12... pehle hi kat chuke)
Step 3: 5 prime  → 25 kaato (10, 15, 20... pehle hi kat chuke)
√30 ≈ 5.4 ho gaya → ab kuch naya nahi katega

Bache:  2  3  5  7  11  13  17  19  23  29     ← primes ✅
```

```java
public boolean isPrime(int n) {
    if (n < 2) return false;
    for (long i = 2; i * i <= n; i++) {       // 🔑 sirf √n tak
        if (n % i == 0) return false;
    }
    return true;
}

// Sieve — n se KAM kitne primes hain (O(n log log n))
public int countPrimes(int n) {
    if (n < 3) return 0;
    boolean[] composite = new boolean[n];      // composite[i] = true matlab i kat gaya (prime nahi)
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (!composite[i]) {
            count++;                            // i nahi kata → prime
            for (long j = (long) i * i; j < n; j += i) {    // 🔑 i*i se shuru: usse chhote multiples pehle hi kat chuke hain
                composite[(int) j] = true;
            }
        }
    }
    return count;
}
```

**Line by line samjho**: `j` ko `i * i` se isliye shuru karte hain ki `i × 2, i × 3, ..., i × (i-1)` jaise multiples **chhote primes ne pehle hi kaat diye**. Bahut saare numbers ke primes chahiye toh sieve ek baar chala ke ek array bana lo, phir har number ke liye O(1) mein jawab.

## 5. Fast Power — `x^n` ko `O(log n)` mein

`x^n` ko `n` baar multiply karna **O(n)** hai. Trick: **n ko aadha karte jao, x ko square karte jao**. (`x^10 = (x²)^5`.)

```
3^10 nikaalna hai.   10 binary mein = 1010

exp=10 (1010): last bit 0 → skip           x = 3 → 9        exp = 5
exp=5  (101) : last bit 1 → result = 9     x = 9 → 81       exp = 2
exp=2  (10)  : last bit 0 → skip           x = 81 → 6561    exp = 1
exp=1  (1)   : last bit 1 → result = 9 × 6561 = 59049   ✅  (3^10)

Sirf 4 steps! (10 multiplications ki jagah)
```

```java
public double myPow(double x, int n) {
    long exp = n;                          // 🔑 long: -Integer.MIN_VALUE int mein fit nahi hota
    if (exp < 0) {
        x = 1 / x;                         // x^(-n) = (1/x)^n
        exp = -exp;
    }
    double result = 1;
    while (exp > 0) {
        if ((exp & 1) == 1) result *= x;   // n ka current bit 1 hai toh result mein x jodo
        x *= x;                            // x ko square karo (x, x², x⁴, x⁸ ...)
        exp >>= 1;                         // n ko aadha karo
    }
    return result;
}

// Bade answers ke liye modular version (x^n % m)
public long powMod(long base, long exp, long m) {
    long result = 1;
    base %= m;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % m;
        base = base * base % m;
        exp >>= 1;
    }
    return result;
}
```

## Yaad rakhne wale formulas

```
1 + 2 + 3 + ... + n            =  n × (n + 1) / 2
1 + 2 + 4 + ... + 2^k          =  2^(k+1) − 1
1 se n tak x ke multiples      =  n / x
n! ke trailing zeros           =  n/5 + n/25 + n/125 + ...
```

## Java ke integer wale jaal (traps)

| Trap | Kya hota hai | Bachne ka tarika |
|---|---|---|
| `int` overflow | `Integer.MAX_VALUE + 1` = negative (max ≈ 2.1 × 10⁹) | `long` lo (max ≈ 9.2 × 10¹⁸) |
| Integer division | `7 / 2 = 3`, `-7 / 2 = -3` (zero ki taraf katta hai) | Decimal chahiye toh `7 / 2.0` |
| `Math.abs(Integer.MIN_VALUE)` | Negative hi rehta hai! | `long` mein badlo |
| `1e9` | Ye `double` hai, `int` nahi | `1_000_000_000` likho |
| Negative modulo | `-3 % 5 = -3` | `Math.floorMod(-3, 5)` |
| `i * i <= n` | `i` int ho aur bada ho toh overflow | `long i` lo |

## Kab kaunsa tool

| Hint | Tool |
|---|---|
| Number ke digits pe kaam | `% 10` aur `/ 10` |
| "answer mod 10⁹+7" | Modular arithmetic, har step pe `% m` |
| Divisible, multiples, common factor | GCD / LCM |
| "prime hai kya?" (ek number) | `√n` loop |
| "n tak saare primes" / bahut queries | Sieve |
| `x^n`, bahut bada `n` | Fast power |

> 💡 **Interview mein bolne wali line**: *"Direct loop O(n) hai, par prime check mein main sirf √n tak jaunga kyunki factors jodi mein aate hain — O(√n)."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Fizz Buzz | Easy | `%` ka basic use | [leetcode.com/problems/fizz-buzz](https://leetcode.com/problems/fizz-buzz/) |
| 2 | Palindrome Number | Easy | Digits ulta karna | [leetcode.com/problems/palindrome-number](https://leetcode.com/problems/palindrome-number/) |
| 3 | Plus One | Easy | Carry (digits array) | [leetcode.com/problems/plus-one](https://leetcode.com/problems/plus-one/) |
| 4 | Add Digits | Easy | Digit sum / pattern | [leetcode.com/problems/add-digits](https://leetcode.com/problems/add-digits/) |
| 5 | Ugly Number | Easy | Baar-baar divide | [leetcode.com/problems/ugly-number](https://leetcode.com/problems/ugly-number/) |
| 6 | Greatest Common Divisor of Strings | Easy | GCD ka string version | [leetcode.com/problems/greatest-common-divisor-of-strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) |
| 7 | Reverse Integer | Medium | Overflow handle karna | [leetcode.com/problems/reverse-integer](https://leetcode.com/problems/reverse-integer/) |
| 8 | Count Primes | Medium | Sieve of Eratosthenes | [leetcode.com/problems/count-primes](https://leetcode.com/problems/count-primes/) |
| 9 | Factorial Trailing Zeroes | Medium | Formula: n/5 + n/25 + ... | [leetcode.com/problems/factorial-trailing-zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/) |
| 10 | Pow(x, n) | Medium | Fast power | [leetcode.com/problems/powx-n](https://leetcode.com/problems/powx-n/) |
| 11 | Count Good Numbers | Medium | Fast power + mod | [leetcode.com/problems/count-good-numbers](https://leetcode.com/problems/count-good-numbers/) |
| 12 | Super Pow | Medium | Modular exponent (bade digits) | [leetcode.com/problems/super-pow](https://leetcode.com/problems/super-pow/) |

Agla: [06-bit-manipulation.md](06-bit-manipulation.md)
