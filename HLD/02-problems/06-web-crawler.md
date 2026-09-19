# Case Study 6: Web Crawler (Google jaisa, chhote scale pe)

## Interview mein aise approach karo

**Clarifying questions:**
- Kitne pages crawl karne hain (scale)?
- Sirf HTML chahiye ya images/PDFs bhi?
- "Politeness" chahiye (ek hi website pe bahut zyada requests ek saath na bhejna)?
- Duplicate URLs/content handle karne hain?

**Assume**: Crores of pages, HTML-focused, politeness zaroori hai (warna websites block kar dengi), duplicates avoid karne hain.

**Sabse bada insight**: Crawling ek **graph traversal** hai (BFS) — websites
"nodes" hain, links "edges" hain. Ek page se URLs nikalo, unhe crawl karo,
unse aur URLs nikalo — yehi cycle chalta rehta hai.

## High-Level Design

```
┌───────────────┐     ┌──────────────┐     ┌─────────────┐
│  Seed URLs     │────▶│ URL Frontier │────▶│  Fetcher     │ (page download karta hai)
│ (starting point)│    │  (queue)     │     │  Workers     │
└───────────────┘     └──────────────┘     └──────┬──────┘
                              ▲                     │
                              │                     ▼
                       ┌──────┴──────┐      ┌──────────────┐
                       │ URL Extractor│◀─────│  Parser       │ (naye links nikalta hai)
                       └─────────────┘      └──────┬───────┘
                                                     ▼
                                             ┌──────────────┐
                                             │  Storage      │ (page content save)
                                             └──────────────┘
```

**Flow**: Fetcher ek URL uthata hai Frontier se → page download karta hai →
Parser page ke andar se naye links nikalta hai → un naye links ko wapas
Frontier mein daal diya jata hai (agar pehle crawl nahi hue) → cycle chalta rehta hai.

## URL Frontier — sirf ek simple queue nahi hai

**Trick**: Agar simple FIFO queue use kiya, ek hi website (jaise
`wikipedia.org`) ke hazaaron URLs queue mein lagatar aa sakte hain — Fetcher
Wikipedia ko itni jaldi-jaldi requests bhejega ki wo humein **block kar
degi** (impolite crawling).

**Fix — per-host queues**: Har domain/host ka apna **alag queue** rakho, aur
har host queue ke beech ek **minimum delay** enforce karo (jaise ek hi domain
se 1 request/second se zyada nahi). Ye seedha [Rate Limiter](02-rate-limiter.md)
ka hi concept hai, bas per-domain apply ho raha hai.

```
Frontier internally:
  wikipedia.org queue: [url1, url2, url3, ...]
  amazon.com queue:    [url4, url5, ...]
  ...

Scheduler: har queue se, uske "politeness delay" respect karte hue, URLs nikalta hai
```

## Duplicate Detection — Bloom Filter (interview mein pucha jata hai)

Crores URLs already crawl ho chuke hain, naya URL milte hi check karna hai
"ye pehle crawl hua hai kya?" — agar ek normal `HashSet`/DB mein check karo,
crores entries ke liye **bahut memory** chahiye hogi.

**Trick — Bloom Filter**: Ek **probabilistic data structure** jo bahut **kam
memory** mein "shayad hai" ya "definitely nahi hai" bata sakta hai
(kabhi kabhi **false positive** de sakta hai — bolega "hai" jab actually
nahi hai, par **false negative kabhi nahi deta** — agar bole "nahi hai",
toh pakka nahi hai).

```
URL aaya → BloomFilter.mightContain(url)?
    → "Nahi" mila → definitely naya hai → crawl karo, filter mein add karo
    → "Haan" mila → shayad already crawl ho chuka → (chhota sa chance galat ho, acceptable hai)
```

**Trick yaad rakhne ki**: *"Bloom filter thoda galat bol sakta hai 'ye hai'
jab nahi hai (chhoti si duplicate crawl ho jayegi — acceptable loss), par
kabhi galat nahi bolega 'ye nahi hai' jab actually hai — isliye koi naya URL
miss nahi hoga."* Bahut kam memory mein crores URLs track ho jate hain, isliye HLD mein favorite hai.

## Content Duplicate Detection (same content, alag URL)

Alag URLs ka content **same** ho sakta hai (mirrors, duplicate pages).
**Trick**: Page content ka **hash (checksum)** nikalo, hash ko ek set mein
check karo — agar same hash already hai, content skip kar do (store mat karo
dobara), chahe URL naya ho.

## Politeness aur Priority — dono important hain

- **Politeness**: ek domain ko overwhelm mat karo (upar dekha)
- **Priority**: kuch pages (high PageRank, frequently updated news sites) ko baaki se **pehle** crawl karna chahiye — Frontier ko ek **priority queue** jaisa bhi design kiya ja sakta hai jaha "important" URLs pehle nikalte hain

## Extensibility — interview mein bolne wali baatein
- "Distributed crawling chahiye (multiple machines) toh URLs ko [consistent hashing](../00-fundamentals/08-consistent-hashing.md) se machines mein baant dunga — same domain hamesha same machine crawl kare, isse politeness bhi easy ho jati hai (coordination kam lagta hai)."
- "Robots.txt respect karna hai — har domain ke crawl-rules pehle fetch karke cache kar lunga."

Agla: [07-video-streaming.md](07-video-streaming.md)
