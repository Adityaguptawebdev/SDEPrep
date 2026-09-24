# 18. Trie (Prefix Tree)

> Pehle ye aane chahiye: [Trie (syllabus)](../00-syllabus/03-trees-and-heaps/16-trie.md), [Hashing](../00-syllabus/01-basics/04-hashing.md), [Backtracking (pattern)](13-backtracking.md)

> **Standard definition**: A tree data structure where each node represents a character, and paths from the root represent strings — words sharing a common prefix share the same path, enabling O(length) prefix search.

**Ek line mein**: Har node ek **character** represent karta hai. Common prefix wale words **same path** share karte hain — isliye "kya ye prefix kisi word ka start hai" jaise sawaal **O(prefix length)** mein answer ho jate hain, chahe dictionary mein lakh words ho.

![Trie / prefix tree — words sharing a common prefix share the same path from the root](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)
*Public domain diagram (Wikimedia Commons).*

**Trick yaad rakhne ki**: *"Dictionary ka index"* — "Uber", "Ubuntu" dono `U-B` tak same raasta share karte hain, phir alag ho jate hain. Poori dictionary scan karne ki zarurat nahi, seedha us path tak jump karo.

```
words:  cat, car, do, dog                        * = yahan ek word khatam (end flag)

root ─ c ─ a ─ t *          (cat)
            └─ r *          (car)
     └─ d ─ o * ─ g *       (do, dog)             "ca" ek path hai par word NAHI  →  end flag zaroori
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ "Kya koi word is PREFIX se shuru hota hai?"  /  autocomplete  /  typeahead
✅ Bahut saare words ka common prefix baar-baar compare ho raha hai
✅ Wildcard search ('.') ya "sabse chhota prefix jo dictionary mein ho"
✅ Grid mein ek saath BAHUT saare words dhoondne hain (Word Search II)
✅ Numbers ke bits pe "sabse bada XOR" (binary trie)
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**insert / search / startsWith**" | ① **Basic Trie** |
| "**'.' = koi bhi akshar**", wildcard | ② **Wildcard** (DFS) |
| "**sabse chhoti root se replace**", "**autocomplete top 3**", "**har prefix dictionary mein ho**" | ③ **Prefix queries** |
| "**is prefix wale sabhi words ka sum / count**" | ④ **Per-node data** (count / sum) |
| "**grid mein ek saath kai words**" | ⑤ **Trie + Backtracking** |
| "**maximum XOR**" | ⑥ **Binary Trie** |

### Trie ya HashSet / HashMap?

| Sawaal | Kaun? |
|---|---|
| Sirf **exact** word hai ya nahi | **HashSet** (simple, kam memory) |
| **Prefix** / autocomplete / kai words ka common prefix | **Trie** |
| Words ki **sorted list** + prefix range | Binary search bhi chal jata hai |

**Children: array ya HashMap?**

| Alphabet | Kaun? |
|---|---|
| Sirf `a–z` (chhota, fast) | `TrieNode[26]` |
| Digits / unicode / bada alphabet (memory bachane ko) | `HashMap<Character, TrieNode>` |

### ❌ Kab NAHI
- Sirf **"word exists?"** → HashSet (Trie overkill).
- Bahut lambe alag-alag words, common prefix kam → memory zyada (har char ek node).
- **Suffix / middle** search → suffix trie ya reverse karke (alag technique).

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. NODE     →  children kaise? (array[26] / HashMap)    +  node pe kya extra?  (end flag / word / count)
2. INSERT   →  har char: bachcha nahi hai toh BANAO, phir uspe jao ;  aakhir mein end = true
3. WALK     →  har char: bachcha nahi hai → FAIL (null) ;  aakhir mein  search → end?   startsWith → bas pahunche?
4. DATA     →  node pe kya rakhun?  end flag  /  poora word  /  count (kitne guzre)  /  sum
5. DFS      →  wildcard / autocomplete / grid ke liye node se DFS (bachcha a → z order = lexicographic)
```

**Ek template** (yehi likhna hai — baaki sab isse chalta hai):

```java
class TrieNode {
    TrieNode[] next = new TrieNode[26];        // a-z
    boolean end;                               // yahan koi word khatam hota hai
    String word;                               // (optional) poora word end pe — Word Search II / suggestions
    int count;                                 // (optional) kitne words is node se guzre / sum
}
```

