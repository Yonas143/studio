# Comprehensive System Requirements & Security Audit Specification

**Document Version:** 2.0
**Date:** 2026-01-26
**Status:** Approved for Development

---

## 1. Executive Summary

The **Studio Awards Platform** is a secure, high-integrity web application designed to facilitate the Cultural Ambassador Award. The system empowers the public to browse nominees, cast votes, and submit new entries while providing administrators with robust tools to manage content, monitor fraud, and configure the platform.

The system is built on a modern **Next.js 15** architecture, leveraging **Supabase** for authentication and data, with **Prisma ORM** ensuring type-safe database interactions.

---

## 2. System Actors & Access Control

| Actor | Description | Access Level |
| :--- | :--- | :--- |
| **Guest (Voter)** | Public user visiting the site. | **Read-Only:** Nominees, Categories, Content.<br>**Write:** Vote (1/day/nominee), Submit Entry. |
| **Participant** | Logged-in public user. | **Read:** Inherits Guest.<br>**Write:** Submit Entry (with tracking), View Profile history. |
| **Judge** | Appointed cultural expert. | **Read:** Nominees, Submissions.<br>**Action:** Score Nominees (Internal interface not yet exposed in partial schema). |
| **Admin** | System operator. | **Read/Write:** All Content (Nominees, Categories, Popups).<br>**Action:** Approve/Reject Submissions, Manage Ads. |
| **Superadmin** | System owner. | **Inherits Admin.**<br>**Action:** Critical configuration, Role management. |

---

## 3. Functional Requirements Specification (FRS)

### 3.1 Voting System
- **FR-V-01 (Vote Casting):** The system shall allow users to vote for a nominee within a specific category.
- **FR-V-02 (Rate Limiting):** The system must restrict voting to **one vote per nominee per person per day**.
  - **Constraint:** Validation must check `IP Address` and `userId` (if logged in) against the `Vote` table for records created since `00:00:00` of the current day.
- **FR-V-03 (Anti-Fraud):** The system shall record a browser fingerprint and IP address for every vote to detect patterns of abuse (e.g., bot farms, VPN cycling).
- **FR-V-04 (Eligibility):** Votes must only be accepted for Nominees marked as `isActive: true`.
- **FR-V-05 (Payment Gate):** (Feature Flagged) The system shall support a payment flow ("Pay to Vote") integration with **Chapa**, **Telebirr**, and **CBE Birr**.
  - *Current State:* Client-side simulation implemented.
  - *Future State:* Server-side transaction verification required before recording vote.

### 3.2 Content Management (CMS)
- **FR-C-01 (Nominees):** Admins can Create, Read, Update, and Delete (CRUD) nominees.
  - Fields: `name`, `bio`, `media` (Gallery of Images/Videos), `category`, `scope` (Ethiopia/Worldwide).
- **FR-C-02 (Categories):** Admins can manage award categories (e.g., "Music", "Art") and toggle them `isActive`.
- **FR-C-03 (Submission Workflow):**
  - **Public:** Can submit form with `title`, `description`, `fileUrl`, `portfolioUrl` and contact info.
  - **Admin:** Can filter submissions by `status` (pending/approved) and promote them to Nominees.
- **FR-C-04 (Ads & Popups):**
  - Admins can configure side ads (Left/Right rails) via `AdConfig` model.
  - Admins can create interstitial popups (Video/Image/Text) triggered by `delaySeconds` and stored in `localStorage` by `storageKey` to prevent repetitive display.

---

## 4. Non-Functional Requirements (NFR)

- **NFR-SEC-01 (Authentication):** All administrative routes (`/admin/*`) must be protected by Role-Based Access Control (RBAC) ensuring `user.role` is 'admin' or 'superadmin'.
- **NFR-SEC-02 (Data Integrity):** Foreign key constraints (Cascade Delete) must be maintained between `Category` -> `Nominee` -> `Vote`/`Media`.
- **NFR-PERF-01 (Response Time):** Voting API endpoints should respond within **200ms** (excluding payment gateway latency).
- **NFR-UI-01 (Responsiveness):** The interface must be fully responsive, spanning Mobile (320px) to Desktop (1920px+).
- **NFR-COM-01 (Scoring Rules):** The final winner calculation must support a weighted average: **70% Public Vote** + **30% Jury Score**.

---

## 5. System Architecture

