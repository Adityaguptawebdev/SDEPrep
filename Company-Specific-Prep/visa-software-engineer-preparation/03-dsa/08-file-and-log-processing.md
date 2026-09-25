# DSA 8/8 — File & Log Processing (parsing, big files, parallel processing)

> **Why this note exists**: a Nov 2025 Bengaluru SWE candidate reported the topic **"file parsing and file manipulation"** ([JT-2025-11](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-karnataka-november-17-2025-no-offer-positive-a80c80fc/)), a 10-month-experience candidate got **"rate-limit IPs from a log file → what if the log is GBs? → external sorting"** ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)), and an experienced candidate was asked to **process many transaction files in parallel and regroup them** ([LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/), 2021, 6 YOE).
> No exact problem statement is public, so the problems below are **practice problems written for this guide** (labelled "Practice"), built around those reports. Every block runs on temporary files and its output is checked.

**Easy analogy — railway parcel office**: Hazaaron parcels (lines) aate hain. Ek clerk sab ek saath table pe nahi rakh sakta (RAM kam hai) — toh **ek-ek parcel scan** karta hai (streaming), kharab label wale side mein (malformed lines), city ke hisaab se **alag bori** mein daalta hai (hash partition), aur zyada load ho toh **4 clerks parallel** kaam karte hain, end mein totals jod dete hain.

| # | Topic | Tied to report | Status |
|---|---|---|---|
| 1 | Parse a transaction log safely (skip bad rows, de-duplicate, aggregate) | file parsing (JT-2025-11) | Practice |
| 2 | Split a huge file by key (hash partitioning) | "log is GBs" (LC-6817721) | Practice |
| 3 | External merge sort (sort a file bigger than RAM) | "external sorting" (LC-6817721) | Practice |
| 4 | Process many files in parallel and merge results | parallel transaction files (LC-1002109, Senior) | Practice |
| 5 | Everyday file manipulation with `java.nio.file` | file manipulation (JT-2025-11) | Practice |

---

## 1. Parse a transaction log safely

**Practice problem**: each line is `txnId,userId,amountPaise,status`. The first line may be a header. Some lines are broken. The same `txnId` can appear twice (a retried request). Return the total `SUCCESS` amount per user, sorted by user id.

**What the interviewer checks** (from the reported themes): streaming instead of loading the whole file, handling bad rows without crashing, **idempotency** (count a retried transaction once — very "payments"), exact money (integer paise or `BigDecimal`, never `double`).

```
 txnId,userId,amountPaise,status        ← header: skip
 t1,u1,5000,SUCCESS                     ✔
 t2,u2,abc,SUCCESS                      ✗ bad amount → skip + count as rejected
 t1,u1,5000,SUCCESS                     ✗ duplicate txnId (retry) → ignore
 t3,u1,2500,FAILED                      ✗ not SUCCESS
 t4,u2,1000,SUCCESS                     ✔
 t5,u3                                  ✗ wrong column count
```

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

class TransactionLogSummary {
    static Map<String, Long> successTotals(BufferedReader reader) throws IOException {
        Map<String, Long> totals = new TreeMap<>();                   // sorted by user id
        Set<String> seenTxn = new HashSet<>();
        int rejected = 0;
        String line;
        while ((line = reader.readLine()) != null) {                  // one line in memory at a time
            if (line.isBlank() || line.startsWith("txnId")) continue;  // header / empty
            String[] f = line.split(",", -1);
            if (f.length != 4) { rejected++; continue; }
            long amount;
            try { amount = Long.parseLong(f[2].trim()); } catch (NumberFormatException e) { rejected++; continue; }
            if (!seenTxn.add(f[0].trim())) continue;                   // duplicate txnId → idempotent
            if (!f[3].trim().equals("SUCCESS")) continue;
            totals.merge(f[1].trim(), amount, Long::sum);
        }
        System.out.println("rejected lines = " + rejected);
        return totals;
    }

