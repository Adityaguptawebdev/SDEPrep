# Spring Boot 1/5 — Architecture · IoC · DI · Beans · Annotations · Profiles

> Every Java block here is **compile-checked against Spring Boot 3.3 / Spring Framework 6.1 jars** (not run as an app). Visa sources are linked per topic.

**Easy analogy — Spring = wedding caterer**: Tum har cheez khud nahi banate (`new` nahi karte). Caterer (Spring **IoC container**) ko bata dete ho "mujhe paneer chahiye, tandoor chahiye" — woh sab bana ke sahi table pe **laga deta hai** (**dependency injection**). Tum bas menu (annotations/config) likhte ho.

| Topic | Visa reports | Freq |
|---|---|---|
| Spring annotations: `@Component/@Service/@Repository/@Controller`, `@SpringBootApplication` | [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (**EC**), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/), [LC-6535977](https://leetcode.com/discuss/post/6535977/visa-interview-experienecerejected-by-an-tuxa/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | **HIGH** (5) |
| DI / IoC / autowiring (+ benefits) | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**), [LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/) (**EC**), [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/), [LC-6906343](https://leetcode.com/discuss/post/6906343/visa-sr-data-engineer-javabig-data-inter-ni6l/) | **HIGH** (4) |
| Two beans of one type → `@Qualifier` | [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/) | LOW |
| Bean scopes: prototype bean inside a singleton | [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/) (**EC**) | LOW |
| Design patterns used by Spring | [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/) | LOW |
| Profiles / configuration | **not found** in Visa reports (you asked — short section) | — |

---

## 1. Spring Boot architecture in one picture

```
 HTTP request
     │
 ┌───▼───────────────────────── Embedded Tomcat (no WAR deploy) ─────────────────────────┐
 │  Filters (security, logging)                                                          │
 │     │                                                                                 │
 │  DispatcherServlet ──► HandlerMapping ──► Interceptors ──► @RestController            │
 │                                                              │                        │
 │                                                        @Service (business logic)      │
 │                                                              │  @Transactional        │
 │                                                        @Repository (Spring Data JPA)  │
 │                                                              │                        │
 └──────────────────────────────────────────────────────────── HikariCP pool ───────────┘
                                                                │
                                                            Database
 Built by: starters (dependency bundles) + auto-configuration (beans created from the classpath)
           + application.yml / profiles + the IoC container (ApplicationContext)
```

**Interview answer — "What is Spring Boot?"**: "Spring Boot is an opinionated layer on Spring: **starters** bring the right dependencies, **auto-configuration** creates beans based on what's on the classpath and in properties, and it runs with an **embedded server**, so a service is a runnable jar. The app is layered: controller → service → repository, wired together by the IoC container."

## 2. `@SpringBootApplication` (asked in [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/))

It is three annotations in one:
- `@SpringBootConfiguration` — this class is a configuration (can declare `@Bean`s).
- `@EnableAutoConfiguration` — let Boot create beans from the classpath (e.g. `DataSource` if a JDBC driver + URL exist).
- `@ComponentScan` — scan **this package and sub-packages** for `@Component`s.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PaymentsApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentsApplication.class, args);   // starts the context + embedded Tomcat
    }
}
```

**Trap**: putting the main class in a sub-package — beans in sibling packages won't be scanned.

---

## 3. IoC and Dependency Injection (HIGH)

**Simple explanation**: **IoC (Inversion of Control)** = the framework, not your code, creates objects and controls their lifecycle. **DI** = the way IoC gives an object its dependencies (through the constructor, a setter, or a field) instead of the object calling `new`.

**Benefits (the EC candidate was asked exactly this, [LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/))**: loose coupling (depend on interfaces), **easy unit testing** (inject mocks), one place to configure, lifecycle + singletons managed for you, cross-cutting features via proxies (`@Transactional`, `@Async`).

```java
import org.springframework.stereotype.Service;

interface FraudChecker {
    boolean isSuspicious(long amountPaise);
}

@Service
class RuleBasedFraudChecker implements FraudChecker {
    @Override public boolean isSuspicious(long amountPaise) { return amountPaise > 10_00_000; }
}

@Service
class PaymentService {
    private final FraudChecker fraudChecker;                 // depends on the INTERFACE

