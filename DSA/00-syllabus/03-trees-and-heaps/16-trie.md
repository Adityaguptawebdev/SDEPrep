# 16. Trie (Prefix Tree)

> 📍 **Syllabus**: Unit 3 — Trees & Heaps · Topic 16 / 29 · Pehle chahiye: [Binary Tree](13-binary-tree.md), [Hashing](../01-basics/04-hashing.md), [Strings](../01-basics/03-strings.md)

> **Standard definition**: A tree-like data structure (prefix tree) in which each node represents a character and the path from the root to a node spells a prefix; it supports insertion, exact search and prefix search in O(L) time, where L is the length of the word, independent of how many words are stored.

**Ek line mein**: Words ko **akshar-akshar karke ek tree mein** rakho — jin words ka **shuruaati hissa (prefix) same hai wo ek hi raasta share** karte hain, isliye prefix ka kaam bahut fast.

**Trick yaad rakhne ki**: *"Phone keyboard ke suggestions"* — tum `a`, `p` type karte ho aur phone turant **Apple, App, Apply** dikha deta hai. Phone ko saare words ek-ek karke check nahi karne padte; wo bas **"ap" wale raaste pe khada ho jata hai** aur wahan se neeche ke saare words utha leta hai. Trie yehi raasta hai.

**Kab use karo**: **Autocomplete**, **spell check**, "**kya koi word is prefix se shuru hota hai?**", dictionary mein words ka **wildcard search**, aur board/grid pe **saare words dhoondhna** (Word Search II). HashSet sirf "poora word hai?" batata hai; **prefix** ke liye HashSet ko poora scan karna padta hai — Trie nahi.

## Trie kaisa dikhta hai

Words: **cat, car, cart, dog**

```
root
 ├── c ── a ── t  ✓  ("cat")
 │        └── r  ✓  ("car") ── t ✓ ("cart")
 └── d ── o ── g  ✓  ("dog")

✓ = "yahan koi word KHATAM hota hai"

"car" aur "cart" ka raasta c → a → r same hai; "r" pe car khatam hota hai, aage 't' se cart.
```

**Do zaroori baatein**:
1. **Raasta hona ≠ word hona.** `car` search karo toh `c→a→r` raasta mil jayega, par word tab hi hai jab us node pe **✓ (`isEnd`)** ho. (Agar sirf `cart` daala hota, toh `car` ek word nahi hota — bas prefix hota.)
2. Har node mein **bachche** rakhne ke 2 tarike hain:

| Bachche kaise store karein | Fayda | Nuksaan |
|---|---|---|
| **Array `[26]`** | Bahut fast (`c - 'a'` se seedha index) | Sparse hone par memory zyada (26 dabbe har node mein) |
| **HashMap / TreeMap** | Memory kam, **koi bhi character** (unicode, digits) | Thoda slow |

## Complexity

| Operation | Time | Kyun |
|---|---|---|
| `insert(word)` | **O(L)** | Word ke L akshar, ek-ek kadam |
| `search(word)` | **O(L)** | L kadam chalo |
| `startsWith(prefix)` | **O(P)** | Prefix ki lambai P |
| Space | O(saare words ke akshar × 26) worst | Common prefix share hone se kam padti hai |

**Khaas baat**: Time **words ki sankhya pe depend nahi karta** — 10 words ho ya 10 lakh, `search` O(L).

## Code example 1 — Trie (insert, search, startsWith)

```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];   // har akshar (a-z) ke liye ek dabba
    boolean isEnd = false;                    // yahan koi word khatam hota hai?
}

class Trie {
    private TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';                                    // 'a'→0, 'b'→1 ...
            if (cur.children[i] == null) cur.children[i] = new TrieNode();   // raasta nahi tha → banao
            cur = cur.children[i];                              // ek kadam aage
        }
        cur.isEnd = true;                     // 🔑 word yahan khatam — sirf raasta hona kaafi nahi
    }

    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;    // raasta bhi ho AUR wahin word khatam bhi ho
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;          // sirf raasta hona kaafi hai
    }

    private TrieNode find(String s) {         // s ke raaste pe chalo; raasta toota toh null
        TrieNode cur = root;
        for (char c : s.toCharArray()) {
            cur = cur.children[c - 'a'];
            if (cur == null) return null;
        }
        return cur;
    }
}
```

**Line by line samjho**: `insert`, `search`, `startsWith` teeno **ek hi chal** hain — root se shuru karke har akshar ke liye ek kadam. Fark sirf aakhir mein: `insert` ✓ laga deta hai, `search` ✓ dekhta hai, `startsWith` bas raasta poora hua ya nahi.

## Code example 2 — Autocomplete (HashMap/TreeMap wale bachche)

**Trick**: *"Prefix wale node pe khade ho jao, wahan se neeche ke saare ✓ words utha lo."* Ye **HashMap-children** wala variant bhi dikhata hai — `TreeMap` lene se suggestions **alphabetical** aati hain:

