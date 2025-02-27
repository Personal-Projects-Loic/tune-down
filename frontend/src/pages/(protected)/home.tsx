import pikapute from "../../assets/pikapute.png";
import { NewCard } from "../../components/nfts/nftCard";
import { Product } from "../../types/nft";
import { Stack, SimpleGrid } from "@mantine/core";

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
    <Stack align="center">
      <SimpleGrid cols={6} spacing="xl">
      {nftList.map((product, index) => (
        <div>
          <NewCard
            key={index}
            id={product.id}
            url={product.url}
            name={product.name}
            price={product.price}
          />
        </div>
          
        ))}
      </SimpleGrid>
    </Stack>
  )
}