# Decorator Pattern

**Ek line mein**: Kisi object ke upar naye features "layer by layer" wrap
karke add karo, bina uski original class ko chhede aur bina naye subclasses
ke dher lagaye.

**Yaad rakhne ka trick**: **"Coffee ke upar toppings"** — plain coffee lo,
upar chocolate daalo, upar whipped cream daalo. Har topping coffee ko
**wrap** kar rahi hai, coffee ki asli class change nahi ho rahi.

**Real life example**: `Pizza` jisme `Cheese`, `Olives`, `Mushroom` toppings
add karni hain. Agar har combination ke liye alag class banao
(`CheesePizza`, `CheeseOlivePizza`, `CheeseOliveMushroomPizza`...) — classes
ka explosion ho jayega.

## Problem (pattern ke bina)

```java
// ❌ Har combination ke liye naya subclass — bahut zyada classes ban jayengi
class Pizza { double cost() { return 100; } }
class CheesePizza extends Pizza { double cost() { return 120; } }
class CheeseOlivePizza extends Pizza { double cost() { return 140; } }
class CheeseOliveMushroomPizza extends Pizza { double cost() { return 160; } }
// 3 toppings ke sab combinations = 8 classes! 5 toppings = 32 classes!!
```

## Solution — Java code, line by line

```java
// Step 1: common interface jo Pizza aur toppings dono follow karenge
interface Pizza {
    double cost();
}

// Step 2: base pizza — bina kisi topping ke
class PlainPizza implements Pizza {
    public double cost() { return 100; }
}

// Step 3: "Decorator" — khud bhi Pizza hai, AUR andar ek Pizza rakhta hai (wrap karta hai)
abstract class ToppingDecorator implements Pizza {
    protected Pizza wrappedPizza;   // jis pizza ko wrap kar rahe hain

    ToppingDecorator(Pizza pizza) {
        this.wrappedPizza = pizza;
    }
}

// Step 4: har topping, purani cost ke upar apni cost add karke return karti hai
class Cheese extends ToppingDecorator {
    Cheese(Pizza pizza) { super(pizza); }
    public double cost() {
        return wrappedPizza.cost() + 20;   // andar wale pizza ki cost + cheese ki cost
    }
}

class Olives extends ToppingDecorator {
    Olives(Pizza pizza) { super(pizza); }
    public double cost() {
        return wrappedPizza.cost() + 15;
    }
}
```

**Use kaise karenge:**
```java
Pizza myPizza = new Olives(new Cheese(new PlainPizza()));
System.out.println(myPizza.cost());  // 100 + 20 + 15 = 135
```

**Kya ho raha hai samjho (andar se bahar padho):**
1. `new PlainPizza()` — sabse andar, base pizza, cost = 100.
2. `new Cheese(...)` — isse **wrap** kar diya. Ab `Cheese` object hai jiske
   andar `PlainPizza` chhupa hai. `cost()` call hoga toh: pehle andar wale
   (`PlainPizza`) ka cost lega (100), phir apna 20 jodega = 120.
3. `new Olives(...)` — isne pichhle pure `Cheese(PlainPizza)` combo ko wrap
   kar liya. `cost()`: andar wale ka cost lega (120), apna 15 jodega = 135.

Jitni marzi toppings, bas **layers badhti jayengi**, koi nayi class nahi
chahiye combination ke liye — kyunki har topping khud independent hai.

> 💡 **Trick yaad rakhne ki**: Decorator hamesha **"same interface implement
> karta hai jisko wrap kar raha hai"** — isliye ek Decorator ke upar dusra
> Decorator bhi laga sakte ho (jaise `Olives(Cheese(PlainPizza))`), aur bahar
> se sabko sirf `Pizza` hi dikhta hai.

## Kab use karo
- Jab combinations bahut ho sakte hain aur har combination ke liye subclass banana impractical hai
- Jab feature ko runtime pe add/remove karna ho (compile time pe fix nahi)

## LLD problems mein kaha milega
- Pizza/Burger builder with toppings
- Java ka apna `BufferedReader(new FileReader(...))` isi pattern pe bana hai!
- Notification with multiple channels (Email + SMS dono chahiye)

Agla: [03-facade.md](03-facade.md)
