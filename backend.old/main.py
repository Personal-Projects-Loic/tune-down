from fastapi import FastAPI
from wallet.routes import router
from fastapi.middleware.cors import CORSMiddleware
from Database.database import Base, engine
from contextlib import asynccontextmanager

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(router)

@asynccontextmanager
async def lifespan(api: FastAPI):
    await init_db()
    yield

app.router.lifespan_context = lifespan

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            workers=1,
            loop="asyncio"
    )
