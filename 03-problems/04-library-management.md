# Problem 4: Library Management System

## Interview mein aise approach karo

**Clarifying questions:**
- Ek hi book ki multiple copies ho sakti hain? (haan — important distinction)
- Reservation/waitlist chahiye agar book unavailable ho?
- Fine/late fee chahiye?
- Members ke roles alag hain (Student/Faculty — alag borrow limits)?

**Assume**: Multiple copies per book, simple due-date based fine, single member type for simplicity (extend later).

**Sabse important insight jo bolna hai**: *"Book"* (jaise "Harry Potter") aur
*"BookItem"* (uski ek physical copy jo shelf pe rakhi hai) — **do alag
entities** hain. Log yahi galti karte hain — dono ko ek class maan lete hain.
Real library mein "Harry Potter" ki 5 copies ho sakti hain, har copy ka apna
barcode/condition hota hai.

**Nouns**: Book, BookItem, Member, Library, Catalog, Loan (borrowing record).

---

## Core Entities

```java
class Book {
    private String isbn;
    private String title;
    private String author;
    Book(String isbn, String title, String author) {
        this.isbn = isbn; this.title = title; this.author = author;
    }
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
}
```

```java
enum BookItemStatus { AVAILABLE, LOANED, RESERVED }

// 🔑 ye ek PHYSICAL copy hai — Book se alag
class BookItem {
    private String barcode;
    private Book book;
    private BookItemStatus status = BookItemStatus.AVAILABLE;

    BookItem(String barcode, Book book) {
        this.barcode = barcode;
        this.book = book;
    }
    public Book getBook() { return book; }
    public BookItemStatus getStatus() { return status; }
    public void setStatus(BookItemStatus status) { this.status = status; }
    public String getBarcode() { return barcode; }
}
```

```java
class Member {
    private String memberId;
    private String name;
    private List<Loan> currentLoans = new ArrayList<>();
    private static final int MAX_BOOKS_ALLOWED = 5;   // 🔑 business rule

    Member(String memberId, String name) {
        this.memberId = memberId;
        this.name = name;
    }

    public boolean canBorrow() { return currentLoans.size() < MAX_BOOKS_ALLOWED; }
    public void addLoan(Loan loan) { currentLoans.add(loan); }
    public void removeLoan(Loan loan) { currentLoans.remove(loan); }
    public String getMemberId() { return memberId; }
}
```

```java
class Loan {
    private BookItem bookItem;
    private Member member;
    private LocalDate issueDate;
    private LocalDate dueDate;

    Loan(BookItem bookItem, Member member) {
        this.bookItem = bookItem;
        this.member = member;
        this.issueDate = LocalDate.now();
        this.dueDate = issueDate.plusDays(14);   // 2 hafte ki default period
    }
    public BookItem getBookItem() { return bookItem; }
    public LocalDate getDueDate() { return dueDate; }
}
```

## Catalog — books dhoondhne ka kaam (SRP: search alag responsibility hai)

```java
class Catalog {
    private Map<String, List<BookItem>> itemsByIsbn = new HashMap<>();

    public void addBookItem(BookItem item) {
        itemsByIsbn.computeIfAbsent(item.getBook().getIsbn(), k -> new ArrayList<>()).add(item);
    }

    // 🔑 available copy dhoondo, poori list nahi
    public BookItem findAvailableCopy(String isbn) {
        List<BookItem> items = itemsByIsbn.getOrDefault(isbn, Collections.emptyList());
        for (BookItem item : items) {
            if (item.getStatus() == BookItemStatus.AVAILABLE) return item;
        }
        return null;
    }
}
```

## Library — poora flow coordinate karta hai (Facade jaisa role)

```java
class Library {
    private Catalog catalog = new Catalog();
    private static final double FINE_PER_DAY = 5.0;

    public Loan issueBook(String isbn, Member member) {
        if (!member.canBorrow()) {
            throw new IllegalStateException("Borrow limit reach ho gayi");
        }
        BookItem item = catalog.findAvailableCopy(isbn);
        if (item == null) {
            throw new IllegalStateException("Koi copy available nahi hai");
        }
        item.setStatus(BookItemStatus.LOANED);
        Loan loan = new Loan(item, member);
        member.addLoan(loan);
        return loan;
    }

    public double returnBook(Loan loan, Member member) {
        loan.getBookItem().setStatus(BookItemStatus.AVAILABLE);
        member.removeLoan(loan);

        long daysLate = ChronoUnit.DAYS.between(loan.getDueDate(), LocalDate.now());
        return daysLate > 0 ? daysLate * FINE_PER_DAY : 0;   // 🔑 fine sirf late hone pe
    }

    public Catalog getCatalog() { return catalog; }
}
```

**Kya ho raha hai samjho:** `issueBook()` mein pehle member ki limit check
hoti hai, phir `Catalog` se ek available copy dhoondhi jaati hai (`Book` ke
level pe nahi, `BookItem` ke level pe — kyunki asal mein ek specific physical
copy issue ho rahi hai). `returnBook()` fine calculate karta hai due-date se
diff nikaal ke.

## Patterns used & why
- Explicit heavy pattern zaroori nahi — is problem ka focus hai **Book vs
  BookItem ka sahi separation** aur clean responsibility split (`Catalog`
  sirf search karta hai, `Library` flow coordinate karta hai, `Member` apni
  hi eligibility check karta hai).
- Agar reservation/waitlist add karna ho, jab book available ho jaye sabko
  batana ho — **Observer pattern** (waiting members = observers).

## Extensibility — interview mein bolne wali baatein
- "Member types (Student vs Faculty) alag borrow limits chahiye ho toh `Member` ko abstract bana ke subclasses banaunga, ya `BorrowPolicy` Strategy inject karunga."
- "Waitlist chahiye ho toh `BookItem` ke available hone pe waiting `Member`s ko Observer pattern se notify karunga."

Agla: [05-elevator-system.md](05-elevator-system.md)
