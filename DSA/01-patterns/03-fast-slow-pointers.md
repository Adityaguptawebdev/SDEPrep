# 3. Fast & Slow Pointers (Floyd's Cycle Detection)

> Pehle ye aane chahiye: [Linked List](../00-syllabus/02-linear-structures/10-linked-list.md), [Two Pointers](02-two-pointers.md)

> **Standard definition**: A technique using two pointers moving through a sequence at different speeds (typically one step vs. two steps) to detect cycles or find specific positions (like the middle) without extra space.

**Ek line mein**: Ek pointer **1 step**, doosra **2 steps** chalta hai — jahan wo **milte hain** ya jahan **fast khatam hota hai**, wahan se cycle, middle ya duplicate ka jawab nikal aata hai — **O(1) extra space** mein.

**Trick yaad rakhne ki**: *"Stadium ke gol track pe do runners — ek fast, ek slow."* Track **gol (cycle)** hai toh fast wala slow ko **peeche se aake pakad lega**. Track **seedha** hai toh fast seedha **finish line (null)** tak pahunch jayega, kabhi milenge nahi. Aur jab fast finish line chhoota hai, slow **thik beech mein** hota hai (fast ki speed double hai).

```
Cycle nahi:    1 → 2 → 3 → 4 → 5 → null          fast null pe pahunch gaya   → cycle NAHI, slow = BEECH mein
Cycle hai :    1 → 2 → 3 → 4 → 5
                        ↑         │                fast ne slow ko lap kar liya → MIL GAYE → cycle HAI
                        └─────────┘
```

---

## 1. Kab use karo — kaise PEHCHANO

| Sawaal ki bhasha | Variation |
|---|---|
| "linked list mein **cycle / loop** hai kya?" | ① **Cycle detect** |
| "cycle **kahan se shuru** hota hai?", "cycle ki **lambai**" | ② **Cycle ka start / length** |
| "**middle** node", "list ko **do aadhe** karo", "**palindrome** linked list", "reorder / sort list" | ③ **Middle** |
| "**aakhri se n-th** node hatao", "beech wala node delete karo" | ④ **Fixed gap** |
| "**Happy Number**", "**duplicate number** (extra space nahi)", "array jisme `nums[i]` agla index batata hai" | ⑤ **Sequence mein cycle** |

```
✅ Structure mein "NEXT" ka concept hai:   node.next   /   f(x) (agla number)   /   nums[i] (agla index)
✅ Do mein se ek chahiye: "loop pakdo"  ya  "beech / kisi khaas position pe pahuncho"  —  length pata nahi
✅ Extra space (HashSet) mana hai, ya O(1) space chahiye
```

### ❌ Kab NAHI
- **Random access** mil raha hai (array) aur bas beech chahiye → `arr[n/2]` seedha. Fast-slow tab hai jab **length pata nahi** (linked list).
- Extra space allowed hai aur **sirf cycle hai ya nahi** chahiye → `HashSet` bhi chalega (par O(n) space).

---

## 2. Variations ek nazar mein

```
                        Kya karna hai?
        ┌────────────┬────────────────┬────────────────┬──────────────────┐
   Cycle hai ya   Cycle ka START   BEECH ka node    Aakhri se n-th     Number/array ke
   nahi?          ya LENGTH?       (list ke aadhe)   ya beech delete    "agle" mein cycle
        │              │                │                 │                  │
   ① MEET?       ② MEET, phir     ③ FAST khatam,    ④ FAST ko n aage    ⑤ next = f(x)
   (fast==slow)   reset & chalo    SLOW = beech      bhejo (GAP)          ya nums[i]
```

| | Speeds | Kab ruko | Jawab kahan milta hai |
|---|---|---|---|
| ① Cycle detect | slow 1, fast 2 | `slow == fast` (cycle) ya fast `null` (nahi) | milna hi jawab hai |
| ② Cycle start | phase 1: 1 & 2; phase 2: **dono 1** | phase 2 mein `p == slow` | milne ka point = **START** |
| ③ Middle | slow 1, fast 2 | fast end pe | **slow** |
| ④ Fixed gap | dono 1, fast pehle se `n` aage | fast aakhri node pe | **slow** (target ke ek pehle) |
| ⑤ Sequence | slow `f(x)`, fast `f(f(x))` | milte hain / target (jaise 1) | milna ya start |

## 3. Code likhne ki recipe — 3 sawaal

```
1. NEXT    →  "agla" kya hai?     node.next   /   f(x)   /   nums[x]
2. SPEED   →  slow kitna, fast kitna?  (1 aur 2)   ya  (gap n)
3. MATLAB  →  fast == slow ka matlab kya?  cycle / start dhoondhne ka pehla phase / aur phir kya
```

