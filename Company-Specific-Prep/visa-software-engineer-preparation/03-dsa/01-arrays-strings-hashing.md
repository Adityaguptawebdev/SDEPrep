# DSA 1/8 — Arrays · Strings · Hashing (technical rounds)

> Questions asked **live in Visa technical rounds** (not OA). Each card has the 13 fields: reported problem · source · round · difficulty · pattern · brute force · optimal · Java · dry run · time · space · follow-ups · how to explain.
> Status tags: **Exact** (candidate named the exact LeetCode problem) · **Close** (candidate described it; we matched the closest LeetCode problem) · **Reconstructed** (details filled by us).

**Easy analogy — HashMap = mess ka register**: Warden ko "Room 204 mein kaun hai?" jaanna hai toh poora hostel nahi ghoomta — register khol ke **seedha** dekh leta hai. Jab bhi question mein "dekha hai kya pehle?" / "kitni baar aaya?" ho → HashMap socho.

| # | Problem | Level of reporter | Freq | Status |
|---|---|---|---|---|
| 1 | Two Sum → 3Sum | EC (1.10 YOE) + Staff | MEDIUM | Exact |
| 2 | Letter Combinations of a Phone Number | EC (1.10 YOE) | LOW | Exact |
| 3 | Number of Matching Subsequences | EC (1 YOE) | LOW | Close |
| 4 | Longest Common Prefix → Longest Common Substring | EC (1.7 YOE) | LOW | Exact |
| 5 | Group Anagrams | Senior (2021) | LOW | Exact |
| 6 | Palindrome check → all palindromic substrings | EC (2 YOE) + NCG | MEDIUM | Exact / Close |
| 7 | Count pairs `a + b = n` in O(1) · two-team elimination in O(1) | EC (1.5 YOE) | LOW | Exact |
| 8 | Count repeated words in a text | Intern | LOW | Exact |
| 9 | Single Number II | NCG | LOW | Exact |
| 10 | Quick ones: remove chars not in 2nd string · parentheses without a stack · lock toggling · add binary · missing numbers · hand of straights | NCG / Senior / Staff | LOW each | Exact / Close |

Longest Substring Without Repeating Characters, Sliding Window Maximum and the IP rate limiter are in [DSA 2/8](02-sliding-window-and-rate-limiter.md). Second-largest / k-th largest are in [DSA 4/8](04-linked-list-stack-heap-sorting.md).

---

## 1. Two Sum → 3Sum

| Field | Details |
|---|---|
| **Reported problem** | "2-sum problem", "3-sum problem" — **Exact** (candidate's words). "Not able to provide optimized solution for 3sum problem. I gave N^2+nlogn solution and he was expecting N^2 solution only." |
| **Source** | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) · Jun 2025 · SDE-1, 1.10 YOE, tier-2 (rejected). Two Sum also at Staff level: [LC-4679649](https://leetcode.com/discuss/post/4679649/visa-staff-software-engineer-interview-e-itc7/) (Feb 2024). |
| **Round** | Technical round 2 (same round had Spring annotations, SQL vs NoSQL, static vs non-static, SQL queries) |
| **Difficulty** | [Two Sum](https://leetcode.com/problems/two-sum/) Easy · [3Sum](https://leetcode.com/problems/3sum/) Medium |
| **Pattern** | HashMap lookup (2Sum) → sort + two pointers (3Sum) |
| **Frequency** | MEDIUM (2 reports) |

**Brute force**: 2Sum — check every pair, O(n²). 3Sum — every triple, O(n³), plus a set to remove duplicates.

**Optimal**
- **2Sum**: while scanning, ask the map "have I seen `target − x`?" → O(n).
- **3Sum**: sort once (O(n log n)), fix `i`, then two pointers on the rest (O(n) each) → **O(n²) total**. Note: O(n² + n log n) **is** O(n²) — the interviewer wanted you to say that, *or* they wanted the extra `log n` from a binary search inside the loop removed. Say the complexity clearly and explain why sorting doesn't change it.

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class SumProblems {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seenAt = new HashMap<>();          // value → index
        for (int i = 0; i < nums.length; i++) {
            Integer j = seenAt.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            seenAt.put(nums[i], i);
        }
        return new int[0];
    }

    static List<List<Integer>> threeSum(int[] input) {
        int[] a = input.clone();
        Arrays.sort(a);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < a.length - 2; i++) {
            if (i > 0 && a[i] == a[i - 1]) continue;             // skip duplicate first numbers
            if (a[i] > 0) break;                                 // smallest is positive → no zero sum
            int lo = i + 1, hi = a.length - 1;
            while (lo < hi) {
                int sum = a[i] + a[lo] + a[hi];
                if (sum < 0) lo++;
                else if (sum > 0) hi--;
                else {
                    result.add(List.of(a[i], a[lo], a[hi]));
                    while (lo < hi && a[lo] == a[lo + 1]) lo++;  // skip duplicates
                    while (lo < hi && a[hi] == a[hi - 1]) hi--;
                    lo++;
                    hi--;
                }
            }
        }
        return result;
    }
}
```

**Dry run (3Sum)** `[-1, 0, 1, 2, -1, -4]` → sorted `[-4, -1, -1, 0, 1, 2]`

```
 i=0 (-4): lo..hi sums all < 0 → none
 i=1 (-1): lo=2(-1) hi=5(2) → 0 ✔ [-1,-1,2];  lo=3(0) hi=4(1) → 0 ✔ [-1,0,1]
 i=2 (-1): same as previous value → skip
 result: [[-1,-1,2], [-1,0,1]]
