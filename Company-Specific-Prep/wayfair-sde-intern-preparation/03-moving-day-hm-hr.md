# 03 — "Moving Day" Debugging Round + Hiring Manager + HR

## "Moving Day" technical case study

**What 2 candidates reported** [LC-6167585 winter intern 2024, LC-6553789 on-campus fresher 2024]:

1. The interviewer gives a scenario: shift your room items with a **small and a big vehicle**. Items are **small or big**. Use the **minimum number of turns**.
2. First you list **which inputs/parameters** you need.
3. Then you get **pre-written code** (with a math formula) that gives the wrong output. **Explain it, find the logical and syntax bugs, fix them**, against a timer. The platform was HackerEarth.

> 💡 **Hinglish:** Yeh DSA round nahi, "kisi aur ka code samjho aur theek karo" round hai. Bolte raho ki har line kya kar rahi hai.

**How to do well:**

- **Ask before coding:** capacities? Can the small vehicle carry big items? Do both vehicles go every turn? Can a capacity be 0?
- **Read top-down:** say what each line does, then run a tiny example by hand.
- **Fix one bug at a time,** re-run the example, then try edge cases (0 items, capacity 0).

### Practice version (Reconstructed: our own version of the scenario)

**Rules:** one turn = both vehicles make one trip. The big vehicle carries up to `bigCap` items (small or big). The small vehicle carries up to `smallCap` **small** items only. Return the minimum turns, or `−1` if it's impossible.

**Formula:** with `T` turns we need `T·bigCap ≥ bigItems` **and** `T·(bigCap + smallCap) ≥ bigItems + smallItems`.
So `T = max(⌈big / bigCap⌉, ⌈(big + small) / (bigCap + smallCap)⌉)`.

**Buggy code (find 3 bugs):**

```java
class MovingDayBuggy {
    static int minTurns(int bigItems, int smallItems, int bigCap, int smallCap) {
        int forBig = bigItems / bigCap;
        int forAll = (bigItems + smallItems) / (bigCap + smallCap);
        return Math.min(forBig, forAll);
    }
}
```

<details>
<summary>Answer: the 3 bugs and the fixed code</summary>

1. `/` rounds **down**, but 3 items with capacity 2 need **2** turns. Round **up**.
2. Both conditions must hold, so use `max`, not `min`.
3. `bigCap == 0` → division by zero; big items with no big vehicle is impossible (`−1`).

```java
class MovingDay {
    static int minTurns(int bigItems, int smallItems, int bigCap, int smallCap) {
        if (bigItems + smallItems == 0) return 0;
        if (bigItems > 0 && bigCap == 0) return -1;              // bug 3: big items need the big vehicle
        if (bigCap + smallCap == 0) return -1;
        int forBig = bigCap == 0 ? 0 : ceilDiv(bigItems, bigCap); // bug 1: round UP
        int forAll = ceilDiv(bigItems + smallItems, bigCap + smallCap);
        return Math.max(forBig, forAll);                         // bug 2: both must hold → max
    }

    private static int ceilDiv(int a, int b) {
        return (a + b - 1) / b;
    }
}
```

**Dry run:** big = 3, small = 5, bigCap = 2, smallCap = 3 → `max(⌈3/2⌉, ⌈8/5⌉) = max(2, 2) = 2`.

- Turn 1: big vehicle takes 2 big items; small vehicle takes 3 small items.
- Turn 2: big vehicle takes 1 big + 1 small; small vehicle takes 1 small. ✅

The buggy code gives `min(1, 1) = 1` ❌.
</details>

---

## Hiring Manager round

Reported topics [LC-6553789], plus questions from a 2024 Wayfair SWE culture round [GFG-SWE-2024]:

- **Walk me through your best project:** your role, the hardest decision, what you'd do differently.
- **A time you worked in a team and resolved a conflict.**
- **How do you take technical decisions** when stuck between two approaches?
- **A "scrappy" solution you built** (quick, practical, good enough).
- **The most difficult technical problem you solved.**

Answer with **STAR** (Situation, Task, Action, Result), which is what Wayfair's own blog recommends [WF-BLOG-2021]. Keep each story to about 2 minutes, with a number in the result.

## HR round

Reported [LC-6553789]: **Why Wayfair?** · strengths and weaknesses · career goals · culture and adaptability · relocation.

**Why Wayfair (facts to use)** [WF-WHO]:

- An online **home goods** company (furniture, décor) with brands Wayfair, AllModern, Birch Lane, Joss & Main, Perigold
- Founded by Niraj Shah and Steve Conine; headquartered in Boston
- Plenty of engineering problems: search, recommendations, supply chain, delivery of big and bulky items

Then add one personal line: `[CUSTOMIZE: what you built or used that connects to e-commerce / Wayfair]`.
