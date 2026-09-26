# 12 — Visa Mock Interviews (5 sets)

> Built from the **reported** round formats. Do each with a friend (or record yourself), timed, on paper or a plain editor. Questions marked (R) were reported by Visa candidates; the rest are same-style practice.

**Easy analogy — board exam ke pre-boards**: Asli paper jaisa format, asli time limit. Galti yahan karo, exam mein nahi.

---

## Mock 1 — Online Assessment (70 min)

Use one of the three timed sets in [02-online-assessment/04-mock-oa-sets.md](../02-online-assessment/04-mock-oa-sets.md) (answers: [05](../02-online-assessment/05-mock-oa-answer-key.md)), then re-solve 4 reported ones cold:
1. Bus departures `"HH:MM"` (R, HIGH) · 2. State array `L`/`C<i>` (R) · 3. Newspaper text justification (R, HIGH) · 4. Min difference with index gap ≥ x (R, HIGH).

**Expected depth**: all examples pass, own edge cases tested, Q4 at least brute force.
**Strong performance**: Q1–Q2 in ≤ 20 min, Q3 fully correct formatting, Q4 optimal (TreeSet) or partial; no `int` overflow; attempted in order 1 → 2 → 4 → 3.

---

## Mock 2 — Technical: DSA + Java (60 min)

| Time | Question | Follow-ups | A strong answer covers |
|---|---|---|---|
| 10 min | "Tell me about your current project" (R) | "Draw one API flow", "why this DB?" | a clear flow diagram, your ownership, one number |
| 20 min | Rate-limit IPs from a log: >x requests in 10 min (R) | "What's DDoS?", "log is 20 GB?" | per-IP deque sliding window O(n); clarified format; external sort / hash-partition for big files ([DSA 2](../03-dsa/02-sliding-window-and-rate-limiter.md)) |
| 15 min | Search in rotated sorted array (R) *or* House Robber II (R) | "duplicates?", "print chosen houses" | O(log n) / O(n) with dry run and edge cases |
| 15 min | Java: HashMap internals (R) → equals/hashCode (R) → HashMap vs ConcurrentHashMap (R) → static vs instance (R) | "Java 8 change?", "why no null keys in CHM?" | buckets, spread, treeify at 8 (capacity ≥ 64), resize at 0.75, contract + broken-key example, CAS/bin locks |

**Evaluator checklist**: stated brute force first ☐ · named the pattern ☐ · clean code with good names ☐ · dry run ☐ · complexity ☐ · answered "why did you use this?" confidently ☐.

---

## Mock 3 — Technical: Backend + DB + Spring Boot (60 min)

| Time | Question | Follow-ups | A strong answer covers |
|---|---|---|---|
| 10 min | Spring annotations: `@Component` vs `@Service` vs `@Repository`, `@SpringBootApplication` (R) | "two beans of one interface?" (R) | stereotypes + `@Repository` exception translation; `@Qualifier`/`@Primary`/`Map` injection |
| 10 min | DI/IoC and benefits (R); prototype bean inside a singleton (R) | "are singleton beans thread-safe?" | constructor injection, testability; `ObjectProvider`; stateless beans |
| 10 min | Filters vs interceptors (R), DispatcherServlet flow (R), AuthN vs AuthZ (R) | "protect some APIs but not others" (R) | request flow diagram; SecurityFilterChain rules + `@PreAuthorize`; 401 vs 403 |
| 10 min | `@Transactional`: rollback of several statements (R) | self-invocation, checked exceptions, isolation levels (R) | proxy behaviour, rollback rules, READ COMMITTED default |
| 15 min | SQL live (R): students per dept with CGPA > 9; duplicate rows; second-highest salary | "departments with zero?", "delete duplicates" | WHERE vs HAVING, GROUP BY all columns, DENSE_RANK ([DB 2](../06-database-sql/02-reported-sql-problems.md)) |
| 5 min | SQL vs NoSQL (R, HIGH); vertical vs horizontal scaling (R) | "why MongoDB in your project?" | trade-offs table + honest project reasoning |

---

## Mock 4 — System Design + Project (60 min)

| Time | Question | Follow-ups | A strong answer covers |
|---|---|---|---|
| 20 min | Draw your project on a whiteboard/Excalidraw; then "10× users?" (R, HIGH) | "what if the DB goes down?", "why Kafka/Redis?" (R) | layer-by-layer bottlenecks, measure-first, realistic changes ([SD 11](../07-system-design/11-mini-designs-asked-at-0-2-yoe.md)) |
| 30 min | Design TinyURL (R, EC) *or* a rate limiter (R) *or* an order-delivery schema + APIs (R) | "DB choice?", "collisions?", "optimise the lookup query" (R) | requirements + numbers, API, schema, cache, ID generation, failure handling ([SD 5](../07-system-design/05-url-shortener.md), [SD 1](../07-system-design/01-rate-limiter.md), [SD 7](../07-system-design/07-food-delivery-system.md)) |
| 10 min | "Live count of users on a page without refresh" (R, EC) | "many servers?" | SSE/WebSocket + Redis sorted-set heartbeats + pub/sub |

**Expected depth at 0–1 YOE**: correct building blocks with reasons and trade-offs; you're **not** expected to design multi-region payments — but mention idempotency and timeouts in anything payment-related.

---

## Mock 5 — Hiring Manager + Behavioral (45 min)

1. Tell me about yourself (R) — 90 seconds.
2. Walk me through your most difficult project (R) — expect 3 "why" follow-ups.
3. A challenging / difficult situation (R, HIGH).
4. A disagreement with a teammate or lead (R, HIGH).
5. A time you took ownership beyond your task (R, HIGH).
6. A production issue you handled (R) — detection → mitigation → root cause → prevention.
7. How do you use AI tools / what do you think about GenAI? (R, 3 reports)
8. Why Visa? (R, HIGH) — [facts vs strategy](../11-behavioral/01-why-visa-company-and-role.md).
9. Where do you see yourself in 2–3 years?
10. Your questions for me (R — the selected 10-month candidate "ended with asking about the team, role expectations and future direction").

**A strong HM answer**: STAR, "I" not "we", a number or concrete result, a lesson, mapped to a Leadership Principle (ownership → *Lead courageously*; teamwork → *Collaborate as one Visa*; delivery → *Execute with excellence*). Frameworks: [11-behavioral](../11-behavioral/README.md).

**Red flags interviewers noted in reports**: unprepared for behavioral (a Senior was rejected at HM, [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/)); vague project answers ([JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/)); losing the thread in long discussions ([LC-6426379](https://leetcode.com/discuss/post/6426379/visa-interview-experience-by-anonymous_u-l4a4/)).

Next: [13 — Last-minute revision →](../13-last-minute-revision/README.md)