```

**Time**: 2Sum O(n) · 3Sum O(n²). **Space**: 2Sum O(n) · 3Sum O(1) extra (ignoring output and the sort).
**Follow-ups**: return indices instead of values (sort breaks indices → sort index array) · 3Sum closest · 4Sum (another loop → O(n³)) · what if the array is already sorted? (2Sum → two pointers, O(1) space) · duplicates in input.
**🗣️ Interview mein aise bolo**: "Brute force O(n³) hai. Sort karke ek number fix karta hoon, baaki ke liye two pointers — har `i` ke liye O(n), total O(n²). Sorting O(n log n) hai jo O(n²) ke andar absorb ho jaata hai. Duplicates skip karne ke liye adjacent equal values chhod deta hoon."

---

## 2. Letter Combinations of a Phone Number

| Field | Details |
|---|---|
| **Reported problem** | "letter-combinations-of-a-phone-number" link — **Exact** ([LC 17](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)) |
| **Source** | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) · Jun 2025 · SDE-1, 1.10 YOE |
| **Round** | Technical round 1 (with Longest Substring Without Repeating Characters) |
| **Difficulty** | Medium |
| **Pattern** | Recursion / backtracking (build one character per level) |
| **Frequency** | LOW |

**Brute force = optimal here**: every combination must be printed, so the output itself is up to 4ⁿ strings.

```
 digits "23"
                ""
        ┌───────┼───────┐
        a       b       c          level 1: letters of '2'
      ┌─┼─┐   ┌─┼─┐   ┌─┼─┐
      d e f   d e f   d e f        level 2: letters of '3'
 → ad ae af bd be bf cd ce cf
```

```java
import java.util.ArrayList;
import java.util.List;

class PhoneLetters {
    static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    static List<String> combinations(String digits) {
        List<String> out = new ArrayList<>();
        if (!digits.isEmpty()) build(digits, 0, new StringBuilder(), out);
        return out;
    }