    public static void main(String[] args) throws IOException {
        String file = "txnId,userId,amountPaise,status\n"
                + "t1,u1,5000,SUCCESS\n"
                + "t2,u2,abc,SUCCESS\n"
                + "t1,u1,5000,SUCCESS\n"
                + "t3,u1,2500,FAILED\n"
                + "t4,u2,1000,SUCCESS\n"
                + "t5,u3\n";
        System.out.println(successTotals(new BufferedReader(new StringReader(file))));
    }
}
```

```text
rejected lines = 2
{u1=5000, u2=1000}
```

**Time**: O(lines). **Space**: O(distinct users + distinct txnIds) — the `seenTxn` set is the part that can blow up for a huge file (follow-up: keep only the last N minutes of ids, or de-duplicate with a partitioned approach like §2).
**Follow-ups**: real CSV has quoted commas → use a CSV library (Apache Commons CSV / OpenCSV) · write rejected lines to a "dead letter" file for audit · amounts as `"12.50"` → `new BigDecimal(s).movePointRight(2).longValueExact()`.
**🗣️ Interview mein aise bolo**: "File ko stream karta hoon, poora memory mein nahi. Har line validate — galat line skip karke count/log. Payment data hai toh duplicate txnId ko ek hi baar count karta hoon — idempotency. Paise ko long paise mein rakhta hoon, double mein kabhi nahi."

---

## 2. Split a huge file by key (hash partitioning)

**Practice problem**: a log `timestamp ip` is too big for memory, and not sorted by IP. Write it into `N` part files so that **all lines of one IP land in the same part** — then each part is small enough to process alone (for example with the sliding-window limiter from [DSA 2/8](02-sliding-window-and-rate-limiter.md)).

```
            hash(ip) % 3
 big.log ─────────────────► part-0.log   (all lines of IPs whose hash % 3 == 0)
                        ├──► part-1.log
                        └──► part-2.log   each part fits in RAM → process one by one
```

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

class HashPartitioner {
    static List<Path> partition(Path input, Path outDir, int parts) throws IOException {
        List<Path> paths = new ArrayList<>();
        List<BufferedWriter> writers = new ArrayList<>();
        try {
            for (int i = 0; i < parts; i++) {
                Path p = outDir.resolve("part-" + i + ".log");
                paths.add(p);
                writers.add(Files.newBufferedWriter(p));
            }
            try (BufferedReader reader = Files.newBufferedReader(input)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    String[] f = line.trim().split("\\s+");
                    if (f.length != 2) continue;
                    int bucket = Math.floorMod(f[1].hashCode(), parts);   // same ip → same bucket
                    writers.get(bucket).write(line);
                    writers.get(bucket).newLine();
                }
            }
        } finally {
            for (BufferedWriter w : writers) w.close();
        }
        return paths;
    }

    public static void main(String[] args) throws IOException {
        Path dir = Files.createTempDirectory("partition-demo");
        Path log = dir.resolve("big.log");
        Files.write(log, List.of("1 10.0.0.1", "2 10.0.0.2", "3 10.0.0.1", "4 10.0.0.3", "5 10.0.0.2"));
        for (Path part : partition(log, dir, 2)) {
            List<String> lines = Files.readAllLines(part);
            boolean oneIpPerBucket = lines.stream().map(l -> l.split(" ")[1])
                    .allMatch(ip -> Math.floorMod(ip.hashCode(), 2) == Integer.parseInt(part.getFileName().toString().substring(5, 6)));
            System.out.println(part.getFileName() + " lines=" + lines.size() + " consistent=" + oneIpPerBucket);
        }
    }
}
```

```text
part-0.log lines=3 consistent=true
part-1.log lines=2 consistent=true
```

**Time**: one read + one write of the data. **Space**: O(parts) open writers.
**Watch out**: one very hot key (a DDoS IP!) can make one part too big → split that key again by time, or count it with a streaming counter.

---

## 3. External merge sort (file bigger than RAM)

This is the **"external sorting"** answer the selected 10-month candidate gave for the GB log follow-up ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/)).