### 5.1 Technology Stack
- **Frontend:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS.
- **UI Library:** Shadcn UI (Radix Primitives), Lucide Icons.
- **Backend:** Next.js Route Handlers (`/app/api`).
- **Database:** PostgreSQL (via Supabase).
- **ORM:** Prisma Client.
- **Auth:** Supabase Auth (Middleware integration).
- **Monitoring:** Sentry (Error tracking).

### 5.2 Component Diagram
```mermaid
graph TD
    Client[Web Client (Mobile/Desktop)] -->|HTTPS| Middleware[Next.js Middleware (Auth)]
    Middleware -->|Authorized| AppServer[Next.js App Server]
    AppServer -->|Prisma| DB[(PostgreSQL Database)]
    AppServer -->|REST| Payment[Payment Gateways (Chapa/Telebirr)]
    AppServer -->|Auth Check| SupabaseAuth[Supabase Auth]
    
    subgraph "Core Modules"
        VotingEngine[Voting Logic & Limits]
        CMS[Content Management]
        AdsEngine[Ad & Popup Controller]
    end
    
    AppServer -.-> VotingEngine
    AppServer -.-> CMS
    AppServer -.-> AdsEngine
```

---

## 6. Data Dictionary (Schema Breakdown)

### 6.1 Core Tables
| Table | Description | Key Fields | Constraints |
| :--- | :--- | :--- | :--- |
| `User` | Authenticated accounts | `id`, `email`, `role`, `createdAt` | `email` unique. `role` defaults to 'participant'. |
| `Nominee` | Award Candidates | `id`, `categoryId`, `voteCount`, `scope` | `voteCount` defaults 0. `isActive` defaults true. |
| `Vote` | Vote Records | `id`, `userId`, `nomineeId`, `ipAddress`, `fingerprint` | Unique constraint on `[userId, nomineeId]`. Index on `createdAt`. |
| `Category` | Award Groups | `id`, `name`, `slug`, `order` | `slug` unique. |
| `NomineeMedia` | Gallery Items | `id`, `nomineeId`, `type` (img/vid), `url` | Cascade delete on Nominee. |
| `Submission` | User entries | `status` (pending/approved), `contactInfo` | - |

---

## 7. Business Logic & Process Flows

### 7.1 Voting Logic (Pseudo-code)
1. **Receive Request:** `POST /api/votes` with `{ nomineeId, fingerprint }`.
2. **Identify Voter:** Extract IP address from `x-forwarded-for` and User ID from Session.
3. **Validate Nominee:** 
   - Check `Nominee` exists.
   - Check `Nominee.isActive === true`.
4. **Check Constraints (Rate Limit):**
   - Query `Vote` table: `WHERE (ipAddress == CurrentIP OR userId == CurrentUser) AND createdAt >= StartOfToday`.
   - **IF** record found: Return `429 Too Many Requests`.
5. **Execute Vote:**
   - Transaction:
     - `INSERT INTO Vote`
     - `UPDATE Nominee SET voteCount = voteCount + 1`
6. **Return:** `201 Created` with updated vote count.

### 7.2 Submission Lifecycle
1. User submits form -> `POST /api/submissions`.
2. System creates record with `status: 'pending'`.
3. Admin reviews in Dashboard.
4. Admin Decision:
   - **Reject:** Sets `status: 'rejected'`.
   - **Approve:** Sets `status: 'approved'` -> Admin manually creates `Nominee` from data.

---

## 8. Security & Threat Model

### 8.1 Mitigations
- **Broken Access Control:**
  - **Mitigation:** `requireAdmin()` helper checks database role *after* authentication for all sensitive routes (`/api/nominees [POST]`, `/api/admin/*`).
- **Vote Manipulation:**
  - **Mitigation:**
    - **IP Rate Limiting:** Cooldown 24 hours (reset at midnight).
    - **Fingerprinting:** Browser fingerprinting to detect clearing cookies/incognito.
    - **Note:** Current schema allows 1 vote per *UserId* globally, but logic enforces per *Day* in API.
- **Injection Attacks:**
  - **Mitigation:** Prisma ORM fully parameterizes queries, preventing SQL injection.
- **Data Validation:**
  - **Mitigation:** Zod schemas in every API route validate structure, types, and constraints (e.g., `email()`, `url()`, `min(1)`).

---
