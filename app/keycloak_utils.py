# from keycloak import KeycloakOpenID
# from fastapi import Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer

# keycloak_openid = KeycloakOpenID(
#     server_url="http://localhost:8080/auth/",
#     client_id="your-client-id",
#     realm_name="your-realm",
#     client_secret_key="your-client-secret"
# )

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# def get_token(token: str = Depends(oauth2_scheme)):
#     try:
#         userinfo = keycloak_openid.userinfo(token)
#         return userinfo
#     except Exception as e:
#         raise HTTPException(status_code=401, detail="Invalid token")