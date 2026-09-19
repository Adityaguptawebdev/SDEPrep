# Case Study 10: Search Autocomplete / Typeahead (Google search bar jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- Suggestions kitni fast chahiye (ye pura problem hi **latency** ke around hai — har keystroke pe response chahiye, <100ms)
- Suggestions personalized honi chahiye (user-specific) ya sabke liye same (global popularity)?
- Data kitni frequently update hota hai (naye trending searches)?

**Assume**: Global popularity-based (personalization scope se bahar), <100ms latency zaroori, data daily update hota hai (real-time nahi).

**Sabse bada insight**: User jab "ube" type karta hai, system ko **"ube" se
shuru hone wali sabse popular queries** chahiye, **turant**. Ye ek **"prefix
search"** problem hai — aur prefix search ke liye best data structure hai **Trie**.

## Trie (Prefix Tree) — kaise kaam karta hai

**Analogy**: Ek **dictionary ka index** jaisa socho jaha har letter ek "branch"
hai. "Uber", "Ubuntu", "Uber Eats" — sab "U-B" tak same path share karte
hain, phir alag ho jate hain.

![Trie / prefix tree — words sharing a common prefix share the same path from the root](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)
*Public domain diagram (Wikimedia Commons) — root se neeche jaate hue, har node ek character represent karta hai; common prefix wale words same path share karte hain.*

```
        root
        /
       u
       │
       b
      / \
     e   u
     │    \
     r    n
    / \    \
  (end) e   t
        │    \
     (Eats)   u
```

**Trick**: Prefix `"ub"` type karte hi, Trie mein seedha `u → b` node tak
pahunch jao (**O(length of prefix)**, bahut fast) — us node ke **saare
neeche wale words** hi possible suggestions hain. Poori dictionary scan
karne ki zarurat nahi.

## Problem: Sirf Trie kaafi nahi — Top-K chahiye, sabhi nahi

`"a"` type karte hi lakhon words match ho sakte hain — sabko return karna
bekaar hai, sirf **top 5-10 most popular** chahiye. Har baar us node ke
neeche **poora subtree traverse** karke sort karna — **slow** hoga, especially
short prefixes (`"a"`, `"th"`) ke liye jinke neeche bahut zyada words hain.

## Solution: Precompute Top-K at each node

**Trick**: Har Trie node pe, uske neeche ki **top 5-10 most popular queries
already precomputed, sorted** rakh do — turant serve karo, koi runtime
computation nahi.

```
Node "ub" ke andar precomputed:
  ["uber", "ubuntu", "uber eats", "uber driver", "uber ipo"]  (already sorted by popularity)
```

**Query time**: sirf `"ub"` node dhoondo (O(prefix length)) → uski
precomputed list return kar do. **Bahut fast, <100ms easily.**

**Trade-off jo bolna zaroori hai**: Ye precomputed list **real-time update
nahi hoti** — agar koi query achanak trending ho jaye (breaking news), turant
top mein nahi aayegi. Isliye ye system **eventually consistent** hai — data
periodically (jaise roz raat mein) recompute hota hai search logs se.

## High-Level Design

```
Write path (offline, batch job — roz chalta hai):
  Search Logs (crores queries/din) → Aggregation Job (count frequency per query)
                                    → Trie Builder (naya Trie banao, top-K precompute karo har node pe)
                                    → naya Trie, Trie Servers pe deploy karo

Read path (real-time, user type karte waqt):
  User types "ub" → Load Balancer → Trie Service → precomputed top-K return
```

**Trick**: Write aur Read path **completely alag** hain — Write path **slow,
batch, offline** hai (crores logs process karta hai), Read path **fast,
real-time** hai (bas precomputed data padhta hai). Ye do bilkul alag
requirements hain isliye alag design kiye gaye hain.

## Scale ka handling — Trie itna bada ho gaya ki ek machine mein fit nahi

**Trick**: Trie ko **first character** ke hisaab se **shard** kar do — jaise
"a-m" wale words ek server pe, "n-z" wale doosre pe. Query aane pe, sirf
uska first character dekh ke sahi server ko route kar do.

## Extensibility — interview mein bolne wali baatein
- "Personalization chahiye ho toh global Trie ke saath-saath user ki apni recent search history se bhi kuch suggestions merge karunga — do sources combine karke final list banegi."
- "Real-time trending queries chahiye (breaking news) ho toh Trie update ka cycle roz se ghata ke har ghante/real-time-stream-based kar dunga, trade-off hai freshness vs compute cost ka."

---

## Sab 10 HLD case studies ho gaye

Ab tumhare paas: HLD fundamentals (8 building blocks) + interview framework
+ 10 solved case studies (URL Shortener, Rate Limiter, Chat App, News Feed,
Notification System, Web Crawler, Video Streaming, Ride Sharing, Distributed
ID Generator, Search Autocomplete). Padh lo, phir khud ek naya problem
(jaise "Design Dropbox" ya "Design Twitter") try karna — [framework](../01-how-to-approach-any-problem.md) use karke.
