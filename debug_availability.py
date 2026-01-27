import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from backend.gcal import get_service, fetch_events_from_calendar

# Load your configuration
load_dotenv("backend/.env")

UQ_IDS = os.getenv("EXTRA_CALENDAR_IDS", "").split(",")
KEYWORDS = os.getenv("BUFFER_KEYWORDS", "").lower().split(",")
COLORS = os.getenv("BUFFER_COLOR_IDS", "").split(",")

def scan_tomorrow():
    service = get_service()
    if not service:
        print("❌ Could not connect to Google Calendar.")
        return

    # Define "Tomorrow"
    tomorrow = datetime.now() + timedelta(days=1)
    t_start = tomorrow.replace(hour=0, minute=0, second=0).isoformat() + "Z"
    t_end = tomorrow.replace(hour=23, minute=59, second=59).isoformat() + "Z"
    
    print(f"\n🔎 SCANNING FOR: {tomorrow.strftime('%Y-%m-%d')}")
    print(f"🎯 Keywords: {KEYWORDS}")
    print(f"🎨 Color IDs: {COLORS}")
    print("-" * 50)

    # List of calendars to check
    calendars = ['primary'] + [c.strip() for c in UQ_IDS if c.strip()]

    total_events = 0

    for cal_id in calendars:
        print(f"\n📅 Checking Calendar ID: {cal_id[:30]}...")
        events = fetch_events_from_calendar(service, cal_id, t_start, t_end)
        
        if not events:
            print("   (No events found)")
            continue

        for event in events:
            total_events += 1
            summary = event.get('summary', 'No Title')
            color = event.get('colorId', 'None')
            start = event['start'].get('dateTime', event['start'].get('date'))
            
            # CHECK LOGIC
            is_hit = False
            reason = []
            
            # Check Keyword
            for word in KEYWORDS:
                if word in summary.lower():
                    is_hit = True
                    reason.append(f"Keyword match: '{word}'")
            
            # Check Color
            if color in COLORS:
                is_hit = True
                reason.append(f"Color match: ID {color}")

            # PRINT RESULT
            status = "🛡️ BLOCKED (+1hr Buffer)" if is_hit else "✅ FREE (Ignored)"
            print(f"   • [{start[11:16]}] {summary} (Color: {color})")
            print(f"     -> STATUS: {status}")
            if is_hit:
                print(f"     -> REASON: {', '.join(reason)}")

    print("-" * 50)
    print(f"DONE. Found {total_events} events total.")

if __name__ == "__main__":
    scan_tomorrow()