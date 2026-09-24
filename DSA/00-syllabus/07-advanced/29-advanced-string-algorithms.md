# 29. Advanced String Algorithms (KMP & Rabin-Karp)

> 📍 **Syllabus**: Unit 7 — Advanced · Topic 29 / 29 · Pehle chahiye: [Strings](../01-basics/03-strings.md), [Hashing](../01-basics/04-hashing.md), [Math for DSA](../01-basics/05-math-basics.md) (modulo)

> **Standard definition**: Algorithms for finding a pattern inside a text faster than the naive O(n·m) scan — KMP (Knuth-Morris-Pratt) precomputes a failure function (longest proper prefix that is also a suffix) so that no text character is compared more than a constant number of times, giving O(n + m); Rabin-Karp compares rolling hash values of the pattern and of each text window, giving O(n + m) on average.

**Ek line mein**: Bade text mein pattern dhoondhna **bina peeche mudke** — jo hissa pehle hi match ho chuka hai use dobara mat check karo.

**Trick yaad rakhne ki**:
- **KMP** = *"Cassette rewind mat karo"* — galat gaana aane pe poora cassette shuru se nahi chalate, **sirf utna peeche jaate ho jitna zaroori ho**. Pattern ko pehle se dekhkar ek "peeche kitna jana hai" ka naksha (LPS) bana lete hain.
- **Rabin-Karp** = *"Fingerprint match"* — har window ka ek **chhota number (hash)** nikalo. Fingerprint match hua toh hi asli akshar check karo. Window ek kadam khiske toh hash **O(1)** mein update (rolling).

**Kab use karo**: **Pattern matching** ke sawaal jahan `n, m ~ 10⁵–10⁶` hon (naive TLE dega), **"prefix jo suffix bhi ho" / repeated pattern / palindrome-prefix** wale sawaal (KMP ka LPS), aur **saare substrings ka duplicate dhoondhna** (Rabin-Karp).

## Naive kyun slow hai?

```
text    = A A A A A A B          pattern = A A A B
i=0:  AAAB vs AAAA → 3 match, 4th mismatch → wapas i=1 se PHIR shuru
i=1:  AAAB vs AAAA → 3 match, mismatch     → wapas ...
i=2:  ...                                   (har baar wahi 'A' dobara compare!)

Worst case: O(n · m)      n = text ki lambai, m = pattern ki lambai
```

## KMP — pehle LPS array samjho

**LPS[i]** = pattern ke `p[0..i]` ka **sabse lamba "prefix jo suffix bhi hai"** (par poori string nahi). Isse pata chalta hai ki mismatch pe **kitna hissa pehle se match hai** jise dobara check nahi karna.

```
pattern = A B A B C
index     0 1 2 3 4

LPS[0] = 0                                       (ek akshar — koi proper prefix nahi)
LPS[1] = 0    "AB"    → prefix A,  suffix B     → alag                         → 0
LPS[2] = 1    "ABA"   → prefix "A"  = suffix "A"                              → 1
LPS[3] = 2    "ABAB"  → prefix "AB" = suffix "AB"                             → 2
LPS[4] = 0    "ABABC" → C ka koi match nahi                                   → 0

LPS = [0, 0, 1, 2, 0]
```

**LPS kaise banta hai** (two pointers): `len` = ab tak ka matched prefix-suffix. Naya akshar `p[i]`, `p[len]` se match ho → `len++`. Match na ho → **`len = LPS[len-1]`** (pichhle chhote "border" pe jao) — **0 se shuru mat karo.**

## KMP search — dekho kaise chalta hai

```
text    = A B A B A B C          pattern = A B A B C        LPS = [0,0,1,2,0]

i=0..3 : A B A B  match          j = 4  (pattern ke 4 akshar match)
i=4    : text 'A'  vs  pattern[4] = 'C'  ✗ mismatch
         → j = LPS[3] = 2        ⭐ "AB" pehle se match hai (text ke last 2 akshar), unhe dobara mat dekho
         text 'A' (i=4) vs pattern[2] = 'A'  ✓   j = 3
i=5    : 'B' vs pattern[3] = 'B'  ✓   j = 4
i=6    : 'C' vs pattern[4] = 'C'  ✓   j = 5 = m  → MIL GAYA! shuruaat = i − m + 1 = 2 ✅

Text ka pointer i kabhi peeche NAHI gaya — sirf j peeche gaya. Isliye O(n + m).
```

