# Chain of Responsibility Pattern

**Ek line mein**: Ek request ko handlers ki ek **line/chain** mein bhejo —
har handler dekhta hai "kya main isse handle kar sakta hoon?", agar nahi
toh agle handler ko pass kar deta hai — jab tak koi handle na kar le.

**Yaad rakhne ka trick**: **"Customer care ka call transfer"** — pehle Level-1
support try karta hai, resolve na ho toh Level-2 ko transfer, wo bhi na kare
toh Level-3 (Manager) ko. Tumhe (caller ko) fark nahi padta kaun resolve
karega — bas request aage badhti jaati hai jab tak koi solve na kare.

**Real life example**: Leave approval system — Manager 2 din tak khud
approve kar sakta hai, usse zyada ho toh Director ko jaye, usse bhi zyada
ho toh VP ko.

## Problem (pattern ke bina)

```java
void approveLeave(int days) {
    if (days <= 2) {
        System.out.println("Manager ne approve kiya");
    } else if (days <= 7) {
        System.out.println("Director ne approve kiya");
    } else {
        System.out.println("VP ne approve kiya");
    }
    // naya approval level add karna ho (jaise CEO), yehi method edit karna padega
    // aur ye ek hi jagah pura logic bandha hua hai — testing/reuse mushkil
}
```

## Solution — Java code, line by line

```java
// Step 1: abstract handler — common structure jo har handler follow karega
abstract class Approver {
    protected Approver next;   // 🔑 chain mein agla handler kaun hai

    public void setNext(Approver next) {
        this.next = next;
    }

    public abstract void processLeave(int days);
}

// Step 2: har handler apna condition check karta hai,
// match na ho toh 'next' ko pass kar deta hai
class Manager extends Approver {
    public void processLeave(int days) {
        if (days <= 2) {
            System.out.println("Manager ne approve kiya");
        } else if (next != null) {
            next.processLeave(days);   // main nahi kar sakta, aage bhej do
        }
    }
}

class Director extends Approver {
    public void processLeave(int days) {
        if (days <= 7) {
            System.out.println("Director ne approve kiya");
        } else if (next != null) {
            next.processLeave(days);
        }
    }
}

class VP extends Approver {
    public void processLeave(int days) {
        System.out.println("VP ne approve kiya");  // chain ka aakhri banda — koi 'next' nahi
    }
}
```

**Use kaise karenge:**
```java
Approver manager = new Manager();
Approver director = new Director();
Approver vp = new VP();

// chain set up karo: Manager -> Director -> VP
manager.setNext(director);
director.setNext(vp);

manager.processLeave(1);    // "Manager ne approve kiya"
manager.processLeave(5);    // Manager pass kar dega -> "Director ne approve kiya"
manager.processLeave(15);   // Manager -> Director pass -> "VP ne approve kiya"
```

**Kya ho raha hai samjho:**
1. Request hamesha `manager.processLeave(days)` se shuru hoti hai — kaun
   asal mein approve karega, caller ko pata nahi hota, **chain khud decide
   karti hai**.
2. Har handler ka apna, chhota sa, independent condition hai — Manager ka
   code Director ke condition se bilkul alag/unaware hai.
3. Naya level add karna ho (`CEO` jo 15+ din approve kare) — bas nayi class
   banao aur chain mein jod do (`vp.setNext(ceo)`), purane handlers ka code nahi chhedna.

> 💡 **Trick pehchanne ki**: Jab bhi "multiple levels of checking/approval",
> "escalation", ya "pehle isse try karo, na ho toh agle ko do" jaisa sunayi
> de — Chain of Responsibility yaad karo.

> 💡 **Command se fark**: Command "ek action ko object banata hai" (kaun
> karega pata hai, sirf kab karna hai decide hota hai). Chain of Responsibility
> mein "kaun karega" khud tay nahi hota — request chain mein ghoomti hai
> jab tak koi le na le.

## Kab use karo
- Jab request ko multiple handlers try kar sakte hain, ek waqt mein koi ek hi handle karega
- Jab handlers ke beech loose coupling chahiye (ek doosre ko jaante nahi, bas 'next' pata hai)

## LLD problems mein kaha milega
- Leave/expense approval systems, Logging frameworks (DEBUG → INFO → ERROR handlers), Support ticket escalation, ATM cash dispensing (₹2000 note → ₹500 → ₹100 notes try karna)

---

## Sab patterns ho gaye — ab kya?

Poori theory (OOP + SOLID + UML + 9 Design Patterns) cover ho gayi hai.
Agla natural step hai **practice problems** (Parking Lot, Elevator, Splitwise
jaise) — jaha ye saare concepts ek saath use hote hain. Wo hum ek-ek karke,
saath baithke, step-by-step karenge (kyunki wahi jagah hai jaha code likhne
ki practice sabse zyada zaroori hai) — sab ek sath dump nahi karenge jaisa
theory mein kiya, taaki har problem achhe se samajh aaye.

Jab theory padh lo, batana — pehla practice problem (Parking Lot se
shuru karte hain, sabse aasan hai) saath mein karenge.
