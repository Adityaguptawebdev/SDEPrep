# OA Questions 1/3 — Arrays · Strings · HashMap · Two Pointers · Sliding Window

> Every question here was **reported by a real Visa candidate**. Each one has a status tag:
> - **Exact** — the full statement was visible in a candidate's screenshot.
> - **Reported** — the candidate described it in their own words (details may be missing).
> - **Reconstructed** — "Reported variation / reconstructed from candidate experience": we filled missing rules; the assumption is written down.
>
> Frequency: **HIGH** = 3+ independent reports · **MEDIUM** = 2 · **LOW** = 1. All Java below is compiled and tested against brute force on random inputs.

**Easy analogy — OA = cricket powerplay**: Pehle 2 overs (Q1, Q2) mein **tez singles** lo — 15 minute ke andar dono khatam. Beech ke overs (Q3) mein wicket mat gawao — lamba implementation, dhyaan se. Last over (Q4) mein bade shots — agar poora nahi bana, toh partial test cases bhi runs hain.

| # | Question | Difficulty | Freq | Status | Source |
|---|---|---|---|---|---|
| A1 | Time machine — cost of travelling through years | Easy | LOW | Exact | [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) |
| A2 | First index where the running score reaches a target | Easy | LOW | Reported | [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) |
| A3 | Sum of elements greater than both neighbours | Easy | LOW | Reconstructed | [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) |
| A4 | Sort the deck with one "top-k to bottom" move | Easy | LOW | Exact | [LC-7308784](https://leetcode.com/discuss/post/7308784/visa-oa-question-array-by-anonymous_user-zbxs/) |
| A5 | Count alternating-parity ("soowath") subarrays | Medium | LOW | Reconstructed | [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) |
| A6 | Memory allocator | Medium | MEDIUM | Reported (≈ LC 2502) | [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) |
| S1 | Bus departures in "HH:MM" | Easy | **HIGH** (4) | Reported | [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/), [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) |
| S2 | Count length-3 substrings with a property | Easy | MEDIUM | Reported | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-7354481](https://leetcode.com/discuss/post/7354481/visa-codesignal-17112025-failed-by-node-pndhb/) |
| S3 | Reverse a word if its first and last letters are vowels | Easy | LOW | Reported | [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) |
| S4 | Digit-wise sum of two number strings | Easy | LOW | Exact | [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) |
| S5 | Merge runs of equal digits into their sum, repeat | Easy-Medium | LOW | Reconstructed | [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) |
| S6 | Newspaper / text justification with `*` border | Medium (implementation) | **HIGH** (3) | Reconstructed | [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/), [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/), [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) |
| H1 | House segments after each demolition | Medium | LOW | Exact | [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/) |
| H2 | Longest common prefix between numbers of two arrays | Medium | MEDIUM | Reported (= LC 3043) | [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/), [LC-3300169](https://leetcode.com/discuss/post/3300169/visa-sse-oa-unique-problem-by-anonymous_-nvdu/) |
| H3 | Grid cells that are the odd one out in their row and column | Medium | LOW | Reconstructed | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) |
| T1 | Two lists: beat `a[i]` with `b[j]` without reordering `a` | Medium | LOW | Reported, unclear | [LC-7561130](https://leetcode.com/discuss/post/7561130/visa-oa-coding-expert-by-anonymous_user-pvbu/) |
| W1 | Subarrays with at least `k` distinct values | Medium | MEDIUM (family) | Reported | [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) |
| W2 | Subarrays with at least `k` equal pairs | Medium | MEDIUM (family) | Exact | [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) |

---

## Arrays

### A1. Time machine — Easy · LOW · Exact

**Source**: [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) · Jun 2025 · Staff applicant, Bengaluru · CodeSignal OA Q1. (Senior applicant, but this is the classic CodeSignal Q1 style that freshers also get.)

**Problem**: You start in `years[0]` and must visit `years[1]`, `years[2]`, … in order. Moving between equal years costs 0 h, going forward costs 1 h, going backward costs 2 h. Return the total hours.
Example: `[2000, 1990, 2005, 2050]` → `2 + 1 + 1 = 4`.

**Pattern**: single pass over adjacent pairs.

```java
class TimeMachine {
    static int totalHours(int[] years) {
        int hours = 0;
        for (int i = 1; i < years.length; i++) {
            if (years[i] > years[i - 1]) hours += 1;        // forward in time
            else if (years[i] < years[i - 1]) hours += 2;   // backward in time
        }
        return hours;
    }
}
```

**Complexity**: O(n) time, O(1) space. **Trap**: none — this is a "finish in 3 minutes" question. Aise questions pe time bachao.

### A2. First index where the running score reaches a target — Easy · LOW · Reported

**Source**: [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) · Dec 2025 · Senior applicant · CodeSignal Q1 ("took 2 mins").

**Problem (as reported)**: Add scores from index 0; return the first index where the running total becomes `>= target`, else `-1`.

**Pattern**: prefix sum, stop early.

```java
class RunningScore {
    static int firstIndexReaching(int[] scores, long target) {
        long sum = 0;                         // long: many large scores can overflow int
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
            if (sum >= target) return i;
        }
        return -1;
    }
}
```

**Complexity**: O(n) / O(1). **Trap**: use `long` for sums in CodeSignal — hidden tests love overflow.

### A3. Sum of elements greater than both neighbours — Easy · LOW · Reconstructed

**Source**: [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) · Aug 2025 · 2-month SDE intern, on-campus · CodeSignal Q1.

**Problem**: "Return the sum of elements in the array that are greater than both of their neighbours."
**Assumption**: the first and last elements have only one neighbour, so we skip them (check the statement in your test — some versions treat a missing neighbour as `-∞`).

```java
class NeighbourPeakSum {
    static long sumOfLocalPeaks(int[] a) {
        long sum = 0;
        for (int i = 1; i + 1 < a.length; i++) {
            if (a[i] > a[i - 1] && a[i] > a[i + 1]) sum += a[i];
        }
        return sum;
    }
}
```

**Complexity**: O(n) / O(1).

### A4. Sort the deck with one shuffle move — Easy · LOW · Exact

**Source**: [LC-7308784](https://leetcode.com/discuss/post/7308784/visa-oa-question-array-by-anonymous_user-zbxs/) · Oct 2025 · posted as "Visa OA question".

**Problem**: A deck is a permutation of `1..n`. In one move you take the top `k` cards (`0 ≤ k < n`) and put them at the bottom in the same order. Return the smallest `k` that makes the deck sorted after **exactly one** move, or `-1`.
`[3,4,5,1,2]` → `3` · `[1,2,3,4,5]` → `0` · `[3,2,1]` → `-1`.

**Pattern**: "is this a rotation of the sorted array?" After the move, card `1` must be on top, so `k` **must be the index of 1** — there is only one candidate.

```java
class OneShuffleSort {
    static int minTopCards(int[] deck) {
        int n = deck.length, k = 0;
        while (deck[k] != 1) k++;                       // the card '1' must come to the top
        for (int i = 0; i < n; i++) {
            if (deck[(k + i) % n] != i + 1) return -1;  // read the deck starting from k
        }
        return k;
    }
}
```

**Complexity**: O(n) / O(1). **Explain like this**: "Rotation mein sirf ek hi valid starting point ho sakta hai — jahan 1 hai. Toh try karne ko kuch nahi, bas verify karna hai."

### A5. Count alternating-parity ("soowath") subarrays — Medium · LOW · Reconstructed

**Source**: [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) · Oct 2025 · summer intern, on-campus · CodeSignal Q4 · constraint `n ≤ 10^5` (so O(n) needed).

**Problem (from the poster's examples)**: count subarrays whose adjacent elements **always switch parity** (odd, even, odd…) **or** are **all the same parity**.
Valid: `1 2 3 4`, `1 3 5 7`, `2 3 4 7`, `4 8 2 6`. Not valid: `1 2 4`, `2 3 5`. For `[1,2,3,4]` the answer is `10`.

**Pattern**: count "runs". For each end index `i`, keep
- `alt` = length of the longest alternating run ending at `i`,
- `same` = length of the longest same-parity run ending at `i`.

Subarrays ending at `i` that are valid = `alt + same − 1` (the single element `[a[i]]` is counted in both).

```
 a      : 1   2   3   4           a      : 1   2   4
 alt    : 1   2   3   4           alt    : 1   2   1
 same   : 1   1   1   1           same   : 1   1   2
 add    : 1   2   3   4  → 10     add    : 1   2   2  → 5
```

```java
class AlternatingParitySubarrays {
    static long count(int[] a) {
        if (a.length == 0) return 0;
        long total = 1;                  // subarrays ending at index 0: just [a[0]]
        long alt = 1, same = 1;
        for (int i = 1; i < a.length; i++) {
            boolean switches = ((a[i] ^ a[i - 1]) & 1) == 1;   // works for negatives too
            alt = switches ? alt + 1 : 1;
            same = switches ? 1 : same + 1;
            total += alt + same - 1;
        }
        return total;
    }
}
```

**Complexity**: O(n) / O(1). **Trap**: `a[i] % 2` is `-1` for negative odd numbers in Java — use `& 1`.

### A6. Memory allocator — Medium · MEDIUM · Reported (≈ LeetCode 2502)

**Source**: [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/) (Oct 2025, on-campus India, Q2 "similar to LC 2502") and [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) (Apr 2026, Senior, "Allocate memory"). Exact Visa statement not public, so we solve [LC 2502 Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator/).

**Problem**: Memory of `n` units. `allocate(size, id)` → find the **leftmost** block of `size` consecutive free units, fill with `id`, return its start (or `-1`). `free(id)` → free all units with that `id`, return how many.

**Pattern**: simulation on an array ("implementation-heavy Q3" type).

```java
class MemoryAllocator {
    private final int[] memory;                  // 0 = free, otherwise the owner id

    MemoryAllocator(int n) { memory = new int[n]; }

    int allocate(int size, int id) {
        int run = 0;                             // length of the free run ending at i
        for (int i = 0; i < memory.length; i++) {
            run = (memory[i] == 0) ? run + 1 : 0;
            if (run == size) {                   // leftmost fit found
                int start = i - size + 1;
                for (int j = start; j <= i; j++) memory[j] = id;
                return start;
            }
        }
        return -1;
    }

    int free(int id) {
        int freed = 0;
        for (int i = 0; i < memory.length; i++) {
            if (memory[i] == id) { memory[i] = 0; freed++; }
        }
        return freed;
    }
}
```

**Complexity**: O(n) per call, O(n) space (fine for `n ≤ 1000`). **Follow-up they may ask**: faster allocation → keep a `TreeMap<start, length>` of free blocks (and merge neighbours on free).

---

## Strings

### S1. Bus departures in "HH:MM" — Easy · **HIGH** · Reported

**Sources** (4 independent reports):
- [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) · Dec 2025 · Senior · "return the time of the bus that departed before the current time, else `-1`" (took 30 min because of formatting and edge cases).
- [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/) · Oct 2025 · on-campus India · "most recent bus that has already left and **how many minutes ago** it departed; `-1` if none".
- [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) · Apr 2026 · Senior · "Bus departure".
- [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) · Feb 2025 · **SWE-I, 1.5 YOE** · "min **waiting time** to get the next shuttle".

**Pattern**: parse `HH:MM` → minutes since midnight, then a scan (or binary search on the sorted list). The whole difficulty is **parsing + edge cases**.

```
 "09:05"  →  9 * 60 + 5 = 545 minutes      compare numbers, not strings
 departures: 08:00  09:30  12:15           now = 10:00 (600)
               480    570    735
 last bus before now  = 09:30  (30 minutes ago)
 next bus from now    = 12:15  (wait 135 minutes)
```

```java
class BusDepartures {
    static int toMinutes(String hhmm) {                       // "HH:MM" → minutes
        return Integer.parseInt(hhmm.substring(0, 2)) * 60 + Integer.parseInt(hhmm.substring(3, 5));
    }

    // Variant 1: time of the latest bus strictly before `now`, else "-1"
    static String lastBusBefore(String[] departures, String now) {
        int cur = toMinutes(now), best = -1;
        String answer = "-1";
        for (String d : departures) {
            int m = toMinutes(d);
            if (m < cur && m > best) { best = m; answer = d; }
        }
        return answer;
    }

    // Variant 2: how many minutes ago the most recent bus left, else -1
    static int minutesSinceLastBus(String[] departures, String now) {
        String last = lastBusBefore(departures, now);
        return last.equals("-1") ? -1 : toMinutes(now) - toMinutes(last);
    }

    // Variant 3: waiting time for the next bus (departing at or after `now`), else -1
    static int waitForNextBus(String[] departures, String now) {
        int cur = toMinutes(now), best = Integer.MAX_VALUE;
        for (String d : departures) {
            int m = toMinutes(d);
            if (m >= cur) best = Math.min(best, m - cur);
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }
}
```

**Complexity**: O(n) per query, O(1) space. With many queries: convert once, sort, and use binary search (O(log n) per query).
**Traps**: (1) Is a bus leaving **exactly** at `now` "already left"? Read the statement — we used `<` for "left" and `>=` for "next". (2) Output format — return `"09:30"` exactly as given, not `"9:30"`. (3) Do not compare `"9:05"` and `"10:00"` as strings.

### S2. Count length-3 substrings with a property — Easy · MEDIUM · Reported

**Sources**:
- [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) · 2025 · new grad · CodeSignal Q1: "count all substrings of length 3 which contain at least one vowel".
- [LC-7354481](https://leetcode.com/discuss/post/7354481/visa-codesignal-17112025-failed-by-node-pndhb/) · Nov 2025 · CodeSignal Q1. The poster wrote the rule "first and last character are the same", **but their own examples** (`"" → 0`, `"abc" → 1`, `"abcxccc" → 2`) only fit **"all three characters are different"** ([LC 1876](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/)). The poster failed this OA — a good reminder to **test your code on the given examples before submitting**.

**Pattern**: fixed-size sliding window of 3.

```java
class LengthThreeWindows {
    static boolean isVowel(char c) { return "aeiouAEIOU".indexOf(c) >= 0; }

    // GFG-NCG-25: windows of length 3 with at least one vowel
    static int withVowel(String s) {
        int count = 0, vowels = 0;
        for (int i = 0; i < s.length(); i++) {
            if (isVowel(s.charAt(i))) vowels++;                     // char enters the window
            if (i >= 3 && isVowel(s.charAt(i - 3))) vowels--;       // char leaves the window
            if (i >= 2 && vowels > 0) count++;
        }
        return count;
    }

    // LC-7354481 examples: windows of length 3 with 3 different characters
    static int allDistinct(String s) {
        int count = 0;
        for (int i = 0; i + 2 < s.length(); i++) {
            char a = s.charAt(i), b = s.charAt(i + 1), c = s.charAt(i + 2);
            if (a != b && b != c && a != c) count++;
        }
        return count;
    }

    // the rule the poster wrote: first and last character equal
    static int sameEnds(String s) {
        int count = 0;
        for (int i = 0; i + 2 < s.length(); i++) if (s.charAt(i) == s.charAt(i + 2)) count++;
        return count;
    }
}
```

**Complexity**: O(n) / O(1). **Trap**: strings shorter than 3 → answer 0 (no exception).

### S3. Reverse a word if its first and last letters are vowels — Easy · LOW · Reported

**Source**: [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) · Oct 2025 · intern on-campus · CodeSignal Q2.
`["abcde","acvbn","Etuilo"]` → `["adcbe","acvbn","Eliuto"]` — the two vowel ends stay, the **middle is reversed**.

**Pattern**: two pointers / `StringBuilder.reverse()`.

```java
class ReverseVowelEnds {
    static boolean isVowel(char c) { return "aeiouAEIOU".indexOf(c) >= 0; }

    static String[] transform(String[] words) {
        String[] out = new String[words.length];
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            int n = w.length();
            if (n >= 2 && isVowel(w.charAt(0)) && isVowel(w.charAt(n - 1))) {
                String middle = new StringBuilder(w.substring(1, n - 1)).reverse().toString();
                out[i] = w.charAt(0) + middle + w.charAt(n - 1);
            } else {
                out[i] = w;
            }
        }
        return out;
    }
}
```

**Complexity**: O(total characters). **Trap**: capital vowels (`"Etuilo"` starts with `E`).

### S4. Digit-wise sum of two number strings — Easy · LOW · Exact

**Source**: [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) · Jun 2025 · CodeSignal Q2.
Add the i-th digits of `a` and `b` counted **from the end**; if one string is shorter, the missing digit is 0; concatenate the sums (no carrying!).
`"99", "99"` → `"1818"` · `"11", "9"` → `"110"`.

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class DigitWiseSum {
    static String sum(String a, String b) {
        List<Integer> parts = new ArrayList<>();
        for (int i = 0; i < Math.max(a.length(), b.length()); i++) {
            int x = i < a.length() ? a.charAt(a.length() - 1 - i) - '0' : 0;
            int y = i < b.length() ? b.charAt(b.length() - 1 - i) - '0' : 0;
            parts.add(x + y);                   // no carry: 9 + 9 stays "18"
        }
        Collections.reverse(parts);             // we built it from the end
        StringBuilder sb = new StringBuilder();
        for (int p : parts) sb.append(p);
        return sb.toString();
    }
}
```

**Complexity**: O(max(|a|, |b|)). **Trap**: `sb.insert(0, …)` inside the loop (the poster's code) is O(n²) for long strings — collect then reverse.

### S5. Merge runs of equal digits into their sum, repeat — Easy-Medium · LOW · Reconstructed

**Source**: [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) · 2024 · new grad on-campus · CodeSignal: "Replace consecutive equal digits with their sum until no consecutive digits remain".
**Assumption**: in each pass every maximal run of 2+ equal digits becomes the decimal sum of the run; repeat passes until no equal neighbours exist.
`"5588"` → `"1016"` · `"1111"` → `"4"` · `"2211"` → `"42"` · `"99"` → `"18"`.

```java
class MergeEqualDigits {
    static String reduce(String s) {
        boolean changed = true;
        while (changed) {
            changed = false;
            StringBuilder next = new StringBuilder();
            int i = 0;
            while (i < s.length()) {
                int j = i;
                while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;   // run = s[i..j-1]
                if (j - i >= 2) {
                    next.append((j - i) * (s.charAt(i) - '0'));             // run → its sum
                    changed = true;
                } else {
                    next.append(s.charAt(i));
                }
                i = j;
            }
            s = next.toString();
        }
        return s;
    }
}
```

**Why it stops**: every replacement either makes the string shorter (sum < 10) or makes the total digit sum smaller (sum ≥ 10), so the loop cannot run forever.
**Complexity**: O(n) per pass; the number of passes is small in practice.

### S6. Newspaper / text justification with a `*` border — Medium (implementation) · **HIGH** · Reconstructed

**Sources** (3 independent reports, all a variation of [LC 68 Text Justification](https://leetcode.com/problems/text-justification/)):
- [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) · Dec 2025 · "paragraphs + width, print the paragraphs on the newspaper, padding based on even or odd spaces left, add `*` around the answer" — poster could not fix the padding in time.
- [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) · Aug 2025 · intern · "text justification, **centre-align** instead of left".
- [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) · Oct 2025 · intern · "text justification with some modifications".

**Reconstructed statement**: `paragraphs[i]` is an array of words, `aligns[i]` is `LEFT`, `RIGHT` or `CENTER`, and `width` is the line width. Put the words of each paragraph on lines greedily (single space between words, never exceed `width`). Pad each line to `width` using its paragraph's alignment. For `CENTER` with an odd number of spaces, **we put the extra space on the right** (check your test's rule!). Surround the page with `*`.

```
 width = 16, aligns = [LEFT, RIGHT]
 ******************
 *hello world     *      ← LEFT: pad on the right
 *     How are you*      ← RIGHT: pad on the left
 *       doing now*
 ******************
```

```java
import java.util.ArrayList;
import java.util.List;

class NewspaperLayout {
    static List<String> layout(String[][] paragraphs, String[] aligns, int width) {
        List<String> page = new ArrayList<>();
        String border = "*".repeat(width + 2);
        page.add(border);
        for (int p = 0; p < paragraphs.length; p++) {
            List<String> line = new ArrayList<>();
            int length = 0;                                      // words + single spaces
            for (String word : paragraphs[p]) {
                int needed = line.isEmpty() ? word.length() : length + 1 + word.length();
                if (needed > width && !line.isEmpty()) {         // line is full → flush it
                    page.add(frame(String.join(" ", line), aligns[p], width));
                    line.clear();
                    needed = word.length();
                }
                line.add(word);
                length = needed;
            }
            if (!line.isEmpty()) page.add(frame(String.join(" ", line), aligns[p], width));
        }
        page.add(border);
        return page;
    }

    static String frame(String text, String align, int width) {
        int pad = width - text.length();
        String body;
        if (align.equals("RIGHT")) {
            body = " ".repeat(pad) + text;
        } else if (align.equals("CENTER")) {
            int left = pad / 2;                                  // odd extra space goes right
            body = " ".repeat(left) + text + " ".repeat(pad - left);
        } else {
            body = text + " ".repeat(pad);                       // LEFT
        }
        return "*" + body + "*";
    }
}
```

**Complexity**: O(total characters). **How to not lose time**: write `frame()` first and test it alone on 3 strings; then write the line-breaking loop. Most people lose time mixing both.

---

## HashMap

### H1. House segments after each demolition — Medium · LOW · Exact

**Source**: [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/) · Aug 2023 · CodeSignal (screenshots).
Houses are at distinct integer positions on a line (`|x| ≤ 10^9`, up to `10^5` houses). `queries` lists houses destroyed in order. After each destruction return the number of **segments** (maximal groups of adjacent houses).
`houses = [1,2,3,6,7,9]`, `queries = [6,3,7,2,9,1]` → `[3,3,2,2,1,0]`.

**Pattern**: HashSet + "what changes locally?" When house `x` is removed:

```
 left neighbour?  right neighbour?   segments
      yes              yes            +1   (one segment splits in two)
      no               no             −1   (a single-house segment disappears)
      one of them                      0   (segment just gets shorter)
```

```java
import java.util.HashSet;
import java.util.Set;

class HouseSegments {
    static int[] afterEachDemolition(int[] houses, int[] queries) {
        Set<Integer> alive = new HashSet<>();
        for (int h : houses) alive.add(h);
        int segments = 0;
        for (int h : houses) if (!alive.contains(h - 1)) segments++;   // h starts a segment
        int[] result = new int[queries.length];
        for (int q = 0; q < queries.length; q++) {
            int x = queries[q];
            alive.remove(x);
            boolean left = alive.contains(x - 1), right = alive.contains(x + 1);
            if (left && right) segments++;
            else if (!left && !right) segments--;
            result[q] = segments;
        }
        return result;
    }
}
```

**Complexity**: O(n + q) average time, O(n) space. **Trap**: recounting segments after every query is O(n·q) → TLE on `10^5`.

### H2. Longest common prefix between numbers of two arrays — Medium · MEDIUM · Reported (= LeetCode 3043)

**Sources**: [LC-3300169](https://leetcode.com/discuss/post/3300169/visa-sse-oa-unique-problem-by-anonymous_-nvdu/) (Mar 2023, Senior, "couldn't pass all test cases") and [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/) (Nov 2025, SDE-1 **US**, "exactly LC 3043", scored 0 on it for lack of time). Problem: [LC 3043](https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix/).
`[1, 2, 5, 55, 56434]` and `[3, 54, 45, 56403]` → `564` is common → answer `3`.

**Pattern**: put **every prefix** of every number of the first array in a HashSet (`56434 → 56434, 5643, 564, 56, 5`), then for each number of the second array chop digits until it hits the set. (A Trie of digits works too — see [OA 3/3](03-oa-matrix-graph-dp-simulation.md#trees-trie).)

```java
import java.util.HashSet;
import java.util.Set;

class LongestCommonNumberPrefix {
    static int longest(int[] arr1, int[] arr2) {
        Set<Integer> prefixes = new HashSet<>();
        for (int x : arr1) {
            for (int v = x; v > 0; v /= 10) prefixes.add(v);   // all prefixes of x
        }
        int best = 0;
        for (int y : arr2) {
            int v = y;
            while (v > 0 && !prefixes.contains(v)) v /= 10;    // drop last digit
            if (v > 0) best = Math.max(best, String.valueOf(v).length());
        }
        return best;
    }
}
```

**Complexity**: O((n + m) · d) time, O(n · d) space, `d ≤ 10` digits. **Trap**: comparing every pair is O(n·m·d) → TLE for `5·10^4` each (that is exactly what the 2023 poster hit).

### H3. Grid cells that are the odd one out in their row and column — Medium · LOW · Reconstructed

**Source**: [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) · 2025 · new grad · CodeSignal Q3: "find the number of cells such that all other elements in the same row and the same column are identical, except for the cell itself".
**Assumption**: count cell `(i, j)` if **all other** cells of row `i` and column `j` hold one common value `v`, and the cell's own value is **different** from `v`. A 1×1 grid has no "other" cells → not counted.

```
 1 1 1        cell (1,1) = 5 : others in row 1 → 1 1, others in column 1 → 1 1
 1 5 1        all equal (v = 1) and 5 ≠ 1  → counted
 1 1 1        answer = 1
```

**Pattern**: frequency maps per row and per column (O(n·m)), instead of scanning the row + column for every cell (O(n·m·(n+m))).

```java
import java.util.HashMap;
import java.util.Map;

class OddOneOutCells {
    static int count(int[][] g) {
        int n = g.length, m = g[0].length;
        Map<Integer, Integer>[] rowFreq = new HashMap[n], colFreq = new HashMap[m];
        for (int i = 0; i < n; i++) rowFreq[i] = new HashMap<>();
        for (int j = 0; j < m; j++) colFreq[j] = new HashMap<>();
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                rowFreq[i].merge(g[i][j], 1, Integer::sum);
                colFreq[j].merge(g[i][j], 1, Integer::sum);
            }
        int answer = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                Integer rowOther = otherValue(rowFreq[i], g[i][j], m);  // null = no "other" cells
                Integer colOther = otherValue(colFreq[j], g[i][j], n);
                if (rowOther != null && rowOther == Integer.MIN_VALUE) continue;   // others differ
                if (colOther != null && colOther == Integer.MIN_VALUE) continue;
                if (rowOther == null && colOther == null) continue;              // 1×1 grid
                if (rowOther != null && colOther != null && !rowOther.equals(colOther)) continue;
                answer++;
            }
        return answer;
    }

    // Value shared by all OTHER cells of a line (cell must be different from it).
    // null = the line has no other cells; MIN_VALUE = condition fails.
    static Integer otherValue(Map<Integer, Integer> freq, int cell, int lineLength) {
        if (lineLength == 1) return null;
        if (freq.size() != 2 || freq.get(cell) != 1) return Integer.MIN_VALUE;
        for (int v : freq.keySet()) if (v != cell) return v;
        return Integer.MIN_VALUE;
    }
}
```

**Complexity**: O(n·m) time and space. **Explain**: "Har cell ke liye poori row/column scan karna costly hai; ek baar counting karke har cell ka jawab O(1) mein."

---

## Two Pointers

### T1. Two lists — beat `a[i]` with `b[j]` without reordering `a` — Medium · LOW · Reported (unclear)

**Source**: [LC-7561130](https://leetcode.com/discuss/post/7561130/visa-oa-coding-expert-by-anonymous_user-pvbu/) · Feb 2026 · "Coding-Expert" test, Q2: "check how many `b[j] > a[i]` and return the maximum… you can not rearrange list `a`".
The statement is incomplete. The closest well-known problem is **[LC 870 Advantage Shuffle](https://leetcode.com/problems/advantage-shuffle/)**: arrange `b` so that the number of positions with `b[i] > a[i]` is maximum. *This mapping is our guess.*

**Pattern**: greedy + sorting + two pointers — beat each `a` value with the **smallest** `b` that still beats it; waste the weakest `b` values on `a` values you can't beat.

```java
import java.util.Arrays;

class AdvantageShuffle {
    static int[] arrange(int[] a, int[] b) {
        int n = a.length;
        Integer[] order = new Integer[n];                       // indices of a, by value
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (x, y) -> Integer.compare(a[x], a[y]));
        int[] sortedB = b.clone();
        Arrays.sort(sortedB);
        int[] result = new int[n];
        int lo = 0, hi = n - 1;                                 // pointers into sortedB
        for (int k = n - 1; k >= 0; k--) {                      // strongest a first
            int idx = order[k];
            if (sortedB[hi] > a[idx]) result[idx] = sortedB[hi--];   // beat it with our best
            else result[idx] = sortedB[lo++];                         // sacrifice our worst
        }
        return result;
    }
}
```

**Complexity**: O(n log n) / O(n).

---

## Sliding Window

### W1. Subarrays with at least `k` distinct values — Medium · MEDIUM (family) · Reported

**Source**: [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) · Aug 2025 · intern on-campus · CodeSignal Q4 (poster solved it only partially).
Count contiguous subarrays that contain **at least** `k` distinct values.

**Pattern**: "at least k" = **all subarrays − at most (k−1)**, and "at most" is a standard variable window.

```java
import java.util.HashMap;
import java.util.Map;

class AtLeastKDistinct {
    static long count(int[] a, int k) {
        long n = a.length;
        return n * (n + 1) / 2 - atMost(a, k - 1);
    }

    static long atMost(int[] a, int k) {
        if (k < 0) return 0;
        Map<Integer, Integer> freq = new HashMap<>();
        long result = 0;
        int left = 0;
        for (int right = 0; right < a.length; right++) {
            freq.merge(a[right], 1, Integer::sum);
            while (freq.size() > k) {                          // too many distinct → shrink
                if (freq.merge(a[left], -1, Integer::sum) == 0) freq.remove(a[left]);
                left++;
            }
            result += right - left + 1;                        // windows ending at right
        }
        return result;
    }
}
```

**Complexity**: O(n) average / O(n). **Trap**: the answer can be ~`n²/2 = 5·10^9` for `n = 10^5` → `long`.

### W2. Subarrays with at least `k` equal pairs — Medium · MEDIUM (family) · Exact

**Source**: [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) · Jun 2025 · CodeSignal Q3. Fruits on a conveyor belt; count subarrays that contain **at least `k` non-overlapping pairs** of equal fruits (each fruit used in one pair). For `[1,3,3,1]`, `k = 1` → `[1,3,3]`, `[3,3,1]`, `[1,3,3,1]`, `[3,3]` → `4`.
The poster wrote an O(n²) double loop — fine for small inputs, risky for big hidden tests.

**Pattern**: pairs in a window = Σ ⌊count/2⌋. Adding elements never removes pairs, so for each `right` we keep `left` as far right as possible while the window still has `≥ k` pairs; then every start `0..left` works.

```java
import java.util.HashMap;
import java.util.Map;

class AtLeastKPairs {
    static long count(int[] fruits, int k) {
        long n = fruits.length;
        if (k <= 0) return n * (n + 1) / 2;
        Map<Integer, Integer> freq = new HashMap<>();
        long result = 0;
        int pairs = 0, left = 0;
        for (int right = 0; right < fruits.length; right++) {
            int c = freq.merge(fruits[right], 1, Integer::sum);
            if (c % 2 == 0) pairs++;                           // completed a new pair
            while (left <= right) {                            // try dropping fruits[left]
                int cl = freq.get(fruits[left]);
                int pairsIfDropped = (cl % 2 == 0) ? pairs - 1 : pairs;
                if (pairsIfDropped < k) break;
                freq.put(fruits[left], cl - 1);
                pairs = pairsIfDropped;
                left++;
            }
            if (pairs >= k) result += left + 1;                // starts 0..left are valid
        }
        return result;
    }
}
```

**Complexity**: O(n) average / O(n).

---

⚡ **Quick revision**: time strings → minutes · "at least k" → total − "at most k−1" · local-change counting (house segments) beats recounting · all prefixes in a HashSet (LC 3043) · write the formatting helper first in text problems.

Next: [OA 2/3 — Stack · Queue · Binary Search · Sorting · Heap · Maths →](02-oa-stack-queue-search-sorting-heap.md)
