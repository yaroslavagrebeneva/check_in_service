from litestar import Router, get
from typing import Dict

@get("/")
async def read_root() -> Dict[str, str]:
    return {"message": "Welcome to the API"}

@get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "healthy"}

router = Router(path="", route_handlers=[read_root, health_check]) 