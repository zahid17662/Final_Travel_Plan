import uuid
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    handle = Column(String(50), unique=True, index=True, nullable=True)
    avatar_url = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trips = relationship("Trip", back_populates="owner", cascade="all, delete-orphan")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    destination = Column(String(150), nullable=False)
    dates_str = Column(String(100), nullable=True)
    places_summary = Column(String(100), default="0 places")
    status = Column(String(20), default="upcoming")  # upcoming, past, draft
    privacy = Column(String(20), default="friends")   # private, friends, public
    photo_url = Column(Text, default="photo-1507525428034-b723cf961d3e")
    start_date = Column(String(20), nullable=True)
    collaborators = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="trips")
    days = relationship("ItineraryDay", back_populates="trip", cascade="all, delete-orphan", order_by="ItineraryDay.day_number")
    budget_items = relationship("BudgetItem", back_populates="trip", cascade="all, delete-orphan")
    checklist_items = relationship("ChecklistItem", back_populates="trip", cascade="all, delete-orphan")


class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    day_number = Column(Integer, nullable=False)
    date_str = Column(String(30), nullable=True)
    title = Column(String(150), nullable=True)
    notes = Column(Text, nullable=True)

    trip = relationship("Trip", back_populates="days")
    items = relationship("ItineraryItem", back_populates="day", cascade="all, delete-orphan", order_by="ItineraryItem.order_index")


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    day_id = Column(String(36), ForeignKey("itinerary_days.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(50), default="Attraction")
    kind = Column(String(50), default="attraction")
    start_time = Column(String(20), nullable=True)
    end_time = Column(String(20), nullable=True)
    cost = Column(Float, default=0.0)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    order_index = Column(Integer, default=0)

    day = relationship("ItineraryDay", back_populates="items")


class BudgetItem(Base):
    __tablename__ = "budget_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    description = Column(String(200), nullable=False)
    paid_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trip = relationship("Trip", back_populates="budget_items")


class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    is_completed = Column(Boolean, default=False)
    assigned_to = Column(String(100), nullable=True)

    trip = relationship("Trip", back_populates="checklist_items")
