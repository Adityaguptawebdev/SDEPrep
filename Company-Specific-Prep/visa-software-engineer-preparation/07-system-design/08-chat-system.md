# SD 8 — Chat System (1:1 and small groups)

> **Visa evidence**: **not found in any Visa interview report** we collected (2021–2026). Included because you asked for it and because it exercises WebSockets, ordering and fan-out — ideas that also appear in the reported "live visitor count" question ([11 — mini designs](11-mini-designs-asked-at-0-2-yoe.md)). Priority: **low** compared with TinyURL, rate limiter, payments and your own project. Generic note: [HLD chat application](../../../HLD/02-problems/03-chat-application.md).

**Easy analogy — hostel ka post-box + intercom**: Online ho toh **intercom** (WebSocket) pe turant baat; offline ho toh letter **post-box** (message store) mein pada rehta hai aur jab lautoge tab milega. Har chitthi pe **number** (sequence) — taaki order gadbad na ho.

### Requirements (clarify first)
- 1:1 and group chat (groups ≤ 500)? Text only or media? Read receipts, typing indicators, online status?
- Scale assumption: 10M daily users, 50 messages/user/day → ~6,000 messages/sec average.
- Message history kept forever? End-to-end encryption required?

### Functional Requirements
- Send/receive messages in real time; deliver to offline users later (push notification + sync on reconnect).
- Conversation history with pagination; delivered/read receipts; online/last-seen presence.

### Non-functional Requirements
- Low latency (< 200 ms delivery when both online), **no message loss**, **per-conversation ordering**, high availability.

### APIs
```
 WebSocket  wss://chat.example/ws          (auth with a token on connect)
   client → {"type":"send","clientMsgId":"c-123","conversationId":"cv9","body":"hi"}
   server → {"type":"ack","clientMsgId":"c-123","messageId":"m-88","seq":1042}
   server → {"type":"message","conversationId":"cv9","seq":1042,"from":"u1","body":"hi"}
   client → {"type":"read","conversationId":"cv9","upToSeq":1042}
 REST       GET /api/v1/conversations/{id}/messages?beforeSeq=1042&limit=50     (history, keyset paging)
```

### High-level architecture
```
 clients ══WebSocket══► Chat gateway nodes (hold connections; user→node map in Redis)
                              │ send
                              ▼
                        Message service ── assigns per-conversation seq, stores ──► Message DB
                              │                                                  (partition = conversationId)
                              ▼
                         Kafka "messages" (key = conversationId → ordered per conversation)
                              │
                 Fan-out workers: for each member → online? route to their gateway node
                                                    offline? → push notification service
 Presence service (heartbeats in Redis with TTL) · Media → object storage + CDN (message holds only the URL)
```

### Components
- **Gateway**: WebSocket termination, heartbeats, routes messages to/from users.
- **Message service**: validates membership, dedupes by `clientMsgId`, assigns `seq`, persists, publishes.
- **Fan-out workers**, **push service** (APNs/FCM), **presence service**, **history API**.

### Database schema
```
 conversation(id PK, type ENUM(DIRECT,GROUP), created_at)
 member(conversation_id, user_id, joined_at, last_read_seq, PRIMARY KEY(conversation_id, user_id))
 message(conversation_id, seq, message_id, sender_id, body, created_at,
         PRIMARY KEY (conversation_id, seq))      -- wide-column (Cassandra) partitioned by conversation
 user_conversations(user_id, last_activity_at, conversation_id)   -- inbox list, sorted by activity
```
A wide-column store fits: huge write volume, reads are "latest N messages of one conversation".

### Cache
- Recent messages per active conversation, user→gateway-node map, presence (Redis with TTL).

### Queue
- Kafka partitioned by `conversationId` → preserves order; consumers fan out. Offline pushes via a separate queue.

### Scaling
- Gateways scale horizontally (each holds ~50–100k connections); message DB scales by conversation partitioning.
- Large groups: fan-out on read for very big channels instead of writing to every member.

### Load balancing
- L4/L7 LB for WebSocket with sticky sessions (a connection stays on its node); reconnect → any node, then resync from the last seq.

### Failure handling
- Gateway node dies → clients reconnect elsewhere and fetch messages after their last seen `seq`.
- Client resends after a timeout → server dedupes by `clientMsgId` → no duplicates.
- Push provider down → retry queue; the message is safe in the DB anyway.

### Consistency
- Per-conversation total order via `seq` (assigned by one owner per conversation or a DB counter); across conversations no global order needed.
- Read receipts and presence are eventually consistent.

### Concurrency
- Two members send at the same time → the single sequencer for that conversation orders them; clients display by `seq`, not by local time.

### Security
- Token-authenticated WebSockets, membership checks on every send, rate limits against spam, TLS; E2E encryption (Signal protocol) if required — then the server stores only ciphertext.

### Monitoring
- Delivery latency, messages/sec, connection counts per node, reconnect rate, Kafka lag, push failure rate.

### Trade-offs
- WebSocket (real-time, stateful connections) vs long polling / SSE (simpler, less efficient).
- Fan-out on write (fast reads) vs on read (cheap writes for huge groups).
- Wide-column (scale) vs SQL (simpler queries, harder to scale writes).

### What an interviewer might ask next
1. "How do you guarantee ordering?" → per-conversation sequence + partition by conversation.
2. "User is offline for a week" → messages in DB, push notification, sync by last seq on reconnect.
3. "How do you know which server a user is connected to?" → user→node map in Redis, or pub/sub per user.
4. "Show 'typing…'" → ephemeral events over WebSocket, never stored.

**🗣️ Interview mein aise bolo**: "Real-time ke liye WebSocket gateway, har conversation ka apna sequence number taaki order sahi rahe, Kafka mein conversationId key se partitioning, aur offline users ke liye DB + push. Client ki message id se dedupe, taaki retry pe double message na jaaye."

Next: [SD 9 — Cache with TTL →](09-cache-with-ttl.md)
