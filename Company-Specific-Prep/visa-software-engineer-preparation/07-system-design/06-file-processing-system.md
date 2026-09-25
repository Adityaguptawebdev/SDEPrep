# SD 6 — File Processing System (bulk transaction / settlement files)

> **Visa evidence**: "A design question about handling a large number of files having transaction data which need to be processed parallelly. Need to group into some other files and how to store and process this efficiently" ([LC-1002109](https://leetcode.com/discuss/post/1002109/visa-software-engineer-experienced-rejec-g3v7/), 2021, experienced SWE) · topic "file parsing and file manipulation" ([JT-2025-11](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-karnataka-november-17-2025-no-offer-positive-a80c80fc/), Nov 2025, Bengaluru SWE) · "log file in GBs → external sorting" ([LC-6817721](https://leetcode.com/discuss/post/6817721/visa-software-engineer-bangalore-may-202-qcpc/), EC). Frequency: **MEDIUM** as a theme. Code for parsing, partitioning, external sort and parallel aggregation: [DSA 8/8](../03-dsa/08-file-and-log-processing.md).

**Easy analogy — exam answer-sheet evaluation centre**: Lakhs of copies aati hain (files). Pehle **register** karo (upload + checksum), bundles banao (chunks), alag-alag examiners ko do (parallel workers), har bundle ka status register mein (checkpoints), koi examiner beech mein chala gaya toh sirf uska bundle dobara (retry just that chunk), aur end mein subject-wise marksheet (grouped output files).

### Requirements (clarify first)
- Who sends files, how often, how big? (e.g. 5,000 merchant files/day, 10 MB–5 GB each, CSV/fixed-width)
- What processing? validate → parse → enrich → aggregate → **group by merchant/date** into output files → load into DB.
- Deadlines (e.g. settlement files must be done by 6 AM)? Must reprocessing be safe?

### Functional Requirements
- Upload/ingest files (SFTP drop, API, or object storage).
- Validate format + checksums; parse records; reject bad lines into an error report.
- Transform/aggregate; write grouped outputs (e.g. one file per merchant per day) and/or load into DB.
- Status and error reporting per file; reprocess on demand.

### Non-functional Requirements
- Throughput to meet the deadline; horizontal scale.
- **Idempotent**: the same file uploaded twice must not be processed twice.
- Fault-tolerant: a crash mid-file resumes from the last checkpoint, not from zero.
- Auditable: which file produced which records.

### APIs
```
 POST /api/v1/files            (multipart or pre-signed URL flow) → {"fileId":"f_…","status":"RECEIVED"}
 GET  /api/v1/files/{fileId}   → {"status":"PROCESSING","chunksDone":37,"chunksTotal":50,"errors":12}
 POST /api/v1/files/{fileId}/reprocess
 GET  /api/v1/files/{fileId}/errors  → link to the error report
```

### High-level architecture
```
 SFTP / API upload ─► Object storage (raw/) ─► "file received" event ─► Orchestrator
                                                                          │ 1. checksum → dedupe (seen before?)
                                                                          │ 2. validate header/trailer counts
                                                                          │ 3. split into chunks (byte ranges / N lines)
                                                                          ▼
                                                    chunk tasks on a queue (SQS / Kafka)
                                    ┌──────────────┬──────────────┬──────────────┐
                                    ▼              ▼              ▼              ▼
                                 worker 1       worker 2       worker 3       worker N   (autoscaled)
                                    │ parse, validate, enrich; write partial results partitioned by merchant
                                    └──────────────┴──── object storage (staging/) ──────┘
                                                              │ all chunks done?
                                                              ▼
                                                      Merge / group step ─► outputs (merchant/day files)
                                                              └─► DB bulk load, notifications, error report
 job + chunk status table (DB) tracks everything; the orchestrator retries failed chunks only
```

### Components
- **Ingest** (SFTP gateway / pre-signed upload URLs) → object storage.
- **Orchestrator**: dedupe, validation, chunking, tracks job/chunk state, triggers the merge.
- **Workers**: stateless, pull chunk tasks, stream-parse (never load 5 GB into memory).
- **Merge/group step**: combines partial outputs per key (hash-partitioned by merchant → each partition merged independently).
- **Reporting**: status API, error files, alerts.

### Database schema
```
 file_job(file_id PK, source, checksum_sha256 UNIQUE, size_bytes, status, total_chunks,
          received_at, completed_at)                          -- UNIQUE checksum = duplicate upload guard
 file_chunk(file_id, chunk_no, byte_start, byte_end, status, attempts, worker_id, updated_at,
            PRIMARY KEY (file_id, chunk_no))
 record_error(file_id, line_no, error_code, raw_line_masked)
 output_file(file_id, partition_key, path, record_count, checksum)
```

### Cache
- Reference data for enrichment (merchant configs, BIN ranges, FX rates) cached in each worker (loaded once per job, refreshed by version).

### Queue
- Chunk tasks queue with **visibility timeout**: if a worker dies, the task reappears for another worker.
- Retry with backoff; after N failures → dead-letter queue + mark the chunk FAILED + alert.

### Scaling
- More chunks → more workers (autoscale on queue depth). Chunk size ≈ 64–256 MB or N lines for good parallelism.
- Merge step parallelised by partition key. Very large scale → Spark / a batch framework does the same split-map-shuffle-reduce.

### Load balancing
- Work is distributed by the queue (pull model) — naturally balances fast and slow workers; no LB needed for workers.

### Failure handling
- Worker crash → chunk task re-delivered; chunk outputs written to a temp path and **atomically renamed** on success so partial writes never count.
- Poison chunk (corrupt data) → DLQ, rest of the file continues; error report lists bad lines.
- Whole-job retry is safe because every step is idempotent (keyed by file id + chunk no).

### Consistency
- A file is "COMPLETED" only when **all** chunks are done and the merge succeeded (state in the DB).
- Downstream loads use upserts keyed by record id / (file_id, line_no) → re-runs don't duplicate.

### Concurrency
- Two workers must not process the same chunk: claim with a conditional update (`UPDATE file_chunk SET status='RUNNING', worker_id=? WHERE … AND status='PENDING'`) or rely on the queue's single delivery + idempotent writes.
- Duplicate uploads racing → the UNIQUE checksum lets only one job start.

### Security
- Encrypt files at rest and in transit (SFTP/TLS); mask card numbers in error reports/logs; strict IAM per bucket prefix; scan uploads; retention and deletion policies.

### Monitoring
- Files received vs completed, processing time vs deadline, chunk failure rate, DLQ size, error-line rate per source, queue depth. Alert when a deadline is at risk.

### Trade-offs
- Chunking by bytes (fast, must align to line breaks) vs by lines (needs a scan first).
- Custom workers (control) vs Spark (less code, heavier infrastructure).
- Fail the whole file on bad lines (strict) vs skip + report (resilient) — a business decision.

### What a Visa interviewer might ask next
1. "The same file is uploaded twice" → checksum uniqueness + idempotent loads.
2. "A worker dies at 80% of a 5 GB file" → chunk-level checkpoints, only that chunk re-runs.
3. "Group records by merchant across all files" → hash-partition by merchant in the map step, merge per partition.
4. "It must finish by 6 AM" → estimate throughput, autoscale on queue depth, prioritise late files.
5. "What if one file doesn't fit in memory?" → streaming parse / external sort ([DSA 8/8](../03-dsa/08-file-and-log-processing.md)).

**🗣️ Interview mein aise bolo**: "File ko pehle object storage mein rakhta hoon, checksum se duplicate rokta hoon, phir chunks mein todkar queue pe daalta hoon — workers parallel process karte hain, har chunk ka status DB mein. Worker mare toh sirf woh chunk dobara. Sab idempotent, taaki rerun safe ho."

Next: [SD 7 — Food delivery system →](07-food-delivery-system.md)
