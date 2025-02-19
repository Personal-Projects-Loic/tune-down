from sqlalchemy.orm import Session
from . import modelsDB, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(modelsDB.User).filter(modelsDB.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = modelsDB.User(email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
