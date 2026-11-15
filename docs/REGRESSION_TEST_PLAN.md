# AlgoMania — Regression & Automated Test Plan

**Platform:** AlgoMania DSA Visualizer  
**Repository:** `lakhanpatil99/dsa-visualizer`  
**QA & Reliability Lead:** Senior QA Automation & Reliability Engineer  
**Date:** November 2026  
**Status:** Approved for Execution  

---

## 1. Overview & Test Objectives

The AlgoMania 10X/100X Production Upgrade introduces enterprise Firebase Authentication, email verification enforcement, and server-side token validation to a live DSA Visualizer platform.

This test plan defines the automated, integration, and regression suites required to ensure:
- 100% preservation of all existing DSA interactive learning features.
- Strict security boundaries on APIs and route guards.
- Absolute prevention of unverified email/password access.
- Seamless session restoration and browser history navigation.
- Idempotent MongoDB sync and zero data loss for legacy accounts.

---

## 2. Test Environment Matrix

| Environment | Purpose | Mocking Strategy |
|---|---|---|
| **Unit / Integration** | Jest + React Testing Library + Supertest / Next test harness | In-memory MongoDB (or mocked dbConnect) + mocked Firebase Admin & Client SDKs |
| **Component Regression** | Vitest / Jest + DOM Testing | Visualizer canvas rendering, state step machines, dark mode toggling |
| **E2E / Browser Flows** | Automated Playwright / Headless browser tests | Simulated auth flows, back/forward history, email verification states |

---

## 3. Core Test Matrix (28 Required Verification Scenarios)

| # | Test Scenario | Category | Expected Outcome |
|---|---|---|---|
| **1** | Registration success | Auth / Client | Form validates, `createUserWithEmailAndPassword` called, verification email dispatched, user routed to `/verify-email`. |
| **2** | Duplicate registration | Auth / Client | Firebase error `auth/email-already-in-use` handled with friendly message: "This email address is already in use. Please log in." |
| **3** | Invalid email format | Validation | Client & Server validate email regex. Submit disabled or displays inline error. |
| **4** | Weak password | Validation | Checks min length 6 chars; displays requirement hint; rejects weak passwords before API submission. |
| **5** | Password mismatch | Validation | Registration form checks `password === confirmPassword`; displays inline validation error. |
| **6** | Verification email failure | Resilience | If `sendEmailVerification` fails (e.g. rate limit), user receives retry prompt with countdown cooldown. |
| **7** | Unverified account access denial | Security Guard | Unverified email/password user accessing `/app`, `/trees`, `/dashboard`, etc. is redirected to `/verify-email`. |
| **8** | Successful email verification | Auth Flow | User completes verification; `user.reload()` confirms `emailVerified === true`; redirects to `/app` or return URL. |
| **9** | Expired verification link | Error Handling | Out-of-band link with expired action code prompts user to request a fresh verification link. |
| **10** | Already-used verification link | Error Handling | Handled gracefully without crash; alerts user that link has already been used and allows login. |
| **11** | Login success | Auth Flow | Valid credentials authenticate; user object and ID token retrieved; user routed to intended destination. |
| **12** | Incorrect password | Security | Returns clear, secure error: "Invalid email or password. Please check your credentials." |
| **13** | Google sign-in | OAuth | Initiates Google popup/redirect; returns verified email; triggers profile sync; redirects to app. |
| **14** | Password reset | Self-Service | User submits email; `sendPasswordResetEmail` called; displays confirmation screen. |
| **15** | Session restoration | Session | On page reload or app reopen, Firebase auth state observer restores session without UI flicker. |
| **16** | Browser Back & Forward | Navigation | User moving Back from `/verify-email` or `/app` does not cause redirect loop or flash of unauthenticated content. |
| **17** | Page refresh | Navigation | Refreshing `/dashboard` or `/graphs` retains authenticated state without logging user out. |
| **18** | Multi-tab logout | Synchronization | Logging out in Tab A dispatches state change; Tab B immediately reflects signed-out state. |
| **19** | Invalid Firebase token | Backend Security | API request with forged or tampered token returns `HTTP 401 Unauthorized`. |
| **20** | Expired Firebase token | Backend Security | Expired token returns `HTTP 401 Unauthorized` with token expired hint. Client refreshes token. |
| **21** | Missing authorization header | Backend Security | Request to `/api/auth/progress` or `/api/auth/user` without `Authorization` header returns `HTTP 401`. |
| **22** | Unverified token access denial | Backend Security | Token with `email_verified: false` accessing protected endpoint returns `HTTP 403 Forbidden`. |
| **23** | Duplicate MongoDB profile prevention | Idempotency | Multiple rapid logins or token refreshes do not create duplicate MongoDB `User` documents. |
| **24** | Existing user migration | Backward Compat | Legacy user logging in for first time links `firebaseUid` to existing MongoDB `_id`. |
| **25** | Progress preservation | Data Integrity | User's previous progress in Sorting, Graphs, Trees, and Data Structures loads accurately after migration. |
| **26** | Cross-user data access prevention | Security / Isolation | User A cannot fetch or update User B's progress via ID injection or query tampering. |
| **27** | Account deletion | Privacy / Security | Verified account deletion removes Firebase user and cleans up/archives MongoDB profile and progress. |
| **28** | Mobile responsiveness | UI/UX Quality | Registration, Login, Verification, and Visualizer toolbars render cleanly on mobile viewports (<640px). |

---

## 4. DSA Visualizer Regression Suite

Each of the following existing visualizer components must be tested for zero functional or visual regressions:

1. **Sorting Visualizer (`src/pages/SortingVisualizer.js`):**
   - Bubble Sort step-by-step execution, speed adjustment, pause, resume, reset.
   - Quick Sort and Merge Sort recursive partitioning animations.
   - Pseudocode panel line highlighting synchronization.
   - Time and Space complexity box display.
   - "Save Progress" button integration.

2. **Graph Visualizer (`src/pages/GraphVisualizer.js`):**
   - Breadth-First Search (BFS) node traversal and queue inspection.
   - Depth-First Search (DFS) recursion / stack inspection.
   - Dijkstra's Algorithm shortest path highlighting.
   - Interactive graph node/edge creation canvas.
   - "Save Progress" button integration.

3. **Tree Visualizer (`src/pages/TreeVisualizer.js`):**
   - Binary Search Tree (BST) insertion, node highlighting.
   - Inorder, Preorder, Postorder traversals.

4. **Data Structures Visualizer (`src/pages/DataStructureVisualizer.js`):**
   - Stack: Push, Pop, Peek operations with animated stack frames.
   - Queue: Enqueue, Dequeue operations with pointer indicators.
   - Linked List: Insert head/tail/position, delete node, search.
   - Hash Table & Heap operations.
   - Searching algorithms: Linear and Binary Search.

5. **Progress Dashboard (`src/components/ProgressDashboard.js`):**
   - Statistics aggregation (completed, in-progress, mastered, total time).
   - Algorithm-specific progress cards with completion percentages.
