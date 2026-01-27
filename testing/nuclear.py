import requests
import time
import os

# URL of your backend
URL = "http://127.0.0.1:8000/api/request-meeting"

def run_test():
    print("🧪 STARTING NUCLEAR TEST...\n")

    # --- PHASE 1: TRIGGER THE TRAP ---
    print("1️⃣  Sending HONEYPOT request (This should BAN you)...")
    payload_trap = {
        "name": "Botty McBotFace",
        "email": "bot@banned.com",
        "topic": "Scamming you",
        "slot_iso": "2026-05-20T10:00:00",
        "duration": 30,
        "fax_number": "555-666-7777" # <--- THE TRIGGER
    }
    
    try:
        r = requests.post(URL, json=payload_trap)
        # We expect 200 OK because we "lie" to the bot
        if r.status_code == 200:
            print(f"✅ TRAP SPRUNG: Backend returned 200 OK (The Lie).")
        else:
            print(f"❌ TEST FAILED: Backend returned {r.status_code}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # --- PHASE 2: VERIFY THE BAN ---
    print("\n2️⃣  Verifying Ban (Sending a normal request)...")
    payload_normal = {
        "name": "Innocent User",
        "email": "innocent@gmail.com",
        "topic": "Please let me in",
        "slot_iso": "2026-05-21T10:00:00",
        "duration": 30
    }
    
    try:
        r = requests.post(URL, json=payload_normal)
        if r.status_code == 403:
            print("✅ SYSTEM SECURE: You are successfully BLOCKED (403 Forbidden).")
            print(f"   Server Message: {r.json()['detail']}")
        else:
            print(f"❌ FAILURE: You are NOT banned! Status Code: {r.status_code}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")

    # --- PHASE 3: THE RESCUE ---
    print("\n3️⃣  Running Rescue Script...")
    # Run the rescue script inside the backend folder
    os.system("python3 backend/rescue.py")
    
    # --- PHASE 4: VERIFY FREEDOM ---
    print("\n4️⃣  Verifying Unban...")
    try:
        r = requests.post(URL, json=payload_normal)
        if r.status_code == 200:
            print("✅ FREEDOM: You can book again.")
        else:
            print(f"❌ STILL BANNED: Status {r.status_code}")
    except:
        pass

if __name__ == "__main__":
    run_test()