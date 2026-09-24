# 3. Strings

> 📍 **Syllabus**: Unit 1 — Basics · Topic 3 / 29 · Pehle chahiye: [Arrays](02-arrays.md)

> **Standard definition**: A sequence of characters stored in order, usually treated as a read-only (immutable) array of characters; in Java, `String` objects are immutable, so every modification creates a new string.

**Ek line mein**: String = **characters ki array**, bas Java mein ek **badi shart** ke saath — ek baar ban gayi toh **badli nahi ja sakti** (immutable).

**Trick yaad rakhne ki**: *"Marble pe khodha hua naam vs whiteboard"* —
- **`String`** = marble ki plate pe khodha naam. Ek akshar badalna ho toh **poori nayi plate** banwani padegi.
- **`StringBuilder`** = whiteboard. **Mita ke, jodke, ulta** — jitna chaho badlo, wahi board.

Isliye jab bhi string ko **baar-baar badalna** ho (loop mein), **StringBuilder** lo.

**Kab use karo**: Text ka koi bhi kaam — **palindrome, anagram, substring, parsing, pattern matching**. Aadhe interview problems mein string kisi na kisi roop mein hoti hai.

## String andar se kaisi hoti hai

```
s = "hello"

index:    0    1    2    3    4
        ┌────┬────┬────┬────┬────┐
        │ 'h'│ 'e'│ 'l'│ 'l'│ 'o'│      ← bilkul character array jaisi
        └────┴────┴────┴────┴────┘
s.length() = 5      s.charAt(1) = 'e'      last index = length - 1 = 4
```

**Characters ka number bhi hota hai (ASCII)** — isse bahut tricks bante hain:

```
'0'..'9'  →  48..57        'A'..'Z'  →  65..90        'a'..'z'  →  97..122

'c' - 'a' = 2      ← letter ko 0..25 index mein badalna (a=0, b=1, c=2 ...)
'7' - '0' = 7      ← digit character ko asli number banana
```

## Java String ke methods aur unki cost

| Method | Time | Note |
|---|---|---|
| `s.length()` | O(1) | Bracket `()` lagta hai (array mein nahi) |
| `s.charAt(i)` | O(1) | i-th character |
| `s.substring(a, b)` | O(b − a) | `b` **exclusive** hai; naya copy banta hai |
| `s.equals(t)` | O(n) | **Content** compare — `==` mat use karo |
| `s.indexOf(t)` | O(n·m) worst | Pattern dhoondhna |
| `s + t` | O(n + m) | Nayi string banti hai |
| `s.toCharArray()` | O(n) | Badalne ke liye char array |
| `sb.append(x)` | O(1) amortized | StringBuilder ka jaadu |

## Code example 1 — Character tricks aur `==` vs `equals`

```java
public void charTricks() {
    String s = "hello";
    char c = s.charAt(1);                 // 'e'
    int idx = c - 'a';                    // 4  → 🔑 letter ko 0..25 index mein badalne ka trick
    char next = (char) (c + 1);           // 'f' → char + int = int hota hai, isliye (char) cast zaroori
    int digit = '7' - '0';                // 7   → digit character ko number banana

    boolean d = Character.isDigit('7');            // true
    boolean l = Character.isLetter('x');           // true
    boolean a = Character.isLetterOrDigit('_');    // false
    char lower = Character.toLowerCase('Q');       // 'q'

    char[] arr = s.toCharArray();         // String badal nahi sakte, isliye char array lo
    arr[0] = 'J';
    String changed = new String(arr);     // "Jello"
}

public void equality() {
    String a = "hi";
    String b = "hi";
    String c = new String("hi");
    System.out.println(a == b);           // true  → dono String Pool ke same object ko point karte hain
    System.out.println(a == c);           // false → c naya object hai (address alag)
    System.out.println(a.equals(c));      // true  → 🔑 content compare karna ho toh HAMESHA equals()
}
```

## Code example 2 — StringBuilder (loop mein string jodna)