```java
// LPS array — pattern ke har prefix ka "prefix jo suffix bhi ho" ki lambai
public int[] buildLps(String p) {
    int[] lps = new int[p.length()];
    int len = 0;                                   // ab tak matched prefix-suffix ki lambai
    for (int i = 1; i < p.length(); i++) {
        while (len > 0 && p.charAt(i) != p.charAt(len)) {
            len = lps[len - 1];                    // 🔑 mismatch → chhote border pe jao (0 se restart nahi)
        }
        if (p.charAt(i) == p.charAt(len)) len++;
        lps[i] = len;
    }
    return lps;
}

// Pehli occurrence ka index (nahi mili toh -1). Khaali pattern → 0
public int strStr(String text, String pattern) {
    if (pattern.isEmpty()) return 0;
    int[] lps = buildLps(pattern);
    int j = 0;                                     // pattern ke kitne akshar abhi match hain
    for (int i = 0; i < text.length(); i++) {
        while (j > 0 && text.charAt(i) != pattern.charAt(j)) {
            j = lps[j - 1];                        // mismatch → text ka i wahin, sirf j peeche
        }
        if (text.charAt(i) == pattern.charAt(j)) j++;
        if (j == pattern.length()) return i - j + 1;   // poora pattern mila
    }
    return -1;
}

// Saari occurrences (overlapping bhi)
public List<Integer> indexesOf(String text, String pattern) {
    List<Integer> result = new ArrayList<>();
    if (pattern.isEmpty()) return result;
    int[] lps = buildLps(pattern);
    int j = 0;
    for (int i = 0; i < text.length(); i++) {
        while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = lps[j - 1];
        if (text.charAt(i) == pattern.charAt(j)) j++;
        if (j == pattern.length()) {
            result.add(i - j + 1);
            j = lps[j - 1];                        // 🔑 aage overlapping match ke liye pattern ke border se jaari rakho
        }
    }
    return result;
}
```

**Time O(n + m)**, space **O(m)** (LPS). `while` loop ke andar bhi `j` **amortized** ghatta hai (jitna badha utna hi ghatega), isliye total O(n).

## Rabin-Karp — Rolling Hash

**Idea**: Pattern ka **hash** nikalo. Text pe **`m` size ki window** khiskao; window ka hash `O(1)` mein update hota hai. **Hash match ho toh** asli akshar compare karo (kyunki alag strings ka hash kabhi-kabhi same aa sakta hai — *collision*).

```
Window hash = akshar ko ek "number" ki tarah padho (base B mein):

  "abc"  →  a·B² + b·B¹ + c·B⁰        (sab modulo M mein, taaki number bada na ho)

Window ek kadam khiske  "abc" → "bcd":
  naya hash = ( purana hash − a·B² ) · B + d          ← purana pehla akshar nikalo, naya aakhri jodo — O(1)!
```

```java
public int rabinKarp(String text, String pattern) {
    int n = text.length(), m = pattern.length();
    if (m == 0) return 0;
    if (m > n) return -1;
    final long MOD = 1_000_000_007L, BASE = 257;

    long high = 1;                                    // BASE^(m-1) mod MOD — sabse bade akshar ka weight
    for (int i = 1; i < m; i++) high = high * BASE % MOD;

    long pHash = 0, tHash = 0;
    for (int i = 0; i < m; i++) {                     // pattern aur pehli window ka hash
        pHash = (pHash * BASE + pattern.charAt(i)) % MOD;
        tHash = (tHash * BASE + text.charAt(i)) % MOD;
    }

    for (int i = 0; ; i++) {
        if (pHash == tHash && text.regionMatches(i, pattern, 0, m)) return i;   // 🔑 hash match → asli check (collision se bachne ke liye)
        if (i + m >= n) break;                        // agli window nahi bachi
        tHash = ((tHash - text.charAt(i) * high % MOD + MOD) * BASE + text.charAt(i + m)) % MOD;   // window khiskao
    }
    return -1;
}
```

