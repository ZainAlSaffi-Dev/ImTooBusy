import sqlite3
import database

def unban_myself():
    print("🚑 ATTEMPTING RESCUE...")
    
    # 1. Connect to DB
    conn = sqlite3.connect("carbon.db")
    cursor = conn.cursor()
    
    # 2. Delete localhost IP
    cursor.execute("DELETE FROM banned_ips WHERE ip = '127.0.0.1'")
    
    if cursor.rowcount > 0:
        print("✅ SUCCESS: '127.0.0.1' has been removed from the blacklist.")
    else:
        print("ℹ️ INFO: You were not banned.")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    unban_myself()