**Sabse zaroori (crash se bachne ke liye)**: fast pointer ki **null-safety** hamesha is order mein: **`fast != null && fast.next != null`** — pehle `fast`, phir `fast.next`, tabhi `fast.next.next` chalega.

---

## 4. ① Cycle detect

**Template**:

```
slow = head, fast = head
while (fast != null && fast.next != null):
    slow = slow.next
    fast = fast.next.next
    if (slow == fast):  return true       # milte hi cycle
return false                              # fast null tak pahunch gaya
```

```
head → 3 → 2 → 0 → -4 ─┐             slow / fast ka safar:
            ↑           │             (3, 3) → (2, 0) → (0, 2) → (-4, -4)  ← MIL GAYE ⇒ cycle ✅
            └───────────┘
```

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {           // 🔑 pehle fast, phir fast.next
        slow = slow.next;                                  // 1 step
        fast = fast.next.next;                             // 2 steps
        if (slow == fast) return true;                     // dono ek hi NODE pe (value nahi!)
    }
    return false;
}
```

**Kyun milna pakka hai?** Cycle ke andar fast har step mein slow se **1 kadam** aage badhta hai — gap ek-ek karke ghatega (…3, 2, 1, 0) aur **0 = mil gaye**. Fast slow ko "kood" nahi sakta kyunki gap sirf 1 se badalta hai.

---

## 5. ② Cycle ka START aur LENGTH

**Phase 1**: milne tak chalo. **Phase 2**: ek pointer **head** pe rakho, doosra **meeting point** pe, **dono ek-ek step** chalo — wo **cycle ke START pe milenge**.

**Kyun?** Math (dekho):

```
head ──a──▶ [START] ──b──▶ (MILE) ──c──▶ wapas START          cycle ki lambai = b + c
                 ▲______________________________|

slow ne chala :  a + b
fast ne chala :  2(a + b)  =  a + b + k·(b + c)        (k = fast ne kitne poore chakkar lagaye)

                 ⇒  a  =  (k − 1)·(b + c)  +  c

Matlab:  head se START tak ki doori (a)  =  MEETING se chalke START tak ki doori (c) + kuch poore chakkar
         ⇒ head se ek aur MEETING se ek pointer 1-1 step chalein → START pe hi milenge ✅
```

```java
public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {                                // phase 1 khatam: cycle hai
            ListNode p = head;                              // phase 2: ek pointer head se
            while (p != slow) {                             // 🔑 dono 1-1 step
                p = p.next;
                slow = slow.next;
            }
            return p;                                        // cycle ka START
        }
    }
    return null;                                             // cycle nahi
}

// Cycle ki lambai — milne ke baad ek chakkar ginno
public int cycleLength(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            int len = 1;
            for (ListNode p = slow.next; p != slow; p = p.next) len++;
            return len;
        }
    }
    return 0;                                                // cycle nahi
}
```

---

## 6. ③ Middle (aur uske use)

```java
// Middle — even length pe DUSRA middle  (1→2→3→4  ⇒ 3)
public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}

// Even length pe PEHLA middle chahiye (1→2→3→4 ⇒ 2) — list ko do aadhon mein todne ke liye kaam aata hai
public ListNode firstMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {    // 🔑 condition ek step pehle rukti hai
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
```

```
Loop ki shart ka farak (1 → 2 → 3 → 4):

  fast != null && fast.next != null          →  slow = 3   (DUSRA middle)     Middle of Linked List
  fast.next != null && fast.next.next != null →  slow = 2   (PEHLA middle)     Palindrome / split ke liye
```

### Palindrome Linked List (middle + reverse + compare)

**Plan**: **Pehla middle** dhoondho → **doosri aadhi ko ulta** karo → dono aadhon ko compare karo.

```
1 → 2 → 2 → 1        pehla middle = 2 (index 1)
          │
   1 → 2  │  2 → 1     doosri aadhi ulti: 1 → 2 (head2)
compare:  (1 vs 1) (2 vs 2)  ✅ palindrome
```

```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true;
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {    // pehla middle
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode second = reverse(slow.next);                     // doosri aadhi ulti
    ListNode p1 = head, p2 = second;
    boolean ok = true;
    while (p2 != null) {                                       // doosri aadhi chhoti (ya barabar) hoti hai
        if (p1.val != p2.val) { ok = false; break; }
        p1 = p1.next;
        p2 = p2.next;
    }
    slow.next = reverse(second);                               // list ko pehle jaisa wapas jod do (achhi practice)
    return ok;
}

private ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}
```

Isi "middle + reverse + merge" ka roop **Reorder List** hai, aur "middle pe todo + merge" **Sort List** ka hissa hai.

---

## 7. ④ Fixed Gap (aakhri se n-th, beech wala delete)

**Idea**: fast ko **`n` step aage** bhej do. Phir dono ko **1-1 step** chalao. Jab fast aakhri pe pahunche, slow **aakhri se n-th** ke thik pehle hoga (gap `n` hamesha bana rehta hai).

```java
// Aakhri se n-th node hatao
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;                                  // dummy: head hi hatani ho toh special case nahi
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i < n; i++) fast = fast.next;       // 🔑 fast ko n aage bhejo (gap = n)
    while (fast.next != null) {                          // fast aakhri node tak
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;                          // slow ke baad wala hi n-th from end hai
    return dummy.next;
}

