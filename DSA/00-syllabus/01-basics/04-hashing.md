# 4. Hashing (HashMap & HashSet)

> 📍 **Syllabus**: Unit 1 — Basics · Topic 4 / 29 · Pehle chahiye: [Arrays](02-arrays.md), [Strings](03-strings.md)

> **Standard definition**: A technique that uses a hash function to map a key to an index (bucket) in an underlying array, enabling average-case O(1) insertion, deletion and lookup; implemented in Java as `HashMap` (key → value) and `HashSet` (unique keys).

**Ek line mein**: Kisi cheez ko **dhundhne ke liye ek-ek karke check mat karo** — ek formula (hash function) se seedha **bata do wo kaunse dabbe mein hogi**.

**Trick yaad rakhne ki**: *"Society ke letter boxes"* — har flat ka apna letter box hota hai. Postman ko poori society mein ghoomna nahi padta: **flat number dekha → seedha uska box khola**. Yahan:
- **Flat number** = key
- **Flat number se box number nikalne ka formula** = hash function
- **Letter box** = bucket
- **Do flats ka ek hi box** ban jaye = **collision** (box ke andar dono ki chitthi list mein rakh do — *chaining*)

**Kab use karo**: Jab bhi tumhare mann mein aaye — *"Kya maine ye pehle dekha hai?"*, *"Ye kitni baar aaya?"*, *"Iska jodi-daar (complement) kahan hai?"* — matlab **O(n) ki search ko O(1) banana** hai.

## Hashing andar se kaise kaam karti hai

```
put("Aditya", 90)     hash("Aditya") % 4 = 3
put("Rahul",  75)     hash("Rahul")  % 4 = 1
put("Priya",  82)     hash("Priya")  % 4 = 3      ← COLLISION (dono ka box 3)

buckets (array):
   [0] ─▶ (khaali)
   [1] ─▶ ("Rahul", 75)
   [2] ─▶ (khaali)
   [3] ─▶ ("Aditya", 90) ─▶ ("Priya", 82)         ← chaining: ek box mein chhoti si list

get("Priya"): hash → box 3 → list mein dhundho → 82
```

**Kitna fast?** Achhe hash function ke saath box mein 1–2 hi items hote hain → **average O(1)**. Sab keys ek hi box mein chali jayein (bura hash) toh **worst O(n)**. Java ka `HashMap` box bhar jaane par (**load factor 0.75**) array ko **double karke sabko dobara baant deta hai (rehash)**, isliye chain chhoti rehti hai.

## Java ke 4 "map/set" — kaun kab

| | Order | Time | Kab lo |
|---|---|---|---|
| `HashMap` / `HashSet` | Koi order nahi | **O(1)** average | 90% problems mein — default choice |
| `LinkedHashMap` | Insertion order | O(1) | Order yaad rakhna ho (LRU cache) |
| `TreeMap` / `TreeSet` | **Sorted** keys | O(log n) | Min/max key, floor/ceiling chahiye |
| `int[26]` / `int[256]` | Index = character | O(1) | Sirf letters ki ginti (sabse fast) |

## Code example 1 — HashMap / HashSet ke toolkit

```java
public void hashMapBasics() {
    Map<String, Integer> marks = new HashMap<>();
    marks.put("Aditya", 90);                       // insert / update — O(1)
    marks.put("Rahul", 75);

    int a = marks.get("Aditya");                   // 90 → key na ho toh null aata hai (int mein daaloge toh crash!)
    int z = marks.getOrDefault("Zoya", 0);         // 🔑 key na ho toh default — null ka jhanjhat khatam
    boolean has = marks.containsKey("Rahul");      // true
    marks.remove("Rahul");

    marks.merge("Aditya", 1, Integer::sum);        // 🔑 counting ka shortcut: hai toh +1, nahi hai toh 1 daal do
    marks.computeIfAbsent("Neha", k -> 0);         // key nahi thi toh 0 se bana do

    for (Map.Entry<String, Integer> e : marks.entrySet()) {     // key + value dono chahiye toh
        System.out.println(e.getKey() + " -> " + e.getValue());
    }

    Set<Integer> seen = new HashSet<>();
    seen.add(5);
    boolean isDuplicate = !seen.add(5);            // 🔑 add() false deta hai agar element pehle se tha → duplicate!
}
```

