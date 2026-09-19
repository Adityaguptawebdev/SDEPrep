# Problem 7: Snake & Ladder

## Interview mein aise approach karo

**Clarifying questions:**
- Board size fixed (100 cells) hai?
- Multiple players (2+) support karna hai?
- Exact 100 pe pahuchna zaroori hai (overshoot pe ruk jaye) ya bounce back?

**Assume**: 100 cells, 2+ players, exact landing zaroori nahi (overshoot allowed, seedha jeet).

**Nouns**: Board, Cell, Snake, Ladder, Dice, Player, Game.

**Trick jo yaha kaam aati hai**: Snake aur Ladder — dono ka **same kaam** hai
(player ko ek position se doosri position pe bhej dena, bas direction alag
hai — neeche vs upar). Isliye dono ko **ek hi interface/class** se model karo,
alag-alag mat banao — ye chhoti si insight interviewer ko impress karti hai.

---

## Core Entities

```java
// 🔑 Snake aur Ladder dono isi ek concept se ban jate hain — "Jump"
class Jump {
    private int start;
    private int end;
    Jump(int start, int end) { this.start = start; this.end = end; }
    public int getStart() { return start; }
    public int getEnd() { return end; }
}
// Snake: start > end (neeche jaata hai)
// Ladder: start < end (upar jaata hai)
// Game logic ko fark hi nahi padta konsa hai — bas "start pe pahuchte hi end pe chale jao"
```

```java
class Board {
    private int size;
    private Map<Integer, Jump> jumps = new HashMap<>();   // cell number -> jump (agar hai toh)

    Board(int size) { this.size = size; }

    public void addJump(Jump jump) {
        jumps.put(jump.getStart(), jump);
    }

    // 🔑 core logic: agar is cell pe snake/ladder hai, use final destination do
    public int getFinalPosition(int position) {
        Jump jump = jumps.get(position);
        return (jump != null) ? jump.getEnd() : position;
    }

    public int getSize() { return size; }
}
```

```java
class Dice {
    private int numDice;
    Dice(int numDice) { this.numDice = numDice; }

    public int roll() {
        int total = 0;
        Random random = new Random();
        for (int i = 0; i < numDice; i++) {
            total += random.nextInt(6) + 1;   // 1 se 6
        }
        return total;
    }
}
```

```java
class Player {
    private String name;
    private int currentPosition = 0;
    Player(String name) { this.name = name; }
    public String getName() { return name; }
    public int getCurrentPosition() { return currentPosition; }
    public void setCurrentPosition(int pos) { this.currentPosition = pos; }
}
```

## Game — poora flow chalata hai

```java
class Game {
    private Board board;
    private Dice dice;
    private Queue<Player> players;   // 🔑 Queue isliye taaki turn rotate karna aasan ho

    Game(Board board, Dice dice, List<Player> players) {
        this.board = board;
        this.dice = dice;
        this.players = new LinkedList<>(players);
    }

    public void play() {
        while (true) {
            Player currentPlayer = players.poll();   // turn nikal lo
            int diceValue = dice.roll();
            int newPosition = currentPlayer.getCurrentPosition() + diceValue;

            if (newPosition > board.getSize()) {
                // overshoot — is turn mein move mat karo
                System.out.println(currentPlayer.getName() + " overshoot, turn skip");
            } else {
                newPosition = board.getFinalPosition(newPosition);  // 🔑 snake/ladder check yehi ek line mein
                currentPlayer.setCurrentPosition(newPosition);
                System.out.println(currentPlayer.getName() + " -> position " + newPosition);
            }

            if (newPosition == board.getSize()) {
                System.out.println(currentPlayer.getName() + " jeet gaya!");
                break;
            }

            players.add(currentPlayer);   // turn wapas queue ke end mein — agla player chance lega
        }
    }
}
```

**Line by line samjho:** `board.getFinalPosition()` hi is design ka sabse
important hissa hai — chahe wahan snake ho ya ladder ho ya kuch na ho,
**caller (`Game`) ko fark hi nahi padta**, ek hi line se sab handle ho jata
hai. `Queue<Player>` use karna turn-rotation ko trivial bana deta hai — jis
player ki turn khatam hui, use wapas queue ke end mein daal do.

## Patterns used & why
- Heavy pattern zaroori nahi — is problem ka core insight hai **Snake aur
  Ladder ko ek hi abstraction (`Jump`) se model karna**, jisse `Game` ka
  code simple rehta hai.
- Agar dice rolling ka logic customizable chahiye (loaded dice, different
  number of dice) — us bhaag ko already `Dice` class mein isolate kiya hai,
  chaahe toh **Strategy** bhi bana sakte ho.

## Extensibility — interview mein bolne wali baatein
- "3 players ya usse zyada already support hai kyunki Queue generic hai."
- "Alag board size chahiye ho toh `Board(size)` constructor mein change, baaki kuch nahi."
- "Kisi player ko bounce-back rule chahiye (exact landing zaroori) toh sirf `Game.play()` mein overshoot ka condition badlega, baaki classes untouched."

Agla: [08-lru-cache.md](08-lru-cache.md)
