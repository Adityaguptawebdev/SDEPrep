# LLD 6 — OOP Modelling Questions (small "design the classes" asks)

**Easy analogy — family tree**: Kaun kiska bachcha hai (inheritance), kiske paas kya hai (composition), aur kaun kya kar sakta hai (interfaces). Model sahi ho toh code apne aap saaf likhta hai.

## 1. Herbivores, carnivores, omnivores (new grad, selected)

> **Source**: "Kingdom inheritance problem involving herbivores, carnivores and omnivores with shared and distinct attributes" ([GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), Jan 2024, NCG round 2). Frequency: LOW.

**What they test**: shared state → abstract class; "can do" behaviour → interfaces; omnivore = both → the **diamond problem** with default methods.

```
            Animal (abstract: name, legs, describe())
           /        |          \
        Cow       Tiger        Bear
     implements  implements   implements Herbivore AND Carnivore
     Herbivore   Carnivore    → must resolve the clash of food() (diamond)
```

```java
import java.util.List;

abstract class Animal {
    protected final String name;
    protected final int legs;
    Animal(String name, int legs) { this.name = name; this.legs = legs; }
    abstract String food();                                         // each animal must say what it eats
    String describe() { return name + " (" + legs + " legs) eats " + food(); }
}

interface Herbivore { default String food() { return "plants"; } }
interface Carnivore { default String food() { return "meat"; } }

class Cow extends Animal implements Herbivore {
    Cow() { super("Cow", 4); }
    @Override public String food() { return Herbivore.super.food(); }
}

class Tiger extends Animal implements Carnivore {
    Tiger() { super("Tiger", 4); }
    @Override public String food() { return Carnivore.super.food(); }
}

class Bear extends Animal implements Herbivore, Carnivore {        // both defaults clash → must override
    Bear() { super("Bear", 4); }
    @Override public String food() { return Herbivore.super.food() + " and " + Carnivore.super.food(); }

    public static void main(String[] args) {
        for (Animal a : List.<Animal>of(new Cow(), new Tiger(), new Bear())) System.out.println(a.describe());
        System.out.println("Bear is a Carnivore? " + (new Bear() instanceof Carnivore));
    }
}
```

```text
Cow (4 legs) eats plants
Tiger (4 legs) eats meat
Bear (4 legs) eats plants and meat
Bear is a Carnivore? true
```

**🗣️ Interview mein aise bolo**: "Common state (naam, legs) abstract class mein, behaviour (khaana) interfaces mein. Omnivore dono implement karta hai — dono default methods clash karte hain, toh Java force karta hai override karo; `X.super.food()` se dono combine kar deta hoon."

## 2. Other small modelling asks (links to where they're solved)

| Ask | Source | Where |
|---|---|---|
| Custom stack with strict encapsulation | [LC-6753253](https://leetcode.com/discuss/post/6753253/visa-sde1-315-lpa-6-month-15-year-exp-oa-5asi/) (**EC**) | [DSA 4 §2](../03-dsa/04-linked-list-stack-heap-sorting.md#2-custom-stack-with-encapsulation) |
| Product class with CRUD operations (Spring) | [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/) | [Spring 2 §2](../05-spring-boot/02-rest-apis-filters-exceptions.md#2-a-crud-rest-controller-the-product-with-crud-operations-question) |
| Payment methods (card/UPI/wallet) via interface | OOP examples | [Java 1 §1](../04-java/01-oop-and-class-design.md#1-the-4-pillars--with-real-examples-high) |
| Splitwise LLD ("a split situation") | [LC-1827912](https://leetcode.com/discuss/post/1827912/visa-sr-software-engineer-bangalore-2022-h887/) (Senior) | repo: [LLD/03-problems/09-splitwise](../../../LLD/03-problems/09-splitwise.md) |
| Restaurant reservation (LLD + data modelling, "classes, interfaces, constants only") | [LC-1510140](https://leetcode.com/discuss/post/1510140/visa-sse-4-yr-blr-by-user7518i-xrn3/) (Senior, 2021) | sketch below |

**Restaurant reservation — 2-minute sketch**
```
 Restaurant 1──* Table(id, capacity)        TimeSlot(start, end)
 Reservation(id, customer, table, slot, partySize, status: BOOKED|CANCELLED|SEATED|NO_SHOW)
 ReservationService.book(partySize, slot) → smallest free table with capacity ≥ partySize
 Concurrency: UNIQUE(table_id, slot_start) in the reservation table (DB prevents double booking)
 Extensible: TableAllocationStrategy (smallest-fit, combine tables), NotificationListener (Observer)
```

Back to [LLD index](README.md) · Next: [09 — JavaScript / React →](../09-javascript-react/README.md)
