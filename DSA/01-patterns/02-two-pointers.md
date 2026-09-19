# 2. Two Pointers

> **Standard definition**: A technique using two index pointers that traverse a data structure (often from opposite ends, or both from the start at different speeds) to reduce time complexity, typically from O(n²) to O(n).

**Ek line mein**: Do pointers rakho — kabhi **opposite ends se** shuru karo
(ek start se, ek end se, beech mein milte hain), kabhi **dono start se** alag
speed pe — condition ke hisaab se andar/bahar move karo.

**Trick yaad rakhne ki**: *"Do log ek kamre ko dono taraf se saaf karte hain,
beech mein milte hain"* — ek hi direction mein akela scan karne se **do guna
fast** hai, kyunki dono taraf se information use ho rahi hai (especially
**sorted** data pe).

**Kab use karo**: **Sorted arrays**, linked lists, ya problems jinme
**pairs/triplets** dhoondhne hain (jaise "do numbers jinka sum X ho").

## Code example — Two Sum II (sorted array)

```java
public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;

    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[]{left + 1, right + 1};   // 1-indexed answer chahiye is problem mein
        } else if (sum < target) {
            left++;    // 🔑 sum chhota hai, left ko badhao (bada number chahiye)
        } else {
            right--;   // 🔑 sum bada hai, right ko ghatao (chhota number chahiye)
        }
    }
    return new int[]{-1, -1};
}
```

**Line by line samjho**: Array **sorted** hai isliye ye trick kaam karti hai
— agar `sum` target se **kam** hai, `left` ko aage badhane se sum **badhega**
(kyunki array sorted hai, aage bade numbers hain). Agar `sum` **zyada** hai,
`right` ko peeche laane se sum **ghatega**. Har step mein search space
**1 element se kam** hota hai — O(n) mein solution, O(n²) brute-force ki jagah.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Two Sum II - Input Array Is Sorted | Medium | [leetcode.com/problems/two-sum-ii-input-array-is-sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| 2 | 3Sum | Medium | [leetcode.com/problems/3sum](https://leetcode.com/problems/3sum/) |
| 3 | Container With Most Water | Medium | [leetcode.com/problems/container-with-most-water](https://leetcode.com/problems/container-with-most-water/) |
| 4 | Sort Colors | Medium | [leetcode.com/problems/sort-colors](https://leetcode.com/problems/sort-colors/) |
| 5 | Trapping Rain Water | Hard | [leetcode.com/problems/trapping-rain-water](https://leetcode.com/problems/trapping-rain-water/) |

Agla: [03-fast-slow-pointers.md](03-fast-slow-pointers.md)
