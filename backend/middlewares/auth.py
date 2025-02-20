from typing import Annotated
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from utils.jwt import verify_jwt

bearer_scheme = HTTPBearer()


async def auth_middleware(
    token: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)]
):
    decoded_jwt = verify_jwt(token.credentials)

    return decoded_jwt
