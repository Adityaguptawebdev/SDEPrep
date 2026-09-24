# 16. Stack

> Pehle ye aane chahiye: [Stack (syllabus)](../00-syllabus/02-linear-structures/11-stack.md), [Queue & Deque](../00-syllabus/02-linear-structures/12-queue-and-deque.md), [Strings](../00-syllabus/01-basics/03-strings.md)

> **Standard definition**: A LIFO (Last-In-First-Out) data structure where elements are added and removed from the same end (the "top"), used to track nested or most-recently-seen state.

**Ek line mein**: Elements ko **push** karte jao; jab koi cheez "resolve" ho sake (bracket band hua, operator aaya, `..` aaya), **top se pop** karke process karo. Sabse **recent** cheez hamesha upar rehti hai — isliye "sabse pichhla kaam pehle nipta do" wale sawaal stack ke hain.

**Trick yaad rakhne ki**: *"Plates ka dher (stack of plates)"* — jo plate sabse aakhri mein rakhi, wahi sabse pehle uthegi (LIFO). Bracket matching mein bhi yehi hai — jo bracket sabse recent khula hai, wahi sabse pehle band hona chahiye.

```
push →                        ┌───┐
  (  [  {  ...                │ { │ ← top  (sabse recent — pehle yahi resolve hoga)
                              │ [ │
                              │ ( │
                              └───┘   ← pop  ← ) ka jodi  { hi hona chahiye warna INVALID
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ Nested / paired structure:  brackets, tags, "k[...]", parentheses ke andar parentheses
✅ "Sabse recent" cheez pe kaam:  undo, last operation, adjacent cancel ("aa" → hata do)
✅ Expression ka value nikalna  (operator + operands)
✅ Recursion ko loop mein badalna  (explicit stack)
✅ O(1) mein extra jaankari (min / max) saath rakhni ho
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**valid brackets**", "**adjacent duplicates hatao**", "**backspace**" | ① **Matching / cancel** |
| "**expression evaluate**" (RPN, `+ − × ÷`) | ② **Expression** |
| "**getMin / getMax O(1)**", "**queue ko stack se banao**" | ③ **Design** |
| "**path simplify** (`..`)", "**baseball / undo operations**" | ④ **Simulation / undo** |
| "**`3[a2[c]]`**", "**parentheses ke andar calculator**" — bahar ka context save karo | ⑤ **Nested context** |
| "**recursion ko iterative**" (inorder, DFS) | ⑥ **Explicit stack** |

### ❌ Kab NAHI
- "**Next greater / smaller element**" (har element ke liye) → [Monotonic Stack](17-monotonic-stack.md).
- **Shortest path / level** → [BFS](11-bfs.md).
- Beech ke elements tak **random access** chahiye → array/list.

---

## 2. Code likhne ki recipe — 5 sawaal

```
1. STACK MEIN KYA?   chars  /  numbers  /  indices  /  (count, string) jaisa jodi (pair)
2. PUSH KAB?         opening bracket  /  operand  /  naya item jo cancel nahi hua
3. POP KAB?          closing bracket  /  operator  /  top same ho (cancel)  /  ".."  /  "C"
4. TOP SE KYA?       compare (match?)  /  combine (a + b)  /  peek sirf dekhna
5. END MEIN?         stack khaali hona chahiye (validity)?   ya  stack ka content hi answer (join / sum)?
```

**Ek skeleton:**

```
for token in input:
    if token "kholta" hai (open / operand / naya):   push
    else (token "band" karta hai / operator / cancel):
        top ko dekho / pop karo, combine karo ya galat → false
end:  validity  →  return stack.isEmpty()      answer  →  stack ko jodo / sum karo
```

**Java mein ratta:**
- `Stack<T>` (purana, slow) **nahi** — `Deque<T> stack = new ArrayDeque<>();` likho.
- `push(x)`, `pop()`, `peek()` — sab **head (top)** pe. Khaali pe `pop()` → `NoSuchElementException`, `peek()` → `null`. **Pehle `isEmpty()`** check karo.
- `for (x : stack)` **top se neeche** ki taraf ghoomta hai; **bottom se top** chahiye toh `stack.descendingIterator()`.
- `Integer` ko `==` se compare mat karo (`equals` ya `int` mein unbox).

---

## 3. ① Matching / Cancel

**Idea**: Match hone pe **top hatao**. Bracket mein: khulte hi **uska closing push** karo — phir band karne wala character seedha `pop() == c` se check ho jata hai (map ki zaroorat nahi).

```
Valid Parentheses  "({[]})":   ( → push ')'    { → push '}'    [ → push ']'
                                ] aaya: pop = ']' ✓    } aaya: pop = '}' ✓    ) aaya: pop = ')' ✓    stack khaali → valid

