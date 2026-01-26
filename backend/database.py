import sqlite3
from datetime import datetime

DB_NAME = "carbon.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            topic TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            duration INTEGER NOT NULL,
            status TEXT DEFAULT 'PENDING',
            created_at TEXT
        )
    ''')
    
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

def add_booking(name, email, topic, date, time, duration):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    cursor.execute('INSERT INTO bookings (name, email, topic, date, time, duration, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', (name, email, topic, date, time, duration, created_at))
    conn.commit()
    conn.close()

# UPDATED: Filters out CANCELLED/REJECTED so slots open up naturally
def get_bookings_for_range(start_date, end_date):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT date, time, duration FROM bookings WHERE date >= ? AND date <= ? AND status NOT IN ('REJECTED', 'CANCELLED')", (start_date, end_date))
    rows = cursor.fetchall()
    conn.close()
    return [{"date": r[0], "time": r[1], "duration": r[2]} for r in rows]

# NEW: Fetches blocks and normalizes them to look like bookings (start + duration)
def get_blocks_for_range(start_date, end_date):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT date, start_time, end_time FROM blocks WHERE date >= ? AND date <= ?", (start_date, end_date))
    rows = cursor.fetchall()
    conn.close()
    
    normalized_blocks = []
    for r in rows:
        fmt = "%H:%M"
        t1 = datetime.strptime(r[1], fmt)
        t2 = datetime.strptime(r[2], fmt)
        duration_mins = int((t2 - t1).total_seconds() / 60)
        normalized_blocks.append({"date": r[0], "time": r[1], "duration": duration_mins})
        
    return normalized_blocks

def get_all_bookings():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings ORDER BY date DESC, time ASC')
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "name": r[1], "email": r[2], "topic": r[3], "date": r[4], "time": r[5], "duration": r[6], "status": r[7], "created_at": r[8]} for r in rows]

def update_booking_status(booking_id, new_status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('UPDATE bookings SET status = ? WHERE id = ?', (new_status, booking_id))
    conn.commit()
    conn.close()

# NEW: Helper to get single booking for cancellation logic
def get_booking(booking_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,))
    r = cursor.fetchone()
    conn.close()
    if r:
        return {"id": r[0], "name": r[1], "email": r[2], "topic": r[3], "date": r[4], "time": r[5], "duration": r[6], "status": r[7]}
    return None

# NEW: Adds a block to the schedule
def add_block(date, start_time, end_time, reason):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO blocks (date, start_time, end_time, reason) VALUES (?, ?, ?, ?)', (date, start_time, end_time, reason))
    conn.commit()
    conn.close()