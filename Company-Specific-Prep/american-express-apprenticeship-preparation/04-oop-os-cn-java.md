# 04 — OOP, OS, CN, Java: Questions + Answers

🟢 apprentice · 🔵 Amex India entry-level. Answers are short. Say them in your own words in the interview.

---

## OOP 🔵

**Q: What is OOP? Why do we use it?**
OOP (Object-Oriented Programming) means writing code as **objects**. Each object has **data** (fields) and **actions** (methods). Example: a `Card` object has `number` and `balance`, and a `pay()` method.
**Why:** code is easier to reuse (inheritance), safer (encapsulation), easier to change, and closer to the real world.

**Q: Explain the 4 pillars of OOP with real-life examples.**

| Pillar | Meaning | Real-life example |
|---|---|---|
| **Encapsulation** | keep data private and allow access only through methods | an ATM: you can't touch the cash box, only use the buttons |
| **Abstraction** | show only what is needed, hide how it works | you swipe a card; you don't see the bank network |
| **Inheritance** | a child class reuses a parent class | `CreditCard` and `DebitCard` both extend `Card` |
| **Polymorphism** | one name, many forms | `pay()` works differently for a credit card and a debit card |

```java
class Card {
    private double balance;                         // encapsulation: private data
    void pay(double amt) { System.out.println("Card pay " + amt); }
}
class CreditCard extends Card {                     // inheritance
    @Override
    void pay(double amt) { System.out.println("Credit pay " + amt); } // polymorphism (overriding)
}
Card c = new CreditCard();
c.pay(100);                                         // "Credit pay 100.0": decided at runtime
```

**Q: Is Java completely object-oriented?**
**No.** Java has **primitive types** (`int`, `char`, `boolean`...) that are not objects, and `static` methods can run without an object. It's "almost" OO. Wrapper classes like `Integer` make primitives act like objects.

**Q: Overloading vs overriding?**

| | Overloading | Overriding |
|---|---|---|
| Where | same class | parent and child class |
| Method name | same | same |
| Parameters | **different** | **same** |
| Decided at | compile time | runtime |
| Example | `add(int,int)` and `add(double,double)` | child's `pay()` replaces parent's `pay()` |

**Q: Compile-time vs runtime polymorphism?**
- **Compile-time (static):** method overloading. The compiler picks the method from the parameter types.
- **Runtime (dynamic):** method overriding. The JVM picks the method from the **actual object** (`Card c = new CreditCard()` calls `CreditCard.pay()`).

**Q: What is abstraction? Abstract class vs interface?**
Abstraction hides the details and shows only the "what".
- **Abstract class:** can have normal methods and fields, plus abstract methods. A class can extend only **one**.
- **Interface:** a contract of methods (it can also have `default` methods). A class can implement **many**.

**Q: What is a constructor? What are its types?**
A constructor is a special method that runs **when an object is created**. It has the same name as the class and no return type.
Types: **default** (no arguments), **parameterized** (takes values), and **copy constructor** (copies another object; built into C++, written by hand in Java).

**Q: What is a destructor? Can we overload it?**
A destructor (C++, `~ClassName()`) runs **when an object is destroyed**, to free memory or files. It **cannot be overloaded**: there is only one, with no parameters. Java has no destructor; the garbage collector frees memory.

**Q: Class vs object?**
A **class** is the blueprint (the design of a house). An **object** is a real thing made from it (an actual house). One class → many objects.

**Q: Structure vs class (C++)?**
They are almost the same. The only difference: in a `struct`, members are **public** by default; in a `class`, they are **private** by default.

**Q: What is inheritance? Types? Why do we use it?**
Inheritance means a child class gets the fields and methods of a parent class. **Why:** reuse code and build an "is-a" relationship (`CreditCard` is a `Card`).
Types: **single**, **multilevel** (A → B → C), **hierarchical** (one parent, many children), **multiple** (many parents: allowed in C++, but in Java **only through interfaces**), and **hybrid**.

**Q: Access specifiers? When do you use which?**

| Specifier (Java) | Who can access | Use for |
|---|---|---|
| `private` | same class only | data fields (encapsulation) |
| default (no word) | same package | package helpers |
| `protected` | same package + child classes | things child classes need |
| `public` | everyone | the methods others should call |

**Q: Function overloading vs operator overloading?**
Function overloading = same function name, different parameters. Operator overloading = giving an operator like `+` a new meaning for your class (C++: `a + b` on two `Complex` objects). **Java does not support operator overloading** (except `+` for String).

---

## OS 🔵 (Engineer Trainee, Aug 2025)

**Q: What is a process? A thread? Multithreading?**
- **Process:** a running program with its **own memory**. Example: Chrome is a process.
- **Thread:** a smaller unit of work **inside** a process. Example: one Chrome tab loading while another plays music.
- **Multithreading:** many threads of one process running together, so the app stays fast and responsive.

**Q: Do threads of the same process have separate memory?**
**Partly.** Threads **share** the process's heap, code and global data. Each thread has its **own stack** and registers. That's why threads talk easily but need locks to avoid race conditions.

