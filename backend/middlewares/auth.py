from typing import Annotated
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Cookie, HTTPException
from utils.jwt import verify_jwt

bearer_scheme = HTTPBearer(auto_error=False)

async def auth_middleware(
    token: Annotated[HTTPAuthorizationCredentials,
        Depends(bearer_scheme)] = None,
    access_token: str = Cookie(None)
):
    if token and token.credentials:
        decoded_jwt = verify_jwt(token.credentials)
        return decoded_jwt

    elif access_token:
        decoded_jwt = verify_jwt(access_token)
        return decoded_jwt

    # Aucun token trouvé
    raise HTTPException(status_code=401, detail="Non authentifié")
