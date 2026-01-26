from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import database  # <--- IMPORT YOUR NEW FILE

app = FastAPI()

# 1. Initialize DB on startup
@app.on_event("startup")
def startup():
    database.init_db()

# Security (CORS) - Keep this the same
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MeetingRequest(BaseModel):
    name: str
    email: str
    topic: str
    time: str

@app.get("/")
def health_check():
    return {"status": "ONLINE", "system": "ZainOS Backend v1.1 (Persistent)"}

@app.post("/api/request-meeting")
def create_meeting(request: MeetingRequest):
    print(f"\n[INCOMING] {request.name} requesting {request.time}")
    
    # SAVE TO DATABASE
    database.add_booking(request.name, request.email, request.topic, request.time)

    return {
        "success": True, 
        "message": "Packet Encrypted & Archived in Sector 7 (SQLite)."
    }

@app.get("/api/admin/logs")
def view_logs():
    # FETCH FROM DATABASE
    logs = database.get_all_bookings()
    return {"total_requests": len(logs), "logs": logs}