**Q: What is a critical section?**
The part of the code that touches **shared data**. Only **one thread at a time** should run it. Protect it with a **mutex/lock** or `synchronized` in Java.

> 💡 **Hinglish:** Critical section = ek hi bathroom; ek time pe ek hi banda andar, baaki wait karein (lock).

**Q: What is context switching?**
The CPU **saves the state** of the running process/thread (registers, program counter) and **loads the state** of another one. This lets one CPU run many tasks. It takes time, so too many switches slow things down.

**Q: What is parallelism? What do you need for it?**
- **Concurrency:** many tasks make progress by **taking turns** (it works even on 1 core).
- **Parallelism:** many tasks run **at the exact same time**. This needs **multiple CPU cores**, plus work that can be split into independent parts.

---

## Computer Networks / Web 🔵

**Q: Explain the OSI model.**
There are 7 layers, from top to bottom. Memory trick: **"All People Seem To Need Data Processing"**.

| # | Layer | Job | Example |
|---|---|---|---|
| 7 | Application | what the user's app speaks | HTTP, DNS, SMTP |
| 6 | Presentation | format, encryption | SSL/TLS, JPEG |
| 5 | Session | open/close a conversation | sessions |
| 4 | Transport | end-to-end delivery, ports | TCP, UDP |
| 3 | Network | routing between networks, IP address | IP, routers |
| 2 | Data Link | delivery inside one network, MAC address | Ethernet, switches |
| 1 | Physical | bits on a wire/air | cables, Wi-Fi signals |

**Q: HTTP vs HTTPS?**
HTTPS = HTTP + **TLS encryption**. With HTTP, data travels as plain text, so anyone in between can read it. HTTPS encrypts it and checks the server's **certificate**. It uses port 443 (HTTP uses 80). Every payment site must use HTTPS.

**Q: How does your website work end to end?** (what happens when you open a URL)
1. The browser asks **DNS** for the server's IP address.
2. It opens a **TCP** connection, then a **TLS** handshake for HTTPS.
3. It sends an **HTTP request** (`GET /`).
4. The server (backend) runs the logic and reads the database, then sends a **response** (HTML/JSON).
5. The browser **renders** the page and loads CSS/JS/images.

---

## Java 🟢🔵

**Q: How does garbage collection work in Java?** 🟢 (asked in an apprentice interview)
Garbage collection (GC) **automatically frees memory** from objects that **no code can reach anymore**. You don't call `free()` like in C.
- The GC starts from **roots** (local variables, static fields) and **marks** every object it can reach. Everything else is garbage and gets **swept** (removed).
- **Generations:** new objects go to the **Young** generation (most die young, so it is cleaned often and fast). Objects that survive move to the **Old** generation (cleaned less often).
- `System.gc()` only **requests** a GC; it is not guaranteed.

**Q: Explain memory management in Java (stack vs heap).** 🟢

| | Stack | Heap |
|---|---|---|
| Stores | method calls, local variables, references | **objects** (`new ...`) |
| Per thread? | yes, each thread has its own | shared by all threads |
| Freed | automatically when the method ends | by the **garbage collector** |
| Error when full | `StackOverflowError` (for example, deep recursion) | `OutOfMemoryError` |

```java
void demo() {
    int x = 10;                  // x lives on the stack
    Card c = new Card();         // reference c on the stack, the Card object on the heap
}                                // method ends → x and c are gone; the Card is now garbage
```

**Q: Can Java still have memory leaks?** Yes. If you keep references you don't need (for example, objects in a static `List` that is never cleared), the GC can't free them.

---

## Other questions asked 🔵

**Q: The zero character vs NULL?**
`'0'` is a real character with ASCII value **48**. `'\0'` (NUL) has ASCII value **0** and marks the end of a C string. `NULL` is a **pointer that points to nothing**.

**Q: C vs C++?**
C is **procedural** (functions only). C++ adds **OOP** (classes, inheritance, polymorphism), plus references, function/operator overloading, templates, the STL and exceptions.

**Q: How do you handle exceptions in C++?**
Use `try` (risky code), `throw` (raise an error) and `catch` (handle it).

```cpp
try {
    if (b == 0) throw runtime_error("divide by zero");
    cout << a / b;
} catch (const exception& e) {
    cout << "Error: " << e.what();
}
```

**Q: How did you implement OAuth in your project?** (project question)
OAuth lets users **log in with Google/GitHub** without giving your app their password. The flow:
1. The user clicks "Login with Google" and goes to Google's login page.
2. Google sends back a **code**.
3. Your server exchanges the code for an **access token**.
4. You use the token to get the user's profile and create a session/JWT.

**Q: How do you use Git/GitHub in a team?**
Make a **branch** for each feature → commit small changes → push → open a **Pull Request** → teammates review → merge into `main`. Pull often to avoid big merge conflicts.

Agla: [05-output-hr-puzzles.md](05-output-hr-puzzles.md)
