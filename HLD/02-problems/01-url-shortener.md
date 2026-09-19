# Case Study 1: URL Shortener (bit.ly jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- Custom alias chahiye (`bit.ly/myBrand`) ya sirf random short code?
- Link expire honi chahiye (TTL)?
- Analytics chahiye (kitni baar click hua)?

**Assume**: Random short code (7 characters), koi expiry nahi, basic click count.

**Sabse bada design decision**: short code kaise generate hoga — ye pura interview isi ek decision ke around ghoomta hai.

## Requirements

**Functional**: `longUrl → shortUrl` banao, `shortUrl` hit hone pe `longUrl` pe redirect karo.

**Non-functional**: Read-heavy hai (log click zyada karte hain, create kam) — assume **read:write = 100:1**. High availability chahiye (link kabhi bhi kaam karni chahiye), thodi latency chalegi create karte waqt.

## Estimation (order of magnitude)

```
Naye URLs: 10 crore/mahina → ~40 writes/sec
Reads: 40 × 100 = 4000 reads/sec
Storage: 10 crore/mahina × 12 × 5 saal × 500 bytes ≈ 3 TB
```
Numbers batate hain: **read-heavy hai → caching zaroori hoga**, storage bada hai par manageable hai (sharding abhi zaroori nahi lag raha, future mein).

## Short code kaise banega — 2 approaches (dono bolna)

### Approach 1: Hash the long URL (MD5/Base62) — problem hai

```
shortCode = base62(md5(longUrl))[0:7]
```
**Problem**: Do alag users same URL shorten karein, same code milega (collision detection ka extra logic chahiye), ya same user ko baar-baar same link chahiye ho toh conflict.

### Approach 2: Counter + Base62 encoding (better, ye bolo)

**Trick**: Ek **globally unique, auto-incrementing number** lo (jaise database ka `AUTO_INCREMENT` id, ya [distributed ID generator](09-distributed-id-generator.md) se), usse **Base62** (0-9, a-z, A-Z = 62 characters) mein convert karo.

```
id = 125          →  base62(125) = "cb"
id = 100000000000 →  base62(100000000000) = "1Ru2c8" (chhota sa 7-char code)
```

**Kyu Base62**: URL mein safe characters chahiye (no special symbols), aur 62 characters ke base mein **7 digits se 62^7 (~3500 crore) unique combinations** mil jate hain — kaafi hain.

> 💡 **Interview mein bolne wali line**: *"Counter-based approach collision-free
> hai by design, isliye main isse prefer karunga. ID generation ke liye ek
> distributed counter service (jaise Snowflake ya database ka auto-increment
> range allocation) use karunga taaki multiple app servers clash na karein."*

## High-Level Design

```
                    ┌──────────────┐
Client ───────────▶│ Load Balancer │
                    └──────┬───────┘
                           ▼
                    ┌──────────────┐         ┌───────────┐
                    │ App Servers   │───────▶│   Cache    │ (Redis: shortCode → longUrl)
                    └──────┬───────┘         └───────────┘
                           ▼
                    ┌──────────────┐
                    │  Database     │ (shortCode, longUrl, createdAt, clickCount)
                    └──────────────┘
```

**Write flow** (`POST /shorten`): App server → ID generator se unique id lo → Base62 encode karo → DB mein save karo → response do.

**Read flow** (`GET /{shortCode}`): App server → **pehle Cache check karo** (read-heavy hai, isliye [cache-aside](../00-fundamentals/04-caching.md) yahan critical hai) → miss ho toh DB se lo, cache mein daal do → `longUrl` pe **301/302 redirect** bhejo.

> ⚠️ **301 vs 302 — interview mein poocha jata hai**: `301` (permanent redirect) browser **cache kar leta hai**, matlab agle click pe seedha browser redirect kar dega, tumhare server tak request aayegi hi nahi — analytics/click-count track nahi kar paoge. `302` (temporary) har baar server tak aayega — click tracking ke liye `302` use karo, chahe thoda extra load ho.

## Database Schema (simple)

```
urls table:
  short_code (PRIMARY KEY, indexed)
  long_url
  created_at
  click_count
```

`short_code` pe index (ya PRIMARY KEY khud hi index deta hai) — lookup O(log n) ya better ho jata hai.

## Extensibility — interview mein bolne wali baatein
- "Analytics detailed chahiye (kaun, kaha se click kiya) toh click events ko [message queue](../00-fundamentals/06-message-queues.md) mein daal dunga, ek alag analytics service async process karegi — write path slow nahi hoga."
- "Scale bahut badh jaye toh DB ko [shard](../00-fundamentals/05-databases.md) kar dunga `short_code` ke hash pe, [consistent hashing](../00-fundamentals/08-consistent-hashing.md) use karke."

Agla: [02-rate-limiter.md](02-rate-limiter.md)
