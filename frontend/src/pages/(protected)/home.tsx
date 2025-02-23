import pikapute from "../../assets/pikapute.png";
import Card from "../../components/nfts/nftCard";
import { Product } from "../../types/nft";
import Layout from "../../components/layout";

const generateProducts = (length: number): Product[] => {
  return Array.from({ length }, (_, i) => ({
    id: i,
    url: pikapute,
    name: `Product ${i + 1}`,
    price: `$${(Math.random() * 100).toFixed(2)}`
  }));
};


export default function NewHome() {
  const nftList = generateProducts(10);
  return (
    <Layout>
      <div>
        <p>Home page</p>
        <div>
          {nftList.map((product, index) => (
            <Card
              key={index}
              id={product.id}
              url={product.url}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}