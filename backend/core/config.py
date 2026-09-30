import os
import secrets
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent

try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except ImportError:
    pass

class Settings(BaseModel):
    APP_NAME: str = "National Digital Platform for Land Governance (SIH26019)"
    VERSION: str = "1.0.0"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "b9c4c7980302c3fb66810a9f5d346ff16e7bb4ff11ad676ecdb3faebc6cbb412")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", str(BASE_DIR / "data" / "land_governance.db"))
    STORAGE_DIR: str = str(BASE_DIR / "data" / "storage")
    DEMO_MODE: bool = os.getenv("DEMO_DATA_MODE", "true").lower() == "true"
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:8000,http://127.0.0.1:8000,https://landgov.gov.in"
    ).split(",")

settings = Settings()

if not settings.SECRET_KEY:
    settings.SECRET_KEY = secrets.token_hex(32)

if not Path(settings.DATABASE_PATH).is_absolute():
    settings.DATABASE_PATH = str((BASE_DIR / settings.DATABASE_PATH).resolve())

Path(settings.STORAGE_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.DATABASE_PATH).parent.mkdir(parents=True, exist_ok=True)