```java
public String buildString(int n) {
    // ❌ Slow — har += pe poori nayi string banti hai: O(n²)
    String slow = "";
    for (int i = 0; i < n; i++) slow += "x";

    // ✅ Fast — StringBuilder ek hi buffer ko badhata hai: O(n)
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) sb.append("x");

    sb.append(42).append('!');            // chain kar sakte ho
    sb.insert(0, ">>");                   // start mein insert  (O(n))
    sb.setCharAt(2, 'X');                 // ek character badalna
    sb.reverse();                         // in-place ulta
    sb.deleteCharAt(sb.length() - 1);     // last character hatao
    return sb.toString();                 // aakhir mein String bana lo
}
```

**Line by line samjho**: `slow += "x"` har baar purani string ko copy karke nayi banata hai — 1 + 2 + 3 + ... + n copies = **O(n²)**. `StringBuilder` andar ek badhne wali char array rakhta hai (jaise `ArrayList`), isliye `append` amortized O(1).

## Code example 3 — Palindrome (do pointers, dono sire se)

**Trick**: *"Aaine ke saamne khade ho"* — pehla akshar aakhri se match, doosra doosre-aakhri se... beech tak.

```java
// Valid Palindrome — sirf letters/digits dekho, case ignore karo
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        // 🔑 letters/digits ke alawa sab (space, comma, ...) skip karo
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;

        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;                 // ek bhi jodi match nahi hui → palindrome nahi
        }
        left++;
        right--;
    }
    return true;
}
```

## Code example 4 — Anagram (26 letters ki ginti)

**Trick**: *"Scrabble ke tiles"* — dono words ke tiles ki ginti barabar hai toh anagram.

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    int[] count = new int[26];                  // 🔑 a-z ke liye 26 dabbe
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;             // s ke letter pe +1
        count[t.charAt(i) - 'a']--;             // t ke letter pe −1
    }
    for (int x : count) {
        if (x != 0) return false;               // koi bhi non-zero ⇒ letters ki ginti alag
    }
    return true;
}
```

**Line by line samjho**: `s` ke letters `+1` karte hain aur `t` ke `−1`. Agar dono mein **same letters same baar** hain toh sab dabbe wapas 0 ho jayenge. Time **O(n)**, space **O(26) = O(1)**. (Ye "frequency array" trick [Hashing](04-hashing.md) ka chhota bhai hai.)

## Code example 5 — Longest Palindromic Substring (center se failo)

**Trick**: *"Paani mein kankad phenko"* — kisi bhi center se lehron ki tarah dono taraf failo, jab tak akshar match karte rahein.

```
s = b a b a d
      ↑ center = index 1 ('a')

step 1: s[1] == s[1]              →  "a"     (length 1)
step 2: s[0] == s[2]  ('b'=='b')  →  "bab"   (length 3)
step 3: left = -1 (bahar nikal gaya) → ruko, is center ka answer "bab"

Har index ko center maano — odd length ("aba") ke liye (i, i), even length ("abba") ke liye (i, i+1)
```

```java
public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int center = 0; center < s.length(); center++) {
        int odd = expand(s, center, center);          // "aba" jaisa odd length
        int even = expand(s, center, center + 1);     // "abba" jaisa even length
        int len = Math.max(odd, even);
        if (len > maxLen) {
            maxLen = len;
            start = center - (len - 1) / 2;           // 🔑 is palindrome ka shuruaati index
        }
    }
    return s.substring(start, start + maxLen);
}

