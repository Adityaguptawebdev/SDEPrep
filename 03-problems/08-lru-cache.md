# Problem 8: LRU Cache

## Interview mein aise approach karo

**Ye problem thodi alag hai** — ye "design patterns" wala LLD nahi hai, ye
**data-structure design** hai. Interviewer yahan check karta hai ki tumhe
"O(1) time mein get aur put kaise karoge" ka logic pata hai ya nahi.

**Clarifying questions:**
- Capacity fixed hai (constructor mein di jayegi)?
- `get()` aur `put()` dono O(1) time mein chahiye — ye hamesha confirm karo, ye hi is problem ki poori demand hai.

**Trick jo turant bolni hai**: *"HashMap se O(1) lookup milta hai, par eviction
(sabse purana element nikalna) ke liye order yaad rakhna padega — Doubly
Linked List se O(1) mein kisi bhi node ko beech se nikal ke front pe la sakte
hain. Isliye HashMap + Doubly Linked List dono ka combo use karunga."*

**Yaad rakhne ka trick**: **"HashMap batata hai KAHA hai node, Linked List batata hai KAB use hua tha."**

---

## Core idea

- **HashMap<Key, Node>** — O(1) mein node dhoondne ke liye
- **Doubly Linked List** — order maintain karne ke liye:
  - **Front (head)** = sabse recently used
  - **End (tail)** = sabse least recently used (jo evict hoga)
- Har `get()`/`put()` pe: node ko uski current jagah se nikaal ke **front**
  pe le aao (kyunki abhi use hua hai)

## Node — Doubly Linked List ka ek element

```java
class Node {
    int key, value;
    Node prev, next;   // 🔑 dono direction ke pointers, isliye "doubly"
    Node(int key, int value) {
        this.key = key;
        this.value = value;
    }
}
```

## LRUCache — poora implementation, line by line

```java
class LRUCache {
    private int capacity;
    private Map<Integer, Node> map = new HashMap<>();
    private Node head, tail;   // 🔑 dummy nodes — real data head.next se tail.prev tak

    LRUCache(int capacity) {
        this.capacity = capacity;
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;      // shuru mein list khaali: head <-> tail
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;

        Node node = map.get(key);
        remove(node);          // apni purani jagah se hatao
        insertAtFront(node);   // sabse aage (most recent) laga do
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));   // purana node hatao, naya banayenge
        }

        if (map.size() == capacity) {
            Node lru = tail.prev;   // 🔑 tail ke bilkul pehle wala = least recently used
            remove(lru);
            map.remove(lru.key);
        }

        Node newNode = new Node(key, value);
        insertAtFront(newNode);
        map.put(key, newNode);
    }

    // node ko uski current jagah se nikaalo (bas pointers ghumao, O(1))
    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // node ko head ke turant baad daalo (most recent position)
    private void insertAtFront(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
}
```

**Line by line samjho — isse dhyaan se padhna kyunki tum code likhne mein
struggle karte ho, ye exact wahi jagah hai jaha logic clear hona zaroori hai:**

1. **`head` aur `tail` dummy nodes kyun?** — bina inke, list khaali hone pe
   ya sirf 1 element hone pe "edge case" handle karna padta (null checks
   har jagah). Dummy nodes se list **kabhi khaali nahi hoti** — `head.next == tail` ka matlab hi khaali hai. Isse code simple ho jata hai.

2. **`get(key)`**: pehle map se node O(1) mein mil gaya. Fir usse uski
   current jagah se **remove** karke **front** pe daal diya — kyunki abhi
   use hua hai, ye ab "most recent" hai.

3. **`put(key, value)` mein eviction**: agar capacity full hai, `tail.prev`
   uthao (list ka aakhri **real** node, dummy `tail` nahi) — yehi sabse
   purana/least-recently-used hai. Usse remove karo aur map se bhi hatao.

4. **`remove()`**: sirf 4 pointers badalte hain (`node.prev.next` aur
   `node.next.prev`), **node ko delete nahi karte** — isliye O(1) hai, kisi
   loop ki zarurat nahi.

## Kyu O(1) hai dono operations
- `map.get(key)` → O(1), HashMap ka basic guarantee
- `remove()` aur `insertAtFront()` → sirf pointer reassignment, list ki length se koi matlab nahi

> 💡 **Java mein shortcut**: `LinkedHashMap` ka `removeEldestEntry()` override
> karke bhi LRU cache 3 lines mein ban sakta hai — lekin interview mein
> **manual implementation hi dikhani hoti hai**, kyunki interviewer internal
> mechanism check kar raha hai, built-in class use karna point miss karna hai.

## Extensibility — interview mein bolne wali baatein
- "Thread-safe chahiye ho toh `synchronized` methods ya `ReentrantLock` use karunga get/put pe."
- "LFU (Least Frequently Used) chahiye ho toh ek frequency counter aur add karna padega — structure same rahega, eviction criteria badlega."

Agla: [09-splitwise.md](09-splitwise.md)
