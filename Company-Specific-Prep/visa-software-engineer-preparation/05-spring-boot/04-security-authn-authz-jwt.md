# Spring Boot 4/5 — Security: AuthN vs AuthZ · Spring Security · JWT · Hashing vs Encryption · TLS

**Easy analogy — office building**: **Authentication** = gate pe ID card check — "tum kaun ho?". **Authorization** = andar jaake lift ka access — "tum 5th floor (admin) pe ja sakte ho ya sirf cafeteria?". **JWT** = gate pe mila hua **visitor badge** jisme naam, floor access aur expiry time likha hai, aur uspe security ka **stamp (signature)** hai — koi badge pe likha badle toh stamp match nahi karega.

| Topic | Visa reports | Freq |
|---|---|---|
| Authentication vs Authorization (+ "on the code level", "protect some APIs and not others") | [LC-6676020](https://leetcode.com/discuss/post/6676020/visa-inc-software-engineer-by-anonymous_-0jaf/) (**EC**), [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/), [LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/) | **HIGH** (3) |
| JWT: what it is, where to store it, refresh tokens | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) | LOW |
| Authentication mechanisms · Spring Security features | [LC-7765688](https://leetcode.com/discuss/post/7765688/visa-interview-sr-swe-by-anonymous_user-kmls/), [LC-5269237](https://leetcode.com/discuss/post/5269237/visa-sr-software-engineer-fullstack-java-o2n8/) | MEDIUM (senior) |
| Encryption vs hashing | [GFG-NCG-25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduate-software-engineer-2025/) (lead round) | LOW |
| Network security · TLS/SSL · HTTPS · mTLS | [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/), [GFG-OC-Jul25](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-software-engineer-on-campus-2/), [LC-7717662](https://leetcode.com/discuss/post/7717662/visa-staff-software-engineer-rejected-by-mnw2/), [LC-7185262](https://leetcode.com/discuss/post/7185262/walmart-netapp-visa-moneyforward-publici-tvwn/) | **HIGH** (4, mixed levels) |

> Security questions carry extra weight at a payments company — Visa's own tech pages talk about monitoring *"22 billion security events every day"* ([VISA-TECH-25](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/inside-visa-global-commerce-engine.html)). Show that you think about security by default.

---

## 1. Authentication vs Authorization (HIGH)

| | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| Question | **Who** are you? | **What** are you allowed to do? |
| When | first | after authentication |
| How | password, OTP, JWT, OAuth2/OIDC login, client certificate (mTLS), API key | roles (`ADMIN`), permissions/scopes (`payments:refund`), ownership rules ("only your own orders") |
| Failure | **401 Unauthorized** | **403 Forbidden** |
| In Spring Security | filters build an `Authentication` in the `SecurityContext` | `authorizeHttpRequests` rules, `@PreAuthorize` |

**Interview answer**: "Authentication proves identity — for example validating a JWT's signature and expiry. Authorization decides access — for example only users with the ADMIN role can call refund APIs, and a customer can only read their own orders. Failed authentication is 401, failed authorization is 403."

---

## 2. "How did your APIs handle AuthN/AuthZ at the code level? How do you protect some APIs and not others?"

That's the exact Senior question ([LC-6303697](https://leetcode.com/discuss/post/6303697/visa-senior-software-engineer-sr-sw-engi-m1mn/)). Answer with the **filter chain + URL rules + method security**:

```
 request ─► SecurityFilterChain
            ├─ JwtAuthFilter: "Authorization: Bearer <jwt>" → verify signature + expiry
            │     ok  → SecurityContext = (user, roles)       bad → 401
            ├─ authorizeHttpRequests (URL rules, first match wins)
            │     /api/public/**, /actuator/health → permitAll
            │     /api/admin/**                    → hasRole("ADMIN")
            │     anything else                    → authenticated
            └─ controller ─► @PreAuthorize on methods (fine-grained / ownership checks)
```

```java
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

record VerifiedToken(String userId, List<String> roles) {}

interface TokenVerifier {                                     // wraps a JWT library (jjwt / Nimbus)
    VerifiedToken verify(String jwt);                         // throws if signature/expiry is invalid
}

class JwtAuthFilter extends OncePerRequestFilter {
    private final TokenVerifier verifier;

    JwtAuthFilter(TokenVerifier verifier) { this.verifier = verifier; }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                VerifiedToken t = verifier.verify(header.substring(7));
                var authorities = t.roles().stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r)).toList();
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(t.userId(), null, authorities));   // AuthN done
            } catch (RuntimeException invalid) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "invalid token");            // 401
                return;
            }
        }
        chain.doFilter(req, res);                             // no token → rules below decide
    }
}

@Configuration
@EnableMethodSecurity                                         // enables @PreAuthorize
class SecurityConfig {
    @Bean
    SecurityFilterChain api(HttpSecurity http, TokenVerifier verifier) throws Exception {
        http.csrf(csrf -> csrf.disable())                     // stateless API with bearer tokens (no cookies)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/public/**", "/actuator/health").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")                   // AuthZ by URL
                    .anyRequest().authenticated())
            .addFilterBefore(new JwtAuthFilter(verifier), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

```java
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class OrderController {
    @GetMapping("/api/users/{userId}/orders")
    @PreAuthorize("#userId == authentication.name or hasRole('SUPPORT')")      // ownership rule
    String orders(@PathVariable String userId) { return "orders of " + userId; }

    @PostMapping("/api/admin/refunds/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")                                          // defence in depth
    String refund(@PathVariable String paymentId) { return "refunded " + paymentId; }
}
```

**Say also**: "If the token is issued by an identity provider (Keycloak, Okta, Azure AD), I'd use Spring Security's OAuth2 **resource server** support instead of a hand-written filter — it validates the signature against the provider's public keys (JWKS)." Never trust a user id from the request body — take it from the verified token.

---

## 3. JWT — structure, signing and verification (GFG-NCG-25)

A JWT is `base64url(header) . base64url(payload) . base64url(signature)`.

```
 eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJ1MSIsInJvbGUiOiJVU0VSIiwiZXhwIjoxOTAwMDAwMDAwfQ . 3q2+7w…
 └── {"alg":"HS256"} ─┘  └──── {"sub":"u1","role":"USER","exp":1900000000} ────────┘  └ HMAC ┘
      header                  payload (claims) — only ENCODED, anyone can read it       signature
```

- **Signed, not encrypted**: anyone can decode the payload — never put secrets/card numbers in it.
- The **signature** (HMAC with a secret, or RSA/ECDSA with a private key) proves it wasn't tampered with.
- The server checks: signature, `exp` (expiry), `iss`/`aud` (issuer/audience), then reads roles.

The mini demo below signs and verifies an HS256 token with plain JDK crypto — to *understand* JWTs (use a vetted library like jjwt or Nimbus in real code).

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

class MiniJwt {
    static final Base64.Encoder ENC = Base64.getUrlEncoder().withoutPadding();
    static final Base64.Decoder DEC = Base64.getUrlDecoder();

    static String sign(String payloadJson, byte[] secret) throws Exception {
        String header = ENC.encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payload = ENC.encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
        return header + "." + payload + "." + ENC.encodeToString(hmac(header + "." + payload, secret));
    }

    static boolean verify(String jwt, byte[] secret) throws Exception {
        String[] parts = jwt.split("\\.");
        if (parts.length != 3) return false;
        byte[] expected = hmac(parts[0] + "." + parts[1], secret);
        return MessageDigest.isEqual(expected, DEC.decode(parts[2]));   // constant-time comparison
    }

    static byte[] hmac(String data, byte[] secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    public static void main(String[] args) throws Exception {
        byte[] secret = "a-32-byte-demo-secret-for-hs256!".getBytes(StandardCharsets.UTF_8);
        String token = sign("{\"sub\":\"u1\",\"role\":\"USER\",\"exp\":1900000000}", secret);
        System.out.println("payload readable by anyone: " + new String(DEC.decode(token.split("\\.")[1]), StandardCharsets.UTF_8));
        System.out.println("valid: " + verify(token, secret));

        String[] p = token.split("\\.");
        String forgedPayload = ENC.encodeToString("{\"sub\":\"u1\",\"role\":\"ADMIN\",\"exp\":1900000000}".getBytes(StandardCharsets.UTF_8));
        System.out.println("tampered (role→ADMIN) valid: " + verify(p[0] + "." + forgedPayload + "." + p[2], secret));
    }
}
```

```text
payload readable by anyone: {"sub":"u1","role":"USER","exp":1900000000}
valid: true
tampered (role→ADMIN) valid: false
```

### Where to store the token (browser)

| Storage | Risk | Mitigation |
|---|---|---|
| `localStorage` / `sessionStorage` | any **XSS** script can read and steal it | strict CSP, sanitise output, short token lifetime |
| **httpOnly + Secure + SameSite cookie** | JS can't read it (XSS can't steal it), but the browser sends it automatically → **CSRF** risk | `SameSite=Lax/Strict`, CSRF tokens for state-changing requests |
| In memory (JS variable) | lost on refresh | pair with a refresh token in an httpOnly cookie |

Common answer: **short-lived access token in memory, refresh token in an httpOnly Secure SameSite cookie**.

### Refresh tokens

```
 login ──► access token (5–15 min) + refresh token (days, stored server-side / revocable)
 API calls use the access token
 access token expired → POST /auth/refresh with the refresh token
      → server checks it (not revoked, not reused) → new access token + NEW refresh token (rotation)
 logout / suspicious reuse → revoke the refresh-token family
```

**Why?** A stolen access token is useful only for minutes; refresh tokens can be revoked, which a plain JWT can't (it's valid until `exp`).
**Follow-ups**: how to "log out" a JWT? (short expiry + revoke refresh token; or a deny-list / token version per user) · HS256 vs RS256 (shared secret vs private/public key — RS256 lets many services verify without being able to sign) · sessions vs JWT (server-side state + easy revocation vs stateless + scalable).