Adjacent duplicates "abbaca":   a  ab  a(bb cancel)  aa → (aa cancel) ""  c  ca        →  "ca"

Longest Valid Parentheses:  stack mein INDEX; bottom pe -1 (last invalid position)
      "(()"  :  push -1 | ( push 0 | ( push 1 | ) pop → top=0  →  length = 2 − 0 = 2
```

```java
// Valid Parentheses
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');                              // 🔑 khulte hi uska closing push
        else if (c == '[') stack.push(']');
        else if (c == '{') stack.push('}');
        else if (stack.isEmpty() || stack.pop() != c) return false;  // band karne wala top se match hona chahiye
    }
    return stack.isEmpty();                                          // 🔑 sab match → khaali
}

// Minimum Remove to Make Valid Parentheses — kaunse index hatane hain unhe mark karo
public String minRemoveToMakeValid(String s) {
    boolean[] remove = new boolean[s.length()];
    Deque<Integer> open = new ArrayDeque<>();                        // abhi tak unmatched '(' ke index
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(') open.push(i);
        else if (c == ')') {
            if (open.isEmpty()) remove[i] = true;                    // 🔑 jodi nahi → ye ')' extra
            else open.pop();
        }
    }
    while (!open.isEmpty()) remove[open.pop()] = true;               // bache hue '(' extra
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
        if (!remove[i]) sb.append(s.charAt(i));
    }
    return sb.toString();
}

// Remove All Adjacent Duplicates In String
public String removeDuplicates(String s) {
    StringBuilder stack = new StringBuilder();                       // StringBuilder hi stack hai
    for (char c : s.toCharArray()) {
        int top = stack.length() - 1;
        if (top >= 0 && stack.charAt(top) == c) stack.deleteCharAt(top);   // 🔑 top se same → dono cancel
        else stack.append(c);
    }
    return stack.toString();
}

// Remove All Adjacent Duplicates II — k barabar adjacent hatao (stack mein {char, count})
public String removeDuplicatesK(String s, int k) {
    Deque<int[]> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && stack.peek()[0] == c) {
            if (++stack.peek()[1] == k) stack.pop();                 // 🔑 count k ho gaya → poora group hata do
        } else {
            stack.push(new int[]{c, 1});
        }
    }
    StringBuilder sb = new StringBuilder();
    Iterator<int[]> it = stack.descendingIterator();                 // bottom → top
    while (it.hasNext()) {
        int[] e = it.next();
        for (int i = 0; i < e[1]; i++) sb.append((char) e[0]);
    }
    return sb.toString();
}

// Backspace String Compare — '#' = backspace
public boolean backspaceCompare(String s, String t) {
    return build(s).equals(build(t));
}

private String build(String s) {
    StringBuilder stack = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (c == '#') {
            if (stack.length() > 0) stack.deleteCharAt(stack.length() - 1);   // khaali pe backspace = kuch nahi
        } else {
            stack.append(c);
        }
    }
    return stack.toString();
}

// Longest Valid Parentheses — stack mein index
public int longestValidParentheses(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(-1);                                                  // 🔑 base: "aakhri invalid position"
    int best = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.isEmpty()) stack.push(i);                      // ye ')' unmatched → naya base
            else best = Math.max(best, i - stack.peek());            // valid length = i − (pichhla unmatched)
        }
    }
    return best;
}
```

---

## 4. ② Expression Evaluation

**Idea**: **Operands stack mein**; operator aaye toh **do operands pop → combine → result push**. Order dhyan: **pehla pop = right operand**.

```
RPN ["2","1","+","3","*"]:     2 push | 1 push | "+" → pop 1, pop 2 → 3 push | 3 push | "*" → 3×3 = 9        →  9

Basic Calculator II  "3+2*2":   pichhla operator yaad rakho (op), number complete hone pe apply
     op='+', num=3  → push 3
     op='+', num=2  → push 2
     op='*', num=2  → pop 2, push 4       ("*" "/" TURANT apply)     stack [3, 4]  →  sum = 7
     ("+" "-" ko sign ke saath push, aakhir mein sum)
