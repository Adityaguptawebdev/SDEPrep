# 05 — Spring Boot for Visa (from reported questions)

> All Spring snippets are **compile-checked against Spring Boot 3.3 / Spring Framework 6.1 / Spring Security 6.3 / Spring Kafka 3.2 jars** with `--release 17`. They are not run as a live application.

**Easy analogy — Spring round = car service centre**: Mechanic sirf "gaadi chalti hai" se khush nahi hota; woh poochta hai **engine (IoC), gearbox (DispatcherServlet), brakes (@Transactional), locks (Security)** kaise kaam karte hain — kyunki wahi toot'te hain production mein.

## Most-reported Spring topics (ranked)

| Rank | Topic | Reports | Freq | Where |
|---|---|---|---|---|
| 1 | Spring annotations (`@Component/@Service/@Repository/@Controller`, `@SpringBootApplication`, `@Transactional`) | 5 | HIGH | [Spring 1 §2–4](01-ioc-di-beans-annotations.md) |
| 2 | DI / IoC / autowiring | 4 | HIGH | [Spring 1 §3](01-ioc-di-beans-annotations.md#3-ioc-and-dependency-injection-high) |
| 2 | Filters / interceptors / `doFilter` | 4 | HIGH | [Spring 2 §5](02-rest-apis-filters-exceptions.md#5-filters-vs-interceptors-high) |
| 2 | REST API design / CRUD / "the API call in your project" | 4 | HIGH | [Spring 2 §2, §7](02-rest-apis-filters-exceptions.md) |
| 2 | Microservices (architecture, monolith vs micro, new service) | 4 | HIGH | [Spring 5 §1–2](05-microservices-and-async.md) |
| 2 | Kafka (why, alternatives, trade-offs) | 4 | HIGH | [Spring 5 §4](05-microservices-and-async.md#4-kafka--why-kafka-alternatives-trade-offs-ec-selected) |
| 2 | Network security / TLS / HTTPS | 4 | HIGH | [Spring 4 §5](04-security-authn-authz-jwt.md#5-https--tls-in-60-seconds-network-security-questions) |
| 8 | Authentication vs Authorization (+ code level) | 3 | HIGH | [Spring 4 §1–2](04-security-authn-authz-jwt.md) |
| 8 | `@Transactional` / rollback | 3 | HIGH | [Spring 3 §2](03-data-jpa-transactions-pooling.md#2-transactional--what-it-really-does-high) |
| 8 | JPA / Hibernate | 3 (senior) | HIGH | [Spring 3 §1](03-data-jpa-transactions-pooling.md#1-jpa-vs-hibernate-vs-spring-data-jpa) |
| 11 | API versioning | 2 (senior) | MEDIUM | [Spring 2 §6](02-rest-apis-filters-exceptions.md#6-api-versioning-medium-senior) |
| 11 | Scheduled jobs on many instances / ShedLock | 2 (senior) | MEDIUM | [Spring 3 §5](03-data-jpa-transactions-pooling.md#5-scheduled-jobs-on-many-instances--wont-two-instances-update-the-same-row) |
| — | DispatcherServlet · prototype in singleton · `@Qualifier` · JWT storage/refresh · encryption vs hashing · PUT vs PATCH · `@ControllerAdvice` · isolation levels · connection pool · `@Async` · Docker vs K8s · CI/CD | 1 each | LOW | spread across Spring 1–5 |
| — | Profiles, validation, actuator, Spring Cloud specifics | 0 | not reported | short sections only |

## The one diagram to draw from memory

```
 Client → [Filters: security, logging] → DispatcherServlet → [Interceptors] → @RestController
        → @Service (@Transactional proxy) → @Repository (Spring Data JPA → Hibernate) → HikariCP → DB
        ↘ events → KafkaTemplate → topic → @KafkaListener in another service
 Exceptions anywhere in MVC → @RestControllerAdvice → ProblemDetail JSON
```

## Files

1. [Architecture · IoC · DI · beans · annotations · profiles](01-ioc-di-beans-annotations.md)
2. [REST APIs · DispatcherServlet · filters vs interceptors · validation · exceptions · versioning](02-rest-apis-filters-exceptions.md)
3. [JPA · `@Transactional` · isolation · connection pooling · scheduled jobs](03-data-jpa-transactions-pooling.md)
4. [Security: AuthN vs AuthZ · Spring Security · JWT · hashing vs encryption · TLS](04-security-authn-authz-jwt.md)
5. [Microservices · Kafka · resilience · saga/outbox · `@Async` · Docker/K8s · CI/CD](05-microservices-and-async.md)

**🗣️ Interview mein aise bolo**: "Main har Spring feature ko 'yeh andar proxy/filter/container kaise use karta hai' se samjhaata hoon, aur ek line mein batata hoon ki mere project mein woh kahan laga tha." [CUSTOMIZE WITH YOUR ACTUAL EXPERIENCE]

Next: [06 — Database & SQL →](../06-database-sql/README.md)
