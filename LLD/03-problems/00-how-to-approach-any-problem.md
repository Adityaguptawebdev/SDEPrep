# Kisi Bhi LLD Problem Ko Interview Mein Kaise Approach Karein

Ye ek **universal framework** hai — har problem (Parking Lot ho ya BookMyShow)
isi tarike se solve hoga. Har problem file mein isi framework ko us problem
pe apply karke dikhaya gaya hai.

## Step-by-step (isi order mein karna, skip mat karna)

### 1. Requirements clarify karo (5 min) — CODE SE PEHLE
Interviewer jaan bujh kar requirement adhoori deta hai — dekhna chahta hai
tum sawaal poochte ho ya assume karke ghus jaate ho. **Trick**: khud se
poocho — *"scale kya hai? concurrent users? kaunse features must-have hain,
kaunse nice-to-have?"*

### 2. Nouns underline karo → Entities/Classes
Requirement ke jitne bhi **nouns** hain (Vehicle, Spot, Ticket, User, Book)
wahi tumhare candidate classes hain. Verbs (park, book, cancel) baad mein
methods bante hain.

### 3. Har do entity ke beech relationship poocho
*"Is-a hai ya has-a? Has-a hai toh strong (composition) ya weak (aggregation)?"*
— [UML notes](../01-uml/01-class-diagram-basics.md) wali trick use karo.

### 4. Interfaces pehle socho, phir concrete classes
Jo bhi cheez "future mein badal sakti hai" (payment method, fee calculation,
notification type) — usko interface banao, phir uske implementations. Ye
[SOLID](../00-fundamentals/02-solid-principles.md) ke OCP/DIP ka direct use hai.

### 5. Design pattern pehchano (mat thoko, jahan fit ho wahi use karo)
Ek quick cheat-sheet:

| Signal jo problem mein dikhega | Pattern |
|---|---|
| "Sirf ek object poore system mein" | Singleton |
| "Vehicle type ke hisaab se object banana hai" | Factory |
| "Optional fields wala complex object" | Builder |
| "Algorithm switch karna hai runtime pe (fee/pricing/sorting)" | Strategy |
| "Object ka behavior state ke hisaab se badalta hai" | State |
| "Ek cheez badle, sabko batana hai" | Observer |
| "Undo/redo ya action ko queue karna hai" | Command |
| "Request ko ek se dusre handler tak pass karna" (approval, cash dispensing) | Chain of Responsibility |
| "Tree-jaisa structure" (folder, category) | Composite |
| "Purani/incompatible class ko naye system se jodna" | Adapter |
| "Bahut sari cheezein simplify karke ek entry point dena" | Facade |

### 6. Skeleton code likho — pura implementation nahi chahiye
Class names, fields, method **signatures** likho. Core logic (jo interview
ka focus hai) poora likho, baaki (`getters`, boilerplate) sirf mention karo.

### 7. End mein extensibility bolo
*"Agar kal requirement X aaye (jaise naya vehicle type, naya payment method),
mujhe sirf itna change karna padega..."* — yehi line interview jitwati hai.

---

## Common mistake jo har problem mein hoti hai

- **Seedha code likhna shuru karna** bina requirements clarify kiye — interviewer isse turant pakad leta hai.
- **Sab kuch ek hi class mein daal dena** (SRP violation) — jaise `ParkingLot` class hi payment, ticket, spot allocation sab kare.
- **Enum ki jagah bahut sari classes, ya bahut sari classes ki jagah enum** — trick: agar cheez ke paas apna **behavior/logic** hai, class banao; agar sirf ek **fixed set of values** hai (VehicleType: CAR, BIKE), enum kaafi hai.

Ab har problem yehi framework apply karke dekhte hain:

1. [Parking Lot](01-parking-lot.md)
2. [Vending Machine](02-vending-machine.md)
3. [Tic-Tac-Toe](03-tic-tac-toe.md)
4. [Library Management](04-library-management.md)
5. [Elevator System](05-elevator-system.md)
6. [ATM](06-atm.md)
7. [Snake & Ladder](07-snake-and-ladder.md)
8. [LRU Cache](08-lru-cache.md)
9. [Splitwise](09-splitwise.md)
10. [BookMyShow / Ticket Booking](10-bookmyshow.md)