```
 Phase 1 (runs):   read ≤ M lines → sort in memory → write run-0, run-1, … (each sorted)
 Phase 2 (merge):  open all runs, put the first line of each in a min-heap,
                   repeatedly pop the smallest, write it, push the next line from that run
 I/O: each line is read twice and written twice → O(N log(N/M)) comparisons, sequential disk access
```

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

class ExternalSorter {
    static void sort(Path input, Path output, int maxLinesInMemory) throws IOException {
        Path tmp = Files.createTempDirectory("runs");
        List<Path> runs = new ArrayList<>();
        try (BufferedReader reader = Files.newBufferedReader(input)) {        // phase 1
            List<String> chunk = new ArrayList<>();
            String line;
            while ((line = reader.readLine()) != null) {
                chunk.add(line);
                if (chunk.size() == maxLinesInMemory) { runs.add(writeRun(chunk, tmp, runs.size())); chunk.clear(); }
            }
            if (!chunk.isEmpty()) runs.add(writeRun(chunk, tmp, runs.size()));
        }
        List<BufferedReader> readers = new ArrayList<>();                     // phase 2
        PriorityQueue<Object[]> heap = new PriorityQueue<>((a, b) -> ((String) a[0]).compareTo((String) b[0]));
        try (BufferedWriter out = Files.newBufferedWriter(output)) {
            for (int i = 0; i < runs.size(); i++) {
                BufferedReader r = Files.newBufferedReader(runs.get(i));
                readers.add(r);
                String first = r.readLine();
                if (first != null) heap.add(new Object[]{first, i});
            }
            while (!heap.isEmpty()) {
                Object[] top = heap.poll();
                out.write((String) top[0]);
                out.newLine();
                String next = readers.get((Integer) top[1]).readLine();
                if (next != null) heap.add(new Object[]{next, top[1]});
            }
        } finally {
            for (BufferedReader r : readers) r.close();
        }
    }

    private static Path writeRun(List<String> chunk, Path dir, int index) throws IOException {
        Collections.sort(chunk);
        Path run = dir.resolve("run-" + index + ".txt");
        Files.write(run, chunk);
        return run;
    }

    public static void main(String[] args) throws IOException {
        Path dir = Files.createTempDirectory("extsort-demo");
        Path in = dir.resolve("in.txt"), out = dir.resolve("out.txt");
        Files.write(in, List.of("10.0.0.9 5", "10.0.0.1 7", "10.0.0.5 1", "10.0.0.1 2", "10.0.0.3 9", "10.0.0.2 4", "10.0.0.8 3"));
        sort(in, out, 3);                                 // only 3 lines "fit" in memory → 3 runs
        Files.readAllLines(out).forEach(System.out::println);
    }
}
```

```text
10.0.0.1 2
10.0.0.1 7
10.0.0.2 4
10.0.0.3 9
10.0.0.5 1
10.0.0.8 3
10.0.0.9 5
```

**Time**: O(N log N) comparisons, 2 sequential passes over disk. **Space**: O(M) lines in memory + one line per run in the heap.
**Follow-ups**: too many runs to open at once → merge in multiple passes (k-way with k = files you can open) · sort by IP **then** time so the sliding window can run per IP · distributed version = MapReduce/Spark `sortBy`.

---

## 4. Process many files in parallel and merge results

**Reported (experienced candidate, 2021)**: *"handling a large number of files having transaction data which need to be processed parallelly. Need to group into some other files and how to store and process this efficiently"* ([LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/)). For 0–1 YOE the useful part is: **thread pool + per-file partial results + a single merge** (no shared mutable map without synchronisation).

```
 files ─► ExecutorService (4 threads) ─► Future<Map<user, total>> per file
                                              │
                                              ▼  merge on the main thread
                                         Map<user, total>
