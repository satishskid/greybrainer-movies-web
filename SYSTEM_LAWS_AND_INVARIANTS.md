# SYSTEM LAWS & ARCHITECTURAL INVARIANTS
**GREYBRAINER SOVEREIGN ENGINE & PUBLISHING PIPELINE**
*Permanent System Invariants — Effective Immediately and Indefinitely*

---

## Purpose
This document establishes the inviolable architectural and operational laws governing the Greybrainer ecosystem, spanning the **Movie Engine & Studio Suite** (`greybrainer-cloudflare-staging`) and the **Public Storefront** (`greybrainer-movies-web`). 

Every developer, autonomous AI agent, and system operator MUST strictly adhere to these laws. No feature, refactor, or optimization may violate them.

---

## 🏛️ The 7 Inviolable Laws

### LAW 1: The Canonical Storefront Domain Law
1. The sole canonical public storefront domain is strictly:
   **https://movies.greybrain.in**
2. All public film reviews and dossiers MUST be addressed exclusively at:
   **https://movies.greybrain.in/reviews/:slug**
3. All legacy `.ai` domains (`cinema.greybrain.ai`, `movie.greybrain.ai`, `cinema.greybrain.in`) are permanently deprecated, retired, and forbidden in:
   - Application routing and links.
   - Database records (Cloudflare D1, Turso).
   - Social syndication copies (Medium, LinkedIn, X, Instagram, Facebook).
4. Any legacy record or user input referencing deprecated domains MUST be automatically rewritten to `https://movies.greybrain.in/reviews/:slug` via `sanitizeWebsiteUrl` and `resolveCanonicalUrl`.

---

### LAW 2: The Zero-Mock-Data & Dynamic D1/R2 Law
1. No mock, hardcoded, or phantom film arrays (e.g. `war-2-2026`, `toxic-2026`, `kantara-chapter-1`) may exist in production UI views (Command Center, Bucket 2, Review Inbox, or Publish Lane).
2. All reviewed drafts, scheduled pipelines, and published records MUST be queried dynamically from live Cloudflare D1 + R2 sovereign tables.
3. If no drafts match a filter, the UI MUST render a clean, guided empty state with direct action buttons (`Launch Movie Engine`, `Explore Inbox Signals`), never phantom mock cards.

---

### LAW 3: The 0-to-5 Sovereign Pipeline Wiring Law
The editorial workflow follows a mandatory 6-stage continuum:
- **`00: Discovery`** (`/studio/inbox`): Signal detection, trending radars, incoming script submissions.
- **`01: Intelligence`** (`/` or `/studio/manual`): Screenplay forensics, pacing curves, character arcs, telemetry.
- **`02: Synthesis`** (Movie Engine output): Full 7-layer critique, 50-word verdict, 3-layer scoring.
- **`03: Asset Studio`** (`/studio/publish-lane` tab 1): TMDB poster selection, 5 visual ratios, Craftmatics approvals.
- **`04: Sovereign Publish`** (`/studio/publish-lane` tab 2): Simulated dry-run and live Cloudflare D1/R2 + direct SocialBu/CFPostiz dispatch.
- **`05: Live Storefront`** (`https://movies.greybrain.in/reviews/:slug`): One-click verification on the live storefront.

**Continuity Guarantee**: Step transitions and stepper navigation MUST preserve `activeDraftId` and `publishedUrl` so users and editors never lose active context.

---

### LAW 4: The Decluttered Highway & Sandbox Drawer Law
1. The primary Movie Engine and Command Center screens must remain high-signal, focused, and uncluttered.
2. Secondary or experimental tools (`GreybrainerInsights`, `GreybrainerComparison`, `CreativeSparkGenerator`, `ScriptMagicQuotientAnalyzer`) must live inside collapsible accordions (e.g., `🧪 Creative Lab & Ideation Sandbox`) to prevent visual overload.

---

### LAW 5: The Content Rigor & Storefront Integrity Law
1. The public storefront `https://movies.greybrain.in` is an institutional-grade diagnostic portal.
2. Only authentic in-depth 7-layer analyses (minimum 2,000 characters, genuine scoring telemetry, diagnostic visuals) and real-time industry intelligence briefs shall be surfaced on the public storefront.
3. Thin mock stubs, unverified test stubs, and empty placeholder records MUST be filtered out of public queries (`isDummyTestArticle` / `isLegacyReview`).

---

### LAW 6: The Local-to-Sovereign Cloud Resilience Law
1. Content authoring must operate on a dual-layer resilience model:
   Local Buffer (IndexedDB / LocalStorage) -> Cloudflare D1 (Metadata) + R2 (Full Payloads)
2. Writers and analysts must never lose work due to network dropouts, browser crashes, or token expiration.
3. Draft saves must be versioned (`v1`, `v2`, `v3`...) in R2 storage with immutable history.

---

### LAW 7: The Sovereign Social Syndication Law
1. Multi-channel syndication supports **Direct Native SocialBu Integration** (zero intermediate proxy hops) as the primary, ultra-stable organic posting pipeline, alongside sovereign CFPostiz (`https://digisocial.greybrain.ai`).
2. The website publication must always be dispatched first (or verified via dry review) to guarantee that the canonical review link (`https://movies.greybrain.in/reviews/:slug`) is embedded in social thread previews and copies.
3. Upstream platform post IDs and confirmation tokens MUST be persisted to Cloudflare D1 `publication_records`.

---

### LAW 8: The Zero-Firestore Invariant (Strictly Enforced)
1. **Firestore is 100% deceased, purged, and forbidden.**
2. Cloudflare D1 (`greybrainer-staging`) and Cloudflare R2 (`greybrainer-staging-content`) are the SOLE active databases and object stores.
3. Firebase is retained **EXCLUSIVELY** for client-side user authentication (Google SSO & Email login) via `firebase/auth`. No code, service, script, or AI agent shall ever attempt to read, write, query, configure, or depend on Cloud Firestore.
4. Any agent attempting to introduce Firestore imports (`@firebase/firestore`, `getFirestore`, `doc`, `setDoc`, `collection`) or Firestore rules violates this law and must immediately be reverted.

---

## 🛡️ Enforcement & Compliance
- **CI / Build Gate**: `npm run lint` (`tsc && tsc -p tsconfig.worker.json`) must pass with 0 errors before deployment.
- **Sanitization Guardrails**: `sanitizeWebsiteUrl` in client apps and `resolveCanonicalUrl` in worker services must intercept all website URLs.
- **Regression Audits**: Any AI agent modifying the codebase MUST review this document and ensure no laws are breached.