    PaymentService(FraudChecker fraudChecker) {              // constructor injection (no @Autowired needed
        this.fraudChecker = fraudChecker;                    //  when there is a single constructor)
    }

    String authorize(long amountPaise) {
        return fraudChecker.isSuspicious(amountPaise) ? "REVIEW" : "APPROVED";
    }
}
```

**Constructor vs field vs setter injection**

| | Constructor (recommended) | Field `@Autowired` | Setter |
|---|---|---|---|
| Immutability (`final`) | yes | no | no |
| Required dependencies obvious | yes | hidden | optional deps |
| Unit test without Spring | `new PaymentService(mock)` | needs reflection | ok |
| Circular dependency | fails fast at startup (good) | hidden until runtime | possible |

**"Autowiring — what is it and how does it work?"** ([LC-6834477](https://leetcode.com/discuss/post/6834477/visa-sde-1-by-anonymous_user-y545/)): at startup Spring scans components, builds **bean definitions**, and for each constructor parameter / `@Autowired` point it finds a bean **by type**; if several match, it narrows by `@Primary`, `@Qualifier`, or the parameter name; if none match → startup fails with `NoSuchBeanDefinitionException`.
**🗣️ Interview mein aise bolo**: "IoC matlab object banane ka control Spring ke paas. DI uska tareeka — main constructor mein interface maangta hoon, Spring implementation de deta hai. Isse testing mein mock pass karna aasaan, aur coupling kam."

---

## 4. Stereotype annotations (HIGH)

| Annotation | Layer | Extra behaviour |
|---|---|---|
| `@Component` | generic Spring-managed class | — |
| `@Service` | business logic | none (semantic marker; good for AOP pointcuts) |
| `@Repository` | data access | **translates** persistence exceptions into Spring's `DataAccessException` hierarchy |
| `@Controller` | web MVC (returns views) | handler methods |
| `@RestController` | REST APIs | `@Controller` + `@ResponseBody` (return value → JSON) |
| `@Configuration` + `@Bean` | Java config | creates beans you can't annotate (third-party classes) |

"`@Component`, `@Service`, `@Repository` — what are they?" was asked to a Senior ([LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/)); "use of `@Repository`" to another ([LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/)).
**Interview answer**: "All three make a class a bean through component scanning. `@Service` and `@Component` differ only in meaning; `@Repository` also translates database exceptions into Spring's unchecked `DataAccessException`, so the service layer isn't tied to JDBC/Hibernate exceptions."

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.Clock;

@Configuration
class TimeConfig {
    @Bean
    Clock clock() {                       // a JDK class we can't annotate → declare it as a @Bean
        return Clock.systemUTC();         // inject Clock everywhere → tests can pass a fixed clock
    }
}
```

---

## 5. Two implementations of one interface → `@Qualifier` / `@Primary`

Asked in [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/): *"If we have two implementations of an interface and use `@Autowired` on the interface, will the application run?"* → **No** (`NoUniqueBeanDefinitionException`). *"How can you make this work?"* → `@Qualifier` (or `@Primary`, or inject a `List`/`Map` of all implementations).

```java
import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

interface Notifier {
    void send(String to, String msg);
}

@Component("sms")
@Primary                                              // default when no qualifier is given
class SmsNotifier implements Notifier {
    public void send(String to, String msg) { /* call SMS gateway */ }
}

@Component("email")
class EmailNotifier implements Notifier {
    public void send(String to, String msg) { /* call email provider */ }
}

@Service
class AlertService {
    private final Notifier defaultNotifier;
    private final Notifier emailNotifier;
    private final Map<String, Notifier> byName;       // all implementations, keyed by bean name

    AlertService(Notifier defaultNotifier,
                 @Qualifier("email") Notifier emailNotifier,
                 Map<String, Notifier> byName) {
        this.defaultNotifier = defaultNotifier;
        this.emailNotifier = emailNotifier;
        this.byName = byName;
    }

    void alert(String channel, String to, String msg) {
        byName.getOrDefault(channel, defaultNotifier).send(to, msg);   // strategy picked at runtime
    }
}
```

The `Map<String, Notifier>` trick is how you implement the **Strategy/Factory** pattern with Spring — see the notification LLD in [08-lld/02](../08-lld/02-notification-service-factory-strategy.md).

---

## 6. Bean scopes — and the prototype-inside-singleton trap

