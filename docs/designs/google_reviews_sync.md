# Google Reviews Static Snapshot Architecture (Path 1)

* **Author:** Kamil
* **Status:** Approved
* **Date:** 2026-11-01

---

## Overview

This document specifies the technical design for restoring the customer reviews section on `speedqueenkrk.pl` using a decoupled static snapshot architecture. 

Instead of querying Google Places API dynamically during edge SSR or client hydration, an out-of-band GitHub Actions cron job queries the API on a bi-weekly schedule (once every 2 weeks), validates and deduplicates 4★ and 5★ reviews across the 3 Kraków branches (Pawia, Słowackiego, Orlińskiego) in Polish and English, and commits the snapshot directly to `src/data/reviews.json`. The Next.js landing page imports this file statically, ensuring zero-latency reads, zero runtime external dependencies, and complete immunity from Google Cloud API rate limits.

---

## The Problem

The previous implementation attempted to query Google Places API at runtime from within `src/actions/getReviews.ts`. In production on Cloudflare Workers (`@opennextjs/cloudflare`), this architecture failed for structural reasons:

1. **No Persistent Edge Cache**: Cloudflare Workers run across 300+ global Points of Presence (PoPs) in ephemeral V8 isolates. Without a configured Cloudflare KV Incremental Cache binding in `wrangler.jsonc`, `next: { revalidate: 86400 }` defaults to an in-memory `Map` within each isolate. Isolates cold-start frequently and share no memory, yielding an edge cache hit rate near 0%.
2. **Immediate Quota Burnout**: With 3 locations and 2 language variants (`pl` and `en`), each cold visit triggered 6 review queries plus 3 rating queries (`getLocationRatings`). For a user with a hard Google Cloud quota of 50–100 requests/day, just 8–15 visitors from different locations exhausted the quota, returning `429 Too Many Requests` or `OVER_QUERY_LIMIT`.
3. **Severe TTFB Stalls**: Google Places API queries added 400ms–4,000ms of blocking latency to landing page rendering, leading to commit `494dffe` where reviews had to be disabled to resolve worker stalls.
4. **Disappearing UI on Error**: When Google returned rate limits or errors, `getReviews.ts` returned `[]`, which caused `<Reviews />` to render `null` and disappear entirely from the DOM.
5. **Atmosphere SKU Billing Risk**: `fields=reviews` triggers Google's Atmosphere SKU ($22.00 / 1,000 requests), exposing the project to unexpected costs under traffic spikes.

---

## Goals

* **Zero Runtime API Calls**: Exactly 0 external requests to Google Places API during visitor page loads.
* **Deterministic API Quota Consumption**: Exactly 6 API calls per sync run (3 locations × 2 languages), running on a bi-weekly cron (once every two weeks), consuming ~12–18 requests/month total out of the 50–100 daily quota.
* **Zero TTFB Overhead (< 1ms)**: Reviews and branch ratings are bundled statically into the application bundle, rendering immediately during SSR without worker stalls.
* **100% Uptime & Graceful Fallback**: The reviews carousel always renders verified, high-quality reviews and never disappears from the DOM due to upstream API errors or expired keys.
* **Multi-Language Integrity**: Polish and English review datasets are strictly partitioned to eliminate cross-language cache contamination.
* **Automated Quality Firewall**: The sync script filters for 4★ and 5★ reviews with non-empty text, and replaces missing or broken Google avatar URLs with a neutral user silhouette fallback.

---

## Non-Goals

* **Instantaneous Review Reflection**: Reviews will not update the minute a customer posts on Google Maps; syncing runs on a bi-weekly schedule matching the natural business pace (~4–6 new reviews/month).
* **Unofficial Scraping**: No web scrapers or unauthorized hacks to bypass Google's 5-review ceiling per location on Place Details.
* **Dynamic Database Overhead**: No integration with Neon PostgreSQL, Redis, or external databases for reviews storage.
* **Admin Moderation UI**: No manual review moderation dashboard; filtering is fully automated based on the 4★+ rating threshold and text presence.

---

## Resolved Design Invariants

* **Schedule Frequency**: Bi-weekly execution (once every 2 weeks on Sunday at 03:00 UTC) plus manual on-demand trigger via `workflow_dispatch`.
* **Rating Threshold**: 4-star and 5-star reviews (`rating >= 4`) with substantive written text.
* **Avatar Fallback**: Neutral user silhouette avatar placeholder (`/images/avatar-default.svg` or inline SVG). The brand logo (`/images/logo.png`) must **not** be used as an avatar fallback.

---

