# Case Study 2: Rate Limiter (distributed)

## Interview mein aise approach karo

**Clarifying questions:**
- Rate limit kis level pe — per user, per IP, per API key?
- Limit exceed hone pe kya response (block, queue, throttle)?
- Single server hai ya **distributed** (multiple app servers) — ye sawaal hi is problem ko interesting banata hai

**Assume**: Per-user limit (jaise "100 requests/minute"), distributed system (multiple app servers, isliye limit ka count **sabke beech shared** hona chahiye).

**Sabse bada insight**: Agar har app server apna **local counter** rakhe, aur load balancer requests ko round-robin se baante — user ki har request alag server pe ja sakti hai, aur **koi bhi ek server ko poora picture nahi pata** ki user ne total kitni requests ki hain. Isliye counter ek **shared, centralized store (Redis)** mein rakhna padega.

## Algorithms — trick se yaad karo

### Token Bucket (sabse common, isse deeply samjho)

**Analogy**: Ek bucket hai jisme tokens dalte rehte hain **fix rate se**
(jaise 10 tokens/second), bucket ki **max capacity** hai (jaise 100).
Har request aane pe **1 token nikalo** — agar token hai, request allow, nahi
toh reject. Isse **burst traffic bhi handle** hota hai (agar bucket bhara
hua hai, ek saath 100 requests bhi allow ho jayengi), par average rate
control mein rehta hai.

```
Bucket capacity: 100 tokens
Refill rate: 10 tokens/sec

Time 0s:  bucket = 100 (full)
Request aati hai → 1 token nikla → bucket = 99
... (agar bahut requests aayein burst mein, bucket khaali ho sakta hai)
Time 1s:  10 aur tokens add ho gaye (agar bucket full nahi tha)
```

**Trick**: "Bucket = **burst allow** karta hai, refill rate = **average
sustain rate** control karta hai." Interview mein isi wajah se ye favorite
hai — real traffic bursty hota hai, aur token bucket usse gracefully handle karta hai.

### Sliding Window Log — zyada accurate, zyada memory

Har request ka **timestamp** ek list/sorted-set mein rakho. Naya request
aane pe, window (jaise pichhle 60 sec) se **purane timestamps hata do**,
bache hue count karo — agar limit se kam hai toh allow karo.

**Trick**: Bahut **accurate** hai (exact count), par har user ke liye **saare
timestamps store** karne padte hain — memory-heavy. Redis ka **Sorted Set**
(`ZADD`, `ZREMRANGEBYSCORE`) isi ke liye perfect fit hai.

| Algorithm | Accuracy | Memory | Burst handling |
|---|---|---|---|
| Token Bucket | Good | Low (bas 2 numbers: tokens, last-refill-time) | Achha |
| Sliding Window Log | Best | High (saare timestamps) | Achha |
| Fixed Window Counter | Kam (boundary pe double traffic allow ho sakta hai) | Sabse kam | Kharab |

## High-Level Design — distributed setup

```
                    ┌──────────────┐
Client ───────────▶│ Load Balancer │
                    └──────┬───────┘
              ┌────────────┼────────────┐
              ▼             ▼             ▼
         App Server 1  App Server 2  App Server 3
              │             │             │
              └─────────────┼─────────────┘
                             ▼
                    ┌──────────────┐
                    │  Redis (shared)│  ← sab servers isi se counter check karte hain
                    │  key: user_id  │
                    └──────────────┘
```

**Trick yaad rakhne ki**: Rate limiter khud ek **stateless service** ki tarah
design karo (jaisa [scalability basics](../00-fundamentals/01-scalability-basics.md)
mein dekha tha) — koi bhi app server, kisi bhi user ka request check kar sake,
kyunki asal "state" (counter) **Redis mein shared hai**, kisi ek server ki
memory mein nahi.

## Race condition ka gotcha (interview mein pucha jata hai)

Agar 2 requests **ek hi user ke, ek hi milisecond mein**, 2 alag app servers
pe pahunch jayein — dono Redis se count padhein (jaise 99), dono allow ho
jayein, dono increment karein → **actual limit se zyada requests pass ho
gayi (100 allow honi thi, 2 extra ho gayi)**.

**Fix**: Redis ka `INCR` command **atomic** hota hai — "padho aur badhao" ek
hi step mein hota hai, beech mein koi doosra request ghus nahi sakta.

```
count = INCR(user_id)      // atomic: increment karo aur naya value do, ek hi operation mein
if count == 1:
    EXPIRE(user_id, 60)    // pehli request pe hi window ka timer set kar do
if count > limit:
    reject
```

> 💡 **Interview mein bolne wali line**: *"Redis ka `INCR` atomic hai isliye
> race condition avoid ho jati hai — check-then-increment do alag steps mein
> nahi karunga, kyunki beech mein doosra request interleave ho sakta hai."*
> (Ye wahi concept hai jo [BookMyShow](../../LLD/03-problems/10-bookmyshow.md) ke `synchronized` mein dekha tha — bas single-machine ki jagah distributed level pe.)

## Response — exceed hone pe kya bhejein

Standard HTTP practice: `429 Too Many Requests` status code, saath mein headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699999999
```

## Extensibility — interview mein bolne wali baatein
- "Different tiers (free vs paid users) ka alag limit chahiye ho toh Redis key mein `plan_type` bhi include kar dunga, ya alag config table rakhunga."
- "Rate limiter khud bottleneck na ban jaye — isliye Redis ko bhi cluster mode mein chalayenge, aur rate-limiting logic ko API Gateway level pe rakhunge taaki backend services tak bekaar traffic pahunche hi na."

Agla: [03-chat-application.md](03-chat-application.md)
