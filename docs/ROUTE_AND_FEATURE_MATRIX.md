# AlgoMania — Route and Feature Matrix

This document provides the authoritative registry of all public, core, and laboratory routes in the AlgoMania platform.

---

## 1. Route Registry

| Route Path | Type | Auth Required | Purpose / Features |
| :--- | :--- | :--- | :--- |
| `/` | Public | No | Editorial Landing page, Interactive 3D Hero, Curriculum index |
| `/login` | Auth | No (PublicOnly) | Dual-column authentication, Google OAuth, Email/Password |
| `/register` | Auth | No (PublicOnly) | Account registration with password strength and email verification |
| `/forgot-password` | Auth | No (PublicOnly) | Password recovery email dispatch |
| `/verify-email` | Auth | VerificationGuard | Email link verification, resend cooldown timer, status check |
| `/algorithms` | Core | No | Complete algorithm catalog, domain filtering, search, Big-O cards |
| `/compare` | Lab | Yes | Dual-canvas split laboratory comparing sorting/graph algorithms |
| `/sorting` | Core Lab | Yes | 9 Sorting algorithms (Bubble, Quick, Merge, Heap, Selection, Insertion, Counting, Radix, Shell) |
| `/app` | Alias | Yes | Legacy route pointing to the Sorting laboratory with modern navigation |
| `/graphs` | Core Lab | Yes | Graph algorithms (BFS, DFS, Dijkstra with MinHeap, A*, Bellman-Ford, Kruskal) |
| `/graphs/route-lab`| New Lab | Yes | Highway map pathfinding simulation with real km distance calculation |
| `/trees` | Core Lab | Yes | Binary Search Tree & AVL tree with animated rotations and traversals |
| `/data-structures` | Hub | Yes | Overview hub for all linear and non-linear memory structures |
| `/data-structures/stack` | Core Lab | Yes | LIFO Stack with open-top well, sliding TOP pointer, push/pop |
| `/data-structures/queue` | Core Lab | Yes | FIFO Queue conduit with FRONT and REAR indicators |
| `/data-structures/linked-list` | Core Lab | Yes | Singly, Doubly, and Circular Linked Lists with node diagrams |
| `/data-structures/heap` | Core Lab | Yes | Max Heap tree visualization with array index mapping |
| `/data-structures/hash-table` | Core Lab | Yes | Key-value table with separate chaining and linear probing |
| `/data-structures/searching` | Core Lab | Yes | Linear, Binary, Jump, and Interpolation search |
| `/dynamic-programming` | New Lab | Yes | 0/1 Knapsack, Coin Change, LCS, LIS with animated DP matrices |
| `/strings` | New Lab | Yes | KMP, Rabin-Karp, Naive string matching with shift tables |
| `/backtracking` | New Lab | Yes | N-Queens, Sudoku, Maze solver with call stack inspection |
| `/dashboard` | User | Yes | Real-time progress dashboard, completed simulations, mastery stats |
| `/account` | User | Yes | Display name update, password change, account deletion |
| `/404` | Utility | No | Custom 404 page with navigation links in editorial theme |

---

## 2. Navigation Behavior Specifications

- **Curriculum Dropdown:** Accessible across all pages via `<Navbar />`. Closes on outside click, item selection, or route change.
- **Mobile Menu Drawer:** Accessible on viewports `< 1024px` with high-contrast laboratory buttons and auth shortcuts.
- **Session Continuity:** Preserved across page reloads and cross-tab logout events via `localStorage` event broadcasting.
- **Route Protection:** Protected routes preserve deep links by appending `?returnUrl=<path>` when redirecting unauthenticated users to `/login`.
