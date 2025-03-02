import { NftCard } from "../../components/nfts/nftCard";
import { Stack, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { listNft } from "../../api/nft/listNft";
import { Nft } from "../../types/nft";
import useWalletStore from "../../utils/store";

export default function Home() {
  const [nftData, setNftData] = useState<Nft[] | null>([]);
  const { wallet } = useWalletStore();

  const fetchData = async () => {
    try {
      const nftData = await listNft();
      setNftData(nftData);
      console.log("NFT Data:", nftData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Stack align="center">
      <SimpleGrid cols={6} spacing="xl">
        {nftData ? (
          nftData.length > 0 ? (
            nftData.map((nft, index) => (
              <NftCard key={index} nft={nft} wallet={wallet}/>
            ))
          ) : (
            <Text>Aucune NFT à afficher</Text>
          )
        ) : (
          <Text>Loading...</Text>
        )}
      </SimpleGrid>
    </Stack>
  );
}
