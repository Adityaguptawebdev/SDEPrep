# Consistent Hashing

> **Standard definition**: A distributed hashing technique that maps both data and servers onto a fixed hash space (conceptually a ring), so that adding or removing a server only remaps a small, bounded fraction of keys instead of the whole dataset.

Ye topic sabse zyada "smart" lagta hai jab interview mein use ho — but concept
samajhna aasan hai agar pehle **problem** clearly dekh lo.

## Problem: Simple hashing (modulo) kyu fail hota hai

Socho 3 cache servers hain, aur decide kiya "kaunse server pe kaunsa data
jayega" — simple formula: `server = hash(key) % numberOfServers`.

```
hash("user123") % 3 = 1  → Server 1
hash("user456") % 3 = 2  → Server 2
```

**Ab problem**: Ek server **crash** ho gaya, ya ek naya server add karna hai
— ab `numberOfServers` **3 se 4 ho gaya**. Formula badal gaya:

```
hash("user123") % 4 = 3  → Server 3 (pehle Server 1 pe tha!)
hash("user456") % 4 = 0  → Server 0 (pehle Server 2 pe tha!)
```

**Trick samjhne ki**: `% N` mein `N` badalte hi, **lagbhag saari keys ka
mapping badal jata hai** — matlab **poore cache ka data invalid ho jayega**,
sab kuch DB se dobara load karna padega. Ek server add/remove karne ka itna
bada cost — ye hi problem hai jo Consistent Hashing solve karta hai.

## Solution: Hash Ring

**Analogy**: Ek **gol ghadi (clock)** socho, 0 se 360 degree tak. Servers ko
bhi is ghadi pe kahi-kahi jagah pe rakh do (unke naam ka hash le ke). Har
`key` ko bhi ghadi pe ek jagah milti hai (uska hash). Rule simple hai:

**"Key ki jagah se ghadi ki suiyon ki tarah CLOCKWISE ghumo, jo pehla server mile, wahi is key ka owner hai."**

```
                    Server A (position 40)
                   ╱
                  ╱
    key "abc" (30)     
         │  clockwise ghumo →  Server A (40) milega, ye owner hai
         │
Server C (300)                    Server B (150)
```

**Sabse bada fayda — server add/remove karne pe kya hota hai:**

Agar ek naya **Server D** ghadi pe position 35 pe add ho jaye — sirf wo
keys affect hongi jo **(Server C ke baad se) 35 tak** thi (jo pehle Server A
ko jaati thi). **Baaki saari keys ka mapping bilkul waisa hi rehta hai.**

**Trick yaad rakhne ka**: *"Simple hashing mein ek server badalne se SAB
KUCH reshuffle hota hai. Consistent hashing mein sirf usके 'paas-paas' ki
keys reshuffle hoti hain — baaki sab jagah-tagah wahi ki wahi rehti hain."*

## Virtual Nodes — ek zaroori refinement

Problem: agar sirf 3 servers hain aur unki position ghadi pe randomly gir
gayi (jaise sab paas-paas), **data evenly nahi bantega** — ek server ka
region bahut bada ho sakta hai.

**Fix**: Har physical server ko ghadi pe **multiple jagah (virtual nodes)**
represent karo — jaise Server A ko `A1, A2, A3...A100` jagah pe daal do
(alag-alag hash se). Isse distribution **statistically even** ho jata hai,
chahe physical servers kam hi kyu na hon.

**Trick**: "Ek server ki jagah, uske 100 chhote-chhote 'clones' ghadi pe
bikhere hue hain — isse load evenly bantne ka chance badh jata hai."

## Kaha use hota hai (interview mein bolne ke liye)

- **Distributed caches** (Redis Cluster, Memcached) — servers add/remove hone pe minimum cache invalidation
- **Database sharding** — kis shard pe konsa data jayega decide karne ke liye
- **Load balancers** — kis backend server ko request bhejni hai
- **CDNs** — kaunsa edge server kis content ko serve karega

> 💡 **Interview mein bolne wali line**: *"Cache servers add/remove hote
> rahenge scaling ke liye, isliye simple modulo hashing use karunga toh
> har baar poora cache invalidate ho jayega. Consistent hashing use karke
> sirf minimal data hi reshuffle hoga."*

---

## Fundamentals ho gaye — ab kya?

Ye 8 concepts (Scalability, Latency/Throughput/CAP, Load Balancing, Caching,
Databases, Message Queues, CDN/Proxies, Consistent Hashing) hi HLD ke **building
blocks** hain — har system design problem inhi ko alag combination mein use
karta hai.

Agla: [../01-how-to-approach-any-problem.md](../01-how-to-approach-any-problem.md)