    static void build(String digits, int pos, StringBuilder cur, List<String> out) {
        if (pos == digits.length()) { out.add(cur.toString()); return; }
        for (char ch : KEYS[digits.charAt(pos) - '0'].toCharArray()) {
            cur.append(ch);                         // choose
            build(digits, pos + 1, cur, out);       // explore
            cur.deleteCharAt(cur.length() - 1);     // un-choose (backtrack)
        }
    }
}
```

**Time**: O(4ⁿ · n) (each of up to 4ⁿ strings has length n). **Space**: O(n) recursion depth (+ output).
**Follow-ups**: do it iteratively with a queue (BFS) · empty input · digits `0`/`1` (map to nothing).
**🗣️ Interview mein aise bolo**: "Har digit ek level hai, har letter ek branch. StringBuilder pe choose–explore–unchoose karta hoon, taaki har level pe nayi string na banani pade."

---

## 3. Number of Matching Subsequences

| Field | Details |
|---|---|
| **Reported problem** | "1 DSA question similar to number-of-matching-subsequences" — **Close** ([LC 792](https://leetcode.com/problems/number-of-matching-subsequences/)) |
| **Source** | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) · Apr 2025 · Software Engineer, 1 YOE (startup), Bengaluru — **Selected** |
| **Round** | Technical round 1 (50 min; also SQL vs NoSQL, microservices, Spring filters, AuthN vs AuthZ) |
| **Difficulty** | Medium |
| **Pattern** | "Waiting buckets" per next-needed character (or index lists + binary search) |
| **Frequency** | LOW |

Given a string `s` and a list of `words`, count how many words are subsequences of `s`.

**Brute force**: for each word, two-pointer scan over `s` → O(W · |s|). With 5000 words and |s| = 5·10⁴ that's 2.5·10⁸ — too slow.

**Optimal (buckets)**: put every word in the bucket of the character it is **waiting for**. Scan `s` once; for each character `c`, advance every word waiting on `c` and move it to its next bucket. Each word character is processed once.

```
 s = "abcde", words = ["a","bb","acd","ace"]
 start      a:[a, acd, ace]  b:[bb]
 read 'a'   → "a" done ✔; acd waits 'c'; ace waits 'c'
 read 'b'   → bb waits 'b' again
 read 'c'   → acd waits 'd'; ace waits 'e'
 read 'd'   → acd done ✔
 read 'e'   → ace done ✔           answer = 3 ("bb" never completes)
```

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

class MatchingSubsequences {
    static int count(String s, String[] words) {
        List<Deque<int[]>> waiting = new ArrayList<>();          // per char: {wordIndex, nextPos}
        for (int c = 0; c < 26; c++) waiting.add(new ArrayDeque<>());
        for (int w = 0; w < words.length; w++) waiting.get(words[w].charAt(0) - 'a').add(new int[]{w, 0});
        int done = 0;
        for (char ch : s.toCharArray()) {
            Deque<int[]> bucket = waiting.get(ch - 'a');
            int size = bucket.size();                            // only words waiting BEFORE this char
            for (int k = 0; k < size; k++) {
                int[] item = bucket.poll();
                int next = item[1] + 1;
                String word = words[item[0]];
                if (next == word.length()) done++;
                else waiting.get(word.charAt(next) - 'a').add(new int[]{item[0], next});
            }
        }
        return done;
    }
}
```

