# Singleton Pattern

**Ek line mein**: Poore program mein is class ka sirf **ek hi object** banega,
sabko wahi ek object milega.

**Yaad rakhne ka trick**: "Sarkar ek hi hoti hai desh mein" — jaise `President`
ka ek hi office hota hai, do log ek saath President nahi ban sakte.

**Real life example**: Printer Spooler, Database Connection Pool, Logger —
inke multiple instances banoge toh conflict/waste hoga. Ek `Logger` object
poore app mein file mein likh raha ho, agar 5 alag `Logger` objects bane toh
sab apni jagah likhne ki koshish karenge — mess ho jayega.

## Problem (pattern ke bina)

```java
class Logger {
    public Logger() { /* file open karta hai */ }
    public void log(String msg) { /* file mein likhta hai */ }
}

// Kahi bhi koi bhi naya Logger bana sakta hai — control nahi hai
Logger l1 = new Logger();
Logger l2 = new Logger();  // ye nahi hona chahiye tha, same file do baar khul gayi
```

## Solution — Java code, line by line

```java
public class Logger {

    // Step 1: class ka ek hi static object rakho, andar hi andar
    private static Logger instance;

    // Step 2: constructor ko PRIVATE karo — bahar se koi 'new Logger()' na kar sake
    private Logger() {
        System.out.println("Logger file khol raha hai...");
    }

    // Step 3: object lene ka sirf yehi ek raasta do
    public static Logger getInstance() {
        if (instance == null) {          // pehli baar mangte waqt hi banao
            instance = new Logger();
        }
        return instance;                 // baad mein hamesha wahi purana object do
    }

    public void log(String msg) {
        System.out.println("LOG: " + msg);
    }
}
```

**Use kaise karenge:**
```java
Logger logger1 = Logger.getInstance();
Logger logger2 = Logger.getInstance();
// logger1 aur logger2 dono EK HI object hain
System.out.println(logger1 == logger2);  // true
```

**Kya ho raha hai samjho:**
1. `private static Logger instance` — is variable ki jagah class-level pe hai, object-level pe nahi. Isliye ye sabke beech shared rehta hai.
2. `private Logger()` — bahar se `new Logger()` likhoge toh **compile error** aayega. Object banane ka sirf ek control point hai: `getInstance()`.
3. `if (instance == null)` — ye check hi Singleton ka dil hai: sirf pehli baar banega, uske baad wahi purana object return hoga.

> 💡 **Multithreading ka gotcha (interview mein pucha jata hai)**: Agar 2 threads
> ek saath `getInstance()` call karein jab `instance` abhi `null` hai, dono ke liye
> `instance == null` true nikal sakta hai aur **do objects ban sakte hain**! Fix:
> ```java
> public static synchronized Logger getInstance() {
>     if (instance == null) instance = new Logger();
>     return instance;
> }
> ```
> `synchronized` keyword ek waqt mein sirf ek thread ko is method ke andar aane deta hai.

## Kab use karo
- Shared resource jiska ek hi instance hona chahiye: Logger, Config Manager, Connection Pool, Cache

## Kab NA use karo
- Agar future mein multiple instances ki zarurat pad sakti hai (jaise testing mein alag-alag fake objects chahiye) — Singleton testing ko mushkil bana deta hai kyunki state globally shared hoti hai.

## LLD problems mein kaha milega
- Parking Lot mein `ParkingLot` class khud Singleton hoti hai (ek hi parking lot object)
- Any "Manager"/"Registry" type class

Agla: [02-factory.md](02-factory.md)
