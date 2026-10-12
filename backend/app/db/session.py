from contextlib import contextmanager
from typing import Generator
import psycopg
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool
from app.core.config import DATABASE_URL

CONN_STR = DATABASE_URL.replace("postgresql+psycopg://", "postgresql://")

# Create connection pool for Neon
pool = ConnectionPool(
    CONN_STR,
    min_size=1,
    max_size=10,
    timeout=30.0,
    max_idle=300.0,
    kwargs={"row_factory": dict_row, "autocommit": False},
)

def get_db() -> Generator[psycopg.Connection, None, None]:
    with pool.connection() as conn:
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