**Time**: O(|s| + total length of words). **Space**: O(number of words).
**Follow-ups**: the same `s`, millions of queries → precompute `positions[c]` and binary-search the next index (`O(|word| log |s|)` per word) · Unicode strings → map instead of array · "is subsequence" for one word ([LC 392](https://leetcode.com/problems/is-subsequence/)).
**🗣️ Interview mein aise bolo**: "Har word ko uske agle zaroori character ki line mein khada kar deta hoon — jaise bank counters. `s` ko ek hi baar padhta hoon; jo character aaya, us line ke log ek step aage badh jaate hain."

---

## 4. Longest Common Prefix → Longest Common Substring (follow-up)

| Field | Details |
|---|---|
| **Reported problem** | "Given list of words find the longest common prefix among them", then "flipped the question to find longest common substring among words" — **Exact** ([LC 14](https://leetcode.com/problems/longest-common-prefix/)) + follow-up |
| **Source** | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) · Apr 2025 · SDE-1, 1.7 YOE (SAP Labs, Angular + Spring Boot) — **Selected** |
| **Round** | Extra (4th) round for another team — "team fit + Java/Spring Boot" |
| **Difficulty** | Easy → Hard-ish follow-up |
| **Pattern** | Vertical scan / Trie → DP (two strings) |
| **Frequency** | LOW |

**Brute force (prefix)**: take the first word, try every prefix length, check all words → O(n · m²).
**Optimal (prefix)**: vertical scanning — compare column by column, stop at the first mismatch → O(total characters). The candidate also mentioned a **Trie**; that helps when you must answer many prefix queries.

**Follow-up (substring)** for two strings: DP where `dp[i][j]` = length of the common substring **ending** at `a[i-1]` and `b[j-1]`. For many words, a common trick is: generate substrings of the shortest word (longest first) and check them in every word.

```java
class CommonPrefixSubstring {
    static String longestCommonPrefix(String[] words) {
        if (words.length == 0) return "";
        for (int col = 0; col < words[0].length(); col++) {
            char c = words[0].charAt(col);
            for (int w = 1; w < words.length; w++) {
                if (col == words[w].length() || words[w].charAt(col) != c) return words[0].substring(0, col);
            }
        }
        return words[0];
    }

    static String longestCommonSubstring(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        int bestLen = 0, bestEnd = 0;                           // end index in a (exclusive)
        for (int i = 1; i <= a.length(); i++)
            for (int j = 1; j <= b.length(); j++)
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;            // extend the diagonal run
                    if (dp[i][j] > bestLen) { bestLen = dp[i][j]; bestEnd = i; }
                }                                               // else stays 0: run broken
        return a.substring(bestEnd - bestLen, bestEnd);
    }
}
```

**Dry run (substring)** `a = "abcde"`, `b = "zbcdy"`: diagonal `b,c,d` gives 1, 2, 3 → answer `"bcd"`.
**Time**: prefix O(n·m) · substring O(|a|·|b|). **Space**: prefix O(1) · substring O(|a|·|b|) (can be O(|b|) with two rows).
**Follow-ups**: prefix for 10⁵ words with queries → Trie · substring for many strings → suffix automaton / binary search + hashing (mention only).
**🗣️ Interview mein aise bolo**: "Prefix ke liye column-wise compare karta hoon, pehle mismatch pe ruk jaata hoon. Substring mein 'ending at' wali DP lagti hai — mismatch pe run 0 ho jaata hai, isliye subsequence wali DP se alag hai."

---

## 5. Group Anagrams *(you asked for it — reported at Senior level)*

| Field | Details |
|---|---|
| **Reported problem** | "Group Anagrams : leetcode.com/problems/group-anagrams" — **Exact** ([LC 49](https://leetcode.com/problems/group-anagrams/)) |
| **Source** | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) · Jul 2021 · **Senior** SWE, Bangalore (offer) — not early-career, older |
| **Round** | Technical round 3 (DS/Algo) |
| **Difficulty** | Medium |
| **Pattern** | HashMap with a **canonical key** (sorted letters or letter counts) |
| **Frequency** | LOW |

**Brute force**: compare every pair of words by sorting both → O(n² · k log k).
**Optimal**: key = sorted characters (`"eat" → "aet"`) or a 26-count signature; group in a map → O(n · k log k) or O(n · k).

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class AnagramGroups {
    static List<List<String>> group(String[] words) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String w : words) {
            int[] count = new int[26];
            for (char c : w.toCharArray()) count[c - 'a']++;
            StringBuilder key = new StringBuilder();              // "1#0#0#...": letter counts
            for (int c : count) key.append(c).append('#');
            groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }
}
```

**Dry run**: `["eat","tea","tan","ate","nat","bat"]` → keys: eat/tea/ate share one key; tan/nat share one; bat alone → 3 groups.
**Time**: O(n · k). **Space**: O(n · k).
**Follow-ups**: unicode input (use `Map<Character,Integer>` or sort) · why not `int[]` as the map key? (arrays use identity `equals`/`hashCode` → must convert to String/List) · stream the words from a file (same idea, keys in a map).
**🗣️ Interview mein aise bolo**: "Anagram ka matlab same letters same count. Toh har word ka ek 'fingerprint' banata hoon — count array — aur same fingerprint wale ek group mein. `int[]` ko direct key nahi bana sakte kyunki uska `hashCode` identity-based hai."

---

## 6. Palindrome check → all palindromic substrings

| Field | Details |
|---|---|
| **Reported problem** | "Check whether a string is a palindrome or not" (**Exact**) · "Print all the palindromic sub-strings in the given string" (**Exact**, [LC 647](https://leetcode.com/problems/palindromic-substrings/) counts them) |
| **Source** | [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) (Jul 2025, SWE 2 YOE, Bangalore, in-person) · [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/) (Jan 2024, NCG) |
| **Round** | Technical round 1 in both |
| **Difficulty** | Easy → Medium |
| **Pattern** | Two pointers → expand around centre |
| **Frequency** | MEDIUM (2 reports) |

**Brute force**: every substring (O(n²)) × palindrome check (O(n)) = O(n³).
**Optimal**: every palindrome has a centre — a character (odd length) or a gap (even length). Expand from all `2n − 1` centres → O(n²) total, O(1) extra space.

```
 "abba": centres  a | b | b | a  and the gaps between
 gap between b,b → "bb" → expand → "abba"
 all: a, b, b, a, bb, abba
```

```java
import java.util.ArrayList;
import java.util.List;

class Palindromes {
    static boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) if (s.charAt(i++) != s.charAt(j--)) return false;
        return true;
    }

    static List<String> allPalindromicSubstrings(String s) {
        List<String> out = new ArrayList<>();
        for (int centre = 0; centre < 2 * s.length() - 1; centre++) {
            int left = centre / 2, right = left + centre % 2;      // odd: same index, even: neighbours
            while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
                out.add(s.substring(left, right + 1));
                left--;
                right++;
            }
        }
        return out;
    }
}
```

**Time**: check O(n) · all substrings O(n²) centres/expansions (plus output size). **Space**: O(1) extra.
**Follow-ups**: ignore case and non-letters ([LC 125](https://leetcode.com/problems/valid-palindrome/)) · longest palindromic substring ([LC 5](https://leetcode.com/problems/longest-palindromic-substring/)) · only **distinct** palindromes (put in a `Set`).
**🗣️ Interview mein aise bolo**: "Har palindrome ka ek centre hota hai. 2n−1 centres se bahar ki taraf expand karta hoon — O(n²), extra space nahi."

---

## 7. Two O(1) maths questions (pen and paper, onsite)

| Field | Details |
|---|---|
| **Reported problems** | (a) "Given n, find number of pairs (a, b) such that a + b = n where a > 0 and b > 0 (expected O(1))" — n = 3 → (1,2), (2,1) → 2. (b) "Two teams A and B with sorted strengths; each round the weakest player (A's if tied across teams) is eliminated; return the winning team (expected O(1))" — **Exact** (candidate's words) |
| **Source** | [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) · Feb 2025 · **SWE-I, 1.5 YOE** · onsite, pen and paper |
| **Round** | Technical round 2 (DSA), after Word Ladder |
| **Difficulty** | Easy (the trick is to *see* it) |
| **Pattern** | Maths / invariant thinking |
| **Frequency** | LOW |

**Brute force**: (a) loop `a = 1..n−1` → O(n). (b) simulate the eliminations → O(|A| + |B|).
**Optimal**:
- (a) `a` can be `1..n−1` and `b = n − a` is then fixed and positive → **n − 1** pairs (0 if n < 2).
- (b) The weakest players always leave first, so the **last survivor is the strongest player overall**. If the two maxima are equal, the tie rule removes A's player → **B wins**. Arrays are sorted, so compare the last elements → O(1).

```java
class OnePassPuzzles {
    static long orderedPairsWithSum(long n) {
        return Math.max(0, n - 1);                       // a = 1..n-1, b = n - a
    }