---

## 4. Passwords, hashing vs encryption vs encoding (lead-round question)

| | Encoding | Hashing | Encryption |
|---|---|---|---|
| Purpose | represent data (transport) | integrity / verify without storing the original | confidentiality |
| Reversible? | yes, by anyone (no key) | **no** (one-way) | yes, **with the key** |
| Examples | Base64, URL encoding | SHA-256, bcrypt/Argon2 (for passwords), HMAC (with a key) | AES-GCM (symmetric), RSA/ECC (asymmetric), TLS |
| Payments use | JWT parts, binary in JSON | password storage, file checksums, **tokenization lookups** | card data at rest, TLS in transit, HSM keys |

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HexFormat;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

class HashVsEncrypt {
    public static void main(String[] args) throws Exception {
        byte[] data = "4111111111111111".getBytes(StandardCharsets.UTF_8);

        byte[] hash = MessageDigest.getInstance("SHA-256").digest(data);                // one-way
        System.out.println("sha-256 length: " + hash.length + " bytes, same input → same hash: "
                + MessageDigest.isEqual(hash, MessageDigest.getInstance("SHA-256").digest(data)));

        KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(256);
        SecretKey key = kg.generateKey();
        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);                                              // fresh IV every time
        Cipher enc = Cipher.getInstance("AES/GCM/NoPadding");
        enc.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
        byte[] cipherText = enc.doFinal(data);                                         // reversible with key