**Time**: average **O(n + m)**; **worst O(n · m)** agar bahut saare collisions hon (achha `MOD`/`BASE` chunne pe bahut rare). **Fayda**: **kai patterns ek saath**, ya **"kya koi substring do baar aata hai"** (hash ko `HashSet` mein daalo) jaise sawaalon mein bahut kaam ka — jahan KMP seedha nahi chalta.

## KMP ka asli maza — LPS se "trick" wale sawaal

### Repeated Substring Pattern — kya string kisi chhote tukde ko baar-baar repeat karke bani hai?

**Trick**: `LPS[n-1]` = poori string ka sabse lamba "prefix jo suffix bhi ho". Toh **sabse chhota repeating tukda = `n − LPS[n-1]`**. Agar `n` iska **multiple** hai (aur `LPS[n-1] > 0`) toh haan.

```
s = "abcabcabc"     LPS[8] = 6  ("abcabc")      period = 9 − 6 = 3      9 % 3 == 0  →  ✅ "abc" × 3
s = "abcabcab"      LPS[7] = 5                  period = 8 − 5 = 3      8 % 3 != 0  →  ❌
```

### Shortest Palindrome — aage se sabse kam akshar jodkar palindrome banao

**Trick**: `s` ka **sabse lamba prefix jo khud palindrome ho** dhoondho. Uske baad ka hissa ulta karke **aage** jod do. Wo prefix nikalne ke liye `s + "#" + reverse(s)` ka **LPS** — aakhri value wahi lambai hai!

```
s = "aacecaaa"      rev = "aaacecaa"      combined = "aacecaaa#aaacecaa"
LPS ki aakhri value = 7   →  s ka prefix "aacecaa" (7 akshar) palindrome hai
baaki bacha = "a" (s ka aakhri) → ulta karke aage → "a" + "aacecaaa" = "aaacecaaa" ✅
```

```java
public boolean repeatedSubstringPattern(String s) {
    int n = s.length();
    int[] lps = prefixFunction(s);
    int period = n - lps[n - 1];                    // sabse chhota repeat hone wala tukda
    return lps[n - 1] > 0 && n % period == 0;
}

public String shortestPalindrome(String s) {
    String rev = new StringBuilder(s).reverse().toString();
    int[] lps = prefixFunction(s + "#" + rev);      // '#' — s aur rev ko alag rakhne ke liye
    int keep = lps[lps.length - 1];                 // 🔑 s ka sabse lamba palindromic prefix
    return rev.substring(0, s.length() - keep) + s; // baaki hissa ulta karke aage
}

private int[] prefixFunction(String p) {            // wahi LPS
    int[] lps = new int[p.length()];
    int len = 0;
    for (int i = 1; i < p.length(); i++) {
        while (len > 0 && p.charAt(i) != p.charAt(len)) len = lps[len - 1];
        if (p.charAt(i) == p.charAt(len)) len++;
        lps[i] = len;
    }
    return lps;
}
```

## Kaunsa tool kab

| Sawaal | Tool |
|---|---|
| Ek pattern, ek text — pehli/saari occurrences | **KMP** (ya Java ka `indexOf` agar chhota ho) |
| "Prefix jo suffix bhi ho", repeated pattern, palindromic prefix | **KMP ka LPS** |
| **Kai** patterns ek saath ya "koi substring repeat hota hai?" | **Rabin-Karp** (rolling hash) |
| Sabse lamba duplicate substring | Rabin-Karp + Binary Search on length |
| Prefix se shuru hone wale bahut saare words | [Trie](../03-trees-and-heaps/16-trie.md) |
| Sabse lamba palindromic **substring** | Expand around center ([Strings](../01-basics/03-strings.md)) — Manacher ka O(n) bhi hota hai |

(Aur ek aur tool: **Z-Algorithm** — LPS jaisa hi, `z[i]` = `s` aur `s[i..]` ka common prefix. Jaldi seekhna ho toh KMP kaafi hai.)

## Common galtiyan

