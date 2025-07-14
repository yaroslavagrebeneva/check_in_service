from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from .database.database import init_db
from .crud.endpoints import router

app = FastAPI(
    title="Check-In API",
    description="API for managing user attendance, reasons, and related data.",
    version="1.0.0"
)
# Настройка CORS
origins = [
    "http://localhost:5173",  # Фронтенд (Vite по умолчанию)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешенные источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

app.include_router(router)


@app.on_event("startup")
async def on_startup():
    """Initialize the database on application startup."""
    try:
        await init_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")

# Protected root endpoint
# @app.get("/", dependencies=[Depends(get_token)])


@app.get("/")
async def read_root():
    """Return a welcome message for the root endpoint (requires authentication)."""
    return {"message": "Hello World!!!"}

# Main execution block
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
