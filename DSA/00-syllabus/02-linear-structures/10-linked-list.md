# 10. Linked List

> 📍 **Syllabus**: Unit 2 — Linear Structures · Topic 10 / 29 · Pehle chahiye: [Arrays](../01-basics/02-arrays.md), [Recursion](../01-basics/09-recursion.md)

> **Standard definition**: A linear data structure in which elements (nodes) are stored at non-contiguous memory locations; each node holds a value and a reference (pointer) to the next node, so the sequence is formed by following the links from the head.

**Ek line mein**: **Nodes ki ek chain** — har node mein apna data aur **agli node ka pata**. Array ki tarah dabbe ek-doosre ke bagal mein nahi hote, bas ek-doosre ko **point** karte hain.

**Trick yaad rakhne ki**: *"Treasure hunt (khazane ki khoj)"* — har parchi pe ek cheez likhi hai aur ek **clue: agli parchi kahan chhupi hai**. Tumhe sirf **pehli parchi (head)** ka pata hai. Aakhri parchi pe likha hai *"aur koi nahi"* (`null`).
- Beech ki 5th parchi **seedha nahi khol sakte** — pehli se shuru karke clue follow karte jao → **access O(n)**.
- Par beech mein **nayi parchi jodni ho** toh sirf **2 clue badalne** hain, kisi ko khiskana nahi → **insert/delete O(1)** (jab jagah pata ho).

**Kab use karo**: Jab **baar-baar beech mein insert/delete** ho aur index se access ki zarurat na ho (jaise LRU cache, undo history, queue/stack banane ke liye). Interviews mein ye **pointer sambhalne ki practice** ke liye bahut poochhi jaati hai.

## Node andar se kaisi hoti hai

```
head
 │
 ▼
┌──────┬──────┐    ┌──────┬──────┐    ┌──────┬──────┐
│  10  │  ●───┼───▶│  20  │  ●───┼───▶│  30  │ null │
└──────┴──────┘    └──────┴──────┘    └──────┴──────┘
  val    next         val    next         val    next
```

Nodes memory mein **kahin bhi** ho sakti hain (scattered) — unhe jodta hai sirf `next` ka pointer. Isliye `arr[i]` jaisa seedha formula nahi chalta.

## 3 types

```
1) Singly     :  1 ──▶ 2 ──▶ 3 ──▶ null            sirf aage jaa sakte ho

2) Doubly     :  null ◀── 1 ◀──▶ 2 ◀──▶ 3 ──▶ null   aage bhi, peeche bhi (prev + next)

3) Circular   :  1 ──▶ 2 ──▶ 3 ──┐
                 ▲               │                  aakhri node wapas head ko point karti hai
                 └───────────────┘
```

## Array vs Linked List

| | Array | Linked List |
|---|---|---|
| i-th element access | **O(1)** | O(n) |
| Head pe insert/delete | O(n) (khiskana) | **O(1)** |
| Beech mein insert/delete (node mil gayi ho) | O(n) | **O(1)** |
| Search | O(n) | O(n) |
| Memory | Ek saath, extra overhead nahi | Har node ke saath ek pointer ka extra kharch |
| Cache speed | Tez (paas-paas) | Slow (idhar-udhar) |
| Size | Fixed (ya resize) | Aasani se badhta-ghatta |

> Java ka `java.util.LinkedList` ek **doubly** linked list hai. Interview mein `ListNode` khud banate hain.

## Golden rule — pointer badalne ka sahi order

**Trick**: *"Pehle SAVE karo, phir TOD DO (link todo), phir JODO"* — koi bhi link todne se pehle agli node ka pata kahin **save** kar lo, warna wo node **hamesha ke liye kho jayegi** (kisi ko uska pata hi nahi bacha).

## Code example 1 — Node, banana, traverse, insert, delete

```java
class ListNode {
    int val;
    ListNode next;                       // agli node ka "pata" (reference)
    ListNode(int val) { this.val = val; }
}
```

