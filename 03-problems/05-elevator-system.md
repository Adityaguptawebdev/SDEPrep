# Problem 5: Elevator System

## Interview mein aise approach karo

**Clarifying questions:**
- Kitne elevators hain building mein? (multiple — dispatch logic important banega)
- Har elevator ki max capacity?
- Scheduling algorithm simple chahiye (nearest elevator) ya realistic (SCAN algorithm — jaisi disk scheduling)?

**Assume**: Multiple elevators, ek `Controller` decide karta hai kaunsi elevator request handle karegi (nearest-first strategy).

**Nouns**: Elevator, ElevatorController, Request, Direction, Door, Floor.

**Do bade signals jo patterns yaad dilate hain:**
1. "Elevator ka behavior uski current state (Idle/Moving/DoorOpen) pe depend karta hai" → **State pattern**
2. "Konsi elevator request lega, ye algorithm change ho sakta hai (nearest vs SCAN)" → **Strategy pattern**

---

## Core Entities

```java
enum Direction { UP, DOWN, IDLE }

class Request {
    private int floor;
    private Direction direction;   // external request ke liye (button bahar dabaya)
    Request(int floor, Direction direction) {
        this.floor = floor;
        this.direction = direction;
    }
    public int getFloor() { return floor; }
    public Direction getDirection() { return direction; }
}
```

## State Pattern — Elevator ka behavior state ke hisaab se

```java
interface ElevatorState {
    void handle(Elevator elevator);
}

class IdleState implements ElevatorState {
    public void handle(Elevator elevator) {
        if (!elevator.getRequests().isEmpty()) {
            elevator.setState(elevator.getMovingState());   // request aayi, moving state mein jao
        }
    }
}

class MovingState implements ElevatorState {
    public void handle(Elevator elevator) {
        int nextFloor = elevator.getRequests().poll();
        System.out.println("Elevator " + elevator.getId() + " floor " + nextFloor + " ki taraf ja rahi hai");
        elevator.setCurrentFloor(nextFloor);
        elevator.setState(elevator.getDoorOpenState());
    }
}

class DoorOpenState implements ElevatorState {
    public void handle(Elevator elevator) {
        System.out.println("Door khula floor " + elevator.getCurrentFloor() + " pe");
        // door band hone ke baad wapas Idle ya agli request pe Moving
        if (elevator.getRequests().isEmpty()) {
            elevator.setState(elevator.getIdleState());
        } else {
            elevator.setState(elevator.getMovingState());
        }
    }
}
```

## Elevator — apni requests ki queue aur current state hold karta hai

```java
class Elevator {
    private int id;
    private int currentFloor = 0;
    private Queue<Integer> requests = new LinkedList<>();   // 🔑 simplification: sorted queue of floors to visit

    private ElevatorState idleState = new IdleState();
    private ElevatorState movingState = new MovingState();
    private ElevatorState doorOpenState = new DoorOpenState();
    private ElevatorState currentState = idleState;

    Elevator(int id) { this.id = id; }

    public void addRequest(int floor) { requests.add(floor); }
    public void step() { currentState.handle(this); }   // ek "tick" aage badhao

    // getters/setters jo states use karte hain
    public int getId() { return id; }
    public int getCurrentFloor() { return currentFloor; }
    public void setCurrentFloor(int floor) { this.currentFloor = floor; }
    public Queue<Integer> getRequests() { return requests; }
    public void setState(ElevatorState s) { this.currentState = s; }
    public ElevatorState getIdleState() { return idleState; }
    public ElevatorState getMovingState() { return movingState; }
    public ElevatorState getDoorOpenState() { return doorOpenState; }
}
```

## Strategy Pattern — konsi elevator request handle karegi

```java
interface DispatchStrategy {
    Elevator selectElevator(List<Elevator> elevators, Request request);
}

// simplest strategy: jo elevator current floor ke sabse paas hai
class NearestElevatorStrategy implements DispatchStrategy {
    public Elevator selectElevator(List<Elevator> elevators, Request request) {
        Elevator best = elevators.get(0);
        int minDistance = Math.abs(best.getCurrentFloor() - request.getFloor());

        for (Elevator elevator : elevators) {
            int distance = Math.abs(elevator.getCurrentFloor() - request.getFloor());
            if (distance < minDistance) {
                minDistance = distance;
                best = elevator;
            }
        }
        return best;
    }
}
```

## ElevatorController — sab elevators ko manage karta hai (Facade jaisa)

```java
class ElevatorController {
    private List<Elevator> elevators;
    private DispatchStrategy dispatchStrategy;

    ElevatorController(List<Elevator> elevators, DispatchStrategy dispatchStrategy) {
        this.elevators = elevators;
        this.dispatchStrategy = dispatchStrategy;
    }

    // koi bhi floor pe button dabaye, ye method call hota hai
    public void requestElevator(int floor, Direction direction) {
        Request request = new Request(floor, direction);
        Elevator chosen = dispatchStrategy.selectElevator(elevators, request);
        chosen.addRequest(floor);
    }
}
```

**Line by line samjho:** `Elevator` ko khud nahi pata "main konsa kaam
karun" — usse `currentState.handle(this)` bolna hai, jo bhi state hai wahi
decide karegi (ye [State pattern](../02-design-patterns/behavioral/03-state.md)
ka wahi structure hai jo Vending Machine mein dekha tha). `ElevatorController`
ko elevators ke internal working se matlab nahi — usse sirf `dispatchStrategy`
se poochna hai "kaunsi elevator bhejun", aur us elevator ko request de deni hai.

## Patterns used & why
- **State** — Idle/Moving/DoorOpen transitions clean rehte hain, koi `if (state == "MOVING")` chain nahi
- **Strategy** — dispatch algorithm (Nearest vs SCAN) switch ho sakta hai bina `ElevatorController` chhede

## Extensibility — interview mein bolne wali baatein
- "Better algorithm (SCAN — jo ek direction mein saari requests nipta ke phir mudta hai) chahiye ho toh bas `DispatchStrategy` ka naya implementation banaunga, `ElevatorController` ka code same rahega."
- "Capacity limit add karni ho toh `Elevator` mein `currentLoad` field aur `addRequest` mein check add hoga."

Agla: [06-atm.md](06-atm.md)
