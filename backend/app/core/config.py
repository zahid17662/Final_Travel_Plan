import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://neondb_owner:npg_X9Ef7GHbKknw@ep-rapid-darkness-az3rwc1t-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)
SECRET_KEY = os.getenv("SECRET_KEY", "travelplan_super_secret_jwt_key_98234710928374")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:8443,http://localhost:5173,http://localhost:3000").split(",")
    if origin.strip()
]
