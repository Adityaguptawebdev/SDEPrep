# Spring Boot 2/5 — REST APIs · DispatcherServlet · Filters vs Interceptors · Validation · Exceptions · Versioning

**Easy analogy — REST API = restaurant counter**: **Filter** = building ka security guard (har aane-jaane wale ko dekhta hai, andar kya order hoga nahi jaanta). **DispatcherServlet** = reception jo decide karta hai kaun sa counter (controller). **Interceptor** = counter ke paas khada manager ("token hai? phir hi order lo"). **Controller** = counter pe baitha banda. **@ControllerAdvice** = complaint desk — koi bhi gadbad ho, customer ko ek hi format mein jawab.

| Topic | Visa reports | Freq |
|---|---|---|
| Filters / interceptors / "intercept all requests" / `doFilter` | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**), [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/), [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/), [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/) | **HIGH** (4) |
| REST API design / CRUD / "write the API call from your project" | [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/), [LC-1235723](https://leetcode.com/discuss/post/1235723/visa-sse-bangalore-interview-exp-may-21o-nk1q/) | **HIGH** (4) |
| REST API versioning | [LC-4373381](https://leetcode.com/discuss/post/4373381/visa-senior-software-engineer-bangalore-5pixh/), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | MEDIUM (senior) |
| DispatcherServlet | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**, selected) | LOW |
| `@ControllerAdvice` / global exception handling | [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/) | LOW |
| PUT vs PATCH | [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/) | LOW |
| Validation · HTTP status codes | not found — included because every REST answer needs them | — |

---

## 1. How a request flows (DispatcherServlet) — asked to a 1-YOE selected candidate

```
 Client ──HTTP──► Tomcat thread
                    │
             ┌──────▼──────┐   servlet Filters (FilterChain.doFilter): security, logging, CORS, compression
             │   Filters   │   → run for EVERY request, before Spring MVC; can stop or wrap the request
             └──────┬──────┘
             ┌──────▼──────────┐   Front controller (one servlet for the whole app)
             │ DispatcherServlet│── 1. HandlerMapping: which @RestController method matches URL + method?
             └──────┬──────────┘   2. HandlerInterceptor.preHandle (auth checks, rate limits)
                    │              3. HandlerAdapter: bind path vars / query params / JSON body (Jackson),
                    │                 run @Valid validation, call the controller method
                    │              4. return value → HttpMessageConverter → JSON response
                    │              5. postHandle / afterCompletion interceptors
                    │              exceptions → HandlerExceptionResolver → @ControllerAdvice
                    ▼
                 response
```

**Interview answer**: "DispatcherServlet is Spring MVC's front controller. It finds the handler through HandlerMapping, runs interceptors, uses a HandlerAdapter to bind the request and call my controller, converts the return value to JSON with message converters, and routes exceptions to exception resolvers such as my `@ControllerAdvice`."

---

## 2. A CRUD REST controller (the "Product with CRUD operations" question)

Asked as live coding in [LC-7501159](https://leetcode.com/discuss/post/7501159/visa-sse-interview-experience-16-01-25-b-crtj/) ("create Product class with CRUD operations"); an NCG was asked to design "API routes for customer creation, retrieval, order status filtering" ([GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/)).

| Method + path | Meaning | Success code |
|---|---|---|
| `GET /api/v1/products` | list (paging via `?page=0&size=20`) | 200 |
| `GET /api/v1/products/{id}` | one | 200 / 404 |
| `POST /api/v1/products` | create | **201** + `Location` header |
| `PUT /api/v1/products/{id}` | replace whole resource | 200 |
| `PATCH /api/v1/products/{id}` | change some fields | 200 |
| `DELETE /api/v1/products/{id}` | remove | **204** |

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

record Product(Long id, String name, long pricePaise) {}

record ProductRequest(@NotBlank String name, @PositiveOrZero long pricePaise) {}      // validated input DTO

record ProductPatch(String name, Long pricePaise) {}                                   // all fields optional

@Service
class ProductService {
    private final Map<Long, Product> store = new ConcurrentHashMap<>();   // swap for a JPA repository later
    private final AtomicLong ids = new AtomicLong();

    List<Product> findAll() { return List.copyOf(store.values()); }
    Product find(long id) {
        Product p = store.get(id);
        if (p == null) throw new NoSuchElementException("product " + id + " not found");
        return p;
    }
    Product create(ProductRequest r) {
        long id = ids.incrementAndGet();
        Product p = new Product(id, r.name(), r.pricePaise());
        store.put(id, p);
        return p;
    }
    Product replace(long id, ProductRequest r) {
        find(id);
        Product p = new Product(id, r.name(), r.pricePaise());
        store.put(id, p);
        return p;
    }
    Product patch(long id, ProductPatch patch) {
        Product old = find(id);
        Product p = new Product(id,
                patch.name() != null ? patch.name() : old.name(),                    // keep old values
                patch.pricePaise() != null ? patch.pricePaise() : old.pricePaise());
        store.put(id, p);
        return p;
    }
    void delete(long id) { if (store.remove(id) == null) throw new NoSuchElementException("product " + id + " not found"); }
}

@RestController
@RequestMapping("/api/v1/products")
class ProductController {
    private final ProductService service;

    ProductController(ProductService service) { this.service = service; }

    @GetMapping
    List<Product> all() { return service.findAll(); }

    @GetMapping("/{id}")
    Product one(@PathVariable long id) { return service.find(id); }

    @PostMapping
    ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        Product created = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/products/" + created.id())).body(created);   // 201
    }

    @PutMapping("/{id}")
    Product replace(@PathVariable long id, @Valid @RequestBody ProductRequest request) { return service.replace(id, request); }

    @PatchMapping("/{id}")
    Product patch(@PathVariable long id, @RequestBody ProductPatch patch) { return service.patch(id, patch); }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();                                    // 204
    }
}
```

**Interview answer**: "Controllers stay thin: map HTTP to a service call and choose the status code. Input is a validated DTO (`@Valid`), not the entity. Errors are thrown as exceptions and translated in one `@RestControllerAdvice`."

---

## 3. PUT vs PATCH (and idempotency)

| | PUT | PATCH |
|---|---|---|
| Sends | the **full** new representation | only the **changes** |
| Missing fields | reset/cleared (it's a replace) | left unchanged |
| Idempotent? | **yes** — repeating gives the same state | not guaranteed (e.g. "increment by 1") |

| Method | Safe (no change)? | Idempotent? |
|---|---|---|
| GET, HEAD, OPTIONS | yes | yes |
| PUT, DELETE | no | yes |
| POST | no | **no** — needs an idempotency key for payments |
| PATCH | no | depends |

**Payments angle (say this at Visa)**: a client retry of `POST /payments` after a timeout must not charge twice → the client sends an **`Idempotency-Key`** header; the server stores the key with the result and returns the stored result for repeats.

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

record PaymentRequest(String merchantId, long amountPaise) {}
record PaymentResponse(String paymentId, String status) {}

@RestController
class IdempotentPaymentController {
    private final Map<String, PaymentResponse> byKey = new ConcurrentHashMap<>();   // prod: DB table / Redis with TTL

    @PostMapping("/api/v1/payments")
    ResponseEntity<PaymentResponse> pay(@RequestHeader("Idempotency-Key") String key,
                                        @RequestBody PaymentRequest request) {
        PaymentResponse response = byKey.computeIfAbsent(key,                        // atomic per key
                k -> new PaymentResponse("pay_" + k.hashCode(), "AUTHORIZED"));        // charge happens once
        return ResponseEntity.ok(response);
    }
}
```

