# Problem 3: Tic-Tac-Toe

## Interview mein aise approach karo

**Clarifying questions:**
- Board size fixed 3x3 hai ya NxN generic chahiye? (NxN pucho, better design dikhta hai)
- 2 players hain ya computer bhi khel sakta hai?
- Win check kaise — sirf rows/cols/diagonals?

**Assume**: NxN board (generic rakhenge, chhota extra effort hai but achha lagta hai), 2 human players, turn-by-turn.

**Nouns**: Board, Cell, Player, Symbol, Game.

**Trick**: Ye problem "design pattern dikhane" ke liye nahi hai — yaha interviewer dekhta hai tumhara **basic OOP aur clean code** kaisa hai (SRP achhe se follow ho raha hai ya sab ek class mein thoos diya). Isliye har class ka single, clear kaam rakho.

---

## Core Entities

```java
enum Symbol { X, O, EMPTY }

class Cell {
    private Symbol symbol = Symbol.EMPTY;
    public boolean isEmpty() { return symbol == Symbol.EMPTY; }
    public void setSymbol(Symbol s) { this.symbol = s; }
    public Symbol getSymbol() { return symbol; }
}
```

```java
class Player {
    private String name;
    private Symbol symbol;
    Player(String name, Symbol symbol) { this.name = name; this.symbol = symbol; }
    public Symbol getSymbol() { return symbol; }
    public String getName() { return name; }
}
```

```java
class Board {
    private int size;
    private Cell[][] grid;

    Board(int size) {
        this.size = size;
        grid = new Cell[size][size];
        for (int i = 0; i < size; i++)
            for (int j = 0; j < size; j++)
                grid[i][j] = new Cell();
    }

    public boolean placeSymbol(int row, int col, Symbol symbol) {
        if (row < 0 || row >= size || col < 0 || col >= size) return false;
        if (!grid[row][col].isEmpty()) return false;   // 🔑 already filled toh invalid move
        grid[row][col].setSymbol(symbol);
        return true;
    }

    public int getSize() { return size; }
    public Symbol getSymbolAt(int row, int col) { return grid[row][col].getSymbol(); }

    public boolean isFull() {
        for (int i = 0; i < size; i++)
            for (int j = 0; j < size; j++)
                if (grid[i][j].isEmpty()) return false;
        return true;
    }
}
```

## Win-checking logic — apna khud ka class, SRP ke liye

```java
class WinChecker {
    // 🔑 sabse recent move ke row/col se hi check karo — poora board scan karne se better
    public boolean checkWin(Board board, int row, int col, Symbol symbol) {
        return checkRow(board, row, symbol)
            || checkCol(board, col, symbol)
            || checkDiagonal(board, symbol)
            || checkAntiDiagonal(board, symbol);
    }

    private boolean checkRow(Board board, int row, Symbol symbol) {
        for (int col = 0; col < board.getSize(); col++)
            if (board.getSymbolAt(row, col) != symbol) return false;
        return true;
    }

    private boolean checkCol(Board board, int col, Symbol symbol) {
        for (int row = 0; row < board.getSize(); row++)
            if (board.getSymbolAt(row, col) != symbol) return false;
        return true;
    }

    private boolean checkDiagonal(Board board, Symbol symbol) {
        for (int i = 0; i < board.getSize(); i++)
            if (board.getSymbolAt(i, i) != symbol) return false;
        return true;
    }

    private boolean checkAntiDiagonal(Board board, Symbol symbol) {
        int n = board.getSize();
        for (int i = 0; i < n; i++)
            if (board.getSymbolAt(i, n - 1 - i) != symbol) return false;
        return true;
    }
}
```

## Game — poora flow coordinate karta hai

```java
class Game {
    private Board board;
    private WinChecker winChecker = new WinChecker();
    private List<Player> players;
    private int currentPlayerIndex = 0;

    Game(int boardSize, List<Player> players) {
        this.board = new Board(boardSize);
        this.players = players;
    }

    // ek move khelo, return karo game khatam hui ya nahi
    public boolean playMove(int row, int col) {
        Player currentPlayer = players.get(currentPlayerIndex);
        boolean placed = board.placeSymbol(row, col, currentPlayer.getSymbol());

        if (!placed) {
            System.out.println("Invalid move, phir se try karo");
            return false;
        }

        if (winChecker.checkWin(board, row, col, currentPlayer.getSymbol())) {
            System.out.println(currentPlayer.getName() + " jeet gaya!");
            return true;
        }

        if (board.isFull()) {
            System.out.println("Match draw ho gaya");
            return true;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();  // agle player ki turn
        return false;
    }
}
```

**Line by line samjho**: `Board` sirf grid manage karta hai (validity check,
place karna). `WinChecker` sirf jeetne ka logic jaanta hai — Board ke andar
ka data use karta hai par khud koi state nahi rakhta. `Game` dono ko
coordinate karta hai — turn switch karna, game-over decide karna. **Har
class ka ek hi kaam hai (SRP)** — yehi is problem mein sabse zyada matter karta hai.

## Patterns used & why
- Koi heavy pattern zaroori nahi hai yaha — is problem ka poora point hai
  **clean SRP-based split** dikhana. Agar interviewer "computer player bhi
  chahiye" bole, `Player` ko `HumanPlayer`/`ComputerPlayer` mein split karo
  aur move-decide karne ka logic **Strategy pattern** se alag kar do.

## Extensibility — interview mein bolne wali baatein
- "NxN already generic hai, koi change nahi chahiye."
- "Computer player add karna ho toh `MoveStrategy` interface banaunga (`decideMove(Board)`), `Player` class usse use karegi — Strategy pattern."
- "3 players wala variant chahiye ho toh `players` list already generic hai, `WinChecker` bhi symbol-agnostic hai — kaam ho jayega."

Agla: [04-library-management.md](04-library-management.md)
