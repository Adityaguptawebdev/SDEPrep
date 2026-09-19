# 18. Trie (Prefix Tree)

> **Standard definition**: A tree data structure where each node represents a character, and paths from the root represent strings — words sharing a common prefix share the same path, enabling O(length) prefix search.

**Ek line mein**: Har node ek **character** represent karta hai. Common
prefix wale words **same path** share karte hain — isliye "kya ye prefix
kisi word ka start hai" jaise sawaal **O(prefix length)** mein answer ho jate hain.

![Trie / prefix tree — words sharing a common prefix share the same path from the root](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)
*Public domain diagram (Wikimedia Commons).*

**Trick yaad rakhne ki**: *"Dictionary ka index"* — "Uber", "Ubuntu" dono
`U-B` tak same raasta share karte hain, phir alag ho jate hain. Poori
dictionary scan karne ki zarurat nahi, seedha us path tak jump karo.

**Kab use karo**: **Autocomplete/typeahead**, prefix/suffix search, "word
exists in dictionary" jaisi problems jaha bahut sare words compare karne hain.

## Code example — Implement Trie (Prefix Tree)

```java
class Trie {
    class Node {
        Node[] children = new Node[26];   // 🔑 har node ke 26 possible next characters (a-z)
        boolean isEndOfWord = false;
    }

    private final Node root = new Node();

    public void insert(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (curr.children[index] == null) {
                curr.children[index] = new Node();   // path abhi tak nahi bana, naya node banao
            }
            curr = curr.children[index];
        }
        curr.isEndOfWord = true;   // yahi pe ek complete word khatam hota hai
    }

    public boolean search(String word) {
        Node node = traverse(word);
        return node != null && node.isEndOfWord;
    }

    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;   // 🔑 path exist karta hai, word complete hona zaroori nahi
    }

    private Node traverse(String s) {
        Node curr = root;
        for (char c : s.toCharArray()) {
            int index = c - 'a';
            if (curr.children[index] == null) return null;   // path yahi toot gaya
            curr = curr.children[index];
        }
        return curr;
    }
}
```

**Line by line samjho**: `insert()` character-by-character path banata hai
— jaha path already exist karta hai (common prefix), wahi reuse hota hai.
`isEndOfWord` flag zaroori hai kyunki **"Uber" khud ek word hai, par "Ub"
raasta hone ka matlab "Ub" khud ek word ho, zaroori nahi**. `startsWith()`
aur `search()` mein yehi fark hai — pehla sirf path check karta hai, doosra
`isEndOfWord` bhi.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Implement Trie (Prefix Tree) | Medium | [leetcode.com/problems/implement-trie-prefix-tree](https://leetcode.com/problems/implement-trie-prefix-tree/) |
| 2 | Design Add and Search Words Data Structure | Medium | [leetcode.com/problems/design-add-and-search-words-data-structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) |
| 3 | Word Search II | Hard | [leetcode.com/problems/word-search-ii](https://leetcode.com/problems/word-search-ii/) |
| 4 | Replace Words | Medium | [leetcode.com/problems/replace-words](https://leetcode.com/problems/replace-words/) |
| 5 | Longest Word in Dictionary | Medium | [leetcode.com/problems/longest-word-in-dictionary](https://leetcode.com/problems/longest-word-in-dictionary/) |

Agla: [19-dynamic-programming.md](19-dynamic-programming.md)
