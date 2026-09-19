# Caching

> **Standard definition**: Storing copies of frequently accessed data in a faster-access storage layer (memory) to reduce latency and load on the primary data source.

**Ek line mein**: Baar-baar use hone wala data, **slow storage (database)**
se hata ke **fast storage (memory)** mein rakh do, taaki repeat requests
turant serve ho jayein.

**Yaad rakhne ka trick**: **"Kitchen ka masala rack"** — har baar namak
godown se mangwane ke bajaye, roz-marra ke masale kitchen counter (haath ke
paas, fast access) pe rakhe hote hain. Kabhi-kabhi use hone wali cheez
(saal mein ek baar wali special ingredient) godown (slow, DB) mein hi rehti hai.

## Kaha kaha cache lagta hai (interview mein sab bolne chahiye)

```
Browser Cache → CDN → Load Balancer → App Server Cache → Database Cache (Redis) → Database
   (client)      (geo)                   (in-memory)         (shared)
```

Jitna **request source ke paas** cache lagega, utna fast hoga — par utna
hi **kam shared/consistent** bhi hoga.

## Cache karne ki strategies (kab likha jata hai)

**Trick**: "Read ka pattern alag hai, Write ka pattern alag hai" — dono
ke liye alag decision leni padti hai.

### Cache-Aside (Lazy Loading) — sabse common

```
1. App pehle Cache mein dekhta hai
2. Cache mein nahi mila (MISS) → DB se lo, Cache mein bhi daal do
3. Agli baar wahi data mangoge → Cache mein mil jayega (HIT)
```

**Trick**: *"Pehle cache check karo, na mile toh DB se lao aur cache bhi bhar do"* — ye 90% systems mein use hota hai.

### Write-Through — likhte waqt hi cache update

```
Write request → Cache aur DB dono ek saath update ho jate hain
```
**Trick**: "Jo likha, wahi turant cache mein bhi likha" — consistency zyada hai, par write thoda slow (2 jagah likhna hai).

### Write-Back (Write-Behind) — fast writes, risk ke saath

```
Write request → Sirf Cache update hota hai turant
              → DB baad mein, async, batch mein update hota hai
```
**Trick**: "Pehle likho fast jagah, baad mein asli jagah bhejo" — fast hai
par agar cache crash ho jaye beech mein, **data loss** ho sakta hai (jo
DB tak nahi pahucha).

## Eviction Policy — cache full ho jaye toh kya nikale

**Trick**: **LRU (Least Recently Used)** sabse common hai — jo sabse purane
time se use nahi hua, wo nikal do. (Ye exact wahi hai jo humne
[LLD LRU Cache problem](../../LLD/03-problems/08-lru-cache.md) mein implement
kiya tha — HLD mein concept wahi hai, bas ye ek distributed cache service
[Redis/Memcached] mein already built-in hota hai, tumhe khud implement nahi
karna padta.)

Doosri policies: **LFU** (Least Frequently Used — jo sabse kam baar use hua),
**FIFO** (jo sabse pehle aaya, wahi pehle nikle).

## Cache Invalidation — "sabse hard problem in Computer Science" (famous joke hai ye)

Problem: DB mein data update ho gaya, par Cache mein **purana (stale) data**
reh gaya. Fix karne ke tarike:
- **TTL (Time To Live)**: cache entry ko X seconds baad **automatically expire** kar do
- **Explicit invalidation**: DB update hote hi, code khud cache se us key ko delete kare

> 💡 **Interview mein bolne wali line**: *"Main Cache-Aside use karunga
> read-heavy data ke liye, TTL ke saath — thoda staleness (jaise 30 second
> purana data) is use-case mein acceptable hai, aur isse consistency ka
> complex logic avoid ho jata hai."*

## Kab cache NA lagayein
- Data jo **baar-baar change hota hai** aur **hamesha latest chahiye** (jaise stock price ka live ticker) — yahan cache ulta problem create karega
- Bahut **rarely accessed** data — cache mein jagah waste hogi, benefit nahi milega

Agla: [05-databases.md](05-databases.md)
