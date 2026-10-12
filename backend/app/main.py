from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.trips import router as trips_router
from app.core.config import CORS_ORIGINS

app = FastAPI(
    title="Travel Plan API",
    description="FastAPI Backend for Travel Plan with Neon PostgreSQL",
    version="1.0.0",
)

# Configure CORS for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router)
app.include_router(trips_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Travel Plan API",
        "database": "Neon PostgreSQL",
        "docs": "/docs",
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy"}