        Cipher dec = Cipher.getInstance("AES/GCM/NoPadding");
        dec.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(128, iv));
        System.out.println("decrypts back: " + new String(dec.doFinal(cipherText), StandardCharsets.UTF_8));
        System.out.println("hash hex prefix: " + HexFormat.of().formatHex(hash).substring(0, 16));
    }
}
```

```text
sha-256 length: 32 bytes, same input → same hash: true
decrypts back: 4111111111111111
hash hex prefix: 9bbef19476623ca5
```

**Passwords** are never encrypted and never plain-SHA-256'd: use a **slow, salted** password hash — bcrypt / Argon2 / PBKDF2 (Spring: `BCryptPasswordEncoder`).

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class PasswordStorage {
    private final PasswordEncoder encoder = new BCryptPasswordEncoder(12);   // cost 12: deliberately slow

    String hashForDb(String rawPassword) { return encoder.encode(rawPassword); }        // random salt inside
    boolean login(String raw, String storedHash) { return encoder.matches(raw, storedHash); }
}
```

**Interview answer**: "Encoding is just a format, hashing is one-way for verification, encryption is two-way with a key. Passwords get a slow salted hash like bcrypt so a leaked table can't be reversed or brute-forced cheaply. Sensitive data like card numbers is encrypted at rest with keys in a KMS/HSM, or replaced by tokens."

---

## 5. HTTPS / TLS in 60 seconds (network-security questions)

```
 client                                    server
   │── ClientHello (TLS versions, ciphers) ──►│
   │◄─ ServerHello + certificate ─────────────│   cert signed by a CA the client trusts
   │   verify cert chain + hostname            │
   │── key exchange (ECDHE) ──────────────────►│   both derive the same session keys
   │◄════ encrypted HTTP (AES-GCM) ══════════►│   confidentiality + integrity
 mTLS: the client ALSO presents a certificate → the server authenticates the client (service-to-service)
```

**Interview answer**: "TLS gives confidentiality, integrity and server authentication. The server proves its identity with a CA-signed certificate, both sides agree on session keys with an ephemeral Diffie-Hellman exchange, and then traffic is symmetrically encrypted. In mutual TLS the client also has a certificate — common for service-to-service calls inside a payments network."
**Other web-security basics to mention** (frontend-security question in [GFG-NG-Jan24](https://www.geeksforgeeks.org/interview-experiences/visa-interview-experience-for-new-graduates-software-engineer-on-campus/)): XSS (escape output, CSP), CSRF (SameSite cookies, CSRF tokens), SQL injection (parameterised queries — JPA does this), secrets in a vault not in git, least privilege, rate limiting, audit logs, dependency scanning.

---

⚡ **Quick revision**: AuthN = who (401), AuthZ = what (403) · Spring Security = filter chain + URL rules + `@PreAuthorize` · JWT = signed, not encrypted; verify signature + exp · access token short, refresh token rotated + revocable, httpOnly cookie · hashing one-way (bcrypt for passwords), encryption two-way with a key · TLS = cert + key exchange + symmetric encryption; mTLS for services.

Next: [Spring 5/5 — Microservices, Kafka, async →](05-microservices-and-async.md)
