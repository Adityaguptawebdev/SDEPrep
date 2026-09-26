# 08 — Low-Level Design (LLD) for Visa

> LLD at Visa showed up as **"write the classes for X"** inside technical rounds — mostly for Senior candidates, plus OOP-modelling questions for new grads. Every Java example here compiles and runs; the printed output is real.

**Easy analogy — LLD = building a house from the architect's sketch**: HLD bataata hai kitne kamre; LLD bataata hai har kamre mein kaunsa switch kahan, kaunsi wire kis se judi — classes, methods, relationships.

## What was reported

| Question | Reporter level | Source | Freq | Note |
|---|---|---|---|---|
| Custom cache / LRU cache (implement it) | Senior ×3, NCG, US SDE-1 OA | [LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-1510140](https://leetcode.com/discuss/post/1510140/visa-sse-4-yr-blr-by-user7518i-xrn3/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/) | **HIGH** | [01](01-custom-cache-lru-ttl.md) |
| Email + SMS notifications: structure the code (factory) | Senior | [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | LOW | [02](02-notification-service-factory-strategy.md) |
| BookMyShow — concurrent seat booking, class + DB design | Senior (2021) + BookMyShow HLD ×2 | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-1736047](https://leetcode.com/discuss/post/1736047/visa-sr-software-engineer-bangalore-jan-lwgky/) | **HIGH** (senior) | [03](03-bookmyshow-seat-booking.md) |
| Library management | **not reported at Visa** (seen at other companies in the same candidate's post) | [LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/) | — | [04](04-library-management.md) (you asked) |
| Payment system LLD: states, methods, retries | Staff | [LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/) | LOW | [05](05-payment-processing-lld.md) |
| OOP modelling (herbivore/carnivore/omnivore), custom stack, Product CRUD, Splitwise, restaurant reservation | NCG, EC, Senior | [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/), [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/), [LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/), [LC-1510140](https://leetcode.com/discuss/post/1510140/visa-sse-4-yr-blr-by-user7518i-xrn3/) | LOW each | [06](06-oop-modelling-questions.md) |

## How to approach any LLD question (from scratch)

```
 1. Requirements (3 min)      list 4–6 must-have features; say what you're NOT doing
 2. Entities (3 min)          nouns → classes (Show, Seat, Booking, User)
 3. Relationships (2 min)     has-a / is-a, 1-to-many (Show has many Seats)
 4. Interfaces (3 min)        what can vary? → interface (PaymentMethod, Notifier, EvictionPolicy)
 5. Patterns (1 min)          Strategy (varying algorithm), Factory (creation), Observer (events),
                              State (lifecycle), Singleton (one shared registry)
 6. Code the core flow (15)   one happy path end-to-end, clean names, small methods
 7. Concurrency (3 min)       what can two threads/users do at once? locks / atomic ops / DB constraints
 8. Extensibility (2 min)     "add a new payment method / channel" → new class, no core change (Open/Closed)
```

**🗣️ Interview mein aise bolo**: "Pehle requirements aur entities, phir jo cheez badal sakti hai usko interface bana deta hoon — kal naya type aaye toh sirf nayi class likhni pade. Phir main flow code karta hoon aur end mein concurrency."

Deeper general notes in this repo: [LLD approach](../../../LLD/03-problems/00-how-to-approach-any-problem.md) · [SOLID](../../../LLD/00-fundamentals/02-solid-principles.md) · [design patterns](../../../LLD/02-design-patterns/00-overview.md) · [LRU cache](../../../LLD/03-problems/08-lru-cache.md) · [BookMyShow](../../../LLD/03-problems/10-bookmyshow.md) · [Library](../../../LLD/03-problems/04-library-management.md) · [Splitwise](../../../LLD/03-problems/09-splitwise.md).

Next: [LLD 1 — Custom cache (LRU + TTL) →](01-custom-cache-lru-ttl.md)
