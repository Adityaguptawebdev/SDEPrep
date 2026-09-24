# 1. Complexity Analysis (Big-O)

> 📍 **Syllabus**: Unit 1 — Basics · Topic 1 / 29 · Pehle chahiye: kuch nahi (yahin se shuru!)

> **Standard definition**: A way to describe how the running time (time complexity) or memory usage (space complexity) of an algorithm grows as the input size `n` grows, ignoring constant factors and lower-order terms.

**Ek line mein**: Tumhara code **input bada hone pe kitna slow ya kitni memory-hungry** ho jayega — ye batane ka standard tarika. Seconds mein nahi napte (wo machine pe depend karta hai), **steps ki ginti `n` ke hisaab se** karte hain.

**Trick yaad rakhne ki**: *"Shaadi ke mehmaan"* — `n` = mehmaanon ki sankhya.
- **O(1)**: dulha-dulhan ko tilak lagana — mehmaan 10 hon ya 10,000, kaam **ek hi baar**.
- **O(log n)**: alphabetical guest-list mein naam dhundhna — har baar **aadhi list chhod do**.
- **O(n)**: har mehmaan ko **ek-ek karke** laddoo dena.
- **O(n log n)**: saare mehmaanon ki seating list **sort** karna.
- **O(n²)**: **har mehmaan ka har doosre mehmaan se parichay** karwana.
- **O(2ⁿ)**: har mehmaan ke liye "table pe baithega / nahi baithega" — **saare combinations** try karna.

**Kab use karo**: **Har problem mein**. Interview mein code likhne se **pehle** approach ki complexity bolo, aur code likhne ke **baad** confirm karo. Interviewer 100% poochega: *"Time aur space complexity?"*

## Growth ka picture — kaun tez, kaun slow

```
 Tez  ▲   O(1)          ← constant          (array[i], HashMap.get)
      │   O(log n)      ← har step aadha    (binary search)
      │   O(n)          ← ek loop           (sum, max dhundhna)
      │   O(n log n)    ← sort              (merge sort, Arrays.sort)
      │   O(n²)         ← nested loop       (bubble sort, saare pairs)
      │   O(2ⁿ)         ← har choice ×2     (saare subsets)
 Slow ▼   O(n!)         ← saari arrangements (permutations)
```

Ab **asli numbers** dekho — yahi dikhata hai ki complexity kyun matter karti hai:

| n | O(log n) | O(n) | O(n log n) | O(n²) | O(2ⁿ) |
|---|---|---|---|---|---|
| 10 | 3 | 10 | 33 | 100 | 1,024 |
| 1,000 | 10 | 1,000 | 10,000 | 10,00,000 | 🤯 (10³⁰¹) |
| 1,00,000 | 17 | 1,00,000 | 17,00,000 | 1,000 crore ❌ | impossible |

`n = 1 lakh` pe O(n²) matlab **1000 crore steps** — computer ko ~100 second lagenge (interview/online-judge limit: 1–2 sec). Isi liye O(n²) ko O(n log n) banana seekhte hain.

## Complexity nikalne ke 5 rules

```
Rule 1: Constants hata do         →  O(2n)      = O(n)
Rule 2: Chhoti powers hata do     →  O(n² + n)  = O(n²)
Rule 3: Ek ke baad ek loop → ADD  →  O(n) + O(n) = O(n)
Rule 4: Loop ke andar loop → MULTIPLY → O(n) × O(n) = O(n²)
Rule 5: Alag input = alag letter  →  do arrays a, b pe loop = O(a + b), nested = O(a × b)
```

**Trick**: *"Bade `n` pe sirf sabse bhaari cheez matter karti hai"* — 1 crore mehmaanon mein 5 extra laddoo ginne se kuch farq nahi padta.

## Code example — har complexity ka ek chhota namoona

```java
// 🔑 Har method ke upar likha hai ki n elements pe kitne steps lagenge

// O(1) — n kitna bhi ho, sirf ek step
public int first(int[] arr) {
    return arr[0];
}

// O(n) — ek loop, har element ek baar
public int sum(int[] arr) {
    int total = 0;
    for (int x : arr) total += x;
    return total;
}

// O(log n) — har step mein problem AADHI ho jaati hai
public int countHalvings(int n) {
    int steps = 0;
    while (n > 1) {
        n = n / 2;      // 16 -> 8 -> 4 -> 2 -> 1  (sirf 4 steps)
        steps++;
    }
    return steps;
}

// O(n log n) — sorting ki standard cost
public int[] sortedCopy(int[] arr) {
    int[] copy = arr.clone();
    Arrays.sort(copy);
    return copy;
}

// O(n²) — loop ke andar loop: saare pairs (i, j)
public int countZeroSumPairs(int[] arr) {
    int count = 0;
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {   // 🔑 inner loop bhi ~n baar chalta hai
            if (arr[i] + arr[j] == 0) count++;
        }
    }
    return count;
}

// O(2ⁿ) — har call 2 calls banati hai (isse DP se sudharenge, Unit 6 mein)
public int fibSlow(int n) {
    if (n <= 1) return n;
    return fibSlow(n - 1) + fibSlow(n - 2);
}
```

**Line by line samjho**: `first` mein input kitna bhi bada ho, ek hi line chalti hai → O(1). `sum` mein loop `n` baar → O(n). `countHalvings` mein `n` ko baar-baar 2 se bhaag rahe hain, isliye `log₂ n` steps. `countZeroSumPairs` mein bahar wala loop `n` baar aur andar wala bhi ~`n` baar → `n × n`. `fibSlow` mein **har call do naye calls** banati hai, isliye calls ka tree double hota jata hai → 2ⁿ.