// Beech wala node delete karo (index n/2)
public ListNode deleteMiddle(ListNode head) {
    if (head.next == null) return null;                  // ek hi node
    ListNode slow = head, fast = head.next.next;         // 🔑 fast 2 aage se shuru → slow beech se ek pehle rukega
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    slow.next = slow.next.next;                           // beech wala hata do
    return head;
}
```

---

## 8. ⑤ Sequence mein cycle (linked list nahi, par "next" hai)

### Happy Number — `next(x)` = digits ke squares ka sum

`19 → 82 → 68 → 100 → 1` (1 pe pahunche = **happy**). `2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 …` (gol ghoom raha = **unhappy**, cycle mein phans gaya).

```java
public boolean isHappy(int n) {
    int slow = n, fast = next(n);
    while (fast != 1 && slow != fast) {          // 1 mila = happy; slow == fast (1 ke bina) = cycle = unhappy
        slow = next(slow);                        // 1 step
        fast = next(next(fast));                  // 2 steps
    }
    return fast == 1;
}

private int next(int x) {
    int sum = 0;
    while (x > 0) {
        int d = x % 10;
        sum += d * d;
        x /= 10;
    }
    return sum;
}
```

### Find the Duplicate Number — array ko linked list maano

`n + 1` numbers, sab `1..n` mein, **ek value repeat** hai. **Array modify nahi**, extra space nahi. **Trick**: har index `i` ko node maano, aur `i → nums[i]` **next edge**. Kyunki do indices ki value **same** hai, **ek node ke andar do edges aati hain** → wahi **cycle ka entrance** hai = **duplicate**!

```
nums = [1, 3, 4, 2, 2]        index → nums[index]

0 → 1 → 3 → 2 → 4 → 2 → 4 → ...            cycle: 2 ↔ 4
                ↑____↓                        node 2 mein DO edges aa rahi hain (3→2 aur 4→2)  ⇒  duplicate = 2  ✅
```

Ab ye bilkul **② Cycle ka START** hai:

```java
public int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do {                                          // phase 1: milne tak
        slow = nums[slow];                        // 1 step
        fast = nums[nums[fast]];                  // 2 steps
    } while (slow != fast);
    slow = nums[0];                               // phase 2: ek pointer shuruaat se
    while (slow != fast) {                        // 🔑 dono 1-1 step → cycle ke START pe milenge
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;                                   // START = duplicate
}
```

### Circular Array Loop (Hard) — direction ka dhyaan

`nums[i]` = `i` se kitne step aage (+) ya peeche (−) jaana hai (gol array). Kya koi **cycle (length > 1)** hai jisme **saare steps ek hi direction** mein hon? Har start `i` se fast-slow chalao; **direction badle ya length-1 cycle** ho toh us raaste ko chhod do.

```java
public boolean circularArrayLoop(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        boolean forward = nums[i] > 0;                     // is start ki direction
        int slow = i, fast = i;
        while (true) {
            slow = step(nums, slow, forward);
            if (slow == -1) break;
            fast = step(nums, fast, forward);
            if (fast == -1) break;
            fast = step(nums, fast, forward);              // fast 2 step
            if (fast == -1) break;
            if (slow == fast) return true;                  // milne = valid cycle
        }
    }
    return false;
}

