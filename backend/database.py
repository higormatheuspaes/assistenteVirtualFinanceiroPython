import sqlite3

def get_db():
    conn = sqlite3.connect("db.sqlite", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
    
    conn.commit()
    conn.close()