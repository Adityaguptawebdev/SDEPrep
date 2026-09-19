# Latency, Throughput, Availability & CAP Theorem

## Latency vs Throughput — jo log confuse karte hain

> **Standard definition**: *Latency* — the time taken to process a single request (end-to-end delay). *Throughput* — the number of requests a system can process per unit time.

**Analogy**: Ek **pipe se paani** bhar rahe ho.
- **Latency** = ek baltiy bharne mein kitna time laga (jaise 10 second). *"Speed of ONE request."*
- **Throughput** = ek minute mein kitni baaltiyan bhar sakte ho (jaise 6 baaltiyan/min). *"Kitna kaam ek saath ho raha hai."*

**Trick**: Latency = **"kitni der lagi"** (time). Throughput = **"kitna hua"** (volume/rate).

Ek system **low latency** ho sakta hai par **low throughput** bhi (fast, but ek time pe ek hi kaam kar sakta). Dono ko badhane ke tarike alag hote hain:
- Latency kam karni ho → caching, CDN, database indexing, closer servers (geo)
- Throughput badhana ho → horizontal scaling, more parallel workers, queueing

## Availability — "system kitna % time up rehta hai"

> **Standard definition**: The percentage of time a system remains operational and accessible over a given period, usually expressed as "N nines" (e.g., 99.9%).

**Trick yaad rakhne ki — "9s ka game"**:

| Availability | Downtime/year | Bolchaal mein |
|---|---|---|
| 99% | ~3.65 din | "do 9s" |
| 99.9% | ~8.7 ghante | "three 9s" |
| 99.99% | ~52 minute | "four 9s" |
| 99.999% | ~5 minute | "five 9s" — bank/payment jaisi cheezon ke liye |

> 💡 Interview mein "high availability chahiye" ka matlab hai — **single point
> of failure na ho**. Ek hi server pe sab depend na ho, replicas/backups hone chahiye.

## CAP Theorem — sabse zyada pucha jaane wala concept

> **Standard definition**: In a distributed system, it is impossible to simultaneously guarantee all three of Consistency, Availability, and Partition Tolerance — you can only guarantee two at a time (in practice, a choice between C and A, since network partitions must be tolerated).

**Ek line mein**: Distributed system (jaha data multiple machines pe hai)
teeno cheezein **ek saath 100% nahi de sakta** — inme se sirf 2 choose kar
sakte ho jab **network fail ho jaye** (partition).

- **C — Consistency**: Sab servers se same, latest data milega
- **A — Availability**: Har request ka response milega hi (chahe thoda purana data ho)
- **P — Partition Tolerance**: Network tootne pe bhi system chalta rahe

**Trick**: Real duniya mein **network kabhi na kabhi tootega hi** (P zaroori
hai, optional nahi) — isliye asal choice hamesha **C vs A** ke beech hoti
hai, teeno mein se nahi.

**Analogy**: Do branches ka bank socho, dono ka ATM network beech mein kat
gaya (partition).
- **CP choose kiya** (Consistency > Availability): dono ATM **withdrawal
  band kar denge** jab tak connection wapas na aaye — kyunki galat balance
  dikhana zyada risky hai. Jaise **Banking systems**.
- **AP choose kiya** (Availability > Consistency): dono ATM **kaam karte
  rahenge** apne last-known balance se, baad mein sync ho jayega. Jaise
  **Instagram likes count** — thoda purana dikh gaya toh koi crisis nahi.

| System type | Kya choose karega | Kyu |
|---|---|---|
| Banking, Payment | CP | Galat balance dikhana bahut risky hai |
| Social media feed, Likes/Views count | AP | Thoda stale data chalega, downtime nahi chalega |

> 💡 **Interview mein bolne wali line**: *"Ye ek payment system hai, isliye
> main Consistency ko prioritize karunga even if kabhi kabhi availability
> thodi kam ho — galat balance dikhana bahut zyada costly mistake hai."*

Agla: [03-load-balancing.md](03-load-balancing.md)
