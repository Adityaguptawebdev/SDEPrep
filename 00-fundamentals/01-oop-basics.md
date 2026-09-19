# OOP Basics — Interview Depth

LLD interviews don't ask "what is encapsulation" as a definition question — they
check whether you *apply* these ideas while designing. This note goes just deep
enough for that.

## 1. Encapsulation

Hiding internal state and exposing behavior through a controlled interface.

```java
public class Account {
    private double balance; // not accessible directly from outside

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

> 💡 Interview tip: if you catch yourself writing public fields with getters/setters
> that do nothing but expose the field, ask "should this even be mutable from outside?"
> Interviewers notice when validation lives inside the class vs scattered at call sites.

## 2. Abstraction

Expose *what* an object does, hide *how*. In Java this is interfaces / abstract classes.

```java
public interface PaymentStrategy {
    void pay(double amount);
}

public class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) { /* card processing logic */ }
}

public class UpiPayment implements PaymentStrategy {
    public void pay(double amount) { /* UPI processing logic */ }
}
```

Caller only depends on `PaymentStrategy`, never on the concrete class. This single
idea is the seed of the Strategy pattern and of dependency inversion (SOLID's "D").

## 3. Inheritance vs Composition — favor composition

Inheritance (`extends`) means **is-a**. Composition (holding a reference to another
object) means **has-a**. Overusing inheritance is the #1 LLD mistake interviewers
watch for.

```java
// ❌ Fragile: forces a rigid hierarchy, breaks if a new vehicle type
// doesn't fit the assumed behavior of the parent
class Vehicle {
    void refuel() { /* assumes all vehicles use fuel */ }
}
class ElectricCar extends Vehicle {
    // refuel() makes no sense here — inheritance leaked an assumption
}
```

```java
// ✅ Composition: behavior is injected, not inherited
interface EnergySource {
    void refill();
}
class PetrolTank implements EnergySource { public void refill() { /* ... */ } }
class Battery implements EnergySource { public void refill() { /* ... */ } }

class Car {
    private final EnergySource energySource;
    Car(EnergySource energySource) { this.energySource = energySource; }
    void refuel() { energySource.refill(); }
}
```

> 💡 Interview tip: when asked "why not just extend class X here?", the answer
> "because that would couple behavior that can vary independently" is exactly
> the kind of sentence interviewers want to hear. Say it out loud.

**Rule of thumb**: use inheritance only when the subtype must be substitutable
everywhere the base type is used (Liskov Substitution Principle — see SOLID notes).
Otherwise, compose.

## 4. Interface vs Abstract Class (Java specifics)

| | Interface | Abstract class |
|---|---|---|
| State (fields) | No instance state (only constants) | Can hold instance state |
| Method bodies | Default/static methods only (Java 8+) | Can have concrete methods |
| Multiple inheritance | A class can implement many | A class can extend only one |
| Use when | Defining a *capability/contract* (e.g. `Comparable`, `PaymentStrategy`) | Sharing common code/state across closely related subclasses |

> 💡 Interview tip: if asked to justify the choice, the deciding question is
> "do these types share implementation, or just a contract?" Shared implementation
> → abstract class. Pure contract, possibly unrelated classes → interface.

## 5. Polymorphism

Same interface, different runtime behavior — this is what lets you add new
types (e.g. a new `PaymentStrategy`) without touching existing calling code.
This is the practical payoff of everything above, and it's exactly what the
Open/Closed Principle formalizes (next note).

## Quick self-check before moving to SOLID

- Can you spot a has-a relationship being wrongly modeled as is-a in your own code?
- Can you explain, out loud, why an interface reference (`PaymentStrategy p = new UpiPayment()`)
  is preferred over holding a concrete type?

Next: [02-solid-principles.md](02-solid-principles.md)