(Production version: a unique constraint on `idempotency_key` in the DB, store request hash + response, expire keys after e.g. 24 h — see [07-system-design/02](../07-system-design/02-payment-service.md).)

---

## 4. Global exception handling with `@RestControllerAdvice`

```java
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice                                          // applies to every controller
class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    ProblemDetail notFound(NoSuchElementException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());      // 404
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)     // thrown by @Valid
    ProblemDetail invalid(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + " " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, details);           // 400
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail unexpected(Exception ex) {
        // log the full stack trace with a correlation id here; never leak internals to the client
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");   // 500
    }
}
```

**Interview answer**: "One `@RestControllerAdvice` turns exceptions into consistent error responses — here RFC 7807 `ProblemDetail` — so controllers don't have try/catch everywhere, clients get stable error formats, and internal details never leak."
**Follow-ups**: `@ControllerAdvice` vs `@RestControllerAdvice` (the latter adds `@ResponseBody`) · exception thrown in a **filter** doesn't reach `@ControllerAdvice` (it happens before DispatcherServlet) · which status for business rule failures? (422 or 409, be consistent).

---

## 5. Filters vs Interceptors (HIGH)

| | Servlet `Filter` | Spring `HandlerInterceptor` |
|---|---|---|
| Belongs to | Servlet spec (Tomcat) | Spring MVC |
| Runs | before/after **DispatcherServlet**, for every request (even static files, errors) | around **controller** calls only |
| Knows the handler (controller method)? | no | yes (`handler` argument) |
| Hooks | `doFilter(req, res, chain)` | `preHandle`, `postHandle`, `afterCompletion` |
| Typical use | security (Spring Security is a filter chain), logging, correlation ids, CORS, compression | auth/role checks per endpoint, rate limits, audit, locale |

