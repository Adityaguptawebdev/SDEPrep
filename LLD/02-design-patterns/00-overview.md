# Design Patterns — Overview

> **Standard definition** (Gang of Four): A design pattern is a general, reusable solution to a commonly occurring problem within a given context in software design.

Design pattern kuch "naya" nahi hai — ye bas **common problems ke liye
already-tested solutions** hain jinke naam rakh diye gaye hain, taaki log
ek dusre se jaldi baat kar saken ("yaha Strategy pattern use karenge" bolna
easier hai poora explanation dene se).

## 3 categories — trick yaad rakhne ki

| Category | Sawaal jo ye answer karti hai | Trick |
|---|---|---|
| **Creational** | Object **kaise banaun**? | "BANANE" ka tarika |
| **Structural** | Classes ko **kaise jodun**? | "JODNE" ka tarika |
| **Behavioral** | Objects **aapas mein kaise baat karein**? | "BAATCHEET" ka tarika |

### Creational (3 patterns cover karenge)
- **Singleton** — sirf ek hi object poore program mein bane
- **Factory** — object banane ka kaam ek jagah centralize karo
- **Builder** — bahut saare optional parameters wale complex object ko step-by-step banao

### Structural (4 patterns cover karenge)
- **Adapter** — do incompatible cheezon ko jodne wala "plug converter"
- **Decorator** — kisi object mein naye features "wrap" karke add karo, bina uski class chhede
- **Facade** — complex system ke aage ek simple "reception desk" laga do
- **Composite** — tree-jaisa structure (folder ke andar folder) ek jaisa treat karo

### Behavioral (5 patterns cover karenge)
- **Strategy** — algorithm ko runtime pe switch kar sako
- **Observer** — ek cheez badle toh sabko automatically notification jaye
- **State** — object ka behavior uski current "state/mood" ke hisaab se badle
- **Command** — kisi action ko ek object mein pack karo (undo/redo/queue ke liye)
- **Chain of Responsibility** — request ek se dusre handler tak pass hoti jaye jab tak koi usse handle na kare

## Yaad kaise rakhoge — ek hi trick sabke liye

Har pattern padhte waqt 4 cheezein dhundo:
1. **Real life analogy** — kis roz-marra ki cheez jaisa hai ye
2. **Problem** — pattern ke bina kya dikkat aati
3. **Solution code** — 5-10 lines jo dikhaye pattern kaise fix karta hai
4. **Kaha use hota hai LLD problems mein** — taaki interview mein turant pehchan sako

Isi tarike se aage har pattern ka note likha gaya hai — order follow karo:

**Creational**: [Singleton](creational/01-singleton.md) → [Factory](creational/02-factory.md) → [Builder](creational/03-builder.md)

**Structural**: [Adapter](structural/01-adapter.md) → [Decorator](structural/02-decorator.md) → [Facade](structural/03-facade.md) → [Composite](structural/04-composite.md)

**Behavioral**: [Strategy](behavioral/01-strategy.md) → [Observer](behavioral/02-observer.md) → [State](behavioral/03-state.md) → [Command](behavioral/04-command.md) → [Chain of Responsibility](behavioral/05-chain-of-responsibility.md)
