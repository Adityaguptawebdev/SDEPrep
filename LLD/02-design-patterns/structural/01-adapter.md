# Adapter Pattern

> **Standard definition**: Convert the interface of a class into another interface clients expect, letting classes work together that couldn't otherwise because of incompatible interfaces.

**Ek line mein**: Do incompatible cheezon ke beech ek "translator" laga do,
taaki wo saath mein kaam kar sakein bina ek dusre ko change kiye.

**Yaad rakhne ka trick**: **"Plug converter"** — India ka charger US ke socket
mein seedha nahi lagta, beech mein ek adapter lagta hai jo shape convert kar
deta hai. Andar dono side ka current same hi hai, bas **interface (shape)
match nahi karta tha**.

**Real life example**: Tumhare paas purana `XmlParser` hai jo XML padhta hai,
lekin naya system sirf `JsonParser` interface expect karta hai. Dono ka kaam
same hai (data parse karna) par unka "shape" (method names/format) alag hai.

## Problem (pattern ke bina)

```java
// Purani, third-party class — isko edit nahi kar sakte (library ka code hai)
class OldXmlPrinter {
    void printAsXml(String data) {
        System.out.println("<data>" + data + "</data>");
    }
}

// Naya system isse expect karta hai:
interface Printer {
    void print(String data);
}

// OldXmlPrinter, Printer interface follow nahi karta — seedha use nahi kar sakte
```

## Solution — Java code, line by line

```java
// Step 1: naye system ka expected interface
interface Printer {
    void print(String data);
}

// Step 2: purani class — ye waisi hi rahegi, hum isse chhedenge nahi
class OldXmlPrinter {
    void printAsXml(String data) {
        System.out.println("<data>" + data + "</data>");
    }
}

// Step 3: Adapter — naye interface ko implement karta hai,
// andar purani class ka object rakh ke uske method ko call karta hai
class XmlPrinterAdapter implements Printer {
    private final OldXmlPrinter oldPrinter;

    XmlPrinterAdapter(OldXmlPrinter oldPrinter) {
        this.oldPrinter = oldPrinter;
    }

    // naya interface ka method, andar purane method ko translate karke call karta hai
    public void print(String data) {
        oldPrinter.printAsXml(data);
    }
}
```

**Use kaise karenge:**
```java
Printer printer = new XmlPrinterAdapter(new OldXmlPrinter());
printer.print("Hello");   // output: <data>Hello</data>
// Naya system sirf 'Printer' interface jaanta hai, use pata hi nahi ki andar OldXmlPrinter hai
```

**Kya ho raha hai samjho:**
1. `OldXmlPrinter` ko bilkul chhua nahi gaya — kyunki aksar ye third-party
   library ka code hota hai jo edit hi nahi kar sakte.
2. `XmlPrinterAdapter` beech mein khada hai — bahar se naya interface dikhta
   hai (`Printer`), andar purani class ka kaam ho raha hai (`OldXmlPrinter`).
3. Ye Adapter, composition use karta hai (andar `oldPrinter` object rakha hai) —
   inheritance nahi (kyunki "Adapter is-a OldXmlPrinter" sahi nahi baithta).

## Kab use karo
- Jab kisi purani/third-party class ka interface, tumhare naye system ke expected interface se match nahi karta
- Jab purani class ka code edit nahi kar sakte (library, legacy code)

## LLD problems mein kaha milega
- Payment gateway integration (Razorpay ka SDK vs tumhara `PaymentProcessor` interface)
- Legacy system ko naye system ke saath jodna

Agla: [02-decorator.md](02-decorator.md)
