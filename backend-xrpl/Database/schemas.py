from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str

    class Config:
        from_attributes = True # en vrai je sais pas encore à quoi ça sert, mais ça permet de créer des instances à partir des données de la base de données

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
