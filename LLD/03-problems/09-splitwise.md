# Problem 9: Splitwise (Expense Sharing)

## Interview mein aise approach karo

**Clarifying questions:**
- Split kaise ho sakta hai — equal, exact amounts, ya percentage? (teeno pucho, sabse common requirement hai)
- Groups chahiye (trip, flatmates) ya sirf 1-1 expenses?
- "Simplify debts" chahiye (A owes B, B owes C → seedha A owes C)?

**Assume**: Teeno split types support karenge, group-level expenses, simplification abhi skip (bonus ke roop mein bata dena end mein).

**Nouns**: User, Expense, Split, Group, BalanceSheet.

**Sabse bada signal**: "Expense split karne ke 3 tarike hain (equal/exact/percent)" → seedha **Strategy pattern** yaad aana chahiye — ye exactly wahi shape hai jo [Strategy pattern](../02-design-patterns/behavioral/01-strategy.md) mein dekha tha.

---

## Core Entities

```java
class User {
    private String id;
    private String name;
    User(String id, String name) { this.id = id; this.name = name; }
    public String getId() { return id; }
    public String getName() { return name; }
}
```

```java
// Split = ek user ka is expense mein "hissa" (kitna use dena hai)
class Split {
    private User user;
    private double amount;
    Split(User user, double amount) { this.user = user; this.amount = amount; }
    public User getUser() { return user; }
    public double getAmount() { return amount; }
}
```

## Strategy Pattern — split kaise calculate ho

```java
interface SplitStrategy {
    List<Split> calculateSplits(double totalAmount, List<User> users, Map<User, Double> values);
    // 'values' — ExactSplit ke liye exact amounts, PercentSplit ke liye percentages. Equal split mein ignore hoga.
}
```

```java
class EqualSplitStrategy implements SplitStrategy {
    public List<Split> calculateSplits(double totalAmount, List<User> users, Map<User, Double> values) {
        double share = totalAmount / users.size();   // 🔑 sabka hissa barabar
        List<Split> splits = new ArrayList<>();
        for (User user : users) {
            splits.add(new Split(user, share));
        }
        return splits;
    }
}
```

```java
class ExactSplitStrategy implements SplitStrategy {
    public List<Split> calculateSplits(double totalAmount, List<User> users, Map<User, Double> values) {
        double sum = values.values().stream().mapToDouble(Double::doubleValue).sum();
        if (Math.abs(sum - totalAmount) > 0.01) {
            throw new IllegalArgumentException("Exact amounts ka total, total expense se match nahi karta");
        }
        List<Split> splits = new ArrayList<>();
        for (User user : users) {
            splits.add(new Split(user, values.get(user)));   // jo diya hai wahi use karo
        }
        return splits;
    }
}
```

```java
class PercentSplitStrategy implements SplitStrategy {
    public List<Split> calculateSplits(double totalAmount, List<User> users, Map<User, Double> values) {
        double totalPercent = values.values().stream().mapToDouble(Double::doubleValue).sum();
        if (Math.abs(totalPercent - 100.0) > 0.01) {
            throw new IllegalArgumentException("Percentages 100 tak add nahi ho rahe");
        }
        List<Split> splits = new ArrayList<>();
        for (User user : users) {
            splits.add(new Split(user, (values.get(user) / 100.0) * totalAmount));
        }
        return splits;
    }
}
```

## Expense — ek transaction ka record

```java
class Expense {
    private User paidBy;
    private double amount;
    private List<Split> splits;

    Expense(User paidBy, double amount, List<Split> splits) {
        this.paidBy = paidBy;
        this.amount = amount;
        this.splits = splits;
    }
    public User getPaidBy() { return paidBy; }
    public List<Split> getSplits() { return splits; }
}
```

## BalanceSheet — kaun kisko kitna owe karta hai (core logic)

```java
class BalanceSheet {
    // balances.get(A).get(B) = A, B ko kitna owe karta hai (negative ho sakta hai)
    private Map<User, Map<User, Double>> balances = new HashMap<>();

    public void addExpense(Expense expense) {
        User paidBy = expense.getPaidBy();
        for (Split split : expense.getSplits()) {
            User owesUser = split.getUser();
            if (owesUser.equals(paidBy)) continue;   // khud apne aap ko owe nahi karta

            double amount = split.getAmount();
            // owesUser, paidBy ko 'amount' owe karta hai
            updateBalance(owesUser, paidBy, amount);
            updateBalance(paidBy, owesUser, -amount);   // reverse direction, negative
        }
    }

    private void updateBalance(User from, User to, double amount) {
        balances.computeIfAbsent(from, k -> new HashMap<>());
        double current = balances.get(from).getOrDefault(to, 0.0);
        balances.get(from).put(to, current + amount);   // 🔑 jama karte jao, replace nahi
    }

    public double getBalance(User a, User b) {
        return balances.getOrDefault(a, Collections.emptyMap()).getOrDefault(b, 0.0);
    }
}
```

**Line by line samjho:** Jab `paidBy` ne poora paisa diya, har `split` ke
liye us user ka "owed amount" `paidBy` ke against badhaya jata hai
(`updateBalance(owesUser, paidBy, amount)`), aur reverse bhi record kar diya
(`updateBalance(paidBy, owesUser, -amount)`) taaki `getBalance(paidBy, owesUser)`
bhi sahi (negative) value de — matlab "paidBy, owesUser se paisa lega".
**`+=` use kiya hai, replace nahi** — kyunki multiple expenses ke baad
balances accumulate hote hain.

## Use kaise karenge

```java
User a = new User("1", "Aditya");
User b = new User("2", "Raj");
User c = new User("3", "Simran");

Expense expense = new Expense(a, 300,
    new EqualSplitStrategy().calculateSplits(300, List.of(a, b, c), null));

BalanceSheet sheet = new BalanceSheet();
sheet.addExpense(expense);

System.out.println(sheet.getBalance(b, a));  // 100.0 -> Raj, Aditya ko 100 owe karta hai
```

## Patterns used & why
- **Strategy** — split calculation ka algorithm switchable hai, `Expense`/`BalanceSheet` ko fark nahi padta konsa use hua

## Extensibility — interview mein bolne wali baatein (bonus points ke liye)
- "Debt simplification chahiye ho toh ek graph algorithm chalega — net balance nikaal ke (kaun net creditor hai, kaun net debtor), phir greedy tarike se settle karo — ye ek alag `DebtSimplifier` class mein isolate karunga."
- "Groups add karne ho toh `Group` class banaunga jisme `List<User>` aur `List<Expense>` honge, `BalanceSheet` wahi rahega bas group ke members pe filter hoga."

Agla: [10-bookmyshow.md](10-bookmyshow.md)
