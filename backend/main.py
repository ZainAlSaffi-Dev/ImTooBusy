import os
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import database
import pytz
import auth
import gcal
import notifications
from typing import Optional
import asyncio
import bot_service

AEST = pytz.timezone('Australia/Brisbane')

# CONFIG
STANDARD_HOURS = {"start": 9, "end": 21}    # Public
FRIEND_HOURS = {"start": 8, "end": 22}      # VIP Link Only

# --- LIFESPAN MANAGER (Replaces on_event) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    print("🚀 System Starting Up...")

    # 1. Restore Google Secrets from Environment (Crucial for Railway Persistence)
    if os.getenv("GOOGLE_CREDENTIALS_JSON"):
        with open("credentials.json", "w") as f:
            f.write(os.getenv("GOOGLE_CREDENTIALS_JSON"))
            print("✅ Restored credentials.json from Environment")
            
    if os.getenv("GOOGLE_TOKEN_JSON"):
        with open("token.json", "w") as f:
            f.write(os.getenv("GOOGLE_TOKEN_JSON"))
            print("✅ Restored token.json from Environment")

    # 2. Initialize Database
    database.init_db()
    
    # 3. Launch Discord Bot in Background
    asyncio.create_task(bot_service.start_bot())
    print("🤖 Discord Bot Service Launched")
    
    yield  # Application runs here
    
    # --- SHUTDOWN LOGIC ---
    print("🛑 System Shutting Down...")

app = FastAPI(lifespan=lifespan)

# Add your production domains here
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://zainalsaffi.com",
    "https://www.zainalsaffi.com",
    "http://www.zainalsaffi.com/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST MODELS ---
class AdminLoginRequest(BaseModel):
    password: str

class MeetingRequest(BaseModel):
    name: str
    email: str
    topic: str
    slot_iso: str
    duration: int
    token: Optional[str] = None  
    location_type: str = "ONLINE"     
    location_details: str = ""
    fax_number: Optional[str] = None   

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

@app.post("/api/request-meeting")
async def create_meeting(request: MeetingRequest, req: Request):
    
    # --- SECURITY LEVEL 0: IP CHECK ---
    client_ip = req.client.host
    if database.is_ip_banned(client_ip):
         raise HTTPException(status_code=403, detail="Your access has been restricted.")

    # --- SECURITY LEVEL 1: HONEYPOT (BOT TRAP) ---
    if request.fax_number:
        print(f"🤖 BOT DETECTED: {request.email} from {client_ip}")
        database.ban_ip(client_ip, "Honeypot Triggered", duration_minutes=5256000)
        deleted = database.wipe_troll_requests(request.email)
        print(f"💥 Nuclear Option: Deleted {deleted} requests from {request.email}")
        return {"success": True} 

    # --- SECURITY LEVEL 2: TROLL SHIELD ---
    is_friend = request.token and auth.verify_friend_token(request.token)
    
    if not is_friend:
        stats = database.check_spam_stats(request.email)
        if stats['pending'] >= 3:
            raise HTTPException(status_code=429, detail="Too many pending requests.")
        if stats['rejected'] >= 3:
            database.ban_ip(client_ip, "Troll Shield (3 Rejections)", duration_minutes=1440)
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again in 24 hours.")

    dt = datetime.fromisoformat(request.slot_iso)
    dt_aest = dt.astimezone(AEST)
    
    if dt_aest < datetime.now(AEST):
        raise HTTPException(status_code=400, detail="Cannot book in the past")

    final_topic = request.topic
    if request.token and auth.verify_friend_token(request.token):
        final_topic = f"⚡ [FRIEND] {request.topic}"

    # 1. Save to DB
    database.add_booking(
        request.name, 
        request.email, 
        final_topic, 
        dt_aest.strftime("%Y-%m-%d"), 
        dt_aest.strftime("%H:%M"), 
        request.duration,
        request.location_type,
        request.location_details
    )
    
    # 2. Get ID
    conn = database.sqlite3.connect(database.DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT seq FROM sqlite_sequence WHERE name='bookings'")
    new_id = cursor.fetchone()[0]
    conn.close()

    # 3. Send Interactive Alert via Discord Bot (SAFE MODE)
    booking_data = {
        "name": request.name,
        "email": request.email,
        "topic": final_topic,
        "date": dt_aest.strftime("%Y-%m-%d"),
        "time": dt_aest.strftime("%H:%M"),
        "location_type": request.location_type,
        "location_details": request.location_details
    }
    
    try:
        await bot_service.bot_instance.send_booking_request(booking_data, new_id)
    except Exception as e:
        print(f"⚠️ Notification System Error: {e}")

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
    
    # Public = 24 Hours Notice. Friends = 30 Minutes Notice.
    notice_buffer = timedelta(hours=24) if not is_friend else timedelta(minutes=30)
    earliest_booking_time = now_aest + notice_buffer

    while current <= end:
        date_aest = AEST.localize(current)
        date_str = date_aest.strftime("%Y-%m-%d")
        
        candidates = get_slots_for_day(date_aest, hours['start'], hours['end'], 15)
        
        # Time Barrier & Notice Period Check
        future_candidates = []
        for s in candidates:
            slot_dt = datetime.fromisoformat(s)
            if slot_dt > earliest_booking_time:
                future_candidates.append(s)

        valid = [s for s in future_candidates if not is_overlapping(s, duration, occupied)]
        results[date_str] = valid
        current += timedelta(days=1)
    return results


@app.patch("/api/admin/bookings/{booking_id}")
def update_status(booking_id: int, update: StatusUpdate):
    database.update_booking_status(booking_id, update.status)
    booking = database.get_booking(booking_id)

    if update.status == "ACCEPTED":
        # 1. Create Google Event & Save ID
        event_id = gcal.create_google_event(booking)
        if event_id:
            database.update_google_event_id(booking_id, event_id)
            
        notifications.send_acceptance_email(booking)
        
    elif update.status == "REJECTED":
        notifications.send_rejection_email(booking)
        
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
    
    # 1. Delete from Google Calendar if it exists
    if booking.get('google_event_id'):
        gcal.delete_google_event(booking['google_event_id'])

    # 2. Block the slot locally if requested
    if req.block_slot:
        start_dt = datetime.strptime(booking['time'], "%H:%M")
        end_dt = start_dt + timedelta(minutes=booking['duration'])
        database.add_block(booking['date'], booking['time'], end_dt.strftime("%H:%M"), f"Cancelled: {req.reason}")
    
    return {"success": True}

@app.post("/api/admin/generate-friend-link")
def generate_link():
    token = auth.create_friend_token()
    return {"link": f"https://zainalsaffi.com/?token={token}"} # UPDATED TO PRODUCTION DOMAIN

# 2. Add the Login Endpoint
@app.post("/api/admin/login")
def admin_login(req: AdminLoginRequest):
    if auth.verify_admin_password(req.password):
        return {"success": True}
    else:
        raise HTTPException(status_code=401, detail="Invalid Password")