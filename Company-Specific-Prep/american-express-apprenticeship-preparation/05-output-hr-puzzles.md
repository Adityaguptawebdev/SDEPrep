# 05 — "Tell the Output" + HR + Puzzles: Questions + Answers

🟢 apprentice · 🔵 Amex India entry-level · ✍️ my addition

---

## 1. "Tell the output" practice ✍️

🟢 In the apprentice round, code was **pasted in chat and they asked for the output** [GD-TA]. 🔵 Other reports say "some tricky Java output questions" [GFG-SET-21]. The exact snippets were not shared, so here are 7 classic Java traps. Every answer was run on JDK 26.

**Q1**
```java
String a = "hi", b = "hi", c = new String("hi");
System.out.println((a == b) + " " + (a == c) + " " + a.equals(c));
```
**Output:** `true false true`
String literals share one copy in the **String pool**, so `a == b`. `new` makes a **new object**, so `a != c`. `equals` compares the **content**.

**Q2**
```java
System.out.println(1 + 2 + "3" + 4 + 5);
```
**Output:** `3345`
Java reads left to right: `1 + 2 = 3` (numbers), then `3 + "3" = "33"` (now it's a string), then `"334"`, then `"3345"`.

**Q3**
```java
Integer x = 127, y = 127, p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));
```
**Output:** `true false`
Java **caches** `Integer` objects from −128 to 127, so `x` and `y` are the same object. 128 is outside the cache, so `p` and `q` are two different objects. Use `.equals()` to compare values.

**Q4**
```java
int i = 5;
i = i++ + ++i;
System.out.println(i);
```
**Output:** `12`
`i++` gives **5**, then `i` becomes 6. `++i` makes `i` 7 and gives **7**. So `5 + 7 = 12`.

**Q5**
```java
static void f(Object o) { System.out.println("Object"); }
static void f(String s) { System.out.println("String"); }
f(null);
```
**Output:** `String`
`null` fits both, and Java picks the **most specific** type. `String` is a child of `Object`, so `f(String)` wins.

**Q6**
```java
String s = "amex";
s.toUpperCase();
System.out.println(s);
```
**Output:** `amex`
Strings are **immutable**. `toUpperCase()` returns a **new** string, but we didn't save it. The fix is `s = s.toUpperCase();`.

**Q7**
```java
try { System.out.println(10 / 0); }
catch (ArithmeticException e) { System.out.println("caught"); }
finally { System.out.println("finally"); }
```
**Output:** `caught` then `finally`
Integer division by 0 throws `ArithmeticException`. `finally` **always runs**.

---

## 2. HR / managerial 🟢🔵

Keep every answer about **1 minute**. Use your **real** story. The answers below are only a shape to follow.

**Q: Why did you choose this career path?** 🟢
> "I liked solving problems since college. When I built my first project, [name], and saw people actually use it, I knew I wanted to build software. An apprenticeship is the best way for me to learn from real engineers on real systems."

**Q: Why American Express? What do you know about it?** 🟢🔵
> "Amex is a global payments company, and it is both the **card issuer and the network**, so engineers work on the whole flow: payments, fraud checks and customer apps. Payments must be secure and always available, so the engineering quality bar is high, and that's where I want to learn. I also like that this apprenticeship gives 12 months of real work."

**Q: What is Amex's revenue model?** 🔵
1. **Discount revenue (the biggest):** for each card payment, the **merchant** pays Amex a small % fee.
2. **Card fees:** annual fees on premium cards.
3. **Interest** on balances customers don't pay in full (lending).
4. Other fees: foreign exchange, late fees, travel services.

> 💡 **Hinglish:** Amex "closed loop" hai: card bhi Amex deta hai, network bhi Amex ka hai. Isliye har swipe ka data aur fee dono Amex ke paas.

**Q: What happens when you swipe a card?** 🔵 (asked in an Engineer 1 HM round, good to know)
```
Card swipe → Merchant terminal → Acquirer (merchant's bank) → Card network → Issuer (customer's bank)
                                                                                │ checks: card valid? fraud? limit?
Card swipe ← "Approved" ←──────────────────────────────────────────────────────┘
Later (end of day): clearing + settlement → the merchant gets the money minus the fee
```
With Amex, the **network and issuer are often both Amex** (closed loop).

**Q: How do you see yourself fitting at Amex?** 🟢
> "I learn fast and I care about doing things correctly, which matters in payments. In my project I [wrote tests / handled errors / worked in a team]. I'm happy to start with small tasks, ask questions and take ownership."

**Q: Explain your project (features, tech, your role, challenges).** 🟢 Asked for 20–25 minutes in some reports.
Use this order:
1. **What problem** it solves, in 1 line.
2. **Features:** the top 3.
3. **Tech stack, and why** each choice (for example, "MongoDB because the data had no fixed shape").
4. **Your role:** what *you* built.
5. **One hard problem** and how you fixed it.
6. **What you would improve** next.

Be ready for: "How does login work?", "Why this database?", "What happens if two users do X at the same time?", "How would it handle 10x users?"

**Q: Why did you choose this project? What difficulties did you face?** 🔵
Give a real reason (a problem you or friends had). For the difficulty, pick **one technical problem** (a bug, slow API, deployment issue), say what you tried and how you finally solved it.

**Q: Strengths and weaknesses?** 🔵
> Strength: "I don't give up on a bug; I break it into small parts until I find it."
> Weakness: "I used to spend too long making things perfect. Now I set a time limit and ask for help earlier."

**Q: Goals? Biggest achievement? A failure?** 🔵
- Goal: become a strong full-stack/backend engineer in 2–3 years and own a feature end to end.
- Achievement: a project, contest, or result you're proud of, with a number if possible.
- Failure: a real one + **what you learned** + what you do differently now.

**Q: What positive impact do you want to create on society?** 🔵
> "I want to build things that make life simpler and safer, for example payment systems that protect people from fraud."

**Q: What do you understand by software development?** 🔵
The process of **understanding a need → designing → coding → testing → deploying → maintaining** software. Teams usually work in **Agile sprints** with code reviews.

**Q: Do you know Excel? Have you worked on it?** 🔵
Answer honestly. Know the basics: formulas (`SUM`, `IF`, `VLOOKUP`/`XLOOKUP`), filters, sorting and pivot tables.

---

## 3. Puzzles 🔵 (from intern rounds)

**Q: 3 switches outside a room, 3 bulbs inside. You can enter only once. Which switch controls which bulb?**
Turn on switch 1 for 10 minutes, then turn it off. Turn on switch 2 and enter.
- Bulb **on** → switch 2
- Bulb **off but warm** → switch 1
- Bulb **off and cold** → switch 3

**Q: Two wires each burn in exactly 60 minutes, but unevenly. Measure 45 minutes.**
Light wire A at **both ends** and wire B at **one end**. Wire A burns out in **30 min**. Then light the **other end** of wire B, and it burns out in **15 more min**. Total: **45 minutes**.

**Q: A monkey climbs 3 ft every hour and slips 2 ft. The tree is 20 ft. How long does it take?**
Net +1 ft per hour, so after 17 hours it is at 17 ft. In hour 18 it climbs 3 ft to **20 ft** and reaches the top before slipping. **18 hours.**

**Q: Bag of coins** (the usual version): 10 bags of coins; one bag has fake coins weighing 1.1 g instead of 1 g. Find it with **one** weighing.
Take 1 coin from bag 1, 2 from bag 2, … 10 from bag 10 (55 coins). Weigh them. Extra weight = `(weight − 55) × 10` = **the bag number**. Example: 55.3 g → bag 3.

**Q: Points on the globe** (the usual version): from which points can you walk 1 km south, 1 km east, 1 km north and be back at the start?
The **North Pole**, plus points slightly north of the South Pole, where walking 1 km east takes you in a full circle around the pole.

Back to: [README.md](README.md)
