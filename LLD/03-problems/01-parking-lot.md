# Problem 1: Parking Lot

## Interview mein aise approach karo

**Clarifying questions poochne wale (bolke dikhao):**
- Kitne floors hain? Har floor pe alag types ke spots (Small/Medium/Large)?
- Vehicle types kya kya honge — Bike, Car, Truck?
- Payment kaise hoga — hourly rate, ya flat?
- Multiple entry/exit gates honge?

**Assume kar lo (interviewer bol dega ya khud reasonable assumption lo):**
- 1 parking lot, multiple floors, har floor pe multiple spots, spot types fixed hain.
- Ek vehicle ek hi spot le sakta hai, spot size vehicle size >= honi chahiye.

**Nouns nikal ke entities banao**: ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, Gate.

**Relationship socho**: ParkingLot **has-a** (composition, strong) ParkingFloor's. ParkingFloor **has-a** (aggregation, weak) ParkingSpot's — spot floor ke bina bhi concept ke roop mein ho sakta hai. Vehicle **is-a** hierarchy: Car/Bike/Truck extend/implement Vehicle.

**Pattern pehchano**: 
- Sirf ek `ParkingLot` object chahiye poore system mein → **Singleton**
- Fee calculate karne ka tarika badal sakta hai (hourly vs flat) → **Strategy**

---

## Core Entities

```java
enum VehicleType { BIKE, CAR, TRUCK }

abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;

    Vehicle(String licensePlate, VehicleType type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }
    public VehicleType getType() { return type; }
    public String getLicensePlate() { return licensePlate; }
}

class Car extends Vehicle {
    Car(String plate) { super(plate, VehicleType.CAR); }
}
class Bike extends Vehicle {
    Bike(String plate) { super(plate, VehicleType.BIKE); }
}
```

```java
enum SpotType { SMALL, MEDIUM, LARGE }

class ParkingSpot {
    private String id;
    private SpotType type;
    private boolean isFree = true;
    private Vehicle parkedVehicle;

    ParkingSpot(String id, SpotType type) {
        this.id = id;
        this.type = type;
    }

    // 🔑 core rule: spot ka type, vehicle ke type ko accommodate kar sake
    public boolean canFitVehicle(VehicleType vehicleType) {
        if (!isFree) return false;
        if (vehicleType == VehicleType.TRUCK) return type == SpotType.LARGE;
        if (vehicleType == VehicleType.CAR) return type == SpotType.MEDIUM || type == SpotType.LARGE;
        return true;  // BIKE kahi bhi fit ho sakti hai
    }

    public void assignVehicle(Vehicle v) { this.parkedVehicle = v; this.isFree = false; }
    public void removeVehicle() { this.parkedVehicle = null; this.isFree = true; }
    public boolean isFree() { return isFree; }
    public String getId() { return id; }
}
```

```java
class ParkingFloor {
    private int floorNumber;
    private List<ParkingSpot> spots = new ArrayList<>();

    ParkingFloor(int floorNumber, List<ParkingSpot> spots) {
        this.floorNumber = floorNumber;
        this.spots = spots;
    }

    // 🔑 floor ka apna kaam: apne andar khaali spot dhoondo
    public ParkingSpot findAvailableSpot(VehicleType type) {
        for (ParkingSpot spot : spots) {
            if (spot.canFitVehicle(type)) return spot;
        }
        return null;
    }
}
```

## Strategy Pattern — fee calculation (future mein badal sakta hai)

```java
interface FeeStrategy {
    double calculateFee(long durationInMinutes, VehicleType type);
}

class HourlyFeeStrategy implements FeeStrategy {
    public double calculateFee(long durationInMinutes, VehicleType type) {
        long hours = (long) Math.ceil(durationInMinutes / 60.0);
        double ratePerHour = (type == VehicleType.TRUCK) ? 50 : (type == VehicleType.CAR) ? 30 : 15;
        return hours * ratePerHour;
    }
}
```

## Ticket — entry/exit ka record

```java
class Ticket {
    private String ticketId;
    private Vehicle vehicle;
    private ParkingSpot spot;
    private long entryTime;

    Ticket(String ticketId, Vehicle vehicle, ParkingSpot spot) {
        this.ticketId = ticketId;
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = System.currentTimeMillis();
    }
    public ParkingSpot getSpot() { return spot; }
    public Vehicle getVehicle() { return vehicle; }
    public long getEntryTime() { return entryTime; }
}
```

## ParkingLot — Singleton, sab kuch coordinate karta hai (thoda Facade jaisa bhi)

```java
class ParkingLot {
    private static ParkingLot instance;   // 🔑 Singleton — pura note dekho: creational/01-singleton.md
    private List<ParkingFloor> floors = new ArrayList<>();
    private FeeStrategy feeStrategy = new HourlyFeeStrategy();
    private Map<String, Ticket> activeTickets = new HashMap<>();

    private ParkingLot() {}

    public static ParkingLot getInstance() {
        if (instance == null) instance = new ParkingLot();
        return instance;
    }

    public void addFloor(ParkingFloor floor) { floors.add(floor); }

    // Entry gate ka kaam
    public Ticket parkVehicle(Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            ParkingSpot spot = floor.findAvailableSpot(vehicle.getType());
            if (spot != null) {
                spot.assignVehicle(vehicle);
                Ticket ticket = new Ticket(UUID.randomUUID().toString(), vehicle, spot);
                activeTickets.put(ticket.getVehicle().getLicensePlate(), ticket);
                return ticket;
            }
        }
        throw new IllegalStateException("Parking full");
    }

    // Exit gate ka kaam
    public double unparkVehicle(String licensePlate) {
        Ticket ticket = activeTickets.remove(licensePlate);
        long durationMinutes = (System.currentTimeMillis() - ticket.getEntryTime()) / 60000;
        double fee = feeStrategy.calculateFee(durationMinutes, ticket.getVehicle().getType());
        ticket.getSpot().removeVehicle();
        return fee;
    }
}
```

**Line by line samjho**: `parkVehicle()` har floor pe jaake spot dhoondta hai
(SRP: ye dhoondne ka kaam khud `ParkingFloor.findAvailableSpot()` karta hai,
`ParkingLot` sirf floors pe loop karta hai). `unparkVehicle()` mein fee
calculation `feeStrategy` ko delegate hai — kal flat-rate chahiye ho toh
`feeStrategy = new FlatFeeStrategy()` set kar do, `ParkingLot` ka code nahi badalta.

## Patterns used & why
- **Singleton** — poore system mein ek hi `ParkingLot` honi chahiye
- **Strategy** — fee calculation logic switchable hai
- (Extension) **Factory** — agar vehicle creation complex ho jaye, `VehicleFactory` add kar sakte ho

## Extensibility — interview mein bolne wali baatein
- "Naya vehicle type (Bus) aaye toh `VehicleType` enum mein add karunga, aur `canFitVehicle()` mein ek condition — baaki kuch nahi chhedna."
- "Multiple entry gates chahiye ho toh `Gate` class bana ke usme `parkVehicle()` delegate kar dunga, thread-safety ke liye spot assignment `synchronized` karna padega taaki 2 gates ek hi spot na de dein."

Agla: [02-vending-machine.md](02-vending-machine.md)
