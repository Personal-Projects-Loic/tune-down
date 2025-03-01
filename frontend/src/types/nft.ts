export type Product = {
  id: number;
  url: string;
  name: string;
  price: string;
};

export type NFT = {
  id: string;
  uri: string;
  flags: Array<string>;
  taxon: number;
  collection: string;
  onSale: boolean;
  price: string;
  name: string;
  description: string;
  owner: string;
  creator: string;
  royalties: number;
  date: string;
  image: string;
};

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