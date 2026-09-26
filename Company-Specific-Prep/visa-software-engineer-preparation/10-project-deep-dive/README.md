# 10 — Project / Resume Deep Dive (the round that decides most outcomes)

> **Why this matters most at Visa**: the resume deep-dive took **~30–40 minutes** of rounds for a selected 10-month candidate ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)); one candidate was rejected mainly over weak resume answers ([JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/)); another lost after a 30-minute "keep the order of data" project discussion ([LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/)). Frequency: **HIGH** — it appears in almost every report.
>
> ⚠️ Nothing below invents your work. Replace every **[CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE]** with real facts, numbers and names you can defend.

**Easy analogy — resume = FIR**: Jo likha hai uspe **cross-examination** hogi. Har line ka "kyun, kaise, kitna, aur kya galat ho sakta tha" tayyar rakho. Jo defend nahi kar sakte, woh resume se hata do.

## Questions Visa actually asked about projects

| Asked | Source (level) |
|---|---|
| "Why Kafka? Alternatives? Architecture-level trade-offs" | [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) (EC, selected) |
| "Explain the complete flow from user interaction to DB (React → Spring Boot → DB); caching, Kafka, DB improvements; live user count" | [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) (EC) |
| "Write the API call from your project (pseudocode)" | [JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/) |
| "How can we maintain the order of data we send to the database?" | [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) (NCG) |
| "Data-integrity strategies for backend systems" | [JT-2024-10](https://www.jointaro.com/interviews/companies/visa/experiences/software-developer-bengaluru-october-1-2024-no-offer-positive-6df1bf4d/) |
| "Which Java / Spring Boot version? Which DBs? Is HANA SQL or NoSQL?" | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (EC, selected) |
| "Cron jobs in your project — what frequency and why?" | [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) |
| "Your role, tech stack, challenges and how you handled them" | [LC-7330669](https://leetcode.com/discuss/post/7330669/my-visa-interview-experience-by-suppi242-47kv/), [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/) |
| "Shortcomings of your project; what would you do differently?" | [LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/) (Senior) |
| "Flaws in the current architecture and how you'd restructure it" | [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) (Senior) |
| "If I introduce you to my team, what would I say you're best at?" | [LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/), [LC-1736047](https://leetcode.com/discuss/post/1736047/visa-sr-software-engineer-bangalore-jan-lwgky/) |
| "Explain your LLM/GenAI project workflow; why this framework?" | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/) |
| "Draw one core functionality end to end, then redesign it for 100× scale" | [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/) (Staff), EC version: [SD 11 §4](../07-system-design/11-mini-designs-asked-at-0-2-yoe.md#4-your-project-at-10x-to-100x-scale) |

## Prepare this one-page "project card" first

```
 Product & users:        [CUSTOMIZE] (what it does, who uses it, rough scale: users/day, requests/sec, data size)
 My role & ownership:    [CUSTOMIZE] (features I owned end to end vs contributed to)
 Architecture:           [CUSTOMIZE] React/TS SPA → REST APIs (Node/Express or Spring Boot) → MongoDB/SQL → (cache? queue?)
 Auth:                   [CUSTOMIZE] (JWT/session/SSO, where the token lives, how APIs are protected)
 One flow I can draw:    [CUSTOMIZE] (e.g. "create order": UI → API → validation → DB → response → UI update)
 Numbers I can defend:   [CUSTOMIZE] (e.g. page load 4.1s → 1.8s, API p95 800 → 250 ms, bundle −35%)
 Hardest problem:        [CUSTOMIZE]
 Trade-off I made:       [CUSTOMIZE]
 What I'd change:        [CUSTOMIZE]
```

## The question bank (answer frameworks, not scripts)

### A. What you built

| Question | What they're checking | Answer framework |
|---|---|---|
| What exactly did you build? | clarity, real ownership | problem → users → your feature → how it works → result (with a number) |
| What was **your** contribution vs the team's? | honesty, ownership | "I owned X end to end; I contributed to Y; Z was another team" |
| Walk me through one request end to end | real understanding | draw: UI event → API call (method, URL, headers) → controller → service → DB → response → UI state |
| Write the API call from your project | hands-on skill | `fetch/axios` with headers + token + error handling ([JS §4](../09-javascript-react/01-javascript.md#4-fetch-data-from-an-api--headers-auth-token-timeout-errors-lc-7501159-lc-7562552-jt-2024-09)) and the backend handler |
| How does your frontend talk to the backend? | architecture basics | REST/JSON over HTTPS, API client layer, auth header, error/loading states, CORS |
| How is authentication handled? | security awareness | login → token/session → where stored → how each API checks it → expiry/refresh |

**Follow-ups to expect**: "what happens if the token expires mid-session?", "why that status code?", "where is validation done?"

### B. Why these technologies (never answer "the team already used it" alone)

| Question | Framework |
|---|---|
| Why React? | component model + ecosystem + team skills; what you'd use instead and when (plain server-rendered pages, Next.js for SSR/SEO) |
| Why TypeScript? | catches bugs at compile time, safer refactors, typed API contracts; cost = build step/learning curve |
| Why MongoDB? | document fits the data / changing schema / no multi-table transactions needed — and what you'd move to SQL for money ([DB 3 §13](../06-database-sql/03-nosql-mongodb.md#13-why-mongodb-in-your-project--honest-answer-framework)) |
| Why REST (not GraphQL/gRPC)? | simple, cacheable, tooling; GraphQL when clients need flexible queries; gRPC for internal high-throughput |
| Why Node.js / Spring Boot? | I/O-heavy JSON APIs + one language (Node) vs strong typing, ecosystem, transactions (Spring) |
| Why Kafka / Redis (if on resume)? | the exact problem it solved + alternatives + trade-offs ([Spring 5 §4](../05-spring-boot/05-microservices-and-async.md#4-kafka--why-kafka-alternatives-trade-offs-ec-selected)) |

If a choice was inherited: "It was chosen before I joined; here's why it fits, and here's where it hurts" — that's still a strong answer.

### C. Performance and debugging

| Question | Framework |
|---|---|
| How did you improve performance? | metric before → how you measured (Profiler/Lighthouse/APM) → root cause → fix → metric after [CUSTOMIZE] |
| What happens if the API is slow? | timeouts, loading states, retries for idempotent calls, caching, pagination, debounce; backend: indexes, N+1, caching |
| How did you debug a production issue? | detect (alert/user report) → reproduce/logs with correlation id → mitigate (rollback/flag) → root cause → fix + test + monitoring [CUSTOMIZE] |
| What was the hardest bug? | STAR with technical depth: symptom, wrong first guess, how you narrowed it down, fix, prevention |

### D. Scale, failure, design

| Question | Framework |
|---|---|
| How would you scale your application (10×, 100×)? | layer by layer table in [SD 11 §4](../07-system-design/11-mini-designs-asked-at-0-2-yoe.md#4-your-project-at-10x-to-100x-scale) — measure first |
| What happens if the database goes down? | replicas + automatic failover, retries with backoff, read-only/degraded mode, backups & restore, alerts; what your project actually has [CUSTOMIZE] |
| What if two users update the same record? | optimistic locking (version), conditional updates, last-write-wins risks |
| How do you keep data consistent / ordered? | constraints, transactions, idempotency, sequence numbers ([DB 1 §11](../06-database-sql/01-sql-and-dbms-concepts.md#11-data-integrity-strategies--keeping-write-order-managerial--project-questions)) |
| What would you redesign with more users? | the current bottleneck + the next one; be specific (e.g. move reports to async jobs, add cache for X) |
| What trade-off did you make? | option A vs B, what you chose, what you gave up, would you choose it again |
| What would you change in your architecture? | one honest weakness + a concrete improvement + how you'd roll it out safely |

### E. Working style (often mixed into technical rounds)

| Question | Framework |
|---|---|
| How do you work with backend / QA / product? | API contracts agreed early, mocks, clarifying requirements, demo early, bug triage |
| How do you review code / test? | unit + integration tests, what you test first, a review comment you gave/received [CUSTOMIZE] |
| Which AI tools do you use and how? (asked in 2025–26) | tools + a responsible workflow: you review/test everything, never paste secrets/customer data, it speeds up boilerplate/tests, you still own correctness |

## What interviewers are really evaluating

1. **Ownership** — do you know your system beyond your ticket?
2. **Depth** — can you go 3 "why"s deep on one decision?
3. **Honesty** — "I don't know, but I'd find out by…" beats bluffing.
4. **Trade-off thinking** — every choice has a cost.
5. **Communication** — clear diagram, structured answer, numbers.

**🗣️ Interview mein aise bolo**: "Main ek flow draw karke dikhata hoon — UI se DB tak. Har choice ka reason aur uska cost bataunga, aur jahan mera kaam tha wahan specific numbers ke saath."

Next: [11 — Behavioral / HM →](../11-behavioral/README.md)
