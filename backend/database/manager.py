import sqlite3
import os
from pathlib import Path
from contextlib import contextmanager
from typing import Generator, Any, Dict, List, Optional
import json

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    psycopg2 = None

DEFAULT_DB = str(Path(__file__).resolve().parent.parent.parent / "data" / "land_governance.db")
DB_FILE = os.getenv("DATABASE_PATH", DEFAULT_DB)
DB_TYPE = os.getenv("DB_TYPE", "sqlite") # sqlite or postgres
POSTGRES_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db")
SCHEMA_FILE = str(Path(__file__).resolve().parent / "schema.sql")

class DatabaseManager:
    def __init__(self, db_path: str = DB_FILE):
        self.db_path = db_path
        self._ensure_initialized()

    def get_connection(self):
        if DB_TYPE == "postgres":
            if not psycopg2:
                raise RuntimeError("psycopg2 is required for PostgreSQL. Please install it.")
            return psycopg2.connect(POSTGRES_URL, cursor_factory=RealDictCursor)
        else:
            conn = sqlite3.connect(self.db_path, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON;")
            return conn

    @contextmanager
    def session(self) -> Generator[Any, None, None]:
        conn = self.get_connection()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def _ensure_initialized(self):
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        with self.session() as conn:
            if os.path.exists(SCHEMA_FILE):
                with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
                    schema_sql = f.read()
                conn.executescript(schema_sql)

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        with self.session() as conn:
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def execute_one(self, query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        with self.session() as conn:
            cursor = conn.execute(query, params)
            row = cursor.fetchone()
            return dict(row) if row else None

    def execute_insert(self, query: str, params: tuple = ()) -> int:
        with self.session() as conn:
            cursor = conn.execute(query, params)
            return cursor.lastrowid

    def execute_update(self, query: str, params: tuple = ()) -> int:
        with self.session() as conn:
            cursor = conn.execute(query, params)
            return cursor.rowcount

db_manager = DatabaseManager()
