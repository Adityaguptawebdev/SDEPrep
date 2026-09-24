# 12. Queue & Deque

> 📍 **Syllabus**: Unit 2 — Linear Structures · Topic 12 / 29 · Pehle chahiye: [Stack](11-stack.md), [Linked List](10-linked-list.md)

> **Standard definition**: A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle — elements are inserted at the rear (enqueue) and removed from the front (dequeue). A deque (double-ended queue) allows insertion and removal at both ends.

**Ek line mein**: **Jo pehle aaya, wahi pehle jayega** — line mein aage wale ki baari pehle. Ek sira (rear) se andar, doosre sira (front) se bahar.

**Trick yaad rakhne ki**: *"Railway ticket counter ki line"* — jo pehle line mein laga, use pehle ticket milta hai; naya banda **peeche** khada hota hai. **Deque** = *"bus ke aage-peeche dono darwaze"* — dono taraf se chadh/utar sakte ho.

**Kab use karo**: Jab **order-of-arrival** ka fair processing chahiye — **BFS (level by level)**, task scheduling, printer queue, "sabse purana pehle nikalo". Deque jab **dono sire** pe kaam ho (jaise sliding window ka maximum).

## Queue ka picture

```
enqueue(A)  enqueue(B)  enqueue(C)              dequeue() → A

 front                        rear                front         rear
   ▼                            ▼                   ▼             ▼
 ┌───┬───┬───┐                                    ┌───┬───┐
 │ A │ B │ C │   ← naye log peeche (rear) se      │ B │ C │       ← purane aage (front) se nikalte hain
 └───┴───┴───┘                                    └───┴───┘

Sab operations O(1):  enqueue (peeche jodo) · dequeue (aage se hatao) · peek (aage wala dekho)
```

**Stack vs Queue**: Stack = **ek** sira (LIFO). Queue = **do** sire — ek se andar, ek se bahar (FIFO).

## Queue ke roop

```
1) Simple Queue     :  aage se nikalo, peeche se daalo
2) Circular Queue   :  array ke end ke baad wapas 0 pe ghoom jao (jagah waste nahi hoti)
3) Deque            :  dono sire pe insert/delete
4) Priority Queue   :  FIFO nahi — sabse zyada priority wala pehle  →  [Heap note](../03-trees-and-heaps/15-heap-priority-queue.md)
```

## Java mein Queue / Deque

| Kaam | `Queue` method | Khaali/full pe |
|---|---|---|
| Peeche jodo | `offer(x)` (ya `add(x)`) | `offer` → false; `add` → exception |
| Aage se nikalo | `poll()` (ya `remove()`) | `poll` → null; `remove` → exception |
| Aage wala dekho | `peek()` (ya `element()`) | `peek` → null; `element` → exception |

Deque ke extra methods: `offerFirst / offerLast`, `pollFirst / pollLast`, `peekFirst / peekLast`.

**Implementation**: `Queue<Integer> q = new ArrayDeque<>();` — `LinkedList` bhi chalta hai, par **`ArrayDeque` tez hai** (pointer overhead nahi).

```java
public void queueBasics() {
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(10);                  // peeche jodo:  [10]
    q.offer(20);                  //               [10, 20]
    q.offer(30);                  //               [10, 20, 30]
    int front = q.peek();         // 10 — aage wala dekho
    int served = q.poll();        // 10 — aage se nikaala:  [20, 30]

    Deque<Integer> dq = new ArrayDeque<>();
    dq.offerFirst(1);             // [1]
    dq.offerLast(2);              // [1, 2]
    dq.offerFirst(0);             // [0, 1, 2]
    int first = dq.pollFirst();   // 0
    int last = dq.pollLast();     // 2
}
```

## Code example 1 — Circular Queue (array se)

**Problem**: Simple array queue mein `dequeue` ke baad aage ki jagah khaali ho jaati hai par kabhi reuse nahi hoti. **Trick**: *"Gol chakkar (merry-go-round)"* — array ke end ke baad **wapas 0 pe** jao. Iske liye `%` (modulo) use hota hai.

```
capacity = 4      front = 2      size = 3      →  elements index 2, 3, 0 pe hain

  idx:   0     1     2     3
       ┌─────┬─────┬─────┬─────┐
       │  C  │     │  A  │  B  │     rear = (front + size) % capacity = (2 + 3) % 4 = 1  ← agla khaali slot
       └─────┴─────┴─────┴─────┘
                      ▲ front
```

```java
class CircularQueue {
    private int[] data;
    private int front = 0, size = 0;

    CircularQueue(int capacity) { data = new int[capacity]; }

    boolean enqueue(int x) {
        if (size == data.length) return false;                 // bhar gaya
        data[(front + size) % data.length] = x;                // 🔑 % se end ke baad wapas 0 pe
        size++;
        return true;
    }

    boolean dequeue() {
        if (size == 0) return false;                           // khaali hai
        front = (front + 1) % data.length;                     // front aage badha (gol ghoomke)
        size--;
        return true;
    }

    int front() { return size == 0 ? -1 : data[front]; }
    int rear()  { return size == 0 ? -1 : data[(front + size - 1) % data.length]; }
    boolean isEmpty() { return size == 0; }
    boolean isFull() { return size == data.length; }
}
```

