# LLD 4 — Library Management (not reported at Visa)

> **Visa evidence**: **none**. In our research the only "Library Management System (CRUD for books/categories)" questions came from **other companies** (APTIV, NetApp) in a multi-company post ([LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/)). It's here because you asked, and because it's a good warm-up for entity modelling. Fuller version in this repo: [LLD/03-problems/04-library-management](../../../LLD/03-problems/04-library-management.md).

**Easy analogy — college library card**: Har member ke card pe max 3 books, 14 din ki due date, late hone pe fine. Ek book ki kai copies ho sakti hain — issue copy hoti hai, "title" nahi.

## Requirements
- Add books (a title can have several copies); register members.
- Issue a copy (max 3 per member, only if available); return it; fine for late returns.
- Search by title (keep simple).

## Entities
```
 Book (isbn, title) 1──* BookCopy (copyId, available)
 Member (id, name) 1──* Loan (copy, issuedDay, dueDay, returnedDay)
 Library — issue(), returnCopy(), search()        FinePolicy — can vary (Strategy)
```

## Code

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Library {
    record Book(String isbn, String title) {}

    static class BookCopy {
        final String copyId; final Book book; boolean available = true;
        BookCopy(String copyId, Book book) { this.copyId = copyId; this.book = book; }
    }

    static class Loan {
        final BookCopy copy; final String memberId; final int dueDay;
        Loan(BookCopy copy, String memberId, int dueDay) { this.copy = copy; this.memberId = memberId; this.dueDay = dueDay; }
    }

    interface FinePolicy { long fine(int daysLate); }

    static final int MAX_BOOKS = 3, LOAN_DAYS = 14;
    private final Map<String, BookCopy> copies = new HashMap<>();
    private final Map<String, List<Loan>> loansByMember = new HashMap<>();
    private final Map<String, Loan> activeLoanByCopy = new HashMap<>();
    private final FinePolicy finePolicy;

    Library(FinePolicy finePolicy) { this.finePolicy = finePolicy; }

    void addCopy(String copyId, Book book) { copies.put(copyId, new BookCopy(copyId, book)); }

    void issue(String memberId, String copyId, int today) {
        BookCopy copy = copies.get(copyId);
        if (copy == null || !copy.available) throw new IllegalStateException(copyId + " not available");
        List<Loan> loans = loansByMember.computeIfAbsent(memberId, k -> new ArrayList<>());
        if (loans.size() >= MAX_BOOKS) throw new IllegalStateException(memberId + " already has " + MAX_BOOKS + " books");
        Loan loan = new Loan(copy, memberId, today + LOAN_DAYS);
        copy.available = false;
        loans.add(loan);
        activeLoanByCopy.put(copyId, loan);
    }

    long returnCopy(String copyId, int today) {
        Loan loan = activeLoanByCopy.remove(copyId);
        if (loan == null) throw new IllegalStateException(copyId + " is not issued");
        loan.copy.available = true;
        loansByMember.get(loan.memberId).remove(loan);
        return finePolicy.fine(Math.max(0, today - loan.dueDay));
    }

    public static void main(String[] args) {
        Library lib = new Library(daysLate -> daysLate * 10L);          // ₹10 per late day
        Book clean = new Book("978-0132350884", "Clean Code");
        lib.addCopy("CC-1", clean);
        lib.addCopy("CC-2", clean);
        lib.issue("m1", "CC-1", 1);
        try { lib.issue("m2", "CC-1", 2); } catch (IllegalStateException e) { System.out.println(e.getMessage()); }
        lib.issue("m2", "CC-2", 2);
        System.out.println("fine for m1 returning on day 18: ₹" + lib.returnCopy("CC-1", 18));
        System.out.println("fine for m2 returning on day 10: ₹" + lib.returnCopy("CC-2", 10));
    }
}
```

```text
CC-1 not available
fine for m1 returning on day 18: ₹30
fine for m2 returning on day 10: ₹0
```

## Follow-ups
- Reservations/waitlist (queue per title, notify on return — Observer) · different fine rules per member type (`FinePolicy` Strategy) · concurrency: two librarians issue the last copy → synchronize per copy or use a DB conditional update (`available = true` check in the `UPDATE`).

Next: [LLD 5 — Payment processing LLD →](05-payment-processing-lld.md)