```

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class ParallelFileAggregator {
    static Map<String, Long> totalsPerUser(List<Path> files, int threads)
            throws InterruptedException, ExecutionException {
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        try {
            List<Future<Map<String, Long>>> partials = new ArrayList<>();
            for (Path file : files) partials.add(pool.submit(() -> totalsOf(file)));   // one task per file
            Map<String, Long> merged = new TreeMap<>();
            for (Future<Map<String, Long>> f : partials) {
                f.get().forEach((user, amount) -> merged.merge(user, amount, Long::sum)); // single-threaded merge
            }
            return merged;
        } finally {
            pool.shutdown();                                  // always release the threads
        }
    }

    static Map<String, Long> totalsOf(Path file) throws IOException {
        Map<String, Long> local = new HashMap<>();            // thread-confined: no locking needed
        for (String line : Files.readAllLines(file)) {
            String[] f = line.split(",");
            if (f.length == 2) local.merge(f[0], Long.parseLong(f[1]), Long::sum);
        }
        return local;
    }

    public static void main(String[] args) throws Exception {
        Path dir = Files.createTempDirectory("parallel-demo");
        List<Path> files = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Path p = dir.resolve("txn-" + i + ".csv");
            Files.write(p, List.of("u1," + (i + 1) * 100, "u2,50", "u" + (i % 2 + 3) + ",10"));
            files.add(p);
        }
        System.out.println(totalsPerUser(files, 3));
    }
}
```

```text
{u1=1500, u2=250, u3=30, u4=20}
```

**Design points to say**: size the pool (CPU-bound ≈ cores, I/O-bound can be more) · bounded queue so you don't load 10,000 files at once · one bad file must not kill the job (catch per task, record failures, retry) · idempotent output (re-running must not double-count — write results with a job id, or overwrite) · keep per-file partial results so you can resume after a crash · very large scale → Spark / batch framework.
**🗣️ Interview mein aise bolo**: "Har file ek task, fixed thread pool pe. Har task apna local map banata hai — shared state nahi, toh locking ki zaroorat nahi — end mein main thread sab merge karta hoon. Failure ek file tak seemit, retry/re-run safe rakhta hoon."

---

## 5. Everyday file manipulation with `java.nio.file`

If "file manipulation" means basic operations, these are the calls to know (create, write, append, read lazily, list, move/rename, delete, walk).

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class FileManipulation {
    public static void main(String[] args) throws IOException {
        Path dir = Files.createTempDirectory("fm-demo");
        Path report = dir.resolve("report.txt");

        Files.write(report, List.of("line 1", "line 2"));                              // create/overwrite
        Files.write(report, List.of("line 3"), StandardOpenOption.APPEND);             // append
        try (Stream<String> lines = Files.lines(report)) {                             // lazy read
            System.out.println("lines = " + lines.count());
        }

        Path archived = Files.move(report, dir.resolve("report-2026-09.txt"),          // rename/move
                StandardCopyOption.REPLACE_EXISTING);
        Files.createDirectories(dir.resolve("old"));
        Files.copy(archived, dir.resolve("old").resolve("copy.txt"));

        try (Stream<Path> walk = Files.walk(dir)) {                                    // recursive listing
            List<String> names = walk.filter(Files::isRegularFile)
                    .map(p -> dir.relativize(p).toString())
                    .sorted()
                    .collect(Collectors.toList());
            System.out.println(names);
        }

        Files.delete(dir.resolve("old").resolve("copy.txt"));                          // delete
        System.out.println("copy exists? " + Files.exists(dir.resolve("old").resolve("copy.txt")));
    }
}
```

```text
lines = 3
[old/copy.txt, report-2026-09.txt]
copy exists? false
```

**Traps**: forgetting to close streams (`Files.lines`, `Files.walk` hold file handles → use try-with-resources) · `readAllLines` on a 5 GB file → `OutOfMemoryError` (stream instead) · default charset differences (pass `StandardCharsets.UTF_8` in real code).

---

⚡ **Quick revision**: stream, don't load · validate every line, count rejects · de-duplicate by id (idempotency) · money in integer paise · too big → hash-partition by key or external sort · many files → thread pool + local results + one merge · close every file handle.

Back to [DSA index](README.md) · Next: [04 — Core Java →](../04-java/README.md)
