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

## Status

| Section | Status |
|---|---|
| [01 — Hiring process + research findings](01-hiring-process/README.md) | ✅ done |
| [02 — Online assessment](02-online-assessment/README.md): reported questions, frequency-ranked patterns, 3 mock OAs + answer key | ✅ done |
| [03 — DSA for technical rounds](03-dsa/README.md) (8 notes) | ✅ done |
| [04 — Core Java](04-java/README.md) (5 notes) | ✅ done |
| [05 — Spring Boot](05-spring-boot/README.md) (5 notes) | ✅ done |
| [06 — Database & SQL + MongoDB](06-database-sql/README.md) (3 notes) | ✅ done |
| [07 — System design](07-system-design/README.md) (10 designs) | ✅ done · ⏳ "mini designs asked at 0–2 YOE" note pending |
| 08 — LLD (custom cache, notification, BookMyShow, library, payment LLD, OOP modelling) | ⏳ pending |
| 09 — JavaScript / React (reported topics only) | ⏳ pending |
| 10 — Project / resume deep dive | ⏳ pending |
| 11 — Behavioral / HM + "Why Visa" (fact vs strategy) | ⏳ pending |
| 12 — Mock interviews (5 sets) | ⏳ pending |
| 13 — Repeating questions + last-7-days plan | ⏳ pending |
| `sources.md` (full source list) | ⏳ pending — until then, all sources are listed in [research-findings](01-hiring-process/research-findings.md) |

Some cross-links point to the pending sections and will work once they're added.

## How to use (for the finished parts)

1. Read the [process map](01-hiring-process/README.md) and the [executive summary](01-hiring-process/research-findings.md#1-executive-summary-read-this-first).
2. OA: solve the [reported OA questions](02-online-assessment/README.md), then take the [3 timed mocks](02-online-assessment/04-mock-oa-sets.md).
3. Technical rounds: [DSA](03-dsa/README.md) → [Java](04-java/README.md) → [Spring](05-spring-boot/README.md) → [SQL/Mongo](06-database-sql/README.md) → [system design](07-system-design/README.md).
4. Prioritise **HIGH** frequency items first; treat Senior/Staff-only items as stretch.

## How the code was verified

- **Java**: every block compiled with `javac`; algorithm solutions tested against brute force on random inputs (~550k checks); printed outputs match the ```text blocks.
- **Spring Boot**: compile-checked against Spring Boot 3.3 / Spring 6.1 / Security 6.3 / Kafka 3.2 jars (`--release 17`), not run as an app.
- **SQL**: executed in SQLite 3.51 (MySQL/PostgreSQL-only syntax marked and not executed). **MongoDB**: executed with mongosh on MongoDB 7.0 (replica set).

## Language

Simple English with a little Hinglish (analogies and the 🗣️ "Interview mein aise bolo" lines), like the rest of this repo.
