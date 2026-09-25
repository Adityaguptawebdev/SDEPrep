# DSA 4/8 — Linked List · Stack · Heap · Sorting

**Easy analogy — linked list = train ke dibbe**: Har dibba sirf **agle dibbe** ko pakad ke rakhta hai. Beech mein dibba jodna/hatana aasaan (bas coupling badlo), par 7th dibba dhoondhne ke liye engine se chalna padta hai. Heap = **mandir ki VIP line** — sabse "important" hamesha aage, baaki ka order matter nahi karta.

| # | Problem | Reporter level | Freq | Status |
|---|---|---|---|---|
| 1 | Linked list set: merge sorted lists · cycle · intersection · reverse middle part · sort/dedupe | mostly Senior/Staff (+1 EC "cyclic" problem) | **HIGH** as a family (6 reports) | Exact / Close |
| 2 | Custom stack with encapsulation (+ min-stack follow-up) | **EC (6–18 months band)** | LOW | Reported |
| 3 | K-th largest / second largest without sorting | EC + NCG + Staff | **HIGH** (5) | Exact / Close |
| 4 | Merge sort from scratch with a dry run | **EC** + Intern | MEDIUM (2) | Exact |
| 5 | Merge Intervals | Intern (2022) + Senior DE | MEDIUM (2, family) | Exact |
| 6 | Data processing with Maps + PriorityQueue (top-k) | **EC** | LOW | Reconstructed |
| 7 | O(1) insert / delete / getRandom | Staff (data eng) | LOW | Exact |

---

## 1. Linked list set