```

```java
// Evaluate Reverse Polish Notation
public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        switch (t) {
            case "+": stack.push(stack.pop() + stack.pop()); break;
            case "*": stack.push(stack.pop() * stack.pop()); break;
            case "-": { int b = stack.pop(), a = stack.pop(); stack.push(a - b); break; }   // 🔑 pehla pop = RIGHT operand
            case "/": { int b = stack.pop(), a = stack.pop(); stack.push(a / b); break; }
            default: stack.push(Integer.parseInt(t));
        }
    }
    return stack.pop();
}

// Basic Calculator II — + - * / (brackets nahi), non-negative integers
public int calculateII(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int num = 0;
    char op = '+';                                                   // 🔑 number se PEHLE wala operator
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (Character.isDigit(c)) num = num * 10 + (c - '0');
        if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {   // number poora hua (operator aaya ya string khatam)
            if (op == '+') stack.push(num);
            else if (op == '-') stack.push(-num);
            else if (op == '*') stack.push(stack.pop() * num);       // 🔑 * aur / turant apply
            else stack.push(stack.pop() / num);
            op = c;
            num = 0;
        }
    }
    int sum = 0;
    for (int x : stack) sum += x;                                    // + aur − sab aakhir mein jod do
    return sum;
}
```

---

## 5. ③ Design — extra jaankari saath rakho

**Idea**: **Har push ke saath "ab tak ka min" bhi push** karo — pop pe dono jate hain, isliye min hamesha sahi rehta hai. Queue ko stack se: **do stacks** (`in`, `out`) — `out` khaali ho tabhi `in` ko palto.

```
MinStack:   push 5 → (5, min 5)    push 3 → (3, min 3)    push 4 → (4, min 3)          getMin = top ka min = 3
            pop → (4,3) gaya, getMin = 3        pop → (3,3) gaya, getMin = 5  (ab top (5,5))       O(1) har baar

Queue via 2 stacks:  push 1,2,3 → in = [3,2,1](top 3)      pop: out khaali → in ko palto → out = [1,2,3](top 1) → 1 nikla (FIFO ✓)
```

```java
class MinStack {
    private final Deque<int[]> stack = new ArrayDeque<>();           // {value, min abhi tak}

    public void push(int val) {
        int min = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, min});                             // 🔑 value ke saath min bhi
    }
    public void pop() { stack.pop(); }
    public int top() { return stack.peek()[0]; }
    public int getMin() { return stack.peek()[1]; }                  // O(1)
}

class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }
    public int pop() { move(); return out.pop(); }
    public int peek() { move(); return out.peek(); }
    public boolean empty() { return in.isEmpty() && out.isEmpty(); }

    private void move() {
        if (out.isEmpty()) {                                         // 🔑 sirf jab out khaali ho tab palto
            while (!in.isEmpty()) out.push(in.pop());
        }
    }
}
```

---

## 6. ④ Simulation / Undo

**Idea**: Har instruction ya token stack pe asar daalta hai — `..` = ek pop, `C` = last hatao, `D` = top ka double push.

```
Simplify Path "/a/./b/../../c/":   split("/") → a . b .. .. c
      a push | . skip | b push | .. pop(b) | .. pop(a) | c push          →  "/c"

Baseball  ["5","2","C","D","+"]:   5 | 2 | C (2 hata) | D → 10 | + → 5+10 = 15    stack [5, 10, 15]   sum 30
```

```java
// Simplify Path
public String simplifyPath(String path) {
    Deque<String> stack = new ArrayDeque<>();
    for (String part : path.split("/")) {
        if (part.isEmpty() || part.equals(".")) continue;            // khaali ("//") ya current dir
        if (part.equals("..")) {
            if (!stack.isEmpty()) stack.pop();                       // 🔑 ek level upar (root pe kuch nahi)
        } else {
            stack.push(part);
        }
    }
    StringBuilder sb = new StringBuilder();
    Iterator<String> it = stack.descendingIterator();                // bottom → top
    while (it.hasNext()) sb.append('/').append(it.next());
    return sb.length() == 0 ? "/" : sb.toString();
}

