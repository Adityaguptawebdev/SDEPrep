# SOLID Principles — Simple & Practical

SOLID = 5 rules jo batate hain "achha design kaisa dikhta hai". Interview
mein har "why did you design it this way" question in 5 mein se kisi ek pe
jaake khatam hota hai.

**Yaad rakhne ka trick — poora word hi trick hai:**

| Letter | Naam | Ek line mein |
|---|---|---|
| S | Single Responsibility | Ek class, ek hi kaam |
| O | Open/Closed | Naya feature = naya code, purana code mat chhedo |
| L | Liskov Substitution | Child class, parent ki jagah bina surprise ke chal jaye |
| I | Interface Segregation | Chhoti interfaces do, fat interface mat do |
| D | Dependency Inversion | Concrete class pe nahi, interface pe depend karo |

Chalo ek ek karke, real example ke saath.

---

## S — Single Responsibility Principle (SRP)

**Analogy**: Ek employee sochlo jo **cooking bhi karta hai aur accounting bhi**.
Agar recipe badalni ho ya tax rule badalna ho — dono baar isi bande ko disturb
karna padega. Behtar hai: ek cook, ek accountant — **alag reason se alag banda change hoga**.

**Trick**: khud se poocho — *"Is class ko change karne ke kitne alag-alag reasons ho sakte hain?"* Agar jawab 1 se zyada hai, split karo.

```java
// ❌ Do reasons: pricing rule badle YA storage format badle — dono is class ko touch karenge
class Invoice {
    double calculateTotal() { /* pricing logic */ return 0; }
    void saveToDatabase() { /* DB save logic */ }
}
```

```java
// ✅ Split kar diya — ab har class ka apna hi ek kaam hai
class Invoice {
    double calculateTotal() { /* pricing logic */ return 0; }
}

class InvoiceRepository {
    void save(Invoice invoice) { /* DB save logic */ }
}
```

> 💡 Interview line: *"Pricing team aur DB/infra team dono alag reasons se
> is class ko change karwate, isliye maine split kar diya."*

---

## O — Open/Closed Principle (OCP)

**Analogy**: Mobile mein naya app install karna hota hai, tumhe phone ka
operating system khol ke code change nahi karna padta. **Naya feature = naya
"app" (naya class), purana system chhedo mat.**

**Trick**: agar naya feature add karne ke liye tumhe **purani, already-working
method ke andar `if-else` badhana** pad raha hai — ye OCP violation hai.

```java
// ❌ Naya discount type aaya toh isi method mein naya "if" jodna padega
class DiscountCalculator {
    double apply(String type, double amount) {
        if (type.equals("SEASONAL")) return amount * 0.9;
        if (type.equals("CLEARANCE")) return amount * 0.5;
        return amount;
        // kal naya discount aaya toh yahi method fir se edit hogi — risky
    }
}
```

```java
// ✅ Naya discount = nayi class. Purani class ko haath nahi lagana pada.
interface Discount {
    double apply(double amount);
}

class SeasonalDiscount implements Discount {
    public double apply(double amount) { return amount * 0.9; }
}

class ClearanceDiscount implements Discount {
    public double apply(double amount) { return amount * 0.5; }
}
// kal FestivalDiscount chahiye? Bas ek nayi class banao, kahi aur kuch mat badlo
```

> 💡 Interviewer aksar beech interview mein bolta hai "ab ye naya feature add
> karo" — dekhna chahta hai kya tumhe naye `if` likhne pade ya sirf nayi class.

---

## L — Liskov Substitution Principle (LSP)

**Analogy**: Agar "Square" ko "Rectangle" ka child bana diya, toh problem ye
hai ki Square mein width badlo toh height bhi apne aap badal jaani chahiye
(kyunki square ke sab sides equal hote hain) — jo Rectangle ke normal behavior
se **alag/surprising** hai. Jo code Rectangle expect kar raha tha, wo Square
milne pe galat answer dega.

**Trick**: *"Agar child class ka behavior parent se itna alag hai ki calling
code confuse ho jaye — tab inheritance galat hai, composition socho."* Ye
wahi baat hai jo OOP note mein "is-a vs has-a" mein dekhi thi.

```java
class Rectangle {
    protected int width, height;
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int area() { return width * height; }
}

// ❌ Square, Rectangle ka child hai but behavior surprise karta hai
class Square extends Rectangle {
    @Override void setWidth(int w) { width = w; height = w; }  // height bhi badal di!
    @Override void setHeight(int h) { width = h; height = h; }
}
```

