export type Product = {
  id: number;
  url: string;
  name: string;
  price: string;
};

export type Nft_infos = {
  id: string;
  issuer: string;
  owner: string;
  uri: string;
  flags: number;
  transfer_fee: number;
  taxon: number;
};

export type Nft = {
  nft_infos: Nft_infos;
  price: number | null;
  user : {
    username: string;
  }
}

export type newNFT = {
  name: string;
  description: string;
  price: number;
  image: File | null;
  //quantity: number;
  //royalties: number;
  //taxon: number;
  collection: string;
};