// Baseball Game
public int calPoints(String[] ops) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String op : ops) {
        if (op.equals("+")) {
            int last = stack.pop(), prev = stack.peek();             // 🔑 pop karke peek, phir wapas daalo
            stack.push(last);
            stack.push(last + prev);
        } else if (op.equals("D")) {
            stack.push(2 * stack.peek());
        } else if (op.equals("C")) {
            stack.pop();
        } else {
            stack.push(Integer.parseInt(op));
        }
    }
    int sum = 0;
    for (int x : stack) sum += x;
    return sum;
}

// Validate Stack Sequences — kya pushed se popped order bana sakte hain?
public boolean validateStackSequences(int[] pushed, int[] popped) {
    Deque<Integer> stack = new ArrayDeque<>();
    int j = 0;
    for (int x : pushed) {
        stack.push(x);
        while (!stack.isEmpty() && stack.peek() == popped[j]) {      // Integer == int → unbox hota hai, safe
            stack.pop();                                             // 🔑 jitna nikal sako nikaalo
            j++;
        }
    }
    return j == popped.length;
}
```

---

## 7. ⑤ Nested Context — bahar ka context save, andar ka alag

**Idea**: `[` ya `(` aate hi **abhi tak ka kaam (context) stack mein save** karo aur andar ke liye **saaf shuru** karo. `]` ya `)` pe **andar ka result** bahar wale se jodo.

```
Decode String  "3[a2[c]]":
   3 [ → save (count 3, "")   cur = ""
   a   → cur = "a"
   2 [ → save (count 2, "a")  cur = ""
   c   → cur = "c"
   ]   → pop (2, "a"): "a" + "c"×2 = "acc"     cur = "acc"
   ]   → pop (3, ""):  "" + "acc"×3            →  "accaccacc"

Basic Calculator  "1-(2+3)":   ( aane pe (result 1, sign −1) save;  ) pe  result = sign × andar + purana
```

```java
// Decode String
public String decodeString(String s) {
    Deque<Integer> counts = new ArrayDeque<>();
    Deque<StringBuilder> outers = new ArrayDeque<>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            k = k * 10 + (c - '0');                                  // multi-digit count (12[a])
        } else if (c == '[') {
            counts.push(k);                                          // 🔑 bahar ka context save
            outers.push(cur);
            cur = new StringBuilder();
            k = 0;
        } else if (c == ']') {
            StringBuilder outer = outers.pop();
            int times = counts.pop();
            for (int i = 0; i < times; i++) outer.append(cur);       // andar ka result k baar bahar mein
            cur = outer;
        } else {
            cur.append(c);
        }
    }
    return cur.toString();
}

// Basic Calculator — + - ( ) aur unary minus
public int calculateParens(String s) {
    Deque<Integer> stack = new ArrayDeque<>();                       // (purana result, bracket se pehle ka sign)
    int result = 0, num = 0, sign = 1;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+' || c == '-') {
            result += sign * num;
            num = 0;
            sign = c == '+' ? 1 : -1;
        } else if (c == '(') {
            stack.push(result);                                      // 🔑 bahar ka result aur sign save
            stack.push(sign);
            result = 0;
            sign = 1;
        } else if (c == ')') {
            result += sign * num;                                    // andar ka poora result
            num = 0;
            result *= stack.pop();                                   // bracket ke pehle ka sign
            result += stack.pop();                                   // bahar ka purana result
        }
    }
    return result + sign * num;
}
```

---

## 8. ⑥ Explicit Stack — recursion ko loop banao

**Idea**: Recursion ka call stack hi to stack hai — use **khud** sambhalo. Deep input (10⁵) pe `StackOverflowError` se bachne ka tareeka bhi.

```
Inorder (left, root, right) iterative:
   cur = root
   jitna LEFT jaa sako push karte jao  →  pop (ye "root" hai) → result mein → cur = uska RIGHT → dohrao
