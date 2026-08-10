# Redmoore Systems — Roadmap

Phased plan for building the corporate site first, wiring its content to the database, then delivering the authenticated backroom (operations) tool. Stack and engineering standards follow `__PLANNING/tech` (Laravel + Inertia.js + React/TypeScript + PostgreSQL) and brand assets in `__PLANNING/design`.

---

## Phase 0 — Foundation

Stand up the app shell before any product UI so pages can ship against a real stack.

- Scaffold **Laravel + Inertia.js + React (TypeScript)** with **Tailwind CSS** (+ shadcn/ui as needed)
- Local **PostgreSQL** (Docker) and basic app config / env
- Apply brand foundations: logo, colours (`#7D0308` / `#96181E`, `#E6A54B`, `#FBFCF7`, `#1E2014`), **Oxygen** typeface
- Shared layout primitives (nav, footer, page shell) with no real content yet
- Enable early guardrails: Eloquent strict mode locally, ESLint, Larastan/PHPStan baseline

**Exit:** `npm`/`composer` app boots; branded empty layout renders via Inertia.

---

## Phase 1 — Corporate UI block-out (static)

Block out the public marketing surface with hardcoded / fixture content. No CMS yet — focus on structure, hierarchy, and brand feel.

- Home page composition (hero, positioning, primary CTA, atmospheric visual)
- Global chrome: header, footer, navigation IA
- Responsive pass for first viewport + key sections
- Wire routes for planned content pages (placeholders OK)

**Exit:** Home page looks intentional and on-brand; other routes exist as stubs.

---

## Phase 2 — Multi-page corporate site (static content)

Expand the public site into a full multi-page corporate presence, still driven by static/fixture props.

Suggested page set (adjust as copy settles):

| Page | Purpose |
| --- | --- |
| Home | Brand, value prop, primary CTA |
| About / Company | Who Redmoore is |
| Sectors / Solutions | IoT & telemetry across industries |
| Platform / Product | What the operational platform does |
| Contact | Enquiry / contact path |

- Shared section patterns (one job per section; avoid card-heavy clutter)
- Consistent typography and colour usage from brand guidelines
- Light motion only where it supports hierarchy

**Exit:** Full public sitemap navigable with coherent static content.

---

## Phase 3 — Public content backend (DB-driven pages)

Introduce the first slice of backend so corporate pages are served from PostgreSQL rather than hardcoded props.

- Migrations/models for public content (e.g. pages, sections, CTA blocks, metadata/SEO fields)
- Seeders/factories for realistic marketing copy
- Controllers that load published content and pass **API Resources / explicit arrays** to Inertia (no raw Eloquent models)
- Public routes resolve slug → published page; draft/unpublished stays hidden
- Feature tests (Pest) for publish visibility and page rendering

**Exit:** Home and content pages render from the DB; changing seeded/admin data changes the site.

---

## Phase 4 — Backroom tool UI

Build the authenticated **backroom** (internal operations UI) as a distinct Inertia area, initially against mocked or thin data.

- Auth via **Laravel Breeze / Fortify** (staff-only)
- Backroom layout distinct from public marketing chrome
- Core screens block-out (dashboard shell, navigation, empty/loading states)
- Content management screens for the Phase 3 models (edit/publish corporate pages) — first useful backroom job
- Authorization stubs: policies/gates so only authenticated staff reach `/backroom`

**Exit:** Staff can sign in and use a branded backroom shell; at least page content can be edited end-to-end.

---

## Phase 5 — Extend backend for the backroom (operations platform)

Grow the domain model beyond marketing CMS into the IoT / telemetry product surface.

- Domain models for devices, sites/sectors, telemetry streams, alerts (shape TBD with product decisions)
- Queues for ingest/processing and external side effects (`afterCommit()`, no HTTP inside DB transactions)
- Backroom features: device/site lists, telemetry views, alert triage (incremental)
- Idempotency / locking where mutations are critical
- Pest coverage for authz and core mutations; Playwright for critical staff flows

**Exit:** Backroom is no longer “CMS only” — it operates on live (or seeded) operational data.

---

## Phase 6 — Hardening & observability

Production readiness aligned with golden rules.

- Structured JSON logging; request/user context on errors
- Laravel Telescope (local) / Pulse; production APM (Sentry / Flare / Datadog as chosen)
- N+1 audits, indexes on FKs, connection pooling plan if load demands it
- CI: Pest + PHPStan + ESLint; Playwright smoke for public home + backroom login

**Exit:** Deployable app with monitoring and automated safety nets.

---

## Dependency order (summary)

```
Phase 0 Foundation
    → Phase 1 Home UI block-out
        → Phase 2 Multi-page corporate (static)
            → Phase 3 Public content from DB
                → Phase 4 Backroom UI (+ CMS editing)
                    → Phase 5 Operations backend + backroom features
                        → Phase 6 Hardening
```

UI and IA first; database only after the public surface is blocked out; backroom after public content is model-backed so the first admin workflows have something real to edit.
