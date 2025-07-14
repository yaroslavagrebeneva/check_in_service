import requests

token_url = "https://keycloak.univibe.ru/realms/univibe/protocol/openid-connect/token"
client_id = "check-in"
client_secret = "rIkohS0aMembASEOvxEnKjMzwJ4oTCGX"
username = "testuser@gmail.com"
password = "test"

data = {
    'username': username,
    'password': password,
    'client_id': client_id,
    'client_secret': client_secret,
    'grant_type': 'password'
}

auth_response = requests.post(token_url, data=data)

if auth_response.status_code == 200:
    tokens = auth_response.json()
    print("Авторизация успешна!")
    print("Access Token:", tokens.get('access_token'))
    print("Refresh Token:", tokens.get('refresh_token'))
else:
    print("Ошибка авторизации:", auth_response.status_code, auth_response.text)
