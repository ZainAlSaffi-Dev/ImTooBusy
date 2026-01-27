import sqlite3
from datetime import datetime

DB_NAME = "carbon.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # 1. Bookings Table (Updated with location columns)
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
            created_at TEXT,
            location_type TEXT DEFAULT 'ONLINE',
            location_details TEXT DEFAULT ''
        )
    ''')
    
    # 2. Blocked Time
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

# UPDATE: Added location_type and location_details
def add_booking(name, email, topic, date, time, duration, location_type, location_details):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO bookings 
        (name, email, topic, date, time, duration, location_type, location_details, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (name, email, topic, date, time, duration, location_type, location_details, created_at))
    
    conn.commit()
    conn.close()

def get_bookings_for_range(start_date, end_date):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT date, time, duration FROM bookings WHERE date >= ? AND date <= ? AND status NOT IN ('REJECTED', 'CANCELLED')", (start_date, end_date))
    rows = cursor.fetchall()
    conn.close()
    return [{"date": r[0], "time": r[1], "duration": r[2]} for r in rows]

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

# UPDATE: Now fetches location info for the dashboard
def get_all_bookings():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # This allows us to access columns by name (safer)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings ORDER BY date DESC, time ASC')
    rows = cursor.fetchall()
    conn.close()
    
    # Convert Row objects to dicts
    return [dict(row) for row in rows]

def update_booking_status(booking_id, new_status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('UPDATE bookings SET status = ? WHERE id = ?', (new_status, booking_id))
    conn.commit()
    conn.close()

# UPDATE: Now fetches location info for emails
def get_booking(booking_id):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Access by column name
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,))
    r = cursor.fetchone()
    conn.close()
    if r:
        return dict(r)
    return None

def add_block(date, start_time, end_time, reason):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO blocks (date, start_time, end_time, reason) VALUES (?, ?, ?, ?)', (date, start_time, end_time, reason))
    conn.commit()
    conn.close()

def get_all_blocks():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM blocks ORDER BY date DESC, start_time ASC')
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "date": r[1], "start_time": r[2], "end_time": r[3], "reason": r[4]} for r in rows]

def delete_block(block_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM blocks WHERE id = ?', (block_id,))
    conn.commit()
    conn.close()