import sqlite3
from datetime import datetime

DB_NAME = "carbon.db"

def init_db():
    """Create the table if it doesn't exist."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            topic TEXT NOT NULL,
            time TEXT NOT NULL,
            status TEXT DEFAULT 'PENDING',
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("[DATABASE] System initialized. Memory banks active.")

def add_booking(name, email, topic, time):
    """Save a new booking packet."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO bookings (name, email, topic, time, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, email, topic, time, created_at))
    
    conn.commit()
    conn.close()

def get_all_bookings():
    """Retrieve all logs."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    # Convert raw data to nice dictionaries
    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "topic": row[3],
            "time": row[4],
            "status": row[5],
            "created_at": row[6]
        })
    return results