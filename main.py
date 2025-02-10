from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from xrpl.wallet import Wallet

app = FastAPI()

# Configuration CORS
origins = [
    "http://localhost:5173",  # Remplacez par l'URL de votre application React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class WalletResponse(BaseModel):
    public_key: str
    private_key: str

@app.get("/generate-wallet", response_model=WalletResponse)
def generate_wallet():
    try:
        wallet = Wallet.create()
        return WalletResponse(public_key=wallet.classic_address, private_key=wallet.seed)
    except Exception as e:
        print(f"Erreur lors de la génération du wallet : {e}")
        return {"error": "Erreur lors de la génération du wallet"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
