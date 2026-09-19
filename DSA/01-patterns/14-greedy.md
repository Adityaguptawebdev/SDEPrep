# 14. Greedy Algorithms

> **Standard definition**: An algorithmic approach that builds a solution piece by piece, always choosing the option that looks best (locally optimal) at the current step, without reconsidering previous choices.

**Ek line mein**: Har step pe **sabse achha lagne wala local choice** lo,
bina future sochte hue — aur hope karo (ya prove karo) ki ye local choices
milke **global optimal answer** de dengi.

**Trick yaad rakhne ki**: *"Change dena — sabse bada coin pehle try karo"*
— 100, 50, 20, 10 mein se, jitna bada coin fit ho sake wahi pehle do. Ye
**humesha kaam nahi karta** (isliye Greedy **sabhi problems** mein sahi
nahi hota) — pehle **prove/convince** karna padta hai ki greedy choice
yahan sahi hai.

**Kab use karo**: Jab problem mein **"local best choice → global best
answer"** property prove ho sake — jaise scheduling, jaha "jaldi khatam
hone wala kaam pehle lo" jaisi intuition kaam karti hai.

## Code example — Jump Game

```java
public boolean canJump(int[] nums) {
    int maxReach = 0;   // 🔑 ab tak ka farthest index jaha pahunch sakte hain

    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            return false;   // is index tak pahunch hi nahi sakte — dead end
        }
        maxReach = Math.max(maxReach, i + nums[i]);   // greedy: hamesha farthest reach update karo
    }
    return true;
}
```

**Line by line samjho**: Har index pe hum **greedily** check karte hain
"yaha se kitna aage ja sakte hain" (`i + nums[i]`), aur `maxReach` ko
**hamesha sabse bade reach** se update karte hain — kabhi bhi "konsa specific
jump lena hai" wapas soch ke decide nahi karte. Agar kisi index `i` tak
`maxReach` khud nahi pahuncha, matlab wahan se aage jaana **impossible** hai.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Jump Game | Medium | [leetcode.com/problems/jump-game](https://leetcode.com/problems/jump-game/) |
| 2 | Jump Game II | Medium | [leetcode.com/problems/jump-game-ii](https://leetcode.com/problems/jump-game-ii/) |
| 3 | Gas Station | Medium | [leetcode.com/problems/gas-station](https://leetcode.com/problems/gas-station/) |
| 4 | Task Scheduler | Medium | [leetcode.com/problems/task-scheduler](https://leetcode.com/problems/task-scheduler/) |
| 5 | Candy | Hard | [leetcode.com/problems/candy](https://leetcode.com/problems/candy/) |

Agla: [15-union-find.md](15-union-find.md)
