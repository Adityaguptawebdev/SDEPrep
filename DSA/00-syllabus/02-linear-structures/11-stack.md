# 11. Stack

> 📍 **Syllabus**: Unit 2 — Linear Structures · Topic 11 / 29 · Pehle chahiye: [Arrays](../01-basics/02-arrays.md), [Recursion](../01-basics/09-recursion.md)

> **Standard definition**: A linear data structure that follows the Last-In-First-Out (LIFO) principle — elements are inserted (push) and removed (pop) from the same end, called the top.

**Ek line mein**: **Jo cheez sabse aakhir mein daali, wahi sabse pehle nikalti hai** — sirf ek hi sira (top) khula hai.

**Trick yaad rakhne ki**: *"Browser ka Back button"* — tum pages kholte gaye: Google → YouTube → Gmail → Maps. **Back** dabao toh sabse **aakhri khola page (Maps)** pehle band hota hai, phir Gmail... Pages ki history ek **stack** hai. Physical roop mein: **canteen mein plates ka dher** — upar rakhi plate hi pehle uthti hai.

**Kab use karo**: Jab problem mein **"sabse recent cheez pehle"** wali baat ho — **brackets ka matching, undo/redo, nested structure, reverse karna, "next greater element"**. Recursion bhi andar se ek stack hi hai (call stack).

## Stack ka picture

```
push(10)   push(20)   push(30)      pop() → 30       peek() → 20 (nikaala nahi)

                        │ 30 │ ← top    │    │
             │ 20 │     │ 20 │          │ 20 │ ← top
  │ 10 │     │ 10 │     │ 10 │          │ 10 │
  └────┘     └────┘     └────┘          └────┘

Sab operations sirf TOP pe hote hain  →  push, pop, peek — teeno O(1)
```

| Operation | Kya karta hai | Time |
|---|---|---|
| `push(x)` | Upar daalo | O(1) |
| `pop()` | Upar se nikaalo (aur return karo) | O(1) |
| `peek()` | Upar wala dekho, nikaalo mat | O(1) |
| `isEmpty()` | Khaali hai kya | O(1) |

## Code example 1 — Java mein Stack aur apna Stack

**Java mein `Stack` class mat use karo** (purani, slow hai). Hamesha **`ArrayDeque`** ko stack ki tarah use karo:

```java
public void stackBasics() {
    Deque<Integer> stack = new ArrayDeque<>();   // 🔑 Stack ke liye ArrayDeque — purani Stack class nahi
    stack.push(10);                               // upar daalo
    stack.push(20);
    stack.push(30);                               // stack (upar se neeche): 30, 20, 10
    int top = stack.peek();                       // 30 — dekho, nikaalo mat
    int popped = stack.pop();                     // 30 — nikaal liya
    boolean empty = stack.isEmpty();              // false
    int size = stack.size();                      // 2
}
```

Array se khud banana (samajhne ke liye):

```java
class ArrayStack {
    private int[] data;
    private int top = -1;                         // -1 matlab stack khaali

    ArrayStack(int capacity) { data = new int[capacity]; }

    void push(int x) {
        if (top == data.length - 1) throw new RuntimeException("Stack Overflow");   // bhar gaya
        data[++top] = x;                          // pehle top badhao, phir value rakho
    }

    int pop() {
        if (top == -1) throw new RuntimeException("Stack Underflow");               // khaali se nikaalna
        return data[top--];                       // pehle value lo, phir top ghatao
    }

    int peek() {
        if (top == -1) throw new RuntimeException("Stack is empty");
        return data[top];
    }

    boolean isEmpty() { return top == -1; }
}
```

## Code example 2 — Valid Parentheses (stack ka "hello world")

**Trick**: *"Jo bracket sabse baad mein khula, wahi sabse pehle band hona chahiye"* — ye LIFO hi hai!

```
s = { [ ( ) ] }

'{' khula → push        stack: { 
'[' khula → push        stack: { [
'(' khula → push        stack: { [ (
')' band  → pop '(' ✓   stack: { [
']' band  → pop '[' ✓   stack: {
'}' band  → pop '{' ✓   stack: (khaali)   ✅ VALID

s = ( ]   →  ']' aaya par stack ka top '(' hai → match nahi → ❌ INVALID
```

