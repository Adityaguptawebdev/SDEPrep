# 17. Monotonic Stack

> **Standard definition**: A stack that maintains its elements in strictly increasing or strictly decreasing order, popping elements that violate this order before pushing a new one — used to efficiently find the "next greater/smaller" element.

**Ek line mein**: Stack ko hamesha **sorted order (increasing ya decreasing)**
mein rakho — naya element aane pe, jo bhi purane elements is order ko
todte hain unhe **pop** karte jao (aur unke liye answer mil jata hai
usi waqt), phir naya push karo.

**Trick yaad rakhne ki**: *"Height ke hisaab se line mein khade log, chhote
log jo apne se lambe ke peeche chhup jate hain unhe bahar nikal do"* —
jaise hi ek **lamba banda** aata hai, saare chhote (jo pehle stack mein
the) uske liye "next greater" mil gaya, unhe pop kar do.

**Kab use karo**: "**Next greater/smaller element**" jaisi problems, ya
histogram/water-trapping jaisi problems jaha **left/right ka nearest bada
element** janna ho.

## Code example — Daily Temperatures

```java
public int[] dailyTemperatures(int[] temperatures) {
    int[] result = new int[temperatures.length];
    Deque<Integer> stack = new ArrayDeque<>();   // 🔑 indices store karte hain, values nahi

    for (int i = 0; i < temperatures.length; i++) {
        // jab tak current temperature, stack ke top se zyada hai — unke liye answer mil gaya
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex;   // kitne din baad garam din mila
        }
        stack.push(i);
    }
    return result;   // jinke liye kabhi bada nahi mila, unke result mein default 0 rahega
}
```

**Line by line samjho**: Stack mein **temperatures decreasing order** mein
rehte hain (indices ke roop mein). Jaise hi ek **naya, bada** temperature
aata hai, stack ke top wale (jo isse chhote hain) ke liye **"next warmer
day" mil gaya** — unhe pop karke unka answer (`i - prevIndex`, kitne din
baad) record kar do. Har element **ek hi baar push aur ek hi baar pop**
hota hai, isliye ye O(n) hai, O(n²) brute-force ki jagah.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Next Greater Element I | Easy | [leetcode.com/problems/next-greater-element-i](https://leetcode.com/problems/next-greater-element-i/) |
| 2 | Next Greater Element II | Medium | [leetcode.com/problems/next-greater-element-ii](https://leetcode.com/problems/next-greater-element-ii/) |
| 3 | Asteroid Collision | Medium | [leetcode.com/problems/asteroid-collision](https://leetcode.com/problems/asteroid-collision/) |
| 4 | Sum of Subarray Minimums | Medium | [leetcode.com/problems/sum-of-subarray-minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) |
| 5 | Trapping Rain Water | Hard | [leetcode.com/problems/trapping-rain-water](https://leetcode.com/problems/trapping-rain-water/) |

Agla: [18-trie.md](18-trie.md)
