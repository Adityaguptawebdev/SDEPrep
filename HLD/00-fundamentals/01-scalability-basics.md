# Scalability Basics

HLD interviews LLD se alag isliye hain kyunki yaha sawaal hai **"1 user
ke liye jo design kaam karta hai, wo 10 crore users ke liye kaise kaam
karega"**. Scalability yehi problem solve karti hai.

## Vertical vs Horizontal Scaling

> **Standard definition**: *Vertical scaling (scale-up)* — increasing the capacity of a single machine (more CPU/RAM/disk). *Horizontal scaling (scale-out)* — adding more machines to distribute the load.

**Analogy**: Ek dukaan pe bhीड़ badh gayi.
- **Vertical scaling** = usi dukaan ko bada kar do (zyada counters, zyada staff ek hi building mein). Simple hai, par ek limit ke baad building aur badi nahi ho sakti.
- **Horizontal scaling** = aur dukaanein khol do alag jagah pe. Har dukaan chhoti reh sakti hai, par jitni chahiye utni khol sakte ho — **koi upper limit nahi**.

**Trick**: "Vertical = **ek machine ko bada** karo (more RAM/CPU). Horizontal = **aur machines** jodo."

| | Vertical Scaling | Horizontal Scaling |
|---|---|---|
| Kaise | Server ki RAM/CPU badhao | Aur servers add karo |
| Limit | Hardware ki ek max limit hoti hai | Practically unlimited |
| Complexity | Kam (code change nahi chahiye) | Zyada (load balancer, data sync chahiye) |
| Real example | Ek bada database server | Netflix ke hazaaron servers duniya bhar mein |

> 💡 **Interview mein bolne wali line**: *"Main horizontal scaling choose karunga
> kyunki hume single point of failure avoid karna hai aur traffic grow hone
> pe bas aur servers add kar sakte hain."*

## Stateless vs Stateful servers — horizontal scaling ke liye zaroori concept

> **Standard definition**: A *stateless* server holds no client session data between requests (any server instance can handle any request); a *stateful* server stores session/context data locally, tying a client to that specific instance.

**Analogy**: **Stateful** server ek waiter jaisa hai jo **sirf apne** customer
ko yaad rakhta hai — agar wo waiter chhutti pe chala jaye, uska customer
confuse ho jata hai kisi aur waiter ke paas jaake (usko order history nahi
pata). **Stateless** server aisa hai jaha **koi bhi waiter, kisi bhi customer
ko serve kar sakta hai** kyunki order ki puri detail ek shared jagah (jaise
KOT slip/database) pe likhi hoti hai, waiter ke dimag mein nahi.

**Trick**: Agar server crash ho jaye aur **koi bhi doosra server seedha
uski jagah le sake** bina user ko fark padे — wo **stateless** hai. Yehi
horizontal scaling ko possible banata hai — load balancer kisi bhi request
ko kisi bhi server pe bhej sakta hai.

```
❌ Stateful: User A ki session sirf Server-1 ki memory mein hai
   Server-1 down → User A logout ho jayega

✅ Stateless: User A ki session ek shared Cache/DB (Redis) mein hai
   Koi bhi server (1, 2, ya 3) request handle kar sakta hai, session wahi milegi
```

> 💡 **Interview trick**: Jab bhi design karo, poocho *"agar ye specific server
> crash ho jaye, kya doosra server seedha uski jagah le sakta hai?"* Agar
> nahi, tumne kahi na kahi state server ke andar rakh li hai — usse bahar
> (shared DB/cache/session store) nikaalo.

## Load kaise badhta hai — quick vocabulary

- **DAU/MAU** — Daily/Monthly Active Users, scale samajhne ka pehla number
- **QPS** — Queries Per Second, server pe kitna load aa raha hai
- **Read-heavy vs Write-heavy** — Twitter jaisa system read-heavy hai (log likhne se zyada padhte hain), payment system write-heavy hota hai

Interview mein requirement sunte hi ye vocabulary use karke sawaal poochna
turant "tumhe scale samajh aata hai" wala signal deta hai.

Agla: [02-latency-throughput-availability.md](02-latency-throughput-availability.md)
