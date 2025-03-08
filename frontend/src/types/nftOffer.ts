export type NftOffer = {
  account: string;
  nft_id: string;
  price: number;
  is_sell_offer: boolean;
  offer_id: string;
};

export type buyOffer = {
  nft_id: string;
  price: number;
  wallet_private_key: string;
  nft_owner: string;
}

export type newNftOffer = {
  nft_id: string;
  price: number;
  wallet_private_key: string;
};


export type newOfferModal = {
  price: number;
  privateKey: string;
}

export type AcceptOfferRequest = {
  nft_id: string;
  private_key: string;
  sell_offer_id?: string;
  buy_offer_id?: string;
};

export type AcceptOfferResponse = {
  success: boolean;
};