from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from typing import List

from dotenv import load_dotenv
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings(BaseSettings):
    DATABASE_URL: str

    #jwt
    SECRET_KEY: str 
    ALGORITHM: str   
    ACCESS_TOKEN_EXPIRE_MINUTES: int   
    ONESIGNAL_APP_ID: str
    ONESIGNAL_API_KEY: str
    CURRENCY_API: str

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()