- **KMP mein mismatch pe `j = 0` kar dena** — ye naive ban gaya. **`j = lps[j - 1]`**.
- **`while` ki jagah `if` lagana** — ek mismatch ke baad kai baar peeche jaana pad sakta hai.
- **Rabin-Karp mein modulo ke baad negative hash** — `(tHash - x + MOD) % MOD`.
- **Rabin-Karp mein sirf hash compare karna** (asli check nahi) — collision se galat answer.
- **`int` overflow hash mein** — `long` lo, `MOD` chhota rakho (~10⁹).
- **Khaali pattern / `m > n`** edge cases.

> 💡 **Interview mein bolne wali line**: *"Naive O(n·m) hoga. KMP mein pattern ka LPS array bana ke mismatch pe text ka pointer peeche nahi le jaata, sirf pattern ka pointer LPS se kudta hai — O(n + m). Multiple patterns ya duplicate-substring ke liye main Rabin-Karp ka rolling hash use karunga."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Find the Index of the First Occurrence in a String | Easy | KMP / Rabin-Karp seedha | [leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) |
| 2 | Rotate String | Easy | `s + s` mein pattern | [leetcode.com/problems/rotate-string](https://leetcode.com/problems/rotate-string/) |
| 3 | Repeated Substring Pattern | Easy | `n − LPS[n-1]` | [leetcode.com/problems/repeated-substring-pattern](https://leetcode.com/problems/repeated-substring-pattern/) |
| 4 | Find All Anagrams in a String | Medium | Rolling window (count) | [leetcode.com/problems/find-all-anagrams-in-a-string](https://leetcode.com/problems/find-all-anagrams-in-a-string/) |
| 5 | Repeated String Match | Medium | Kitni baar repeat + KMP | [leetcode.com/problems/repeated-string-match](https://leetcode.com/problems/repeated-string-match/) |
| 6 | Longest Happy Prefix | Hard | Seedha `LPS[n-1]` | [leetcode.com/problems/longest-happy-prefix](https://leetcode.com/problems/longest-happy-prefix/) |
| 7 | Shortest Palindrome | Hard | `s + # + rev(s)` ka LPS | [leetcode.com/problems/shortest-palindrome](https://leetcode.com/problems/shortest-palindrome/) |
| 8 | Longest Duplicate Substring | Hard | Rabin-Karp + Binary Search | [leetcode.com/problems/longest-duplicate-substring](https://leetcode.com/problems/longest-duplicate-substring/) |
| 9 | Sum of Scores of Built Strings | Hard | Z-algorithm | [leetcode.com/problems/sum-of-scores-of-built-strings](https://leetcode.com/problems/sum-of-scores-of-built-strings/) |
| 10 | Distinct Echo Substrings | Hard | Rolling hash + set | [leetcode.com/problems/distinct-echo-substrings](https://leetcode.com/problems/distinct-echo-substrings/) |

---

## 🎉 Poora DSA Syllabus khatam! (29 / 29)

```
Unit 1  Basics            ✅  Complexity · Arrays · Strings · Hashing · Math · Bits · Sorting · Binary Search · Recursion
Unit 2  Linear            ✅  Linked List · Stack · Queue / Deque
Unit 3  Trees & Heaps     ✅  Binary Tree · BST · Heap · Trie
Unit 4  Paradigms         ✅  Backtracking · Greedy
Unit 5  Graphs            ✅  Basics (BFS/DFS) · Topological Sort · Union-Find · Shortest Path · MST
Unit 6  DP                ✅  Basics · 2D · Knapsack & Subsequences · Advanced
Unit 7  Advanced          ✅  Segment / Fenwick Tree · KMP & Rabin-Karp
```

**Ab kya?**
1. Har topic ka **practice table** (basic se advance) solve karo — sabse pehle Easy, phir Medium.
2. Jab koi naya problem dikhe, poochho: **"Ye kaunse topic/pattern jaisa hai?"** — cheat-sheet: [Syllabus README](../README.md).
3. Ab **[Patterns](../../01-patterns/01-sliding-window.md)** revise karo — un 20 templates se problem pehchanna aur tez ho jayega.
4. Phir [LLD](../../../LLD/README.md) aur [HLD](../../../HLD/README.md) notes.