## Code example 2 — Frequency count aur Group Anagrams

```java
// Har element kitni baar aaya — HashMap ka sabse common use
public Map<Integer, Integer> frequency(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) {
        freq.put(x, freq.getOrDefault(x, 0) + 1);
    }
    return freq;
}

// Group Anagrams — anagram words ka SORTED form same hota hai, wahi "key" bana do
public List<List<String>> groupAnagrams(String[] words) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String w : words) {
        char[] chars = w.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);                          // "eat", "tea", "ate" → sabka key "aet"
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);   // key ki list nahi thi toh bana do, phir add
    }
    return new ArrayList<>(groups.values());
}
```

**Line by line samjho**: `groupAnagrams` mein sochne wali baat ye hai ki **"kaunsi cheez key banegi"**. Anagram words ke letters same hote hain, sirf order alag — isliye **sort karne pe sabka same rup** ban jata hai. Wohi rup key, aur us key ke neeche **saare words ki list**. Hashing ke problems mein aadhi jeet **sahi key chunne** mein hai.

## Code example 3 — Longest Consecutive Sequence (Set ka smart use)

**Trick**: *"Line ke sirf pehle bande se ginti shuru karo"* — agar `x-1` set mein hai toh `x` kisi sequence ka **beech** hai, wahan se ginna bekaar hai.

```java
// Sort kiye bina O(n) mein
public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);

    int best = 0;
    for (int x : set) {
        if (!set.contains(x - 1)) {             // 🔑 sirf sequence ke SHURUAATI number se ginti shuru karo
            int cur = x;
            int len = 1;
            while (set.contains(cur + 1)) {     // aage ke consecutive numbers gino
                cur++;
                len++;
            }
            best = Math.max(best, len);
        }
    }
    return best;
}
```

```
nums = [100, 4, 200, 1, 3, 2]

100  → 99 hai? nahi → start!  100 ─▶ 101? nahi        length 1
4    → 3 hai?  haan → skip (beech ka hai)
200  → start!                                          length 1
1    → 0 hai?  nahi → start!  1 ─▶ 2 ─▶ 3 ─▶ 4 ─▶ 5?  nahi   length 4  ✅
```

**Line by line samjho**: Har number ko sirf tab "start" maante hain jab uska `x-1` set mein na ho. Isliye har sequence **sirf ek baar** count hoti hai, aur andar ka `while` mila-jula ke har element ko **ek hi baar** chhuta hai → total **O(n)** (sort karte toh O(n log n) hota).

## Code example 4 — Subarray Sum Equals K (Prefix Sum + HashMap)

**Idea**: `prefix[j] − prefix[i] = k` matlab `i` se `j` tak ke subarray ka sum `k` hai. Ise ulta karo → **`prefix[i] = prefix[j] − k`**. Toh har `j` pe puchho: *"Ab tak kitne prefix sum aise the jo `prefix[j] − k` ke barabar the?"* — utne subarrays!

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();   // prefix sum → kitni baar aaya
    prefixCount.put(0, 1);        // 🔑 "khaali prefix" (sum 0) ek baar dekha ja chuka hai (poora subarray shuru se gino toh kaam aata hai)

    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;                                            // ab tak ka prefix sum
        count += prefixCount.getOrDefault(sum - k, 0);       // kitne pichhle prefix se ye subarray sum = k banta hai
        prefixCount.merge(sum, 1, Integer::sum);             // ab is prefix ko bhi yaad rakho
    }
    return count;
}
```

```
nums = [1, 2, 3], k = 3           map shuru mein = {0:1}

x=1  sum=1  sum-k=-2 → 0 baar          map {0:1, 1:1}
x=2  sum=3  sum-k= 0 → 1 baar (subarray [1,2])   map {0:1, 1:1, 3:1}
x=3  sum=6  sum-k= 3 → 1 baar (subarray [3])     ...
                                                   count = 2 ✅
