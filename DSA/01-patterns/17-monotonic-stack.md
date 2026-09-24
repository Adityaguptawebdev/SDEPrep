# 17. Monotonic Stack

> Pehle ye aane chahiye: [Stack (pattern)](16-stack.md), [Stack (syllabus)](../00-syllabus/02-linear-structures/11-stack.md), [Sliding Window (pattern)](01-sliding-window.md)

> **Standard definition**: A stack that maintains its elements in strictly increasing or strictly decreasing order, popping elements that violate this order before pushing a new one — used to efficiently find the "next greater/smaller" element.

**Ek line mein**: Stack ko hamesha **sorted order (increasing ya decreasing)** mein rakho — naya element aane pe, jo bhi purane elements is order ko todte hain unhe **pop** karte jao (aur **pop hote hi unka answer mil jata hai**), phir naya push karo. Har element ek baar push, ek baar pop → **O(n)**.

**Trick yaad rakhne ki**: *"Height ke hisaab se line mein khade log, chhote log jo apne se lambe ke peeche chhup jate hain unhe bahar nikal do"* — jaise hi ek **lamba banda** aata hai, saare chhote (jo pehle stack mein the) uske liye "next greater" mil gaya, unhe pop kar do.

```
temps = [73, 74, 75, 71, 69, 72, 76, 73]         "kitne din baad garam din?"   (stack mein INDEX)

i=0  73 : push 0                                             stack [0]
i=1  74 : 74 > 73 → pop 0, ans[0] = 1−0 = 1  ; push 1        stack [1]
i=2  75 : pop 1, ans[1] = 1                  ; push 2        stack [2]
i=3  71 : push 3                                             stack [2,3]
i=4  69 : push 4                                             stack [2,3,4]
i=5  72 : pop 4 (69) ans=1 ; pop 3 (71) ans=2 ; 75 > 72 ruk  ; push 5      stack [2,5]
i=6  76 : pop 5 ans=1 ; pop 2 (75) ans=4                      ; push 6      stack [6]
i=7  73 : push 7                                             stack [6,7]      →  ans = [1,1,4,2,1,1,0,0]
```

---

## 1. Kab use karo — kaise PEHCHANO

```
✅ "Har element ke liye NEXT / PREVIOUS greater ya smaller element"  (brute force = har element ke liye scan = O(n²))
✅ "Kitne din baad ...", "kitne pehle tak ...", "pehla bada / chhota jo aage / peeche hai"
✅ Array ke elements ek-doosre ko "block" / "dhak" rahe hain  (histogram, paani, asteroids)
✅ Sabhi subarrays mein min/max ka hisaab (contribution technique)
```

| Sawaal ki bhasha | Variation |
|---|---|
| "**next greater / smaller**", "**kitne din baad garam din**", "**circular array**" | ① **Next / Previous greater-smaller** |
| "**stock span**", "**sabhi subarrays ke min ka sum**" | ② **Span & contribution** |
| "**largest rectangle**", "**histogram**", "**maximal rectangle**" | ③ **Histogram** (dono taraf nearest chhota) |
| "**trapping rain water**" | ④ **Trapping** (gaddha layer-by-layer) |
| "**asteroid collision**", "**digits/letters hatao → smallest**" | ⑤ **Survivors / greedy stack** |
| "**window ka max / min**" | ⑥ **Monotonic deque** |

### ❌ Kab NAHI
- Sirf **brackets / expression** (koi "greater" nahi) → [Stack](16-stack.md).
- Sirf **kisi ek window ka max, k chhota** aur simple → heap ya deque (⑥) — par ye bhi monotonic hi hai.
- **Sorted array** mein next greater = seedha `i + 1` — stack ki zaroorat nahi.

---

## 2. Code likhne ki recipe — 4 sawaal

```
1. DIRECTION  →  NEXT (aage wala) ya PREVIOUS (peeche wala)?     loop hamesha left → right
2. KIS TYPE   →  GREATER ya SMALLER?      →   stack ka ORDER decide hota hai
3. STORE      →  INDEX rakho (value arr[idx] se milti hai; doori/width ke liye index chahiye)
4. TIES       →  barabar elements pe pop karein? (> ya >=)     ←  contribution / histogram mein zaroori
```

