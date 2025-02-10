# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from xrpl.wallet import Wallet
# from xrpl.core.addresscodec import is_valid_classic_address

# app = FastAPI()

# Configuration CORS
# from fastapi.middleware.cors import CORSMiddleware

# origins = [
#     "http://localhost:5173",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class WalletResponse(BaseModel):
#     public_key: str
#     private_key: str

# class WalletRequest(BaseModel):
#     classic_address: str
#     seed: str

# class ValidationResponse(BaseModel):
#     is_valid: bool
#     message: str

# @app.get("/generate-wallet", response_model=WalletResponse)
# def generate_wallet():
#     try:
#         wallet = Wallet.create()
#         return WalletResponse(public_key=wallet.classic_address, private_key=wallet.seed)
#     except Exception as e:
#         print(f"Erreur lors de la génération du wallet : {e}")
#         return {"error": "Erreur lors de la génération du wallet"}


# def is_valid_xrpl_wallet(classic_address: str, seed: str) -> tuple[bool, str]:
#     try:
#         wallet = Wallet.from_seed(seed)
#         if wallet.classic_address != classic_address:
#             return False, "L'adresse publique ne correspond pas à la clé privée fournie."
#         return True, "Le wallet est valide et l'adresse correspond à la clé privée."

#     except Exception as e:
#         return False, f"Erreur de validation du wallet: {str(e)}"

# @app.post("/validate-wallet", response_model=ValidationResponse)
# async def validate_wallet(wallet_request: WalletRequest):
#     try:
#         is_valid, message = is_valid_xrpl_wallet(
#             wallet_request.classic_address,
#             wallet_request.seed
#         )
#         return ValidationResponse(is_valid=is_valid, message=message)

#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
from wallet.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
