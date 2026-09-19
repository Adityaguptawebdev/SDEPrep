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
- [x] OOP basics (interview depth, with analogies + tricks) — [00-fundamentals/01-oop-basics.md](00-fundamentals/01-oop-basics.md)
- [x] SOLID principles — [00-fundamentals/02-solid-principles.md](00-fundamentals/02-solid-principles.md)

### UML
- [x] Class diagram notation — [01-uml/01-class-diagram-basics.md](01-uml/01-class-diagram-basics.md)

### Design Patterns
- [x] Overview (3 categories + how to remember them) — [02-design-patterns/00-overview.md](02-design-patterns/00-overview.md)
- [x] Creational: [Singleton](02-design-patterns/creational/01-singleton.md), [Factory](02-design-patterns/creational/02-factory.md), [Builder](02-design-patterns/creational/03-builder.md)
- [x] Structural: [Adapter](02-design-patterns/structural/01-adapter.md), [Decorator](02-design-patterns/structural/02-decorator.md), [Facade](02-design-patterns/structural/03-facade.md), [Composite](02-design-patterns/structural/04-composite.md)
- [x] Behavioral: [Strategy](02-design-patterns/behavioral/01-strategy.md), [Observer](02-design-patterns/behavioral/02-observer.md), [State](02-design-patterns/behavioral/03-state.md), [Command](02-design-patterns/behavioral/04-command.md), [Chain of Responsibility](02-design-patterns/behavioral/05-chain-of-responsibility.md)

> Theory (fundamentals + UML + all 9 core patterns) is complete. Practice
> problems below are done one at a time, interactively, since that's where
> actually writing code is practiced — not dumped all at once.

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
