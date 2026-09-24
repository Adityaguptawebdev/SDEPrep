# 15. Heap & Priority Queue

> 📍 **Syllabus**: Unit 3 — Trees & Heaps · Topic 15 / 29 · Pehle chahiye: [Binary Tree](13-binary-tree.md), [Queue](../02-linear-structures/12-queue-and-deque.md), [Sorting](../01-basics/07-sorting.md)

> **Standard definition**: A heap is a complete binary tree, usually stored in an array, that satisfies the heap property — in a min-heap every parent is less than or equal to its children (in a max-heap, greater than or equal) — giving O(1) access to the minimum (or maximum) and O(log n) insertion and removal; it is the standard implementation of a priority queue.

**Ek line mein**: Ek aisa "tree" jisme **sabse chhota (ya sabse bada) element hamesha sabse upar (root)** hota hai — use O(1) mein dekh sakte ho aur **O(log n)** mein naya daal/nikaal sakte ho.

**Trick yaad rakhne ki**: *"Hospital ki emergency (triage)"* — patient kisi bhi order mein aayein, **sabse serious patient pehle dekha jata hai**, aane ke time se farq nahi padta. Ye hai **Priority Queue**. Aur **Heap** uska "andar ka tarika" hai jisse ye sab fast hota hai. (Normal Queue mein pehle aao-pehle pao; yahan **pehle zarurat-mand**.)

**Kab use karo**: **"Top K"**, **"K-th largest/smallest"**, **"baar-baar sabse chhota/bada nikaalo"**, **K sorted lists ka merge**, **running median**, scheduling (Dijkstra, Huffman, Task Scheduler). Jahan poora sort karna faltu ho.

## Heap array mein kaise rehta hai

Heap ek **complete binary tree** hai (levels upar se neeche, left se right bharte hain — beech mein khaali jagah nahi), isliye use **array** mein rakh sakte hain, pointers ki zarurat nahi:

```
Min-Heap  (har parent ≤ apne bachche)

             1                     index :  0  1  2  3  4  5  6
           /   \                   array : [1, 3, 2, 7, 4, 5, 6]
          3     2
         / \   / \                 Node i ke liye:
        7   4 5   6                    parent  = (i − 1) / 2
                                       left    = 2i + 1
                                       right   = 2i + 2
```

**Dhyaan do**: Heap **sorted nahi** hota — sirf **parent ≤ bachche** ka rule hai. Bas **root** hi guaranteed smallest hai. Isliye ye BST se **sasta** hai (sirf min/max chahiye toh).

| Operation | Time | Kaise |
|---|---|---|
| `peek()` — min/max dekho | **O(1)** | Root |
| `offer(x)` — daalo | **O(log n)** | Aakhir mein daalo, **upar chadhao** (sift up) |
| `poll()` — nikaalo | **O(log n)** | Aakhri ko root pe lao, **neeche utaro** (sift down) |
| Array se heap banao (heapify) | **O(n)** | Neeche se upar sift down |
| Search / kisi element ko hatao | O(n) | Heap mein search ke liye bana hi nahi |

## Insert (Sift Up) aur Poll (Sift Down) — dekho kaise

**Insert 0** in `[1, 3, 2, 7, 4, 5, 6]`: aakhir mein daalo, phir **parent se chhota hai toh swap** karte hue upar chadho.

```
[1, 3, 2, 7, 4, 5, 6, 0]    0 index 7 pe; parent index 3 (=7)   0 < 7 → swap
[1, 3, 2, 0, 4, 5, 6, 7]    0 index 3 pe; parent index 1 (=3)   0 < 3 → swap
[1, 0, 2, 3, 4, 5, 6, 7]    0 index 1 pe; parent index 0 (=1)   0 < 1 → swap
[0, 1, 2, 3, 4, 5, 6, 7]    root ban gaya, ruk gaye ✅
```

**Poll** (min nikaalo): **aakhri element ko root pe le aao**, phir **dono bachcho mein se chhote se swap** karte hue neeche utaro.

