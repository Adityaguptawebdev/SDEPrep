# State Pattern

> **Standard definition**: Allow an object to alter its behavior when its internal state changes — the object will appear to change its class.

**Ek line mein**: Object ka behavior uski **current state** ke hisaab se
badalna chahiye — aur har state apni khud ki class ho, taaki `if (state == X)`
jaisi lambi chains na likhni padein.

**Yaad rakhne ka trick**: **"Traffic signal"** — Red state mein "Stop" hota
hai, Green state mein "Go" hota hai. Signal khud badalta hai state ke saath
behavior — driver ko har baar poori "agar red hai toh... agar green hai
toh..." list nahi sochni padti, bas current light dekhta hai.

**Real life example**: `VendingMachine` — `NoCoin` state mein coin insert
hone tak "select item" nahi karne dega. `HasCoin` state mein select karne
dega. Har state mein allowed actions alag hain.

## Problem (pattern ke bina)

```java
class VendingMachine {
    String state = "NO_COIN";

    void insertCoin() {
        if (state.equals("NO_COIN")) {
            state = "HAS_COIN";
        } else if (state.equals("HAS_COIN")) {
            System.out.println("Coin already hai");
        }
        // har action (insertCoin, selectItem, dispense) ke andar
        // saari states ke liye if-else likhna padega — bahut messy
    }

    void selectItem() {
        if (state.equals("HAS_COIN")) {
            state = "DISPENSING";
        } else if (state.equals("NO_COIN")) {
            System.out.println("Pehle coin daalo");
        }
    }
}
```

## Solution — Java code, line by line

```java
// Step 1: State ka contract — har state mein ye actions available hain
interface State {
    void insertCoin(VendingMachine machine);
    void selectItem(VendingMachine machine);
}

// Step 2: har state apni class mein, apna hi behavior define karti hai
class NoCoinState implements State {
    public void insertCoin(VendingMachine machine) {
        System.out.println("Coin dala gaya");
        machine.setState(machine.getHasCoinState());   // 🔑 state khud agli state pe switch karti hai
    }
    public void selectItem(VendingMachine machine) {
        System.out.println("Pehle coin daalo!");
    }
}

class HasCoinState implements State {
    public void insertCoin(VendingMachine machine) {
        System.out.println("Coin already hai");
    }
    public void selectItem(VendingMachine machine) {
        System.out.println("Item dispense ho raha hai");
        machine.setState(machine.getNoCoinState());     // kaam hone ke baad wapas NoCoin
    }
}

// Step 3: VendingMachine — apni current state ko hold karti hai, kaam use delegate karti hai
class VendingMachine {
    private State noCoinState = new NoCoinState();
    private State hasCoinState = new HasCoinState();
    private State currentState = noCoinState;   // shuru mein NoCoin state

    public void setState(State state) { this.currentState = state; }
    public State getNoCoinState() { return noCoinState; }
    public State getHasCoinState() { return hasCoinState; }

    // VendingMachine khud kuch decide nahi karti — current state ko hi puch leti hai
    public void insertCoin() { currentState.insertCoin(this); }
    public void selectItem() { currentState.selectItem(this); }
}
```

**Use kaise karenge:**
```java
VendingMachine machine = new VendingMachine();

machine.selectItem();    // "Pehle coin daalo!" (kyunki abhi NoCoinState hai)
machine.insertCoin();    // "Coin dala gaya" (ab HasCoinState ban gaya)
machine.selectItem();    // "Item dispense ho raha hai" (wapas NoCoinState)
```

**Kya ho raha hai samjho:**
1. `VendingMachine` ke andar koi `if (state.equals(...))` nahi hai — usse
   sirf `currentState.insertCoin(this)` bolna hai, **jo bhi current state
   hai wahi decide karegi kya hona chahiye**.
2. Har state class ko pata hai "mujhse ye action aaye toh mujhe agli kaunsi
   state pe jana hai" (`machine.setState(...)`) — **transition logic bhi
   state ke andar hi hai**, machine ke andar nahi.
3. Naya state add karna ho (`OutOfStockState`) — bas nayi class banao aur
   jaha se applicable ho waha transition kara do — purani states ka code nahi chhedna.

> 💡 **State vs Strategy yaad rakhne ka final trick**:
> - **Strategy**: *caller* bahar se decide karta hai konsa algorithm chalega (`setStrategy(new Upi())`).
> - **State**: *object khud*, apni situation ke hisaab se, apna behavior badalta hai — caller ko pata bhi nahi chalta.
> Dono ka code-structure same dikhta hai (interface + multiple implementations), fark sirf **kaun decide kar raha hai** usme hai.

## Kab use karo
- Jab object ka behavior uski state pe depend karta hai, aur states ke beech transitions well-defined hain
- Jab ek hi method (`insertCoin`, `selectItem`) mein state ke hisaab se `if-else` ki lambi chain lag rahi ho

## LLD problems mein kaha milega
- Vending Machine, Traffic Signal, ATM (states: Idle, CardInserted, PinEntered...), Order status (Placed → Shipped → Delivered)

Agla: [04-command.md](04-command.md)
