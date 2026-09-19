# Case Study 5: Notification System

## Interview mein aise approach karo

**Clarifying questions:**
- Kaunse channels — Email, SMS, Push notification, In-app? (multiple honge, confirm karo)
- Kis-kis event pe notification jaana hai — sabhi services (Order, Payment, Chat) trigger karengi?
- Retry chahiye agar delivery fail ho jaye?
- User preferences honge (kaunsa channel chahiye, kaunsa mute hai)?

**Assume**: Multi-channel (Email/SMS/Push), koi bhi internal service trigger kar sakti hai, retry with backoff, user preferences honge.

**Sabse bada insight**: Notification system ko **baaki poore system se decouple** rakhna hai — Order service ko ye nahi pata hona chahiye "SMS kaise bhejte hain", usse bas itna karna hai "notify karo", baaki sab Notification Service ka kaam hai.

## High-Level Design

```
Order Service ──┐
Payment Service ─┼──▶ Message Queue ──▶ Notification Service ──┬──▶ Email Provider (SendGrid)
Chat Service ────┘        (Kafka)              │                ├──▶ SMS Provider (Twilio)
                                                 │                └──▶ Push Provider (FCM/APNs)
                                                 ▼
                                          User Preferences DB
                                          (kaunse channel chahiye)
```

**Trick**: Har internal service, Notification Service ko **seedha call nahi
karti** — wo bas ek event **Message Queue** mein daal deti hai ("order shipped
hua, user 123 ko batao"). Isse [services decoupled](../00-fundamentals/06-message-queues.md)
rehte hain — Notification Service down/slow ho toh Order Service ka flow affect nahi hota.

## Notification Service ke andar ka flow

1. **Queue se event uthao**: `{userId: 123, eventType: "ORDER_SHIPPED", data: {...}}`
2. **User preferences check karo**: DB se dekho user ne kaunse channels enable kiye hain (jaise sirf Email, SMS mute hai)
3. **Template fill karo**: event type ke hisaab se message template lo (jaise "Aapka order {orderId} ship ho gaya hai"), data se fill karo
4. **Har enabled channel ke liye, us channel ka adapter call karo**

## Adapter Pattern — third-party providers ko integrate karna

**Trick yaad karo**: Har provider (SendGrid, Twilio, FCM) ka apna **alag
API/format** hota hai. Hum internal code ko ek **common interface** ke
against likhenge, aur har provider ke liye ek **[Adapter](../../LLD/02-design-patterns/structural/01-adapter.md)** banayenge — bilkul waisa hi jaisa LLD mein "Payment Gateway" ke liye dekha tha.

```java
interface NotificationChannel {
    void send(String userId, String message);
}

class EmailAdapter implements NotificationChannel {
    public void send(String userId, String message) {
        // SendGrid ke specific API format mein convert karke call karo
    }
}

class SmsAdapter implements NotificationChannel {
    public void send(String userId, String message) {
        // Twilio ke specific API format mein convert karke call karo
    }
}
```

**Fayda**: Kal SendGrid se Amazon SES pe switch karna ho, sirf `EmailAdapter`
ke andar ka code badlega — baaki poora Notification Service untouched rahega
(ye [DIP](../../LLD/00-fundamentals/02-solid-principles.md) ka direct application hai).

## Retry & Failure Handling

Third-party providers **fail ho sakte hain** (network issue, rate limit).
**Trick**: Exponential backoff ke saath retry karo — turant retry karne se
provider pe aur load padega agar wo already struggle kar raha hai.

```
Attempt 1: turant
Attempt 2: 1 second baad
Attempt 3: 2 second baad
Attempt 4: 4 second baad
... max retries ke baad → "Dead Letter Queue" mein daal do, alag se investigate karo
```

**Dead Letter Queue (DLQ)**: wo messages jo baar-baar fail hue — inhe alag
queue mein daal do taaki main queue block na ho, aur baad mein manually/alag
se dekha ja sake kya problem hai.

## Idempotency — zaroori gotcha

Agar network issue ki wajah se same event **do baar process** ho jaye
(queue ka retry mechanism khud hi duplicate bhej sakta hai), user ko **do
baar wahi SMS** nahi milni chahiye.

**Fix**: Har event ke saath ek **unique idempotency key** bhejo (jaise
`orderId + eventType`), Notification Service pehle check kare "ye already
process ho chuka hai kya" (ek chhoti "processed_events" table/cache mein) —
agar haan, skip kar do.

## Extensibility — interview mein bolne wali baatein
- "Naya channel (WhatsApp Business API) add karna ho toh bas ek naya `WhatsAppAdapter` banaunga, baaki system same rahega — Adapter pattern isi ke liye hai."
- "High-priority notifications (OTP) ke liye ek alag, high-priority queue rakhunga taaki wo marketing notifications ke peeche queue mein na atke."

Agla: [06-web-crawler.md](06-web-crawler.md)
