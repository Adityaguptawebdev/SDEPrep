# 5. Cyclic Sort

> **Standard definition**: A technique for arrays containing numbers in a known, fixed range (typically 1 to N), placing each number at its "correct" index (value == index) in a single pass, without extra space.

**Ek line mein**: Agar array mein numbers **1 se N ke range** mein hain,
har number ko **uske correct index** (`number - 1`) pe rakh do — swap karte
jao jab tak sab apni jagah pe na aa jayein.

**Trick yaad rakhne ki**: *"Roll number ke hisaab se bachchon ko unki seat
pe baitha do"* — number `5` ko index `4` pe hona chahiye. Jo bhi galat jagah
baitha hai, use uski sahi seat pe bhejo (swap karo), uski jagah jo aaya
use bhi check karo.

**Kab use karo**: Jab array mein numbers ek **fixed, known range** (1 to N,
ya 0 to N) mein ho, aur "missing number", "duplicate number" jaisa kuch
dhoondhna ho — **O(n) time, O(1) space** mein.

## Code example — Find the Duplicate Number (bina extra space ke)

```java
public int findDuplicate(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        if (nums[i] != i + 1) {
            int correctIndex = nums[i] - 1;
            if (nums[i] != nums[correctIndex]) {
                // 🔑 swap karo — current number ko uski sahi jagah bhejo
                int temp = nums[i];
                nums[i] = nums[correctIndex];
                nums[correctIndex] = temp;
            } else {
                // Yahi wo number hai jo apni jagah pe pehle se maujood hai — duplicate!
                return nums[i];
            }
        } else {
            i++;   // ye number already sahi jagah pe hai, aage badho
        }
    }
    return -1;
}
```

**Line by line samjho**: Har index `i` pe check karo "kya `nums[i]` apni
sahi jagah pe hai (`nums[i] == i + 1`)?" Agar nahi, use uski sahi jagah
(`nums[i] - 1`) bhejne ki koshish karo (swap). Agar wahan **pehle se wahi
number** baitha hai, matlab ye number **duplicate** hai — mil gaya.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Missing Number | Easy | [leetcode.com/problems/missing-number](https://leetcode.com/problems/missing-number/) |
| 2 | Find All Duplicates in an Array | Medium | [leetcode.com/problems/find-all-duplicates-in-an-array](https://leetcode.com/problems/find-all-duplicates-in-an-array/) |
| 3 | First Missing Positive | Hard | [leetcode.com/problems/first-missing-positive](https://leetcode.com/problems/first-missing-positive/) |
| 4 | Find the Duplicate Number | Medium | [leetcode.com/problems/find-the-duplicate-number](https://leetcode.com/problems/find-the-duplicate-number/) |
| 5 | Set Mismatch | Easy | [leetcode.com/problems/set-mismatch](https://leetcode.com/problems/set-mismatch/) |

Agla: [06-top-k-elements.md](06-top-k-elements.md)