```java
// Array se list banao: [1,2,3] → 1 → 2 → 3
public ListNode build(int[] arr) {
    ListNode dummy = new ListNode(0);        // 🔑 dummy (nakli) head — "list khaali hai" ya "head hatani hai" wale special case khatam
    ListNode tail = dummy;
    for (int x : arr) {
        tail.next = new ListNode(x);         // nayi node piche jodo
        tail = tail.next;
    }
    return dummy.next;                       // asli head dummy ke agli node hai
}

// Traverse / print — O(n)
public void print(ListNode head) {
    for (ListNode cur = head; cur != null; cur = cur.next) {
        System.out.print(cur.val + " → ");
    }
    System.out.println("null");
}

// Head pe insert — O(1)
public ListNode insertAtHead(ListNode head, int val) {
    ListNode node = new ListNode(val);
    node.next = head;                        // 1) nayi node ko purani head se jodo
    return node;                             // 2) nayi node hi ab head hai
}

// Tail pe insert — O(n) (aakhri node tak chalna padta hai)
public ListNode insertAtTail(ListNode head, int val) {
    ListNode node = new ListNode(val);
    if (head == null) return node;
    ListNode cur = head;
    while (cur.next != null) cur = cur.next; // aakhri node tak jao
    cur.next = node;
    return head;
}

// Value ke saare occurrences delete — O(n)
public ListNode deleteValue(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    while (prev.next != null) {
        if (prev.next.val == val) {
            prev.next = prev.next.next;      // 🔑 beech wali node ko "bypass" kar do
        } else {
            prev = prev.next;                // hatayi nahi toh hi aage badho
        }
    }
    return dummy.next;
}
```

```
delete 20:      10 ──▶ 20 ──▶ 30            prev = 10
                 │             ▲
                 └─────────────┘            prev.next = prev.next.next   (20 ko bypass kar diya)
```

**Dummy node ka fayda**: Agar **head hi delete** karni ho, toh normal code mein alag `if` chahiye. Dummy ke saath **har node ek jaisi** hai (sabke aage ek `prev` hai) — special case gayab.

## Code example 2 — Reverse (sabse zyada poochha jaane wala)

```
Shuru:      null   1 ──▶ 2 ──▶ 3 ──▶ null
            prev  curr

pass 1:     null ◀── 1    2 ──▶ 3 ──▶ null       (1 ka teer ulta kar diya)
                    prev  curr
pass 2:     null ◀── 1 ◀── 2    3 ──▶ null
                           prev curr
pass 3:     null ◀── 1 ◀── 2 ◀── 3      curr = null → ruko
                                prev    ← prev hi nayi head ✅
```

```java
public ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;   // 🔑 SAVE: agli node ka pata pehle likh lo
        curr.next = prev;            // TOD DO: purana link tod ke teer ulta karo
        prev = curr;                 // JODO: prev ko aage badhao
        curr = next;                 // curr ko aage badhao
    }
    return prev;                     // prev hi nayi head hai
}

// Recursive: "baaki list ko ulta karne ka bharosa rakho, main sirf apna link theek karunga"
public ListNode reverseRecursive(ListNode head) {
    if (head == null || head.next == null) return head;   // base case: 0 ya 1 node
    ListNode newHead = reverseRecursive(head.next);       // baaki list ulti ho gayi
    head.next.next = head;                                // agli node ka teer wapas mujhe point kare
    head.next = null;                                     // main ab aakhri hoon
    return newHead;
}
```

## Code example 3 — Slow & Fast pointers (Middle, Cycle, N-th from end)

**Trick**: *"Race track pe do daudne wale"* — ek dheere (1 kadam), ek tez (2 kadam). Tez wala khatam hote hi dheera **thik beech mein** hota hai. Track **gol** ho toh tez wala **peeche se aakar dheeme ko pakad leta hai** (cycle mil gaya). Poora pattern [Fast & Slow Pointers](../../01-patterns/03-fast-slow-pointers.md) mein hai.

```java
// Middle of the list — even length pe dusra middle deta hai
public ListNode middle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;                // 1 kadam
        fast = fast.next.next;           // 2 kadam
    }
    return slow;
}

// Cycle hai kya? (Floyd's algorithm)
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;   // 🔑 dono mil gaye → gol chakkar hai
    }
    return false;                        // fast null tak pahunch gaya → seedhi list
}

// Aakhri se N-th node hatao — do pointers, beech mein n ka gap
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i < n; i++) fast = fast.next;     // 🔑 fast ko pehle n kadam aage bhejo
    while (fast.next != null) {                        // fast aakhri node pe pahunche tak dono chalao
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;                        // slow ke baad wali node hi "n-th from end" hai → hata do
    return dummy.next;
}
```

```
removeNthFromEnd(1→2→3→4→5, n = 2)       (4 hatana hai)

dummy→1→2→3→4→5→null
 S,F
fast 2 kadam aage:    S=dummy         F=2
dono chalao jab tak F aakhri (5) na ho:   S=3, F=5
S ke baad wali (4) hatao:  3 ──▶ 5   ✅   →  1→2→3→5
```

## Code example 4 — Merge two sorted lists

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            tail.next = l1;              // l1 ki node chhoti hai → result mein jodo
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;  // 🔑 jo list bachi, use seedha jod do (wo pehle se sorted hai)
    return dummy.next;
}
```

Naye nodes banaye bina, **sirf links badal ke** merge hua — extra space **O(1)**.

## Code example 5 — Doubly linked list (LRU Cache ka dil)

**Trick**: Doubly list mein **node mil gayi ho toh O(1) mein hata do** (singly mein `prev` chahiye hota tha). Isliye LRU Cache mein **HashMap (key → node) + Doubly List** ki jodi hoti hai — poora design [LLD LRU Cache](../../../LLD/03-problems/08-lru-cache.md) mein hai.

```
head(dummy) ◀──▶ A ◀──▶ B ◀──▶ C ◀──▶ tail(dummy)

remove(B):   A.next = C     C.prev = A       →   A ◀──▶ C     (B alag ho gayi)
```

```java
class DoublyNode {
    int val;
    DoublyNode prev, next;
    DoublyNode(int val) { this.val = val; }
}

// head aur tail DUMMY (sentinel) nodes hain, isliye kabhi null check nahi lagta
public void remove(DoublyNode node) {
    node.prev.next = node.next;          // peeche wale ka agla = mera agla
    node.next.prev = node.prev;          // aage wale ka peeche = mera peeche
}

public void addAfterHead(DoublyNode head, DoublyNode node) {
    node.next = head.next;               // 🔑 pehle nayi node ke dono link set karo
    node.prev = head;
    head.next.prev = node;               // phir purane logon ke link badlo
    head.next = node;
}
```

## Common galtiyan

- **`curr.next.next` bina check kiye** — `curr.next` null ho toh `NullPointerException`. Pehle `curr.next != null` dekho.
- **Link todne se pehle `next` save nahi kiya** — baaki list kho gayi.
- **Head badal gayi par return nahi ki** (insert/delete/reverse ke baad) — naya head hi return karo.
- **Cycle wali list ko print/traverse karna** — infinite loop. Pehle `hasCycle`.
- **`node1 == node2` vs `node1.val == node2.val`** — pehla same node dekhta hai, doosra sirf value.
- **Off-by-one** (n-th from end mein) — dummy node lagao aur chhote example (1 ya 2 nodes) pe trace karo.

> 💡 **Interview mein bolne wali line**: *"Main dummy node use karunga taaki head delete hone ka special case na banana pade. Pointers badalne se pehle agli node save kar lunga. Time O(n), space O(1)."*

## Practice — basic se advance

Bonus: [LRU Cache](https://leetcode.com/problems/lru-cache/) (HashMap + Doubly List) aur [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) ([Heap note](../03-trees-and-heaps/15-heap-priority-queue.md) ke baad).

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Reverse Linked List | Easy | 3 pointers (prev, curr, next) | [leetcode.com/problems/reverse-linked-list](https://leetcode.com/problems/reverse-linked-list/) |
| 2 | Middle of the Linked List | Easy | Slow & fast | [leetcode.com/problems/middle-of-the-linked-list](https://leetcode.com/problems/middle-of-the-linked-list/) |
| 3 | Merge Two Sorted Lists | Easy | Dummy node + merge | [leetcode.com/problems/merge-two-sorted-lists](https://leetcode.com/problems/merge-two-sorted-lists/) |
| 4 | Remove Linked List Elements | Easy | Dummy node + delete | [leetcode.com/problems/remove-linked-list-elements](https://leetcode.com/problems/remove-linked-list-elements/) |
| 5 | Linked List Cycle | Easy | Floyd's cycle | [leetcode.com/problems/linked-list-cycle](https://leetcode.com/problems/linked-list-cycle/) |
| 6 | Palindrome Linked List | Easy | Middle + reverse half | [leetcode.com/problems/palindrome-linked-list](https://leetcode.com/problems/palindrome-linked-list/) |
| 7 | Remove Nth Node From End of List | Medium | Gap of n between pointers | [leetcode.com/problems/remove-nth-node-from-end-of-list](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) |
| 8 | Add Two Numbers | Medium | Digit-by-digit + carry | [leetcode.com/problems/add-two-numbers](https://leetcode.com/problems/add-two-numbers/) |
| 9 | Linked List Cycle II | Medium | Cycle ka starting node | [leetcode.com/problems/linked-list-cycle-ii](https://leetcode.com/problems/linked-list-cycle-ii/) |
| 10 | Reorder List | Medium | Middle + reverse + merge | [leetcode.com/problems/reorder-list](https://leetcode.com/problems/reorder-list/) |
| 11 | Copy List with Random Pointer | Medium | HashMap old → new node | [leetcode.com/problems/copy-list-with-random-pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) |
| 12 | Reverse Nodes in k-Group | Hard | Reverse har k nodes pe | [leetcode.com/problems/reverse-nodes-in-k-group](https://leetcode.com/problems/reverse-nodes-in-k-group/) |

Agla: [11-stack.md](11-stack.md)
