# Research Findings — What Real Visa Candidates Reported

> **What this file is**: the evidence base for the whole guide. Every interview experience used in the other notes is listed here with its date, level, location and link.
> **Research date**: 25 Sep 2026. **Focus**: Visa Software Engineer / SDE-1, India (Bengaluru), 0–2 years of experience, 2024–2026.

---

## 1. Executive summary (read this first)

**Seedhi baat** — Visa ka early-career SWE interview "LeetCode grinding" se zyada **"do you really understand what you built?"** check karta hai. DSA zaroori hai, par log sabse zyada **resume deep-dive** aur **HM round** mein fail hote hain.

| # | Finding | Evidence strength |
|---|---|---|
| 1 | Off-campus SWE / SDE-1 candidates in India almost always start with a **CodeSignal OA: 4 questions, ~70 minutes, proctored**, scored out of 600. Difficulty ramps Easy → Easy/Medium → Medium (implementation-heavy) → Medium-Hard/Hard. | HIGH (15+ reports, 2024–2026) |
| 2 | After the OA, the usual path is **2 technical rounds + 1 Hiring Manager (HM) round**. Some candidates got 1 technical round, some got an extra team-fit round, and some did all rounds **in person on one day** at the Bengaluru office. *Visa's process varies by team, requisition and hiring cycle.* | HIGH |
| 3 | **Resume / project deep-dive is the most consistent part** of every technical and HM round (often 30–40 minutes). Two candidates say they were rejected mainly because of weak project answers. | HIGH |
| 4 | Each technical round usually has **one or two DSA questions, mostly LeetCode Medium**. Repeated families: House Robber (3 reports), binary search on answer (3), k-th largest / heap (5), tree level-order (3), BFS on grid/graph (3), sliding window (4). | HIGH for families, LOW for most exact questions |
| 5 | For Java roles, **core Java + Spring Boot theory** is asked even at 1 YOE: HashMap internals, OOP pillars, interface vs abstract class, static vs instance, Spring annotations, DI/IoC, `@Transactional`, filters, DispatcherServlet, AuthN vs AuthZ. | HIGH |
| 6 | **At least one SQL query** shows up in many early-career reports (GROUP BY/HAVING, duplicates, second-highest salary, schema design + count query). | HIGH |
| 7 | **System design at 0–2 YOE is practical and small**: design TinyURL, an order-delivery schema + APIs, "how would you build a new microservice (DB, async, cache)?", "draw your current project's architecture and scale it". Big distributed-systems HLD (multi-datacenter payments) was reported only for Senior/Staff. | MEDIUM |
| 8 | **HM round = behavioral + ownership**: challenging situation, disagreement, collaboration, ownership, "why Visa". Visa's official **Leadership Principles** appear in interview agendas. | HIGH |
| 9 | **GenAI / AI coding tools** is a new recurring topic in 2025–2026 (opinion on GenAI, which AI tools you use, GenAI discussion rounds) — 3 early-career + 2 senior reports. Visa's current Bengaluru SWE job post asks for "digital fluency" with GenAI tools. | HIGH |
| 10 | If your resume has **React**, expect React/JS questions (hooks, lifecycle, error handling, `fetch`, auth headers), even for a Java-backend-leaning role. | HIGH (when React is on the resume) |
| 11 | HR timelines are often slow: many candidates waited 1–3 weeks after the HM round; some were never updated. A full OA score does **not** guarantee an interview call. | HIGH |

---

## 2. How the research was done