// index i se ek step. Direction badli ya khud pe hi aa gaye (length-1 cycle) toh -1
private int step(int[] nums, int i, boolean forward) {
    if ((nums[i] > 0) != forward) return -1;                // 🔑 direction badal gayi → is raaste se cycle nahi
    int next = ((i + nums[i]) % nums.length + nums.length) % nums.length;   // gol array: negative mod theek karo
    return next == i ? -1 : next;                           // length-1 cycle valid nahi
}
```

---

## 9. Sab ek nazar mein

| Variation | NEXT | Speeds | Ruko jab | Jawab |
|---|---|---|---|---|
| ① Cycle? | `node.next` | 1, 2 | `slow == fast` | `true` |
| ② Cycle start | `node.next` | phase 1: 1, 2; phase 2: 1, 1 | phase 2 mein milen | milne ka node |
| ③ Middle | `node.next` | 1, 2 | fast end pe | `slow` |
| ④ n-th from end | `node.next` | 1, 1 (gap n) | `fast.next == null` | `slow.next` hatao |
| ⑤ Happy Number | `next(x)` | 1, 2 | `== 1` ya `slow == fast` | `fast == 1` |
| ⑤ Find Duplicate | `nums[i]` | 1, 2 → phase 2: 1, 1 | milen | milne ka index |

## Common galtiyan

- **Null check ka order** — `fast.next != null && fast != null` likhna (crash). Sahi: `fast != null && fast.next != null`.
- **Node compare `slow.val == fast.val`** — values same ho sakti hain, alag nodes pe. **`slow == fast`** (node/reference).
- **Phase 2 mein fast ko 2 step chalana** — dono **1-1 step**.
- **Middle mein even-length ka confusion** — kaunsa middle chahiye (dusra / pehla) — condition uske hisaab se.
- **Fixed gap mein head hi delete honi ho** — **dummy node** lagao.
- **Happy number mein sirf `slow == fast` check** — `1` ek self-loop hai (`1 → 1`), wahan bhi slow == fast ho jata hai. Isliye `fast == 1` alag se dekho.
- **Duplicate number mein `0` se shuru** — values `1..n` hain, isliye `nums[0]` se shuru karo (index 0 kabhi cycle mein nahi hota).

> 💡 **Interview mein bolne wali line**: *"HashSet se O(n) space lagta. Fast-slow se O(1) space mein karunga — fast 2 step, slow 1 step. Cycle hai toh fast slow ko lap kar lega. Start chahiye toh meeting ke baad ek pointer head pe rakhkar dono 1-1 step chalaunga — math se wo cycle ke start pe milenge."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Linked List Cycle | ① Detect | Easy | [leetcode.com/problems/linked-list-cycle](https://leetcode.com/problems/linked-list-cycle/) |
| 2 | Linked List Cycle II | ② Start | Medium | [leetcode.com/problems/linked-list-cycle-ii](https://leetcode.com/problems/linked-list-cycle-ii/) |
| 3 | Intersection of Two Linked Lists | Do pointers ka trick | Easy | [leetcode.com/problems/intersection-of-two-linked-lists](https://leetcode.com/problems/intersection-of-two-linked-lists/) |
| 4 | Middle of the Linked List | ③ Middle | Easy | [leetcode.com/problems/middle-of-the-linked-list](https://leetcode.com/problems/middle-of-the-linked-list/) |
| 5 | Palindrome Linked List | ③ Middle + reverse | Easy | [leetcode.com/problems/palindrome-linked-list](https://leetcode.com/problems/palindrome-linked-list/) |
| 6 | Reorder List | ③ Middle + reverse + merge | Medium | [leetcode.com/problems/reorder-list](https://leetcode.com/problems/reorder-list/) |
| 7 | Sort List | ③ Middle + merge sort | Medium | [leetcode.com/problems/sort-list](https://leetcode.com/problems/sort-list/) |
| 8 | Remove Nth Node From End of List | ④ Gap | Medium | [leetcode.com/problems/remove-nth-node-from-end-of-list](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) |
| 9 | Delete the Middle Node of a Linked List | ④ Gap | Medium | [leetcode.com/problems/delete-the-middle-node-of-a-linked-list](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/) |
| 10 | Happy Number | ⑤ Sequence | Easy | [leetcode.com/problems/happy-number](https://leetcode.com/problems/happy-number/) |
| 11 | Find the Duplicate Number | ⑤ Array as list | Medium | [leetcode.com/problems/find-the-duplicate-number](https://leetcode.com/problems/find-the-duplicate-number/) |
| 12 | Circular Array Loop | ⑤ Direction + cycle | Medium | [leetcode.com/problems/circular-array-loop](https://leetcode.com/problems/circular-array-loop/) |

**Kaise practice karein**: Har problem pe pehle likho — *"NEXT kya hai? Speeds kya? Milne ka matlab kya?"* — phir code.

Agla: [04-merge-intervals.md](04-merge-intervals.md)
