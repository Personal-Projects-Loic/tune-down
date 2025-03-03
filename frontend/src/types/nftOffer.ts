export type NftOffer = {
  account: string;
  nft_id: string;
  price: number;
  is_sell_offer: boolean;
};

export type buyOffer = {
  nftId: string;
  price: number;
  walletPrivateKey: string;
  nftOwner: string;
}

export type newNftOffer = {
  nft_id: string;
  price: number;
  walletPrivateKey: string;
};
