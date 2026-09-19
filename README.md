# Low Level Design (LLD) — Notes & Practice (Java)

Personal notes and practice problems while preparing for LLD interviews.
Built topic by topic — fundamentals first, then patterns, then applying
both to real interview-style problems.

> 💡 Tip boxes like this one call out interview gotchas / things to say
> out loud during a real interview.

## How this repo is organized

```
00-fundamentals/       OOP concepts + SOLID principles
01-uml/                Class diagram notation (just enough to use in interviews)
02-design-patterns/    Creational, Structural, Behavioral patterns with Java examples
03-problems/           End-to-end LLD problems (requirements -> design -> code)
```

Each problem under `03-problems/` follows the same template:
1. Requirements (functional + assumptions)
2. Core entities & relationships
3. Class diagram (text/mermaid)
4. Java implementation
5. Patterns used & why
6. Extensibility — "what if requirement X changes"

## Progress

### Fundamentals
- [x] OOP basics (interview depth) — [00-fundamentals/01-oop-basics.md](00-fundamentals/01-oop-basics.md)
- [x] SOLID principles — [00-fundamentals/02-solid-principles.md](00-fundamentals/02-solid-principles.md)

### UML
- [ ] Class diagram notation

### Design Patterns
- [ ] Creational: Singleton, Factory, Builder
- [ ] Structural: Adapter, Decorator, Facade, Composite
- [ ] Behavioral: Strategy, Observer, State, Command, Chain of Responsibility

### Problems
- [ ] Parking Lot
- [ ] Vending Machine
- [ ] Library Management
- [ ] Tic-Tac-Toe
- [ ] Elevator System
- [ ] ATM
- [ ] Snake & Ladder
- [ ] LRU Cache
- [ ] Splitwise
- [ ] BookMyShow / Ticket Booking
- [ ] Cab Booking (Uber-like)
- [ ] Chess
- [ ] Rate Limiter

## Interview approach (the actual "trick")

1. **Clarify requirements first** (~5 min) — don't jump to code. This is what interviewers are actually scoring.
2. **Extract core entities** (nouns in the requirements) → these become your classes.
3. **Define relationships** — has-a (composition/aggregation) vs is-a (inheritance).
4. **Sketch the class diagram** (interfaces first) before writing any code.
5. **Write skeleton code** — class structure + method signatures. Full method bodies only if time permits.
6. **Discuss extensibility** at the end — "if requirement X changes, here's what I'd touch" — this is where SOLID pays off.
