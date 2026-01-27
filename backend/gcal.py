import os
import os.path
import time
import pytz
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from dotenv import load_dotenv

# --- CONFIG & CACHE SETUP ---
if os.path.exists('.env'):
    load_dotenv('.env')
elif os.path.exists('backend/.env'):
    load_dotenv('backend/.env')

SCOPES = ['https://www.googleapis.com/auth/calendar']
BRISBANE_TZ = pytz.timezone('Australia/Brisbane')

# LOAD CALENDARS
extra_cals_str = os.getenv("EXTRA_CALENDAR_IDS", "")
EXTRA_CALENDAR_IDS = [c.strip() for c in extra_cals_str.split(",") if c.strip()]
BUFFER_KEYWORDS = os.getenv("BUFFER_KEYWORDS", "work,shift,ambassador,class").lower().split(",")
BUFFER_COLOR_IDS = os.getenv("BUFFER_COLOR_IDS", "").split(",")

# ⚡ THE CACHE STORAGE ⚡
_CALENDAR_CACHE = {}
CACHE_DURATION = 300  # 5 Minutes

def clear_cache():
    global _CALENDAR_CACHE
    _CALENDAR_CACHE = {}
    print("🧹 Cache cleared!")

def get_service():
    creds = None
    token_path = 'backend/token.json' if os.path.exists('backend/token.json') else 'token.json'
    cred_path = 'backend/credentials.json' if os.path.exists('backend/credentials.json') else 'credentials.json'

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if os.path.exists(cred_path):
                flow = InstalledAppFlow.from_client_secrets_file(cred_path, SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                return None
        with open(token_path, 'w') as token:
            token.write(creds.to_json())
    return build('calendar', 'v3', credentials=creds)

def fetch_events_from_calendar(service, calendar_id, t_min, t_max):
    try:
        events_result = service.events().list(
            calendarId=calendar_id, 
            timeMin=t_min, 
            timeMax=t_max, 
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        return events_result.get('items', [])
    except Exception as e:
        print(f"⚠️ Failed to fetch from {calendar_id[:15]}...: {e}")
        return []

def get_google_busy_times(start_iso, end_iso):
    # 1. CHECK CACHE
    cache_key = f"{start_iso}_{end_iso}"
    if cache_key in _CALENDAR_CACHE:
        expiry, data = _CALENDAR_CACHE[cache_key]
        if time.time() < expiry:
            print("⚡ USING CACHED DATA")
            return data

    service = get_service()
    if not service: return []

    # Timezone Helper
    def to_utc_iso(iso_str):
        if "T" in iso_str and "Z" not in iso_str:
            dt_naive = datetime.fromisoformat(iso_str)
            dt_brisbane = BRISBANE_TZ.localize(dt_naive)
            dt_utc = dt_brisbane.astimezone(pytz.utc)
            return dt_utc.isoformat().replace("+00:00", "Z")
        return iso_str + "Z"

    t_min = to_utc_iso(start_iso)
    t_max = to_utc_iso(end_iso)

    calendars = ['primary'] + EXTRA_CALENDAR_IDS
    all_events = []
    
    for cal_id in calendars:
        all_events.extend(fetch_events_from_calendar(service, cal_id, t_min, t_max))

    normalized = []
    for event in all_events:
        # 🟢 FIX 1: Respect "Show as Free" (Transparency)
        if event.get('transparency') == 'transparent':
            continue # Skip this event, it is marked as Free

        start_str = event['start'].get('dateTime') or event['start'].get('date')
        end_str = event['end'].get('dateTime') or event['end'].get('date')
        
        try:
            is_all_day = 'T' not in start_str
            
            if not is_all_day:
                dt = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
                start_dt = dt
                end_dt = datetime.fromisoformat(end_str.replace('Z', '+00:00'))
            else:
                # Handle All Day Events (Midnight to Midnight)
                dt_naive = datetime.strptime(start_str, "%Y-%m-%d")
                start_dt = BRISBANE_TZ.localize(dt_naive)
                # Google All-Day ends on the NEXT day 00:00, which is correct
                end_dt_naive = datetime.strptime(end_str, "%Y-%m-%d")
                end_dt = BRISBANE_TZ.localize(end_dt_naive)

        except:
            continue

        # Check Logic
        title = event.get('summary', '').lower()
        color = event.get('colorId', '') 

        is_buffered = False
        if any(w in title for w in BUFFER_KEYWORDS): is_buffered = True
        if color in BUFFER_COLOR_IDS: is_buffered = True

        # 🟢 FIX 2: Only Buffer NON-All-Day events
        # Buffering an all-day event makes it overlap into yesterday/tomorrow
        if is_buffered and not is_all_day:
            start_dt -= timedelta(hours=1)
            end_dt += timedelta(hours=1)

        duration = int((end_dt - start_dt).total_seconds() / 60)
        local_start = start_dt.astimezone(BRISBANE_TZ)

        normalized.append({
            "date": local_start.strftime("%Y-%m-%d"),
            "time": local_start.strftime("%H:%M"),
            "duration": duration,
            "source": "GOOGLE_CAL"
        })
    
    _CALENDAR_CACHE[cache_key] = (time.time() + CACHE_DURATION, normalized)
    return normalized

def create_google_event(booking_data):
    # (Keep this function exactly as it was in your previous version)
    service = get_service()
    if not service: return None
    
    start_dt = BRISBANE_TZ.localize(datetime.strptime(f"{booking_data['date']} {booking_data['time']}", "%Y-%m-%d %H:%M"))
    end_dt = start_dt + timedelta(minutes=booking_data['duration'])
    
    loc = 'Online'
    if booking_data.get('location_type') == 'IN_PERSON':
        loc = booking_data.get('location_details', 'In Person')
    
    link = os.getenv('DEFAULT_MEETING_LINK', 'No Link')

    event = {
        'summary': f"Meeting: {booking_data['name']}",
        'location': loc,
        'description': f"Topic: {booking_data['topic']}\nEmail: {booking_data['email']}\nJoin Link: {link}",
        'start': { 'dateTime': start_dt.isoformat(), 'timeZone': 'Australia/Brisbane' },
        'end': { 'dateTime': end_dt.isoformat(), 'timeZone': 'Australia/Brisbane' },
        'attendees': [ {'email': booking_data['email']} ],
    }

    created = service.events().insert(calendarId='primary', body=event, sendUpdates='all').execute()
    clear_cache()
    return created.get('id')

def delete_google_event(event_id):
    if not event_id: return
    service = get_service()
    if not service: return
    try:
        service.events().delete(calendarId='primary', eventId=event_id).execute()
        clear_cache()
    except Exception as e:
        print(f"⚠️ Failed to delete: {e}")