```
words: apple, app, apply, bat          suggest("ap")

root ─ a ─ p ─ p ✓(app) ─ l ─ e ✓(apple)
   │       ▲             └── y ✓(apply)
   │       └── "ap" pe pahunche → yahan se neeche DFS
   └─ b ─ a ─ t ✓(bat)

DFS neeche se: app, apple, apply   (alphabetical)
```

```java
class SuggestionTrie {
    private static class Node {
        Map<Character, Node> next = new TreeMap<>();     // 🔑 TreeMap → bachche alphabetical order mein
        boolean isEnd;
    }
    private Node root = new Node();

    public void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            cur = cur.next.computeIfAbsent(c, k -> new Node());   // raasta hai toh wahi, nahi toh naya banao
        }
        cur.isEnd = true;
    }

    // Prefix se shuru hone wale saare words
    public List<String> suggest(String prefix) {
        Node cur = root;
        for (char c : prefix.toCharArray()) {
            cur = cur.next.get(c);
            if (cur == null) return new ArrayList<>();        // prefix hi nahi hai → koi suggestion nahi
        }
        List<String> result = new ArrayList<>();
        collect(cur, new StringBuilder(prefix), result);      // 🔑 prefix wale node se neeche ke saare words DFS se
        return result;
    }

    private void collect(Node node, StringBuilder path, List<String> result) {
        if (node.isEnd) result.add(path.toString());          // yahan word khatam hota hai
        for (Map.Entry<Character, Node> e : node.next.entrySet()) {
            path.append(e.getKey());                           // choose
            collect(e.getValue(), path, result);               // explore
            path.deleteCharAt(path.length() - 1);              // un-choose (backtrack)
        }
    }
}
```

Search suggestions ka poora system-design roop [HLD: Search Autocomplete](../../../HLD/02-problems/10-search-autocomplete.md) mein hai.

## Code example 3 — Wildcard search (`.` = koi bhi akshar)

`addWord("bad")` ke baad `search("b.d")` → **true**. **Trick**: *"`.` aaye toh saare bachcho mein try karo — koi ek bhi kaam kar jaye toh true."*

```java
class WordDictionary {
    private static class Node {
        Node[] next = new Node[26];
        boolean isEnd;
    }
    private Node root = new Node();

    public void addWord(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();
            cur = cur.next[c - 'a'];
        }
        cur.isEnd = true;
    }

    public boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String word, int i, Node node) {
        if (node == null) return false;                     // raasta toot gaya
        if (i == word.length()) return node.isEnd;          // saare akshar khatam — word yahin khatam hona chahiye
        char c = word.charAt(i);
        if (c == '.') {                                     // 🔑 wildcard: saare bachcho mein try karo
            for (Node child : node.next) {
                if (dfs(word, i + 1, child)) return true;
            }
            return false;
        }
        return dfs(word, i + 1, node.next[c - 'a']);        // normal akshar: sirf ek raasta
    }
}
```

## Code example 4 — Word Search II (Trie + Backtracking) ⭐ Advanced

**Problem**: Ek board (grid of letters) aur `words` ki list. Batao **kaun-kaun se words board pe** (paas-paas ke cells jodke, ek cell ek word mein ek hi baar) ban sakte hain.

**Galat tarika**: Har word ke liye alag DFS → `words × cells × 4^L` — bahut slow.
**Trie tarika**: **Saare words ek Trie mein** daalo, phir board pe **ek hi DFS** chalao aur **saath-saath Trie mein bhi chalte jao**. Jahan Trie mein aage raasta nahi (`prefix kisi word ka nahi`) — wahin **kaat do (prune)**.

```
board:            words = ["oath", "pea", "eat", "rain"]
  o  a  a  n
  e  t  a  e      "oath" ✅ (o → a → t → h)      "eat" ✅ (e → a → t)
  i  h  k  r      "pea"  ❌ ('p' board pe hai hi nahi)     "rain" ❌
  i  f  l  v
                  result = ["oath", "eat"]
```

```java
class WordSearchII {
    private static class Node {
        Node[] next = new Node[26];
        String word;                                   // 🔑 is node pe khatam hone wala word (null = koi nahi)
    }

    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {                       // 1) saare words ka Trie banao
            Node cur = root;
            for (char c : w.toCharArray()) {
                if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();
                cur = cur.next[c - 'a'];
            }
            cur.word = w;
        }
        List<String> result = new ArrayList<>();
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                dfs(board, r, c, root, result);        // 2) har cell se Trie ke saath DFS
            }
        }
        return result;
    }

    private void dfs(char[][] board, int r, int c, Node parent, List<String> result) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
        char ch = board[r][c];
        if (ch == '#' || parent.next[ch - 'a'] == null) return;   // 🔑 visited ya Trie mein aage raasta nahi → PRUNE
        Node node = parent.next[ch - 'a'];
        if (node.word != null) {
            result.add(node.word);                     // word mil gaya
            node.word = null;                          // dobara add na ho (duplicate se bachne ke liye)
        }
        board[r][c] = '#';                             // is cell ko "visited" mark karo
        dfs(board, r + 1, c, node, result);
        dfs(board, r - 1, c, node, result);
        dfs(board, r, c + 1, node, result);
        dfs(board, r, c - 1, node, result);
        board[r][c] = ch;                              // undo (backtrack) — cell wapas free
    }
}
```

