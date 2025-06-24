from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from keycloak import KeycloakOpenID
from .config import config

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{config.server_url}realms/{config.realm_name}/protocol/openid-connect/auth",
    tokenUrl=f"{config.server_url}realms/{config.realm_name}/protocol/openid-connect/token",
)
keycloak_openid = KeycloakOpenID(
    server_url=config.server_url,
    client_id=config.client_id,
    realm_name=config.realm_name,
    client_secret_key=config.client_secret_key,
    verify=True,
)

async def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        token_info = await keycloak_openid.a_introspect(token)
        if not token_info.get("active"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        print("Get_current_user success")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))