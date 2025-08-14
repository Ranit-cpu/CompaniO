# app/db.py
from sqlmodel import Session, create_engine
from .config import DB_FILE

# Create engine
engine = create_engine(f"sqlite:///{DB_FILE}", echo=False)

# Dependency
def get_session():
    with Session(engine) as session:
        yield session