    static char winningTeam(int[] a, int[] b) {          // both sorted ascending, non-empty
        int maxA = a[a.length - 1], maxB = b[b.length - 1];
        return maxA > maxB ? 'A' : 'B';                   // equal maxima → A's player is removed first
    }
}
```

**Dry run (b)**: A = [1, 4, 9], B = [2, 9] → max 9 vs 9 → tie → last round eliminates A's 9 → **B**.
**Time/Space**: O(1) / O(1).
**Follow-ups**: (a) unordered pairs → `(n − 1) / 2` · pairs with `a, b ≥ 0` → `n + 1` · (b) what if arrays are not sorted? → O(n) to find the max.
**🗣️ Interview mein aise bolo**: "Simulation se pehle socho kaun kabhi eliminate nahi hoga — sabse strong player. Toh jawab sirf dono teams ke max compare karke mil jaata hai."

---

## 8. Count repeated words in a text

| Field | Details |
|---|---|
| **Reported problem** | "Just count the number of repeating words in a given text string (didn't need to handle edge cases). Could be easily solved with an unordered_map." — **Exact** |
| **Source** | [LC-7244496](https://leetcode.com/discuss/post/7244496/hired-by-visa-for-summer-intern-by-martt-tb4g/) · Oct 2025 · summer intern, on-campus (selected) |
| **Round** | Single interview round, after the project discussion |
| **Difficulty** | Easy |
| **Pattern** | HashMap frequency count |
| **Frequency** | LOW |

**Brute force**: for each word, scan all words → O(n²). **Optimal**: one pass with a map.

```java
import java.util.LinkedHashMap;
import java.util.Map;

