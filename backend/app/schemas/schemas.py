from typing import Any, List, Optional
from pydantic import BaseModel

# Auth Schemas
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    handle: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class AuthResponse(BaseModel):
    user: UserResponse
    token: str

# Trip Schemas
class TripCreate(BaseModel):
    title: str
    destination: str
    dates_str: Optional[str] = None
    start_date: Optional[str] = None
    places_summary: Optional[str] = "0 places"
    status: Optional[str] = "upcoming"
    privacy: Optional[str] = "friends"
    photo_url: Optional[str] = "photo-1507525428034-b723cf961d3e"
    collaborators: Optional[List[str]] = []

class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    dates_str: Optional[str] = None
    start_date: Optional[str] = None
    places_summary: Optional[str] = None
    status: Optional[str] = None
    privacy: Optional[str] = None
    photo_url: Optional[str] = None
    collaborators: Optional[List[str]] = None

class TripResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    destination: str
    dates_str: Optional[str] = None
    places_summary: Optional[str] = "0 places"
    status: str
    privacy: str
    photo_url: str
    start_date: Optional[str] = None
    collaborators: List[Any] = []
    created_at: Optional[Any] = None

# Itinerary Schemas
class ItineraryItemCreate(BaseModel):
    name: str
    category: Optional[str] = "Attraction"
    kind: Optional[str] = "attraction"
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    cost: Optional[float] = 0.0
    address: Optional[str] = None
    notes: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    order_index: Optional[int] = 0

class ItineraryDayCreate(BaseModel):
    day_number: int
    date_str: Optional[str] = None
    title: Optional[str] = None
    notes: Optional[str] = None

# Budget & Checklist
class BudgetItemCreate(BaseModel):
    category: str
    amount: float
    currency: Optional[str] = "USD"
    description: str
    paid_by: Optional[str] = None

class ChecklistItemCreate(BaseModel):
    title: str
    is_completed: Optional[bool] = False
    assigned_to: Optional[str] = None
