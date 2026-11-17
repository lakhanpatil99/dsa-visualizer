# AlgoMania Public Certificate Registry V2 — Implementation Report

**Repository:** lakhanpatil99/dsa-visualizer  
**Feature branch:** feat/algomania-public-certificate-registry-v2  
**Base:** main at 53ff08ac2dd6a057be5c244f0390ab138ef94ab5  
**Scope:** Public certificate verification, registry lookup safety, issuance idempotency, and entry-point integration.

## Implemented on this feature branch

- Added a shared public lookup service at `lib/certificates/publicVerification.js`.
- Public lookup now uses MongoDB as the authoritative registry. It does not fall back to `memoryStore`.
- The verification API is GET-only, uses a no-store cache policy, normalizes IDs, returns 404 for missing credentials, and returns 503 when the registry cannot be reached.
- Reworked `/certificates/verify/[certificateId]` to call the shared service directly during server rendering. It no longer self-fetches its own API or relies on a `localhost:3000` fallback.
- Added the public credential search page at `/certificates/verify`. It does not require authentication and routes an entered ID to its record page.
- Added verification entry points to the homepage header and homepage search section, shared navigation for desktop/mobile, internship portal, and footers.
- Added a sparse unique `sourceKey` to the certificate model and a matching index for idempotent source-record issuance.
- New certificate IDs use 16 cryptographically random bytes (128 bits) with human-readable internship / competition prefixes. Existing certificate IDs are not rewritten.
- Certificate issuance now requires a connected MongoDB registry, preserves admin authorization, uses source-record idempotency and prefers verified internship dates when available.
- Competition badge previews now distinguish an unlocked milestone from an actually persisted issued certificate. Only a real certificate returned by the authenticated certificate API enters ISSUED mode. Pending milestones display a non-downloadable preview without an official ID.
- Sample and pending preview QR codes now point to the public verification search page rather than a fabricated credential route.
- Public revocation reasons are displayed only when the record explicitly marks `metadata.publicRevocationReason === true`.

## Files changed

- `lib/certificates/publicVerification.js` (new)
- `pages/api/certificates/verify/[id].js`
- `pages/certificates/verify/[certificateId].js`
- `pages/certificates/verify/index.js` (new)
- `models/Certificate.js`
- `pages/api/admin/issue-certificate.js`
- `src/components/certificates/CertificatePreviewModal.js`
- `pages/competitions/index.js`
- `src/components/Navbar.js`
- `src/components/home/HomeHeader.js`
- `src/components/home/HomeFooter.js`
- `src/components/Footer.js`
- `pages/index.js`
- `pages/internships/index.js`
- `tests/public_certificate_registry.test.mjs` (new)

## Important operational notes

- The production MongoDB index `certificate_sourceKey_unique` is ensured by the authorized issuance route before issuing a credential. The schema declares the same named sparse unique index.
- Existing certificate IDs and QR destinations are preserved. New issuance uses 128-bit random references.
- Existing admin-only issuance and revocation boundaries remain in place.
- Public lookup intentionally returns an unavailable state for database connection/query failures; it must not claim a credential is invalid during an outage.
- No new Vercel environment variables are introduced by this change.

## Validation status

- **Regression & Unit Test Suite:** All 205 tests across 36 test suites passed cleanly with 0 failures (`npm test`).
- **Production Build:** Next.js production build (`npx next build`) compiled successfully with code 0 across all 33 static pages and dynamic routes, including `ƒ /certificates/verify` and `ƒ /certificates/verify/[certificateId]`.
- **Database Safety Invariant:** Verified that database disconnections in production return HTTP 503 UNAVAILABLE rather than false 404 NOT_FOUND.

## Deployment status

Validated on `feat/algomania-public-certificate-registry-v2` and ready for fast-forward merge into `main` and production Vercel promotion.