**Line by line samjho**: Trie ka fayda ye ki **ek hi DFS mein saare words ka saath-saath check** ho jata hai, aur jaise hi board ka path kisi bhi word ka prefix nahi rehta, DFS wahin ruk jata hai. Cell ko `'#'` karna aur wapas restore karna wahi [Backtracking](../04-paradigms/17-backtracking.md) ka *choose → explore → un-choose* hai.

## Bonus: Binary Trie (XOR ke liye)

Trie sirf letters ke liye nahi — **numbers ke bits (0/1)** ka Trie bhi banta hai, jisme har node ke sirf **2 bachche**. "Array mein do numbers ka **maximum XOR**" jaisa sawaal isse O(n · 32) mein hota hai (bits ke basics: [Bit Manipulation](../01-basics/06-bit-manipulation.md)). Practice table mein ek problem hai.

## Common galtiyan

- **`isEnd` bhoolna** — `search("car")` ko `true` de dena sirf isliye ki `cart` daala hai.
- **`search` aur `startsWith` mein farq na karna** — `search` ko `isEnd` chahiye, `startsWith` ko nahi.
- **Sirf lowercase maan lena** — capital/digit aaye toh `c - 'a'` negative/bada index de dega (`ArrayIndexOutOfBounds`). Constraint dekho, ya HashMap-children lo.
- **Word Search II mein duplicate answers** — `node.word = null` karke ek baar hi add karo.
- **Word Search II mein cell ko wapas restore na karna** — agle path ke liye cell hamesha ke liye "visited" reh jayega.

> 💡 **Interview mein bolne wali line**: *"Prefix queries ke liye HashSet O(n·L) padega; Trie mein O(L) — words ki sankhya se independent. Memory ke badle speed kharid rahe hain, aur common prefixes share hone se memory kam lagti hai."*

## Practice — basic se advance

Pattern-style practice: [Trie pattern](../../01-patterns/18-trie.md).

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Longest Common Prefix | Easy | Trie ka raasta jab tak akela bachcha | [leetcode.com/problems/longest-common-prefix](https://leetcode.com/problems/longest-common-prefix/) |
| 2 | Implement Trie (Prefix Tree) | Medium | insert / search / startsWith | [leetcode.com/problems/implement-trie-prefix-tree](https://leetcode.com/problems/implement-trie-prefix-tree/) |
| 3 | Replace Words | Medium | Sabse chhota prefix (root) dhoondho | [leetcode.com/problems/replace-words](https://leetcode.com/problems/replace-words/) |
| 4 | Map Sum Pairs | Medium | Har node pe prefix-sum | [leetcode.com/problems/map-sum-pairs](https://leetcode.com/problems/map-sum-pairs/) |
| 5 | Design Add and Search Words Data Structure | Medium | Wildcard `.` + DFS | [leetcode.com/problems/design-add-and-search-words-data-structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) |
| 6 | Longest Word in Dictionary | Medium | Har prefix word ho | [leetcode.com/problems/longest-word-in-dictionary](https://leetcode.com/problems/longest-word-in-dictionary/) |
| 7 | Search Suggestions System | Medium | Autocomplete (top 3) | [leetcode.com/problems/search-suggestions-system](https://leetcode.com/problems/search-suggestions-system/) |
| 8 | Short Encoding of Words | Medium | Reverse Trie (suffix) | [leetcode.com/problems/short-encoding-of-words](https://leetcode.com/problems/short-encoding-of-words/) |
| 9 | Maximum XOR of Two Numbers in an Array | Medium | Binary Trie | [leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) |
| 10 | Word Search II | Hard | Trie + backtracking | [leetcode.com/problems/word-search-ii](https://leetcode.com/problems/word-search-ii/) |
| 11 | Stream of Characters | Hard | Reverse words ka Trie | [leetcode.com/problems/stream-of-characters](https://leetcode.com/problems/stream-of-characters/) |
| 12 | Prefix and Suffix Search | Hard | Trie mein `suffix#word` | [leetcode.com/problems/prefix-and-suffix-search](https://leetcode.com/problems/prefix-and-suffix-search/) |

---

## ✅ Unit 3 (Trees & Heaps) khatam!

Binary Tree (recursion ka asli khel), BST (sorted + fast), Heap (priority) aur Trie (prefix) — **hierarchical data** ke saare hathiyaar tumhare paas hain.

Ab hum **problem-solving ke tareeke (paradigms)** seekhte hain — pehle **Backtracking** (saare options try karke galat ko undo karna), phir **Greedy** (har step pe abhi ka best chuno).

Agla: [Unit 4 — Paradigms → Backtracking](../04-paradigms/17-backtracking.md)