class RepeatedWords {
    static Map<String, Integer> repeated(String text) {
        Map<String, Integer> freq = new LinkedHashMap<>();                 // keeps first-seen order
        for (String w : text.toLowerCase().split("[^a-z0-9']+")) {
            if (!w.isEmpty()) freq.merge(w, 1, Integer::sum);
        }
        freq.values().removeIf(c -> c < 2);                                // keep only repeats
        return freq;
    }

    public static void main(String[] args) {
        System.out.println(repeated("Visa pays. Visa settles, and Visa secures; pays again!"));
    }
}
```

```text
{visa=3, pays=2}
```

**Time**: O(n). **Space**: O(distinct words).
**Follow-ups**: top-k most frequent words ([LC 692](https://leetcode.com/problems/top-k-frequent-words/), heap) · the text is a 10 GB file → stream it line by line; if the map doesn't fit in memory, hash-partition words into files first ([DSA 8/8](08-file-and-log-processing.md)).
**🗣️ Interview mein aise bolo**: "Normalise karta hoon — lowercase, punctuation hatao — phir ek pass mein HashMap. Order chahiye toh LinkedHashMap."

---

## 9. Single Number II

| Field | Details |
|---|---|
| **Reported problem** | "single number: leetcode.com/problems/single-number-ii" — **Exact** ([LC 137](https://leetcode.com/problems/single-number-ii/)) |
| **Source** | [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) · Feb 2025 · on-campus NCG |
| **Round** | Technical round 3 (4 questions: level order, min depth, Single Number II, sliding window max) |
| **Difficulty** | Medium |
| **Pattern** | Bit counting modulo 3 |
| **Frequency** | LOW |

Every number appears **three** times except one that appears once. Find it in O(n) time, O(1) space.
**Brute force**: HashMap counts → O(n) time, O(n) space.
**Optimal**: for each of the 32 bit positions, count how many numbers have that bit set; `count % 3` is the bit of the single number (works for negatives too).

```java
class SingleNumberII {
    static int single(int[] nums) {
        int result = 0;
        for (int bit = 0; bit < 32; bit++) {
            int count = 0;
            for (int x : nums) count += (x >>> bit) & 1;
            if (count % 3 != 0) result |= 1 << bit;       // leftover bit belongs to the single number
        }
        return result;
    }
}
```

**Dry run**: `[2, 2, 3, 2]` → bit0 counts: 0+0+1+0 = 1 → 1; bit1: 1+1+1+1 = 4 → 1 → result `11₂ = 3`.
**Time**: O(32 · n). **Space**: O(1).
**Follow-ups**: the "ones/twos" bitmask trick (same complexity, one pass) · every number twice except one → XOR ([LC 136](https://leetcode.com/problems/single-number/)).
**🗣️ Interview mein aise bolo**: "Har bit position pe count karo; teen-teen baar aane wale numbers har bit ko 3 ke multiple mein contribute karte hain. Jo bacha — `% 3` — woh single number ka bit hai."

---

## 10. Quick ones (asked once each)

| Problem | Source · level · round | Idea |
|---|---|---|
| Remove characters from string 1 that are not in string 2 (**Exact**) | [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) · NCG · R2 | Set of chars of string 2, filter string 1 → O(n + m) |
| Validate a parentheses string **without a stack** (**Exact**) | [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) · NCG · R2 | One bracket type → a counter that must never go below 0 and end at 0 |
| Lock toggling after N passes (**Close**, = [LC 319 Bulb Switcher](https://leetcode.com/problems/bulb-switcher/)) | [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) · NCG · R1 | Lock `i` toggles once per divisor; only perfect squares have an odd count → `⌊√N⌋` open |
| Add two binary strings (**Exact**, [LC 67](https://leetcode.com/problems/add-binary/)) | [LC-7535007](https://leetcode.com/discuss/post/7535007/visa-senior-sde-interview-by-anonymous_u-xonj/) · Senior · R1 | Right-to-left with carry |
| Print numbers missing from the second array (**Close**) | [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/) · Senior · R1 | Put array 2 in a set (or counts), print array-1 values not in it |
| Hand of Straights — interviewer insisted on O(n) (**Exact**, [LC 846](https://leetcode.com/problems/hand-of-straights/)) | [LC-7564195](https://leetcode.com/discuss/post/7564195/visa-staff-se-backend-r-1-by-debmalyapan-nw6e/) · Staff · R1 | Count map; for each card walk **down** to the start of its run, then consume runs upward → each value visited O(1) times amortised |

```java
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

