# Problem 2: Vending Machine

## Interview mein aise approach karo

**Clarifying questions:**
- Coins/cash accept karega ya card bhi?
- Change return karna hai agar zyada paisa dala?
- Multiple items, multiple quantities track karni hai?

**Assume**: Coin-based, single item selection at a time, inventory limited hai (out of stock ho sakta hai).

**Nouns**: VendingMachine, Item, Inventory, State (NoCoin/HasCoin/Dispensing/OutOfStock).

**Sabse bada signal**: "machine ka behavior uske current situation (coin dala hai ya nahi, stock hai ya nahi) ke hisaab se badalta hai" → seedha **State pattern** yaad aana chahiye (already padha: [behavioral/03-state.md](../02-design-patterns/behavioral/03-state.md)). Isi problem ko wahan example ke roop mein use bhi kiya tha — ab poora system banate hain.

---

## Core Entities

```java
class Item {
    private String name;
    private double price;
    Item(String name, double price) { this.name = name; this.price = price; }
    public double getPrice() { return price; }
    public String getName() { return name; }
}
```

```java
class Inventory {
    private Map<Integer, Item> items = new HashMap<>();       // slot number -> item
    private Map<Integer, Integer> quantity = new HashMap<>(); // slot number -> kitne bache hain

    public void addItem(int slot, Item item, int qty) {
        items.put(slot, item);
        quantity.put(slot, qty);
    }
    public Item getItem(int slot) { return items.get(slot); }
    public boolean isAvailable(int slot) { return quantity.getOrDefault(slot, 0) > 0; }
    public void reduceStock(int slot) { quantity.put(slot, quantity.get(slot) - 1); }
}
```

## State Pattern — machine ka behavior state ke hisaab se

```java
interface State {
    void insertCoin(VendingMachine machine, double amount);
    void selectItem(VendingMachine machine, int slot);
    void dispense(VendingMachine machine);
}
```

```java
class NoCoinState implements State {
    public void insertCoin(VendingMachine machine, double amount) {
        machine.setBalance(amount);
        machine.setState(machine.getHasCoinState());   // 🔑 state transition
    }
    public void selectItem(VendingMachine machine, int slot) {
        System.out.println("Pehle coin daalo!");
    }
    public void dispense(VendingMachine machine) {
        System.out.println("Pehle coin daalo!");
    }
}
```

```java
class HasCoinState implements State {
    public void insertCoin(VendingMachine machine, double amount) {
        machine.setBalance(machine.getBalance() + amount);  // aur coin daala toh jod do
    }

    public void selectItem(VendingMachine machine, int slot) {
        if (!machine.getInventory().isAvailable(slot)) {
            System.out.println("Out of stock!");
            machine.setState(machine.getNoCoinState());   // paisa refund maan lo yahan
            return;
        }
        Item item = machine.getInventory().getItem(slot);
        if (machine.getBalance() < item.getPrice()) {
            System.out.println("Paise kam hain, aur daalo");
            return;
        }
        machine.setSelectedSlot(slot);
        machine.setState(machine.getDispensingState());   // ab dispense state mein jao
    }

    public void dispense(VendingMachine machine) {
        System.out.println("Pehle item select karo");
    }
}
```

```java
class DispensingState implements State {
    public void insertCoin(VendingMachine machine, double amount) {
        System.out.println("Dispense ho raha hai, thoda ruko");
    }
    public void selectItem(VendingMachine machine, int slot) {
        System.out.println("Dispense ho raha hai, thoda ruko");
    }
    public void dispense(VendingMachine machine) {
        int slot = machine.getSelectedSlot();
        Item item = machine.getInventory().getItem(slot);
        machine.getInventory().reduceStock(slot);

        double change = machine.getBalance() - item.getPrice();
        System.out.println(item.getName() + " nikal gaya. Change: " + change);

        machine.setBalance(0);
        machine.setState(machine.getNoCoinState());  // wapas shuru se
    }
}
```

## VendingMachine — states aur inventory ko hold karta hai

```java
class VendingMachine {
    private State noCoinState = new NoCoinState();
    private State hasCoinState = new HasCoinState();
    private State dispensingState = new DispensingState();
    private State currentState = noCoinState;

    private double balance = 0;
    private int selectedSlot;
    private Inventory inventory = new Inventory();

    // saari public actions — current state ko hi delegate karta hai
    public void insertCoin(double amount) { currentState.insertCoin(this, amount); }
    public void selectItem(int slot) { currentState.selectItem(this, slot); }
    public void dispense() { currentState.dispense(this); }

    // getters/setters jo states use karte hain
    public void setState(State s) { this.currentState = s; }
    public State getNoCoinState() { return noCoinState; }
    public State getHasCoinState() { return hasCoinState; }
    public State getDispensingState() { return dispensingState; }
    public double getBalance() { return balance; }
    public void setBalance(double b) { this.balance = b; }
    public int getSelectedSlot() { return selectedSlot; }
    public void setSelectedSlot(int s) { this.selectedSlot = s; }
    public Inventory getInventory() { return inventory; }
}
```

**Use kaise hoga:**
```java
VendingMachine machine = new VendingMachine();
machine.getInventory().addItem(1, new Item("Coke", 25), 5);

machine.insertCoin(30);
machine.selectItem(1);     // balance sufficient hai, DispensingState mein chala gaya
machine.dispense();        // "Coke nikal gaya. Change: 5.0"
```

## Patterns used & why
- **State** — sabse core pattern yahan. Machine ka behavior (`insertCoin`, `selectItem` ka result) puri tarah current state pe depend karta hai, aur transitions state ke andar hi likhe hain, `VendingMachine` class mein koi `if-else` nahi.

## Extensibility — interview mein bolne wali baatein
- "Card payment add karna ho toh `insertCoin` jaisa hi ek `payByCard()` action add hoga, states usko bhi handle karengi."
- "OutOfStockState alag se bhi bana sakta hoon agar us state mein bhi specific behavior chahiye (jaise sirf refund allowed ho)."

Agla: [03-tic-tac-toe.md](03-tic-tac-toe.md)
