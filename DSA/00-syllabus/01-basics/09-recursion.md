# 9. Recursion

> 📍 **Syllabus**: Unit 1 — Basics · Topic 9 / 29 · Pehle chahiye: [Complexity Analysis](01-complexity-analysis.md), [Arrays](02-arrays.md)

> **Standard definition**: A technique in which a function solves a problem by calling itself on smaller instances of the same problem, until it reaches a base case whose answer is known directly; the calls are tracked on the call stack.

**Ek line mein**: Bade problem ko **usi type ke chhote problem** mein todo, chhote ka answer **function khud se maang lo**, aur jab **sabse chhota (base case)** aa jaye toh seedha answer de do.

**Trick yaad rakhne ki**: *"Line mein tumhara number kya hai?"* — Tum line mein khade ho aur tumhe apna number jaanna hai, par tum peeche dekh nahi sakte. Toh tum **aage wale se poochte ho**: *"Tumhara number kya hai?"* Wo apne aage wale se poochta hai... **Sabse aage wala** bolta hai *"Main 1 hoon"* (**base case**). Ab har koi **apne aage wale ke number mein +1** karke peeche batata hai: 2, 3, 4... Tumhe tumhara jawab mil gaya — bina poori line ginye!

**Kab use karo**: Jab problem **khud jaisa chhota problem** ban jaye — **trees, linked list, subsets/permutations, divide & conquer, DP ki shuruaat**. Trees aur Graphs bina recursion ke samajh nahi aate, isliye ye Unit 1 mein hi hai.

## Recursion ke 3 sawaal (har baar puchho)

```
1. Base case     →  Sabse chhota input kaunsa hai jiska answer mujhe seedha pata hai?
2. Chhota problem →  Main problem ko kaise ek CHHOTE (same type) problem mein todun?
3. Combine       →  Chhote ka answer aa gaya (bharosa rakho!) → bade ka answer kaise banega?
```

**Leap of faith**: *"Bas ek level socho"* — maan lo `f(n-1)` sahi answer deta hai, tumhe sirf itna batana hai ki uske saath **kya karke** `f(n)` banega. Baaki recursion sambhal lega.

## Call Stack — recursion andar se kaise chalti hai

`factorial(4)` = 4 × 3 × 2 × 1

```
fact(4)
 └─ 4 × fact(3)
        └─ 3 × fact(2)
               └─ 2 × fact(1)
                      └─ return 1              ← BASE CASE (yahan ruk gaye)
               ┌─ 2 × 1 = 2   wapas
        ┌─ 3 × 2 = 6          wapas
 ┌─ 4 × 6 = 24                wapas → answer ✅

Call stack (plates ka dher — upar wala pehle nikalta hai):

      │ fact(1) │  ← sabse upar, pehle khatam
      │ fact(2) │
      │ fact(3) │
      │ fact(4) │
      └─────────┘
```

**Do phase yaad rakho**: pehle **neeche jaate hue** calls banti hain, phir **wapas aate hue** (unwinding) answers combine hote hain.

## Code example 1 — Basic recursion (3 sawaal lagake)

```java
// n! = n × (n-1)!
public long factorial(int n) {
    if (n <= 1) return 1;                 // 1) BASE CASE
    return n * factorial(n - 1);          // 2) chhota problem (n-1)  3) combine: n se multiply
}

// Digits ka sum: 4537 → 7 + sum(453)
public int sumOfDigits(int n) {
    if (n == 0) return 0;                 // base: koi digit nahi bacha
    return n % 10 + sumOfDigits(n / 10);  // last digit + baaki digits ka sum
}

// x^n — n ko aadha karke: T(n) = T(n/2) + O(1) → O(log n)
public long power(long x, int n) {
    if (n == 0) return 1;                 // base case
    long half = power(x, n / 2);          // 🔑 sirf EK baar call, phir square. (2 baar call karte toh O(n) ho jata)
    return (n % 2 == 0) ? half * half : half * half * x;
}

// Palindrome — bahar ke dono character match karo, andar ka hissa recursion se
public boolean isPalindrome(String s, int left, int right) {
    if (left >= right) return true;                       // base: 0 ya 1 character bacha
    if (s.charAt(left) != s.charAt(right)) return false;
    return isPalindrome(s, left + 1, right - 1);          // andar ke chhote hisse pe wahi sawaal
}
```

## Code example 2 — Print karne ka order: call se pehle ya baad?

**Trick**: *"Call se PEHLE kaam = neeche jaate hue. Call ke BAAD kaam = wapas aate hue."*

