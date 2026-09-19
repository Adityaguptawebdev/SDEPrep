# 1. Sliding Window

> **Standard definition**: A technique that maintains a contiguous range (window) over an array/string, expanding or shrinking its boundaries based on a condition, to avoid recomputing over the same elements repeatedly.

**Ek line mein**: Ek "window" (chhota range) ko array/string ke upar **khiskao**
— jab condition sahi ho toh window ko **badhao** (right pointer aage), jab
condition toot jaye toh **chhota karo** (left pointer aage) — poora subarray
baar-baar recompute karne ki zarurat nahi.

**Trick yaad rakhne ki**: *"Train ke dabbon ki khidki se bahar dekho — jaise
train aage badhti hai, tumhe purana scene chhodna padta hai aur naya dikhta
hai, poora scene dobara nahi dekhna padta."* Jaise hi ek naya element window
mein aata hai, ek purana **nikal** jata hai — dono taraf ka kaam O(1) mein.

**Kab use karo**: Jab problem mein **subarray** ya **substring** ka zikar ho,
aur brute-force approach O(n²) (har start-end pair check karna) laga rahi ho.

## Code example — Longest Substring Without Repeating Characters

```java
public int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        // 🔑 jab tak repeat ho raha hai, LEFT se shrink karo jab tak clash na hate
        while (window.contains(s.charAt(right))) {
            window.remove(s.charAt(left));
            left++;
        }
        window.add(s.charAt(right));               // naya character window mein daalo
        maxLen = Math.max(maxLen, right - left + 1); // current window ka size check karo
    }
    return maxLen;
}
```

**Line by line samjho**: `right` pointer hamesha aage badhta hai (naya
character include karne ke liye). Agar `s.charAt(right)` already window
mein hai (duplicate mil gaya), `left` ko tab tak aage badhao jab tak wo
duplicate window se nikal na jaye — **isi shrink-expand cycle** se O(n)
time mein answer mil jata hai, O(n²) ki jagah.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Longest Substring Without Repeating Characters | Medium | [leetcode.com/problems/longest-substring-without-repeating-characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| 2 | Minimum Window Substring | Hard | [leetcode.com/problems/minimum-window-substring](https://leetcode.com/problems/minimum-window-substring/) |
| 3 | Longest Repeating Character Replacement | Medium | [leetcode.com/problems/longest-repeating-character-replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) |
| 4 | Permutation in String | Medium | [leetcode.com/problems/permutation-in-string](https://leetcode.com/problems/permutation-in-string/) |
| 5 | Fruit Into Baskets | Medium | [leetcode.com/problems/fruit-into-baskets](https://leetcode.com/problems/fruit-into-baskets/) |

Agla: [02-two-pointers.md](02-two-pointers.md)