```java
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
class CorrelationIdFilter extends OncePerRequestFilter {        // runs once per request, before Spring MVC
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String id = request.getHeader("X-Correlation-Id");
        if (id == null) id = UUID.randomUUID().toString();
        response.setHeader("X-Correlation-Id", id);            // trace one request across services/logs
        long start = System.nanoTime();
        try {
            chain.doFilter(request, response);                  // continue to the next filter / DispatcherServlet
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            // log: id, method, path, status, ms
        }
    }
}

class ApiKeyInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (request.getHeader("X-Api-Key") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;                                       // stop: controller is NOT called
        }
        return true;
    }
}

@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ApiKeyInterceptor()).addPathPatterns("/api/partner/**");  // only these URLs
    }
}
```

**Interview answer ("How do you intercept all requests and responses?", [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/))**: "For everything, a servlet Filter — `OncePerRequestFilter` — wrapping `chain.doFilter`, e.g. to add a correlation id and log latency. For controller-specific logic, a `HandlerInterceptor` registered on certain paths, which also knows which handler will run. Authentication itself is best left to the Spring Security filter chain."

---

## 6. API versioning (MEDIUM, senior)

| Strategy | Example | Pros | Cons |
|---|---|---|---|
| **URI path** (most common) | `/api/v1/payments` → `/api/v2/payments` | visible, cache-friendly, easy routing at the gateway | URL changes |
| Request header | `X-API-Version: 2` | clean URLs | invisible in browser, needs docs |
| Query param | `/payments?version=2` | easy to try | messy, caching issues |
| Media type | `Accept: application/vnd.visa.payment.v2+json` | "pure" REST | complex for clients |

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

record PaymentV1(String id, long amount) {}
record PaymentV2(String id, long amountMinor, String currency) {}     // breaking change → new version

@RestController
class PaymentQueryController {
    @GetMapping("/api/v1/payments/{id}")
    PaymentV1 v1(@PathVariable String id) { return new PaymentV1(id, 49900); }

    @GetMapping("/api/v2/payments/{id}")
    PaymentV2 v2(@PathVariable String id) { return new PaymentV2(id, 49900, "INR"); }

    @GetMapping(value = "/api/payments/{id}", headers = "X-API-Version=2")   // header-based alternative
    PaymentV2 v2ByHeader(@PathVariable String id) { return v2(id); }
}
```

**Interview answer**: "Only breaking changes need a new version; additive changes (new optional fields) stay in the same version. I prefer URI versioning for public APIs, keep old versions running with a deprecation date (`Deprecation`/`Sunset` headers), and share the service layer between versions so only the DTO mapping differs."

---

## 7. "Write the API call from your project" (pseudocode is fine)

A Bengaluru candidate was asked *"how to write an API call in my project; pseudocode would suffice"* and felt they were rejected over resume questions ([JT-2024-09](https://www.jointaro.com/interviews/companies/visa/experiences/software-engineer-bengaluru-september-1-2024-no-offer-positive-72b9b4f0/)). Be ready from **both** sides — the React `fetch` side is in [09-javascript-react](../09-javascript-react/01-javascript.md); the Java side calling another service:

```java
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

record FxRate(String from, String to, double rate) {}

class FxClient {
    private final RestClient client;

    FxClient(String baseUrl, String apiToken) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(2_000);                    // never call another service without timeouts
        factory.setReadTimeout(3_000);
        this.client = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .defaultHeader("Authorization", "Bearer " + apiToken)
                .build();
    }

    FxRate rate(String from, String to) {
        return client.get()
                .uri("/rates?from={f}&to={t}", from, to)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()                                  // 4xx/5xx → RestClientResponseException
                .body(FxRate.class);
    }
}
```

**What to say around it**: timeouts, retries only for idempotent calls (with backoff), a circuit breaker if the dependency is flaky, and mapping the downstream error into your own error response.

---

## 8. HTTP status codes you should use correctly

| Code | When |
|---|---|
| 200 OK / 201 Created / 204 No Content | read or update / created (+ `Location`) / deleted, nothing to return |
| 400 Bad Request | validation failed |
| 401 Unauthorized | **not authenticated** (no/invalid token) |
| 403 Forbidden | authenticated but **not allowed** |
| 404 Not Found | resource doesn't exist |
| 409 Conflict | duplicate / version conflict (optimistic lock) |
| 422 Unprocessable Entity | valid JSON, business rule failed (e.g. insufficient funds) |
| 429 Too Many Requests | rate limited (+ `Retry-After`) |
| 500 / 502 / 503 / 504 | server bug / bad upstream / overloaded or down / upstream timeout |

---

⚡ **Quick revision**: Filter (servlet, all requests) → DispatcherServlet → Interceptor (handler-aware) → Controller → Service · DTO + `@Valid` in, `ProblemDetail` out via `@RestControllerAdvice` · PUT = replace (idempotent), PATCH = partial · POST payments need an Idempotency-Key · version only on breaking changes, prefer `/v1` in the path · always set timeouts on outbound calls.

Next: [Spring 3/5 — JPA, `@Transactional`, isolation, connection pooling →](03-data-jpa-transactions-pooling.md)