```

## Code example 5 — Custom object ko key banana (`equals` + `hashCode`)

Apni class ko `HashMap` ka key banao toh **dono methods likhna zaroori hai**, warna Java do "barabar" objects ko alag maanega:

```java
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;               // kab do Points "barabar" maane jayein
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);                 // 🔑 jo fields equals() mein hain, wahi yahan bhi
    }
}
```

**Golden rule**: *"Agar `a.equals(b)` true hai, toh `a.hashCode() == b.hashCode()` **hona hi chahiye**."* Warna `map.get(new Point(1,2))` pehle wale `Point(1,2)` ko kabhi nahi dhundh payega — dono alag box mein chale jayenge. (Ye interview mein bahut poochha jata hai.)

## Kab kaunsa Hash use karna hai

| Question / hint | Kya banao |
|---|---|
| "Duplicate hai kya?", "pehle dekha?" | `HashSet` |
| "Kitni baar aaya", frequency | `HashMap<element, count>` |
| "Do numbers ka sum target" | `HashMap<value, index>` (complement dhundho) |
| "Group karo (anagram, same pattern)" | `HashMap<key, List>` — sahi key chuno |
| "Subarray ka sum = k" | Prefix sum + `HashMap` |
| "Cache / LRU" | `HashMap` + Doubly Linked List → [LLD LRU Cache](../../../LLD/03-problems/08-lru-cache.md) |
| Bahut saare servers mein data baantna | [Consistent Hashing](../../../HLD/00-fundamentals/08-consistent-hashing.md) (HLD) |

## Common galtiyan

- **`map.get(key)` ko seedha `int` mein daalna** — key na ho toh `null` → `NullPointerException`. `getOrDefault` use karo.
- **Map/Set ko iterate karte waqt usme add/remove karna** → `ConcurrentModificationException`.
- **Custom class ka `hashCode` bhoolna** — objects "barabar" hote hue bhi alag maane jayenge.
- **Mutable object ko key banana** aur baad mein uska field badal dena — hash badal jata hai, entry kho jati hai.
- **`HashMap` mein order ka bharosa karna** — koi order guarantee nahi. Order chahiye toh `LinkedHashMap`/`TreeMap`.

> 💡 **Interview mein bolne wali line**: *"Yahan O(n) ki lookup ko main HashMap se O(1) average bana sakta hoon — extra O(n) space ke badle. Key ke liye main [kya] use karunga kyunki [wajah]."*

## Practice — basic se advance

| # | Problem | Difficulty | Concept | Link |
|---|---|---|---|---|
| 1 | Two Sum | Easy | Complement in HashMap | [leetcode.com/problems/two-sum](https://leetcode.com/problems/two-sum/) |
| 2 | Ransom Note | Easy | Frequency count | [leetcode.com/problems/ransom-note](https://leetcode.com/problems/ransom-note/) |
| 3 | Isomorphic Strings | Easy | Two-way mapping | [leetcode.com/problems/isomorphic-strings](https://leetcode.com/problems/isomorphic-strings/) |
| 4 | Happy Number | Easy | HashSet se cycle pakadna | [leetcode.com/problems/happy-number](https://leetcode.com/problems/happy-number/) |
| 5 | Design HashMap | Easy | Buckets + chaining khud banao | [leetcode.com/problems/design-hashmap](https://leetcode.com/problems/design-hashmap/) |
| 6 | Group Anagrams | Medium | Sahi key chunna | [leetcode.com/problems/group-anagrams](https://leetcode.com/problems/group-anagrams/) |
| 7 | Top K Frequent Elements | Medium | Frequency map + heap/bucket | [leetcode.com/problems/top-k-frequent-elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| 8 | Longest Consecutive Sequence | Medium | HashSet, sequence ka start | [leetcode.com/problems/longest-consecutive-sequence](https://leetcode.com/problems/longest-consecutive-sequence/) |
| 9 | Subarray Sum Equals K | Medium | Prefix sum + HashMap | [leetcode.com/problems/subarray-sum-equals-k](https://leetcode.com/problems/subarray-sum-equals-k/) |
| 10 | Contiguous Array | Medium | 0 → −1 banao, prefix + HashMap | [leetcode.com/problems/contiguous-array](https://leetcode.com/problems/contiguous-array/) |
| 11 | 4Sum II | Medium | Do-do ke sums ka meet-in-middle | [leetcode.com/problems/4sum-ii](https://leetcode.com/problems/4sum-ii/) |
| 12 | LRU Cache | Medium | HashMap + Doubly Linked List | [leetcode.com/problems/lru-cache](https://leetcode.com/problems/lru-cache/) |

Agla: [05-math-basics.md](05-math-basics.md)
