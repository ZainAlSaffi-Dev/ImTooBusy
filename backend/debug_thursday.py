# debug_thursday.py
import os
from datetime import datetime, timedelta
import pytz
from dotenv import load_dotenv
from gcal import get_service, fetch_events_from_calendar

load_dotenv(".env")

# 1. Setup Timezones
BRISBANE = pytz.timezone('Australia/Brisbane')
UTC = pytz.utc

def check_thursday_logic():
    service = get_service()
    if not service:
        print("❌ Connect Failed")
        return

    # 2. Target "This Thursday"
    today = datetime.now(BRISBANE)
    # Calculate days until Thursday (3 = Thursday in Python's 0-6 scale)
    days_ahead = (3 - today.weekday() + 7) % 7
    if days_ahead == 0: days_ahead = 7 # If today is Thursday, check next week
    
    target_date = today + timedelta(days=days_ahead)
    t_start = target_date.replace(hour=0, minute=0).astimezone(UTC).isoformat()
    t_end = target_date.replace(hour=23, minute=59).astimezone(UTC).isoformat()

    print(f"\n🔎 INSPECTING THURSDAY: {target_date.strftime('%Y-%m-%d')}")
    print(f"   (Querying UTC: {t_start} to {t_end})\n")

    events = fetch_events_from_calendar(service, 'primary', t_start, t_end)
    
    print(f"{'TIME (RAW)':<25} | {'TIME (CONVERTED AEST)':<25} | {'SUMMARY'}")
    print("-" * 80)

    for event in events:
        start_raw = event['start'].get('dateTime', event['start'].get('date'))
        summary = event.get('summary', 'No Title')

        # 3. Simulate the Logic from gcal.py
        try:
            if 'T' in start_raw:
                # RAW PARSE
                dt_raw = datetime.fromisoformat(start_raw.replace('Z', '+00:00'))
                # CONVERT
                dt_local = dt_raw.astimezone(BRISBANE)
                
                raw_str = start_raw[:19] + "..."
                local_str = dt_local.strftime("%H:%M")
                
                print(f"{raw_str:<25} | {local_str:<25} | {summary}")
            else:
                print(f"{start_raw:<25} | {'ALL DAY':<25} | {summary}")

        except Exception as e:
            print(f"Error parsing {summary}: {e}")

if __name__ == "__main__":
    check_thursday_logic()