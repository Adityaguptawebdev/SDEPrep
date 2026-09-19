# Problem 10: BookMyShow (Movie Ticket Booking)

## Interview mein aise approach karo

**Clarifying questions:**
- Ek movie, multiple theaters, multiple shows (time slots) — confirm karo.
- Seats ke different types hain (Silver/Gold/Platinum, alag price)?
- **Sabse important sawaal**: "Agar 2 log ek hi seat ek hi waqt pe book karne ki koshish karein, toh kya hoga?" — ye sawaal khud pucho agar interviewer na bhi poochein, ye is problem ka **asli test** hai.

**Assume**: Multiple theaters/shows/seat-types, concurrent booking handle karni hai (seat locking mechanism).

**Nouns**: Movie, Theater, Screen, Show, Seat, Booking, Payment.

**Trick jo is problem ko alag banati hai**: Ye sirf classes design karne ka
sawaal nahi hai — ye ek **concurrency problem** bhi hai. Do users ek saath
seat A1 select karein toh **dono ko book nahi hone dena** — isko "race
condition" kehte hain, aur interview mein isko explicitly handle karna
dikhana hi is problem ko crack karta hai.

---

## Core Entities

```java
class Movie {
    private String title;
    private int durationMinutes;
    Movie(String title, int durationMinutes) {
        this.title = title;
        this.durationMinutes = durationMinutes;
    }
    public String getTitle() { return title; }
}
```

```java
enum SeatType { SILVER, GOLD, PLATINUM }
enum SeatStatus { AVAILABLE, LOCKED, BOOKED }

class Seat {
    private String seatId;
    private SeatType type;
    private SeatStatus status = SeatStatus.AVAILABLE;

    Seat(String seatId, SeatType type) {
        this.seatId = seatId;
        this.type = type;
    }
    public SeatStatus getStatus() { return status; }
    public void setStatus(SeatStatus status) { this.status = status; }
    public SeatType getType() { return type; }
    public String getSeatId() { return seatId; }
}
```

```java
class Show {
    private Movie movie;
    private LocalDateTime startTime;
    private List<Seat> seats;

    Show(Movie movie, LocalDateTime startTime, List<Seat> seats) {
        this.movie = movie;
        this.startTime = startTime;
        this.seats = seats;
    }
    public List<Seat> getSeats() { return seats; }
    public Movie getMovie() { return movie; }
}
```

## Concurrency ka core fix — synchronized seat locking

```java
class Booking {
    private String bookingId;
    private Show show;
    private List<Seat> seats;
    private boolean confirmed = false;

    Booking(Show show, List<Seat> seats) {
        this.bookingId = UUID.randomUUID().toString();
        this.show = show;
        this.seats = seats;
    }
    public List<Seat> getSeats() { return seats; }
    public void confirm() { this.confirmed = true; }
}
```

```java
class BookingService {

    // 🔑 'synchronized' — ek waqt mein sirf ek thread hi is method ke andar aa sakta hai.
    // Isse 2 users ek saath same seat lock nahi kar payenge.
    public synchronized Booking lockSeats(Show show, List<String> seatIds) {
        List<Seat> selectedSeats = new ArrayList<>();

        // Step 1: pehle CHECK karo sab seats available hain
        for (Seat seat : show.getSeats()) {
            if (seatIds.contains(seat.getSeatId())) {
                if (seat.getStatus() != SeatStatus.AVAILABLE) {
                    throw new IllegalStateException("Seat " + seat.getSeatId() + " already lock/booked hai");
                }
                selectedSeats.add(seat);
            }
        }

        // Step 2: sab available the tabhi yaha tak aaye — ab LOCK karo
        for (Seat seat : selectedSeats) {
            seat.setStatus(SeatStatus.LOCKED);
        }

        return new Booking(show, selectedSeats);
        // 🔑 real system mein: lock ke saath ek timer bhi hota hai (5-10 min),
        // agar itne time mein payment na ho, seat wapas AVAILABLE ho jaati hai
    }

    public void confirmBooking(Booking booking) {
        for (Seat seat : booking.getSeats()) {
            seat.setStatus(SeatStatus.BOOKED);   // payment success ke baad hi ye call hoga
        }
        booking.confirm();
    }

    public void releaseLock(Booking booking) {
        for (Seat seat : booking.getSeats()) {
            seat.setStatus(SeatStatus.AVAILABLE);   // payment fail/timeout pe wapas free
        }
    }
}
```

**Line by line samjho — ye poori problem ka sabse important hissa hai:**

1. **`synchronized` keyword** method ke upar — matlab agar 2 threads
   (2 users) ek saath `lockSeats()` call karein, **Java ensure karega ki
   ek waqt mein sirf ek thread andar jaaye**, doosra bahar wait karega.
   Isse "check karo available hai" aur "lock karo" ke beech koi doosra
   thread ghus nahi sakta (isko **race condition** kehte hain, jo bina
   synchronized ke ho sakta tha).

2. **Check-then-lock pattern**: pehle **saari** requested seats check ki
   jaati hain available hain ya nahi (Step 1), **tabhi** lock kiya jata hai
   (Step 2). Agar beech mein ek seat available na mili, **exception** aa
   jayega aur koi seat lock nahi hogi (all-or-nothing) — warna ho sakta tha
   3 mein se 2 seat lock ho jaye aur 1 na ho, jo confusing state hai.

3. **`LOCKED` vs `BOOKED`** do alag states kyu? — `LOCKED` ka matlab hai
   "kisi ne select kiya hai, payment pending hai". Agar payment fail ho ya
   timeout ho jaye, `releaseLock()` se wapas `AVAILABLE`. Sirf payment
   success ke baad hi `BOOKED` (permanent) hota hai.

## Use kaise karenge

```java
BookingService service = new BookingService();

Booking booking = service.lockSeats(show, List.of("A1", "A2"));
// ... payment process ...
service.confirmBooking(booking);   // payment success
// ya
service.releaseLock(booking);      // payment fail/timeout
```

## Patterns used & why
- Explicit design pattern se zyada, is problem ka focus hai **concurrency
  correctness** (`synchronized`) aur **state machine for seats**
  (Available → Locked → Booked — chhota sa State pattern concept hi hai).
- Bade scale pe (distributed system, multiple servers) `synchronized`
  kaafi nahi hota — waha **distributed lock** (Redis-based) chahiye hota
  hai, ye baat interview mein bol dena bonus point deti hai.

## Extensibility — interview mein bolne wali baatein
- "Lock timeout implement karna ho toh ek scheduled task rakhunga jo N minute baad automatically `releaseLock()` call kare agar booking confirm nahi hui."
- "Scale badhe (single server kaafi nahi) toh in-memory `synchronized` ki jagah Redis distributed lock (`SETNX`) use karunga taaki multiple servers ke beech bhi consistency rahe."
- "Dynamic pricing (weekend/prime-time zyada price) chahiye ho toh price calculation ko Strategy pattern se alag kar dunga."

---

## Sab 10 problems ho gaye

Ab tumhare paas: theory (OOP + SOLID + UML + 9 patterns) + 10 practice
problems, dono ready hain. Agla step — khud se ek problem (jaise Cab Booking
ya Chess) try karna, aur agar atakoge toh yehi framework
([00-how-to-approach-any-problem.md](00-how-to-approach-any-problem.md))
use karke saath mein solve karenge.
