# OOP Basics — Simple & Practical

Isse pehle wala note thoda theory-heavy tha. Is baar har cheez ek **real-life
example** se samjhenge, phir ek **trick** doonga yaad rakhne ke liye, phir code
**line-by-line** samjhaunga.

---

## 1. Encapsulation — "ATM machine" wala concept

**Analogy**: ATM machine ke andar kya ho raha hai (motor, cash counting,
database check) — tumhe pata nahi hota aur pata hone ki zarurat bhi nahi.
Tumhe sirf buttons milte hain: "Withdraw", "Balance Check". Andar ka logic
**hidden** hai, bahar sirf **safe operations** exposed hain.

Yehi encapsulation hai: class ke andar ka data (`balance`) **private** rakho,
bahar sirf controlled tareeke se (methods ke through) access do.

**Trick yaad rakhne ka**: "Data ko taala lagao (`private`), chaabi tum khud do (`public method`)."

```java
public class Account {
    private double balance;   // 🔒 taala laga diya — bahar se koi seedha chhed nahi sakta

    // 🔑 chaabi #1: paisa dalne ke liye, lekin validation ke saath
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("amount positive hona chahiye");
        }
        balance += amount;
    }

    // 🔑 chaabi #2: sirf dekhne ke liye, edit karne ke liye nahi
    public double getBalance() {
        return balance;
    }
}
```

**Line by line kya ho raha hai:**
1. `private double balance` → koi bhi bahar se `account.balance = -500` nahi likh sakta. Compile hi nahi hoga.
2. `deposit()` method ke andar validation hai — agar field public hoti, ye validation koi bhi skip kar sakta tha.
3. `getBalance()` sirf padhne deta hai, edit karne nahi deta.

**Galti jo log karte hain**: field ko public bana ke uske upar getter/setter laga dena jo kuch check hi nahi karte — ye encapsulation nahi hai, sirf dikhava hai. Asli encapsulation tab hai jab method ke andar **rule/validation** ho.

---

## 2. Abstraction — "TV remote" wala concept

**Analogy**: Remote ka "Power" button dabate ho, TV on ho jata hai. Andar
IR signal kaise jaata hai, TV ka circuit kaise kaam karta hai — tumhe nahi
pata, aur pata karne ki zarurat nahi. Tumhe sirf **"what it does"** pata hai,
**"how it does"** nahi.

Java mein ye `interface` se hota hai — ek contract batata hai "ye kaam hoga",
lekin "kaise hoga" har class apne hisaab se decide karti hai.

**Trick**: "Interface = menu card (kya milega), Class = kitchen (kaise banega)."

```java
// Menu card — sirf batata hai ki "pay" ka kaam hoga
public interface PaymentStrategy {
    void pay(double amount);
}

// Kitchen #1 — card se payment kaise hota hai
public class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Card se " + amount + " pay ho gaya");
    }
}

// Kitchen #2 — UPI se payment kaise hota hai
public class UpiPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("UPI se " + amount + " pay ho gaya");
    }
}
```

Ab caller sirf ye likhega:
```java
PaymentStrategy payment = new UpiPayment();  // menu card ke reference se kitchen ka kaam
payment.pay(500);
```

Caller ko `UpiPayment` class ke andar ka code kabhi dekhna nahi pada. Agar kal
`PaytmWalletPayment` add karna ho, caller ka code bilkul nahi badlega.

---

## 3. Inheritance vs Composition — "family vs skill" wala trick

Ye sabse important concept hai LLD interviews mein, aur sabse zyada log yahi
galat karte hain.

- **Inheritance** (`extends`) = **"is-a"** relationship. Jaise "Dog is an Animal".
  Ye ek **family relation** jaisa hai — permanent, blood relation jaisa.
- **Composition** (class ke andar dusri class ka object rakhna) = **"has-a"**
  relationship. Jaise "Car has an Engine". Ye ek **skill/part** jaisa hai —
  swap kiya ja sakta hai.

**Trick**: Khud se poocho — *"Kya ye ek dusre jaisa HAI, ya isके paas ek dusra CHEEZ hai?"*
- "HAI" (is-a) → inheritance
- "PAAS HAI" (has-a) → composition

### Galat design (inheritance ka galat use):

