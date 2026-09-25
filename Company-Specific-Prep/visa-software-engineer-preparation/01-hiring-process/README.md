# 01 — Visa Hiring Process Map (India / Bengaluru, 0–2 YOE)

> Evidence for every line below is in [research-findings.md](research-findings.md). Source IDs like `LC-6817721` link to the original candidate post.
>
> ⚠️ **Visa's process varies by team, requisition and hiring cycle.** The map below is the *most common* path seen in 2024–2026 reports, not a promise.

**Easy analogy — railway reservation**: Pehle **ticket booking (application)**, phir **chart preparation (shortlisting)**, phir **TTE checking (OA)** — agar ticket valid nahi toh train mein entry hi nahi. Train ke andar **2–3 coaches (technical rounds)** paar karne hain, aur last mein **guard (hiring manager)** decide karta hai ki tum is journey ke liye sahi passenger ho ya nahi.

```
 ┌───────────────┐   ┌───────────────┐   ┌────────────────────┐
 │  Application  │──►│ Resume shortl.│──►│ Online Assessment  │  CodeSignal · 4 Q · ~70 min · proctored
 │ portal/LinkedIn│   │ (recruiter)   │   │  score out of 600  │
 │ /referral     │   └───────────────┘   └─────────┬──────────┘
 └───────────────┘                                 │  1 week … 2 months gap (reported)
                                                   ▼
                    ┌──────────────────────────────────────────────────┐
                    │ Technical Round 1  (45–60 min)                   │
                    │  resume deep-dive + 1–2 DSA + Java/Spring/DB     │
                    └─────────────────────────┬────────────────────────┘
                                              ▼   (sometimes same day)
                    ┌──────────────────────────────────────────────────┐
                    │ Technical Round 2  (45–60 min)                   │
                    │  DSA + concepts + small system design / SQL      │
                    └─────────────────────────┬────────────────────────┘
                                              ▼
                    ┌──────────────────────────────────────────────────┐
                    │ Hiring Manager / Techno-managerial (30–60 min)   │
                    │  project architecture, trade-offs, behavioral    │
                    └─────────────────────────┬────────────────────────┘
                                              ▼
                    ┌──────────────────────────────────────────────────┐
                    │ HR / Offer: documents, compensation, BGV          │
                    └──────────────────────────────────────────────────┘

 Variants seen:  • only 1 technical round + HM (LC-6347920)
                 • extra "team-fit" round for another team (LC-6618617)
                 • all rounds in person on ONE day at the Bengaluru office (31 May 2025 drive, Mar 2025 drives, GFG-SWE-Jul25)
                 • on-campus NCG: "online test + 3 technical interviews" (LC-7085676)
```

---

## Stage 1 — Application

