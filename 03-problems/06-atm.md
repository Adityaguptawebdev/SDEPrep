# Problem 6: ATM Machine

## Interview mein aise approach karo

**Clarifying questions:**
- Withdraw, deposit, balance check — sab chahiye ya sirf withdraw?
- Cash denominations kya kya hongi (₹2000, ₹500, ₹100)?
- Wrong PIN 3 baar galat ho toh card block?

**Assume**: Withdraw + balance check, standard denominations, 3 wrong PIN attempts pe card retain.

**Nouns**: ATM, Card, Account, Bank, CashDispenser, State (Idle/HasCard/HasPin/...).

**Do bade signals:**
1. "ATM ka behavior current step (card dala, pin dala, amount select kiya) ke hisaab se badalta hai" → **State pattern**
2. "₹2000 ka note nahi hai toh ₹500 try karo, phir ₹100" → **Chain of Responsibility** (already dekha: [behavioral/05-chain-of-responsibility.md](../02-design-patterns/behavioral/05-chain-of-responsibility.md))

---

## Chain of Responsibility — Cash Dispensing (pehle isse samjho, simple hai)

```java
abstract class CashDispenserHandler {
    protected CashDispenserHandler next;
    public void setNext(CashDispenserHandler next) { this.next = next; }
    public abstract void dispense(int amount);
}

class ThousandDispenser extends CashDispenserHandler {
    public void dispense(int amount) {
        int numNotes = amount / 2000;
        int remainder = amount % 2000;
        if (numNotes > 0) System.out.println(numNotes + " note(s) of ₹2000");
        if (remainder != 0 && next != null) next.dispense(remainder);  // baaki agle handler ko
    }
}

class FiveHundredDispenser extends CashDispenserHandler {
    public void dispense(int amount) {
        int numNotes = amount / 500;
        int remainder = amount % 500;
        if (numNotes > 0) System.out.println(numNotes + " note(s) of ₹500");
        if (remainder != 0 && next != null) next.dispense(remainder);
    }
}

class HundredDispenser extends CashDispenserHandler {
    public void dispense(int amount) {
        int numNotes = amount / 100;
        if (numNotes > 0) System.out.println(numNotes + " note(s) of ₹100");
        // ye chain ka aakhri handler hai (assume amount hamesha 100 ka multiple hai)
    }
}
```

```java
// chain set up: 2000 -> 500 -> 100
CashDispenserHandler dispenser = new ThousandDispenser();
dispenser.setNext(new FiveHundredDispenser());
((ThousandDispenser) dispenser).next.setNext(new HundredDispenser());

dispenser.dispense(3700);
// "1 note(s) of ₹2000" -> baaki 1700 agle ko
// "3 note(s) of ₹500"  -> baaki 200 agle ko
// "2 note(s) of ₹100"
```

## Account — bank ka data

```java
class Account {
    private String accountNumber;
    private double balance;
    private String correctPin;

    Account(String accountNumber, double balance, String pin) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.correctPin = pin;
    }

    public boolean validatePin(String pin) { return correctPin.equals(pin); }
    public boolean hasSufficientBalance(double amount) { return balance >= amount; }
    public void debit(double amount) { balance -= amount; }
    public double getBalance() { return balance; }
}
```

## State Pattern — ATM ka flow

```java
interface ATMState {
    void insertCard(ATM atm, Account account);
    void enterPin(ATM atm, String pin);
    void selectWithdrawAmount(ATM atm, int amount);
}
```

```java
class IdleState implements ATMState {
    public void insertCard(ATM atm, Account account) {
        atm.setCurrentAccount(account);
        atm.setState(atm.getHasCardState());
    }
    public void enterPin(ATM atm, String pin) { System.out.println("Pehle card dalo"); }
    public void selectWithdrawAmount(ATM atm, int amount) { System.out.println("Pehle card dalo"); }
}

class HasCardState implements ATMState {
    public void insertCard(ATM atm, Account account) { System.out.println("Card already hai"); }

    public void enterPin(ATM atm, String pin) {
        if (atm.getCurrentAccount().validatePin(pin)) {
            atm.setState(atm.getHasPinState());
        } else {
            atm.incrementWrongAttempts();
            if (atm.getWrongAttempts() >= 3) {
                System.out.println("3 baar galat PIN — card retain ho gaya");
                atm.setState(atm.getIdleState());
            } else {
                System.out.println("Galat PIN, phir try karo");
            }
        }
    }
    public void selectWithdrawAmount(ATM atm, int amount) { System.out.println("Pehle PIN daalo"); }
}

class HasPinState implements ATMState {
    public void insertCard(ATM atm, Account account) { System.out.println("Card already hai"); }
    public void enterPin(ATM atm, String pin) { System.out.println("PIN already verify ho chuka"); }

    public void selectWithdrawAmount(ATM atm, int amount) {
        Account account = atm.getCurrentAccount();
        if (!account.hasSufficientBalance(amount)) {
            System.out.println("Balance kam hai");
            return;
        }
        account.debit(amount);
        atm.getDispenser().dispense(amount);   // 🔑 Chain of Responsibility yahan use hota hai
        atm.setState(atm.getIdleState());      // transaction khatam, card nikal do
    }
}
```

## ATM — states hold karta hai, orchestrate karta hai

```java
class ATM {
    private ATMState idleState = new IdleState();
    private ATMState hasCardState = new HasCardState();
    private ATMState hasPinState = new HasPinState();
    private ATMState currentState = idleState;

    private Account currentAccount;
    private int wrongAttempts = 0;
    private CashDispenserHandler dispenser;

    ATM(CashDispenserHandler dispenser) { this.dispenser = dispenser; }

    public void insertCard(Account account) { currentState.insertCard(this, account); }
    public void enterPin(String pin) { currentState.enterPin(this, pin); }
    public void withdraw(int amount) { currentState.selectWithdrawAmount(this, amount); }

    // getters/setters
    public void setState(ATMState s) { this.currentState = s; }
    public ATMState getIdleState() { return idleState; }
    public ATMState getHasCardState() { return hasCardState; }
    public ATMState getHasPinState() { return hasPinState; }
    public Account getCurrentAccount() { return currentAccount; }
    public void setCurrentAccount(Account a) { this.currentAccount = a; }
    public void incrementWrongAttempts() { wrongAttempts++; }
    public int getWrongAttempts() { return wrongAttempts; }
    public CashDispenserHandler getDispenser() { return dispenser; }
}
```

**Kya ho raha hai samjho:** Poora flow (`insertCard → enterPin → withdraw`)
current `ATMState` ko delegate hai — jaisa Vending Machine mein tha waisa
hi structure. Jab paisa nikalna hota hai, `HasPinState` andar hi andar
`dispenser.dispense(amount)` bulata hai — **Chain of Responsibility** yahan
decide karta hai kaunse notes milenge, `ATM` ya `ATMState` ko denominations
ka logic bilkul nahi pata.

## Patterns used & why
- **State** — ATM ka multi-step flow clean state transitions se ban gaya
- **Chain of Responsibility** — denomination-wise cash dispensing, naya denomination add karna ho toh bas chain mein ek handler aur jod do

## Extensibility — interview mein bolne wali baatein
- "Deposit feature add karna ho toh ek naya action `deposit(atm, amount)` interface mein add hoga, sab states usko implement karengi."
- "Naya note (₹200) aaye toh chain mein bas ek `TwoHundredDispenser` handler jod dunga, order matter karta hai (bade se chhote)."

Agla: [07-snake-and-ladder.md](07-snake-and-ladder.md)
