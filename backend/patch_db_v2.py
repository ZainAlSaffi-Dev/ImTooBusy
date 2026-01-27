import sqlite3

def patch():
    conn = sqlite3.connect('carbon.db')
    cursor = conn.cursor()
    
    try:
        # Add 'google_event_id' column to track GCal events
        cursor.execute("ALTER TABLE bookings ADD COLUMN google_event_id TEXT DEFAULT NULL")
        print("✅ Added 'google_event_id' column.")
    except Exception as e:
        print(f"ℹ️ Column check: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch()