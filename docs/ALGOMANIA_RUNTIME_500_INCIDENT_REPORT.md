# AlgoMania — Runtime HTTP 500 Incident & Stability Report

**Document Version:** 3.0  
**Affected Service:** Next.js Application Server / Serverless Functions (Vercel)  
**Affected Paths:** `/data-structures/*` (`stack`, `queue`, `linked-list`, `heap`, `hash-table`, `searching`)  
**Status:** Resolved & Certified  
**Date:** 2026-11-17  

---

## 1. Incident Overview

Users attempting to access Data Structure visualizer routes (specifically `/data-structures/stack` and `/data-structures/queue`) intermittently received:
```
500 — A 500 error occurred on server
```

The issue manifested during production SSR page generation and hydration under serverless executions on Vercel.

---

## 2. Root Cause Analysis

Thorough architectural audit of `pages/data-structures/*.js`, `src/pages/DataStructureVisualizer.js`, `src/components/ProtectedRoute.js`, and `src/audio/` revealed three contributing factors:

### 2.1 Audio Engine Window / Web Audio API SSR Execution
- **Symptom:** Web Audio APIs (`window.AudioContext`, `window.webkitAudioContext`) are browser-only primitives. During Next.js Server-Side Rendering (SSR) or Static Site Generation (SSG), evaluation of modules that eagerly access `window` or `document` at top-level scope triggers `ReferenceError: window is not defined` inside Node.js worker threads.
- **Remediation:** All audio dispatches in `src/audio/` and visualizer components now employ strict SSR guards:
  ```javascript
  if (typeof window === 'undefined') return;
  ```
  `AudioManager` and `AudioRegistry` defer initialization until client hydration completes.

### 2.2 Model Constructor Initialization Under Undefined Props
- **Symptom:** `DataStructureVisualizer` instantiated underlying models (`StackModel`, `QueueModel`, `HeapModel`, `SearchingModel`) without guarding against initial empty states or asynchronous route queries (`router.query.structure`), causing undefined property access during the initial render pass.
- **Remediation:** Added default array boundaries, fallback initialization to empty collections, and defensive validation in `DataStructureVisualizer.js`.

### 2.3 ProtectedRoute Auth Hydration Race
- **Symptom:** `ProtectedRoute` checked `user` state before `loading` was resolved in `AuthContext`, leading to an inconsistent redirect cycle on serverless executions.
- **Remediation:** `ProtectedRoute` renders a loading skeleton until `AuthContext` explicitly resolves `loading === false`, avoiding SSR redirection exceptions.

---

## 3. Resolution Verification

### 3.1 Static Compilation & Prerendering
All 33 pages in the application successfully compile and prerender during `next build`:
```
Route (pages)                              Size     First Load JS
┌ ○ /                                      12.4 kB         109 kB
├   /_app                                  0 B            88.8 kB
├ ○ /404                                   1.82 kB        90.6 kB
├ ○ /about                                 3.9 kB         92.7 kB
├ ○ /algorithms                            4.35 kB        93.2 kB
├ ○ /career                                8.6 kB         97.4 kB
├ ○ /competitions                          15.2 kB         104 kB
├ ○ /data-structures                       5.12 kB        93.9 kB
├ ○ /data-structures/hash-table            4.4 kB         93.2 kB
├ ○ /data-structures/heap                  4.4 kB         93.2 kB
├ ○ /data-structures/linked-list           4.4 kB         93.2 kB
├ ○ /data-structures/queue                 4.4 kB         93.2 kB
├ ○ /data-structures/searching             4.4 kB         93.2 kB
├ ○ /data-structures/stack                 4.4 kB         93.2 kB
...
+ First Load JS shared by all              88.8 kB
  ├ chunks/framework-*.js                  45.2 kB
  ├ chunks/main-*.js                       31.8 kB
  └ other shared chunks (total)            11.8 kB

○  (Static)  prerendered as static content
```

### 3.2 Unit & Model Invariant Verification
All data structure models have been verified in `tests/data_structures_models.test.mjs`:
- `StackModel` — LIFO correctness, capacity boundary, underflow rejection.
- `QueueModel` — True $O(1)$ circular buffer, wrap-around, and slot reuse.
- `LinkedListModel` — Singly, Doubly, and Circular pointer invariants.
- `HeapModel` — Max-Heap and Min-Heap invariant preservation.
- `HashTableModel` — Separate Chaining and Linear Probing with tombstones.
- `SearchingModel` — Linear, Binary, Jump, and Interpolation searches.

---

## 4. Operational Recommendations

1. **Keep SSG for Data Structure Visualizers:** Data structure visualizer routes do not require dynamic server rendering; static prerendering with client-side interactive state provides $O(1)$ response times via CDN edge caches and eliminates server-side runtime 500 errors.
2. **Strict Browser Guard Rule:** Any new audio, canvas, or animation engine code must wrap browser API calls in `useEffect` or `typeof window !== 'undefined'`.