```
[0, 1, 2, 3, 4, 5, 6, 7]  →  0 nikaal liya, aakhri (7) root pe:  [7, 1, 2, 3, 4, 5, 6]
7 ke bachche 1, 2 → chhota 1 → swap      [1, 7, 2, 3, 4, 5, 6]
7 ke bachche 3, 4 → chhota 3 → swap      [1, 3, 2, 7, 4, 5, 6]
7 ke bachche nahi bache → ruk gaye ✅    (heap wapas theek)
```

## Code example 1 — Min Heap khud banao

```java
class MinHeap {
    private int[] data = new int[8];
    private int size = 0;

    public void offer(int x) {
        if (size == data.length) data = Arrays.copyOf(data, size * 2);   // bhar gaya → double karo
        data[size] = x;                        // 1) sabse aakhri jagah pe daalo (tree complete rehta hai)
        siftUp(size);                          // 2) upar chadhao jab tak parent chhota na mile
        size++;
    }

    public int peek() { return data[0]; }      // min hamesha root pe — O(1)

    public int poll() {
        int min = data[0];
        data[0] = data[--size];                // 1) aakhri element ko root pe le aao
        siftDown(0);                           // 2) neeche utaro jab tak dono bachche bade na hon
        return min;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[parent] <= data[i]) break;      // parent chhota hai → heap theek
            swap(i, parent);
            i = parent;
        }
    }

    private void siftDown(int i) {
        while (true) {
            int left = 2 * i + 1, right = 2 * i + 2, smallest = i;
            if (left < size && data[left] < data[smallest]) smallest = left;
            if (right < size && data[right] < data[smallest]) smallest = right;
            if (smallest == i) break;                // dono bachche bade → jagah sahi hai
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int a, int b) {
        int t = data[a]; data[a] = data[b]; data[b] = t;
    }
}
```

**Max-Heap chahiye?** Bas comparisons ulte kar do (`<` ↔ `>`), ya values ko negative karke min-heap mein daalo.

## Code example 2 — Java ka `PriorityQueue`

```java
public void priorityQueueBasics() {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();                             // default = MIN heap
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());   // MAX heap

    minHeap.offer(5); minHeap.offer(1); minHeap.offer(3);
    int smallest = minHeap.peek();       // 1 — dekho (O(1))
    int removed = minHeap.poll();        // 1 — nikaalo (O(log n))

    // Apna order: int[] pairs ko [1] (doosre element) se compare karo
    PriorityQueue<int[]> byScore = new PriorityQueue<>((x, y) -> Integer.compare(x[1], y[1]));   // 🔑 x[1] - y[1] nahi (overflow)
    byScore.offer(new int[]{101, 50});
    byScore.offer(new int[]{102, 20});
    int[] best = byScore.poll();         // {102, 20}

    // Heap se sorted order nikalna = baar-baar poll()
    PriorityQueue<Integer> pq = new PriorityQueue<>(Arrays.asList(4, 2, 9, 1));   // list se heap banana: O(n)
    while (!pq.isEmpty()) System.out.print(pq.poll() + " ");                      // 1 2 4 9
    // ❌ for (int x : pq) ... — ye SORTED order nahi deta (andar ka array order deta hai)!
}
```

## Code example 3 — Heap Sort (heap ka side-effect)

**Idea**: Array ko **max-heap** bana lo → root sabse bada hai → use **aakhir mein bhej do** → baaki ko dobara heap banao → repeat. **O(n log n)**, extra space **O(1)**.

```java
public void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDown(arr, i, n);              // 🔑 heapify: aakhri parent se root tak — O(n)
    }
    for (int end = n - 1; end > 0; end--) {
        swap(arr, 0, end);                // sabse bada (root) ko aakhir mein bhej do
        siftDown(arr, 0, end);            // chhoti hui heap (size = end) ko theek karo
    }
}

private void siftDown(int[] arr, int i, int size) {         // MAX heap ka sift down
    while (true) {
        int left = 2 * i + 1, right = 2 * i + 2, largest = i;
        if (left < size && arr[left] > arr[largest]) largest = left;
        if (right < size && arr[right] > arr[largest]) largest = right;
        if (largest == i) break;
        swap(arr, i, largest);
        i = largest;
    }
}

private void swap(int[] arr, int a, int b) {
    int t = arr[a]; arr[a] = arr[b]; arr[b] = t;
}
```

