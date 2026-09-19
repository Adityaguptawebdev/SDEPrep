# Load Balancing

> **Standard definition**: A component that distributes incoming network traffic across multiple backend servers to ensure no single server is overwhelmed, improving availability and reliability.

**Ek line mein**: Ek "traffic police" jo incoming requests ko multiple
servers ke beech **baant** deta hai, taaki koi ek server overload na ho
aur agar ek server down ho jaye toh requests automatically doosre pe chali jayein.

**Yaad rakhne ka trick**: **"Restaurant ka host/manager"** — jab customers
aate hain, host decide karta hai kaunse table/waiter ko bhejna hai, taaki
ek waiter pe sara load na aa jaye aur sab customers jaldi serve ho.

```
                    ┌──────────────┐
   Users ────────▶  │ Load Balancer │
                    └──────┬───────┘
                 ┌─────────┼─────────┐
                 ▼         ▼         ▼
            Server 1   Server 2   Server 3
```

## Load balancing algorithms — trick se yaad karo

| Algorithm | Kaise decide karta hai | Trick |
|---|---|---|
| **Round Robin** | Bari-bari se, 1→2→3→1→2→3... | "Line mein lagke bari se" |
| **Least Connections** | Jis server pe sabse kam active requests hain, wahi bhejo | "Sabse khaali table pe bhejo" |
| **Weighted Round Robin** | Powerful server ko zyada requests | "Bada waiter zyada tables sambhal sakta hai" |
| **IP Hash** | Same user hamesha same server pe jaye (consistent) | "Regular customer ka fix waiter" |

**IP Hash kab zaroori hai — trick**: agar server **stateful** hai (jaise
session data uski local memory mein hai — [scalability basics](01-scalability-basics.md)
wala concept yaad karo), toh us user ki har request **wahi server** pe
jaani chahiye, warna session mil hi nahi payega. Isse **"sticky session"**
bhi kehte hain.

## Health Checks — load balancer ka doosra important kaam

Load balancer periodically har server ko poochta rehta hai *"tu zinda hai?"*
(health check ping). Jo server jawab na de, use **traffic bhejna band** kar
deta hai — isse ek crash hua server pura system nahi girata.

```
LB → Server1: "/health" → 200 OK    ✅ traffic bhejta rahega
LB → Server2: "/health" → timeout   ❌ traffic bhejna rok diya
```

## Layer 4 vs Layer 7 (interview mein poocha ja sakta hai)

- **Layer 4 (Transport layer)**: Sirf IP/Port dekh ke route karta hai, fast hai, andar ka content nahi dekhta.
- **Layer 7 (Application layer)**: HTTP headers, URL path bhi dekh sakta hai — jaise `/api/images` ko ek server pe, `/api/videos` ko doosre pe bhej sakta hai. Thoda slow hai (zyada info process karta hai) par flexible hai.

> 💡 **Interview mein bolne wali line**: *"Main Layer 7 load balancer use
> karunga kyunki mujhe path-based routing chahiye — image requests ko
> ek dedicated image-service pe route karna hai."*

## Single point of failure na ho jaye — load balancer khud bhi

**Trick**: Agar sirf **ek hi** load balancer hai, toh wahi crash ho gaya toh
**pura system down**! Isliye real systems mein **2+ load balancers** hote
hain (active-passive ya active-active), aur DNS ya ek aur chhota mechanism
unke beech decide karta hai.

## Kaha use hota hai HLD problems mein
- Har badi system design problem (URL Shortener, Chat App, News Feed) mein
  load balancer **pehla box** hota hai jo diagram mein banega, users aur
  application servers ke beech.

Agla: [04-caching.md](04-caching.md)
