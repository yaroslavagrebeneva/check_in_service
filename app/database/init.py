from .database import engine, Base
from ..models.models import *

def init_db():
    Base.metadata.create_all(bind=engine)