Ye code jo `Rectangle` expect karke likha gaya tha:
```java
rect.setWidth(5);
rect.setHeight(10);
// normal Rectangle mein area = 50 hona chahiye,
// lekin agar rect asal mein Square nikla, area = 100 aayega — silent bug!
```

**Fix**: `Square` ko `Rectangle` ka child mat banao. Dono ko ek common
`Shape` interface do, jisme sirf `area()` ho, koi shared mutable state na ho.

---

## I — Interface Segregation Principle (ISP)

**Analogy**: Ek "All-in-one remote" socho jisme TV, AC, Fridge sab ke buttons
hain — lekin tumhare paas sirf TV hai. Fridge/AC ke buttons bekaar padhe
rahenge, aur galti se dab bhi sakte hain. **Chhoti, specific interfaces
behtar hain ek badi "sab kuch" interface se.**

**Trick**: agar kisi class mein interface implement karte waqt ek method ke
andar sirf `throw new UnsupportedOperationException()` likhna pad raha hai —
ye ISP violation ka pakka sign hai.

```java
// ❌ Fat interface — RobotWorker ko "eat" ka koi matlab nahi
interface Worker {
    void work();
    void eat();
}

class RobotWorker implements Worker {
    public void work() { /* kaam karo */ }
    public void eat() { throw new UnsupportedOperationException(); } // 🚩 red flag
}
```

```java
// ✅ Do chhoti interfaces — jisko jo chahiye wahi le
interface Workable { void work(); }
interface Eatable { void eat(); }

class RobotWorker implements Workable {
    public void work() { /* kaam karo */ }
}

class HumanWorker implements Workable, Eatable {
    public void work() { /* kaam karo */ }
    public void eat() { /* khana khao */ }
}
```

---

## D — Dependency Inversion Principle (DIP)

**Analogy**: Tum charger kharidte ho jo "USB-C port" support karta hai — tumhe
fark nahi padta andar Samsung ki chip hai ya kisi aur ki, bas **port (contract)
match hona chahiye**. Agar phone seedha "Samsung ki chip" ke hisaab se design
hota, kisi aur charger se kaam hi nahi karta.

**Trick**: Agar kisi class ke andar `new ConcreteClass()` likha hua hai
(seedha kisi specific implementation ko banana), toh us class ko test karna
ya uska implementation badalna mushkil hoga. **Interface do, object bahar se
do (constructor ke through) — isse "Dependency Injection" kehte hain.**

```java
// ❌ OrderService seedha MySqlOrderRepository se chipka hua hai
class MySqlOrderRepository {
    void save(Order order) { /* DB save */ }
}

class OrderService {
    private MySqlOrderRepository repo = new MySqlOrderRepository(); // 🚩 tightly coupled
    void placeOrder(Order order) { repo.save(order); }
}
```

```java
// ✅ Dono ek interface pe depend karte hain, object bahar se aata hai
interface OrderRepository {
    void save(Order order);
}

class MySqlOrderRepository implements OrderRepository {
    public void save(Order order) { /* DB save */ }
}

class OrderService {
    private final OrderRepository repo;

    // Constructor Injection — object BAHAR se milta hai, andar 'new' nahi hota
    OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    void placeOrder(Order order) { repo.save(order); }
}
```

**Line by line**: Ab `OrderService` ko fark nahi padta ki data MySQL mein
save ho raha hai ya MongoDB mein — usse sirf `OrderRepository` interface
dikhta hai. Kal DB badalni ho, `OrderService` ka code touch nahi hoga.

> 💡 Interview mein agar poocha jaye "isko test kaise karoge" aur tumhare
> class ke andar `new` se object bana hua hai — samajh lo ye DIP violation hai.

---

## SOLID → Design Patterns ka connection (aage kaam aayega)

- OCP + DIP se **Strategy pattern** banta hai (algorithm swap karna bina caller chhede)
- SRP se **Facade pattern** ka idea aata hai (ek class coordinate karti hai, baaki apna-apna kaam karti hain)
- LSP sahi use hone se hi inheritance hierarchies aur **Template Method pattern** kaam karte hain
- DIP se **Factory pattern** banta hai (caller sirf interface jaanta hai, factory decide karta hai konsi concrete class banegi)

Agla note: [../01-uml/01-class-diagram-basics.md](../01-uml/01-class-diagram-basics.md)