**Line by line samjho**: Hum `rear` alag se nahi rakhte — `front` aur `size` se nikaal lete hain (`(front + size) % capacity`). Isse "queue bhari hai ya khaali" ka confusion (front == rear wala) nahi hota, kyunki `size` seedha bata deta hai.

## Code example 2 — Do Stack se Queue banana

**Trick**: *"Do plates ke dher — ulta-ulta = seedha."* Stack ulta karta hai (LIFO). Ek stack ke elements doosre mein **ulte** daalo toh order **seedha (FIFO)** ho jata hai!

```
push A, B, C  →  inStack (upar→neeche): C B A

pop chahiye (sabse pehle A nikalna chahiye):
   inStack ke saare elements outStack mein daalo →  outStack (upar→neeche): A B C
   outStack.pop() = A ✅

Rule: outStack khaali hone par hi inStack se transfer karo.
```

```java
class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();     // naye elements yahan aate hain
    private Deque<Integer> out = new ArrayDeque<>();    // nikalne wale yahan se

    public void push(int x) { in.push(x); }

    public int pop() {
        move();
        return out.pop();
    }

    public int peek() {
        move();
        return out.peek();
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }

    private void move() {
        if (out.isEmpty()) {                            // 🔑 sirf tab transfer jab out khaali ho
            while (!in.isEmpty()) out.push(in.pop());   // ulta karke daalo → order seedha ho jata hai
        }
    }
}
```

**Complexity**: Har element **ek baar `in` mein, ek baar `out` mein** jata hai. Isliye har operation **amortized O(1)** hai (kabhi-kabhi transfer mehnga, par average sasta).

## Code example 3 — Number of Recent Calls (queue = sliding window)

**Problem**: `ping(t)` — pichhle **3000 ms** mein kitni requests aayi (`t` hamesha badhta hai)? **Trick**: *"Purani requests line ke aage khadi hain — jo 3000ms se purani ho gayi unhe aage se hata do."*

```java
class RecentCounter {
    private Queue<Integer> queue = new ArrayDeque<>();

    public int ping(int t) {
        queue.offer(t);                              // nayi request peeche
        while (queue.peek() < t - 3000) {            // 🔑 aage wali request purani ho gayi → nikaalo
            queue.poll();
        }
        return queue.size();                         // bachi hui = pichhle 3000 ms ki requests
    }
}
```

## Code example 4 — Level Order Traversal (BFS ki jhalak)

Queue ka sabse bada use: **BFS — level by level**. **Trick**: *"Ek level ke saare nodes queue se nikaalo aur unke bachche queue mein daalte jao."* Poori kahani [BFS pattern](../../01-patterns/11-bfs.md) aur [Binary Tree](../03-trees-and-heaps/13-binary-tree.md) mein.

```
        3                 queue: [3]
       / \                level 1 → nikaalo 3, bachche 9, 20 daalo   →  [9, 20]
      9   20              level 2 → nikaalo 9, 20; 20 ke bachche 15, 7 →  [15, 7]
          / \             level 3 → 15, 7
         15  7            result = [[3], [9, 20], [15, 7]]
```

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelSize = queue.size();                 // 🔑 abhi is level mein kitne nodes hain (freeze kar lo)
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {         // sirf isi level ke nodes process karo
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);      // agle level ke nodes peeche jodo
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
```

## Code example 5 — Sliding Window Maximum (Monotonic Deque) ⭐

**Problem**: Array mein har `k` size ki window ka **maximum** batao. Har window pe max dhundhna O(n·k) hoga.

**Trick**: *"Line mein sabse taakatwar khiladi aage rakho, kamzor khiladi peeche se hata do."* Deque mein **indexes** rakho jinke **values ghatte order** mein hon. Naya bada element aaya → peeche ke chhote elements **kabhi max nahi banenge**, unhe hata do. **Front hamesha current window ka max** hoga.

```
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k = 3          (deque mein values dikhaye hain, actually index rakhte hain)

i=0 (1) : deque [1]
i=1 (3) : 3 > 1 → 1 hatao        → [3]
i=2 (-1): -1 < 3 → peeche jodo   → [3, -1]           window poori (3 elements) → max = front = 3
i=3 (-3): -3 < -1 → jodo         → [3, -1, -3]       max = 3
i=4 (5) : 5 sabse bada → sab hatao → [5]              3 window se bahar bhi gaya; max = 5
i=5 (3) : 3 < 5 → jodo           → [5, 3]            max = 5
i=6 (6) : 6 > 3, 6 > 5 → sab hatao → [6]              max = 6
i=7 (7) : 7 > 6 → hatao          → [7]               max = 7