```
INSERT(word):                            WALK(s):
node = root                              node = root
for c in word:                           for c in s:
    if node.next[c] == null:                 node = node.next[c]
        node.next[c] = new TrieNode()        if node == null: return null      # raasta toot gaya
    node = node.next[c]                  return node
node.end = true                          # search = (node != null && node.end)     startsWith = (node != null)
```

**Do ratta:**
1. **End flag** hamesha — `"ca"` raasta hai lekin word nahi (`cat` ka hissa hai).
2. **Insert mein banao, search mein nahi** — search ke waqt bachcha `null` = na mila.

Complexity: insert/search/startsWith **O(L)** (L = word ki length), space O(total chars).

---

## 3. ① Basic Trie — insert, search, startsWith

```java
class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.next[i] == null) node.next[i] = new TrieNode();   // 🔑 raasta nahi hai → banao
            node = node.next[i];
        }
        node.end = true;                                                // 🔑 yahin word khatam
    }

    public boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.end;                                // raasta ho AUR word bhi ho
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;                                    // 🔑 sirf raasta chahiye
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            node = node.next[c - 'a'];
            if (node == null) return null;                              // raasta yahin toot gaya
        }
        return node;
    }
}
```

**`search` aur `startsWith` mein fark**: dono `walk` karte hain; `search` ko **end flag bhi** chahiye, `startsWith` ko nahi. `"app"` insert hua ho toh `search("ap")` false, `startsWith("ap")` true.

---

## 4. ② Wildcard — `.` = koi bhi akshar

**Idea**: Normal char pe ek hi raasta; `'.'` pe **saare bachchon mein try** (DFS, [backtracking](13-backtracking.md) jaisa). Koi ek match kar gaya toh `true`.

```
words: bad, dad, mad        search("b.d"):   b → '.' (a, ... saare bachche try) → d ✓ end   →  true
                            search(".ad"):   '.' → b, d, m — teeno mein "ad" milta hai     →  true
                            search("b..")  :  b → a → d ✓ (teen letter)                    →  true
```

```java
class WordDictionary {
    private final TrieNode root = new TrieNode();

    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.next[i] == null) node.next[i] = new TrieNode();
            node = node.next[i];
        }
        node.end = true;
    }

    public boolean search(String word) {
        return match(word, 0, root);
    }

    private boolean match(String word, int i, TrieNode node) {
        if (node == null) return false;                                 // raasta nahi
        if (i == word.length()) return node.end;                        // 🔑 poora word chal liye → end flag check
        char c = word.charAt(i);
        if (c != '.') return match(word, i + 1, node.next[c - 'a']);
        for (TrieNode child : node.next) {                              // 🔑 '.' → har bachche pe try
            if (child != null && match(word, i + 1, child)) return true;
        }
        return false;
    }
}
```

---

## 5. ③ Prefix queries — replace, longest word, autocomplete

**Idea**: Ek baar trie banao, phir har query **prefix ke raaste** pe chalao. Per-word kaam O(L).

```
Replace Words   dictionary [cat, bat, rat]   "the cattle was rattled by the battery"
   har word ke chars pe chalo; PEHLA end flag milte hi ruk jao → sabse chhoti root  →  "the cat was rat by the bat"

Longest Word in Dictionary   ["w","wo","wor","worl","world"]
   sirf un bachchon pe jao jo KHUD word hain (end)  →  har prefix maujood  →  "world"

Search Suggestions   products [mobile, mouse, moneypot, monitor, mousepad],  searchWord = "mouse"
   har type kiye hue akshar ke baad node pe chalo;  wahan se DFS a→z (lexicographic) se 3 words
   'm' → [mobile, moneypot, monitor]      'mo' → same      'mou' → [mouse, mousepad]      ...
```

