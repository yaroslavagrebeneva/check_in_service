import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SERVER_URL = os.getenv("SERVER_URL")
CLIENT_ID = os.getenv("CLIENT_ID")
REALM_NAME = os.getenv("REALM_NAME")
CLIENT_SECRET_KEY = os.getenv("CLIENT_SECRET_KEY")