| Chahiye | Stack (bottom → top) | Pop jab | Answer kab milta hai |
|---|---|---|---|
| **Next Greater** | **decreasing** | `cur > arr[top]` | **pop hote hi** (`cur` hi answer) |
| **Next Smaller** | **increasing** | `cur < arr[top]` | pop hote hi |
| **Previous Greater** | decreasing | `arr[top] <= cur` | **push se pehle** (`top` hi answer) |
| **Previous Smaller** | increasing | `arr[top] >= cur` | push se pehle |

**Do templates** (yehi likhna hai):

```
NEXT greater  (answer POP pe):                      PREVIOUS greater  (answer PUSH se pehle):
for i in 0..n-1:                                    for i in 0..n-1:
    while stack not empty && arr[i] > arr[top]:         while stack not empty && arr[top] <= arr[i]:
        j = stack.pop()                                     stack.pop()
        ans[j] = i            (ya arr[i])               ans[i] = stack empty ? -1 : top
    stack.push(i)                                       stack.push(i)
# stack mein bache = jinko NEXT mila hi nahi          # ans = us se pehle wala bada
```

**Teen ratta:**
1. **Stack mein index**, comparison `arr[stack.peek()]` se.
2. **Pop hote hi answer** (next wale sawaal mein) — pop ka matlab "iska jawab mil gaya".
3. Aakhir mein **sentinel** (`cur = 0` / `MIN_VALUE` / `MAX_VALUE`) push karke bache hue sab pop karwao (histogram, contribution).

---

## 3. ① Next / Previous Greater-Smaller

**Idea**: Upar wala template. Variation sirf **comparison**, **kya store**, aur **circular** hai.

```
Next Greater Element II (circular):   nums = [1,2,1]      →  do round chalao (i % n), push sirf pehle round mein
   i=0 (1) push 0 | i=1 (2): pop 0 → ans[0]=2 ; push 1 | i=2 (1): push 2
   i=3 (=idx0, val 1) : pop? 1 > 1 nahi | i=4 (=idx1, val 2): 2 > 1 → pop 2 → ans[2]=2       →  [2,-1,2]

Final Prices (discount = next smaller-or-equal price):    prices = [8,4,6,2,3]     →   [4,2,4,2,3]
```

```java
// Daily Temperatures — kitne din baad garam din
public int[] dailyTemperatures(int[] temperatures) {
    int[] answer = new int[temperatures.length];
    Deque<Integer> stack = new ArrayDeque<>();                        // 🔑 indices; temperatures decreasing
    for (int i = 0; i < temperatures.length; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prev = stack.pop();
            answer[prev] = i - prev;                                  // 🔑 pop hote hi prev ka answer
        }
        stack.push(i);
    }
    return answer;                                                    // jinhe koi garam din nahi mila unka 0 (default)
}

// Next Greater Element I — nums1 nums2 ka subset; nums2 mein har ka next greater
public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> next = new HashMap<>();                     // value → uska next greater
    Deque<Integer> stack = new ArrayDeque<>();                        // values (distinct), decreasing
    for (int x : nums2) {
        while (!stack.isEmpty() && stack.peek() < x) next.put(stack.pop(), x);   // 🔑 pop hone wale ka next = x
        stack.push(x);
    }
    int[] result = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) result[i] = next.getOrDefault(nums1[i], -1);
    return result;
}

// Next Greater Element II — circular array
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {                                 // 🔑 do round: i % n
        int x = nums[i % n];
        while (!stack.isEmpty() && nums[stack.peek()] < x) result[stack.pop()] = x;
        if (i < n) stack.push(i);                                     // 🔑 push sirf pehle round mein
    }
    return result;
}

// Final Prices With a Special Discount — next smaller-or-equal ki value ghatao
public int[] finalPrices(int[] prices) {
    int[] result = prices.clone();
    Deque<Integer> stack = new ArrayDeque<>();                        // increasing
    for (int i = 0; i < prices.length; i++) {
        while (!stack.isEmpty() && prices[stack.peek()] >= prices[i]) {
            result[stack.pop()] -= prices[i];                         // 🔑 next smaller-or-equal mila → discount
        }
        stack.push(i);
    }
    return result;
}
```

