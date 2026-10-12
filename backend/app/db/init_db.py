import psycopg
from app.core.config import DATABASE_URL

# Raw connection string for psycopg (strip +psycopg if present)
CONN_STR = DATABASE_URL.replace("postgresql+psycopg://", "postgresql://")

SCHEMA_SQL = """
-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    handle VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    dates_str VARCHAR(100),
    places_summary VARCHAR(100) DEFAULT '0 places',
    status VARCHAR(20) DEFAULT 'upcoming',
    privacy VARCHAR(20) DEFAULT 'friends',
    photo_url TEXT DEFAULT 'photo-1507525428034-b723cf961d3e',
    start_date VARCHAR(20),
    collaborators JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Itinerary Days Table
CREATE TABLE IF NOT EXISTS itinerary_days (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    date_str VARCHAR(30),
    title VARCHAR(150),
    notes TEXT,
    UNIQUE (trip_id, day_number)
);

-- 4. Itinerary Items (Activities/Places) Table
CREATE TABLE IF NOT EXISTS itinerary_items (
    id VARCHAR(36) PRIMARY KEY,
    day_id VARCHAR(36) NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Attraction',
    kind VARCHAR(50) DEFAULT 'attraction',
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    cost NUMERIC(10, 2) DEFAULT 0.00,
    address TEXT,
    notes TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    order_index INT NOT NULL DEFAULT 0
);

-- 5. Budget Items Table
CREATE TABLE IF NOT EXISTS budget_items (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description VARCHAR(200) NOT NULL,
    paid_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Checklist Items Table
CREATE TABLE IF NOT EXISTS checklist_items (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    assigned_to VARCHAR(100)
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trips_owner ON trips(owner_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day ON itinerary_items(day_id);
CREATE INDEX IF NOT EXISTS idx_budget_trip ON budget_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_checklist_trip ON checklist_items(trip_id);
"""

def init_db():
    print("Connecting to Neon PostgreSQL...")
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            cur.execute(SCHEMA_SQL)
            conn.commit()
    print("Database tables & indexes successfully created on Neon PostgreSQL!")

if __name__ == "__main__":
    init_db()
