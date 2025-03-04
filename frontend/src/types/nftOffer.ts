export type NftOffer = {
  account: string;
  nft_id: string;
  price: number;
  is_sell_offer: boolean;
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