---

## 4. ② Span & Contribution — previous side / "kitne subarrays mein ye min hai"

**Idea A (Span)**: Aaj ka price `p`. Peeche **jitne din ≤ p** hain wo sab aaj ke span mein — stack mein `(price, span)` rakho, chhote ko **merge** kar do.

**Idea B (Contribution)**: Har element `arr[i]` ke liye pucho — *"kitne subarrays mein main minimum hoon?"* `left` = mere se pehle tak kitni jagah se subarray shuru ho sakta hai, `right` = kitni jagah khatam. Answer = `arr[i] × left × right`, sab ka jod.

```
Sum of Subarray Minimums   arr = [3, 1, 2, 4]
   3 : sirf [3]                       left 1 × right 1 → 3 × 1 = 3
   1 : shuru {3,1}, khatam {1,2,4}    left 2 × right 3 → 1 × 6 = 6
   2 : shuru {2}, khatam {2,4}        left 1 × right 2 → 2 × 2 = 4
   4 : sirf [4]                                        → 4
   total = 17

Ties (barabar values): ek subarray ke DO minimum na gine jayein → ek side strict, ek side non-strict
   yahan: stack mein equal rehne dete hain (pop sirf strictly bade pe) → left = "pichhla ≤", right = "agla <"
```

```java
// Online Stock Span — aaj ka price, peeche kitne din (aaj mila ke) price <= aaj
class StockSpanner {
    private final Deque<int[]> stack = new ArrayDeque<>();            // {price, span}, prices decreasing

    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];                                   // 🔑 chhote/barabar dino ka span merge
        }
        stack.push(new int[]{price, span});
        return span;
    }
}
```

```java
// Sum of Subarray Minimums (mod 1e9+7)
public int sumSubarrayMins(int[] arr) {
    final int MOD = 1_000_000_007;
    int n = arr.length;
    long total = 0;
    Deque<Integer> stack = new ArrayDeque<>();                        // increasing (indices)
    for (int i = 0; i <= n; i++) {
        int cur = i == n ? Integer.MIN_VALUE : arr[i];                // 🔑 sentinel: aakhir mein sab pop
        while (!stack.isEmpty() && arr[stack.peek()] > cur) {
            int mid = stack.pop();                                    // mid ka right boundary = i (pehla strictly chhota)
            int left = stack.isEmpty() ? -1 : stack.peek();           // left boundary = pichhla ≤ (equal stack mein hi rehte hain)
            long count = (long) (mid - left) * (i - mid);             // 🔑 mid kitne subarrays ka minimum
            total = (total + count * arr[mid]) % MOD;
        }
        stack.push(i);
    }
    return (int) total;
}
```

---

## 5. ③ Histogram — dono taraf nearest chhota

**Idea**: Har bar ki **oonchai poori** use karke sabse bada rectangle = us bar se **left aur right mein pehle chhote bar tak ki chaudai**. Increasing stack: bar **pop** tab hota hai jab **chhota bar** aata hai — wahi uska **right boundary** (`i`), aur pop ke baad ka top uska **left boundary**.

```
heights = [2, 1, 5, 6, 2, 3]

          6
        5 █
        █ █     3
  2     █ █  2  █
  █  1  █ █  █  █
 [2, 1, 5, 6, 2, 3]

bar 5 (idx 2):  left chhota = idx 1 (oonchai 1),  right chhota = idx 4 (oonchai 2)
                width = 4 − 1 − 1 = 2 ;  area = 5 × 2 = 10   ← answer

stack pop pe:  h = heights[pop] ;  left = (stack khaali ? -1 : top) ;  width = i − left − 1
```