**Heapify O(n) kyun hai (O(n log n) nahi)?** Neeche ke nodes zyada hain par unhe **kam** neeche utarna padta hai; upar ke nodes kam hain jinhe zyada utarna padta hai — sab jodne par total O(n) aata hai.

## Code example 4 — Kth Largest (ulti-si baat: MIN heap!)

**Trick (yaad rakhne layak)**: *"K sabse bade chahiye toh **MIN-heap** rakho (size k). K sabse chhote chahiye toh **MAX-heap**."* Kyun? Heap mein sirf **k sabse bade** rakhne hain — jaise hi k+1 ho jaye, **sabse chhota (jo ab bada nahi hai) nikaal do**. Root = un k mein sabse chhota = **k-th largest**.

```
nums = [3, 2, 1, 5, 6, 4],  k = 2      (MIN heap, size ≤ 2)

3   → [3]
2   → [2, 3]
1   → [1, 2, 3] → size 3 > 2 → sabse chhota 1 nikaalo → [2, 3]
5   → [2, 3, 5] → 2 nikaalo → [3, 5]
6   → [3, 5, 6] → 3 nikaalo → [5, 6]
4   → [4, 5, 6] → 4 nikaalo → [5, 6]

heap.peek() = 5   ✅  (2nd largest)
```

```java
public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();     // MIN heap
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();                    // 🔑 k se zyada ho gaye → sabse chhota nikaal do
    }
    return heap.peek();                                       // bache k bado mein sabse chhota = k-th largest
}
```

**Time O(n log k)** — poora sort (O(n log n)) se behtar jab `k` chhota ho.

## Code example 5 — Top K Frequent Elements

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);             // 1) har element kitni baar aaya

    PriorityQueue<Integer> heap =                                    // 2) frequency ke hisaab se MIN heap
        new PriorityQueue<>((a, b) -> Integer.compare(freq.get(a), freq.get(b)));
    for (int x : freq.keySet()) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();                            // 🔑 sabse KAM frequent nikaal do
    }

    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--) res[i] = heap.poll();
    return res;
}
```

## Code example 6 — Merge K Sorted Lists

**Trick**: *"K counters pe K line — har line ka sabse aage wala banda heap mein rakho. Jo sabse chhota hai use bulao, phir uski line ka agla banda heap mein daalo."*

```java
public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));   // har list ka current head
    for (ListNode head : lists) {
        if (head != null) heap.offer(head);
    }
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode smallest = heap.poll();          // 🔑 saari lists ke heads mein sabse chhota
        tail.next = smallest;
        tail = tail.next;
        if (smallest.next != null) heap.offer(smallest.next);   // us list ka agla node heap mein
    }
    return dummy.next;
}
```

Heap mein hamesha sirf **k nodes** rehte hain, isliye time **O(N log k)** (N = total nodes) — [Linked List](../02-linear-structures/10-linked-list.md) ke `mergeTwoLists` ko baar-baar chalane se behtar.

## Code example 7 — Median from Data Stream (Two Heaps) ⭐

**Problem**: Numbers ek-ek karke aa rahe hain; kisi bhi waqt **median** batao.

**Trick**: *"Beech ki line kheencho"* — saare numbers ko **do aadhon** mein baanto: **chhoti aadhi** (MAX heap — uska top = chhoti aadhi ka sabse bada) aur **badi aadhi** (MIN heap — uska top = badi aadhi ka sabse chhota). Median in **dono ke top** se milta hai!

```
stream: 5, 15, 1, 3

low (MAX heap)   high (MIN heap)     median
   [5]              []                 5
   [5]              [15]               (5 + 15) / 2 = 10
   [5, 1]           [15]               5                   ← low mein 1 extra
   [3, 1]           [5, 15]            (3 + 5) / 2 = 4

