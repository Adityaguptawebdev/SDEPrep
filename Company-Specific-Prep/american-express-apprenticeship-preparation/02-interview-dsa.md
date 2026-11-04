# 02 — DSA in Interviews: Questions + Answers

These were asked **live** in technical rounds (not in the OA). 🟢 apprentice · 🔵 Amex India entry-level. Every code block was run and tested.

🟢 An apprentice report says "2 DSA questions, slightly medium LeetCode" but doesn't name them [GD-AP]. The questions below are the ones Amex freshers did name.

---

## 1. Climbing Stairs 🔵 (Engineer Trainee, Aug 2025)

**Q: You can climb 1 or 2 steps at a time. In how many ways can you reach step n?** [LC 70](https://leetcode.com/problems/climbing-stairs/)

To reach step `n`, your last move was either from `n-1` or from `n-2`. So `ways(n) = ways(n-1) + ways(n-2)`, the same as Fibonacci.

```java
static int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;                 // ways for step 1 and step 2
    for (int i = 3; i <= n; i++) {
        int c = a + b;                // 🔑 ways(i) = ways(i-1) + ways(i-2)
        a = b;
        b = c;
    }
    return b;                         // n = 5 → 8
}
```
**Time** O(n) · **Space** O(1)

---

## 2. Maximum Subarray Sum 🔵 (Engineer Trainee, Aug 2025)

**Q: Find the contiguous subarray with the largest sum.** [LC 53](https://leetcode.com/problems/maximum-subarray/)

**Kadane's algorithm:** at each number, either **extend** the current subarray or **start fresh** from this number, whichever is bigger.

> 💡 **Hinglish:** Pichla sum negative ho gaya to usko chhod do, naye se shuru karo.

```java
static int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);   // 🔑 extend or start fresh
        best = Math.max(best, cur);
    }
    return best;          // [-2,1,-3,4,-1,2,1,-5,4] → 6   ·   [-3,-1,-2] → -1
}
```
**Time** O(n) · **Space** O(1)

---

## 3. Merge Sort + the `mid` question 🔵 (Engineer Trainee, Aug 2025)

**Q: Write Merge Sort and trace it on an array.**
Split the array into two halves, sort each half, then **merge** the two sorted halves.

```
[38, 27, 43, 3]
   /        \
[38, 27]   [43, 3]        split
 /   \      /   \
[38] [27] [43]  [3]       single items are sorted
 \   /      \   /
[27, 38]   [3, 43]        merge
    \        /
 [3, 27, 38, 43]          merge
```

```java
static void mergeSort(int[] a, int low, int high) {
    if (low >= high) return;
    int mid = low + (high - low) / 2;   // 🔑 safe from overflow
    mergeSort(a, low, mid);
    mergeSort(a, mid + 1, high);
    merge(a, low, mid, high);
}

static void merge(int[] a, int low, int mid, int high) {
    int[] tmp = new int[high - low + 1];
    int i = low, j = mid + 1, k = 0;
    while (i <= mid && j <= high) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= high) tmp[k++] = a[j++];
    System.arraycopy(tmp, 0, a, low, tmp.length);
}
```
**Time** O(n log n) always · **Space** O(n)

**Q: Does `mid = (low + high) / 2` have a problem? How do you fix it?**
Yes. If `low` and `high` are both big, `low + high` can go past the `int` limit (about 2.1 billion) and **overflow** to a negative number.
Fix: `mid = low + (high - low) / 2`. Tested: `low = 2,000,000,000, high = 2,100,000,000` gives `-97483648` with the old formula and `2050000000` with the fix.

---

## 4. Merge Sort vs Quick Sort 🔵 (Tech Intern)

| | Merge Sort | Quick Sort |
|---|---|---|
| Idea | split in half, sort, merge | pick a pivot, put smaller left and bigger right, repeat |
| Time | O(n log n) **always** | O(n log n) average, **O(n²) worst** |
| Extra space | O(n) | O(log n) (recursion only) |
| Stable? | Yes | No |
| Good for | linked lists, big data, when stability matters | arrays in memory (fast in practice) |

**Q: When does Quick Sort become O(n²)?** When the pivot is always the **smallest or biggest** element, for example an already sorted array with the first or last element as pivot. Each split then removes only one element. Fix: pick a **random pivot** or the median of three.

---

## 5. Min element · 49th smallest · Kth largest 🔵 (Tech Intern)

**Q: Find the minimum element.** Loop once and keep the smallest value seen. O(n).

**Q: Find the Kth largest element.** [LC 215](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- Brute force: sort and take `nums[n-k]`. O(n log n).
- Better: keep a **min-heap of size k**. Once it holds more than `k` items, remove the smallest. At the end, the top of the heap is the Kth largest. O(n log k).

```java
static int kthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int x : nums) {
        minHeap.add(x);
        if (minHeap.size() > k) minHeap.poll();   // keep only the k biggest
    }
    return minHeap.peek();
}
```

**Q: Find the 49th smallest element. What if the array has only 15 elements?**
Use the same trick with a **max-heap of size 49**. If the array has only 15 elements, there is **no 49th smallest**. Say so and return an error instead of crashing.

```java
static int kthSmallest(int[] nums, int k) {
    if (k > nums.length) throw new IllegalArgumentException("array has only " + nums.length + " elements");
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int x : nums) {
        maxHeap.add(x);
        if (maxHeap.size() > k) maxHeap.poll();   // keep only the k smallest
    }
    return maxHeap.peek();
}
```

---

## 6. Delete a linked-list node when you only have that node 🔵 (Tech Intern)

**Q: You get a pointer to a node (not the head). Delete it.** [LC 237](https://leetcode.com/problems/delete-node-in-a-linked-list/)
You can't reach the previous node. So **copy the next node's value into this node**, then skip the next node.

```java
static void deleteNode(ListNode node) {
    node.val = node.next.val;       // copy next value here
    node.next = node.next.next;     // skip the next node
}
// 4 → 5 → 1 → 9, delete(5) → 4 → 1 → 9
```
This does **not** work for the last node, because there is no next node to copy.

**Q: Linked list complexities?**

| Operation | Array | Linked list |
|---|---|---|
| Access the i-th item | O(1) | O(n) |
| Insert/delete at the start | O(n) | **O(1)** |
| Insert/delete in the middle (you have the node) | O(n) | O(1) |
| Search | O(n) | O(n) |

---

## 7. Swap two variables without a third 🔵 (SE Trainee, 2021)

```java
int x = 5, y = 9;
x = x + y;   // 14
y = x - y;   // 5
x = x - y;   // 9      → x = 9, y = 5

// XOR way (no overflow problem)
x = x ^ y;  y = x ^ y;  x = x ^ y;
```

---

## 8. Add two numbers → strings → exception handling 🔵 (Intern)

**Q: Write a program to add two numbers. What happens if two strings are passed? Add exception handling.**
- `2 + 3 = 5`, but `"2" + "3" = "23"`. With strings, `+` **joins** them instead of adding.
- Convert with `Integer.parseInt()`. If the input is not a number (`"abc"`), it throws `NumberFormatException`. **Catch it** so the program doesn't crash and the user gets a clear message.

```java
static int add(String a, String b) {
    try {
        return Integer.parseInt(a.trim()) + Integer.parseInt(b.trim());
    } catch (NumberFormatException e) {
        System.out.println("Please enter numbers only");
        return 0;
    }
}
// add("2", "3") → 5      add("2", "abc") → prints message, returns 0
```

**Why exception handling matters:** bad input should not crash the whole app. You show a friendly error, log it, and continue.

---

## 9. Types of trees 🔵 (SE Trainee, 2021)

| Tree | One line |
|---|---|
| Binary tree | each node has at most 2 children |
| Binary Search Tree (BST) | left < node < right, so search is O(log n) when balanced |
| Balanced tree (AVL, Red-Black) | keeps height about log n, so operations stay fast |
| Heap | parent ≥ children (max-heap) or ≤ (min-heap); used for priority queues |
| Trie | stores words letter by letter; used for prefix search and autocomplete |
| B / B+ tree | many children per node; used by **database indexes** |
| Full / Complete / Perfect | full: 0 or 2 children; complete: filled left to right; perfect: all levels full |

Agla: [03-sql-dbms.md](03-sql-dbms.md)
