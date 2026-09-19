# Case Study 7: Video Streaming Platform (YouTube jaisa)

## Interview mein aise approach karo

**Clarifying questions:**
- Upload aur watch dono flows design karne hain?
- Alag-alag devices/network speeds handle karni hain (mobile 3G se lekar fast WiFi tak)?
- Live streaming bhi chahiye ya sirf recorded videos?

**Assume**: Recorded videos (live streaming ek alag, harder problem hai), upload + watch dono, sabhi network speeds support karni hain.

**Sabse bada insight**: Upload aur Watch, **do bilkul alag flows** hain jinki
requirements alag hain — Upload mein thoda delay chalta hai (processing time
lagta hai), Watch mein **turant, buffer-free** playback chahiye.

## Upload Flow — heavy processing, async hona chahiye

```
User uploads video ──▶ App Server ──▶ Raw video → Blob Storage (S3-jaisa)
                                    ──▶ Message Queue: "naya video aaya, process karo"
                                            │
                                            ▼
                                    Transcoding Workers
                                    (video ko multiple resolutions/formats mein convert karte hain)
                                            │
                                            ▼
                                    Processed videos → Blob Storage → CDN pe distribute
                                            │
                                            ▼
                                    Metadata DB update: "video ready hai, ab watchable hai"
```

**Trick — kyu transcoding zaroori hai**: Ek hi video ko **multiple
resolutions** (144p, 360p, 720p, 1080p, 4K) mein convert karna padta hai,
kyunki alag users ke paas alag network speed/device hai. Ye **CPU-heavy,
time-lagne wala kaam** hai — isliye upload ke response mein turant nahi
karte, [Message Queue](../00-fundamentals/06-message-queues.md) mein daal
ke background workers se karwate hain. User ko turant "upload successful,
processing ho raha hai" bol dete hain.

## Watch Flow — chunking + Adaptive Bitrate Streaming

**Trick — poora video ek file mein nahi bhejte**: Video ko chhote-chhote
**chunks** (jaise 2-10 second ke tukdon) mein baant diya jata hai. Player
in chunks ko **ek-ek karke** download karta hai — isse:
1. Video **turant play** hona shuru ho jata hai (poora file download hone ka wait nahi)
2. **Adaptive Bitrate Streaming (ABR)** possible hoti hai

**ABR ka matlab**: Player **real-time** dekhta hai user ka network kaisa hai
— agar slow hai, agla chunk **low resolution** mein maango; fast hai toh
**high resolution** mein. Isliye buffering kam hoti hai — quality user ke
current network ke hisaab se **dynamically badalti rehti hai**.

```
Network fast hai   → agla chunk 1080p mein download karo
Network slow ho gaya → agla chunk 360p mein download karo (seamlessly switch)
```

Ye HLS (HTTP Live Streaming) ya DASH jaise standard protocols isi ke liye
bane hain — har resolution ke chunks alag se ready rakhe jate hain, player
choose karta hai.

## CDN — video streaming ka backbone

Poora video content **CDN** pe hota hai (yaad karo [CDN notes](../00-fundamentals/07-cdn-and-proxies.md)) —
Mumbai ka user Mumbai ke nearest edge server se video chunks paayega, US
tak jaane ki zarurat nahi. Isse latency bahut kam ho jati hai aur origin
server pe load bhi nahi padta.

```
User (India) ──▶ CDN Edge (India) ──▶ [cache miss hone pe] ──▶ Origin Storage (kahi bhi ho)
                       ↑
              99% requests yahi se serve hoti hain
```

## Metadata vs Content — alag storage strategy

**Trick**: 2 tarah ka data hai, dono ke liye alag database use karo:
- **Video content (binary, bahut bada)** → Blob/Object storage (S3-jaisa) + CDN
- **Metadata (title, description, views, likes, comments)** → normal Database (SQL/NoSQL)

Video ko database mein seedha store karna galat approach hai — databases
bade binary blobs ke liye optimize nahi hote.

## Views/Likes count — high write volume ka handling

Har video view pe DB mein `UPDATE views = views + 1` karna **bahut zyada
writes** create karega popular videos pe (millions/second). **Trick**:
Views ko turant DB mein mat likho — [Message Queue](../00-fundamentals/06-message-queues.md)
mein events daalo ("video X ko view mila"), phir ek background job **batch
mein** (jaise har 10 second mein) counts ko aggregate karke DB update kare.

## Extensibility — interview mein bolne wali baatein
- "Live streaming add karni ho toh chunking ka concept same rahega, bas chunks **real-time generate** honge (recorded pehle se ban chuke nahi honge) — latency requirement bahut tight ho jayegi."
- "Recommendation system chahiye ho toh watch-history events ko alag se capture karke ek ML pipeline ko feed karunga, video-serving path ko isse impact nahi hone dunga."

Agla: [08-ride-sharing.md](08-ride-sharing.md)
