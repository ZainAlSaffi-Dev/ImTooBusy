import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta

SCOPES = ['https://www.googleapis.com/auth/calendar']
CALENDAR_ID = 'primary' 

def get_service():
    """Authenticates with Google and returns the API Service."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if os.path.exists('credentials.json'):
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                return None
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('calendar', 'v3', credentials=creds)

def get_google_busy_times(start_iso, end_iso):
    """
    Fetches events to determine busy slots.
    SMART FEATURE: If event title contains "Work", adds 1hr buffer before/after.
    """
    service = get_service()
    if not service: return []

    # Convert to RFC3339 format for Google
    t_min = start_iso + "Z"
    t_max = end_iso + "Z"

    # We use events().list instead of freebusy to read the titles ("Work")
    events_result = service.events().list(
        calendarId=CALENDAR_ID, 
        timeMin=t_min, 
        timeMax=t_max, 
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    
    events = events_result.get('items', [])
    normalized = []

    for event in events:
        start_str = event['start'].get('dateTime') or event['start'].get('date')
        end_str = event['end'].get('dateTime') or event['end'].get('date')
        
        # Handle Full Day events (YYYY-MM-DD) vs Time events (ISO)
        try:
            if 'T' in start_str:
                start_dt = datetime.fromisoformat(start_str.replace('Z', ''))
                end_dt = datetime.fromisoformat(end_str.replace('Z', ''))
            else:
                start_dt = datetime.strptime(start_str, "%Y-%m-%d")
                end_dt = datetime.strptime(end_str, "%Y-%m-%d")
        except:
            continue

        # SMART BUFFER LOGIC
        summary = event.get('summary', '').lower()
        if "work" in summary:
            # Add 1 hour buffer before and after
            start_dt -= timedelta(hours=1)
            end_dt += timedelta(hours=1)
            print(f"🛡️ WORK DETECTED: Added 1hr buffer around '{event.get('summary')}'")

        duration = int((end_dt - start_dt).total_seconds() / 60)
        
        normalized.append({
            "date": start_dt.strftime("%Y-%m-%d"),
            "time": start_dt.strftime("%H:%M"),
            "duration": duration,
            "source": "GOOGLE_CAL"
        })
        
    return normalized

def create_google_event(booking_data):
    """Pushes booking to GCal and returns the Event ID."""
    service = get_service()
    if not service: return None

    start_dt = datetime.strptime(f"{booking_data['date']} {booking_data['time']}", "%Y-%m-%d %H:%M")
    end_dt = start_dt + timedelta(minutes=booking_data['duration'])

    event = {
        'summary': f"Meeting: {booking_data['name']}",
        'location': booking_data.get('location_details', 'Online') if booking_data.get('location_type') == 'IN_PERSON' else 'Online',
        'description': f"Topic: {booking_data['topic']}\nEmail: {booking_data['email']}\nJoin Link: {os.getenv('DEFAULT_MEETING_LINK')}",
        'start': { 'dateTime': start_dt.isoformat(), 'timeZone': 'Australia/Brisbane' },
        'end': { 'dateTime': end_dt.isoformat(), 'timeZone': 'Australia/Brisbane' },
        'attendees': [ {'email': booking_data['email']} ],
    }

    
    # We added sendUpdates='all' to force Google to send the email invite
    created_event = service.events().insert(
        calendarId=CALENDAR_ID, 
        body=event, 
        sendUpdates='all' 
    ).execute()
    
    return created_event.get('id')

def delete_google_event(event_id):
    """Removes the event from Google Calendar if we cancel/ban."""
    if not event_id: return
    service = get_service()
    if not service: return

    try:
        service.events().delete(calendarId=CALENDAR_ID, eventId=event_id).execute()
        print(f"🗑️ Deleted Google Event: {event_id}")
    except Exception as e:
        print(f"⚠️ Failed to delete Google Event: {e}")