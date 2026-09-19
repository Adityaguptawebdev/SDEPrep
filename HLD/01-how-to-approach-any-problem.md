# Kisi Bhi HLD Problem Ko Interview Mein Kaise Approach Karein

LLD mein hum "class kaise banau" sochte the. HLD mein hum **"lakhon/crodon
users ko ye system kaise serve karega"** sochte hain. Poora interview isi
ek universal framework se solve hota hai.

## Step-by-step (isi order mein, time-boxed)

### 1. Requirements Clarify Karo (5 min)

Do tarah ke requirements poochne hain:

**Functional** — system kya karega:
- "Users kya actions kar sakte hain?" (jaise URL shorten karna, tweet karna)
- "Kaunse features must-have hain is interview ke scope mein?" (poora system mat design karo, interviewer jo bole us pe focus karo)

**Non-functional** — system kaisa hoga (ye HLD mein zyada important hai LLD se):
- Scale: "Kitne users? Kitna traffic (reads/writes per second)?"
- Latency: "Response kitni fast chahiye?"
- Consistency vs Availability: "Strong consistency chahiye ya thoda stale data chalega?" (CAP theorem yaad karo)
- Durability: "Data kabhi lose nahi hona chahiye?"

> 💡 **Trick**: Agar interviewer scale nahi batata, khud reasonable number
> propose karo: *"Main assume karta hoon 10 crore MAU (monthly active users) hain, kya ye theek hai?"* — ye approach dikhata hai tumhe scale ka sense hai.

### 2. Back-of-Envelope Estimation (5 min) — ye HLD ka sabse unique step hai

Yaha rough numbers nikalte hain taaki pata chale **kya challenges aane wale hain**.

**Trick — 4 cheezein estimate karo:**
1. **Traffic (QPS)** — kitne requests/second aayenge
2. **Storage** — kitna data store hoga (roz/mahine/saal mein)
3. **Bandwidth** — kitna data network se guzrega
4. **Memory (cache)** — kitna cache mein rakhna hoga

**Chhota worked example — URL Shortener:**
```
Assume: 10 crore (100 million) naye URLs/mahina banenge

Writes per second:
100,000,000 / (30 din × 24 ghante × 3600 sec) ≈ 40 writes/sec

Reads (assume read:write = 100:1, log likhne se zyada padhte hain):
40 × 100 = 4000 reads/sec

Storage (5 saal ke liye, har entry ~500 bytes):
100,000,000 × 12 × 5 × 500 bytes ≈ 3 TB (5 saal mein)
```

**Trick yaad rakhne ki**: Exact number kabhi nahi chahiye hote — **order of
magnitude** (hazaar hai ya lakh hai ya crore hai) hi kaafi hai. Ye estimation
hi bata degi tumhe: "40 writes/sec toh single DB server bhi handle kar
lega, par 3TB data hai toh storage strategy sochni padegi" — matlab
**estimation hi bata deta hai aage kya design karna hai.**

### 3. High-Level Design — boxes aur arrows

Ab [fundamentals](00-fundamentals/) ke building blocks jodo:

```
Client → Load Balancer → App Servers → Cache → Database
                              │
                              ▼
                        Message Queue → Background Workers
```

**Trick**: Pehle **simplest version** banao (client → server → database),
phir interviewer ke saamne **bolke** add karo: *"Ab read load zyada hai
isliye cache add kar raha hoon"*, *"Ab ek server enough nahi hai isliye
load balancer + multiple servers"*. Ye "socho jaise soch rahe ho" wala
approach dikhana hi asli skill hai — seedha final complex diagram mat
bana do.

### 4. API Design (agar time ho) — chhota sa hissa

2-3 core APIs define karo, poora REST spec nahi chahiye:
```
POST /api/urls        { longUrl } → { shortUrl }
GET  /{shortCode}     → redirect to longUrl
```

### 5. Deep Dive — interviewer jaha bole wahi khodo

Interviewer kahega *"database schema batao"* ya *"cache kaise design
karoge"* — ussi hisse mein zyada detail do. Poora system equally detail
mein mat karo, jaha pucha jaye wahi depth dikhao.

### 6. Bottlenecks & Trade-offs (end mein zaroor bolo)

- "Single point of failure kaha hai? Usko kaise fix karunga?"
- "Ye component agar down ho jaye toh kya hoga?"
- "Consistency vs Availability ka konsa trade-off maine liya hai, aur kyu?"

---

## Common mistake jo har HLD problem mein hoti hai

- **Seedha diagram banana shuru karna** bina requirements/estimation ke — interviewer turant pakad lega.
- **Sab kuch ek hi server pe design karna** — HLD ka poora point hi hai "single machine kaafi nahi hai" wala scenario handle karna.
- **Estimation skip karna** — bina numbers ke tumhe khud nahi pata chalega kaha cache chahiye, kaha sharding chahiye. Numbers hi design ki direction batate hain.
- **Non-functional requirements bhool jana** — sirf "kya feature chahiye" pe focus karna, "kitna scale/latency chahiye" na poochna.

## LLD ke framework se fark — ek line mein

LLD mein depth thi **classes/interfaces/patterns** mein. HLD mein depth hai
**components ke beech data flow, scale, aur trade-offs** mein. Dono jagah
pehla step same hai: **code/diagram se pehle requirements clarify karo.**

---

Ab yehi framework case-study problems pe apply karenge (URL Shortener,
Rate Limiter, Chat App, News Feed, Notification System, waghera) — jab
ready ho batana.
