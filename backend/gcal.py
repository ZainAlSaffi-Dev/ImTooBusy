import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta

# If modifying scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']
CALENDAR_ID = 'primary' # Uses your main calendar

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
                print("⚠️ WARNING: credentials.json not found. Calendar sync skipped.")
                return None
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('calendar', 'v3', credentials=creds)

def get_google_busy_times(start_iso, end_iso):
    """Fetches BUSY slots from Google Calendar to prevent conflicts."""
    service = get_service()
    if not service: return []

    body = {
        "timeMin": start_iso + "Z", # ISO format needs Z for UTC
        "timeMax": end_iso + "Z",
        "items": [{"id": CALENDAR_ID}]
    }
    
    events_result = service.freebusy().query(body=body).execute()
    busy_ranges = events_result['calendars'][CALENDAR_ID]['busy']
    
    # Normalize to our format
    normalized = []
    for item in busy_ranges:
        # Convert Google's ISO to our internal dict format
        start = datetime.fromisoformat(item['start'].replace('Z', ''))
        end = datetime.fromisoformat(item['end'].replace('Z', ''))
        duration = int((end - start).total_seconds() / 60)
        
        normalized.append({
            "date": start.strftime("%Y-%m-%d"),
            "time": start.strftime("%H:%M"),
            "duration": duration,
            "source": "GOOGLE_CAL"
        })
    return normalized

def create_google_event(booking_data):
    """Pushes an APPROVED booking to Google Calendar."""
    service = get_service()
    if not service: return False

    start_dt = datetime.strptime(f"{booking_data['date']} {booking_data['time']}", "%Y-%m-%d %H:%M")
    end_dt = start_dt + timedelta(minutes=booking_data['duration'])

    event = {
        'summary': f"Meeting: {booking_data['name']}",
        'location': 'Online',
        'description': f"Topic: {booking_data['topic']}\nEmail: {booking_data['email']}",
        'start': {
            'dateTime': start_dt.isoformat(),
            'timeZone': 'Australia/Brisbane',
        },
        'end': {
            'dateTime': end_dt.isoformat(),
            'timeZone': 'Australia/Brisbane',
        },
        'attendees': [
            {'email': booking_data['email']},
        ],
    }

    service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
    return True