```java
// Replace Words — har word ko sabse chhoti dictionary-root se badlo
public String replaceWords(List<String> dictionary, String sentence) {
    TrieNode root = new TrieNode();
    for (String w : dictionary) insert(root, w);
    StringBuilder sb = new StringBuilder();
    for (String word : sentence.split(" ")) {
        TrieNode node = root;
        int len = 0;
        boolean found = false;
        for (char c : word.toCharArray()) {
            node = node.next[c - 'a'];
            if (node == null) break;                                   // is word ka koi prefix dictionary mein nahi
            len++;
            if (node.end) { found = true; break; }                     // 🔑 pehla end = sabse chhoti root
        }
        if (sb.length() > 0) sb.append(' ');
        sb.append(found ? word.substring(0, len) : word);
    }
    return sb.toString();
}

// Longest Word in Dictionary — har prefix bhi dictionary mein ho; tie mein lexicographically chhota
public String longestWord(String[] words) {
    TrieNode root = new TrieNode();
    for (String w : words) insert(root, w).word = w;                   // end node pe poora word
    String best = "";
    Deque<TrieNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TrieNode node = stack.pop();
        if (node.word != null && (node.word.length() > best.length()
                || (node.word.length() == best.length() && node.word.compareTo(best) < 0))) {
            best = node.word;
        }
        for (TrieNode child : node.next) {
            if (child != null && child.end) stack.push(child);         // 🔑 sirf wo bachche jo khud word hain
        }
    }
    return best;
}

// Search Suggestions System — har akshar type hone ke baad top-3 lexicographic
public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    TrieNode root = new TrieNode();
    for (String p : products) insert(root, p).word = p;
    List<List<String>> result = new ArrayList<>();
    TrieNode node = root;
    for (char c : searchWord.toCharArray()) {
        if (node != null) node = node.next[c - 'a'];                   // ek akshar aur chalo (null = aage koi nahi)
        List<String> suggestions = new ArrayList<>();
        if (node != null) collect(node, suggestions);
        result.add(suggestions);
    }
    return result;
}

private void collect(TrieNode node, List<String> out) {                // DFS: a → z order = lexicographic
    if (out.size() == 3) return;
    if (node.word != null) out.add(node.word);
    for (TrieNode child : node.next) {
        if (child != null) collect(child, out);
        if (out.size() == 3) return;                                    // 🔑 3 mil gaye → ruk jao
    }
}

private TrieNode insert(TrieNode root, String w) {                     // insert karke END node lautata hai
    TrieNode node = root;
    for (char c : w.toCharArray()) {
        int i = c - 'a';
        if (node.next[i] == null) node.next[i] = new TrieNode();
        node = node.next[i];
    }
    node.end = true;
    return node;
}
```

---

## 6. ④ Per-node data — count / sum

**Idea**: Node pe **`count` / sum** rakho. Insert ke waqt **raaste ke har node** ko update karo → baad mein "is prefix ke neeche kitna" **O(L)** mein.

```
Sum of Prefix Scores   words [abc, ab, bc, b]
   insert: har node.count++   →   a:2  ab:2  abc:1   b:2  bc:1
   answer[i] = word ke raaste ke saare nodes ke count ka jod
      "abc" → 2 + 2 + 1 = 5      "ab" → 2 + 2 = 4      "bc" → 2 + 1 = 3      "b" → 2      →  [5,4,3,2]

Map Sum Pairs   insert("apple", 3), sum("ap") = 3, insert("app", 2), sum("ap") = 5
   key dobara aaye (update) → sirf FARAK (delta) jodo
```

```java
// Map Sum Pairs — prefix wale sabhi keys ke values ka sum
class MapSum {
    private final TrieNode root = new TrieNode();
    private final Map<String, Integer> values = new HashMap<>();

    public void insert(String key, int val) {
        int delta = val - values.getOrDefault(key, 0);                  // 🔑 key dobara aaye toh sirf farak jodo
        values.put(key, val);
        TrieNode node = root;
        for (char c : key.toCharArray()) {
            int i = c - 'a';
            if (node.next[i] == null) node.next[i] = new TrieNode();
            node = node.next[i];
            node.count += delta;                                         // is prefix ke neeche ka sum
        }
    }

    public int sum(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            node = node.next[c - 'a'];
            if (node == null) return 0;
        }
        return node.count;
    }
}
```

```java
// Sum of Prefix Scores of Strings
public int[] sumPrefixScores(String[] words) {
    TrieNode root = new TrieNode();
    for (String w : words) {
        TrieNode node = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (node.next[i] == null) node.next[i] = new TrieNode();
            node = node.next[i];
            node.count++;                                                // 🔑 is prefix se ek aur word guzra
        }
    }
    int[] result = new int[words.length];
    for (int k = 0; k < words.length; k++) {
        TrieNode node = root;
        for (char c : words[k].toCharArray()) {
            node = node.next[c - 'a'];
            result[k] += node.count;                                     // har prefix ka score jodo
        }
    }
    return result;
}
```

---

## 7. ⑤ Trie + Backtracking — Word Search II

**Idea**: Har word ke liye alag [Word Search](13-backtracking.md) chalana **bahut slow**. **Sabhi words ka ek trie** banao aur grid pe **ek hi DFS** — trie ke raaste pe chalte jao; jahan **raasta nahi**, wahin **prune**.