## Time ke badle Space — asli sauda (Trade-off)

Ek hi problem (Two Sum) ko do tarah se solve karte hain — **complexity ka farq** dekho:

```java
// ❌ Approach 1 — Brute force: Time O(n²), Space O(1)
public int[] twoSumBrute(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) return new int[]{i, j};
        }
    }
    return new int[]{};
}

// ✅ Approach 2 — HashMap: Time O(n), Space O(n)   → time bachaya, space kharch kiya
public int[] twoSumHash(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();      // value -> index
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];                    // 🔑 jodi ka doosra number kya chahiye
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

**Line by line samjho**: Brute force har pair check karta hai (n² pairs), koi extra memory nahi leta. HashMap wala version **ek hi pass** mein kaam khatam karta hai kyunki "chahiye wala number pehle dekha kya?" ka jawab HashMap **O(1)** mein deta hai — par uske liye O(n) extra memory chahiye. Zyadatar interview problems mein **memory dekar time bachana** hi sahi sauda hota hai.

## Space complexity — memory ka hisaab

**Space** = tumne **extra** kitni memory li (input ko chhodke). **Recursion ka call stack bhi memory hai!**

```java
// O(n) space — recursion n level gehra jata hai, har level ek stack frame
public int sumRec(int n) {
    if (n == 0) return 0;
    return n + sumRec(n - 1);
}

// O(1) space — sirf ek variable
public int sumLoop(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) total += i;
    return total;
}
```

## Best / Average / Worst case aur Amortized

| Term | Matlab | Example (linear search) |
|---|---|---|
| **Best case** | Sabse achhi kismat | Element pehli jagah mila → O(1) |
| **Worst case** | Sabse buri kismat | Element aakhri mein / mila hi nahi → O(n) |
| **Average case** | Typical input | Beech mein mila → O(n) |

Interview mein jab tak alag se na bole, **Worst case (Big-O)** hi bolna hota hai.

**Amortized**: kabhi-kabhi ek operation mehnga hota hai, par **bahut saare operations pe average sasta**. Jaise `ArrayList.add()`:

```
capacity 4:  [a][b][c][d]  ← full!  add(e) aaya
                 │
                 ▼  ek baar naya double-size array banao + purana copy karo (mehnga: O(n))
capacity 8:  [a][b][c][d][e][ ][ ][ ]   ← ab agle 3 add() bilkul sasta (O(1))

Total kharch / total adds ≈ constant  →  add() amortized O(1)
```

## Constraints dekh ke complexity guess karo (interview ka cheat-code) ⭐

Computer ek second mein lagbhag **10⁸ simple operations** karta hai. Problem mein `n` ki limit dekho, aur ulta soch lo ki kaunsi complexity chalegi:

| `n` ki limit | Chalne wali complexity | Kaun sa topic soch sakte ho |
|---|---|---|
| n ≤ 10 | O(n!) | Permutations, backtracking |
| n ≤ 20 | O(2ⁿ) | Subsets, bitmask, backtracking |
| n ≤ 500 | O(n³) | Floyd–Warshall, 3 nested loops |
| n ≤ 5,000 | O(n²) | 2D DP, nested loops |
| n ≤ 10⁵ | O(n log n) | Sorting, heap, binary search |
| n ≤ 10⁶ | O(n) | Ek pass, hashing, two pointers |
| n ≤ 10⁹ ya zyada | O(log n) / O(1) | Binary search, maths |

## Common galtiyan (jo O(n) ko chupke se O(n²) bana deti hain)

- **`String` ko loop mein `+=` se jodna** — har baar poori nayi string copy hoti hai → O(n²). `StringBuilder` use karo ([Strings note](03-strings.md) mein).
- **`list.remove(0)` / `list.add(0, x)`** — baaki sab elements ko khiskana padta hai → O(n) har baar.
- **`list.contains(x)`** — poori list scan hoti hai O(n); `HashSet.contains` O(1) hai.
- **`s.substring(...)`** — Java mein naya copy banata hai, O(length).

> 💡 **Interview mein bolne wali line**: *"Brute force O(n²) hai. HashMap use karke main ise O(n) time mein kar sakta hoon, bas O(n) extra space lagegi — mujhe ye trade-off theek lagta hai kyunki n badi hai."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Two Sum | Easy | O(n²) brute vs O(n) hash | [leetcode.com/problems/two-sum](https://leetcode.com/problems/two-sum/) |
| 2 | Contains Duplicate | Easy | Sort O(n log n) vs Set O(n) | [leetcode.com/problems/contains-duplicate](https://leetcode.com/problems/contains-duplicate/) |
| 3 | Missing Number | Easy | O(1) space (sum / XOR trick) | [leetcode.com/problems/missing-number](https://leetcode.com/problems/missing-number/) |
| 4 | Fibonacci Number | Easy | O(2ⁿ) recursion vs O(n) loop | [leetcode.com/problems/fibonacci-number](https://leetcode.com/problems/fibonacci-number/) |
| 5 | Sqrt(x) | Easy | O(n) scan vs O(log n) binary search | [leetcode.com/problems/sqrtx](https://leetcode.com/problems/sqrtx/) |
| 6 | Pow(x, n) | Medium | O(n) vs O(log n) fast power | [leetcode.com/problems/powx-n](https://leetcode.com/problems/powx-n/) |

**Karne ka tarika**: Har problem ko **pehle brute force** se socho, uski complexity likho, phir sudharo — aur har baar **time + space dono** bolo.

Agla: [02-arrays.md](02-arrays.md)
