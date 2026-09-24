# 6. Top K Elements (Heap / Priority Queue)

> Pehle ye aane chahiye: [Heap & Priority Queue](../00-syllabus/03-trees-and-heaps/15-heap-priority-queue.md), [Hashing](../00-syllabus/01-basics/04-hashing.md), [Sorting](../00-syllabus/01-basics/07-sorting.md)

> **Standard definition**: A technique using a heap (priority queue) of size K to efficiently track the K largest/smallest/most-frequent elements without sorting the entire dataset.

**Ek line mein**: Poori list **sort** karne ki zarurat nahi — **ek heap sirf K size ka** rakho aur har naya element aane pe **sabse kamzor chune hue ko bahar nikaal do**. O(n log k), O(n log n) sorting ki jagah.

**Trick yaad rakhne ki**: *"Top 3 students ka leaderboard (podium)"* — poori class sort nahi karte. Bas **3 kursi ka podium** rakho. Naya student aaya: podium pe baitha do, phir agar 4 log ho gaye toh **sabse kamzor** ko utaar do. Podium ke **sabse kamzor** ko hi turant dekhna hai — isliye heap (jiska top O(1) mein milta hai).

```
K = 3 bade chahiye:        podium (MIN-heap, size 3)          naya aaya 8:

   [5, 9, 7]  → top = 5 (sabse kamzor)                        8 push → [5, 7, 8, 9]  (size 4 > 3)
                                                              sabse kamzor (5) poll → [7, 8, 9]  ✅
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Sawaal mein "K" hai:  top K / K-th largest / K-th smallest / K most frequent / K closest / K sorted lists
✅ K, n se BAHUT chhota hai  (K ≈ n ho toh seedha sort kar lo)
✅ Poora sorted order nahi chahiye — sirf top K (ya bas K-th)
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**K-th largest / smallest** element", "top K bade/chhote" | ① **Kth element** |
| "**K most frequent** elements / words", "characters ko frequency se sort" | ② **Top K Frequent** |
| "origin ke **K sabse paas** points", "x ke **K closest** numbers" | ③ **K Closest** |
| "**K sorted lists / matrix** se K-th smallest", "K smallest **pairs**", "lists merge" | ④ **K-way merge** |
| "**stream** aa rahi hai, har waqt K-th largest / median" | ⑤ **Streaming** |

### ❌ Kab NAHI
- **K ≈ n** ya poora sorted order chahiye → seedha `Arrays.sort`.
- **Sirf 1 max/min** → ek scan (heap overkill).
- **Sorted array + K-th** → seedha index `arr[k-1]`.

---

## 2. Sabse zaroori faisla — KAUNSA heap? (Min ya Max)

**Trick jo ulti lagti hai par sahi hai**: *"K **bade** chahiye toh **MIN**-heap; K **chhote** chahiye toh **MAX**-heap."*

Kyun? Heap ke **top pe wo rakho jise tum NIKAALNA chahte ho** — yaani **sabse kamzor chuna hua**.

```
K BADE chahiye  →  heap mein chune hue k bade rakhe hain;  unme SABSE CHHOTA kamzor hai
                   → use top pe rakho → MIN-heap.      Naya bada aaya → chhota nikaal do.

K CHHOTE chahiye →  heap mein k chhote;  unme SABSE BADA kamzor hai
                   → use top pe rakho → MAX-heap.      Naya chhota aaya → bada nikaal do.
```

| Chahiye | Heap | Size | Top pe kaun (evict hone wala) | Answer |
|---|---|---|---|---|
| K largest / **K-th largest** | **MIN**-heap | `k` | k bado mein **sabse chhota** | poora heap / `peek()` |
| K smallest / **K-th smallest** | **MAX**-heap | `k` | k chhoto mein **sabse bada** | poora heap / `peek()` |
| K most frequent | MIN-heap (frequency se) | `k` | sabse kam frequent | poora heap |
| K closest to origin | **MAX**-heap (distance se) | `k` | sabse door | poora heap |

## 3. Code likhne ki recipe — 3 sawaal

```
1. KYA CHAHIYE  →  K largest ya K smallest ya K frequent ya K closest?   →  heap ka type (upar ki table)
2. COMPARATOR   →  kis cheez se compare?  (value / frequency / distance / sum)
3. LOOP         →  har item ke liye:  heap.offer(item);  if (heap.size() > k) heap.poll();
```

**Template** (yehi baar-baar likhna hai):

```
PriorityQueue<T> heap = new PriorityQueue<>(comparator);     // top = sabse "kamzor" chuna hua
for (T item : items) {
    heap.offer(item);
    if (heap.size() > k) heap.poll();                        // 🔑 sabse kamzor ko bahar
}
// heap mein ab top-K hain
```

---

## 4. ① Kth Largest / Smallest

```
nums = [3, 2, 1, 5, 6, 4],  k = 2      (MIN-heap, size ≤ 2)

