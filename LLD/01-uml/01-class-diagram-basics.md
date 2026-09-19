# UML Class Diagrams — Sirf Utna Jitna Interview Mein Chahiye

> **Standard definition**: UML (Unified Modeling Language) class diagrams are a standard notation for visually representing classes, their attributes/methods, and the relationships (inheritance, association, aggregation, composition) between them.

Poora UML seekhne ki zarurat nahi hai. Interview mein bas itna kaafi hai ki
tum apna design **paper/whiteboard pe likh ke explain** kar sako.

## Ek class ko kaise likhte hain

```
┌─────────────────────┐
│      Account         │   ← class ka naam
├─────────────────────┤
│ - balance: double     │   ← fields (- = private, + = public)
├─────────────────────┤
│ + deposit(amt): void  │   ← methods
│ + getBalance(): double│
└─────────────────────┘
```

**Trick**: `-` = private (taala laga hua), `+` = public (khula hua). Bas itna
yaad rakho.

## Relationships — arrows ka matlab (sabse important part)

Yehi hissa hai jaha log confuse hote hain. 4 tarah ke arrows yaad rakhne hain:

### 1. Inheritance (is-a) — khaali triangle wala arrow

```
Dog ──────▷ Animal
```
**Trick**: Triangle **khaali (hollow)** hota hai, kyunki "khaali/simple hai —
bas ek type hai doosre ka". `Dog extends Animal`.

### 2. Interface implement karna — dotted line + khaali triangle

```
CreditCardPayment - - - -▷ PaymentStrategy
```
**Trick**: Line **dotted** hai kyunki interface ek "loose promise" hai (contract),
solid family relation nahi. `class CreditCardPayment implements PaymentStrategy`.

### 3. Composition (strong has-a) — bhara hua (filled) diamond

```
Car ◆────── Engine
```
**Trick**: Diamond **bhara hua (black/filled)** hai = **strong ownership**.
Agar `Car` khatam ho jaye, `Engine` bhi khatam ho jata hai (uska independent
existence nahi hai). Jaise tumhara dil — body ke bina nahi reh sakta.

### 4. Aggregation (weak has-a) — khaali diamond

```
Team ◇────── Player
```
**Trick**: Diamond **khaali (hollow)** hai = **weak ownership**. `Team` khatam
ho jaye, `Player` phir bhi zinda rehta hai (kisi doosri team join kar sakta hai).

| Symbol | Naam | Trick |
|---|---|---|
| ──▷ (khaali triangle, solid line) | Inheritance | "family hai" — is-a |
| - - ▷ (khaali triangle, dotted line) | Interface implement | "promise hai" — contract |
| ◆── (bhara diamond) | Composition | "bina isके jee nahi sakta" — strong has-a |
| ◇── (khaali diamond) | Aggregation | "saath hai par independent hai" — weak has-a |

## Real LLD example — Parking Lot ka chhota sa hissa

```
ParkingLot ◆────── ParkingFloor        (Composition: lot khatam, floor bhi khatam)
ParkingFloor ◇────── Vehicle           (Aggregation: floor khali ho, vehicle kahi aur park ho sakti hai)
Car ──────▷ Vehicle                    (Inheritance: Car ek Vehicle hai)
ParkingSpot - - -▷ Reservable          (Interface: reserve() karne ka promise)
```

## Interview mein isse kaise use karo

1. Requirement sunte hi **nouns underline karo** (Vehicle, Spot, Floor, Ticket) — ye tumhare classes hain.
2. Har do class ke beech poocho: *"is-a hai ya has-a hai? agar has-a, strong hai ya weak?"*
3. Isi diagram ko bolke ya whiteboard pe banake explain karo, **code se pehle**.

> 💡 Agar time kam ho, poora formal UML mat banao — bas boxes aur arrows
> hath se draw karke bol do "Car has-a Engine, strongly owned" — interviewer
> ko itna hi chahiye hota hai.

Agla topic: [../02-design-patterns/00-overview.md](../02-design-patterns/00-overview.md)
