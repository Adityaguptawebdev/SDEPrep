# 9. Binary Search

> **Standard definition**: A search algorithm that repeatedly halves a sorted (or monotonic) search space by comparing the target to the middle element, achieving O(log n) time.

**Ek line mein**: Sorted array mein, **middle** check karo — target usse
chhota hai toh **left half** mein dhoondo, bada hai toh **right half** mein
— har step mein search space **aadha** ho jata hai.

**Trick yaad rakhne ki**: *"Dictionary mein word dhoondhna"* — poora dictionary
page-by-page nahi padhte, beech ka page kholte ho, dekhte ho word uske pehle
ka hai ya baad ka, phir usi half mein aage badhte ho. Har step mein **aadha
dictionary discard** ho jata hai.

**Kab use karo**: **Sorted arrays**, ya koi bhi **monotonic** search space
(jaha ek taraf "haan" hai, doosri taraf "nahi" — beech mein ek boundary hai).

## Code example — Search in Rotated Sorted Array

```java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        // 🔑 pehle pata karo kaunsa half "properly sorted" hai
        if (nums[left] <= nums[mid]) {
            // left half sorted hai
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;   // target left half mein hai
            } else {
                left = mid + 1;
            }
        } else {
            // right half sorted hai
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;    // target right half mein hai
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
```

**Line by line samjho**: Array rotate hone ke baad **poora sorted nahi**
raha, par **kam se kam ek half hamesha sorted hoga**. Pehle check karo
kaunsa half sorted hai (`nums[left] <= nums[mid]`), phir dekho target us
sorted half ke range mein aata hai ya nahi — agar haan, usi half mein jao,
nahi toh doosre half mein.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Search in Rotated Sorted Array | Medium | [leetcode.com/problems/search-in-rotated-sorted-array](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| 2 | Median of Two Sorted Arrays | Hard | [leetcode.com/problems/median-of-two-sorted-arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) |
| 3 | Find First and Last Position of Element in Sorted Array | Medium | [leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| 4 | Find Minimum in Rotated Sorted Array | Medium | [leetcode.com/problems/find-minimum-in-rotated-sorted-array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| 5 | Search Insert Position | Easy | [leetcode.com/problems/search-insert-position](https://leetcode.com/problems/search-insert-position/) |

Agla: [10-binary-search-on-answer.md](10-binary-search-on-answer.md)