| Field | Details |
|---|---|
| **Reported problems** | (a) "merge linked list with space, then without extra space" ([LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/), Senior 3 YOE, 2023) and "Merge Sorted Linked List" in a HackerRank screen ([LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), Senior, 2022) · (b) "Cycle Detection in Linked List: solved in < 5 minutes with edge cases" ([LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/), Staff, 2025); "a standard data structures challenge (focused on cyclic behaviour)" ([LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/), **EC**, 2025) · (c) "LinkedList intersection" ([LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/), Staff, 2026) · (d) "Reverse a linked list except head and tail" ([LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/), Staff, 2026) · (e) "linked list 5,5,4,1 — remove duplicates or sort the list" ([LC-6742810](https://leetcode.com/discuss/post/6742810/visa-interview-experience-by-ayu0620-mr1s/), level ?, 2025) |
| **Round** | Technical DSA rounds |
| **Difficulty** | Easy–Medium |
| **Pattern** | Pointer manipulation: dummy head, fast/slow pointers, reversal |
| **Frequency** | **HIGH** as a family (6 reports), but mostly Senior/Staff — for 0–1 YOE expect the easy ones |

**Brute force**: copy values into an array/list, do the work there, rebuild the list (O(n) extra space) — mention it, then do it in place.

```
 merge (dummy head):   dummy → 1 → 2 → 3 → 4 → 5 → 6
                        l1: 1 3 5      l2: 2 4 6      always attach the smaller head
 cycle (Floyd):        slow +1, fast +2; if they meet → cycle
                        then move one pointer to head; step both by 1 → they meet at the cycle start
 intersection:         walk A then B, walk B then A → both travel lenA + lenB → meet at the join (or null)
 reverse except ends:  1 → [2 → 3 → 4] → 5   becomes   1 → 4 → 3 → 2 → 5
```

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class LinkedListSet {
    static ListNode mergeSorted(ListNode a, ListNode b) {        // O(1) extra: relinks nodes
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;                          // attach the leftover
        return dummy.next;
    }

    static ListNode cycleStart(ListNode head) {                   // null if no cycle
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {                                   // met inside the cycle
                slow = head;
                while (slow != fast) { slow = slow.next; fast = fast.next; }
                return slow;
            }
        }
        return null;
    }

    static ListNode intersection(ListNode a, ListNode b) {
        ListNode p = a, q = b;
        while (p != q) {                                          // both walk lenA + lenB steps
            p = (p == null) ? b : p.next;
            q = (q == null) ? a : q.next;
        }
        return p;                                                 // meeting node or null
    }

    static ListNode reverseExceptEnds(ListNode head) {
        if (head == null || head.next == null || head.next.next == null) return head;
        ListNode prev = null, cur = head.next;
        ListNode tail = head;                                     // find the last node
        while (tail.next != null) tail = tail.next;
        while (cur != tail) {                                     // reverse the middle part
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        ListNode firstMiddle = head.next;                         // becomes the last middle node
        head.next = prev;
        firstMiddle.next = tail;
        return head;
    }

    static ListNode sortAndDedupe(ListNode head) {                // e.g. 5,5,4,1 → 1,4,5
        ListNode sorted = mergeSort(head);
        for (ListNode cur = sorted; cur != null && cur.next != null; ) {
            if (cur.next.val == cur.val) cur.next = cur.next.next;   // drop the duplicate
            else cur = cur.next;
        }
        return sorted;
    }

    static ListNode mergeSort(ListNode head) {                    // O(n log n), O(log n) stack
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode right = slow.next;
        slow.next = null;                                         // split in the middle
        return mergeSorted(mergeSort(head), mergeSort(right));
    }
}
```

**Time**: merge O(n + m) · cycle O(n) · intersection O(n + m) · reverse O(n) · sort O(n log n). **Space**: O(1) extra (sort: O(log n) recursion).
**Follow-ups**: why does Floyd find the cycle start? (distance head→start = distance meet→start around the loop) · merge **k** lists (min-heap, O(N log k)) · detect cycle with a `HashSet` (O(n) space — the "with space" version) · reverse in groups of k.
**🗣️ Interview mein aise bolo**: "Linked list mein pehle dummy node le leta hoon taaki head ke special case na likhne padein. Cycle ke liye slow/fast — milte hain toh cycle hai; ek pointer head pe laake dono ko 1-1 chalao, jahan milein wahi start."

---

## 2. Custom stack with encapsulation

| Field | Details |
|---|---|
| **Reported problem** | "Coding a custom stack using encapsulation — ensuring class design adhered strictly to access modifiers and abstraction principles." — **Reported** |
| **Source** | [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) · May 2025 · **SDE-1, 6 months–1.5 years band**, off-campus, in-person (selected) |
| **Round** | Round 2 (deep-dive technical + CS fundamentals), after merge sort and OOP questions |
| **Difficulty** | Easy (the test is **class design**, not the algorithm) |
| **Pattern** | Array-backed stack, private state, clear public API, exceptions |
| **Frequency** | LOW |

What the interviewer is checking: `private` fields, no setters exposing internals, generic type, resizing, a clear exception on `pop()` of an empty stack, and an `interface` so callers depend on behaviour, not implementation.

```java
import java.util.Arrays;
import java.util.NoSuchElementException;

interface Stack<T> {
    void push(T item);
    T pop();
    T peek();
    boolean isEmpty();
    int size();
}

class ArrayStack<T> implements Stack<T> {
    private Object[] items = new Object[4];          // hidden: callers can't touch the array
    private int size;

    @Override
    public void push(T item) {
        if (size == items.length) items = Arrays.copyOf(items, size * 2);   // grow (amortised O(1))
        items[size++] = item;
    }

    @Override
    @SuppressWarnings("unchecked")
    public T pop() {
        if (size == 0) throw new NoSuchElementException("stack is empty");
        T top = (T) items[--size];
        items[size] = null;                          // let GC reclaim it (avoid loitering)
        return top;
    }

    @Override
    @SuppressWarnings("unchecked")
    public T peek() {
        if (size == 0) throw new NoSuchElementException("stack is empty");
        return (T) items[size - 1];
    }

    @Override public boolean isEmpty() { return size == 0; }
    @Override public int size() { return size; }
}

class MinStack {                                     // follow-up: getMin() in O(1)
    private final ArrayStack<int[]> data = new ArrayStack<>();   // {value, minSoFar}

    void push(int x) {
        int min = data.isEmpty() ? x : Math.min(x, data.peek()[1]);
        data.push(new int[]{x, min});
    }
    int pop() { return data.pop()[0]; }
    int getMin() { return data.peek()[1]; }
}
```

**Time**: push/pop/peek O(1) amortised. **Space**: O(n).
**Follow-ups**: thread-safe version (`synchronized` methods or `ReentrantLock`; or use `ConcurrentLinkedDeque`) · linked-list-based stack (no resizing) · why set `items[size] = null` after pop? (memory leak / "loitering") · why an interface?
**🗣️ Interview mein aise bolo**: "Encapsulation matlab andar ka array bahar wale ko dikhe hi na — sirf push/pop/peek. Empty pe pop karein toh clear exception. Interface isliye taaki kal linked-list wala stack laga doon toh caller ka code na badle."

---

## 3. K-th largest / second largest without sorting

| Field | Details |
|---|---|
| **Reported problems** | "Find second largest element in an array without using any inbuilt functions" ([LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/), NCG, 2025) · "Find the first and second largest elements in an array without sorting" ([JT-2024-10](https://www.jointaro.com/interviews/companies/visa/experiences/software-developer-bengaluru-october-1-2024-no-offer-positive-6df1bf4d/), Bengaluru, 2024) · "Nth largest array element" ([GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/), NCG) · "Find the min/max kth element in the array — have to use Heap" ([GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/), **EC, 2 YOE**, in-person) · "Implement kth smallest element" ([LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/), Staff, 2026) |
| **Round** | Technical round 1/2 |
| **Difficulty** | Easy (second largest) → Medium (k-th, [LC 215](https://leetcode.com/problems/kth-largest-element-in-an-array/)) |
| **Pattern** | One pass with two variables → size-k min-heap → quickselect |
| **Frequency** | **HIGH** (5 reports) |

**Brute force**: sort and index → O(n log n) (usually "not allowed" in the question).
**Optimal**: second largest — one pass with `first`, `second` (handle duplicates!). k-th largest — keep a **min-heap of size k**: its top is the k-th largest (O(n log k)); or **quickselect** (O(n) average).

```
 k = 3, nums = [3,2,1,5,6,4]      min-heap of size 3
 3 → [3]  2 → [2,3]  1 → [1,2,3]  5 → pop 1 → [2,3,5]  6 → pop 2 → [3,5,6]  4 → pop 3 → [4,5,6]
 top = 4 = 3rd largest
```

```java
import java.util.PriorityQueue;
import java.util.Random;

class KthLargest {
    // second largest DISTINCT value; Integer.MIN_VALUE sentinel handled via a flag
    static Integer secondLargest(int[] a) {
        Integer first = null, second = null;
        for (int x : a) {
            if (first == null || x > first) { second = first; first = x; }
            else if (x != first && (second == null || x > second)) second = x;   // skip duplicates of max
        }
        return second;                                        // null if it doesn't exist
    }

    static int kthLargestHeap(int[] a, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int x : a) {
            minHeap.add(x);
            if (minHeap.size() > k) minHeap.poll();           // drop the smallest of the top k+1
        }
        return minHeap.peek();
    }

    static int kthSmallestQuickselect(int[] input, int k) {  // O(n) average
        int[] a = input.clone();
        int lo = 0, hi = a.length - 1, target = k - 1;
        Random rnd = new Random(1);
        while (true) {
            int p = partition(a, lo, hi, lo + rnd.nextInt(hi - lo + 1));
            if (p == target) return a[p];
            if (p < target) lo = p + 1; else hi = p - 1;
        }
    }

    static int partition(int[] a, int lo, int hi, int pivotIndex) {   // Lomuto
        int pivot = a[pivotIndex];
        swap(a, pivotIndex, hi);
        int store = lo;
        for (int i = lo; i < hi; i++) if (a[i] < pivot) swap(a, i, store++);
        swap(a, store, hi);
        return store;                                         // pivot's final sorted position
    }

    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}
```

**Time**: second largest O(n) · heap O(n log k) · quickselect O(n) average, O(n²) worst. **Space**: O(1) · O(k) · O(1) (on the copy).
**Follow-ups**: duplicates — is the 2nd largest of `[5,5,4]` 5 or 4? (ask!) · stream of numbers → keep the size-k heap ([LC 703](https://leetcode.com/problems/kth-largest-element-in-a-stream/)) · k-th smallest → max-heap of size k · why not a max-heap of all n? (O(n) space).
**🗣️ Interview mein aise bolo**: "Poora sort karne ki zaroorat nahi — size k ka min-heap rakho, uska top hi k-th largest hai: O(n log k). Average O(n) chahiye toh quickselect. Duplicates pe pehle clarify karta hoon ki distinct chahiye ya nahi."

---

## 4. Merge sort from scratch (with a dry run)

| Field | Details |
|---|---|
| **Reported problem** | "DSA question whose solution was based on greedy + sorting — but had to implement actual sorting. Merge sort: not only an explanation, but also a step-by-step dry run on paper with edge case walkthroughs, followed by code implementation from scratch." ([LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/), **EC**, May 2025) · "Merge Sort explanation with time complexity" ([GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/), intern, 2025) — **Exact** |
| **Round** | Round 2 (EC) / technical + HR (intern) |
| **Difficulty** | Easy-Medium (the dry run and edge cases matter) |
| **Pattern** | Divide and conquer |
| **Frequency** | MEDIUM (2 reports) |

```
                 [38 27 43 3 9 82 10]
            [38 27 43 3]          [9 82 10]
          [38 27]  [43 3]        [9 82]  [10]
          [38][27] [43][3]       [9][82]  [10]
          [27 38]  [3 43]        [9 82]   [10]       ← merge pairs
            [3 27 38 43]          [9 10 82]
                 [3 9 10 27 38 43 82]
```

```java
class MergeSort {
    static void sort(int[] a) {
        if (a.length < 2) return;
        int[] buffer = new int[a.length];                     // one buffer, reused
        sort(a, buffer, 0, a.length - 1);
    }

    private static void sort(int[] a, int[] buf, int lo, int hi) {
        if (lo >= hi) return;                                 // 0 or 1 element: already sorted
        int mid = lo + (hi - lo) / 2;
        sort(a, buf, lo, mid);
        sort(a, buf, mid + 1, hi);
        if (a[mid] <= a[mid + 1]) return;                     // already in order: skip merge
        merge(a, buf, lo, mid, hi);
    }

    private static void merge(int[] a, int[] buf, int lo, int mid, int hi) {
        System.arraycopy(a, lo, buf, lo, hi - lo + 1);
        int i = lo, j = mid + 1;
        for (int k = lo; k <= hi; k++) {
            if (i > mid) a[k] = buf[j++];                     // left side used up
            else if (j > hi) a[k] = buf[i++];                 // right side used up
            else if (buf[j] < buf[i]) a[k] = buf[j++];
            else a[k] = buf[i++];                             // <= keeps it STABLE
        }
    }
}
```

**Time**: O(n log n) in best/average/worst. **Space**: O(n) buffer + O(log n) recursion.
**Edge cases to say during the dry run**: empty array, one element, all equal, already sorted (the `a[mid] <= a[mid+1]` shortcut), negative numbers, duplicates (stability).
**Follow-ups**: why is it stable and why does that matter (sorting transactions by amount, then keeping time order)? · merge sort vs quick sort (worst case, memory, cache) · sorting a linked list (merge sort needs no random access — see §1) · external merge sort for files bigger than RAM ([DSA 8/8](08-file-and-log-processing.md)) · count inversions using merge.
**🗣️ Interview mein aise bolo**: "Array ko aadha-aadha todta hoon jab tak single element na bache, phir sorted halves ko merge karta hoon. Har level pe O(n) kaam aur log n levels — O(n log n) har case mein. `<=` rakhne se stable rehta hai."

---

## 5. Merge Intervals *(you asked for it)*

| Field | Details |
|---|---|
| **Reported problem** | "The first question was 56. Merge Intervals" — **Exact** ([LC 56](https://leetcode.com/problems/merge-intervals/)) · related: Non-overlapping Intervals ([LC 435](https://leetcode.com/problems/non-overlapping-intervals/)) |
| **Source** | [LC-2626818](https://leetcode.com/discuss/post/2626818/visa-sde-intern-bengaluru-sept-2022-by-a-5x5w/) · Sep 2022 · SDE intern, Bengaluru, on-campus (older) · [LC-6906343](https://leetcode.com/discuss/post/6906343/visa-sr-data-engineer-javabig-data-inter-ni6l/) · Jul 2025 · Sr Data Engineer (LC 435) |
| **Round** | Technical interview (HackerRank CodePair) | **Difficulty**: Medium | **Pattern**: sort by start + sweep | **Frequency**: MEDIUM (family) |

**Brute force**: repeatedly merge any overlapping pair until nothing changes → O(n²) or worse.
**Optimal**: sort by start; walk once, extend the last merged interval or start a new one.

```
 [[1,3],[8,10],[2,6],[15,18]] → sort → [1,3] [2,6] [8,10] [15,18]
 [1,3] + [2,6] overlap (2 ≤ 3) → [1,6];  [8,10] new;  [15,18] new
```

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class IntervalMerge {
    static int[][] merge(int[][] input) {
        int[][] iv = input.clone();
        Arrays.sort(iv, (x, y) -> Integer.compare(x[0], y[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] cur : iv) {
            if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) out.add(new int[]{cur[0], cur[1]});
            else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);   // overlap
        }
        return out.toArray(new int[0][]);
    }

    static int minRemovalsToMakeNonOverlapping(int[][] input) {   // LC 435: greedy by end time
        int[][] iv = input.clone();
        Arrays.sort(iv, (x, y) -> Integer.compare(x[1], y[1]));
        int kept = 0;
        long lastEnd = Long.MIN_VALUE;
        for (int[] cur : iv) if (cur[0] >= lastEnd) { kept++; lastEnd = cur[1]; }
        return iv.length - kept;
    }
}
```

**Time**: O(n log n). **Space**: O(n) output.
**Follow-ups**: insert an interval into a sorted list ([LC 57](https://leetcode.com/problems/insert-interval/)) · meeting rooms needed ([LC 253](https://leetcode.com/problems/meeting-rooms-ii/) 🔒 premium; heap of end times) · is `[1,2]` and `[2,3]` overlapping? (ask — here yes).
**🗣️ Interview mein aise bolo**: "Start time se sort karke ek pass — agar naya interval pichhle ke end se pehle shuru hota hai toh merge, warna naya. Sorting ke baad O(n)."

---

## 6. Data processing with Maps + PriorityQueue (top-k)

| Field | Details |
|---|---|
| **Reported problem** | "A complex data-processing challenge involving multiple collections, with expected use of Maps and Priority Queues. Edge cases were emphasized heavily." — **Reconstructed**: we use a realistic payments version: *given transactions `merchant,amount`, return the top-k merchants by total amount (ties by name).* |
| **Source** | [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) · May 2025 · **SDE-1 (6 months–1.5 years band)**, round 3 |
| **Difficulty** | Medium | **Pattern**: aggregate in a HashMap → top-k with a size-k min-heap | **Frequency**: LOW |

**Brute force**: aggregate, then sort all merchants → O(m log m). **Optimal**: size-k heap → O(m log k) (matters when m is huge and k is small).

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

class TopMerchants {
    static List<String> topK(List<String> transactions, int k) {
        Map<String, Long> total = new HashMap<>();
        for (String t : transactions) {
            String[] p = t.split(",");
            if (p.length != 2) continue;                              // edge case: bad row
            try {
                total.merge(p[0].trim(), Long.parseLong(p[1].trim()), Long::sum);
            } catch (NumberFormatException e) { /* skip bad amount */ }
        }
        Comparator<Map.Entry<String, Long>> better = Comparator
                .comparing((Map.Entry<String, Long> e) -> e.getValue())
                .thenComparing(Map.Entry::getKey, Comparator.reverseOrder());   // tie → smaller name wins
        PriorityQueue<Map.Entry<String, Long>> heap = new PriorityQueue<>(better);  // worst on top
        for (Map.Entry<String, Long> e : total.entrySet()) {
            heap.add(e);
            if (heap.size() > k) heap.poll();                          // drop the worst
        }
        List<String> result = new ArrayList<>();
        while (!heap.isEmpty()) result.add(heap.poll().getKey());
        Collections.reverse(result);                                   // best first
        return result;
    }

    public static void main(String[] args) {
        List<String> tx = List.of("amazon,500", "flipkart,300", "amazon,100", "swiggy,600", "bad-row", "zomato,abc", "flipkart,300");
        System.out.println(topK(tx, 2));
    }
}
```

```text
[amazon, flipkart]
```

(amazon 600, flipkart 600, swiggy 600 → three-way tie; alphabetical tie-break keeps amazon and flipkart.)
**Time**: O(n + m log k). **Space**: O(m).
**Follow-ups**: data doesn't fit in memory → partition by merchant hash, aggregate per partition, merge the per-partition top-k · real-time top-k over a sliding hour · negative amounts (refunds).
**🗣️ Interview mein aise bolo**: "Pehle HashMap se aggregate, phir size-k min-heap — heap ke top pe 'sabse kamzor' winner hota hai, naya better aaye toh use hata do. Ties ka rule pehle hi clarify karta hoon."

---

## 7. O(1) insert / delete / getRandom *(Staff data engineer)*

| Field | Details |
|---|---|
| **Reported problem** | "Design an All-one data structure with GET O(1), PUT O(1), DELETE O(1), GETRANDOM O(1)" — **Close** ([LC 380](https://leetcode.com/problems/insert-delete-getrandom-o1/)) |
| **Source** | [LC-6653237](https://leetcode.com/discuss/post/6653237/visa-inc-staff-data-engineer-by-rahulx33-p1si/) · Apr 2025 · **Staff Data Engineer** | **Round**: 2 (DSA) | **Pattern**: ArrayList + HashMap(value → index), swap-with-last on delete |

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

class RandomizedSet {
    private final List<Integer> values = new ArrayList<>();
    private final Map<Integer, Integer> indexOf = new HashMap<>();
    private final Random random = new Random();

    boolean insert(int v) {
        if (indexOf.containsKey(v)) return false;
        indexOf.put(v, values.size());
        values.add(v);
        return true;
    }

    boolean remove(int v) {
        Integer i = indexOf.remove(v);
        if (i == null) return false;
        int last = values.remove(values.size() - 1);          // O(1): remove from the end
        if (i < values.size()) {                               // v was not the last → move last into its slot
            values.set(i, last);
            indexOf.put(last, i);
        }
        return true;
    }

    boolean contains(int v) { return indexOf.containsKey(v); }

    int getRandom() { return values.get(random.nextInt(values.size())); }
}
```

**Time**: all O(1) average. **Space**: O(n).

---

⚡ **Quick revision**: dummy head for list merges · Floyd for cycles (and the start) · A→B / B→A walk for intersections · encapsulation = private state + interface + clear exceptions · top-k = size-k min-heap · merge sort = stable O(n log n), dry-run it on paper · intervals = sort by start (merge) or by end (keep max non-overlapping).

Next: [DSA 5/8 — Trees →](05-trees.md)