3 → [3]      2 → [2,3]      1 → [1,2,3] → size 3 > 2 → 1 nikalo → [2,3]
5 → [2,3,5] → 2 nikalo → [3,5]      6 → [3,5,6] → 3 nikalo → [5,6]      4 → [4,5,6] → 4 nikalo → [5,6]

peek() = 5   ✅  (2nd largest)
```

```java
// K-th LARGEST — MIN-heap of size k
public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();                                       // k bado mein sabse chhota = k-th largest
}

// K-th SMALLEST — MAX-heap of size k  (sirf heap ka type ulta)
public int findKthSmallest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();
}

// Quickselect — average O(n), heap ke O(n log k) se tez. 3-way partition (duplicates ke liye safe)
public int findKthLargestQuick(int[] nums, int k) {
    int target = nums.length - k;                              // k-th largest = sorted array mein index n − k
    int lo = 0, hi = nums.length - 1;
    Random rand = new Random();
    while (lo <= hi) {
        int pivot = nums[lo + rand.nextInt(hi - lo + 1)];      // random pivot
        int lt = lo, i = lo, gt = hi;                          // [lo,lt) < pivot | [lt,i) == pivot | (gt,hi] > pivot
        while (i <= gt) {
            if (nums[i] < pivot) swap(nums, lt++, i++);
            else if (nums[i] > pivot) swap(nums, i, gt--);
            else i++;
        }
        if (target < lt) hi = lt - 1;                          // answer chhoto ke zone mein
        else if (target > gt) lo = gt + 1;                     // answer bado ke zone mein
        else return pivot;                                     // 🔑 answer barabar-zone mein → pivot hi answer
    }
    return -1;
}

private void swap(int[] nums, int a, int b) {
    int t = nums[a]; nums[a] = nums[b]; nums[b] = t;
}
```

| | Time | Space | Kab |
|---|---|---|---|
| Sort | O(n log n) | O(1) | Chhota n |
| Heap size k | **O(n log k)** | O(k) | Stream / k chhota |
| Quickselect | **O(n) average** | O(1) | Ek baar ka K-th, data badalna theek hai |

---

## 5. ② Top K Frequent

**2 hisse**: **(1)** HashMap se **frequency** ginti. **(2)** Frequency ke hisaab se **top K** (MIN-heap by frequency).

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);          // 1) har number kitni baar

    PriorityQueue<Integer> heap =                                // 2) MIN-heap, FREQUENCY se compare
        new PriorityQueue<>((a, b) -> Integer.compare(freq.get(a), freq.get(b)));
    for (int x : freq.keySet()) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();                        // sabse kam frequent bahar
    }
    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--) res[i] = heap.poll();      // heap se ghatte order mein nikalta hai, isliye peeche se bharo
    return res;
}

// Bucket sort — O(n): "frequency f wale numbers" ki list. Bade f se k numbers uthao
public int[] topKFrequentBucket(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);

    List<List<Integer>> bucket = new ArrayList<>();              // bucket[f] = jinki frequency f hai
    for (int i = 0; i <= nums.length; i++) bucket.add(new ArrayList<>());
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) bucket.get(e.getValue()).add(e.getKey());

    int[] res = new int[k];
    int idx = 0;
    for (int f = nums.length; f >= 1 && idx < k; f--) {          // 🔑 sabse zyada frequency se neeche aao
        for (int x : bucket.get(f)) {
            if (idx == k) break;
            res[idx++] = x;
        }
    }
    return res;
}
```

### Tie-break wala roop — Top K Frequent Words

Frequency **barabar** ho toh **alphabetical (chhota pehle)**. Heap ka "kamzor" ab do cheezon se tay hota hai: **kam frequency**, aur barabar frequency mein **lexicographically bada** (baad wala).

```java
public List<String> topKFrequentWords(String[] words, int k) {
    Map<String, Integer> count = new HashMap<>();
    for (String w : words) count.merge(w, 1, Integer::sum);

    PriorityQueue<String> heap = new PriorityQueue<>((a, b) -> {
        int fa = count.get(a), fb = count.get(b);
        return fa != fb ? Integer.compare(fa, fb)                 // kam frequency = kamzor
                        : b.compareTo(a);                         // 🔑 barabar mein: alphabet mein BADA = kamzor
    });
    for (String w : count.keySet()) {
        heap.offer(w);
        if (heap.size() > k) heap.poll();
    }
    LinkedList<String> res = new LinkedList<>();
    while (!heap.isEmpty()) res.addFirst(heap.poll());            // kamzor pehle nikle → aage lagate jao
    return res;
}
```