## Critical User Journeys (CUJs)

### CUJ 1: Visitor Browses Landing Page
* **Given**: A visitor navigates to `https://speedqueenkrk.pl/pl` or `/en`.
* **When**: The Cloudflare Worker processes the SSR request.
* **Then**: The server imports `src/data/reviews.json` locally with 0ms network latency, renders the `<Reviews />` carousel with verified 4★ and 5★ customer quotes, ratings, and avatars, and produces zero external network requests to Google.

### CUJ 2: Automated Bi-Weekly Sync
* **Given**: The GitHub Actions cron triggers bi-weekly (once every 2 weeks) or via manual trigger.
* **When**: `tools/sync-reviews.ts` executes in the runner using `GOOGLE_PLACES_API_KEY`.
* **Then**: It queries each of the 3 locations with `reviews_sort=newest` for `pl` and `en`, filters for reviews with `rating >= 4`, sanitizes the responses, writes `src/data/reviews.json`, and if differences are detected, commits the updated snapshot to git and triggers deployment. If Google's API fails or returns rate limits, the step fails safely without overwriting the existing snapshot.

---

## Technical Plan (Architecture)

### 1. System Architecture Diagram

```
+-------------------------------------------------------------+
|              GitHub Actions Scheduled Runner                |
|           (Runs every 2 weeks on Sun 03:00 UTC)             |
+-------------------------------------------------------------+
                              |
                              | 1. Execute npx tsx tools/sync-reviews.ts
                              v
+-------------------------------------------------------------+
|                 tools/sync-reviews.ts                       |
|  - Calls Google Places API:                                 |
|    maps.googleapis.com/.../place/details/json               |
|    params: fields=name,rating,user_ratings_total,reviews    |
|            reviews_sort=newest                              |
|  - 3 branches (Pawia, Słowackiego, Orlińskiego)             |
|  - 2 locales (pl, en) = Exactly 6 HTTP GET requests         |
|  - Filters: rating >= 4, text.length > 15                   |
|  - Sanitizes avatar URLs (fallback to neutral silhouette)   |
+-------------------------------------------------------------+
                              |
                              | 2. Serialize and write
                              v
+-------------------------------------------------------------+
|                src/data/reviews.json                        |
|  - Contains ratings object (all branches + aggregated)      |
|  - Contains partitioned reviews object: { pl: [], en: [] }  |
+-------------------------------------------------------------+
                              |
                              | 3. If diff detected: git commit & push
                              v
+-------------------------------------------------------------+
|                  GitHub CI Deployment                       |
|           (.github/workflows/deploy.yml)                    |
|  - Runs next build (OpenNext packages reviews.json)         |
|  - Deploys compiled Worker to Cloudflare edge               |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|            Cloudflare Worker Runtime (300+ PoPs)            |
|  - app/[lang]/page.tsx:                                     |
|    import reviewsData from "@/data/reviews.json"            |
|  - RootLayout (<JsonLdBase />):                             |
|    Reads locationRatings directly from same JSON file       |
|  - Read Latency: < 0.1ms (in-memory bundle)                 |
|  - External Google API calls during user visits: EXACTLY 0  |
+-------------------------------------------------------------+
```

### 2. Data Structure Schema (`src/data/reviews.json`)

The snapshot is structured to supply both the review carousel and root layout schema ratings in a single read:

```typescript
export interface ReviewsSnapshot {
  updatedAt: string; // ISO 8601 timestamp (e.g. "2026-11-01T03:00:00.000Z")
  ratings: {
    orlinskiego: { rating: number; reviewCount: number };
    pawia: { rating: number; reviewCount: number };
    slowackiego: { rating: number; reviewCount: number };
    overall: { rating: number; totalReviews: number };
  };
  reviews: {
    pl: GoogleReviewItem[];
    en: GoogleReviewItem[];
  };
}

export interface GoogleReviewItem {
  author_name: string;
  rating: number; // 4 or 5
  text: string;
  relative_time_description: string;
  profile_photo_url: string; // Validated HTTPS Google URL or empty string for default avatar
  time: number; // Unix timestamp in seconds
  branchName: string;
}
```

### 3. Component & Module Responsibilities

1. **`tools/sync-reviews.ts` (New Tool)**:
   - Standalone CLI runner designed for CI and local execution (`npm run reviews:sync`).
   - Uses `reviews_sort=newest` and `fields=name,rating,user_ratings_total,reviews`.
   - Iterates through `[Pawia, Słowackiego, Orlińskiego]` across `["pl", "en"]`.
   - Validates avatar URLs; if missing or invalid, stores `""` so the frontend applies the neutral silhouette.
   - Writes clean, formatted JSON to `src/data/reviews.json`.
   - Exits with `exitCode = 0` if successful, or `exitCode = 1` on fatal errors (missing keys, network failure) without touching the existing `reviews.json`.

