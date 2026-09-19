# 8. Bit Manipulation

> **Standard definition**: Using bitwise operators (AND `&`, OR `|`, XOR `^`, shifts `<<`/`>>`) to solve problems at the binary-representation level, often achieving O(1) space and faster constant-time operations.

**Ek line mein**: Numbers ko unke **binary bits** ke level pe manipulate
karo — kai problems (duplicates dhoondhna, subsets banana, power-of-2 check
karna) bit tricks se **bina extra space** ke solve ho jate hain.

**Trick yaad rakhne ki — sabse important trick, XOR ka**: *"XOR ek number
ko khud se XOR karo, 0 mil jata hai — jaise do same cheezein cancel ho gayi."*
`a ^ a = 0` aur `a ^ 0 = a`. Isliye agar ek list mein **sab numbers pair mein
hain except ek**, sabko XOR kar do — pairs cancel ho jayenge, **akela number
bach jayega**.

**Kab use karo**: "Single number" jaisi problems, power-of-2 check, subsets
generate karna (bitmask se), ya jab explicitly "constant space" chahiye ho.

## Code example — Single Number

```java
public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;   // 🔑 XOR karte jao — pairs cancel ho jayenge (a^a=0)
    }
    return result;   // sirf akela (unpaired) number bachega
}
```

**Line by line samjho**: `result` shuru mein `0` hai. Har number ko `result`
ke saath XOR karo. Agar ek number **do baar** aata hai, dono baar XOR hone
se wo **cancel ho jata hai** (`a ^ a = 0`), aur `0` ke saath XOR karne se
koi fark nahi padta (`a ^ 0 = a`). Isliye jo number **akela** hai (pair
nahi hai), wahi **result mein bach jata hai** — O(n) time, **O(1) space**
(HashSet use karke bhi solve ho sakta tha, par wo O(n) space leta).

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Single Number | Easy | [leetcode.com/problems/single-number](https://leetcode.com/problems/single-number/) |
| 2 | Counting Bits | Easy | [leetcode.com/problems/counting-bits](https://leetcode.com/problems/counting-bits/) |
| 3 | Subsets (bitmask approach) | Medium | [leetcode.com/problems/subsets](https://leetcode.com/problems/subsets/) |
| 4 | Number of 1 Bits | Easy | [leetcode.com/problems/number-of-1-bits](https://leetcode.com/problems/number-of-1-bits/) |
| 5 | Sum of Two Integers | Medium | [leetcode.com/problems/sum-of-two-integers](https://leetcode.com/problems/sum-of-two-integers/) |

Agla: [09-binary-search.md](09-binary-search.md)
