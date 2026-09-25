# SD 7 — Food Delivery System (Swiggy / Zomato style)

> **Visa evidence**: lead round — "**Swiggy application architecture** discussion covering modules and functionality; frontend/backend/middleware technology selection; frontend security improvements; application performance optimisation" ([GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), new grad, selected) · "**Order delivery system**: database schema for customers and orders; API routes for customer creation, retrieval, order status filtering; SQL for monthly order cost summaries" ([GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), new grad, selected). Frequency: **MEDIUM**. Tested schema + SQL: [DB 2/3 §6](../06-database-sql/02-reported-sql-problems.md#6-order-delivery-system-schema--monthly-order-cost-summary).

**Easy analogy — shaadi ka khaana + dabbawala**: Menu (restaurant catalogue), order (booking), kitchen (restaurant prepares), dabbawala (delivery partner) jo sabse paas hai usse assign karo, aur "dabba kahan pahuncha?" (live tracking).

### Requirements (clarify first)
- Scope for 45 min: browse restaurants near me → order → pay → restaurant accepts → assign delivery partner → live tracking → delivered. (Skip reviews/ads/coupons unless asked.)
- Scale: e.g. 1M orders/day, 10× at dinner peak; 100k active delivery partners sending location every 5 s (~20k updates/sec).

### Functional Requirements
- Customers: search nearby restaurants & menus, cart, place order, pay, track, cancel (rules).
- Restaurants: manage menu/availability, accept/reject orders, mark "ready".
- Delivery partners: go online, receive assignments, update location, mark picked/delivered.
- Notifications at each order status change.

### Non-functional Requirements
- Order placement and payment: **strongly consistent**, never lose or double-charge.
- Search and tracking: low latency, eventually consistent is fine.
- High availability at peak; scalable location ingestion.

### APIs
```
 GET  /api/v1/restaurants?lat=12.97&lng=77.59&radiusKm=5      → nearby restaurants (paged)
 GET  /api/v1/restaurants/{id}/menu
 POST /api/v1/orders          Idempotency-Key: …   {"restaurantId":…,"items":[{"itemId":…,"qty":2}],"addressId":…}
      → 201 {"orderId":…,"status":"PLACED","payable":…}
 GET  /api/v1/customers/{id}/orders?status=DELIVERED&page=0     (the "order status filtering" route)
 POST /api/v1/orders/{id}/cancel
 PATCH /api/v1/orders/{id}/status   {"status":"READY"}           (restaurant / partner apps, role-checked)
 POST /api/v1/partners/{id}/location  {"lat":…,"lng":…,"ts":…}    (every few seconds)
 WS   /ws/orders/{id}/tracking     → pushes partner location + ETA to the customer
```

### High-level architecture
```
 Customer app / Restaurant app / Partner app
                │
         API Gateway (auth, rate limit) ── WebSocket gateway (tracking)
                │
   ┌────────────┼──────────────┬───────────────┬──────────────────┐
   ▼            ▼              ▼               ▼                  ▼
 Catalog/Search  Order svc   Payment svc     Dispatch svc       Location svc
 (Elasticsearch   (SQL,       (idempotent,    (assign nearest    (ingest pings →
  + geo index)    state        gateway calls)  available partner) Redis GEO / in-memory
                  machine)                                        grid, latest position)
                    │  events: OrderPlaced, Paid, Accepted, Ready, PickedUp, Delivered
                    ▼
                 Kafka ──► Notification svc · Analytics · ETA model · Dispatch
```

### Components
- **Catalog/search**: restaurants + menus, geo search (geohash / Redis GEO / Elasticsearch geo queries), cached heavily.
- **Order service**: owns the order state machine `PLACED → PAID → ACCEPTED → PREPARING → READY → PICKED_UP → DELIVERED` (or `CANCELLED`/`REJECTED`).
- **Payment service**: [SD 2](02-payment-service.md) — idempotent charge, refunds on cancellation.
- **Dispatch**: when an order is ACCEPTED/READY, find nearby available partners, offer the job, handle accept/timeout, reassign.
- **Location service**: high-rate location writes; keep only the **latest** position in Redis; history to a time-series store if needed.
- **Notification**: [SD 4](04-notification-system.md).

### Database schema
```
 customer(id PK, name, phone UNIQUE, email)            address(id PK, customer_id FK, lat, lng, text)
 restaurant(id PK, name, lat, lng, geohash, is_open)    menu_item(id PK, restaurant_id FK, name, price_minor, available)
 orders(id PK, customer_id FK, restaurant_id FK, status, total_minor, placed_at, delivered_at)
        idx(customer_id, placed_at), idx(restaurant_id, status)
 order_item(order_id FK, menu_item_id FK, qty, price_minor)   -- price copied at order time
 order_status_history(order_id, status, at, actor)
 delivery(order_id PK, partner_id, assigned_at, picked_at, delivered_at)
 partner(id PK, name, vehicle, status ENUM(OFFLINE, AVAILABLE, BUSY))
 Redis: GEOADD partners:available <lng> <lat> <partnerId>;  HSET partner:{id} lat lng ts
```

### Cache
- Restaurant lists per geohash cell + menus (TTL minutes; invalidate on menu change).
- Latest partner locations in Redis (the source of truth for "where is the partner now").
- Order status for tracking pages (short TTL) — DB remains the source of truth.

### Queue
- Kafka for order events → notifications, dispatch triggers, analytics, ETA.
- Location pings can go through Kafka for history/analytics while the latest value is written straight to Redis.

### Scaling
- Services scale independently; order DB sharded by city/region or customer id at large scale.
- Location ingestion: partition by partner id; downsample; batch writes.
- Peak hours: autoscale on CPU/queue lag; pre-warm caches before dinner.

### Load balancing
- LB per service; WebSocket gateway with sticky connections (connection lives on one node; publish updates via Redis pub/sub or Kafka to whichever node holds it).

### Failure handling
- Payment succeeded but order write failed → outbox/idempotency so the order is created exactly once; else auto-refund via reconciliation.
- No partner accepts within N seconds → widen the radius / add incentive / notify the customer.
- Partner app offline mid-delivery → last known location + support flow; don't lose the order state.

### Consistency
- Order + payment: strong (transactions, state machine, idempotency).
- Search results, ETAs, locations: eventual (seconds-old data is fine).

### Concurrency
- Two dispatch workers offering the same partner two orders → atomically move partner `AVAILABLE → BUSY` (conditional update / Redis `SETNX` lock).
- Cancel vs "restaurant accepted" at the same moment → conditional state update; the loser gets a conflict and the UI refreshes.
- Stock of a popular item → decrement with a guard (`available_qty >= qty`).

### Security
- Role-based APIs (customer vs restaurant vs partner); partners can only update their own deliveries.
- Hide customer phone numbers (masked calling); tokenized payments; rate limit order creation; validate prices server-side (never trust client totals).
- Frontend security (asked in the lead round): HTTPS, httpOnly cookies, XSS-safe rendering, CSP, no secrets in the app bundle.

### Monitoring
- Orders/min, payment success rate, time-to-accept, time-to-assign, delivery time vs ETA, cancellation rate, location ingest lag, WebSocket connection counts.

### Trade-offs
- Push assignment (system picks a partner) vs broadcast (first to accept) — speed vs fairness.
- Redis GEO (simple, fast) vs specialised geo services (quadtrees, H3) at huge scale.
- Microservices per domain (independent scaling) vs a modular monolith early on.

### What a Visa interviewer might ask next
1. "Give me the schema and the APIs for customers and orders" (reported) → above + tested SQL in [DB 2/3 §6](../06-database-sql/02-reported-sql-problems.md#6-order-delivery-system-schema--monthly-order-cost-summary).
2. "Write SQL for each customer's monthly order cost" (reported) → same link.
3. "How do you find the nearest delivery partner?" → geo index + availability + atomic claim.
4. "Customer pays but the restaurant rejects" → refund flow via events, idempotent.
5. "Which frontend/backend/middleware would you choose and why?" (reported) → e.g. React + Spring Boot + Kafka + PostgreSQL + Redis, with one reason each.

**🗣️ Interview mein aise bolo**: "Order service ek state machine hai aur payment ke saath strongly consistent; search, location aur ETA eventually consistent chalte hain. Nearest partner Redis GEO se, assign karte waqt atomic claim taaki ek partner ko do order na mil jaayein."

Next: [SD 8 — Chat system →](08-chat-system.md)