2. **`.github/workflows/sync-reviews.yml` (New Workflow)**:
   - Schedule: `cron: '0 3 1,15 * *'` (1st and 15th of each month at 03:00 UTC) + `workflow_dispatch`.
   - Injects `GOOGLE_PLACES_API_KEY` from repository secrets.
   - Runs `npx tsx tools/sync-reviews.ts`.
   - Uses `git status --porcelain` to check if `src/data/reviews.json` changed.
   - If changed: commits with `chore: update google reviews snapshot` and pushes to `dev` or triggers deploy.
   - If unchanged: exits cleanly without creating empty commits.

3. **`src/actions/getReviews.ts` (Refactor)**:
   - Stripped of runtime `fetch("https://maps.googleapis.com/...")`.
   - Imports `src/data/reviews.json` synchronously.
   - Returns `reviews[lang] || reviews["pl"]`.
   - Zero network latency, zero timeout abort signals.

4. **`src/lib/getLocationRatings.ts` (Refactor)**:
   - Stripped of runtime `fetch("https://maps.googleapis.com/...")`.
   - Imports ratings directly from `src/data/reviews.json`.
   - Eliminates the 3 redundant API queries previously fired during every `RootLayout` render.

5. **`src/components/sections/Reviews.tsx` (Avatar Polish)**:
   - Replaces the fallback `/images/logo.png` with a neutral SVG silhouette icon or `/images/avatar-default.svg`.
   - Eliminates the brand logo from appearing as a customer face.

6. **`app/[lang]/page.tsx` & Navigation (Enable)**:
   - Uncomments `<Reviews reviewWrapper={reviewsContent} reviews={googleReviews} bgImage={getSectionBackground(4)} />`.
   - Uncomments `{ label: "Opinie", href: "#reviews" }` in `src/config/pl/navigation.ts` and `src/config/en/navigation.ts`.

---

## Alternatives Considered

### Alternative A: Runtime Edge SWR (`next: { revalidate: 86400 }`)
* **Pros**: Standard Next.js idiom on traditional single-instance Node.js servers.
* **Cons**: Broken on Cloudflare Workers without persistent KV backing. Each of the 300+ edge PoPs executes isolated V8 runtimes where cache hit rates are near 0%. Causes worker stalls (up to 4,000ms), multi-language cache poisoning, and burns through the daily 50–100 request quota within hours.
* **Reason for Rejection**: Proven to degrade landing page TTFB in production; already forced disabling reviews in commit `494dffe`.

### Alternative B: Cloudflare R2 Snapshot Storage (Decoupled Runtime Read)
* **Pros**: Zero git commit noise; updates propagate instantly without triggering Next.js CI rebuilds.
* **Cons**: Requires configuring and maintaining an R2 bucket binding in `wrangler.jsonc` and `@opennextjs/cloudflare`; introduces runtime async I/O (~5–15ms) on cold isolates; adds unnecessary architectural moving parts.
* **Reason for Rejection**: Unjustified complexity (YAGNI/KISS). Since reviews only change ~4–6 times per month across all Kraków branches combined, bundling static JSON directly into the worker achieves < 0.1ms reads with zero runtime moving parts.

### Alternative C: Database Storage (Neon PostgreSQL / Drizzle)
* **Pros**: Relational querying and filtering capabilities.
* **Cons**: Unnecessary connection pooling overhead, cold-start latency, and maintenance for ~15 static review records.
* **Reason for Rejection**: Severe architectural over-engineering for a local business website.

---

## Non-Functional Requirements (NFRs)

* **Performance & Latency**: Reading reviews and ratings executes in `< 0.1ms` during SSR via direct static import. Eliminates all async network blocking from page generation.
* **Quota & Cost Economics**: Exactly 6 API calls bi-weekly (~12–18 calls/month). Total monthly cost: $0.00. Consumes under 10% of a single day's quota once every two weeks.
* **Reliability & Availability**: 100% uptime for the reviews UI. If Google Places API is unavailable or returns an error during the GitHub Action run, the action logs a failure and aborts without overwriting the snapshot. The live site continues serving the last verified snapshot uninterrupted.
* **Security & Privacy**: `GOOGLE_PLACES_API_KEY` is only used in server-side/CI environments. No API keys are leaked to client bundles or browser network tabs.