---

## 6. ③ K Closest

### Origin ke K sabse paas points — MAX-heap by distance

**Distance ka `sqrt` mat nikalo** — sirf compare karna hai, `x² + y²` kaafi hai.

```java
public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(dist(b), dist(a)));   // MAX-heap: sabse door top pe
    for (int[] p : points) {
        heap.offer(p);
        if (heap.size() > k) heap.poll();                        // sabse door wala bahar
    }
    return heap.toArray(new int[0][]);
}

private int dist(int[] p) {
    return p[0] * p[0] + p[1] * p[1];                            // sqrt ki zarurat nahi (compare hi karna hai)
}
```

### Sorted array mein x ke K closest — Binary Search + window

Array **sorted** hai toh heap ki zarurat nahi. Answer hamesha **k length ki ek contiguous window** hota hai. Window ke **start** pe binary search: `[arr[mid] ... arr[mid+k]]` mein se **kaunsa sira x se door hai** wahi hatao.

```java
public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int left = 0, right = arr.length - k;                        // window ka start [0, n − k]
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (x - arr[mid] > arr[mid + k] - x) left = mid + 1;     // 🔑 left sira zyada door → window daayein khiskao
        else right = mid;                                         // warna (barabar mein bhi) baayein
    }
    List<Integer> res = new ArrayList<>();
    for (int i = left; i < left + k; i++) res.add(arr[i]);
    return res;
}
```

---

## 7. ④ K-way Merge (K sorted sources se)

**Idea**: *"K counters pe K line — har line ka sabse aage wala banda heap mein. Sabse chhota bulao, phir **uski line ka agla banda** heap mein daalo."* Heap mein hamesha **sirf K entries** (har source ka ek "current").

**Template**:

```
heap mein har source ka PEHLA element daalo  (value + kaunse source/position se)
repeat (K baar ya jab tak zaroorat):
    cur = heap.poll()                       # sabse chhota
    (jawab mein use karo)
    cur ke source ka AGLA element heap mein daalo (agar hai)
```

```java
// Kth Smallest in Sorted Matrix (har row aur column sorted) — har row ek "sorted list"
public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));   // {value, row, col}
    for (int r = 0; r < Math.min(n, k); r++) heap.offer(new int[]{matrix[r][0], r, 0});     // har row ka pehla
    int value = 0;
    for (int i = 0; i < k; i++) {
        int[] cur = heap.poll();                                  // i-th sabse chhota
        value = cur[0];
        if (cur[2] + 1 < n) heap.offer(new int[]{matrix[cur[1]][cur[2] + 1], cur[1], cur[2] + 1});   // us row ka agla
    }
    return value;
}

// K Pairs with Smallest Sums — (nums1[i], nums2[j]); har i ke liye j badhta hai = ek "sorted list"
public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    List<List<Integer>> res = new ArrayList<>();
    if (nums1.length == 0 || nums2.length == 0) return res;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) ->
        Long.compare((long) nums1[a[0]] + nums2[a[1]], (long) nums1[b[0]] + nums2[b[1]]));   // {i, j} — long: sum overflow se bachao
    for (int i = 0; i < Math.min(nums1.length, k); i++) heap.offer(new int[]{i, 0});
    while (k-- > 0 && !heap.isEmpty()) {
        int[] cur = heap.poll();
        res.add(Arrays.asList(nums1[cur[0]], nums2[cur[1]]));
        if (cur[1] + 1 < nums2.length) heap.offer(new int[]{cur[0], cur[1] + 1});           // usi i ka agla j
    }
    return res;
}

// Merge K Sorted Lists
public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
    for (ListNode head : lists) if (head != null) heap.offer(head);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode smallest = heap.poll();
        tail.next = smallest;
        tail = tail.next;
        if (smallest.next != null) heap.offer(smallest.next);    // 🔑 us list ka agla node
    }
    return dummy.next;
}
```

---

## 8. ⑤ Streaming (data ek-ek karke aa raha hai)

Heap ka sabse natural use — **poora data pehle se nahi**, isliye sort mumkin hi nahi.

```java
// Kth Largest Element in a Stream
class KthLargest {
    private final PriorityQueue<Integer> heap = new PriorityQueue<>();   // MIN-heap, size k
    private final int k;

    KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) add(x);
    }

    int add(int val) {
        heap.offer(val);
        if (heap.size() > k) heap.poll();
        return heap.peek();                                              // k bado mein sabse chhota = k-th largest
    }
}
```

