import sqlite3
import os
from datetime import datetime, timedelta

# --- PERSISTENCE SETUP ---
# This ensures the DB lives in the persistent volume
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_NAME = os.path.join(DATA_DIR, "carbon.db")

def init_db():
    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA journal_mode=WAL;")
    cursor = conn.cursor()
    
    # 1. Bookings Table
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
            location_details TEXT DEFAULT '',
            google_event_id TEXT 
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

    # 3. Banned IPs Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS banned_ips (
            ip TEXT PRIMARY KEY,
            reason TEXT,
            expires_at TEXT
        )
    ''')

    # --- AUTO-MIGRATION (THE FIX) ---
    # This block runs every time. It tries to add the column. 
    # If the column exists, it ignores the error.
    try:
        cursor.execute("ALTER TABLE bookings ADD COLUMN google_event_id TEXT")
        print("✅ MIGRATION SUCCESS: Added 'google_event_id' column")
    except sqlite3.OperationalError:
        # This error means the column likely already exists, which is fine.
        pass
    # --------------------------------

    conn.commit()
    conn.close()

# --- BOOKING FUNCTIONS ---
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

def get_booking(booking_id):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,))
    r = cursor.fetchone()
    conn.close()
    if r: return dict(r)
    return None

def update_booking_status(booking_id, new_status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('UPDATE bookings SET status = ? WHERE id = ?', (new_status, booking_id))
    conn.commit()
    conn.close()

def get_all_bookings():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings ORDER BY date DESC, time ASC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# --- BLOCKING FUNCTIONS ---
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

# --- SECURITY FUNCTIONS ---

def check_spam_stats(email):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM bookings WHERE email = ? AND status = 'PENDING'", (email,))
    pending_count = cursor.fetchone()[0]
    yesterday = (datetime.now() - timedelta(days=1)).isoformat()
    cursor.execute("SELECT COUNT(*) FROM bookings WHERE email = ? AND status = 'REJECTED' AND created_at > ?", (email, yesterday))
    rejected_count = cursor.fetchone()[0]
    conn.close()
    return {"pending": pending_count, "rejected": rejected_count}

def ban_ip(ip, reason, duration_minutes):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    expires_at = (datetime.now() + timedelta(minutes=duration_minutes)).isoformat()
    cursor.execute('''
        INSERT INTO banned_ips (ip, reason, expires_at) VALUES (?, ?, ?)
        ON CONFLICT(ip) DO UPDATE SET expires_at=excluded.expires_at, reason=excluded.reason
    ''', (ip, reason, expires_at))
    conn.commit()
    conn.close()

def is_ip_banned(ip):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT expires_at FROM banned_ips WHERE ip = ?", (ip,))
    row = cursor.fetchone()
    conn.close()
    if row:
        expires_at = datetime.fromisoformat(row[0])
        if datetime.now() < expires_at:
            return True 
        else:
            unban_ip(ip)
    return False

def unban_ip(ip):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM banned_ips WHERE ip = ?", (ip,))
    conn.commit()
    conn.close()

def wipe_troll_requests(email):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookings WHERE email = ?", (email,))
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted_count

# --- GOOGLE EVENT ID HELPER ---
def update_google_event_id(booking_id, event_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # If this still fails, the migration above didn't run, but it should!
    cursor.execute('UPDATE bookings SET google_event_id = ? WHERE id = ?', (event_id, booking_id))
    conn.commit()
    conn.close()