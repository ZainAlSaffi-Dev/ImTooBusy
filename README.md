# ImTooBusy — Portfolio of Zain Al-Saffi

My personal portfolio website, built to showcase my experience, projects, and provide a way for people to book time on my calendar — because I'm too busy to coordinate manually.

**Live site:** [imtoobusy.dev](https://imtoobusy.dev) *(or wherever you're hosting it)*

---

## Overview

**ImTooBusy** is a full-stack portfolio with a built-in scheduling system. The frontend is a sleek, dark-themed single-page app with smooth animations and an interactive terminal gate. The backend handles real-time availability by syncing with Google Calendar, so visitors can book meetings directly.

### Key Features

- **Animated Hero** — typing animation cycling through roles and titles
- **Terminal Gate** — an interactive terminal challenge that unlocks the About section
- **Experience Feed** — a timeline of work experience and involvement
- **Projects Showcase** — highlighted personal and professional projects
- **Live Booking System** — checks real-time Google Calendar availability and lets visitors book slots
- **Admin Dashboard** — protected route for managing bookings and settings
- **Discord Bot** — notifications and control via a Discord bot integration
- **Contact Section** — easy ways to get in touch

---

## Tech Stack

### Frontend (`carbon-calendar/`)

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| React Router | Client-side routing |
| React Type Animation | Typing effect in hero |
| Lucide React | Icons |

### Backend (`backend/`)

| Technology | Purpose |
|---|---|
| FastAPI | API framework |
| Google Calendar API | Real-time availability & booking |
| Discord.py | Bot for notifications & control |
| Python-Jose | JWT authentication |
| Pydantic | Data validation |
| Uvicorn | ASGI server |

### Deployment

- **Frontend** — Vercel
- **Backend** — Railway

---

## Project Structure

```
ImTooBusy/
├── carbon-calendar/          # React frontend
│   ├── src/
│   │   ├── components/       # UI components (Hero, About, Projects, etc.)
│   │   ├── App.jsx           # Main app with routing
│   │   └── config.js         # Frontend config
│   └── public/               # Static assets & logos
├── backend/                  # FastAPI backend
│   ├── main.py               # API routes & server
│   ├── gcal.py               # Google Calendar integration
│   ├── database.py           # Database layer
│   ├── auth.py               # JWT authentication
│   ├── bot_service.py        # Discord bot
│   └── notifications.py      # Notification system
└── testing/                  # Test scripts
```

---

## Getting Started

### Frontend

```bash
cd carbon-calendar
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

> **Note:** The backend requires a `.env` file with Google Calendar credentials, Discord bot token, and other secrets. See the backend directory for details.

---

## License

MIT — see [LICENSE](LICENSE) for details.
