# Project Carbon: System Architecture & Design Document

## 1. Project Overview
**Goal:** Build a personal portfolio and calendar management application.
**Core Function:** Allow users to request meetings that sync with a personal calendar, requiring manual approval to generate meeting links (Teams/Zoom).
**Aesthetic:** "Need for Speed: Carbon" / Dark Mode / Neon Accents / Glassmorphism.
**Philosophy:** Learning-focused implementation. Hand-coded frontend to understand the underlying mechanics.

---

## 2. Tech Stack Selection

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, modern standard. Vite is lighter than Next.js for learning. |
| **Styling** | Tailwind CSS | Rapid UI development, easy to handle color palettes and dark mode. |
| **Backend** | FastAPI (Python) | High performance, utilizes your Python strengths, native async support. |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) | Relational data is best for bookings/slots. SQLite is zero-config for starting. |
| **Calendar** | Google Calendar API | Acts as the "Cloud Bridge". iOS Calendar subscribes to this. Easier to code against than iCloud directly. |
| **Meeting** | Zoom/Teams API | For generating dynamic meeting links upon approval. |
| **Security** | Python-Jose (JWT) | For generating secure, time-sensitive access tokens. |

---

## 3. Design System ("The Carbon Look")

* **Color Palette:**
    * **Background:** Deep Asphalt (`#111111`) - *Not pure black, reduces eye strain.*
    * **Primary Accent:** Neon Cyan (`#00FFFF`) - *For "Book Now" buttons and active states.*
    * **Secondary Accent:** Safety Orange (`#FF9900`) - *For alerts or "Pending" statuses.*
    * **Text:** Off-White (`#E0E0E0`) - *High contrast sans-serif.*
* **UI Components:**
    * **Glassmorphism:** Semi-transparent containers with blur effects (`backdrop-filter: blur`).
    * **Speed Lines:** Subtle CSS gradients or SVG backgrounds to imply motion.
    * **HUD Layout:** Navigation and status indicators positioned like a game Heads-Up Display.

---

## 4. Database Schema (Draft)

### Table: `booking_requests`
*Stores the incoming requests from users.*

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `name` | String | Requestor's name |
| `email` | String | Requestor's email |
| `topic` | String | Reason for meeting |
| `requested_slot` | DateTime | The specific time slot requested |
| `status` | Enum | `PENDING`, `APPROVED`, `REJECTED` |
| `meeting_link` | String | Populated only after approval |
| `token_used` | String | (Optional) Records if a VIP token was used |
| `ip_address` | String | For security/blocking |
| `created_at` | DateTime | Timestamp of request |

### Table: `availability_rules`
*Defines when you are theoretically free.*

| Column | Type | Description |
| :--- | :--- | :--- |
| `day_of_week` | Integer | 0=Monday, 6=Sunday |
| `start_time` | Time | e.g., 09:00 |
| `end_time` | Time | e.g., 17:00 |
| `is_public` | Boolean | If `False`, only visible via valid VIP token |

---

## 5. System Logic & Data Flow

### A. The Public Booking Flow
1.  **Fetch Slots:** User opens "Book" tab -> Frontend requests `GET /api/slots`.
2.  **Calculation:** Backend checks `availability_rules` (Public only) AND queries Live Calendar for conflicts.
3.  **Submission:** User fills form -> `POST /api/request`.
4.  **Security Check:** Backend checks Rate Limit (IP based) & Turnstile CAPTCHA.
5.  **Storage:** Request saved as `PENDING`.
6.  **Notification:** You receive an email/Discord ping about a new request.

### B. The Admin/Approval Flow
1.  **Auth:** You access `/admin` and login (JWT Authentication).
2.  **Review:** You see a list of Pending requests.
3.  **Action - Approve:**
    * Event created in Google Calendar (Syncs to your Phone).
    * Zoom/Teams link generated via API.
    * Email sent to user with the link.
    * Status updates to `APPROVED`.
4.  **Action - Reject:**
    * Status updates to `REJECTED`.
    * Polite "Slot no longer available" email sent to user.

### C. The "VIP Link" Logic (Secure Time-Limited Access)
1.  **Generation:** Admin Dashboard -> Click "Generate VIP Link".
    * Backend creates a JWT containing `{"type": "vip", "exp": <now + 15 mins>}`.
    * Backend returns URL: `.../book?token=xyz...`
2.  **Access:** Friend opens link.
3.  **Validation:** Frontend sends token to `GET /api/slots`.
    * Backend decodes token.
    * **Check 1:** Is signature valid?
    * **Check 2:** Is `exp` time in the future?
4.  **Result:** If valid, Backend returns *extended* availability slots (evenings/weekends). If expired, it defaults to Public slots only (or error).

---

## 6. Implementation Roadmap

### Phase 1: The Shell (Frontend Focus)
* [x] Initialize React + Vite project.
* [x] Configure Tailwind CSS.
* [x] Build "Landing Page" (Portfolio) with dummy data.
* [x] Build "Booking Modal" (The Form) with dummy data.

### Phase 2: The Engine (Backend Focus)
* [ ] Initialize FastAPI.
* [ ] Set up Database (SQLite/Postgres).
* [ ] Create API endpoints for fetching slots.
* [ ] **Implement JWT Token generation and validation logic.**

### Phase 3: The Connection
* [ ] Connect Frontend Form to Backend API.
* [ ] Implement Rate Limiting.
* [ ] Implement Admin Dashboard Login.

### Phase 4: Integrations (The Complex Part)
* [ ] Google Calendar API setup (for conflict checking).
* [ ] Email sending capability (SMTP).
* [ ] (Optional) Zoom/Teams API automation.