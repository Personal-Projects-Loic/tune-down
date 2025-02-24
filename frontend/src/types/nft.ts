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