```

```java
// Binary Tree Inorder Traversal — iterative
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {                                        // 🔑 jitna left ja sako
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        result.add(cur.val);
        cur = cur.right;                                             // phir right subtree
    }
    return result;
}
```

Graph/grid DFS ka iterative roop [DFS pattern](12-dfs.md) mein hai.

---

## 9. Sab ek nazar mein

| Variation | Stack mein | Push | Pop | End |
|---|---|---|---|---|
| ① Matching | closing / index / `(char, count)` | opening / naya | closing match / top same | `isEmpty()` / content |
| ② Expression | operands | number | operator aaya → 2 pop, combine | `pop()` / sum |
| ③ Design | `(value, extra)` | har push | har pop | O(1) query `peek()` |
| ④ Simulation | items / path parts | valid token | `..` `C` | sum / join |
| ⑤ Nested | (count, string) / (result, sign) | `[` `(` pe **context** | `]` `)` pe merge | `cur` / result |
| ⑥ Explicit | nodes | left chain | node process | loop condition |

## Common galtiyan

- **Khaali stack pe `pop`/`peek`** — pehle `isEmpty()`.
- **`Stack` class** (purana) ya `LinkedList` — `ArrayDeque` use karo.
- **End mein `stack.isEmpty()` bhoolna** — `"(("` valid maan lete ho.
- **Operator ka operand order** — `a - b` mein `b` pehle pop hota hai.
- **`Integer` ko `==` se** compare (−128..127 ke bahar galat) — `equals`.
- **Multi-digit numbers** (`12[a]`, `123`) — digit ek-ek karke jodo, `k = k * 10 + digit`.
- **Basic Calculator II mein `* /` baad mein karna** — priority: turant apply, `+ −` sum mein.
- **Cancel wale sawaal mein pehle push, phir compare** — pehle top se compare, phir push.
- **`descendingIterator` bhoolna** — `for (x : stack)` top se neeche jata hai (answer ulta).

> 💡 **Interview mein bolne wali line**: *"Yahan sabse recent unresolved cheez pehle resolve hoti hai (LIFO), isliye stack. Har token pe [push / pop] karunga, aur end mein stack khaali hona hi validity hai. Time O(n), space O(n)."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Valid Parentheses | ① Matching | Easy | [leetcode.com/problems/valid-parentheses](https://leetcode.com/problems/valid-parentheses/) |
| 2 | Remove All Adjacent Duplicates In String | ① Cancel | Easy | [leetcode.com/problems/remove-all-adjacent-duplicates-in-string](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/) |
| 3 | Backspace String Compare | ① Cancel | Easy | [leetcode.com/problems/backspace-string-compare](https://leetcode.com/problems/backspace-string-compare/) |
| 4 | Min Stack | ③ Design | Medium | [leetcode.com/problems/min-stack](https://leetcode.com/problems/min-stack/) |
| 5 | Implement Queue using Stacks | ③ Design | Easy | [leetcode.com/problems/implement-queue-using-stacks](https://leetcode.com/problems/implement-queue-using-stacks/) |
| 6 | Baseball Game | ④ Simulation | Easy | [leetcode.com/problems/baseball-game](https://leetcode.com/problems/baseball-game/) |
| 7 | Simplify Path | ④ Simulation | Medium | [leetcode.com/problems/simplify-path](https://leetcode.com/problems/simplify-path/) |
| 8 | Evaluate Reverse Polish Notation | ② Expression | Medium | [leetcode.com/problems/evaluate-reverse-polish-notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) |
| 9 | Basic Calculator II | ② Expression | Medium | [leetcode.com/problems/basic-calculator-ii](https://leetcode.com/problems/basic-calculator-ii/) |
| 10 | Minimum Remove to Make Valid Parentheses | ① Matching | Medium | [leetcode.com/problems/minimum-remove-to-make-valid-parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/) |
| 11 | Remove All Adjacent Duplicates in String II | ① Cancel (count) | Medium | [leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/) |
| 12 | Validate Stack Sequences | ④ Simulation | Medium | [leetcode.com/problems/validate-stack-sequences](https://leetcode.com/problems/validate-stack-sequences/) |
| 13 | Decode String | ⑤ Nested | Medium | [leetcode.com/problems/decode-string](https://leetcode.com/problems/decode-string/) |
| 14 | Binary Tree Inorder Traversal | ⑥ Explicit | Easy | [leetcode.com/problems/binary-tree-inorder-traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) |
| 15 | Longest Valid Parentheses | ① Matching (index) | Hard | [leetcode.com/problems/longest-valid-parentheses](https://leetcode.com/problems/longest-valid-parentheses/) |
| 16 | Basic Calculator | ⑤ Nested | Hard | [leetcode.com/problems/basic-calculator](https://leetcode.com/problems/basic-calculator/) |
| 17 | Number of Atoms | ⑤ Nested | Hard | [leetcode.com/problems/number-of-atoms](https://leetcode.com/problems/number-of-atoms/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Stack mein kya? Push kab? Pop kab? Top se kya? End mein kya check?"* — phir code.

Agla: [17-monotonic-stack.md](17-monotonic-stack.md)
