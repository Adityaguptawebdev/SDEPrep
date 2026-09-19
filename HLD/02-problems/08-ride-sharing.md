# Case Study 8: Ride-Sharing App (Uber jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- Sirf "nearest driver dhoondo" chahiye ya poora booking/payment flow bhi?
- Driver ki location kitni frequently update hoti hai?
- Kitne active drivers/riders ek city mein (scale)?

**Assume**: Focus "nearest available drivers dhoondna" pe (is problem ka sabse interesting/unique hissa yehi hai), driver location har 4-5 second mein update hoti hai.

**Sabse bada insight**: Ye ek **geospatial (location-based) search** problem
hai — "is rider ke 3 km ke andar kaunse drivers available hain?" Normal
SQL `WHERE` clause se latitude/longitude compare karna **bahut slow** hai
crores rows pe. Isliye ek **spatial data structure** chahiye.

## Naive approach kyu fail hoti hai

```sql
SELECT * FROM drivers
WHERE latitude BETWEEN x1 AND x2
  AND longitude BETWEEN y1 AND y2;
```
Ye query **poori drivers table scan** karti hai (ya bahut inefficient index
use karti hai) — lakhon drivers pe, har 4-5 second mein (jab bhi koi rider
search kare) ye chalana practically possible nahi hai.

## Solution: Geospatial Indexing — QuadTree ya Geohash

### QuadTree — trick se samjho

**Analogy**: Ek **map ko baar-baar 4 hisso mein baanto** — jab tak har hisse
mein **manageable number of drivers** (jaise max 100) na reh jayein. Jaha
drivers **zyada dense** hain (city center), wahan zyada baar baanto (chhote
squares). Jaha **kam dense** hain (rural area), kam baanto (bade squares).

![Quadtree spatial partitioning — recursively dividing space into four quadrants until each region has few enough points](https://upload.wikimedia.org/wikipedia/commons/a/a0/Quad_tree_bitmap.svg)
*Public domain diagram (Wikimedia Commons) — har square recursively 4 mein tab tak baटता hai jab tak points ek threshold ke andar na aa jayein.*

**Trick**: Ek query aayi "is area ke drivers do" → QuadTree mein seedha us
region ke node tak pahunch jao (tree traversal, **O(log n)**), poori table
scan karne ki zarurat nahi. Jaise-jaise driver move karta hai, use tree mein
uske naye region mein **move** kar do.

### Geohash — alternative approach (simpler, aksar use hota hai)

**Trick**: Latitude+longitude ko ek **single string** mein encode karo
(jaise `tdr1v`), jahan **jitne characters common prefix** honge, utni hi
locations **paas-paas** hain.

```
"tdr1v0" aur "tdr1v2" → same area (bahut paas)
"tdr1v0" aur "9q8yy0" → bilkul alag area (door)
```

**Fayda**: Database mein normal **String prefix search** (`LIKE 'tdr1v%'`)
se hi nearby drivers mil jate hain — koi special spatial data structure
implement nahi karni padti, sirf geohash column pe normal index kaafi hai.
Isi liye interviews mein Geohash, QuadTree se **simpler answer** maana jata hai.

## High-Level Design

```
Driver App ──(location update, har 4-5 sec)──▶ Location Service ──▶ Geospatial Index (Geohash/QuadTree)
                                                                            │
Rider App ──(ride request)──▶ Matching Service ─────────────────────────┘
                                     │
                                     ▼
                            Nearest drivers ki list
                                     │
                                     ▼
                            Notify karo (WebSocket/Push) driver ko
```

**Location Service** ek **high-write** system hai (lakhon drivers, har few
second mein update) — isse **write-optimized store** (jaise Redis, jisme
geospatial commands built-in hote hain — `GEOADD`, `GEORADIUS`) mein rakhte
hain, normal SQL DB mein nahi.

## Matching flow — step by step

1. Rider request karta hai → Matching Service ko rider ki location milti hai
2. Geospatial index se **nearby available drivers** (jaise 3 km radius) fetch karo
3. Filter karo — jo drivers already kisi aur ride mein busy hain, unhe hata do
4. Sabse nearest/best driver ko **request bhejo** (WebSocket se, real-time)
5. Driver accept kare toh **dono ko confirm karo**; reject/timeout ho toh **agle nearest driver ko try karo**

**Trick**: Ye ek chhota sa [Chain of Responsibility](../../LLD/02-design-patterns/behavioral/05-chain-of-responsibility.md)
jaisa flow hai — ek driver "handle" na kare (accept na kare), request agle ko chali jati hai.

## Extensibility — interview mein bolne wali baatein
- "Surge pricing chahiye ho toh ek alag Pricing Service rahegi jo real-time demand/supply ratio (us geohash region ke) dekh ke price multiply karegi — Matching Service ka logic isse untouched rahega."
- "City-scale se desh-scale jaana ho toh Geospatial Index ko region-wise shard kar dunga (jaise har city ka apna index), taaki ek city ka load doosre ko affect na kare."

Agla: [09-distributed-id-generator.md](09-distributed-id-generator.md)
