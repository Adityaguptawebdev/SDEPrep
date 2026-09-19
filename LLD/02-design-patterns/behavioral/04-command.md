# Command Pattern

**Ek line mein**: Kisi "action/request" ko ek **object** mein pack kar do
(instead of seedha method call karne ke), taaki usse **store, queue, undo,
ya baad mein execute** kiya ja sake.

**Yaad rakhne ka trick**: **"Restaurant ka order slip"** — waiter tumhara
order seedha kitchen mein jaake khud nahi banata, wo ek **slip (command)**
likhta hai "Table 5: 1 Pizza". Ye slip kitchen mein queue mein lag jaati hai,
kisi bhi chef dwara baad mein execute ho sakti hai, aur cancel bhi ho sakti
hai order dene ke baad.

**Real life example**: TV Remote ke buttons — "Power On" ek command hai,
"Volume Up" ek command hai. Remote ko ye nahi pata "TV ke andar kaise on
hota hai" — wo bas command ka `execute()` bulata hai.

## Problem (pattern ke bina)

```java
class RemoteControl {
    Light light = new Light();

    void pressButton() {
        light.on();   // seedha call — agar button ka kaam badalna ho (light se fan kare),
                       // RemoteControl ka code hi change karna padega
    }
    // Undo karna ho toh? Kaam mushkil hai kyunki koi history hi nahi hai
}
```

## Solution — Java code, line by line

```java
// Step 1: Command ka contract — har command ko execute aur undo pata hona chahiye
interface Command {
    void execute();
    void undo();
}

// Step 2: "Receiver" — asli kaam karne wali class (isse Command chalata hai)
class Light {
    void on() { System.out.println("Light ON"); }
    void off() { System.out.println("Light OFF"); }
}

// Step 3: concrete Command — ek specific action ko wrap karta hai
class LightOnCommand implements Command {
    private Light light;
    LightOnCommand(Light light) { this.light = light; }

    public void execute() { light.on(); }   // execute hone pe receiver ka kaam call hota hai
    public void undo() { light.off(); }     // undo ka matlab hi opposite action
}

// Step 4: "Invoker" — jo command ko trigger karta hai, andar ka kaam nahi jaanta
class RemoteControl {
    private Command lastCommand;

    public void pressButton(Command command) {
        command.execute();
        lastCommand = command;   // 🔑 history rakh li, isliye undo possible hai
    }

    public void pressUndo() {
        lastCommand.undo();
    }
}
```

**Use kaise karenge:**
```java
Light light = new Light();
Command lightOn = new LightOnCommand(light);

RemoteControl remote = new RemoteControl();
remote.pressButton(lightOn);   // "Light ON"
remote.pressUndo();            // "Light OFF"
```

**Kya ho raha hai samjho:**
1. `RemoteControl` (Invoker) ko `Light` (Receiver) ka naam tak pata nahi —
   usse sirf `Command` interface dikhta hai. Kal button ka kaam "Fan on"
   karna ho, bas `FanOnCommand` bana ke do, `RemoteControl` ka code nahi chhedna.
2. `execute()` aur `undo()` dono command ke andar hain — **isliye undo/redo
   itna aasan hai**: bas last command yaad rakho aur uska `undo()` bula do.
3. Commands ko ek `List<Command>` mein store karke **queue** bhi bana sakte
   ho (jaise print queue, task queue) — jo seedhe method calls se possible nahi tha.

> 💡 **Trick pehchanne ki**: Jab bhi problem mein "undo/redo", "queue of
> tasks", ya "action ko baad mein execute karna hai" sunayi de — Command
> pattern turant yaad karo.

## Kab use karo
- Jab actions ko undo/redo karna ho
- Jab requests ko queue mein daal ke baad mein process karna ho (jaise job scheduling)
- Jab button/trigger ko uske actual implementation se decouple karna ho

## LLD problems mein kaha milega
- Text editor (Ctrl+Z undo), Remote control, Task scheduler/job queue

Agla: [05-chain-of-responsibility.md](05-chain-of-responsibility.md)
