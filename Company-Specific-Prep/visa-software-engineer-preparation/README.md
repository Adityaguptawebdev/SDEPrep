# Visa Software Engineer — India / Bengaluru — 0–2 YOE Interview Prep

A research-backed guide built from **real Visa candidate reports (2021–2026, focus 2024–2026)** — LeetCode Discuss, GeeksforGeeks, Jointaro, Blind — plus **official Visa sources** (careers JDs, Leadership Principles, tech pages, 10-K). Not a generic SDE guide: every question is tagged with its source, date, level and frequency.

**Who it's for**: off-campus Software Engineer / SDE-1 candidates with ~6–18 months of experience (Java/Spring Boot, React/TypeScript, Node, MongoDB) targeting Visa Bengaluru.

> ⚠️ **Disclaimer**: interview experiences are candidate-reported and incomplete. *Visa's process varies by team, requisition and hiring cycle.* Reconstructed questions are labelled as such.

## The process at a glance

```
 Apply ─► Shortlist ─► CodeSignal OA (4 Q / ~70 min, /600) ─► Tech 1 ─► Tech 2 ─► Hiring Manager ─► HR/Offer
                                                              resume deep-dive + DSA + Java/Spring/SQL in every round
```
Details: [01-hiring-process](01-hiring-process/README.md) · Evidence: [research-findings](01-hiring-process/research-findings.md)

## Contents

| Section | What's inside |
|---|---|
| [01 — Hiring process](01-hiring-process/README.md) · [research findings](01-hiring-process/research-findings.md) | round-by-round map, consistent vs varies, evidence tables |
| [02 — Online assessment](02-online-assessment/README.md) | reported CodeSignal questions + Java solutions, patterns ranked by frequency, [3 mock OAs](02-online-assessment/04-mock-oa-sets.md) + [answer key](02-online-assessment/05-mock-oa-answer-key.md) |
| [03 — DSA](03-dsa/README.md) | 8 notes of reported interview questions (brute → optimal, dry run, follow-ups) |
| [04 — Core Java](04-java/README.md) | OOP, HashMap internals, strings/JVM/GC, multithreading, Java 8+ |
| [05 — Spring Boot](05-spring-boot/README.md) | IoC/DI, REST + filters, JPA/`@Transactional`, security/JWT, microservices/Kafka |
| [06 — Database & SQL + MongoDB](06-database-sql/README.md) | concepts, reported SQL problems, NoSQL/MongoDB |
| [07 — System design](07-system-design/README.md) | 10 designs at early-career depth + [mini designs asked at 0–2 YOE](07-system-design/11-mini-designs-asked-at-0-2-yoe.md) |
| [08 — LLD](08-lld/README.md) | approach from scratch + custom cache, notification factory, BookMyShow, library, payment, OOP modelling |
| [09 — JavaScript / React](09-javascript-react/README.md) | only topics reported at Visa |
| [10 — Project deep dive](10-project-deep-dive/README.md) | project card template + question bank (`[CUSTOMIZE]`, no fake stories) |
| [11 — Behavioral / HM](11-behavioral/README.md) | STAR frameworks, Leadership Principles, [Why Visa: fact vs strategy](11-behavioral/01-why-visa-company-and-role.md) |
| [12 — Mock interviews](12-mock-interviews/README.md) | 5 timed mocks: OA, DSA+Java, backend+DB, SD+project, HM |
| [13 — Last-minute revision](13-last-minute-revision/README.md) | HIGH / MEDIUM / one-off repeating questions + [last 7 days plan](13-last-minute-revision/01-last-7-days-plan.md) |
| [sources.md](sources.md) | every source with ID, date, level and link |

## Roadmap — how to use

1. **Week 1**: [process map](01-hiring-process/README.md) + [executive summary](01-hiring-process/research-findings.md#1-executive-summary-read-this-first), then [OA questions](02-online-assessment/README.md) and the [3 timed mocks](02-online-assessment/04-mock-oa-sets.md).
2. **Week 2–3**: [DSA](03-dsa/README.md) → [Java](04-java/README.md) → [Spring](05-spring-boot/README.md) → [SQL/Mongo](06-database-sql/README.md); fill your [project card](10-project-deep-dive/README.md) in parallel.
3. **Week 4**: [system design](07-system-design/README.md) + [LLD](08-lld/README.md), [React/JS](09-javascript-react/README.md) if on your resume, [behavioral stories](11-behavioral/README.md), [mocks](12-mock-interviews/README.md).
4. **Last 7 days**: follow the [Day 7 → Day 1 plan](13-last-minute-revision/01-last-7-days-plan.md).

Prioritise **HIGH** frequency items first; treat Senior/Staff-only items as stretch.

## Repo structure

```
visa-software-engineer-preparation/
├── README.md                    ← you are here
├── sources.md
├── 01-hiring-process/           README (process map) · research-findings
├── 02-online-assessment/        3 topic notes · mock OA sets · answer key
├── 03-dsa/                      8 notes
├── 04-java/  05-spring-boot/    5 notes each
├── 06-database-sql/             3 notes
├── 07-system-design/            11 notes
├── 08-lld/                      6 notes
├── 09-javascript-react/         2 notes
├── 10-project-deep-dive/  11-behavioral/  12-mock-interviews/
└── 13-last-minute-revision/     repeating questions · last-7-days plan
```

## How the code was verified

- **Java**: every block compiled with `javac`; algorithm solutions tested against brute force on random inputs (~550k checks); printed outputs match the ```text blocks.
- **Spring Boot**: compile-checked against Spring Boot 3.3 / Spring 6.1 / Security 6.3 / Kafka 3.2 jars (`--release 17`), not run as an app.
- **LLD**: all 6 Java designs compiled and run; outputs match. **JavaScript**: plain JS blocks run with Node (React/JSX not executed).
- **SQL**: executed in SQLite 3.51 (MySQL/PostgreSQL-only syntax marked and not executed). **MongoDB**: executed with mongosh on MongoDB 7.0 (replica set).

## Language

Simple English with a little Hinglish (analogies and the 🗣️ "Interview mein aise bolo" lines), like the rest of this repo.