result = [3, 3, 5, 5, 6, 7]  ✅
```

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();           // indexes — unke values ghatte order mein (front = sabse bada)

    for (int i = 0; i < n; i++) {
        if (!dq.isEmpty() && dq.peekFirst() <= i - k) {
            dq.pollFirst();                           // front window se bahar nikal gaya → hatao
        }
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) {
            dq.pollLast();                            // 🔑 chhote elements kabhi max nahi banenge → peeche se hatao
        }
        dq.offerLast(i);
        if (i >= k - 1) {
            result[i - k + 1] = nums[dq.peekFirst()]; // window poori bani → front = max
        }
    }
    return result;
}
```

**Line by line samjho**: Har index deque mein **ek baar jata hai, ek baar nikalta hai** → total **O(n)**. Brute force O(n·k) tha.

## Queue / Deque kab lagana hai

| Problem ka hint | Kya use karo |
|---|---|
| **Level by level / shortest path (unweighted)** | Queue (BFS) |
| "Pichhle X time ki cheezein" (window) | Queue (purane aage se hatao) |
| **Fair processing** (pehle aao pehle pao), scheduling | Queue |
| **Window ka max/min** | Monotonic Deque |
| Dono sire se kaam (palindrome check, undo+redo) | Deque |
| Sabse zyada priority pehle | Priority Queue (Heap) |

## Common galtiyan

- **`add/remove` vs `offer/poll`** — khaali queue pe `remove()` exception fenkta hai, `poll()` sirf `null` deta hai. Loop conditions mein `poll()` + `isEmpty()` safer hai.
- **BFS mein level ka size freeze na karna** — `queue.size()` loop ke andar badalta rehta hai; pehle `int levelSize = queue.size()` lo.
- **`LinkedList` ko `Queue` ki tarah use karke null daalna** — `poll()` ka `null` aur "asli null" confuse ho jata hai. `ArrayDeque` null allow nahi karta.
- **Circular queue mein `front == rear` se full/empty decide karna** — dono case mein same dikhta hai. Alag `size` variable rakho.
- **Monotonic deque mein index ki jagah value rakhna** — window se bahar hone ka pata nahi chalega.

> 💡 **Interview mein bolne wali line**: *"Yahan first-come-first-served order chahiye, isliye Queue. BFS mein main level ka size freeze karke process karunga, taaki level boundary pata rahe. Time O(n), space O(w) jahan w max width hai."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Implement Stack using Queues | Easy | Queue ko rotate karo | [leetcode.com/problems/implement-stack-using-queues](https://leetcode.com/problems/implement-stack-using-queues/) |
| 2 | Implement Queue using Stacks | Easy | Do stack (in / out) | [leetcode.com/problems/implement-queue-using-stacks](https://leetcode.com/problems/implement-queue-using-stacks/) |
| 3 | Number of Recent Calls | Easy | Queue as window | [leetcode.com/problems/number-of-recent-calls](https://leetcode.com/problems/number-of-recent-calls/) |
| 4 | Time Needed to Buy Tickets | Easy | Queue simulation | [leetcode.com/problems/time-needed-to-buy-tickets](https://leetcode.com/problems/time-needed-to-buy-tickets/) |
| 5 | Design Circular Queue | Medium | Array + modulo | [leetcode.com/problems/design-circular-queue](https://leetcode.com/problems/design-circular-queue/) |
| 6 | Design Circular Deque | Medium | Dono sire, modulo | [leetcode.com/problems/design-circular-deque](https://leetcode.com/problems/design-circular-deque/) |
| 7 | Binary Tree Level Order Traversal | Medium | BFS, level size freeze | [leetcode.com/problems/binary-tree-level-order-traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| 8 | Rotting Oranges | Medium | Multi-source BFS | [leetcode.com/problems/rotting-oranges](https://leetcode.com/problems/rotting-oranges/) |
| 9 | Dota2 Senate | Medium | Do queues (indexes) | [leetcode.com/problems/dota2-senate](https://leetcode.com/problems/dota2-senate/) |
| 10 | Jump Game VI | Medium | DP + monotonic deque | [leetcode.com/problems/jump-game-vi](https://leetcode.com/problems/jump-game-vi/) |
| 11 | Sliding Window Maximum | Hard | Monotonic deque | [leetcode.com/problems/sliding-window-maximum](https://leetcode.com/problems/sliding-window-maximum/) |
| 12 | Shortest Subarray with Sum at Least K | Hard | Prefix sum + monotonic deque | [leetcode.com/problems/shortest-subarray-with-sum-at-least-k](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) |

---

## ✅ Unit 2 (Linear Structures) khatam!

Linked List (pointers), Stack (LIFO) aur Queue/Deque (FIFO) — ye teeno **linear** structures the. Ab hum **non-linear** duniya mein jate hain, jahan ek node ke **ek se zyada bachche** ho sakte hain — **Trees**.

Agla: [Unit 3 — Trees & Heaps → Binary Tree](../03-trees-and-heaps/13-binary-tree.md)