| Scope | Instances | Typical use |
|---|---|---|
| `singleton` (default) | one per container | stateless services, repositories |
| `prototype` | new one every time it's **requested from the container** | stateful helpers |
| `request` / `session` | one per HTTP request / session | web-scoped data |

**Asked to an EC candidate** ([LC-6618617](https://leetcode.com/discuss/post/6618617/visa-inc-sde-1-interview-experience-acce-5got/)): *"If a prototype bean is autowired inside a singleton bean, would it act like prototype?"* → **No.** The singleton is created once, so its dependency is injected once — you get **one** prototype instance forever. Fix: ask the container each time with `ObjectProvider` (or `@Lookup` method injection, or a scoped proxy).

```java
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Scope("prototype")
class ReceiptBuilder {                               // stateful: must not be shared
    private final StringBuilder lines = new StringBuilder();
    ReceiptBuilder add(String line) { lines.append(line).append('\n'); return this; }
    String build() { return lines.toString(); }
}

@Service
class ReceiptService {
    private final ObjectProvider<ReceiptBuilder> builders;       // not the bean itself

    ReceiptService(ObjectProvider<ReceiptBuilder> builders) { this.builders = builders; }

    String receiptFor(String txnId, long amount) {
        return builders.getObject()                               // NEW prototype instance per call
                .add("txn " + txnId).add("amount " + amount).build();
    }
}
```

**Follow-ups**: are singleton beans thread-safe? (**No** — Spring doesn't make them thread-safe; keep them **stateless** or use thread-safe fields) · singleton bean vs GoF Singleton (per container vs per classloader) · bean lifecycle: instantiate → inject → `@PostConstruct` → ready → `@PreDestroy`.

---

## 7. Profiles and configuration *(not in Visa reports — quick)*

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@ConfigurationProperties(prefix = "payments.gateway")      // binds payments.gateway.* from application.yml
record GatewayProperties(String baseUrl, int timeoutMs, int maxRetries) {}

interface GatewayClient { String charge(long amount); }

@Configuration
class GatewayConfig {
    @Bean
    @Profile("local")                                      // active with --spring.profiles.active=local
    GatewayClient fakeGateway() { return amount -> "FAKE-OK"; }

    @Bean
    @Profile("!local")                                     // every other environment
    GatewayClient realGateway(GatewayProperties props) {
        return amount -> "calling " + props.baseUrl() + " with timeout " + props.timeoutMs();
    }
}
```

```
 application.yml            payments.gateway.base-url: https://sandbox.example   (shared defaults)
 application-local.yml      overrides for your laptop
 application-prod.yml       overrides for prod — secrets come from env vars / a vault, never the repo
 Precedence (high → low):   command-line args > env vars > application-{profile}.yml > application.yml
```

(Register the record with `@EnableConfigurationProperties(GatewayProperties.class)` or `@ConfigurationPropertiesScan`.)
**Interview answer**: "Profiles switch beans and properties per environment. I keep defaults in `application.yml`, environment overrides in `application-{profile}.yml`, and secrets in environment variables or a secrets manager. Typed `@ConfigurationProperties` beats scattered `@Value`s."

---

## 8. Design patterns inside Spring (asked in [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/))

| Pattern | Where in Spring |
|---|---|
| Singleton | default bean scope |
| Factory | `BeanFactory`, `FactoryBean`, `@Bean` methods |
| Proxy | `@Transactional`, `@Async`, `@Cacheable` work through proxies (AOP) |
| Template method | `JdbcTemplate`, `RestTemplate`, `KafkaTemplate` |
| Front controller | `DispatcherServlet` |
| Observer | `ApplicationEvent` + `@EventListener` |
| Strategy | injecting `List<Interface>` / `Map<String, Interface>` implementations |
| Decorator | `BeanPostProcessor` wrapping beans; servlet filter chains |

---

⚡ **Quick revision**: `@SpringBootApplication` = config + auto-config + component scan · IoC = container creates objects; DI = it hands them in (prefer constructors) · `@Repository` translates DB exceptions · two beans of one type → `@Primary`/`@Qualifier`/`Map` · prototype in singleton → `ObjectProvider` · singleton beans are **not** thread-safe — keep them stateless.

Next: [Spring 2/5 — REST APIs, DispatcherServlet, filters, exceptions →](02-rest-apis-filters-exceptions.md)
