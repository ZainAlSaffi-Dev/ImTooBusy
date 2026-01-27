from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import database
import pytz
import auth
import gcal # NEW IMPORT

app = FastAPI()
AEST = pytz.timezone('Australia/Brisbane')

# CONFIG
STANDARD_HOURS = {"start": 9, "end": 17}    # Public
FRIEND_HOURS = {"start": 8, "end": 22}      # VIP Link Only

@app.on_event("startup")
def startup(): database.init_db()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class AdminLoginRequest(BaseModel):
    password: str

class MeetingRequest(BaseModel):
    name: str
    email: str
    topic: str
    slot_iso: str
    duration: int
    token: str = None  # NEW: Optional token field

class StatusUpdate(BaseModel): status: str

class CancelRequest(BaseModel):
    reason: str; block_slot: bool 

# --- HELPER FUNCTIONS ---

def get_slots_for_day(date_obj, start_hour, end_hour, interval_minutes):
    slots = []
    current = date_obj.replace(hour=start_hour, minute=0, second=0, microsecond=0)
    end_time = date_obj.replace(hour=end_hour, minute=0, second=0, microsecond=0)
    while current < end_time:
        slots.append(current.isoformat())
        current += timedelta(minutes=interval_minutes)
    return slots

def is_overlapping(slot_iso, duration, occupied_slots):
    slot_start = datetime.fromisoformat(slot_iso)
    slot_end = slot_start + timedelta(minutes=duration)
    for b in occupied_slots:
        # Handle Google Cal vs Local DB format differences
        try:
            b_naive = datetime.strptime(f"{b['date']} {b['time']}", "%Y-%m-%d %H:%M")
            b_start = AEST.localize(b_naive)
            b_end = b_start + timedelta(minutes=b['duration'])
            if slot_start < b_end and slot_end > b_start: return True
        except:
            continue
    return False

# --- API ENDPOINTS ---

# UPDATE 2: Update the Endpoint logic
@app.post("/api/request-meeting")
def create_meeting(request: MeetingRequest):
    dt = datetime.fromisoformat(request.slot_iso)
    dt_aest = dt.astimezone(AEST)
    
    # 1. Check for Past Dates (Time Travel Prevention)
    if dt_aest < datetime.now(AEST):
        raise HTTPException(status_code=400, detail="Cannot book in the past")

    # 2. Handle Friend Logic
    final_topic = request.topic
    if request.token and auth.verify_friend_token(request.token):
        final_topic = f"⚡ [FRIEND] {request.topic}"  # Add the tag!
    
    # 3. Save to DB
    database.add_booking(
        request.name, 
        request.email, 
        final_topic, 
        dt_aest.strftime("%Y-%m-%d"), 
        dt_aest.strftime("%H:%M"), 
        request.duration
    )
    return {"success": True}

@app.get("/api/availability")
def get_availability(start_date: str, end_date: str, duration: int, token: str = None):
    # 1. Determine User Type (Public vs Friend)
    is_friend = False
    if token:
        is_friend = auth.verify_friend_token(token)
    
    hours = FRIEND_HOURS if is_friend else STANDARD_HOURS

    # 2. Fetch ALL Sources of "Busy"
    local_bookings = database.get_bookings_for_range(start_date, end_date)
    local_blocks = database.get_blocks_for_range(start_date, end_date)
    google_busy = gcal.get_google_busy_times(start_date + "T00:00:00", end_date + "T23:59:59")
    
    occupied = local_bookings + local_blocks + google_busy
    
    results = {}
    current = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    now_aest = datetime.now(AEST)

    while current <= end:
        date_aest = AEST.localize(current)
        date_str = date_aest.strftime("%Y-%m-%d")
        
        # Public Users: 7 Day Notice Rule. Friends: No notice rule.
        if not is_friend and (date_aest - now_aest).days < 7:
            # If public, skip days too soon
            # results[date_str] = [] -- Optional: Don't even return them
            pass 
        
        candidates = get_slots_for_day(date_aest, hours['start'], hours['end'], 15)
        
        # Time Barrier
        future_candidates = []
        for s in candidates:
            slot_dt = datetime.fromisoformat(s)
            if slot_dt > (now_aest + timedelta(minutes=30)):
                future_candidates.append(s)

        valid = [s for s in future_candidates if not is_overlapping(s, duration, occupied)]
        results[date_str] = valid
        current += timedelta(days=1)
    return results

@app.patch("/api/admin/bookings/{booking_id}")
def update_status(booking_id: int, update: StatusUpdate):
    database.update_booking_status(booking_id, update.status)
    
    # SYNC: If Approved, push to Google Calendar
    if update.status == "ACCEPTED":
        booking = database.get_booking(booking_id)
        gcal.create_google_event(booking)
        
    return {"success": True}

@app.get("/api/admin/bookings")
def get_bookings(): return database.get_all_bookings()

@app.get("/api/admin/blocks")
def get_blocks(): return database.get_all_blocks()

@app.delete("/api/admin/blocks/{block_id}")
def unblock_slot(block_id: int): database.delete_block(block_id); return {"success": True}

@app.post("/api/admin/cancel/{booking_id}")
def cancel_booking(booking_id: int, req: CancelRequest):
    booking = database.get_booking(booking_id)
    if not booking: raise HTTPException(status_code=404, detail="Booking not found")
    
    database.update_booking_status(booking_id, "CANCELLED")
    
    if req.block_slot:
        start_dt = datetime.strptime(booking['time'], "%H:%M")
        end_dt = start_dt + timedelta(minutes=booking['duration'])
        database.add_block(booking['date'], booking['time'], end_dt.strftime("%H:%M"), f"Cancelled: {req.reason}")
    
    return {"success": True}

## Freud Link
@app.post("/api/admin/generate-friend-link")
def generate_link():
    token = auth.create_friend_token()
    return {"link": f"http://localhost:5173/?token={token}"}


# 2. Add the Login Endpoint
@app.post("/api/admin/login")
def admin_login(req: AdminLoginRequest):
    if auth.verify_admin_password(req.password):
        return {"success": True}
    else:
        raise HTTPException(status_code=401, detail="Invalid Password")