# Builder Pattern

**Ek line mein**: Jab kisi object ke bahut saare fields hain aur unme se kai
**optional** hain, toh usse step-by-step, ek-ek karke set karke banao — ek
lambi constructor call se nahi.

**Yaad rakhne ka trick**: "Subway sandwich order karna" — bread choose karo,
phir veggies choose karo (optional), phir sauce choose karo (optional), phir
"build" bolke sandwich final ban jata hai. Har step alag, aur kuch steps skip
bhi kar sakte ho.

**Real life example**: `User` object jisme `name`, `email` zaroori hain, lekin
`phoneNumber`, `address`, `profilePic` optional hain. 6-7 parameters wali
constructor call likhna aur padhna dono mushkil ho jata hai.

## Problem (pattern ke bina)

```java
class User {
    User(String name, String email, String phone, String address, String bio, String pic) {
        // ...
    }
}

// Isse call karte waqt yaad rakhna padega kaunsa parameter kis position pe hai
User u = new User("Aditya", "a@x.com", null, null, "developer", null);
// null, null dekh ke samajh hi nahi aata kaunsa field kya hai — error-prone
```

## Solution — Java code, line by line

```java
class User {
    // saari fields final hain — ek baar ban gaya toh object immutable rahega
    private final String name;
    private final String email;
    private final String phone;
    private final String address;

    // Constructor PRIVATE — sirf Builder hi User bana sakta hai
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.phone = builder.phone;
        this.address = builder.address;
    }

    // Step 1: Builder ek "inner class" hai jiske paas wahi fields hain
    static class Builder {
        private String name;
        private String email;
        private String phone;     // optional
        private String address;   // optional

        public Builder(String name, String email) {
            // zaroori (required) fields yahi constructor mein le lo
            this.name = name;
            this.email = email;
        }

        // Step 2: har optional field ke liye ek "setter jaisa" method,
        // jo khud Builder hi return karta hai — isse chaining possible hoti hai
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        // Step 3: aakhir mein 'build()' asli User object banata hai
        public User build() {
            return new User(this);
        }
    }
}
```

**Use kaise karenge:**
```java
User u = new User.Builder("Aditya", "a@x.com")
                .phone("9999999999")   // optional — dena hai toh do
                .address("Delhi")      // optional — ye bhi chhod sakte the
                .build();              // final object yahi bante hi tayar hai
```

**Kya ho raha hai samjho:**
1. Required fields (`name`, `email`) Builder ke apne constructor mein hi maang liye — inko skip nahi kar sakte.
2. Optional fields (`phone`, `address`) ke liye chaining methods hain — jitne chahiye utne hi call karo, baaki chhod do.
3. `return this` — yehi trick hai jo `.phone(...).address(...)` ko ek line mein chain karne deti hai.
4. `build()` call hote hi asli `User` object banta hai, aur uske baad wo **immutable** (fields `final`) rehta hai.

> 💡 **Kab Builder zaroori lagta hai — trick**: agar kisi class ke paas
> **4+ constructor parameters** hain aur unme se kuch **optional** hain,
> turant Builder ka sochna chahiye. Agar sab fields required hain aur 2-3 hi
> hain, normal constructor kaafi hai — har jagah Builder mat thoko.

## LLD problems mein kaha milega
- `User`, `Order`, `Pizza` (jisme toppings optional hain), `HttpRequest` jaise objects jisme bahut sare optional configs hote hain

Aage Structural patterns shuru: [../structural/01-adapter.md](../structural/01-adapter.md)
