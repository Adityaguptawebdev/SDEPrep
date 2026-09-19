# High Level Design (HLD) — Notes & Practice

System design notes — how to design systems that serve millions of users,
not just a single machine.

## How this is organized

```
00-fundamentals/                Core building blocks (scalability, caching, DBs, queues, CDN, consistent hashing)
01-how-to-approach-any-problem.md   Universal interview framework
02-problems/                    10 solved case studies (URL Shortener, Rate Limiter, Chat App, etc.)
```

## Progress

### Fundamentals
- [x] [Scalability basics](00-fundamentals/01-scalability-basics.md) — vertical vs horizontal, stateless vs stateful
- [x] [Latency, Throughput, Availability & CAP theorem](00-fundamentals/02-latency-throughput-availability.md)
- [x] [Load Balancing](00-fundamentals/03-load-balancing.md)
- [x] [Caching](00-fundamentals/04-caching.md)
- [x] [Databases — SQL vs NoSQL, Indexing, Replication, Sharding](00-fundamentals/05-databases.md)
- [x] [Message Queues & Async Processing](00-fundamentals/06-message-queues.md)
- [x] [CDN, Forward Proxy & Reverse Proxy](00-fundamentals/07-cdn-and-proxies.md)
- [x] [Consistent Hashing](00-fundamentals/08-consistent-hashing.md)

### Approach
- [x] [How to approach any HLD problem](01-how-to-approach-any-problem.md)

### Problems (case studies)
- [x] [URL Shortener](02-problems/01-url-shortener.md)
- [x] [Rate Limiter](02-problems/02-rate-limiter.md)
- [x] [Chat Application](02-problems/03-chat-application.md)
- [x] [News Feed](02-problems/04-news-feed.md)
- [x] [Notification System](02-problems/05-notification-system.md)
- [x] [Web Crawler](02-problems/06-web-crawler.md)
- [x] [Video Streaming Platform](02-problems/07-video-streaming.md)
- [x] [Ride-Sharing App](02-problems/08-ride-sharing.md)
- [x] [Distributed Unique ID Generator](02-problems/09-distributed-id-generator.md)
- [x] [Search Autocomplete / Typeahead](02-problems/10-search-autocomplete.md)

## Interview approach (short version)

1. **Clarify requirements** — functional + non-functional (scale, latency, consistency)
2. **Back-of-envelope estimation** — traffic, storage, bandwidth (order of magnitude, not exact numbers)
3. **High-level design** — start simple, add components (cache, queue, LB) out loud as you justify them
4. **API design** — 2-3 core endpoints
5. **Deep dive** — wherever the interviewer points
6. **Bottlenecks & trade-offs** — single points of failure, CAP choice

Full version: [01-how-to-approach-any-problem.md](01-how-to-approach-any-problem.md)
