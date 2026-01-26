from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import database
import pytz # TIMEZONE LIBRARY

app = FastAPI()

# --- CONFIGURATION ---
AEST = pytz.timezone('Australia/Brisbane')
STANDARD_HOURS = {"start": 9, "end": 17} # 9am - 5pm AEST
EXTENDED_HOURS = {"start": 7, "end": 21} # 7am - 9pm AEST (Custom Request)

@app.on_event("startup")
def startup():
    database.init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class MeetingRequest(BaseModel):
    name: str
    email: str
    topic: str
    slot_iso: str  # We now accept the exact ISO timestamp string
    duration: int

class StatusUpdate(BaseModel):
    status: str

# --- HELPERS ---
def get_slots_for_day(date_obj, start_hour, end_hour, interval_minutes):
    """Generates ISO timestamps in AEST for a specific day."""
    slots = []
    # Set time to start_hour in AEST
    current = date_obj.replace(hour=start_hour, minute=0, second=0, microsecond=0)
    end_time = date_obj.replace(hour=end_hour, minute=0, second=0, microsecond=0)
    
    while current < end_time:
        # Format as ISO 8601 with Offset (+10:00)
        slots.append(current.isoformat())
        current += timedelta(minutes=interval_minutes)
    return slots

def is_overlapping(slot_iso, duration, bookings):
    """Checks collision using AEST datetime objects."""
    slot_start = datetime.fromisoformat(slot_iso)
    slot_end = slot_start + timedelta(minutes=duration)
    
    for b in bookings:
        # Reconstruct booking time from DB (stored as AEST strings)
        # We need to make it timezone aware to compare with slot_start
        b_naive = datetime.strptime(f"{b['date']} {b['time']}", "%Y-%m-%d %H:%M")
        b_start = AEST.localize(b_naive)
        b_end = b_start + timedelta(minutes=b['duration'])
        
        if slot_start < b_end and slot_end > b_start:
            return True
    return False

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "ONLINE", "system": "ZainOS Temporal Engine (AEST)"}

@app.post("/api/request-meeting")
def create_meeting(request: MeetingRequest):
    # 1. Parse the ISO string back to AEST components for storage
    dt = datetime.fromisoformat(request.slot_iso) # This has timezone info
    
    # Ensure it's AEST (converts if user sent something else, just in case)
    dt_aest = dt.astimezone(AEST)
    
    date_str = dt_aest.strftime("%Y-%m-%d")
    time_str = dt_aest.strftime("%H:%M")
    
    # 2. Save to DB
    database.add_booking(request.name, request.email, request.topic, date_str, time_str, request.duration)
    return {"success": True, "message": "Meeting requested."}

@app.get("/api/admin/bookings")
def get_bookings():
    return database.get_all_bookings()

@app.patch("/api/admin/bookings/{booking_id}")
def update_status(booking_id: int, update: StatusUpdate):
    database.update_booking_status(booking_id, update.status)
    return {"success": True}

@app.get("/api/availability")
def get_availability(start_date: str, end_date: str, duration: int, mode: str = "standard"):
    """
    Returns available slots in ISO format (AEST).
    Frontend converts these to local user time.
    """
    # Get all existing bookings to check conflicts
    bookings_dump = database.get_bookings_for_range(start_date, end_date)
    
    results = {}
    current_date = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    
    # Current time in AEST
    now_aest = datetime.now(AEST)

    while current_date <= end:
        # Create a timezone-aware date object for AEST
        date_aest = AEST.localize(current_date)
        date_str = date_aest.strftime("%Y-%m-%d")
        
        # LOGIC: Hours based on Mode
        if mode == 'custom':
            # ENFORCE 7-DAY NOTICE
            days_diff = (date_aest - now_aest).days
            if days_diff < 7:
                # If less than 7 days, return empty list (Blocked)
                results[date_str] = []
                current_date += timedelta(days=1)
                continue
            
            hours = EXTENDED_HOURS # 7am - 9pm
        else:
            hours = STANDARD_HOURS # 9am - 5pm
            
        # Generate Slots (ISO Strings)
        candidate_slots = get_slots_for_day(date_aest, hours['start'], hours['end'], 15)
        
        valid_slots = []
        for slot in candidate_slots:
            if not is_overlapping(slot, duration, bookings_dump):
                valid_slots.append(slot)
                
        results[date_str] = valid_slots
        current_date += timedelta(days=1)
        
    return results