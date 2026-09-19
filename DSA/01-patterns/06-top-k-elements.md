# 6. Top K Elements (Heap / Priority Queue)

> **Standard definition**: A technique using a heap (priority queue) of size K to efficiently track the K largest/smallest/most-frequent elements without sorting the entire dataset.

**Ek line mein**: Puri list **sort** karne ki zarurat nahi — ek **min-heap
(ya max-heap) size K ka** rakho, isse "top K" elements track ho jate hain
O(n log k) mein, O(n log n) sorting ki jagah.

**Trick yaad rakhne ki**: *"Top 3 students ka leaderboard"* — poori class
ko sort karne ki zarurat nahi, bas top 3 ka ek chhota sa "podium" (min-heap
size 3) rakho. Naya student aaye jo podium ke sabse kamzor se better hai,
usse podium mein daal do aur sabse kamzor ko nikaal do.

**Kab use karo**: "Top K largest/smallest/frequent" jaisa koi bhi sawaal —
poori sorting overkill hai jab sirf K elements chahiye.

## Code example — Kth Largest Element in an Array

```java
public int findKthLargest(int[] nums, int k) {
    // 🔑 Min-Heap size K — sabse chhota element hamesha top pe (peek) rahega
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();   // heap se sabse chhota nikal do, size K maintain karo
        }
    }
    return minHeap.peek();   // ab heap ke top pe "Kth largest" hai
}
```

**Line by line samjho**: Heap ka size hamesha **K se zyada nahi hone dete**
— jaise hi K+1 elements ho jate hain, sabse chhota nikal dete hain (`poll()`
min-heap ka sabse chhota nikalta hai). Isse **sirf top K bade elements**
heap mein bache rehte hain, aur unme se **sabse chhota** (jo top pe hai)
hi asal mein "Kth largest" hai.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Top K Frequent Elements | Medium | [leetcode.com/problems/top-k-frequent-elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| 2 | Kth Largest Element in an Array | Medium | [leetcode.com/problems/kth-largest-element-in-an-array](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| 3 | Sort Characters By Frequency | Medium | [leetcode.com/problems/sort-characters-by-frequency](https://leetcode.com/problems/sort-characters-by-frequency/) |
| 4 | K Closest Points to Origin | Medium | [leetcode.com/problems/k-closest-points-to-origin](https://leetcode.com/problems/k-closest-points-to-origin/) |
| 5 | Find K Pairs with Smallest Sums | Medium | [leetcode.com/problems/find-k-pairs-with-smallest-sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) |

Agla: [07-prefix-sum.md](07-prefix-sum.md)
