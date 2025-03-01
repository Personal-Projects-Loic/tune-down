import pikapute from "../../assets/pikapute.png";
import { NewCard } from "../../components/nfts/nftCard";
import { Product } from "../../types/nft";
import { Stack, SimpleGrid, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { listNft } from "../../api/wallet/listNft";
import { Nft } from "../../types/nft";

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
  const [nftData, setNftData] = useState<Nft[] | null>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const nftData = await listNft();
        setNftData(nftData);
        console.log("NFT Data:", nftData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Stack align="center">
      <SimpleGrid cols={6} spacing="xl">
        {nftData?.map((product, index) => (
          <div key={index}>
            <Image src={product.nft_infos.uri} alt={product.nft_infos.id} fit="contain" />
          </div>
        ))}
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