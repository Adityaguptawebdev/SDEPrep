# SD 5 — URL Shortener (TinyURL)

> **Visa evidence**: "Tiny URL system design end-to-end — architecture, scaling strategies, database selection, schema design", plus Spring Boot and query optimisation, for a **1.5-YOE Java backend candidate who was selected** ([GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/), Oct 2025, Bangalore) · "System Design — URL shortener" ([LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/), 2022, Senior). Frequency: **MEDIUM** — and the most likely *classic* design at your level. Generic note: [HLD URL shortener](../../../HLD/02-problems/01-url-shortener.md).

**Easy analogy — library ka accession number**: Lamba book title (long URL) ki jagah har book ko ek chhota number (short code) mil jaata hai. Number batao → librarian register (DB/cache) dekh ke seedha shelf (long URL) pe bhej deta hai.

### Requirements (clarify first)
- Create short links; redirect fast. Custom aliases? Expiry? Analytics (click counts)?
- Scale assumption: 100M new links/month (~40/sec writes), **100:1 read:write** (~4,000 redirects/sec, peaks 10×).
- Link lifetime: 5 years → ~6B links → codes of 7 base62 chars (62⁷ ≈ 3.5 trillion) are plenty.

### Functional Requirements
- `POST` long URL → short URL (optionally custom alias, expiry).
- `GET /{code}` → redirect to the long URL (404 if missing/expired).
- Basic analytics: click count per link (async).

### Non-functional Requirements
- Redirect latency p99 < 50 ms; very high availability for reads.
- Codes must be unique and hard to guess if links are private.
- Durable: a created link must never point somewhere else later.

### APIs
```
 POST /api/v1/links   {"longUrl":"https://merchant.example/checkout?id=77","alias":null,"expiresAt":null}
      → 201 {"code":"aZ3kQ9x","shortUrl":"https://vi.sa/aZ3kQ9x"}
 GET  /{code}         → 302 Location: <longUrl>     (301 if you want browsers to cache permanently)
 GET  /api/v1/links/{code}/stats → {"clicks":1234}
```

### High-level architecture
```
 client ─► LB ─► Link service ──write──► ID allocator (counter ranges) ──► base62 code
                     │   │                                                    │
                     │   └──────────────► DB: code → long_url (primary + replicas / KV store)
                     │ read path:  Redis cache (code → url) ──miss──► DB replica
                     └── click event ──► Kafka ──► analytics consumer ──► counts table
```

### Components
- **Link service** (stateless): create + redirect.
- **Code generation** — pick one and say why:

| Option | How | Pros | Cons |
|---|---|---|---|
| **Counter + base62** | unique number (DB sequence / range allocator / Snowflake) → base62 | no collisions, short | sequential codes are guessable (shuffle bits or add a random suffix if private) |
| Hash (MD5/SHA) prefix | hash(longUrl) → first 7 chars | same URL → same code | collisions → check + retry |
| Pre-generated key service | offline pool of random unused codes | fast, random | extra service to run |

```java
class Base62 {
    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    static String encode(long n) {
        if (n == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (n > 0) {
            sb.append(ALPHABET.charAt((int) (n % 62)));
            n /= 62;
        }
        return sb.reverse().toString();
    }

    static long decode(String s) {
        long n = 0;
        for (char c : s.toCharArray()) n = n * 62 + ALPHABET.indexOf(c);
        return n;
    }

    public static void main(String[] args) {
        long id = 3_521_614_606_207L;                 // 62^7 - 1: the largest 7-char code
        System.out.println(encode(125) + " " + encode(id) + " " + decode(encode(id)));
    }
}
```

```text
21 zzzzzzz 3521614606207
```

### Database schema
```
 link(code VARCHAR(10) PK, long_url TEXT NOT NULL, user_id, created_at, expires_at NULL)
 link_stats(code PK, clicks BIGINT, updated_at)
 id_range(name PK, next_start BIGINT)        -- each app instance grabs ranges of 10,000 ids
```
**DB choice** (the EC candidate was asked this): access pattern is a simple **key lookup by code** at huge read volume → a **key-value / wide-column store** (DynamoDB, Cassandra) scales easily; a relational DB with the code as primary key + read replicas + cache is also fine at this scale and simpler to operate. Say the pattern first, then the choice.

### Cache
- Redis `code → long_url` with TTL; hot links stay in cache (80/20 rule). Cache-aside: miss → DB → populate.
- Negative caching for unknown codes (short TTL) to stop repeated DB misses from bots.

### Queue
- Click events → Kafka → analytics consumer (batch increments). Redirect path never waits for analytics.

### Scaling
- Read-heavy → cache + replicas + CDN/edge redirects for the hottest links.
- Writes: range-allocated IDs avoid a hot counter; shard `link` by `code` (hash) when one DB isn't enough.

### Load balancing
- Stateless service behind an L7 LB (round robin / least connections); health checks; multi-AZ.

### Failure handling
- Cache down → fall back to DB (with rate limiting so the DB survives).
- ID range allocator down → instances keep using their current range (buffer of IDs).
- Analytics pipeline down → redirects still work; events buffered in Kafka.

### Consistency
- A code maps to exactly one URL forever (write-once) → cache invalidation is trivial (only on expiry/delete).
- Analytics are eventually consistent (fine).

### Concurrency
- Two users request the same custom alias → insert with PK/unique constraint; the loser gets 409 Conflict.
- Range allocation uses an atomic `UPDATE id_range SET next_start = next_start + 10000 … RETURNING`.

### Security
- Validate URLs (no `javascript:`), scan for phishing/malware, rate limit creation per user/IP.
- Don't use sequential codes for private links (enumeration); use random codes or signed links.

### Monitoring
- Redirect latency p50/p99, cache hit ratio, 404 rate (bots guessing codes), creation rate per user, DB replica lag.

### Trade-offs
- 301 (cacheable, fewer hits, loses analytics) vs 302 (every click tracked).
- Counter (no collisions, guessable) vs random codes (unguessable, needs collision check).
- SQL + cache (simple) vs KV store (scale without sharding work).

### What a Visa interviewer might ask next
1. "Why this database?" → access pattern → KV or SQL + cache, with numbers.
2. "Same long URL twice — same code?" → optional: lookup by URL hash index; costs an extra index.
3. "How do you avoid collisions across many servers?" → range allocation / Snowflake ([SD 3](03-unique-transaction-id-generator.md)).
4. "Expire links" → `expires_at` + TTL in cache + background cleanup.
5. "Optimise the lookup query" (asked with this design) → PK lookup, covering index, cache first.

**🗣️ Interview mein aise bolo**: "Read:write 100:1 hai, toh design read path ke around — Redis cache, DB replicas. Code ke liye unique counter ko base62 karta hoon — 7 characters mein 3.5 trillion codes. Analytics Kafka pe async, taaki redirect fast rahe."

Next: [SD 6 — File processing system →](06-file-processing-system.md)
