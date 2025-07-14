from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from keycloak import KeycloakOpenID
from app.settings.config import *
import asyncio

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{SERVER_URL}realms/{REALM_NAME}/protocol/openid-connect/auth",
    tokenUrl=f"{SERVER_URL}realms/{REALM_NAME}/protocol/openid-connect/token",
)

keycloak_openid = KeycloakOpenID(
    server_url=SERVER_URL,
    client_id=CLIENT_ID,
    realm_name=REALM_NAME,
    client_secret_key=CLIENT_SECRET_KEY,
    verify=True,
)


# async def get_current_user(
#     token: str = Depends(oauth2_scheme)
# ):
#     try:
#         token_info = await keycloak_openid.a_introspect(token)
#         if not token_info.get("active"):
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
#             )
#         print("Get_current_user success")
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    

async def get_current_user(token: str = Depends(oauth2_scheme)):
    loop = asyncio.get_event_loop()
    try:
        token_info = await loop.run_in_executor(None, keycloak_openid.introspect, token)

        if not token_info.get("active"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        print("Get_current_user success")
        return token_info  # ← возможно, тебе нужно возвращать его

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
