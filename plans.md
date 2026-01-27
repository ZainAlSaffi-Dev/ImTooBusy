# Project Carbon: System Architecture & Design Document (v1.1)

## 1. Project Overview
**Goal:** Build a personal portfolio and booking system.
**Core Function:** Portfolio showcase + High-performance booking system (15/30/60 min slots) with manual approval and "Emergency Block" handling.
**Aesthetic:** "Cyberpunk / HUD" / Dark Mode / Neon Accents / Glassmorphism.
**Philosophy:** Learning-focused implementation. Hand-coded "Hunter" logic for finding availability.

---

## 2. Tech Stack Status

| Component | Technology | Status |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | **Active**. "Experience Feed" & "Booking Modal" complete. |
| **Styling** | Tailwind CSS | **Active**. HUD layout & Dark mode implemented. |
| **Backend** | FastAPI (Python) | **Active**. AEST Timezone Logic & endpoints operational. |
| **Database** | SQLite | **Active**. `carbon.db` persisting Bookings & Blocks. |
| **Email** | *Console Simulation* | **Pending**. Currently printing to terminal. Needs SMTP/Resend. |
| **Calendar** | *Internal DB Only* | **Pending**. External Sync (Google Cal) not yet linked. |
| **Security** | *None* | **Critical**. Admin dashboard is currently public. |

---

## 3. Database Schema (Actual)

### Table: `bookings`
*Stores user requests and their state.*

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Unique ID |
| `name` | TEXT | Requestor Name |
| `email` | TEXT | Requestor Email |
| `topic` | TEXT | Meeting Topic |
| `date` | TEXT | YYYY-MM-DD |
| `time` | TEXT | HH:MM (24hr) |
| `duration` | INTEGER | 15, 30, or 60 minutes |
| `status` | TEXT | `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED` |
| `created_at` | TEXT | Timestamp |

### Table: `blocks`
*Manual overrides to prevent bookings during specific times (or after emergency cancellations).*

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Unique ID |
| `date` | TEXT | YYYY-MM-DD |
| `start_time` | TEXT | HH:MM |
| `end_time` | TEXT | HH:MM |
| `reason` | TEXT | Admin note (e.g., "Doctor Appointment") |

---

## 4. Implemented System Logic

### A. The "Hunter" Availability Engine
1.  **Request:** Frontend asks for availability.
2.  **Time Barrier:** Backend filters out any slots that are in the past (Current Time < Slot Time).
3.  **Conflict Check:** Backend queries both `bookings` (active meetings) AND `blocks` (manual downtime).
4.  **Response:** Returns only valid, future slots.
5.  **Frontend Display:** Frontend automatically "hunts" for the next 5 valid business days (skipping weekends) to ensure the UI is never empty.

### B. The Admin & Cancellation Flow
1.  **Dashboard:** View "Incoming Requests" and "Upcoming Schedule" side-by-side.
2.  **Cancellation:** Admin can cancel an `ACCEPTED` meeting.
3.  **The "Block" Decision:** When cancelling, Admin chooses:
    * *Release Slot:* The time becomes bookable by others immediately.
    * *Block Slot:* The time is added to `blocks` table (e.g., emergency), preventing re-booking.
4.  **Management:** Admin can view and delete `blocks` via a dedicated tab to re-open time slots.

---

## 5. Implementation Roadmap & Status

### Phase 1: The Shell (Frontend) ✅ COMPLETED
* [x] React + Vite + Tailwind setup.
* [x] "Experience Feed" Portfolio (Scaled up UI).
* [x] "Booking Modal" with Timezone conversion & Week-Grid logic.

### Phase 2: The Engine (Backend) ✅ COMPLETED
* [x] FastAPI setup & SQLite Database.
* [x] Availability Logic (AEST Timezone lock).
* [x] Endpoints: `request-meeting`, `availability`, `admin/bookings`.

### Phase 3: The Logic Layer ✅ COMPLETED
* [x] Connect Frontend to Backend.
* [x] Implement "Time Travel" prevention (Backend validation).
* [x] Implement "Block" system and Admin Dashboard tabs.
* [x] "Hunter" logic for date fetching (Always show 5 days).

### Phase 4: Integrations & Security (The Next Step) 🚧 CURRENT
* [ ] **Admin Authentication:** Protect `/admin` with a login screen (JWT).
* [ ] **Real Email System:** Replace `print()` with actual email sending (SMTP/Resend API).
* [ ] **Google Calendar Sync:** (Optional) One-way sync to push accepted bookings to your phone.