import sqlite3
from datetime import datetime

DB_NAME = "carbon.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # 1. Bookings Table (Updated with duration)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            topic TEXT NOT NULL,
            date TEXT NOT NULL,    -- YYYY-MM-DD
            time TEXT NOT NULL,    -- HH:MM
            duration INTEGER NOT NULL, -- Minutes (15, 30, 60)
            status TEXT DEFAULT 'PENDING',
            created_at TEXT
        )
    ''')
    
    # 2. Blocked Time (For when you simply aren't free)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            reason TEXT
        )
    ''')

    conn.commit()
    conn.close()
    print("[DATABASE] Calendly-Engine Initialized.")

# --- BOOKING FUNCTIONS ---
def add_booking(name, email, topic, date, time, duration):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO bookings (name, email, topic, date, time, duration, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (name, email, topic, date, time, duration, created_at))
    
    conn.commit()
    conn.close()

def get_all_bookings():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings ORDER BY date DESC, time ASC')
    rows = cursor.fetchall()
    conn.close()
    return [{
        "id": r[0], "name": r[1], "email": r[2], "topic": r[3], 
        "date": r[4], "time": r[5], "duration": r[6], "status": r[7], "created_at": r[8]
    } for r in rows]

def get_bookings_for_range(start_date, end_date):
    """Get all bookings in a date range to calculate conflicts."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT date, time, duration FROM bookings 
        WHERE date >= ? AND date <= ? AND status != 'REJECTED'
    ''', (start_date, end_date))
    rows = cursor.fetchall()
    conn.close()
    return [{"date": r[0], "time": r[1], "duration": r[2]} for r in rows]

def update_booking_status(booking_id, new_status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('UPDATE bookings SET status = ? WHERE id = ?', (new_status, booking_id))
    conn.commit()
    conn.close()