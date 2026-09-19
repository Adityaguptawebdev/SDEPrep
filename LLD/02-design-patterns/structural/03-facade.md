# Facade Pattern

> **Standard definition**: Provide a unified, higher-level interface to a set of interfaces in a subsystem, making the subsystem easier to use.

**Ek line mein**: Ek complex system ke aage ek **simple, single entry-point**
class laga do, taaki caller ko andar ke saare complicated parts se deal na
karna pade.

**Yaad rakhne ka trick**: **"Hotel ka reception desk"** — tumhe room chahiye,
food chahiye, laundry chahiye — tum sirf reception ko bolte ho, wo andar hi
andar housekeeping, kitchen, laundry department se baat karke sab karwa deta
hai. Tumhe in departments se seedha baat nahi karni padti.

**Real life example**: Movie dekhna hai — `Projector` on karna, `Lights`
dim karni, `SoundSystem` on karna, `Screen` neeche karna. Ye 4 alag systems
hain. `HomeTheaterFacade` bana do jisme ek hi method ho: `watchMovie()`.

## Problem (pattern ke bina)

```java
// Caller ko khud sab systems ka order aur detail pata hona chahiye
Projector projector = new Projector();
Lights lights = new Lights();
SoundSystem sound = new SoundSystem();
Screen screen = new Screen();

screen.down();
lights.dim(10);
projector.on();
sound.setVolume(20);
// Har baar movie dekhni ho, ye 5 lines kahi bhi repeat karni padengi
```

## Solution — Java code, line by line

```java
// Ye saari classes waisi hi rehti hain, inko chhedte nahi
class Projector { void on() { System.out.println("Projector ON"); } }
class Lights { void dim(int level) { System.out.println("Lights dimmed to " + level); } }
class SoundSystem { void setVolume(int vol) { System.out.println("Volume set to " + vol); } }
class Screen { void down() { System.out.println("Screen down"); } }

// Facade — ek simple class jo andar hi andar sab coordinate karti hai
class HomeTheaterFacade {
    private final Projector projector = new Projector();
    private final Lights lights = new Lights();
    private final SoundSystem sound = new SoundSystem();
    private final Screen screen = new Screen();

    // Caller ke liye sirf yehi ek method — poora complex sequence andar hi hai
    public void watchMovie() {
        screen.down();
        lights.dim(10);
        projector.on();
        sound.setVolume(20);
        System.out.println("Movie shuru!");
    }
}
```

**Use kaise karenge:**
```java
HomeTheaterFacade theater = new HomeTheaterFacade();
theater.watchMovie();   // ek hi call, poora sequence andar ho gaya
```

**Kya ho raha hai samjho:**
1. `Projector`, `Lights`, `SoundSystem`, `Screen` — ye sab **waise ke waise**
   hain, inme koi change nahi kiya. Facade inhe chhupata nahi, sirf **coordinate** karta hai.
2. `HomeTheaterFacade` andar hi andar in sab classes ke objects rakhta hai
   aur sahi order mein call karta hai.
3. Caller ko in 4 classes ke naam tak yaad nahi rakhne — bas `watchMovie()`.

> 💡 **Facade vs Adapter mein confusion na ho**: Adapter "interface match
> nahi karta" wali problem solve karta hai (translator). Facade "bahut saari
> cheezein hain, simple karna hai" wali problem solve karta hai (simplifier).
> Facade kisi cheez ko replace nahi karta, sirf **wraps a bunch of calls
> together**.

## Kab use karo
- Jab kisi complex subsystem (multiple classes, specific order) ko baar baar use karna ho
- Jab caller ko subsystem ki internal details se bachana ho (loose coupling)

## LLD problems mein kaha milega
- Order placement flow (Inventory check + Payment + Notification + Shipping — sab ek `OrderFacade.placeOrder()` ke andar)
- Any "checkout" ya "onboarding" flow jisme multiple systems involve hote hain

Agla: [04-composite.md](04-composite.md)
