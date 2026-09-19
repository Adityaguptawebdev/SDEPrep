# 16. Stack

> **Standard definition**: A LIFO (Last-In-First-Out) data structure where elements are added and removed from the same end (the "top"), used to track nested or most-recently-seen state.

**Ek line mein**: Elements ko **push** karte jao jab tak ek condition tootne
tak; jab condition toote, **pop** karo aur process karo. Sabse **recent**
element hamesha upar rehta hai.

**Trick yaad rakhne ki**: *"Plates ka dher (stack of plates)"* — jo plate
sabse aakhri mein rakhi, wahi sabse pehle uthegi (LIFO). Bracket matching
mein bhi yehi hai — jo bracket sabse recent khula hai, wahi sabse pehle
band hona chahiye.

**Kab use karo**: **Balanced parentheses/brackets**, "matching pair"
problems, ya expression evaluation (jaha nested structure hai).

## Code example — Valid Parentheses

```java
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

    for (char c : s.toCharArray()) {
        if (pairs.containsValue(c)) {
            stack.push(c);   // opening bracket — push karo
        } else if (pairs.containsKey(c)) {
            // closing bracket — top wala opening bracket match karna chahiye
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                return false;
            }
        }
    }
    return stack.isEmpty();   // 🔑 sab match ho gaye toh stack khaali reh jayega
}
```

**Line by line samjho**: Opening bracket (`(`, `[`, `{`) milte hi **push**
karo. Closing bracket milte hi, stack ka **top (sabse recent opening)**
nikal ke check karo ki wo isi closing se match karta hai ya nahi — agar
nahi karta, ya stack pehle se khaali hai, string **invalid** hai. End mein
agar stack **khaali** bacha, matlab sab brackets sahi se close hue.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Valid Parentheses | Easy | [leetcode.com/problems/valid-parentheses](https://leetcode.com/problems/valid-parentheses/) |
| 2 | Daily Temperatures | Medium | [leetcode.com/problems/daily-temperatures](https://leetcode.com/problems/daily-temperatures/) |
| 3 | Largest Rectangle in Histogram | Hard | [leetcode.com/problems/largest-rectangle-in-histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) |
| 4 | Min Stack | Medium | [leetcode.com/problems/min-stack](https://leetcode.com/problems/min-stack/) |
| 5 | Evaluate Reverse Polish Notation | Medium | [leetcode.com/problems/evaluate-reverse-polish-notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) |

Agla: [17-monotonic-stack.md](17-monotonic-stack.md)