```java
public void printUp(int n) {              // n = 3  →  3 2 1  (neeche jaate hue print)
    if (n == 0) return;
    System.out.print(n + " ");            // pehle print
    printUp(n - 1);
}

public void printDown(int n) {            // n = 3  →  1 2 3  (wapas aate hue print)
    if (n == 0) return;
    printDown(n - 1);
    System.out.print(n + " ");            // baad mein print
}
```

Tree traversals (preorder / postorder) bilkul isi "pehle ya baad" ka khel hain — [Binary Tree](../03-trees-and-heaps/13-binary-tree.md) mein dekhenge.

## Code example 3 — Tree recursion aur uska problem (Fibonacci)

Jab **ek function do baar khud ko bulaye**, calls ka **tree** ban jata hai:

```
                        fib(5)
                  ┌───────┴───────┐
               fib(4)           fib(3)               ← fib(3) DOBARA
            ┌────┴────┐       ┌────┴────┐
         fib(3)    fib(2)   fib(2)   fib(1)          ← fib(2) TEEN baar!
        ┌───┴───┐
     fib(2)  fib(1)

Same subproblem baar-baar solve ho raha hai = time waste  →  O(2ⁿ)
```

```java
// ❌ O(2ⁿ) — same kaam baar-baar
public int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// ✅ O(n) — ek baar nikala toh yaad rakho (memoization). Yahi DP ki shuruaat hai!
public long fibMemo(int n) {
    return fibMemo(n, new long[n + 1]);
}

private long fibMemo(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];                       // 🔑 pehle se nikala hua → seedha de do
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}
```

Yaad rakho: **recursion tree mein repeat dikhe = DP lagana hai** — [DP Basics](../06-dynamic-programming/24-dp-basics.md) mein poori kahani.

## Code example 4 — Tower of Hanoi (recursion ka sabse famous khel)

3 khunte (A, B, C) hain. A pe `n` disks hain (bada neeche, chhota upar). **Sab disks ko A se C pe le jao** — ek baar mein ek disk, aur **bada disk chhote ke upar kabhi nahi**.

**Recursion ki soch**: *"Sabse bade disk ko C pe pahunchane ke liye, uske upar ke `n−1` disks ko pehle B pe hatana padega."*

```
n = 2:   A→B (chhota)   A→C (bada)   B→C (chhota)          = 3 moves = 2² − 1

n disks ka plan:
   1) upar ke (n−1) disks:  A ─▶ B     (C madad karega)
   2) sabse bada disk    :  A ─▶ C     (seedha)
   3) wo (n−1) disks     :  B ─▶ C     (A madad karega)

Total moves = 2ⁿ − 1        n=3: 7    n=10: 1023    n=64: ~1.8 × 10¹⁹ (universe khatam ho jayega 😄)
```

```java
public int hanoi(int n, char from, char to, char via) {
    if (n == 0) return 0;                                    // base case: koi disk nahi → koi move nahi
    int moves = hanoi(n - 1, from, via, to);                 // 1) upar ke n-1 disks ko 'via' pe hatao
    System.out.println("Disk " + n + ": " + from + " -> " + to);   // 2) bada disk seedha 'to' pe
    moves += 1;
    moves += hanoi(n - 1, via, to, from);                    // 3) n-1 disks ko 'via' se 'to' pe lao
    return moves;
}
```

## Code example 5 — Subsets (Include / Exclude) — Backtracking ka darwaza

Har element ke liye **2 choices**: *"Lo"* ya *"Chhodo"*. Isse **decision tree** banta hai:

```
nums = [1, 2]                              (har level pe ek element ka decision)

                     { }                        ← shuru mein kuch nahi chuna
          chhodo 1 /       \ lo 1
                { }         {1}                 ← 1 ka decision ho gaya
    chhodo 2 /    \ lo 2   chhodo 2 /   \ lo 2
          { }    {2}          {1}    {1,2}      ← 2 ka decision ho gaya → 4 leaves = 2² subsets ✅
```

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    helper(nums, 0, new ArrayList<>(), result);
    return result;
}

