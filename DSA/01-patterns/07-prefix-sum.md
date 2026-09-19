# 7. Prefix Sum

> **Standard definition**: Precomputing cumulative sums of an array so that the sum of any subarray/range can be answered in O(1) time instead of recomputing it each time.

**Ek line mein**: Ek `prefixSum[]` array bana lo jaha `prefixSum[i]` = index
`0` se `i` tak ka **total sum**. Fir kisi bhi range `[l, r]` ka sum
`prefixSum[r] - prefixSum[l-1]` se **O(1)** mein mil jata hai.

**Trick yaad rakhne ki**: *"Bank passbook ka running balance"* — har transaction
ke baad total balance likha hota hai. Kisi 2 dates ke beech kitna khaya gaya,
ye janne ke liye poori list dobara jodni nahi padti — bas dono dates ka
balance subtract karo.

**Kab use karo**: **Range sum queries** baar-baar poochni hain (same array
pe), ya subarray sum se related koi problem — "subarray jiska sum X ho" jaisa.

## Code example — Subarray Sum Equals K

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixSumCount = new HashMap<>();
    prefixSumCount.put(0, 1);   // 🔑 empty prefix ka sum 0 hai, ek baar "mila" hai

    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;   // running prefix sum

        // 🔑 agar (sum - k) pehle kabhi dikha hai, matlab beech ka subarray sum = k
        if (prefixSumCount.containsKey(sum - k)) {
            count += prefixSumCount.get(sum - k);
        }

        prefixSumCount.merge(sum, 1, Integer::sum);   // current sum ko record karo
    }
    return count;
}
```

**Line by line samjho**: Agar `sum` (0 se abhi tak ka total) aur `sum - k`
dono kisi point pe dekhe gaye hain, matlab **un dono points ke beech ka
subarray ka sum exactly `k` hai** (kyunki `sum - (sum - k) = k`). HashMap
mein har prefix sum ki **frequency** rakhte hain taaki multiple subarrays
(jinka sum k ho) bhi count ho jayein.

## Practice — kam se kam 5 LeetCode problems

| # | Problem | Difficulty | Link |
|---|---|---|---|
| 1 | Subarray Sum Equals K | Medium | [leetcode.com/problems/subarray-sum-equals-k](https://leetcode.com/problems/subarray-sum-equals-k/) |
| 2 | Find Pivot Index | Easy | [leetcode.com/problems/find-pivot-index](https://leetcode.com/problems/find-pivot-index/) |
| 3 | Range Sum Query - Immutable | Easy | [leetcode.com/problems/range-sum-query-immutable](https://leetcode.com/problems/range-sum-query-immutable/) |
| 4 | Contiguous Array | Medium | [leetcode.com/problems/contiguous-array](https://leetcode.com/problems/contiguous-array/) |
| 5 | Product of Array Except Self | Medium | [leetcode.com/problems/product-of-array-except-self](https://leetcode.com/problems/product-of-array-except-self/) |

Agla: [08-bit-manipulation.md](08-bit-manipulation.md)
