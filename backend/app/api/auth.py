import re
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import RedirectResponse
import psycopg
from app.core.security import (
    create_access_token,
    generate_id,
    get_current_user,
    get_password_hash,
    verify_password,
)
from app.db.session import get_db
from app.schemas.schemas import AuthResponse, UserLogin, UserResponse, UserSignup

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, response: Response, db: psycopg.Connection = Depends(get_db)):
    email = payload.email.lower().strip()
    
    with db.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists.",
            )

        user_id = generate_id()
        hashed_pw = get_password_hash(payload.password)
        base_handle = re.sub(r"[^a-zA-Z0-9]", "", payload.name.lower()) or email.split("@")[0]
        handle = f"@{base_handle}"

        cur.execute(
            """
            INSERT INTO users (id, email, hashed_password, name, handle, avatar_url, bio)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, email, name, handle, avatar_url, bio
            """,
            (user_id, email, hashed_pw, payload.name.strip(), handle, "", "Ready to explore the world."),
        )
        user = cur.fetchone()

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=False,  # Set to True in HTTPS production
    )

    user_resp = UserResponse(**user)
    return AuthResponse(user=user_resp, token=token)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, response: Response, db: psycopg.Connection = Depends(get_db)):
    email = payload.email.lower().strip()

    with db.cursor() as cur:
        cur.execute(
            "SELECT id, email, hashed_password, name, handle, avatar_url, bio, is_active FROM users WHERE email = %s",
            (email,),
        )
        user = cur.fetchone()

    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=False,
    )

    user_dict = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "handle": user["handle"],
        "avatar_url": user["avatar_url"],
        "bio": user["bio"],
    }
    return AuthResponse(user=UserResponse(**user_dict), token=token)


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    user_data = {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "handle": current_user["handle"],
        "avatar_url": current_user["avatar_url"],
        "bio": current_user["bio"],
    }
    return {"user": user_data}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out."}


@router.get("/{provider}/login")
def oauth_login(provider: str, response: Response, db: psycopg.Connection = Depends(get_db)):
    """OAuth redirect flow for Google, Apple, Facebook"""
    provider_name = provider.capitalize()
    demo_email = f"{provider.lower()}.user@travelplan.app"

    # Find or create demo social user
    with db.cursor() as cur:
        cur.execute("SELECT id, email, name, handle, avatar_url, bio FROM users WHERE email = %s", (demo_email,))
        user = cur.fetchone()

        if not user:
            user_id = generate_id()
            hashed_pw = get_password_hash("SocialAuthSecretDemo123!")
            handle = f"@{provider.lower()}_traveler"
            cur.execute(
                """
                INSERT INTO users (id, email, hashed_password, name, handle, avatar_url, bio)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, email, name, handle, avatar_url, bio
                """,
                (user_id, demo_email, hashed_pw, f"{provider_name} Traveler", handle, "", "Signed in via OAuth"),
            )
            user = cur.fetchone()

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    redirect_res = RedirectResponse(url="/#/home", status_code=status.HTTP_302_FOUND)
    redirect_res.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=False,
    )
    return redirect_res
