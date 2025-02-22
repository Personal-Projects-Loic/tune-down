from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.database import engine, Base
from routers.main import main_router as router
from fastapi.exception_handlers import RequestValidationError
from fastapi.responses import JSONResponse

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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Customize the error response
    errors = []
    for error in exc.errors():
        error_details = {
            "field": error["loc"][-1],
            "message": error["msg"],
        }
        errors.append(error_details)

    print(errors)
    return JSONResponse(
        status_code=400,
        content={"detail": errors}
    )

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
