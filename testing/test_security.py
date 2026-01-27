import requests
import time

BASE_URL = "http://127.0.0.1:8000/api/request-meeting"

def print_result(test_name, status, response):
    icon = "✅" if status == 200 else "🛑" if status == 429 else "⚠️"
    print(f"{icon} [{test_name}] Status: {status} | Response: {response.json()}")

def test_honeypot():
    print("\n--- TEST 1: THE HONEYPOT (BOT TRAP) ---")
    print("Sending request with hidden 'fax_number' field filled...")
    
    payload = {
        "name": "Bad Bot",
        "email": "bot@spam.com",
        "topic": "I want to sell you SEO",
        "slot_iso": "2026-02-15T10:00:00", # Ensure this is a valid future date
        "duration": 30,
        "fax_number": "555-0199" # <--- THE TRAP
    }
    
    try:
        r = requests.post(BASE_URL, json=payload)
        # We EXPECT a 200 OK because we "lie" to the bot
        print_result("Honeypot Attack", r.status_code, r)
        print("👉 CHECK YOUR BACKEND LOGS! You should see '🤖 BOT DETECTED'")
    except Exception as e:
        print(f"❌ Failed: {e}")

def test_rate_limit():
    print("\n--- TEST 2: THE RATE LIMIT (TROLL SHIELD) ---")
    email = f"troll_{int(time.time())}@example.com" # Unique email each run
    print(f"Spamming requests from: {email}")

    # We will try to book 5 times. 
    # The first 3 should succeed (200). The 4th should fail (429).
    for i in range(1, 6):
        payload = {
            "name": f"Troll Request {i}",
            "email": email,
            "topic": "Spamming you...",
            "slot_iso": "2026-02-20T10:00:00",
            "duration": 15
        }
        
        r = requests.post(BASE_URL, json=payload)
        print_result(f"Request #{i}", r.status_code, r)
        
        if r.status_code == 429:
            print("🛡️ SHIELD ACTIVE: Rate limit triggered successfully!")
            return

if __name__ == "__main__":
    # Ensure backend is running first!
    try:
        requests.get("http://127.0.0.1:8000/docs")
    except:
        print("❌ Error: Your backend is not running. Run 'uvicorn main:app --reload' first.")
        exit()

    test_honeypot()
    test_rate_limit()