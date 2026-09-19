# 10. Binary Search on Answer

> **Standard definition**: Applying binary search not on a sorted array, but on the range of possible answers to an optimization problem — used when the feasibility of an answer is monotonic (once true, stays true for all "better" values).

**Ek line mein**: Array sorted nahi hai, par **possible answers ka range**
monotonic hai (jaise "agar speed X kaam kar rahi hai, toh X se zyada speed
bhi kaam karegi") — isi range pe binary search lagao.

**Trick yaad rakhne ki**: *"Kitni fast gaadi chahiye taaki time pe pahunch
jao?"* — agar 60 km/h kaafi hai, toh 70 km/h bhi kaafi hogi (monotonic).
Agar 40 km/h kaafi nahi hai, 30 km/h toh bilkul nahi hogi. Isi **"haan ki
taraf sab haan, na ki taraf sab na"** property pe binary search chal jata hai.

**Kab use karo**: "Minimum/maximum X **taaki** condition Y satisfy ho" jaisa
sawaal — jaise "minimum days", "minimum capacity", "maximum minimum
distance" — array pe search nahi, **answer ki value range** pe search.

## Code example — Koko Eating Bananas

```java
public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = Arrays.stream(piles).max().getAsInt();

    while (left < right) {
        int mid = left + (right - left) / 2;   // "speed" ka guess

        if (canFinish(piles, mid, h)) {
            right = mid;       // 🔑 ye speed kaam kar rahi hai — shayad aur kam bhi chale
        } else {
            left = mid + 1;    // ye speed slow hai — tez chahiye
        }
    }
    return left;   // minimum speed jo kaam karti hai
}

private boolean canFinish(int[] piles, int speed, int h) {
    int hoursNeeded = 0;
    for (int pile : piles) {
        hoursNeeded += Math.ceil((double) pile / speed);   // is speed pe ye pile khane mein kitne ghante
    }
    return hoursNeeded <= h;
}
```

**Line by line samjho**: Hum **"speed"** (jo answer hai) pe binary search
kar rahe hain, array pe nahi. `canFinish()` check karta hai "is speed pe
`h` ghanton mein saara khaana khatam ho jayega kya?" — agar haan, hum
**shayad aur bhi kam speed** try kar sakte hain (`right = mid`); agar nahi,
speed **badhani** padegi (`left = mid + 1`). Ye monotonic property
(slow speed → zyada time; fast speed → kam time) hi binary search ko valid banati hai.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Koko Eating Bananas | Medium | [leetcode.com/problems/koko-eating-bananas](https://leetcode.com/problems/koko-eating-bananas/) |
| 2 | Capacity To Ship Packages Within D Days | Medium | [leetcode.com/problems/capacity-to-ship-packages-within-d-days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) |
| 3 | Minimum Number of Days to Make m Bouquets | Medium | [leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) |
| 4 | Magnetic Force Between Two Balls | Medium | [leetcode.com/problems/magnetic-force-between-two-balls](https://leetcode.com/problems/magnetic-force-between-two-balls/) |
| 5 | Split Array Largest Sum | Hard | [leetcode.com/problems/split-array-largest-sum](https://leetcode.com/problems/split-array-largest-sum/) |

Agla: [11-bfs.md](11-bfs.md)