```
words: oath, pea, eat, rain         grid: o a a n / e t a e / i h k r / i f l v

trie:   o─a─t─h*        p─e─a*       e─a─t*       r─a─i─n*
har cell se DFS: current cell ka akshar trie mein bachcha hai? nahi → return (prune)
node.word != null → word mil gaya (result mein daalo, node.word = null — dobara na aaye)
```

```java
public List<String> findWords(char[][] board, String[] words) {
    TrieNode root = new TrieNode();
    for (String w : words) {
        TrieNode node = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (node.next[i] == null) node.next[i] = new TrieNode();
            node = node.next[i];
        }
        node.word = w;                                                  // 🔑 end pe poora word (baad mein add karne ke liye)
    }
    List<String> result = new ArrayList<>();
    for (int r = 0; r < board.length; r++) {
        for (int c = 0; c < board[0].length; c++) explore(board, r, c, root, result);
    }
    return result;
}

private void explore(char[][] b, int r, int c, TrieNode parent, List<String> result) {
    if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return;
    char ch = b[r][c];
    if (ch == '#' || parent.next[ch - 'a'] == null) return;            // 🔑 visited ya trie mein raasta hi nahi → prune
    TrieNode node = parent.next[ch - 'a'];
    if (node.word != null) {
        result.add(node.word);
        node.word = null;                                               // 🔑 ek word sirf ek baar
    }
    b[r][c] = '#';                                                      // CHOOSE
    explore(b, r + 1, c, node, result);
    explore(b, r - 1, c, node, result);
    explore(b, r, c + 1, node, result);
    explore(b, r, c - 1, node, result);
    b[r][c] = ch;                                                       // UN-CHOOSE
    boolean leaf = true;
    for (TrieNode child : node.next) {
        if (child != null) { leaf = false; break; }
    }
    if (leaf) parent.next[ch - 'a'] = null;                             // 🔑 is raaste pe ab koi word nahi bacha → kaat do
}
```

---

## 8. ⑥ Binary Trie — Maximum XOR

**Idea**: Numbers ko **bits** ki string maano (MSB → LSB). Har node ke sirf **2 bachche (0 / 1)**. Kisi `x` ke saath **max XOR** ke liye har bit pe **ulta bit** chuno (agar trie mein ho) — greedy: upar ka bit XOR mein 1 bane toh neeche ke bits se zyada value.

```
nums = [3, 10, 5, 25, 2, 8]        (5 bits:  3 = 00011,  25 = 11001)

x = 5 (00101) ke liye:   bit4 = 0 → ulta 1 chahiye  (25 ka bit 1 hai ✓)   →  xor mein 1
                          bit3 = 0 → ulta 1 chahiye  (25 ka bit 1 ✓)        →  1
                          bit2 = 1 → ulta 0 chahiye  (25 mein 0 ✓)          →  1
                          bit1 = 0 → ulta 1 chahiye  (25 mein 0 ✗)          →  0  (0 wala hi jao)
                          bit0 = 1 → ulta 0 (25 ka bit 1 ✗ )                →  0        xor = 11100 = 28 ✓ (5 ^ 25)
```

```java
class BitNode {
    BitNode[] next = new BitNode[2];                                    // sirf 0 aur 1
}

public int findMaximumXOR(int[] nums) {
    BitNode root = new BitNode();
    for (int x : nums) {
        BitNode node = root;
        for (int b = 30; b >= 0; b--) {                                 // MSB se LSB (non-negative int: 31 bits)
            int bit = (x >> b) & 1;
            if (node.next[bit] == null) node.next[bit] = new BitNode();
            node = node.next[bit];
        }
    }
    int best = 0;
    for (int x : nums) {
        BitNode node = root;
        int xor = 0;
        for (int b = 30; b >= 0; b--) {
            int want = ((x >> b) & 1) ^ 1;                              // 🔑 ulta bit chahiye
            if (node.next[want] != null) {
                xor |= 1 << b;                                          // is bit pe XOR = 1 mil gaya
                node = node.next[want];
            } else {
                node = node.next[want ^ 1];                             // ulta nahi hai toh same bit ke raaste
            }
        }
        best = Math.max(best, xor);
    }
    return best;
}
```

---

## 9. Sab ek nazar mein