```java
// Largest Rectangle in Histogram
public int largestRectangleArea(int[] heights) {
    int n = heights.length, best = 0;
    Deque<Integer> stack = new ArrayDeque<>();                        // increasing heights (indices)
    for (int i = 0; i <= n; i++) {
        int cur = i == n ? 0 : heights[i];                            // 🔑 sentinel 0: aakhir mein sab pop
        while (!stack.isEmpty() && heights[stack.peek()] >= cur) {
            int h = heights[stack.pop()];
            int left = stack.isEmpty() ? -1 : stack.peek();           // 🔑 pop ke BAAD wala top = left boundary
            best = Math.max(best, h * (i - left - 1));                // width = right − left − 1
        }
        stack.push(i);
    }
    return best;
}

// Maximal Rectangle — har row tak ki histogram banao, upar wala function lagao
public int maximalRectangle(char[][] matrix) {
    if (matrix.length == 0) return 0;
    int[] heights = new int[matrix[0].length];
    int best = 0;
    for (char[] row : matrix) {
        for (int c = 0; c < row.length; c++) {
            heights[c] = row[c] == '1' ? heights[c] + 1 : 0;          // 🔑 '1' pe oonchai badhao, '0' pe reset
        }
        best = Math.max(best, largestRectangleArea(heights));
    }
    return best;
}
```

---

## 6. ④ Trapping Rain Water — gaddha layer-by-layer

**Idea**: Decreasing stack. **Bada bar** `i` aane pe: stack ka top = **gaddha (bottom)**, uske neeche ka element = **left deewar**, `i` = **right deewar**. Paani ki ek **parat** = `(min(left, right) − bottom) × chaudai`.

```
height = [0,1,0,2,1,0,1,3,2,1,2,1]                                   answer 6

i=3  (h=2): pop idx2 (h=0), left = idx1 (h=1)   →  (min(1,2) − 0) × (3−1−1) = 1 × 1 = 1        paani 1
i=6  (h=1): pop idx5 (h=0), left = idx4 (h=1)   →  (min(1,1) − 0) × 1 = 1                       paani 2
i=7  (h=3): pop idx6 (h=1), left = idx4 (h=1)   →  (1 − 1) × 2 = 0
            pop idx4 (h=1), left = idx3 (h=2)   →  (min(2,3) − 1) × (7−3−1) = 1 × 3 = 3         paani 5
i=10 (h=2): pop idx9 (h=1), left = idx8 (h=2)   →  (2 − 1) × 1 = 1                              paani 6   ✓

har pop pe ek horizontal layer:  paani += (min(H[left], H[i]) − H[bottom]) × (i − left − 1)
```

```java
public int trap(int[] height) {
    int water = 0;
    Deque<Integer> stack = new ArrayDeque<>();                        // decreasing heights (indices)
    for (int i = 0; i < height.length; i++) {
        while (!stack.isEmpty() && height[stack.peek()] < height[i]) {
            int bottom = stack.pop();                                 // gaddha
            if (stack.isEmpty()) break;                               // 🔑 left deewar nahi → paani nahi ruk sakta
            int left = stack.peek();
            int h = Math.min(height[left], height[i]) - height[bottom];   // parat ki oonchai
            water += h * (i - left - 1);                              // × chaudai
        }
        stack.push(i);
    }
    return water;
}
```

(Same sawaal do-pointer se O(1) space mein bhi hota hai — [Two Pointers](02-two-pointers.md).)

---

## 7. ⑤ Survivors / Greedy Stack

**Idea**: Stack mein **bache hue (survivors)** rakho. Naya element **top se takraye / compare ho**, jo "haare" unhe pop karo.

```
Asteroid Collision  [5, 10, -5]:    + right ko, − left ko.   Takkar sirf jab top "+" aur naya "−"
   5 push | 10 push | −5: top 10 > 5 → −5 phat gaya                      →  [5, 10]
   [8, -8] → dono khatam        [10, 2, -5] → −5 ne 2 ko udaya, 10 se haara → [10]

Remove Duplicate Letters "cbacdcbc":  smallest lexicographic, har akshar ek baar
   naya akshar c ho aur top bada (>) ho aur wo top AAGE dobara aayega → top hatao (baad mein wapas aa jayega)   →  "acdb"
```