private void helper(int[] nums, int i, List<Integer> current, List<List<Integer>> result) {
    if (i == nums.length) {                       // base case: saare elements ka decision ho gaya
        result.add(new ArrayList<>(current));     // 🔑 COPY save karo (current aage badalta rahega)
        return;
    }
    helper(nums, i + 1, current, result);         // choice 1: nums[i] ko CHHODO
    current.add(nums[i]);
    helper(nums, i + 1, current, result);         // choice 2: nums[i] ko LO
    current.remove(current.size() - 1);           // 🔑 undo — agli choice ke liye list saaf (isi ko backtracking kehte hain)
}
```

Ye "choose → explore → undo" ka pattern hi [Backtracking](../04-paradigms/17-backtracking.md) hai.

## Recursion ki time aur space complexity

| Recurrence (recursion ka roop) | Time | Example |
|---|---|---|
| `T(n) = T(n−1) + O(1)` | **O(n)** | factorial, sumOfDigits |
| `T(n) = T(n/2) + O(1)` | **O(log n)** | power, binary search |
| `T(n) = 2·T(n/2) + O(n)` | **O(n log n)** | merge sort |
| `T(n) = 2·T(n−1) + O(1)` | **O(2ⁿ)** | fib (slow), subsets |
| `T(n) = n·T(n−1)` | **O(n!)** | permutations |

**Space** = recursion ki **gehraai (depth)** — kyunki har call ek stack frame leti hai. `factorial(n)` mein O(n) space, `power(x, n)` mein O(log n).

## Stack Overflow — recursion ka dushman

Java ka call stack chhota hai (aam taur pe ~10,000–20,000 calls). 1 lakh depth wala recursion (jaise `sumRec(100000)`) **`StackOverflowError`** deta hai. Solution:
- **Loop mein badlo** (iteration), ya
- **Khud ka `Stack`** (Deque) use karo, ya
- Problem ko aise todo ki depth `log n` rahe.

## Common galtiyan

- **Base case bhoolna ya galat likhna** → infinite recursion → `StackOverflowError`.
- **Problem chhota nahi ho raha**: `f(n)` ke andar `f(n)` hi bula diya (n−1 likhna bhool gaye).
- **Recursive call ka `return` bhoolna** — answer upar tak wapas nahi pahunchta.
- **Result list mein `current` seedha add karna** (copy nahi) — baad mein badal jayegi. `new ArrayList<>(current)`.
- **Undo bhoolna** (backtracking mein) — agli choice ko purani choice ka kachra mil jata hai.
- **Jahan loop kaafi ho wahan recursion** — bina wajah stack kharch karna.

> 💡 **Interview mein bolne wali line**: *"Iska base case hai [X]. Har call problem ko [n−1 / aadha] mein todti hai. Time [recurrence se] O(...), aur space recursion depth ke barabar O(...)."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Power of Three | Easy | Base case + reduce | [leetcode.com/problems/power-of-three](https://leetcode.com/problems/power-of-three/) |
| 2 | Climbing Stairs | Easy | Fibonacci jaisa + memo | [leetcode.com/problems/climbing-stairs](https://leetcode.com/problems/climbing-stairs/) |
| 3 | Merge Two Sorted Lists | Easy | Recursion on linked list | [leetcode.com/problems/merge-two-sorted-lists](https://leetcode.com/problems/merge-two-sorted-lists/) |
| 4 | Reverse Linked List | Easy | "Peeche wale ko ulta karo" | [leetcode.com/problems/reverse-linked-list](https://leetcode.com/problems/reverse-linked-list/) |
| 5 | Maximum Depth of Binary Tree | Easy | Tree recursion (left, right) | [leetcode.com/problems/maximum-depth-of-binary-tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) |
| 6 | K-th Symbol in Grammar | Medium | Pattern dekh ke chhota karo | [leetcode.com/problems/k-th-symbol-in-grammar](https://leetcode.com/problems/k-th-symbol-in-grammar/) |
| 7 | Generate Parentheses | Medium | Choices + constraints | [leetcode.com/problems/generate-parentheses](https://leetcode.com/problems/generate-parentheses/) |
| 8 | Subsets | Medium | Include / exclude | [leetcode.com/problems/subsets](https://leetcode.com/problems/subsets/) |
| 9 | Permutations | Medium | Choose, explore, undo | [leetcode.com/problems/permutations](https://leetcode.com/problems/permutations/) |
| 10 | Different Ways to Add Parentheses | Medium | Divide & conquer on operators | [leetcode.com/problems/different-ways-to-add-parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) |
| 11 | Decode String | Medium | Nested recursion | [leetcode.com/problems/decode-string](https://leetcode.com/problems/decode-string/) |
| 12 | Longest Increasing Path in a Matrix | Hard | DFS + memoization | [leetcode.com/problems/longest-increasing-path-in-a-matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) |

---

## ✅ Unit 1 (Basics) khatam!

Ab tumhe aata hai: **complexity** naapna, **array/string/hashing** se data sambhalna, **math aur bits** ke shortcut, **sorting/binary search**, aur **recursion** ki soch. Ye sab agli units ki neev hai.

Agla: [Unit 2 — Linear Structures → Linked List](../02-linear-structures/10-linked-list.md)
