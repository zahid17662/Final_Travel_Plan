import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
import psycopg
from app.core.security import generate_id, get_current_user
from app.db.session import get_db
from app.schemas.schemas import (
    BudgetItemCreate,
    ChecklistItemCreate,
    ItineraryDayCreate,
    ItineraryItemCreate,
    TripCreate,
    TripResponse,
    TripUpdate,
)

router = APIRouter(prefix="/api", tags=["Trips & Itinerary"])

@router.get("/trips", response_model=List[TripResponse])
def get_user_trips(current_user: dict = Depends(get_current_user), db: psycopg.Connection = Depends(get_db)):
    user_id = current_user["id"]
    with db.cursor() as cur:
        cur.execute(
            """
            SELECT id, owner_id, title, destination, dates_str, places_summary, status, privacy, photo_url, start_date, collaborators, created_at
            FROM trips
            WHERE owner_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,),
        )
        trips = cur.fetchall()

        # If user has no trips yet, seed default welcome trips
        if not trips:
            seed_trips = [
                {
                    "title": "Trip to London",
                    "destination": "London, United Kingdom",
                    "dates_str": "Nov 2 – 7",
                    "start_date": "2026-11-02",
                    "places_summary": "4 places",
                    "photo_url": "photo-1549483249-f0b359d1e289",
                    "status": "upcoming",
                    "collaborators": [current_user["name"], "Jon", "Ana", "Theo"],
                },
                {
                    "title": "Kyoto in Spring",
                    "destination": "Kyoto, Japan",
                    "dates_str": "Mar 28 – Apr 4",
                    "start_date": "2027-03-28",
                    "places_summary": "9 places",
                    "photo_url": "photo-1493976040374-85c8e12f0c0e",
                    "status": "upcoming",
                    "collaborators": [current_user["name"], "Aiko"],
                },
                {
                    "title": "Paris Weekend",
                    "destination": "Paris, France",
                    "dates_str": "Sep 26 – 30",
                    "start_date": "2026-09-26",
                    "places_summary": "13 places",
                    "photo_url": "photo-1585944285854-d06c019aaca3",
                    "status": "past",
                    "collaborators": [current_user["name"]],
                },
            ]
            for st in seed_trips:
                tid = generate_id()
                cur.execute(
                    """
                    INSERT INTO trips (id, owner_id, title, destination, dates_str, places_summary, status, privacy, photo_url, start_date, collaborators)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        tid,
                        user_id,
                        st["title"],
                        st["destination"],
                        st["dates_str"],
                        st["places_summary"],
                        st["status"],
                        "friends",
                        st["photo_url"],
                        st["start_date"],
                        json.dumps(st["collaborators"]),
                    ),
                )
            cur.execute(
                """
                SELECT id, owner_id, title, destination, dates_str, places_summary, status, privacy, photo_url, start_date, collaborators, created_at
                FROM trips
                WHERE owner_id = %s
                ORDER BY created_at DESC
                """,
                (user_id,),
            )
            trips = cur.fetchall()

    result = []
    for t in trips:
        t_dict = dict(t)
        if isinstance(t_dict["collaborators"], str):
            t_dict["collaborators"] = json.loads(t_dict["collaborators"])
        result.append(TripResponse(**t_dict))
    return result


@router.post("/trips", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(payload: TripCreate, current_user: dict = Depends(get_current_user), db: psycopg.Connection = Depends(get_db)):
    user_id = current_user["id"]
    trip_id = generate_id()
    collaborators = payload.collaborators or [current_user["name"]]

    with db.cursor() as cur:
        cur.execute(
            """
            INSERT INTO trips (id, owner_id, title, destination, dates_str, places_summary, status, privacy, photo_url, start_date, collaborators)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, owner_id, title, destination, dates_str, places_summary, status, privacy, photo_url, start_date, collaborators, created_at
            """,
            (
                trip_id,
                user_id,
                payload.title,
                payload.destination,
                payload.dates_str,
                payload.places_summary or "0 places",
                payload.status or "upcoming",
                payload.privacy or "friends",
                payload.photo_url or "photo-1507525428034-b723cf961d3e",
                payload.start_date,
                json.dumps(collaborators),
            ),
        )
        trip = cur.fetchone()

        # Seed initial Day 1
        day_id = generate_id()
        cur.execute(
            """
            INSERT INTO itinerary_days (id, trip_id, day_number, title, notes)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (day_id, trip_id, 1, "Day 1 - Arrival & Exploring", "Welcome to your trip!"),
        )

    t_dict = dict(trip)
    if isinstance(t_dict["collaborators"], str):
        t_dict["collaborators"] = json.loads(t_dict["collaborators"])
    return TripResponse(**t_dict)


@router.get("/trips/{trip_id}")
def get_trip_detail(trip_id: str, current_user: dict = Depends(get_current_user), db: psycopg.Connection = Depends(get_db)):
    with db.cursor() as cur:
        cur.execute("SELECT * FROM trips WHERE id = %s", (trip_id,))
        trip = cur.fetchone()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found.")

        # Get days
        cur.execute("SELECT * FROM itinerary_days WHERE trip_id = %s ORDER BY day_number ASC", (trip_id,))
        days = cur.fetchall()

        # Get all items
        day_ids = [d["id"] for d in days]
        items_by_day = {}
        if day_ids:
            cur.execute(
                "SELECT * FROM itinerary_items WHERE day_id = ANY(%s) ORDER BY order_index ASC",
                (day_ids,),
            )
            for it in cur.fetchall():
                items_by_day.setdefault(it["day_id"], []).append(dict(it))

        # Get budget
        cur.execute("SELECT * FROM budget_items WHERE trip_id = %s ORDER BY created_at DESC", (trip_id,))
        budget = [dict(b) for b in cur.fetchall()]

        # Get checklist
        cur.execute("SELECT * FROM checklist_items WHERE trip_id = %s", (trip_id,))
        checklist = [dict(c) for c in cur.fetchall()]

    trip_dict = dict(trip)
    if isinstance(trip_dict["collaborators"], str):
        trip_dict["collaborators"] = json.loads(trip_dict["collaborators"])

    days_list = []
    for d in days:
        d_dict = dict(d)
        d_dict["items"] = items_by_day.get(d["id"], [])
        days_list.append(d_dict)

    trip_dict["days"] = days_list
    trip_dict["budget"] = budget
    trip_dict["checklist"] = checklist
    return trip_dict


@router.delete("/trips/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(trip_id: str, current_user: dict = Depends(get_current_user), db: psycopg.Connection = Depends(get_db)):
    with db.cursor() as cur:
        cur.execute("DELETE FROM trips WHERE id = %s AND owner_id = %s", (trip_id, current_user["id"]))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Trip not found or unauthorized.")
    return None