class QuickOnes {
    static String keepCommonChars(String s1, String s2) {
        Set<Character> allowed = new HashSet<>();
        for (char c : s2.toCharArray()) allowed.add(c);
        StringBuilder sb = new StringBuilder();
        for (char c : s1.toCharArray()) if (allowed.contains(c)) sb.append(c);
        return sb.toString();
    }

    static boolean balancedWithoutStack(String s) {           // only '(' and ')'
        int open = 0;
        for (char c : s.toCharArray()) {
            open += (c == '(') ? 1 : -1;
            if (open < 0) return false;                        // a ')' with nothing to close
        }
        return open == 0;
    }

    static int openLocksAfterNPasses(int n) {
        return (int) Math.sqrt(n);                             // perfect squares 1, 4, 9, ... ≤ n
    }

    static String addBinary(String a, String b) {
        StringBuilder sb = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            sb.append(sum % 2);
            carry = sum / 2;
        }
        return sb.reverse().toString();
    }

    static boolean handOfStraights(int[] hand, int groupSize) {   // O(n) expected with hashing
        if (hand.length % groupSize != 0) return false;
        Map<Integer, Integer> count = new HashMap<>();
        for (int c : hand) count.merge(c, 1, Integer::sum);
        for (int card : hand) {
            int start = card;
            while (count.getOrDefault(start - 1, 0) > 0) start--;      // walk to the start of this run
            while (start <= card) {                                  // consume groups from the start
                int need = count.getOrDefault(start, 0);
                if (need == 0) { start++; continue; }
                for (int v = start; v < start + groupSize; v++) {
                    int have = count.getOrDefault(v, 0);
                    if (have < need) return false;
                    count.put(v, have - need);
                }
                start++;
            }
        }
        return true;
    }
}
```

**Hand of Straights note**: the common O(n log n) answer sorts or uses a `TreeMap`. The O(n) idea — "go down to where the run starts, then consume upward" — is exactly what that interviewer pushed for ([LC-7564195](https://leetcode.com/discuss/post/7564195/visa-staff-se-backend-r-1-by-debmalyapan-nw6e/), Staff level).

---

⚡ **Quick revision**: 2Sum = map of complements · 3Sum = sort + two pointers (O(n²)) · anagrams = count signature key · palindromes = expand around 2n−1 centres · subsequence batches = waiting buckets · "last survivor" puzzles → look for an invariant.

Next: [DSA 2/8 — Sliding window & the IP rate limiter →](02-sliding-window-and-rate-limiter.md)