| | |
|---|---|
| **Channels seen** | Visa careers portal (now Workday: `visa.wd5.myworkdayjobs.com`; older posts link SmartRecruiters), LinkedIn apply, referral, recruiter call |
| **Evidence** | LinkedIn → OA link "the very next day" ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)); career portal → recruiter asks current compensation + sends OA ([LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/)); referral ([LC-7131092](https://leetcode.com/discuss/post/7131092/visa-sr-sw-engineer-java-full-stack-inte-zt7k/)) |
| **What the JD asks (official)** | Current Bengaluru "Software Engineer" post: *"Bachelor's degree, OR 6 Months – 2 Years of relevant work experience"*, plus *"digital fluency, including the ability to work with emerging technologies such as Generative AI tools"* and *"at least 3 days in office"* ([VISA-JD-SWE](https://visa.wd5.myworkdayjobs.com/Visa/job/IN---Bengaluru-India/Software-Engineer_REF088484W)) |
| **Prepare** | Match resume keywords to the JD stack (Java, Spring Boot, REST, SQL, React). Apply to titles like "SW Engineer (6–18 months experience)" — this exact band was used for the 31 May 2025 Bengaluru drive ([LC-6843657](https://leetcode.com/discuss/post/6843657/visa-sw-engineer-6-18-months-experience-tcd7s/)). |

## Stage 2 — Resume shortlisting

| | |
|---|---|
| **Duration** | Same day to a few weeks. Some candidates got the OA link the next day. |
| **What Visa appears to check** | Degree + 6–24 months relevant experience (JD), stack match. The real criteria are not public. |
| **Common failure** | Nothing public; many "applied, no response" posts. |
| **Prepare** | 1-page resume, numbers for impact, **only things you can defend for 10 minutes** (the resume becomes the interview script later). |

## Stage 3 — Online Assessment (OA)

| | |
|---|---|
| **Platform** | **CodeSignal** in almost all 2024–2026 India SWE reports. Rare: HackerEarth ([JT-2025-04](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-april-1-2025-no-offer-positive-14930f23/)), HackerRank "Coding – Intermediate/Advanced/Expert" (mostly senior / US roles). |
| **Format** | **4 questions, ~70 minutes** (some reports: 75 or 90 min; a few got 3 questions). Score **out of 600** (raw /1200 shown sometimes, e.g. 910/1200 → 503/600 in [LC-7435146](https://leetcode.com/discuss/post/7435146/visa-sse-code-signal-by-anonymous_user-mb5c/)). |
| **Difficulty** | Q1 easy (arrays/strings/maths) → Q2 easy-medium (HashMap, time strings) → Q3 **implementation-heavy medium** (simulation, text formatting, memory allocator) → Q4 medium-hard (ordered set, graph, DP, Trie). |
| **Proctoring** | Webcam + mic + screen share, official photo ID ([LC-7360983](https://leetcode.com/discuss/post/7360983/visa-oa-sde1-by-anonymous_user-e1t3/), [LC-6767451](https://leetcode.com/discuss/post/6767451/visa-online-assessment-id-verification-h-j9ug/)). Flags like "typing pattern irregularities" led to a forced retake ([LC-7346747](https://leetcode.com/discuss/post/7346747/visa-2nd-oa-by-jethiya_babuchak-l93o/)). |
| **What Visa evaluates** | Correct + fast implementation, edge cases, hidden test cases. |
| **Common failure reasons** | Time lost on the implementation-heavy question ([LC-7418332](https://leetcode.com/discuss/post/7418332/visa-oa-sse-codesignal-by-dlofpgop1j-70n7/) got stuck on padding); TLE on the last question ([LC-7382120](https://leetcode.com/discuss/post/7382120/visa-oa-sde1-question-by-anonymous_user-iyvw/) used `set` instead of `multiset`); score below cutoff even at **567/600** ([LC-7403009](https://leetcode.com/discuss/post/7403009/visa-oa-cutoff-score-rejected-by-prudhvi-cy5e/)). And **600/600 still does not guarantee a call** ([LC-7549059](https://leetcode.com/discuss/post/7549059/visa-oa-criteria-needed-by-harshitha2006-289k/)). |
| **Prepare** | [02-online-assessment](../02-online-assessment/README.md) — reported questions, ranked patterns, 3 mock OAs. |

## Stage 4 — Technical Round 1

| | |
|---|---|
| **Duration / mode** | 45–60 min. Virtual (MS Teams + CodeSignal pad / Excalidraw) or onsite with **pen and paper, no laptop** ([LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/)). |
| **Typical content** | **Resume deep-dive (often 20–40 min)** → 1–2 DSA questions (mostly LC Medium) → Java / Spring Boot / DB / OS questions. |
| **Examples** | Rate-limit IPs from a log file + "what if the file is GBs?" ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)); Number of Matching Subsequences + Filters + AuthN vs AuthZ ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)); Longest Substring + Letter Combinations ([LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)); rotated sorted array ([LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/)). |
| **What Visa evaluates** | Round agenda quoted by a candidate: *"Coding Quality, Engineering Fundamentals, Collaborate as OneVisa/Execute"* ([LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)). Interviewers ask *"why did you use this?"* while you code, and watch naming, loop boundaries, null handling and dry runs ([LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/)). |
| **Common failure reasons** | Sub-optimal answer when optimal was expected (3-Sum in O(n² + n log n) "expected O(n²)", [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)); shaky Java theory; weak answers about your own project ([JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/)). |
| **Prepare** | [03-dsa](../03-dsa/README.md), [04-java](../04-java/README.md), [05-spring-boot](../05-spring-boot/README.md), [10-project-deep-dive](../10-project-deep-dive/README.md). |

## Stage 5 — Technical Round 2

| | |
|---|---|
| **Duration / mode** | 45–70 min; sometimes the **same day** as round 1. |
| **Typical content** | Another DSA question + concepts, and often **one of**: a small system design (TinyURL, "build a new microservice", order-delivery schema + APIs), SQL queries, React questions (if on resume), GenAI discussion. |
| **Examples** | House Robber II + React lifecycle + DispatcherServlet + "new microservice: DB, async, cache" ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)); Aggressive Cows variant ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)); TinyURL end-to-end ([GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/)); Word Ladder + O(1) maths puzzles on paper ([LC-6357478](https://leetcode.com/discuss/post/6357478/visa-swe-i-interview-15-yrs-experience-b-gbb1/)). |
| **Common failure reasons** | Not ready for a harder-than-expected problem (MST with Kruskal, [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/)); design answers without trade-offs. |
| **Prepare** | [07-system-design](../07-system-design/README.md), [06-database-sql](../06-database-sql/README.md), [09-javascript-react](../09-javascript-react/README.md). |

## Stage 6 — Hiring Manager / Techno-managerial

| | |
|---|---|
| **Duration** | 30–60 min |
| **Typical content** | Your current work and **architecture drawn on Excalidraw**, scalability/performance trade-offs, 4–5 behavioral questions (challenging situation, disagreement, collaboration, ownership), **why Visa**, your questions for them. Some HM rounds are fully behavioral ([LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/)); some are technical ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/): "grilled on resume and system design"). |
| **What Visa evaluates** | Ownership, collaboration, decision-making, learning mindset — these map to Visa's official Leadership Principles: *Lead courageously · Obsess about customers · Collaborate as one Visa · Execute with excellence* ([VISA-LP](https://corporate.visa.com/en/about-visa/leadership-principles.html)). |
| **Common failure reasons** | Not preparing behavioral stories — a Senior candidate cleared both technical rounds and was rejected at HM, saying *"wasn't much prepared for this round"* ([LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/)). Losing the thread in a long project discussion ([LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/)). |
| **Prepare** | [11-behavioral](../11-behavioral/README.md), [why Visa](../11-behavioral/01-why-visa-company-and-role.md), [10-project-deep-dive](../10-project-deep-dive/README.md). |

## Stage 7 — HR / Offer

| | |
|---|---|
| **What happens** | HR asks for current payslips / offer letter / company documents to "frame the CTC" ([LC-6826478](https://leetcode.com/discuss/post/6826478/compensation-discussion-offer-at-visa-in-ntjc/)), govt ID ([LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/)); some senior hires also gave professional references ([LC-8397585](https://leetcode.com/discuss/post/8397585/visa-hiring-process-offer-letter-timelin-ojlh/)). |
| **Timeline** | From "positive feedback the next day" ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)) to 2+ weeks of silence after the HM round ([LC-8466059](https://leetcode.com/discuss/post/8466059/visa-software-engineer-interview-experie-f5lw/)). |
| **Reported early-career offers (2025, Bengaluru)** | Base roughly ₹13–19 LPA, ~10% target bonus, RSUs from none up to ~$18–20k vesting 20/20/60 over 3 years (for example [LC-6659683](https://leetcode.com/discuss/post/6659683/visa-inc-software-engineer-by-anonymous_-923f/), [LC-7555653](https://leetcode.com/discuss/post/7555653/visa-swe-offer-by-anonymous_user-tyzs/)). Several candidates said negotiation room was small. Treat these as data points, not a promise. |
| **Prepare** | Keep payslips/offer letters ready, know your notice period (one candidate reports Visa did not accept 90 days), have a researched number. |

---

## Typical timeline (reported)

| Candidate | Timeline |
|---|---|
| [LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/) (10 mo exp) | T1 20 May → T2 22 May → HM 26 May → positive feedback next day |
| [LC-7562552](https://leetcode.com/discuss/post/7562552/visa-swe-interview-experience-by-anonymo-k7t6/) (10 mo exp) | applied 16 Dec → OA cleared 19 Dec → rounds through Jan (re-routed to another team) → offer 4 Feb |
| [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (1 YOE) | OA next day after applying → **interview call two months later** → HR "after a few weeks" |
| [GFG-SWE1-Oct25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-1/) (1.5 YOE) | OA → HR call after 1 week → 3 rounds → selection 3–4 days after HM |

---

## WHAT IS CONSISTENT ACROSS VISA EXPERIENCES vs WHAT VARIES

| Consistent (seen again and again) | Varies (depends on team / cycle) |
|---|---|
| CodeSignal OA with ~4 questions in ~70 min for off-campus SWE | Number of technical rounds: 1, 2 or 3 |
| OA difficulty ramps up; one question is implementation-heavy | Virtual vs **in-person same-day drive** at the Bengaluru office |
| **Resume / project deep-dive in every round** | Whether a system design question appears at 0–2 YOE |
| At least one DSA problem per technical round, mostly LC Medium | Whether SQL is asked as live coding or only as theory |
| Java + Spring Boot theory for Java roles (HashMap, OOP, annotations, DI) | Tech stack of the role: Java, .NET, Golang, Python/GenAI teams all hire "SW Engineer" |
| HM round with behavioral questions + "why Visa" | HackerRank instead of CodeSignal for some roles |
| Slow HR communication after the HM round | Time between OA and interview (1 week to 2 months) |
| Interviewers care about **reasoning and trade-offs**, not only the final answer | An extra team-fit round, or being re-routed to another team (LC-6618617, LC-7562552) |

**🗣️ Interview mein aise socho**: "OA mujhe *interview tak* le jaata hai, DSA mujhe *round clear* karwata hai, par **project + HM** mujhe *offer* dilwata hai."

Next: [02 — Online Assessment →](../02-online-assessment/README.md)