| Variation | Node mein | Insert | Query |
|---|---|---|---|
| ① Basic | `next[26]`, `end` | raaste banao, end = true | walk: `search` → end?, `startsWith` → null nahi |
| ② Wildcard | same | same | `.` pe saare bachche (DFS) |
| ③ Prefix queries | `end` / `word` | same | walk + pehla end / a→z DFS |
| ④ Count / sum | `count` | raaste ke har node pe `+= delta` | prefix pe chalo → `count` |
| ⑤ Grid | `word` at end | same | grid DFS + trie pointer, prune |
| ⑥ Binary | `next[2]` | 31 bits MSB → LSB | har bit pe ulta try |

## Common galtiyan

- **End flag bhoolna** — `"app"` insert kiya, `search("ap")` true de dete ho.
- **`search` mein bachcha `null` check na karna** → NullPointerException.
- **Insert mein `new` na banana** ya root ko hi modify kar dena.
- **`c - 'a'`** sirf lowercase; uppercase/digits ke liye HashMap children ya bada array.
- **Word Search II mein har word alag DFS** — TLE; trie + prune, aur mile hue word ko `null` karo.
- **Wildcard mein `'.'` pe sirf pehla bachcha** — saare bachche try karo.
- **Sum/count wale sawaal mein update pe poori value jodna** — dobara aaye key ka sirf **delta**.
- **`String.substring` se prefix** trie ke andar banana — O(L²); pointer se chalo.
- **Binary trie mein bits ki sankhya** — 31 (non-negative int) ya 32; MSB pehle.

> 💡 **Interview mein bolne wali line**: *"Yahan prefix ke basis pe baar-baar search ho raha hai, isliye har word ko character-by-character trie mein daal dunga. Insert aur query dono O(L), aur common prefix ek hi baar store hota hai. Wildcard pe DFS, grid pe trie ke saath backtracking."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Implement Trie (Prefix Tree) | ① Basic | Medium | [leetcode.com/problems/implement-trie-prefix-tree](https://leetcode.com/problems/implement-trie-prefix-tree/) |
| 2 | Longest Common Prefix | ① Basic (walk) | Easy | [leetcode.com/problems/longest-common-prefix](https://leetcode.com/problems/longest-common-prefix/) |
| 3 | Design Add and Search Words Data Structure | ② Wildcard | Medium | [leetcode.com/problems/design-add-and-search-words-data-structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) |
| 4 | Replace Words | ③ Prefix query | Medium | [leetcode.com/problems/replace-words](https://leetcode.com/problems/replace-words/) |
| 5 | Longest Word in Dictionary | ③ Prefix query | Medium | [leetcode.com/problems/longest-word-in-dictionary](https://leetcode.com/problems/longest-word-in-dictionary/) |
| 6 | Search Suggestions System | ③ Autocomplete | Medium | [leetcode.com/problems/search-suggestions-system](https://leetcode.com/problems/search-suggestions-system/) |
| 7 | Map Sum Pairs | ④ Sum | Medium | [leetcode.com/problems/map-sum-pairs](https://leetcode.com/problems/map-sum-pairs/) |
| 8 | Short Encoding of Words | ③ Suffix (reverse) | Medium | [leetcode.com/problems/short-encoding-of-words](https://leetcode.com/problems/short-encoding-of-words/) |
| 9 | Maximum XOR of Two Numbers in an Array | ⑥ Binary | Medium | [leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) |
| 10 | Word Search II | ⑤ Trie + backtracking | Hard | [leetcode.com/problems/word-search-ii](https://leetcode.com/problems/word-search-ii/) |
| 11 | Sum of Prefix Scores of Strings | ④ Count | Hard | [leetcode.com/problems/sum-of-prefix-scores-of-strings](https://leetcode.com/problems/sum-of-prefix-scores-of-strings/) |
| 12 | Prefix and Suffix Search | ④ Trie + combine | Hard | [leetcode.com/problems/prefix-and-suffix-search](https://leetcode.com/problems/prefix-and-suffix-search/) |
| 13 | Stream of Characters | ③ Reverse trie | Hard | [leetcode.com/problems/stream-of-characters](https://leetcode.com/problems/stream-of-characters/) |
| 14 | Palindrome Pairs | ③ Trie + palindrome | Hard | [leetcode.com/problems/palindrome-pairs](https://leetcode.com/problems/palindrome-pairs/) |
| 15 | Maximum XOR With an Element From Array | ⑥ Binary (offline) | Hard | [leetcode.com/problems/maximum-xor-with-an-element-from-array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Node mein kya (children, end, word, count)? Insert kaise? Query mein walk ya DFS? Prune kab?"* — phir code.

Agla: [19-dynamic-programming.md](19-dynamic-programming.md)
