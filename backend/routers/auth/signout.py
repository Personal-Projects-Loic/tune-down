from fastapi import APIRouter, HTTPException, Response, status, Cookie
from utils.jwt import verify_jwt

router = APIRouter()


@router.post("/signout")
async def signout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("is_authenticated")
    return {"message": "Logout successful"}


async def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    user = verify_jwt(access_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return user