// center se dono taraf tab tak failo jab tak characters match ho rahe hain
private int expand(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;     // loop rukne pe left/right palindrome se ek-ek kadam BAHAR hote hain
}
```

**Line by line samjho**: Har character (aur har do characters ke beech ki jagah) ko center maankar `expand` chalate hain. `expand` ki length `right - left - 1` isliye hai ki loop tab rukta hai jab `left` aur `right` palindrome se **ek-ek kadam bahar** pahunch chuke hote hain. Time **O(n²)**, space **O(1)** — DP wale O(n²) space solution se behtar.

## String ke problems mein kaunsi technique lagegi

| Problem ka hint | Technique | Kahan padhna |
|---|---|---|
| Substring, "longest/shortest window" | Sliding Window | [Sliding Window](../../01-patterns/01-sliding-window.md) |
| Palindrome, reverse, dono sire | Two Pointers | [Two Pointers](../../01-patterns/02-two-pointers.md) |
| Anagram, character count, group | Hashing / freq array | [Hashing](04-hashing.md) |
| Prefix matching, autocomplete | Trie | [Trie](../03-trees-and-heaps/16-trie.md) |
| Pattern dhoondhna (bade text mein) | KMP / Rabin-Karp | [Advanced String Algos](../07-advanced/29-advanced-string-algorithms.md) |
| Do strings compare/convert (edit, LCS) | DP | [DP on Grid & Strings](../06-dynamic-programming/25-dp-grid-and-strings.md) |

## Common galtiyan

- **`s1 == s2` se content compare karna** — address compare hota hai. Hamesha `s1.equals(s2)`.
- **Loop mein `s += ...`** — O(n²). `StringBuilder` lo.
- **`char + int` int ban jata hai** — `(char)(c + 1)` cast karo, warna print mein number dikhega.
- **`s.split(".")` kaam nahi karta** — `.` ek regex hai, `s.split("\\.")` likho.
- **Empty string aur `null`** — `s.length() == 0` (ya `s.isEmpty()`) pehle check karo, warna `charAt(0)` crash karega.
- **`substring(a, b)` mein `b` shamil nahi hota** — `"hello".substring(1, 3)` = `"el"`.

> 💡 **Interview mein bolne wali line**: *"Strings Java mein immutable hain, isliye loop mein concatenate karne se O(n²) ho jayega — main StringBuilder use karunga, jisse O(n) mein ho jayega."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Reverse String | Easy | Two pointers swap | [leetcode.com/problems/reverse-string](https://leetcode.com/problems/reverse-string/) |
| 2 | Valid Palindrome | Easy | Two pointers + char check | [leetcode.com/problems/valid-palindrome](https://leetcode.com/problems/valid-palindrome/) |
| 3 | Valid Anagram | Easy | 26-size frequency array | [leetcode.com/problems/valid-anagram](https://leetcode.com/problems/valid-anagram/) |
| 4 | First Unique Character in a String | Easy | Frequency count, 2 pass | [leetcode.com/problems/first-unique-character-in-a-string](https://leetcode.com/problems/first-unique-character-in-a-string/) |
| 5 | Longest Common Prefix | Easy | Vertical scanning | [leetcode.com/problems/longest-common-prefix](https://leetcode.com/problems/longest-common-prefix/) |
| 6 | Reverse Words in a String | Medium | Split / trim / StringBuilder | [leetcode.com/problems/reverse-words-in-a-string](https://leetcode.com/problems/reverse-words-in-a-string/) |
| 7 | String to Integer (atoi) | Medium | Parsing + overflow handling | [leetcode.com/problems/string-to-integer-atoi](https://leetcode.com/problems/string-to-integer-atoi/) |
| 8 | Longest Palindromic Substring | Medium | Expand around center | [leetcode.com/problems/longest-palindromic-substring](https://leetcode.com/problems/longest-palindromic-substring/) |
| 9 | Palindromic Substrings | Medium | Expand around center (count) | [leetcode.com/problems/palindromic-substrings](https://leetcode.com/problems/palindromic-substrings/) |
| 10 | Longest Substring Without Repeating Characters | Medium | Sliding window | [leetcode.com/problems/longest-substring-without-repeating-characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| 11 | Minimum Window Substring | Hard | Sliding window + freq map | [leetcode.com/problems/minimum-window-substring](https://leetcode.com/problems/minimum-window-substring/) |

Agla: [04-hashing.md](04-hashing.md)
