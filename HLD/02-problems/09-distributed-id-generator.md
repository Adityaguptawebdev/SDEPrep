# Case Study 9: Distributed Unique ID Generator (Twitter Snowflake jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- IDs ko **time ke hisaab se sortable** hona chahiye (jaise Twitter tweets, chat messages — naya ID hamesha purane se bada ho)?
- Kitne servers parallel mein IDs generate kar rahe honge?
- Kitni IDs/second chahiye?

**Assume**: Sortable IDs chahiye, multiple servers (distributed), lakhon IDs/second.

**Sabse bada insight**: Ye problem tab aati hai jab **database ka simple
`AUTO_INCREMENT`** kaam nahi karta — kyunki jaise hi database ko **shard**
karte ho (multiple DB servers), har server apna khud ka counter rakhega,
aur **do alag servers same ID de sakte hain** (dono ka counter 1, 2, 3... se
shuru hoga) — clash ho jayega.

## Kyu UUID bhi poora solution nahi hai

`UUID` (jaise `550e8400-e29b-41d4-a716-446655440000`) globally unique toh
hai, par:
- **Bahut bada hai** (128-bit, 36 characters as string) — storage/index size badh jata hai
- **Random hai, time-sortable nahi** — agar "naya ID bada number ho" chahiye (jaise chat messages ko order mein dikhana), UUID kaam nahi karega

## Solution: Snowflake-style ID (Twitter ne banaya, industry standard)

**Trick**: Ek **64-bit number** ko alag-alag hisso mein baant do, har hissa
kuch alag information store kare:

```
64-bit ID ka structure:

┌─┬──────────────────────────────┬───────────────┬─────────────┐
│0│      Timestamp (41 bits)      │ Machine ID(10b)│ Sequence(12b)│
└─┴──────────────────────────────┴───────────────┴─────────────┘
 │              │                        │                │
 sign bit   current time,        kaunsi machine       usi milisecond
 (hamesha 0) milliseconds mein   ne generate kiya      mein kitni ID
             (epoch se)          (0 se 1023)           already ban chuki (0-4095)
```

**Line by line samjho:**
1. **Timestamp (41 bits)** — sabse important hissa. Isse ID **naturally
   time ke hisaab se sortable** ho jati hai (bada timestamp = baad mein bana
   ID = bada number). ~69 saal tak IDs generate ho sakti hain isi range mein.
2. **Machine ID (10 bits)** — 1024 alag machines/servers ek saath IDs
   generate kar sakte hain, bina clash kiye, kyunki har ek ka apna fixed
   number hai (config se assign hota hai).
3. **Sequence (12 bits)** — agar **ek hi machine, ek hi millisecond mein**
   multiple IDs generate kare (bahut common hai high-traffic mein), ye
   counter unhe alag-alag rakhta hai (0 se 4095 tak, ek milisecond mein
   4096 IDs ban sakti hain per machine).

**Trick yaad rakhne ka**: *"Time + Machine + Sequence — inteha time-based
sort ho jata hai, machine ka clash nahi hota kyunki ID mein khud machine ka
naam likha hai, aur ek machine ek hi second mein bahut IDs bhi bana sake."*

## Kyu ye "coordination-free" hai — bahut important point

**Trick**: Har machine **apne aap, bina kisi doosri machine se baat kiye**,
IDs generate kar sakti hai (bas apna fixed Machine ID aur current timestamp
use karke). Isliye ye system **bahut fast** hai — koi central "ID service"
ko har baar poochne ki zarurat nahi (jo khud ek bottleneck/single-point-of-failure
ban jata agar hota).

```
Machine 5:  timestamp=1699999999000, machineId=5, seq=0  → ID_A
Machine 5:  timestamp=1699999999000, machineId=5, seq=1  → ID_B  (same ms, seq badha)
Machine 7:  timestamp=1699999999000, machineId=7, seq=0  → ID_C  (alag machine, clash nahi)
```

## High-Level Design

```
App Server 1 (Machine ID: 1) ──▶ generates IDs locally (koi network call nahi)
App Server 2 (Machine ID: 2) ──▶ generates IDs locally
App Server 3 (Machine ID: 3) ──▶ generates IDs locally
```

**Machine ID kaise assign hota hai**: Startup ke time, har server ek chhoti,
lightweight coordination service (jaise Zookeeper) se apna unique Machine
ID le leta hai, phir uske baad **kabhi coordination nahi karni padti** — ye
hi is design ki khoobsurati hai.

## Kaha use hota hai

- [URL Shortener](01-url-shortener.md) ka counter-based short-code generation isi tarah ke ID generator se aa sakta hai
- Chat messages ki ordering ([Chat App](03-chat-application.md) mein dekha tha)
- Database primary keys jab table sharded ho

## Extensibility — interview mein bolne wali baatein
- "Clock skew (agar machine ka system clock thoda peeche chala jaye) ek edge case hai — is scenario mein main thoda wait karunga ya error throw karunga jab tak clock aage na badh jaye, taaki duplicate/out-of-order IDs na banein."
- "Machine ID pool khatam ho jaye (1024 se zyada machines) toh bits ka allocation badal sakte hain (jaise Timestamp thoda kam, Machine ID zyada) — ye trade-off hai jo scale dekh ke decide hoga."

Agla: [10-search-autocomplete.md](10-search-autocomplete.md)
