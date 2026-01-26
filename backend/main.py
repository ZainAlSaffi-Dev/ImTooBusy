from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import database
import pytz

app = FastAPI()
AEST = pytz.timezone('Australia/Brisbane')
STANDARD_HOURS = {"start": 9, "end": 17}
EXTENDED_HOURS = {"start": 7, "end": 21}

@app.on_event("startup")
def startup(): database.init_db()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class MeetingRequest(BaseModel):
    name: str; email: str; topic: str; slot_iso: str; duration: int

class StatusUpdate(BaseModel): status: str

class CancelRequest(BaseModel):
    reason: str
    block_slot: bool 

def get_slots_for_day(date_obj, start_hour, end_hour, interval_minutes):
    slots = []
    # Ensure date_obj is set to the correct start hour
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
        b_naive = datetime.strptime(f"{b['date']} {b['time']}", "%Y-%m-%d %H:%M")
        b_start = AEST.localize(b_naive)
        b_end = b_start + timedelta(minutes=b['duration'])
        if slot_start < b_end and slot_end > b_start: return True
    return False

@app.post("/api/request-meeting")
def create_meeting(request: MeetingRequest):
    dt = datetime.fromisoformat(request.slot_iso)
    dt_aest = dt.astimezone(AEST)
    
    # DOUBLE CHECK: Prevent backend submission of past dates even if frontend is bypassed
    if dt_aest < datetime.now(AEST):
        raise HTTPException(status_code=400, detail="Cannot book in the past")

    database.add_booking(request.name, request.email, request.topic, dt_aest.strftime("%Y-%m-%d"), dt_aest.strftime("%H:%M"), request.duration)
    return {"success": True}

@app.get("/api/availability")
def get_availability(start_date: str, end_date: str, duration: int, mode: str = "standard"):
    bookings = database.get_bookings_for_range(start_date, end_date)
    blocks = database.get_blocks_for_range(start_date, end_date)
    occupied = bookings + blocks
    
    results = {}
    current = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    now_aest = datetime.now(AEST) # Current Server Time

    while current <= end:
        date_aest = AEST.localize(current)
        date_str = date_aest.strftime("%Y-%m-%d")
        
        if mode == 'custom':
            if (date_aest - now_aest).days < 7:
                results[date_str] = [] 
                current += timedelta(days=1); continue
            hours = EXTENDED_HOURS
        else:
            hours = STANDARD_HOURS
            
        candidates = get_slots_for_day(date_aest, hours['start'], hours['end'], 15)
        
        # --- NEW: TIME BARRIER ---
        # Filter out any candidate slot that is in the past
        future_candidates = []
        for s in candidates:
            slot_dt = datetime.fromisoformat(s)
            # We add a 30-minute buffer so people can't book a slot starting 1 minute from now
            if slot_dt > (now_aest + timedelta(minutes=30)):
                future_candidates.append(s)
        # -------------------------

        valid = [s for s in future_candidates if not is_overlapping(s, duration, occupied)]
        results[date_str] = valid
        current += timedelta(days=1)
    return results

@app.get("/api/admin/bookings")
def get_bookings(): return database.get_all_bookings()

@app.patch("/api/admin/bookings/{booking_id}")
def update_status(booking_id: int, update: StatusUpdate):
    database.update_booking_status(booking_id, update.status)
    return {"success": True}

@app.post("/api/admin/cancel/{booking_id}")
def cancel_booking(booking_id: int, req: CancelRequest):
    booking = database.get_booking(booking_id)
    if not booking: raise HTTPException(status_code=404, detail="Booking not found")
    
    database.update_booking_status(booking_id, "CANCELLED")
    
    if req.block_slot:
        start_dt = datetime.strptime(booking['time'], "%H:%M")
        end_dt = start_dt + timedelta(minutes=booking['duration'])
        database.add_block(booking['date'], booking['time'], end_dt.strftime("%H:%M"), f"Cancelled: {req.reason}")
    
    # Mock Email Log
    print(f"--- EMAIL TO {booking['email']}: Meeting Cancelled due to {req.reason} ---")
    
    return {"success": True}