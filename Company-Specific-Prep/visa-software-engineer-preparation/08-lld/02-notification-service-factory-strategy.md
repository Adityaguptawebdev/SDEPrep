# LLD 2 — Notification Service (Factory + Strategy)

> **Visa evidence**: *"Scenario: I have to send out email and SMS notifications, how will you structure the code?"* The candidate made a `NotificationSystem` interface, email + SMS classes, and a factory that creates them from a string; the interviewer then asked *"can the factory method be static?"* — **yes** ([LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/), Jan 2025, Senior). Frequency: LOW. System version: [SD 4](../07-system-design/04-notification-system.md).

**Easy analogy — courier counter**: Tum sirf parcel dete ho aur bolte ho "speed post" ya "normal". Counter wala (factory) sahi service chun leta hai; har service (strategy) apne tareeke se deliver karti hai.

## Requirements
- Send a message to a user through one or more channels (email, SMS; push later).
- Adding a new channel must not change existing code (Open/Closed).
- Retry a failed send a few times.

## Classes

```
            «interface» Notifier
            + channel(): String
            + send(to, message)
             ▲          ▲           ▲
   EmailNotifier   SmsNotifier   PushNotifier (later)
   NotifierFactory.create("SMS") → Notifier          (Factory — creation in one place)
   NotificationService.notify(user, message, channels) → uses Notifier objects (Strategy)
```

## Code

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

interface Notifier {
    String channel();
    void send(String to, String message);
}

class EmailNotifier implements Notifier {
    public String channel() { return "EMAIL"; }
    public void send(String to, String message) { System.out.println("EMAIL to " + to + ": " + message); }
}

class SmsNotifier implements Notifier {
    private int calls = 0;
    public String channel() { return "SMS"; }
    public void send(String to, String message) {
        if (++calls == 1) throw new IllegalStateException("SMS gateway timeout");   // fails once (demo)
        System.out.println("SMS to " + to + ": " + message);
    }
}

class NotifierFactory {
    private static final Map<String, Supplier<Notifier>> REGISTRY = Map.of(
            "EMAIL", EmailNotifier::new,
            "SMS", SmsNotifier::new);                    // new channel = one new line + one new class

    static Notifier create(String channel) {             // static factory method (yes, it can be static)
        Supplier<Notifier> s = REGISTRY.get(channel.toUpperCase());
        if (s == null) throw new IllegalArgumentException("unknown channel " + channel);
        return s.get();
    }
}

class NotificationService {
    private final int maxAttempts;

    NotificationService(int maxAttempts) { this.maxAttempts = maxAttempts; }

    List<String> notify(String to, String message, List<Notifier> notifiers) {
        List<String> failed = new ArrayList<>();
        for (Notifier n : notifiers) {
            boolean sent = false;
            for (int attempt = 1; attempt <= maxAttempts && !sent; attempt++) {
                try {
                    n.send(to, message);
                    sent = true;
                } catch (RuntimeException e) {
                    System.out.println(n.channel() + " attempt " + attempt + " failed: " + e.getMessage());
                }
            }
            if (!sent) failed.add(n.channel());          // hand over to a retry queue / DLQ in real life
        }
        return failed;
    }

    public static void main(String[] args) {
        List<Notifier> channels = List.of(NotifierFactory.create("email"), NotifierFactory.create("SMS"));
        List<String> failed = new NotificationService(3).notify("user-42", "Payment of ₹499 successful", channels);
        System.out.println("failed channels: " + failed);
    }
}
```

```text
EMAIL to user-42: Payment of ₹499 successful
SMS attempt 1 failed: SMS gateway timeout
SMS to user-42: Payment of ₹499 successful
failed channels: []
```

## Patterns used
- **Strategy**: `NotificationService` works with any `Notifier`.
- **Factory**: one place decides which class to create (from config/user preference).
- With Spring, the factory disappears: inject `Map<String, Notifier>` of beans ([Spring 1/5 §5](../05-spring-boot/01-ioc-di-beans-annotations.md#5-two-implementations-of-one-interface--qualifier--primary)).

## Concurrency
- Notifiers should be stateless (this demo's counter is only for showing a failure). Sending in parallel → submit each channel to an `ExecutorService`.

## Follow-ups
1. "Add WhatsApp" → new class + one registry entry; nothing else changes.
2. "Static factory vs instance factory?" → static is simple; an injected factory is easier to mock in tests.
3. "Retry forever?" → no: bounded retries with backoff, then DLQ; make sends idempotent (dedupe id).
4. "User preferences / quiet hours?" → a `PreferenceService` decides the channel list before sending.

**🗣️ Interview mein aise bolo**: "Har channel ek `Notifier` implementation hai, service sirf interface jaanti hai. Object banane ka kaam factory ka — naya channel aaye toh nayi class aur ek registry entry, baaki code untouched."

Next: [LLD 3 — BookMyShow seat booking →](03-bookmyshow-seat-booking.md)