```java
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') {
            stack.push(c);                                // khulne wala bracket → yaad rakho
        } else {
            if (stack.isEmpty()) return false;            // band karne wala mila par kuch khula hi nahi tha
            char open = stack.pop();                      // 🔑 sabse RECENT khula bracket hi match hona chahiye
            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) {
                return false;
            }
        }
    }
    return stack.isEmpty();                               // kuch khula reh gaya toh invalid
}
```

## Code example 3 — Min Stack (O(1) mein minimum)

**Problem**: Stack mein `push/pop/top` ke saath **`getMin()` bhi O(1)** mein chahiye. Har baar poora stack scan karna O(n) hoga.

**Trick**: *"Har element ke saath 'yahan tak ka minimum' bhi chipka do."* Sabse upar wala element hamesha bata dega ki uske neeche sab mein min kya hai.

```
entry = (value, ab tak ka min)

push 5  →  (5, 5)                     stack (upar → neeche)
push 3  →  (3, 3)                     (3,3)  (5,5)
push 7  →  (7, 3)                     (7,3)  (3,3)  (5,5)
push 2  →  (2, 2)                     (2,2)  (7,3)  (3,3)  (5,5)     getMin() = 2
pop     →                             (7,3)  (3,3)  (5,5)            getMin() = 3  ✅ (2 gaya, min wapas 3)
```

```java
class MinStack {
    private Deque<int[]> stack = new ArrayDeque<>();      // har entry: {value, ab tak ka minimum}

    public void push(int x) {
        int min = stack.isEmpty() ? x : Math.min(x, stack.peek()[1]);   // 🔑 pichhle min aur naye x mein se chhota
        stack.push(new int[]{x, min});
    }

    public void pop() { stack.pop(); }

    public int top() { return stack.peek()[0]; }

    public int getMin() { return stack.peek()[1]; }       // O(1) — sabse upar wale ne min yaad rakha hai
}
```

## Code example 4 — Reverse Polish Notation (expression evaluate)

`(2 + 1) * 3` ko postfix mein likhte hain: `2 1 + 3 *`. **Trick**: *"Number aaye toh stack mein rakho, operator aaye toh upar ke do numbers nikaal ke kaam karo aur result wapas rakho."*

```
["2", "1", "+", "3", "*"]

2   → push            [2]
1   → push            [2, 1]
+   → pop 1, pop 2 → 2+1 = 3 → push      [3]
3   → push            [3, 3]
*   → pop 3, pop 3 → 3*3 = 9 → push      [9]   ✅ answer 9
```

```java
public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
            int b = stack.pop();                  // 🔑 pehle pop hone wala DAAYAN operand (b) hai
            int a = stack.pop();                  // doosra pop hone wala BAAYAN (a) — 8 - 3 mein a=8, b=3
            if (t.equals("+")) stack.push(a + b);
            else if (t.equals("-")) stack.push(a - b);
            else if (t.equals("*")) stack.push(a * b);
            else stack.push(a / b);
        } else {
            stack.push(Integer.parseInt(t));      // number → stack pe
        }
    }
    return stack.pop();
}
```

## Code example 5 — Monotonic Stack: "Agla bada kaun?" (Daily Temperatures)

**Problem**: Har din ke liye batao **kitne din baad zyada garam din** aayega.

**Trick**: *"Line mein khade log jo abhi tak apne se lambe bande ko dhoondh rahe hain."* Stack mein wo **indexes** rakho jinka jawab abhi mila nahi. Naya din aaya aur wo garam hai → stack ke top wale ka jawab **mil gaya**, use nikaal do.

```
temps = [73, 74, 75, 71, 69, 72, 76, 73]      answer[] shuru mein sab 0

i=0 (73): stack khaali → push 0                       stack: [0]
i=1 (74): 74 > 73 → pop 0, answer[0]=1-0=1 → push 1   stack: [1]
i=2 (75): 75 > 74 → pop 1, answer[1]=1 → push 2       stack: [2]
i=3 (71): 71 < 75 → push 3                            stack: [2, 3]
i=4 (69): 69 < 71 → push 4                            stack: [2, 3, 4]
i=5 (72): 72 > 69 → pop 4 (ans 1);  72 > 71 → pop 3 (ans 2);  72 < 75 → ruko → push 5
i=6 (76): 76 > 72 → pop 5 (ans 1);  76 > 75 → pop 2 (ans 4);  → push 6
i=7 (73): 73 < 76 → push 7

answer = [1, 1, 4, 2, 1, 1, 0, 0]  ✅
```

