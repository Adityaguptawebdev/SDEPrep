# Observer Pattern

> **Standard definition**: Define a one-to-many dependency between objects so that when one object (subject) changes state, all its dependents (observers) are notified and updated automatically.

**Ek line mein**: Ek object (`Subject`) mein kuch badle, toh usse "subscribe"
kiye hue saare doosre objects (`Observers`) ko **automatically** pata chal
jaye — bina Subject ko har observer ka naam individually yaad rakhne ki
zarurat pade.

**Yaad rakhne ka trick**: **"YouTube channel subscribe karna"** — channel
(Subject) naya video daalta hai, sab subscribers (Observers) ko notification
mil jaati hai. Channel ko har subscriber ka phone number yaad nahi rakhna
padta — bas ek list hai subscribers ki, jab bhi kuch naya aaye sabko bata do.

**Real life example**: Stock price badalne pe — jitne bhi log us stock ko
"watch" kar rahe hain, sabki app mein price update ho jaye.

## Problem (pattern ke bina)

```java
class Stock {
    void priceChanged(double newPrice) {
        // Stock ko khud pata hona chahiye kaunsi-kaunsi screens/apps ko update karna hai
        mobileApp.updatePrice(newPrice);
        webApp.updatePrice(newPrice);
        smsAlert.send(newPrice);
        // naya observer add hua (jaise EmailAlert) toh yahi method edit karna padega
    }
}
```

## Solution — Java code, line by line

```java
// Step 1: Observer ka contract — "update mile toh kya karna hai"
interface Observer {
    void update(double price);
}

// Step 2: Subject (jo observe kiya ja raha hai)
class Stock {
    private List<Observer> observers = new ArrayList<>();  // 🔑 subscribers ki list
    private double price;

    public void subscribe(Observer o) {
        observers.add(o);     // koi bhi naya observer khud ko yaha jod sakta hai
    }

    public void unsubscribe(Observer o) {
        observers.remove(o);
    }

    public void setPrice(double newPrice) {
        this.price = newPrice;
        notifyAllObservers();  // price badli, sabko batao
    }

    private void notifyAllObservers() {
        for (Observer o : observers) {
            o.update(price);   // 🔑 Stock ko fark nahi padta observer kaun hai, sabko same call
        }
    }
}

// Step 3: alag alag observers, jo apna apna kaam karte hain update milne pe
class MobileApp implements Observer {
    public void update(double price) {
        System.out.println("Mobile App: price updated to " + price);
    }
}

class SmsAlert implements Observer {
    public void update(double price) {
        System.out.println("SMS bheja: naya price " + price);
    }
}
```

**Use kaise karenge:**
```java
Stock stock = new Stock();

Observer mobile = new MobileApp();
Observer sms = new SmsAlert();

stock.subscribe(mobile);
stock.subscribe(sms);

stock.setPrice(150.5);
// dono ko automatically update mila:
// "Mobile App: price updated to 150.5"
// "SMS bheja: naya price 150.5"
```

**Kya ho raha hai samjho:**
1. `Stock` (Subject) ke paas sirf ek generic list hai `List<Observer>` — usse
   koi fark nahi padta andar `MobileApp` hai ya `SmsAlert`, sabko wahi
   `update()` call milega.
2. Naya observer (`EmailAlert`) add karna ho — `Stock` class ka **ek line
   bhi nahi badalta**, bas `stock.subscribe(new EmailAlert())` kar do.
3. `notifyAllObservers()` hi is pattern ka core hai — ek jagah se sabko
   automatically inform ho jata hai.

> 💡 **Real-world Java mein**: Java ka apna GUI event system (`button.addActionListener(...)`),
> ya kisi bhi Pub-Sub system (Kafka topics, RxJava) isi Observer pattern ka
> bada version hai. Jaha bhi "X hoga toh Y ko batao" sunayi de, Observer yaad karo.

## Kab use karo
- Jab ek event/change hone pe multiple, **unknown-in-advance** number of listeners ko react karna ho
- Jab Subject aur Observers ko loosely coupled rakhna ho (Subject ko Observer ki concrete class ka pata na ho)

## LLD problems mein kaha milega
- Stock price alerts, News feed subscription
- Notification systems (jab order status badle, sab related services ko batana)
- Chat apps (message aaya, sab connected clients ko update)

Agla: [03-state.md](03-state.md)
