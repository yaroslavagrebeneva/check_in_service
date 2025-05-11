from litestar import Litestar
from litestar.config.cors import CORSConfig
from backend.routes import attendance, root, dean
from backend.database import init_db

# Настройка CORS
cors_config = CORSConfig(
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем экземпляр приложения
app = Litestar(
    route_handlers=[
        root.router,
        attendance.router,
        dean.router,
    ],
    cors_config=cors_config,
    on_startup=[init_db],
)

# Для запуска через uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Удаляем старые маршруты FastAPI
# @app.get("/")
# async def read_root():
#     return {"message": "Welcome to the API"}

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}