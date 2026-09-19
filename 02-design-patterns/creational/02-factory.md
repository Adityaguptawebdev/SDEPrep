# Factory Pattern

**Ek line mein**: Object banane ka kaam ek alag "factory" class ko de do,
caller ko sirf ye pata ho "mujhe X chahiye", "kaise banega" uska sar dard
factory ka hai.

**Yaad rakhne ka trick**: "Restaurant mein order dete ho 'Pizza chahiye',
tumhe fark nahi padta kitchen mein kaunsa chef banata hai — waha se ban ke aata hai."

**Real life example**: Notification system — kabhi Email bhejna hai, kabhi SMS,
kabhi Push notification. Caller ko sirf "notification bhejo" bolna hai,
factory decide karegi kaunsi concrete class use karni hai.

## Problem (pattern ke bina)

```java
// Caller ko khud pata hona chahiye kaunsi class banani hai — aur har jagah 'if' likhna padega
void sendNotification(String type) {
    if (type.equals("EMAIL")) {
        EmailNotification n = new EmailNotification();
        n.send();
    } else if (type.equals("SMS")) {
        SmsNotification n = new SmsNotification();
        n.send();
    }
    // naya type aaya toh yaha aur is jaisi har jagah 'if' badhana padega — OCP violation!
}
```

## Solution — Java code, line by line

```java
// Step 1: common interface — sabko "send" karna hi hai, kaise karna hai apna apna
interface Notification {
    void send();
}

class EmailNotification implements Notification {
    public void send() { System.out.println("Email bheja"); }
}

class SmsNotification implements Notification {
    public void send() { System.out.println("SMS bheja"); }
}

// Step 2: factory class — object banane ka SAARA kaam yaha centralize hai
class NotificationFactory {
    public static Notification create(String type) {
        switch (type) {
            case "EMAIL": return new EmailNotification();
            case "SMS":   return new SmsNotification();
            default: throw new IllegalArgumentException("Unknown type: " + type);
        }
    }
}
```

**Use kaise karenge:**
```java
Notification n = NotificationFactory.create("EMAIL");
n.send();
// Caller ko EmailNotification class ka naam tak nahi pata — sirf interface pata hai
```

**Kya ho raha hai samjho:**
1. `Notification` interface — ye "menu card" hai (abstraction note yaad karo).
2. `NotificationFactory.create()` — **ek hi jagah** hai jaha `if/switch` likha
   hai. Baaki poore codebase mein kahi bhi `if (type.equals(...))` nahi milega.
3. Caller sirf `NotificationFactory.create("EMAIL")` bolta hai — usse fark
   nahi padta konsi class ke andar kya code hai.

**Fark Factory vs sirf "if-else" mein**: Bina factory ke, har jagah jaha
notification chahiye waha `if-else` copy-paste hota. Factory se ye logic
**ek hi jagah** hai — naya type add karne pe sirf factory ka ek `case` badhega.

> 💡 Ye pura pattern dekho — ye SOLID ke **DIP** (interface pe depend karo)
> aur **OCP** (naya type = naya class, purana code na chhedo) ka direct
> application hai. Interview mein bol sakte ho: *"Factory se object-creation
> ka concern caller se alag ho gaya, isse OCP follow hota hai."*

## Kab use karo
- Jab object banane ka logic complex ho ya condition-based ho (kaunsi class banani hai ye decide karna padta ho)
- Jab caller ko concrete class ka naam bhi pata nahi hona chahiye

## LLD problems mein kaha milega
- Vehicle Factory (Parking Lot problem mein Car/Bike/Truck banane ke liye)
- Shape Factory, Document Factory, Payment Gateway Factory

Agla: [03-builder.md](03-builder.md)
