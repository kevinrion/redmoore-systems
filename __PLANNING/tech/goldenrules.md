# 🛡️ Fullstack Development: Golden Rules Guide (Laravel + Inertia + React)

## 1. Core Architecture & Tech Stack

* **Monolithic Simplicity:** Leverage **Laravel + Inertia.js + React (TypeScript)** to eliminate REST/GraphQL boilerplate. Inertia passes Eloquent models directly to React components with full type safety.
* **Database & ORM:** Pair **PostgreSQL** (hosted locally via Docker, or via Supabase/Neon/RDS) with **Eloquent ORM**. Lean on Eloquent's expressive query builder, mutators, and strict casting.
* **Zero Client Trust:** Never trust Inertia props or request payloads sent from the client. Always run authorization (`FormRequest` rules, Policies, or Gate checks) and re-verify calculations on the Laravel backend.
* **Payload Guardrails & API Resources:** Never pass raw Eloquent models directly into Inertia responses (exposes hidden fields like password hashes or internal keys). Always transform data via Laravel **API Resources (`JsonResource`)** or explicit arrays (`$user->only(['id', 'name'])`).
* **Inertia State Management:** Treat Inertia props as the single source of truth. Avoid duplicating server props in local React `useState()`—let Inertia handle server-state updates via page reloads and partial reloads.

---

## 2. Database Integrity, Performance & Concurrency

* **Avoid N+1 Queries:** Never access relations inside loops or JSX maps. Eagerly load relationships up front using Eloquent’s `with()` or `load()`. Strict mode (`Model::preventLazyLoading()`) must be enabled locally.
* **Index Foreign Keys:** Ensure every foreign key (`user_id`), composite index, and polymorphic column (`subject_type`, `subject_id`) has an explicit database index to prevent full-table scans under load.
* **Isolate External APIs & Queue Offloading:** Never execute HTTP calls (Stripe, emails, webhooks) inside a `DB::transaction()` block. Execute DB mutations, commit, and dispatch external calls asynchronously via **Laravel Queues**. Use `afterCommit()` on jobs to ensure DB transactions wrap before worker execution.
* **Connection Health:** Protect Postgres memory using **PgBouncer** or **Laravel Octane / FrankenPHP** for high-throughput environments to prevent database connection exhaustion.
* **Concurrency Guards & Mass Assignment:**
  * Require **Idempotency Keys** (or unique DB constraints/Redis locks) for critical mutations like payment processing.
  * Use **pessimistic locking** (`->lockForUpdate()`) or optimistic locking (`version` column) for shared mutable records. Lock multiple rows in a deterministic ID order (`ORDER BY id ASC`) to prevent database deadlocks.
  * Always use `$request->validated()` from `FormRequest` classes. Never call `Model::create($request->all())` to prevent mass-assignment security vulnerabilities.

---

## 3. Automated Safety Nets (Static Analysis & Guardrails)

Enforce strict editor and build-step analysis across PHP backend and React frontend:

* **Larastan / PHPStan:** Enforce Level 8+ analysis on backend code to catch dead code, missing return types, undefined methods, and incorrect Eloquent relationship types.
* **`Model::shouldBeStrict()`:** Enable this in `AppServiceProvider::boot()` for local development to catch lazy loading (N+1), unfillable attributes, and accessing missing attributes early.
* **Frontend ESLint Static Analysis:**
  * **`no-await-in-loop`:** Instantly flags sequential `await` calls inside loops that cause accidental waterfall request delays.
  * **`@typescript-eslint/no-floating-promises`:** Prevents un-awaited promises that execute asynchronously in the background and cause silent failures.
  * **`@typescript-eslint/no-misused-promises`:** Stops you from passing async callbacks into synchronous array methods like `.forEach()`.
  * **`react-hooks/rules-of-hooks`:** Enforces standard Hook ordering and prevents state lifecycle bugs in React components.

---

## 4. Local Testing & Profiling

* **Query Visibility:** Monitor executed SQL queries locally using **Laravel Telescope** or **Laravel Pulse**. If a single request executes dozens of identical queries, an N+1 bug is active.
* **Database Factories & Seeding:** Use **Laravel Database Factories** powered by Faker to seed local databases with 10,000+ mock records to stress-test Eloquent performance under realistic data volume.
* **Pest PHP / Feature Tests:** Write fast Pest tests using `RefreshDatabase` for testing backend authorization and business logic, combined with **Playwright** for critical end-to-end browser user flows.

---

## 5. Observability & Telemetry

* **Structured Logging:** Avoid bare `logger()` or `Log::info()` string calls in production. Output structured JSON logs (`Log::stack(['stdout'])` with Monolog JSON formatters) containing request IDs, user context, and exception traces.
* **Real-time & Production Telemetry:**
  * Use **Laravel Pulse** or **SigNoz / HyperDX** for zero-cost, real-time performance tracking of slow queue jobs, database queries, and system usage.
  * Deploy APM/error trackers (**Sentry**, **Laravel Flare**, or **Datadog**) to capture production exceptions with full stack traces and source map resolution.