1. **LeetCode Discuss** — pulled every post matching "visa" through LeetCode's public GraphQL API (833 posts), filtered out immigration "visa" posts (462 left), then read **all 291 posts from 2024–2026** plus the relevant 2021–2023 ones. OA screenshots attached to posts were opened and read (they contain exact CodeSignal problem statements).
2. **GeeksforGeeks** — 9 Visa experience articles (2024–2025).
3. **Jointaro** — 9 Visa Bengaluru experience pages.
4. **Blind**, **devbrainiac**, **codingkaro** (aggregator) — used only where they add something new or confirm LeetCode reports.
5. **Official Visa sources** — current Bengaluru job descriptions (Visa's Workday careers site), Visa Leadership Principles page, Visa technology pages, Visa FY2025 10-K.
6. **Could not access** (blocked for automated tools): Reddit, Glassdoor review pages, Medium, Naukri Code360, AmbitionBox. Where only a search-result excerpt was visible, it is marked "excerpt" and given LOW weight.

**Frequency labels used everywhere in this guide**

| Label | Meaning |
|---|---|
| **HIGH** | appears in **3 or more independent** candidate reports |
| **MEDIUM** | appears in **2** independent reports |
| **LOW** | a single (isolated) report |

"Independent" = different candidates. Reposts of the same experience (for example a blog that copies a LeetCode post) are counted once.

**Level tags**: `EC` = early career (0–2 YOE, the target of this guide) · `NCG` = new college grad / on-campus · `INT` = intern · `SR` = Senior (2.5–6 YOE) · `STAFF` = Staff (6+ YOE) · `?` = not stated.

---

## 3. Group A — Early-career SWE / SDE-1, India (highest weight)

| ID | Posted | Level / background | Location & mode | What was asked (short) | Result |
|---|---|---|---|---|---|
| [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) | Jun 2025 (rounds 20–26 May 2025) | EC · 10 months at a product startup, NIT 2024 | Bangalore, virtual | OA: CodeSignal 4Q (E, M, M-H, H). T1: resume + Kafka "why/alternatives/trade-offs"; **rate-limit IPs from a log file (x requests / 10 min)**, DDoS, follow-up "log file is GBs" → external sort. T2: resume/architecture; **Aggressive Cows variant** (binary search on answer). HM: resume + system design on Excalidraw, scalability trade-offs, behavioral (collaboration, ownership, decisions). | Selected |
| [LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/) | Feb 2026 (Dec 2025–Feb 2026) | EC · 10 months, product-based ([LC-7555653](https://leetcode.com/discuss/post/7555653/visa-swe-offer-by-anonymous_user-tyzs/)) | India, virtual | Applied to Performance Engg, re-routed to dev. R1: **search in rotated sorted array**. R2: API-fetching coding, system design question, behavioral. Dev rounds: **Word Break**; GenAI + system design basics + **Number of Islands**; GenAI + **max non-adjacent coins (House Robber) → circular follow-up (House Robber II)**. HR collected documents + govt ID. | Offer |
| [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) | Apr 2025 | EC · 1 YOE startup, tier-2 ([LC-6659683](https://leetcode.com/discuss/post/6659683/visa-inc-software-engineer-by-anonymous_-923f/)) | Bengaluru, virtual | OA 75 min 4Q (array, queue, matrix, graph). T1: **Number of Matching Subsequences**; SQL vs NoSQL; microservices; **Filters in Spring Boot**; **AuthN vs AuthZ**; `super()` and heap vs stack. T2: **House Robber II**; React lifecycle; error handling in React; **DispatcherServlet**; "how would you build a new microservice (DB, async, cache)". HM: projects + behavior. | Selected |
| [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) | Apr 2025 | EC · 1.7 YOE, SAP Labs, Angular + Spring Boot | India | 4 rounds (DSA, resume + design concepts, HM, extra team round). Extra round: Java 17 features, **streams filter/sort**, Comparator + lambda, Map types, **HashMap internals + collisions + treeification**, Spring Boot version, **DI + benefits**, singleton, **prototype bean inside singleton**, DBs used, **SQL count by gender**, **longest common prefix → longest common substring**, challenge faced, monotonous work, staying updated, **opinion on GenAI**. | Selected |
| [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) | Jun 2025 | EC · 1.10 YOE, MNC, tier-2 | India | R1: **Longest Substring Without Repeating Characters**, **Letter Combinations of a Phone Number**. R2 (agenda: "Coding Quality, Engineering Fundamentals, Collaborate as OneVisa/Execute"): Spring annotations (`@Controller`, `@Service`, `@Transactional`), autowiring, **SQL vs NoSQL**, vertical vs horizontal scaling, pass by value vs reference, static vs non-static, **2-Sum, 3-Sum (expected O(n²))**, **SQL: students per dept with CGPA > 9**, **find duplicate rows**. | Rejected |
| [LC-6772395](https://leetcode.com/discuss/post/6772395/visa-virtual-interview-se-1-by-anonymous-plas/) | May 2025 | EC · 1.10 YOE, SDE-1 | Virtual | OA: 2 easy, 1 medium-hard, 1 hard. T1: **graph of strings (last letter → first letter), detect a cycle**. T2 (same day): **reconstruct a journey from source→destination city pairs**. HM: behavioral, learning & growth. | ? |
| [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) | May 2025 | EC · "6 months – 1.5 years" band, off-campus (written by the candidate's teacher) | In person, same day | OA 4Q / 90 min (arrays/stack/strings, a simulation, pattern search). R2: DBMS tied to work, greedy + sorting where you implement **merge sort from scratch** with dry run, OOP design choices, **custom stack with encapsulation**. R3: data processing with **Maps + PriorityQueue**, **SQL across two tables + optimize**, map/set intersection. R4 (tech + HM): predict output of code (threads, memory, polymorphism), a **cyclic data-structure** problem, 2 behavioral (decisions, ethics). | Selected |
| [LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/) | Feb 2025 | EC · 1.5 YOE, SWE-I | Onsite, pen & paper | OA 70 min: easy array, **next shuttle bus (HH:MM)**, **spiral matrix**, array/list. T1: project architecture **React → Spring Boot → DB**, caching/Kafka/DB improvements, **live count of users on a page without refresh**. T2: **Word Ladder (true/false)**, **count pairs a+b=n in O(1)**, **two-team elimination winner in O(1)**. | ? |
| [LC-7330669](https://leetcode.com/discuss/post/7330669/my-visa-interview-experience-by-suppi242-47kv/) | Nov 2025 | ? (Java developer) | ? | OA 4Q easy–medium. T1: project role/stack/challenges + 2 coding (arrays, strings) + core Java. T2: DSA (arrays, strings, logic) + project. HM: problem solving, teamwork, ownership, **motivation to join Visa, alignment with values**. | Selected |
| [LC-8466059](https://leetcode.com/discuss/post/8466059/visa-software-engineer-interview-experie-f5lw/) | Aug 2026 | ? | India | OA 3Q. T1: DSA + current work. T2: **system design with deep follow-ups** (architecture, DB choice, scalability, APIs, trade-offs). HM/Director: 4–5 behavioral — **challenging situation, difficult situation, collaboration, disagreements, ownership**. | Waiting |
| [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/) | Oct 2025 | EC · 1.5 YOE Java backend | Bangalore, MS Teams | OA CodeSignal 4Q (E, E-M, M, H). R2: **medium graph (BFS)**, Java fundamentals, Spring Boot basics, **Singleton**, OOP. R3: string DSA + **TinyURL design end-to-end** (scaling, DB choice, schema), query optimization. HM: ownership, microservices, behavioral. | Selected |
| [GFG-SWE-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer/) | Jul 2025 | EC · 2 YOE (Java, Spring, AWS, K8s) | Bangalore, in person, same day | R1: palindrome check, **k-th min/max using heap**, two-pointer + sorting, OOP pillars with real examples, array vs linked list, overloading vs overriding. R2: `==` vs `equals`, String vs StringBuilder, `public static void main` explained, why `main` can't be overridden, Docker vs Kubernetes. HM: **CI/CD flow on whiteboard**, strength, obstacles, why Visa. CodeSignal given after interviews. | Rejected |
| [JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/) | Sep 2024 | ? | Bengaluru | OA 4 DSA / 70 min (matrix, array). T: **"write the API call from your project (pseudocode)"**, OS processes/multithreading, TCP vs UDP. Rejected — candidate blames weak resume answers. | Rejected |
| [JT-2025-04](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-april-1-2025-no-offer-positive-14930f23/) | Apr 2025 | ? | Bengaluru | OA on HackerEarth. T: 2 medium DSA. Techno-managerial: system design, resume, team preference. HR. | No offer |
| [JT-2025-05](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-may-8-2025-no-offer-neutral-dc30770b/) | May 2025 | ? | Bengaluru | CodeSignal 4Q (3 easy–medium, 1 medium–hard): arrays, math logic, 2D arrays, stack; score /1200. | OA only |
| [JT-2025-11](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-karnataka-november-17-2025-no-offer-positive-a80c80fc/) | Nov 2025 | ? | Bengaluru | CodeSignal + 2 technical rounds; topic: **file parsing and file manipulation**. | No offer |
| [JT-2024-10](https://www.jointaro.com/interviews/companies/visa/experiences/software-developer-bengaluru-october-1-2024-no-offer-positive-6df1bf4d/) | Oct 2024 | ? (Software Developer) | Bengaluru | R1: DBMS, 1 easy DSA, 1 SQL. R2: 4 DSA (trees, sliding window); **first & second largest without sorting**. R3 managerial: project, **data-integrity strategies in the backend**. | No offer |
| [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/) | Mar 2025 | ? | ? | OA 4Q (2 easy, 2 "ugly implementation" + Trie). R1: Spring annotations; **DB design: datacenters → servers → microservices; SQL: microservices per datacenter**; **MST (Kruskal)**. | Rejected |
| [LC-6536057](https://leetcode.com/discuss/post/6536057/visa-interview-experience-ghosted-by-rec-2xye/) | Mar 2025 | ? | ? | I1: **Trapping Rain Water** ("sand and mountains"), **Sliding Window Maximum**. I2: **binary search like Book Allocation**, **House Robber**. | Ghosted |
| [LC-7681976](https://leetcode.com/discuss/post/7681976/visa-software-engineer-bangalore-by-anon-e03t/) | Mar 2026 | ? | Bangalore | OA: 3 DSA (2 easy, 1 hard); 14/15 tests on the hard one; no response after OA. | OA only |

**Hiring-drive evidence (same-day, in-person rounds in Bengaluru)**: "SW Engineer (6–18 months experience)" onsite on **31 May 2025** ([LC-6843657](https://leetcode.com/discuss/post/6843657/visa-sw-engineer-6-18-months-experience-tcd7s/), [LC-6826327](https://leetcode.com/discuss/post/6826327/visa-sw-engineer-6-18-months-experience-898d2/), [LC-6822095](https://leetcode.com/discuss/post/6822095/visa-software-engineer-banglore-by-anony-0n91/), [.NET 0.6–1.5 yrs: LC-6796286](https://leetcode.com/discuss/post/6796286/visa-interview-scheduled-for-31-may-any-vprfc/)); onsite days on 8, 15 and 22 March 2025 ([LC-6545714](https://leetcode.com/discuss/post/6545714/visa-off-campus-2025-on-site-8th-marche-z615d/), [LC-6557629](https://leetcode.com/discuss/post/6557629/visa-in-person-interview-15th-march-no-r-57f5/)); a CodeSignal test taken **at the Visa Bangalore office** on a Saturday in Nov 2025 ([LC-7376211](https://leetcode.com/discuss/post/7376211/visa-codesignal-assessment-bangalore-nov-o4nb/)).

---

## 4. Group B — On-campus / New grad / Intern (India)

Different pipeline (campus), but same OA platform and similar fundamentals. Useful for OA patterns and CS basics.

| ID | Posted | Level | What was asked (short) | Result |
|---|---|---|---|---|
| [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) | Sep 2025 | NCG, VIT, Bangalore role | OA CodeSignal 70 min: **substrings of length 3 with a vowel**, **repeatedly remove the smallest peak**, **grid cells unique in their row & column**, a DP problem. T1: LLM project, **React hooks/state/components**, OOP pillars, OS (multiprogramming vs multitasking, deadlock conditions, thrashing). T2: `@SpringBootApplication`, **JWT + refresh token + storage**, **AuthN vs AuthZ**, **abstract class vs interface**, caching + eviction, **LRU cache pseudocode**, Git merge conflicts, **order-delivery system: schema, APIs, SQL monthly order cost**. Lead: AI tools you use, challenging task, **encryption vs hashing**. | Selected |
| [GFG-NG-24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-new-grad-on-campus-2024/) | 2024 | NCG | OA CodeSignal 70 min 4Q: string transform by length parity, **merge equal adjacent digits into their sum until none**, **2D water-flow time per cell**, triplet queries (a−b = b−c). T1: lock toggling after N passes, zigzag level order, N-th largest. T2: REST, Docker, design patterns, diamond problem, **remove chars not in second string**, **validate parentheses without a stack**. T3: monolith vs microservices, SDLC, deadlines vs quality, why Visa. | Selected |
| [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/) | Jan 2024 | NCG | OA CodeSignal: 1 easy array, 2 medium HashMap/HashSet, 1 hard. T1: **print all palindromic substrings**, process vs thread, cloud, why Visa. T2: **OOP modelling: herbivore/carnivore/omnivore**, ACID, normalization, OSI. Lead: **Swiggy architecture**, tech choice, frontend security, performance. | Selected |
| [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/) | Jul 2025 | NCG | OA: 2 array, 1 DP, 1 graph. T: OOP (virtual functions, diamond), DOM, network topologies, SQL PK/FK, arrays vs linked lists. Managerial: Spring Boot, React, MongoDB, heap/priority queue, counterfeit-coin puzzle. HR: payment system improvements. | Not selected |
| [GFG-INT-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineering-internship-2025-oncampus/) | Oct 2025 | INT, NIT | OA CodeSignal 70 min 4Q (12 of ~500 shortlisted). Interview: **bricks (weight, cost) → min cost for ≥100 kg (greedy vs DP)**, **merge sort + complexity**, overloading/overriding, static vs dynamic binding, arrays vs linked lists, **SQL GROUP BY**, threads vs processes. | Selected |
| [LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/) | Feb 2025 | NCG (on-campus) | OA CodeSignal 4Q. R2: ACID, relational vs non-relational, deadlock + prevention, **second largest without built-ins**, **SQL second-highest salary**. R3: **level-order traversal, min depth, Single Number II, sliding window maximum**. R4: project deep-dive — **"how to keep the order of data you send to the DB"** (~30 min). | Rejected (discussion round) |
| [LC-7244496](https://leetcode.com/discuss/post/7244496/hired-by-visa-for-summer-intern-by-martt-tb4g/) | Oct 2025 | INT on-campus | OA CodeSignal 4Q / 70 min (arrays, strings, maps; max LC-medium). Interview 57 min: projects + **count repeated words in a text**. | Selected |
| [JT-INT-Feb25](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineering-intern-bengaluru-february-22-2025-accepted-offer-positive-bdcc762a/) | Feb 2025 | INT | OA 4 DSA; interview: 2 DSA, 1 SQL, 1 math puzzle; "how is Visa handling DeFi/crypto?" | Offer |
| [JT-INT-Sep25](https://www.jointaro.com/interviews/companies/visa/experiences/swe-intern-bengaluru-karnataka-september-1-2025-accepted-offer-positive-188a1562/) | Sep 2025 | INT | C memory functions, OOP, DDL vs DML, SQL vs NoSQL, **composite keys in NoSQL**, **schema change in production**, cursors, SDLC, DSA on strings. | Offer |
| [LC-7085676](https://leetcode.com/discuss/post/7085676/visa-compensation-for-2026-batch-sde-1-b-e92x/) | Aug 2025 | NCG 2026 batch | Campus notice: "Online test (coding round) followed by 3 technical interviews", CGPA ≥ 7, no backlogs. | — |

Older campus reports (2021–2022, HackerRank era) are listed in [sources.md](../sources.md) and used only in the "older format" part of the OA notes.

---

## 5. Group C — OA-only reports (all levels, used for OA patterns)

| ID | Posted | Level | Platform | Questions (as reported) |
|---|---|---|---|---|
| [LC-7317055](https://leetcode.com/discuss/post/7317055/visa-sw-engineer-tier-1-india-on-campus-0q5kc/) | Oct 2025 | NCG, India | "Codility" (as written), 70 min, 4Q | numbers with an odd count of zeros · memory allocator (like LC 2502) · last bus that left + minutes ago (HH:MM) · min abs difference with index gap ≥ x (LC 2817) |
| [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | Apr 2026 | SR | CodeSignal-style, 4Q | bus departure · numbers with odd 0s · allocate memory · "view gap mountain" min gap (same set as LC-7317055) |
| [LC-7382120](https://leetcode.com/discuss/post/7382120/visa-oa-sde1-question-by-anonymous_user-iyvw/) | Nov 2025 | EC (SDE-1) | — | hills: min difference between heights at distance ≥ gap (LC 2817) |
| [LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) | Dec 2025 | SR | CodeSignal 4Q | first index where running score ≥ target · last bus before current time · newspaper paragraphs with `*` border · restore visit order from adjacent pairs (LC 1743) |
| [LC-7335145](https://leetcode.com/discuss/post/7335145/my-visa-codesignal-experience-bangalore-y5xe0/) | Nov 2025 | ? · Bangalore | CodeSignal 4Q | matrix with growing colours · grade from marks · e-scooter distance · state array with `L` / `C<i>` operations |
| [LC-7479591](https://leetcode.com/discuss/post/7479591/visa-oa-ctc31lpa-asked-in-2026-sde-inter-gmrl/) | Jan 2026 | INT/SDE-1 | CodeSignal (screenshot) | state array `L` / `C<i>` (exact statement in screenshot) |
| [LC-7354481](https://leetcode.com/discuss/post/7354481/visa-codesignal-17112025-failed-by-node-pndhb/) | Nov 2025 | ? | CodeSignal | count length-3 substrings with same first & last char · max digital root |
| [LC-7131555](https://leetcode.com/discuss/post/7131555/visa-oa-2-month-sde-intern-by-ishan1o1-y3q9/) | Aug 2025 | INT on-campus | CodeSignal 70 min | sum of elements greater than both neighbours · mission time with two sorted arrays · text justification (centre) · subarrays with ≥ k distinct |
| [LC-7307977](https://leetcode.com/discuss/post/7307977/visa-summer-internship-oa-on-campus-by-k-o1eq/) | Oct 2025 | INT on-campus | CodeSignal 70 min, /600 | hollow square pattern · reverse word if first & last letters are vowels · text justification variant · count alternating-parity subarrays |
| [LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/) | Nov 2025 | EC · **US** | CodeSignal 70 min, proctored | basic · Minimum Refueling Stops (LC 871) · LRU-cache-like · longest common prefix of two number arrays (LC 3043) |
| [LC-3300169](https://leetcode.com/discuss/post/3300169/visa-sse-oa-unique-problem-by-anonymous_-nvdu/) | Mar 2023 | SR | — | longest common prefix between numbers of two arrays (LC 3043) |
| [LC-7232120](https://leetcode.com/discuss/post/7232120/visa-oa-pre-screen-for-new-grad-waca-usa-mpf8/) | Sep 2025 | NCG · **US** | pre-screen | string list transform · recipe-order pattern check · reactor queue with a 10-slot cooling chamber · graph |
| [LC-7561130](https://leetcode.com/discuss/post/7561130/visa-oa-coding-expert-by-anonymous_user-pvbu/) | Feb 2026 | ? | "Coding-Expert", 3Q / 90 min | easy · two lists: count `b[j] > a[i]` without reordering `a` · variation of LC 2484 on a binary string |
| [LC-7568020](https://leetcode.com/discuss/post/7568020/visa-recent-oa-qs-by-anonymous_user-b51z/) | Feb 2026 | NCG | CodeSignal 4Q | topics: array, DP, tree, sliding window, graph |
| [LC-6819912](https://leetcode.com/discuss/post/6819912/visa-online-assessment-by-anonymous_user-pyap/) | Jun 2025 | ? | — | largest square inside a skyline (histogram) |
| [LC-6782864](https://leetcode.com/discuss/post/6782864/visa-ot-questions-by-samarpreneur-celb/) | May 2025 | ? | CodeSignal (screenshot) | falling figure: min obstacles to remove so it reaches the bottom |
| [LC-5630895](https://leetcode.com/discuss/post/5630895/visa-software-engineer-oa-by-anonymous_u-utw6/) | Aug 2024 | ? (SWE) | CodeSignal Q3/4 (screenshot) | earliest meeting slot of given length free for all employees |
| [LC-3946634](https://leetcode.com/discuss/post/3946634/visa-oa-by-ssr0203-njgq/) | Aug 2023 | ? | CodeSignal (screenshots) | e-scooters · bubble explosion + gravity · house segments after demolitions |
| [LC-6900438](https://leetcode.com/discuss/post/6900438/visa-oa-staff-se-blr-by-debmalyapan53-0uib/) | Jun 2025 | STAFF · BLR | CodeSignal 4Q | time-machine years · digit-wise sum of two numbers · subarrays with ≥ k equal pairs · distribution-centre package simulation |
| [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/) | Feb 2026 | SR | CodeSignal 70 min | 2 easy · 1 easy but implementation-heavy · 1 medium **Trie** |
| [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/) | Mar 2025 | ? | CodeSignal | 2 easy · 2 medium (implementation + Trie); advice: attempt in order 1, 2, 4, 3 |
| [LC-7403009](https://leetcode.com/discuss/post/7403009/visa-oa-cutoff-score-rejected-by-prudhvi-cy5e/) | Dec 2025 | ? | 4Q / 70 min | 2 easy (strings, arrays) · 1 easy/medium HashMap · 1 medium/hard; **567/600 → rejected** |
| [LC-7333944](https://leetcode.com/discuss/post/7333944/visa-oa-codesignal-experience-by-anonymo-pcna/) | Nov 2025 | ? | CodeSignal GCA | 2 array/string · 2 implementation-heavy (managing entities, classifications, updates) |
| [LC-7131092](https://leetcode.com/discuss/post/7131092/visa-sr-sw-engineer-java-full-stack-inte-zt7k/) | Aug 2025 | SR | CodeSignal 3Q | 1 array, 2 graph; then technical round: 2 HashMap + 1 linked list |
| [LC-6510481](https://leetcode.com/discuss/post/6510481/visa-inc-code-signal-screening-staff-sof-eran/) | Mar 2025 | STAFF · US | CodeSignal 4Q / 70 min | 2 easy · 2D-matrix islands-like · DP optimization |
| [LC-8404717](https://leetcode.com/discuss/post/8404717/visa-oa-staff-software-engineer-rejected-c0gg/) | Jul 2026 | STAFF | HackerRank 2Q / 90 min | graph like LC 2492 · DP like LC 983 |
| [LC-7435146](https://leetcode.com/discuss/post/7435146/visa-sse-code-signal-by-anonymous_user-mb5c/) | Dec 2025 | SR | CodeSignal 4Q | 3 easy + 1 easy-but-lengthy; **910/1200 raw → 503/600** |

**OA process facts reported by candidates**: proctoring with webcam, mic and screen share ([LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/)); official photo ID needed ([LC-6767451](https://leetcode.com/discuss/post/6767451/visa-online-assessment-id-verification-h-j9ug/)); a **retake offered after "typing pattern irregularities / gaze away from screen" flags** ([LC-7346747](https://leetcode.com/discuss/post/7346747/visa-2nd-oa-by-jethiya_babuchak-l93o/)); **600/600 but no interview call** ([LC-7549059](https://leetcode.com/discuss/post/7549059/visa-oa-criteria-needed-by-harshitha2006-289k/), [LC-7410063](https://leetcode.com/discuss/post/7410063/visa-summer-intern-by-anonymous_user-3q2j/), [LC-7449757](https://leetcode.com/discuss/post/7449757/visa-oa-by-anonymous_user-k2m0/)).

---

## 6. Group D — Experienced candidates (used only for concepts, clearly labelled)

These are **not** your level. They are used only when the same topic also appears for early-career candidates, or when you asked for the topic (for example Top View, Group Anagrams, payment design).

| ID | Posted | Level | Useful topics |
|---|---|---|---|
| [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | Jan 2025 | SR · BLR | Bag of Tokens; email/SMS notifications with interface + **factory**; `@Component/@Service/@Repository`; AuthN/AuthZ in code; JPA rollback; `CompletableFuture`; `@Scheduled`; **multiple cron instances updating the same row**; Kafka; async; **API versioning** |
| [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | Apr 2026 | SR | Spring components, design patterns, JPA, **isolation levels**, **singleton & how it breaks**, decorator, scaling, auth mechanisms, **ShedLock**, LB algorithms, **LRU cache**, **HashMap internals, equals/hashCode**; HLD **rate limiter**; HM: most difficult project, production issues, SDLC (rejected at HM) |
| [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/) | Jan 2026 | SR (Java + React) | **Streams groupingBy**, Map internals, `Map m = new HashMap<>()`, **Product CRUD in Spring**, JPA, **var/let/const**, errors thrown, **fetch with headers & tokens**, **hooks, useState, useEffect, Redux** |
| [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/) | Mar 2026 | STAFF | k-th smallest; reverse linked list except head & tail; IoC, `@ControllerAdvice`, `doFilter`, interceptor, monitors & locks, marker interface, **PUT vs PATCH**, TDD/BDD/DDD, TLS |
| [LC-7535007](https://leetcode.com/discuss/post/7535007/visa-senior-sde-interview-by-anonymous_u-xonj/) | Jan 2026 | SR | add two binary strings; **ConcurrentHashMap** |
| [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/) | Dec 2023 | SR · 3 YOE · BLR | search in rotated array; stock with cooldown; concurrency/consistency; **Spring filters, REST API versioning, `@Transactional`**; SQL views/triggers; **synchronized, ConcurrentHashMap, connection pool**; friendly HM |
| [LC-3682578](https://leetcode.com/discuss/post/3682578/visa-inc-sse-may-2023-offer-by-anonymous-k3yv/) | Jun 2023 | SR · 3 YOE | merge linked lists; **top/left/right view**; min time to complete trips; UPI HLD; HM: shortcomings of your project |
| [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/) | Jun 2024 | SR · full stack | functional interface, default methods, intercept all requests, Spring Security, `@Qualifier`, checked vs unchecked, subset sum k, missing numbers |
| [LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/) | Jun 2022 | SR · 5 YOE | HashMap/TreeMap, fail-fast vs fail-safe, JVM classloaders, immutability, GC, thread pools, string pool, `char[]` for passwords, groupingBy; HM: BookMyShow HLD, write-heavy server |
| [LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/) | Jul 2021 | SR · BLR | static vs instance methods in threads, HashMap Java 8 changes, equals/hashCode, **Group Anagrams**, mirror-tree inorder, **payment service + unique transaction ID**, **BookMyShow LLD with concurrent booking** |
| [LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/) | May 2021 | SR · 7 YOE | **custom cache** code, load balancing, hashing, encryption, sharding, caching, NoSQL |
| [LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/) | Jan 2021 | SR · 6 YOE | **top view of binary tree**; **processing many transaction files in parallel**; feature flag as a safety net |
| [LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/) | Mar 2022 | SR · 3.5 YOE | URL shortener; Splitwise HLD/LLD; HM: "what should I tell my team you're best at?", image-upload API |
| [LC-8286961](https://leetcode.com/discuss/post/8286961/visa-staff-swe-bangalore-interview-exper-j1lc/), [LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/) | 2026 | STAFF · 8.8 YOE | LIS; monolith → microservices; saga; notification system + idempotency; **payment system HLD + LLD (states, methods, retries)**; linked-list intersection; longest substring |
| [LC-7555982](https://leetcode.com/discuss/post/7555982/visa-senior-software-engineer-backend-ai-03h4/) | Feb 2026 | SR · backend + AI | DNS, Kafka, stock I/II, image upload + classification design, Flink vs Spark, **LLM project deep-dive** |
| [LC-6563900](https://leetcode.com/discuss/post/6563900/visa-frontend-interview-senior-by-anonym-slm8/) | Mar 2025 | SR · frontend | React project from scratch, Webpack loaders, transpilers, **React performance**, **callback → Promise → async/await from scratch**, **JS output question** |
| [LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/) | Sep 2025 | STAFF | linked-list cycle; Combination Sum III; Twitter feed; min window substring; security deep-dive (TLS/mTLS) |
| [LC-6599276](https://leetcode.com/discuss/post/6599276/visa-srsw-engineer-bangalore-2025-experi-0e0w/) | Mar 2025 | SR · 3.8 YOE | OA easy → in-office DSA easy → HLD medium → techno-managerial |
| [LC-8220228](https://leetcode.com/discuss/post/8220228/visa-sse-interview-experience-by-prashan-h0d0/) | May 2026 | SR | no coding; event-driven systems, testing, production debugging, CI/CD |

---

## 7. Official Visa sources used

| ID | Source | Used for |
|---|---|---|
| VISA-JD-SWE | [Software Engineer, Bengaluru (REF088484W), posted Sep 2026](https://visa.wd5.myworkdayjobs.com/Visa/job/IN---Bengaluru-India/Software-Engineer_REF088484W) | "Bachelor's degree, OR 6 Months – 2 Years of relevant work experience"; GenAI-tool fluency; ≥ 3 days in office |
| VISA-JD-SSE | [Sr Software Engineer, Java Full Stack, Bengaluru (REF078405W)](https://visa.wd5.myworkdayjobs.com/Visa/job/IN---Bengaluru-India/Sr-Software-Engineer_REF078405W) | what Visa's Technology Organization builds |
| VISA-LP | [Visa Leadership Principles](https://corporate.visa.com/en/about-visa/leadership-principles.html) | HM / behavioral answers |
| VISA-TECH-25 | [Inside Visa's engine of global commerce (29 Oct 2025)](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/inside-visa-global-commerce-engine.html) | scale and reliability facts |
| VISA-TEAM-TECH | [Visa Careers — Technology team](https://corporate.visa.com/en/careers/teams/technology.html) | what the tech team works on |
| VISA-10K-25 | [Visa FY2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1403161/000140316125000089/v-20250930.htm) | transactions, employees |
| VISA-PR-2014 | [Visa selects Bangalore for new technology center (5 Nov 2014)](https://www.visa.co.in/about-visa/newsroom/press-releases/visa-selects-bangalore-as-site-for-new-technology-center.html) | history of the Bengaluru centre |

The complete list (including older and low-weight sources) is in [sources.md](../sources.md).

---

## 8. Honest limitations

- Public reports are **self-reported and incomplete**: many posts say "don't remember the exact question". Where a question is rebuilt from a vague description, the notes say **"Reported variation / reconstructed from candidate experience"**.
- Reports are biased toward people who post on LeetCode (often those who were rejected or anxious).
- Many posts do not state the candidate's level; those are tagged `?`.
- Several OA reports come from Senior/Staff or US candidates. They are used for **OA patterns only** because CodeSignal question banks look shared across levels (the same "bus / odd zeros / memory / min gap" set was reported by an Indian on-campus candidate and by a Senior candidate).
- No source here is internal Visa material; the official sources are public pages.

Next: [Hiring process map →](README.md)
