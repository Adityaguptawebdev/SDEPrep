# LLD 3 — BookMyShow: Concurrent Seat Booking

> **Visa evidence**: *"LLD for BookMyShow type app. Discussion on how to effectively handle concurrent booking, DB design, class design"* ([LC-1357070](https://leetcode.com/discuss/post/1357070/visa-senior-software-engineer-bangalore-a3j43/), 2021, Senior) · BookMyShow HLD in two more senior reports ([LC-2209203](https://leetcode.com/discuss/post/2209203/visa-senior-software-engineer-bengaluru-ehwxc/), [LC-1736047](https://leetcode.com/discuss/post/1736047/visa-sr-software-engineer-bangalore-jan-lwgky/)). Frequency: **HIGH** (senior). Fuller generic version: [LLD/03-problems/10-bookmyshow](../../../LLD/03-problems/10-bookmyshow.md).

**Easy analogy — train tatkal**: Seat dikh rahi hai, click kiya → 10 minute ke liye **tumhare naam hold** (lock). Payment ho gaya → confirm; time khatam → seat wapas sabke liye. Do log ek hi seat pe click karein → sirf ek ko hold milega.

## Requirements
- Browse movie → theatre → show → seat map.
- Select seats → **temporary hold** (e.g. 10 min) → pay → confirm booking.
- Two users must **never** book the same seat; unpaid holds expire.

## Entities

```
 Movie 1──* Show *──1 Screen 1──* Seat           Theatre 1──* Screen
 Show 1──* ShowSeat (status: AVAILABLE | HELD | BOOKED)
 Booking (id, user, show, seats, status: PENDING_PAYMENT | CONFIRMED | EXPIRED)
 SeatHoldService — hold / release / confirm (the concurrency-critical part)
```

## Code (the part interviewers push on: holding seats safely)

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.LongSupplier;

class SeatHoldService {
    record Hold(String userId, long expiresAt, boolean confirmed) {}

    private final Map<String, Hold> holds = new ConcurrentHashMap<>();   // key = showId:seatId
    private final long holdMs;
    private final LongSupplier clock;

    SeatHoldService(long holdMs, LongSupplier clock) { this.holdMs = holdMs; this.clock = clock; }

    /** All-or-nothing: hold every seat or none. */
    boolean hold(String showId, List<String> seats, String userId) {
        long now = clock.getAsLong();
        List<String> acquired = new ArrayList<>();
        for (String seat : seats) {
            String key = showId + ":" + seat;
            Hold result = holds.compute(key, (k, cur) ->                   // atomic per key
                    (cur == null || (!cur.confirmed() && cur.expiresAt() <= now))
                            ? new Hold(userId, now + holdMs, false) : cur);
            if (!result.userId().equals(userId)) {                          // someone else has it
                for (String a : acquired) holds.remove(showId + ":" + a);    // roll back partial holds
                return false;
            }
            acquired.add(seat);
        }
        return true;
    }

    boolean confirm(String showId, List<String> seats, String userId) {    // after successful payment
        long now = clock.getAsLong();
        for (String seat : seats) {
            Hold h = holds.get(showId + ":" + seat);
            if (h == null || !h.userId().equals(userId) || h.expiresAt() <= now) return false;   // hold lost
        }
        for (String seat : seats) holds.put(showId + ":" + seat, new Hold(userId, Long.MAX_VALUE, true));
        return true;
    }

    public static void main(String[] args) {
        long[] now = {0};
        SeatHoldService svc = new SeatHoldService(600_000, () -> now[0]);     // 10-minute holds
        System.out.println("asha holds A1,A2: " + svc.hold("show7", List.of("A1", "A2"), "asha"));
        System.out.println("ravi holds A3,A2: " + svc.hold("show7", List.of("A3", "A2"), "ravi"));
        System.out.println("ravi holds A3 only: " + svc.hold("show7", List.of("A3"), "ravi"));
        now[0] = 700_000;                                                   // asha didn't pay in 10 min
        System.out.println("asha confirms late: " + svc.confirm("show7", List.of("A1", "A2"), "asha"));
        System.out.println("ravi now holds A2: " + svc.hold("show7", List.of("A2"), "ravi"));
    }
}
```

```text
asha holds A1,A2: true
ravi holds A3,A2: false
ravi holds A3 only: true
asha confirms late: false
ravi now holds A2: true
```

(Ravi's attempt grabbed A3 first, then failed on A2 — the rollback released A3, so his next single-seat hold on A3 succeeds.)

## DB design and concurrency in a real system
- In-memory holds work only on **one** server. With many servers use the **database** (or Redis) as the lock:
  - `show_seat(show_id, seat_id, status, held_by, hold_expires_at, version)` and a conditional update:
    `UPDATE show_seat SET status='HELD', held_by=?, hold_expires_at=? WHERE show_id=? AND seat_id IN (…) AND (status='AVAILABLE' OR (status='HELD' AND hold_expires_at < now()))` → succeed only if **all** rows updated (else roll back the transaction).
  - Or `SELECT … FOR UPDATE` on the seat rows inside a transaction (pessimistic), or a `version` column (optimistic).
  - Final safety net: `UNIQUE(show_id, seat_id)` on the confirmed-booking table.
- A scheduler (or the conditional update itself) releases expired holds.

## Follow-ups
1. "Two users click the same seat at the same millisecond" → atomic compute / conditional update; one wins.
2. "Payment succeeded but the hold expired" → auto-refund, or extend holds while a payment is in progress.
3. "Scale to a blockbuster release" → queue users (virtual waiting room), cache seat maps, shard by show.
4. "Which patterns?" → State (seat/booking status), Strategy (pricing, payment), Observer (notify on booking).

**🗣️ Interview mein aise bolo**: "Seat booking ka asli sawaal concurrency hai. Main seat ko pehle time-limited HOLD karta hoon — atomic operation se, all-or-nothing — payment ke baad CONFIRM. Multi-server pe yahi kaam DB ke conditional update ya row lock se, aur unique constraint last safety net."

Next: [LLD 4 — Library management →](04-library-management.md)