```java
class Vehicle {
    void refuel() {
        // sochte hain sabhi vehicles fuel se chalte hain
    }
}

class ElectricCar extends Vehicle {
    // Problem: Electric car fuel nahi, battery se chalti hai
    // par refuel() method inherit ho gaya — ye galat hai
}
```

Yahan `ElectricCar` ko `Vehicle` se `refuel()` mila jo uske liye sahi nahi hai.
Ye isliye hua kyunki humne assume kar liya "sab vehicles same tarike se chalte hain" —
jo galat nikla.

### Sahi design (composition se fix):

```java
// "Energy dena" ek skill hai — alag alag tarike se ho sakta hai
interface EnergySource {
    void refill();
}

class PetrolTank implements EnergySource {
    public void refill() { System.out.println("Petrol bhara"); }
}

class Battery implements EnergySource {
    public void refill() { System.out.println("Battery charge hui"); }
}

class Car {
    // Car "HAS-A" EnergySource — jo bhi ho sakta hai, fix nahi hai
    private final EnergySource energySource;

    Car(EnergySource energySource) {
        this.energySource = energySource;  // constructor se andar daal diya
    }

    void refuel() {
        energySource.refill();  // Car ko fark nahi padta andar petrol hai ya battery
    }
}
```

```java
Car petrolCar = new Car(new PetrolTank());
Car electricCar = new Car(new Battery());
```

**Line by line**: `Car` class khud fuel/battery ka logic nahi jaanti — usne ye
kaam `EnergySource` ko de diya (delegate kar diya). Kal agar `SolarPanel`
energy source aaye, `Car` class ka ek line bhi badalna nahi padega.

> 💡 **Interview mein bolne wali line**: *"Main yahan composition use karunga
> kyunki behavior (energy source) future mein badal sakta hai, aur composition
> se main naya behavior bina existing code chhede add kar sakta hoon."*
> Ye line bolne se interviewer ko turant pata chal jata hai tumhe concept clear hai.

---

## 4. Interface vs Abstract Class — decision trick

Ye wo confusion hai jo sabko hoti hai — "kab interface, kab abstract class?"

**Simple trick**: 
- **Abstract class** = wahan use karo jaha classes **family** hain aur unme
  **kuch common code already hai** jo share karna hai.
- **Interface** = wahan use karo jaha bas ek **capability/contract** define
  karna hai, chahe classes bilkul unrelated ho.

**Example jo trick clear karega**: `Bird` aur `Airplane` dono **fly** kar sakte
hain, lekin ye ek family nahi hain (Airplane, Bird nahi hai). Isliye "flying"
ek **interface** hogi (`Flyable`), na ki `Bird` ko extend karke `Airplane`
banaya jaye.

```java
interface Flyable {
    void fly();
}

abstract class Bird implements Flyable {
    // Sab birds mein common cheez: andaa dena — ye shared code hai
    void layEggs() {
        System.out.println("Andaa diya");
    }
}

class Sparrow extends Bird {
    public void fly() { System.out.println("Sparrow udi"); }
}

class Airplane implements Flyable {
    public void fly() { System.out.println("Airplane ne udaan bhari"); }
    // Airplane, Bird ki family mein nahi hai — isliye extends nahi, sirf implements
}
```

| Poocho khud se | Jawab "Haan" | Jawab "Nahi" |
|---|---|---|
| Kya inme common code/state share hota hai? | Abstract class | Interface |
| Kya ye ek hi "family" ke members hain? | Abstract class | Interface |
| Kya bilkul unrelated classes ko bhi ye capability chahiye? | Interface | Abstract class |

---

## 5. Polymorphism — isi sab ka fayda

Jab tum interface/abstract type ka reference rakhte ho (`PaymentStrategy p`),
aur runtime pe actual object (`UpiPayment` ya `CreditCardPayment`) decide
karta hai kaunsa code chalega — isse **polymorphism** kehte hain.

**Fayda**: Naya type add karna ho (naya payment method, naya energy source) —
**existing code ek line bhi nahi badalta**. Ye exactly wahi cheez hai jo
agla topic "Open/Closed Principle" formalize karta hai.

---

## Khud check karo (aage badhne se pehle)

1. Apne kisi purane code mein dekho — kahin "has-a" ko galti se "is-a"
   (inheritance) toh nahi bana rakha?
2. Ek line mein bolke dekho: interface aur abstract class mein tumhara
   decision trick kya hai?

Agla note: [02-solid-principles.md](02-solid-principles.md)
