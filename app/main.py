from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from app.database.database import init_db
# from app.routes.routes import router
from app.tests.test_reason_repo_router import router

app = FastAPI(
    title="Check-In API",
    description="API for managing user attendance, reasons, and related data.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(router)

@app.on_event("startup")
async def on_startup():
    """Initialize the database on application startup."""
    try:
        await init_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")


@app.get("/")
async def read_root():
    """Return a welcome message for the root endpoint (requires authentication)."""
    return {"message": "Hello World!!!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app",  port=8001, reload=True)
