# Case Study 4: News Feed (Instagram/Facebook jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- Feed **chronological** (time ke hisaab se) hai ya **ranked** (algorithm decide karta hai order)?
- Post karne ke baad kitni jaldi followers ki feed mein dikhna chahiye?
- Har user ke kitne followers ho sakte hain (kya "celebrities" bhi hain jinke crores followers hain)?

**Assume**: Chronological feed (ranking ek alag ML problem hai, scope se bahar), thoda delay (few seconds) chalega, celebrities exist karte hain (ye hi is problem ka twist hai).

**Sabse bada design decision**: jab koi post karta hai, uske **saare followers ki feed mein turant daal du (fan-out on write)**, ya **jab follower apni feed khole tab compute karu (fan-out on read)**? Poora interview isi trade-off ke around hai.

## Approach 1: Fan-out on Write (Push model)

Jab User A post karta hai → uske **saare followers ke feed mein** turant
ye post ki entry daal do (ek precomputed list, har user ki apni feed cache mein).

```
User A posts →  for each follower F of A:
                    feedCache[F].push(newPost)   // 🔑 har follower ki feed mein pre-inserted
```

**Fayda**: Follower jab feed khole, seedha **precomputed list padh lo** — bahut fast read.
**Nuksan**: Agar User A ke **1 crore followers** hain (celebrity), ek post karte hi **1 crore writes** karni padengi — bahut slow aur resource-heavy. Isse **"celebrity problem"** kehte hain.

## Approach 2: Fan-out on Read (Pull model)

Kuch precompute nahi karte. Jab User B feed kholta hai, **real-time** uske
saare following users ke recent posts fetch karke **merge + sort** karte hain.

```
User B opens feed → for each user U that B follows:
                        posts += U.recentPosts()
                     sort posts by time, return top N
```

**Fayda**: Post karna **fast** hai (sirf 1 write, apni post table mein).
**Nuksan**: Feed padhna **slow** hai — agar B, 500 logo ko follow karta hai, 500 jagah se data fetch + merge karna padega **har baar** feed khole.

## Solution: Hybrid Approach (interview mein ye batana — "smart" jawab hai)

**Trick**: *"Normal users ke liye Push (fan-out on write), Celebrities ke
liye Pull (fan-out on read) — dono ka best combine karo."*

```
Post karne wala normal user hai (< threshold followers, jaise 10,000)?
    → Fan-out on write: uske followers ki feed cache mein turant daal do

Post karne wala celebrity hai (> threshold followers)?
    → Fan-out mat karo. Uski post sirf uske apne "posts" table mein rahegi.

Jab koi user apni feed khole:
    → Precomputed feed cache padho (normal users ke followed posts already yaha hain)
    → SATH MEIN, jin celebrities ko wo follow karta hai, unki recent posts
      REAL-TIME fetch karke merge kar do
    → Combined result ko time ke hisaab se sort karke dikhao
```

**Isse kya solve hua**: 1 crore followers wale celebrity ki post ke liye
**1 crore writes nahi karni padi** (sirf real-time pull hoga jab koi feed
khole), aur normal users ke liye reads **fast** rahe (already precomputed hai).

## High-Level Design

```
Post karna:
Client → Load Balancer → App Server → Posts DB (persist)
                                    → [agar normal user] Fan-out Service → Message Queue → Feed Cache (per-user)

Feed padhna:
Client → Load Balancer → App Server → Feed Cache (precomputed part)
                                    → + real-time fetch (followed celebrities' posts)
                                    → merge, sort, return
```

**Fan-out ko async karna zaroori hai**: post karte hi followers ki feed
update karna **synchronously** karoge toh post-karne ka response slow ho
jayega. Isliye ye kaam [Message Queue](../00-fundamentals/06-message-queues.md)
mein daal do — background workers fursat se followers ki feed cache update karte rahenge.

## Database & Cache

```
posts table:        post_id, user_id, content, timestamp
followers table:     user_id, follower_id
feed_cache (Redis):  user_id → sorted list of post_ids (precomputed, per-user)
```

`feed_cache` mein **poora post content nahi**, sirf `post_id` references
rakho — actual content `posts table`/CDN se lo. Isse cache chhota rehta hai
aur post edit hone pe sab jagah update nahi karna padta.

## Extensibility — interview mein bolne wali baatein
- "Ranked feed (ML-based) chahiye ho toh fan-out ke time hi ek scoring service call karunga jo decide karega post ko feed mein kaha rakhna hai, sirf chronological order nahi."
- "Threshold (10,000 followers) tune-able rakhunga config se, taaki system real traffic patterns dekh ke adjust ho sake."

Agla: [05-notification-system.md](05-notification-system.md)
