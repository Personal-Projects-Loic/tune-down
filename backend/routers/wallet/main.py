from fastapi import APIRouter, Depends

from middlewares.auth import auth_middleware
from routers.wallet.add_wallet import router as add_wallet_router
from routers.wallet.get_wallet import router as get_wallet_router
from routers.wallet.add_nft import router as add_nft_router
from routers.wallet.get_nft import router as get_nft_router
from routers.wallet.list_nfts import router as list_nfts_router
from routers.wallet.delete_wallet import router as delete_wallet_router
from routers.wallet.create_nft_sell_offer import (
    router as create_nft_sell_offer_router
)
from routers.wallet.create_nft_buy_offer import (
    router as create_nft_buy_offer_router
)
from routers.wallet.get_nft_sell_offers import (
    router as get_nft_sell_offers_router
)


router = APIRouter(
    dependencies=[Depends(auth_middleware)]
)

router.include_router(add_wallet_router)
router.include_router(get_wallet_router)
router.include_router(add_nft_router)
router.include_router(list_nfts_router)
router.include_router(get_nft_router)
router.include_router(delete_wallet_router)
router.include_router(create_nft_sell_offer_router)
router.include_router(create_nft_buy_offer_router)
router.include_router(get_nft_sell_offers_router)
