# Message Queues & Async Processing

> **Standard definition**: A component that stores messages produced by one service (producer) until they are retrieved and processed by another service (consumer), enabling asynchronous, decoupled communication between services.

**Ek line mein**: Ek kaam jo **turant complete hone ki zarurat nahi** hai,
usse ek "queue" mein daal do aur user ko turant response de do — kaam
background mein baad mein ho jayega.

**Yaad rakhne ka trick**: **"Restaurant ka KOT (Kitchen Order Ticket)"** —
waiter order leke turant customer ko khana nahi de deta, wo order ki slip
kitchen ki queue mein laga deta hai aur customer ko bol deta hai "ban raha
hai". Waiter (aur customer) ko wait nahi karna padta kitchen khali hone tak.

## Problem jo ye solve karta hai

```
❌ Bina Queue ke (Synchronous):
User signup karta hai → Welcome email bhejo → DB save karo → Analytics update karo → response do
   (agar email bhejne mein 3 second lage, user 3 second wait karega — bekaar)

✅ Queue ke saath (Asynchronous):
User signup karta hai → DB save karo → response TURANT do ("Signup successful!")
                       → "send_welcome_email" task Queue mein daal do
                       → background worker fursat se email bhejega
```

## Kaise kaam karta hai — Producer/Consumer

```
┌───────────┐        ┌──────────┐        ┌────────────┐
│ Producer   │──────▶│  Queue    │──────▶│  Consumer   │
│ (App Server)│       │ (Kafka/   │       │  (Worker)   │
│            │       │ RabbitMQ) │       │             │
└───────────┘        └──────────┘        └────────────┘
```

- **Producer** — jo task banata hai aur queue mein daalta hai (jaise "email bhejo")
- **Queue** — tasks ko store karta hai jab tak koi consumer unhe utha na le
- **Consumer/Worker** — queue se tasks utha ke actual kaam karta hai

**Trick**: Producer aur Consumer ek dusre se **completely decoupled** hain
— Producer ko fark nahi padta consumer kab kaam karega, kitne consumers
hain. Agar load badh jaye, bas **aur consumers** add kar do (horizontal scaling).

## Queue vs Pub-Sub — fark samjho

| | Queue (1-to-1) | Pub-Sub (1-to-many) |
|---|---|---|
| Kaun consume karega | Sirf **ek** consumer message uthayega | **Sabhi** subscribers ko message milega |
| Example | Order processing (ek hi worker process karega) | "New video uploaded" — sabko notify karna hai (email service, notification service, analytics service) |
| Trick | "Task ek baar hi hona chahiye" | "Sabko pata hona chahiye" — [Observer pattern](../../LLD/02-design-patterns/behavioral/02-observer.md) ka distributed version hai ye |

## Kab use karo (interview signal)

- Kaam **turant zaroori nahi** hai (email, notification, report generation, thumbnail creation)
- Traffic mein **spikes** aate hain aur unhe **smooth** karna hai (jaise flash sale — sab orders ek saath queue mein aayenge, workers apni speed se process karenge, koi order miss/crash nahi hoga)
- Services ko **decouple** karna hai (Order service ko Payment service ke slow hone se affect nahi hona chahiye)

> 💡 **Interview mein bolne wali line**: *"Email/notification bhejna user
> ke response path mein nahi hona chahiye — main isse queue mein daal
> dunga taaki user ko turant response mile aur peak traffic mein bhi
> system responsive rahe."*

## Trade-off jo bolna zaroori hai
- Async ka matlab hai user ko **turant confirmation nahi** milta ki final kaam ho gaya (jaise email actually gaya ya nahi) — **eventual completion** hoti hai, immediate nahi.
- Queue khud bhi ek **extra component** hai jise maintain karna padega (aur failure point ban sakta hai agar redundancy na ho).

Agla: [07-cdn-and-proxies.md](07-cdn-and-proxies.md)