```java
// Asteroid Collision
public int[] asteroidCollision(int[] asteroids) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (int a : asteroids) {
        boolean alive = true;
        while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {   // 🔑 takkar: top "+" aur naya "−"
            if (stack.peek() < -a) stack.pop();                            // top chhota → phat gaya, a aage badhe
            else if (stack.peek() == -a) { stack.pop(); alive = false; }   // dono khatam
            else alive = false;                                            // a phat gaya
        }
        if (alive) stack.push(a);
    }
    int[] result = new int[stack.size()];
    for (int i = result.length - 1; i >= 0; i--) result[i] = stack.pop();  // top = aakhri
    return result;
}

// Remove Duplicate Letters (= Smallest Subsequence of Distinct Characters)
public String removeDuplicateLetters(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;      // har akshar ka aakhri index
    boolean[] inStack = new boolean[26];
    StringBuilder stack = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (inStack[c - 'a']) continue;                                    // pehle se stack mein
        while (stack.length() > 0 && stack.charAt(stack.length() - 1) > c
               && last[stack.charAt(stack.length() - 1) - 'a'] > i) {      // 🔑 top bada aur aage dobara aayega
            inStack[stack.charAt(stack.length() - 1) - 'a'] = false;
            stack.deleteCharAt(stack.length() - 1);
        }
        stack.append(c);
        inStack[c - 'a'] = true;
    }
    return stack.toString();
}
```

Digits hatane wala (**Remove K Digits**) bhi isi shape ka hai — [Greedy + Stack](14-greedy.md) mein code hai.

---

## 8. ⑥ Monotonic Deque — window ka max / min

**Idea**: Window aage badhti hai. **Deque mein indices**, values **decreasing** (front = window ka max). Naya element aane pe **peeche se chhote pop** karo (wo kabhi max nahi banenge), aur **front se bahar gaye index** hata do.

