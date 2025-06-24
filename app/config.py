from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    server_url: str = Field(..., env="SERVER_URL")
    client_id: str = Field(..., env="CLIENT_ID")
    realm_name: str = Field(..., env="REALM_NAME")
    client_secret_key: str = Field(..., env="CLIENT_SECRET_KEY")
    db_uri: str = Field(..., env="DATABASE_URL")

config = Config()

if __name__ == "__main__":
    print(".env успешно загружен!")
    print("DATABASE_URL =", config.db_uri)