# LLD 5 — Payment Processing (states, methods, retries, idempotency)

> **Visa evidence**: *"Design a payment system, focusing on payment states, various payment methods, durable execution and retries"* — the Staff candidate coded "the main entities and service class along with the **strategy pattern** for various processes related to various states and different payment methods" ([LC-8339622](https://leetcode.com/discuss/post/8339622/visa-staff-swe-bangalore-interview-exper-gc99/), Jun 2026, Staff). Frequency: LOW (Staff). HLD version: [SD 2](../07-system-design/02-payment-service.md). Here it's trimmed to an early-career-sized core.

**Easy analogy — ATM ka "transaction in process"**: Ek hi button do baar dabao, paise ek hi baar katne chahiye (idempotency). Machine ne network error diya → thodi der ruk ke dobara try (retry with backoff), par sirf limited baar.

## Requirements
- Pay with different methods (card, UPI) behind one interface.
- States: `CREATED → AUTHORIZED` or `FAILED`.
- Retry **transient** failures with exponential backoff (bounded attempts).
- The same idempotency key must return the same payment and never charge twice.

## Classes
```
 «interface» PaymentMethod (Strategy) ← CardMethod, UpiMethod
 Payment (id, idempotencyKey, amount, status, attempts)
 RetryPolicy (maxAttempts, baseDelay → delay(attempt) = base × 2^(attempt−1))
 PaymentService.pay(key, amount, method) — idempotency map + retry loop + state changes
```

## Code

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

class TransientFailure extends RuntimeException {
    TransientFailure(String m) { super(m); }
}

interface PaymentMethod {
    String name();
    void charge(long amountMinor);                        // throws TransientFailure on a retryable error
}

class CardMethod implements PaymentMethod {
    private int failuresLeft;
    final AtomicInteger successfulCharges = new AtomicInteger();
    CardMethod(int failFirst) { this.failuresLeft = failFirst; }
    public String name() { return "CARD"; }
    public void charge(long amount) {
        if (failuresLeft-- > 0) throw new TransientFailure("issuer timeout");
        successfulCharges.incrementAndGet();
    }
}

class UpiMethod implements PaymentMethod {
    public String name() { return "UPI"; }
    public void charge(long amount) { throw new TransientFailure("bank unavailable"); }
}

record RetryPolicy(int maxAttempts, long baseDelayMs) {
    long delayFor(int attempt) { return baseDelayMs << (attempt - 1); }   // 100, 200, 400, …
}

class PaymentService {
    enum Status { CREATED, AUTHORIZED, FAILED }

    static final class Payment {
        final String id, idempotencyKey; final long amountMinor;
        volatile Status status = Status.CREATED;
        int attempts;
        final List<Long> waits = new ArrayList<>();
        Payment(String id, String key, long amount) { this.id = id; this.idempotencyKey = key; this.amountMinor = amount; }
    }

    private final Map<String, Payment> byKey = new ConcurrentHashMap<>();
    private final AtomicInteger ids = new AtomicInteger();
    private final RetryPolicy retry;

    PaymentService(RetryPolicy retry) { this.retry = retry; }

    Payment pay(String idempotencyKey, long amountMinor, PaymentMethod method) {
        return byKey.computeIfAbsent(idempotencyKey,            // same key → same payment, no second charge
                k -> process(new Payment("pay_" + ids.incrementAndGet(), k, amountMinor), method));
    }

    private Payment process(Payment p, PaymentMethod method) {
        for (int attempt = 1; attempt <= retry.maxAttempts(); attempt++) {
            p.attempts = attempt;
            try {
                method.charge(p.amountMinor);
                p.status = Status.AUTHORIZED;
                return p;
            } catch (TransientFailure e) {
                if (attempt < retry.maxAttempts()) p.waits.add(retry.delayFor(attempt));   // real code: sleep / reschedule
            }
        }
        p.status = Status.FAILED;
        return p;
    }

    public static void main(String[] args) {
        PaymentService svc = new PaymentService(new RetryPolicy(3, 100));
        CardMethod card = new CardMethod(2);                   // fails twice, then succeeds
        Payment p1 = svc.pay("order-77", 49_900, card);
        System.out.println(p1.id + " " + p1.status + " after " + p1.attempts + " attempts (backoff waits " + p1.waits + " ms)");
        Payment again = svc.pay("order-77", 49_900, card);     // client retried with the same key
        System.out.println("same key → " + again.id + " " + again.status + ", card charged " + card.successfulCharges.get() + " time(s)");
        Payment p2 = svc.pay("order-78", 9_900, new UpiMethod());
        System.out.println(p2.id + " " + p2.status + " after " + p2.attempts + " attempts");
    }
}
```

```text
pay_1 AUTHORIZED after 3 attempts (backoff waits [100, 200] ms)
same key → pay_1 AUTHORIZED, card charged 1 time(s)
pay_2 FAILED after 3 attempts
```

## Durable execution & concurrency (what the Staff candidate was pushed on)
- In-memory state disappears on a crash → persist the payment row + every state transition (DB), and resume unfinished payments from their last state.
- `computeIfAbsent` holds a lock while `process` runs — fine for a demo; in production store the idempotency key with a **unique constraint** and do slow work outside any lock.
- Only retry errors that are safe to retry; a timeout after sending the charge is an **unknown** outcome → status inquiry, not another charge.

## Follow-ups
1. "Add wallet payments" → new `PaymentMethod` class (Strategy), no change to `PaymentService`.
2. "Refunds and captures" → more states + allowed transitions (State pattern / transition table as in [SD 2](../07-system-design/02-payment-service.md)).
3. "Add jitter to backoff" → `delay × random(0.5–1.5)` so retries don't sync up.

**🗣️ Interview mein aise bolo**: "Payment methods Strategy se, states ek enum/transition table se, retries sirf transient errors pe exponential backoff ke saath, aur idempotency key se ek order ek hi baar charge hota hai."

Next: [LLD 6 — OOP modelling questions →](06-oop-modelling-questions.md)
