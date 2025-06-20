from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import router
from .database import engine, Base

app = FastAPI()

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
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database connected and tables created")