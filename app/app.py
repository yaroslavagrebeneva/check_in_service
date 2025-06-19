"""Main FastAPI application for the check-in system."""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from .database import init_db
from .endpoints import router
# from .keycloak_utils import get_token

app = FastAPI(
    title="Check-In API",
    description="API for managing user attendance, reasons, and related data.",
    version="1.0.0"
)

# CORS configuration to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router for API endpoints
app.include_router(router)

# Database initialization on startup
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
    return {"message": "Hello World (Protected)"}

# Main execution block
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)