---

## Detailed Implementation Plan

### Target Files to Create & Modify

#### 1. `src/data/reviews.json` (Create)
* **Scope**: Static seed data file.
* **Contents**: Fully populated snapshot containing verified ratings and reviews across the 3 branches in `pl` and `en`, providing immediate offline and local dev support.

#### 2. `tools/sync-reviews.ts` (Create)
* **Scope**: Node.js / TypeScript CLI utility.
* **Implementation Details**:
  * Loads `.env.local` using `dotenv`.
  * Fetches `[Pawia, Słowackiego, Orlińskiego]` across `["pl", "en"]` using `reviews_sort=newest` and `fields=name,rating,user_ratings_total,reviews`.
  * Applies firewall: filters for `rating >= 4`, validates substantive text (`text.length > 15`), normalizes timestamps.
  * Calculates branch and aggregate ratings.
  * Formats and writes `src/data/reviews.json`.
  * Handles errors cleanly with `process.exitCode = 1` without libuv assertions.

#### 3. `.github/workflows/sync-reviews.yml` (Create)
* **Scope**: GitHub Actions CI workflow.
* **Triggers**: Schedule (`cron: '0 3 1,15 * *'`) and manual (`workflow_dispatch`).
* **Steps**:
  1. Checkout repository with write access.
  2. Setup Node.js.
  3. Run `npx tsx tools/sync-reviews.ts`.
  4. Check `git status --porcelain src/data/reviews.json`.
  5. If changed, commit: `chore: update google reviews snapshot` and push to trigger automated deployment.

#### 4. `src/actions/getReviews.ts` (Modify)
* **Scope**: Data provider function.
* **Refactoring**:
  * Replace asynchronous `fetchLocationReviews` with direct import of `src/data/reviews.json`.
  * Export `getGoogleReviews(lang: string)` returning `reviewsData.reviews[lang] || reviewsData.reviews.pl`.
  * Remove `PLACE_IDS`, `apiKey`, and timeout logic.

#### 5. `src/lib/getLocationRatings.ts` (Modify)
* **Scope**: Branch ratings provider.
* **Refactoring**:
  * Replace external Google API fetch with direct read from `src/data/reviews.json.ratings`.
  * Export `fetchLocationRatings()` returning typed ratings for Pawia, Słowackiego, and Orlińskiego.
  * Completely removes external HTTP calls from `RootLayout`.

#### 6. `src/components/sections/Reviews.tsx` (Modify)
* **Scope**: Client React component.
* **Refactoring**:
  * Update avatar image fallback: replace `/images/logo.png` with a neutral SVG silhouette placeholder (`/images/avatar-default.svg`).
  * Ensure smooth layout rendering without CLS.

#### 7. `app/[lang]/page.tsx` (Modify)
* **Scope**: Page template.
* **Refactoring**:
  * Uncomment `<Reviews reviewWrapper={reviewsContent} reviews={googleReviews} bgImage={getSectionBackground(4)} />`.

#### 8. `src/config/pl/navigation.ts` & `src/config/en/navigation.ts` (Modify)
* **Scope**: Navigation menus.
* **Refactoring**:
  * Uncomment `{ label: "Opinie", href: "#reviews" }` and `{ label: "Reviews", href: "#reviews" }`.

#### 9. `package.json` (Modify)
* **Scope**: NPM scripts.
* **Addition**: `"reviews:sync": "npx tsx tools/sync-reviews.ts"`.

---

## Verification Plan

1. **Static Quality Verification**:
   * Run `npx tsc --noEmit` to verify type safety across all updated data contracts.
   * Run `npm run lint` to guarantee clean ESLint compliance.
2. **Deterministic Sync Execution**:
   * Run `npm run reviews:sync` locally.
   * Verify that exactly 6 API requests are made.
   * Inspect generated `src/data/reviews.json` for proper JSON formatting, correct branch ratings, and valid review items.
3. **Local SSR & UI Inspection**:
   * Run `npm run dev` and navigate to `http://localhost:3000/pl` and `http://localhost:3000/en`.
   * Verify that the Reviews section renders in the viewport with smooth animation, verified 4★ and 5★ quotes, and neutral avatar fallbacks.
   * Verify navigation links scroll smoothly to `#reviews`.
   * Confirm via browser network devtools that **0 requests** are dispatched to `maps.googleapis.com`.
4. **Git Safety**:
   * Commit all changes locally using conventional commits (`feat: add static reviews sync and restore reviews section`).
   * Await explicit user approval before pushing.