```
nums = [1,3,-1,-3,5,3,6,7], k = 3

i=0: dq [0(1)]
i=1: 3 > 1 → peeche se 0 pop ; dq [1(3)]
i=2: −1      dq [1(3), 2(−1)]         window poori → max = nums[front] = 3
i=3: −3      dq [1, 2, 3]             max 3
i=4: front idx 1 ≤ 4−3 → bahar → pop ; 5 sab ko udaye ; dq [4(5)]     max 5
i=5: 3        dq [4(5), 5(3)]         max 5
i=6: 6 sab ko udaye ; dq [6(6)]       max 6
i=7: 7 udaye ; dq [7(7)]              max 7            →  [3,3,5,5,6,7]
```

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>();                        // indices, values decreasing → front = max
    for (int i = 0; i < n; i++) {
        if (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();       // 🔑 window se bahar gaya (front)
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) deque.pollLast();   // 🔑 chhote peeche se hatao
        deque.offerLast(i);
        if (i >= k - 1) result[i - k + 1] = nums[deque.peekFirst()];                 // window poori → front = max
    }
    return result;
}
```

Min chahiye toh comparison ulta (`>=`). Ye [Sliding Window](01-sliding-window.md) ka "max/min" wala saathi hai.

---

## 9. Sab ek nazar mein

| Variation | Stack order | Pop jab | Answer |
|---|---|---|---|
| ① Next greater | decreasing | `cur > top` | **pop pe** `cur` / `i − prev` |
| ① Next smaller (≤) | increasing | `cur <= top` | pop pe |
| ② Span | decreasing (price, span) | `top <= price` | span merge, push pe |
| ② Contribution | increasing | `top > cur` (sentinel MIN) | `arr[mid] × (mid−left) × (i−mid)` |
| ③ Histogram | increasing | `top >= cur` (sentinel 0) | `h × (i − left − 1)` |
| ④ Trapping | decreasing | `top < cur` | `(min(l, r) − bottom) × width` |
| ⑤ Survivors | (problem-specific) | takkar / lexicographic | stack ka content |
| ⑥ Deque max | decreasing (deque) | peeche `<=`, front bahar | `nums[front]` |

## Common galtiyan

- **Values store karna, indices nahi** — doori / width nahi nikalti.
- **Galat direction ka order** — next greater ke liye stack **decreasing** hota hai (pop jab naya bada).
- **Ties (`>` vs `>=`)** — contribution mein dono taraf `>=` ya dono `>` → subarrays **double count** ya miss.
- **Sentinel bhoolna** (histogram / contribution) — aakhir ke bars process hi nahi hote.
- **Circular mein push dobara** — do round mein sirf pehle round mein push.
- **Width galat** (`i − left` vs `i − left − 1`) — pop ke **baad** ka top hi left boundary.
- **`int` overflow** — `(mid−left) × (i−mid) × arr[mid]` `long` mein.
- **Stack khaali pe `peek()`** — `null` unbox → NullPointerException; `isEmpty()` pehle.
- **Deque mein `<= i − k`** ke bajay `< i − k` — window ka size ek zyada.

> 💡 **Interview mein bolne wali line**: *"Har element ke liye nearest greater/smaller chahiye, brute force O(n²) hai. Monotonic stack mein indices rakhta hun; jab naya element order todta hai, pop hone wale ka answer usi waqt mil jata hai. Har element ek baar push aur ek baar pop hota hai isliye O(n)."*

## Practice — variation ke hisaab se (easy se hard)

| # | Problem | Variation | Difficulty | Link |
|---|---|---|---|---|
| 1 | Next Greater Element I | ① Next greater | Easy | [leetcode.com/problems/next-greater-element-i](https://leetcode.com/problems/next-greater-element-i/) |
| 2 | Final Prices With a Special Discount in a Shop | ① Next smaller-or-equal | Easy | [leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/) |
| 3 | Daily Temperatures | ① Next greater | Medium | [leetcode.com/problems/daily-temperatures](https://leetcode.com/problems/daily-temperatures/) |
| 4 | Next Greater Element II | ① Circular | Medium | [leetcode.com/problems/next-greater-element-ii](https://leetcode.com/problems/next-greater-element-ii/) |
| 5 | Online Stock Span | ② Span | Medium | [leetcode.com/problems/online-stock-span](https://leetcode.com/problems/online-stock-span/) |
| 6 | Asteroid Collision | ⑤ Survivors | Medium | [leetcode.com/problems/asteroid-collision](https://leetcode.com/problems/asteroid-collision/) |
| 7 | Remove K Digits | ⑤ Greedy stack | Medium | [leetcode.com/problems/remove-k-digits](https://leetcode.com/problems/remove-k-digits/) |
| 8 | Remove Duplicate Letters | ⑤ Greedy stack | Medium | [leetcode.com/problems/remove-duplicate-letters](https://leetcode.com/problems/remove-duplicate-letters/) |
| 9 | 132 Pattern | ⑤ Stack + max | Medium | [leetcode.com/problems/132-pattern](https://leetcode.com/problems/132-pattern/) |
| 10 | Sum of Subarray Minimums | ② Contribution | Medium | [leetcode.com/problems/sum-of-subarray-minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) |
| 11 | Sum of Subarray Ranges | ② Contribution (max − min) | Medium | [leetcode.com/problems/sum-of-subarray-ranges](https://leetcode.com/problems/sum-of-subarray-ranges/) |
| 12 | Largest Rectangle in Histogram | ③ Histogram | Hard | [leetcode.com/problems/largest-rectangle-in-histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) |
| 13 | Maximal Rectangle | ③ Histogram | Hard | [leetcode.com/problems/maximal-rectangle](https://leetcode.com/problems/maximal-rectangle/) |
| 14 | Trapping Rain Water | ④ Trapping | Hard | [leetcode.com/problems/trapping-rain-water](https://leetcode.com/problems/trapping-rain-water/) |
| 15 | Sliding Window Maximum | ⑥ Deque | Hard | [leetcode.com/problems/sliding-window-maximum](https://leetcode.com/problems/sliding-window-maximum/) |
| 16 | Shortest Subarray with Sum at Least K | ⑥ Deque + prefix sum | Hard | [leetcode.com/problems/shortest-subarray-with-sum-at-least-k](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) |

**Kaise practice karein**: Har problem pe pehle likho — *"Next ya previous? Greater ya smaller? Stack ka order? Index store? Ties pe pop karun?"* — phir code.

Agla: [18-trie.md](18-trie.md)