low ka top ≤ high ka top  hamesha    |    sizes: low = high  ya  low = high + 1
```

```java
class MedianFinder {
    private PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());   // chhoti aadhi (MAX heap)
    private PriorityQueue<Integer> high = new PriorityQueue<>();                             // badi aadhi (MIN heap)

    public void addNum(int num) {
        low.offer(num);                                    // 1) pehle low mein daalo
        high.offer(low.poll());                            // 2) low ka sabse bada high mein bhej do (dono aadhe sahi rahein)
        if (high.size() > low.size()) low.offer(high.poll());   // 3) balance: low mein zyada se zyada 1 extra
    }

    public double findMedian() {
        if (low.size() > high.size()) return low.peek();                  // odd count → low ka top
        return ((long) low.peek() + high.peek()) / 2.0;                   // even count → dono tops ka average
    }
}
```

`addNum` **O(log n)**, `findMedian` **O(1)**. Har baar sort karte toh O(n log n) padta.

## Heap kab lagana hai — pehchano

| Problem ka hint | Kya karo |
|---|---|
| "**Top K** / **K-th** largest/smallest" | Size-k heap (largest → MIN heap) |
| "Baar-baar **sabse chhota/bada** nikaalo" | Heap |
| "**K sorted** lists/arrays merge karo" | Har list ka head heap mein |
| "**Running median**" | Do heaps |
| Shortest path (weighted) | Heap ke saath Dijkstra → [Shortest Path](../05-graphs/22-shortest-path.md) |
| Greedy "sabse achha option pehle" | Heap ([Greedy](../04-paradigms/18-greedy.md)) |

Pattern-style practice ke liye [Top K Elements pattern](../../01-patterns/06-top-k-elements.md) bhi dekho.

## Common galtiyan

- **`PriorityQueue` ko iterate karke sorted order maanna** — nahi milta. `poll()` karte raho.
- **K largest ke liye MAX-heap bharna** — size k ki heap mein galat elements bachte hain. **MIN-heap of size k**.
- **Comparator mein `a - b`** — overflow ho sakta hai. `Integer.compare(a, b)`.
- **Heap ke andar ke element ko badalna** — heap ko pata nahi chalta, order bigad jata hai. Purana `remove` (O(n)) karke naya `offer` karo.
- **`null` daalna** — `PriorityQueue` allow nahi karta.
- **Equal priority pe order ka bharosa** — stable nahi hai.

> 💡 **Interview mein bolne wali line**: *"Poora sort O(n log n) hoga; par mujhe sirf top k chahiye, isliye main size-k min-heap rakhunga — har element pe O(log k), total O(n log k), aur space O(k)."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Kth Largest Element in a Stream | Easy | Size-k MIN heap | [leetcode.com/problems/kth-largest-element-in-a-stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) |
| 2 | Last Stone Weight | Easy | Max heap simulation | [leetcode.com/problems/last-stone-weight](https://leetcode.com/problems/last-stone-weight/) |
| 3 | Kth Largest Element in an Array | Medium | Size-k heap / quickselect | [leetcode.com/problems/kth-largest-element-in-an-array](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| 4 | K Closest Points to Origin | Medium | Distance se max-heap | [leetcode.com/problems/k-closest-points-to-origin](https://leetcode.com/problems/k-closest-points-to-origin/) |
| 5 | Top K Frequent Words | Medium | Freq + custom comparator | [leetcode.com/problems/top-k-frequent-words](https://leetcode.com/problems/top-k-frequent-words/) |
| 6 | Reorganize String | Medium | Max heap by count | [leetcode.com/problems/reorganize-string](https://leetcode.com/problems/reorganize-string/) |
| 7 | Task Scheduler | Medium | Max heap + cooldown | [leetcode.com/problems/task-scheduler](https://leetcode.com/problems/task-scheduler/) |
| 8 | Find K Pairs with Smallest Sums | Medium | Heap se "next smallest" | [leetcode.com/problems/find-k-pairs-with-smallest-sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) |
| 9 | Merge k Sorted Lists | Hard | Har list ka head heap mein | [leetcode.com/problems/merge-k-sorted-lists](https://leetcode.com/problems/merge-k-sorted-lists/) |
| 10 | Find Median from Data Stream | Hard | Do heaps | [leetcode.com/problems/find-median-from-data-stream](https://leetcode.com/problems/find-median-from-data-stream/) |
| 11 | IPO | Hard | Greedy + do heaps | [leetcode.com/problems/ipo](https://leetcode.com/problems/ipo/) |
| 12 | Smallest Range Covering Elements from K Lists | Hard | Heap + running max | [leetcode.com/problems/smallest-range-covering-elements-from-k-lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) |

Agla: [16-trie.md](16-trie.md)