**Running Median** (do heaps: chhoti aadhi MAX-heap + badi aadhi MIN-heap) ka poora tarika: [Heap note](../00-syllabus/03-trees-and-heaps/15-heap-priority-queue.md).

---

## 9. Sab ek nazar mein

| Variation | Heap | Comparator | Size | Jawab |
|---|---|---|---|---|
| ① K-th largest | **MIN** | value | `k` | `peek()` |
| ① K-th smallest | **MAX** | value | `k` | `peek()` |
| ② Top K frequent | **MIN** | frequency | `k` | poora heap |
| ② Frequent words | **MIN** | freq, phir alphabet ulta | `k` | poora heap (ulta) |
| ③ K closest points | **MAX** | distance | `k` | poora heap |
| ④ K-way merge | **MIN** | value (+ position) | `#sources` | `k` baar `poll()` |
| ⑤ Stream K-th | **MIN** | value | `k` | `peek()` |

## Common galtiyan

- **Heap ka type ulta** — K bade ke liye MAX-heap bhar dena (galat elements bachte hain). **K bade → MIN-heap.**
- **Comparator mein `a - b`** — overflow. **`Integer.compare` / `Long.compare`.**
- **Heap ko iterate karke sorted maanna** — `PriorityQueue` iterate karne pe sorted nahi milta. `poll()` karte raho.
- **Distance mein `sqrt` lagana** — bekaar (aur precision ka jhanjhat). `x² + y²`.
- **K-way merge mein sirf value daalna** — agla element kahan se aana hai wo position (row/col/node) bhi saath rakho.
- **Sum ka overflow** (pairs, large values) — `long`.
- **Top K Frequent Words mein tie-break ulta** — "kamzor" ka matlab heap ke top pe **jise nikalna hai**.

> 💡 **Interview mein bolne wali line**: *"Poora sort O(n log n) hoga. Mujhe sirf top K chahiye, isliye size-K heap — K bade chahiye toh MIN-heap, taaki sabse kamzor chuna hua top pe rahe aur naya aane pe use nikaal sakun. Time O(n log K), space O(K). Agar ek hi baar K-th chahiye toh quickselect O(n) average."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Kth Largest Element in a Stream | ⑤ Stream | Easy | [leetcode.com/problems/kth-largest-element-in-a-stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) |
| 2 | Kth Largest Element in an Array | ① Kth | Medium | [leetcode.com/problems/kth-largest-element-in-an-array](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| 3 | Top K Frequent Elements | ② Frequent | Medium | [leetcode.com/problems/top-k-frequent-elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| 4 | Sort Characters By Frequency | ② Frequent | Medium | [leetcode.com/problems/sort-characters-by-frequency](https://leetcode.com/problems/sort-characters-by-frequency/) |
| 5 | Top K Frequent Words | ② Tie-break | Medium | [leetcode.com/problems/top-k-frequent-words](https://leetcode.com/problems/top-k-frequent-words/) |
| 6 | K Closest Points to Origin | ③ Closest | Medium | [leetcode.com/problems/k-closest-points-to-origin](https://leetcode.com/problems/k-closest-points-to-origin/) |
| 7 | Find K Closest Elements | ③ Binary search window | Medium | [leetcode.com/problems/find-k-closest-elements](https://leetcode.com/problems/find-k-closest-elements/) |
| 8 | Kth Smallest Element in a Sorted Matrix | ④ K-way merge | Medium | [leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) |
| 9 | Find K Pairs with Smallest Sums | ④ K-way merge | Medium | [leetcode.com/problems/find-k-pairs-with-smallest-sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) |
| 10 | Reorganize String | Heap by count | Medium | [leetcode.com/problems/reorganize-string](https://leetcode.com/problems/reorganize-string/) |
| 11 | Task Scheduler | Heap + greedy | Medium | [leetcode.com/problems/task-scheduler](https://leetcode.com/problems/task-scheduler/) |
| 12 | Merge k Sorted Lists | ④ K-way merge | Hard | [leetcode.com/problems/merge-k-sorted-lists](https://leetcode.com/problems/merge-k-sorted-lists/) |
| 13 | Find Median from Data Stream | ⑤ Do heaps | Hard | [leetcode.com/problems/find-median-from-data-stream](https://leetcode.com/problems/find-median-from-data-stream/) |
| 14 | Smallest Range Covering Elements from K Lists | ④ K-way + running max | Hard | [leetcode.com/problems/smallest-range-covering-elements-from-k-lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) |

**Kaise practice karein**: Har problem pe pehle likho — *"K bade ya chhote? Isliye MIN ya MAX heap? Comparator kis cheez ka? Heap mein kya-kya (value + position)?"* — phir code.

Agla: [07-prefix-sum.md](07-prefix-sum.md)
