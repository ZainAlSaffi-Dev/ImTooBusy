import sqlite3

def patch():
    conn = sqlite3.connect('carbon.db')
    print("conntected")
    cursor = conn.cursor()
    
    try:
        # Add 'location_type' column (ONLINE or IN_PERSON)
        cursor.execute("ALTER TABLE bookings ADD COLUMN location_type TEXT DEFAULT 'ONLINE'")
        print("✅ Added 'location_type' column.")
    except Exception as e:
        print(f"ℹ️ 'location_type' check: {e}")

    try:
        # Add 'location_details' column (Address or "Zoom")
        cursor.execute("ALTER TABLE bookings ADD COLUMN location_details TEXT DEFAULT ''")
        print("✅ Added 'location_details' column.")
    except Exception as e:
        print(f"ℹ️ 'location_details' check: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch()