# 3. Fast & Slow Pointers (Floyd's Cycle Detection)

> **Standard definition**: A technique using two pointers moving through a sequence at different speeds (typically one step vs. two steps) to detect cycles or find specific positions (like the middle) without extra space.

**Ek line mein**: Ek pointer **1 step** chale, doosra **2 steps** — agar
linked list mein **cycle (loop)** hai, dono pointers **kabhi na kabhi
milenge**; agar cycle nahi hai, fast pointer **null** tak pahunch jayega.

**Trick yaad rakhne ki**: *"Stadium ke gol track pe do runners — ek fast,
ek slow. Agar track gol (cycle) hai, fast wala slow wale ko ek na ek din
peeche se aake pakad lega (lap complete karke). Agar track seedha (straight
line, no cycle) hai, fast wala seedha finish line (null) tak pahunch jayega,
kabhi milenge nahi."*

**Kab use karo**: Linked list mein **cycle detect** karna, list ka
**midpoint** dhoondhna (fast pointer end tak pahunchte-pahunchte slow
pointer beech mein hoga), ya **duplicate number** dhoondhna (jaha number
khud hi "next pointer" ki tarah use ho sakta hai).

## Code example — Linked List Cycle

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;         // 1 step
        fast = fast.next.next;    // 2 steps

        if (slow == fast) {       // 🔑 dono mil gaye — matlab cycle hai
            return true;
        }
    }
    return false;   // fast, null tak pahunch gaya — cycle nahi hai
}
```

**Line by line samjho**: Har iteration mein `slow` 1 aage, `fast` 2 aage
badhta hai — **gap 1 se badhta rehta hai**. Agar cycle hai, ye gap ek
finite loop ke andar hai, isliye kabhi na kabhi `slow == fast` ban jayega
(fast, slow ko "lap" kar leta hai). Agar cycle nahi hai, `fast` seedha
`null` tak pahunch jayega aur loop khatam ho jayega.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Linked List Cycle | Easy | [leetcode.com/problems/linked-list-cycle](https://leetcode.com/problems/linked-list-cycle/) |
| 2 | Linked List Cycle II | Medium | [leetcode.com/problems/linked-list-cycle-ii](https://leetcode.com/problems/linked-list-cycle-ii/) |
| 3 | Palindrome Linked List | Easy | [leetcode.com/problems/palindrome-linked-list](https://leetcode.com/problems/palindrome-linked-list/) |
| 4 | Happy Number | Easy | [leetcode.com/problems/happy-number](https://leetcode.com/problems/happy-number/) |
| 5 | Middle of the Linked List | Easy | [leetcode.com/problems/middle-of-the-linked-list](https://leetcode.com/problems/middle-of-the-linked-list/) |

Agla: [04-merge-intervals.md](04-merge-intervals.md)
