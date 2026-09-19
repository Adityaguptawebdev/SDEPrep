# SOLID Principles

The single most-tested framework in LLD interviews. Every "why did you design
it this way" question maps back to one of these five. Know them well enough
to spot a violation in someone else's code, not just recite the definition.

## S — Single Responsibility Principle

A class should have **one reason to change**.

```java
// ❌ Two reasons to change: invoice calculation rules, AND persistence format
class Invoice {
    double calculateTotal() { /* pricing logic */ }
    void saveToDatabase() { /* persistence logic */ }
}
```

```java
// ✅ Split by responsibility
class Invoice {
    double calculateTotal() { /* pricing logic */ }
}
class InvoiceRepository {
    void save(Invoice invoice) { /* persistence logic */ }
}
```

> 💡 Interview tip: "reason to change" is about *who asks for the change*.
> If finance changes pricing rules and infra changes DB schema, and both would
> touch the same class — that's your SRP violation, name it that way.

## O — Open/Closed Principle

Open for extension, closed for modification. Adding a new behavior shouldn't
require editing existing, tested code.

```java
// ❌ Every new discount type means editing this method
class DiscountCalculator {
    double apply(String type, double amount) {
        if (type.equals("SEASONAL")) return amount * 0.9;
        if (type.equals("CLEARANCE")) return amount * 0.5;
        // adding a new type = editing this + risk of breaking existing ones
        return amount;
    }
}
```

```java
// ✅ New discount = new class, zero changes to existing code
interface Discount {
    double apply(double amount);
}
class SeasonalDiscount implements Discount {
    public double apply(double amount) { return amount * 0.9; }
}
class ClearanceDiscount implements Discount {
    public double apply(double amount) { return amount * 0.5; }
}
```

> 💡 Interview tip: this is the principle interviewers probe with "now add
> feature X" mid-interview. If your design needs a new `if` branch in an
> existing method, say so honestly, then show how you'd refactor to avoid it.

## L — Liskov Substitution Principle

A subtype must be usable anywhere its base type is expected, without breaking
correctness. The classic example:

```java
// ❌ Square "is-a" Rectangle mathematically, but violates behavioral contract
class Rectangle {
    protected int width, height;
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int area() { return width * height; }
}
class Square extends Rectangle {
    @Override void setWidth(int w) { width = w; height = w; } // surprises callers
    @Override void setHeight(int h) { width = h; height = h; }
}
```

Code that does `rect.setWidth(5); rect.setHeight(10); assert rect.area() == 50;`
breaks silently when `rect` is actually a `Square`. This is exactly the
"is-a vs has-a" trap from the OOP notes — inheritance was used where the
behavior wasn't truly substitutable.

> 💡 Interview tip: if you're about to write `extends` and then override a
> method to throw `UnsupportedOperationException` or change its contract —
> that's an LSP violation. Stop and reach for composition instead.

## I — Interface Segregation Principle

Don't force a class to implement methods it doesn't need. Prefer several small
interfaces over one fat one.

```java
// ❌ Fat interface forces irrelevant implementations
interface Worker {
    void work();
    void eat();
}
class RobotWorker implements Worker {
    public void work() { /* ... */ }
    public void eat() { throw new UnsupportedOperationException(); } // smell
}
```

```java
// ✅ Segregated — implement only what applies
interface Workable { void work(); }
interface Eatable { void eat(); }
class RobotWorker implements Workable {
    public void work() { /* ... */ }
}
class HumanWorker implements Workable, Eatable {
    public void work() { /* ... */ }
    public void eat() { /* ... */ }
}
```

## D — Dependency Inversion Principle

High-level modules shouldn't depend on low-level modules — both should depend
on abstractions. This is the "code to an interface" idea from the OOP notes,
applied at the architecture level.

```java
// ❌ High-level OrderService is tightly coupled to a concrete low-level class
class MySqlOrderRepository {
    void save(Order order) { /* ... */ }
}
class OrderService {
    private MySqlOrderRepository repo = new MySqlOrderRepository();
    void placeOrder(Order order) { repo.save(order); }
}
```

```java
// ✅ Both depend on an abstraction; repository implementation is injected
interface OrderRepository {
    void save(Order order);
}
class MySqlOrderRepository implements OrderRepository {
    public void save(Order order) { /* ... */ }
}
class OrderService {
    private final OrderRepository repo;
    OrderService(OrderRepository repo) { this.repo = repo; } // constructor injection
    void placeOrder(Order order) { repo.save(order); }
}
```

> 💡 Interview tip: this is *why* you always inject dependencies via constructor
> in your LLD code instead of `new`-ing them up inside a class. If you `new` up
> a concrete class inside another class's method body, expect to be asked
> "how would you unit test this in isolation?" — that question is DIP in disguise.

## How these map to patterns (preview)

- OCP + DIP → Strategy pattern (swap algorithms without touching the caller)
- SRP → Facade pattern (one class per responsibility, facade coordinates them)
- LSP → correct use of inheritance hierarchies, Template Method pattern
- DIP → Factory pattern (caller depends on an interface, factory decides the concrete class)

Next: [../01-uml/](../01-uml/) for how to sketch these designs on a whiteboard,
then [../02-design-patterns/](../02-design-patterns/) to see each pattern in a full example.
