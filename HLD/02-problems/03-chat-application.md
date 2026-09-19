# Case Study 3: Chat Application (WhatsApp jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- 1-to-1 chat ya group chat bhi?
- Online/offline dono users ko message deliver karna hai?
- Message ka status chahiye (sent/delivered/read — blue ticks)?
- Media (images/videos) bhejni hai?

**Assume**: 1-to-1 + group chat, offline delivery bhi chahiye, delivery status chahiye.

**Sabse bada insight jo turant bolna hai**: Normal HTTP request-response
model yaha kaam nahi karega, kyunki **server ko bhi user ko bina maange
message push karna hai** (jab doosra user message bheje). Isliye **persistent
connection** chahiye — ye seedha **WebSocket** yaad dilata hai.

## HTTP vs WebSocket — trick

**Analogy**: HTTP ek **letter bhejna** jaisa hai — tum sawaal bhejte ho,
jawab milta hai, connection band ho jata hai. Har baar naya letter. WebSocket
ek **phone call** jaisa hai — ek baar connect hone ke baad, **line khuli
rehti hai**, dono taraf se kabhi bhi baat ho sakti hai bina naya call lagaye.

**Trick**: Jab bhi requirement mein "**real-time**", "**server se push
karna**", "**live updates**" sunayi de — WebSocket (ya usi jaisi persistent
connection) yaad karo.

## High-Level Design

```
User A ──WebSocket──▶ Chat Server 1 ─┐
                                       │
User B ──WebSocket──▶ Chat Server 2 ─┼──▶ Message Queue / Pub-Sub (Redis Pub-Sub, Kafka)
                                       │
User C ──WebSocket──▶ Chat Server 3 ─┘
                                       │
                                       ▼
                              Message Database (persist messages)
```

**Sabse tricky part — User A aur User B alag Chat Servers se connected hain
toh message kaise pahunche?**

1. User A, "Chat Server 1" se WebSocket connected hai
2. User B, "Chat Server 2" se WebSocket connected hai
3. User A, User B ko message bhejta hai → Chat Server 1 ko milta hai
4. Chat Server 1 ko **nahi pata** User B kaha connected hai — isliye wo
   message ek **shared Pub-Sub system (Redis Pub-Sub/Kafka)** pe publish
   kar deta hai
5. **Sabhi Chat Servers** is pub-sub ko subscribe kiye hote hain — Chat
   Server 2 ko message milta hai, wo apne connected User B ko WebSocket
   se **push** kar deta hai

**Trick**: Ye [Observer pattern](../../LLD/02-design-patterns/behavioral/02-observer.md)
ka hi distributed version hai — Pub-Sub "Subject" hai, saare Chat Servers "Observers" hain.

## Offline user ko message kaise pahunche

Agar User B connected hi nahi hai (offline):
1. Message ko **Database mein persist** kar do (status: "sent, not delivered")
2. **Push notification** bhej do (mobile ka FCM/APNs) taaki user ko pata chale
3. Jab User B online aaye aur connect kare, server uske **undelivered messages** DB se fetch karke bhej de

**Trick yaad rakhne ki**: *"WebSocket sirf 'online' delivery ke liye hai.
'Offline' delivery ke liye hamesha ek Database + Push Notification ka fallback chahiye — WebSocket akela kaafi nahi hai."*

## Message ordering & delivery status (blue ticks)

Har message ko ek **unique, ordered ID** do (timestamp + [Snowflake-style ID](09-distributed-id-generator.md)) taaki messages sahi order mein dikhein, chahe network delay se udhar-idhar pahunche.

Status tracking — ek chhota **state machine** hai (yaad karo [State pattern](../../LLD/02-design-patterns/behavioral/03-state.md)):
```
SENT (server ko mila) → DELIVERED (receiver ke device tak pahuncha) → READ (receiver ne khola)
```
Har transition pe receiver ka device ek **ACK (acknowledgment)** wapas bhejta hai sender ko (via WebSocket/Pub-Sub) — isi se ticks update hote hain.

## Database schema (simplified)

```
messages table:
  message_id (unique, sortable by time)
  sender_id
  chat_id           (1-1 ya group ka identifier)
  content
  status            (SENT / DELIVERED / READ)
  timestamp
```

**Trick**: `chat_id` pe partition/shard karo (na ki `sender_id` pe) — kyunki
ek chat ke saare messages ek jagah honge toh chat history load karna fast rahega.

## Group chat ka extra consideration

Group mein message bhejna matlab **N receivers** ko deliver karna. Do approaches:
- **Fan-out on write**: message bhejte hi, har group member ke liye ek copy bana do — reads fast (ye [News Feed](04-news-feed.md) mein detail se dekhenge, wahi concept hai)
- **Fan-out on read**: ek hi copy store karo, jab member chat khole tab uske liye fetch karo — writes fast, reads thoda slow

> 💡 **Interview mein bolne wali line**: *"Chhote groups (WhatsApp jaisे, ~256 members max) ke liye fan-out on write theek hai — extra storage manageable hai aur reads bahut fast ho jate hain."*

## Extensibility — interview mein bolne wali baatein
- "End-to-end encryption chahiye ho toh keys client-side generate/manage honge, server sirf encrypted blobs store/forward karega, content kabhi nahi dekhega."
- "Scale bahut bada ho (WhatsApp scale) toh Chat Servers ko region-wise deploy karunga, aur user ko [consistent hashing](../00-fundamentals/08-consistent-hashing.md) se nearest/assigned server pe route karunga."

Agla: [04-news-feed.md](04-news-feed.md)
