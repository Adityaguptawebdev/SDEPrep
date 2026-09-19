# Strategy Pattern

> **Standard definition**: Define a family of algorithms, encapsulate each one, and make them interchangeable — Strategy lets the algorithm vary independently from the clients that use it.

**Ek line mein**: Ek kaam karne ke **multiple tarike (algorithms)** ho sakte
hain — unhe alag-alag classes mein rakho, aur runtime pe jo chahiye wo switch
kar sako, bina bade `if-else` ke.

**Yaad rakhne ka trick**: **"Google Maps mein route options"** — Car, Bike,
Walking, Public Transport — manzil wahi hai, par pahunchne ka "strategy"
badal sakta hai. Tum bas mode select karte ho, andar ka calculation alag
class handle karti hai.

Ye pattern tumne pehle hi dekha hai — [OOP basics](../../00-fundamentals/01-oop-basics.md)
ke "Abstraction" wale `PaymentStrategy` example mein! Wahi Strategy pattern tha.

**Real life example**: Checkout page pe payment method choose karna — Credit
Card, UPI, Wallet. Sabka "pay" karne ka andar ka logic alag hai, par bahar
se same kaam (`pay()`).

## Problem (pattern ke bina)

```java
class PaymentService {
    void pay(String method, double amount) {
        if (method.equals("CARD")) {
            // card processing logic yahi likha hua
        } else if (method.equals("UPI")) {
            // UPI processing logic yahi likha hua
        }
        // naya payment method aaya toh yehi method fir se edit — OCP violation
    }
}
```

## Solution — Java code, line by line

```java
// Step 1: common interface — "strategy" ka contract
interface PaymentStrategy {
    void pay(double amount);
}

// Step 2: har algorithm apni class mein
class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Card se pay: " + amount);
    }
}

class UpiPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("UPI se pay: " + amount);
    }
}

// Step 3: PaymentService ab khud koi logic nahi rakhta,
// bas jo strategy usse di gayi wahi use karta hai
class PaymentService {
    private PaymentStrategy strategy;   // 🔑 interface type — kisi bhi strategy ko hold kar sakta hai

    // strategy bahar se di jaati hai — ye DIP hai
    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void pay(double amount) {
        strategy.pay(amount);   // kaunsi class ka pay() chalega, ye runtime pe decide hota hai
    }
}
```

**Use kaise karenge:**
```java
PaymentService service = new PaymentService();

service.setStrategy(new UpiPayment());
service.pay(500);              // "UPI se pay: 500.0"

service.setStrategy(new CreditCardPayment());  // runtime pe strategy badal di
service.pay(1000);             // "Card se pay: 1000.0"
```

**Kya ho raha hai samjho:**
1. `PaymentService` ke andar `if-else` bilkul nahi hai — usse fark hi nahi
   padta konsa payment method hai, wo sirf `strategy.pay()` call karta hai.
2. `setStrategy()` se algorithm **runtime pe switch** ho sakta hai — wahi
   object, alag time pe alag tarike se pay kar sakta hai.
3. Naya payment method (`WalletPayment`) add karna ho — bas nayi class
   banao, `PaymentService` ka ek line bhi mat chhuo.

> 💡 **Strategy vs State mein confusion na ho** (agla topic State hai):
> Strategy mein **caller khud decide karta hai** kaunsa algorithm use hoga
> (`setStrategy(new Upi...)`). State mein **object khud apni state ke
> hisaab se decide karta hai** ki uska behavior kya hoga — caller ko pata
> bhi nahi hota state change hui. Ye fark aage clear ho jayega.

## Kab use karo
- Jab ek hi kaam ke multiple tarike hain aur unme se koi ek runtime pe choose karna hai
- Jab `if-else`/`switch` ki chain algorithm choose karne ke liye ban rahi ho

## LLD problems mein kaha milega
- Payment methods, Sorting strategies, Discount calculation, Route/pricing calculation (Uber-jaise apps)

Agla: [02-observer.md](02-observer.md)
