# 09 — TrueFoundry Product Questions

[← Performance](08-Frontend-Performance-and-Architecture.md) · [Roadmap](00-Interview-Roadmap.md) · [Next: Project and HR →](10-Project-and-HR-Questions.md)

All 🔮 **Predicted**. No report mentions product questions for the intern round, but "Why TrueFoundry?" and "how would you build X in our product?" are natural follow-ups. This file is **frontend-focused**: just enough product understanding to talk confidently, then how you would **build the UI**.

> **Source of product facts:** [TrueFoundry AI Gateway docs](https://docs.truefoundry.com/docs/ai-gateway), [Intro to LLM Gateway](https://truefoundry.com/docs/ai-gateway/intro-to-llm-gateway), [AI Gateway page](https://www.truefoundry.com/ai-gateway), [Observability blog](https://www.truefoundry.com/blog/observability-in-ai-gateway). Features change quickly, so open the docs once before the interview and check the latest names.

## Contents

- **Part A — Concepts**
  - [A1. What is an AI Gateway?](#a1-what-is-an-ai-gateway)
  - [A2. What is LLM routing?](#a2-what-is-llm-routing)
  - [A3. What are model providers?](#a3-what-are-model-providers)
  - [A4. What is MCP and what are MCP servers?](#a4-what-is-mcp-and-what-are-mcp-servers)
  - [A5. What are AI agents?](#a5-what-are-ai-agents)
  - [A6. What are guardrails?](#a6-what-are-guardrails)
  - [A7. What is observability?](#a7-what-is-observability)
  - [A8. How are token usage and model costs monitored?](#a8-how-are-token-usage-and-model-costs-monitored)
  - [A9. What is AI Deploy?](#a9-what-is-ai-deploy)
  - [A10. Kubernetes at a basic level](#a10-kubernetes-at-a-basic-level)
  - [A11. AI/ML workloads and how developers deploy models](#a11-aiml-workloads-and-how-developers-deploy-models)
- **Part B — Frontend scenarios**
  - [S1. Design an AI Gateway dashboard](#s1-design-an-ai-gateway-dashboard)
  - [S2. Show model-wise API usage and cost](#s2-show-model-wise-api-usage-and-cost)
  - [S3. Display thousands of API logs](#s3-display-thousands-of-api-logs)
  - [S4. An API request takes 10 seconds](#s4-an-api-request-takes-10-seconds)
  - [S5. Real-time agent execution status](#s5-real-time-agent-execution-status)
  - [S6. Model selection dropdown](#s6-model-selection-dropdown)
  - [S7. API errors and retry](#s7-api-errors-and-retry)
  - [S8. Responsive developer dashboard](#s8-responsive-developer-dashboard)

---

# Part A — Concepts

## A1. What is an AI Gateway?

🗣️ **Hinglish:** Company ki 50 teams alag-alag LLM use kar rahi hain — OpenAI, Anthropic, Gemini, self-hosted Llama. Har team apni API key, apna retry code, apna cost hisaab… **chaos**. AI Gateway = **building ka ek reception desk**: sab requests yahin se jaati hain. Reception check karta hai kaun hai (auth), kitna kharcha kar sakta hai (budget), kis provider ke paas bhejna hai (routing), aur sab kuch register mein likhta hai (logs).

```
  App A ─┐                                     ┌─► OpenAI
  App B ─┼──► AI GATEWAY (one OpenAI-style API) ┼─► Anthropic
  Agent ─┘    auth · keys · rate limit · budget ├─► Google
              routing · fallback · guardrails   ├─► self-hosted (vLLM on K8s)
              logs · metrics · cost             └─► MCP servers (tools)
```

✅ **Answer:** "An AI Gateway is a proxy that sits between applications and LLM providers. Apps call one unified, OpenAI-compatible API, and the gateway handles API-key management, access control, rate limiting, budget limits, load balancing and fallback across providers, guardrails, and logging with metrics like latency, tokens and cost. TrueFoundry's gateway also fronts MCP servers, so tool access for agents gets the same auth and observability. For a frontend engineer, the gateway's console is where admins configure all of this and see usage, which is a dashboard-heavy UI."

---

## A2. What is LLM routing?

✅ **Answer:** "Routing decides which model or provider handles a request. Common strategies: **weighted** (90 % to model A, 10 % to model B for a test), **latency-based** (pick the fastest healthy endpoint), **fallback** (if OpenAI returns 429 or 5xx, retry on Azure OpenAI or Anthropic), and rules by user, team or request metadata. Apps don't change code when the route changes."

🗣️ **Hinglish:** Google Maps jaisa — traffic dekh ke **sabse achha raasta**, aur road band ho to **doosra raasta (fallback)**.

**Frontend angle:** a routing-config UI — a list of targets with weight sliders that must add up to 100 %, the fallback order (drag to reorder), validation, and a preview of the generated config (YAML/JSON).

---

## A3. What are model providers?

✅ **Answer:** "A provider is the company or platform serving a model through an API — OpenAI, Anthropic, Google, AWS Bedrock, Azure OpenAI, Groq — or a self-hosted model deployed on your own GPUs. Each has different models, prices per million input and output tokens, rate limits and API formats. The gateway normalises them behind one API, so in the UI a model is usually shown as `provider/model-name`."

---

## A4. What is MCP and what are MCP servers?

🗣️ **Hinglish:** MCP = AI ke liye **USB-C port**. Pehle har tool (GitHub, Slack, database) ko har AI app se jodne ke liye alag wire banani padti thi. MCP ek **standard plug** hai: tool ek baar "MCP server" ban gaya, to koi bhi MCP-supporting agent use kar sakta hai.

✅ **Answer:** "MCP, the Model Context Protocol, is an open standard, introduced by Anthropic, for connecting AI models and agents to tools and data. An **MCP server** exposes tools (like `create_issue` or `query_db`), resources and prompts in a standard format; an MCP client inside the agent or app discovers and calls them. TrueFoundry's gateway adds an MCP registry, central authentication and authorization for MCP servers, virtual MCP servers that combine tools, and rate limiting and observability on tool calls — so a company controls which agent can use which tool."

**Frontend angle:** an MCP registry page — a list of servers with status, a tool list per server, per-team access toggles, an OAuth "connect" flow, and tool-call logs.

---

## A5. What are AI agents?

✅ **Answer:** "An agent is an LLM-driven program that works in a loop: it reads the goal, decides the next step, calls a tool (search, an API, an MCP tool), reads the result and repeats until it finishes or hits a limit. Unlike a single chat completion it has multiple steps, tool calls and state, so it can fail midway, take a long time and cost more — that's why tracing each step matters."

```
 goal → [LLM thinks] → tool call → result → [LLM thinks] → tool call → … → final answer
```

---

## A6. What are guardrails?

✅ **Answer:** "Guardrails are checks on what goes into and comes out of a model: blocking or masking PII, detecting prompt injection or jailbreaks, filtering toxic content, enforcing topic rules, and validating output format. In a gateway they run centrally, so every app gets them without writing its own. TrueFoundry supports configurable guardrails and integrations with providers such as AWS Bedrock Guardrails and Azure Content Safety."

**Frontend angle:** show **why** a request was blocked in logs (a badge plus the rule name), and a guardrail configuration form with test input and a live preview.

🗣️ **Hinglish:** Airport **security check** — andar jaate waqt bhi (input) aur bahar aate waqt bhi (output).

---

## A7. What is observability?

✅ **Answer:** "Observability means being able to understand what the system is doing from its outputs — **logs** (each request's details), **metrics** (request rate, error rate, latency percentiles like p50/p95/p99, tokens, cost) and **traces** (the step-by-step path of one request, which matters for agents). For an AI gateway you want per-request logs with model, latency, tokens, cost, status and guardrail results, and dashboards that slice by model, team, user and time. TrueFoundry describes request tracing, token-level cost tracking, and health and fallback metrics."

---

## A8. How are token usage and model costs monitored?

```
 cost = (input_tokens  / 1,000,000) × input_price_per_1M
      + (output_tokens / 1,000,000) × output_price_per_1M
```

✅ **Answer:** "Every response from the provider includes token counts — input (prompt) and output (completion). The gateway logs them per request with the model's price per million tokens, so cost is computed per request and then aggregated by model, team, user, API key and time. Budgets and rate limits use the same numbers: for example, alert at 80 % of a team's monthly budget and block at 100 %. In the UI I'd show totals, trends over time, a breakdown by model, top spenders and budget progress bars."

🗣️ **Hinglish:** **Bijli ka meter** jaisa — har request ke units (tokens) × rate (price) = bill. Team-wise meter alag.

---

## A9. What is AI Deploy?

✅ **Answer:** "AI Deploy is TrueFoundry's platform for deploying and running ML and LLM workloads — model servers, services, batch jobs, notebooks, fine-tuning — on Kubernetes in the company's **own cloud** (AWS, GCP, Azure or on-prem). Developers describe what to run, and the platform handles containers, GPUs, autoscaling, rollouts and monitoring, so ML engineers don't need to be Kubernetes experts. Self-hosted models deployed this way can then be served through the AI Gateway."

---

## A10. Kubernetes at a basic level

🗣️ **Hinglish:** Kubernetes = **shipping port ka manager**. Containers (dabbe) ko machines (ships) pe rakhta hai, koi dabba gir gaya to naya rakh deta hai, load badha to aur dabbe chadha deta hai.

| Term | One line |
|---|---|
| Container | your app plus its dependencies, packaged (Docker image) |
| Pod | the smallest unit K8s runs — one or more containers |
| Node | a machine (VM), possibly with GPUs |
| Deployment | "keep N replicas of this pod running", rolling updates |
| Service | a stable network address in front of pods |
| Autoscaling | add or remove pods by CPU, GPU or request load |

✅ **Answer:** "Kubernetes runs containers across a cluster of machines. You declare the desired state — this image, 3 replicas, 1 GPU each — and it schedules pods on nodes, restarts failed ones, scales them, and does rolling updates. For a frontend dashboard, this shows up as deployment status: replicas ready vs desired, pod states such as Pending, Running or CrashLoopBackOff, logs and resource usage."

---

## A11. AI/ML workloads and how developers deploy models

| Workload | Example | Shape |
|---|---|---|
| Real-time inference | an LLM API, embeddings | always-on service, low latency, GPUs |
| Batch inference | score 1M rows overnight | job, runs to completion |
| Training / fine-tuning | LoRA fine-tune | long GPU job |
| Notebooks | experiments | interactive |

**Typical deploy flow:** pick a model (from Hugging Face or a registry) → choose a serving engine (e.g. vLLM) → choose resources (GPU type, count) → set autoscaling → deploy → get an endpoint → register it in the gateway → monitor.

✅ **Answer:** "An ML workload is anything that trains or serves a model; LLM serving is GPU-heavy and needs autoscaling. Developers usually package the model with a serving engine into a container, choose GPU resources and scaling, deploy it as a service with an endpoint, and then monitor latency, throughput and GPU usage. Platforms like TrueFoundry turn that into a form, CLI or Git-based config instead of raw Kubernetes YAML — and the frontend's job is to make that form clear, validated and safe."

---

# Part B — Frontend scenarios

> **Answer frame for every scenario:** Users & goal → Layout → Data & API → State → Performance → Errors/empty/loading → Accessibility → What I'd add later.

## S1. Design an AI Gateway dashboard

**Question:** "How would you design the main AI Gateway dashboard?" · **Priority:** High

```
┌ Sidebar ─┬─ Header: [Team ▾] [Last 24h ▾] [Refresh ⟳]                 ┐
│ Overview │ ┌Requests┐ ┌Error %┐ ┌p95 latency┐ ┌Cost (₹/$)┐  KPI cards  │
│ Models   │ └────────┘ └───────┘ └───────────┘ └──────────┘             │
│ Logs     │ ┌ Requests & errors over time (line) ─────────────────────┐ │
│ Routing  │ └─────────────────────────────────────────────────────────┘ │
│ MCP      │ ┌ Cost by model (bar) ─────┐ ┌ Top API keys / teams ─────┐  │
│ Keys     │ └──────────────────────────┘ └───────────────────────────┘  │
│ Settings │ ┌ Recent failed requests (table, links to Logs) ───────────┐ │
└──────────┴──────────────────────────────────────────────────────────────┘
```

✅ **Answer:**
1. **Users:** platform admins (health, cost) and developers (their app's errors).
2. **Layout:** global filters (team, time range) at the top drive every widget; KPI cards → trends → breakdowns → drill-down to logs.
3. **Data:** each widget calls its own aggregated endpoint (`/metrics/summary?range=24h`, `/metrics/cost-by-model`) — the backend aggregates, the browser never sums millions of rows.
4. **State:** filters live in the **URL** (`?team=ml&range=24h`) so views are shareable and survive refresh; server data goes in React Query keyed by the filters; UI state (sidebar, theme) in Zustand.
5. **Performance:** widgets load in parallel with their own skeletons; charts are lazy-loaded; refetch every 30–60 s and on window focus; don't poll in hidden tabs.
6. **Errors:** a per-widget error boundary and retry; one failed widget doesn't blank the page (`allSettled` thinking).
7. **A11y:** charts get a table or text summary; colours aren't the only signal.

**Your link:** this is very close to what you built at RagaAI — the Fax Classification overview cards (Total / Classified and Sent / Failed to Classify / Failed to Send) and the Collections dashboard with tabs, filters and pagination ([10](10-Project-and-HR-Questions.md#q-explain-your-strongest-frontend-project)).

---

## S2. Show model-wise API usage and cost

**Data shape from the API (pre-aggregated per day):**

```js
const rows = [
  { date: "2026-11-01", model: "openai/gpt-4o", inputTokens: 1_200_000, outputTokens: 300_000, costUsd: 6.0, requests: 820 },
  { date: "2026-11-01", model: "anthropic/claude-sonnet", inputTokens: 900_000, outputTokens: 200_000, costUsd: 5.7, requests: 610 },
  { date: "2026-11-02", model: "openai/gpt-4o", inputTokens: 1_000_000, outputTokens: 250_000, costUsd: 5.0, requests: 700 },
];

// Totals per model for the bar chart + table
function summarizeByModel(rows) {
  const map = new Map();
  for (const r of rows) {
    const m = map.get(r.model) ?? { model: r.model, requests: 0, tokens: 0, costUsd: 0 };
    m.requests += r.requests;
    m.tokens += r.inputTokens + r.outputTokens;
    m.costUsd += r.costUsd;
    map.set(r.model, m);
  }
  const total = [...map.values()].reduce((s, m) => s + m.costUsd, 0);
  return [...map.values()]
    .map((m) => ({ ...m, costUsd: +m.costUsd.toFixed(2), share: +((m.costUsd / total) * 100).toFixed(1) }))
    .sort((a, b) => b.costUsd - a.costUsd);
}
console.log(summarizeByModel(rows));
// [ { model: 'openai/gpt-4o', requests: 1520, tokens: 2750000, costUsd: 11, share: 65.9 },
//   { model: 'anthropic/claude-sonnet', requests: 610, tokens: 1100000, costUsd: 5.7, share: 34.1 } ]

const fmtTokens = (n) => new Intl.NumberFormat("en", { notation: "compact" }).format(n);
console.log(fmtTokens(2750000)); // 2.8M
```

✅ **Answer:** "I'd show a **stacked bar or line chart of cost over time by model**, a **table** of models with requests, input and output tokens, cost, cost share and cost per 1K requests, sortable, plus KPI cards for total cost and change versus the previous period. The time range and grouping (model, team, API key) are filters in the URL. The backend aggregates; the frontend only formats — compact token numbers (2.8M), currency with `Intl.NumberFormat`, and percentages. Limit the chart to the top 5–8 models plus 'Others', so colours stay readable. Clicking a model drills down to its logs, pre-filtered."

**Edge cases:** zero data → empty state with time-range hint · a model with $0 cost (self-hosted) → show tokens, cost "—" · currency and timezone consistency (store UTC, show local) · very small values (`< $0.01`).

---

## S3. Display thousands of API logs

✅ **Answer:** "Logs are large and always growing, so: **server-side filtering** (time range, model, status, API key, search) with **cursor-based pagination** — offset pagination breaks when new rows keep arriving. The table is **virtualized**, rows are memoized, columns can be hidden. Clicking a row opens a **side drawer** with full details: request/response bodies (collapsed JSON, lazy-loaded), tokens, latency breakdown, guardrail results, and a trace for agent calls. Filters are in the URL. A 'Live' toggle polls for new rows or uses streaming, and it shows '12 new requests — click to load' instead of shifting rows under the user's cursor. Search input is debounced; old requests are aborted."

**Building blocks:** [P9 infinite scroll](05-Machine-Coding-Problems.md#p9-infinite-scrolling) + [virtualization](08-Frontend-Performance-and-Architecture.md#3-virtualization) + [P8 debounce](05-Machine-Coding-Problems.md#p8-debounced-search) + [P15 multi-select filters](05-Machine-Coding-Problems.md#p15-multi-select-dropdown).

**Extras worth saying:** mask sensitive fields by default (a "Show PII" toggle — you built exactly this at RagaAI for fax and patient records), copy request id, export the filtered results as CSV through a server job.

---

## S4. An API request takes 10 seconds

✅ **Answer:** "First, don't freeze the UI. Show progress in stages: a skeleton immediately, after about 3 seconds a message like 'This is taking longer than usual…', and after a timeout a Retry option. Keep the rest of the page interactive and allow cancel with AbortController. If it's an LLM completion, **stream** the response so tokens appear as they're generated — perceived latency drops from 10 s to under 1 s. If it's a long job (deploying a model, running an eval), the backend should return a **job id** right away, and the UI polls or subscribes for status with a progress indicator, so the user can leave and come back. I'd also check whether it can be made faster: caching, smaller payloads, pagination, or moving the work to the background."

```jsx
function useSlowHint(isLoading, ms = 3000) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!isLoading) { setSlow(false); return; }
    const id = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(id);
  }, [isLoading, ms]);
  return slow;
}
// {isLoading && <Skeleton />} {slow && <p>Still working… <button onClick={cancel}>Cancel</button></p>}
```

**Streaming an LLM response in the browser:**

```js
async function streamCompletion(body, onToken, signal) {
  const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify(body), signal });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true })); // append to state
  }
}
```

---

## S5. Real-time agent execution status

```
 Run #4821 — "Summarize open incidents"           ● Running · 00:14 · $0.03
 ✅ 1. Plan                     1.2s   312 tokens
 ✅ 2. tool: jira.search        0.8s   (MCP: jira-server)
 ⏳ 3. LLM: draft summary       …      streaming
 ○  4. tool: slack.post_message
```

| Transport | How | Use when |
|---|---|---|
| Polling | `GET /runs/:id` every 2 s | simple, fine for short runs |
| **SSE** (`EventSource`) | server pushes events over HTTP | one-way status updates — the usual best fit |
| WebSocket | two-way | the user can also send commands (cancel, approve) |

```jsx
function useRunEvents(runId) {
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const es = new EventSource(`/api/runs/${runId}/events`);
    es.onopen = () => setStatus("running");
    es.addEventListener("step", (e) => {
      const step = JSON.parse(e.data); // { id, name, state, durationMs, tokens }
      setSteps((prev) => {
        const i = prev.findIndex((s) => s.id === step.id);
        return i === -1 ? [...prev, step] : prev.map((s) => (s.id === step.id ? { ...s, ...step } : s)); // upsert by id
      });
    });
    es.addEventListener("done", (e) => { setStatus(JSON.parse(e.data).status); es.close(); });
    es.onerror = () => setStatus("reconnecting"); // EventSource retries automatically
    return () => es.close();                       // cleanup on unmount / runId change
  }, [runId]);

  return { steps, status };
}
```

✅ **Answer:** "I'd show the run as a timeline of steps — LLM calls and tool calls — each with a state (pending, running, success, failed), duration, tokens and cost, plus overall status, elapsed time and total cost. For updates I'd use Server-Sent Events, since status flows one way; WebSocket only if the user also sends commands like cancel or approve. Events are upserted by step id, so duplicates or out-of-order events don't break the UI. If the connection drops, I show 'Reconnecting…' and on reconnect fetch the full run state once to catch up. The connection closes on unmount. A failed step expands to show the error and offers retry from that step if the backend supports it."

---

## S6. Model selection dropdown

**Requirements to state:** search · group by provider · show useful metadata (context window, price per 1M tokens, a "tools" or "vision" badge) · disabled models the user has no access to (with the reason) · recently used at the top · keyboard accessible · fast with 500+ models.

```jsx
const MODELS = [
  { id: "openai/gpt-4o", provider: "OpenAI", name: "GPT-4o", inputPer1M: 2.5, ctx: 128000, allowed: true },
  { id: "anthropic/claude-sonnet", provider: "Anthropic", name: "Claude Sonnet", inputPer1M: 3, ctx: 200000, allowed: true },
  { id: "self-hosted/llama-3-70b", provider: "Self-hosted", name: "Llama 3 70B", inputPer1M: 0, ctx: 8192, allowed: false },
];

function groupByProvider(models, query) {
  const q = query.trim().toLowerCase();
  const groups = {};
  for (const m of models) {
    if (q && !`${m.provider} ${m.name} ${m.id}`.toLowerCase().includes(q)) continue;
    (groups[m.provider] ??= []).push(m);
  }
  return groups; // { OpenAI: [...], Anthropic: [...] }
}

function ModelOption({ m, active, onPick }) {
  return (
    <li
      role="option"
      aria-selected={active}
      aria-disabled={!m.allowed}
      onMouseDown={(e) => { e.preventDefault(); if (m.allowed) onPick(m); }}
      className={`flex justify-between px-3 py-2 text-sm ${m.allowed ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-50"}`}
      title={m.allowed ? "" : "Your team doesn't have access to this model"}
    >
      <span>{m.name}<span className="ml-2 text-xs text-slate-500">{m.id}</span></span>
      <span className="text-xs text-slate-500">{(m.ctx / 1000).toFixed(0)}K ctx · {m.inputPer1M ? `$${m.inputPer1M}/1M` : "self-hosted"}</span>
    </li>
  );
}
```

✅ **Answer:** "I'd build it on the searchable-dropdown pattern: a combobox input with a grouped listbox by provider, each option showing name, id, context window and price, and badges for capabilities. Models the user can't use are visible but disabled with a tooltip explaining why, so people know they exist. Search matches provider, name and id; recently used models are pinned at the top from localStorage. Keyboard navigation follows the ARIA combobox pattern, and for hundreds of models the list is virtualized. The model list comes from the gateway's API and is cached, since it rarely changes."

Base implementation: [P12 Searchable dropdown](05-Machine-Coding-Problems.md#p12-searchable-dropdown).

---

## S7. API errors and retry

✅ **Answer:** "I map errors to clear messages and actions instead of 'Something went wrong': 401 → re-login, 403 → 'You don't have access to this model — ask your admin', 429 → 'Rate limit reached, retrying in 8s' with a countdown that respects `Retry-After`, 5xx and network → automatic retry with exponential backoff, then a manual Retry button; validation errors go next to the field. Idempotent GETs retry automatically; actions like 'Deploy' don't — the button shows the error and lets the user retry consciously. The last good data stays on screen with a 'stale' indicator. Every error carries the request id so users can share it with support, and it's reported to monitoring."

Code: [08 → Network errors and retries](08-Frontend-Performance-and-Architecture.md#9-handling-network-errors-and-retries).

**Gateway-specific twist:** a request may succeed **after a fallback** (OpenAI 429 → served by Azure). Show this in the log as success with a "fallback" badge and both attempts in the details — useful for debugging cost and latency.

---

## S8. Responsive developer dashboard

✅ **Answer:** "Developer dashboards are used mostly on desktop, but they must not break on a laptop or tablet, and on-call people check them on phones. Mobile-first Tailwind: the sidebar becomes a drawer below `lg`; KPI cards go 1 → 2 → 4 columns; charts use a responsive container and fewer ticks on small screens; wide tables keep their key columns and scroll horizontally inside their card, or switch to a card list on mobile; filters collapse into a 'Filters' sheet. Code blocks and JSON wrap or scroll inside their box, never the page. I support dark mode, since developers expect it, using CSS variables or Tailwind's `dark:`. I test at 375, 768, 1280 and 1920 px."

```jsx
<main className="space-y-4 p-4">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{/* KPI cards */}</div>
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <section className="lg:col-span-2">{/* trend chart */}</section>
    <section>{/* top models */}</section>
  </div>
  <div className="overflow-x-auto rounded-lg border">{/* logs table */}</div>
</main>
```

**Your link:** AlgoTaskFlow has light and dark theming via Zustand, and your RagaAI work required "responsive and accessible layout consistent with the design system" ([10](10-Project-and-HR-Questions.md)).
