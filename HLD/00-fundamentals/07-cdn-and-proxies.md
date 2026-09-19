# CDN, Forward Proxy & Reverse Proxy

## CDN (Content Delivery Network)

**Ek line mein**: Static content (images, videos, CSS, JS) ki copies **duniya
bhar ke servers** pe rakh do, taaki user ko **geographically sabse paas
wale server** se milein — origin server (asli server) tak jaana hi na pade.

**Yaad rakhne ka trick**: **"Amazon ke warehouse, alag alag shehar mein"** —
agar Amazon ka ek hi warehouse Delhi mein hota, Bangalore ke order ko
delivery mein bahut time lagta. Isliye har shehar/region mein chhote
warehouses (CDN edge servers) hote hain jaha popular items already rakhe hote hain.

```
User (Mumbai) ──▶ CDN Edge Server (Mumbai) ──▶ [agar miss] ──▶ Origin Server (US)
                        ↑
                   99% requests yahi se serve ho jati hain (fast!)
```

**Trick — kya CDN pe rakhna chahiye**: Jo content **change nahi hota baar
baar aur sabke liye same** hai — images, videos, CSS/JS files, static HTML.
**Personalized/frequently-changing data** (jaise "tumhara current balance") CDN pe nahi jata.

> 💡 Interview mein bolna: *"Profile pictures aur videos CDN pe serve
> karunga — isse latency kam hogi aur origin server pe load bhi ghategi."*
> Ye [caching](04-caching.md) ka hi ek geographically-distributed version hai.

## Forward Proxy vs Reverse Proxy — confusion ka topic

**Trick sabse pehle**: dono hi "beech ka aadmi" hain, fark hai **kiski taraf khade hain**.

### Forward Proxy — client ki taraf se khada hai

**Analogy**: Office mein internet access ek **common gateway** se hota hai
— company ko pata hai employee kya access kar raha hai, par **website ko
pata nahi chalta asli employee kaun hai**, unhe sirf company ka proxy IP dikhta hai.

```
User ──▶ Forward Proxy ──▶ Internet (Website)
(Proxy, USER ki taraf se request kar raha hai — website ko user chhupa hua hai)
```

Use cases: **anonymity** (VPN isi tarah kaam karta hai), company ka content filtering/monitoring.

### Reverse Proxy — server ki taraf se khada hai

**Analogy**: Hotel ka **reception desk** — guest ko sirf reception dikhta
hai, par asal mein alag-alag departments (kitchen, housekeeping) uske order
handle kar rahe hote hain. Guest ko fark nahi padta **andar kaunsa staff
member kaam kar raha hai**.

```
Internet (User) ──▶ Reverse Proxy ──▶ Backend Servers (multiple)
(Proxy, SERVER ki taraf se request receive kar raha hai — user ko backend servers chhupe hue hain)
```

Use cases: **Load balancing** (yehi mechanism [Load Balancer](03-load-balancing.md) ke andar use hota hai!), SSL termination, caching, security (backend IPs chhupe rehte hain).

**Trick yaad rakhne ka final**: *"Forward Proxy = **client ko** chhupata
hai server se. Reverse Proxy = **server ko** chhupata hai client se."*

| | Forward Proxy | Reverse Proxy |
|---|---|---|
| Kiski taraf | Client (user) | Server (backend) |
| Kya chhupata hai | User ki identity | Backend servers ki identity |
| Common tool | VPN, company proxy | Nginx, load balancer |

Agla: [08-consistent-hashing.md](08-consistent-hashing.md)