```java
public int[] dailyTemperatures(int[] temps) {
    int[] answer = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>();            // indexes — jinka "garam din" abhi nahi mila
    for (int i = 0; i < temps.length; i++) {
        while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {
            int prev = stack.pop();                       // 🔑 aaj ka din prev se garam hai → prev ka jawab mil gaya
            answer[prev] = i - prev;
        }
        stack.push(i);
    }
    return answer;                                        // jo stack mein bache, unka jawab 0 hi rehta hai
}
```

**Line by line samjho**: Har index **ek baar push, ek baar pop** hota hai → total **O(n)** (bhale andar `while` loop hai). Stack ke andar temperatures **ghatte order** mein rehte hain — isiliye ise **monotonic stack** kehte hain. Poora pattern: [Monotonic Stack](../../01-patterns/17-monotonic-stack.md).

## Stack kab lagana hai — pehchano

| Problem ka hint | Stack ka use |
|---|---|
| Brackets / tags **match** karna | Khule ko push, band pe pop |
| **Undo / redo**, browser history | Har action push, undo = pop |
| **Nested** structure (`3[a2[c]]`) | Andar wale ko pehle solve karo |
| "**Next greater / smaller** element" | Monotonic stack |
| Expression evaluate (postfix, calculator) | Operands stack pe |
| Recursion ko **loop mein** badalna | Khud ka stack bana lo (DFS iterative) |

Basic pattern practice ke liye [Stack pattern](../../01-patterns/16-stack.md) bhi dekho.

## Common galtiyan

- **Khaali stack pe `pop()`/`peek()`** — `ArrayDeque` mein `NoSuchElementException` (ya `peek()` null deta hai). Pehle `isEmpty()` check.
- **Purani `Stack` class use karna** — slow aur `Vector` se bani hai. `ArrayDeque`.
- **`ArrayDeque.push` = `addFirst`** — agar tum ek saath `add()` (jo `addLast` karta hai) aur `pop()` mix karoge toh order ulta ho jayega. Sirf `push/pop/peek` use karo.
- **Monotonic stack mein index ki jagah value rakhna** — distance/answer nikalne ke liye index chahiye.
- **Sab kuch pop karne ke baad `stack.peek()` chalana** bina check ke.

> 💡 **Interview mein bolne wali line**: *"Yahan 'sabse recent' wali cheez pehle chahiye, matlab LIFO — stack. Har element ek baar push aur ek baar pop hoga, isliye time O(n) aur space O(n)."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Valid Parentheses | Easy | Bracket matching | [leetcode.com/problems/valid-parentheses](https://leetcode.com/problems/valid-parentheses/) |
| 2 | Baseball Game | Easy | Stack pe simple operations | [leetcode.com/problems/baseball-game](https://leetcode.com/problems/baseball-game/) |
| 3 | Backspace String Compare | Easy | Backspace = pop | [leetcode.com/problems/backspace-string-compare](https://leetcode.com/problems/backspace-string-compare/) |
| 4 | Remove All Adjacent Duplicates In String | Easy | Jodi aate hi pop | [leetcode.com/problems/remove-all-adjacent-duplicates-in-string](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/) |
| 5 | Next Greater Element I | Easy | Monotonic stack + map | [leetcode.com/problems/next-greater-element-i](https://leetcode.com/problems/next-greater-element-i/) |
| 6 | Min Stack | Medium | Har element ke saath min | [leetcode.com/problems/min-stack](https://leetcode.com/problems/min-stack/) |
| 7 | Evaluate Reverse Polish Notation | Medium | Operands stack pe | [leetcode.com/problems/evaluate-reverse-polish-notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) |
| 8 | Daily Temperatures | Medium | Monotonic stack | [leetcode.com/problems/daily-temperatures](https://leetcode.com/problems/daily-temperatures/) |
| 9 | Asteroid Collision | Medium | Stack pe collisions | [leetcode.com/problems/asteroid-collision](https://leetcode.com/problems/asteroid-collision/) |
| 10 | Decode String | Medium | Nested `k[...]` | [leetcode.com/problems/decode-string](https://leetcode.com/problems/decode-string/) |
| 11 | Basic Calculator II | Medium | Operator precedence | [leetcode.com/problems/basic-calculator-ii](https://leetcode.com/problems/basic-calculator-ii/) |
| 12 | Largest Rectangle in Histogram | Hard | Monotonic stack (boundaries) | [leetcode.com/problems/largest-rectangle-in-histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) |

Agla: [12-queue-and-deque.md](12-queue-and-deque.md)
