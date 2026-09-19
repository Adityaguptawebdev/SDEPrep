# Composite Pattern

**Ek line mein**: "Single cheez" aur "cheezon ka group" — dono ko **same
tarike se treat** karo, taaki caller ko fark hi na pade ki wo ek file se
baat kar raha hai ya poore folder se.

**Yaad rakhne ka trick**: **"Folder ke andar folder"** — Windows/Mac mein
ek folder ke andar files bhi ho sakti hain aur dusre folders bhi. Jab tum
"delete" karte ho, tumhe fark nahi padta andar kya hai — same `delete()`
action folder pe bhi chalta hai aur file pe bhi.

**Real life example**: Company ka **organization structure** — `Employee`
akela bhi ho sakta hai, ya `Manager` (jo khud bhi ek Employee hai) ke neeche
aur `Employee`s ho sakte hain. `getTotalSalary()` poore tree pe ek jaisa
kaam karna chahiye.

## Problem (pattern ke bina)

```java
// Alag alag treat karna pad raha hai — "agar ye Manager hai toh loop lagao warna seedha lo"
double totalSalary(Object emp) {
    if (emp instanceof Manager) {
        double total = ((Manager) emp).getSalary();
        for (Employee e : ((Manager) emp).getSubordinates()) {
            total += totalSalary(e);   // messy, type-check har jagah
        }
        return total;
    } else {
        return ((Employee) emp).getSalary();
    }
}
```

## Solution — Java code, line by line

```java
// Step 1: common interface — Employee (akela) aur Manager (group) dono isko follow karenge
interface OrgComponent {
    double getSalary();
}

// Step 2: "Leaf" — akela node, aage kuch nahi
class Employee implements OrgComponent {
    private String name;
    private double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public double getSalary() {
        return salary;   // seedha apni salary return kar do, aur kuch nahi
    }
}

// Step 3: "Composite" — group node, andar aur OrgComponents rakhta hai (Employee ya Manager, dono)
class Manager implements OrgComponent {
    private String name;
    private double salary;
    private List<OrgComponent> subordinates = new ArrayList<>();

    Manager(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public void addSubordinate(OrgComponent emp) {
        subordinates.add(emp);
    }

    public double getSalary() {
        double total = salary;                     // apni salary
        for (OrgComponent emp : subordinates) {
            total += emp.getSalary();               // 🔑 recursion — chahe wo Employee ho ya Manager, same call
        }
        return total;
    }
}
```

**Use kaise karenge:**
```java
Employee e1 = new Employee("Raj", 50000);
Employee e2 = new Employee("Simran", 55000);

Manager teamLead = new Manager("Aditya", 80000);
teamLead.addSubordinate(e1);
teamLead.addSubordinate(e2);

Manager cto = new Manager("Boss", 150000);
cto.addSubordinate(teamLead);   // Manager ke andar Manager bhi ja sakta hai!

System.out.println(cto.getSalary());  // 150000 + 80000 + 50000 + 55000 = 335000
```

**Kya ho raha hai samjho:**
1. `Employee` aur `Manager` dono `OrgComponent` interface follow karte hain — caller ko in dono mein fark karne ki zarurat nahi.
2. `Manager` ke andar `List<OrgComponent>` hai — isme `Employee` bhi aa sakta hai, aur **dusra `Manager` bhi** (kyunki wo bhi `OrgComponent` hai). Isse tree bante jaate hain, jitni marzi depth.
3. `getSalary()` ka recursion hi asli kamaal hai: `cto.getSalary()` call karte hi ye khud-ba-khud poore tree mein neeche jaake sabki salary jod deta hai — caller ko manually loop nahi lagana pada.

> 💡 **Trick pehchanne ki**: Jab bhi problem mein "tree-jaisa structure"
> sunayi de (folder/file, category/sub-category, menu/sub-menu, org
> hierarchy) — turant Composite pattern yaad karo.

## Kab use karo
- Jab data tree-shaped ho (parent apne andar bachche rakh sakta hai, bachche khud bhi parent ban sakte hain)
- Jab caller ko "single item" aur "group of items" mein fark nahi karna chahiye

## LLD problems mein kaha milega
- File System (Folder/File)
- Menu system (Category ke andar sub-category ke andar item)
- Org hierarchy, Comment threads (reply ke andar reply)

Behavioral patterns shuru: [../behavioral/01-strategy.md](../behavioral/01-strategy.md)
